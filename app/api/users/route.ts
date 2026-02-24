export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { queryAll, queryOne, run } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'huur-een-mens-secret-key-change-in-production';

function getUserFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

// GET /api/users - List humans (with filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const city = searchParams.get('city');
    const minRate = searchParams.get('minRate');
    const maxRate = searchParams.get('maxRate');

    let sql = `
      SELECT u.id, u.name, u.headline, u.bio, u.location_city, u.location_country, 
             u.hourly_rate, u.currency, u.avatar_url, u.is_verified, u.is_available,
             u.created_at
      FROM users u
      WHERE u.type = 'human' AND u.is_available = 1
    `;
    const params: any[] = [];

    if (city) {
      sql += ' AND u.location_city LIKE ?';
      params.push(`%${city}%`);
    }

    if (minRate) {
      sql += ' AND u.hourly_rate >= ?';
      params.push(parseFloat(minRate));
    }

    if (maxRate) {
      sql += ' AND u.hourly_rate <= ?';
      params.push(parseFloat(maxRate));
    }

    sql += ' ORDER BY u.is_verified DESC, u.created_at DESC';

    let humans = await queryAll(sql, params);

    // If filtering by skill, filter in memory (simplified)
    if (skill) {
      const userIdsWithSkill = await queryAll(
        `SELECT user_id FROM user_skills us 
         JOIN skills s ON us.skill_id = s.id 
         WHERE s.slug = ?`,
        [skill]
      );
      const allowedIds = new Set(userIdsWithSkill.map((u: any) => u.user_id));
      humans = humans.filter((h: any) => allowedIds.has(h.id));
    }

    // Get skills for each human
    for (let human of humans) {
      human.skills = await queryAll(
        `SELECT s.* FROM skills s 
         JOIN user_skills us ON s.id = us.skill_id 
         WHERE us.user_id = ?`,
        [human.id]
      );
    }

    return NextResponse.json({ success: true, humans });
  } catch (error: any) {
    console.error('Error fetching humans:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/users - Create/update profile
export async function POST(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { headline, bio, location_city, location_country, hourly_rate, skills } = body;

    // Update user
    await run(
      `UPDATE users SET 
        headline = COALESCE(?, headline),
        bio = COALESCE(?, bio),
        location_city = COALESCE(?, location_city),
        location_country = COALESCE(?, location_country),
        hourly_rate = COALESCE(?, hourly_rate),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [headline, bio, location_city, location_country, hourly_rate, user.id]
    );

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      // Remove existing skills
      await run('DELETE FROM user_skills WHERE user_id = ?', [user.id]);
      
      // Add new skills
      for (const skillName of skills) {
        const skill = await queryOne('SELECT id FROM skills WHERE slug = ?', [skillName]);
        if (skill) {
          await run('INSERT OR IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)', [user.id, skill.id]);
        }
      }
    }

    const updatedUser = await queryOne('SELECT * FROM users WHERE id = ?', [user.id]);
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
