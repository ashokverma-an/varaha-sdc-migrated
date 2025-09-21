'use client';

import { useState, useEffect } from 'react';
import { Activity, FileText, Clock, CheckCircle, Users, Stethoscope } from 'lucide-react';

interface DoctorStats {
  todayPatients: number;
  pendingReports: number;
  completedReports: number;
  totalReports: number;
}

export default function DoctorDashboard() {
  const [stats, setStats] = useState<DoctorStats>({
    todayPatients: 0,
    pendingReports: 0,
    completedReports: 0,
    totalReports: 0
  });

  useEffect(() => {
    fetchDoctorStats();
  }, []);

  const fetchDoctorStats = async () => {
    try {
      const response = await fetch('/api/doctor/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-emerald-100 text-lg">Patient Reports & Medical Review</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Patients</p>
              <p className="text-3xl font-bold text-blue-600">{stats.todayPatients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingReports}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Reports</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedReports}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalReports}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/doctor/report-pending-list"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-orange-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Pending Reports</span>
          </a>
          <a
            href="/doctor/view-report"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-green-500">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">View Reports</span>
          </a>
          <a
            href="/doctor/ct-scan-doctor-list"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-2 rounded-lg bg-blue-500">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Doctor List</span>
          </a>
        </div>
      </div>
    </div>
  );
}