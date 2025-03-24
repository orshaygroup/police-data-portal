
import React from 'react';
import { OfficerComplaints } from './OfficerComplaints';
import { OfficerUseOfForce } from './OfficerUseOfForce';
import { OfficerAwards } from './OfficerAwards';

interface OfficerDetailedSectionsProps {
  complaints: any[] | null;
  useOfForce: any[] | null;
  awards: any[] | null;
}

export const OfficerDetailedSections: React.FC<OfficerDetailedSectionsProps> = ({
  complaints,
  useOfForce,
  awards
}) => {
  return (
    <div className="space-y-8">
      <OfficerComplaints complaints={complaints} />
      <OfficerUseOfForce incidents={useOfForce} />
      <OfficerAwards awards={awards} />
    </div>
  );
};
