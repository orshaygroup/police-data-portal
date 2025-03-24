
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from '@/components/ui/chart';
import { useOfficerPercentiles } from '@/hooks/useSearchResults';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';

interface TrianglePoint {
  x: number;
  y: number;
}

interface OfficerTriangleChartProps {
  officerId: number;
}

export const OfficerTriangleChart = ({ officerId }: OfficerTriangleChartProps) => {
  const { data: percentiles, isLoading, error } = useOfficerPercentiles(officerId);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full flex items-center justify-center">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (error || !percentiles) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full">
        <h2 className="text-xl font-semibold text-portal-900 mb-4">Officer Performance Triangle</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-portal-600">Unable to load percentile data.</p>
        </div>
      </div>
    );
  }
  
  // Calculate triangle points (equilateral triangle)
  const height = 300;
  const width = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.42;
  
  // Calculate outer triangle points
  const topPoint = { x: centerX, y: centerY - radius };
  const leftPoint = { x: centerX - radius * Math.cos(Math.PI / 6), y: centerY + radius * Math.sin(Math.PI / 6) };
  const rightPoint = { x: centerX + radius * Math.cos(Math.PI / 6), y: centerY + radius * Math.sin(Math.PI / 6) };
  
  // Calculate the inner triangle based on percentiles
  // Convert percentiles to 0-1 scale for scaling the inner triangle
  const scaleOfficer = percentiles.officer_percentile / 100;
  const scaleCivilian = percentiles.civilian_percentile / 100;
  const scaleForce = percentiles.force_percentile / 100;
  
  // Calculate inner points by interpolating between center and outer points
  const innerTop = interpolatePoint({ x: centerX, y: centerY }, topPoint, scaleOfficer);
  const innerLeft = interpolatePoint({ x: centerX, y: centerY }, leftPoint, scaleCivilian);
  const innerRight = interpolatePoint({ x: centerX, y: centerY }, rightPoint, scaleForce);
  
  // Create SVG path strings
  const outerTrianglePath = `M ${topPoint.x},${topPoint.y} L ${leftPoint.x},${leftPoint.y} L ${rightPoint.x},${rightPoint.y} Z`;
  const innerTrianglePath = `M ${innerTop.x},${innerTop.y} L ${innerLeft.x},${innerLeft.y} L ${innerRight.x},${innerRight.y} Z`;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-portal-900">Officer Performance Triangle</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-portal-600 hover:text-portal-900">
              <Info size={20} />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4 bg-white shadow-lg rounded-lg border border-portal-200">
            <div className="space-y-4">
              <h3 className="font-semibold mb-2">What is this triangle?</h3>
              <p className="text-sm text-portal-600">
                The corners of the triangle show the percentile score for this officer in each of three types of data: 
                complaints from civilians, complaints from other police officers, and self-reported use of force.
              </p>
              <p className="text-sm text-portal-600">
                If one corner of the black inner triangle is close to reaching the outer triangle, then this officer 
                is named in a relatively high rate of incidents of that corner's type compared with other officers.
              </p>
              <h3 className="font-semibold mb-2">What is the scale?</h3>
              <p className="text-sm text-portal-600">
                If an officer's percentile score for civilian complaints is 99%, then this means that they were accused 
                in more civilian complaints per year than 99% of other officers (for the years where data is available).
              </p>
              <p className="text-sm text-portal-600">
                Civilian and internal complaint percentiles are based on data that is only available for complaints since 2000, 
                use of force data is only available since 2004. The overall allegation count percentiles are calculated 
                using data that reaches back to 1988.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
          {/* Background color */}
          <rect x="0" y="0" width={width} height={height} fill="#b7282e" />
          
          {/* Guide lines */}
          <line x1={centerX} y1={centerY} x2={topPoint.x} y2={topPoint.y} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1={centerX} y1={centerY} x2={leftPoint.x} y2={leftPoint.y} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1={centerX} y1={centerY} x2={rightPoint.x} y2={rightPoint.y} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Outer triangle */}
          <path d={outerTrianglePath} fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="2" />
          
          {/* Inner triangle */}
          <path d={innerTrianglePath} fill="black" fillOpacity="0.8" stroke="white" strokeWidth="1.5" />
          
          {/* Corner points */}
          <circle cx={topPoint.x} cy={topPoint.y} r="4" fill="white" />
          <circle cx={leftPoint.x} cy={leftPoint.y} r="4" fill="white" />
          <circle cx={rightPoint.x} cy={rightPoint.y} r="4" fill="white" />
          
          {/* Labels */}
          <text x={topPoint.x} y={topPoint.y - 15} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            Officer Allegations
          </text>
          <text x={topPoint.x} y={topPoint.y - 30} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            {percentiles.officer_percentile}<tspan fontSize="10">th</tspan> percentile
          </text>
          
          <text x={leftPoint.x - 10} y={leftPoint.y + 25} textAnchor="end" fill="white" fontSize="12" fontWeight="bold">
            Civilian Allegations
          </text>
          <text x={leftPoint.x - 10} y={leftPoint.y + 40} textAnchor="end" fill="white" fontSize="12" fontWeight="bold">
            {percentiles.civilian_percentile}<tspan fontSize="10">th</tspan> percentile
          </text>
          
          <text x={rightPoint.x + 10} y={rightPoint.y + 25} textAnchor="start" fill="white" fontSize="12" fontWeight="bold">
            Use of Force Reports
          </text>
          <text x={rightPoint.x + 10} y={rightPoint.y + 40} textAnchor="start" fill="white" fontSize="12" fontWeight="bold">
            {percentiles.force_percentile}<tspan fontSize="10">th</tspan> percentile
          </text>
        </svg>
      </div>
    </div>
  );
};

// Helper function to interpolate between two points
function interpolatePoint(p1: TrianglePoint, p2: TrianglePoint, t: number): TrianglePoint {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}
