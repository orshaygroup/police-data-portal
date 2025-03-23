
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useComplaintDetails } from '@/hooks/useComplaintDetails';
import { ComplaintHeader } from '@/components/complaint/ComplaintHeader';
import { AccusedOfficers } from '@/components/complaint/AccusedOfficers';
import { ComplaintTimeline } from '@/components/complaint/ComplaintTimeline';
import { Complainants } from '@/components/complaint/Complainants';
import { ComplaintOutcome } from '@/components/complaint/ComplaintOutcome';
import { LoadingState } from '@/components/complaint/LoadingState';
import { ErrorState } from '@/components/complaint/ErrorState';
import { DetailLayout } from '@/components/complaint/DetailLayout';
import { ErrorBoundary } from '@/components/complaint/ErrorBoundary';

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useComplaintDetails(id);
  
  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <ErrorState error={error as Error} />
      </Layout>
    );
  }
  
  const { complaint, officers, complainants, timeline } = data || { 
    complaint: null, 
    officers: [], 
    complainants: [], 
    timeline: [] 
  };

  if (!complaint) {
    return (
      <Layout>
        <ErrorState error={new Error('Complaint not found')} />
      </Layout>
    );
  }

  return (
    <Layout>
      <ErrorBoundary>
        <DetailLayout
          header={<ComplaintHeader complaint={complaint} isLoading={false} />}
          mainContent={[
            <AccusedOfficers key="officers" officers={officers || []} isLoading={false} />,
            <ComplaintTimeline key="timeline" timeline={timeline || []} isLoading={false} />,
            <ComplaintOutcome key="outcome" complaint={complaint} isLoading={false} />
          ]}
          sideContent={<Complainants complainants={complainants || []} isLoading={false} />}
        />
      </ErrorBoundary>
    </Layout>
  );
};

export default ComplaintDetails;
