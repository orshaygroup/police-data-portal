
import React from 'react';
import { useComplainantDemographics } from '@/hooks/useDemographicData';
import DemographicBar from './DemographicBar';

const ComplainantsTab = () => {
  const { data: complainantData, isLoading: isLoadingComplainants } = useComplainantDemographics();

  if (isLoadingComplainants) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">Loading complainant data...</p>
      </div>
    );
  }

  if (!complainantData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No complainant data available</p>
      </div>
    );
  }

  return (
    <div className="h-full pt-4 overflow-y-auto">
      <DemographicBar title={complainantData.race.name} segments={complainantData.race.data} />
      <DemographicBar title={complainantData.gender.name} segments={complainantData.gender.data} />
      <DemographicBar title={complainantData.age.name} segments={complainantData.age.data} />
    </div>
  );
};

export default ComplainantsTab;
