'use client';

import { useState, useEffect } from 'react';
import { Download, Monitor, Calendar, Search, Filter } from 'lucide-react';
import SuperAdminLayout, { Card, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Button, Pagination } from '@/components/SuperAdminLayout';

interface ConsoleData {
  cro: string;
  patient_name: string;
  age: string;
  category: string;
  scan_type: string;
  amount: number;
  date: string;
  doctor_name: string;
  number_films: number;
  number_contrast: number;
  number_scan: number;
  issue_cd: string;
  start_time: string;
  stop_time: string;
  status: string;
  added_on: string;
}

export default function ConsoleReport() {
  const [consoleData, setConsoleData] = useState<ConsoleData[]>([]);
  const [filteredData, setFilteredData] = useState<ConsoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Set default dates: from one year ago to today
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const [dateFilter, setDateFilter] = useState({
    from_date: oneYearAgo.toISOString().split('T')[0],
    to_date: today.toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchConsoleData();
  }, [dateFilter]);

  const fetchConsoleData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from_date: dateFilter.from_date,
        to_date: dateFilter.to_date
      });
      
      const response = await fetch(`https://varahasdc.co.in/api/superadmin/console-report?${params}`);
      if (response.ok) {
        const data = await response.json();
        setConsoleData(data.data || []);
        setFilteredData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching console data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    const params = new URLSearchParams({
      from_date: dateFilter.from_date,
      to_date: dateFilter.to_date,
      format: 'excel'
    });
    window.open(`https://varahasdc.co.in/api/superadmin/console-report?${params}`, '_blank');
  };

  // Filter data based on search
  useEffect(() => {
    let filtered = consoleData;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [consoleData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Console Report</h1>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download Excel</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Console Report Filter</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateFilter.from_date}
              onChange={(e) => setDateFilter(prev => ({ ...prev, from_date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateFilter.to_date}
              onChange={(e) => setDateFilter(prev => ({ ...prev, to_date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Console Data Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Console Data ({consoleData.length} records)</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Films</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scans</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : consoleData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">No console data found for selected date range</td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.cro} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.cro}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.patient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.doctor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.number_films}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.number_scan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, consoleData.length)} of {consoleData.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}