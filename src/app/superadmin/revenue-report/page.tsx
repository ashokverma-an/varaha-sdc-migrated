'use client';

import { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import SuperAdminLayout, { Card, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Button, Pagination } from '@/components/SuperAdminLayout';

interface RevenueData {
  cro: string;
  patient_name: string;
  age: string;
  category: string;
  scan_type: string;
  amount: number;
  date: string;
  number_films: number;
  number_contrast: number;
  number_scan: number;
  issue_cd: string;
  added_on: string;
}

const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

export default function RevenueReport() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [filteredData, setFilteredData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Set default dates: from one year ago to today
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const [dateFilter, setDateFilter] = useState({
    from_date: oneYearAgo.toISOString().split('T')[0],
    to_date: today.toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateFilter]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from_date: dateFilter.from_date,
        to_date: dateFilter.to_date
      });
      
      const response = await fetch(`https://varahasdc.co.in/api/superadmin/revenue-report?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.data || []);
        setFilteredData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = revenueData;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [revenueData, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRevenue = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  const uniqueCategories = [...new Set(revenueData.map(item => item.category))].filter(Boolean);

  const handleSearch = () => {
    fetchRevenueData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownloadExcel = () => {
    const headers = ['S.No', 'CRO', 'Patient Name', 'Age', 'Category', 'Scan Type', 'Films', 'Scans', 'Amount'];
    
    // Create HTML table with styling
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            th { background-color: #4472C4; color: white; font-weight: bold; padding: 8px; border: 1px solid #ccc; text-align: center; }
            td { padding: 6px; border: 1px solid #ccc; text-align: left; }
            .number { text-align: right; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center; color: #4472C4;">Revenue Report (${dateFilter.from_date} to ${dateFilter.to_date})</h2>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((item, index) => `
                <tr>
                  <td class="center">${index + 1}</td>
                  <td class="center">${item.cro}</td>
                  <td>${item.patient_name}</td>
                  <td class="center">${item.age}</td>
                  <td class="center">${item.category}</td>
                  <td>${item.scan_type}</td>
                  <td class="center">${item.number_films}</td>
                  <td class="center">${item.number_scan}</td>
                  <td class="number">₹${item.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Revenue-Report-${dateFilter.from_date}-to-${dateFilter.to_date}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SuperAdminLayout 
      title="Revenue Report" 
      subtitle="Console Revenue Analysis"
      actions={
        <Button onClick={handleDownloadExcel} variant="success">
          <Download className="h-4 w-4 mr-2" />
          Download Excel
        </Button>
      }
    >
      <div className="space-y-4">

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateFilter.from_date}
              onChange={(e) => setDateFilter(prev => ({ ...prev, from_date: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateFilter.to_date}
              onChange={(e) => setDateFilter(prev => ({ ...prev, to_date: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search CRO or Patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Data</h2>
            <span className="text-sm text-gray-500">{filteredData.length} records</span>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableHeaderCell>S. No.</TableHeaderCell>
            <TableHeaderCell>CRO</TableHeaderCell>
            <TableHeaderCell>Patient Name</TableHeaderCell>
            <TableHeaderCell>Age</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Scan Type</TableHeaderCell>
            <TableHeaderCell>Films</TableHeaderCell>
            <TableHeaderCell>Scans</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="text-center" colSpan={9}>Loading...</TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={9}>No revenue data found</TableCell>
              </TableRow>
            ) : (
              paginatedRevenue.map((revenue, index) => (
                <TableRow key={revenue.cro}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium text-blue-600">{revenue.cro}</TableCell>
                  <TableCell>{revenue.patient_name}</TableCell>
                  <TableCell>{revenue.age}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {revenue.category}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{revenue.scan_type}</TableCell>
                  <TableCell>{revenue.number_films}</TableCell>
                  <TableCell>{revenue.number_scan}</TableCell>
                  <TableCell className="font-medium text-green-600">₹{revenue.amount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Card>
      </div>
    </SuperAdminLayout>
  );
}