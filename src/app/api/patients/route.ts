import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    const query = `
      SELECT p.*, h.hospital_name, d.dname as doctor_name 
      FROM patient_new p 
      LEFT JOIN hospital h ON p.hospital_name = h.h_id 
      LEFT JOIN doctor d ON p.doctor_name = d.d_id 
      ORDER BY p.patient_id DESC
    `;

    const patients = await dbQuery(query);

    if (format === 'excel') {
      const excelData = generatePatientsExcel(patients);
      return new NextResponse(excelData, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="PATIENTS_LIST_${new Date().toISOString().split('T')[0]}.xls"`
        }
      });
    }

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
    const croResult = await dbQuery('SELECT MAX(patient_id) as max_id FROM patient_new');
    const nextId = (croResult[0]?.max_id || 0) + 1;
    const cro = `CRO${nextId.toString().padStart(6, '0')}`;
    
    const result = await dbQuery(`
      INSERT INTO patient_new (
        cro, patient_name, age, gender, contact_number, address,
        hospital_name, doctor_name, category, amount, date,
        allot_date, allot_time, scan_type, remark, scan_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      cro, data.patient_name, data.age, data.gender, data.contact_number,
      data.address, data.hospital_name, data.doctor_name, data.category,
      data.amount, data.date, data.allot_date, data.allot_time,
      data.scan_type, data.remark
    ]);
    
    return NextResponse.json({ success: true, id: result.insertId, cro });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

function generatePatientsExcel(patients: any[]): string {
  let excel = `<html><body><table border="1">`;
  excel += `<tr><th colspan="10">VARAHA SDC - PATIENTS LIST</th></tr>`;
  excel += `<tr><th>S.No</th><th>CRO</th><th>Patient Name</th><th>Age/Gender</th><th>Contact</th><th>Hospital</th><th>Doctor</th><th>Category</th><th>Amount</th><th>Date</th></tr>`;

  let totalAmount = 0;
  patients.forEach((patient, index) => {
    totalAmount += parseFloat(patient.amount || 0);
    excel += `<tr>`;
    excel += `<td>${index + 1}</td>`;
    excel += `<td>${patient.cro || ''}</td>`;
    excel += `<td>${patient.patient_name || ''}</td>`;
    excel += `<td>${patient.age || ''}/${patient.gender || ''}</td>`;
    excel += `<td>${patient.contact_number || ''}</td>`;
    excel += `<td>${patient.hospital_name || ''}</td>`;
    excel += `<td>${patient.doctor_name || ''}</td>`;
    excel += `<td>${patient.category || ''}</td>`;
    excel += `<td>${patient.amount || 0}</td>`;
    const date = new Date(patient.date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = patient.date ? `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}` : '';
    excel += `<td>${formattedDate}</td>`;
    excel += `</tr>`;
  });

  excel += `<tr><th colspan="8">TOTAL</th><th>${totalAmount}</th><th></th></tr>`;
  excel += `</table></body></html>`;

  return excel;
}