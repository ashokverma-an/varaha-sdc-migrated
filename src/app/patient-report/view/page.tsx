'use client';

import Layout from '@/components/layout/Layout';
import { FileText, Download, Eye } from 'lucide-react';

export default function ViewReports() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">View Reports</h1>
          <p className="text-green-100">View completed patient reports</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="space-y-4">
            {Array.from({length: 10}, (_, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="font-bold text-gray-900">Patient Report #{i + 1}</h3>
                      <p className="text-gray-600">CRO: CRO00{i + 1}</p>
                      <p className="text-sm text-gray-500">Completed: 2024-01-1{i + 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Complete</span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
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