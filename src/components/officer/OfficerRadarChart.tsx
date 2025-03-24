import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
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

  // For the traditional radar chart (keeping as fallback or toggle option)
  const data = [
    { category: 'Complaints', A: complaints?.length || 0, fullMark: 10 },
    { category: 'Use of Force', A: useOfForce?.length || 0, fullMark: 10 },
    { category: 'Lawsuits', A: 0, fullMark: 10 }, // Will be updated when lawsuit data is available
    { category: 'Awards', A: 3, fullMark: 10 },
    { category: 'Years of Service', A: 5, fullMark: 10 },
  ];

  // Use the new triangle chart instead of the radar chart
  return <OfficerTriangleChart officerId={officer.officer_id} />;
};
