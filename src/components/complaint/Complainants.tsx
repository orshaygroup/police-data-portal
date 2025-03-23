
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplainantType } from '@/hooks/useComplaintDetails';
import { Users, User } from 'lucide-react';

interface ComplainantsProps {
  complainants: ComplainantType[];
  isLoading: boolean;
}

export const Complainants: React.FC<ComplainantsProps> = ({ complainants, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-portal-600" size={18} />
            <div className="h-6 bg-portal-100 rounded w-36 animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-5 bg-portal-100 rounded w-32 mb-2"></div>
                <div className="h-4 bg-portal-100 rounded w-24 mb-1"></div>
                <div className="h-4 bg-portal-100 rounded w-40"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (complainants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-portal-600" size={18} />
            Complainants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-portal-500">
            No complainant information available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-portal-600" size={18} />
          {complainants.length} Complainant{complainants.length !== 1 ? 's' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complainants.map((complainant) => (
            <div key={complainant.complainant_id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="font-medium text-portal-800">
                  {complainant.first_name} {complainant.last_name}
                </div>
                <User className="text-portal-400" size={16} />
              </div>
              
              <div className="mt-1 text-sm text-portal-600">
                {complainant.age ? `${complainant.age}-year-old` : ''} {complainant.race} {complainant.gender}
              </div>
              
              {complainant.role_in_incident && (
                <div className="mt-2 text-xs inline-block bg-portal-100 rounded-full px-2 py-1">
                  Role: {complainant.role_in_incident}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
