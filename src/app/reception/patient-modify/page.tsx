'use client';

import { useState, useEffect } from 'react';
import { Search, Save, User, Calendar, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface Patient {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: string;
  gender: string;
  mobile: string;
  hospital_name: string;
  doctor_name: string;
  category: string;
  amount: number;
  scan_status: number;
  allot_date: string;
  allot_time: string;
  scan_type: string;
  remark: string;
}

export default function PatientModify() {
  const toast = useToastContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    allot_date: '',
    allot_time: '',
    scan_type: '',
    remark: '',
    scan_status: 0
  });

  useEffect(() => {
    fetchPatients();
  }, [selectedDate]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const formattedDate = selectedDate.split('-').reverse().join('-');
      const response = await fetch(`https://varahasdc.co.in/api/admin/patient-list?from_date=${formattedDate}&to_date=${formattedDate}`);
      const data = await response.json();
      setPatients(data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Error fetching patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cro_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mobile.includes(searchTerm)
  );

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      allot_date: patient.allot_date || '',
      allot_time: patient.allot_time || '',
      scan_type: patient.scan_type || '',
      remark: patient.remark || '',
      scan_status: patient.scan_status || 0
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    setLoading(true);
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${editingPatient.p_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Patient scan details updated successfully!');
        setEditingPatient(null);
        fetchPatients();
      } else {
        toast.error('Error updating patient');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating patient');
    } finally {
      setLoading(false);
    }
  };

  const toggleScanStatus = async (patient: Patient) => {
    const newStatus = patient.scan_status === 1 ? 0 : 1;
    
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${patient.p_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scan_status: newStatus })
      });

      if (response.ok) {
        toast.success(`Scan status ${newStatus === 1 ? 'completed' : 'pending'}`);
        fetchPatients();
      } else {
        toast.error('Error updating scan status');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating scan status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Patient Scan Management</h1>
        <p className="text-blue-100 text-lg">Manage patient scan details and status</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, CRO, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">CRO</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Age/Gender</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Mobile</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hospital</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Allot Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Allot Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Scan Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.p_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{patient.cro_number}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.patient_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.age}, {patient.gender}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.mobile}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.hospital_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.allot_date || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.allot_time || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{patient.scan_type || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => toggleScanStatus(patient)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          patient.scan_status === 1
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {patient.scan_status === 1 ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Edit Scan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
                <p className="text-gray-500">No patients found for the selected date.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Scan Details</h3>
              <button
                onClick={() => setEditingPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Patient: {editingPatient.patient_name}</p>
              <p className="text-sm text-gray-600">CRO: {editingPatient.cro_number}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Allotment Date
                </label>
                <input
                  type="date"
                  value={formData.allot_date}
                  onChange={(e) => setFormData({...formData, allot_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Allotment Time
                </label>
                <input
                  type="time"
                  value={formData.allot_time}
                  onChange={(e) => setFormData({...formData, allot_time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
                <input
                  type="text"
                  value={formData.scan_type}
                  onChange={(e) => setFormData({...formData, scan_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter scan type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scan Status</label>
                <select
                  value={formData.scan_status}
                  onChange={(e) => setFormData({...formData, scan_status: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Pending</option>
                  <option value={1}>Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData({...formData, remark: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter remarks"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}