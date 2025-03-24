
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';
import SearchForm from '@/components/search/SearchForm';
import SearchTabs from '@/components/search/SearchTabs';
import { useSearchResults } from '@/hooks/useSearchResults';

const Search = () => {
  const { getSearchParams } = useSearchNavigation();
  const { searchTerm } = getSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchTerm || '');
  const [activeTab, setActiveTab] = useState('officers');
  
  // Initialize search query from URL parameters
  useEffect(() => {
    if (searchTerm) {
      setSearchQuery(searchTerm);
    }
  }, [searchTerm]);

  // Get search results using our custom hook
  const { 
    officerResults, 
    complaintResults, 
    documentResults, 
    lawsuitResults,
    isLoadingOfficers,
    isLoadingComplaints,
    isLoadingDocuments,
    isLoadingLawsuits
  } = useSearchResults(searchQuery, activeTab);

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
            <SearchTabs 
              searchQuery={searchQuery}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              officerResults={officerResults}
              complaintResults={complaintResults}
              documentResults={documentResults}
              lawsuitResults={lawsuitResults}
              isLoadingOfficers={isLoadingOfficers}
              isLoadingComplaints={isLoadingComplaints}
              isLoadingDocuments={isLoadingDocuments}
              isLoadingLawsuits={isLoadingLawsuits}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
