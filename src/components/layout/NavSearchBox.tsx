
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchData } from '@/hooks/useSearchData';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';
import SearchResultCategory from '../search/SearchResultCategory';

const NavSearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading: isSearching } = useSearchData(searchQuery);
  const { navigateToResult } = useSearchNavigation();

  const handleSearchSelection = (result: any) => {
    navigateToResult(result, () => setSearchQuery(''));
  };

  return (
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
  );
};

export default NavSearchBox;
