
import React from 'react';

interface RankHistoryItem {
  rank_history_id: number;
  rank_name: string;
  start_date: string;
  end_date: string | null;
}

interface OfficerRankHistoryProps {
  rankHistory: RankHistoryItem[] | null;
}

export const OfficerRankHistory = ({ rankHistory }: OfficerRankHistoryProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-portal-900 mb-4">Rank History</h2>
      <div className="space-y-4">
        {rankHistory?.map((rank) => (
          <div key={rank.rank_history_id} className="border-l-2 border-portal-200 pl-4">
            <p className="font-medium text-portal-900">{rank.rank_name}</p>
            <p className="text-sm text-portal-500">
              {rank.start_date} - {rank.end_date || 'Present'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
