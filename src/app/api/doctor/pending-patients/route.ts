import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://varahasdc.co.in/api/doctor/pending-patients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending patients');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || []
    });
    
  } catch (error) {
    console.error('Pending patients API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch pending patients' 
    }, { status: 500 });
  }
}