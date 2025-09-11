import { NextResponse } from 'next/server';
import { csvService } from '@/lib/csvService';

export async function GET() {
  try {
    const stats = await csvService.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ 
      totalPatients: 0, 
      todayPatients: 0, 
      pendingScans: 0, 
      completedScans: 0 
    });
  }
}