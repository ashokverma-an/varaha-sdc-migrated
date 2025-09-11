'use client';

import { useState } from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';

export default function DailyRevenueReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('detail');

  const handleDownloadExcel = () => {
    const params = new URLSearchParams({
      date: selectedDate,
      type: reportType,
      format: 'excel'
    });
    window.open(`/api/reports/daily-revenue-excel?${params}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Daily Revenue Report</h1>
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
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Report Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="detail">Detail Report</option>
              <option value="summary">Summary Report</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <p className="text-gray-600">Select a date and report type, then click "Download Excel" to generate the daily revenue report.</p>
      </div>
    </div>
  );
}