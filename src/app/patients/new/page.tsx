'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, FileText, CreditCard, Save, ArrowLeft, Stethoscope, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewPatient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    prefix: 'Mr.',
    firstName: '',
    age: '',
    ageType: 'Year',
    gender: 'Male',
    category: 'GEN / Paid',
    address: '',
    city: '',
    contactNumber: '',
    hospitalName: '',
    doctorName: '',
    scanType: [],
    appointDate: new Date().toISOString().split('T')[0],
    amount: ''
  });
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hospitalsRes, doctorsRes, scansRes] = await Promise.all([
        fetch('/api/hospitals'),
        fetch('/api/doctors'),
        fetch('/api/scans')
      ]);
      
      const hospitalsData = await hospitalsRes.json();
      const doctorsData = await doctorsRes.json();
      const scansData = await scansRes.json();
      
      if (hospitalsData.success) setHospitals(hospitalsData.hospitals);
      if (doctorsData.success) setDoctors(doctorsData.doctors);
      if (scansData.success) setScans(scansData.scans);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adminId: JSON.parse(localStorage.getItem('user') || '{}').admin_id
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Patient registered successfully! CRO: ${result.cro}`);
        setTimeout(() => router.push('/patients'), 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Patient Registration</h1>
              <p className="text-gray-600">Register a new patient in the system</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Information */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prefix</label>
                <select
                  value={formData.prefix}
                  onChange={(e) => setFormData({...formData, prefix: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Master">Master</option>
                  <option value="Miss">Miss</option>
                  <option value="Baby">Baby</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Age"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age Type</label>
                <select
                  value={formData.ageType}
                  onChange={(e) => setFormData({...formData, ageType: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Year">Year</option>
                  <option value="Month">Month</option>
                  <option value="Days">Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
          </div>

          {/* Hospital & Doctor Information */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hospital & Doctor</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital</label>
                <select
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((hospital: any) => (
                    <option key={hospital.h_id} value={hospital.h_id}>
                      {hospital.h_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor</label>
                <select
                  value={formData.doctorName}
                  onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor: any) => (
                    <option key={doctor.d_id} value={doctor.d_id}>
                      {doctor.dname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center space-x-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>{loading ? 'Registering...' : 'Register Patient'}</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}