
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
            final_outcome
          )
        `)
        .eq('officer_id', selectedOfficer);

      if (linksError) throw new Error('Failed to fetch complaints');

      // Get complaints IDs for attachment lookup
      const complaintIds = complaintLinks.map(link => link.complaint.complaint_id);
      
      // Fetch attachment counts for each complaint
      const { data: attachmentCounts, error: attachmentsError } = await supabase
        .from('Police_Data_Attachments')
        .select('complaint_id, count')
        .in('complaint_id', complaintIds)
        .select('complaint_id', { count: 'exact' })
        .eq('complaint_id', complaintIds);

      // Create a map of complaint_id to attachment count
      const attachmentCountMap = new Map();
      
      if (attachmentCounts && !attachmentsError) {
        // Group the results by complaint_id and count them
        complaintIds.forEach(complaintId => {
          const count = attachmentCounts.filter(a => a.complaint_id === complaintId).length;
          attachmentCountMap.set(complaintId, count);
        });
      }

      return complaintLinks.map(link => ({
        complaint_id: link.complaint.complaint_id,
        category: link.complaint.complaint_type || 'Unknown',
        crid: `${1000000 + link.complaint.complaint_id}`,
        incident_date: link.complaint.incident_date || 'Unknown date',
        officer_name: officers?.find(o => o.officer_id === selectedOfficer)?.first_name + ' ' + 
                    officers?.find(o => o.officer_id === selectedOfficer)?.last_name,
        attachments: attachmentCountMap.get(link.complaint.complaint_id) || 0,
        final_finding: link.complaint.final_finding,
        final_outcome: link.complaint.final_outcome,
        role_in_incident: link.role_in_incident
      }));
    },
    enabled: !!selectedOfficer
  });
};
