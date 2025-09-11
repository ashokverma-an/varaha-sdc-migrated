'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Hospital {
  id: number;
  hospital: string;
  shortName: string;
  type: string;
  contact: string;
  address: string;
}

export default function Hospitals() {
  const params = useParams();
  const role = params.role as string;
  const [hospitals, setHospitals] = useState<Hospital[]>([
    { id: 1, hospital: 'MAHATMA GANDHI HOSPITAL', shortName: 'MGH', type: 'Govermant', contact: '02912636903', address: 'JALORI GATE Jodhpur' },
    { id: 2, hospital: 'MATHURA DAS MATHUR', shortName: 'MDM', type: 'Govermant', contact: '0291', address: 'SHASHTRI NAGAR' },
    { id: 3, hospital: 'UMAID HOSPITAL', shortName: 'UMD', type: 'Govermant', contact: '0291', address: 'SHIWANJI GATE JODHPUR' },
    { id: 4, hospital: 'All India Institute of Medical Sciences', shortName: 'AIIMS', type: 'Govermant', contact: '0291', address: 'BASNI JODHPUR' },
    { id: 5, hospital: 'OTHER PRIVATE HOSPITAL', shortName: 'OPH', type: 'Private', contact: '123', address: 'JODHPUR' },
    { id: 6, hospital: 'ESI HOSPITAL', shortName: 'ESI', type: 'Govermant', contact: '', address: '' },
    { id: 11, hospital: 'MILITARY HOSPITAL', shortName: 'MH HOSPITAL', type: 'Govermant', contact: '00', address: 'JODHPUR' },
    { id: 12, hospital: 'RTA', shortName: '', type: '', contact: '0', address: '' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    hospitalFullName: '',
    hospitalName: '',
    hospitalShortName: '',
    hospitalType: 'Private',
    address: '',
    phone: ''
  });

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHospital: Hospital = {
      id: hospitals.length + 1,
      hospital: formData.hospitalFullName,
      shortName: formData.hospitalShortName,
      type: formData.hospitalType,
      contact: formData.phone,
      address: formData.address
    };
    setHospitals([...hospitals, newHospital]);
    setFormData({
      hospitalFullName: '',
      hospitalName: '',
      hospitalShortName: '',
      hospitalType: 'Private',
      address: '',
      phone: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Hospital In Record</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Full Name</label>
              <input
                type="text"
                value={formData.hospitalFullName}
                onChange={(e) => setFormData({...formData, hospitalFullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                value={formData.hospitalName}
                onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Short Name</label>
              <input
                type="text"
                value={formData.hospitalShortName}
                onChange={(e) => setFormData({...formData, hospitalShortName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Type</label>
              <select
                value={formData.hospitalType}
                onChange={(e) => setFormData({...formData, hospitalType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="Private">Private</option>
                <option value="Govermant">Govermant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Contact</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                Add Hospital
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hospital</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dynamic Table Full</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">10</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{hospital.hospital}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.shortName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.contact}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{hospital.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">Showing 11-12 of 12</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}