'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, TrendingUp, UserPlus } from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  todayPatients: number;
  pendingScans: number;
  completedScans: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayPatients: 0,
    pendingScans: 0,
    completedScans: 0
  });
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardStats();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const getRoleSpecificContent = () => {
    const timeString = currentTime.toLocaleTimeString();
    const dateString = currentTime.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/\s/g, '-');
    
    switch (user?.admin_type) {
      case 'console':
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Console Dashboard</h2>
              <p className="text-blue-100 text-lg mb-4">VDC Console Management System</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{dateString}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{timeString}</span>
              </div>
            </div>
          </div>
        );
      case 'super_admin':
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Super Admin Panel</h2>
              <p className="text-red-100 text-lg mb-4">Complete System Control</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{dateString}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{timeString}</span>
              </div>
            </div>
          </div>
        );
      case 'reception':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Total Amount for Last Month</h3>
                <p className="text-3xl font-bold text-green-600">₹1,20,60,870.00</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Total Amount for Current Month</h3>
                <p className="text-3xl font-bold text-blue-600">₹41,29,950.00</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Current Date</h3>
                <p className="text-3xl font-bold text-rose-600">{dateString}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Current Time</h3>
                <p className="text-3xl font-bold text-rose-600">{timeString}</p>
              </div>
            </div>
          </div>
        );
      case 'doctor':
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Doctor Panel</h2>
              <p className="text-violet-100 text-lg mb-4">Patient Reports & Management</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{dateString}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{timeString}</span>
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Welcome Administrator</h2>
              <p className="text-blue-100 text-lg mb-4">Admin Dashboard</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{dateString}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{timeString}</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">CT Scan Management</h2>
              <p className="text-indigo-100 text-lg mb-4">Complete System Overview</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{dateString}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{timeString}</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {getRoleSpecificContent()}

        {user?.admin_type === 'admin' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Patient Registered Today</p>
                <p className="text-2xl font-bold text-gray-900">257</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <FileText className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Total MRI Today</p>
                <p className="text-2xl font-bold text-gray-900">189</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Received Amount Today</p>
                <p className="text-2xl font-bold text-gray-900">5050</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Due Amount Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Withdraw Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Cash In Hand Today</p>
                <p className="text-2xl font-bold text-gray-900">5050</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Patients</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
                    <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 mb-1">Today's Patients</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.todayPatients}</p>
                    <div className="w-full bg-emerald-100 rounded-full h-1 mt-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1 rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Scans</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingScans}</p>
                    <div className="w-full bg-amber-100 rounded-full h-1 mt-2">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-1 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedScans}</p>
                    <div className="w-full bg-violet-100 rounded-full h-1 mt-2">
                      <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-1 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.admin_type !== 'reception' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user?.admin_type === 'admin' && (
                <>
                  <a href="/patients/new" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">New Patient</h4>
                    <p className="text-blue-700 text-sm">Register patient</p>
                  </a>
                  <a href="/patients" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">Patient List</h4>
                    <p className="text-blue-700 text-sm">View patients</p>
                  </a>
                  <a href="/reports" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">Reports</h4>
                    <p className="text-blue-700 text-sm">Generate reports</p>
                  </a>
                </>
              )}
              {user?.admin_type === 'console' && (
                <a href="/console" className="bg-violet-50 p-4 rounded-lg hover:bg-violet-100 transition-colors border border-violet-200">
                  <h4 className="font-semibold text-violet-900 mb-1">Console Queue</h4>
                  <p className="text-violet-700 text-sm">Manage queue</p>
                </a>
              )}
              {user?.admin_type === 'doctor' && (
                <a href="/patients" className="bg-emerald-50 p-4 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-1">Patient Queue</h4>
                  <p className="text-emerald-700 text-sm">View reports</p>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}