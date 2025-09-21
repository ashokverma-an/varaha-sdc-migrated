'use client';

import { useState, useEffect } from 'react';
import { Download, Monitor, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import SuperAdminLayout from '@/components/SuperAdminLayout';

interface ConsoleData {
  id: number;
  console_name: string;
  patient_name: string;
  cro: string;
  amount: number;
  date: string;
  hospital_name: string;
  doctor_name: string;
}

export default function AdminConsoleReport() {
  const [consoleData, setConsoleData] = useState<ConsoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchConsoleData();
  }, [selectedDate]);

  const fetchConsoleData = async () => {
    setLoading(true);
    try {
      const dateFormatted = selectedDate.split('-').reverse().join('-'); // Convert to dd-mm-yyyy
      const response = await fetch(`https://varahasdc.co.in/api/superadmin/console-reports?s_date=${dateFormatted}`);
      if (response.ok) {
        const data = await response.json();
        setConsoleData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching console data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsoleData = consoleData.filter(item =>
    item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.console_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConsoleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConsoleData = filteredConsoleData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const exportToExcel = () => {
    const headers = ['S.No', 'Console Name', 'Patient Name', 'CRO', 'Amount', 'Date', 'Hospital', 'Doctor'];
    
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            th { background-color: #dc2626; color: white; font-weight: bold; padding: 8px; border: 1px solid #ccc; text-align: center; }
            td { padding: 6px; border: 1px solid #ccc; text-align: left; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center; color: #dc2626;">Console Report - ${selectedDate}</h2>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredConsoleData.map((item, index) => `
                <tr>
                  <td class="center">${index + 1}</td>
                  <td>${item.console_name}</td>
                  <td>${item.patient_name}</td>
                  <td>${item.cro}</td>
                  <td class="center">₹${item.amount}</td>
                  <td class="center">${item.date}</td>
                  <td>${item.hospital_name || '-'}</td>
                  <td>${item.doctor_name || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Console-Report-${selectedDate}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SuperAdminLayout 
      title="Console Report" 
      subtitle="Console Revenue Records"
      actions={
        <button
          onClick={exportToExcel}
          disabled={filteredConsoleData.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          <span>Export Excel</span>
        </button>
      }
    >
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search console data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Console Data ({filteredConsoleData.length})</h2>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Console Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : filteredConsoleData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No console data found</td>
                  </tr>
                ) : (
                  paginatedConsoleData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.console_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.patient_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cro}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hospital_name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.doctor_name || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredConsoleData.length)} of {filteredConsoleData.length} results
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
    </SuperAdminLayout>
  );
}