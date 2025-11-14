'use client'

import { useState, useEffect } from 'react'
import { Plus, Droplets, Calendar, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface Plant {
  id: string
  name: string
  strain?: string
  plantDate: string
  floweringWeeks: number
  notes?: string
  imageUrls: string
  createdAt: string
  updatedAt: string
}

interface PlantGrowthInfo {
  currentDay: number
  phase: 'vegetative' | 'flowering'
  phaseDisplay: string
  progressPercentage: number
  daysInPhase: number
  totalPhaseDays: number
}

function calculateGrowthInfo(plant: Plant): PlantGrowthInfo {
  const plantDate = new Date(plant.plantDate)
  const today = new Date()
  const daysSincePlanting = Math.floor((today.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const vegetativeDays = 35 // 5 weeks vegetative phase
  const floweringDays = plant.floweringWeeks * 7
  
  let phase: 'vegetative' | 'flowering'
  let phaseDisplay: string
  let daysInPhase: number
  let totalPhaseDays: number
  let progressPercentage: number
  
  if (daysSincePlanting <= vegetativeDays) {
    phase = 'vegetative'
    phaseDisplay = `VT${daysSincePlanting}`
    daysInPhase = daysSincePlanting
    totalPhaseDays = vegetativeDays
    progressPercentage = (daysInPhase / totalPhaseDays) * 100
  } else {
    phase = 'flowering'
    const daysIntoFlowering = daysSincePlanting - vegetativeDays
    phaseDisplay = `BT${daysIntoFlowering} (${plant.floweringWeeks} Wochen)`
    daysInPhase = daysIntoFlowering
    totalPhaseDays = floweringDays
    progressPercentage = (daysInPhase / totalPhaseDays) * 100
  }
  
  return {
    currentDay: daysSincePlanting,
    phase,
    phaseDisplay,
    progressPercentage,
    daysInPhase,
    totalPhaseDays
  }
}

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants')
      if (response.ok) {
        const data = await response.json()
        setPlants(data)
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWatering = async (plantId: string) => {
    try {
      const response = await fetch(`/api/plants/${plantId}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Gegossen' }),
      })
      
      if (response.ok) {
        // Show success feedback
        alert('Pflanze wurde gegossen!')
      }
    } catch (error) {
      console.error('Failed to water plant:', error)
      alert('Fehler beim Gießen')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Pflanzen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Grow Tracker</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/plants/new'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Pflanze
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plants.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Noch keine Pflanzen</h2>
            <p className="text-gray-600 mb-6">Erstelle deine erste Pflanze, um mit dem Tracking zu beginnen</p>
            <Button 
              onClick={() => window.location.href = '/plants/new'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Erste Pflanze anlegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => {
              const growthInfo = calculateGrowthInfo(plant)
              const imageUrls = JSON.parse(plant.imageUrls || '[]')
              const hasImages = imageUrls.length > 0
              
              return (
                <Card key={plant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">{plant.name}</CardTitle>
                        {plant.strain && (
                          <p className="text-sm text-gray-600 mt-1">{plant.strain}</p>
                        )}
                      </div>
                      {hasImages && (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={imageUrls[0]} 
                            alt={plant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Current Phase Badge */}
                    <div className="mb-4">
                      <Badge 
                        variant={growthInfo.phase === 'vegetative' ? 'default' : 'secondary'}
                        className={`${growthInfo.phase === 'vegetative' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}
                      >
                        {growthInfo.phaseDisplay}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{growthInfo.phase === 'vegetative' ? 'Vegetative Phase' : 'Blüte Phase'}</span>
                        <span>{Math.round(growthInfo.progressPercentage)}%</span>
                      </div>
                      <Progress 
                        value={growthInfo.progressPercentage} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Tag {growthInfo.daysInPhase}</span>
                        <span>von {growthInfo.totalPhaseDays} Tagen</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWatering(plant.id)}
                        className="flex-1"
                      >
                        <Droplets className="w-4 h-4 mr-2" />
                        Gießen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/plants/${plant.id}`}
                        className="flex-1"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}