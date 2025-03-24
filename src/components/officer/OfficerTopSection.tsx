
import React from 'react';
import { OfficerRadarChart } from './OfficerRadarChart';
import { OfficerBasicInfo } from './OfficerBasicInfo';

interface OfficerTopSectionProps {
  officer: any;
  complaints: any[] | null;
  useOfForce: any[] | null;
  isLoading: boolean;
}

export const OfficerTopSection: React.FC<OfficerTopSectionProps> = ({
  officer,
  complaints,
  useOfForce,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="order-2 lg:order-1">
        <OfficerRadarChart officer={officer} complaints={complaints} useOfForce={useOfForce} />
      </div>
      <div className="order-1 lg:order-2">
        <OfficerBasicInfo officer={officer} isLoading={isLoading} />
      </div>
    </div>
  );
};
