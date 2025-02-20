
import React from 'react';

interface UseOfForceIncident {
  use_of_force_id: number;
  force_type: string;
  incident_date: string;
  description?: string;
}

interface OfficerUseOfForceProps {
  incidents: UseOfForceIncident[] | null;
}

export const OfficerUseOfForce = ({ incidents }: OfficerUseOfForceProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-portal-900 mb-4">Use of Force Reports</h2>
      <div className="space-y-4">
        {incidents?.map((incident) => (
          <div key={incident.use_of_force_id} className="border-b border-portal-100 last:border-0 pb-4 last:pb-0">
            <p className="font-medium text-portal-900 mb-1">{incident.force_type}</p>
            <p className="text-sm text-portal-500">{incident.incident_date}</p>
            {incident.description && (
              <p className="text-sm text-portal-600 mt-2">{incident.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
