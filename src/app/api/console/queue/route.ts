import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT 
        lb.cro_number,
        p.patient_name,
        p.pre,
        p.allot_date,
        p.scan_type
      FROM lab_banch lb
      JOIN patient_new p ON p.cro = lb.cro_number
      WHERE lb.c_status = 1 
      AND DATE(lb.added_on) >= '2023-05-01'
      ORDER BY lb.p_id DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch queue patients' }, { status: 500 });
  }
}