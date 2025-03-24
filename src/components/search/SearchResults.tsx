
import React from 'react';
import { SearchResult } from '@/hooks/useSearchData';
import SearchResultCategory from './SearchResultCategory';

interface SearchResultsData {
  officers: SearchResult[];
  incidents: SearchResult[];
  documents?: SearchResult[];
  lawsuits?: SearchResult[];
  officerRace: SearchResult[];
  complainantRace: SearchResult[];
  locations: SearchResult[];
  findings?: SearchResult[];
  outcomes?: SearchResult[];
}

interface SearchResultsProps {
  searchResults: SearchResultsData | null;
  isSearching: boolean;
  handleResultClick: (result: SearchResult) => void;
}

const SearchResults = ({ searchResults, isSearching, handleResultClick }: SearchResultsProps) => {
  if (isSearching) {
    return (
      <div className="p-4 text-center text-portal-500">
        Searching...
      </div>
    );
  }
  
  if (!searchResults) {
    return (
      <div className="p-4 text-center text-portal-500">
        No results found
      </div>
    );
  }

  return (
    <div className="p-2">
      <SearchResultCategory 
        title="Officers" 
        results={searchResults.officers} 
        onResultClick={handleResultClick} 
      />
      
      <SearchResultCategory 
        title="Incidents" 
        results={searchResults.incidents} 
        onResultClick={handleResultClick} 
      />
      
      {searchResults.documents && (
        <SearchResultCategory 
          title="Documents" 
          results={searchResults.documents} 
          onResultClick={handleResultClick} 
        />
      )}
      
      {searchResults.lawsuits && (
        <SearchResultCategory 
          title="Lawsuits" 
          results={searchResults.lawsuits} 
          onResultClick={handleResultClick} 
        />
      )}
      
      <SearchResultCategory 
        title="Officer Race" 
        results={searchResults.officerRace} 
        onResultClick={handleResultClick} 
      />
      
      <SearchResultCategory 
        title="Complainant Race" 
        results={searchResults.complainantRace} 
        onResultClick={handleResultClick} 
      />
      
      <SearchResultCategory 
        title="Areas" 
        results={searchResults.locations} 
        onResultClick={handleResultClick} 
      />
      
      {searchResults.findings && (
        <SearchResultCategory 
          title="Complaint Findings" 
          results={searchResults.findings} 
          onResultClick={handleResultClick} 
        />
      )}
      
      {searchResults.outcomes && (
        <SearchResultCategory 
          title="Complaint Outcomes" 
          results={searchResults.outcomes} 
          onResultClick={handleResultClick} 
        />
      )}
    </div>
  );
};

export default SearchResults;
