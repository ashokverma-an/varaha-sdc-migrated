import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Mock data since external console queue API returns 503
    const mockPatients = [
      {
        cro_number: 'CRO001',
        patient_name: 'John Doe',
        age: 45,
        gender: 'Male',
        phone: '9876543210',
        added_on: new Date().toISOString().split('T')[0],
        c_status: 1
      },
      {
        cro_number: 'CRO002', 
        patient_name: 'Jane Smith',
        age: 32,
        gender: 'Female',
        phone: '9876543211',
        added_on: new Date().toISOString().split('T')[0],
        c_status: 1
      }
    ];
    
    const filteredData = search ? 
      mockPatients.filter(p => 
        p.cro_number.toLowerCase().includes(search.toLowerCase()) ||
        p.patient_name.toLowerCase().includes(search.toLowerCase())
      ) : mockPatients;
    
    const total = filteredData.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      success: true,
      data: paginatedData,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error with console queue:', error);
    return NextResponse.json({
      error: 'Failed to fetch console queue data',
      details: error.message
    }, { status: 500 });
  }
}