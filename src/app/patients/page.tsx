'use client';

import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Calendar, User, Phone } from 'lucide-react';
import Link from 'next/link';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  category: string;
  registrationDate: string;
  status: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, filterCategory]);

  const fetchPatients = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory !== 'all') params.append('category', filterCategory);
      
      const response = await fetch(`/api/patients?${params}`);
      const data = await response.json();
      
      if (data.success) {
        const formattedPatients = data.patients.map((p: any) => ({
          id: p.patient_id,
          name: p.patient_name,
          age: p.age,
          gender: p.gender,
          contact: p.contact_number,
          category: p.category,
          registrationDate: p.added_on,
          status: 'Active',
          cro: p.cro,
          hospital: p.hospital_name,
          doctor: p.doctor_name
        }));
        setPatients(formattedPatients);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const filteredPatients = patients;

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600">Manage and view all registered patients</p>
          </div>
          <Link
            href="/patients/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Patient
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="GEN / Paid">GEN / Paid</option>
                <option value="IPD FREE">IPD Free</option>
                <option value="OPD FREE">OPD Free</option>
                <option value="RTA">RTA</option>
                <option value="RGHS">RGHS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">CRO: {(patient as any).cro}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{patient.age} years • {patient.gender}</span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient.contact}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(patient.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                    {(patient as any).hospital && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Hospital: {(patient as any).hospital}</span>
                        <span>Doctor: {(patient as any).doctor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {patient.category}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400 mx-auto mt-2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
}