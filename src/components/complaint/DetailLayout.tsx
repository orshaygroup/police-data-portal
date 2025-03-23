
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface DetailLayoutProps {
  header: React.ReactNode;
  mainContent: React.ReactNode[];
  sideContent: React.ReactNode;
}

export const DetailLayout: React.FC<DetailLayoutProps> = ({ 
  header, 
  mainContent, 
  sideContent 
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      {header}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {mainContent.map((content, index) => (
            <React.Fragment key={index}>
              {content}
              {index < mainContent.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
        
        <div className="md:col-span-1 space-y-6">
          {sideContent}
        </div>
      </div>
    </div>
  );
};
