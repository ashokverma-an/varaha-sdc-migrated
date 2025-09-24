import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_management'
};

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get last enrolled patient
    const query = `
      SELECT cro, patient_name 
      FROM patient_new 
      WHERE patient_id = (SELECT MAX(patient_id) FROM patient_new)
    `;
    
    const [rows] = await connection.execute(query);
    await connection.end();
    
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({
        success: true,
        data: rows[0]
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch last enrolled patient' },
      { status: 500 }
    );
  }
}