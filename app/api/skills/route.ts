export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { queryAll } from '@/lib/db';

export async function GET() {
  try {
    const skills = await queryAll('SELECT * FROM skills ORDER BY name');
    return NextResponse.json({ success: true, skills });
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
