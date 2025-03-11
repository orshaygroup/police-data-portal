
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DemographicData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DemographicBarData {
  name: string;
  data: DemographicData[];
}

export const useAccusedDemographics = () => {
  return useQuery({
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
};

export const useComplainantDemographics = () => {
  return useQuery({
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
};
