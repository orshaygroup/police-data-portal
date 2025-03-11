
import React from 'react';
import { Download, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Complaint } from '@/hooks/useComplaintData';

interface ComplaintsListProps {
  complaints: Complaint[] | undefined;
  isLoading: boolean;
  expandedComplaint: number | null;
  toggleComplaint: (complaintId: number) => void;
}

const ComplaintsList = ({ complaints, isLoading, expandedComplaint, toggleComplaint }: ComplaintsListProps) => {
  if (!complaints || complaints.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-portal-900">
          Complaints ({complaints?.length || 0})
        </h2>
        <button className="flex items-center px-3 py-1 bg-portal-100 text-portal-700 rounded hover:bg-portal-200">
          <Download size={16} className="mr-2" />
          Download Table
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading complaints...</p>
        </div>
      ) : complaints?.length === 0 ? (
        <p className="text-center py-4 text-portal-500">No complaints found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-portal-200">
                <th className="text-left py-3 px-4 font-medium text-portal-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-portal-600">CRID</th>
                <th className="text-left py-3 px-4 font-medium text-portal-600">Incident Date</th>
                <th className="text-left py-3 px-4 font-medium text-portal-600">Officer</th>
                <th className="text-left py-3 px-4 font-medium text-portal-600">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {complaints?.map((complaint) => (
                <React.Fragment key={complaint.complaint_id}>
                  <tr 
                    className="border-b border-portal-100 hover:bg-portal-50 cursor-pointer"
                    onClick={() => toggleComplaint(complaint.complaint_id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {expandedComplaint === complaint.complaint_id ? (
                          <ChevronUp size={16} className="mr-2" />
                        ) : (
                          <ChevronDown size={16} className="mr-2" />
                        )}
                        <div>
                          {complaint.final_finding === "Not Sustained" && (
                            <span className="text-xs text-blue-500 block">Not Sustained</span>
                          )}
                          {complaint.final_finding === "Exonerated" && (
                            <span className="text-xs text-green-500 block">Exonerated</span>
                          )}
                          {complaint.final_finding === "Unfounded" && (
                            <span className="text-xs text-orange-500 block">Unfounded</span>
                          )}
                          {complaint.category}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{complaint.crid}</td>
                    <td className="py-3 px-4">{complaint.incident_date}</td>
                    <td className="py-3 px-4">{complaint.officer_name}</td>
                    <td className="py-3 px-4">
                      {complaint.attachments > 0 ? (
                        <span className="flex items-center">
                          <FileText size={14} className="mr-1" />
                          {complaint.attachments} linked
                        </span>
                      ) : (
                        <span className="text-portal-400">0 linked</span>
                      )}
                    </td>
                  </tr>
                  {expandedComplaint === complaint.complaint_id && (
                    <tr className="bg-portal-50">
                      <td colSpan={5} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Category</h4>
                            <p className="text-portal-600 mb-4">{complaint.category}</p>
                            
                            <h4 className="font-medium mb-2">Final Finding</h4>
                            <p className="text-portal-600 mb-4">{complaint.final_finding || "Pending"}</p>
                            
                            <h4 className="font-medium mb-2">Final Outcome</h4>
                            <p className="text-portal-600">{complaint.final_outcome || "No Action Taken"}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Investigation Timeline</h4>
                            <div className="relative pl-6 pb-3 border-l border-portal-300">
                              <div className="absolute left-0 top-0 w-3 h-3 -ml-1.5 rounded-full bg-portal-500"></div>
                              <p className="font-medium">Incident Date</p>
                              <p className="text-portal-600 mb-4">Investigation Begins<br/>{complaint.incident_date}</p>
                              
                              <div className="absolute left-0 bottom-0 w-3 h-3 -ml-1.5 rounded-full bg-portal-500"></div>
                              <p className="font-medium">Investigation Closed (Unknown)</p>
                              <p className="text-portal-600">One year later</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Complaining Witness</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-portal-100 px-3 py-1 rounded-full text-sm">White, Male</span>
                            <span className="bg-portal-100 px-3 py-1 rounded-full text-sm">Black, Male</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Address</h4>
                            <p className="text-portal-600">CHICAGO IL</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Location Type</h4>
                            <p className="text-portal-600">Urban</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Documents</h4>
                          <button className="text-portal-600 hover:text-portal-900 px-3 py-1 bg-portal-100 rounded-md text-sm">
                            Request
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintsList;
