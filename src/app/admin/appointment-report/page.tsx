'use client';

import { useState } from 'react';
import { Download, Calendar, ClipboardList } from 'lucide-react';

export default function AppointmentReport() {
  const [dateFilter, setDateFilter] = useState({
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0]
  });

  const handleDownloadExcel = () => {
    const params = new URLSearchParams({
      from_date: dateFilter.from_date,
      to_date: dateFilter.to_date
    });
    window.open(`/api/reports/appointment-excel?${params}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Appointment Report</h1>
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
          <ClipboardList className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Appointment Report Filter</h2>
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

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <p className="text-gray-600">Select date range and click "Download Excel" to generate appointment report.</p>
      </div>
    </div>
  );
}