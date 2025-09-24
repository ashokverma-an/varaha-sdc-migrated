import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    
    // Build query string for external API
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });
    
    const response = await fetch(`https://varahasdc.co.in/api/console/queue?${queryParams}`, {
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
      fetchUrl: `https://varahasdc.co.in/api/console/queue?${new URLSearchParams({
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '10',
        ...(searchParams.get('search') && { search: searchParams.get('search')! })
      })}`,
      errorType: 'External API Error'
    }, { status: 500 });
  }
}