import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, secure } from '@/lib/db';

export async function GET() {
  try {
    const hospitals = await dbQuery('SELECT * FROM hospital ORDER BY h_name ASC');
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const hospitalData = {
      h_name: secure(data.hospital || ''),
      h_short: secure(data.shortName || ''),
      h_type: secure(data.type || 'Private'),
      h_contact: secure(data.contact || ''),
      h_address: secure(data.address || '')
    };

    const query = `
      INSERT INTO hospital (h_name, h_short, h_type, h_contact, h_address)
      VALUES (?, ?, ?, ?, ?)
    `;

    await dbQuery(query, Object.values(hospitalData));
    return NextResponse.json({ success: true, message: 'Hospital added successfully' });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}