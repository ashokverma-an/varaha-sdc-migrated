'use client';

import { useState, useEffect } from 'react';
import { Receipt, Plus, Calendar, DollarSign, Save, ArrowLeft } from 'lucide-react';
import { useToastContext } from '@/context/ToastContext';

interface Transaction {
  id: number;
  withdraw: number;
  r_amount: number;
  d_amount: number;
  added_on: string;
  remark: string;
}

export default function Voucher() {
  const toast = useToastContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    withdraw: '',
    r_amount: '',
    d_amount: '',
    remark: ''
  });

  const today = new Date().toLocaleDateString('en-GB');

  useEffect(() => {
    fetchTodayTransactions();
  }, []);

  const fetchTodayTransactions = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: Transaction[] = [
        {
          id: 1,
          withdraw: 500,
          r_amount: 2000,
          d_amount: 300,
          added_on: today,
          remark: 'Daily collection'
        }
      ];
      setTransactions(mockData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const withdraw = parseFloat(formData.withdraw) || 0;
    const received = parseFloat(formData.r_amount) || 0;
    const due = parseFloat(formData.d_amount) || 0;

    if (withdraw < 0 || received < 0 || due < 0) {
      toast.error('Amounts cannot be negative');
      return false;
    }

    if (withdraw === 0 && received === 0 && due === 0) {
      toast.error('At least one amount must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock submission - replace with actual API call
      const newTransaction: Transaction = {
        id: Date.now(),
        withdraw: parseFloat(formData.withdraw) || 0,
        r_amount: parseFloat(formData.r_amount) || 0,
        d_amount: parseFloat(formData.d_amount) || 0,
        added_on: today,
        remark: formData.remark
      };

      setTransactions(prev => [...prev, newTransaction]);
      
      // Reset form
      setFormData({
        withdraw: '',
        r_amount: '',
        d_amount: '',
        remark: ''
      });
      
      setShowForm(false);
      toast.error('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate totals
  const totals = transactions.reduce(
    (acc, transaction) => ({
      withdraw: acc.withdraw + transaction.withdraw,
      received: acc.received + transaction.r_amount,
      due: acc.due + transaction.d_amount
    }),
    { withdraw: 0, received: 0, due: 0 }
  );

  const cashInHand = totals.received - totals.due - totals.withdraw;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Daily Voucher</h1>
        <p className="text-blue-100 text-lg">Manage daily cash transactions and vouchers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Received Amount</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-2">₹{totals.received.toLocaleString()}</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Due Amount</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">₹{totals.due.toLocaleString()}</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Withdraw</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-2">₹{totals.withdraw.toLocaleString()}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Cash in Hand</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">₹{Math.max(0, cashInHand).toLocaleString()}</div>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add New Transaction</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Received Amount (₹)
                </label>
                <input
                  type="number"
                  name="r_amount"
                  value={formData.r_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Due Amount (₹)
                </label>
                <input
                  type="number"
                  name="d_amount"
                  value={formData.d_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Withdraw Amount (₹)
                </label>
                <input
                  type="number"
                  name="withdraw"
                  value={formData.withdraw}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction details..."
              />
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? 'Saving...' : 'Save Transaction'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Today's Transactions ({today})</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Transaction</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Received (₹)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Due (₹)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Withdraw (₹)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600 font-medium">
                      ₹{transaction.r_amount.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-red-600 font-medium">
                      ₹{transaction.d_amount.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-orange-600 font-medium">
                      ₹{transaction.withdraw.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.added_on}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.remark || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 px-4 py-2">Total</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">
                    ₹{totals.received.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-red-600">
                    ₹{totals.due.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-orange-600">
                    ₹{totals.withdraw.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                </tr>
              </tfoot>
            </table>
            
            {transactions.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Today</h3>
                <p className="text-gray-500">Add your first transaction to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}