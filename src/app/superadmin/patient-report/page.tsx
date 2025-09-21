'use client';

import { useState, useEffect } from 'react';
import { Download, Search, Calendar, FileText } from 'lucide-react';

interface PatientReport {
  p_id: number;
  cro_number: string;
  patient_name: string;
  dname: string;
  h_name: string;
  amount: number;
  remark: string;
  date: string;
  age: number;
  gender: string;
  mobile: string;
}

export default function SuperAdminPatientReport() {
  const [patients, setPatients] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Set default dates: from one year ago to today
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const [fromDate, setFromDate] = useState(oneYearAgo.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/superadmin/patient-report?from_date=${fromDate}&to_date=${toDate}`);
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['S.No', 'CRO', 'Patient Name', 'Doctor Name', 'Hospital Name', 'Amount', 'Remark', 'Date', 'Age', 'Gender', 'Mobile'];
    const csvContent = [
      headers.join(','),
      ...patients.map((p, index) => [
        index + 1,
        p.cro_number,
        `"${p.patient_name}"`,
        `"${p.dname}"`,
        `"${p.h_name}"`,
        p.amount,
        `"${p.remark || ''}"`,
        p.date,
        p.age,
        p.gender,
        p.mobile
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-report-${fromDate}-to-${toDate}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Patient Report</h1>
            <p className="text-blue-100">Super Admin - Patient Queue Management</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchPatients}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Loading...' : 'Filter'}</span>
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              disabled={patients.length === 0}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
          <div className="flex items-end">
            <div className="w-full text-center text-sm text-gray-600 py-2">
              Total: {patients.length} records
            </div>
          </div>
        </div>

        {/* Pagination Info */}
        {patients.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, patients.length)} of {patients.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                Page {currentPage} of {Math.ceil(patients.length / itemsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(patients.length / itemsPerPage)))}
                disabled={currentPage >= Math.ceil(patients.length / itemsPerPage)}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading patients...</span>
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    No patients found for the selected date range
                  </td>
                </tr>
              ) : (
                patients
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((patient, index) => (
                  <tr key={patient.p_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{patient.cro_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.patient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.dname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.h_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{patient.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.remark || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        {patients.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, Math.ceil(patients.length / itemsPerPage)) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum <= Math.ceil(patients.length / itemsPerPage)) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(patients.length / itemsPerPage)))}
                disabled={currentPage >= Math.ceil(patients.length / itemsPerPage)}
                className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(Math.ceil(patients.length / itemsPerPage))}
                disabled={currentPage >= Math.ceil(patients.length / itemsPerPage)}
                className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}