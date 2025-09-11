'use client';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { Eye } from 'lucide-react';

export default function VoucherList() {
  const [vouchers] = useState([
    { id: 6915, voucherNo: '6919', recipient: 'MR.KAPIL (HEMLATA SDC/16-10-2019/41)', amount: 2200, date: '22-10-2019' },
    { id: 6914, voucherNo: '6918', recipient: 'MR.CHHAGAN LAL BHATI (RAVI BHATI SDC/19-10-2019/14)', amount: 5700, date: '22-10-2019' }
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Voucher List</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">S.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Voucher No.</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Recipient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-normal text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vouchers.map((voucher, index) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{voucher.id}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{voucher.voucherNo}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-700">{voucher.recipient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">₹{voucher.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-700">{voucher.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <button className="text-blue-600 hover:text-blue-900 underline">
                        View Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}