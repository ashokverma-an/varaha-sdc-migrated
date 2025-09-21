'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Save, RotateCcw } from 'lucide-react';

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

export default function PatientRegistration() {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'Male',
    contact_number: '',
    address: '',
    hospital_name: '',
    doctor_name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    allot_date: '',
    allot_time: '',
    scan_type: '',
    remark: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      console.error('Error fetching data:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.cat_id.toString() === categoryId);
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      amount: category && category.cat_type === 1 ? '500' : '0'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
    setFormData({
      patient_name: '',
      age: '',
      gender: 'Male',
      contact_number: '',
      address: '',
      hospital_name: '',
      doctor_name: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      allot_date: '',
      allot_time: '',
      scan_type: '',
      remark: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
        <div className="flex items-center space-x-2">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-medium text-gray-700">New Patient</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
              <input
                type="text"
                required
                value={formData.patient_name}
                onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <input
                type="text"
                required
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                value={formData.contact_number}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital *</label>
              <select
                required
                value={formData.hospital_name}
                onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Hospital</option>
                {hospitals.map(hospital => (
                  <option key={hospital.h_id} value={hospital.h_id}>{hospital.h_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
              <select
                required
                value={formData.doctor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.d_id} value={doctor.d_id}>{doctor.dname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.cat_id} value={category.cat_id}>{category.cat_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allotment Date</label>
              <input
                type="date"
                value={formData.allot_date}
                onChange={(e) => setFormData(prev => ({ ...prev, allot_date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allotment Time</label>
              <input
                type="time"
                value={formData.allot_time}
                onChange={(e) => setFormData(prev => ({ ...prev, allot_time: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scan Type</label>
              <input
                type="text"
                value={formData.scan_type}
                onChange={(e) => setFormData(prev => ({ ...prev, scan_type: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
            <textarea
              value={formData.remark}
              onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Register Patient'}</span>
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset Form</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}