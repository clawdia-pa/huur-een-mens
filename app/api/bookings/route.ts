import { NextResponse } from 'next/server';
import { queryAll, queryOne, run } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'huur-een-mens-secret-key-change-in-production';

function getUserFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

// GET /api/bookings - List bookings for current user
export async function GET(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = `
      SELECT b.*, 
             hu.name as human_name, hu.headline as human_headline,
             au.name as agent_name
      FROM bookings b
      LEFT JOIN users hu ON b.human_id = hu.id
      LEFT JOIN users au ON b.agent_id = au.id
      WHERE b.human_id = ? OR b.agent_id = ?
    `;
    const params: any[] = [user.id, user.id];

    if (status) {
      sql += ' AND b.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY b.created_at DESC';

    const bookings = await queryAll(sql, params);

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/bookings - Create a booking
export async function POST(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { human_id, task_description, task_location, task_date, task_time, duration_hours, notes } = body;

    // Get human's hourly rate
    const human = await queryOne('SELECT hourly_rate FROM users WHERE id = ?', [human_id]);
    if (!human) {
      return NextResponse.json({ success: false, error: 'Human not found' }, { status: 404 });
    }

    const total_price = human.hourly_rate * (duration_hours || 1);
    const id = 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    await run(
      `INSERT INTO bookings (id, human_id, agent_id, task_description, task_location, task_date, task_time, duration_hours, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, human_id, user.id, task_description, task_location, task_date, task_time, duration_hours || 1, total_price, notes]
    );

    const booking = await queryOne('SELECT * FROM bookings WHERE id = ?', [id]);

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/bookings - Update booking status
export async function PATCH(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, status } = body;

    // Verify user owns the booking
    const booking = await queryOne(
      'SELECT * FROM bookings WHERE id = ? AND (human_id = ? OR agent_id = ?)',
      [booking_id, user.id, user.id]
    );

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    await run(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, booking_id]
    );

    const updated = await queryOne('SELECT * FROM bookings WHERE id = ?', [booking_id]);

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
