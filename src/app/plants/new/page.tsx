'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Calendar, Clock, Sparkles, Leaf } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function NewPlantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    strain: '',
    plantDate: new Date().toISOString().split('T')[0],
    floweringWeeks: '8',
    notes: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])

    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    toast.promise(
      fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then(async (response) => {
        if (!response.ok) throw new Error('Failed to create plant')
        const plant = await response.json()
        // TODO: Handle image uploads separately
        setTimeout(() => router.push('/'), 500)
        return plant
      }),
      {
        loading: 'Pflanze wird angelegt...',
        success: '🌱 Pflanze erfolgreich angelegt!',
        error: '❌ Fehler beim Erstellen der Pflanze',
      }
    ).finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-white dark:via-gray-900 to-green-50/20 dark:to-green-950/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="mr-4 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Neue Pflanze anlegen</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 dark:from-green-950 to-green-100/50 dark:to-green-900/50 border-b border-green-100 dark:border-green-900 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Leaf className="w-5 h-5 text-green-600 dark:text-green-500" />
                Grundlegende Informationen
              </CardTitle>
            </div>
            <CardContent className="space-y-5 pt-6">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Pflanzenname <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="z.B. Northern Lights #1"
                  required
                  className="border-gray-200 dark:border-gray-600 focus:border-green-400 focus:ring-green-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="strain" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Sorte
                </Label>
                <Input
                  id="strain"
                  value={formData.strain}
                  onChange={(e) => handleInputChange('strain', e.target.value)}
                  placeholder="z.B. Northern Lights"
                  className="border-gray-200 dark:border-gray-600 focus:border-green-400 focus:ring-green-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Growth Information */}
          <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 dark:from-purple-950 to-purple-100/50 dark:to-purple-900/50 border-b border-purple-100 dark:border-purple-900 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                Wachstums-Informationen
              </CardTitle>
            </div>
            <CardContent className="space-y-5 pt-6">
              <div>
                <Label htmlFor="plantDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Einpflanzdatum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plantDate"
                  type="date"
                  value={formData.plantDate}
                  onChange={(e) => handleInputChange('plantDate', e.target.value)}
                  required
                  className="border-gray-200 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="floweringWeeks" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Blüte-Dauer (Wochen)
                </Label>
                <Select value={formData.floweringWeeks} onValueChange={(value) => handleInputChange('floweringWeeks', value)}>
                  <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Wochen</SelectItem>
                    <SelectItem value="7">7 Wochen</SelectItem>
                    <SelectItem value="8">8 Wochen (Standard)</SelectItem>
                    <SelectItem value="9">9 Wochen</SelectItem>
                    <SelectItem value="10">10 Wochen</SelectItem>
                    <SelectItem value="11">11 Wochen</SelectItem>
                    <SelectItem value="12">12 Wochen</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  Durchschnittliche Blütezeit für deine Sorte. Standard: 8 Wochen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 dark:from-blue-950 to-blue-100/50 dark:to-blue-900/50 border-b border-blue-100 dark:border-blue-900 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                Notizen & Details
              </CardTitle>
            </div>
            <CardContent className="pt-6">
              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Notizen
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Zusätzliche Informationen über diese Pflanze (z.B. Nährstoffe, Licht-Setup, besondere Merkmale...)"
                rows={4}
                className="border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-400 rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 dark:from-amber-950 to-amber-100/50 dark:to-amber-900/50 border-b border-amber-100 dark:border-amber-900 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Upload className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                Bilder hochladen (optional)
              </CardTitle>
            </div>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600 rounded-xl p-8 text-center transition-colors bg-gray-50/50 dark:bg-gray-900/50 hover:bg-green-50/50 dark:hover:bg-green-950/50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 dark:from-amber-900 to-amber-200 dark:to-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Klicke hier um Bilder hochzuladen
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF bis zu 10MB
                  </p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Hochgeladene Bilder ({imagePreviews.length})
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-amber-300 dark:group-hover:ring-amber-700 transition-all">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1 h-12 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              disabled={loading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Wird erstellt...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Pflanze anlegen
                </div>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 pt-2">
            <span className="text-red-500">*</span> Pflichtfelder
          </p>
        </form>
      </main>
    </div>
  )
}
