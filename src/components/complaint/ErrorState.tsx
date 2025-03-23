
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: Error | null;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto bg-red-50 p-6 rounded-lg border border-red-100 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Complaint</h2>
        <p className="text-red-600 mb-6">{error?.message || 'An unexpected error occurred while loading the complaint details.'}</p>
        <Link to="/search">
          <Button variant="outline">
            Return to Search
          </Button>
        </Link>
      </div>
    </div>
  );
};
