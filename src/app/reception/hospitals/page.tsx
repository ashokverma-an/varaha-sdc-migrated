'use client';

import { useState, useEffect } from 'react';
import { Hospital, Plus, Edit, Trash2, Search, X } from 'lucide-react';

interface HospitalData {
  h_id: number;
  h_name: string;
  h_short: string;
  h_address: string;
  h_contact: string;
  h_type: string;
}

export default function ReceptionHospitals() {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalData | null>(null);
  const [formData, setFormData] = useState({ h_name: '', h_short: '', h_address: '', h_contact: '', h_type: 'General' });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/hospitals');
      if (response.ok) {
        const data = await response.json();
        setHospitals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingHospital(null);
    setFormData({ h_name: '', h_short: '', h_address: '', h_contact: '', h_type: 'General' });
    setShowModal(true);
  };

  const handleEdit = (hospital: HospitalData) => {
    setEditingHospital(hospital);
    setFormData({ h_name: hospital.h_name, h_short: hospital.h_short, h_address: hospital.h_address, h_contact: hospital.h_contact, h_type: hospital.h_type });
    setShowModal(true);
  };

  const handleDelete = async (hospital: HospitalData) => {
    if (confirm(`Are you sure you want to delete ${hospital.h_name}?`)) {
      try {
        const response = await fetch(`https://varahasdc.co.in/api/admin/hospitals/${hospital.h_id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Hospital deleted successfully!');
          fetchHospitals();
        }
      } catch (error) {
        alert('Error deleting hospital');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingHospital ? `https://varahasdc.co.in/api/admin/hospitals/${editingHospital.h_id}` : 'https://varahasdc.co.in/api/admin/hospitals';
      const method = editingHospital ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert(`Hospital ${editingHospital ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        fetchHospitals();
      }
    } catch (error) {
      alert('Error saving hospital');
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.h_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.h_short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHospitals = filteredHospitals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Management</h1>
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Hospitals</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchHospitals}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          <button onClick={handleAdd} className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Hospital</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Hospital Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Short Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Contact</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHospitals.map((hospital, index) => (
                <tr key={hospital.h_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{hospital.h_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{hospital.h_short}</td>
                  <td className="border border-gray-300 px-4 py-2">{hospital.h_address}</td>
                  <td className="border border-gray-300 px-4 py-2">{hospital.h_contact}</td>
                  <td className="border border-gray-300 px-4 py-2">{hospital.h_type}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(hospital)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(hospital)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedHospitals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading hospitals...' : 'No hospitals found'}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHospitals.length)} of {filteredHospitals.length}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingHospital ? 'Edit Hospital' : 'Add Hospital'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Hospital Name"
                value={formData.h_name}
                onChange={(e) => setFormData({...formData, h_name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Short Name"
                value={formData.h_short}
                onChange={(e) => setFormData({...formData, h_short: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Address"
                value={formData.h_address}
                onChange={(e) => setFormData({...formData, h_address: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
              <input
                type="text"
                placeholder="Contact"
                value={formData.h_contact}
                onChange={(e) => setFormData({...formData, h_contact: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={formData.h_type}
                onChange={(e) => setFormData({...formData, h_type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="General">General</option>
                <option value="Specialty">Specialty</option>
                <option value="Emergency">Emergency</option>
              </select>
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingHospital ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}