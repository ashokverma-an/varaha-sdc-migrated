'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Monitor, Clock, User, Calendar, CheckCircle, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';

interface QueueItem {
  id: number;
  patientName: string;
  scanType: string;
  appointmentTime: string;
  estimatedDuration: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'delayed';
  priority: 'normal' | 'urgent' | 'emergency';
}

export default function ConsoleDashboard() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [currentScan, setCurrentScan] = useState<QueueItem | null>(null);

  useEffect(() => {
    // Mock data
    setQueueItems([
      {
        id: 1,
        patientName: 'John Doe',
        scanType: 'CT Scan - Head',
        appointmentTime: '09:00 AM',
        estimatedDuration: 30,
        status: 'waiting',
        priority: 'normal'
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        scanType: 'MRI - Spine',
        appointmentTime: '09:30 AM',
        estimatedDuration: 45,
        status: 'waiting',
        priority: 'urgent'
      },
      {
        id: 3,
        patientName: 'Bob Johnson',
        scanType: 'X-Ray - Chest',
        appointmentTime: '10:00 AM',
        estimatedDuration: 15,
        status: 'waiting',
        priority: 'emergency'
      }
    ]);

    setCurrentScan({
      id: 0,
      patientName: 'Alice Brown',
      scanType: 'CT Scan - Abdomen',
      appointmentTime: '08:30 AM',
      estimatedDuration: 25,
      status: 'in-progress',
      priority: 'normal'
    });
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'waiting': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'delayed': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'normal': 'bg-gray-100 text-gray-800',
      'urgent': 'bg-orange-100 text-orange-800',
      'emergency': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors];
  };

  const startScan = (item: QueueItem) => {
    setCurrentScan(item);
    setQueueItems(prev => prev.filter(q => q.id !== item.id));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Console Queue</h1>
            <p className="text-gray-600">Monitor and manage scan operations</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>

        {/* Current Scan */}
        {currentScan && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Monitor className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Current Scan</h2>
                  <p className="text-blue-100">In Progress</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                  <Pause className="h-6 w-6" />
                </button>
                <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                  <RotateCcw className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{currentScan.patientName}</h3>
                <p className="text-blue-100 mb-4">{currentScan.scanType}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Started: {currentScan.appointmentTime}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Duration: {currentScan.estimatedDuration} min
                  </span>
                </div>
              </div>
              <div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm">65%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-white h-3 rounded-full transition-all duration-300" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-xs text-blue-100 mt-2">Estimated completion: 09:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queue */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Scan Queue</h2>
                <p className="text-gray-600">{queueItems.length} patients waiting</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {queueItems.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.patientName}</h3>
                      <p className="text-gray-600">{item.scanType}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.appointmentTime}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.estimatedDuration} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => startScan(item)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {queueItems.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mt-2" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Queue is empty</h3>
              <p className="text-gray-600">All scans have been completed</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}