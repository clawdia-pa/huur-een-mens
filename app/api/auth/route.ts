export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { queryOne, run } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'huur-een-mens-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, type } = body;

    if (action === 'register') {
      // Check if user exists
      const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
      if (existing) {
        return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Generate ID
      const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Insert user
      await run(
        'INSERT INTO users (id, email, name, password_hash, type) VALUES (?, ?, ?, ?, ?)',
        [id, email, name, passwordHash, type || 'human']
      );

      // Generate token
      const token = jwt.sign({ id, email, name, type }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        success: true,
        token,
        user: { id, email, name, type: type || 'human' }
      });
    }

    if (action === 'login') {
      const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, type: user.type },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          headline: user.headline,
          bio: user.bio,
          location_city: user.location_city,
          location_country: user.location_country,
          hourly_rate: user.hourly_rate,
          is_verified: user.is_verified
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
