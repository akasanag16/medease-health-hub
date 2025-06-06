
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMoodLogs } from '@/hooks/useMoodLogs'

const moodEmojis = [
  { emoji: '😢', label: 'Very Sad', value: 1 },
  { emoji: '😔', label: 'Sad', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Happy', value: 4 },
  { emoji: '😄', label: 'Very Happy', value: 5 },
]

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const { saveMoodLog } = useMoodLogs()

  const handleSaveMood = async () => {
    if (selectedMood === null) {
      return
    }

    const success = await saveMoodLog(selectedMood, note)
    
    if (success) {
      setSelectedMood(null)
      setNote('')
    }
  }

  return (
    <Card className="health-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>How are you feeling today?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center space-x-4">
          {moodEmojis.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`text-4xl p-3 rounded-full transition-all hover:scale-110 ${
                selectedMood === mood.value 
                  ? 'bg-blue-100 ring-2 ring-blue-500' 
                  : 'hover:bg-gray-100'
              }`}
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Add a note (optional)
          </label>
          <Textarea
            placeholder="How are you feeling? What's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
        
        <Button 
          onClick={handleSaveMood}
          disabled={selectedMood === null}
          className="w-full health-gradient text-white hover:opacity-90"
        >
          Save Mood Entry
        </Button>
      </CardContent>
    </Card>
  )
}
