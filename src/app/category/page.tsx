'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

export default function Category() {
  const [categories] = useState([
    { id: 1, name: 'General', description: 'General patients' },
    { id: 2, name: 'VIP', description: 'VIP patients' },
    { id: 3, name: 'Emergency', description: 'Emergency cases' },
    { id: 4, name: 'Insurance', description: 'Insurance patients' }
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Category Management</h1>
          <p className="text-purple-100">Manage patient categories</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <button className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <Tag className="h-8 w-8 text-purple-500" />
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}