import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plant = await db.plant.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }
    
    return NextResponse.json(plant)
  } catch (error) {
    console.error('Failed to fetch plant:', error)
    return NextResponse.json({ error: 'Failed to fetch plant' }, { status: 500 })
  }
}