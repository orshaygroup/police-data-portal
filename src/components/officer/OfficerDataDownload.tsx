
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

interface OfficerDataDownloadProps {
  officer: any;
  rankHistory: any[] | null;
  complaints: any[] | null;
  useOfForce: any[] | null;
  awards: any[] | null;
  lawsuits: any[] | null;
  stats: {
    totalComplaints: number;
    totalAllegations: number;
    sustainedAllegations: number;
    totalUseOfForce: number;
    totalLawsuits: number;
    totalSettlements: number;
  };
  isLoading: boolean;
}

export const OfficerDataDownload: React.FC<OfficerDataDownloadProps> = ({
  officer,
  rankHistory,
  complaints,
  useOfForce,
  awards,
  lawsuits,
  stats,
  isLoading
}) => {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!officer) {
      toast({
        title: "Error",
        description: "No officer data available to download",
        variant: "destructive"
      });
      return;
    }

    try {
      const workbook = XLSX.utils.book_new();
      
      const basicInfoData = [{
        'Officer ID': officer.officer_id,
        'Badge Number': officer.badge_number,
        'Name': `${officer.first_name || ''} ${officer.last_name || ''}`.trim(),
        'Gender': officer.gender,
        'Race': officer.race,
        'Date of Birth': officer.date_of_birth,
        'Age': officer.age,
        'Date Appointed': officer.date_appointed,
        'Current Rank': officer.current_rank,
        'Status': officer.active_status,
        'Salary': officer.Salary
      }];
      
      const basicInfoWS = XLSX.utils.json_to_sheet(basicInfoData);
      XLSX.utils.book_append_sheet(workbook, basicInfoWS, "Basic Info");
      
      const statsData = [{
        'Total Complaints': stats.totalComplaints,
        'Total Allegations': stats.totalAllegations,
        'Sustained Allegations': stats.sustainedAllegations,
        'Total Use of Force': stats.totalUseOfForce,
        'Total Lawsuits': stats.totalLawsuits,
        'Total Settlements': stats.totalSettlements
      }];
      
      const statsWS = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsWS, "Statistics");
      
      if (rankHistory && rankHistory.length > 0) {
        const rankHistoryData = rankHistory.map(rank => ({
          'Rank': rank.rank_name,
          'Start Date': rank.start_date,
          'End Date': rank.end_date || 'Present'
        }));
        
        const rankHistoryWS = XLSX.utils.json_to_sheet(rankHistoryData);
        XLSX.utils.book_append_sheet(workbook, rankHistoryWS, "Rank History");
      }
      
      if (complaints && complaints.length > 0) {
        const complaintsData = complaints.map(item => ({
          'Complaint ID': item.complaint?.complaint_id,
          'Role': item.role_in_incident,
          'Type': item.complaint?.complaint_type,
          'Incident Date': item.complaint?.incident_date,
          'Finding': item.complaint?.final_finding,
          'Outcome': item.complaint?.final_outcome
        }));
        
        const complaintsWS = XLSX.utils.json_to_sheet(complaintsData);
        XLSX.utils.book_append_sheet(workbook, complaintsWS, "Complaints");
      }
      
      if (useOfForce && useOfForce.length > 0) {
        const useOfForceData = useOfForce.map(incident => ({
          'Incident ID': incident.use_of_force_id,
          'Force Type': incident.force_type,
          'Incident Date': incident.incident_date,
          'Subject Injured': incident.subject_injured ? 'Yes' : 'No',
          'Subject Fatality': incident.subject_fatality ? 'Yes' : 'No',
          'Description': incident.description
        }));
        
        const useOfForceWS = XLSX.utils.json_to_sheet(useOfForceData);
        XLSX.utils.book_append_sheet(workbook, useOfForceWS, "Use of Force");
      }
      
      if (awards && awards.length > 0) {
        const awardsData = awards.map(award => ({
          'Award ID': award.award_id,
          'Award Type': award.award_type,
          'Award Date': award.award_date,
          'Description': award.description
        }));
        
        const awardsWS = XLSX.utils.json_to_sheet(awardsData);
        XLSX.utils.book_append_sheet(workbook, awardsWS, "Awards");
      }
      
      if (lawsuits && lawsuits.length > 0) {
        const lawsuitsData = lawsuits.map(link => ({
          'Lawsuit ID': link.lawsuit?.lawsuit_id,
          'Case Number': link.lawsuit?.case_number,
          'Plaintiff': link.lawsuit?.plaintiff_name,
          'Date Filed': link.lawsuit?.date_filed,
          'Date Closed': link.lawsuit?.date_closed,
          'Settlement Amount': link.lawsuit?.settlement_amount,
          'Allegation': link.allegation_in_lawsuit,
          'Status': link.lawsuit?.lawsuit_status,
          'Outcome': link.lawsuit?.final_outcome
        }));
        
        const lawsuitsWS = XLSX.utils.json_to_sheet(lawsuitsData);
        XLSX.utils.book_append_sheet(workbook, lawsuitsWS, "Lawsuits");
      }
      
      XLSX.writeFile(workbook, `Officer_${officer.officer_id}_${officer.last_name || 'Unknown'}.xlsx`);
      
      toast({
        title: "Download Successful",
        description: "Officer data has been downloaded as an Excel file."
      });
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the Excel file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      variant="outline" 
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      <Download size={16} />
      Download Data
    </Button>
  );
};
