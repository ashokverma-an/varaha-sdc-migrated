'use client';

import { useState, useEffect } from 'react';
import { Camera, Plus, Edit, Trash2, Search, X } from 'lucide-react';

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
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingScan, setEditingScan] = useState<ScanData | null>(null);
  const [formData, setFormData] = useState({ s_name: '', n_o_films: 0, contrass: 0, total_scan: 1, estimate_time: '', charges: 0 });

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/scans');
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

  const handleAdd = () => {
    setEditingScan(null);
    setFormData({ s_name: '', n_o_films: 0, contrass: 0, total_scan: 1, estimate_time: '', charges: 0 });
    setShowModal(true);
  };

  const handleEdit = (scan: ScanData) => {
    setEditingScan(scan);
    setFormData({ s_name: scan.s_name, n_o_films: scan.n_o_films, contrass: scan.contrass, total_scan: scan.total_scan, estimate_time: scan.estimate_time, charges: scan.charges });
    setShowModal(true);
  };

  const handleDelete = async (scan: ScanData) => {
    if (confirm(`Are you sure you want to delete ${scan.s_name}?`)) {
      try {
        const response = await fetch(`https://varahasdc.co.in/api/admin/scans/${scan.s_id}`, { method: 'DELETE' });
        if (response.ok) {
          toast.error('Scan deleted successfully!');
          fetchScans();
        }
      } catch (error) {
        toast.error('Error deleting scan');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingScan ? `https://varahasdc.co.in/api/admin/scans/${editingScan.s_id}` : 'https://varahasdc.co.in/api/admin/scans';
      const method = editingScan ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.error(`Scan ${editingScan ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        fetchScans();
      }
    } catch (error) {
      toast.error('Error saving scan');
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Scan Management</h1>
        <p className="text-blue-100 text-lg">Manage scan types and pricing</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchScans}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          <button onClick={handleAdd} className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Scan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
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
                      <button onClick={() => handleEdit(scan)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(scan)} className="p-1 text-red-600 hover:bg-red-100 rounded">
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
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingScan ? 'Edit Scan' : 'Add Scan'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Scan Name"
                value={formData.s_name}
                onChange={(e) => setFormData({...formData, s_name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Number of Films"
                value={formData.n_o_films}
                onChange={(e) => setFormData({...formData, n_o_films: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={formData.contrass}
                onChange={(e) => setFormData({...formData, contrass: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={0}>No Contrast</option>
                <option value={1}>With Contrast</option>
              </select>
              <input
                type="text"
                placeholder="Estimate Time (e.g., 30 mins)"
                value={formData.estimate_time}
                onChange={(e) => setFormData({...formData, estimate_time: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Charges"
                value={formData.charges}
                onChange={(e) => setFormData({...formData, charges: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingScan ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}