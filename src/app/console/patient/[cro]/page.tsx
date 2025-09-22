'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, IndianRupee, Hospital, Stethoscope, FileText, Clock, CheckCircle, XCircle, Play, Square, RotateCcw, ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';

interface PatientDetails {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: string;
  gender: string;
  mobile: string;
  address: string;
  hospital_name: string;
  doctor_name: string;
  category: string;
  amount: number;
  scan_status: number;
  date: string;
  allot_date: string;
  allot_time: string;
  scan_type: string;
  remark: string;
}

interface MRIDetail {
  id: number;
  name: string;
  status: 'pending' | 'completed';
}

interface Timer {
  startTime: string | null;
  stopTime: string | null;
  isRunning: boolean;
  elapsed: number;
}

export default function ConsolePatientDetails() {
  const params = useParams();
  const cro = decodeURIComponent(params.cro as string);
  const toast = useToastContext();
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [mriDetails] = useState<MRIDetail[]>([
    { id: 1, name: 'NCCT Brain / Head', status: 'pending' }
  ]);
  const [timer, setTimer] = useState<Timer>({
    startTime: null,
    stopTime: null,
    isRunning: false,
    elapsed: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      if (timer.isRunning && timer.startTime) {
        const start = new Date(timer.startTime).getTime();
        const now = new Date().getTime();
        setTimer(prev => ({ ...prev, elapsed: Math.floor((now - start) / 1000) }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  useEffect(() => {
    fetchPatientDetails();
  }, [cro]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/console/patient/${encodeURIComponent(cro)}`);
      const data = await response.json();
      if (data.success && data.data) {
        setPatient(data.data);
      } else {
        toast.error('Patient not found');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Error fetching patient details');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const now = new Date().toISOString();
    setTimer({
      startTime: now,
      stopTime: null,
      isRunning: true,
      elapsed: 0
    });
    toast.success('Timer started');
  };

  const stopTimer = () => {
    const now = new Date().toISOString();
    setTimer(prev => ({
      ...prev,
      stopTime: now,
      isRunning: false
    }));
    toast.success('Timer stopped');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    toast.info('Moving to next patient');
    window.location.href = '/console/dashboard';
  };

  const handlePending = () => {
    toast.warning('Patient marked as pending');
  };

  const handleRecall = () => {
    toast.info('Patient recalled for examination');
  };

  const toggleMRIStatus = (id: number) => {
    // Mock function - would update MRI status in real implementation
    toast.success('MRI status updated');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Not Found</h3>
          <p className="text-gray-500">No patient found with CRO: {cro}</p>
          <button
            onClick={() => window.location.href = '/console/dashboard'}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Console
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/console/dashboard'}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Console</h1>
              <p className="text-purple-100 text-lg">CRO: {patient.cro_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient History Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient History</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Console Date Of Examination</p>
            <p className="text-lg font-bold text-gray-900">{patient.date}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Time</p>
            <p className="text-lg font-bold text-gray-900">{currentTime.toLocaleDateString('en-GB')}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">CRO Number</p>
            <p className="text-lg font-bold text-gray-900">{patient.cro_number}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Name</p>
            <p className="text-lg font-bold text-gray-900">{patient.patient_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium">Age</p>
            <p className="text-lg font-bold text-gray-900">{patient.age} Year</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-sm text-teal-600 font-medium">Refering Physician</p>
            <p className="text-lg font-bold text-gray-900">{patient.doctor_name}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Category</p>
            <p className="text-lg font-bold text-gray-900">{patient.category}</p>
          </div>
        </div>
      </div>

      {/* Timer Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Timer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 font-medium">Start Time</p>
            <p className="text-lg font-bold text-gray-900">
              {timer.startTime ? new Date(timer.startTime).toLocaleTimeString() : '--:--:--'}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-sm text-red-600 font-medium">Stop Time</p>
            <p className="text-lg font-bold text-gray-900">
              {timer.stopTime ? new Date(timer.stopTime).toLocaleTimeString() : '--:--:--'}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-medium">Elapsed Time</p>
            <p className="text-2xl font-bold text-gray-900">{formatTime(timer.elapsed)}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={startTimer}
            disabled={timer.isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            <span>Start</span>
          </button>
          <button
            onClick={stopTimer}
            disabled={!timer.isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <Square className="h-4 w-4" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      {/* MRI Details */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">MRI Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-purple-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-bold">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold">MRI NAME</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {mriDetails.map((mri, index) => (
                <tr key={mri.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-bold">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold">{mri.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleMRIStatus(mri.id)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold hover:bg-yellow-200"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => toggleMRIStatus(mri.id)}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold hover:bg-green-200"
                      >
                        Complete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleNext}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <ArrowRight className="h-5 w-5" />
            <span>Next</span>
          </button>
          
          <button
            onClick={handlePending}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
          >
            <Clock className="h-5 w-5" />
            <span>Pending</span>
          </button>
          
          <button
            onClick={handleRecall}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Recall</span>
          </button>
        </div>
      </div>


    </div>
  );
}