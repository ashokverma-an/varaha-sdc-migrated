'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Droplets, Clock, User } from 'lucide-react';

export default function PatientCare() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/nursing/queue');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emergency': return 'bg-red-100 text-red-700 border-red-200';
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <Activity className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Care</h1>
              <p className="text-rose-100">Monitor and manage patient care activities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Patients</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading patients...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patients.map((patient: any) => (
                    <div key={patient.patient_id} className="bg-gradient-to-r from-gray-50 to-rose-50 rounded-xl p-6 border border-rose-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-rose-500 rounded-xl">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{patient.patient_name}</h3>
                            <p className="text-gray-600">CRO: {patient.cro}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(patient.category)}`}>
                          {patient.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Heart Rate</p>
                          <p className="font-bold text-gray-900">72 BPM</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="font-bold text-gray-900">98.6°F</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Blood Pressure</p>
                          <p className="font-bold text-gray-900">120/80</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-bold text-green-600">Stable</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Last updated: 2 mins ago</span>
                        </div>
                        <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">
                          Update Care
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && patients.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No patients in care queue</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white p-4 rounded-xl hover:from-rose-600 hover:to-rose-700 flex items-center space-x-3">
                  <Heart className="h-5 w-5" />
                  <span>Emergency Alert</span>
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center space-x-3">
                  <Activity className="h-5 w-5" />
                  <span>Vital Signs</span>
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 flex items-center space-x-3">
                  <Thermometer className="h-5 w-5" />
                  <span>Temperature Log</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Patients Cared</span>
                  <span className="font-bold text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Cases</span>
                  <span className="font-bold text-red-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medications Given</span>
                  <span className="font-bold text-blue-600">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vital Checks</span>
                  <span className="font-bold text-green-600">45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}