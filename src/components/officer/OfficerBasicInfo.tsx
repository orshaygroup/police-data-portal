
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface OfficerBasicInfoProps {
  officer: {
    first_name?: string;
    last_name?: string;
    badge_number?: string;
    current_rank?: string;
    date_appointed?: string;
    active_status?: string;
  } | null;
  isLoading: boolean;
}

export const OfficerBasicInfo = ({ officer, isLoading }: OfficerBasicInfoProps) => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-6 w-48 mb-8" />
      </>
    );
  }

  return (
    <>
      <Link to="/search" className="inline-flex items-center text-portal-600 hover:text-portal-900 mb-6">
        <ArrowLeft className="mr-2" size={20} />
        Back to Search
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-portal-900 mb-2">
          {officer?.first_name} {officer?.last_name}
        </h1>
        <p className="text-xl text-portal-600">
          Badge #{officer?.badge_number} • {officer?.current_rank || 'Unknown Rank'}
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-portal-900 mb-4">Officer Information</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-portal-500">Appointment Date</dt>
            <dd className="text-portal-900">{officer?.date_appointed || 'Not Available'}</dd>
          </div>
          <div>
            <dt className="text-sm text-portal-500">Status</dt>
            <dd className="text-portal-900">{officer?.active_status || 'Unknown'}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};
