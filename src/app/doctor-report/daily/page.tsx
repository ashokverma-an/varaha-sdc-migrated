'use client';

import Layout from '@/components/layout/Layout';
import { FormInput, FormButton } from '@/components/ui/FormComponents';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function DoctorReportDaily() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Report By Day</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <FormInput
              label="From"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <FormInput
              label="To"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <div className="md:col-span-2">
              <FormButton>
                <Search className="h-4 w-4" />
                <span>Generate Report</span>
              </FormButton>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}