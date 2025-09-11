'use client';

import Layout from '@/components/layout/Layout';
import { Monitor, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ConsoleReport() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Console Report</h1>
          <p className="text-violet-100">View console operations and scan status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Completed</h3>
            <p className="text-3xl font-bold text-green-600">189</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Clock className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">12</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-red-600">56</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Console Activity</h2>
          <div className="space-y-4">
            {Array.from({length: 8}, (_, i) => (
              <div key={i} className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Monitor className="h-8 w-8 text-violet-500" />
                    <div>
                      <h3 className="font-bold text-gray-900">Scan #{i + 1}</h3>
                      <p className="text-gray-600">CRO: CRO00{i + 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{9 + i}:00 AM</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      i % 3 === 0 ? 'bg-green-100 text-green-700' :
                      i % 3 === 1 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {i % 3 === 0 ? 'Complete' : i % 3 === 1 ? 'In Progress' : 'Pending'}
                    </span>
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