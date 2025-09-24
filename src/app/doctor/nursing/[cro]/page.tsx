'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, FileText, Save, Printer } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';

interface PatientDetail {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: string;
  gender: string;
  mobile: string;
  address: string;
  date: string;
  doctor_name: string;
  hospital_name: string;
  scan_name: string;
  c_status: number;
  remark: string;
  report_date: string;
}

export default function NursingDetail() {
  const params = useParams();
  const router = useRouter();
  const toast = useToastContext();
  const cro = decodeURIComponent(params.cro as string);
  
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportDetail, setReportDetail] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (cro) {
      fetchPatientDetail();
    }
  }, [cro]);

  const fetchPatientDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/doctor/patient/${encodeURIComponent(cro)}`);
      if (response.ok) {
        const data = await response.json();
        setPatient(data.data);
        setRemark(data.data.remark || '');
      } else {
        toast.error('Patient not found');
        router.push('/doctor/ct-scan-doctor-list');
      }
    } catch (error) {
      console.error('Error fetching patient detail:', error);
      toast.error('Error loading patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!remark.trim()) {
      toast.error('Please enter a remark');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/doctor/add-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cro: cro,
          report_detail: reportDetail,
          remark: remark
        }),
      });

      if (response.ok) {
        toast.success('Report saved successfully');
        fetchPatientDetail(); // Refresh data
      } else {
        toast.error('Failed to save report');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Error saving report');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (!patient) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Report - ${patient.cro}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .details { margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .label { font-weight: bold; }
          .report-section { margin-top: 20px; border: 1px solid #ccc; padding: 15px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">VARAHA DIAGNOSTIC CENTER</div>
          <div>Patient Medical Report</div>
        </div>
        
        <div class="details">
          <div class="row">
            <span class="label">CRO Number:</span>
            <span>${patient.cro}</span>
          </div>
          <div class="row">
            <span class="label">Patient Name:</span>
            <span>${patient.patient_name}</span>
          </div>
          <div class="row">
            <span class="label">Age/Gender:</span>
            <span>${patient.age}, ${patient.gender}</span>
          </div>
          <div class="row">
            <span class="label">Mobile:</span>
            <span>${patient.mobile}</span>
          </div>
          <div class="row">
            <span class="label">Address:</span>
            <span>${patient.address || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Hospital:</span>
            <span>${patient.hospital_name || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Doctor:</span>
            <span>${patient.doctor_name || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Scan Type:</span>
            <span>${patient.scan_name || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Date:</span>
            <span>${patient.date}</span>
          </div>
        </div>
        
        ${patient.remark ? `
        <div class="report-section">
          <h3>Medical Report</h3>
          <p>${patient.remark}</p>
          <div style="margin-top: 15px;">
            <strong>Report Date:</strong> ${patient.report_date || new Date().toLocaleDateString()}
          </div>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Varaha Diagnostic Center - Medical Report</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-gray-500">Patient not found</p>
          <button
            onClick={() => router.push('/doctor/ct-scan-doctor-list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push('/doctor/ct-scan-doctor-list')}
            className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Details - {patient.cro}</h1>
            <p className="text-emerald-100 text-lg">Medical Report & Nursing Details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Patient Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">CRO Number:</span>
              <span className="font-medium">{patient.cro}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient Name:</span>
              <span className="font-medium">{patient.patient_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age/Gender:</span>
              <span className="font-medium">{patient.age}, {patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile:</span>
              <span className="font-medium">{patient.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">{patient.address || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{patient.date}</span>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Medical Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Hospital:</span>
              <span className="font-medium">{patient.hospital_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium">{patient.doctor_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scan Type:</span>
              <span className="font-medium">{patient.scan_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                patient.c_status === 1 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {patient.c_status === 1 ? 'Completed' : 'Pending'}
              </span>
            </div>
            {patient.report_date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Report Date:</span>
                <span className="font-medium">{new Date(patient.report_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Medical Report
          </h2>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Details
            </label>
            <textarea
              value={reportDetail}
              onChange={(e) => setReportDetail(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter detailed report findings..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark *
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter medical remarks..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveReport}
              disabled={saving || !remark.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Report'}</span>
            </button>
            
            <button
              onClick={() => router.push('/doctor/ct-scan-doctor-list')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}