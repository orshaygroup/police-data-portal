
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOfficerRankHistory = (officerId: number) => {
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

  return { rankHistory };
};
