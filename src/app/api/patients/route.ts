import { NextRequest, NextResponse } from 'next/server';
import { getConnection, isDbConnected, testConnection } from '@/lib/db';
import { csvService } from '@/lib/csvService';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Test DB connection first
    await testConnection();
    
    if (isDbConnected()) {
      const connection = await getConnection();

      // Generate CRO number
      const croQuery = 'SELECT MAX(patient_id) as maxId FROM patient_new';
      const [croResult] = await connection.execute(croQuery);
      const nextId = (croResult as any)[0].maxId + 1 || 1;
      const cro = `CRO${String(nextId).padStart(6, '0')}`;

      // Insert patient
      const insertQuery = `
        INSERT INTO patient_new (
          cro, patient_name, age, age_type, gender, category, address, city, 
          contact_number, hospital_id, doctor_name, added_on, admin_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        cro,
        `${data.prefix} ${data.firstName}`,
        data.age,
        data.ageType,
        data.gender,
        data.category,
        data.address,
        data.city,
        data.contactNumber,
        data.hospitalName,
        data.doctorName,
        new Date().toISOString().split('T')[0],
        data.adminId || 1
      ];

      await connection.execute(insertQuery, values);

      return NextResponse.json({ 
        success: true, 
        message: 'Patient registered successfully',
        cro: cro
      });
    } else {
      // CSV mode - return mock success for testing
      const cro = `CRO${String(Date.now()).slice(-6)}`;
      return NextResponse.json({ 
        success: true, 
        message: 'Patient registered successfully (CSV mode - testing only)',
        cro: cro,
        mode: 'csv'
      });
    }

  } catch (error) {
    console.error('Patient registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Test DB connection first
    await testConnection();

    if (isDbConnected()) {
      const connection = await getConnection();
      let query = `
        SELECT p.*, h.h_name as hospital_name, d.dname as doctor_name 
        FROM patient_new p
        LEFT JOIN hospital h ON p.hospital_id = h.h_id
        LEFT JOIN doctor d ON p.doctor_name = d.d_id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (search) {
        query += ' AND (p.patient_name LIKE ? OR p.contact_number LIKE ? OR p.cro LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (category && category !== 'all') {
        query += ' AND p.category = ?';
        params.push(category);
      }

      query += ' ORDER BY p.patient_id DESC LIMIT 50';
      const [rows] = await connection.execute(query, params);

      return NextResponse.json({ success: true, patients: rows });
    } else {
      // CSV fallback
      const patients = await csvService.getPatients(search, category);
      return NextResponse.json({ 
        success: true, 
        patients: patients,
        mode: 'csv',
        message: 'Data loaded from CSV file'
      });
    }

  } catch (error) {
    console.error('Fetch patients error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}