'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Droplets, Calendar, Upload, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

interface WateringRecord {
  id: string
  plantId: string
  wateredAt: string
  notes?: string
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

export default function PlantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [wateringRecords, setWateringRecords] = useState<WateringRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [wateringLoading, setWateringLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPlant()
      fetchWateringRecords()
    }
  }, [params.id])

  const fetchPlant = async () => {
    try {
      const response = await fetch(`/api/plants/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPlant(data)
      }
    } catch (error) {
      console.error('Failed to fetch plant:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWateringRecords = async () => {
    try {
      const response = await fetch(`/api/plants/${params.id}/watering`)
      if (response.ok) {
        const data = await response.json()
        setWateringRecords(data)
      }
    } catch (error) {
      console.error('Failed to fetch watering records:', error)
    }
  }

  const handleWatering = async () => {
    setWateringLoading(true)
    try {
      const response = await fetch(`/api/plants/${params.id}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Gegossen' }),
      })
      
      if (response.ok) {
        await fetchWateringRecords()
        alert('Pflanze wurde gegossen!')
      }
    } catch (error) {
      console.error('Failed to water plant:', error)
      alert('Fehler beim Gießen')
    } finally {
      setWateringLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Pflanzenprofil...</p>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pflanze nicht gefunden</h2>
          <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const growthInfo = calculateGrowthInfo(plant)
  const imageUrls = JSON.parse(plant.imageUrls || '[]')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">{plant.name}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Bearbeiten
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Plant Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Growth Status */}
            <Card>
              <CardHeader>
                <CardTitle>Wachstums-Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Badge 
                    variant={growthInfo.phase === 'vegetative' ? 'default' : 'secondary'}
                    className={`${growthInfo.phase === 'vegetative' ? 'bg-green-100 text-green-800 text-lg px-4 py-2' : 'bg-purple-100 text-purple-800 text-lg px-4 py-2'}`}
                  >
                    {growthInfo.phaseDisplay}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{growthInfo.phase === 'vegetative' ? 'Vegetative Phase' : 'Blüte Phase'}</span>
                      <span>{Math.round(growthInfo.progressPercentage)}%</span>
                    </div>
                    <Progress 
                      value={growthInfo.progressPercentage} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Tag {growthInfo.daysInPhase}</span>
                      <span>von {growthInfo.totalPhaseDays} Tagen</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{growthInfo.currentDay}</div>
                    <div className="text-sm text-gray-600">Tage gesamt</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{plant.floweringWeeks}</div>
                    <div className="text-sm text-gray-600">Wochen Blüte</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Bildergalerie</CardTitle>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Bild hochladen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {imageUrls.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Noch keine Bilder hochgeladen</p>
                    <p className="text-sm text-gray-500 mt-1">Lade Bilder hoch um den Wachstumsfortschritt zu dokumentieren</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageUrls.map((url: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`${plant.name} - Bild ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg cursor-pointer flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                Vergrößern
                              </span>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{plant.name} - Bild {index + 1}</DialogTitle>
                            </DialogHeader>
                            <img
                              src={url}
                              alt={`${plant.name} - Bild ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Schnell-Aktionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleWatering}
                  disabled={wateringLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  {wateringLoading ? 'Wird gespeichert...' : 'Gießen'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Foto machen
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Notiz hinzufügen
                </Button>
              </CardContent>
            </Card>

            {/* Plant Information */}
            <Card>
              <CardHeader>
                <CardTitle>Pflanzen-Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Sorte</div>
                  <div className="font-medium">{plant.strain || 'Nicht angegeben'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Einpflanzdatum</div>
                  <div className="font-medium">{new Date(plant.plantDate).toLocaleDateString('de-DE')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Blüte-Dauer</div>
                  <div className="font-medium">{plant.floweringWeeks} Wochen</div>
                </div>
                {plant.notes && (
                  <div>
                    <div className="text-sm text-gray-600">Notizen</div>
                    <div className="font-medium text-sm">{plant.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Watering History */}
            <Card>
              <CardHeader>
                <CardTitle>Gieß-Historie</CardTitle>
              </CardHeader>
              <CardContent>
                {wateringRecords.length === 0 ? (
                  <p className="text-sm text-gray-600">Noch keine Gieß-Einträge</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {wateringRecords.slice(0, 10).map((record) => (
                      <div key={record.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {new Date(record.wateredAt).toLocaleDateString('de-DE')}
                        </span>
                        <span className="text-gray-900">{record.notes || 'Gegossen'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}