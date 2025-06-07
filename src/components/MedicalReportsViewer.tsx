
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"
import { useMedicalDocuments } from '@/hooks/useMedicalDocuments'

export const MedicalReportsViewer = () => {
  const { documents, loading, downloadDocument } = useMedicalDocuments();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      'Lab Report': 'bg-blue-100 text-blue-800',
      'X-Ray': 'bg-purple-100 text-purple-800',
      'MRI': 'bg-green-100 text-green-800',
      'Blood Test': 'bg-red-100 text-red-800',
      'Prescription': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading medical reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Your Medical Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.length > 0 ? (
              documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-800">{document.file_name}</h4>
                        {document.document_type && (
                          <Badge className={getDocumentTypeColor(document.document_type)}>
                            {document.document_type}
                          </Badge>
                        )}
                      </div>
                      {document.description && (
                        <p className="text-sm text-gray-600">{document.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Uploaded: {new Date(document.upload_date).toLocaleDateString()}</span>
                        {document.file_size && (
                          <span>Size: {formatFileSize(document.file_size)}</span>
                        )}
                        {document.file_type && (
                          <span>Type: {document.file_type}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => downloadDocument(document.file_path, document.file_name)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medical reports found.</p>
                <p className="text-sm">Upload documents to see them here for viewing and downloading.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
