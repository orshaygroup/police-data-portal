
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Filter } from '@/components/data-tool/FilterBox';
import SearchBar from '@/components/data-tool/SearchBar';
import FilterBox from '@/components/data-tool/FilterBox';
import OutcomeCharts from '@/components/data-tool/OutcomeCharts';
import OfficerCards from '@/components/data-tool/OfficerCards';
import ComplaintsDisplay from '@/components/data-tool/ComplaintsDisplay';
import { toast } from 'sonner';

const DataTool = () => {
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  const addFilter = (type: string, value: string, label: string) => {
    const filterExists = activeFilters.some(
      filter => filter.type === type && filter.value === value
    );
    
    if (!filterExists) {
      const newFilter: Filter = {
        id: `${type}-${value}-${Date.now()}`,
        type,
        value,
        label
      };
      
      setActiveFilters(prev => [...prev, newFilter]);
      toast.success(`Added filter: ${label}`);
    }
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(filter => filter.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    toast.info('All filters cleared');
  };

  const toggleOfficer = (officerId: number, officerName: string) => {
    if (selectedOfficer === officerId) {
      setSelectedOfficer(null);
      setExpandedComplaint(null);
    } else {
      setSelectedOfficer(officerId);
      setExpandedComplaint(null);
      addFilter('officer', officerId.toString(), `Officer: ${officerName}`);
    }
  };

  const toggleComplaint = (complaintId: number) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Data Analysis Tool</h1>
          
          <SearchBar
            onOfficerSelect={toggleOfficer}
            onFilterAdd={addFilter}
          />
          
          <FilterBox
            filters={activeFilters}
            onRemoveFilter={removeFilter}
            onClearFilters={clearAllFilters}
          />
          
          <div className="mb-8">
            <OutcomeCharts
              onSegmentClick={(category) => addFilter('outcome', category, `Outcome: ${category}`)}
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Officers with Complaints</h2>
            <OfficerCards
              onOfficerSelect={toggleOfficer}
              selectedOfficer={selectedOfficer}
            />
          </div>
          
          {selectedOfficer && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Officer Complaints</h2>
              <ComplaintsDisplay
                selectedOfficer={selectedOfficer}
                expandedComplaint={expandedComplaint}
                onComplaintToggle={toggleComplaint}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DataTool;
