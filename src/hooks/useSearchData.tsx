
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

      // Get officers matching the search query
      const { data: officers } = await supabase
        .from('Police_Data_Officers')
        .select('*')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%`)
        .limit(5);

      // Get complaints matching the search query
      const { data: complaints } = await supabase
        .from('Police_Data_Complaints')
        .select('*')
        .or(`complaint_type.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,final_finding.ilike.%${searchQuery}%,final_outcome.ilike.%${searchQuery}%`)
        .limit(5);

      // Get complainants matching the search query
      const { data: complainants } = await supabase
        .from('Police_Data_Complainants')
        .select('*')
        .or(`race.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,gender.ilike.%${searchQuery}%`)
        .limit(5);

      // Get documents matching the search query
      const { data: documents } = await supabase
        .from('Police_Data_Documents')
        .select('*')
        .or(`doc_title.ilike.%${searchQuery}%,doc_type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      // Get lawsuits matching the search query
      const { data: lawsuits } = await supabase
        .from('Police_Data_Lawsuits')
        .select('*')
        .or(`plaintiff_name.ilike.%${searchQuery}%,case_number.ilike.%${searchQuery}%,lawsuit_status.ilike.%${searchQuery}%,Summary.ilike.%${searchQuery}%,final_outcome.ilike.%${searchQuery}%,court_name.ilike.%${searchQuery}%`)
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
        }) || [],
        // New search results for documents
        documents: documents?.map(doc => ({
          type: 'Document',
          subtype: doc.doc_type || 'General',
          value: doc.doc_title,
          id: doc.document_id
        })) || [],
        // New search results for lawsuits
        lawsuits: lawsuits?.map(lawsuit => ({
          type: 'Lawsuit',
          subtype: lawsuit.lawsuit_status || 'Case',
          value: lawsuit.plaintiff_name ? `${lawsuit.plaintiff_name} (${lawsuit.case_number || 'No Case Number'})` : `Case ${lawsuit.case_number}`,
          id: lawsuit.lawsuit_id
        })) || [],
        // Add complaint findings for better searchability
        findings: [...new Set(complaints?.map(c => c.final_finding))].filter(Boolean).map(finding => ({
          type: 'Complaint',
          subtype: 'Finding',
          value: finding,
        })),
        // Add complaint outcomes for better searchability
        outcomes: [...new Set(complaints?.map(c => c.final_outcome))].filter(Boolean).map(outcome => ({
          type: 'Complaint',
          subtype: 'Outcome',
          value: outcome,
        }))
      };
    },
    enabled: searchQuery.length >= 2
  });
};
