import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSearchData } from '@/hooks/useSearchData';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';
import SearchResultCategory from './search/SearchResultCategory';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading: isSearching } = useSearchData(searchQuery);
  const { navigateToResult } = useSearchNavigation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-portal-900 font-semibold' : 'text-portal-600 hover:text-portal-900';
  };

  const handleSearchSelection = (result: any) => {
    navigateToResult(result, () => setSearchQuery(''));
  };
  
  return (
    <div className="min-h-screen bg-portal-50">
      <nav className="glass-panel fixed top-0 w-full z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold text-portal-900 hover:text-portal-700 transition-colors">
            Police Data Portal
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/data" className={`transition-colors ${isActive('/data')}`}>
              Data Tool
            </Link>
            <Link to="/search" className={`transition-colors ${isActive('/search')}`}>
              Search
            </Link>
            <Link to="/documents" className={`transition-colors ${isActive('/documents')}`}>
              Documents
            </Link>
            <Link to="/lawsuits" className={`transition-colors ${isActive('/lawsuits')}`}>
              Lawsuits
            </Link>
            <Link to="/chat" className={`transition-colors ${isActive('/chat')}`}>
              AI Assistant
            </Link>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-portal-400" size={20} />
            <input 
              type="search"
              placeholder="Search officers, complaints, or documents..."
              className="pl-10 pr-4 py-2 rounded-full border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400 outline-none w-64 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchQuery.length >= 2 && (
              <div className="absolute w-72 right-0 mt-1 bg-white rounded-lg shadow-lg border border-portal-200 max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-portal-500">
                    Searching...
                  </div>
                ) : searchResults ? (
                  <div className="p-2">
                    {searchResults.officers.length > 0 && (
                      <SearchResultCategory 
                        title="Officers" 
                        results={searchResults.officers} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.incidents.length > 0 && (
                      <SearchResultCategory 
                        title="Incidents" 
                        results={searchResults.incidents} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.documents && searchResults.documents.length > 0 && (
                      <SearchResultCategory 
                        title="Documents" 
                        results={searchResults.documents} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.lawsuits && searchResults.lawsuits.length > 0 && (
                      <SearchResultCategory 
                        title="Lawsuits" 
                        results={searchResults.lawsuits} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.officerRace.length > 0 && (
                      <SearchResultCategory 
                        title="Officer Race" 
                        results={searchResults.officerRace} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.locations.length > 0 && (
                      <SearchResultCategory 
                        title="Areas" 
                        results={searchResults.locations} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.complainantRace.length > 0 && (
                      <SearchResultCategory 
                        title="Complainant Race" 
                        results={searchResults.complainantRace} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.findings && searchResults.findings.length > 0 && (
                      <SearchResultCategory 
                        title="Complaint Findings" 
                        results={searchResults.findings} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}

                    {searchResults.outcomes && searchResults.outcomes.length > 0 && (
                      <SearchResultCategory 
                        title="Complaint Outcomes" 
                        results={searchResults.outcomes} 
                        onResultClick={handleSearchSelection} 
                      />
                    )}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-portal-500">
                    No results found
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {children}
      </main>

      <footer className="bg-portal-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-portal-200 text-sm">
                Dedicated to transparency and accountability in law enforcement through comprehensive data analysis and reporting.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/data" className="text-portal-200 hover:text-white transition-colors text-sm">
                    Data Tool
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-portal-200 hover:text-white transition-colors text-sm">
                    Search Database
                  </Link>
                </li>
                <li>
                  <Link to="/lawsuits" className="text-portal-200 hover:text-white transition-colors text-sm">
                    Lawsuits Database
                  </Link>
                </li>
                <li>
                  <Link to="/documents" className="text-portal-200 hover:text-white transition-colors text-sm">
                    Document Repository
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-portal-200 text-sm">
                For inquiries and support, please email: <br />
                <a href="mailto:support@policedataportal.org" className="hover:text-white transition-colors">
                  support@policedataportal.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
