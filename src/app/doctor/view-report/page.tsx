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
  doctor_name: string;
  n_patient_ct: string;
  n_patient_ct_report_date: string;
  n_patient_ct_remark: string;
  n_patient_x_ray: string;
  n_patient_x_ray_report_date: string;
  n_patient_x_ray_remark: string;
  date: string;
  allot_date: string;
  amount: number;
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
      
      // Create workbook with formatted headers
      const wb = XLSX.utils.book_new();
      
      // Header row with company info
      const headerData = [
        ['VARAHA DIAGNOSTIC CENTER'],
        ['COMPLETED REPORTS - ' + new Date().toLocaleDateString()],
        [''],
        ['S.No', 'CRO', 'Patient Name', 'Doctor Name', 'Ct-Scan', 'Ct-Scan Report Date', 'Ct-Scan Review', 'X-Ray Film', 'X-Ray Film Date', 'X-Ray Film Review']
      ];
      
      // Add data rows
      const exportData = allReports.map((report: CompletedReport, index: number) => [
        index + 1,
        report.cro,
        report.patient_name,
        report.doctor_name || '-',
        report.n_patient_ct,
        formatDate(report.n_patient_ct_report_date),
        report.n_patient_ct_remark || '-',
        report.n_patient_x_ray,
        formatDate(report.n_patient_x_ray_report_date),
        report.n_patient_x_ray_remark || '-'
      ]);
      

      
      const allData = [...headerData, ...exportData];
      const ws = XLSX.utils.aoa_to_sheet(allData);
      
      // Style the header
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      
      // Merge title cells
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }
      ];
      
      // Set column widths
      ws['!cols'] = [
        { width: 8 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 12 },
        { width: 15 }, { width: 30 }, { width: 12 }, { width: 15 }, { width: 30 }
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-50">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">S.No</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">CRO</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Patient Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Doctor Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Ct-Scan</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Ct-Scan Report Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Ct-Scan Review</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">X-Ray Film</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">X-Ray Film Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">X-Ray Film Review</th>
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
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.doctor_name || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.n_patient_ct}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(report.n_patient_ct_report_date)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.n_patient_ct_remark || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.n_patient_x_ray}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(report.n_patient_x_ray_report_date)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{report.n_patient_x_ray_remark || '-'}</td>
                </tr>
              ))}
            </tbody>

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
  );
}