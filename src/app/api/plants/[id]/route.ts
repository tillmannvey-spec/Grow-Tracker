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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, strain, plantDate, floweringStartDate, floweringWeeks, notes, imageUrls } = body

    const plant = await db.plant.update({
      where: {
        id: params.id
      },
      data: {
        name,
        strain: strain || null,
        plantDate: new Date(plantDate),
        floweringStartDate: floweringStartDate ? new Date(floweringStartDate) : null,
        floweringWeeks: floweringWeeks ? parseInt(floweringWeeks, 10) : 8,
        notes: notes || null,
        imageUrls: imageUrls || '[]'
      }
    })

    return NextResponse.json(plant)
  } catch (error) {
    console.error('Failed to update plant:', error)
    return NextResponse.json({ error: 'Failed to update plant' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.plant.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete plant:', error)
    return NextResponse.json({ error: 'Failed to delete plant' }, { status: 500 })
  }
}