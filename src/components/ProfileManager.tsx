
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Save, X, Plus } from "lucide-react";
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const ProfileManager = () => {
  const { profile, loading, refetchProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: [] as string[],
    allergies: [] as string[]
  });
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        date_of_birth: profile.date_of_birth || '',
        phone: profile.phone || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
        medical_conditions: profile.medical_conditions || [],
        allergies: profile.allergies || []
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile updated!",
          description: "Your profile has been saved successfully",
        });
        setIsEditing(false);
        refetchProfile();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions.filter((_, i) => i !== index)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
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
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </CardTitle>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="health-gradient text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              ) : (
                <p className="text-gray-800">{formData.first_name || 'Not provided'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              ) : (
                <p className="text-gray-800">{formData.last_name || 'Not provided'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                />
              ) : (
                <p className="text-gray-800">
                  {formData.date_of_birth ? new Date(formData.date_of_birth).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="text-gray-800">{formData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                {isEditing ? (
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-800">{formData.emergency_contact_name || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                {isEditing ? (
                  <Input
                    id="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-800">{formData.emergency_contact_phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Medical Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {formData.medical_conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{condition}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeCondition(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {formData.medical_conditions.length === 0 && (
                <p className="text-gray-500">No medical conditions recorded</p>
              )}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add medical condition"
                  onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                />
                <Button onClick={addCondition} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="flex items-center space-x-1">
                  <span>{allergy}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeAllergy(index)}
                      className="ml-1 text-white hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {formData.allergies.length === 0 && (
                <p className="text-gray-500">No allergies recorded</p>
              )}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy"
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                />
                <Button onClick={addAllergy} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
