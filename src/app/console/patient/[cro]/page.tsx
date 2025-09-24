'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Square, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PatientData {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  dname: string;
  category: string;
  date: string;
  allot_date: string;
  scan_type: string;
  scans: ScanItem[];
}

interface ScanItem {
  s_id: number;
  s_name: string;
  status: 'Pending' | 'Complete';
}

export default function PatientConsole() {
  const params = useParams();
  const cro = params.cro as string;
  
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState({ start: '', stop: '', running: false, elapsed: 0 });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (cro) {
      fetchPatientData();
    }
  }, [cro]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      if (timer.running) {
        setTimer(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.running]);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`/api/console/patient/${cro}`);
      if (response.ok) {
        const data = await response.json();
        setPatient(data.data);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const now = new Date().toLocaleTimeString();
    setTimer({ start: now, stop: '', running: true, elapsed: 0 });
  };

  const stopTimer = () => {
    const now = new Date().toLocaleTimeString();
    setTimer(prev => ({ ...prev, stop: now, running: false }));
  };

  const toggleScanStatus = async (scanId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Complete' : 'Pending';
    
    try {
      const response = await fetch(`/api/console/scan-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cro, scanId, status: newStatus })
      });
      
      if (response.ok) {
        fetchPatientData();
      }
    } catch (error) {
      console.error('Error updating scan status:', error);
    }
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading patient data...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">Patient not found</div>
        <Link href="/console" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Console
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/console"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Patient Console</h1>
        </div>
        <div className="text-lg font-medium text-gray-700">{currentTime}</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient History</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Console Date Of Examination</label>
            <p className="text-gray-900 font-medium">{patient.allot_date || patient.date}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <p className="text-gray-900">{patient.date}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CRO Number</label>
            <p className="text-gray-900 font-medium text-blue-600">{patient.cro_number}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{patient.patient_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <p className="text-gray-900">{patient.age}Year</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referring Physician</label>
            <p className="text-gray-900">{patient.dname || 'MDM'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <p className="text-gray-900">
              <span className={`px-2 py-1 rounded text-sm ${
                patient.category === 'OPD FREE' || patient.category === 'IPD FREE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {patient.category}
              </span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <p className="text-gray-900">{patient.mobile}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <p className="text-gray-900 font-medium">{timer.start || '--:--:--'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stop Time</label>
            <p className="text-gray-900 font-medium">{timer.stop || '--:--:--'}</p>
          </div>
          <div className="flex space-x-2">
            {!timer.running ? (
              <button
                onClick={startTimer}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Start</span>
              </button>
            ) : (
              <button
                onClick={stopTimer}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
        
        {timer.running && (
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              Elapsed: {formatElapsedTime(timer.elapsed)}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">MRI Details</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">MRI NAME</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {patient.scans?.map((scan, index) => (
                <tr key={scan.s_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{scan.s_name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => toggleScanStatus(scan.s_id, scan.status)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                          scan.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {scan.status === 'Pending' ? (
                          <>
                            <AlertCircle className="h-4 w-4" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Complete</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => toggleScanStatus(scan.s_id, scan.status)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          scan.status === 'Complete'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {scan.status === 'Complete' ? 'Pending' : 'Complete'}
                      </button>
                    </div>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    No scans found for this patient
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}