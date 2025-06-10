
import React from 'react';
import { SimpleDashboard } from './SimpleDashboard';
import { DashboardOverview } from './DashboardOverview';

export const PatientDashboardView = () => {
  return (
    <div className="space-y-6">
      <SimpleDashboard />
      <DashboardOverview />
    </div>
  );
};
