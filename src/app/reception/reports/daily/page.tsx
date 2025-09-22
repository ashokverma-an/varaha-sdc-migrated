'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, DollarSign } from 'lucide-react';

interface Patient {
  cro: string;
  patient_name: string;
  age: string;
  gender: string;
  category: string;
  contact_number: string;
  amount: number;
  amount_reci: number;
  amount_due: number;
  scan_status: number;
  hospital_name: string;
  doctor_name: string;
}

interface Totals {
  total_amount: number;
  received_amount: number;
  due_amount: number;
  total_patients: number;
  completed_scans: number;
  pending_scans: number;
}

export default function DailyReport() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totals, setTotals] = useState<Totals>({
    total_amount: 0,
    received_amount: 0,
    due_amount: 0,
    total_patients: 0,
    completed_scans: 0,
    pending_scans: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  const fetchDailyReport = async () => {
    setLoading(true);
    try {
      const formattedDate = selectedDate.split('-').reverse().join('-');
      const response = await fetch(`/api/reports/daily?date=${formattedDate}`);
      const data = await response.json();
      setPatients(data.patients || []);
      setTotals(data.totals || {
        total_amount: 0,
        received_amount: 0,
        due_amount: 0,
        total_patients: 0,
        completed_scans: 0,
        pending_scans: 0
      });
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['CRO', 'Patient Name', 'Age', 'Gender', 'Category', 'Hospital', 'Doctor', 'Amount', 'Received', 'Due', 'Status'],
      ...patients.map(p => [
        p.cro,
        p.patient_name,
        p.age,
        p.gender,
        p.category,
        p.hospital_name,
        p.doctor_name,
        p.amount,
        p.amount_reci,
        p.amount_due,
        p.scan_status === 1 ? 'Completed' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Daily Report</h1>
        <p className="text-blue-100 text-lg">Comprehensive daily patient and revenue analysis</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{totals.total_patients}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{totals.total_amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-black">Pending Scans</p>
                <p className="text-2xl font-bold text-orange-600">{totals.pending_scans}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-bold text-black mb-4">Patient Details - {selectedDate}</h2>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-black font-bold">Loading...</p>
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">CRO</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Patient Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Age</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Gender</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Hospital</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Received</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Due</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? patients.map((patient) => (
                  <tr key={patient.cro} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.cro}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.patient_name}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.age}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.gender}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.category}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">{patient.hospital_name}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">₹{patient.amount}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">₹{patient.amount_reci}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">₹{patient.amount_due}</td>
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
                )) : (
                  <tr>
                    <td colSpan={10} className="border border-gray-300 px-6 py-8 text-center text-black font-bold text-lg">
                      No patients found for selected date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-bold text-black">Total Amount</p>
            <p className="text-xl font-bold text-blue-600">₹{totals.total_amount.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-bold text-black">Received Amount</p>
            <p className="text-xl font-bold text-green-600">₹{totals.received_amount.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm font-bold text-black">Due Amount</p>
            <p className="text-xl font-bold text-red-600">₹{totals.due_amount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}