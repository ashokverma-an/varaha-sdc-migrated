import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM hospital ORDER BY h_name');
    return NextResponse.json({ success: true, hospitals: rows });
  } catch (error) {
    console.error('Hospitals API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, contact } = await request.json();
    const connection = await getConnection();
    
    await connection.execute(
      'INSERT INTO hospital (h_name, h_address, h_contact) VALUES (?, ?, ?)',
      [name, address, contact]
    );
    
    return NextResponse.json({ success: true, message: 'Hospital added successfully' });
  } catch (error) {
    console.error('Hospital POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add hospital' }, { status: 500 });
  }
}