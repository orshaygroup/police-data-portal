
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

  const getResultCount = (results: any[] | undefined) => {
    return results?.length || 0;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-portal-100">
      <Tabs defaultValue="officers" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="officers" className="data-[state=active]:bg-portal-800 data-[state=active]:text-white">
            Officers 
            <span className="ml-2 bg-portal-100 text-portal-800 px-2 py-0.5 rounded-full text-xs">
              {getResultCount(officerResults)}
            </span>
          </TabsTrigger>
          <TabsTrigger value="complaints" className="data-[state=active]:bg-portal-800 data-[state=active]:text-white">
            Complaints
            <span className="ml-2 bg-portal-100 text-portal-800 px-2 py-0.5 rounded-full text-xs">
              {getResultCount(complaintResults)}
            </span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-portal-800 data-[state=active]:text-white">
            Documents
            <span className="ml-2 bg-portal-100 text-portal-800 px-2 py-0.5 rounded-full text-xs">
              {getResultCount(documentResults)}
            </span>
          </TabsTrigger>
          <TabsTrigger value="lawsuits" className="data-[state=active]:bg-portal-800 data-[state=active]:text-white">
            Lawsuits
            <span className="ml-2 bg-portal-100 text-portal-800 px-2 py-0.5 rounded-full text-xs">
              {getResultCount(lawsuitResults)}
            </span>
          </TabsTrigger>
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
    </div>
  );
};

export default SearchTabs;
