
import React from 'react';

interface SearchFormProps {
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchForm = ({ searchQuery, handleSearch }: SearchFormProps) => {
  return (
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
  );
};

export default SearchForm;
