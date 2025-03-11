
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OutcomeData {
  name: string;
  value: number;
  color: string;
}

export interface CategoryData {
  name: string;
  complaints: number;
  disciplined: number;
  disciplinePercentage: string;
  color: string;
}

export interface AllegationData {
  name: string;
  value: number;
  color: string;
}

export const useOutcomeData = () => {
  return useQuery({
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
};

export const useCategoryData = () => {
  return useQuery({
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
};

export const useOfficerCivilianData = () => {
  return useQuery({
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
};
