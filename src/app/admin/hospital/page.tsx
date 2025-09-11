'use client';

import { useState, useEffect } from 'react';
import { Hospital, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface HospitalData {
  h_id: number;
  hospital_name: string;
  h_short: string;
  address: string;
  contact: string;
}

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalData | null>(null);
  const [formData, setFormData] = useState({
    hospital_name: '',
    h_short: '',
    address: '',
    contact: ''
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hospitals');
      if (response.ok) {
        const data = await response.json();
        setHospitals(data);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingHospital ? `/api/hospitals/${editingHospital.h_id}` : '/api/hospitals';
      const method = editingHospital ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchHospitals();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving hospital:', error);
    }
  };

  const handleEdit = (hospital: HospitalData) => {
    setEditingHospital(hospital);
    setFormData({
      hospital_name: hospital.hospital_name,
      h_short: hospital.h_short,
      address: hospital.address,
      contact: hospital.contact
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this hospital?')) {
      try {
        const response = await fetch(`/api/hospitals/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchHospitals();
        }
      } catch (error) {
        console.error('Error deleting hospital:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ hospital_name: '', h_short: '', address: '', contact: '' });
    setEditingHospital(null);
    setShowAddForm(false);
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.h_short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHospitals = filteredHospitals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Hospital</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
              <input
                type="text"
                required
                value={formData.hospital_name}
                onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
              <input
                type="text"
                required
                value={formData.h_short}
                onChange={(e) => setFormData(prev => ({ ...prev, h_short: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingHospital ? 'Update' : 'Add'} Hospital
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
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Hospital className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Hospitals List</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No hospitals found</td>
                </tr>
              ) : (
                paginatedHospitals.map((hospital, index) => (
                  <tr key={hospital.h_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hospital.hospital_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.h_short}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(hospital)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(hospital.h_id)}
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHospitals.length)} of {filteredHospitals.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}