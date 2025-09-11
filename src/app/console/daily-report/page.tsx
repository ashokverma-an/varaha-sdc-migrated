'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Monitor } from 'lucide-react';

interface ConsoleReport {
  id: number;
  c_p_cro: string;
  examination_id: string;
  number_films: number;
  number_contrast: number;
  number_scan: number;
  start_time: string;
  stop_time: string;
  technician_name: string;
  status: string;
  added_on: string;
}

export default function ConsoleDailyReport() {
  const [reports, setReports] = useState<ConsoleReport[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/console/daily-report?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(`/api/console/daily-report?date=${selectedDate}&format=excel`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Console Daily Report</h1>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download Excel</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-2" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Films</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrast</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scans</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">No reports found</td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.c_p_cro}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.examination_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.number_films}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.number_contrast}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.number_scan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.start_time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.stop_time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.technician_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Complete' ? 'bg-green-100 text-green-800' :
                        report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}