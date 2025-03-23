
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplaintType } from '@/hooks/useComplaintDetails';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface ComplaintOutcomeProps {
  complaint: ComplaintType | null;
  isLoading: boolean;
}

export const ComplaintOutcome: React.FC<ComplaintOutcomeProps> = ({ complaint, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-portal-600" size={18} />
            <div className="h-6 bg-portal-100 rounded w-36 animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-5 bg-portal-100 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-portal-100 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-portal-100 rounded w-3/4 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!complaint) return null;

  const getStatusIcon = () => {
    if (!complaint.final_finding) return <HelpCircle className="text-portal-400" size={18} />;
    
    if (complaint.final_finding.toLowerCase().includes('sustained')) {
      return <CheckCircle className="text-green-500" size={18} />;
    } else {
      return <AlertCircle className="text-amber-500" size={18} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="text-portal-600" size={18} />
          Complaint Outcome
        </CardTitle>
      </CardHeader>
      <CardContent>
        {complaint.final_finding ? (
          <div>
            <div className="flex items-center gap-2 font-medium text-lg">
              {getStatusIcon()}
              <span>{complaint.final_finding}</span>
            </div>
            
            {complaint.final_outcome && (
              <p className="mt-2 text-portal-600">
                <span className="font-medium">Final Outcome:</span> {complaint.final_outcome}
              </p>
            )}
            
            {complaint.closing_notes && (
              <div className="mt-4 p-3 bg-portal-50 rounded-md text-portal-700 text-sm">
                <p className="font-medium mb-1">Closing Notes:</p>
                <p>{complaint.closing_notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-portal-500">
            <HelpCircle className="mx-auto mb-2" size={24} />
            No outcome information available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
