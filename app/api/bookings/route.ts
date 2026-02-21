import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  return NextResponse.json({
    success: true,
    booking: {
      id: "booking_" + Date.now(),
      ...body,
      status: "pending"
    }
  })
}
