import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, secure } from '@/lib/db';

export async function GET() {
  try {
    const patients = await dbQuery('SELECT * FROM patient_new ORDER BY date DESC LIMIT 100');
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate CRO number
    const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const countResult = await dbQuery('SELECT COUNT(*) as count FROM patient_new WHERE date = ?', [today]);
    const count = countResult[0]?.count || 0;
    const cro = `VDC/${today}/${count + 1}`;
    
    // Sanitize inputs
    const patientData = {
      pre: secure(data.pre || ''),
      patient_name: secure(data.patient_name || ''),
      hospital_id: parseInt(data.hospital_id) || 0,
      doctor_name: parseInt(data.doctor_name) || 0,
      cro: cro,
      age: secure(data.age || ''),
      gender: secure(data.gender || ''),
      category: secure(data.category || ''),
      p_uni_id_submit: secure(data.p_uni_id_submit || ''),
      p_uni_id_name: secure(data.p_uni_id_name || ''),
      date: today,
      contact_number: secure(data.contact_number || ''),
      address: secure(data.address || ''),
      city: secure(data.city || ''),
      scan_type: secure(data.scan_type || ''),
      total_scan: parseInt(data.total_scan) || 0,
      amount: parseFloat(data.amount) || 0,
      discount: parseFloat(data.discount) || 0,
      amount_reci: parseFloat(data.amount_reci) || 0,
      amount_due: parseFloat(data.amount_due) || 0,
      allot_date: secure(data.allot_date || ''),
      allot_time: secure(data.allot_time || ''),
      scan_date: secure(data.scan_date || ''),
      admin_id: parseInt(data.admin_id) || 0,
      scan_status: 0
    };

    const query = `
      INSERT INTO patient_new (
        pre, patient_name, hospital_id, doctor_name, cro, age, gender, category,
        p_uni_id_submit, p_uni_id_name, date, contact_number, address, city,
        scan_type, total_scan, amount, discount, amount_reci, amount_due,
        allot_date, allot_time, scan_date, admin_id, scan_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = Object.values(patientData);
    await dbQuery(query, values);

    return NextResponse.json({ success: true, cro, message: 'Patient registered successfully' });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}