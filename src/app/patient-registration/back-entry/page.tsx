'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';

export default function PatientRegistrationBackEntry() {
  const [formData, setFormData] = useState({
    name: '', contact: '', age: '', gender: 'Male', category: 'General', 
    address: '', backDate: '', reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Back entry registered successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Patient Registration (Back-Entry)</h1>
          <p className="text-orange-100">Register patient with back date</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Back Date</label>
              <input
                type="date"
                value={formData.backDate}
                onChange={(e) => setFormData({...formData, backDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              >
                <option>General</option>
                <option>VIP</option>
                <option>Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Back Entry</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Register Back Entry</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}