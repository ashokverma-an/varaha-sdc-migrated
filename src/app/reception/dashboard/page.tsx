'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, DollarSign, Users, Hospital, Stethoscope } from 'lucide-react';

interface ReceptionStats {
  todayPatients: number;
  totalPatients: number;
  totalRevenue: number;
  todayRevenue: number;
  todayWithdraw: number;
  cashInHand: number;
  lastMonthRevenue: number;
  currentMonthRevenue: number;
}

export default function ReceptionDashboard() {
  const [stats, setStats] = useState<ReceptionStats>({
    todayPatients: 0,
    totalPatients: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    todayWithdraw: 0,
    cashInHand: 0,
    lastMonthRevenue: 0,
    currentMonthRevenue: 0
  });

  useEffect(() => {
    fetchReceptionStats();
  }, []);

  const fetchReceptionStats = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          todayPatients: data.todayPatients || 0,
          totalPatients: data.totalPatients || 0,
          totalRevenue: data.totalRevenue || 0,
          todayRevenue: data.todayRevenue || 0,
          todayWithdraw: data.todayWithdraw || 0,
          cashInHand: data.cashInHand || 0,
          lastMonthRevenue: 12060870,
          currentMonthRevenue: 9331810
        });
      }
    } catch (error) {
      console.error('Error fetching reception stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Reception Dashboard</h1>
        <p className="text-rose-100 text-lg">Patient Management & Front Desk Operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patient Registered</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total MRI</p>
              <p className="text-3xl font-bold text-green-600">{stats.todayPatients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Received Amount</p>
              <p className="text-3xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Amount</p>
              <p className="text-3xl font-bold text-red-600">₹{stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Withdraw</p>
              <p className="text-3xl font-bold text-orange-600">₹{stats.todayWithdraw.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash In Hand</p>
              <p className="text-3xl font-bold text-purple-600">₹{stats.cashInHand.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Amount for Last Month</p>
              <p className="text-3xl font-bold">₹{stats.lastMonthRevenue.toLocaleString()}.00</p>
            </div>
            <div className="p-3 bg-indigo-400 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Total Amount for Current Month</p>
              <p className="text-3xl font-bold">₹{stats.currentMonthRevenue.toLocaleString()}.00</p>
            </div>
            <div className="p-3 bg-teal-400 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}