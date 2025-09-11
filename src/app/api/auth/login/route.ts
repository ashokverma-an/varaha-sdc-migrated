import { NextRequest, NextResponse } from 'next/server';
import { getConnection, isDbConnected } from '@/lib/db';
import { csvService } from '@/lib/csvService';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    let user = null;

    // Try MySQL first
    if (isDbConnected()) {
      try {
        const connection = await getConnection();
        const [rows] = await connection.execute<RowDataPacket[]>(
          'SELECT * FROM admin WHERE username = ?',
          [username]
        );
        if (rows.length > 0) {
          user = rows[0] as any;
        }
      } catch (error) {
        console.error('MySQL query failed, falling back to CSV:', error);
      }
    }

    // Fallback to CSV if MySQL failed or no user found
    if (!user) {
      console.log('Using CSV fallback for authentication');
      const admins = await csvService.getAdmins();
      user = admins.find(admin => admin.username === username);
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Direct password comparison (as in PHP SDK admin)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      dataSource: isDbConnected() ? 'mysql' : 'csv'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}