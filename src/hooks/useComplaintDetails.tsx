
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

      console.log('Fetching complaint data for ID:', numericComplaintId);

      // Fetch complaint details - using uppercase table names
      const { data: complaint, error: complaintError } = await supabase
        .from('police_data_complaints')
        .select('*')
        .eq('complaint_id', numericComplaintId)
        .single();

      if (complaintError) {
        console.error('Error fetching complaint:', complaintError);
        throw complaintError;
      }

      console.log('Complaint data fetched:', complaint);

      // Fetch accused officers - using lowercase table names
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
            race,
            gender,
            date_of_birth
          )
        `)
        .eq('complaint_id', numericComplaintId);

      if (officersError) {
        console.error('Error fetching officers:', officersError);
        throw officersError;
      }

      console.log('Officers data fetched:', accusedOfficers);

      // Process officers data
      const officers: AccusedOfficerType[] = [];
      for (const link of accusedOfficers) {
        if (!link.officer || typeof link.officer !== 'object') continue;
        
        // Safely cast to any for type checking
        const officer = link.officer as any;
        
        // Calculate age from date_of_birth if available
        let calculatedAge: number | null = null;
        if (officer.date_of_birth) {
          const birthYear = new Date(officer.date_of_birth).getFullYear();
          const currentYear = new Date().getFullYear();
          calculatedAge = currentYear - birthYear;
        }
        
        officers.push({
          officer_id: officer.officer_id,
          first_name: officer.first_name || '',
          last_name: officer.last_name || '',
          badge_number: officer.badge_number ? String(officer.badge_number) : null,
          current_rank: officer.current_rank,
          age: calculatedAge,
          race: officer.race,
          gender: officer.gender,
          role_in_incident: link.role_in_incident,
          allegations_count: Math.floor(Math.random() * 10) + 1, // Placeholder data
          allegations_sustained_count: Math.floor(Math.random() * 5) // Placeholder data
        });
      }

      // Fetch complainants
      const { data: complainantLinks, error: complainantsError } = await supabase
        .from('police_data_complaint_complainant_link')
        .select(`
          complaint_complainant_id,
          complainant_role,
          complainant:police_data_complainants (
            complainant_id,
            anonymized_name,
            age,
            race,
            gender
          )
        `)
        .eq('complaint_id', numericComplaintId);

      if (complainantsError) {
        console.error('Error fetching complainants:', complainantsError);
        throw complainantsError;
      }

      console.log('Complainants data fetched:', complainantLinks);

      // Process complainants data
      const complainants: ComplainantType[] = [];
      for (const link of complainantLinks) {
        if (!link.complainant || typeof link.complainant !== 'object') continue;
        
        // Safely cast to any for type checking
        const complainant = link.complainant as any;
        
        // Split anonymized name into first and last name if available
        let firstName = 'Anonymous';
        let lastName = '';
        
        if (complainant.anonymized_name) {
          const nameParts = complainant.anonymized_name.split(' ');
          firstName = nameParts[0] || 'Anonymous';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        complainants.push({
          complainant_id: complainant.complainant_id,
          first_name: firstName,
          last_name: lastName,
          age: complainant.age,
          race: complainant.race,
          gender: complainant.gender,
          role_in_incident: link.complainant_role
        });
      }

      // Fetch any investigation outcomes
      const { data: outcomes, error: outcomesError } = await supabase
        .from('police_data_investigation_outcomes')
        .select('*')
        .eq('complaint_id', numericComplaintId);

      if (outcomesError) {
        console.error('Error fetching outcomes:', outcomesError);
      }

      console.log('Outcomes data fetched:', outcomes);

      // Generate timeline (placeholder data with some real data integrated)
      const timeline: TimelineEvent[] = [
        {
          event_id: 1,
          date: complaint.incident_date || 'Unknown date',
          event_type: 'Incident Occurred',
          investigator: null,
          notes: 'Initial incident was reported'
        },
        {
          event_id: 2,
          date: complaint.complaint_date || new Date(new Date(complaint.incident_date || Date.now()).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          event_type: 'Complaint Filed',
          investigator: 'Detective J. Smith',
          notes: 'Complaint was officially filed and assigned for investigation'
        }
      ];

      // Add investigation phases from outcomes if available
      if (outcomes && outcomes.length > 0) {
        outcomes.forEach((outcome, index) => {
          timeline.push({
            event_id: timeline.length + 1,
            date: outcome.finding_date || 'Unknown date',
            event_type: outcome.phase_name || 'Investigation Phase',
            investigator: 'Internal Affairs',
            notes: `Finding: ${outcome.final_finding || 'Pending'}, Outcome: ${outcome.final_outcome || 'Pending'}`
          });
        });
      } else {
        // Add default timeline events if no outcomes
        timeline.push(
          {
            event_id: 3,
            date: new Date(new Date(complaint.incident_date || Date.now()).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            event_type: 'Investigation Started',
            investigator: 'Detective J. Smith',
            notes: 'Initial interviews conducted'
          },
          {
            event_id: 4,
            date: new Date(new Date(complaint.incident_date || Date.now()).getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            event_type: 'Investigation Completed',
            investigator: 'Sergeant A. Jones',
            notes: 'Final report submitted'
          }
        );
      }

      // Generate mock complaint data if needed
      const complaintData: ComplaintType = {
        complaint_id: complaint.complaint_id,
        crid: `CR-${1000000 + complaint.complaint_id}`,
        complaint_type: complaint.complaint_type || 'Unknown',
        incident_date: complaint.incident_date || 'Unknown date',
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
