import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { notes } = body
    
    const wateringRecord = await db.wateringRecord.create({
      data: {
        plantId: params.id,
        notes: notes || null
      }
    })
    
    return NextResponse.json(wateringRecord)
  } catch (error) {
    console.error('Failed to create watering record:', error)
    return NextResponse.json({ error: 'Failed to create watering record' }, { status: 500 })
  }
}