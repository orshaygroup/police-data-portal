import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";
import { useSearchNavigation } from '@/hooks/useSearchNavigation';
import SearchForm from '@/components/search/SearchForm';
import OfficerSearchResults from '@/components/search/OfficerSearchResults';
import ComplaintSearchResults from '@/components/search/ComplaintSearchResults';
import DocumentSearchResults from '@/components/search/DocumentSearchResults';
import LawsuitSearchResults from '@/components/search/LawsuitSearchResults';
import { useFormattingUtils } from '@/hooks/useFormattingUtils';

const Search = () => {
  const { getSearchParams } = useSearchNavigation();
  const { searchTerm } = getSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchTerm || '');
  const [activeTab, setActiveTab] = useState('officers');
  const { formatDate, formatCurrency } = useFormattingUtils();
  
  useEffect(() => {
    if (searchTerm) {
      setSearchQuery(searchTerm);
    }
  }, [searchTerm]);

  const { data: officerResults, isLoading: isLoadingOfficers } = useQuery({
    queryKey: ['officers', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data: officers, error } = await supabase
        .from('Police_Data_Officers')
        .select(`
          officer_id,
          badge_number,
          first_name,
          last_name,
          current_rank
        `)
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%,current_rank.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      const officersWithCounts = await Promise.all(
        (officers || []).map(async (officer) => {
          const [complaints, useOfForce, awards] = await Promise.all([
            supabase
              .from('Police_Data_Complaints')
              .select('complaint_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id),
            supabase
              .from('Police_Data_Use_Of_Use')
              .select('use_of_force_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id),
            supabase
              .from('Police_Data_Awards')
              .select('award_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id)
          ]);

          return {
            ...officer,
            complaint_count: complaints.count || 0,
            force_count: useOfForce.count || 0,
            award_count: awards.count || 0
          };
        })
      );

      return officersWithCounts;
    },
    enabled: searchQuery.length >= 3
  });

  const { data: complaintResults, isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['complaints', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from('Police_Data_Complaints')
        .select(`
          complaint_id,
          complaint_type,
          incident_date,
          location,
          final_finding,
          final_outcome
        `)
        .or(`complaint_type.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,final_finding.ilike.%${searchQuery}%,final_outcome.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3 && activeTab === 'complaints'
  });

  const { data: documentResults, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['documents', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from('Police_Data_Documents')
        .select(`
          document_id,
          doc_title,
          doc_type,
          created_at,
          description
        `)
        .or(`doc_title.ilike.%${searchQuery}%,doc_type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3 && activeTab === 'documents'
  });

  const { data: lawsuitResults, isLoading: isLoadingLawsuits } = useQuery({
    queryKey: ['lawsuits', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from('Police_Data_Lawsuits')
        .select(`
          lawsuit_id,
          case_number,
          plaintiff_name,
          date_filed,
          settlement_amount,
          lawsuit_status,
          final_outcome
        `)
        .or(`plaintiff_name.ilike.%${searchQuery}%,case_number.ilike.%${searchQuery}%,lawsuit_status.ilike.%${searchQuery}%,Summary.ilike.%${searchQuery}%,final_outcome.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 3 && activeTab === 'lawsuits'
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Search Database</h1>
          
          <SearchForm 
            searchQuery={searchQuery}
            handleSearch={handleSearch}
          />

          {searchQuery.length >= 3 && (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
