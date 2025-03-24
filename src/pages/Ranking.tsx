
import React from 'react';
import Layout from '../components/Layout';
import { useOfficersRanking } from '@/hooks/useOfficersRanking';
import { OfficerRankingTable } from '@/components/ranking/OfficerRankingTable';
import { TopOffenderRadar } from '@/components/ranking/TopOffenderRadar';
import { ScoreDistributionChart } from '@/components/ranking/ScoreDistributionChart';
import { ChevronDown, PieChart, BarChart3, TableProperties } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Ranking = () => {
  const { data: officers = [], isLoading } = useOfficersRanking();
  const topOfficer = officers.length > 0 ? officers[0] : null;
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-portal-900">Officer Rankings</h1>
            <p className="text-portal-600 mt-2">
              Officers are ranked based on a composite score calculated from allegations, use of force incidents, awards, and service time.
              Click on any officer to view their detailed information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TopOffenderRadar officer={topOfficer} isLoading={isLoading} />
            <ScoreDistributionChart officers={officers} isLoading={isLoading} />
          </div>

          <Tabs defaultValue="table" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-portal-900">Officer Ranking List</h2>
              <TabsList>
                <TabsTrigger value="table">
                  <TableProperties className="h-4 w-4 mr-2" />
                  Table
                </TabsTrigger>
                <TabsTrigger value="cards">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Cards
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="table">
              <OfficerRankingTable officers={officers} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="mt-4 h-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  officers.slice(0, 9).map((officer, index) => (
                    <div key={officer.officer_id} 
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.location.href = `/officers/${officer.officer_id}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-semibold text-lg">
                            {officer.first_name} {officer.last_name}
                          </div>
                          <div className="text-portal-600 text-sm">
                            {officer.current_rank || 'Unknown Rank'}
                          </div>
                        </div>
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${index === 0 ? 'bg-amber-100 text-amber-800' : 
                            index === 1 ? 'bg-slate-100 text-slate-800' : 
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-portal-500">Allegations</span>
                          <span className="font-medium">{officer.percentiles.officer_allegations_percentile}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-portal-500">Use of Force</span>
                          <span className="font-medium">{officer.percentiles.use_of_force_percentile}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-portal-500">Composite Score</span>
                          <span className="font-medium">{Math.round(officer.composite_score)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Ranking;
