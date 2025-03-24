
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useOfficerPercentiles } from '@/hooks/useOfficerPercentiles';
import { Info } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OfficerRadarChartProps {
  officer: any;
  complaints: any[];
  useOfForce: any[];
}

export const OfficerRadarChart = ({ officer, complaints, useOfForce }: OfficerRadarChartProps) => {
  const { percentileData, isLoading: loadingPercentiles } = useOfficerPercentiles(officer?.officer_id || 0);
  
  if (!officer || loadingPercentiles) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full flex items-center justify-center">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const radarData = [
    {
      subject: 'Officer Allegations',
      A: percentileData?.officer_allegations_percentile || 0,
      fullMark: 100,
      info: 'Percentile rank for allegations made against this officer by other officers'
    },
    {
      subject: 'Civilian Allegations',
      A: percentileData?.civilian_allegations_percentile || 0,
      fullMark: 100,
      info: 'Percentile rank for allegations made against this officer by civilians'
    },
    {
      subject: 'Use of Force',
      A: percentileData?.use_of_force_percentile || 0,
      fullMark: 100,
      info: 'Percentile rank for documented use of force incidents involving this officer'
    },
    {
      subject: 'Awards',
      A: percentileData?.awards_percentile || 0,
      fullMark: 100,
      info: 'Percentile rank for commendations and awards received by this officer'
    },
    {
      subject: 'Years of Service',
      A: percentileData?.service_years_percentile || 0,
      fullMark: 100,
      info: 'Percentile rank for length of service compared to other officers'
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}th percentile`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-portal-900">Officer Percentile Rankings</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <Info size={16} className="text-portal-500" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">About Percentile Rankings</h4>
              <p className="text-sm text-portal-600">
                This chart shows how this officer ranks compared to other officers in the database.
                Higher percentiles for allegations and use of force indicate more incidents. 
                Higher percentiles for awards and service indicate more awards or longer service.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#57534e', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#78716c' }}
              tickCount={6}
              stroke="#e5e7eb"
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Percentile"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {radarData.map((entry, index) => (
          <TooltipProvider key={index}>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center text-xs text-portal-700 bg-portal-100 px-2 py-1 rounded">
                  {entry.subject}: {entry.A}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs w-48">{entry.info}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
