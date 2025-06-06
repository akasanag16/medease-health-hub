
import React, { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { DashboardOverview } from "@/components/DashboardOverview"
import { MoodTracker } from "@/components/MoodTracker"
import { MedicalReports } from "@/components/MedicalReports"
import { AppointmentManager } from "@/components/AppointmentManager"
import { MedicationManager } from "@/components/MedicationManager"
import { UserHeader } from "@/components/UserHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMoodLogs } from '@/hooks/useMoodLogs'
import { useProfile } from '@/hooks/useProfile'

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { moodLogs } = useMoodLogs()
  const { profile } = useProfile()

  const displayName = profile?.first_name || 'there'

  const getMoodEmoji = (moodLevel: string) => {
    const emojiMap = {
      'very_sad': '😢',
      'sad': '😔',
      'neutral': '😐',
      'happy': '🙂',
      'very_happy': '😄'
    } as const;
    return emojiMap[moodLevel as keyof typeof emojiMap] || '😐';
  };

  const getMoodLabel = (moodLevel: string) => {
    const labelMap = {
      'very_sad': 'Very sad',
      'sad': 'Sad',
      'neutral': 'Neutral',
      'happy': 'Happy',
      'very_happy': 'Very happy'
    } as const;
    return labelMap[moodLevel as keyof typeof labelMap] || 'Unknown';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-gray-600">
                Here's your health overview for today
              </p>
            </div>
            <DashboardOverview />
            <div className="mt-8">
              <MoodTracker />
            </div>
          </div>
        )
      case 'mood':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Mood Tracker 💙
              </h1>
              <p className="text-gray-600">
                Track your emotional well-being
              </p>
            </div>
            <MoodTracker />
            
            {/* Recent Mood History */}
            <Card className="health-card-hover">
              <CardHeader>
                <CardTitle>Recent Mood Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodLogs.length > 0 ? (
                    moodLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getMoodEmoji(log.mood_level)}</span>
                          <div>
                            <p className="font-medium">{getMoodLabel(log.mood_level)}</p>
                            {log.note && <p className="text-sm text-gray-600">{log.note}</p>}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(log.log_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No mood entries yet. Start tracking your mood!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Medical Reports 📋
              </h1>
              <p className="text-gray-600">
                View and manage your medical documents
              </p>
            </div>
            <MedicalReports />
          </div>
        )
      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Appointments 📅
              </h1>
              <p className="text-gray-600">
                Manage your upcoming appointments
              </p>
            </div>
            <AppointmentManager />
          </div>
        )
      case 'medications':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Medications 💊
              </h1>
              <p className="text-gray-600">
                Track your current medications and schedules
              </p>
            </div>
            <MedicationManager />
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  // Listen to hash changes for navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setActiveSection(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <SidebarTrigger className="lg:hidden mb-4" />
          </div>
          <div className="max-w-7xl mx-auto">
            <UserHeader />
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Index
