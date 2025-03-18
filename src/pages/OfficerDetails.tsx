import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Layout from '../components/Layout';
import { OfficerBasicInfo } from '@/components/officer/OfficerBasicInfo';
import { OfficerStatsCards } from '@/components/officer/OfficerStatsCards';
import { OfficerRankHistory } from '@/components/officer/OfficerRankHistory';
import { OfficerComplaints } from '@/components/officer/OfficerComplaints';
import { OfficerUseOfForce } from '@/components/officer/OfficerUseOfForce';
import { OfficerAwards } from '@/components/officer/OfficerAwards';
import { OfficerRadarChart } from '@/components/officer/OfficerRadarChart';
import { useOfficerDetails } from '@/hooks/useOfficerDetails';

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
          {/* Top Section - Officer Information and Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="order-2 lg:order-1">
              <OfficerRadarChart officer={officer} complaints={complaints} useOfForce={useOfForce} />
            </div>
            <div className="order-1 lg:order-2">
              <OfficerBasicInfo officer={officer} isLoading={isLoading} />
            </div>
          </div>
          
          {/* Middle Section - Stats Cards */}
          <div className="mb-8">
            <OfficerStatsCards stats={stats} isLoading={isLoading} />
          </div>

          {/* Bottom Section - Will be left blank for now */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-portal-900 mb-4">Additional Information</h2>
            <p className="text-portal-600">This section will be updated in a future prompt.</p>
          </div>
          
          {/* Existing sections moved below */}
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
    </Layout>
  );
};

export default OfficerDetails;
