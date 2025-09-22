'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, XCircle, Calendar, Phone } from 'lucide-react';

interface PendingPatient {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  h_name: string;
  dname: string;
  category: string;
  date: string;
  amount: number;
}

export default function PendingPatient() {
  const [patients, setPatients] = useState<PendingPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingPatients();
  }, []);

  const fetchPendingPatients = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/patient-list');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePatientStatus = async (patientId: number, newStatus: string) => {
    setUpdating(patientId);
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Patient status updated to ${newStatus}`);
        fetchPendingPatients();
      } else {
        alert('Error updating patient status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating patient status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mobile.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Pending Patients</h1>
        <p className="text-blue-100 text-lg">Manage patients waiting for consultation</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, CRO, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{filteredPatients.length} pending patients</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pending patients...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">CRO</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Age/Gender</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Mobile</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hospital</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient, index) => (
                  <tr key={patient.patient_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{patient.cro}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.patient_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.age}y, {patient.gender}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.mobile}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.h_name || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.dname || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{patient.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.date}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => updatePatientStatus(patient.patient_id, 'in_progress')}
                          disabled={updating === patient.patient_id}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => updatePatientStatus(patient.patient_id, 'completed')}
                          disabled={updating === patient.patient_id}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updatePatientStatus(patient.patient_id, 'cancelled')}
                          disabled={updating === patient.patient_id}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
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
            )}
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Patients</h3>
                <p className="text-gray-500">All patients have been processed or no patients found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}