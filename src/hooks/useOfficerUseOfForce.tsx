
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOfficerUseOfForce = (officerId: number) => {
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

  return { useOfForce };
};
