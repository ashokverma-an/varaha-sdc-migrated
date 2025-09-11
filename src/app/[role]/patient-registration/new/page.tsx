'use client';

import Layout from '@/components/layout/Layout';
import { FormInput, FormSelect, FormButton } from '@/components/ui/FormComponents';
import { useState } from 'react';
import { Save, Printer } from 'lucide-react';

export default function PatientRegistrationNew() {
  const [activeTab, setActiveTab] = useState(1);
  const [errors, setErrors] = useState({});

  const validateTab1 = () => {
    const newErrors: any = {};
    if (!formData.hospital) newErrors.hospital = 'Hospital is required';
    if (!formData.doctor) newErrors.doctor = 'Doctor is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextTab = () => {
    if (activeTab === 1 && validateTab1()) {
      setActiveTab(2);
    } else if (activeTab === 2) {
      setActiveTab(3);
    }
  };

  const prevTab = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  const handleSave = () => {
    alert('Patient saved successfully!');
  };

  const handlePrint = () => {
    window.print();
  };
  const [formData, setFormData] = useState({
    date: '11-09-2025',
    hospital: '',
    doctor: '',
    title: 'Mr.',
    firstName: '',
    age: '',
    ageUnit: 'Year',
    gender: 'Male',
    category: 'GEN / Paid',
    address: '',
    city: '',
    contact: '',
    selectedScans: [],
    appointDate: '11-09-2025',
    timeIn: '',
    timeOut: '',
    amount: 0,
    estimatedTime: ''
  });

  const scans = [
    'NCCT Head Bone Cuts with 3D reconstruction',
    'CT dynamic study Pituitary',
    'NCCT Orbit',
    'CECT Orbit (Both)',
    'NCCT Face with 3D reconstruction'
  ];

  const titleOptions = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Mrs.', label: 'Mrs.' },
    { value: 'Ms.', label: 'Ms.' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const categoryOptions = [
    { value: 'GEN / Paid', label: 'GEN / Paid' },
    { value: 'VIP', label: 'VIP' },
    { value: 'Emergency', label: 'Emergency' }
  ];

  const ageUnitOptions = [
    { value: 'Year', label: 'Year' },
    { value: 'Month', label: 'Month' },
    { value: 'Days', label: 'Days' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Patient Registration (New)</h1>
          <p className="text-sm font-normal text-gray-600">Last Entered Patient VDC/11-09-2025/3 SAHAN LAL</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab(1)}
              className={`pb-2 px-4 ${activeTab === 1 ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-600'}`}
            >
              1. Enrollment Detail
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`pb-2 px-4 ${activeTab === 2 ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-600'}`}
            >
              2. Scan Options
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`pb-2 px-4 ${activeTab === 3 ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-600'}`}
            >
              3. Payment Details
            </button>
          </div>

          {activeTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
              <FormSelect
                label="Hospital Name"
                value={formData.hospital}
                onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                options={[
                  { value: '', label: 'Select Hospital' },
                  { value: 'MGH', label: 'MAHATMA GANDHI HOSPITAL' },
                  { value: 'AIIMS', label: 'All India Institute of Medical Sciences' }
                ]}
              />
              <FormSelect
                label="Doctor Name"
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                options={[
                  { value: '', label: 'Select Doctor' },
                  { value: 'Dr. Smith', label: 'Dr. Smith' },
                  { value: 'Dr. Johnson', label: 'Dr. Johnson' }
                ]}
              />
              <div className="flex space-x-2">
                <div className="w-1/3">
                  <FormSelect
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    options={titleOptions}
                  />
                </div>
                <div className="w-2/3">
                  <FormInput
                    label="Patient Name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Please enter your First name"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-2/3">
                  <FormInput
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="In(Year/month/days)"
                  />
                </div>
                <div className="w-1/3">
                  <FormSelect
                    label="Unit"
                    value={formData.ageUnit}
                    onChange={(e) => setFormData({...formData, ageUnit: e.target.value})}
                    options={ageUnitOptions}
                  />
                </div>
              </div>
              <FormSelect
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                options={genderOptions}
              />
              <FormSelect
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                options={categoryOptions}
              />
              <FormInput
                label="Address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Please enter your Address"
              />
              <FormInput
                label="City"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Please enter your city"
              />
              <FormInput
                label="Contact Number"
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="Please enter your contact Number"
              />
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-normal text-gray-700 mb-4">Select Scan Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {scans.map((scan, index) => (
                  <label key={index} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                    />
                    <span className="text-sm font-normal text-gray-700">{scan}</span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormInput
                  label="Appoint date"
                  type="date"
                  value={formData.appointDate}
                  onChange={(e) => setFormData({...formData, appointDate: e.target.value})}
                />
                <FormInput
                  label="Time In"
                  type="time"
                  value={formData.timeIn}
                  onChange={(e) => setFormData({...formData, timeIn: e.target.value})}
                />
                <FormInput
                  label="Time Out"
                  type="time"
                  value={formData.timeOut}
                  onChange={(e) => setFormData({...formData, timeOut: e.target.value})}
                />
                <FormInput
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                />
                <FormInput
                  label="Estimated Time"
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-normal text-gray-700 mb-4">INVOICE</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <p className="text-sm font-normal text-gray-700">Age = {formData.age} {formData.ageUnit}</p>
                  <p className="text-sm font-normal text-gray-700">Sex = {formData.gender}</p>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left font-normal text-gray-700">Name Of Scan</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-normal text-gray-700">Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-normal text-gray-700">1. (EXTRA FILM CHARGES 2)</td>
                      <td className="border border-gray-300 px-4 py-2 font-normal text-gray-700">600</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-normal text-gray-700">Total Amount</span>
                    <span className="font-normal text-gray-700">600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-normal text-gray-700">Received Amount</span>
                    <span className="font-normal text-gray-700">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-normal text-gray-700">Discount</span>
                    <span className="font-normal text-gray-700">0</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="font-normal text-gray-700">Due Amount</span>
                    <span className="font-normal text-gray-700">600</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <FormButton>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </FormButton>
                <FormButton>
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </FormButton>
                <FormButton variant="secondary">
                  <span>Exit</span>
                </FormButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}