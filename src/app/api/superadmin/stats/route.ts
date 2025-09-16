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
  try {
    // Use live API
    const response = await fetch('https://varahasdc.co.in/api/superadmin/stats');
    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json(data);
    } else {
      throw new Error('API request failed');
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      todayScans: 0,
      todayReceived: 0,
      todayDue: 0,
      todayWithdraw: 0,
      cashInHand: 0,
      totalAmount: 0
    });
  }
}