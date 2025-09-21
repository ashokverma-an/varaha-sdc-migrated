import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { cro: string } }) {
  try {
    const { cro } = params;
    
    const response = await fetch(`https://varahasdc.co.in/api/console/patient/${cro}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patient console data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient console data' },
      { status: 500 }
    );
  }
}