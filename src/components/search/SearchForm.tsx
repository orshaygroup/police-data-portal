
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchFormProps {
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchForm = ({ searchQuery, handleSearch }: SearchFormProps) => {
  return (
    <div className="max-w-2xl mb-6 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-portal-400" size={20} />
        <Input
          type="search"
          placeholder="Search officers, complaints, documents, or lawsuits..."
          className="w-full pl-10 pr-4 py-6 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-2 focus:ring-portal-400 shadow-sm text-lg transition-all hover:shadow-md"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <p className="text-sm text-portal-500 mt-2 ml-1">
        Enter at least 3 characters to search
      </p>
    </div>
  );
};

export default SearchForm;
