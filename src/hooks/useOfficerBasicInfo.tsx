
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
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Calculate age from date_of_birth
  const calculateAge = () => {
    if (!officer?.date_of_birth) return null;

    try {
      // Handle different date formats
      const dob = new Date(officer.date_of_birth);
      return differenceInYears(new Date(), dob);
    } catch (e) {
      console.error("Error calculating age:", e);
      return null;
    }
  };

  const age = calculateAge();
  
  return {
    officer: officer ? { ...officer, age } : null,
    isLoading
  };
};
