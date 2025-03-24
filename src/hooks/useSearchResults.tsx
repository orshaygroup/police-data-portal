
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
