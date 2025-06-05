
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Upload, Eye } from "lucide-react"

// Mock data - in real app this would come from database
const reports = [
  {
    id: 1,
    type: "Blood Test",
    date: "2024-05-28",
    doctor: "Dr. Sarah Johnson",
    status: "Normal",
    fileUrl: "#",
    description: "Complete metabolic panel"
  },
  {
    id: 2,
    type: "X-Ray",
    date: "2024-05-15",
    doctor: "Dr. Michael Chen",
    status: "Reviewed",
    fileUrl: "#",
    description: "Chest X-ray"
  },
  {
    id: 3,
    type: "MRI Scan",
    date: "2024-04-20",
    doctor: "Dr. Emily Rodriguez",
    status: "Normal",
    fileUrl: "#",
    description: "Brain MRI with contrast"
  }
]

export const MedicalReports = () => {
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadingFile(true)
      // Simulate upload
      setTimeout(() => {
        setUploadingFile(false)
        console.log('File uploaded:', file.name)
      }, 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload Medical Document</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-800">
                Upload your medical documents
              </h3>
              <p className="text-gray-600">
                PDF, JPG, PNG files up to 10MB
              </p>
              <div className="pt-4">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button 
                    className="health-gradient text-white hover:opacity-90"
                    disabled={uploadingFile}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {uploadingFile ? 'Uploading...' : 'Choose File'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Your Medical Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-800">{report.type}</h4>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Date: {report.date}</span>
                      <span>Doctor: {report.doctor}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-600 hover:bg-green-50">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
