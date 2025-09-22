'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Stethoscope, Users, IndianRupee, FileText } from 'lucide-react';

interface DoctorReport {
  doctor_name: string;
  total_patients: number;
  total_amount: number;
  completed_scans: number;
  pending_scans: number;
  patients: Array<{
    cro: string;
    patient_name: string;
    age: string;
    gender: string;
    amount: number;
    scan_status: number;
    hospital_name: string;
    category: string;
  }>;
}

export default function DoctorDailyReport() {
  const [doctorReports, setDoctorReports] = useState<DoctorReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDoctorReport();
  }, [selectedDate]);

  const fetchDoctorReport = async () => {
    setLoading(true);
    try {
      const formattedDate = selectedDate.split('-').reverse().join('-');
      const response = await fetch(`/api/reports/doctor-daily?date=${formattedDate}`);
      const data = await response.json();
      setDoctorReports(data.data || []);
    } catch (error) {
      console.error('Error fetching doctor report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Doctor', 'CRO', 'Patient Name', 'Age', 'Gender', 'Hospital', 'Category', 'Amount', 'Status'],
      ...doctorReports.flatMap(doctor => 
        doctor.patients.map(patient => [
          doctor.doctor_name,
          patient.cro,
          patient.patient_name,
          patient.age,
          patient.gender,
          patient.hospital_name,
          patient.category,
          patient.amount,
          patient.scan_status === 1 ? 'Completed' : 'Pending'
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor-report-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPatients = doctorReports.reduce((sum, doctor) => sum + doctor.total_patients, 0);
  const totalAmount = doctorReports.reduce((sum, doctor) => sum + doctor.total_amount, 0);
  const totalCompleted = doctorReports.reduce((sum, doctor) => sum + doctor.completed_scans, 0);
  const totalPending = doctorReports.reduce((sum, doctor) => sum + doctor.pending_scans, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Doctor Daily Report</h1>
        <p className="text-blue-100 text-lg">Doctor-wise patient analysis and performance metrics</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-bold"
            />
          </div>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2 inline" />
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center">
              <IndianRupee className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-emerald-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{totalCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{totalPending}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-black font-bold">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {doctorReports.map((doctor, doctorIndex) => (
              <div key={doctorIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Stethoscope className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-bold text-black">Dr. {doctor.doctor_name}</h3>
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-blue-600">{doctor.total_patients}</p>
                        <p className="text-gray-600">Patients</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-600">₹{doctor.total_amount.toLocaleString()}</p>
                        <p className="text-gray-600">Amount</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-600">{doctor.completed_scans}</p>
                        <p className="text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-orange-600">{doctor.pending_scans}</p>
                        <p className="text-gray-600">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">S.No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">CRO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Patient Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Age</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Gender</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Hospital</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Category</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Amount</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctor.patients.map((patient, patientIndex) => (
                        <tr key={patientIndex} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patientIndex + 1}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.cro}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.patient_name}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.age}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.gender}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.hospital_name}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.category}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {doctorReports.length === 0 && (
              <div className="text-center py-12">
                <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctor Reports</h3>
                <p className="text-gray-500">No doctor reports found for the selected date.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}