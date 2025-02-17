
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

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

  const { data: complaints } = useQuery({
    queryKey: ['officer-complaints', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Complaints')
        .select(`
          *,
          Police_Data_Allegations (*)
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

  const { data: unitHistory } = useQuery({
    queryKey: ['officer-unit-history', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officer_Unit_History')
        .select('*')
        .eq('officer_id', officerId)
        .order('start_date', { ascending: false });
      
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
            <Link to="/search" className="inline-flex items-center text-portal-600 hover:text-portal-900 mt-4">
              <ArrowLeft className="mr-2" size={20} />
              Back to Search
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoadingOfficer) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="glass-panel rounded-2xl p-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <Link to="/search" className="inline-flex items-center text-portal-600 hover:text-portal-900 mb-6">
            <ArrowLeft className="mr-2" size={20} />
            Back to Search
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-portal-900 mb-2">
              {officer?.first_name} {officer?.last_name}
            </h1>
            <p className="text-xl text-portal-600">
              Badge #{officer?.badge_number} • {officer?.current_rank || 'Unknown Rank'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-portal-900 mb-4">Officer Information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-portal-500">Appointment Date</dt>
                  <dd className="text-portal-900">{officer?.date_appointed || 'Not Available'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-portal-500">Status</dt>
                  <dd className="text-portal-900">{officer?.active_status || 'Unknown'}</dd>
                </div>
              </dl>
            </div>

            {/* Unit History */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-portal-900 mb-4">Unit History</h2>
              <div className="space-y-4">
                {unitHistory?.map((unit) => (
                  <div key={unit.id} className="border-l-2 border-portal-200 pl-4">
                    <p className="font-medium text-portal-900">{unit.unit_name}</p>
                    <p className="text-sm text-portal-500">
                      {unit.start_date} - {unit.end_date || 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Complaints and Use of Force */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Complaints */}
            <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold text-portal-900 mb-4">Complaints History</h2>
              <div className="space-y-6">
                {complaints?.map((complaint) => (
                  <div key={complaint.complaint_id} className="border-b border-portal-100 last:border-0 pb-4 last:pb-0">
                    <p className="font-medium text-portal-900 mb-2">
                      Complaint #{complaint.complaint_id}
                    </p>
                    <p className="text-portal-600 text-sm mb-2">
                      {complaint.complaint_type} • {complaint.incident_date}
                    </p>
                    <p className="text-portal-500 text-sm">
                      Finding: {complaint.final_finding || 'Pending'} •
                      Outcome: {complaint.final_outcome || 'Pending'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use of Force */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-portal-900 mb-4">Use of Force Reports</h2>
              <div className="space-y-4">
                {useOfForce?.map((incident) => (
                  <div key={incident.use_of_force_id} className="border-b border-portal-100 last:border-0 pb-4 last:pb-0">
                    <p className="font-medium text-portal-900 mb-1">{incident.force_type}</p>
                    <p className="text-sm text-portal-500">{incident.incident_date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Awards and Commendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-portal-900 mb-4">Awards and Commendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards?.map((award) => (
                <div key={award.award_id} className="border border-portal-100 rounded-lg p-4">
                  <p className="font-medium text-portal-900 mb-1">{award.award_type}</p>
                  <p className="text-sm text-portal-500 mb-2">{award.award_date}</p>
                  {award.description && (
                    <p className="text-sm text-portal-600">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfficerDetails;
