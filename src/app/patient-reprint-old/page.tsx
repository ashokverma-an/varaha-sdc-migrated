'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Printer, Search, Download } from 'lucide-react';

export default function PatientReprintOld() {
  const [search, setSearch] = useState('');
  const [patients] = useState([
    { id: 1, croNo: 'VDC/01-08-2025/187', name: 'JOHN DOE', date: '01-08-2025', amount: 1500 },
    { id: 2, croNo: 'VDC/02-08-2025/188', name: 'JANE SMITH', date: '02-08-2025', amount: 2000 },
    { id: 3, croNo: 'VDC/03-08-2025/189', name: 'MIKE JOHNSON', date: '03-08-2025', amount: 1800 }
  ]);

  const filteredPatients = patients.filter(p => 
    p.croNo.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-800">Patient Reprint OLD</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-normal text-gray-500 mb-2">Enter Patient CR No</label>
              <input
                type="text"
                placeholder="Enter CRO No"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-800"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-800 uppercase tracking-wider">S.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-800 uppercase tracking-wider">CRO No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-800 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-800 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-800 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-800">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-800">{patient.croNo}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-800">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-800">{patient.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-800">₹{patient.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50">
                          <Printer className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}