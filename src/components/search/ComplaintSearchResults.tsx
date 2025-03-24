
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ComplaintResult {
  complaint_id: number;
  complaint_type: string | null;
  incident_date: string | null;
  location: string | null;
  final_finding: string | null;
  final_outcome: string | null;
}

interface ComplaintSearchResultsProps {
  results: ComplaintResult[] | undefined;
  isLoading: boolean;
  formatDate: (dateString?: string | null) => string;
}

const ComplaintSearchResults = ({ results, isLoading, formatDate }: ComplaintSearchResultsProps) => {
  if (isLoading) {
    return (
      <>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-64" />
          </div>
        ))}
      </>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-portal-500">
        No complaints found matching your search
      </div>
    );
  }

  return (
    <>
      {results.map((complaint) => (
        <Link
          key={complaint.complaint_id}
          to={`/complaints/${complaint.complaint_id}`}
          className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-portal-900 mb-2">
                {complaint.complaint_type || 'Unknown Complaint Type'}
              </h3>
              <p className="text-portal-600 mb-4">
                Incident Date: {formatDate(complaint.incident_date)} • Location: {complaint.location || 'Unknown'}
              </p>
              <div className="flex gap-4 text-sm text-portal-500">
                <span>Finding: {complaint.final_finding || 'Pending'}</span>
                <span>Outcome: {complaint.final_outcome || 'Pending'}</span>
              </div>
            </div>
            <ArrowRight className="text-portal-400" size={24} />
          </div>
        </Link>
      ))}
    </>
  );
};

export default ComplaintSearchResults;
