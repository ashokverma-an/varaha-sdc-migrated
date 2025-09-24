'use client';

import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface DoctorData {
  d_id: number;
  dname: string;
  dage: string;
  d_gender: string;
  specialist: string;
  clinic: string;
  contact: string;
  clinic_add: string;
}

export default function ReceptionDoctors() {
  const toast = useToastContext();
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorData | null>(null);
  const [formData, setFormData] = useState({
    dname: '',
    dage: '',
    d_gender: '',
    specialist: '',
    clinic: '',
    contact: '',
    clinic_add: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      dname: '',
      dage: '',
      d_gender: '',
      specialist: '',
      clinic: '',
      contact: '',
      clinic_add: ''
    });
    setShowModal(true);
  };

  const handleEdit = (doctor: DoctorData) => {
    setEditingDoctor(doctor);
    setFormData({
      dname: doctor.dname,
      dage: doctor.dage || '',
      d_gender: doctor.d_gender || '',
      specialist: doctor.specialist || '',
      clinic: doctor.clinic || '',
      contact: doctor.contact || '',
      clinic_add: doctor.clinic_add || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (doctor: DoctorData) => {
    if (confirm(`Are you sure you want to delete Dr. ${doctor.dname}?`)) {
      try {
        const response = await fetch(`https://varahasdc.co.in/api/admin/doctors/${doctor.d_id}`, { method: 'DELETE' });
        if (response.ok) {
          toast.error('Doctor deleted successfully!');
          fetchDoctors();
        }
      } catch (error) {
        toast.error('Error deleting doctor');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDoctor ? `https://varahasdc.co.in/api/admin/doctors/${editingDoctor.d_id}` : 'https://varahasdc.co.in/api/admin/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.error(`Doctor ${editingDoctor ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        fetchDoctors();
      }
    } catch (error) {
      toast.error('Error saving doctor');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.dname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.specialist && doctor.specialist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
        <p className="text-blue-100 text-lg">Manage doctors and their information</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchDoctors}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          <button onClick={handleAdd} className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Doctor</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Doctor Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Specialist</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Contact</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.map((doctor, index) => (
                <tr key={doctor.d_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{doctor.dname}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.dage || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.d_gender || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{doctor.specialist || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{doctor.contact || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(doctor)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(doctor)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedDoctors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading doctors...' : 'No doctors found'}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Simple Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Doctor Detail</h3>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    name="dname"
                    value={formData.dname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doctor Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="text"
                    name="dage"
                    value={formData.dage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="d_gender"
                        value="Male"
                        checked={formData.d_gender === 'Male'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="d_gender"
                        value="Female"
                        checked={formData.d_gender === 'Female'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Female</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialist</label>
                  <input
                    type="text"
                    name="specialist"
                    value={formData.specialist}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specialist"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                  <input
                    type="text"
                    name="clinic"
                    value={formData.clinic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Clinic Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
                  <input
                    type="text"
                    name="clinic_add"
                    value={formData.clinic_add}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Clinic Address"
                    required
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    <Plus className="h-4 w-4 inline mr-1" />
                    Add Doctor
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}