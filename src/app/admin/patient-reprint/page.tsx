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
  address: string;
  scan_type: string;
  allot_date: string;
  allot_time: string;
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

  const convertNumberToWords = (num: number): string => {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    const thousands = ['', 'THOUSAND', 'MILLION', 'BILLION'];

    if (num === 0) return 'ZERO';

    let result = '';
    let thousandIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        let chunkStr = '';
        
        if (chunk >= 100) {
          chunkStr += ones[Math.floor(chunk / 100)] + ' HUNDRED ';
        }
        
        const remainder = chunk % 100;
        if (remainder >= 10 && remainder < 20) {
          chunkStr += teens[remainder - 10] + ' ';
        } else {
          if (remainder >= 20) {
            chunkStr += tens[Math.floor(remainder / 10)] + ' ';
          }
          if (remainder % 10 !== 0) {
            chunkStr += ones[remainder % 10] + ' ';
          }
        }
        
        chunkStr += thousands[thousandIndex] + ' ';
        result = chunkStr + result;
      }
      
      num = Math.floor(num / 1000);
      thousandIndex++;
    }

    return result.trim();
  };

  const handleReprint = () => {
    if (!selectedPatient) return;

    const amountInWords = convertNumberToWords(selectedPatient.amount);
    
    // Generate exact receipt format matching PHP SDK
    const printContent = `
      <html>
        <head>
          <title>Receipt - ${selectedPatient.cro_number}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              font-size: 10px;
              line-height: 1.2;
            }
            .receipt {
              width: 93%;
              margin: 18px auto 0;
              border: 1px solid #000;
              padding: 2px 8px;
            }
            .header {
              text-align: center;
              margin-top: 2px;
            }
            .header b {
              font-weight: bold;
            }
            table {
              width: 98%;
              margin: -5px 8px;
              font-size: 10px;
            }
            .form_input_box {
              border-bottom: 0px dotted #000;
              padding: 0px 0px 2px 0px;
              width: 100%;
              display: inline-block;
            }
            .form_input {
              padding: 2px 1%;
              font-size: 10px;
              border: none;
              font-weight: bold;
              font-style: italic;
              width: 99%;
              border-bottom: 1px dotted #000;
            }
            .cash-receipt {
              margin-left: 30%;
              border: 1px solid #02C;
              border-radius: 11px;
              padding: 3px 15px;
            }
            .amount-box {
              border: 1px solid #5E60AE;
            }
            .footer-text {
              text-align: right;
              margin-right: 50px;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .receipt { width: 100%; margin: 0; }
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 1000);">
          <!-- First Copy -->
          <div class="receipt">
            <table class="header">
              <tr><td align="center" colspan="6"><b>Dr. S.N. MEDICAL COLLEGE AND ATTACHED GROUP OF HOSPITAL, JODHPUR</b></td></tr>
              <tr><td align="center" colspan="6"><b>Rajasthan Medical Relief Society, M.D.M. Hospital, Jodhpur</b></td></tr>
              <tr><td align="center" colspan="6"><b>IMAGING CENTRE UNDER P.P.P.MODE : VARAHA SDC</b></td></tr>
              <tr><td align="center" colspan="6"><b>256 SLICE DUAL ENERGY CT SCAN, M.D.M HOSPITAL Jodhpur(Raj.) - 342003</b></td></tr>
              <tr><td align="center" colspan="6"><b>Tel. : +91-291-2648120 , 0291-2648121 , 0291-2648122</b></td></tr>
            </table>

            <table>
              <tr>
                <td width="55">Reg.No :</td>
                <td width="200"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.cro_number}(${selectedPatient.p_id})"></span></td>
                <td colspan="6"><span class="cash-receipt">Cash Receipt</span></td>
                <td width="36">Date</td>
                <td width="144"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.date}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="56">Ref. By :</td>
                <td width="482"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.dname || 'MDM'}"></span></td>
                <td width="174">Date and Time of Appointment :</td>
                <td width="316"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.allot_date || selectedPatient.date}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="78">Patient Name:</td>
                <td width="650"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.patient_name}"></span></td>
                <td width="33">Age :</td>
                <td width="144"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.age}Year"></span></td>
                <td width="36">Gender</td>
                <td width="144"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.gender}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="40">Address</td>
                <td width="687"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.address || 'JODHPUR'}"></span></td>
                <td width="687"><span class="form_input_box"><label>Category</label><input type="text" class="form_input" value="${selectedPatient.category || 'Sn. CITIZEN'}"></span></td>
                <td width="33">Phone:</td>
                <td width="333"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.mobile}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="59">Investigations:</td>
                <td width="1042"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.scan_type || 'NCCT Brain / Head,'}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="129" height="24">For Sum Of Rupees:</td>
                <td width="733"><span class="form_input_box"><input type="text" class="form_input" value="${amountInWords} RUPEES ONLY"></span></td>
                <td width="147"><label>Scan Amount</label><input type="text" class="amount-box" value="₹ ${selectedPatient.amount}"></td>
                <td width="147"><label>Received Amount</label><input type="text" class="amount-box" value="₹ ${selectedPatient.amount}"></td>
              </tr>
            </table>

            <table>
              <tr>
                <td height="27" colspan="6" align="right">For Varaha SDC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br><span class="footer-text">Jodhpur</span></td>
              </tr>
            </table>
          </div>

          <hr>

          <!-- Second Copy -->
          <div class="receipt">
            <table class="header">
              <tr><td align="center" colspan="6"><b>Dr. S.N. MEDICAL COLLEGE AND ATTACHED GROUP OF HOSPITAL, JODHPUR</b></td></tr>
              <tr><td align="center" colspan="6"><b>Rajasthan Medical Relief Society, M.D.M. Hospital, Jodhpur</b></td></tr>
              <tr><td align="center" colspan="6"><b>IMAGING CENTRE UNDER P.P.P.MODE : VARAHA SDC</b></td></tr>
              <tr><td align="center" colspan="6"><b>256 SLICE DUAL ENERGY CT SCAN, M.D.M HOSPITAL Jodhpur(Raj.) - 342003</b></td></tr>
              <tr><td align="center" colspan="6"><b>Tel. : +91-291-2648120 , 0291-2648121 , 0291-2648122</b></td></tr>
            </table>

            <table>
              <tr>
                <td width="55">Reg.No :</td>
                <td width="200"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.cro_number} (${selectedPatient.p_id})"></span></td>
                <td colspan="6"><span class="cash-receipt">Cash Receipt</span></td>
                <td width="36">Date</td>
                <td width="144"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.date}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="56">Ref. By :</td>
                <td width="482"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.dname || 'MDM'}"></span></td>
                <td width="174">Date and Time of Appointment :</td>
                <td width="316"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.allot_date || selectedPatient.date}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="78">Patient Name:</td>
                <td width="650"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.patient_name}"></span></td>
                <td width="33">Age :</td>
                <td width="144"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.age}Year"></span></td>
                <td width="36">Gender</td>
                <td width="144"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.gender}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="40">Address</td>
                <td width="687"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.address || 'JODHPUR'}"></span></td>
                <td width="687"><span class="form_input_box"><label>Category</label><input type="text" class="form_input" value="${selectedPatient.category || 'Sn. CITIZEN'}"></span></td>
                <td width="33">Phone:</td>
                <td width="333"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.mobile}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="59">Investigations:</td>
                <td width="1042"><span class="form_input_box"><input type="text" class="form_input" value="${selectedPatient.scan_type || 'NCCT Brain / Head,'}"></span></td>
              </tr>
            </table>

            <table>
              <tr>
                <td width="129" height="24">For Sum Of Rupees:</td>
                <td width="733"><span class="form_input_box"><input type="text" class="form_input" value="${amountInWords} RUPEES ONLY"></span></td>
                <td width="147"><label>Scan Amount</label><input type="text" class="amount-box" value="₹ ${selectedPatient.amount}"></td>
                <td width="147"><label>Received Amount</label><input type="text" class="amount-box" value="₹ ${selectedPatient.amount}"></td>
              </tr>
            </table>

            <table>
              <tr>
                <td height="27" colspan="6" align="right">For Varaha SDC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br><span class="footer-text">Jodhpur</span></td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p className="text-gray-900">{selectedPatient.category || 'General'}</p>
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