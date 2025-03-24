import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { OfficerBasicInfo } from '@/components/officer/OfficerBasicInfo';
import { OfficerStatsCards } from '@/components/officer/OfficerStatsCards';
import { OfficerRankHistory } from '@/components/officer/OfficerRankHistory';
import { OfficerComplaints } from '@/components/officer/OfficerComplaints';
import { OfficerUseOfForce } from '@/components/officer/OfficerUseOfForce';
import { OfficerAwards } from '@/components/officer/OfficerAwards';
import { OfficerRadarChart } from '@/components/officer/OfficerRadarChart';
import { useOfficerDetails } from '@/hooks/useOfficerDetails';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const OfficerDetails = () => {
  const { id } = useParams();
  const officerId = parseInt(id || '0', 10);
  const { toast } = useToast();
  
  const { 
    officer, 
    rankHistory, 
    complaints, 
    useOfForce, 
    awards,
    lawsuits,
    isLoading,
    stats
  } = useOfficerDetails(officerId);

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

  if (!officerId) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="glass-panel rounded-2xl p-8">
            <h1 className="text-2xl text-portal-900">Invalid Officer ID</h1>
            <p className="text-portal-600 mt-2">Please return to the search page and select a valid officer.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-portal-900">Officer Details</h1>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Download size={16} />
              Download Data
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="order-2 lg:order-1">
              <OfficerRadarChart officer={officer} complaints={complaints} useOfForce={useOfForce} />
            </div>
            <div className="order-1 lg:order-2">
              <OfficerBasicInfo officer={officer} isLoading={isLoading} />
            </div>
          </div>
          
          <div className="mb-8">
            <OfficerStatsCards stats={stats} isLoading={isLoading} />
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-portal-900 mb-4">Additional Information</h2>
            <p className="text-portal-600">This section will be updated in a future prompt.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <OfficerRankHistory rankHistory={rankHistory} />
          </div>

          <div className="space-y-8">
            <OfficerComplaints complaints={complaints} />
            <OfficerUseOfForce incidents={useOfForce} />
            <OfficerAwards awards={awards} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfficerDetails;
