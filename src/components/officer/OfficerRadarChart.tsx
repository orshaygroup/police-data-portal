
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { OfficerTriangleChart } from './OfficerTriangleChart';

interface OfficerRadarChartProps {
  officer: any;
  complaints: any[];
  useOfForce: any[];
}

export const OfficerRadarChart = ({ officer, complaints, useOfForce }: OfficerRadarChartProps) => {
  if (!officer) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full flex items-center justify-center">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <OfficerTriangleChart officerId={officer.officer_id} />
    </div>
  );
};
