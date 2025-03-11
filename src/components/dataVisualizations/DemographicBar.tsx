
import React from 'react';

interface DemographicSegment {
  name: string;
  percentage: number;
  color: string;
  startPosition?: number;
  endPosition?: number;
}

interface DemographicBarProps {
  title: string;
  segments: DemographicSegment[];
}

const DemographicBar = ({ title, segments }: DemographicBarProps) => {
  if (!segments || segments.length === 0) return null;
  
  let cumulativePercentage = 0;
  const segmentsWithPosition = segments.map(item => {
    const startPosition = cumulativePercentage;
    cumulativePercentage += item.percentage;
    return {
      ...item,
      startPosition,
      endPosition: cumulativePercentage
    };
  });
  
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold mb-1">{title}</h3>
      
      <div className="relative h-6 bg-gray-200 rounded-sm overflow-hidden mb-1">
        {segmentsWithPosition.map((segment, index) => (
          <div
            key={index}
            className="absolute top-0 h-full"
            style={{
              left: `${segment.startPosition}%`,
              width: `${segment.percentage}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>
      
      <div className="relative h-6">
        {segmentsWithPosition.map((segment, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{
              left: `${segment.startPosition + (segment.percentage / 2)}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <span className="text-sm font-bold">+</span>
            <div className="text-center">
              <div className="text-xs font-bold">{segment.percentage}%</div>
              <div className="text-xs">{segment.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemographicBar;
