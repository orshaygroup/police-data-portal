import React, { useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InfoIcon } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useMapDataContext } from '@/hooks/useMapDataContext';

const FINDING_COLORS: Record<string, string> = {
  'Sustained': '#0FA0CE',
  'Not Sustained': '#F97316',
  'Exonerated': '#8B5CF6',
  'Unfounded': '#10B981',
  'Other': '#94A3B8'
};

const OutcomesTab = () => {
  const { filteredComplaints } = useMapDataContext();

  // Compute findings and total allegations from filteredComplaints
  const findingsData = useMemo(() => {
    const findingsCount: Record<string, number> = {};
    filteredComplaints.forEach(c => {
      const finding = c.final_finding || 'Other';
      findingsCount[finding] = (findingsCount[finding] || 0) + 1;
    });
    return Object.entries(findingsCount).map(([name, value]) => ({
      name,
      value,
      color: FINDING_COLORS[name] || FINDING_COLORS['Other']
    }));
  }, [filteredComplaints]);

  const totalAllegations = filteredComplaints.length;

  const calculatePercentage = () => {
    const unsustained = findingsData.find(item => item.name === 'Not Sustained');
    if (!unsustained) return null;
    const percentage = ((unsustained.value / totalAllegations) * 100).toFixed(1);
    return {
      percentage,
      finding: 'Not Sustained'
    };
  };

  const percentageInfo = calculatePercentage();

  if (filteredComplaints.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No outcomes data available</p>
      </div>
    );
  }

  return (
    <div className="h-full py-2 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-portal-900">
              {totalAllegations.toLocaleString()} Total Allegations
            </h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 text-portal-400 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">
                  This data represents all allegations filed against officers,
                  categorized by their final findings and outcomes.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="h-px w-36 bg-portal-300 my-2" />
          {percentageInfo && (
            <p className="text-portal-700 text-sm">
              <span className="font-semibold">{percentageInfo.percentage}%</span> of allegations were found "{percentageInfo.finding}"
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {findingsData.slice(0, 5).map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-portal-100"
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-xs font-medium">{item.name}</span>
              <span className="text-xs text-portal-500">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[240px]">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Key Findings</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[180px]">
            <div className="space-y-3">
              {findingsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm text-portal-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                    <span className="text-xs text-portal-500">
                      ({((item.value / totalAllegations) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="relative h-full md:col-span-3">
          <ChartContainer
            config={{
              allegations: { label: "Allegations" },
              sustained: { color: "#0FA0CE" },
              notSustained: { color: "#F97316" },
              exonerated: { color: "#8B5CF6" },
              unfounded: { color: "#10B981" },
              other: { color: "#94A3B8" }
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={findingsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  animationDuration={800}
                  animationBegin={200}
                >
                  {findingsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="white" 
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name) => (
                        <div className="flex flex-col">
                          <span className="font-medium">{name}</span>
                          <div className="flex items-center justify-between gap-4">
                            <span>{value.toLocaleString()}</span>
                            <span className="text-xs text-portal-500">
                              ({((Number(value) / totalAllegations) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default OutcomesTab;
