
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

      // Fetch complaint details
      const { data: complaint, error: complaintError } = await supabase
        .from('police_data_complaints')
        .select('*')
        .eq('complaint_id', complaintId)
        .single();

      if (complaintError) throw complaintError;

      // Fetch accused officers
      const { data: accusedOfficers, error: officersError } = await supabase
        .from('police_data_officer_complaint_link')
        .select(`
          officer_complaint_link_id,
          role_in_incident,
          officer:police_data_officers (
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
        .eq('complaint_id', complaintId);

      if (officersError) throw officersError;

      // Process officers data
      const officers = accusedOfficers.map((link) => {
        return {
          ...link.officer,
          role_in_incident: link.role_in_incident,
          allegations_count: Math.floor(Math.random() * 10) + 1, // Placeholder data
          allegations_sustained_count: Math.floor(Math.random() * 5) // Placeholder data
        };
      });

      // Fetch complainants
      const { data: complainantLinks, error: complainantsError } = await supabase
        .from('police_data_complaint_complainant_link')
        .select(`
          complaint_complainant_link_id,
          role_in_incident,
          complainant:police_data_complainants (
            complainant_id,
            first_name,
            last_name,
            age,
            race,
            gender
          )
        `)
        .eq('complaint_id', complaintId);

      if (complainantsError) throw complainantsError;

      // Process complainants data
      const complainants = complainantLinks.map((link) => {
        return {
          ...link.complainant,
          role_in_incident: link.role_in_incident
        };
      });

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

      return {
        complaint,
        officers,
        complainants,
        timeline
      };
    },
    enabled: !!complaintId
  });
};
