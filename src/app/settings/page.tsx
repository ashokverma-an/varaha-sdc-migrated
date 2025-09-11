'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Settings, Shield, Users, Database, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <Settings className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold mb-2">System Settings</h1>
              <p className="text-red-100">Configure and manage system preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Settings Menu</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                        <input
                          type="text"
                          defaultValue="Varaha SDC CT Scan Center"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option>Asia/Kolkata (IST)</option>
                          <option>UTC</option>
                          <option>America/New_York</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option>English</option>
                          <option>Hindi</option>
                          <option>Tamil</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">Role Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800">Super Admin</span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Full Access</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800">Admin</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Management</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800">Doctor</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Medical</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800">Reception</span>
                          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">Registration</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800">Console</span>
                          <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">Scanning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}