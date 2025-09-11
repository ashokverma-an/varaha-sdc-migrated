'use client';

import Layout from '@/components/layout/Layout';
import { FormInput, FormSelect, FormTextarea, FormButton } from '@/components/ui/FormComponents';
import { useState } from 'react';
import { Save } from 'lucide-react';

export default function PatientRegistrationNew() {
  const [formData, setFormData] = useState({
    name: '', contact: '', age: '', gender: 'Male', category: 'General', address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Patient registered successfully!');
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const categoryOptions = [
    { value: 'General', label: 'General' },
    { value: 'VIP', label: 'VIP' },
    { value: 'Emergency', label: 'Emergency' }
  ];

  return (
    <Layout>
      <div className="space-y-6 font-system">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-semibold mb-2">Patient Registration (New)</h1>
          <p className="text-blue-100">Register new patient</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Patient Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <FormInput
              label="Contact Number"
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              required
            />
            <FormInput
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
            />
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
            <FormTextarea
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={3}
            />
            <div className="md:col-span-2 flex justify-end">
              <FormButton type="submit">
                <Save className="h-5 w-5" />
                <span>Register Patient</span>
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}