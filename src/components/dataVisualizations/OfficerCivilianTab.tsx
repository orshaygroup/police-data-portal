
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useOfficerCivilianData } from '@/hooks/useStatisticsData';

const OfficerCivilianTab = () => {
  const { data: officerCivilianData, isLoading: isLoadingOfficerCivilian } = useOfficerCivilianData();

  if (isLoadingOfficerCivilian) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">Loading officer/civilian data...</p>
      </div>
    );
  }

  if (!officerCivilianData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No officer/civilian data available</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Civilian Allegations</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={officerCivilianData.civilianAllegations.data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                >
                  {officerCivilianData.civilianAllegations.data.map((entry, index) => (
                    <Cell key={`cell-civilian-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col mt-4 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-[#FFE2E0]"></span>
              <span className="font-bold">{officerCivilianData.civilianAllegations.unsustained.toLocaleString()}</span>
              <span className="text-gray-600">Unsustained</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-[#FF6B6B]"></span>
              <span className="font-bold">{officerCivilianData.civilianAllegations.sustained.toLocaleString()}</span>
              <span className="text-gray-600">Sustained</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Officer Allegations</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={officerCivilianData.officerAllegations.data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                >
                  {officerCivilianData.officerAllegations.data.map((entry, index) => (
                    <Cell key={`cell-officer-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col mt-4 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-[#FFE2E0]"></span>
              <span className="font-bold">{officerCivilianData.officerAllegations.unsustained.toLocaleString()}</span>
              <span className="text-gray-600">Unsustained</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-[#FF6B6B]"></span>
              <span className="font-bold">{officerCivilianData.officerAllegations.sustained.toLocaleString()}</span>
              <span className="text-gray-600">Sustained</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={officerCivilianData.barChart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
              <Bar dataKey="value" fill="#F0F0F0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex mt-2">
          <div className="flex-1">
            <div className="font-bold">{officerCivilianData.unknown}</div>
            <div className="text-sm text-gray-600">Unknown</div>
          </div>
          <div className="flex-1">
            <div className="font-bold">{officerCivilianData.civilianAllegations.total.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Civilian Allegations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerCivilianTab;
