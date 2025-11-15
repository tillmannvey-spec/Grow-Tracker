'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Droplets, Calendar, Upload, Edit, Trash2, Sparkles, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
    toast.promise(
      fetch(`/api/plants/${params.id}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Gegossen' }),
      }).then(async (response) => {
        if (!response.ok) throw new Error('Failed to water plant')
        await fetchWateringRecords()
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
          <p className="text-gray-700 dark:text-gray-300 font-medium">Lade Pflanzenprofil...</p>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 to-green-50/20 dark:to-green-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 dark:from-red-950 to-red-100 dark:to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pflanze nicht gefunden</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Diese Pflanze existiert nicht mehr</p>
          <Button onClick={() => router.push('/')} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const growthInfo = calculateGrowthInfo(plant)
  const imageUrls = JSON.parse(plant.imageUrls || '[]')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-white dark:via-gray-900 to-green-50/20 dark:to-green-950/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="hover:bg-green-50 dark:hover:bg-green-950"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{plant.name}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-200 dark:hover:border-green-700 dark:border-gray-600 dark:text-gray-300">
                <Edit className="w-4 h-4 mr-2" />
                Bearbeiten
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-200 dark:hover:border-red-800 dark:border-gray-600 hover:text-red-700 dark:hover:text-red-300">
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
            <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
                  Wachstums-Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge
                    className={`${
                      growthInfo.phase === 'vegetative'
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200/50'
                        : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200/50'
                    } px-4 py-2 text-lg font-semibold shadow-sm`}
                  >
                    {growthInfo.phaseDisplay}
                  </Badge>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-500">{Math.round(growthInfo.progressPercentage)}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fortschritt</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-3">
                    <span className="text-gray-700 dark:text-gray-300">
                      {growthInfo.phase === 'vegetative' ? 'Vegetative Phase' : 'Blüte Phase'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Tag {growthInfo.daysInPhase} von {growthInfo.totalPhaseDays}
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        growthInfo.phase === 'vegetative'
                          ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600'
                          : 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${Math.min(growthInfo.progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 dark:from-green-950 to-green-100/50 dark:to-green-900/50 rounded-xl border border-green-100 dark:border-green-900">
                    <div className="text-3xl font-bold text-green-700 dark:text-green-500">{growthInfo.currentDay}</div>
                    <div className="text-sm text-green-700/70 dark:text-green-500/70 font-medium mt-1">Tage gesamt</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 dark:from-purple-950 to-purple-100/50 dark:to-purple-900/50 rounded-xl border border-purple-100 dark:border-purple-900">
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-500">{plant.floweringWeeks}</div>
                    <div className="text-sm text-purple-700/70 dark:text-purple-500/70 font-medium mt-1">Wochen Blüte</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Upload className="w-5 h-5 text-green-600 dark:text-green-500" />
                    Bildergalerie
                  </CardTitle>
                  <Button variant="outline" size="sm" className="hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-200 dark:hover:border-green-700 dark:border-gray-600 dark:text-gray-300">
                    <Upload className="w-4 h-4 mr-2" />
                    Bild hochladen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {imageUrls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 dark:from-gray-700 to-gray-200 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Noch keine Bilder</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                      Lade Bilder hoch um den Wachstumsfortschritt zu dokumentieren
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageUrls.map((url: string, index: number) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square rounded-xl overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-green-200 dark:group-hover:ring-green-700 transition-all">
                              <img
                                src={url}
                                alt={`${plant.name} - Bild ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-full text-sm">
                                Vergrößern
                              </span>
                            </div>
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Schnell-Aktionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleWatering}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Gießen
                </Button>
                <Button variant="outline" className="w-full hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-200 dark:hover:border-green-700 dark:border-gray-600 dark:text-gray-300">
                  <Upload className="w-4 h-4 mr-2" />
                  Foto machen
                </Button>
                <Button variant="outline" className="w-full hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-200 dark:hover:border-green-700 dark:border-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Notiz hinzufügen
                </Button>
              </CardContent>
            </Card>

            {/* Plant Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Pflanzen-Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Sorte</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{plant.strain || 'Nicht angegeben'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Einpflanzdatum</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{new Date(plant.plantDate).toLocaleDateString('de-DE')}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Blüte-Dauer</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{plant.floweringWeeks} Wochen</div>
                </div>
                {plant.notes && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notizen</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{plant.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Watering History */}
            <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  Gieß-Historie
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wateringRecords.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">Noch keine Gieß-Einträge</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {wateringRecords.slice(0, 20).map((record) => (
                      <div key={record.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {new Date(record.wateredAt).toLocaleDateString('de-DE')}
                        </span>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Droplets className="w-3.5 h-3.5" />
                          <span className="text-xs">{record.notes || 'Gegossen'}</span>
                        </div>
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
