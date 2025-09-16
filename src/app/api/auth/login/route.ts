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

export async function POST(request: NextRequest) {
  let connection;
  try {
    const { username, password } = await request.json();
    
    connection = await mysql.createConnection(dbConfig);
    
    const [users] = await connection.execute(
      'SELECT * FROM admin WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (Array.isArray(users) && users.length > 0) {
      const user = users[0] as any;
      return NextResponse.json({
        success: true,
        user: {
          id: user.admin_id,
          username: user.username,
          role: user.admin_type
        }
      });
    } else {
      return NextResponse.json({
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      error: 'Login failed'
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}