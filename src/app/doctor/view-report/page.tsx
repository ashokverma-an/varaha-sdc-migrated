'use client';

import { useState, useEffect } from 'react';
import { Eye, Search, Download, Calendar, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

interface CompletedReport {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  scan_name: string;
  doctor_name: string;
  hospital_name: string;
  date: string;
  allot_date: string;
  amount: number;
  category: string;
  remark: string;
  c_status: number;
  added_on: string;
}

export default function ViewReport() {
  const [reports, setReports] = useState<CompletedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchCompletedReports();
  }, []);

  const fetchCompletedReports = async () => {
    try {
      const response = await fetch('/api/doctor/completed-reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
      }
    } catch {
      console.error('Error fetching completed reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0000-00-00') return '-';
    try {
      let date;
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          date = new Date(dateString);
        } else {
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return '-';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return '-';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || report.date === dateFilter;
    
    let matchesDateRange = true;
    if (fromDate && toDate) {
      const reportDate = new Date(report.date);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      matchesDateRange = reportDate >= from && reportDate <= to;
    }
    
    return matchesSearch && matchesDate && matchesDateRange;
  });

  const totalAmount = filteredReports.reduce((sum, report) => sum + (report.amount || 0), 0);

  const exportToExcel = () => {
    const exportData = filteredReports.map((report, index) => ({
      'S.No': index + 1,
      'CRO Number': report.cro,
      'Patient Name': report.patient_name,
      'Age': report.age,
      'Gender': report.gender,
      'Mobile': report.mobile,
      'Doctor Name': report.doctor_name || '-',
      'Hospital Name': report.hospital_name || '-',
      'Scan Type': report.scan_name || '-',
      'Date': formatDate(report.date),
      'Allot Date': formatDate(report.allot_date),
      'Amount': report.amount || 0,
      'Category': report.category || '-',
      'Remark': report.remark || '-',
      'Report Date': formatDate(report.added_on)
    }));

    // Add total row
    exportData.push({
      'S.No': '' as any,
      'CRO Number': '',
      'Patient Name': '',
      'Age': '' as any,
      'Gender': '',
      'Mobile': '',
      'Doctor Name': '',
      'Hospital Name': '',
      'Scan Type': '',
      'Date': '',
      'Allot Date': 'TOTAL',
      'Amount': totalAmount,
      'Category': '',
      'Remark': '',
      'Report Date': ''
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Completed Reports');
    
    const fileName = `completed_reports_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">View Report</h1>
        <div className="flex items-center space-x-2">
          <Eye className="h-6 w-6 text-green-600" />
          <span className="text-lg font-medium text-gray-700">Completed Reports</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Search by CRO or Patient Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="date"
              placeholder="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="date"
              placeholder="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={fetchCompletedReports}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Loading...' : 'Search'}</span>
            </button>
            
            <button
              onClick={exportToExcel}
              disabled={filteredReports.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Records: {filteredReports.length}</span>
          <span className="text-gray-600 font-medium">Total Amount: ₹{totalAmount.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-50">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">S.No</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">CRO Number</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Patient Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Age</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Gender</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Mobile</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Doctor Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Hospital Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Scan Type</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Allot Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Category</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Remark</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Report Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={report.patient_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-sm">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-blue-600">
                    {report.cro}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.patient_name}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.age}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.gender}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.mobile}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.doctor_name || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.hospital_name || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.scan_name || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(report.date)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(report.allot_date)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">₹{(report.amount || 0).toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.category || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.remark || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(report.added_on)}</td>
                </tr>
              ))}
            </tbody>
            {filteredReports.length > 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={11} className="border border-gray-300 px-3 py-2 text-sm text-right">TOTAL:</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">₹{totalAmount.toLocaleString()}</td>
                  <td colSpan={3} className="border border-gray-300 px-3 py-2 text-sm"></td>
                </tr>
              </tfoot>
            )}
          </table>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading completed reports...' : 'No completed reports found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}