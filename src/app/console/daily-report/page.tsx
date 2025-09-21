'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

interface ReportData {
  date: string;
  cro_number: string;
  patient_name: string;
  age: number;
  gender: string;
  category: string;
  scan_type: string;
  status: string;
  start_time: string;
  end_time: string;
  duration: string;
}

export default function ConsoleDailyReport() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/console/daily-report?from=${dateRange.from}&to=${dateRange.to}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Date', 'CRO Number', 'Patient Name', 'Age', 'Gender', 'Category', 'Scan Type', 'Status', 'Start Time', 'End Time', 'Duration'],
      ...reports.map(report => [
        report.date,
        report.cro_number,
        report.patient_name,
        report.age,
        report.gender,
        report.category,
        report.scan_type,
        report.status,
        report.start_time,
        report.end_time,
        report.duration
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-daily-report-${dateRange.from}-to-${dateRange.to}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Console Daily Report</h1>
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-red-600" />
          <span className="text-lg font-medium text-gray-700">Daily Report</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2 mt-6">
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Calendar className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Generate Report'}</span>
            </button>
            <button
              onClick={exportToExcel}
              disabled={reports.length === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CRO Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Age/Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Scan Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-blue-600">
                    {report.cro_number}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{report.patient_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.age}/{report.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.category === 'OPD FREE' || report.category === 'IPD FREE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {report.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{report.scan_type}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{report.duration || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {reports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading reports...' : 'No reports found for selected date range'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}