
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useLocation } from 'react-router-dom';

interface SearchResult {
  officer_id: number;
  badge_number: number | null;
  first_name: string | null;
  last_name: string | null;
  current_rank: string | null;
  complaint_count: number;
  force_count: number;
  award_count: number;
}

interface LocationState {
  searchTerm?: string;
}

const Search = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [searchQuery, setSearchQuery] = useState('');
  
  // If we have a search term in the location state, use it
  useEffect(() => {
    if (state?.searchTerm) {
      setSearchQuery(state.searchTerm);
    }
  }, [state?.searchTerm]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['officers', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data: officers, error } = await supabase
        .from('Police_Data_Officers')
        .select(`
          officer_id,
          badge_number,
          first_name,
          last_name,
          current_rank
        `)
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      // Get counts for each officer
      const officersWithCounts = await Promise.all(
        (officers || []).map(async (officer) => {
          const [complaints, useOfForce, awards] = await Promise.all([
            supabase
              .from('Police_Data_Complaints')
              .select('complaint_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id),
            supabase
              .from('Police_Data_Use_Of_Use')
              .select('use_of_force_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id),
            supabase
              .from('Police_Data_Awards')
              .select('award_id', { count: 'exact' })
              .eq('officer_id', officer.officer_id)
          ]);

          return {
            ...officer,
            complaint_count: complaints.count || 0,
            force_count: useOfForce.count || 0,
            award_count: awards.count || 0
          };
        })
      );

      return officersWithCounts;
    },
    enabled: searchQuery.length >= 3
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Search Database</h1>
          
          <div className="max-w-2xl mb-8">
            <input
              type="search"
              placeholder="Search officers by name..."
              className="w-full p-4 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400 text-lg"
              value={searchQuery}
              onChange={handleSearch}
            />
            <p className="text-sm text-portal-500 mt-2">
              Enter at least 3 characters to search
            </p>
          </div>

          <div className="space-y-6">
            {isLoading && searchQuery.length >= 3 ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))
            ) : results?.length === 0 && searchQuery.length >= 3 ? (
              <div className="text-center py-8 text-portal-500">
                No officers found matching your search
              </div>
            ) : (
              results?.map((officer) => (
                <Link
                  key={officer.officer_id}
                  to={`/officers/${officer.officer_id}`}
                  className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-portal-900 mb-2">
                        {officer.first_name} {officer.last_name}
                      </h3>
                      <p className="text-portal-600 mb-4">
                        Badge #{officer.badge_number} • {officer.current_rank || 'Unknown Rank'}
                      </p>
                      <div className="flex gap-4 text-sm text-portal-500">
                        <span>{officer.complaint_count} Complaints</span>
                        <span>{officer.force_count} Use of Force Reports</span>
                        <span>{officer.award_count} Commendations</span>
                      </div>
                    </div>
                    <ArrowRight className="text-portal-400" size={24} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
