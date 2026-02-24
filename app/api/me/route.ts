export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'huur-een-mens-secret-key-change-in-production';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });
    }
    
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    
    const user = await queryOne(
      `SELECT id, email, name, type, headline, bio, location_city, location_country, 
              hourly_rate, currency, avatar_url, is_verified, is_available, created_at
       FROM users WHERE id = ?`,
      [decoded.id]
    );
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Get skills
    const skills = await queryOne(
      `SELECT s.* FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [user.id]
    );
    
    return NextResponse.json({ success: true, user, skills });
  } catch (error: any) {
    console.error('Error getting user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
