'use client';

import { useState } from 'react';
import { Search, Printer, FileText } from 'lucide-react';

export default function PatientReprint() {
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

  const handleReprint = () => {
    if (selectedPatient) {
      window.open(`/api/patients/${selectedPatient.patient_id}/print`, '_blank');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Reprint</h1>
        <div className="flex items-center space-x-2">
          <Printer className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Reprint Receipt</span>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <p className="text-gray-900">{selectedPatient.patient_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CRO</label>
              <p className="text-gray-900">{selectedPatient.cro}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age/Gender</label>
              <p className="text-gray-900">{selectedPatient.age}/{selectedPatient.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <p className="text-gray-900">₹{selectedPatient.amount}</p>
            </div>
          </div>
          <button
            onClick={handleReprint}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer className="h-5 w-5" />
            <span>Reprint Receipt</span>
          </button>
        </div>
      )}
    </div>
  );
}