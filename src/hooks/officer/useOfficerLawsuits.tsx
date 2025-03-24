
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOfficerLawsuits = (officerId: number) => {
  const { data: lawsuits } = useQuery({
    queryKey: ['officer-lawsuits', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Lawsuit_Officer_Link')
        .select(`
          *,
          lawsuit:Police_Data_Lawsuits (*)
        `)
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  return lawsuits || [];
};
