
import React from 'react';
import { useAccusedDemographics } from '@/hooks/useDemographicData';
import DemographicBar from './DemographicBar';

const AccusedTab = () => {
  const { data: accusedData, isLoading: isLoadingAccused } = useAccusedDemographics();

  if (isLoadingAccused) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">Loading accused officer data...</p>
      </div>
    );
  }

  if (!accusedData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No accused officer data available</p>
      </div>
    );
  }

  return (
    <div className="h-full pt-4 overflow-y-auto">
      <DemographicBar title={accusedData.race.name} segments={accusedData.race.data} />
      <DemographicBar title={accusedData.gender.name} segments={accusedData.gender.data} />
      <DemographicBar title={accusedData.age.name} segments={accusedData.age.data} />
    </div>
  );
};

export default AccusedTab;
