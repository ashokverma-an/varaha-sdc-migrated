'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Calendar, Filter, Printer, FileText } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface Patient {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: string;
  gender: string;
  mobile: string;
  h_name: string;
  dname: string;
  category: string;
  date: string;
  amount: number;
  address: string;
  remark: string;
}

export default function PatientList() {
  const toast = useToastContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    fetchPatients();
  }, [dateFilter]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      let url = 'https://varahasdc.co.in/api/admin/patient-list';
      const params = new URLSearchParams();
      
      if (dateFilter) {
        // Convert YYYY-MM-DD to DD-MM-YYYY for API
        const [year, month, day] = dateFilter.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        params.append('from_date', formattedDate);
        params.append('to_date', formattedDate);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cro_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mobile.includes(searchTerm) ||
    (patient.h_name && patient.h_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.dname && patient.dname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (patientId: number) => {
    window.location.href = `/reception/patient-registration/edit?id=${patientId}`;
  };

  const handleView = (patient: Patient) => {
    toast.error(`Patient Details:\nCRO: ${patient.cro_number}\nName: ${patient.patient_name}\nAge: ${patient.age}\nGender: ${patient.gender}\nMobile: ${patient.mobile}\nHospital: ${patient.h_name || '-'}\nDoctor: ${patient.dname || '-'}\nAmount: ₹${patient.amount}\nDate: ${patient.date}`);
  };

  const generateReport = () => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient List Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">VARAHA DIAGNOSTIC CENTER</div>
          <div>Patient List Report</div>
          ${dateFilter ? `<div>Date: ${dateFilter}</div>` : '<div>All Records</div>'}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>CRO</th>
              <th>Patient Name</th>
              <th>Age/Gender</th>
              <th>Mobile</th>
              <th>Hospital</th>
              <th>Doctor</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPatients.map((patient, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${patient.cro_number}</td>
                <td>${patient.patient_name}</td>
                <td>${patient.age}, ${patient.gender}</td>
                <td>${patient.mobile}</td>
                <td>${patient.h_name || '-'}</td>
                <td>${patient.dname || '-'}</td>
                <td>₹${patient.amount}</td>
                <td>${patient.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Total Patients: ${filteredPatients.length}</p>
          <p>Total Amount: ₹${filteredPatients.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Patient List</h1>
        <p className="text-blue-100 text-lg">View and manage all patient registrations</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, CRO, mobile, hospital, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={fetchPatients}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="h-5 w-5" />
              <span>Print Report</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/reception/patient-registration/new'}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Patient</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{filteredPatients.length}</div>
            <div className="text-sm text-blue-800">Total Patients</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ₹{filteredPatients.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-800">Total Amount</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {dateFilter ? new Date(dateFilter).toLocaleDateString() : 'All Dates'}
            </div>
            <div className="text-sm text-purple-800">Filter Period</div>
          </div>
        </div>

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
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient, index) => (
                <tr key={patient.p_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-blue-600">{patient.cro_number}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{patient.patient_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.age}, {patient.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.mobile}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.h_name || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.dname || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.category || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">₹{patient.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleView(patient)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(patient.p_id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit Patient"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedPatients.length === 0 && (
            <div className="text-center py-12">
              {loading ? (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading patients...</p>
                </div>
              ) : (
                <div>
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
                  <p className="text-gray-500">No patient records found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
}