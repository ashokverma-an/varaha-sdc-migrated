import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://varahasdc.co.in/api/admin/stats');
    if (!response.ok) {
      throw new Error('External API call failed');
    }
    
    const data = await response.json();
    
    // Map external API response to reception stats format
    const stats = {
      todayPatients: data.todayPatients || 0,
      totalPatients: data.totalPatients || 0,
      pendingPatients: Math.floor((data.todayPatients || 0) * 0.3), // Estimate
      completedScans: Math.floor((data.totalPatients || 0) * 0.8), // Estimate
      totalHospitals: 5, // Default value
      totalDoctors: 10 // Default value
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Reception stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reception statistics' },
      { status: 500 }
    );
  }
}