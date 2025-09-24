import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const params = new URLSearchParams({
      page: page.toString(),
      search: search,
      limit: limit.toString()
    });
    
    const response = await fetch(`https://varahasdc.co.in/api/doctor/patient-in-queue?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient in queue data');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || page,
      total: data.total || 0
    });
    
  } catch (error) {
    console.error('Patient in queue API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch patient in queue data' 
    }, { status: 500 });
  }
}