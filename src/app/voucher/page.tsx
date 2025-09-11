'use client';

import Layout from '@/components/layout/Layout';
import { FormInput, FormSelect, FormButton } from '@/components/ui/FormComponents';
import { useState } from 'react';
import { Save, Printer } from 'lucide-react';

export default function Voucher() {
  const [formData, setFormData] = useState({
    voucherNo: '6920',
    dated: '11-09-2025',
    typeOfVoucher: 'Debit A/c',
    payTo: '',
    rupees: '',
    byCash: '',
    chequeDate: '11-09-2025',
    onAccount: '',
    requestedBy: '',
    authorizedBy: ''
  });

  const voucherTypes = [
    { value: 'Debit A/c', label: 'Debit A/c' },
    { value: 'Credit A/c', label: 'Credit A/c' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">CASH / BANK Voucher</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Voucher No."
              type="text"
              value={formData.voucherNo}
              onChange={(e) => setFormData({...formData, voucherNo: e.target.value})}
            />
            <FormInput
              label="Dated"
              type="date"
              value={formData.dated}
              onChange={(e) => setFormData({...formData, dated: e.target.value})}
            />
            <FormSelect
              label="Type Of Voucher"
              value={formData.typeOfVoucher}
              onChange={(e) => setFormData({...formData, typeOfVoucher: e.target.value})}
              options={voucherTypes}
            />
            <FormInput
              label="Pay to Mr. / Ms. M/s"
              type="text"
              value={formData.payTo}
              onChange={(e) => setFormData({...formData, payTo: e.target.value})}
              placeholder="Please enter Name Of Recipient"
            />
            <FormInput
              label="Rupees"
              type="number"
              value={formData.rupees}
              onChange={(e) => setFormData({...formData, rupees: e.target.value})}
              placeholder="Please enter Amount"
            />
            <FormInput
              label="By Cash / Cheque / Draft No."
              type="text"
              value={formData.byCash}
              onChange={(e) => setFormData({...formData, byCash: e.target.value})}
              placeholder="Please enter Name Of Recipient"
            />
            <FormInput
              label="Dated"
              type="date"
              value={formData.chequeDate}
              onChange={(e) => setFormData({...formData, chequeDate: e.target.value})}
            />
            <FormInput
              label="On account of"
              type="text"
              value={formData.onAccount}
              onChange={(e) => setFormData({...formData, onAccount: e.target.value})}
              placeholder="Please enter Name Of Recipient"
            />
            <FormInput
              label="Requested By"
              type="text"
              value={formData.requestedBy}
              onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
            />
            <FormInput
              label="Authorized By"
              type="text"
              value={formData.authorizedBy}
              onChange={(e) => setFormData({...formData, authorizedBy: e.target.value})}
            />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm font-normal text-gray-700">
              Thank you very much for doing business with us. We look forward to working with you again!
            </p>
          </div>

          <div className="flex space-x-4 mt-6">
            <FormButton>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </FormButton>
            <FormButton>
              <Save className="h-4 w-4" />
              <span>Save & Print</span>
            </FormButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}