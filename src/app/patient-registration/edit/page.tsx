'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { RotateCcw, Edit, Eye, FileText } from 'lucide-react';

export default function PatientEditNew() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState([
    { id: 1, croNo: 'VDC/11-09-2025/1', name: 'Mr.LAXMAN RAM', amountStatus: 'Due', doctor: 'MDM', hospital: 'MATHURA DAS MATHUR' },
    { id: 2, croNo: 'VDC/11-09-2025/2', name: 'Mr.BIRMA RAM', amountStatus: 'No Due', doctor: 'RAM NIWAS BISHNOI', hospital: 'MATHURA DAS MATHUR' },
    { id: 3, croNo: 'VDC/11-09-2025/3', name: 'Mr.SAHAN LAL', amountStatus: 'Due', doctor: 'MDM', hospital: 'MATHURA DAS MATHUR' },
    { id: 4, croNo: 'VDC/11-09-2025/4', name: 'BabyAALIYA BANO', amountStatus: 'No Due', doctor: 'MDM', hospital: 'MATHURA DAS MATHUR' },
    { id: 5, croNo: 'VDC/11-09-2025/5', name: 'Mr.JNKNJK', amountStatus: 'Due', doctor: 'A.C.H MATHUR', hospital: 'MAHATMA GANDHI HOSPITAL' }
  ]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.croNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Registered Patient List</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-normal text-gray-700">10</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-normal text-gray-700">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-700"
                />
              </div>
            </div>
          </div>
          
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
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.croNo}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        patient.amountStatus === 'Due' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {patient.amountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.doctor}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{patient.hospital}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <div className="flex space-x-1">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Recall">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50" title="View Payment">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50" title="View Invoice">
                          <FileText className="h-4 w-4" />
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