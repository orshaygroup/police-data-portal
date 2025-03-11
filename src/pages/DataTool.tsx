import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, 
  PieChart, Pie, ResponsiveContainer, Legend, BarChart, Bar, 
  CartesianGrid, LabelList 
} from 'recharts';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Plus, Minus, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';

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

interface OutcomeData {
  name: string;
  value: number;
  color: string;
}

interface CategoryData {
  name: string;
  complaints: number;
  disciplined: number;
  disciplinePercentage: string;
  color: string;
}

interface DemographicData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface DemographicBarData {
  name: string;
  data: DemographicData[];
}

interface AllegationData {
  name: string;
  value: number;
  color: string;
}

const NEW_ORLEANS_LAT = 29.9511;
const NEW_ORLEANS_LNG = -90.0715;
const COORDINATE_SPREAD = 0.1;

const DataTool = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('outcomes');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['incidents-heatmap'],
    queryFn: async () => {
      const { data: complaints, error: complaintsError } = await supabase
        .from('Police_Data_Complaints')
        .select('*');

      const { data: useOfForce, error: useOfForceError } = await supabase
        .from('Police_Data_Use_Of_Use')
        .select('*');

      if (complaintsError || useOfForceError) throw new Error('Failed to fetch data');

      const transformedData: IncidentData[] = [];
      
      complaints?.forEach((complaint, index) => {
        const lat = NEW_ORLEANS_LAT + (Math.random() - 0.5) * COORDINATE_SPREAD;
        const lng = NEW_ORLEANS_LNG + (Math.random() - 0.5) * COORDINATE_SPREAD;
        
        transformedData.push({
          x: lng,
          y: lat,
          z: 1,
          type: 'complaint',
          details: `Complaint: ${complaint.complaint_type}`
        });
      });

      useOfForce?.forEach((incident, index) => {
        const lat = NEW_ORLEANS_LAT + (Math.random() - 0.5) * COORDINATE_SPREAD;
        const lng = NEW_ORLEANS_LNG + (Math.random() - 0.5) * COORDINATE_SPREAD;

        transformedData.push({
          x: lng,
          y: lat,
          z: 2,
          type: 'force',
          details: `Force Type: ${incident.force_type}`
        });
      });

      return transformedData;
    }
  });

  const { data: outcomeData, isLoading: isLoadingOutcomes } = useQuery({
    queryKey: ['allegation-outcomes'],
    queryFn: async () => {
      const { data: allegations, error } = await supabase
        .from('Police_Data_Allegations')
        .select('*');

      if (error) throw new Error('Failed to fetch allegation data');

      const totalAllegations = allegations?.length || 0;

      const findingCounts: Record<string, number> = {};
      
      allegations?.forEach(allegation => {
        const finding = allegation.finding || 'Unknown';
        findingCounts[finding] = (findingCounts[finding] || 0) + 1;
      });

      const findingsData: OutcomeData[] = [
        {
          name: 'Allegations',
          value: totalAllegations,
          color: '#0EA5E9'
        }
      ];

      const colors = [
        '#0FA0CE',
        '#F97316',
        '#D946EF',
        '#8B5CF6',
        '#FEC6A1',
        '#E5DEFF',
        '#FFDEE2',
        '#FDE1D3',
        '#D3E4FD'
      ];

      let colorIndex = 0;
      Object.entries(findingCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([finding, count]) => {
          findingsData.push({
            name: finding,
            value: count,
            color: colors[colorIndex % colors.length]
          });
          colorIndex++;
        });

      return {
        findings: findingsData,
        totalAllegations
      };
    }
  });

  const { data: categoryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['allegation-categories'],
    queryFn: async () => {
      const { data: allegations, error } = await supabase
        .from('Police_Data_Allegations')
        .select('*');

      if (error) throw new Error('Failed to fetch allegation category data');

      const categoryCounts: Record<string, { total: number, disciplined: number }> = {};
      
      allegations?.forEach(allegation => {
        const category = allegation.category || 'Unknown';
        
        if (!categoryCounts[category]) {
          categoryCounts[category] = { total: 0, disciplined: 0 };
        }
        
        categoryCounts[category].total += 1;
        
        const isDisciplined = allegation.outcome?.toLowerCase().includes('discipline') || 
                              allegation.outcome?.toLowerCase().includes('suspend') ||
                              allegation.outcome?.toLowerCase().includes('terminate');
        
        if (isDisciplined) {
          categoryCounts[category].disciplined += 1;
        }
      });

      const chartData: CategoryData[] = Object.entries(categoryCounts)
        .map(([name, { total, disciplined }]) => {
          const percentage = total > 0 ? Math.round((disciplined / total) * 100) : 0;
          
          return {
            name,
            complaints: total,
            disciplined,
            disciplinePercentage: `${percentage}%`,
            color: '#A4B8D1'
          };
        })
        .sort((a, b) => b.complaints - a.complaints)
        .slice(0, 15);

      return {
        categories: chartData,
        totalCategories: Object.keys(categoryCounts).length
      };
    }
  });

  const { data: accusedData, isLoading: isLoadingAccused } = useQuery({
    queryKey: ['accused-demographics'],
    queryFn: async () => {
      const { data: officers, error: officersError } = await supabase
        .from('Police_Data_Officers')
        .select('*');

      if (officersError) throw new Error('Failed to fetch officers data');

      const { data: officerAllegations, error: allegationsError } = await supabase
        .from('Police_Data_Officer_Allegation_Link')
        .select('officer_id');

      if (allegationsError) throw new Error('Failed to fetch officer allegations');

      const { data: officerComplaints, error: complaintsError } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select('officer_id');

      if (complaintsError) throw new Error('Failed to fetch officer complaints');

      const accusedOfficerIds = new Set([
        ...officerAllegations.map(a => a.officer_id),
        ...officerComplaints.map(c => c.officer_id)
      ].filter(id => id !== null));
      
      const accusedOfficers = officers.filter(o => accusedOfficerIds.has(o.officer_id));
      
      const raceCounts: Record<string, number> = {};
      accusedOfficers.forEach(officer => {
        const race = officer.race || 'Unknown';
        raceCounts[race] = (raceCounts[race] || 0) + 1;
      });
      
      const genderCounts: Record<string, number> = {};
      accusedOfficers.forEach(officer => {
        const gender = officer.gender || 'Unknown';
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      });
      
      const ageCounts: Record<string, number> = {
        '20-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-60': 0,
        '61+': 0,
        'Unknown': 0
      };
      
      accusedOfficers.forEach(officer => {
        if (!officer.date_of_birth) {
          ageCounts['Unknown']++;
          return;
        }
        
        const birthYear = parseInt(officer.date_of_birth.split('-')[0]);
        if (isNaN(birthYear)) {
          ageCounts['Unknown']++;
          return;
        }
        
        const age = new Date().getFullYear() - birthYear;
        
        if (age <= 30) ageCounts['20-30']++;
        else if (age <= 40) ageCounts['31-40']++;
        else if (age <= 50) ageCounts['41-50']++;
        else if (age <= 60) ageCounts['51-60']++;
        else ageCounts['61+']++;
      });
      
      const totalOfficers = accusedOfficers.length;
      
      const colors = [
        '#1E40AF',
        '#3B82F6',
        '#93C5FD',
        '#BFDBFE',
        '#2563EB',
      ];
      
      const raceData: DemographicData[] = Object.entries(raceCounts)
        .map(([race, count], index) => ({
          name: race,
          value: count,
          percentage: Math.round((count / totalOfficers) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value);
      
      const genderData: DemographicData[] = Object.entries(genderCounts)
        .map(([gender, count], index) => ({
          name: gender,
          value: count,
          percentage: Math.round((count / totalOfficers) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value);
      
      const ageData: DemographicData[] = Object.entries(ageCounts)
        .filter(([age, count]) => age !== 'Unknown' && count > 0)
        .map(([age, count], index) => ({
          name: age,
          value: count,
          percentage: Math.round((count / totalOfficers) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => {
          const ageOrder = ['20-30', '31-40', '41-50', '51-60', '61+'];
          return ageOrder.indexOf(a.name) - ageOrder.indexOf(b.name);
        });
      
      return {
        race: { name: 'Race', data: raceData },
        gender: { name: 'Gender', data: genderData },
        age: { name: 'Age', data: ageData },
        totalAccused: totalOfficers
      };
    }
  });

  const { data: complainantData, isLoading: isLoadingComplainants } = useQuery({
    queryKey: ['complainant-demographics'],
    queryFn: async () => {
      const { data: complainants, error: complainantsError } = await supabase
        .from('Police_Data_Complainants')
        .select('*');

      if (complainantsError) throw new Error('Failed to fetch complainants data');

      const { data: complainantLinks, error: linksError } = await supabase
        .from('Police_Data_Complaint_Complainant_Link')
        .select('complainant_id, complaint_id');

      if (linksError) throw new Error('Failed to fetch complainant links');

      const raceCounts: Record<string, number> = {};
      complainants.forEach(complainant => {
        const race = complainant.race || 'Unknown';
        raceCounts[race] = (raceCounts[race] || 0) + 1;
      });
      
      const genderCounts: Record<string, number> = {};
      complainants.forEach(complainant => {
        const gender = complainant.gender || 'Unknown';
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      });
      
      const ageCounts: Record<string, number> = {
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51+': 0,
        'Unknown': 0
      };
      
      complainants.forEach(complainant => {
        if (!complainant.age) {
          ageCounts['Unknown']++;
          return;
        }
        
        const age = complainant.age;
        
        if (age <= 30) ageCounts['21-30']++;
        else if (age <= 40) ageCounts['31-40']++;
        else if (age <= 50) ageCounts['41-50']++;
        else ageCounts['51+']++;
      });
      
      const totalComplainants = complainants.length || 1;
      
      const colors = [
        '#1E40AF',
        '#3B82F6',
        '#93C5FD',
        '#BFDBFE',
        '#2563EB',
        '#DBEAFE',
        '#EFF6FF',
        '#F1F5F9',
      ];
      
      const raceData: DemographicData[] = Object.entries(raceCounts)
        .filter(([race, count]) => count > 0)
        .map(([race, count], index) => ({
          name: race,
          value: count,
          percentage: Math.round((count / totalComplainants) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value);
      
      const genderData: DemographicData[] = Object.entries(genderCounts)
        .filter(([gender, count]) => count > 0)
        .map(([gender, count], index) => ({
          name: gender,
          value: count,
          percentage: Math.round((count / totalComplainants) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value);
      
      const ageData: DemographicData[] = Object.entries(ageCounts)
        .filter(([age, count]) => age !== 'Unknown' && count > 0)
        .map(([age, count], index) => ({
          name: age,
          value: count,
          percentage: Math.round((count / totalComplainants) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => {
          const ageOrder = ['21-30', '31-40', '41-50', '51+'];
          return ageOrder.indexOf(a.name) - ageOrder.indexOf(b.name);
        });
      
      return {
        race: { name: 'Race', data: raceData },
        gender: { name: 'Gender', data: genderData },
        age: { name: 'Age', data: ageData },
        totalComplainants: totalComplainants
      };
    }
  });

  const { data: officerCivilianData, isLoading: isLoadingOfficerCivilian } = useQuery({
    queryKey: ['officer-civilian-allegations'],
    queryFn: async () => {
      const { data: allegations, error: allegationsError } = await supabase
        .from('Police_Data_Allegations')
        .select('*');

      if (allegationsError) throw new Error('Failed to fetch allegations');

      const { data: officerAllegations, error: officerAllegationsError } = await supabase
        .from('Police_Data_Officer_Allegation_Link')
        .select('allegation_id');

      if (officerAllegationsError) throw new Error('Failed to fetch officer allegations links');

      const officerAllegationIds = new Set(officerAllegations.map(link => link.allegation_id));
      
      let totalOfficerAllegations = 0;
      let officerSustained = 0;
      let officerUnsustained = 0;

      let totalCivilianAllegations = 0;
      let civilianSustained = 0;
      let civilianUnsustained = 0;

      let unknownAllegations = 0;

      allegations.forEach(allegation => {
        const isOfficerAllegation = allegation.allegation_id && officerAllegationIds.has(allegation.allegation_id);
        
        if (isOfficerAllegation) {
          totalOfficerAllegations++;
          
          const isSustained = allegation.finding?.toLowerCase().includes('sustained');
          if (isSustained) {
            officerSustained++;
          } else {
            officerUnsustained++;
          }
        } else if (allegation.allegation_id) {
          totalCivilianAllegations++;
          
          const isSustained = allegation.finding?.toLowerCase().includes('sustained');
          if (isSustained) {
            civilianSustained++;
          } else {
            civilianUnsustained++;
          }
        } else {
          unknownAllegations++;
        }
      });

      const officerAllegationsData: AllegationData[] = [
        { name: 'Unsustained', value: officerUnsustained, color: '#FFE2E0' },
        { name: 'Sustained', value: officerSustained, color: '#FF6B6B' }
      ];
      
      const civilianAllegationsData: AllegationData[] = [
        { name: 'Unsustained', value: civilianUnsustained, color: '#FFE2E0' },
        { name: 'Sustained', value: civilianSustained, color: '#FF6B6B' }
      ];
      
      const barChartData = [
        { 
          name: 'Unknown', 
          value: unknownAllegations, 
          color: '#E0E0E0',
          fill: '#E0E0E0'
        },
        { 
          name: 'Civilian Allegations', 
          value: totalCivilianAllegations, 
          color: '#F0F0F0',
          fill: '#F0F0F0'
        }
      ];

      return {
        officerAllegations: {
          data: officerAllegationsData,
          total: totalOfficerAllegations,
          sustained: officerSustained,
          unsustained: officerUnsustained
        },
        civilianAllegations: {
          data: civilianAllegationsData,
          total: totalCivilianAllegations,
          sustained: civilianSustained,
          unsustained: civilianUnsustained
        },
        barChart: barChartData,
        unknown: unknownAllegations
      };
    }
  });

  const { data: officers, isLoading: isLoadingOfficers } = useQuery({
    queryKey: ['officers-with-complaints'],
    queryFn: async () => {
      const { data: officersData, error: officersError } = await supabase
        .from('Police_Data_Officers')
        .select('*');

      if (officersError) throw new Error('Failed to fetch officers');

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

      return officersWithComplaints.sort((a, b) => b.complaint_count - a.complaint_count);
    }
  });

  const { data: complaints, isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['officer-complaints', selectedOfficer],
    queryFn: async () => {
      if (!selectedOfficer) return [];

      const { data: complaintLinks, error: linksError } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          officer_complaint_link_id,
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

      return complaintLinks.map(link => ({
        complaint_id: link.complaint.complaint_id,
        category: link.complaint.complaint_type || 'Unknown',
        crid: `${1000000 + link.complaint.complaint_id}`,
        incident_date: link.complaint.incident_date || 'Unknown date',
        officer_name: officers?.find(o => o.officer_id === selectedOfficer)?.first_name + ' ' + 
                    officers?.find(o => o.officer_id === selectedOfficer)?.last_name,
        attachments: 0,
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

  const calculatePercentage = () => {
    if (!outcomeData) return null;
    
    const unsustained = outcomeData.findings.find(item => item.name === 'Not Sustained');
    
    if (!unsustained) return null;
    
    const percentage = ((unsustained.value / outcomeData.totalAllegations) * 100).toFixed(2);
    return {
      percentage,
      finding: 'Not Sustained'
    };
  };

  const percentageInfo = calculatePercentage();

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const data = categoryData?.categories[index];
    if (!data) return null;
    
    const disciplineWidth = (data.disciplined / data.complaints) * width;
    
    return (
      <g>
        <rect x={0} y={y} width={disciplineWidth} height={height} fill="#002E5D" />
        <rect x={disciplineWidth} y={y} width={width - disciplineWidth} height={height} fill="#A4B8D1" />
      </g>
    );
  };

  const renderDemographicBar = (data: DemographicBarData) => {
    if (!data || !data.data || data.data.length === 0) return null;
    
    let cumulativePercentage = 0;
    const segmentsWithPosition = data.data.map(item => {
      const startPosition = cumulativePercentage;
      cumulativePercentage += item.percentage;
      return {
        ...item,
        startPosition,
        endPosition: cumulativePercentage
      };
    });
    
    return (
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-1">{data.name}</h3>
        
        <div className="relative h-6 bg-gray-200 rounded-sm overflow-hidden mb-1">
          {segmentsWithPosition.map((segment, index) => (
            <div
              key={index}
              className="absolute top-0 h-full"
              style={{
                left: `${segment.startPosition}%`,
                width: `${segment.percentage}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </div>
        
        <div className="relative h-6">
          {segmentsWithPosition.map((segment, index) => (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                left: `${segment.startPosition + (segment.percentage / 2)}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="text-sm font-bold">+</span>
              <div className="text-center">
                <div className="text-xs font-bold">{segment.percentage}%</div>
                <div className="text-xs">{segment.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['global-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return null;

      const { data: officers } = await supabase
        .from('Police_Data_Officers')
        .select('*')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%`)
        .limit(5);

      const { data: complaints } = await supabase
        .from('Police_Data_Complaints')
        .select('*')
        .or(`complaint_type.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .limit(5);

      const { data: complainants } = await supabase
        .from('Police_Data_Complainants')
        .select('*')
        .or(`race.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`)
        .limit(5);

      return {
        officers: officers?.map(officer => ({
          type: 'Officer',
          subtype: 'Name',
          value: `${officer.first_name} ${officer.last_name}`,
          id: officer.officer_id
        })) || [],
        officerRace: [...new Set(officers?.map(o => o.race))].filter(Boolean).map(race => ({
          type: 'Officer',
          subtype: 'Race',
          value: race,
        })),
        complainantRace: [...new Set(complainants?.map(c => c.race))].filter(Boolean).map(race => ({
          type: 'Complainant',
          subtype: 'Race',
          value: race,
        })),
        locations: [...new Set(complaints?.map(c => c.location))].filter(Boolean).map(location => ({
          type: 'Location',
          subtype: 'Area',
          value: location,
        })),
        incidents: complaints?.map(complaint => {
          const date = new Date(complaint.incident_date);
          return {
            type: 'Incident',
            subtype: 'Summary',
            value: `${complaint.complaint_type} (${date.toLocaleDateString()})`,
            id: complaint.complaint_id
          };
        }) || []
      };
    },
    enabled: searchQuery.length >= 2
  });

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Data Analysis Tool</h1>
          
          <div className="mb-8 relative">
            <div className="max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search by name, location, incident type..."
                className="w-full p-3 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {searchQuery.length >= 2 && (
                <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-portal-200 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-portal-500">
                      Searching...
                    </div>
                  ) : searchResults ? (
                    <div className="p-2">
                      {searchResults.officers.length > 0 && (
                        <div className="mb-3">
                          <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                            Officers
                          </div>
                          {searchResults.officers.map((result, idx) => (
                            <div 
                              key={`officer-${idx}`}
                              className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                              onClick={() => {
                                setSelectedOfficer(result.id);
                                setSearchQuery('');
                              }}
                            >
                              {result.value}
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.officerRace.length > 0 && (
                        <div className="mb-3">
                          <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                            Officer Race
                          </div>
                          {searchResults.officerRace.map((result, idx) => (
                            <div 
                              key={`race-${idx}`}
                              className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                            >
                              {result.value}
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.complainantRace.length > 0 && (
                        <div className="mb-3">
                          <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                            Complainant Race
                          </div>
                          {searchResults.complainantRace.map((result, idx) => (
                            <div 
                              key={`comp-race-${idx}`}
                              className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                            >
                              {result.value}
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.locations.length > 0 && (
                        <div className="mb-3">
                          <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                            Areas
                          </div>
                          {searchResults.locations.map((result, idx) => (
                            <div 
                              key={`location-${idx}`}
                              className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                            >
                              {result.value}
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.incidents.length > 0 && (
                        <div className="mb-3">
                          <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                            Incidents
                          </div>
                          {searchResults.incidents.map((result, idx) => (
                            <div 
                              key={`incident-${idx}`}
                              className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                            >
                              {result.value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-portal-500">
                      No results found for
