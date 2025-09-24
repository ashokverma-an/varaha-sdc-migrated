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
  contact_number: string;
  category: string;
  scan_type: string;
  n_patient_ct: string;
  n_patient_ct_report_date: string;
  n_patient_ct_remark: string;
  ct_scan_doctor_id: number;
}

interface Scan {
  s_id: number;
  s_name: string;
}

interface Doctor {
  id: number;
  doctor_name: string;
}

interface NursingData {
  patient: PatientDetail;
  scans: Scan[];
  doctors: Doctor[];
}

export default function NursingDetail() {
  const params = useParams();
  const router = useRouter();
  const toast = useToastContext();
  const cro = decodeURIComponent(params.cro as string);
  
  const [nursingData, setNursingData] = useState<NursingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number>(0);
  const [ctScan, setCTScan] = useState<string>('No');
  const [ctReportDate, setCTReportDate] = useState<string>('');
  const [ctRemark, setCTRemark] = useState<string>('');

  useEffect(() => {
    if (cro) {
      fetchPatientDetail();
    }
  }, [cro]);

  const fetchPatientDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/doctor/nursing/${encodeURIComponent(cro)}`);
      if (response.ok) {
        const data = await response.json();
        setNursingData(data.data);
        const patient = data.data.patient;
        setSelectedDoctor(patient.ct_scan_doctor_id || 0);
        setCTScan(patient.n_patient_ct || 'No');
        setCTReportDate(patient.n_patient_ct_report_date || '');
        setCTRemark(patient.n_patient_ct_remark || '');
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
    setSaving(true);
    try {
      const response = await fetch('/api/doctor/save-nursing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cro: cro,
          ct_scan_doctor_id: selectedDoctor,
          n_patient_ct: ctScan,
          n_patient_ct_report_date: ctReportDate,
          n_patient_ct_remark: ctRemark
        }),
      });

      if (response.ok) {
        toast.success('Nursing data saved successfully');
        fetchPatientDetail();
      } else {
        toast.error('Failed to save nursing data');
      }
    } catch (error) {
      console.error('Error saving nursing data:', error);
      toast.error('Error saving nursing data');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (!nursingData) return;
    const patient = nursingData.patient;

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

  if (!nursingData) {
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
            <h1 className="text-3xl font-bold mb-2">Patient Details - {nursingData.patient.cro}</h1>
            <p className="text-emerald-100 text-lg">Nursing Details & CT Scan Information</p>
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
              <span className="font-medium">{nursingData.patient.cro}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient Name:</span>
              <span className="font-medium">{nursingData.patient.patient_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age/Gender:</span>
              <span className="font-medium">{nursingData.patient.age}, {nursingData.patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile:</span>
              <span className="font-medium">{nursingData.patient.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium">{nursingData.patient.contact_number || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{nursingData.patient.category || '-'}</span>
            </div>
          </div>
        </div>

        {/* Scan Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Scan Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Scan Types</h3>
              <div className="space-y-2">
                {nursingData.scans.map((scan, index) => (
                  <div key={scan.s_id} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{index + 1}.</span>
                    <span className="text-sm font-medium">{scan.s_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nursing Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Nursing Information
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={0}>--Select Doctor--</option>
              {nursingData.doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.doctor_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Examination Retained - CT-Scan
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ct"
                  value="Yes"
                  checked={ctScan === 'Yes'}
                  onChange={(e) => setCTScan(e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ct"
                  value="No"
                  checked={ctScan === 'No'}
                  onChange={(e) => setCTScan(e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CT-Scan Report Date
            </label>
            <input
              type="date"
              value={ctReportDate}
              onChange={(e) => setCTReportDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CT-Scan Remark
            </label>
            <textarea
              value={ctRemark}
              onChange={(e) => setCTRemark(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter CT-Scan remarks..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveReport}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Nursing Data'}</span>
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