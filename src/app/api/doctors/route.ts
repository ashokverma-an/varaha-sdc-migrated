import { NextRequest, NextResponse } from 'next/server';
import { csvService } from '@/lib/csvService';

export async function GET(request: NextRequest) {
  try {
    const doctors = await csvService.getDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}