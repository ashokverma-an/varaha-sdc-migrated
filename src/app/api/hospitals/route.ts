import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const hospitals = await dbQuery('SELECT * FROM hospital ORDER BY hospital_name');
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hospital_name, h_short, address, contact } = await request.json();
    
    const result = await dbQuery(
      'INSERT INTO hospital (hospital_name, h_short, address, contact) VALUES (?, ?, ?, ?)',
      [hospital_name, h_short, address || '', contact || '']
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}