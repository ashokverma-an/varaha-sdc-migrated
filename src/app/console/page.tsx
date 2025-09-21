'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, User, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PatientData {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  h_name: string;
  dname: string;
  category: string;
  date: string;
  allot_date: string;
  scan_type: string;
  status: string;
}

export default function ConsoleDashboard() {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPatients();
  }, [selectedDate]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/console/queue?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.cro_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Console Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-red-600" />
          <span className="text-lg font-medium text-gray-700">Patient Queue</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by CRO number or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchPatients}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CRO Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Age/Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr key={patient.p_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-blue-600">
                    {patient.cro_number}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{patient.patient_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.age}/{patient.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      patient.category === 'OPD FREE' || patient.category === 'IPD FREE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {patient.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{patient.dname || 'MDM'}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      patient.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.status || 'Pending'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/console/patient/${patient.cro_number}`}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      <User className="h-4 w-4" />
                      <span>Console</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading patients...' : 'No patients found for selected date'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}