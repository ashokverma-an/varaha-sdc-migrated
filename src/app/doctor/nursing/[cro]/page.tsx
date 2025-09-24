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
  allot_date: string;
  contact_number: string;
  category: string;
  scan_type: string;
  n_patient_ct: string;
  n_patient_ct_report_date: string;
  n_patient_ct_remark: string;
  n_patient_x_ray: string;
  n_patient_x_ray_report_date: string;
  n_patient_x_ray_remark: string;
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

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0000-00-00') return '-';
    try {
      // Handle DD-MM-YYYY format from database
      let date;
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          date = new Date(dateString);
        } else {
          // DD-MM-YYYY format
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
    } catch (error) {
      return '-';
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString || dateString === '0000-00-00') return '';
    try {
      let date;
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // Already YYYY-MM-DD format
          return dateString;
        } else {
          // DD-MM-YYYY format, convert to YYYY-MM-DD
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };
  
  const [nursingData, setNursingData] = useState<NursingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number>(0);
  const [ctScan, setCTScan] = useState<string>('No');
  const [ctReportDate, setCTReportDate] = useState<string>('');
  const [ctRemark, setCTRemark] = useState<string>('');
  const [xRay, setXRay] = useState<string>('No');
  const [xRayReportDate, setXRayReportDate] = useState<string>('');
  const [xRayRemark, setXRayRemark] = useState<string>('');

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
        setCTReportDate(formatDateForInput(patient.n_patient_ct_report_date || ''));
        setCTRemark(patient.n_patient_ct_remark || '');
        setXRay(patient.n_patient_x_ray || 'No');
        setXRayReportDate(formatDateForInput(patient.n_patient_x_ray_report_date || ''));
        setXRayRemark(patient.n_patient_x_ray_remark || '');
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
          n_patient_ct_remark: ctRemark,
          n_patient_x_ray: xRay,
          n_patient_x_ray_report_date: xRayReportDate,
          n_patient_x_ray_remark: xRayRemark
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
            <span class="label">Contact:</span>
            <span>${patient.contact_number || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Category:</span>
            <span>${patient.category || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Date:</span>
            <span>${patient.date}</span>
          </div>
        </div>
        
        ${patient.n_patient_ct_remark ? `
        <div class="report-section">
          <h3>CT Scan Report</h3>
          <p><strong>CT Scan:</strong> ${patient.n_patient_ct}</p>
          <p><strong>Report Date:</strong> ${patient.n_patient_ct_report_date || '-'}</p>
          <p><strong>Remark:</strong> ${patient.n_patient_ct_remark}</p>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(nursingData.patient.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment Date:</span>
              <span className="font-medium">{formatDate(nursingData.patient.allot_date)}</span>
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Nursing Information
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value={0}>--Select Doctor--</option>
              {nursingData.doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.doctor_name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">CT-Scan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Examination Retained
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="ct"
                      value="Yes"
                      checked={ctScan === 'Yes'}
                      onChange={(e) => setCTScan(e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="ct"
                      value="No"
                      checked={ctScan === 'No'}
                      onChange={(e) => setCTScan(e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Date
                </label>
                <input
                  type="date"
                  value={ctReportDate}
                  onChange={(e) => setCTReportDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {ctReportDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(ctReportDate)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  value={ctRemark}
                  onChange={(e) => setCTRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter CT-Scan remarks..."
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">X-Ray Film</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Examination Retained
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="xray"
                      value="Yes"
                      checked={xRay === 'Yes'}
                      onChange={(e) => setXRay(e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="xray"
                      value="No"
                      checked={xRay === 'No'}
                      onChange={(e) => setXRay(e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Date
                </label>
                <input
                  type="date"
                  value={xRayReportDate}
                  onChange={(e) => setXRayReportDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {xRayReportDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(xRayReportDate)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  value={xRayRemark}
                  onChange={(e) => setXRayRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter X-Ray film remarks..."
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveReport}
              disabled={saving}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Nursing Data'}</span>
            </button>
            
            <button
              onClick={() => router.push('/doctor/ct-scan-doctor-list')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}