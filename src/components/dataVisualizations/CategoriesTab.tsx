import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMapDataContext } from '@/hooks/useMapDataContext';

const CATEGORY_COLORS = [
  '#0FA0CE', '#F97316', '#8B5CF6', '#10B981', '#94A3B8', '#F43F5E', '#FACC15', '#6366F1', '#14B8A6', '#F59E42'
];

const CategoriesTab = () => {
  const { filteredComplaints } = useMapDataContext();

  // Compute category counts from filteredComplaints
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredComplaints.forEach(c => {
      const cat = c.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]
    }));
  }, [filteredComplaints]);

  if (filteredComplaints.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No category data available</p>
      </div>
    );
  }

  return (
    <div className="h-full py-2 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-portal-900">
            {filteredComplaints.length.toLocaleString()} Total Complaints
          </h3>
          <div className="h-px w-36 bg-portal-300 my-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[240px]">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Categories</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[180px]">
            <div className="space-y-3">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm text-portal-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="relative h-full md:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 13, fill: '#334155' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
