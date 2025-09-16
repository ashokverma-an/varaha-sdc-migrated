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
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    
    connection = await mysql.createConnection(dbConfig);
    
    let query = `
      SELECT 
        p.patient_id,
        p.cro,
        p.patient_name,
        p.age,
        p.gender,
        p.mobile,
        p.date,
        p.amount,
        d.doctor_name,
        h.hospital_name,
        s.scan_name
      FROM patient_new p
      LEFT JOIN doctor d ON d.d_id = p.doctor_name
      LEFT JOIN hospital h ON h.h_id = p.hospital_id
      LEFT JOIN scan s ON s.scan_id = p.scan_type
    `;
    
    const params = [];
    
    if (fromDate && toDate) {
      query += ` WHERE STR_TO_DATE(p.date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')`;
      params.push(fromDate, toDate);
    }
    
    query += ` ORDER BY p.patient_id DESC LIMIT 1000`;
    
    const [patients] = await connection.execute(query, params);
    
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