
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInYears } from 'date-fns';
import { useLawsuitData } from './useLawsuitData';

export const useOfficerDetails = (officerId: number) => {
  // Fetch officer basic info
  const { data: officer, isLoading: isLoadingOfficer } = useQuery({
    queryKey: ['officer', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officers')
        .select('*')
        .eq('officer_id', officerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Fetch officer rank history
  const { data: rankHistory } = useQuery({
    queryKey: ['officer-rank-history', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officer_Rank_History')
        .select('*')
        .eq('officer_id', officerId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Fetch complaints against the officer
  const { data: complaints } = useQuery({
    queryKey: ['officer-complaints', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Officer_Complaint_Link')
        .select(`
          *,
          complaint:Police_Data_Complaints (
            *,
            allegations:Police_Data_Allegations (*),
            investigation_outcomes:Police_Data_Investigation_Outcomes (*)
          )
        `)
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Fetch use of force incidents
  const { data: useOfForce } = useQuery({
    queryKey: ['officer-use-of-force', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Use_Of_Use')
        .select('*')
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Fetch awards
  const { data: awards } = useQuery({
    queryKey: ['officer-awards', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Awards')
        .select('*')
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Fetch lawsuits involving the officer
  const { data: officerLawsuits } = useQuery({
    queryKey: ['officer-lawsuits', officerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Police_Data_Lawsuit_Officer_Link')
        .select(`
          *,
          lawsuit:Police_Data_Lawsuits (*)
        `)
        .eq('officer_id', officerId);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(officerId)
  });

  // Calculate officer statistics for the stats cards
  const calculateStats = () => {
    if (!officer || !complaints || !useOfForce || !officerLawsuits) {
      return {
        totalAllegations: 0,
        totalComplaints: 0,
        sustainedAllegations: 0,
        totalUseOfForce: 0,
        totalLawsuits: 0,
        totalSettlements: 0
      };
    }

    // Count total complaints
    const totalComplaints = complaints.length;

    // Count total allegations
    const allegations = complaints.flatMap(link => 
      link.complaint?.allegations || []
    );
    const totalAllegations = allegations.length;

    // Count sustained allegations
    const sustainedAllegations = allegations.filter(
      allegation => allegation.finding?.toLowerCase() === 'sustained'
    ).length;

    // Count use of force incidents
    const totalUseOfForce = useOfForce.length;

    // Count lawsuits
    const totalLawsuits = officerLawsuits.length;

    // Sum up settlements
    const totalSettlements = officerLawsuits.reduce((sum, link) => {
      return sum + (link.lawsuit?.settlement_amount || a0);
    }, 0);

    return {
      totalAllegations,
      totalComplaints,
      sustainedAllegations,
      totalUseOfForce,
      totalLawsuits,
      totalSettlements
    };
  };

  // Calculate age from date_of_birth
  const calculateAge = () => {
    if (!officer?.date_of_birth) return null;

    try {
      // Handle different date formats
      const dob = new Date(officer.date_of_birth);
      return differenceInYears(new Date(), dob);
    } catch (e) {
      console.error("Error calculating age:", e);
      return null;
    }
  };

  const stats = calculateStats();
  const age = calculateAge();

  const isLoading = isLoadingOfficer;

  // Return everything needed by the component
  return {
    officer: officer ? { ...officer, age } : null,
    rankHistory,
    complaints,
    useOfForce,
    awards,
    lawsuits: officerLawsuits,
    isLoading,
    stats
  };
};
