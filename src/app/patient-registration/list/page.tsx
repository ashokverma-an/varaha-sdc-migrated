'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { ClipboardList, Search, Eye, Edit, Trash2 } from 'lucide-react';

export default function PatientRegistrationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState([
    { id: 1, name: 'John Doe', cro: 'CRO001', contact: '9876543210', age: 35, gender: 'Male', category: 'General', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', cro: 'CRO002', contact: '9876543211', age: 28, gender: 'Female', category: 'VIP', date: '2024-01-16' },
    { id: 3, name: 'Bob Johnson', cro: 'CRO003', contact: '9876543212', age: 45, gender: 'Male', category: 'Emergency', date: '2024-01-17' }
  ]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (patient: any) => alert(`Viewing patient: ${patient.name}`);
  const handleEdit = (patient: any) => alert(`Editing patient: ${patient.name}`);
  const handleDelete = (patient: any) => alert(`Deleting patient: ${patient.name}`);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Patient Registration (List)</h1>
          <p className="text-purple-100">View all registered patients</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.cro}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.contact}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.gender}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.category === 'VIP' ? 'bg-purple-100 text-purple-700' :
                        patient.category === 'Emergency' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {patient.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(patient)}
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(patient)}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        >
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