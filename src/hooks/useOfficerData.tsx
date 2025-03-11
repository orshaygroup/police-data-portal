
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Officer {
  officer_id: number;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  race: string | null;
  badge_number: number | null;
  complaint_count: number;
}

export const useOfficerData = () => {
  return useQuery({
    queryKey: ['officers-with-complaints'],
    queryFn: async () => {
      const { data: officersData, error: officersError } = await supabase
        .from('Police_Data_Officers')
        .select('*');

      if (officersError) throw new Error('Failed to fetch officers');

      const officersWithComplaints = await Promise.all(
        officersData.map(async (officer) => {
          const { count, error } = await supabase
            .from('Police_Data_Officer_Complaint_Link')
            .select('*', { count: 'exact', head: true })
            .eq('officer_id', officer.officer_id);

          return {
            ...officer,
            complaint_count: count || 0
          };
        })
      );

      return officersWithComplaints.sort((a, b) => b.complaint_count - a.complaint_count);
    }
  });
};
