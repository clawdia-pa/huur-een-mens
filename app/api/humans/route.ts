import { NextResponse } from 'next/server'

export async function GET() {
  const humans = [
    {
      id: "1",
      name: "Jan Jansen",
      headline: "Ervaren koerier",
      location: "Amsterdam",
      hourlyRate: 35,
      skills: ["Rijden", "Boodschappen"]
    },
    {
      id: "2", 
      name: "Marie de Vries",
      headline: "Professionele fotograaf",
      location: "Rotterdam",
      hourlyRate: 50,
      skills: ["Fotografie", "Video"]
    }
  ]
  
  return NextResponse.json({ success: true, humans })
}
