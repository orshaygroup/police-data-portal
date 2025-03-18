
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLawsuitData, useLawsuitDetails, Lawsuit, OfficerInLawsuit } from '../hooks/useLawsuitData';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, DollarSign, FileText, 
  User, Shield, ChevronRight, ChevronDown, ChevronUp, 
  Info, MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

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

const LawsuitCard: React.FC<{ lawsuit: Lawsuit; isSelected: boolean; onClick: () => void }> = ({ 
  lawsuit, isSelected, onClick 
}) => {
  return (
    <div 
      className={`rounded-lg p-5 cursor-pointer transition-all ${
        isSelected ? 'bg-portal-100 border-2 border-portal-400' : 'bg-white border border-portal-200 hover:border-portal-300'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-portal-800">
            {lawsuit.case_number || `Case #${lawsuit.lawsuit_id}`}
          </h3>
          <p className="text-sm text-portal-600 mt-1">
            {lawsuit.plaintiff_name || 'Unnamed Plaintiff'}
          </p>
        </div>
        {lawsuit.settlement_amount && (
          <div className="bg-portal-900 text-white px-2 py-1 rounded text-sm flex items-center">
            <DollarSign size={14} className="mr-1" />
            {formatCurrency(lawsuit.settlement_amount)}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-portal-600">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {formatDate(lawsuit.date_filed)}
        </div>
        <div className="flex items-center">
          <FileText size={14} className="mr-1" />
          {lawsuit.lawsuit_status || 'Status unknown'}
        </div>
      </div>
    </div>
  );
};

const OfficerCard: React.FC<{ officer: OfficerInLawsuit }> = ({ officer }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="rounded-lg bg-white border border-portal-200 p-4 hover:border-portal-300 transition-all cursor-pointer"
      onClick={() => navigate(`/officers/${officer.officer_id}`)}
    >
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
  );
};

const LawsuitDetails: React.FC<{ lawsuitId: number }> = ({ lawsuitId }) => {
  const { data, isLoading, error } = useLawsuitDetails(lawsuitId);
  const [showAllOfficers, setShowAllOfficers] = useState(false);
  const { toast } = useToast();
  
  if (isLoading) {
    return <div className="p-6 text-center">Loading lawsuit details...</div>;
  }
  
  if (error || !data) {
    return <div className="p-6 text-center text-red-500">Failed to load lawsuit details</div>;
  }
  
  const { lawsuit, officers } = data;
  const displayedOfficers = showAllOfficers ? officers : officers.slice(0, 6);
  
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-portal-900">
              {lawsuit.case_number || `Case #${lawsuit.lawsuit_id}`}
            </h2>
            <p className="text-portal-600 mt-1">
              Filed on {formatDate(lawsuit.date_filed)} • {lawsuit.lawsuit_status}
            </p>
          </div>
          {lawsuit.settlement_amount && (
            <div className="bg-portal-900 text-white px-3 py-2 rounded flex items-center">
              <DollarSign size={16} className="mr-1" />
              <div>
                <div className="text-sm font-semibold">{formatCurrency(lawsuit.settlement_amount)}</div>
                <div className="text-xs">Total payments</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {lawsuit.Summary && (
        <div className="mb-6">
          <h3 className="font-semibold text-portal-800 mb-2">Summary</h3>
          <p className="text-sm text-portal-700 whitespace-pre-line">
            {lawsuit.Summary}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-semibold text-portal-800 mb-2">
          {officers.length} Involved Officer{officers.length !== 1 ? 's' : ''}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOfficers.map((officer) => (
            <OfficerCard key={officer.officer_id} officer={officer} />
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
      
      <div className="mb-6">
        <h3 className="font-semibold text-portal-800 mb-2">Payment Breakdown</h3>
        <div className="bg-white rounded-lg border border-portal-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-portal-50">
              <tr>
                <th className="py-2 px-4 text-left text-portal-600">Payee</th>
                <th className="py-2 px-4 text-right text-portal-600">Settlement ($)</th>
                <th className="py-2 px-4 text-right text-portal-600">Legal Fees ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-portal-100">
                <td className="py-2 px-4 text-portal-800">
                  {lawsuit.plaintiff_name || 'Unknown Plaintiff'}
                </td>
                <td className="py-2 px-4 text-right text-portal-800">
                  {lawsuit.settlement_amount ? formatCurrency(lawsuit.settlement_amount) : '-'}
                </td>
                <td className="py-2 px-4 text-right text-portal-800">
                  -
                </td>
              </tr>
              <tr className="border-t border-portal-100 bg-portal-50 font-semibold">
                <td className="py-2 px-4 text-portal-800">
                  Total Payments
                </td>
                <td className="py-2 px-4 text-right text-portal-800">
                  {lawsuit.settlement_amount ? formatCurrency(lawsuit.settlement_amount) : '-'}
                </td>
                <td className="py-2 px-4 text-right text-portal-800">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-portal-800 mb-2">Case Breakdown</h3>
        <div className="bg-white rounded-lg border border-portal-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Interaction</td>
                <td className="py-2 px-4 text-portal-800">
                  {lawsuit.final_outcome || 'Not specified'}
                </td>
              </tr>
              <tr className="border-t border-portal-100">
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Service</td>
                <td className="py-2 px-4 text-portal-800">
                  -
                </td>
              </tr>
              <tr className="border-t border-portal-100">
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Misconduct</td>
                <td className="py-2 px-4 text-portal-800">
                  -
                </td>
              </tr>
              <tr className="border-t border-portal-100">
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Outcome</td>
                <td className="py-2 px-4 text-portal-800">
                  {lawsuit.lawsuit_status || 'Status unknown'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-portal-800 mb-2">Case Details</h3>
        <div className="bg-white rounded-lg border border-portal-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Plaintiff</td>
                <td className="py-2 px-4 text-portal-800">
                  {lawsuit.plaintiff_name || 'Unnamed Plaintiff'}
                </td>
              </tr>
              <tr className="border-t border-portal-100">
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Court</td>
                <td className="py-2 px-4 text-portal-800">
                  {lawsuit.court_name || 'Court information not available'}
                </td>
              </tr>
              <tr className="border-t border-portal-100">
                <td className="py-2 px-4 text-portal-600 bg-portal-50">Date Filed</td>
                <td className="py-2 px-4 text-portal-800">
                  {formatDate(lawsuit.date_filed)}
                </td>
              </tr>
              {lawsuit.date_closed && (
                <tr className="border-t border-portal-100">
                  <td className="py-2 px-4 text-portal-600 bg-portal-50">Date Closed</td>
                  <td className="py-2 px-4 text-portal-800">
                    {formatDate(lawsuit.date_closed)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        className="mt-6 bg-portal-900 text-white px-4 py-2 rounded hover:bg-portal-800 transition-colors flex items-center justify-center mx-auto"
        onClick={() => {
          toast({
            title: "Document download",
            description: "Court documents are not available for download at this time.",
          });
        }}
      >
        <FileText size={16} className="mr-2" />
        Download Court Documents
      </button>
    </div>
  );
};

const Lawsuits = () => {
  const { data: lawsuits, isLoading, error } = useLawsuitData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLawsuit, setSelectedLawsuit] = useState<number | null>(null);
  
  // Filter lawsuits based on search query
  const filteredLawsuits = lawsuits?.filter(lawsuit => {
    if (!searchQuery) return true;
    
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const lawsuitText = `
      ${lawsuit.case_number || ''} 
      ${lawsuit.plaintiff_name || ''} 
      ${lawsuit.court_name || ''} 
      ${lawsuit.lawsuit_status || ''} 
      ${lawsuit.Summary || ''}
    `.toLowerCase();
    
    return searchTerms.every(term => lawsuitText.includes(term));
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Lawsuits Database</h1>
          
          <div className="mb-8 relative">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-portal-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by case number, plaintiff name, description..."
                  className="w-full p-3 pl-10 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-portal-800 mb-4">Case Listings</h2>
              
              {isLoading ? (
                <div className="text-center py-8">Loading lawsuits...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Error loading lawsuits</div>
              ) : filteredLawsuits && filteredLawsuits.length > 0 ? (
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                  {filteredLawsuits.map((lawsuit) => (
                    <LawsuitCard
                      key={lawsuit.lawsuit_id}
                      lawsuit={lawsuit}
                      isSelected={selectedLawsuit === lawsuit.lawsuit_id}
                      onClick={() => setSelectedLawsuit(lawsuit.lawsuit_id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-portal-600">
                  No lawsuits found matching your search criteria
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              {selectedLawsuit ? (
                <LawsuitDetails lawsuitId={selectedLawsuit} />
              ) : (
                <div className="glass-panel rounded-2xl p-8 text-center">
                  <Info size={48} className="mx-auto text-portal-400 mb-4" />
                  <h2 className="text-xl font-semibold text-portal-800 mb-2">Select a Lawsuit</h2>
                  <p className="text-portal-600">
                    Choose a lawsuit from the list to view detailed information
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Lawsuits;
