import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plant = await db.plant.update({
      where: {
        id: params.id
      },
      data: {
        floweringStartDate: new Date()
      }
    })

    return NextResponse.json(plant)
  } catch (error) {
    console.error('Failed to start flowering:', error)
    return NextResponse.json({ error: 'Failed to start flowering' }, { status: 500 })
  }
}
