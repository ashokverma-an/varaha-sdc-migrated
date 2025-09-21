import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://varahasdc.co.in/api/superadmin/doctors');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Doctors API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch doctors', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}