'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Monitor, Camera, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ConsoleScan() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await fetch('/api/scans');
      const data = await response.json();
      setScans(data);
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Recall': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Monitor className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredScans = scans.filter((scan: any) => {
    if (activeTab === 'pending') return scan.status === 'Pending' || scan.status === 'Recall';
    if (activeTab === 'completed') return scan.status === 'Complete';
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-3xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <Monitor className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Scan Console</h1>
              <p className="text-violet-100">Manage and monitor scan operations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Scans
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'completed'
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed Scans
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading scans...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredScans.map((scan: any) => (
                <div key={scan.cid} className="bg-gradient-to-r from-gray-50 to-violet-50 rounded-xl p-6 border border-violet-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-violet-500 rounded-xl">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">CRO: {scan.c_p_cro}</h3>
                        <p className="text-gray-600">Patient: {scan.patient_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Added: {scan.added_on}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(scan.status)}
                        <span className={`font-medium ${
                          scan.status === 'Complete' ? 'text-green-600' :
                          scan.status === 'Pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {scan.status}
                        </span>
                      </div>
                      <button className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredScans.length === 0 && (
            <div className="text-center py-12">
              <Monitor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No scans found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}