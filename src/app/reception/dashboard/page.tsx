'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, DollarSign, Users, Hospital, Stethoscope } from 'lucide-react';

interface ReceptionStats {
  todayPatients: number;
  totalPatients: number;
  pendingPatients: number;
  completedScans: number;
  totalHospitals: number;
  totalDoctors: number;
}

export default function ReceptionDashboard() {
  const [stats, setStats] = useState<ReceptionStats>({
    todayPatients: 0,
    totalPatients: 0,
    pendingPatients: 0,
    completedScans: 0,
    totalHospitals: 0,
    totalDoctors: 0
  });

  useEffect(() => {
    fetchReceptionStats();
  }, []);

  const fetchReceptionStats = async () => {
    try {
      const response = await fetch('/api/reception/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
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
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Patients</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingPatients}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Scans</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completedScans}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalHospitals}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Hospital className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-3xl font-bold text-teal-600">{stats.totalDoctors}</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <Stethoscope className="h-8 w-8 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}