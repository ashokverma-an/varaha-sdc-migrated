import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const doctors = await dbQuery('SELECT * FROM doctor ORDER BY dname');
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dname, specialization, contact } = await request.json();
    
    const result = await dbQuery(
      'INSERT INTO doctor (dname, specialization, contact) VALUES (?, ?, ?)',
      [dname, specialization || '', contact || '']
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}