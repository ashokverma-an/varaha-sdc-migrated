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
    connection = await mysql.createConnection(dbConfig);
    
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });

    const [totalAmount] = await connection.execute(
      'SELECT SUM(amount) as total FROM patient_new WHERE date = ?', [today]
    );
    
    const [scans] = await connection.execute(
      'SELECT COUNT(*) as count FROM patient_new WHERE date = ?', [today]
    );
    
    const [transactions] = await connection.execute(
      'SELECT SUM(r_amount) as received, SUM(d_amount) as due, SUM(withdraw) as withdraw FROM today_transeciton WHERE added_on = ?', [today]
    );
    
    const received = parseFloat((transactions as any)[0]?.received || 0);
    const due = parseFloat((transactions as any)[0]?.due || 0);
    const withdraw = parseFloat((transactions as any)[0]?.withdraw || 0);
    
    return NextResponse.json({
      todayScans: (scans as any)[0].count,
      todayReceived: received,
      todayDue: due,
      todayWithdraw: withdraw,
      cashInHand: Math.max(0, received - due - withdraw),
      totalAmount: parseFloat((totalAmount as any)[0]?.total || 0)
    });
    
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({
      todayScans: 0,
      todayReceived: 0,
      todayDue: 0,
      todayWithdraw: 0,
      cashInHand: 0,
      totalAmount: 0
    });
  } finally {
    if (connection) await connection.end();
  }
}