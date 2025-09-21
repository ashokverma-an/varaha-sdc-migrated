'use client';

import { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface RevenueData {
  cro: string;
  patient_name: string;
  age: string;
  category: string;
  scan_type: string;
  amount: number;
  date: string;
  number_films: number;
  number_contrast: number;
  number_scan: number;
  issue_cd: string;
  added_on: string;
}

const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

export default function RevenueReport() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // Set default dates: from one year ago to today
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const [dateFilter, setDateFilter] = useState({
    from_date: oneYearAgo.toISOString().split('T')[0],
    to_date: today.toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateFilter]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from_date: dateFilter.from_date,
        to_date: dateFilter.to_date
      });
      
      const response = await fetch(`https://varahasdc.co.in/api/superadmin/revenue-report?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(revenueData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRevenue = revenueData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownloadExcel = () => {
    const params = new URLSearchParams({
      from_date: dateFilter.from_date,
      to_date: dateFilter.to_date,
      format: 'excel'
    });
    window.open(`https://varahasdc.co.in/api/superadmin/revenue-report?${params}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Report</h1>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download Excel</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Revenue Report Filter</h2>
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

      {/* Revenue Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Revenue Data</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Films</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scans</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : revenueData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">No revenue data found for selected date range</td>
                </tr>
              ) : (
                paginatedRevenue.map((revenue, index) => (
                  <tr key={revenue.cro} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{revenue.cro}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.patient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.scan_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.number_films}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.number_scan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{revenue.amount}</td>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, revenueData.length)} of {revenueData.length} results
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
  );
}