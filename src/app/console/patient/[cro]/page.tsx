'use client';

import { useState, useEffect } from 'react';
import { Clock, User, Calendar, Phone, ArrowLeft } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface PatientData {
  patient: {
    cro: string;
    patient_name: string;
    pre: string;
    age: number;
    contact_number: string;
    allot_date: string;
    category: string;
    doctor_name: string;
  };
  scans: Array<{
    scan_id: number;
    s_name: string;
    status: string;
  }>;
  console: {
    stop_time: string;
  } | null;
}

export default function ConsolePatient({ params }: { params: Promise<{ cro: string }> }) {
  const toast = useToastContext();
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Calcutta' })
  );
  const [cro, setCro] = useState('');
  const [formData, setFormData] = useState({
    examination_id: '',
    number_scan: '',
    number_film: '',
    number_contrast: '',
    technician_name: '',
    nursing_name: '',
    issue_cd: 'NO',
    remark: ''
  });

  useEffect(() => {
    params.then(p => setCro(decodeURIComponent(p.cro)));
  }, [params]);

  useEffect(() => {
    if (cro) {
      fetchPatientData();
    }
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Calcutta' }));
    }, 1000);
    return () => clearInterval(timer);
  }, [cro]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/console/patient/${encodeURIComponent(cro)}`);
      if (response.ok) {
        const data = await response.json();
        setPatientData(data.data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Console patient API error:', errorData);
        toast.error(`API Error: ${errorData.error || 'Failed to fetch patient data'}. Details: ${errorData.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast.error('Error loading patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleScanStatusChange = async (scanId: number, status: string) => {
    try {
      const response = await fetch('/api/console/update-scan-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: scanId,
          patient_id: cro,
          status: status
        })
      });

      if (response.ok) {
        fetchPatientData(); // Refresh data
        toast.success('Scan status updated');
      } else {
        toast.error('Failed to update scan status');
      }
    } catch (error) {
      console.error('Error updating scan status:', error);
      toast.error('Error updating scan status');
    }
  };

  const handleStartTimer = () => {
    setStartTime(currentTime);
  };

  const handleStopTimer = () => {
    setStopTime(currentTime);
  };

  const handleSubmit = async (status: string) => {
    try {
      const response = await fetch('/api/console/save-console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cro,
          start_time: startTime,
          stop_time: stopTime,
          status,
          ...formData
        })
      });

      if (response.ok) {
        toast.success('Console data saved successfully');
        router.push('/console');
      } else {
        toast.error('Failed to save console data');
      }
    } catch (error) {
      console.error('Error saving console data:', error);
      toast.error('Error saving console data');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Patient not found</p>
        <button
          onClick={() => router.push('/console')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Queue
        </button>
      </div>
    );
  }

  const allScansComplete = patientData.scans.every(scan => scan.status === 'complete');
  const pendingScans = patientData.scans.filter(scan => scan.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/console')}
              className="p-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Console - {cro}</h1>
              <p className="text-blue-100">Patient examination console</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CRO Number</label>
            <input
              type="text"
              value={patientData.patient.cro}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input
              type="text"
              value={`${patientData.patient.pre} ${patientData.patient.patient_name}`}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="text"
              value={patientData.patient.age}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <input
              type="text"
              value={patientData.patient.doctor_name}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={patientData.patient.category}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              type="text"
              value={patientData.patient.contact_number}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <button
              onClick={handleStartTimer}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-mono"
            >
              {startTime || currentTime}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stop Time</label>
            <button
              onClick={handleStopTimer}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-mono"
            >
              {stopTime || currentTime}
            </button>
          </div>
        </div>
      </div>

      {/* MRI Details */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">MRI Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">S.No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">MRI NAME</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patientData.scans.map((scan, index) => (
                <tr key={scan.scan_id}>
                  <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{scan.s_name}</td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`scan_${scan.scan_id}`}
                          checked={scan.status === 'pending'}
                          onChange={() => handleScanStatusChange(scan.scan_id, 'pending')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Pending</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`scan_${scan.scan_id}`}
                          checked={scan.status === 'complete'}
                          onChange={() => handleScanStatusChange(scan.scan_id, 'complete')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Complete</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => handleSubmit('Pending')}
          disabled={allScansComplete}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pendingScans > 0 ? 'Pending' : 'Complete'}
        </button>
        <button
          onClick={() => handleSubmit('Complete')}
          disabled={!allScansComplete}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete
        </button>
        <button
          onClick={() => handleSubmit('Recall')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Recall
        </button>
      </div>
    </div>
  );
}