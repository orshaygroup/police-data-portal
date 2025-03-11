
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Search } from 'lucide-react';

interface SearchResult {
  type: string;
  id: string | number;
  value: string;
}

interface SearchBarProps {
  onOfficerSelect: (officerId: number, officerName: string) => void;
  onFilterAdd: (type: string, value: string, label: string) => void;
}

const SearchBar = ({ onOfficerSelect, onFilterAdd }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return null;

      const [officers, allegations, complainants] = await Promise.all([
        supabase
          .from('Police_Data_Officers')
          .select('*')
          .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
          .limit(5),
        supabase
          .from('Police_Data_Allegations')
          .select('*')
          .textSearch('category', searchQuery)
          .limit(5),
        supabase
          .from('Police_Data_Complainants')
          .select('*')
          .or(`race.ilike.%${searchQuery}%,gender.ilike.%${searchQuery}%`)
          .limit(5)
      ]);

      const results: SearchResult[] = [];

      officers.data?.forEach(officer => {
        results.push({
          type: 'Officer',
          id: officer.officer_id,
          value: `${officer.first_name} ${officer.last_name}`
        });
      });

      allegations.data?.forEach(allegation => {
        results.push({
          type: 'Allegation',
          id: allegation.allegation_id,
          value: allegation.category
        });
      });

      complainants.data?.forEach(complainant => {
        if (complainant.race) {
          results.push({
            type: 'Complainant Race',
            id: complainant.complainant_id,
            value: complainant.race
          });
        }
      });

      return results;
    },
    enabled: searchQuery.length >= 2
  });

  return (
    <div className="mb-6 relative">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-portal-400" size={20} />
          <input
            type="text"
            placeholder="Search officers, complaints, or locations..."
            className="w-full p-3 pl-10 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
          />
        </div>
        
        {searchQuery.length >= 2 && isSearchOpen && (
          <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-portal-200 max-h-96 overflow-y-auto z-50">
            {isSearching ? (
              <div className="p-4 text-center text-portal-500">Searching...</div>
            ) : searchResults ? (
              <div className="p-2">
                {searchResults.reduce((acc: JSX.Element[], result) => {
                  const categoryExists = acc.some(
                    element => element.props?.['data-category'] === result.type
                  );

                  if (!categoryExists) {
                    acc.push(
                      <div key={result.type} data-category={result.type}>
                        <div className="px-3 py-1 text-sm font-semibold text-portal-600 bg-portal-50">
                          {result.type}s
                        </div>
                        {searchResults
                          .filter(r => r.type === result.type)
                          .map((item, idx) => (
                            <div
                              key={`${item.type}-${idx}`}
                              className="px-3 py-2 hover:bg-portal-50 cursor-pointer text-sm"
                              onClick={() => {
                                if (item.type === 'Officer') {
                                  onOfficerSelect(Number(item.id), item.value);
                                } else {
                                  onFilterAdd(
                                    item.type.toLowerCase().replace(' ', ''),
                                    item.value,
                                    `${item.type}: ${item.value}`
                                  );
                                }
                                setSearchQuery('');
                                setIsSearchOpen(false);
                              }}
                            >
                              {item.value}
                            </div>
                          ))}
                      </div>
                    );
                  }
                  return acc;
                }, [])}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
