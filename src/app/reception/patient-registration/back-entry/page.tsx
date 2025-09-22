'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, User, Phone, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

interface Hospital {
  h_id: number;
  h_name: string;
}

interface Doctor {
  d_id: number;
  dname: string;
}

interface Category {
  cat_id: number;
  cat_name: string;
}

export default function BackEntryPatientRegistration() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'Male',
    contact_number: '',
    address: '',
    hospital_id: '',
    doctor_name: '',
    category: '',
    amount: '',
    date: '',
    allot_date: '',
    allot_time: '',
    scan_type: '',
    remark: ''
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [hospitalsRes, doctorsRes, categoriesRes] = await Promise.all([
        fetch('https://varahasdc.co.in/api/admin/hospitals'),
        fetch('https://varahasdc.co.in/api/admin/doctors'),
        fetch('https://varahasdc.co.in/api/admin/categories')
      ]);

      if (hospitalsRes.ok) {
        const hospitalsData = await hospitalsRes.json();
        setHospitals(hospitalsData.data || []);
      }

      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData || []);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const validateForm = () => {
    if (!formData.patient_name.trim()) {
      alert('Patient name is required');
      return false;
    }
    if (!formData.age.trim()) {
      alert('Age is required');
      return false;
    }
    if (!formData.contact_number.trim()) {
      alert('Contact number is required');
      return false;
    }
    if (formData.contact_number.length !== 10) {
      alert('Contact number must be 10 digits');
      return false;
    }
    if (!formData.hospital_id) {
      alert('Please select a hospital');
      return false;
    }
    if (!formData.doctor_name) {
      alert('Please select a doctor');
      return false;
    }
    if (!formData.amount.trim()) {
      alert('Amount is required');
      return false;
    }
    if (!formData.date.trim()) {
      alert('Registration date is required');
      return false;
    }
    
    // Validate date format (dd-mm-yyyy)
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(formData.date)) {
      alert('Date must be in DD-MM-YYYY format');
      return false;
    }

    // Validate date is not in future
    const [day, month, year] = formData.date.split('-').map(Number);
    const entryDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (entryDate > today) {
      alert('Registration date cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Back entry patient registered successfully! CRO: ${result.data?.cro || 'Generated'}`);
        
        // Reset form
        setFormData({
          patient_name: '',
          age: '',
          gender: 'Male',
          contact_number: '',
          address: '',
          hospital_id: '',
          doctor_name: '',
          category: '',
          amount: '',
          date: '',
          allot_date: '',
          allot_time: '',
          scan_type: '',
          remark: ''
        });
      } else {
        alert('Error registering patient');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering patient');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Format date input to DD-MM-YYYY
    if (name === 'date' && value.length === 10 && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        // Convert YYYY-MM-DD to DD-MM-YYYY
        setFormData(prev => ({ ...prev, [name]: `${parts[2]}-${parts[1]}-${parts[0]}` }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      // Convert DD-MM-YYYY to YYYY-MM-DD for input
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.location.href = '/reception/patient-registration'}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Back Entry Patient Registration</h1>
            <p className="text-blue-100 text-lg">Register patient with previous date entry</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex">
          <Clock className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Back Entry Registration</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This form allows registration of patients with previous dates. Ensure all details are accurate as this affects historical records.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <User className="inline h-4 w-4 mr-1" />
              Patient Name *
            </label>
            <input
              type="text"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Age *</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g., 25Year"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Phone className="inline h-4 w-4 mr-1" />
              Contact Number *
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              maxLength={10}
              pattern="[0-9]{10}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="inline h-4 w-4 mr-1" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hospital *</label>
            <select
              name="hospital_id"
              value={formData.hospital_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(hospital => (
                <option key={hospital.h_id} value={hospital.h_id}>
                  {hospital.h_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Doctor *</label>
            <select
              name="doctor_name"
              value={formData.doctor_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.d_id} value={doctor.d_id}>
                  {doctor.dname}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.cat_id} value={category.cat_name}>
                  {category.cat_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Calendar className="inline h-4 w-4 mr-1" />
              Registration Date * (DD-MM-YYYY)
            </label>
            <input
              type="date"
              name="date"
              value={formatDateForInput(formData.date)}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formData.date && (
              <p className="text-xs text-gray-500">Will be saved as: {formData.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Allotment Date</label>
            <input
              type="date"
              name="allot_date"
              value={formData.allot_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Allotment Time</label>
            <input
              type="time"
              name="allot_time"
              value={formData.allot_time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Scan Type</label>
            <input
              type="text"
              name="scan_type"
              value={formData.scan_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Registering...' : 'Register Back Entry'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => window.location.href = '/reception/patient-registration'}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}