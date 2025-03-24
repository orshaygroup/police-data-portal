
import React from 'react';
import { SearchResult } from '@/hooks/useSearchData';

interface SearchResultCategoryProps {
  title: string;
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

const SearchResultCategory = ({ title, results, onResultClick }: SearchResultCategoryProps) => {
  if (results.length === 0) return null;
  
  return (
    <div className="mb-3">
      <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
        {title}
      </div>
      {results.map((result, idx) => (
        <div 
          key={`${title.toLowerCase()}-${idx}`}
          className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
          onClick={() => onResultClick(result)}
        >
          {result.value}
          {result.subtype && (
            <span className="text-portal-400 text-xs ml-2">
              {result.subtype}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchResultCategory;
