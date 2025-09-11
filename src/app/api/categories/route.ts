import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const categories = await dbQuery('SELECT * FROM category ORDER BY category_name');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category_name, amount, description } = await request.json();
    
    const result = await dbQuery(
      'INSERT INTO category (category_name, amount, description) VALUES (?, ?, ?)',
      [category_name, amount, description || '']
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}