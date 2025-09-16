'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, DollarSign, Wallet, HandCoins, Calculator } from 'lucide-react';

interface SuperAdminStats {
  todayScans: number;
  todayReceived: number;
  todayDue: number;
  todayWithdraw: number;
  cashInHand: number;
  totalAmount: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats>({
    todayScans: 115,
    todayReceived: 1350,
    todayDue: 0,
    todayWithdraw: 0,
    cashInHand: 1350,
    totalAmount: 247820
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/superadmin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-blue-100 text-lg">Welcome Super Administrator</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CT-Scan</p>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-4xl font-bold text-blue-600">{stats.todayScans}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Received Amount</p>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-4xl font-bold text-green-600">{stats.todayReceived}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Amount</p>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-4xl font-bold text-orange-600">{stats.todayDue}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Withdraw</p>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-4xl font-bold text-red-600">{stats.todayWithdraw}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <HandCoins className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash In Hand</p>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-4xl font-bold text-purple-600">{stats.cashInHand}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-4xl font-bold text-indigo-600">{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Calculator className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/superadmin/patient-report"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-blue-500">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Patient Reports</span>
          </a>
          <a
            href="/superadmin/revenue-report"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-green-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Revenue Report</span>
          </a>
          <a
            href="/superadmin/con-r-report"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-purple-500">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Console Report</span>
          </a>
          <a
            href="/superadmin/report-pending-list"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-orange-500">
              <HandCoins className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Pending Reports</span>
          </a>
        </div>
      </div>
    </div>
  );
}