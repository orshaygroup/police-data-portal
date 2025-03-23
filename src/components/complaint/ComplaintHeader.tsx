
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ComplaintType } from '@/hooks/useComplaintDetails';

interface ComplaintHeaderProps {
  complaint: ComplaintType | null;
  isLoading: boolean;
}

export const ComplaintHeader: React.FC<ComplaintHeaderProps> = ({ complaint, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-portal-100 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-portal-100 rounded w-1/4"></div>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-portal-500 mb-1">
        <Link to="/search" className="flex items-center hover:text-portal-700">
          <ArrowLeft size={16} className="mr-1" />
          Back to Search
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-portal-900">CR {complaint.crid}</h1>
      
      <div className="mt-2">
        <h2 className="text-xl font-semibold text-portal-800">{complaint.complaint_type || 'Unknown Complaint Type'}</h2>
        {complaint.incident_date && (
          <p className="text-portal-600 mt-1">
            Incident Date: {complaint.incident_date}
          </p>
        )}
      </div>
    </div>
  );
};
