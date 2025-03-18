
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Lawsuit {
  lawsuit_id: number;
  case_number: string | null;
  plaintiff_name: string | null;
  date_filed: string | null;
  date_closed: string | null;
  settlement_amount: number | null;
  lawsuit_status: string | null;
  Summary: string | null;
  final_outcome: string | null;
  court_name: string | null;
}

export interface OfficerInLawsuit {
  officer_id: number;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  race: string | null;
  badge_number: number | null;
  current_rank: string | null;
  allegation_in_lawsuit: string | null;
}

export const useLawsuitData = () => {
  return useQuery({
    queryKey: ['lawsuits'],
    queryFn: async () => {
      const { data: lawsuits, error: lawsuitsError } = await supabase
        .from('Police_Data_Lawsuits')
        .select('*');

      if (lawsuitsError) throw new Error('Failed to fetch lawsuits');

      return lawsuits.sort((a, b) => {
        // Sort by date filed, with most recent first
        const dateA = a.date_filed ? new Date(a.date_filed).getTime() : 0;
        const dateB = b.date_filed ? new Date(b.date_filed).getTime() : 0;
        return dateB - dateA;
      });
    }
  });
};

export const useLawsuitDetails = (lawsuitId: number) => {
  return useQuery({
    queryKey: ['lawsuit-details', lawsuitId],
    queryFn: async () => {
      // Fetch the lawsuit details
      const { data: lawsuit, error: lawsuitError } = await supabase
        .from('Police_Data_Lawsuits')
        .select('*')
        .eq('lawsuit_id', lawsuitId)
        .single();

      if (lawsuitError) throw new Error('Failed to fetch lawsuit details');

      // Fetch officers involved in this lawsuit
      const { data: officerLinks, error: officersError } = await supabase
        .from('Police_Data_Lawsuit_Officer_Link')
        .select('officer_id, allegation_in_lawsuit')
        .eq('lawsuit_id', lawsuitId);

      if (officersError) throw new Error('Failed to fetch officers involved in lawsuit');

      // Get detailed information for each officer
      const officersInLawsuit: OfficerInLawsuit[] = [];
      
      if (officerLinks && officerLinks.length > 0) {
        const officerIds = officerLinks.map(link => link.officer_id).filter(Boolean);
        
        if (officerIds.length > 0) {
          const { data: officersData, error: officersDataError } = await supabase
            .from('Police_Data_Officers')
            .select('*')
            .in('officer_id', officerIds);

          if (officersDataError) throw new Error('Failed to fetch officer details');

          // Combine officer data with allegation information
          officersData.forEach(officer => {
            const link = officerLinks.find(link => link.officer_id === officer.officer_id);
            officersInLawsuit.push({
              ...officer,
              allegation_in_lawsuit: link?.allegation_in_lawsuit || null
            });
          });
        }
      }

      return {
        lawsuit,
        officers: officersInLawsuit
      };
    },
    enabled: !!lawsuitId
  });
};
