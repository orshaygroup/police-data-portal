
import { useOfficerBasicInfo } from './useOfficerBasicInfo';
import { useOfficerRankHistory } from './useOfficerRankHistory';
import { useOfficerComplaints } from './useOfficerComplaints';
import { useOfficerUseOfForce } from './useOfficerUseOfForce';
import { useOfficerAwards } from './useOfficerAwards';
import { useOfficerLawsuits } from './useOfficerLawsuits';
import { useOfficerStats } from './useOfficerStats';

export const useOfficerDetails = (officerId: number) => {
  // Get officer basic info
  const { officer, isLoading } = useOfficerBasicInfo(officerId);
  
  // Get officer rank history
  const { rankHistory } = useOfficerRankHistory(officerId);
  
  // Get complaints against the officer
  const { complaints } = useOfficerComplaints(officerId);
  
  // Get use of force incidents
  const { useOfForce } = useOfficerUseOfForce(officerId);
  
  // Get awards
  const { awards } = useOfficerAwards(officerId);
  
  // Get lawsuits involving the officer
  const { lawsuits } = useOfficerLawsuits(officerId);
  
  // Calculate statistics
  const { stats } = useOfficerStats(complaints, useOfForce, lawsuits);

  // Return everything needed by the component
  return {
    officer,
    rankHistory,
    complaints,
    useOfForce,
    awards,
    lawsuits,
    isLoading,
    stats
  };
};
