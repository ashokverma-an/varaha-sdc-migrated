'use client';

import { useState } from 'react';
import { Search, Edit, Save } from 'lucide-react';

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
}

export default function PatientEdit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<Partial<PatientData>>({});

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
          setEditData(patient);
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
    if (!selectedPatient || !editData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${selectedPatient.p_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
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
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Patient Details</h2>
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
                value={editData.patient_name || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, patient_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={editData.age || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={editData.gender || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
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
                value={editData.mobile || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, mobile: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={editData.amount || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={editData.address || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
              <textarea
                value={editData.remark || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, remark: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button 
              onClick={() => setSelectedPatient(null)}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}