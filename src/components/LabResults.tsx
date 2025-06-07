
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TestTube, Download, Eye, Plus, Calendar } from "lucide-react"
import { useLabResults } from '@/hooks/useLabResults'

export const LabResults = () => {
  const { labResults, loading, addLabResult } = useLabResults();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newResult, setNewResult] = useState({
    test_name: '',
    test_date: '',
    result_value: '',
    reference_range: '',
    unit: '',
    status: 'normal' as 'normal' | 'abnormal' | 'pending' | 'critical',
    lab_name: '',
    doctor_name: '',
    notes: ''
  });

  const handleAddResult = async () => {
    const success = await addLabResult(newResult);
    if (success) {
      setNewResult({
        test_name: '',
        test_date: '',
        result_value: '',
        reference_range: '',
        unit: '',
        status: 'normal',
        lab_name: '',
        doctor_name: '',
        notes: ''
      });
      setIsDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'normal': 'bg-green-100 text-green-800',
      'abnormal': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading lab results...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Lab Result */}
      <Card className="health-card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="w-5 h-5 text-blue-600" />
              <span>Lab Results</span>
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="health-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lab Result
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Lab Result</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test_name">Test Name</Label>
                    <Input
                      id="test_name"
                      value={newResult.test_name}
                      onChange={(e) => setNewResult({...newResult, test_name: e.target.value})}
                      placeholder="e.g., Blood Glucose"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test_date">Test Date</Label>
                    <Input
                      id="test_date"
                      type="date"
                      value={newResult.test_date}
                      onChange={(e) => setNewResult({...newResult, test_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="result_value">Result Value</Label>
                    <Input
                      id="result_value"
                      value={newResult.result_value}
                      onChange={(e) => setNewResult({...newResult, result_value: e.target.value})}
                      placeholder="e.g., 95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newResult.unit}
                      onChange={(e) => setNewResult({...newResult, unit: e.target.value})}
                      placeholder="e.g., mg/dL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference_range">Reference Range</Label>
                    <Input
                      id="reference_range"
                      value={newResult.reference_range}
                      onChange={(e) => setNewResult({...newResult, reference_range: e.target.value})}
                      placeholder="e.g., 70-100 mg/dL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newResult.status} onValueChange={(value) => setNewResult({...newResult, status: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="abnormal">Abnormal</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lab_name">Lab Name</Label>
                    <Input
                      id="lab_name"
                      value={newResult.lab_name}
                      onChange={(e) => setNewResult({...newResult, lab_name: e.target.value})}
                      placeholder="e.g., Quest Diagnostics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor_name">Doctor Name</Label>
                    <Input
                      id="doctor_name"
                      value={newResult.doctor_name}
                      onChange={(e) => setNewResult({...newResult, doctor_name: e.target.value})}
                      placeholder="e.g., Dr. Smith"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newResult.notes}
                      onChange={(e) => setNewResult({...newResult, notes: e.target.value})}
                      placeholder="Additional notes about the test"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button 
                      onClick={handleAddResult}
                      disabled={!newResult.test_name || !newResult.test_date}
                      className="w-full health-gradient text-white"
                    >
                      Add Lab Result
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Track and manage your lab test results</p>
            <p className="text-sm text-gray-500">Keep all your medical test results organized in one place</p>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results List */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-purple-600" />
            <span>Your Lab Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {labResults.length > 0 ? (
              labResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-800">{result.test_name}</h4>
                      <Badge className={getStatusColor(result.status || 'pending')}>
                        {result.status || 'pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(result.test_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Result:</span>
                      <p className="text-gray-800">{result.result_value} {result.unit}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Reference:</span>
                      <p className="text-gray-800">{result.reference_range || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Lab:</span>
                      <p className="text-gray-800">{result.lab_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Doctor:</span>
                      <p className="text-gray-800">{result.doctor_name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {result.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">Notes: </span>
                      <span className="text-gray-700">{result.notes}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No lab results yet.</p>
                <p className="text-sm">Click "Add Lab Result" to add your first test result.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
