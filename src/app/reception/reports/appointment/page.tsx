'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Filter, Printer, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Appointment {
  id: number;
  cro: string;
  patient_name: string;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  category: string;
  amount: number;
}

export default function AppointmentReport() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: Appointment[] = [
        {
          id: 1,
          cro: 'VDC/01-08-2025/001',
          patient_name: 'John Doe',
          doctor_name: 'Dr. Smith',
          hospital_name: 'City Hospital',
          appointment_date: selectedDate,
          appointment_time: '09:00',
          status: 'completed',
          category: 'MRI',
          amount: 2500
        },
        {
          id: 2,
          cro: 'VDC/01-08-2025/002',
          patient_name: 'Jane Smith',
          doctor_name: 'Dr. Johnson',
          hospital_name: 'General Hospital',
          appointment_date: selectedDate,
          appointment_time: '10:30',
          status: 'scheduled',
          category: 'CT Scan',
          amount: 1800
        },
        {
          id: 3,
          cro: 'VDC/01-08-2025/003',
          patient_name: 'Bob Wilson',
          doctor_name: 'Dr. Brown',
          hospital_name: 'Medical Center',
          appointment_date: selectedDate,
          appointment_time: '14:00',
          status: 'pending',
          category: 'X-Ray',
          amount: 800
        }
      ];
      setAppointments(mockData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const filteredAppointments = appointments.filter(appointment => 
    statusFilter === 'all' || appointment.status === statusFilter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const statusCounts = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  const generatePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Appointment Report - ${selectedDate}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .summary-card { border: 1px solid #ddd; padding: 10px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f0f0f0; }
          .status { padding: 2px 6px; border-radius: 4px; font-size: 10px; }
          .completed { background-color: #dcfce7; color: #166534; }
          .scheduled { background-color: #dbeafe; color: #1d4ed8; }
          .pending { background-color: #fef3c7; color: #92400e; }
          .cancelled { background-color: #fee2e2; color: #dc2626; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>VARAHA DIAGNOSTIC CENTER</h1>
          <h2>Appointment Report - ${selectedDate}</h2>
        </div>
        
        <div class="summary">
          <div class="summary-card">
            <h4>Total</h4>
            <p style="font-size: 20px; font-weight: bold;">${statusCounts.total}</p>
          </div>
          <div class="summary-card">
            <h4>Scheduled</h4>
            <p style="font-size: 20px; font-weight: bold;">${statusCounts.scheduled}</p>
          </div>
          <div class="summary-card">
            <h4>Completed</h4>
            <p style="font-size: 20px; font-weight: bold;">${statusCounts.completed}</p>
          </div>
          <div class="summary-card">
            <h4>Pending</h4>
            <p style="font-size: 20px; font-weight: bold;">${statusCounts.pending}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>CRO</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Hospital</th>
              <th>Time</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAppointments.map(appointment => `
              <tr>
                <td>${appointment.cro}</td>
                <td>${appointment.patient_name}</td>
                <td>${appointment.doctor_name}</td>
                <td>${appointment.hospital_name}</td>
                <td>${appointment.appointment_time}</td>
                <td>${appointment.category}</td>
                <td>₹${appointment.amount.toLocaleString()}</td>
                <td><span class="status ${appointment.status}">${appointment.status.toUpperCase()}</span></td>
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Appointment Report</h1>
        <p className="text-purple-100 text-lg">Track and manage patient appointments and schedules</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={fetchAppointments}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {appointments.length > 0 && (
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="space-y-6">
            {/* Status Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total</p>
                    <p className="text-2xl font-bold text-gray-700">{statusCounts.total}</p>
                  </div>
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Scheduled</p>
                    <p className="text-2xl font-bold text-blue-700">{statusCounts.scheduled}</p>
                  </div>
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{statusCounts.completed}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</p>
                  </div>
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">CRO</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Hospital</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">{appointment.cro}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.patient_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.doctor_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.hospital_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.appointment_time}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.category}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">₹{appointment.amount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appointment.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!appointments.length && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-500">No appointments scheduled for the selected date.</p>
          </div>
        )}
      </div>
    </div>
  );
}