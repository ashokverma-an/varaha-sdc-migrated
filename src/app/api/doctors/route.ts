import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, secure } from '@/lib/db';

export async function GET() {
  try {
    const doctors = await dbQuery('SELECT * FROM doctor ORDER BY dname ASC');
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const doctorData = {
      dname: secure(data.doctorName || ''),
      age: parseInt(data.age) || 30,
      gender: secure(data.gender || 'Male'),
      specialist: secure(data.specialist || 'NA'),
      contact: secure(data.contact || ''),
      clinic_name: secure(data.clinicName || ''),
      clinic_address: secure(data.clinicAddress || ''),
      register_address: secure(data.registerAddress || '')
    };

    const query = `
      INSERT INTO doctor (dname, age, gender, specialist, contact, clinic_name, clinic_address, register_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbQuery(query, Object.values(doctorData));
    return NextResponse.json({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}