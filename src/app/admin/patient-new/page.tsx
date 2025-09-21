'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Save, RotateCcw, ArrowLeft, ArrowRight, Check, Printer } from 'lucide-react';

interface HospitalData {
  h_id: number;
  h_name: string;
}

interface DoctorData {
  d_id: number;
  dname: string;
}

interface ScanData {
  s_id: number;
  s_name: string;
  charges: number;
}

export default function PatientRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Enrollment Details
    date: new Date().toISOString().split('T')[0],
    hospital_name: '',
    doctor_name: '',
    pre: 'Mr.',
    firstname: '',
    age: '',
    age_type: 'Year',
    gender: 'Male',
    petient_type: 'GEN / Paid',
    address: '',
    city: '',
    contact_number: '',
    // Step 2: Scan Options
    type_of_scan: [] as string[],
    appoint_date: new Date().toISOString().split('T')[0],
    time: '',
    time_in: '',
    amount: '0',
    est_time: '0',
    // Step 3: Payment Details
    total_amount: '0',
    rec_amount: '0',
    dis_amount: '0',
    due_amount: '0'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hospitalsRes, doctorsRes, scansRes] = await Promise.all([
        fetch('https://varahasdc.co.in/api/admin/hospitals'),
        fetch('https://varahasdc.co.in/api/admin/doctors'),
        fetch('https://varahasdc.co.in/api/admin/scans')
      ]);

      if (hospitalsRes.ok) {
        const data = await hospitalsRes.json();
        setHospitals(data.data || []);
      }
      if (doctorsRes.ok) {
        const data = await doctorsRes.json();
        setDoctors(data || []);
      }
      if (scansRes.ok) {
        const data = await scansRes.json();
        setScans(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleScanChange = (scanIds: string[]) => {
    const totalAmount = scanIds.reduce((sum, id) => {
      const scan = scans.find(s => s.s_id.toString() === id);
      return sum + (scan?.charges || 0);
    }, 0);
    
    const isFreeCategory = ['IPD FREE', 'OPD FREE', 'RTA', 'RGHS', 'Chiranjeevi', 'Sn. CITIZEN', 'BHAMASHAH'].includes(formData.petient_type);
    const finalAmount = isFreeCategory ? 0 : totalAmount;
    
    setFormData(prev => ({
      ...prev,
      type_of_scan: scanIds,
      amount: finalAmount.toString(),
      total_amount: finalAmount.toString(),
      due_amount: finalAmount.toString()
    }));
  };

  const calculatePayment = () => {
    const total = parseFloat(formData.total_amount) || 0;
    const received = parseFloat(formData.rec_amount) || 0;
    const discount = parseFloat(formData.dis_amount) || 0;
    const due = total - received - discount;
    
    setFormData(prev => ({ ...prev, due_amount: due.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        patient_name: `${formData.pre} ${formData.firstname}`,
        scan_type: formData.type_of_scan.join(','),
        category: formData.petient_type,
        allot_date: formData.appoint_date,
        allot_time: formData.time
      };

      const response = await fetch('https://varahasdc.co.in/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        alert('Patient registered successfully!');
        resetForm();
      } else {
        alert('Failed to register patient');
      }
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Error registering patient');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      hospital_name: '',
      doctor_name: '',
      pre: 'Mr.',
      firstname: '',
      age: '',
      age_type: 'Year',
      gender: 'Male',
      petient_type: 'GEN / Paid',
      address: '',
      city: '',
      contact_number: '',
      type_of_scan: [],
      appoint_date: new Date().toISOString().split('T')[0],
      time: '',
      time_in: '',
      amount: '0',
      est_time: '0',
      total_amount: '0',
      rec_amount: '0',
      dis_amount: '0',
      due_amount: '0'
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-red-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Enrollment Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
          <select
            required
            value={formData.hospital_name}
            onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Select Hospital</option>
            {hospitals.map(hospital => (
              <option key={hospital.h_id} value={hospital.h_id}>{hospital.h_name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
          <select
            required
            value={formData.doctor_name}
            onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.d_id} value={doctor.d_id}>{doctor.dname}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <select
            value={formData.pre}
            onChange={(e) => setFormData(prev => ({ ...prev, pre: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Master">Master</option>
            <option value="Miss">Miss</option>
            <option value="Baby">Baby</option>
          </select>
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
          <input
            type="text"
            required
            value={formData.firstname}
            onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Please enter patient name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
          <input
            type="text"
            required
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">In (Year/Month/Days)</label>
          <select
            value={formData.age_type}
            onChange={(e) => setFormData(prev => ({ ...prev, age_type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="Year">Year</option>
            <option value="Month">Month</option>
            <option value="Days">Days</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            required
            value={formData.petient_type}
            onChange={(e) => setFormData(prev => ({ ...prev, petient_type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="GEN / Paid">GEN / Paid</option>
            <option value="IPD FREE">IPD Free</option>
            <option value="OPD FREE">OPD Free</option>
            <option value="RTA">RTA</option>
            <option value="RGHS">RGHS</option>
            <option value="Chiranjeevi">Chiranjeevi</option>
            <option value="Sn. CITIZEN">Sn. CITIZEN</option>
            <option value="BHAMASHAH">BHAMASHAH</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <input
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Please enter address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Please enter city"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
          <input
            type="tel"
            value={formData.contact_number}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Please enter contact number"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Scan Options</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Scan Type *</label>
        <select
          multiple
          required
          value={formData.type_of_scan}
          onChange={(e) => handleScanChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
        >
          {scans.map(scan => (
            <option key={scan.s_id} value={scan.s_id}>{scan.s_name}</option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple scans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date *</label>
          <input
            type="date"
            required
            value={formData.appoint_date}
            onChange={(e) => setFormData(prev => ({ ...prev, appoint_date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time In</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Out</label>
          <input
            type="time"
            value={formData.time_in}
            onChange={(e) => setFormData(prev => ({ ...prev, time_in: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={formData.amount}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time</label>
          <input
            type="text"
            value={formData.est_time}
            onChange={(e) => setFormData(prev => ({ ...prev, est_time: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Payment Details</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium mb-4">Invoice Summary</h4>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Patient Name:</span>
            <span className="font-medium">{formData.pre} {formData.firstname}</span>
          </div>
          <div className="flex justify-between">
            <span>Age:</span>
            <span>{formData.age} {formData.age_type} | Gender: {formData.gender}</span>
          </div>
          <div className="flex justify-between">
            <span>Address:</span>
            <span>{formData.address}</span>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">#</th>
                <th className="text-left py-2">Scan Name</th>
                <th className="text-right py-2">Charges</th>
              </tr>
            </thead>
            <tbody>
              {formData.type_of_scan.map((scanId, index) => {
                const scan = scans.find(s => s.s_id.toString() === scanId);
                return scan ? (
                  <tr key={scanId} className="border-b">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{scan.s_name}</td>
                    <td className="py-2 text-right">₹{scan.charges}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
          <input
            type="number"
            value={formData.total_amount}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Received Amount</label>
          <input
            type="number"
            value={formData.rec_amount}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, rec_amount: e.target.value }));
              setTimeout(calculatePayment, 0);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
          <input
            type="number"
            value={formData.dis_amount}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, dis_amount: e.target.value }));
              setTimeout(calculatePayment, 0);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Amount</label>
          <input
            type="number"
            value={formData.due_amount}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
        <div className="flex items-center space-x-2">
          <UserPlus className="h-6 w-6 text-red-600" />
          <span className="text-lg font-medium text-gray-700">New Patient</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
            
            <div className="flex space-x-4">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  
                  <button
                    type="button"
                    disabled={parseFloat(formData.due_amount) > 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Exit</span>
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