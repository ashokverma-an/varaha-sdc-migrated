'use client';

import { useState } from 'react';
import { Download, Monitor, Calendar } from 'lucide-react';

export default function ConsoleReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDownloadExcel = () => {
    const params = new URLSearchParams({
      s_date: selectedDate.split('-').reverse().join('-'), // Convert to dd-mm-yyyy format
      format: 'excel'
    });
    window.open(`/api/reports/console?${params}`, '_blank');
  };

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
          <h2 className="text-xl font-semibold text-gray-900">Report By Day</h2>
        </div>
        
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <p className="text-gray-600">Select a date and click "Download Excel" to generate console revenue report for that day.</p>
      </div>
    </div>
  );
}