
import React from 'react';

interface Award {
  award_id: number;
  award_type: string;
  award_date: string;
  description?: string;
}

interface OfficerAwardsProps {
  awards: Award[] | null;
}

export const OfficerAwards = ({ awards }: OfficerAwardsProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-portal-900 mb-4">Awards and Commendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards?.map((award) => (
          <div key={award.award_id} className="border border-portal-100 rounded-lg p-4">
            <p className="font-medium text-portal-900 mb-1">{award.award_type}</p>
            <p className="text-sm text-portal-500 mb-2">{award.award_date}</p>
            {award.description && (
              <p className="text-sm text-portal-600">{award.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
