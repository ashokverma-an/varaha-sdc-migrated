import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM scan ORDER BY s_name');

    return NextResponse.json({ success: true, scans: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch scans' }, { status: 500 });
  }
}