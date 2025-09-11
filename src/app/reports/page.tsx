'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { FileText, Calendar, Download, Filter, BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('daily');

  const reportTypes = [
    { id: 'daily', name: 'Daily Report', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { id: 'patient', name: 'Patient Report', icon: Users, color: 'from-violet-500 to-violet-600' },
    { id: 'appointment', name: 'Appointment Report', icon: FileText, color: 'from-amber-500 to-amber-600' }
  ];

  const generateReport = () => {
    console.log('Generating report:', { reportType, dateRange });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and insights</p>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  reportType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-xl`
                    : 'bg-white hover:shadow-lg border-gray-200'
                }`}
              >
                <IconComponent className={`h-8 w-8 mb-3 ${reportType === type.id ? 'text-white' : 'text-gray-600'}`} />
                <h3 className={`font-semibold ${reportType === type.id ? 'text-white' : 'text-gray-900'}`}>
                  {type.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Report Configuration */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Report Configuration</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Generate Report</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Report Data */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Report Preview</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Patients</p>
                  <p className="text-3xl font-bold text-blue-900">1,234</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-emerald-900">₹2,45,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-600 text-sm font-medium">Growth Rate</p>
                  <p className="text-3xl font-bold text-violet-900">+12.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Patients</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">2024-01-{15+i}</td>
                    <td className="py-3 px-4 text-gray-900">{20+i*3}</td>
                    <td className="py-3 px-4 text-gray-900">₹{(15000+i*2000).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        GEN / Paid
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}