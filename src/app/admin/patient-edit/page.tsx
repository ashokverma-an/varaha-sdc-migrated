'use client';

import { useState } from 'react';
import { Search, Edit, Save } from 'lucide-react';

export default function PatientEdit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      const response = await fetch(`/api/patients/search?q=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSelectedPatient(data[0]);
        } else {
          alert('Patient not found');
        }
      }
    } catch (error) {
      console.error('Error searching patient:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Edit</h1>
        <div className="flex items-center space-x-2">
          <Edit className="h-6 w-6 text-blue-600" />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {selectedPatient && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                value={selectedPatient.patient_name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CRO</label>
              <input
                type="text"
                value={selectedPatient.cro}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            {/* Add more fields as needed */}
          </div>
          <div className="mt-6">
            <button className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}