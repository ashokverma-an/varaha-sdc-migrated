'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Printer, Search, FileText } from 'lucide-react';

export default function PatientReprint() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Patient Reprint</h1>
          <p className="text-green-100">Reprint patient documents</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patient by name or CRO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-green-500" />
                  <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Patient Report #{item}</h3>
                <p className="text-gray-600 mb-2">CRO: CRO00{item}</p>
                <p className="text-sm text-gray-500">Date: 2024-01-1{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}