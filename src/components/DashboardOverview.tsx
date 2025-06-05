import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Pill, FileText } from "lucide-react"

// Mock data - in real app this would come from database
const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2024-06-08",
    time: "10:30 AM",
    reason: "Follow-up consultation"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Practice",
    date: "2024-06-12",
    time: "2:15 PM",
    reason: "Annual checkup"
  }
]

const currentMedications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    nextDose: "8:00 AM"
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    nextDose: "6:00 PM"
  }
]

const recentReports = [
  {
    id: 1,
    type: "Blood Test",
    date: "2024-05-28",
    status: "Normal"
  },
  {
    id: 2,
    type: "X-Ray",
    date: "2024-05-15",
    status: "Reviewed"
  }
]

export const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="health-card-hover bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Appointment</p>
                <p className="text-lg font-semibold text-gray-800">Jun 8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Medications</p>
                <p className="text-lg font-semibold text-gray-800">{currentMedications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Reports</p>
                <p className="text-lg font-semibold text-gray-800">{recentReports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Medication</p>
                <p className="text-lg font-semibold text-gray-800">6:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Upcoming Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-800">{appointment.doctor}</h4>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-green-600" />
            <span>Current Medications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentMedications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-800">{medication.name}</h4>
                  <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    Next: {medication.nextDose}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
