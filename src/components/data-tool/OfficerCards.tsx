
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from 'lucide-react';

interface Officer {
  officer_id: number;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  race: string | null;
  badge_number: number | null;
  complaint_count: number;
}

interface OfficerCardsProps {
  onOfficerSelect: (officerId: number, officerName: string) => void;
  selectedOfficer: number | null;
}

const OfficerCards = ({ onOfficerSelect, selectedOfficer }: OfficerCardsProps) => {
  const { data: officers, isLoading } = useQuery({
    queryKey: ['officers-with-complaints'],
    queryFn: async () => {
      const { data: officersData, error: officersError } = await supabase
        .from('Police_Data_Officers')
        .select('*');

      if (officersError) throw new Error('Failed to fetch officers');

      const officersWithComplaints = await Promise.all(
        officersData.map(async (officer) => {
          const { count } = await supabase
            .from('Police_Data_Officer_Complaint_Link')
            .select('*', { count: 'exact', head: true })
            .eq('officer_id', officer.officer_id);

          return {
            ...officer,
            complaint_count: count || 0
          };
        })
      );

      return officersWithComplaints.sort((a, b) => b.complaint_count - a.complaint_count);
    }
  });

  if (isLoading) return <div>Loading officers...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {officers?.map((officer) => (
        <div
          key={officer.officer_id}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedOfficer === officer.officer_id
              ? 'border-portal-400 bg-portal-50'
              : 'border-portal-200 hover:border-portal-300'
          }`}
          onClick={() => onOfficerSelect(
            officer.officer_id,
            `${officer.first_name} ${officer.last_name}`
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {officer.first_name} {officer.last_name}
              </h3>
              <p className="text-sm text-portal-600">
                Badge #{officer.badge_number || 'N/A'}
              </p>
              <p className="text-sm text-portal-500">
                {officer.race} • {officer.gender}
              </p>
            </div>
            <ChevronRight
              className={`transition-transform ${
                selectedOfficer === officer.officer_id ? 'rotate-90' : ''
              }`}
            />
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium">
              {officer.complaint_count} complaints
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfficerCards;
