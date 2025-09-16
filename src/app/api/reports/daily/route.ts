import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    
    const query = `
      SELECT 
        p.cro,
        p.patient_name,
        p.age,
        p.gender,
        p.category,
        p.contact_number,
        p.amount,
        p.amount_reci,
        p.amount_due,
        p.scan_status,
        h.h_name as hospital_name,
        d.dname as doctor_name
      FROM patient_new p
      LEFT JOIN hospital h ON p.hospital_id = h.h_id
      LEFT JOIN doctor d ON p.doctor_name = d.d_id
      WHERE p.date = ?
      ORDER BY p.cro DESC
    `;
    
    const patients = await dbQuery(query, [date]);
    
    const totals = {
      total_amount: patients.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0),
      received_amount: patients.reduce((sum: number, p: any) => sum + (parseFloat(p.amount_reci) || 0), 0),
      due_amount: patients.reduce((sum: number, p: any) => sum + (parseFloat(p.amount_due) || 0), 0),
      total_patients: patients.length,
      completed_scans: patients.filter((p: any) => p.scan_status === 1).length,
      pending_scans: patients.filter((p: any) => p.scan_status === 0).length
    };
    
    return NextResponse.json({ patients, totals, date });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return NextResponse.json({ error: 'Failed to fetch daily report' }, { status: 500 });
  }
}