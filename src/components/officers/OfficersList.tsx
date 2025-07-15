import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useMapDataContext } from '@/hooks/useMapDataContext';
import { useOfficerData } from '@/hooks/useOfficerData';

interface OfficersListProps {
  isLoading: boolean;
  selectedOfficer: number | null;
  toggleOfficer: (officerId: number) => void;
}

const OfficersList = ({ isLoading, selectedOfficer, toggleOfficer }: OfficersListProps) => {
  const { filteredComplaints } = useMapDataContext();
  const { data: officers } = useOfficerData();

  // TEMP: Log the first complaint to inspect officer property names
  if (filteredComplaints.length > 0) {
    // eslint-disable-next-line no-console
    console.log('Sample complaint:', filteredComplaints[0]);
  }

  // Group officers from filtered complaints and join with officer info
  const officerMap = new Map();
  filteredComplaints.forEach((complaint) => {
    if (complaint.officer_id) {
      if (!officerMap.has(complaint.officer_id)) {
        // Find officer info
        const officerInfo = officers?.find(o => o.officer_id === complaint.officer_id);
        officerMap.set(complaint.officer_id, {
          officer_id: complaint.officer_id,
          first_name: officerInfo?.first_name || '',
          last_name: officerInfo?.last_name || '',
          gender: officerInfo?.gender || '',
          race: officerInfo?.race || '',
          complaint_count: 1
        });
      } else {
        officerMap.get(complaint.officer_id).complaint_count++;
      }
    }
  });
  const officersInFiltered = Array.from(officerMap.values());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-portal-900">Officers ({officersInFiltered.length})</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-portal-100 hover:bg-portal-200">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 rounded-full bg-portal-100 hover:bg-portal-200">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-6 rounded-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <p>Loading officers...</p>
          </div>
        ) : (
          officersInFiltered.slice(0, 12).map((officer) => (
            <div key={officer.officer_id} className="border border-portal-200 rounded-lg bg-white overflow-hidden">
              <div className="p-4">
                <Link to={`/officers/${officer.officer_id}`} className="font-bold text-lg text-portal-900 hover:text-portal-700">
                  {officer.first_name || officer.last_name ? `${officer.first_name} ${officer.last_name}` : `Officer #${officer.officer_id}`}
                </Link>
                <p className="text-sm text-portal-600 mb-3">
                  {officer.gender || officer.race ? `${officer.gender}, ${officer.race}` : ''}
                </p>
                <div 
                  className="flex justify-between items-center cursor-pointer hover:bg-portal-50 p-2 rounded"
                  onClick={() => toggleOfficer(officer.officer_id)}
                >
                  <div className="flex items-center">
                    {selectedOfficer === officer.officer_id ? (
                      <Minus size={16} className="mr-2 text-portal-600" />
                    ) : (
                      <Plus size={16} className="mr-2 text-portal-600" />
                    )}
                    <span className="text-sm font-medium">Complaints</span>
                  </div>
                  <span className="bg-portal-100 px-2 py-1 rounded-full text-xs font-medium">
                    {officer.complaint_count}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfficersList;
