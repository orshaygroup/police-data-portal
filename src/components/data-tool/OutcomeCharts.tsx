
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';

interface OutcomeData {
  name: string;
  value: number;
  color: string;
}

interface OutcomeChartsProps {
  onSegmentClick: (category: string) => void;
}

const OutcomeCharts = ({ onSegmentClick }: OutcomeChartsProps) => {
  const { data: outcomeData, isLoading } = useQuery({
    queryKey: ['allegation-outcomes'],
    queryFn: async () => {
      const { data: allegations, error } = await supabase
        .from('Police_Data_Allegations')
        .select('*');

      if (error) throw new Error('Failed to fetch allegation data');

      const totalAllegations = allegations?.length || 0;
      const findingCounts: Record<string, number> = {};
      
      allegations?.forEach(allegation => {
        const finding = allegation.finding || 'Unknown';
        findingCounts[finding] = (findingCounts[finding] || 0) + 1;
      });

      const colors = [
        '#0EA5E9', '#0FA0CE', '#F97316', '#D946EF', '#8B5CF6',
        '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FDE1D3', '#D3E4FD'
      ];

      const findingsData: OutcomeData[] = Object.entries(findingCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([finding, count], index) => ({
          name: finding,
          value: count,
          color: colors[index % colors.length]
        }));

      return {
        findings: findingsData,
        totalAllegations
      };
    }
  });

  if (isLoading || !outcomeData) return <div>Loading...</div>;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Allegation Outcomes</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={outcomeData.findings}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              onClick={(data) => onSegmentClick(data.name)}
            >
              {outcomeData.findings.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OutcomeCharts;
