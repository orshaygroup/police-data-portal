
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Layout from '../components/Layout';
import { OfficerBasicInfo } from '@/components/officer/OfficerBasicInfo';
import { OfficerRankHistory } from '@/components/officer/OfficerRankHistory';
import { OfficerComplaints } from '@/components/officer/OfficerComplaints';
import { OfficerUseOfForce } from '@/components/officer/OfficerUseOfForce';
import { OfficerAwards } from '@/components/officer/OfficerAwards';

const OfficerDetails = () => {
  const { id } = useParams();
  const officerId = parseInt(id || '0', 10);

  const { data: officer, isLoading: isLoadingOfficer } = useQuery({
    queryKey: ['officer', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officers')
        .select('*')
        .eq('officer_id', officerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  const { data: rankHistory } = useQuery({
    queryKey: ['officer-rank-history', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officer_Rank_History')
        .select('*')
        .eq('officer_id', officerId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  const { data: complaints } = useQuery({
    queryKey: ['officer-complaints', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          *,
          complaint:Police_Data_Complaints (
            *,
            allegations:Police_Data_Allegations (*),
            investigation_outcomes:Police_Data_Investigation_Outcomes (*),
            attachments:Police_Data_Attachments (*)
          )
        `)
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  const { data: useOfForce } = useQuery({
    queryKey: ['officer-use-of-force', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Use_Of_Use')
        .select('*')
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  const { data: awards } = useQuery({
    queryKey: ['officer-awards', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Awards')
        .select('*')
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

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
          <OfficerBasicInfo officer={officer} isLoading={isLoadingOfficer} />
          
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
