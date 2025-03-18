
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText, Shield, Gavel, DollarSign, CircleAlert } from 'lucide-react';

interface OfficerStatsCardsProps {
  stats: {
    totalAllegations: number;
    totalComplaints: number;
    sustainedAllegations: number;
    totalUseOfForce: number;
    totalLawsuits: number;
    totalSettlements: number;
  };
  isLoading: boolean;
}

export const OfficerStatsCards = ({ stats, isLoading }: OfficerStatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-36 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Define the cards with their icons, titles, and values
  const cards = [
    {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      title: "Total Allegations",
      value: stats.totalAllegations,
      description: "Number of allegations made against this officer"
    },
    {
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      title: "Citizen Reports",
      value: stats.totalComplaints,
      description: "Total number of complaints filed by citizens"
    },
    {
      icon: <CircleAlert className="h-5 w-5 text-yellow-500" />,
      title: "Sustained Allegations",
      value: stats.sustainedAllegations,
      description: "Number of allegations found to be valid after investigation"
    },
    {
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      title: "Use of Force",
      value: stats.totalUseOfForce,
      description: "Total number of use of force incidents"
    },
    {
      icon: <Gavel className="h-5 w-5 text-orange-500" />,
      title: "Lawsuits",
      value: stats.totalLawsuits,
      description: "Number of lawsuits involving this officer"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      title: "Total Settlements",
      value: `$${stats.totalSettlements.toLocaleString()}`,
      description: "Total amount paid in lawsuit settlements"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-portal-500">{card.title}</h3>
              <div className="p-2 bg-gray-50 rounded-full">{card.icon}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-portal-900">{card.value}</span>
              <span className="text-xs text-portal-400 mt-1">{card.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
