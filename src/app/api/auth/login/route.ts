import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const defaultAdmins = [
      { admin_id: '1', username: 'super_admin', password: 'Super@Admin123', admin_type: 'super_admin', name: 'Super Administrator' },
      { admin_id: '2', username: 'admin', password: 'Admin@Varaha', admin_type: 'admin', name: 'System Administrator' },
      { admin_id: '3', username: 'reception', password: 'Admin@321', admin_type: 'reception', name: 'Reception Desk' },
      { admin_id: '4', username: 'doctor', password: 'Admin@321', admin_type: 'doctor', name: 'Dr. Medical Officer' },
      { admin_id: '5', username: 'nurse', password: 'Admin@321', admin_type: 'nurse', name: 'Nursing Staff' },
      { admin_id: '6', username: 'console', password: 'Admin@321', admin_type: 'console', name: 'Console Operator' }
    ];
    
    const user = defaultAdmins.find(admin => admin.username === username && admin.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}