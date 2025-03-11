
import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { useOutcomeData } from '@/hooks/useStatisticsData';

const OutcomesTab = () => {
  const { data: outcomeData, isLoading: isLoadingOutcomes } = useOutcomeData();

  const calculatePercentage = () => {
    if (!outcomeData) return null;
    
    const unsustained = outcomeData.findings.find(item => item.name === 'Not Sustained');
    
    if (!unsustained) return null;
    
    const percentage = ((unsustained.value / outcomeData.totalAllegations) * 100).toFixed(2);
    return {
      percentage,
      finding: 'Not Sustained'
    };
  };

  const percentageInfo = calculatePercentage();

  if (isLoadingOutcomes) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">Loading outcomes data...</p>
      </div>
    );
  }

  if (!outcomeData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No outcomes data available</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-portal-900">
          {outcomeData.totalAllegations.toLocaleString()} Allegations
        </h3>
        <div className="h-px w-36 bg-portal-300 my-2" />
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg text-portal-900">{outcomeData.totalAllegations.toLocaleString()} Allegations</h4>
        {percentageInfo && (
          <p className="text-portal-700">
            {percentageInfo.percentage}% of "Allegations" complaints were found "{percentageInfo.finding}"
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 h-[260px]">
        <div className="flex flex-col justify-center space-y-2">
          {outcomeData.findings.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="font-bold">{item.value.toLocaleString()}</span>
              <span className="text-portal-700">{item.name}</span>
            </div>
          ))}
        </div>
        
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[outcomeData.findings[0]]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill={outcomeData.findings[0].color}
              />
              <Pie
                data={outcomeData.findings.slice(1)}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {outcomeData.findings.slice(1).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OutcomesTab;
