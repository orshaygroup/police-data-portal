
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { OfficerStatsCards } from '@/components/officer/OfficerStatsCards';
import { OfficerRankHistory } from '@/components/officer/OfficerRankHistory';
import { useOfficerDetails } from '@/hooks/useOfficerDetails';
import { OfficerDetailsHeader } from '@/components/officer/OfficerDetailsHeader';
import { OfficerTopSection } from '@/components/officer/OfficerTopSection';
import { OfficerDetailedSections } from '@/components/officer/OfficerDetailedSections';

const OfficerDetails = () => {
  const { id } = useParams();
  const officerId = parseInt(id || '0', 10);
  
  const { 
    officer, 
    rankHistory, 
    complaints, 
    useOfForce, 
    awards,
    lawsuits,
    isLoading,
    stats
  } = useOfficerDetails(officerId);

  if (!officerId) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="glass-panel rounded-2xl p-8">
            <h1 className="text-2xl text-portal-900">Invalid Officer ID</h1>
            <p className="text-portal-600 mt-2">Please return to the search page and select a valid officer.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <OfficerDetailsHeader 
            officer={officer}
            rankHistory={rankHistory}
            complaints={complaints}
            useOfForce={useOfForce}
            awards={awards}
            lawsuits={lawsuits}
            stats={stats}
            isLoading={isLoading}
          />
          
          <OfficerTopSection 
            officer={officer}
            complaints={complaints}
            useOfForce={useOfForce}
            isLoading={isLoading}
          />
          
          <div className="mb-8">
            <OfficerStatsCards stats={stats} isLoading={isLoading} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <OfficerRankHistory rankHistory={rankHistory} />
          </div>

          <OfficerDetailedSections 
            complaints={complaints}
            useOfForce={useOfForce}
            awards={awards}
          />
        </div>
      </div>
    </Layout>
  );
};

export default OfficerDetails;
