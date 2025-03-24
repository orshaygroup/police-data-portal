
import React from 'react';
import { OfficerBasicInfo } from '@/components/officer/OfficerBasicInfo';
import { OfficerStatsCards } from '@/components/officer/OfficerStatsCards';
import { OfficerRankHistory } from '@/components/officer/OfficerRankHistory';
import { OfficerComplaints } from '@/components/officer/OfficerComplaints';
import { OfficerUseOfForce } from '@/components/officer/OfficerUseOfForce';
import { OfficerAwards } from '@/components/officer/OfficerAwards';
import { OfficerRadarChart } from '@/components/officer/OfficerRadarChart';
import { OfficerDownload } from '@/components/officer/OfficerDownload';
import { OfficerAdditionalInfo } from '@/components/officer/OfficerAdditionalInfo';

interface OfficerDetailsLayoutProps {
  officer: any;
  stats: any;
  rankHistory: any[];
  complaints: any[];
  useOfForce: any[];
  awards: any[];
  lawsuits: any[];
  isLoading: boolean;
}

export const OfficerDetailsLayout = ({
  officer,
  stats,
  rankHistory,
  complaints,
  useOfForce,
  awards,
  lawsuits,
  isLoading
}: OfficerDetailsLayoutProps) => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="glass-panel rounded-2xl p-4 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-portal-900">Officer Details</h1>
          <OfficerDownload 
            officer={officer}
            stats={stats}
            rankHistory={rankHistory}
            complaints={complaints}
            useOfForce={useOfForce}
            awards={awards}
            lawsuits={lawsuits}
            isLoading={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8">
          <div className="order-2 lg:order-1 w-full">
            <div className="w-full overflow-hidden">
              <OfficerRadarChart 
                officer={officer} 
                complaints={complaints} 
                useOfForce={useOfForce} 
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <OfficerBasicInfo officer={officer} isLoading={isLoading} />
          </div>
        </div>
        
        <div className="mb-8">
          <OfficerStatsCards stats={stats} isLoading={isLoading} />
        </div>

        <OfficerAdditionalInfo />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <OfficerRankHistory rankHistory={rankHistory} />
        </div>

        <div className="space-y-8">
          <OfficerComplaints complaints={complaints} />
          <OfficerUseOfForce incidents={useOfForce} />
          <OfficerAwards awards={awards} />
        </div>
      </div>
    </div>
  );
};
