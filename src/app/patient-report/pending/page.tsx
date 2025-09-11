'use client';

import Layout from '@/components/layout/Layout';
import { Clock, FileText, Eye } from 'lucide-react';

export default function PendingReports() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Pending Reports</h1>
          <p className="text-yellow-100">Review pending patient reports</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="space-y-4">
            {Array.from({length: 8}, (_, i) => (
              <div key={i} className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div>
                      <h3 className="font-bold text-gray-900">Patient Report #{i + 1}</h3>
                      <p className="text-gray-600">CRO: CRO00{i + 1}</p>
                      <p className="text-sm text-gray-500">Scan Date: 2024-01-1{i + 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Pending</span>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Review</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}