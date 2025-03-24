
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const useSearchResults = (searchQuery: string, activeTab: string) => {
  const { data: officerResults, isLoading: isLoadingOfficers } = useQuery({
    queryKey: ['officers', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data: officers, error } = await supabase
        .from('Police_Data_Officers')
        .select(`
          officer_id,
          badge_number,
          first_name,
          last_name,
          current_rank
        `)
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%,current_rank.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      const officersWithCounts = await Promise.all(
        (officers || []).map(async (officer) => {
          const [complaints, useOfForce, awards] = await Promise.all([
            supabase
              .from('Police_Data_Complaints')
              .select('complaint_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id),
            supabase
              .from('Police_Data_Use_Of_Use')
              .select('use_of_force_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id),
            supabase
              .from('Police_Data_Awards')
              .select('award_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id)
          ]);

          return {
            ...officer,
            complaint_count: complaints.count || 0,
            force_count: useOfForce.count || 0,
            award_count: awards.count || 0
          };
        })
      );

      return officersWithCounts;
    },
    enabled: searchQuery.length >= 3
  });

  const { data: complaintResults, isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['complaints', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from('Police_Data_Complaints')
        .select(`
          complaint_id,
          complaint_type,
          incident_date,
          location,
          final_finding,
          final_outcome
        `)
        .or(`complaint_type.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,final_finding.ilike.%${searchQuery}%,final_outcome.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3 && activeTab === 'complaints'
  });

  const { data: documentResults, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['documents', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from('Police_Data_Documents')
        .select(`
          document_id,
          doc_title,
          doc_type,
          created_at,
          description
        `)
        .or(`doc_title.ilike.%${searchQuery}%,doc_type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3 && activeTab === 'documents'
  });

  const { data: lawsuitResults, isLoading: isLoadingLawsuits } = useQuery({
    queryKey: ['lawsuits', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from('Police_Data_Lawsuits')
        .select(`
          lawsuit_id,
          case_number,
          plaintiff_name,
          date_filed,
          settlement_amount,
          lawsuit_status,
          final_outcome
        `)
        .or(`plaintiff_name.ilike.%${searchQuery}%,case_number.ilike.%${searchQuery}%,lawsuit_status.ilike.%${searchQuery}%,Summary.ilike.%${searchQuery}%,final_outcome.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3 && activeTab === 'lawsuits'
  });

  return {
    officerResults,
    complaintResults,
    documentResults,
    lawsuitResults,
    isLoadingOfficers,
    isLoadingComplaints,
    isLoadingDocuments,
    isLoadingLawsuits
  };
};

// Add a new hook for calculating officer percentiles for the radar chart
export const useOfficerPercentiles = (officerId: number) => {
  return useQuery({
    queryKey: ['officer-percentiles', officerId],
    queryFn: async () => {
      if (!officerId) return null;

      // Fetch all officers data for percentile calculations
      const { data: allOfficers, error: officersError } = await supabase
        .from('Police_Data_Officers')
        .select('officer_id');
      
      if (officersError) throw officersError;
      
      // Get counts of different types of allegations for all officers
      const officerCounts = await Promise.all(
        (allOfficers || []).map(async (officer) => {
          // Get civilian complaints via complaint-complainant links
          const { data: civilianComplaints, error: civilianError } = await supabase
            .from('Police_Data_Officer_Complaint_Link')
            .select(`
              complaint_id,
              complaint:Police_Data_Complaints (
                complaint_id
              )
            `)
            .eq('officer_id', officer.officer_id);
          
          if (civilianError) throw civilianError;
          
          // Get internal (officer) complaints via allegation links
          const { data: officerAllegations, error: officerError } = await supabase
            .from('Police_Data_Officer_Allegation_Link')
            .select('allegation_id')
            .eq('officer_id', officer.officer_id);
          
          if (officerError) throw officerError;
          
          // Get use of force reports
          const { data: useOfForce, error: forceError } = await supabase
            .from('Police_Data_Use_Of_Use')
            .select('use_of_force_id')
            .eq('officer_id', officer.officer_id);
          
          if (forceError) throw forceError;
          
          return {
            officer_id: officer.officer_id,
            civilian_complaints: civilianComplaints?.length || 0,
            officer_allegations: officerAllegations?.length || 0,
            use_of_force: useOfForce?.length || 0
          };
        })
      );
      
      // Calculate percentiles for the target officer
      const targetOfficer = officerCounts.find(o => o.officer_id === officerId);
      
      if (!targetOfficer) return null;
      
      // Sort officers by each metric to determine percentiles
      const sortedByCivilianComplaints = [...officerCounts].sort((a, b) => a.civilian_complaints - b.civilian_complaints);
      const sortedByOfficerAllegations = [...officerCounts].sort((a, b) => a.officer_allegations - b.officer_allegations);
      const sortedByUseOfForce = [...officerCounts].sort((a, b) => a.use_of_force - b.use_of_force);
      
      // Find position of target officer in each sorted array
      const civilianRank = sortedByCivilianComplaints.findIndex(o => o.officer_id === officerId);
      const officerRank = sortedByOfficerAllegations.findIndex(o => o.officer_id === officerId);
      const forceRank = sortedByUseOfForce.findIndex(o => o.officer_id === officerId);
      
      const totalOfficers = officerCounts.length;
      
      // Calculate percentiles (officers with 0 incidents will all have the same rank)
      // Adjust calculation to handle ties correctly
      const calculatePercentile = (rank: number, total: number) => {
        if (rank < 0) return 0;
        return Math.round((rank / (total - 1)) * 100);
      };
      
      return {
        civilian_percentile: calculatePercentile(civilianRank, totalOfficers),
        officer_percentile: calculatePercentile(officerRank, totalOfficers),
        force_percentile: calculatePercentile(forceRank, totalOfficers),
        raw_counts: {
          civilian_complaints: targetOfficer.civilian_complaints,
          officer_allegations: targetOfficer.officer_allegations,
          use_of_force: targetOfficer.use_of_force
        }
      };
    },
    enabled: !!officerId
  });
};
