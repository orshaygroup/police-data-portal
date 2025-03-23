
import React from 'react';
import { Link } from 'react-router-dom';
import { AccusedOfficerType } from '@/hooks/useComplaintDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, AlertCircle } from 'lucide-react';

interface AccusedOfficersProps {
  officers: AccusedOfficerType[];
  isLoading: boolean;
}

export const AccusedOfficers: React.FC<AccusedOfficersProps> = ({ officers, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-portal-600" size={18} />
            <div className="h-6 bg-portal-100 rounded w-48 animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-portal-100 rounded w-36 mb-2"></div>
                <div className="h-4 bg-portal-100 rounded w-24 mb-3"></div>
                <div className="h-4 bg-portal-100 rounded w-64"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (officers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-portal-600" size={18} />
            Accused Officers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-portal-500">
            No officers associated with this complaint
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="text-portal-600" size={18} />
          {officers.length} Accused Officer{officers.length !== 1 ? 's' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {officers.map((officer) => (
            <Link 
              key={officer.officer_id} 
              to={`/officers/${officer.officer_id}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-portal-800 mb-1">
                    {officer.first_name} {officer.last_name}
                  </div>
                  <div className="text-sm text-portal-600 mb-2">
                    {officer.current_rank || 'Unknown Rank'} • Badge #{officer.badge_number || 'Unknown'}
                  </div>
                  
                  <div className="text-xs text-portal-500">
                    {officer.allegations_count} allegations 
                    {officer.allegations_sustained_count > 0 && (
                      <span className="text-amber-600">
                        {' '}({officer.allegations_sustained_count} sustained)
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-portal-500 mt-1">
                    {officer.age ? `${officer.age}-year-old` : ''} {officer.race} {officer.gender}
                  </div>
                  
                  {officer.role_in_incident && (
                    <div className="mt-2 text-xs inline-block bg-portal-100 rounded-full px-2 py-1">
                      Role: {officer.role_in_incident}
                    </div>
                  )}
                </div>
                <User className="text-portal-400" size={16} />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
