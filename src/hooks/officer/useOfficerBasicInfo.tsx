
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInYears } from 'date-fns';

export const useOfficerBasicInfo = (officerId: number) => {
  const { data: officer, isLoading } = useQuery({
    queryKey: ['officer', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officers')
        .select('*')
        .eq('officer_id', officerId)
        .single();
      
      if (error) throw error;
      
      // Calculate age from date_of_birth
      if (data?.date_of_birth) {
        try {
          const dob = new Date(data.date_of_birth);
          const age = differenceInYears(new Date(), dob);
          return { ...data, age };
        } catch (e) {
          console.error("Error calculating age:", e);
          return data;
        }
      }
      
      return data;
    },
    enabled: Boolean(officerId)
  });

  return { officer, isLoading };
};
