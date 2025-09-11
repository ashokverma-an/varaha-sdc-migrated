import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalScansResult = await dbQuery('SELECT COUNT(*) as count FROM console');
    const totalScans = totalScansResult[0]?.count || 0;

    const todayScansResult = await dbQuery(
      'SELECT COUNT(*) as count FROM console WHERE DATE(STR_TO_DATE(added_on, "%d-%m-%Y")) = ?',
      [today]
    );
    const todayScans = todayScansResult[0]?.count || 0;

    const pendingQueueResult = await dbQuery('SELECT COUNT(*) as count FROM lab_banch WHERE c_status = 1');
    const pendingQueue = pendingQueueResult[0]?.count || 0;

    const completedTodayResult = await dbQuery(
      'SELECT COUNT(*) as count FROM console WHERE status = "Complete" AND DATE(STR_TO_DATE(added_on, "%d-%m-%Y")) = ?',
      [today]
    );
    const completedToday = completedTodayResult[0]?.count || 0;

    return NextResponse.json({
      totalScans,
      todayScans,
      pendingQueue,
      completedToday
    });
  } catch (error) {
    console.error('Error fetching console stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}