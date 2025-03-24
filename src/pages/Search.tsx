
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowRight, FileText, Scale } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchResult {
  officer_id: number;
  badge_number: number | null;
  first_name: string | null;
  last_name: string | null;
  current_rank: string | null;
  complaint_count: number;
  force_count: number;
  award_count: number;
}

interface ComplaintResult {
  complaint_id: number;
  complaint_type: string | null;
  incident_date: string | null;
  location: string | null;
  final_finding: string | null;
  final_outcome: string | null;
}

interface DocumentResult {
  document_id: number;
  doc_title: string;
  doc_type: string | null;
  created_at: string;
  description: string | null;
}

interface LawsuitResult {
  lawsuit_id: number;
  case_number: string | null;
  plaintiff_name: string | null;
  date_filed: string | null;
  settlement_amount: number | null;
  lawsuit_status: string | null;
  final_outcome: string | null;
}

interface LocationState {
  searchTerm?: string;
}

const Search = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('officers');
  
  // If we have a search term in the location state, use it
  useEffect(() => {
    if (state?.searchTerm) {
      setSearchQuery(state.searchTerm);
    }
  }, [state?.searchTerm]);

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

      // Get counts for each officer
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

  // New query for complaints
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

  // New query for documents
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

  // New query for lawsuits
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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount == null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Search Database</h1>
          
          <div className="max-w-2xl mb-8">
            <input
              type="search"
              placeholder="Search officers, complaints, documents, or lawsuits..."
              className="w-full p-4 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400 text-lg"
              value={searchQuery}
              onChange={handleSearch}
            />
            <p className="text-sm text-portal-500 mt-2">
              Enter at least 3 characters to search
            </p>
          </div>

          {searchQuery.length >= 3 && (
            <Tabs defaultValue="officers" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="officers">Officers</TabsTrigger>
                <TabsTrigger value="complaints">Complaints</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="lawsuits">Lawsuits</TabsTrigger>
              </TabsList>

              <TabsContent value="officers" className="space-y-6 pt-4">
                {isLoadingOfficers ? (
                  // Loading skeletons
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))
                ) : officerResults?.length === 0 ? (
                  <div className="text-center py-8 text-portal-500">
                    No officers found matching your search
                  </div>
                ) : (
                  officerResults?.map((officer) => (
                    <Link
                      key={officer.officer_id}
                      to={`/officers/${officer.officer_id}`}
                      className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-portal-900 mb-2">
                            {officer.first_name} {officer.last_name}
                          </h3>
                          <p className="text-portal-600 mb-4">
                            Badge #{officer.badge_number} • {officer.current_rank || 'Unknown Rank'}
                          </p>
                          <div className="flex gap-4 text-sm text-portal-500">
                            <span>{officer.complaint_count} Complaints</span>
                            <span>{officer.force_count} Use of Force Reports</span>
                            <span>{officer.award_count} Commendations</span>
                          </div>
                        </div>
                        <ArrowRight className="text-portal-400" size={24} />
                      </div>
                    </Link>
                  ))
                )}
              </TabsContent>

              <TabsContent value="complaints" className="space-y-6 pt-4">
                {isLoadingComplaints ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))
                ) : complaintResults?.length === 0 ? (
                  <div className="text-center py-8 text-portal-500">
                    No complaints found matching your search
                  </div>
                ) : (
                  complaintResults?.map((complaint) => (
                    <Link
                      key={complaint.complaint_id}
                      to={`/complaints/${complaint.complaint_id}`}
                      className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-portal-900 mb-2">
                            {complaint.complaint_type || 'Unknown Complaint Type'}
                          </h3>
                          <p className="text-portal-600 mb-4">
                            Incident Date: {formatDate(complaint.incident_date)} • Location: {complaint.location || 'Unknown'}
                          </p>
                          <div className="flex gap-4 text-sm text-portal-500">
                            <span>Finding: {complaint.final_finding || 'Pending'}</span>
                            <span>Outcome: {complaint.final_outcome || 'Pending'}</span>
                          </div>
                        </div>
                        <ArrowRight className="text-portal-400" size={24} />
                      </div>
                    </Link>
                  ))
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 pt-4">
                {isLoadingDocuments ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))
                ) : documentResults?.length === 0 ? (
                  <div className="text-center py-8 text-portal-500">
                    No documents found matching your search
                  </div>
                ) : (
                  documentResults?.map((document) => (
                    <Link
                      key={document.document_id}
                      to={`/documents?id=${document.document_id}`}
                      className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-portal-400 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold text-portal-900 mb-2">
                              {document.doc_title}
                            </h3>
                            <p className="text-portal-600 mb-2">
                              Type: {document.doc_type || 'Unknown'} • Created: {formatDate(document.created_at)}
                            </p>
                            {document.description && (
                              <p className="text-sm text-portal-500 line-clamp-2">
                                {document.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="text-portal-400" size={24} />
                      </div>
                    </Link>
                  ))
                )}
              </TabsContent>

              <TabsContent value="lawsuits" className="space-y-6 pt-4">
                {isLoadingLawsuits ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))
                ) : lawsuitResults?.length === 0 ? (
                  <div className="text-center py-8 text-portal-500">
                    No lawsuits found matching your search
                  </div>
                ) : (
                  lawsuitResults?.map((lawsuit) => (
                    <Link
                      key={lawsuit.lawsuit_id}
                      to={`/lawsuits?id=${lawsuit.lawsuit_id}`}
                      className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Scale className="h-5 w-5 text-portal-400 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold text-portal-900 mb-2">
                              {lawsuit.plaintiff_name || 'Unknown Plaintiff'} 
                              <span className="text-portal-600 text-base ml-2">
                                (Case #{lawsuit.case_number || 'Unknown'})
                              </span>
                            </h3>
                            <p className="text-portal-600 mb-2">
                              Filed: {formatDate(lawsuit.date_filed)} • Status: {lawsuit.lawsuit_status || 'Unknown'}
                            </p>
                            <div className="flex gap-4 text-sm text-portal-500">
                              <span>Settlement: {formatCurrency(lawsuit.settlement_amount)}</span>
                              <span>Outcome: {lawsuit.final_outcome || 'Pending'}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="text-portal-400" size={24} />
                      </div>
                    </Link>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
