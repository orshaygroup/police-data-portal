import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMapDataContext } from '@/hooks/useMapDataContext';

const COLORS = [
  '#0FA0CE', '#F97316', '#8B5CF6', '#10B981', '#94A3B8', '#F43F5E', '#FACC15', '#6366F1', '#14B8A6', '#F59E42'
];

const ComplainantsTab = () => {
  const { filteredComplaints } = useMapDataContext();

  // Temporary console log to inspect data
  console.log('Complainants Data:', filteredComplaints.map(c => c.complainants));

  // Compute race, gender, and age distributions for complainants
  const { raceData, genderData, ageData } = useMemo(() => {
    const raceCounts: Record<string, number> = {};
    const genderCounts: Record<string, number> = {};
    const ageCounts: Record<string, number> = {};
    filteredComplaints.forEach(c => {
      if (c.complainants && Array.isArray(c.complainants)) {
        c.complainants.forEach(complainant => {
          const race = complainant.race || 'Unknown';
          const gender = complainant.gender || 'Unknown';
          const age = complainant.age_group || 'Unknown';
          raceCounts[race] = (raceCounts[race] || 0) + 1;
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
          ageCounts[age] = (ageCounts[age] || 0) + 1;
        });
      }
    });
    const toData = (counts: Record<string, number>) =>
      Object.entries(counts).map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length]
      }));
    return {
      raceData: toData(raceCounts),
      genderData: toData(genderCounts),
      ageData: toData(ageCounts)
    };
  }, [filteredComplaints]);

  if (filteredComplaints.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No complainant data available</p>
      </div>
    );
  }

  return (
    <div className="h-full py-2 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[240px]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Race</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[180px]">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={raceData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 13, fill: '#334155' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {raceData.map((entry, index) => (
                    <Cell key={`cell-race-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Gender</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[180px]">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={genderData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 13, fill: '#334155' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-gender-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Age</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[180px]">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={ageData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 13, fill: '#334155' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-age-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplainantsTab;
