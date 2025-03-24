
import { useMemo } from 'react';

interface OfficerData {
  complaints: any[] | null;
  useOfForce: any[] | null;
  lawsuits: any[] | null;
}

export const useOfficerStats = ({ complaints, useOfForce, lawsuits }: OfficerData) => {
  const stats = useMemo(() => {
    if (!complaints || !useOfForce || !lawsuits) {
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
    const totalLawsuits = lawsuits.length;

    // Sum up settlements
    const totalSettlements = lawsuits.reduce((sum, link) => {
      return sum + (link.lawsuit?.settlement_amount || 0);
    }, 0);

    return {
      totalAllegations,
      totalComplaints,
      sustainedAllegations,
      totalUseOfForce,
      totalLawsuits,
      totalSettlements
    };
  }, [complaints, useOfForce, lawsuits]);

  return stats;
};
