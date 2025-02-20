
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

interface IncidentData {
  x: number;
  y: number;
  z: number;
  type: string;
  details: string;
}

const DataTool = () => {
  const [activeTab, setActiveTab] = useState('outcomes');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['incidents-heatmap'],
    queryFn: async () => {
      // Fetch complaints and use of force data
      const { data: complaints, error: complaintsError } = await supabase
        .from('Police_Data_Complaints')
        .select('*');

      const { data: useOfForce, error: useOfForceError } = await supabase
        .from('Police_Data_Use_Of_Use')
        .select('*');

      if (complaintsError || useOfForceError) throw new Error('Failed to fetch data');

      // Transform data for heat map visualization
      // Note: In a real app, you'd get actual lat/long data
      // Here we're creating sample visualization data
      const transformedData: IncidentData[] = [];
      
      // Process complaints
      complaints?.forEach((complaint, index) => {
        // Create sample x,y coordinates for visualization
        // In real app, these would be actual geo coordinates
        transformedData.push({
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          z: 1, // intensity
          type: 'complaint',
          details: `Complaint: ${complaint.complaint_type}`
        });
      });

      // Process use of force incidents
      useOfForce?.forEach((incident, index) => {
        transformedData.push({
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          z: 2, // higher intensity for use of force
          type: 'force',
          details: `Force Type: ${incident.force_type}`
        });
      });

      return transformedData;
    }
  });

  // Function to determine point color based on type and intensity
  const getPointColor = (type: string, z: number) => {
    if (type === 'complaint') {
      return `rgba(255, 99, 71, ${Math.min(z * 0.5, 1)})`; // Red for complaints
    }
    return `rgba(65, 105, 225, ${Math.min(z * 0.5, 1)})`; // Blue for use of force
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Data Analysis Tool</h1>
          
          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-portal-600 mb-2">Officer Name</label>
              <input
                type="text"
                placeholder="Search by name"
                className="w-full p-2 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-portal-600 mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-portal-600 mb-2">Incident Type</label>
              <select
                className="w-full p-2 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
              >
                <option value="all">All Incidents</option>
                <option value="complaints">Complaints Only</option>
                <option value="force">Use of Force Only</option>
              </select>
            </div>
          </div>

          {/* Map and Graphs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Heat Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-portal-900 mb-4">Incident Distribution Heat Map</h3>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-portal-500">Loading data...</p>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ScatterChart
                    width={500}
                    height={400}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <XAxis type="number" dataKey="x" name="longitude" unit="" />
                    <YAxis type="number" dataKey="y" name="latitude" unit="" />
                    <ZAxis type="number" dataKey="z" range={[100, 500]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (payload && payload.length > 0) {
                          const data = payload[0].payload as IncidentData;
                          return (
                            <div className="bg-white p-2 border border-portal-200 rounded shadow">
                              <p className="text-sm text-portal-900">{data.details}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter data={heatmapData || []} shape="circle">
                      {heatmapData?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getPointColor(entry.type, entry.z)}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </div>
              )}
            </div>

            {/* Graphs Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="border-b border-portal-200 pb-4">
                <div className="flex space-x-4">
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'outcomes' 
                        ? 'text-portal-900 border-b-2 border-portal-900' 
                        : 'text-portal-500 hover:text-portal-900'
                    }`}
                    onClick={() => setActiveTab('outcomes')}
                  >
                    Outcomes
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'categories' 
                        ? 'text-portal-900 border-b-2 border-portal-900' 
                        : 'text-portal-500 hover:text-portal-900'
                    }`}
                    onClick={() => setActiveTab('categories')}
                  >
                    Categories
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'complainants' 
                        ? 'text-portal-900 border-b-2 border-portal-900' 
                        : 'text-portal-500 hover:text-portal-900'
                    }`}
                    onClick={() => setActiveTab('complainants')}
                  >
                    Complainants
                  </button>
                </div>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-portal-500">Graph Data Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataTool;
