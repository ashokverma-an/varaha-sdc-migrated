'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function PendingPatient() {
  const [patients] = useState([
    { id: 1, croNo: 'VDC/11-09-2025/1', name: 'JOHN DOE', amount: 1500, status: 'Pending', doctor: 'Dr. Smith', hospital: 'MGH' },
    { id: 2, croNo: 'VDC/11-09-2025/2', name: 'JANE SMITH', amount: 2000, status: 'Pending', doctor: 'Dr. Johnson', hospital: 'AIIMS' },
    { id: 3, croNo: 'VDC/11-09-2025/3', name: 'SAHAN LAL', amount: 1800, status: 'Pending', doctor: 'Dr. Brown', hospital: 'UMD' }
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Registered Patient List</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">S. No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">CRO No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Amount Status</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Doctor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Hospital Name</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.croNo}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">₹{patient.amount} - {patient.status}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.doctor}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.hospital}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
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