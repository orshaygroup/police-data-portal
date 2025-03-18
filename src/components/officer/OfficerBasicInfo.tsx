
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, BadgeCheck, User, Briefcase, Flag } from 'lucide-react';

interface OfficerBasicInfoProps {
  officer: {
    first_name?: string | null;
    last_name?: string | null;
    badge_number?: number | null;
    current_rank?: string | null;
    date_appointed?: string | null;
    active_status?: string | null;
    date_of_birth?: string | null;
    age?: number | null;
    gender?: string | null;
    race?: string | null;
  } | null;
  isLoading: boolean;
}

export const OfficerBasicInfo = ({ officer, isLoading }: OfficerBasicInfoProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <Link to="/search" className="inline-flex items-center text-portal-600 hover:text-portal-900 mb-6">
        <ArrowLeft className="mr-2" size={20} />
        Back to Search
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-portal-900 mb-2">
          {officer?.first_name} {officer?.last_name}
        </h1>
        <p className="text-xl text-portal-600">
          Badge #{officer?.badge_number} • {officer?.current_rank || 'Unknown Rank'}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex items-start">
          <Calendar size={18} className="text-portal-500 mr-2 mt-0.5" />
          <div>
            <dt className="text-sm text-portal-500">Date of Birth</dt>
            <dd className="text-portal-900">
              {officer?.date_of_birth || 'Not Available'}
              {officer?.age && ` (${officer.age} years old)`}
            </dd>
          </div>
        </div>
        
        <div className="flex items-start">
          <User size={18} className="text-portal-500 mr-2 mt-0.5" />
          <div>
            <dt className="text-sm text-portal-500">Gender</dt>
            <dd className="text-portal-900">{officer?.gender || 'Not Available'}</dd>
          </div>
        </div>
        
        <div className="flex items-start">
          <Flag size={18} className="text-portal-500 mr-2 mt-0.5" />
          <div>
            <dt className="text-sm text-portal-500">Race</dt>
            <dd className="text-portal-900">{officer?.race || 'Not Available'}</dd>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar size={18} className="text-portal-500 mr-2 mt-0.5" />
          <div>
            <dt className="text-sm text-portal-500">Appointment Date</dt>
            <dd className="text-portal-900">{officer?.date_appointed || 'Not Available'}</dd>
          </div>
        </div>
        
        <div className="flex items-start">
          <Briefcase size={18} className="text-portal-500 mr-2 mt-0.5" />
          <div>
            <dt className="text-sm text-portal-500">Current Rank</dt>
            <dd className="text-portal-900">{officer?.current_rank || 'Not Available'}</dd>
          </div>
        </div>
        
        <div className="flex items-start">
          <BadgeCheck size={18} className="text-portal-500 mr-2 mt-0.5" />
          <div>
            <dt className="text-sm text-portal-500">Status</dt>
            <dd className="text-portal-900">{officer?.active_status || 'Unknown'}</dd>
          </div>
        </div>
      </dl>
    </div>
  );
};
