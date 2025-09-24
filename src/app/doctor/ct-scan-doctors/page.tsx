'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, UserPlus } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface Doctor {
  d_id: number;
  doctor_name: string;
  specialization: string;
  mobile: string;
  email: string;
  address: string;
  created_at: string;
}

export default function CTScanDoctors() {
  const toast = useToastContext();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    doctor_name: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/doctor/ct-scan-doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Error loading doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctor_name.trim()) {
      toast.error('Doctor name is required');
      return;
    }

    try {
      const url = editingDoctor 
        ? `/api/doctor/ct-scan-doctors/${editingDoctor.d_id}`
        : '/api/doctor/ct-scan-doctors';
      const method = editingDoctor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || (editingDoctor ? 'Doctor updated successfully!' : 'Doctor added successfully!'));
        fetchDoctors();
        resetForm();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to save doctor');
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error('Error saving doctor');
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      doctor_name: doctor.doctor_name
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete Dr. ${name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/doctor/ct-scan-doctors/${id}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Doctor deleted successfully!');
        fetchDoctors();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Error deleting doctor');
    }
  };

  const resetForm = () => {
    setFormData({ doctor_name: '' });
    setEditingDoctor(null);
    setShowAddForm(false);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">CT Scan Doctors</h1>
            <p className="text-emerald-100">Manage CT scan doctors and specialists</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
              <input
                type="text"
                required
                value={formData.doctor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter doctor name"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {editingDoctor ? 'Update' : 'Add'} Doctor
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Doctors List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No doctors found</td>
                </tr>
              ) : (
                filteredDoctors.map((doctor, index) => (
                  <tr key={doctor.d_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Dr. {doctor.doctor_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.d_id, doctor.doctor_name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}