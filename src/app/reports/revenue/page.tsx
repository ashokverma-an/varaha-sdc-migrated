'use client';

import Layout from '@/components/layout/Layout';
import { FormInput, FormButton } from '@/components/ui/FormComponents';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function ReportsRevenue() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-700">Report By Day</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="max-w-md">
            <FormInput
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="dd-mm-yyyy"
            />
            <div className="mt-4">
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