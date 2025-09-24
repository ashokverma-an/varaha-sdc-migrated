import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const response = await fetch(`https://varahasdc.co.in/api/console/queue?date=${date}`, {
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
  } catch (error: any) {
    console.error('Error fetching console queue:', error);
    const { searchParams } = new URL(request.url);
    return NextResponse.json({
      error: 'Failed to fetch console queue data',
      details: error.message,
      stack: error.stack,
      query: Object.fromEntries(searchParams),
      fetchUrl: `https://varahasdc.co.in/api/console/queue?date=${searchParams.get('date') || new Date().toISOString().split('T')[0]}`,
      errorType: 'External API Error'
    }, { status: 500 });
  }
}