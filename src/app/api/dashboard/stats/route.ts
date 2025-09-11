import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get total patients
    const totalPatientsResult = await dbQuery('SELECT COUNT(*) as count FROM patient_new');
    const totalPatients = totalPatientsResult[0]?.count || 0;

    // Get today's patients
    const todayPatientsResult = await dbQuery(
      'SELECT COUNT(*) as count FROM patient_new WHERE DATE(STR_TO_DATE(date, "%d-%m-%Y")) = ?',
      [today]
    );
    const todayPatients = todayPatientsResult[0]?.count || 0;

    // Get total revenue
    const totalRevenueResult = await dbQuery('SELECT SUM(amount) as total FROM patient_new');
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Get today's revenue
    const todayRevenueResult = await dbQuery(
      'SELECT SUM(amount) as total FROM patient_new WHERE DATE(STR_TO_DATE(date, "%d-%m-%Y")) = ?',
      [today]
    );
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // Get pending reports
    const pendingReportsResult = await dbQuery('SELECT COUNT(*) as count FROM patient_new WHERE scan_status = 0');
    const pendingReports = pendingReportsResult[0]?.count || 0;

    // Get completed scans
    const completedScansResult = await dbQuery('SELECT COUNT(*) as count FROM patient_new WHERE scan_status = 1');
    const completedScans = completedScansResult[0]?.count || 0;

    return NextResponse.json({
      totalPatients,
      todayPatients,
      totalRevenue: parseFloat(totalRevenue) || 0,
      todayRevenue: parseFloat(todayRevenue) || 0,
      pendingReports,
      completedScans
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}