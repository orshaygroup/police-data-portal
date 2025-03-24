
import React from 'react';
import { useSearchData, SearchResult } from '@/hooks/useSearchData';
import { useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedOfficer: (officerId: number | null) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery, setSelectedOfficer }: SearchBarProps) => {
  const { data: searchResults, isLoading: isSearching } = useSearchData(searchQuery);
  const navigate = useNavigate();

  const handleResultClick = (result: SearchResult) => {
    if (!result.id) {
      navigate('/search', { state: { searchTerm: result.value } });
      setSearchQuery('');
      return;
    }

    // Navigate based on result type
    switch (result.type) {
      case 'Officer':
        setSelectedOfficer(result.id);
        setSearchQuery('');
        break;
      case 'Incident':
        navigate(`/complaints/${result.id}`);
        setSearchQuery('');
        break;
      case 'Document':
        navigate(`/documents?id=${result.id}`);
        setSearchQuery('');
        break;
      case 'Lawsuit':
        navigate(`/lawsuits?id=${result.id}`);
        setSearchQuery('');
        break;
      default:
        navigate('/search', { state: { searchTerm: result.value } });
        setSearchQuery('');
    }
  };

  return (
    <div className="mb-8 relative">
      <div className="max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search by name, location, incident type..."
          className="w-full p-3 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {searchQuery.length >= 2 && (
          <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-portal-200 max-h-96 overflow-y-auto z-50">
            <SearchResults 
              searchResults={searchResults}
              isSearching={isSearching}
              handleResultClick={handleResultClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
