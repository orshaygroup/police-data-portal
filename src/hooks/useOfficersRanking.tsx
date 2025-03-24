
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PercentileData {
  officer_id: number;
  officer_allegations_percentile: number;
  civilian_allegations_percentile: number;
  use_of_force_percentile: number;
  awards_percentile: number;
  service_years_percentile: number;
}

export interface RankedOfficer {
  officer_id: number;
  first_name: string | null;
  last_name: string | null;
  badge_number: number | null;
  current_rank: string | null;
  composite_score: number;
  percentiles: PercentileData;
}

export const useOfficersRanking = () => {
  return useQuery({
    queryKey: ['officers-ranking'],
    queryFn: async (): Promise<RankedOfficer[]> => {
      try {
        // Fetch all officers from the database
        const { data: officers, error: officersError } = await supabase
          .from('Police_Data_Officers')
          .select('*');

        if (officersError) throw officersError;

        // Calculate percentiles for all officers
        const officersWithPercentiles = await calculateAllOfficersPercentiles(officers);
        
        // Sort officers by composite score (higher score = higher ranking)
        return officersWithPercentiles.sort((a, b) => b.composite_score - a.composite_score);
      } catch (error) {
        console.error("Error fetching officers ranking:", error);
        return [];
      }
    }
  });
};

// Helper function to calculate percentiles for all officers
async function calculateAllOfficersPercentiles(officers: any[]): Promise<RankedOfficer[]> {
  try {
    // Fetch all data needed for percentile calculations
    const [
      officerAllegationLinks,
      allegations,
      useOfForceData,
      awardsData
    ] = await Promise.all([
      fetchOfficerAllegationLinks(),
      fetchAllegations(),
      fetchUseOfForceData(),
      fetchAwardsData()
    ]);

    // Count allegations by officer
    const officerAllegationCounts = officerAllegationLinks.reduce((acc, link) => {
      acc[link.officer_id] = (acc[link.officer_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Identify civilian allegations
    const officerAllegationIds = new Set(
      officerAllegationLinks.map(link => link.allegation_id)
    );
    
    // Count use of force by officer
    const useOfForceCounts = useOfForceData.reduce((acc, record) => {
      if (record.officer_id) {
        acc[record.officer_id] = (acc[record.officer_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Count awards by officer
    const awardsCounts = awardsData.reduce((acc, record) => {
      if (record.officer_id) {
        acc[record.officer_id] = (acc[record.officer_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Calculate years of service for each officer
    const currentYear = new Date().getFullYear();
    const yearOfServiceData = officers.reduce((acc, officer) => {
      if (officer.date_appointed) {
        const appointedYear = new Date(officer.date_appointed).getFullYear();
        if (!isNaN(appointedYear)) {
          acc[officer.officer_id] = currentYear - appointedYear;
        }
      }
      return acc;
    }, {} as Record<number, number>);

    // Collect all values for percentile calculations
    const allOfficerAllegations = Object.values(officerAllegationCounts);
    const allUseOfForce = Object.values(useOfForceCounts);
    const allAwards = Object.values(awardsCounts);
    const allServiceYears = Object.values(yearOfServiceData);

    // Calculate percentiles for each officer
    return officers.map(officer => {
      const officerAllegations = officerAllegationCounts[officer.officer_id] || 0;
      const useOfForce = useOfForceCounts[officer.officer_id] || 0;
      const awards = awardsCounts[officer.officer_id] || 0;
      const serviceYears = yearOfServiceData[officer.officer_id] || 0;

      const percentiles = {
        officer_id: officer.officer_id,
        officer_allegations_percentile: calculatePercentile(officerAllegations, allOfficerAllegations as number[]),
        civilian_allegations_percentile: 0, // Not calculated as we don't have reliable data
        use_of_force_percentile: calculatePercentile(useOfForce, allUseOfForce as number[]),
        awards_percentile: Math.max(100 - calculatePercentile(awards, allAwards as number[]), 0),
        service_years_percentile: Math.max(100 - calculatePercentile(serviceYears, allServiceYears as number[]), 0)
      };

      // Calculate a composite score for ranking
      // Higher percentile in allegations and use of force means more incidents (worse)
      // Higher percentile in awards and service years means fewer awards/shorter service (also worse)
      // So a higher composite score represents a "worse" officer
      const composite_score = (
        percentiles.officer_allegations_percentile * 0.4 +
        percentiles.use_of_force_percentile * 0.4 +
        percentiles.awards_percentile * 0.1 + 
        percentiles.service_years_percentile * 0.1
      );

      return {
        officer_id: officer.officer_id,
        first_name: officer.first_name,
        last_name: officer.last_name,
        badge_number: officer.badge_number,
        current_rank: officer.current_rank,
        composite_score,
        percentiles
      };
    });
  } catch (error) {
    console.error("Error calculating officer percentiles:", error);
    return [];
  }
}

// Helper function to calculate percentile
function calculatePercentile(value: number, allValues: number[]): number {
  // Avoid division by zero if all values are the same
  if (new Set(allValues).size === 1) return 50;

  const sortedValues = [...allValues].sort((a, b) => a - b);
  const position = sortedValues.indexOf(value);
  
  return Math.round((position / (sortedValues.length - 1)) * 100);
}

// Helper functions to fetch data from Supabase
async function fetchOfficerAllegationLinks() {
  const { data, error } = await supabase
    .from('Police_Data_Officer_Allegation_Link')
    .select('officer_id, allegation_id');

  if (error) throw error;
  return data || [];
}

async function fetchAllegations() {
  const { data, error } = await supabase
    .from('Police_Data_Allegations')
    .select('allegation_id');

  if (error) throw error;
  return data || [];
}

async function fetchUseOfForceData() {
  const { data, error } = await supabase
    .from('Police_Data_Use_Of_Use')
    .select('officer_id');

  if (error) throw error;
  return data || [];
}

async function fetchAwardsData() {
  const { data, error } = await supabase
    .from('Police_Data_Awards')
    .select('officer_id');

  if (error) throw error;
  return data || [];
}
