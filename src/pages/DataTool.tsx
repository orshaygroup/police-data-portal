
import React, { useState } from 'react';
import Layout from '../components/Layout';
import SearchBar from '@/components/search/SearchBar';
import DataVisualizationsTabs from '@/components/dataVisualizations/DataVisualizationsTabs';
import OfficersList from '@/components/officers/OfficersList';
import ComplaintsList from '@/components/complaints/ComplaintsList';
import { useOfficerData } from '@/hooks/useOfficerData';
import { useComplaintData } from '@/hooks/useComplaintData';
import MapView from '@/components/map/MapView';

const NEW_ORLEANS_LAT = 29.9511;
const NEW_ORLEANS_LNG = -90.0715;

const DataTool = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

  // Fetch officers data
  const { data: officers, isLoading: isLoadingOfficers } = useOfficerData();

  // Fetch complaints data for selected officer
  const { data: complaints, isLoading: isLoadingComplaints } = useComplaintData(selectedOfficer, officers);

  const toggleOfficer = (officerId: number) => {
    if (selectedOfficer === officerId) {
      setSelectedOfficer(null);
      setExpandedComplaint(null);
    } else {
      setSelectedOfficer(officerId);
      setExpandedComplaint(null);
    }
  };

  const toggleComplaint = (complaintId: number) => {
    if (expandedComplaint === complaintId) {
      setExpandedComplaint(null);
    } else {
      setExpandedComplaint(complaintId);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Data Analysis Tool</h1>
          
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            setSelectedOfficer={setSelectedOfficer}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-portal-900 mb-4">Incident Distribution Heat Map</h3>
              <div className="h-[400px] w-full">
                <MapView 
                  height="400px"
                  initialZoom={10.33}
                  initialCenter={[-89.9019, 30.0247]}
                  heatmapLayer={true}
                  interactiveMarkers={true}
                />
              </div>
            </div>

            <DataVisualizationsTabs />
          </div>

          <div className="mt-12">
            <OfficersList 
              officers={officers}
              isLoading={isLoadingOfficers}
              selectedOfficer={selectedOfficer}
              toggleOfficer={toggleOfficer}
            />
            
            {selectedOfficer && (
              <ComplaintsList 
                complaints={complaints}
                isLoading={isLoadingComplaints}
                expandedComplaint={expandedComplaint}
                toggleComplaint={toggleComplaint}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataTool;
