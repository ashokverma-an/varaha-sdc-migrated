'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Printer, Users, IndianRupee, TrendingUp, Hospital } from 'lucide-react';

interface DailyReportData {
  date: string;
  summary: {
    totalPatients: number;
    totalAmount: number;
    averageAmount: number;
  };
  patients: Array<{
    cro: string;
    patient_name: string;
    amount: number;
    category: string;
    hospital_name: string;
    doctor_name: string;
    date: string;
  }>;
  hospitalStats: Record<string, { count: number; amount: number }>;
  doctorStats: Record<string, { count: number; amount: number }>;
}

export default function DailyReport() {
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDailyReport = async () => {
    setLoading(true);
    try {
      const [day, month, year] = selectedDate.split('-').reverse();
      const formattedDate = `${day}-${month}-${year}`;
      
      const response = await fetch(`/api/reports/daily?date=${formattedDate}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  const generatePrintReport = () => {
    if (!reportData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daily Report - ${reportData.date}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .summary-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f0f0f0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>VARAHA DIAGNOSTIC CENTER</h1>
          <h2>Daily Report - ${reportData.date}</h2>
        </div>
        
        <div class="summary">
          <div class="summary-card">
            <h3>Total Patients</h3>
            <p style="font-size: 24px; font-weight: bold;">${reportData.summary.totalPatients}</p>
          </div>
          <div class="summary-card">
            <h3>Total Amount</h3>
            <p style="font-size: 24px; font-weight: bold;">₹${reportData.summary.totalAmount.toLocaleString()}</p>
          </div>
          <div class="summary-card">
            <h3>Average Amount</h3>
            <p style="font-size: 24px; font-weight: bold;">₹${Math.round(reportData.summary.averageAmount).toLocaleString()}</p>
          </div>
        </div>

        <h3>Patient Details</h3>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>CRO</th>
              <th>Patient Name</th>
              <th>Hospital</th>
              <th>Doctor</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.patients.map((patient, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${patient.cro}</td>
                <td>${patient.patient_name}</td>
                <td>${patient.hospital_name || '-'}</td>
                <td>${patient.doctor_name || '-'}</td>
                <td>${patient.category || '-'}</td>
                <td>₹${patient.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <p style="text-align: center; margin-top: 30px; font-size: 12px;">
          Generated on: ${new Date().toLocaleString()}
        </p>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Daily Report</h1>
        <p className="text-blue-100 text-lg">Comprehensive daily patient and revenue analysis</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={fetchDailyReport}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
          </div>
          
          {reportData && (
            <button
              onClick={generatePrintReport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Report</span>
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating daily report...</p>
          </div>
        )}

        {reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Patients</p>
                    <p className="text-3xl font-bold text-blue-700">{reportData.summary.totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-700">₹{reportData.summary.totalAmount.toLocaleString()}</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Average Amount</p>
                    <p className="text-3xl font-bold text-purple-700">₹{Math.round(reportData.summary.averageAmount).toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Patient Details Table */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">CRO</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Hospital</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.patients.map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{patient.cro}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.patient_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.hospital_name || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.doctor_name || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.category || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">₹{patient.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hospital & Doctor Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Hospital-wise Statistics</h3>
                <div className="space-y-2">
                  {Object.entries(reportData.hospitalStats).map(([hospital, stats]) => (
                    <div key={hospital} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{hospital}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{stats.count} patients</div>
                        <div className="font-bold">₹{stats.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Doctor-wise Statistics</h3>
                <div className="space-y-2">
                  {Object.entries(reportData.doctorStats).map(([doctor, stats]) => (
                    <div key={doctor} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{doctor}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{stats.count} patients</div>
                        <div className="font-bold">₹{stats.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!reportData && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Date for Report</h3>
            <p className="text-gray-500">Choose a date above to generate the daily report.</p>
          </div>
        )}
      </div>
    </div>
  );
}