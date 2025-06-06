
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pill, Plus, Clock, User } from "lucide-react";
import { useMedications } from '@/hooks/useMedications';

export const MedicationManager = () => {
  const { medications, loading, createMedication, updateMedication } = useMedications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once_daily' as const,
    prescribed_by: '',
    start_date: '',
    end_date: '',
    instructions: '',
    side_effects: '',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createMedication(formData);
    if (success) {
      setFormData({
        name: '',
        dosage: '',
        frequency: 'once_daily',
        prescribed_by: '',
        start_date: '',
        end_date: '',
        instructions: '',
        side_effects: '',
        is_active: true
      });
      setIsDialogOpen(false);
    }
  };

  const toggleMedicationStatus = async (id: string, currentStatus: boolean) => {
    await updateMedication(id, { is_active: !currentStatus });
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      once_daily: 'Once daily',
      twice_daily: 'Twice daily',
      three_times_daily: 'Three times daily',
      four_times_daily: 'Four times daily',
      as_needed: 'As needed',
      weekly: 'Weekly',
      monthly: 'Monthly'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading medications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="health-card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-green-600" />
              <span>Medications</span>
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="health-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medication Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      placeholder="e.g., 10mg, 2 tablets"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once_daily">Once daily</SelectItem>
                        <SelectItem value="twice_daily">Twice daily</SelectItem>
                        <SelectItem value="three_times_daily">Three times daily</SelectItem>
                        <SelectItem value="four_times_daily">Four times daily</SelectItem>
                        <SelectItem value="as_needed">As needed</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prescribed_by">Prescribed By</Label>
                    <Input
                      id="prescribed_by"
                      value={formData.prescribed_by}
                      onChange={(e) => setFormData({ ...formData, prescribed_by: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="side_effects">Side Effects</Label>
                    <Textarea
                      id="side_effects"
                      value={formData.side_effects}
                      onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button type="submit" className="w-full health-gradient text-white">
                    Add Medication
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.length > 0 ? (
              medications.map((medication) => (
                <div key={medication.id} className={`border rounded-lg p-4 transition-colors ${
                  medication.is_active ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-75'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-800">{medication.name}</h4>
                        <Badge className={medication.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {medication.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Pill className="w-4 h-4 mr-1" />
                          {medication.dosage}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {getFrequencyLabel(medication.frequency)}
                        </span>
                      </div>
                      {medication.prescribed_by && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Prescribed by: {medication.prescribed_by}
                        </p>
                      )}
                      {medication.instructions && (
                        <p className="text-sm text-gray-600">Instructions: {medication.instructions}</p>
                      )}
                      {medication.side_effects && (
                        <p className="text-sm text-gray-600">Side effects: {medication.side_effects}</p>
                      )}
                      {(medication.start_date || medication.end_date) && (
                        <div className="text-sm text-gray-600">
                          {medication.start_date && `Started: ${new Date(medication.start_date).toLocaleDateString()}`}
                          {medication.start_date && medication.end_date && ' • '}
                          {medication.end_date && `Ends: ${new Date(medication.end_date).toLocaleDateString()}`}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={medication.is_active}
                        onCheckedChange={() => toggleMedicationStatus(medication.id, medication.is_active)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medications added yet.</p>
                <p className="text-sm">Click "Add Medication" to track your medications.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
