
import React from 'react';

interface MapLoadingStateProps {
  height: string | number;
  width: string | number;
  message?: string;
  error?: string;
  isTokenError?: boolean;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ 
  height, 
  width, 
  message = 'Loading map...',
  error,
  isTokenError = false
}) => {
  return (
    <div 
      className={`relative rounded-2xl overflow-hidden ${error ? 'bg-red-50' : 'bg-portal-100'} flex items-center justify-center`}
      style={{ height, width }}
    >
      <div className="flex flex-col items-center justify-center p-4">
        {error ? (
          <>
            <div className="w-8 h-8 text-red-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-red-500 mb-2">{error}</p>
            {isTokenError && (
              <p className="text-xs text-gray-500 text-center">
                Please update your MAPBOX_API secret in Supabase to use a public token (pk.*).
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-4 border-portal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-portal-500">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MapLoadingState;
