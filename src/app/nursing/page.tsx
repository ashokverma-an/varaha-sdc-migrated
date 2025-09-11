'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Heart, User, Clock, AlertTriangle, CheckCircle, Activity, Thermometer, Droplets } from 'lucide-react';

interface PatientCare {
  id: number;
  patientName: string;
  roomNumber: string;
  condition: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  lastCheckTime: string;
  nextCheckTime: string;
  status: 'stable' | 'monitoring' | 'critical' | 'recovering';
  medications: string[];
}

export default function NursingDashboard() {
  const [patients, setPatients] = useState<PatientCare[]>([]);

  useEffect(() => {
    // Mock data
    setPatients([
      {
        id: 1,
        patientName: 'John Doe',
        roomNumber: '101',
        condition: 'Post-operative care',
        priority: 'high',
        vitals: {
          temperature: '98.6°F',
          bloodPressure: '120/80',
          heartRate: '72 bpm',
          oxygenSaturation: '98%'
        },
        lastCheckTime: '2 hours ago',
        nextCheckTime: '30 minutes',
        status: 'stable',
        medications: ['Paracetamol', 'Antibiotics']
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        roomNumber: '102',
        condition: 'Cardiac monitoring',
        priority: 'critical',
        vitals: {
          temperature: '99.2°F',
          bloodPressure: '140/90',
          heartRate: '85 bpm',
          oxygenSaturation: '95%'
        },
        lastCheckTime: '1 hour ago',
        nextCheckTime: '15 minutes',
        status: 'monitoring',
        medications: ['Beta blockers', 'Aspirin']
      },
      {
        id: 3,
        patientName: 'Bob Johnson',
        roomNumber: '103',
        condition: 'Recovery',
        priority: 'medium',
        vitals: {
          temperature: '98.4°F',
          bloodPressure: '115/75',
          heartRate: '68 bpm',
          oxygenSaturation: '99%'
        },
        lastCheckTime: '3 hours ago',
        nextCheckTime: '1 hour',
        status: 'recovering',
        medications: ['Vitamins', 'Pain relief']
      }
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'critical': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'stable': 'bg-green-100 text-green-800',
      'monitoring': 'bg-blue-100 text-blue-800',
      'critical': 'bg-red-100 text-red-800',
      'recovering': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'stable': CheckCircle,
      'monitoring': Activity,
      'critical': AlertTriangle,
      'recovering': Heart
    };
    return icons[status as keyof typeof icons] || CheckCircle;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nursing Dashboard</h1>
            <p className="text-gray-600">Patient care management and monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm">Total Patients</p>
                <p className="text-3xl font-bold">{patients.length}</p>
              </div>
              <User className="h-8 w-8 text-rose-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Critical</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.priority === 'critical').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Monitoring</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.status === 'monitoring').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Stable</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.status === 'stable').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid gap-6">
          {patients.map((patient) => {
            const StatusIcon = getStatusIcon(patient.status);
            return (
              <div key={patient.id} className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{patient.patientName}</h3>
                        <p className="text-gray-600">Room {patient.roomNumber} • {patient.condition}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(patient.priority)}`}>
                        {patient.priority} priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                        <StatusIcon className="h-4 w-4 inline mr-1" />
                        {patient.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Last check: {patient.lastCheckTime}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Next check: {patient.nextCheckTime}
                      </span>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="lg:w-80">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-1">
                          <Thermometer className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Temperature</span>
                        </div>
                        <p className="text-lg font-bold text-red-900">{patient.vitals.temperature}</p>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-1">
                          <Droplets className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Blood Pressure</span>
                        </div>
                        <p className="text-lg font-bold text-blue-900">{patient.vitals.bloodPressure}</p>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-1">
                          <Heart className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Heart Rate</span>
                        </div>
                        <p className="text-lg font-bold text-green-900">{patient.vitals.heartRate}</p>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">O2 Saturation</span>
                        </div>
                        <p className="text-lg font-bold text-purple-900">{patient.vitals.oxygenSaturation}</p>
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Current Medications</h5>
                      <div className="flex flex-wrap gap-2">
                        {patient.medications.map((med, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium">
                    Update Vitals
                  </button>
                  <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors font-medium">
                    Add Note
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                    Emergency Alert
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}