'use client'

import { useState, useEffect } from 'react'
import { Plus, Droplets, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { toast } from 'sonner'

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

  const handleWatering = async (plantId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

    toast.promise(
      fetch(`/api/plants/${plantId}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Gegossen' }),
      }).then(response => {
        if (!response.ok) throw new Error('Failed to water plant')
        return response
      }),
      {
        loading: 'Pflanze wird gegossen...',
        success: '💧 Pflanze erfolgreich gegossen!',
        error: '❌ Fehler beim Gießen',
      }
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 to-green-50/20 dark:to-green-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 dark:border-green-900 border-t-green-600 dark:border-t-green-500 mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-500 animate-pulse" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Lade Pflanzen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-white dark:via-gray-900 to-green-50/20 dark:to-green-950/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 dark:from-gray-100 to-green-700 dark:to-green-500 bg-clip-text text-transparent">
                Grow Tracker
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/plants/new'}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-xl hover:shadow-green-500/30 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Neue Pflanze
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {plants.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl opacity-10 animate-pulse"></div>
              <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-green-50 dark:from-green-950 to-green-100 dark:to-green-900 rounded-3xl flex items-center justify-center ring-4 ring-green-100/50 dark:ring-green-900/50">
                <Sparkles className="w-16 h-16 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Willkommen bei Grow Tracker</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Starte deine Grow-Reise und tracke deine Pflanzen von der Keimung bis zur Ernte
            </p>
            <Button
              onClick={() => window.location.href = '/plants/new'}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl shadow-green-500/25 transition-all hover:shadow-2xl hover:shadow-green-500/40 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
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
                <Card
                  key={plant.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-green-200 dark:hover:border-green-700"
                  onClick={() => window.location.href = `/plants/${plant.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                          {plant.name}
                        </CardTitle>
                        {plant.strain && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plant.strain}</p>
                        )}
                      </div>
                      {hasImages ? (
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 dark:from-gray-700 to-gray-50 dark:to-gray-800 rounded-xl overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-green-200 dark:group-hover:ring-green-700 transition-all">
                          <img
                            src={imageUrls[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-green-50 dark:from-green-950 to-green-100 dark:to-green-900 rounded-xl flex items-center justify-center ring-2 ring-green-100 dark:ring-green-900">
                          <Sparkles className="w-6 h-6 text-green-600 dark:text-green-500" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Current Phase Badge */}
                    <div className="mb-4">
                      <Badge
                        variant={growthInfo.phase === 'vegetative' ? 'default' : 'secondary'}
                        className={`${
                          growthInfo.phase === 'vegetative'
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200/50'
                            : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200/50'
                        } px-3 py-1 font-medium shadow-sm`}
                      >
                        {growthInfo.phaseDisplay}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-5">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-gray-700 dark:text-gray-300">
                          {growthInfo.phase === 'vegetative' ? 'Vegetative Phase' : 'Blüte Phase'}
                        </span>
                        <span className="text-green-600 dark:text-green-500 font-semibold">
                          {Math.round(growthInfo.progressPercentage)}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              growthInfo.phase === 'vegetative'
                                ? 'bg-gradient-to-r from-green-400 to-green-600'
                                : 'bg-gradient-to-r from-purple-400 to-purple-600'
                            }`}
                            style={{ width: `${Math.min(growthInfo.progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Tag {growthInfo.daysInPhase}</span>
                        <span>von {growthInfo.totalPhaseDays} Tagen</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleWatering(plant.id, e)}
                        className="flex-1 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-800 dark:hover:text-blue-300 transition-all"
                      >
                        <Droplets className="w-4 h-4 mr-1.5" />
                        Gießen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/plants/${plant.id}`
                        }}
                        className="flex-1 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                      >
                        <Calendar className="w-4 h-4 mr-1.5" />
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
