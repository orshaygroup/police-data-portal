
import React from 'react';
import { X } from 'lucide-react';

export interface Filter {
  id: string;
  type: string;
  value: string;
  label: string;
}

interface FilterBoxProps {
  filters: Filter[];
  onRemoveFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

const FilterBox = ({ filters, onRemoveFilter, onClearFilters }: FilterBoxProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-portal-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-portal-700">Active Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-xs text-portal-500 hover:text-portal-700"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <div
                key={filter.id}
                className="bg-white rounded-full px-3 py-1 text-sm flex items-center gap-2 border border-portal-200"
              >
                <span>{filter.label}</span>
                <button
                  onClick={() => onRemoveFilter(filter.id)}
                  className="text-portal-400 hover:text-portal-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
