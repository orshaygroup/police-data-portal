
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComplainantType {
  complainant_id: number;
  anonymized_name: string | null;
  age: number | null;
  gender: string | null;
  race: string | null;
  type: string | null;
  role: string | null;
}

export interface AccusedOfficerType {
  officer_id: number;
  badge_number: number | null;
  first_name: string | null;
  last_name: string | null;
  current_rank: string | null;
  role_in_incident: string | null;
  allegations_count: number;
  allegations_sustained_count: number;
  age: number | null;
  race: string | null;
  gender: string | null;
}

export interface InvestigationOutcomeType {
  outcome_id: number;
  phase_name: string | null;
  final_finding: string | null;
  final_outcome: string | null;
  finding_date: string | null;
}

export interface AttachmentType {
  attachment_id: number;
  description: string | null;
  file_url: string | null;
}

export interface AllegationType {
  allegation_id: number;
  category: string | null;
  subcategory: string | null;
  finding: string | null;
  outcome: string | null;
}

export interface ComplaintType {
  complaint_id: number;
  complaint_type: string | null;
  incident_date: string | null;
  complaint_date: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  final_finding: string | null;
  final_outcome: string | null;
  crid: string;
  complainants: ComplainantType[];
  accused_officers: AccusedOfficerType[];
  outcomes: InvestigationOutcomeType[];
  attachments: AttachmentType[];
  allegations: AllegationType[];
}

export const useComplaintDetails = (complaintId: number | null) => {
  return useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: async (): Promise<ComplaintType | null> => {
      if (!complaintId) return null;

      // 1. Fetch basic complaint info
      const { data: complaint, error: complaintError } = await supabase
        .from('Police_Data_Complaints')
        .select('*')
        .eq('complaint_id', complaintId)
        .single();

      if (complaintError) {
        console.error('Error fetching complaint:', complaintError);
        return null;
      }

      if (!complaint) return null;

      // 2. Fetch complainants (victims)
      const { data: complainantLinks, error: complainantLinksError } = await supabase
        .from('Police_Data_Complaint_Complainant_Link')
        .select(`
          complainant_id,
          complainant_role,
          Police_Data_Complainants (
            complainant_id,
            anonymized_name,
            age,
            gender,
            race,
            type
          )
        `)
        .eq('complaint_id', complaintId);

      if (complainantLinksError) {
        console.error('Error fetching complainants:', complainantLinksError);
      }

      // 3. Fetch accused officers
      const { data: officerLinks, error: officerLinksError } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          officer_id,
          role_in_incident,
          Police_Data_Officers (
            officer_id,
            badge_number,
            first_name,
            last_name,
            current_rank,
            race,
            gender,
            date_of_birth
          )
        `)
        .eq('complaint_id', complaintId);

      if (officerLinksError) {
        console.error('Error fetching officer links:', officerLinksError);
      }

      // Calculate age from date_of_birth for officers
      const calculateAge = (dateOfBirth: string | null): number | null => {
        if (!dateOfBirth) return null;
        
        try {
          const birthDate = new Date(dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          return age;
        } catch (e) {
          return null;
        }
      };

      // 4. Fetch investigation outcomes
      const { data: outcomes, error: outcomesError } = await supabase
        .from('Police_Data_Investigation_Outcomes')
        .select('*')
        .eq('complaint_id', complaintId);

      if (outcomesError) {
        console.error('Error fetching outcomes:', outcomesError);
      }

      // 5. Fetch attachments
      const { data: attachments, error: attachmentsError } = await supabase
        .from('Police_Data_Attachments')
        .select('*')
        .eq('complaint_id', complaintId);

      if (attachmentsError) {
        console.error('Error fetching attachments:', attachmentsError);
      }

      // 6. Fetch allegations
      const { data: allegations, error: allegationsError } = await supabase
        .from('Police_Data_Allegations')
        .select('*')
        .eq('complaint_id', complaintId);

      if (allegationsError) {
        console.error('Error fetching allegations:', allegationsError);
      }

      // Get allegations count for each officer
      const accusedOfficers = await Promise.all((officerLinks || []).map(async (link) => {
        if (!link.officer_id) return null;

        // Get allegations count for this officer
        const { count: totalAllegations, error: alleCountError } = await supabase
          .from('Police_Data_Officer_Allegation_Link')
          .select('*', { count: 'exact' })
          .eq('officer_id', link.officer_id);

        if (alleCountError) {
          console.error('Error counting allegations:', alleCountError);
        }

        // Get sustained allegations count
        const { data: sustainedAlles, error: sustainedError } = await supabase
          .from('Police_Data_Officer_Allegation_Link')
          .select(`
            allegation_id,
            Police_Data_Allegations (
              finding
            )
          `)
          .eq('officer_id', link.officer_id);
        
        if (sustainedError) {
          console.error('Error counting sustained allegations:', sustainedError);
        }

        const sustainedCount = sustainedAlles?.filter(
          a => a.Police_Data_Allegations?.finding?.toLowerCase() === 'sustained'
        ).length || 0;

        const officer = link.Police_Data_Officers;
        return {
          officer_id: officer?.officer_id || 0,
          badge_number: officer?.badge_number,
          first_name: officer?.first_name,
          last_name: officer?.last_name,
          current_rank: officer?.current_rank,
          role_in_incident: link.role_in_incident,
          allegations_count: totalAllegations || 0,
          allegations_sustained_count: sustainedCount,
          age: calculateAge(officer?.date_of_birth || null),
          race: officer?.race,
          gender: officer?.gender
        };
      }));

      // Format the complaint data
      return {
        complaint_id: complaint.complaint_id,
        complaint_type: complaint.complaint_type,
        incident_date: complaint.incident_date,
        complaint_date: complaint.complaint_date,
        location: complaint.location,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        final_finding: complaint.final_finding,
        final_outcome: complaint.final_outcome,
        crid: `${1000000 + complaint.complaint_id}`, // Generate CRID based on complaint ID
        complainants: (complainantLinks || []).map(link => ({
          complainant_id: link.Police_Data_Complainants?.complainant_id || 0,
          anonymized_name: link.Police_Data_Complainants?.anonymized_name,
          age: link.Police_Data_Complainants?.age,
          gender: link.Police_Data_Complainants?.gender,
          race: link.Police_Data_Complainants?.race,
          type: link.Police_Data_Complainants?.type,
          role: link.complainant_role
        })),
        accused_officers: accusedOfficers.filter(Boolean) as AccusedOfficerType[],
        outcomes: outcomes || [],
        attachments: attachments || [],
        allegations: allegations || []
      };
    },
    enabled: !!complaintId
  });
};
