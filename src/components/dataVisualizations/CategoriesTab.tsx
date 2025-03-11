
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer } from 'recharts';
import { useCategoryData } from '@/hooks/useStatisticsData';
import CustomBarLabel from './CustomBarLabel';

const CategoriesTab = () => {
  const { data: categoryData, isLoading: isLoadingCategories } = useCategoryData();

  if (isLoadingCategories) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">Loading categories data...</p>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-portal-500">No categories data available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto pr-4">
        <ResponsiveContainer width="100%" height={categoryData.categories.length * 45}>
          <BarChart
            data={categoryData.categories}
            layout="vertical"
            margin={{ top: 10, right: 120, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 'dataMax']} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={10}
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <Bar 
              dataKey="complaints" 
              fill="#A4B8D1" 
              barSize={25}
              shape={(props) => (
                <CustomBarLabel
                  {...props}
                  disciplined={categoryData.categories[props.index as number]?.disciplined || 0}
                  complaints={categoryData.categories[props.index as number]?.complaints || 0}
                />
              )}
            >
              <LabelList 
                dataKey="complaints" 
                position="insideLeft"
                style={{ 
                  fill: 'transparent', 
                  fontSize: 0 
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="relative">
        <div className="absolute top-[-380px] left-0 right-16 bottom-0 pointer-events-none">
          {categoryData.categories.map((category, index) => (
            <div 
              key={index} 
              className="absolute text-sm flex items-center justify-between"
              style={{ 
                top: `${index * 45 + 10}px`,
                width: '100%'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.complaints.toLocaleString()}</span>
                <span className="text-gray-600">— {category.disciplinePercentage} Disciplined</span>
              </div>
              <span className="font-medium text-gray-700 text-right">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-start mt-4 space-x-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#002E5D] mr-2"></div>
          <span className="text-sm text-gray-700">Disciplined</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#A4B8D1] mr-2"></div>
          <span className="text-sm text-gray-700">Complaints</span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
