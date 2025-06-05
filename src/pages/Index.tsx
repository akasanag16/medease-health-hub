
import React, { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { DashboardOverview } from "@/components/DashboardOverview"
import { MoodTracker } from "@/components/MoodTracker"
import { MedicalReports } from "@/components/MedicalReports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, Sarah! 👋
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
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🙂</span>
                      <div>
                        <p className="font-medium">Good day</p>
                        <p className="text-sm text-gray-600">Feeling optimistic</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Today</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">😐</span>
                      <div>
                        <p className="font-medium">Okay day</p>
                        <p className="text-sm text-gray-600">Feeling neutral</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Yesterday</span>
                  </div>
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
            <Card className="health-card-hover">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">Dr. Sarah Johnson</h3>
                        <p className="text-sm text-gray-600">Cardiology</p>
                        <p className="text-sm text-gray-600 mt-1">Follow-up consultation</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">June 8, 10:30 AM</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">Dr. Michael Chen</h3>
                        <p className="text-sm text-gray-600">General Practice</p>
                        <p className="text-sm text-gray-600 mt-1">Annual checkup</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">June 12, 2:15 PM</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <Card className="health-card-hover">
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">Lisinopril</h3>
                        <p className="text-sm text-gray-600">10mg - Once daily</p>
                        <p className="text-sm text-gray-600 mt-1">For blood pressure</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">Next: 8:00 AM</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">Metformin</h3>
                        <p className="text-sm text-gray-600">500mg - Twice daily</p>
                        <p className="text-sm text-gray-600 mt-1">For diabetes management</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Next: 6:00 PM</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Index
