import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { cro: string } }) {
  try {
    const cro = decodeURIComponent(params.cro);
    
    // Get patient details
    const response = await fetch(`https://varahasdc.co.in/api/admin/patients/search?q=${encodeURIComponent(cro)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch patient details');
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    const patient = data.data[0];
    
    // Add console-specific data
    const consoleData = {
      ...patient,
      console_date: patient.date,
      examination_time: new Date().toLocaleDateString('en-GB'),
      referring_physician: patient.doctor_name || 'MDM',
      mri_details: [
        {
          id: 1,
          name: 'NCCT Brain / Head',
          status: patient.scan_status === 1 ? 'completed' : 'pending'
        }
      ],
      timer: {
        start_time: null,
        stop_time: null,
        elapsed: 0
      }
    };

    return NextResponse.json({
      success: true,
      data: consoleData
    });
    
  } catch (error) {
    console.error('Console patient API error:', error);
    return NextResponse.json({ error: 'Failed to fetch patient details' }, { status: 500 });
  }
}