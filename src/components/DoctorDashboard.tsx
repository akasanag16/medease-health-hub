import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientAssignments } from '@/hooks/usePatientAssignments';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const DoctorDashboard = () => {
  const { assignments, loading, unassignPatient, refetchAssignments } = usePatientAssignments();
  const { toast } = useToast();
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const handleUnassign = async (assignmentId: string) => {
    setIsUnassigning(true);
    setSelectedAssignmentId(assignmentId);
    const success = await unassignPatient(assignmentId);
    if (success) {
      toast({
        title: "Patient Unassigned",
        description: "Patient has been successfully unassigned."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to unassign patient.",
        variant: "destructive"
      });
    }
    setIsUnassigning(false);
    setSelectedAssignmentId(null);
  };

  useEffect(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading assignments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Assignments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments.length === 0 ? (
          <p>No patients currently assigned.</p>
        ) : (
          <div className="w-full">
            <Table>
              <TableCaption>A list of your assigned patients.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Patient ID</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.patient_id}</TableCell>
                    <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
                    <TableCell>{assignment.notes || 'No notes'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnassign(assignment.id)}
                        disabled={isUnassigning && selectedAssignmentId === assignment.id}
                      >
                        {isUnassigning && selectedAssignmentId === assignment.id ? 'Unassigning...' : 'Unassign'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
