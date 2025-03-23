
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading complaint details...' }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="animate-pulse">
        <div className="h-8 bg-portal-100 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-portal-100 rounded w-1/4 mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 bg-portal-100 rounded"></div>
            <div className="h-72 bg-portal-100 rounded"></div>
            <div className="h-48 bg-portal-100 rounded"></div>
          </div>
          <div className="md:col-span-1">
            <div className="h-80 bg-portal-100 rounded"></div>
          </div>
        </div>
      </div>
      <p className="text-center text-portal-500 mt-8">{message}</p>
    </div>
  );
};
