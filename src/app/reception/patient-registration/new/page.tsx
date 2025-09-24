'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, FileText, Plus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface FormData {
  // Step 1 - Enrollment Details
  date: string;
  hospital_name: string;
  doctor_name: string;
  pre: string;
  firstname: string;
  age: string;
  age_type: string;
  gender: string;
  petient_type: string;
  p_uni_submit: string;
  p_uni_id_name: string;
  address: string;
  city: string;
  contact_number: string;
  
  // Step 2 - Scan Options
  type_of_scan: string[];
  appoint_date: string;
  time: string;
  time_in: string;
  amount: string;
  est_time: string;
  
  // Step 3 - Payment Details
  total_amount: string;
  rec_amount: string;
  dis_amount: string;
  due_amount: string;
}

interface Hospital {
  h_id: number;
  h_name: string;
}

interface Doctor {
  d_id: number;
  dname: string;
}

interface Scan {
  s_id: number;
  s_name: string;
  charges: number;
  estimate_time: string;
}

export default function NewPatientRegistration() {
  const toast = useToastContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPatientId, setEditPatientId] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedScans, setSelectedScans] = useState<Scan[]>([]);
  const [showUniId, setShowUniId] = useState(false);
  const [scanSearchTerm, setScanSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toLocaleDateString('en-GB'),
    hospital_name: '',
    doctor_name: '',
    pre: 'Mr.',
    firstname: '',
    age: '',
    age_type: 'Year',
    gender: 'Male',
    petient_type: 'GEN / Paid',
    p_uni_submit: 'N',
    p_uni_id_name: '',
    address: '',
    city: '',
    contact_number: '',
    type_of_scan: [],
    appoint_date: new Date().toLocaleDateString('en-GB'),
    time: '',
    time_in: '',
    amount: '0',
    est_time: '0',
    total_amount: '0',
    rec_amount: '0',
    dis_amount: '0',
    due_amount: '0'
  });

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
    fetchScans();
    
    // Check for edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      setIsEditMode(true);
      setEditPatientId(editId);
      fetchPatientData(editId);
    }
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch('/api/hospitals');
      if (response.ok) {
        const data = await response.json();
        setHospitals(data || []);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchScans = async () => {
    try {
      const response = await fetch('/api/scans');
      if (response.ok) {
        const data = await response.json();
        setScans(data || []);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  const fetchPatientData = async (patientId: string) => {
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        const patient = data.data;
        
        // Populate form with patient data
        setFormData({
          ...formData,
          hospital_name: patient.hospital_id?.toString() || '',
          doctor_name: patient.doctor_name?.toString() || '',
          pre: patient.pre || 'Mr.',
          firstname: patient.patient_name || '',
          age: patient.age || '',
          age_type: patient.age_type || 'Year',
          gender: patient.gender || 'Male',
          petient_type: patient.category || 'GEN / Paid',
          address: patient.address || '',
          city: patient.city || '',
          contact_number: patient.contact_number || '',
          type_of_scan: patient.scan_type ? patient.scan_type.split(',') : [],
          amount: patient.amount?.toString() || '0',
          total_amount: patient.amount?.toString() || '0',
          rec_amount: patient.amount_reci?.toString() || '0',
          due_amount: patient.amount_due?.toString() || '0'
        });
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle category change for ID requirement
    if (name === 'petient_type') {
      const freeCategories = ['IPD FREE', 'OPD FREE', 'RTA', 'RGHS', 'Chiranjeevi', 'Destitute', 'PRISONER', 'Sn. CITIZEN', 'Aayushmaan'];
      setShowUniId(freeCategories.includes(value));
    }
  };

  const handleScanChange = (scanId: string, checked: boolean) => {
    let newSelectedScans = [...formData.type_of_scan];
    
    if (checked) {
      newSelectedScans.push(scanId);
    } else {
      newSelectedScans = newSelectedScans.filter(id => id !== scanId);
    }
    
    setFormData(prev => ({ ...prev, type_of_scan: newSelectedScans }));
    
    // Calculate totals
    const selected = scans.filter(scan => newSelectedScans.includes(scan.s_id.toString()));
    setSelectedScans(selected);
    
    const totalAmount = selected.reduce((sum, scan) => sum + scan.charges, 0);
    const totalTime = selected.reduce((sum, scan) => sum + parseInt(scan.estimate_time || '0'), 0);
    
    setFormData(prev => ({
      ...prev,
      amount: totalAmount.toString(),
      est_time: totalTime.toString(),
      total_amount: totalAmount.toString(),
      due_amount: totalAmount.toString()
    }));
  };

  const calculatePayment = () => {
    const total = parseFloat(formData.total_amount) || 0;
    const received = parseFloat(formData.rec_amount) || 0;
    const discount = parseFloat(formData.dis_amount) || 0;
    const due = total - received - discount;
    
    setFormData(prev => ({ ...prev, due_amount: due.toString() }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.hospital_name || !formData.doctor_name || !formData.firstname) {
        toast.error('Please fill all required fields in Step 1');
        return false;
      }
    }
    if (step === 2) {
      if (formData.type_of_scan.length === 0) {
        toast.error('Please select at least one scan type');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (action: string) => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, action })
      });
      
      if (response.ok) {
        toast.error(`Patient ${action === 'Save_Print' ? 'saved and printed' : 'saved'} successfully!`);
        // Reset form or redirect
      }
    } catch (error) {
      toast.error('Error saving patient');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{isEditMode ? 'Edit Patient Registration' : 'New Patient Registration'}</h1>
        <p className="text-blue-100 text-lg">{isEditMode ? 'Update patient information and scan details' : 'Complete patient enrollment and scan booking'}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Step Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                currentStep === 1 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentStep(1)}
            >
              1. Enrollment Detail
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                currentStep === 2 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentStep(2)}
            >
              2. Scan Options
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                currentStep === 3 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentStep(3)}
            >
              3. Payment Details
            </button>
          </nav>
        </div>

        <form className="p-6">
          {/* Step 1: Enrollment Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name <span className="text-red-500">*</span></label>
                  <select
                    name="hospital_name"
                    value={formData.hospital_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Hospital</option>
                    {hospitals.map(hospital => (
                      <option key={hospital.h_id} value={hospital.h_id}>{hospital.h_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name <span className="text-red-500">*</span></label>
                  <select
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.d_id} value={doctor.d_id}>{doctor.dname}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name <span className="text-red-500">*</span></label>
                  <select
                    name="pre"
                    value={formData.pre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Master">Master</option>
                    <option value="Miss">Miss</option>
                    <option value="Baby">Baby</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please enter your First name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">In (Year/Month/Days)</label>
                  <select
                    name="age_type"
                    value={formData.age_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Year">Year</option>
                    <option value="Month">Month</option>
                    <option value="Days">Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="petient_type"
                    value={formData.petient_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GEN / Paid">GEN / Paid</option>
                    <option value="IPD FREE">IPD Free</option>
                    <option value="OPD FREE">OPD Free</option>
                    <option value="RTA">RTA</option>
                    <option value="RGHS">RGHS</option>
                    <option value="Chiranjeevi">Chiranjeevi</option>
                    <option value="Destitute">Destitute</option>
                    <option value="PRISONER">PRISONER</option>
                    <option value="Sn. CITIZEN">Sn. CITIZEN</option>
                    <option value="Aayushmaan">Aayushmaan</option>
                  </select>
                </div>
              </div>

              {showUniId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                      type="text"
                      name="p_uni_submit"
                      value={formData.p_uni_submit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Y / N"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name Of ID</label>
                    <input
                      type="text"
                      name="p_uni_id_name"
                      value={formData.p_uni_id_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID</label>
                    <input
                      type="file"
                      name="p_uni_id_scan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please enter your Address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please enter your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please enter your contact Number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Scan Options */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Scan Type <span className="text-red-500">*</span></label>
                <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search scans..."
                  value={scanSearchTerm}
                  onChange={(e) => setScanSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
                  {scans.filter(scan => 
                    scan.s_name.toLowerCase().includes(scanSearchTerm.toLowerCase())
                  ).map(scan => (
                    <label key={scan.s_id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={formData.type_of_scan.includes(scan.s_id.toString())}
                        onChange={(e) => handleScanChange(scan.s_id.toString(), e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{scan.s_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appoint Date</label>
                  <input
                    type="date"
                    name="appoint_date"
                    value={formData.appoint_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time In</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    <option value="08:00">08:00 AM</option>
                    <option value="08:30">08:30 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="13:30">01:30 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="16:30">04:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Out</label>
                  <select
                    name="time_in"
                    value={formData.time_in}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    <option value="08:30">08:30 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="13:30">01:30 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="16:30">04:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="17:30">05:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                  <input
                    type="text"
                    name="est_time"
                    value={formData.est_time}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {selectedScans.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Scans</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Name Of Scan</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Charges</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedScans.map((scan, index) => (
                          <tr key={scan.s_id}>
                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{scan.s_name}</td>
                            <td className="border border-gray-300 px-4 py-2">₹{scan.charges}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {formData.pre} {formData.firstname}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {formData.age} {formData.age_type}, {formData.gender}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Address:</span> {formData.address}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedScans.map(scan => (
                      <tr key={scan.s_id}>
                        <td className="border border-gray-300 px-4 py-2">{scan.s_name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{scan.charges}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium text-right">Total Amount</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          name="total_amount"
                          value={formData.total_amount}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right bg-gray-50"
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-right">Received Amount</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          name="rec_amount"
                          value={formData.rec_amount}
                          onChange={(e) => {
                            handleInputChange(e);
                            setTimeout(calculatePayment, 0);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-right">Discount</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          name="dis_amount"
                          value={formData.dis_amount}
                          onChange={(e) => {
                            handleInputChange(e);
                            setTimeout(calculatePayment, 0);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium text-right">Due Amount</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          name="due_amount"
                          value={formData.due_amount}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right bg-yellow-50 font-medium"
                          readOnly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmit('Save')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit('Save_Print')}
                    disabled={parseFloat(formData.due_amount) > 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}