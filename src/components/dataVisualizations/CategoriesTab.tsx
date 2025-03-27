
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
import { useCategoryData } from '@/hooks/useStatisticsData';
import CustomBarLabel from './CustomBarLabel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InfoIcon } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const CategoriesTab = () => {
  const { data: categoryData, isLoading: isLoadingCategories } = useCategoryData();

  if (isLoadingCategories) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md">
          <div className="h-8 bg-portal-100 rounded-lg animate-pulse w-2/3 mx-auto"></div>
          <div className="h-36 bg-portal-100 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-portal-100 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-portal-100 rounded w-5/6 animate-pulse"></div>
        </div>
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
    <div className="h-full py-2 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-portal-900">
              {categoryData.totalCategories} Complaint Categories
            </h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 text-portal-400 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">
                  This data shows the breakdown of complaint categories and the discipline rate for each category.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="h-px w-36 bg-portal-300 my-2" />
          <p className="text-portal-700 text-sm">
            Top categories by number of complaints
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 h-[500px]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-portal-500">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[440px]">
            <ChartContainer
              config={{
                complaints: { label: "Complaints", color: "#A4B8D1" },
                disciplined: { label: "Disciplined", color: "#002E5D" }
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData.categories}
                  layout="vertical"
                  margin={{ top: 10, right: 120, left: 20, bottom: 30 }}
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
                    width={180}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#57534e', fontSize: 12 }}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value, name, props) => (
                          <div className="flex flex-col">
                            <span className="font-medium">{props.payload.name}</span>
                            <div className="flex items-center justify-between gap-4 mt-1">
                              <span>Complaints: {props.payload.complaints.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span>Discipline rate: {props.payload.disciplinePercentage}</span>
                            </div>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar 
                    dataKey="complaints" 
                    fill="#A4B8D1" 
                    barSize={25}
                    radius={[0, 4, 4, 0]}
                    animationDuration={800}
                    animationBegin={200}
                    shape={(props) => (
                      <CustomBarLabel
                        {...props}
                        disciplined={categoryData.categories[props.index as number]?.disciplined || 0}
                        complaints={categoryData.categories[props.index as number]?.complaints || 0}
                      />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-start mt-4 space-x-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#002E5D] mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Disciplined</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#A4B8D1] mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Complaints</span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
