
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OfficerResult {
  officer_id: number;
  badge_number: number | null;
  first_name: string | null;
  last_name: string | null;
  current_rank: string | null;
  complaint_count: number;
  force_count: number;
  award_count: number;
}

interface OfficerSearchResultsProps {
  results: OfficerResult[] | undefined;
  isLoading: boolean;
}

const OfficerSearchResults = ({ results, isLoading }: OfficerSearchResultsProps) => {
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
        No officers found matching your search
      </div>
    );
  }

  return (
    <>
      {results.map((officer) => (
        <Link
          key={officer.officer_id}
          to={`/officers/${officer.officer_id}`}
          className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-portal-900 mb-2">
                {officer.first_name} {officer.last_name}
              </h3>
              <p className="text-portal-600 mb-4">
                Badge #{officer.badge_number} • {officer.current_rank || 'Unknown Rank'}
              </p>
              <div className="flex gap-4 text-sm text-portal-500">
                <span>{officer.complaint_count} Complaints</span>
                <span>{officer.force_count} Use of Force Reports</span>
                <span>{officer.award_count} Commendations</span>
              </div>
            </div>
            <ArrowRight className="text-portal-400" size={24} />
          </div>
        </Link>
      ))}
    </>
  );
};

export default OfficerSearchResults;
