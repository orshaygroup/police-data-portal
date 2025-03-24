
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOfficerComplaints = (officerId: number) => {
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
            investigation_outcomes:Police_Data_Investigation_Outcomes (*)
          )
        `)
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  return complaints || [];
};
