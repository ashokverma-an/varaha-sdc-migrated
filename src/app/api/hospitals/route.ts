import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://varahasdc.co.in/api/admin/hospitals');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Hospitals API error:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}