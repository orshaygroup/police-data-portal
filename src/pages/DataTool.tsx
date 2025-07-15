import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SearchBar from '@/components/search/SearchBar';
import DataVisualizationsTabs from '@/components/dataVisualizations/DataVisualizationsTabs';
import OfficersList from '@/components/officers/OfficersList';
import ComplaintsList from '@/components/complaints/ComplaintsList';
import { useOfficerData } from '@/hooks/useOfficerData';
import { useComplaintData } from '@/hooks/useComplaintData';
import MapView from '@/components/map/MapView';
import { MapDataProvider, useMapDataContext } from '@/hooks/useMapDataContext';
import { supabase } from '@/integrations/supabase/client';

const DataToolContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

  // Fetch officers data
  const { data: officers, isLoading: isLoadingOfficers } = useOfficerData();

  // Fetch complaints data for selected officer
  const { data: complaints, isLoading: isLoadingComplaints } = useComplaintData(selectedOfficer, officers);

  // Fetch all complaints for the map context
  const { setComplaints } = useMapDataContext();
  useEffect(() => {
    async function fetchAllComplaints() {
      const { data, error } = await supabase.from('Police_Data_Complaints').select('*');
      if (data) {
        // Only keep complaints with lat/lon and map complaint_id to id
        // Enrich with category, crid, officer_name, attachments (set to 0 for now)
        setComplaints(data.filter((c: any) => c.latitude && c.longitude).map((c: any) => {
          const officer = officers?.find(o => o.officer_id === c.officer_id);
          return {
            ...c,
            id: c.complaint_id,
            category: c.complaint_type,
            crid: String(1000000 + c.complaint_id),
            officer_name: officer ? `${officer.first_name || ''} ${officer.last_name || ''}`.trim() : c.officer_id,
            attachments: 0 // Optionally fetch real count if needed
          };
        }));
      }
    }
    fetchAllComplaints();
  }, [setComplaints, officers]);

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
              <MapView />
            </div>
          </div>
          <DataVisualizationsTabs />
        </div>
        <div className="mt-12">
          <OfficersList 
            isLoading={isLoadingOfficers}
            selectedOfficer={selectedOfficer}
            toggleOfficer={toggleOfficer}
          />
          {selectedOfficer && (
            <ComplaintsList 
              isLoading={isLoadingComplaints}
              expandedComplaint={expandedComplaint}
              toggleComplaint={toggleComplaint}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DataTool = () => (
  <Layout>
    <DataToolContent />
  </Layout>
);

export default DataTool;
