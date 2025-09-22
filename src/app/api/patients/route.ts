import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const before = searchParams.get('before');
    
    let apiUrl = 'https://varaha-api-qpkj.vercel.app/api/patients';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (date) params.append('date_from', date);
    if (before) params.append('date_to', before);
    
    if (params.toString()) {
      apiUrl += '/search?' + params.toString();
    }
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('External API call failed');
    }
    
    const data = await response.json();
    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Map frontend data to API format
    const patientData = {
      patient_name: data.patient_name,
      age: data.age,
      gender: data.gender,
      mobile: data.mobile,
      doctor_name: data.doctor_id,
      hospital_id: data.hospital_id,
      scan_type: data.category_id,
      amount: data.amount || 1500,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      notes: data.notes || ''
    };
    
    const response = await fetch('https://varaha-api-qpkj.vercel.app/api/patients/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      throw new Error('External API call failed');
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}