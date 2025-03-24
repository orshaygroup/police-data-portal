
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Officer } from './useOfficerData';

export interface Complaint {
  complaint_id: number;
  category: string;
  crid: string;
  incident_date: string;
  officer_name: string;
  attachments: number;
  final_finding: string | null;
  final_outcome: string | null;
  role_in_incident?: string;
  location?: string;
  location_type?: string;
  complainants?: ComplainantInfo[];
  investigation_timeline?: TimelineEvent[];
}

interface ComplainantInfo {
  gender: string;
  race: string;
}

interface TimelineEvent {
  event_type: string;
  date: string;
  investigator?: string;
  notes?: string;
}

export const useComplaintData = (selectedOfficer: number | null, officers: Officer[] | undefined) => {
  return useQuery({
    queryKey: ['officer-complaints', selectedOfficer],
    queryFn: async () => {
      if (!selectedOfficer) return [];

      // First, get the complaints linked to the officer
      const { data: complaintLinks, error: linksError } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          officer_complaint_link_id,
          role_in_incident,
          complaint:Police_Data_Complaints (
            complaint_id,
            complaint_type,
            incident_date,
            final_finding,
            final_outcome,
            location,
            latitude,
            longitude
          )
        `)
        .eq('officer_id', selectedOfficer);

      if (linksError) throw new Error('Failed to fetch complaints');

      // Get complaints IDs for attachment lookup
      const complaintIds = complaintLinks.map(link => link.complaint.complaint_id);
      
      // Fetch attachment counts for each complaint
      const { data: attachmentCounts, error: attachmentsError } = await supabase
        .from('Police_Data_Attachments')
        .select('complaint_id')
        .in('complaint_id', complaintIds);

      // Create a map of complaint_id to attachment count
      const attachmentCountMap = new Map();
      
      if (attachmentCounts && !attachmentsError) {
        // Group the results by complaint_id and count them
        complaintIds.forEach(complaintId => {
          const count = attachmentCounts.filter(a => a.complaint_id === complaintId).length;
          attachmentCountMap.set(complaintId, count);
        });
      }

      // Fetch complainants for each complaint
      const { data: complainants, error: complainantsError } = await supabase
        .from('Police_Data_Complainants')
        .select('complaint_id, gender, race')
        .in('complaint_id', complaintIds);

      // Group complainants by complaint_id
      const complainantsMap = new Map();
      if (complainants && !complainantsError) {
        complaintIds.forEach(complaintId => {
          const complaintComplainants = complainants.filter(c => c.complaint_id === complaintId);
          complainantsMap.set(complaintId, complaintComplainants);
        });
      }

      // Fetch investigation outcomes (for timeline)
      const { data: outcomes, error: outcomesError } = await supabase
        .from('Police_Data_Investigation_Outcomes')
        .select('complaint_id, phase_name, finding_date, final_finding, final_outcome')
        .in('complaint_id', complaintIds);

      // Group outcomes by complaint_id
      const outcomesMap = new Map();
      if (outcomes && !outcomesError) {
        complaintIds.forEach(complaintId => {
          const complaintOutcomes = outcomes.filter(o => o.complaint_id === complaintId);
          outcomesMap.set(complaintId, complaintOutcomes);
        });
      }

      return complaintLinks.map(link => {
        // Get complainants for this complaint
        const complaintComplainants = complainantsMap.get(link.complaint.complaint_id) || [];
        
        // Get outcomes for this complaint (for timeline)
        const complaintOutcomes = outcomesMap.get(link.complaint.complaint_id) || [];
        
        // Format timeline events
        const timelineEvents = [
          // Always add incident date as first event
          {
            event_type: 'Incident Occurred',
            date: link.complaint.incident_date || 'Unknown date',
          },
          // Add investigation outcomes as timeline events
          ...complaintOutcomes.map(outcome => ({
            event_type: outcome.phase_name || 'Investigation Phase',
            date: outcome.finding_date || 'Unknown date',
            notes: outcome.final_finding ? `Finding: ${outcome.final_finding}` : undefined,
          })),
        ];

        // Determine location type based on coordinates
        let locationType = 'Unknown';
        if (link.complaint.latitude && link.complaint.longitude) {
          locationType = 'Urban'; // This is a simplification; in reality, would determine based on coordinates
        }

        return {
          complaint_id: link.complaint.complaint_id,
          category: link.complaint.complaint_type || 'Unknown',
          crid: `${1000000 + link.complaint.complaint_id}`,
          incident_date: link.complaint.incident_date || 'Unknown date',
          officer_name: officers?.find(o => o.officer_id === selectedOfficer)?.first_name + ' ' + 
                       officers?.find(o => o.officer_id === selectedOfficer)?.last_name,
          attachments: attachmentCountMap.get(link.complaint.complaint_id) || 0,
          final_finding: link.complaint.final_finding,
          final_outcome: link.complaint.final_outcome,
          role_in_incident: link.role_in_incident,
          location: link.complaint.location || 'CHICAGO IL',
          location_type: locationType,
          complainants: complaintComplainants.map(c => ({ 
            gender: c.gender || 'Unknown', 
            race: c.race || 'Unknown' 
          })),
          investigation_timeline: timelineEvents
        };
      });
    },
    enabled: !!selectedOfficer
  });
};
