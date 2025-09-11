'use client';

import { useState, useEffect } from 'react';
import { Monitor, Users, Clock, Activity } from 'lucide-react';

interface ConsoleStats {
  totalScans: number;
  todayScans: number;
  pendingQueue: number;
  completedToday: number;
}

export default function ConsoleDashboard() {
  const [stats, setStats] = useState<ConsoleStats>({
    totalScans: 0,
    todayScans: 0,
    pendingQueue: 0,
    completedToday: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/console/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Console Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalScans}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Scans</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayScans}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Queue</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingQueue}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/console/daily-report"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-blue-500">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Daily Report</span>
          </a>
        </div>
      </div>
    </div>
  );
}