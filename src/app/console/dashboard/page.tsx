'use client';

import { useState, useEffect } from 'react';
import { Monitor, Users, Clock, Activity, IndianRupee, Calendar, ArrowUpRight, ArrowDownRight, Search, Eye, FileText } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface ConsoleStats {
  todayPatients: number;
  totalPatients: number;
  totalRevenue: number;
  todayRevenue: number;
  todayWithdraw: number;
  cashInHand: number;
  lastMonthRevenue: number;
  currentMonthRevenue: number;
}

interface Patient {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: string;
  gender: string;
  mobile: string;
  hospital_name: string;
  doctor_name: string;
  category: string;
  amount: number;
  scan_status: number;
  date: string;
}

function PatientQueue() {
  const toast = useToastContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const response = await fetch(`https://varahasdc.co.in/api/admin/patient-list?from_date=${today}&to_date=${today}`);
      const data = await response.json();
      setPatients(data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Error fetching patient queue');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cro_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mobile.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const viewPatient = (cro: string) => {
    window.location.href = `/console/patient/${encodeURIComponent(cro)}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient In Queue</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient queue...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-purple-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">S.No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">CRO</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Patient Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Age/Gender</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Mobile</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Hospital</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Doctor</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient, index) => (
                  <tr key={patient.p_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{startIndex + index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => viewPatient(patient.cro_number)}
                        className="font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                      >
                        {patient.cro_number}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.patient_name}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.age}, {patient.gender}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.mobile}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.hospital_name}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.doctor_name}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">₹{patient.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        patient.scan_status === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {patient.scan_status === 1 ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => viewPatient(patient.cro_number)}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedPatients.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients in Queue</h3>
                <p className="text-gray-500">No patients found for today.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ConsoleDashboard() {
  const [stats, setStats] = useState<ConsoleStats>({
    todayPatients: 0,
    totalPatients: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    todayWithdraw: 0,
    cashInHand: 0,
    lastMonthRevenue: 0,
    currentMonthRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          todayPatients: data.todayPatients || 0,
          totalPatients: data.totalPatients || 0,
          totalRevenue: data.totalRevenue || 0,
          todayRevenue: data.todayRevenue || 0,
          todayWithdraw: data.todayWithdraw || 0,
          cashInHand: data.cashInHand || 0,
          lastMonthRevenue: 12060870,
          currentMonthRevenue: 9331810
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Console Dashboard</h1>
              <p className="text-purple-100 text-lg">Varaha Diagnostic Center - Console Panel</p>
              <div className="flex items-center mt-3 text-purple-200">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Monitor className="h-8 w-8 text-white mb-2" />
                <p className="text-sm text-purple-100">Live Console</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Queue Table */}
      <PatientQueue />
    </div>
  );
}