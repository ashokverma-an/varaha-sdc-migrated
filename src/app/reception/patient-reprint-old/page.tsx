'use client';

import { useState } from 'react';
import { Search, Printer, FileText } from 'lucide-react';

interface Patient {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  hospital_name: string;
  doctor_name: string;
  category: string;
  date: string;
  amount: number;
}

export default function PatientReprintOld() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [printing, setPrinting] = useState<number | null>(null);

  const searchPatients = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/search?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = async (patient: Patient) => {
    setPrinting(patient.patient_id);
    try {
      toast.error(`Reprinting receipt for ${patient.patient_name} (${patient.cro})`);
    } catch (error) {
      toast.error('Error reprinting receipt');
    } finally {
      setPrinting(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPatients();
    }
  };

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = patients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Patient Reprint (Old Records)</h1>
        <p className="text-blue-100 text-lg">Search and reprint receipts for old patient records</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by CRO, patient name, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={searchPatients}
            disabled={loading || !searchTerm.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {patients.length > 0 && (
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
                    <td className="border border-gray-300 px-4 py-2">{patient.hospital_name || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.doctor_name || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{patient.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.date}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleReprint(patient)}
                        disabled={printing === patient.patient_id}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {printing === patient.patient_id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Printer className="h-4 w-4" />
                        )}
                        <span>Reprint</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, patients.length)} of {patients.length}
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
          </div>
        )}

        {patients.length === 0 && searchTerm && !loading && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-500">No patient records found matching your search criteria.</p>
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search Patient Records</h3>
            <p className="text-gray-500">Enter CRO number, patient name, or mobile number to search for old records.</p>
          </div>
        )}
      </div>
    </div>
  );
}