
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RankedOfficer } from '@/hooks/useOfficersRanking';

interface TopOffenderRadarProps {
  officer: RankedOfficer | null;
  isLoading: boolean;
}

export const TopOffenderRadar: React.FC<TopOffenderRadarProps> = ({ officer, isLoading }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (officer) {
      navigate(`/officers/${officer.officer_id}`);
    }
  };

  if (isLoading || !officer) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="h-72">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  const radarData = [
    {
      subject: 'Officer Allegations',
      value: officer.percentiles.officer_allegations_percentile,
      fullMark: 100,
    },
    {
      subject: 'Civilian Allegations',
      value: officer.percentiles.civilian_allegations_percentile,
      fullMark: 100,
    },
    {
      subject: 'Use of Force',
      value: officer.percentiles.use_of_force_percentile,
      fullMark: 100,
    },
    {
      subject: 'Awards',
      value: officer.percentiles.awards_percentile,
      fullMark: 100,
    },
    {
      subject: 'Years of Service',
      value: officer.percentiles.service_years_percentile,
      fullMark: 100,
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-portal-900">Top Ranked Officer</h2>
        <div className="text-portal-600">
          {officer.first_name} {officer.last_name} ({officer.badge_number || 'No Badge'})
        </div>
        <div className="text-portal-500 text-sm">
          {officer.current_rank || 'Unknown Rank'} - Score: {Math.round(officer.composite_score)}
        </div>
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
              dataKey="value"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <Button onClick={handleViewDetails} className="w-full" variant="outline">
          View Officer Details
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
