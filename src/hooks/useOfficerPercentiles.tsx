
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PercentileData {
  officer_id: number;
  officer_allegations_percentile: number;
  civilian_allegations_percentile: number;
  use_of_force_percentile: number;
  awards_percentile: number;
  service_years_percentile: number;
}

export const useOfficerPercentiles = (officerId: number) => {
  // Fetch all officers for percentile calculations
  const { data: percentileData, isLoading } = useQuery({
    queryKey: ['officer-percentiles', officerId],
    queryFn: async () => {
      try {
        // Get officer data for comparison
        const allOfficersData = await fetchAllOfficersWithCounts();
        
        if (!allOfficersData.length || !officerId) {
          return null;
        }
        
        // Find current officer in the data
        const currentOfficer = allOfficersData.find(o => o.officer_id === officerId);
        if (!currentOfficer) {
          return null;
        }
        
        // Calculate percentiles
        const percentiles = calculatePercentiles(currentOfficer, allOfficersData);
        return percentiles;
      } catch (error) {
        console.error("Error calculating percentiles:", error);
        return null;
      }
    },
    enabled: Boolean(officerId)
  });

  return {
    percentileData,
    isLoading
  };
};

// Fetch all officers with counts
const fetchAllOfficersWithCounts = async () => {
  // Fetch all officers
  const { data: officersData, error: officersError } = await supabase
    .from('Police_Data_Officers')
    .select('*');

  if (officersError) {
    console.error("Error fetching officers:", officersError);
    return [];
  }

  // Get all allegation links to calculate officer allegations
  const { data: officerAllegationLinks, error: linkError } = await supabase
    .from('Police_Data_Officer_Allegation_Link')
    .select('officer_id, allegation_id');

  if (linkError) {
    console.error("Error fetching officer allegations:", linkError);
    return [];
  }

  // Group allegations by officer
  const officerAllegationCounts = officerAllegationLinks.reduce((acc, link) => {
    acc[link.officer_id] = (acc[link.officer_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Get all allegations to calculate civilian allegations
  const { data: allegations, error: allegationError } = await supabase
    .from('Police_Data_Allegations')
    .select('allegation_id');

  if (allegationError) {
    console.error("Error fetching allegations:", allegationError);
    return [];
  }

  // Identify civilian allegations (those not linked to officers)
  const officerAllegationIds = new Set(
    officerAllegationLinks.map(link => link.allegation_id)
  );
  
  // Get use of force data
  const { data: useOfForceData, error: useOfForceError } = await supabase
    .from('Police_Data_Use_Of_Use')
    .select('officer_id');

  if (useOfForceError) {
    console.error("Error fetching use of force data:", useOfForceError);
    return [];
  }

  // Count use of force by officer
  const useOfForceCounts = useOfForceData.reduce((acc, record) => {
    if (record.officer_id) {
      acc[record.officer_id] = (acc[record.officer_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  // Get awards data
  const { data: awardsData, error: awardsError } = await supabase
    .from('Police_Data_Awards')
    .select('officer_id');

  if (awardsError) {
    console.error("Error fetching awards data:", awardsError);
    return [];
  }
  
  // Count awards by officer
  const awardsCounts = awardsData.reduce((acc, record) => {
    if (record.officer_id) {
      acc[record.officer_id] = (acc[record.officer_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  // Calculate years of service for each officer
  const currentYear = new Date().getFullYear();
  const yearOfServiceData = officersData.reduce((acc, officer) => {
    if (officer.date_appointed) {
      const appointedYear = new Date(officer.date_appointed).getFullYear();
      if (!isNaN(appointedYear)) {
        acc[officer.officer_id] = currentYear - appointedYear;
      }
    }
    return acc;
  }, {} as Record<number, number>);

  // Combine all data for each officer
  return officersData.map(officer => ({
    officer_id: officer.officer_id,
    badge_number: officer.badge_number,
    name: `${officer.first_name || ''} ${officer.last_name || ''}`.trim(),
    officer_allegations: officerAllegationCounts[officer.officer_id] || 0,
    civilian_allegations: 0, // Will be calculated after we know which allegations are civilian
    use_of_force: useOfForceCounts[officer.officer_id] || 0,
    awards: awardsCounts[officer.officer_id] || 0,
    service_years: yearOfServiceData[officer.officer_id] || 0
  }));
};

// Calculate percentiles compared to other officers
const calculatePercentiles = (currentOfficer: any, allOfficers: any[]) => {
  // Helper function to calculate percentile
  const getPercentile = (value: number, allValues: number[]) => {
    // Avoid division by zero if all values are the same
    if (new Set(allValues).size === 1) return 50;

    const sortedValues = [...allValues].sort((a, b) => a - b);
    const position = sortedValues.indexOf(value);
    
    // For allegations and use of force, higher percentile means MORE incidents
    // This is counterintuitive but matches how these metrics would be viewed
    return Math.round((position / (sortedValues.length - 1)) * 100);
  };

  const allOfficerAllegations = allOfficers.map(o => o.officer_allegations);
  const allCivilianAllegations = allOfficers.map(o => o.civilian_allegations);
  const allUseOfForce = allOfficers.map(o => o.use_of_force);
  
  // For positive metrics, higher values should show higher percentile
  const allAwards = allOfficers.map(o => o.awards);
  const allServiceYears = allOfficers.map(o => o.service_years);

  return {
    officer_id: currentOfficer.officer_id,
    officer_allegations_percentile: getPercentile(currentOfficer.officer_allegations, allOfficerAllegations),
    civilian_allegations_percentile: getPercentile(currentOfficer.civilian_allegations, allCivilianAllegations),
    use_of_force_percentile: getPercentile(currentOfficer.use_of_force, allUseOfForce),
    awards_percentile: Math.max(100 - getPercentile(currentOfficer.awards, allAwards), 0), // Invert for positive metric
    service_years_percentile: Math.max(100 - getPercentile(currentOfficer.service_years, allServiceYears), 0) // Invert for positive metric
  };
};
