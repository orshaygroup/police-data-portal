
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { RankedOfficer } from '@/hooks/useOfficersRanking';

interface ScoreDistributionChartProps {
  officers: RankedOfficer[];
  isLoading: boolean;
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ officers, isLoading }) => {
  const distributionData = React.useMemo(() => {
    if (!officers.length) return [];

    // Create distribution buckets (0-10, 10-20, ..., 90-100)
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}-${(i + 1) * 10}`,
      count: 0,
      officers: [] as RankedOfficer[],
    }));

    // Distribute officers into buckets based on their composite scores
    officers.forEach(officer => {
      const score = Math.min(Math.floor(officer.composite_score / 10), 9);
      buckets[score].count += 1;
      buckets[score].officers.push(officer);
    });

    return buckets;
  }, [officers]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`Score Range: ${data.range}`}</p>
          <p className="text-portal-600">{`Number of Officers: ${data.count}`}</p>
          {data.officers.length > 0 && (
            <>
              <p className="text-portal-600 mt-2 font-medium">Top officers in this range:</p>
              <ul className="text-sm">
                {data.officers.slice(0, 3).map((officer: RankedOfficer) => (
                  <li key={officer.officer_id}>
                    {officer.first_name} {officer.last_name} (Score: {Math.round(officer.composite_score)})
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="h-72">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-semibold text-portal-900 mb-4">Score Distribution</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="range" 
              tick={{ fill: '#57534e', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#78716c' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-portal-500 mt-4">
        This chart shows the distribution of officers by their composite score ranges. Higher scores indicate more incidents and lower awards/service time.
      </p>
    </div>
  );
};
