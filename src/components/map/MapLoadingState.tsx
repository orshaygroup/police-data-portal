
import React from 'react';

interface MapLoadingStateProps {
  height: string | number;
  width: string | number;
  message?: string;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ 
  height, 
  width, 
  message = 'Loading map...' 
}) => {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden bg-portal-100 flex items-center justify-center"
      style={{ height, width }}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-portal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-portal-500">{message}</p>
      </div>
    </div>
  );
};

export default MapLoadingState;
