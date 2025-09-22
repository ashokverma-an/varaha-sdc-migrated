'use client';

import { useState, useEffect } from 'react';
import { Camera, Plus, Edit, Trash2, Search } from 'lucide-react';

interface ScanData {
  s_id: number;
  s_name: string;
  n_o_films: number;
  contrass: number;
  total_scan: number;
  estimate_time: string;
  charges: number;
}

export default function ReceptionScans() {
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await fetch('https://varaha-api-qpkj.vercel.app/api/admin/scans');
      if (response.ok) {
        const data = await response.json();
        setScans(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScans = scans.filter(scan =>
    scan.s_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredScans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScans = filteredScans.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Scan Management</h1>
        <div className="flex items-center space-x-2">
          <Camera className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-medium text-gray-700">Scans</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search scans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchScans}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Scan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-purple-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Scan Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">No. of Films</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Contrast</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Total Scan</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Estimate Time</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Charges (₹)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScans.map((scan, index) => (
                <tr key={scan.s_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{scan.s_name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{scan.n_o_films}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      scan.contrass ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scan.contrass ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{scan.total_scan}</td>
                  <td className="border border-gray-300 px-4 py-2">{scan.estimate_time}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                    ₹{scan.charges?.toLocaleString() || '0'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedScans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading scans...' : 'No scans found'}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredScans.length)} of {filteredScans.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}