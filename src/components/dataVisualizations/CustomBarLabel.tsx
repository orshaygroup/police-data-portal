
import React from 'react';

interface CustomBarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  index?: number;
  disciplined: number;
  complaints: number;
}

const CustomBarLabel = (props: CustomBarLabelProps) => {
  const { x = 0, y = 0, width = 0, height = 0, disciplined, complaints } = props;
  
  if (!complaints) return null;
  
  const disciplineWidth = (disciplined / complaints) * width;
  
  return (
    <g>
      <rect x={0} y={y} width={disciplineWidth} height={height} fill="#002E5D" />
      <rect x={disciplineWidth} y={y} width={width - disciplineWidth} height={height} fill="#A4B8D1" />
    </g>
  );
};

export default CustomBarLabel;
