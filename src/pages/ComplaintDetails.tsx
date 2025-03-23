
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useComplaintDetails } from '@/hooks/useComplaintDetails';
import { ComplaintHeader } from '@/components/complaint/ComplaintHeader';
import { AccusedOfficers } from '@/components/complaint/AccusedOfficers';
import { ComplaintTimeline } from '@/components/complaint/ComplaintTimeline';
import { Complainants } from '@/components/complaint/Complainants';
import { ComplaintOutcome } from '@/components/complaint/ComplaintOutcome';
import { Separator } from '@/components/ui/separator';

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { complaint, officers, complainants, timeline, isLoading, error } = useComplaintDetails(id);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <ComplaintHeader complaint={complaint} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <AccusedOfficers officers={officers || []} isLoading={isLoading} />
            
            <Separator />
            
            <ComplaintTimeline timeline={timeline || []} isLoading={isLoading} />
            
            <Separator />
            
            <ComplaintOutcome complaint={complaint} isLoading={isLoading} />
          </div>
          
          <div className="md:col-span-1 space-y-6">
            <Complainants complainants={complainants || []} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintDetails;
