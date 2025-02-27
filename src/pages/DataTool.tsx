
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Plus, Minus, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface IncidentData {
  x: number;
  y: number;
  z: number;
  type: string;
  details: string;
}

interface Officer {
  officer_id: number;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  race: string | null;
  badge_number: number | null;
  complaint_count: number;
}

interface Complaint {
  complaint_id: number;
  category: string;
  crid: string;
  incident_date: string;
  officer_name: string;
  attachments: number;
  final_finding: string | null;
  final_outcome: string | null;
}

// New Orleans coordinates
const NEW_ORLEANS_LAT = 29.9511;
const NEW_ORLEANS_LNG = -90.0715;
const COORDINATE_SPREAD = 0.1; // Spread incidents within ~11km radius

const DataTool = () => {
  const [activeTab, setActiveTab] = useState('outcomes');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

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

      const transformedData: IncidentData[] = [];
      
      // Process complaints
      complaints?.forEach((complaint, index) => {
        // Generate random coordinates around New Orleans
        const lat = NEW_ORLEANS_LAT + (Math.random() - 0.5) * COORDINATE_SPREAD;
        const lng = NEW_ORLEANS_LNG + (Math.random() - 0.5) * COORDINATE_SPREAD;
        
        transformedData.push({
          x: lng, // longitude
          y: lat, // latitude
          z: 1, // intensity
          type: 'complaint',
          details: `Complaint: ${complaint.complaint_type}`
        });
      });

      // Process use of force incidents
      useOfForce?.forEach((incident, index) => {
        const lat = NEW_ORLEANS_LAT + (Math.random() - 0.5) * COORDINATE_SPREAD;
        const lng = NEW_ORLEANS_LNG + (Math.random() - 0.5) * COORDINATE_SPREAD;

        transformedData.push({
          x: lng, // longitude
          y: lat, // latitude
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

  // Fetch officers with complaint counts
  const { data: officers, isLoading: isLoadingOfficers } = useQuery({
    queryKey: ['officers-with-complaints'],
    queryFn: async () => {
      // First get all officers
      const { data: officersData, error: officersError } = await supabase
        .from('Police_Data_Officers')
        .select('*');

      if (officersError) throw new Error('Failed to fetch officers');

      // For each officer, count their complaints
      const officersWithComplaints = await Promise.all(
        officersData.map(async (officer) => {
          const { count, error } = await supabase
            .from('Police_Data_Officer_Complaint_Link')
            .select('*', { count: 'exact', head: true })
            .eq('officer_id', officer.officer_id);

          return {
            ...officer,
            complaint_count: count || 0
          };
        })
      );

      // Sort by complaint count (highest first)
      return officersWithComplaints.sort((a, b) => b.complaint_count - a.complaint_count);
    }
  });

  // Fetch complaints for a specific officer
  const { data: complaints, isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['officer-complaints', selectedOfficer],
    queryFn: async () => {
      if (!selectedOfficer) return [];

      const { data: complaintLinks, error: linksError } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          complaint_id,
          role_in_incident,
          complaint:Police_Data_Complaints (
            complaint_id,
            complaint_type,
            incident_date,
            final_finding,
            final_outcome
          )
        `)
        .eq('officer_id', selectedOfficer);

      if (linksError) throw new Error('Failed to fetch complaints');

      // Format complaints for display
      return complaintLinks.map(link => ({
        complaint_id: link.complaint.complaint_id,
        category: link.complaint.complaint_type || 'Unknown',
        crid: `${1000000 + link.complaint.complaint_id}`,
        incident_date: link.complaint.incident_date || 'Unknown date',
        officer_name: officers?.find(o => o.officer_id === selectedOfficer)?.first_name + ' ' + 
                    officers?.find(o => o.officer_id === selectedOfficer)?.last_name,
        attachments: 0, // Placeholder, would need another query to get actual count
        final_finding: link.complaint.final_finding,
        final_outcome: link.complaint.final_outcome,
        role_in_incident: link.role_in_incident
      }));
    },
    enabled: !!selectedOfficer
  });

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
            {/* Mapbox Heat Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-portal-900 mb-4">Incident Distribution Heat Map</h3>
              <div className="h-[400px] w-full">
                <iframe 
                  width='100%' 
                  height='400px' 
                  src="https://api.mapbox.com/styles/v1/krystalklean/cm7l36unb009x01qpg2jabkuf.html?title=false&access_token=pk.eyJ1Ijoia3J5c3RhbGtsZWFuIiwiYSI6ImNtN2RtaWNhNzA0eXIycW9oNXF2ZGRvN3oifQ.UcFuoQmTxIPGo12Tz8Wq5w&zoomwheel=false#10.33/30.0247/-89.9019" 
                  title="Police Complaints Heatmap" 
                  style={{ border: 'none', borderRadius: '0.5rem' }}
                  allowFullScreen
                ></iframe>
              </div>
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

          {/* Officers Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-portal-900">Officers ({officers?.length || 0})</h2>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-portal-100 hover:bg-portal-200">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 rounded-full bg-portal-100 hover:bg-portal-200">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Color scale legend */}
            <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-6 rounded-full"></div>

            {/* Officer Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {isLoadingOfficers ? (
                <div className="col-span-full flex justify-center py-12">
                  <p>Loading officers...</p>
                </div>
              ) : (
                officers?.slice(0, 12).map((officer) => (
                  <div key={officer.officer_id} className="border border-portal-200 rounded-lg bg-white overflow-hidden">
                    <div className="p-4 border-b border-portal-100">
                      <Link to={`/officer/${officer.officer_id}`} className="font-bold text-lg text-portal-900 hover:text-portal-700">
                        {officer.first_name} {officer.last_name}
                      </Link>
                      <p className="text-sm text-portal-600">
                        {officer.gender}, {officer.race}
                      </p>
                    </div>
                    
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-portal-50"
                      onClick={() => toggleOfficer(officer.officer_id)}
                    >
                      <div className="flex items-center">
                        {selectedOfficer === officer.officer_id ? (
                          <Minus size={16} className="mr-2 text-portal-600" />
                        ) : (
                          <Plus size={16} className="mr-2 text-portal-600" />
                        )}
                        <span className="text-sm font-medium">Complaints</span>
                      </div>
                      <span className="bg-portal-100 px-2 py-1 rounded-full text-xs font-medium">
                        {officer.complaint_count}
                      </span>
                    </div>
                    
                    {/* Expandable Complaints Table */}
                    {selectedOfficer === officer.officer_id && (
                      <div className="border-t border-portal-100 p-4">
                        {isLoadingComplaints ? (
                          <p className="text-center py-4 text-portal-500">Loading complaints...</p>
                        ) : complaints?.length === 0 ? (
                          <p className="text-center py-4 text-portal-500">No complaints found</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="border-b border-portal-200">
                                  <th className="text-left py-2 px-3 font-medium text-portal-600">Category</th>
                                  <th className="text-left py-2 px-3 font-medium text-portal-600">CRID</th>
                                  <th className="text-left py-2 px-3 font-medium text-portal-600">Incident Date</th>
                                  <th className="text-left py-2 px-3 font-medium text-portal-600">Officer</th>
                                  <th className="text-left py-2 px-3 font-medium text-portal-600">Attachments</th>
                                </tr>
                              </thead>
                              <tbody>
                                {complaints?.map((complaint) => (
                                  <React.Fragment key={complaint.complaint_id}>
                                    <tr 
                                      className="border-b border-portal-100 hover:bg-portal-50 cursor-pointer"
                                      onClick={() => toggleComplaint(complaint.complaint_id)}
                                    >
                                      <td className="py-2 px-3">
                                        <div className="flex items-center">
                                          {expandedComplaint === complaint.complaint_id ? (
                                            <ChevronUp size={16} className="mr-2" />
                                          ) : (
                                            <ChevronDown size={16} className="mr-2" />
                                          )}
                                          <div>
                                            {complaint.final_finding === "Not Sustained" && (
                                              <span className="text-xs text-blue-500 block">Not Sustained</span>
                                            )}
                                            {complaint.final_finding === "Exonerated" && (
                                              <span className="text-xs text-green-500 block">Exonerated</span>
                                            )}
                                            {complaint.final_finding === "Unfounded" && (
                                              <span className="text-xs text-orange-500 block">Unfounded</span>
                                            )}
                                            {complaint.category}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-2 px-3">{complaint.crid}</td>
                                      <td className="py-2 px-3">{complaint.incident_date}</td>
                                      <td className="py-2 px-3">{complaint.officer_name}</td>
                                      <td className="py-2 px-3">
                                        {complaint.attachments > 0 ? (
                                          <span className="flex items-center">
                                            <FileText size={14} className="mr-1" />
                                            {complaint.attachments} linked
                                          </span>
                                        ) : (
                                          <span className="text-portal-400">0 linked</span>
                                        )}
                                      </td>
                                    </tr>
                                    {expandedComplaint === complaint.complaint_id && (
                                      <tr className="bg-portal-50">
                                        <td colSpan={5} className="p-3">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <h4 className="font-medium mb-2">Category</h4>
                                              <p className="text-portal-600 mb-4">{complaint.category}</p>
                                              
                                              <h4 className="font-medium mb-2">Final Finding</h4>
                                              <p className="text-portal-600 mb-4">{complaint.final_finding || "Pending"}</p>
                                              
                                              <h4 className="font-medium mb-2">Final Outcome</h4>
                                              <p className="text-portal-600">{complaint.final_outcome || "No Action Taken"}</p>
                                            </div>
                                            
                                            <div>
                                              <h4 className="font-medium mb-2">Investigation Timeline</h4>
                                              <div className="relative pl-6 pb-3 border-l border-portal-300">
                                                <div className="absolute left-0 top-0 w-3 h-3 -ml-1.5 rounded-full bg-portal-500"></div>
                                                <p className="font-medium">Incident Date</p>
                                                <p className="text-portal-600 mb-4">Investigation Begins<br/>{complaint.incident_date}</p>
                                                
                                                <div className="absolute left-0 bottom-0 w-3 h-3 -ml-1.5 rounded-full bg-portal-500"></div>
                                                <p className="font-medium">Investigation Closed (Unknown)</p>
                                                <p className="text-portal-600">One year later</p>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="mt-4">
                                            <h4 className="font-medium mb-2">Complaining Witness</h4>
                                            <div className="flex flex-wrap gap-2">
                                              <span className="bg-portal-100 px-3 py-1 rounded-full text-sm">White, Male</span>
                                              <span className="bg-portal-100 px-3 py-1 rounded-full text-sm">Black, Male</span>
                                            </div>
                                          </div>
                                          
                                          <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                              <h4 className="font-medium mb-2">Address</h4>
                                              <p className="text-portal-600">CHICAGO IL</p>
                                            </div>
                                            <div>
                                              <h4 className="font-medium mb-2">Location Type</h4>
                                              <p className="text-portal-600">Urban</p>
                                            </div>
                                          </div>
                                          
                                          <div className="mt-4">
                                            <h4 className="font-medium mb-2">Documents</h4>
                                            <button className="text-portal-600 hover:text-portal-900 px-3 py-1 bg-portal-100 rounded-md text-sm">
                                              Request
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataTool;
