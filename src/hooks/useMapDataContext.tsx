import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Feature } from 'geojson';
import { filterComplaintsByArea } from '@/lib/mapUtils';

// Complaint type
export interface Complaint {
  id: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

// Area type (GeoJSON Feature)
export interface AreaFeature extends Feature {
  properties: {
    name: string;
    [key: string]: any;
  };
}

interface MapDataContextType {
  complaints: Complaint[];
  setComplaints: (c: Complaint[]) => void;
  selectedArea: AreaFeature | null;
  setSelectedArea: (a: AreaFeature | null) => void;
  filteredComplaints: Complaint[];
}

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export const MapDataProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaFeature | null>(null);

  const filteredComplaints = useMemo(() => {
    if (!selectedArea) return complaints;
    return filterComplaintsByArea(complaints, selectedArea as any);
  }, [complaints, selectedArea]);

  return (
    <MapDataContext.Provider value={{
      complaints,
      setComplaints,
      selectedArea,
      setSelectedArea,
      filteredComplaints
    }}>
      {children}
    </MapDataContext.Provider>
  );
};

export function useMapDataContext() {
  const ctx = useContext(MapDataContext);
  if (!ctx) throw new Error('useMapDataContext must be used within MapDataProvider');
  return ctx;
} 