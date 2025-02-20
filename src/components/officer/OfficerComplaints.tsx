
import React from 'react';

interface Attachment {
  attachment_id: number;
  file_url: string | null;
  description: string | null;
}

interface InvestigationOutcome {
  outcome_id: number;
  phase_name: string;
  final_finding: string | null;
  final_outcome: string | null;
}

interface Complaint {
  complaint_id: number;
  complaint_type: string;
  incident_date: string;
  investigation_outcomes?: InvestigationOutcome[];
  attachments?: Attachment[];
}

interface ComplaintLink {
  officer_complaint_link_id: number;
  role_in_incident: string;
  complaint: Complaint;
}

interface OfficerComplaintsProps {
  complaints: ComplaintLink[] | null;
}

export const OfficerComplaints = ({ complaints }: OfficerComplaintsProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-portal-900 mb-4">Complaints and Investigations</h2>
      <div className="space-y-6">
        {complaints?.map((complaintLink) => {
          const complaint = complaintLink.complaint;
          if (!complaint) return null;
          
          return (
            <div key={complaintLink.officer_complaint_link_id} className="border-b border-portal-100 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-portal-900">
                  Complaint #{complaint.complaint_id}
                </p>
                <span className="text-sm text-portal-500">Role: {complaintLink.role_in_incident}</span>
              </div>
              <p className="text-portal-600 text-sm mb-2">
                {complaint.complaint_type} • {complaint.incident_date}
              </p>
              
              {complaint.investigation_outcomes?.map((outcome) => (
                <div key={outcome.outcome_id} className="bg-portal-50 rounded p-3 mb-2">
                  <p className="text-sm font-medium text-portal-900">{outcome.phase_name}</p>
                  <p className="text-sm text-portal-600">
                    Finding: {outcome.final_finding || 'Pending'} •
                    Outcome: {outcome.final_outcome || 'Pending'}
                  </p>
                </div>
              ))}

              {complaint.attachments?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-portal-900 mb-1">Related Documents:</p>
                  <div className="flex flex-wrap gap-2">
                    {complaint.attachments.map((doc) => (
                      <a
                        key={doc.attachment_id}
                        href={doc.file_url || '#'}
                        className="text-sm text-portal-600 hover:text-portal-900 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.description || 'Document'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
