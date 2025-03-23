
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimelineEvent } from '@/hooks/useComplaintDetails';
import { CalendarDays, Clock, User } from 'lucide-react';

interface ComplaintTimelineProps {
  timeline: TimelineEvent[];
  isLoading: boolean;
}

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ timeline, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="text-portal-600" size={18} />
            <div className="h-6 bg-portal-100 rounded w-48 animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-portal-100"></div>
                <div className="flex-1">
                  <div className="h-5 bg-portal-100 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-portal-100 rounded w-64"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="text-portal-600" size={18} />
            Investigation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-portal-500">
            No timeline events available for this complaint
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="text-portal-600" size={18} />
          Investigation Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-portal-200"></div>
          
          <div className="space-y-6">
            {timeline.map((event, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-portal-200 flex items-center justify-center z-10">
                  <Clock size={16} className="text-portal-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-portal-800">{event.event_type}</p>
                  <p className="text-sm text-portal-600">{event.date}</p>
                  
                  {event.investigator && (
                    <div className="flex items-center gap-1 mt-1.5 text-sm text-portal-500">
                      <User size={14} />
                      <span>Investigator: {event.investigator}</span>
                    </div>
                  )}
                  
                  {event.notes && (
                    <p className="mt-1 text-sm text-portal-600 bg-portal-50 p-2 rounded">
                      {event.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
