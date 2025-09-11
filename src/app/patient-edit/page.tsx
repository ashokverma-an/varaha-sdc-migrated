'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Edit, Search, Save } from 'lucide-react';

export default function PatientEdit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Patient Edit</h1>
          <p className="text-blue-100">Edit patient information</p>
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {selectedPatient ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                    <option>General</option>
                    <option>VIP</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-xl" rows={3}></textarea>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 flex items-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Edit className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Search for a patient to edit</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}