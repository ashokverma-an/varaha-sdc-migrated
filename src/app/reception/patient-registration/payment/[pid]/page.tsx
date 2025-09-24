'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Receipt, User, Calendar, Phone, MapPin, FileText } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface PaymentDetail {
  patient_id: number;
  cro: string;
  pre: string;
  patient_name: string;
  age: string;
  gender: string;
  address: string;
  contact_number: string;
  date: string;
  amount: number;
  amount_reci: number;
  amount_due: number;
  doctor_name: string;
  hospital_name: string;
  scan_types: string;
  category: string;
}

export default function PaymentStatus() {
  const params = useParams();
  const router = useRouter();
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.pid) {
      fetchPaymentDetail(params.pid as string);
    }
  }, [params.pid]);

  const fetchPaymentDetail = async (pid: string) => {
    try {
      const response = await fetch(`https://varahasdc.co.in/api/admin/patients/payment/${pid}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentDetail(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!paymentDetail) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Details Not Found</h3>
          <p className="text-gray-500">The requested payment information could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-xl shadow-lg flex-1">
          <h1 className="text-2xl font-bold mb-1">Payment Status</h1>
          <p className="text-green-100">Patient payment details and transaction history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">CRO Number</label>
                  <p className="text-lg font-semibold text-gray-900">{paymentDetail.cro}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Patient Name</label>
                  <p className="text-lg font-semibold text-gray-900">{paymentDetail.pre} {paymentDetail.patient_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                    <p className="text-gray-900">{paymentDetail.age}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900">{paymentDetail.gender}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                  <p className="text-gray-900">{paymentDetail.category || 'General'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{paymentDetail.date}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{paymentDetail.contact_number}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <p className="text-gray-900">{paymentDetail.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Summary</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Total Amount</span>
              <span className="text-lg font-semibold text-gray-900">₹{paymentDetail.amount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Received Amount</span>
              <span className="text-lg font-semibold text-green-600">₹{paymentDetail.amount_reci}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-500">Due Amount</span>
              <span className={`text-lg font-semibold ${paymentDetail.amount_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{paymentDetail.amount_due}
              </span>
            </div>
            
            {/* Payment Status Badge */}
            <div className="pt-4">
              {paymentDetail.amount_due === 0 ? (
                <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                  <span className="text-green-800 font-semibold">✓ Payment Complete</span>
                </div>
              ) : (
                <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
                  <span className="text-red-800 font-semibold">⚠ Payment Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Receipt className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Doctor Name</label>
              <p className="text-gray-900">{paymentDetail.doctor_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Hospital Name</label>
              <p className="text-gray-900">{paymentDetail.hospital_name}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Scan Types</label>
              <p className="text-gray-900">{paymentDetail.scan_types}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Receipt className="h-5 w-5" />
          <span>Print Receipt</span>
        </button>
        <button
          onClick={() => router.push('/reception/patient-registration/edit')}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to List</span>
        </button>
      </div>
    </div>
  );
}