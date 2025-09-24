'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Eye, FileText, Send, User, Calendar, Phone, MapPin, X } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface Patient {
  patient_id: number;
  cro: string;
  pre: string;
  patient_name: string;
  age: string;
  gender: string;
  doctor_name: string;
  hospital_id: string;
  amount_due: number;
  amount_reci: number;
  scan_status: number;
  date: string;
  dname?: string;
  h_name?: string;
}

interface SendToData {
  destination: 'Nursing' | 'Console';
  cro: string;
}

export default function PatientRegistrationEdit() {
  const toast = useToastContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sendToData, setSendToData] = useState<SendToData>({ destination: 'Nursing', cro: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Fetch today's patients with scan_status != 1
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching patients for date:', today);
      const response = await fetch(`/api/admin/patients/edit?date=${today}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        setPatients(data.data || []);
      } else {
        console.error('Failed to fetch patients:', response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTo = (patient: Patient) => {
    setSelectedPatient(patient);
    setSendToData({ destination: 'Nursing', cro: patient.cro });
    setShowSendModal(true);
  };

  const submitSendTo = async () => {
    try {
      const response = await fetch('/api/admin/patients/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendToData)
      });
      
      if (response.ok) {
        toast.error(`Patient sent to ${sendToData.destination} successfully!`);
        setShowSendModal(false);
        fetchPatients(); // Refresh list
      }
    } catch (error) {
      toast.error('Error sending patient');
    }
  };

  const getStatusButton = (patient: Patient) => {
    const isDue = patient.amount_due > 0;
    const status = patient.scan_status;
    
    let buttonText = '';
    let disabled = isDue;
    let buttonColor = 'bg-blue-600 hover:bg-blue-700';

    switch (status) {
      case 0:
        buttonText = 'Awaiting For Process';
        buttonColor = 'bg-blue-600 hover:bg-blue-700';
        break;
      case 2:
        buttonText = 'Stand In Corridor Queue';
        disabled = true;
        buttonColor = 'bg-gray-500';
        break;
      case 3:
        buttonText = 'Recall';
        buttonColor = 'bg-orange-600 hover:bg-orange-700';
        break;
      case 4:
        buttonText = 'Pending';
        buttonColor = 'bg-yellow-600 hover:bg-yellow-700';
        break;
      default:
        buttonText = 'Unknown Status';
        buttonColor = 'bg-gray-600';
    }

    if (status === 2) {
      disabled = true;
    }

    return (
      <button
        onClick={() => !disabled && handleSendTo(patient)}
        disabled={disabled}
        className={`px-2 py-1 rounded text-xs font-medium text-white ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : buttonColor
        } transition-colors`}
      >
        {buttonText}
      </button>
    );
  };

  const getAmountStatus = (patient: Patient) => {
    if (patient.amount_due === 0) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          No Due
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Due
        </span>
      );
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Edit Patient Registration</h1>
        <p className="text-blue-100 text-lg">Manage and edit registered patient information</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-black mb-2">Search Patient to Edit</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by CRO or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              />
            </div>
            <button
              onClick={fetchPatients}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-300 bg-white">
            <h3 className="text-lg font-semibold text-black">Registered Patient List</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold uppercase">S. No.</th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold uppercase">CRO No.</th>
                  <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold uppercase">Name</th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold uppercase">Amount Status</th>
                  <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold uppercase">Doctor Name</th>
                  <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold uppercase">Hospital Name</th>
                  <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedPatients.map((patient, index) => (
                  <tr key={patient.patient_id} className="hover:bg-gray-100 even:bg-gray-50">
                    <td className="border border-gray-400 px-3 py-2 text-center text-sm text-black">{startIndex + index + 1}</td>
                    <td className="border border-gray-400 px-3 py-2 text-center text-sm font-semibold text-black">{patient.cro}</td>
                    <td className="border border-gray-400 px-3 py-2 text-sm font-semibold text-black">{patient.pre}{patient.patient_name}</td>
                    <td className="border border-gray-400 px-3 py-2 text-center text-sm">{getAmountStatus(patient)}</td>
                    <td className="border border-gray-400 px-3 py-2 text-sm text-black">{patient.dname || '-'}</td>
                    <td className="border border-gray-400 px-3 py-2 text-sm text-black">{patient.h_name || '-'}</td>
                    <td className="border border-gray-400 px-3 py-2 text-sm">
                      <div className="flex flex-col space-y-1">
                        <div className="mb-1">
                          {getStatusButton(patient)}
                        </div>
                        <div className="flex space-x-1 justify-center">
                          <a href={`/reception/patient-registration/new?edit=${patient.patient_id}`}>
                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded border border-blue-300 text-xs" title="Edit Client">
                              <Edit className="h-3 w-3" />
                            </button>
                          </a>
                          <a href={`/reception/patient-registration/payment/${patient.patient_id}`}>
                            <button className="p-1 text-green-600 hover:bg-green-100 rounded border border-green-300 text-xs" title="View Payment Detail">
                              <FileText className="h-3 w-3" />
                            </button>
                          </a>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded border border-red-300 text-xs" title="View Invoice">
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedPatients.length === 0 && (
            <div className="text-center py-12 bg-white">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No Patients Found</h3>
              <p className="text-black">
                {loading ? 'Loading patients...' : 'No registered patients found for today.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-400 bg-white flex items-center justify-between">
              <div className="text-sm text-black">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 text-black bg-white hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded font-medium">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 text-black bg-white hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send To Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Send To</h3>
                <button onClick={() => setShowSendModal(false)} className="text-white hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Send patient <strong>{selectedPatient?.cro}</strong> to:
                </p>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="destination"
                      value="Nursing"
                      checked={sendToData.destination === 'Nursing'}
                      onChange={(e) => setSendToData(prev => ({ ...prev, destination: e.target.value as 'Nursing' }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Nursing</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="destination"
                      value="Console"
                      checked={sendToData.destination === 'Console'}
                      onChange={(e) => setSendToData(prev => ({ ...prev, destination: e.target.value as 'Console' }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Console</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={submitSendTo}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit</span>
                </button>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}