import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://varahasdc.co.in/api/doctor/save-nursing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to save nursing data');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: data.message || 'Nursing data saved successfully'
    });
    
  } catch (error) {
    console.error('Save nursing data API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to save nursing data' 
    }, { status: 500 });
  }
}