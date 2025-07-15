import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMapDataContext } from '@/hooks/useMapDataContext';

const OfficerCivilianTab = () => {
  const { filteredComplaints } = useMapDataContext();

  // Compute officer vs civilian allegations
  const { officerCount, civilianCount } = useMemo(() => {
    let officer = 0;
    let civilian = 0;
    filteredComplaints.forEach(c => {
      // Assume complaints with officer_id are officer allegations, others are civilian
      if (c.officer_id) officer++;
      else civilian++;
    });
    return { officerCount: officer, civilianCount: civilian };
  }, [filteredComplaints]);

  if (filteredComplaints.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No officer/civilian data available</p>
      </div>
    );
  }

  return (
    <div className="h-full py-2 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[240px]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Officer Allegations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl font-bold text-blue-600">{officerCount}</span>
            <span className="text-sm text-portal-700 mt-2">Allegations against officers</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Civilian Allegations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl font-bold text-green-600">{civilianCount}</span>
            <span className="text-sm text-portal-700 mt-2">Allegations against civilians</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficerCivilianTab;
