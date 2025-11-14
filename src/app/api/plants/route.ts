import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const plants = await db.plant.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(plants)
  } catch (error) {
    console.error('Failed to fetch plants:', error)
    return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, strain, plantDate, floweringWeeks, notes } = body
    
    const plant = await db.plant.create({
      data: {
        name,
        strain: strain || null,
        plantDate: new Date(plantDate),
        floweringWeeks: floweringWeeks || 8,
        notes: notes || null,
        imageUrls: '[]'
      }
    })
    
    return NextResponse.json(plant)
  } catch (error) {
    console.error('Failed to create plant:', error)
    return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 })
  }
}