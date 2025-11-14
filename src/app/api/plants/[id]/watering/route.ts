import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wateringRecords = await db.wateringRecord.findMany({
      where: {
        plantId: params.id
      },
      orderBy: {
        wateredAt: 'desc'
      }
    })
    
    return NextResponse.json(wateringRecords)
  } catch (error) {
    console.error('Failed to fetch watering records:', error)
    return NextResponse.json({ error: 'Failed to fetch watering records' }, { status: 500 })
  }
}