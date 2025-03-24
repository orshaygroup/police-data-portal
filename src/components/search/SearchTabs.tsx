
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OfficerSearchResults from './OfficerSearchResults';
import ComplaintSearchResults from './ComplaintSearchResults';
import DocumentSearchResults from './DocumentSearchResults';
import LawsuitSearchResults from './LawsuitSearchResults';
import { useFormattingUtils } from '@/hooks/useFormattingUtils';

interface SearchTabsProps {
  searchQuery: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  officerResults: any[] | undefined;
  complaintResults: any[] | undefined;
  documentResults: any[] | undefined;
  lawsuitResults: any[] | undefined;
  isLoadingOfficers: boolean;
  isLoadingComplaints: boolean;
  isLoadingDocuments: boolean;
  isLoadingLawsuits: boolean;
}

const SearchTabs = ({
  searchQuery,
  activeTab,
  setActiveTab,
  officerResults,
  complaintResults,
  documentResults,
  lawsuitResults,
  isLoadingOfficers,
  isLoadingComplaints,
  isLoadingDocuments,
  isLoadingLawsuits
}: SearchTabsProps) => {
  const { formatDate, formatCurrency } = useFormattingUtils();

  if (searchQuery.length < 3) {
    return null;
  }

  return (
    <Tabs defaultValue="officers" value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList>
        <TabsTrigger value="officers">Officers</TabsTrigger>
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="lawsuits">Lawsuits</TabsTrigger>
      </TabsList>

      <TabsContent value="officers" className="space-y-6 pt-4">
        <OfficerSearchResults 
          results={officerResults}
          isLoading={isLoadingOfficers}
        />
      </TabsContent>

      <TabsContent value="complaints" className="space-y-6 pt-4">
        <ComplaintSearchResults 
          results={complaintResults}
          isLoading={isLoadingComplaints}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6 pt-4">
        <DocumentSearchResults 
          results={documentResults}
          isLoading={isLoadingDocuments}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="lawsuits" className="space-y-6 pt-4">
        <LawsuitSearchResults 
          results={lawsuitResults}
          isLoading={isLoadingLawsuits}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SearchTabs;
