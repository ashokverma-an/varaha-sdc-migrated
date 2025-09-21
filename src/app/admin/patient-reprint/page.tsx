'use client';

import { useState } from 'react';
import { Search, Printer, FileText } from 'lucide-react';

interface PatientData {
  p_id: number;
  cro_number: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  h_name: string;
  dname: string;
  amount: number;
  date: string;
  category: string;
}

export default function PatientReprint() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/search?q=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setSelectedPatient(data.data[0]);
        } else {
          alert('Patient not found');
          setSelectedPatient(null);
        }
      } else {
        alert('Error searching patient');
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      alert('Error searching patient');
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = () => {
    if (!selectedPatient) return;

    // Generate professional medical slip like PHP version
    const printContent = `
      <html>
        <head>
          <title>Patient Registration Slip - ${selectedPatient.cro_number}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              margin: 0; 
              padding: 20px; 
              font-size: 12px;
              line-height: 1.4;
            }
            .slip {
              width: 300px;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 15px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .logo {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 10px;
              margin-bottom: 5px;
            }
            .details {
              margin: 10px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              border-bottom: 1px dotted #ccc;
              padding-bottom: 3px;
            }
            .label {
              font-weight: bold;
              width: 120px;
            }
            .value {
              flex: 1;
              text-align: right;
            }
            .amount-section {
              border: 1px solid #000;
              padding: 10px;
              margin: 15px 0;
              text-align: center;
            }
            .amount {
              font-size: 16px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              border-top: 1px solid #000;
              padding-top: 10px;
              font-size: 10px;
            }
            .barcode {
              text-align: center;
              font-family: 'Courier New', monospace;
              font-size: 8px;
              margin: 10px 0;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .slip { width: 100%; border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="slip">
            <div class="header">
              <div class="logo">VARAHA SDC</div>
              <div class="subtitle">Scan & Diagnostic Centre</div>
              <div class="subtitle">Patient Registration Slip</div>
            </div>
            
            <div class="details">
              <div class="row">
                <span class="label">CRO No:</span>
                <span class="value">${selectedPatient.cro_number}</span>
              </div>
              <div class="row">
                <span class="label">Name:</span>
                <span class="value">${selectedPatient.patient_name}</span>
              </div>
              <div class="row">
                <span class="label">Age/Sex:</span>
                <span class="value">${selectedPatient.age}Y/${selectedPatient.gender}</span>
              </div>
              <div class="row">
                <span class="label">Mobile:</span>
                <span class="value">${selectedPatient.mobile}</span>
              </div>
              <div class="row">
                <span class="label">Hospital:</span>
                <span class="value">${selectedPatient.h_name || 'N/A'}</span>
              </div>
              <div class="row">
                <span class="label">Doctor:</span>
                <span class="value">${selectedPatient.dname || 'N/A'}</span>
              </div>
              <div class="row">
                <span class="label">Date:</span>
                <span class="value">${selectedPatient.date}</span>
              </div>
              <div class="row">
                <span class="label">Category:</span>
                <span class="value">${selectedPatient.category || 'General'}</span>
              </div>
            </div>
            
            <div class="amount-section">
              <div>AMOUNT PAYABLE</div>
              <div class="amount">₹ ${selectedPatient.amount}</div>
            </div>
            
            <div class="barcode">
              <div>||||| |||| | |||| ||||| | ||||</div>
              <div>${selectedPatient.cro_number}</div>
            </div>
            
            <div class="footer">
              <div>Please carry this slip during scan</div>
              <div>Contact: +91-XXXXXXXXXX</div>
              <div>Printed: ${new Date().toLocaleString('en-IN')}</div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Reprint</h1>
        <div className="flex items-center space-x-2">
          <Printer className="h-6 w-6 text-red-600" />
          <span className="text-lg font-medium text-gray-700">Reprint Receipt</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter CRO number or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchTerm}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {selectedPatient && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CRO Number</label>
              <p className="text-gray-900 font-medium">{selectedPatient.cro_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <p className="text-gray-900">{selectedPatient.patient_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age/Gender</label>
              <p className="text-gray-900">{selectedPatient.age}/{selectedPatient.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <p className="text-gray-900">{selectedPatient.mobile}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
              <p className="text-gray-900">{selectedPatient.h_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <p className="text-gray-900">{selectedPatient.dname || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <p className="text-gray-900 font-semibold text-green-600">₹{selectedPatient.amount}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <p className="text-gray-900">{selectedPatient.date}</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleReprint}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Printer className="h-5 w-5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setSelectedPatient(null)}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}