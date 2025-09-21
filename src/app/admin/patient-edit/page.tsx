'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Save, User, Scan, CreditCard } from 'lucide-react';

interface PatientData {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  address: string;
  h_name: string;
  dname: string;
  amount: number;
  date: string;
  category: string;
  scan_type: string;
  remark: string;
  allot_date: string;
  allot_time: string;
  hospital_id: number;
  doctor_name: number;
}

interface HospitalData {
  h_id: number;
  h_name: string;
}

interface DoctorData {
  d_id: number;
  dname: string;
}

interface CategoryData {
  cat_id: number;
  cat_name: string;
  cat_type: number;
}

export default function PatientEdit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  // Form data for three sections
  const [enrollmentData, setEnrollmentData] = useState({
    patient_name: '',
    age: 0,
    gender: '',
    mobile: '',
    address: '',
    date: ''
  });
  
  const [scanData, setScanData] = useState({
    hospital_id: 0,
    doctor_name: 0,
    category: '',
    scan_type: '',
    allot_date: '',
    allot_time: '',
    remark: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    amount: 0
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [hospitalsRes, doctorsRes, categoriesRes] = await Promise.all([
        fetch('https://varahasdc.co.in/api/admin/hospitals'),
        fetch('https://varahasdc.co.in/api/superadmin/doctors'),
        fetch('https://varahasdc.co.in/api/admin/categories')
      ]);

      if (hospitalsRes.ok) {
        const data = await hospitalsRes.json();
        setHospitals(data.data || []);
      }
      if (doctorsRes.ok) {
        const data = await doctorsRes.json();
        setDoctors(data.data || data || []);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
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
          
          // Populate form sections
          setEnrollmentData({
            patient_name: patient.patient_name,
            age: patient.age,
            gender: patient.gender,
            mobile: patient.mobile,
            address: patient.address,
            date: patient.date
          });
          
          setScanData({
            hospital_id: patient.hospital_id || 0,
            doctor_name: patient.doctor_name || 0,
            category: patient.category,
            scan_type: patient.scan_type,
            allot_date: patient.allot_date,
            allot_time: patient.allot_time,
            remark: patient.remark
          });
          
          setPaymentData({
            amount: patient.amount
          });
        } else {
          alert('Patient not found');
          setSelectedPatient(null);
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

  const handleSave = async () => {
    if (!selectedPatient) return;
    
    setLoading(true);
    try {
      const updateData = {
        ...enrollmentData,
        ...scanData,
        ...paymentData
      };
      
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${selectedPatient.p_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        alert('Patient updated successfully');
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Edit</h1>
        <div className="flex items-center space-x-2">
          <Edit className="h-6 w-6 text-red-600" />
          <span className="text-lg font-medium text-gray-700">Edit Patient</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter CRO number or patient name..."
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

      {selectedPatient && (
        <div className="space-y-6">
          {/* Enrollment Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Enrollment Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CRO Number</label>
                <input
                  type="text"
                  value={selectedPatient.cro_number}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  value={enrollmentData.patient_name}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, patient_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={enrollmentData.age}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={enrollmentData.gender}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                <input
                  type="tel"
                  value={enrollmentData.mobile}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                <input
                  type="date"
                  value={enrollmentData.date}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={enrollmentData.address}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Scan Options */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Scan className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Scan Options</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
                <select
                  value={scanData.hospital_id}
                  onChange={(e) => setScanData(prev => ({ ...prev, hospital_id: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={0}>Select Hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.h_id} value={hospital.h_id}>{hospital.h_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <select
                  value={scanData.doctor_name}
                  onChange={(e) => setScanData(prev => ({ ...prev, doctor_name: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={0}>Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.d_id} value={doctor.d_id}>{doctor.dname}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={scanData.category}
                  onChange={(e) => setScanData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.cat_id} value={category.cat_id}>{category.cat_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scan Type</label>
                <input
                  type="text"
                  value={scanData.scan_type}
                  onChange={(e) => setScanData(prev => ({ ...prev, scan_type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allotment Date</label>
                <input
                  type="date"
                  value={scanData.allot_date}
                  onChange={(e) => setScanData(prev => ({ ...prev, allot_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allotment Time</label>
                <input
                  type="time"
                  value={scanData.allot_time}
                  onChange={(e) => setScanData(prev => ({ ...prev, allot_time: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                <textarea
                  value={scanData.remark}
                  onChange={(e) => setScanData(prev => ({ ...prev, remark: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button 
              onClick={() => setSelectedPatient(null)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}