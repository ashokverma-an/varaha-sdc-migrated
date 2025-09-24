'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';
import * as XLSX from 'xlsx';

interface DailyReport {
  cro_number: string;
  patient_name: string;
  pre: string;
  start_time: string;
  stop_time: string;
  status: string;
  technician_name: string;
  added_on: string;
}

export default function ConsoleDailyReport() {
  const toast = useToastContext();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Calcutta' })
  );
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: selectedDate
      });
      
      const response = await fetch(`/api/console/daily-report?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Console daily report API error:', errorData);
        toast.error(`API Error: ${errorData.error || 'Failed to fetch daily report'}. Details: ${errorData.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();
      
      const headerData = [
        ['VARAHA DIAGNOSTIC CENTER'],
        [`CONSOLE DAILY REPORT - ${new Date(selectedDate).toLocaleDateString()}`],
        [''],
        ['S.No', 'CRO', 'Patient Name', 'Start Time', 'Stop Time', 'Status', 'Technician', 'Date']
      ];
      
      const exportData = reports.map((report, index) => [
        index + 1,
        report.cro_number,
        `${report.pre} ${report.patient_name}`,
        report.start_time,
        report.stop_time,
        report.status,
        report.technician_name || '-',
        report.added_on
      ]);
      
      const ws = XLSX.utils.aoa_to_sheet([...headerData, ...exportData]);
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }
      ];
      ws['!cols'] = Array(8).fill({ width: 15 });
      
      XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');
      XLSX.writeFile(wb, `console_daily_report_${selectedDate}.xlsx`);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Report</h1>
            <p className="text-blue-100">Console daily activity report</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToExcel}
              disabled={exporting || reports.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
            </button>
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            Total Records: {reports.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Console Activities</h2>
          <p className="text-sm text-gray-600 mt-1">
            Report for {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading daily report...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No activities found for selected date
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={`${report.cro_number}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {report.cro_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.pre} {report.patient_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.start_time || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.stop_time || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === 'Complete' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.technician_name || '-'}
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