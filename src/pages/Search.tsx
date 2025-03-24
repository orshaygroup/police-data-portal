
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';
import SearchForm from '@/components/search/SearchForm';
import SearchTabs from '@/components/search/SearchTabs';
import { useSearchResults } from '@/hooks/useSearchResults';
import { Info } from 'lucide-react';

const Search = () => {
  const { getSearchParams } = useSearchNavigation();
  const { searchTerm } = getSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchTerm || '');
  const [activeTab, setActiveTab] = useState('officers');
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Initialize search query from URL parameters
  useEffect(() => {
    if (searchTerm) {
      setSearchQuery(searchTerm);
      setShowInstructions(false);
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
    if (e.target.value.length >= 3) {
      setShowInstructions(false);
    } else if (e.target.value.length === 0) {
      setShowInstructions(true);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-portal-50 to-white">
        <div className="container mx-auto px-6 py-12">
          <div className="glass-panel rounded-2xl p-8 shadow-lg border border-portal-100">
            <h1 className="text-4xl font-bold text-portal-900 mb-2 slide-up">Search Database</h1>
            <p className="text-portal-600 mb-8 max-w-3xl slide-up">
              Access comprehensive data on police conduct, complaints, disciplinary actions, and related documents.
            </p>
            
            <SearchForm 
              searchQuery={searchQuery}
              handleSearch={handleSearch}
            />

            {showInstructions && (
              <div className="bg-portal-50 rounded-xl p-6 mb-8 border-l-4 border-portal-400 animate-fade-in">
                <div className="flex items-start">
                  <Info className="text-portal-500 mt-1 flex-shrink-0 mr-3" size={22} />
                  <div>
                    <h3 className="font-semibold text-lg text-portal-800 mb-2">Search Instructions</h3>
                    <p className="text-portal-600 mb-3">
                      Enter at least 3 characters to begin searching. Our database includes:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-portal-700">
                      <li className="flex items-center">
                        <span className="bg-portal-200 text-portal-700 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
                        <span><strong>Officers</strong> — Search by name, badge number, or rank</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-portal-200 text-portal-700 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
                        <span><strong>Complaints</strong> — Search by type, location, or outcome</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-portal-200 text-portal-700 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">3</span>
                        <span><strong>Documents</strong> — Search by title, type, or description</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-portal-200 text-portal-700 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">4</span>
                        <span><strong>Lawsuits</strong> — Search by plaintiff name or case number</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <p className="text-portal-600 mr-2">Example searches:</p>
                      <button 
                        onClick={() => setSearchQuery("Johnson")} 
                        className="px-3 py-1 bg-portal-100 hover:bg-portal-200 text-portal-700 rounded-full text-sm transition-colors"
                      >
                        Johnson
                      </button>
                      <button 
                        onClick={() => setSearchQuery("excessive force")} 
                        className="px-3 py-1 bg-portal-100 hover:bg-portal-200 text-portal-700 rounded-full text-sm transition-colors"
                      >
                        excessive force
                      </button>
                      <button 
                        onClick={() => setSearchQuery("New Orleans")} 
                        className="px-3 py-1 bg-portal-100 hover:bg-portal-200 text-portal-700 rounded-full text-sm transition-colors"
                      >
                        New Orleans
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {searchQuery.length >= 3 && (
              <div className="animate-fade-in">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
