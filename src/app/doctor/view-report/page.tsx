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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCompletedReports(1);
  }, []);

  const fetchCompletedReports = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString()
      });
      
      if (dateFilter) params.append('date', dateFilter);
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/doctor/completed-reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
        setTotalRecords(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        setCurrentPage(page);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching completed reports:', error);
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

  const totalAmount = reports.reduce((sum, report) => sum + (report.amount || 0), 0);

  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Fetch all data for export
      const params = new URLSearchParams({
        page: '1',
        limit: '10000', // Get all records
        export: 'true'
      });
      
      if (dateFilter) params.append('date', dateFilter);
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/doctor/completed-reports?${params}`);
      const data = await response.json();
      const allReports = data.data || [];
      
      const totalAmount = allReports.reduce((sum: number, report: CompletedReport) => sum + (report.amount || 0), 0);
      
      // Create workbook with formatted headers
      const wb = XLSX.utils.book_new();
      
      // Header row with company info
      const headerData = [
        ['VARAHA DIAGNOSTIC CENTER'],
        ['COMPLETED REPORTS - ' + new Date().toLocaleDateString()],
        [''],
        ['S.No', 'CRO Number', 'Patient Name', 'Age', 'Gender', 'Mobile', 'Doctor Name', 'Hospital Name', 'Scan Type', 'Date', 'Allot Date', 'Amount', 'Category', 'Remark', 'Report Date']
      ];
      
      // Add data rows
      const exportData = allReports.map((report: CompletedReport, index: number) => [
        index + 1,
        report.cro,
        report.patient_name,
        report.age,
        report.gender,
        report.mobile,
        report.doctor_name || '-',
        report.hospital_name || '-',
        report.scan_name || '-',
        formatDate(report.date),
        formatDate(report.allot_date),
        report.amount || 0,
        report.category || '-',
        report.remark || '-',
        formatDate(report.added_on)
      ]);
      
      // Add total row
      exportData.push([
        '', '', '', '', '', '', '', '', '', '', 'TOTAL', totalAmount, '', '', ''
      ]);
      
      const allData = [...headerData, ...exportData];
      const ws = XLSX.utils.aoa_to_sheet(allData);
      
      // Style the header
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      
      // Merge title cells
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 14 } }
      ];
      
      // Set column widths
      ws['!cols'] = [
        { width: 8 }, { width: 15 }, { width: 20 }, { width: 8 }, { width: 10 },
        { width: 12 }, { width: 20 }, { width: 25 }, { width: 15 }, { width: 12 },
        { width: 12 }, { width: 12 }, { width: 15 }, { width: 30 }, { width: 12 }
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Completed Reports');
      
      const fileName = `completed_reports_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
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
              onClick={() => fetchCompletedReports(1)}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Loading...' : 'Search'}</span>
            </button>
            
            <button
              onClick={exportToExcel}
              disabled={exporting || totalRecords === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{exporting ? 'Exporting...' : 'Excel'}</span>
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Records: {totalRecords} | Page {currentPage} of {totalPages}</span>
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
              {reports.map((report, index) => (
                <tr key={report.patient_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
            {reports.length > 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={11} className="border border-gray-300 px-3 py-2 text-sm text-right">TOTAL:</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">₹{totalAmount.toLocaleString()}</td>
                  <td colSpan={3} className="border border-gray-300 px-3 py-2 text-sm"></td>
                </tr>
              </tfoot>
            )}
          </table>
          
          {reports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading completed reports...' : 'No completed reports found'}
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => fetchCompletedReports(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => fetchCompletedReports(page)}
                    disabled={loading}
                    className={`px-3 py-2 rounded ${
                      page === currentPage
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => fetchCompletedReports(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}