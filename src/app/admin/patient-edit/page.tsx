'use client';

import { useState, useEffect } from 'react';
import { User, Save, RotateCcw, ArrowLeft, ArrowRight, Search } from 'lucide-react';

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

interface PatientData {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: number;
  gender: string;
  contact_number: string;
  address: string;
  city: string;
  hospital_id: number;
  doctor_name: number;
  category: string;
  scan_type: string;
  allot_date: string;
  allot_time: string;
  amount: number;
  date: string;
}

export default function PatientEdit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cro: '',
    date: '',
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
    type_of_scan: [] as string[],
    appoint_date: '',
    time: '',
    time_in: '',
    amount: '0',
    est_time: '0'
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

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/search?q=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const patient = data.data[0];
          setSelectedPatient(patient);
          
          // Pre-populate form with patient data
          const nameParts = patient.patient_name.split(' ');
          const pre = nameParts[0].includes('.') ? nameParts[0] : 'Mr.';
          const firstname = nameParts.slice(pre === nameParts[0] ? 1 : 0).join(' ');
          
          setFormData({
            cro: patient.cro_number,
            date: patient.date,
            hospital_name: patient.hospital_id?.toString() || '',
            doctor_name: patient.doctor_name?.toString() || '',
            pre,
            firstname,
            age: patient.age?.toString() || '',
            age_type: 'Year',
            gender: patient.gender || 'Male',
            petient_type: patient.category || 'GEN / Paid',
            address: patient.address || '',
            city: patient.city || '',
            contact_number: patient.mobile || '',
            type_of_scan: patient.scan_type ? patient.scan_type.split(',').filter(Boolean) : [],
            appoint_date: patient.allot_date || '',
            time: patient.allot_time || '',
            time_in: '',
            amount: patient.amount?.toString() || '0',
            est_time: '0'
          });
        } else {
          alert('Patient not found');
        }
      } else {
        alert('Error searching patient');
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      alert('Error searching patient');
    } finally {
      setLoading(false);
    }
  };

  const handleScanChange = (scanIds: string[]) => {
    const totalAmount = scanIds.reduce((sum, id) => {
      const scan = scans.find(s => s.s_id.toString() === id);
      return sum + (scan?.charges || 0);
    }, 0);
    
    const isFreeCategory = ['IPD FREE', 'OPD FREE', 'RTA', 'RGHS', 'Chiranjeevi', 'Sn. CITIZEN', 'BHAMASHAH', 'Destitute'].includes(formData.petient_type);
    const finalAmount = isFreeCategory ? 0 : totalAmount;
    
    setFormData(prev => ({
      ...prev,
      type_of_scan: scanIds,
      amount: finalAmount.toString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    setLoading(true);
    try {
      const submitData = {
        patient_name: `${formData.pre} ${formData.firstname}`,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.contact_number,
        address: formData.address,
        amount: formData.amount,
        remark: ''
      };

      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${selectedPatient.patient_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        alert('Patient updated successfully!');
      } else {
        alert('Failed to update patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Error updating patient');
    } finally {
      setLoading(false);
    }
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
          <label className="block text-sm font-medium text-gray-700 mb-2">CRO No. (ScanDate: {formData.date})</label>
          <input
            type="text"
            value={formData.cro}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="text"
            value={formData.date}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
          <select
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
          <select
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
          <input
            type="text"
            value={formData.firstname}
            onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="text"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
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
            <option value="Destitute">Destitute</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Please enter your Address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Please enter your city"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
        <input
          type="tel"
          value={formData.contact_number}
          onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Scan Options</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Previously Selected Scans</label>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            {formData.type_of_scan.map(scanId => {
              const scan = scans.find(s => s.s_id.toString() === scanId);
              return scan?.s_name;
            }).filter(Boolean).join(', ') || 'No scans selected'}
          </p>
        </div>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">Update Scan Type (Select All Scan Which Recommended For The Patient)</label>
        <select
          multiple
          value={formData.type_of_scan}
          onChange={(e) => handleScanChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-48"
        >
          {scans.map(scan => (
            <option key={scan.s_id} value={scan.s_id}>{scan.s_name}</option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple scans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
          <input
            type="date"
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
        <h4 className="text-lg font-medium mb-4">Updated Patient Summary</h4>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>CRO Number:</span>
            <span className="font-medium">{formData.cro}</span>
          </div>
          <div className="flex justify-between">
            <span>Patient Name:</span>
            <span className="font-medium">{formData.pre} {formData.firstname}</span>
          </div>
          <div className="flex justify-between">
            <span>Age/Gender:</span>
            <span>{formData.age} {formData.age_type} / {formData.gender}</span>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <span>{formData.petient_type}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-semibold text-green-600">₹{formData.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Edit</h1>
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-red-600" />
          <span className="text-lg font-medium text-gray-700">Edit Patient</span>
        </div>
      </div>

      {!selectedPatient && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter CRO number or patient name to edit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchTerm}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      )}

      {selectedPatient && (
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
                      <span>{loading ? 'Updating...' : 'Update Patient'}</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatient(null);
                        setCurrentStep(1);
                        setSearchTerm('');
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      <RotateCcw className="h-5 w-5" />
                      <span>Clear</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}