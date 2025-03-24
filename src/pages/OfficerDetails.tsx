
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useOfficerDetails } from '@/hooks/useOfficerDetails';
import { OfficerDetailsLayout } from '@/components/officer/OfficerDetailsLayout';

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
      <OfficerDetailsLayout
        officer={officer}
        stats={stats}
        rankHistory={rankHistory}
        complaints={complaints}
        useOfForce={useOfForce}
        awards={awards}
        lawsuits={lawsuits}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default OfficerDetails;
