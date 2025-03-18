
import React from 'react';
import { useLawsuitDetails } from '../../hooks/useLawsuitData';
import { format } from 'date-fns';
import { DollarSign, FileText, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LawsuitDetailsPanelProps {
  lawsuitId: number;
}

const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Unknown date';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch (e) {
    return dateString;
  }
};

const LawsuitDetailsPanel: React.FC<LawsuitDetailsPanelProps> = ({ lawsuitId }) => {
  const { data, isLoading, error } = useLawsuitDetails(lawsuitId);
  const [showAllOfficers, setShowAllOfficers] = React.useState(false);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading lawsuit details...</div>;
  }
  
  if (error || !data) {
    return <div className="text-red-500 p-4">Error loading lawsuit details</div>;
  }
  
  const { lawsuit, officers } = data;
  const displayedOfficers = showAllOfficers ? officers : officers.slice(0, 6);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-portal-900">
            {lawsuit.case_number || `Case #${lawsuit.lawsuit_id}`}
          </h2>
          <p className="text-sm text-portal-600 mt-1">
            {lawsuit.plaintiff_name || 'Unnamed Plaintiff'} • Filed {formatDate(lawsuit.date_filed)}
          </p>
        </div>
        
        {lawsuit.settlement_amount && (
          <div className="bg-portal-900 text-white px-3 py-2 rounded">
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              <div>
                <div className="text-sm font-semibold">{formatCurrency(lawsuit.settlement_amount)}</div>
                <div className="text-xs">Total settlement</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {lawsuit.Summary && (
        <div>
          <h3 className="font-semibold text-portal-800 mb-2">Case Summary</h3>
          <p className="text-sm text-portal-700 whitespace-pre-line">
            {lawsuit.Summary}
          </p>
        </div>
      )}
      
      <div>
        <h3 className="font-semibold text-portal-800 mb-3">
          {officers.length} Involved Officer{officers.length !== 1 ? 's' : ''}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOfficers.map((officer) => (
            <Link to={`/officers/${officer.officer_id}`} key={officer.officer_id} className="block">
              <div className="rounded-lg bg-white border border-portal-200 p-4 hover:border-portal-300 transition-all h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-portal-800">
                      {officer.first_name} {officer.last_name}
                    </h4>
                    <p className="text-xs text-portal-600 mt-1">
                      {officer.current_rank || 'Rank unknown'} • {officer.badge_number ? `Badge #${officer.badge_number}` : 'No badge'}
                    </p>
                  </div>
                  <div className="bg-portal-50 p-1 rounded-full">
                    <Shield size={16} className="text-portal-700" />
                  </div>
                </div>
                
                {officer.allegation_in_lawsuit && (
                  <div className="mt-3">
                    <p className="text-xs bg-portal-50 text-portal-700 px-2 py-1 rounded inline-block">
                      {officer.allegation_in_lawsuit}
                    </p>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between text-xs text-portal-600">
                  <div>{officer.race || 'Race unknown'}</div>
                  <div>{officer.gender || 'Gender unknown'}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {officers.length > 6 && (
          <button
            className="mt-4 flex items-center justify-center w-full py-2 border border-portal-300 rounded-lg text-sm text-portal-700 hover:bg-portal-50 transition-colors"
            onClick={() => setShowAllOfficers(!showAllOfficers)}
          >
            {showAllOfficers ? (
              <>Show Less <ChevronUp size={16} className="ml-1" /></>
            ) : (
              <>Show All {officers.length} Officers <ChevronDown size={16} className="ml-1" /></>
            )}
          </button>
        )}
      </div>
      
      <button
        className="bg-portal-800 text-white px-4 py-2 rounded hover:bg-portal-700 transition-colors flex items-center justify-center mx-auto"
      >
        <FileText size={16} className="mr-2" />
        View Full Case Details
      </button>
    </div>
  );
};

export default LawsuitDetailsPanel;
