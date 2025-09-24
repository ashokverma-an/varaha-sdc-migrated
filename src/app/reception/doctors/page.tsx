'use client';

import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface DoctorData {
  d_id: number;
  dname: string;
  specialization: string;
  contact: string;
  email: string;
  qualification: string;
}

export default function ReceptionDoctors() {
  const toast = useToastContext();
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorData | null>(null);
  const [formData, setFormData] = useState({
    // Patient Details
    examination_date: '',
    examination_time: '',
    log_number: '',
    weight: '',
    dname: '',
    age: '',
    gender: '',
    address: '',
    contact: '',
    category: '',
    for_sum_of: '',
    amount: '',
    referring_physician: '',
    physician_contact: '',
    
    // Examination Details
    previous_investigation: '',
    mri_retained: 'no',
    ct_retained: 'no',
    'x-ray_retained': 'no',
    'usg lab_retained': 'no',
    previous_surgery: '',
    allergies: '',
    
    // Patient Screening
    pregnant_screening: 'no',
    dentures_screening: 'no',
    hiv_positive_screening: 'no',
    f_b__in_eyes_screening: 'no',
    heart_valve_screening: 'no',
    metallic_implants_screening: 'no',
    metal_worker_screening: 'no',
    pacemaker_screening: 'no',
    other_implants_screening: 'no',
    vascular_screening: 'no',
    last_menstrual_period: '',
    
    // Patient Status
    ambulatory_status: false,
    wheelchair_status: false,
    stretcher_status: false,
    pregnant_status: 'no',
    sedation_required: 'no',
    anesthetist: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('https://varahasdc.co.in/api/admin/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      examination_date: '',
      examination_time: '',
      log_number: '',
      weight: '',
      dname: '',
      age: '',
      gender: '',
      address: '',
      contact: '',
      category: '',
      for_sum_of: '',
      amount: '',
      referring_physician: '',
      physician_contact: '',
      previous_investigation: '',
      mri_retained: 'no',
      ct_retained: 'no',
      'x-ray_retained': 'no',
      'usg lab_retained': 'no',
      previous_surgery: '',
      allergies: '',
      pregnant_screening: 'no',
      dentures_screening: 'no',
      hiv_positive_screening: 'no',
      f_b__in_eyes_screening: 'no',
      heart_valve_screening: 'no',
      metallic_implants_screening: 'no',
      metal_worker_screening: 'no',
      pacemaker_screening: 'no',
      other_implants_screening: 'no',
      vascular_screening: 'no',
      last_menstrual_period: '',
      ambulatory_status: false,
      wheelchair_status: false,
      stretcher_status: false,
      pregnant_status: 'no',
      sedation_required: 'no',
      anesthetist: ''
    });
    setShowModal(true);
  };

  const handleEdit = (doctor: DoctorData) => {
    setEditingDoctor(doctor);
    setFormData({
      examination_date: '',
      examination_time: '',
      log_number: '',
      weight: '',
      dname: doctor.dname,
      age: '',
      gender: '',
      address: '',
      contact: doctor.contact || '',
      category: '',
      for_sum_of: '',
      amount: '',
      referring_physician: '',
      physician_contact: '',
      previous_investigation: '',
      mri_retained: 'no',
      ct_retained: 'no',
      'x-ray_retained': 'no',
      'usg lab_retained': 'no',
      previous_surgery: '',
      allergies: '',
      pregnant_screening: 'no',
      dentures_screening: 'no',
      hiv_positive_screening: 'no',
      f_b__in_eyes_screening: 'no',
      heart_valve_screening: 'no',
      metallic_implants_screening: 'no',
      metal_worker_screening: 'no',
      pacemaker_screening: 'no',
      other_implants_screening: 'no',
      vascular_screening: 'no',
      last_menstrual_period: '',
      ambulatory_status: false,
      wheelchair_status: false,
      stretcher_status: false,
      pregnant_status: 'no',
      sedation_required: 'no',
      anesthetist: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (doctor: DoctorData) => {
    if (confirm(`Are you sure you want to delete Dr. ${doctor.dname}?`)) {
      try {
        const response = await fetch(`https://varahasdc.co.in/api/admin/doctors/${doctor.d_id}`, { method: 'DELETE' });
        if (response.ok) {
          toast.error('Doctor deleted successfully!');
          fetchDoctors();
        }
      } catch (error) {
        toast.error('Error deleting doctor');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDoctor ? `https://varahasdc.co.in/api/admin/doctors/${editingDoctor.d_id}` : 'https://varahasdc.co.in/api/admin/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.error(`Doctor ${editingDoctor ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        fetchDoctors();
      }
    } catch (error) {
      toast.error('Error saving doctor');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.dname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
        <p className="text-blue-100 text-lg">Manage doctors and their information</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchDoctors}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          <button onClick={handleAdd} className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Doctor</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Doctor Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Specialization</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Contact</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Qualification</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.map((doctor, index) => (
                <tr key={doctor.d_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{doctor.dname}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.specialization || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.contact || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.email || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.qualification || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(doctor)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(doctor)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedDoctors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading doctors...' : 'No doctors found'}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal with PHP Form Fields */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{editingDoctor ? 'Edit Doctor' : 'MRI Scheduling And Patient Details'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6 php-admin-page">
                {/* Patient Details Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">MRI Scheduling And Patient Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Of Examination *
                        </label>
                        <input
                          type="date"
                          name="examination_date"
                          value={formData.examination_date}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          name="examination_time"
                          value={formData.examination_time}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Log Number
                        </label>
                        <input
                          type="text"
                          name="log_number"
                          value={formData.log_number}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="dname"
                        value={formData.dname}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        For Sum Of
                      </label>
                      <input
                        type="text"
                        name="for_sum_of"
                        value={formData.for_sum_of}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rs.
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referring Physician
                      </label>
                      <input
                        type="text"
                        name="referring_physician"
                        value={formData.referring_physician}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Physician Contact
                      </label>
                      <input
                        type="tel"
                        name="physician_contact"
                        value={formData.physician_contact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Examination Details Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Examination Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Investigation
                    </label>
                    <input
                      type="text"
                      name="previous_investigation"
                      value={formData.previous_investigation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Examination Retained</label>
                    <div className="grid grid-cols-4 gap-4">
                      {['MRI', 'CT', 'X-Ray', 'USG LAB'].map((exam) => (
                        <div key={exam} className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{exam}:</span>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${exam.toLowerCase()}_retained`}
                              value="yes"
                              checked={formData[`${exam.toLowerCase()}_retained` as keyof typeof formData] === 'yes'}
                              onChange={handleInputChange}
                              className="mr-1"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${exam.toLowerCase()}_retained`}
                              value="no"
                              checked={formData[`${exam.toLowerCase()}_retained` as keyof typeof formData] === 'no'}
                              onChange={handleInputChange}
                              className="mr-1"
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Surgery
                      </label>
                      <input
                        type="text"
                        name="previous_surgery"
                        value={formData.previous_surgery}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Allergies
                      </label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Patient Screening Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Patient Screening</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      'Pregnant', 'Dentures', 'HIV Positive', 'F.B. in Eyes', 'Heart Valve',
                      'Metallic Implants', 'Metal Worker', 'Pacemaker', 'Other Implants', 'Vascular'
                    ].map((screening) => (
                      <div key={screening} className="flex flex-col">
                        <span className="text-sm font-medium mb-1">{screening}:</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${screening.toLowerCase().replace(/[^a-z]/g, '_')}_screening`}
                              value="yes"
                              checked={formData[`${screening.toLowerCase().replace(/[^a-z]/g, '_')}_screening` as keyof typeof formData] === 'yes'}
                              onChange={handleInputChange}
                              className="mr-1"
                            />
                            <span className="text-xs">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${screening.toLowerCase().replace(/[^a-z]/g, '_')}_screening`}
                              value="no"
                              checked={formData[`${screening.toLowerCase().replace(/[^a-z]/g, '_')}_screening` as keyof typeof formData] === 'no'}
                              onChange={handleInputChange}
                              className="mr-1"
                            />
                            <span className="text-xs">No</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Menstrual Period
                    </label>
                    <input
                      type="date"
                      name="last_menstrual_period"
                      value={formData.last_menstrual_period}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Patient Status Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Patient Status</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {['Ambulatory', 'WheelChair', 'Stretcher'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`${status.toLowerCase()}_status`}
                          checked={formData[`${status.toLowerCase()}_status` as keyof typeof formData] as boolean || false}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{status}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Pregnant:</span>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="pregnant_status"
                          value="yes"
                          checked={formData.pregnant_status === 'yes'}
                          onChange={handleInputChange}
                          className="mr-1"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="pregnant_status"
                          value="no"
                          checked={formData.pregnant_status === 'no'}
                          onChange={handleInputChange}
                          className="mr-1"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Sedation Required:</span>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sedation_required"
                          value="yes"
                          checked={formData.sedation_required === 'yes'}
                          onChange={handleInputChange}
                          className="mr-1"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sedation_required"
                          value="no"
                          checked={formData.sedation_required === 'no'}
                          onChange={handleInputChange}
                          className="mr-1"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anesthetist
                    </label>
                    <input
                      type="text"
                      name="anesthetist"
                      value={formData.anesthetist}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                    {editingDoctor ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}