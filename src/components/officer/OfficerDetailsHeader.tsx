
import React from 'react';
import { OfficerDataDownload } from './OfficerDataDownload';

interface OfficerDetailsHeaderProps {
  officer: any;
  rankHistory: any[] | null;
  complaints: any[] | null;
  useOfForce: any[] | null;
  awards: any[] | null;
  lawsuits: any[] | null;
  stats: {
    totalComplaints: number;
    totalAllegations: number;
    sustainedAllegations: number;
    totalUseOfForce: number;
    totalLawsuits: number;
    totalSettlements: number;
  };
  isLoading: boolean;
}

export const OfficerDetailsHeader: React.FC<OfficerDetailsHeaderProps> = ({
  officer,
  rankHistory,
  complaints,
  useOfForce,
  awards,
  lawsuits,
  stats,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <h1 className="text-2xl font-bold text-portal-900">Officer Details</h1>
      <div className="flex items-center space-x-4">
        <a
          href="https://nolaoipm.callsplus.net/#/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          File Complaint Against This Officer
        </a>
        <OfficerDataDownload 
          officer={officer}
          rankHistory={rankHistory}
          complaints={complaints}
          useOfForce={useOfForce}
          awards={awards}
          lawsuits={lawsuits}
          stats={stats}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
