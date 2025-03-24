
import React from 'react';
import { useSearchData, SearchResult } from '@/hooks/useSearchData';
import { useNavigate } from 'react-router-dom';

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
            {isSearching ? (
              <div className="p-4 text-center text-portal-500">
                Searching...
              </div>
            ) : searchResults ? (
              <div className="p-2">
                {searchResults.officers.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Officers
                    </div>
                    {searchResults.officers.map((result, idx) => (
                      <div 
                        key={`officer-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.incidents.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Incidents
                    </div>
                    {searchResults.incidents.map((result, idx) => (
                      <div 
                        key={`incident-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.documents && searchResults.documents.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Documents
                    </div>
                    {searchResults.documents.map((result, idx) => (
                      <div 
                        key={`document-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                        <span className="text-portal-400 text-xs ml-2">
                          {result.subtype}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.lawsuits && searchResults.lawsuits.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Lawsuits
                    </div>
                    {searchResults.lawsuits.map((result, idx) => (
                      <div 
                        key={`lawsuit-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                        <span className="text-portal-400 text-xs ml-2">
                          {result.subtype}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.officerRace.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Officer Race
                    </div>
                    {searchResults.officerRace.map((result, idx) => (
                      <div 
                        key={`race-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.complainantRace.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Complainant Race
                    </div>
                    {searchResults.complainantRace.map((result, idx) => (
                      <div 
                        key={`comp-race-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.locations.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Areas
                    </div>
                    {searchResults.locations.map((result, idx) => (
                      <div 
                        key={`location-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.findings && searchResults.findings.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Complaint Findings
                    </div>
                    {searchResults.findings.map((result, idx) => (
                      <div 
                        key={`finding-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.outcomes && searchResults.outcomes.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                      Complaint Outcomes
                    </div>
                    {searchResults.outcomes.map((result, idx) => (
                      <div 
                        key={`outcome-${idx}`}
                        className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-portal-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
