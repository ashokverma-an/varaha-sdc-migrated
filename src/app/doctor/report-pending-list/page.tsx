'use client';

import { useState, useEffect } from 'react';
import { Clock, Eye, FileText, Search } from 'lucide-react';
import Link from 'next/link';

interface PendingReport {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  scan_type: string;
  date: string;
  allot_date: string;
  status: string;
}

export default function ReportPendingList() {
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = async () => {
    try {
      const response = await fetch('/api/doctor/pending-reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report =>
    report.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pending Reports</h1>
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-orange-600" />
          <span className="text-lg font-medium text-gray-700">Reports Awaiting Review</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by CRO number or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchPendingReports}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-orange-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CRO Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Age/Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Contact</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Scan Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={report.patient_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-blue-600">
                    {report.cro}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{report.patient_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.age}/{report.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.mobile}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.scan_type}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                      Pending
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/doctor/nursing?cro=${report.cro}`}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Review</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading pending reports...' : 'No pending reports found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}