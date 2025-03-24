
import { useOfficerBasicInfo } from './officer/useOfficerBasicInfo';
import { useOfficerRankHistory } from './officer/useOfficerRankHistory';
import { useOfficerComplaints } from './officer/useOfficerComplaints';
import { useOfficerUseOfForce } from './officer/useOfficerUseOfForce';
import { useOfficerAwards } from './officer/useOfficerAwards';
import { useOfficerLawsuits } from './officer/useOfficerLawsuits';
import { useOfficerStats } from './officer/useOfficerStats';

export const useOfficerDetails = (officerId: number) => {
  // Fetch officer basic info
  const { officer, isLoading } = useOfficerBasicInfo(officerId);

  // Fetch officer rank history
  const rankHistory = useOfficerRankHistory(officerId);

  // Fetch complaints against the officer
  const complaints = useOfficerComplaints(officerId);

  // Fetch use of force incidents
  const useOfForce = useOfficerUseOfForce(officerId);

  // Fetch awards
  const awards = useOfficerAwards(officerId);

  // Fetch lawsuits involving the officer
  const lawsuits = useOfficerLawsuits(officerId);

  // Calculate officer statistics
  const stats = useOfficerStats({ complaints, useOfForce, lawsuits });

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
