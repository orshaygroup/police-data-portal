
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  type: string;
  subtype: string;
  value: string;
  id?: number;
}

export const useSearchData = (searchQuery: string) => {
  return useQuery({
    queryKey: ['global-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return null;

      const { data: officers } = await supabase
        .from('Police_Data_Officers')
        .select('*')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%`)
        .limit(5);

      const { data: complaints } = await supabase
        .from('Police_Data_Complaints')
        .select('*')
        .or(`complaint_type.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .limit(5);

      const { data: complainants } = await supabase
        .from('Police_Data_Complainants')
        .select('*')
        .or(`race.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`)
        .limit(5);

      return {
        officers: officers?.map(officer => ({
          type: 'Officer',
          subtype: 'Name',
          value: `${officer.first_name} ${officer.last_name}`,
          id: officer.officer_id
        })) || [],
        officerRace: [...new Set(officers?.map(o => o.race))].filter(Boolean).map(race => ({
          type: 'Officer',
          subtype: 'Race',
          value: race,
        })),
        complainantRace: [...new Set(complainants?.map(c => c.race))].filter(Boolean).map(race => ({
          type: 'Complainant',
          subtype: 'Race',
          value: race,
        })),
        locations: [...new Set(complaints?.map(c => c.location))].filter(Boolean).map(location => ({
          type: 'Location',
          subtype: 'Area',
          value: location,
        })),
        incidents: complaints?.map(complaint => {
          const date = new Date(complaint.incident_date);
          return {
            type: 'Incident',
            subtype: 'Summary',
            value: `${complaint.complaint_type} (${date.toLocaleDateString()})`,
            id: complaint.complaint_id
          };
        }) || []
      };
    },
    enabled: searchQuery.length >= 2
  });
};
