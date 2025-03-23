
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComplaintType {
  complaint_id: number;
  crid: string;
  complaint_type: string;
  incident_date: string;
  location: string;
  summary: string;
  final_finding: string | null;
  final_outcome: string | null;
  closing_notes: string | null;
}

export interface AccusedOfficerType {
  officer_id: number;
  first_name: string;
  last_name: string;
  badge_number: string | null;
  current_rank: string | null;
  age: number | null;
  race: string | null;
  gender: string | null;
  role_in_incident: string | null;
  allegations_count: number;
  allegations_sustained_count: number;
}

export interface ComplainantType {
  complainant_id: number;
  first_name: string;
  last_name: string;
  age: number | null;
  race: string | null;
  gender: string | null;
  role_in_incident: string | null;
}

export interface TimelineEvent {
  event_id: number;
  date: string;
  event_type: string;
  investigator: string | null;
  notes: string | null;
}

export const useComplaintDetails = (complaintId: string | undefined) => {
  return useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: async () => {
      if (!complaintId) return { complaint: null, officers: [], complainants: [], timeline: [] };

      // Convert string ID to number for database queries
      const numericComplaintId = parseInt(complaintId, 10);
      
      if (isNaN(numericComplaintId)) {
        throw new Error('Invalid complaint ID');
      }

      // Fetch complaint details
      const { data: complaint, error: complaintError } = await supabase
        .from('Police_Data_Complaints')
        .select('*')
        .eq('complaint_id', numericComplaintId)
        .single();

      if (complaintError) throw complaintError;

      // Fetch accused officers
      const { data: accusedOfficers, error: officersError } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          officer_complaint_link_id,
          role_in_incident,
          officer:Police_Data_Officers (
            officer_id,
            first_name,
            last_name,
            badge_number,
            current_rank,
            age,
            race,
            gender
          )
        `)
        .eq('complaint_id', numericComplaintId);

      if (officersError) throw officersError;

      // Process officers data
      const officers: AccusedOfficerType[] = [];
      for (const link of accusedOfficers) {
        if (!link.officer || typeof link.officer !== 'object') continue;
        
        // Safely cast to any for type checking
        const officer = link.officer as any;
        
        officers.push({
          officer_id: officer.officer_id,
          first_name: officer.first_name || '',
          last_name: officer.last_name || '',
          badge_number: officer.badge_number,
          current_rank: officer.current_rank,
          age: officer.age,
          race: officer.race,
          gender: officer.gender,
          role_in_incident: link.role_in_incident,
          allegations_count: Math.floor(Math.random() * 10) + 1, // Placeholder data
          allegations_sustained_count: Math.floor(Math.random() * 5) // Placeholder data
        });
      }

      // Fetch complainants
      const { data: complainantLinks, error: complainantsError } = await supabase
        .from('Police_Data_Complaint_Complainant_Link')
        .select(`
          complaint_complainant_id,
          complainant_role,
          complainant:Police_Data_Complainants (
            complainant_id,
            first_name,
            last_name,
            age,
            race,
            gender
          )
        `)
        .eq('complaint_id', numericComplaintId);

      if (complainantsError) throw complainantsError;

      // Process complainants data
      const complainants: ComplainantType[] = [];
      for (const link of complainantLinks) {
        if (!link.complainant || typeof link.complainant !== 'object') continue;
        
        // Safely cast to any for type checking
        const complainant = link.complainant as any;
        
        complainants.push({
          complainant_id: complainant.complainant_id,
          first_name: complainant.first_name || '',
          last_name: complainant.last_name || '',
          age: complainant.age,
          race: complainant.race,
          gender: complainant.gender,
          role_in_incident: link.complainant_role
        });
      }

      // Generate timeline (placeholder data)
      const timeline: TimelineEvent[] = [
        {
          event_id: 1,
          date: complaint.incident_date,
          event_type: 'Incident Occurred',
          investigator: null,
          notes: 'Initial incident was reported'
        },
        {
          event_id: 2,
          date: new Date(new Date(complaint.incident_date).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          event_type: 'Complaint Filed',
          investigator: 'Detective J. Smith',
          notes: 'Complaint was officially filed and assigned for investigation'
        },
        {
          event_id: 3,
          date: new Date(new Date(complaint.incident_date).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          event_type: 'Investigation Started',
          investigator: 'Detective J. Smith',
          notes: 'Initial interviews conducted'
        },
        {
          event_id: 4,
          date: new Date(new Date(complaint.incident_date).getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          event_type: 'Investigation Completed',
          investigator: 'Sergeant A. Jones',
          notes: 'Final report submitted'
        }
      ];

      // Generate mock complaint data if needed
      const complaintData: ComplaintType = {
        complaint_id: complaint.complaint_id,
        crid: `${1000000 + complaint.complaint_id}`,
        complaint_type: complaint.complaint_type || 'Unknown',
        incident_date: complaint.incident_date || '2022-01-01',
        location: complaint.location || 'Unknown location',
        summary: 'Complaint regarding officer conduct during an incident.',
        final_finding: complaint.final_finding,
        final_outcome: complaint.final_outcome,
        closing_notes: 'Investigation concluded with the following findings and actions.'
      };

      return {
        complaint: complaintData,
        officers,
        complainants,
        timeline
      };
    },
    enabled: !!complaintId
  });
};
