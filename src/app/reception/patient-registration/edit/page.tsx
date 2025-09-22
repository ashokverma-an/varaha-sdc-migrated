'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, User, Phone, MapPin, Calendar, DollarSign, Printer, Search } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface Hospital {
  h_id: number;
  h_name: string;
}

interface Doctor {
  d_id: number;
  dname: string;
}

interface Category {
  cat_id: number;
  cat_name: string;
}

interface Patient {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: string;
  gender: string;
  mobile: string;
  address: string;
  h_name: string;
  dname: string;
  category: string;
  amount: number;
  date: string;
  remark: string;
}

export default function EditPatientRegistration() {
  const toast = useToastContext();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCRO, setSearchCRO] = useState('');
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'Male',
    mobile: '',
    address: '',
    amount: '',
    remark: ''
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [hospitalsRes, doctorsRes, categoriesRes] = await Promise.all([
        fetch('https://varahasdc.co.in/api/admin/hospitals'),
        fetch('https://varahasdc.co.in/api/admin/doctors'),
        fetch('https://varahasdc.co.in/api/admin/categories')
      ]);

      if (hospitalsRes.ok) {
        const hospitalsData = await hospitalsRes.json();
        setHospitals(hospitalsData.data || []);
      }

      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData || []);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const searchPatient = async () => {
    if (!searchCRO.trim()) {
      toast.error('Please enter CRO number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/search?q=${encodeURIComponent(searchCRO)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const patientData = data.data[0];
          setPatient(patientData);
          setFormData({
            patient_name: patientData.patient_name || '',
            age: patientData.age || '',
            gender: patientData.gender || 'Male',
            mobile: patientData.mobile || '',
            address: patientData.address || '',
            amount: patientData.amount?.toString() || '',
            remark: patientData.remark || ''
          });
        } else {
          toast.error('Patient not found');
        }
      } else {
        toast.error('Error searching patient');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error searching patient');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient) {
      toast.error('No patient selected');
      return;
    }

    if (!formData.patient_name.trim()) {
      toast.error('Patient name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/${patient.p_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Patient updated successfully!');
        window.location.href = '/reception/patient-registration';
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

  const generateReceipt = () => {
    if (!patient) {
      toast.error('No patient selected');
      return;
    }

    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Receipt - ${patient.cro_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .details { margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .label { font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">VARAHA DIAGNOSTIC CENTER</div>
          <div>Patient Registration Receipt</div>
        </div>
        
        <div class="details">
          <div class="row">
            <span class="label">CRO Number:</span>
            <span>${patient.cro_number}</span>
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
            <span>${patient.h_name || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Doctor:</span>
            <span>${patient.dname || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Category:</span>
            <span>${patient.category || '-'}</span>
          </div>
          <div class="row">
            <span class="label">Amount:</span>
            <span>₹${patient.amount}</span>
          </div>
          <div class="row">
            <span class="label">Date:</span>
            <span>${patient.date}</span>
          </div>
          ${patient.remark ? `
          <div class="row">
            <span class="label">Remarks:</span>
            <span>${patient.remark}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Varaha Diagnostic Center</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.location.href = '/reception/patient-registration'}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Patient Registration</h1>
            <p className="text-blue-100 text-lg">Search and edit patient details</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Search Patient</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter CRO number (e.g., VDC/01-08-2025/187)"
            value={searchCRO}
            onChange={(e) => setSearchCRO(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={searchPatient}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Patient Details Form */}
      {patient && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Patient Details - {patient.cro_number}</h2>
            <button
              onClick={generateReceipt}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="h-5 w-5" />
              <span>Print Receipt</span>
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="inline h-4 w-4 mr-1" />
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Mobile
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? 'Updating...' : 'Update Patient'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => window.location.href = '/reception/patient-registration'}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!patient && (
        <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Patient to Edit</h3>
          <p className="text-gray-500">Enter a CRO number above to search and edit patient details.</p>
        </div>
      )}
    </div>
  );
}