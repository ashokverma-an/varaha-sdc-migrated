'use client';

import Layout from '@/components/layout/Layout';
import HospitalForm from '@/components/ui/HospitalForm';
import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Hospital {
  id: number;
  hospital: string;
  shortName: string;
  type: string;
  contact: string;
  address: string;
}

export default function Hospitals() {
  const params = useParams();
  const role = params.role as string;
  const [hospitals, setHospitals] = useState<Hospital[]>([
    { id: 1, hospital: 'MAHATMA GANDHI HOSPITAL', shortName: 'MGH', type: 'Govermant', contact: '02912636903', address: 'JALORI GATE Jodhpur' },
    { id: 2, hospital: 'MATHURA DAS MATHUR', shortName: 'MDM', type: 'Govermant', contact: '0291', address: 'SHASHTRI NAGAR' },
    { id: 3, hospital: 'UMAID HOSPITAL', shortName: 'UMD', type: 'Govermant', contact: '0291', address: 'SHIWANJI GATE JODHPUR' },
    { id: 4, hospital: 'All India Institute of Medical Sciences', shortName: 'AIIMS', type: 'Govermant', contact: '0291', address: 'BASNI JODHPUR' },
    { id: 5, hospital: 'OTHER PRIVATE HOSPITAL', shortName: 'OPH', type: 'Private', contact: '123', address: 'JODHPUR' },
    { id: 6, hospital: 'ESI HOSPITAL', shortName: 'ESI', type: 'Govermant', contact: '', address: '' },
    { id: 11, hospital: 'MILITARY HOSPITAL', shortName: 'MH HOSPITAL', type: 'Govermant', contact: '00', address: 'JODHPUR' },
    { id: 12, hospital: 'RTA', shortName: '', type: '', contact: '0', address: '' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [formData, setFormData] = useState({
    hospitalFullName: '',
    hospitalName: '',
    hospitalShortName: '',
    hospitalType: 'Private',
    address: '',
    phone: ''
  });

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHospitals = filteredHospitals.slice(startIndex, endIndex);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHospital) {
      setHospitals(hospitals.map(h => h.id === editingHospital.id ? {
        ...h,
        hospital: formData.hospitalFullName,
        shortName: formData.hospitalShortName,
        type: formData.hospitalType,
        contact: formData.phone,
        address: formData.address
      } : h));
      showToast('Hospital updated successfully!', 'success');
    } else {
      const newHospital: Hospital = {
        id: Math.max(...hospitals.map(h => h.id)) + 1,
        hospital: formData.hospitalFullName,
        shortName: formData.hospitalShortName,
        type: formData.hospitalType,
        contact: formData.phone,
        address: formData.address
      };
      setHospitals([...hospitals, newHospital]);
      showToast('Hospital added successfully!', 'success');
    }
    setFormData({
      hospitalFullName: '',
      hospitalName: '',
      hospitalShortName: '',
      hospitalType: 'Private',
      address: '',
      phone: ''
    });
    setEditingHospital(null);
    setShowModal(false);
  };

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      hospitalFullName: hospital.hospital,
      hospitalName: hospital.hospital,
      hospitalShortName: hospital.shortName,
      hospitalType: hospital.type,
      address: hospital.address,
      phone: hospital.contact
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this hospital?')) {
      setHospitals(hospitals.filter(h => h.id !== id));
      showToast('Hospital deleted successfully!', 'success');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="font-semibold text-gray-800" style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>Hospitals</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 sm:px-6 sm:py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-all duration-200 flex items-center justify-center space-x-2 mobile-px-3"
          >
            <Plus className="h-4 w-4" />
            <span>Add Hospital</span>
          </button>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <span className="font-medium text-gray-700" style={{ fontSize: '12px', fontFamily: 'sans-serif' }}>{itemsPerPage}</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700" style={{ fontSize: '12px', fontFamily: 'sans-serif' }}>Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 mobile-px-3"
                  style={{ fontSize: '14px', fontFamily: 'sans-serif' }}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider" style={{ fontSize: '12px', fontFamily: 'sans-serif' }}>S.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentHospitals.length > 0 ? currentHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{hospital.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{hospital.hospital}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{hospital.shortName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{hospital.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{hospital.contact}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{hospital.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(hospital)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(hospital.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-900 font-bold text-lg">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredHospitals.length)} of {filteredHospitals.length}
            </span>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 ${
                    currentPage === page ? 'bg-rose-600 text-white border-rose-600' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{editingHospital ? 'Edit Hospital' : 'Add Hospital In Record'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Hospital Full Name</label>
                  <input
                    type="text"
                    value={formData.hospitalFullName}
                    onChange={(e) => setFormData({...formData, hospitalFullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-900 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Hospital Short Name</label>
                  <input
                    type="text"
                    value={formData.hospitalShortName}
                    onChange={(e) => setFormData({...formData, hospitalShortName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Hospital Type</label>
                  <select
                    value={formData.hospitalType}
                    onChange={(e) => setFormData({...formData, hospitalType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-900 font-semibold"
                  >
                    <option value="Private">Private</option>
                    <option value="Govermant">Govermant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Phone Contact</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    {editingHospital ? 'Update Hospital' : 'Add Hospital'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && (
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-lg shadow-xl z-[60] font-bold text-lg ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.message}
          </div>
        )}
        <HospitalForm
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingHospital(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingHospital}
        />
      </div>
    </Layout>
  );
}