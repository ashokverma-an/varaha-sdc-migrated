'use client';

import { useState, useEffect } from 'react';
import { Clock, Download, Search } from 'lucide-react';

interface PendingReport {
  patient_id: number;
  cro: string;
  patient_name: string;
  doctor_name: string;
  hospital_name: string;
  date: string;
  amount: number;
}

export default function PendingReports() {
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/pending');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching pending reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    window.open('/api/reports/pending?format=excel', '_blank');
  };

  const filteredReports = reports.filter(report =>
    report.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.cro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pending Reports</h1>
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
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or CRO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Pending Reports List</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No pending reports found</td>
                </tr>
              ) : (
                filteredReports.map((report, index) => (
                  <tr key={report.patient_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.cro}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.patient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.doctor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.hospital_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{report.amount}</td>
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