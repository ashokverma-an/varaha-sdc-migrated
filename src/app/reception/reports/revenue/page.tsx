'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Printer, IndianRupee, TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface RevenueData {
  date: string;
  amount: number;
  patients: number;
}

export default function RevenueReport() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchRevenueReport = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: RevenueData[] = [
        { date: '01-08-2025', amount: 45000, patients: 25 },
        { date: '02-08-2025', amount: 52000, patients: 30 },
        { date: '03-08-2025', amount: 38000, patients: 22 },
        { date: '04-08-2025', amount: 61000, patients: 35 },
        { date: '05-08-2025', amount: 47000, patients: 28 }
      ];
      setRevenueData(mockData);
    } catch (error) {
      console.error('Error fetching revenue report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueReport();
  }, [fromDate, toDate]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const totalPatients = revenueData.reduce((sum, item) => sum + item.patients, 0);
  const averageRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  const generatePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Revenue Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .summary-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>VARAHA DIAGNOSTIC CENTER</h1>
          <h2>Revenue Report (${fromDate} to ${toDate})</h2>
        </div>
        
        <div class="summary">
          <div class="summary-card">
            <h3>Total Revenue</h3>
            <p style="font-size: 24px; font-weight: bold;">₹${totalRevenue.toLocaleString()}</p>
          </div>
          <div class="summary-card">
            <h3>Total Patients</h3>
            <p style="font-size: 24px; font-weight: bold;">${totalPatients}</p>
          </div>
          <div class="summary-card">
            <h3>Average Daily Revenue</h3>
            <p style="font-size: 24px; font-weight: bold;">₹${Math.round(averageRevenue).toLocaleString()}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Patients</th>
              <th>Revenue</th>
              <th>Average per Patient</th>
            </tr>
          </thead>
          <tbody>
            ${revenueData.map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${item.patients}</td>
                <td>₹${item.amount.toLocaleString()}</td>
                <td>₹${Math.round(item.amount / item.patients).toLocaleString()}</td>
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Revenue Report</h1>
        <p className="text-green-100 text-lg">Detailed revenue analysis and financial insights</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchRevenueReport}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
          </div>
          
          {revenueData.length > 0 && (
            <button
              onClick={generatePrintReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Report</span>
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating revenue report...</p>
          </div>
        )}

        {revenueData.length > 0 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Patients</p>
                    <p className="text-3xl font-bold text-blue-700">{totalPatients}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Average Daily Revenue</p>
                    <p className="text-3xl font-bold text-purple-700">₹{Math.round(averageRevenue).toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Revenue Trend
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Revenue chart visualization would be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </div>

            {/* Detailed Revenue Table */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Daily Revenue Breakdown</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Patients</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Revenue</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Average per Patient</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((item, index) => {
                    const prevAmount = index > 0 ? revenueData[index - 1].amount : item.amount;
                    const growth = index > 0 ? ((item.amount - prevAmount) / prevAmount * 100) : 0;
                    
                    return (
                      <tr key={item.date} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{item.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.patients}</td>
                        <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">₹{item.amount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">₹{Math.round(item.amount / item.patients).toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {index > 0 && (
                            <span className={`font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-gray-300 px-4 py-2">Total</td>
                    <td className="border border-gray-300 px-4 py-2">{totalPatients}</td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600">₹{totalRevenue.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{Math.round(totalRevenue / totalPatients).toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {!revenueData.length && !loading && (
          <div className="text-center py-12">
            <IndianRupee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Revenue Data</h3>
            <p className="text-gray-500">Select date range above to generate the revenue report.</p>
          </div>
        )}
      </div>
    </div>
  );
}