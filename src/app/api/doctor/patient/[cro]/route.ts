import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ cro: string }> }) {
  try {
    const { cro } = await params;
    const decodedCro = decodeURIComponent(cro);
    
    const response = await fetch(`https://varahasdc.co.in/api/doctor/patient/${encodeURIComponent(decodedCro)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
      throw new Error('Failed to fetch patient details');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data
    });
    
  } catch (error) {
    console.error('Patient detail API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch patient details' 
    }, { status: 500 });
  }
}