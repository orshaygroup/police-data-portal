
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Award, AlertTriangle, Shield, Clock } from 'lucide-react';
import { RankedOfficer } from '@/hooks/useOfficersRanking';

interface OfficerRankingTableProps {
  officers: RankedOfficer[];
  isLoading: boolean;
}

export const OfficerRankingTable: React.FC<OfficerRankingTableProps> = ({ officers, isLoading }) => {
  const navigate = useNavigate();

  const handleRowClick = (officerId: number) => {
    navigate(`/officers/${officerId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-16 text-center font-semibold">Rank</TableHead>
            <TableHead className="font-semibold">Officer</TableHead>
            <TableHead className="font-semibold">Badge Number</TableHead>
            <TableHead className="font-semibold">Current Rank</TableHead>
            <TableHead className="text-center font-semibold">
              <div className="flex items-center justify-center gap-1">
                <AlertTriangle size={14} />
                <span>Allegations</span>
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold">
              <div className="flex items-center justify-center gap-1">
                <Shield size={14} />
                <span>Use of Force</span>
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold">
              <div className="flex items-center justify-center gap-1">
                <Award size={14} />
                <span>Awards</span>
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold">
              <div className="flex items-center justify-center gap-1">
                <Clock size={14} />
                <span>Service</span>
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold">Score</TableHead>
            <TableHead className="text-center font-semibold w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officers.map((officer, index) => (
            <TableRow 
              key={officer.officer_id}
              className="transition-colors hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(officer.officer_id)}
            >
              <TableCell className="text-center font-medium">
                {index < 3 ? (
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center mx-auto
                    ${index === 0 ? 'bg-amber-100 text-amber-800' : 
                      index === 1 ? 'bg-slate-100 text-slate-800' : 
                      'bg-orange-100 text-orange-800'}
                  `}>
                    {index + 1}
                  </div>
                ) : (
                  index + 1
                )}
              </TableCell>
              <TableCell className="font-medium">
                {officer.first_name} {officer.last_name}
              </TableCell>
              <TableCell>{officer.badge_number || 'N/A'}</TableCell>
              <TableCell>{officer.current_rank || 'Unknown'}</TableCell>
              <TableCell className="text-center">
                <Badge variant={getBadgeVariant(officer.percentiles.officer_allegations_percentile)}>
                  {officer.percentiles.officer_allegations_percentile}%
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getBadgeVariant(officer.percentiles.use_of_force_percentile)}>
                  {officer.percentiles.use_of_force_percentile}%
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getBadgeVariant(officer.percentiles.awards_percentile)}>
                  {officer.percentiles.awards_percentile}%
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getBadgeVariant(officer.percentiles.service_years_percentile)}>
                  {officer.percentiles.service_years_percentile}%
                </Badge>
              </TableCell>
              <TableCell className="text-center font-medium">
                {Math.round(officer.composite_score)}
              </TableCell>
              <TableCell className="text-center">
                <ArrowUpRight size={16} className="mx-auto text-gray-400" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to get badge variant based on percentile
function getBadgeVariant(percentile: number): "default" | "destructive" | "outline" | "secondary" | "success" {
  if (percentile >= 80) return "destructive";
  if (percentile >= 60) return "secondary";
  if (percentile >= 40) return "outline";
  if (percentile >= 20) return "default";
  return "success";
}
