
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface Complaint {
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

interface ComplaintsDisplayProps {
  selectedOfficer: number | null;
  expandedComplaint: number | null;
  onComplaintToggle: (complaintId: number) => void;
}

const ComplaintsDisplay = ({
  selectedOfficer,
  expandedComplaint,
  onComplaintToggle
}: ComplaintsDisplayProps) => {
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['officer-complaints', selectedOfficer],
    queryFn: async () => {
      if (!selectedOfficer) return [];

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

      return complaintLinks.map(link => ({
        complaint_id: link.complaint.complaint_id,
        category: link.complaint.complaint_type || 'Unknown',
        crid: `${1000000 + link.complaint.complaint_id}`,
        incident_date: link.complaint.incident_date || 'Unknown date',
        officer_name: 'Officer Name', // This would need to be fetched separately
        attachments: 0,
        final_finding: link.complaint.final_finding,
        final_outcome: link.complaint.final_outcome,
        role_in_incident: link.role_in_incident
      }));
    },
    enabled: !!selectedOfficer
  });

  if (!selectedOfficer || isLoading) return null;

  return (
    <div className="mt-4 space-y-4">
      {complaints?.map((complaint) => (
        <div
          key={complaint.complaint_id}
          className="border border-portal-200 rounded-lg overflow-hidden"
        >
          <div
            className="p-4 bg-white cursor-pointer hover:bg-portal-50 transition-colors"
            onClick={() => onComplaintToggle(complaint.complaint_id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">CRID #{complaint.crid}</span>
                <p className="text-sm text-portal-600">{complaint.category}</p>
              </div>
              {expandedComplaint === complaint.complaint_id ? (
                <ChevronUp className="text-portal-400" />
              ) : (
                <ChevronDown className="text-portal-400" />
              )}
            </div>
          </div>

          {expandedComplaint === complaint.complaint_id && (
            <div className="p-4 border-t border-portal-200 bg-portal-50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-portal-600">Incident Date</p>
                  <p className="font-medium">{complaint.incident_date}</p>
                </div>
                <div>
                  <p className="text-sm text-portal-600">Role</p>
                  <p className="font-medium">{complaint.role_in_incident || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-portal-600">Finding</p>
                  <p className="font-medium">{complaint.final_finding || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-sm text-portal-600">Outcome</p>
                  <p className="font-medium">{complaint.final_outcome || 'Pending'}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-portal-600">
                <FileText size={16} className="mr-2" />
                <span>{complaint.attachments} attachments</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplaintsDisplay;
