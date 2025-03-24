
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LawsuitResult {
  lawsuit_id: number;
  case_number: string | null;
  plaintiff_name: string | null;
  date_filed: string | null;
  settlement_amount: number | null;
  lawsuit_status: string | null;
  final_outcome: string | null;
}

interface LawsuitSearchResultsProps {
  results: LawsuitResult[] | undefined;
  isLoading: boolean;
  formatDate: (dateString?: string | null) => string;
  formatCurrency: (amount?: number | null) => string;
}

const LawsuitSearchResults = ({ 
  results, 
  isLoading, 
  formatDate,
  formatCurrency 
}: LawsuitSearchResultsProps) => {
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
        No lawsuits found matching your search
      </div>
    );
  }

  return (
    <>
      {results.map((lawsuit) => (
        <Link
          key={lawsuit.lawsuit_id}
          to={`/lawsuits?id=${lawsuit.lawsuit_id}`}
          className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-portal-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-portal-900 mb-2">
                  {lawsuit.plaintiff_name || 'Unknown Plaintiff'} 
                  <span className="text-portal-600 text-base ml-2">
                    (Case #{lawsuit.case_number || 'Unknown'})
                  </span>
                </h3>
                <p className="text-portal-600 mb-2">
                  Filed: {formatDate(lawsuit.date_filed)} • Status: {lawsuit.lawsuit_status || 'Unknown'}
                </p>
                <div className="flex gap-4 text-sm text-portal-500">
                  <span>Settlement: {formatCurrency(lawsuit.settlement_amount)}</span>
                  <span>Outcome: {lawsuit.final_outcome || 'Pending'}</span>
                </div>
              </div>
            </div>
            <ArrowRight className="text-portal-400" size={24} />
          </div>
        </Link>
      ))}
    </>
  );
};

export default LawsuitSearchResults;
