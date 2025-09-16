import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'RootPass2024!',
  database: process.env.DB_NAME || 'varaosrc_hospital_management',
  port: parseInt(process.env.DB_PORT || '3307'),
  connectTimeout: 60000
};

export async function GET(request: NextRequest) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from_date') || new Date().toISOString().split('T')[0];
    const toDate = searchParams.get('to_date') || new Date().toISOString().split('T')[0];
    
    connection = await mysql.createConnection(dbConfig);
    
    // Same query as sdc_admin superadmin/patient_report.php
    const query = `
      SELECT 
        lab_banch.p_id,
        lab_banch.cro_number,
        patient_new.patient_name,
        doctor.doctor_name as dname,
        hospital.hospital_name as h_name,
        patient_new.amount,
        lab_banch.remark,
        patient_new.date,
        patient_new.age,
        patient_new.gender,
        patient_new.mobile
      FROM lab_banch
      JOIN patient_new ON patient_new.cro = lab_banch.cro_number
      JOIN hospital ON hospital.h_id = patient_new.hospital_id 
      JOIN doctor ON doctor.d_id = patient_new.doctor_name 
      WHERE DATE(STR_TO_DATE(patient_new.date, '%d-%m-%Y')) BETWEEN ? AND ?
      ORDER BY lab_banch.p_id DESC
    `;
    
    const [patients] = await connection.execute(query, [fromDate, toDate]);
    
    return NextResponse.json({
      success: true,
      data: patients,
      total: Array.isArray(patients) ? patients.length : 0
    });
    
  } catch (error) {
    console.error('Patient report error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch patient report'
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}