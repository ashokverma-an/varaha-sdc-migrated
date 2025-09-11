'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function PatientModify() {
  const [patients] = useState([
    { id: 1, croNo: 'VDC/11-09-2025/1', name: 'JOHN DOE', age: 35, gender: 'Male', contact: '9876543210' },
    { id: 2, croNo: 'VDC/11-09-2025/2', name: 'JANE SMITH', age: 28, gender: 'Female', contact: '9876543211' },
    { id: 3, croNo: 'VDC/11-09-2025/3', name: 'SAHAN LAL', age: 16, gender: 'Male', contact: '9876543212' }
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Patient Modify</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">S.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">CRO No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.croNo}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{patient.contact}</td>
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