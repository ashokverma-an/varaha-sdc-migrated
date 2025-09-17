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
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'https://varahasdc.co.in/api';
    const apiUrl = `${API_BASE_URL}/superadmin/stats`;
    
    console.log('Calling external API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Ensure fresh data
    });
    
    console.log('External API response status:', response.status);
    
    const data = await response.json();
    console.log('External API response data:', data);
    
    if (response.ok) {
      return NextResponse.json(data);
    } else {
      console.error('External API error:', data);
      throw new Error(data.error || 'API request failed');
    }
    
  } catch (error) {
    console.error('Superadmin stats API Error:', error);
    
    // Return fallback data
    return NextResponse.json({
      todayScans: 0,
      todayReceived: 0,
      todayDue: 0,
      todayWithdraw: 0,
      cashInHand: 0,
      totalAmount: 0,
      error: 'Failed to fetch stats from external API'
    });
  }
}