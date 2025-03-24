
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOfficerAwards = (officerId: number) => {
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

  return awards || [];
};
