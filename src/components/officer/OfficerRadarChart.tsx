
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

  // For now, this is a placeholder radar chart
  // In the future, we can populate this with actual metrics
  const data = [
    { category: 'Complaints', A: complaints?.length || 0, fullMark: 10 },
    { category: 'Use of Force', A: useOfForce?.length || 0, fullMark: 10 },
    { category: 'Lawsuits', A: 0, fullMark: 10 }, // Will be updated when lawsuit data is available
    { category: 'Awards', A: 3, fullMark: 10 },
    { category: 'Years of Service', A: 5, fullMark: 10 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-semibold text-portal-900 mb-4">Officer Performance</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis />
            <Radar
              name="Officer"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-center text-portal-500 mt-4">
        This radar chart is a placeholder. It will be populated with actual metrics in a future update.
      </p>
    </div>
  );
};
