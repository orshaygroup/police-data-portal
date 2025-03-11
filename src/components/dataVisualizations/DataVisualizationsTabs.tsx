
import React, { useState } from 'react';
import OutcomesTab from './OutcomesTab';
import CategoriesTab from './CategoriesTab';
import AccusedTab from './AccusedTab';
import OfficerCivilianTab from './OfficerCivilianTab';
import ComplainantsTab from './ComplainantsTab';

const DataVisualizationsTabs = () => {
  const [activeTab, setActiveTab] = useState('outcomes');

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="border-b border-portal-200 pb-4">
        <div className="flex space-x-4 overflow-x-auto">
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'outcomes' 
                ? 'text-portal-900 border-b-2 border-portal-900' 
                : 'text-portal-500 hover:text-portal-900'
            }`}
            onClick={() => setActiveTab('outcomes')}
          >
            Outcomes
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'categories' 
                ? 'text-portal-900 border-b-2 border-portal-900' 
                : 'text-portal-500 hover:text-portal-900'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'accused' 
                ? 'text-portal-900 border-b-2 border-portal-900' 
                : 'text-portal-500 hover:text-portal-900'
            }`}
            onClick={() => setActiveTab('accused')}
          >
            Accused
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'officer-civilian' 
                ? 'text-portal-900 border-b-2 border-portal-900' 
                : 'text-portal-500 hover:text-portal-900'
            }`}
            onClick={() => setActiveTab('officer-civilian')}
          >
            Officer/Civilian
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'complainants' 
                ? 'text-portal-900 border-b-2 border-portal-900' 
                : 'text-portal-500 hover:text-portal-900'
            }`}
            onClick={() => setActiveTab('complainants')}
          >
            Complainants
          </button>
        </div>
      </div>
      
      <div className="h-[380px] w-full overflow-y-auto">
        {activeTab === 'outcomes' && <OutcomesTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'accused' && <AccusedTab />}
        {activeTab === 'officer-civilian' && <OfficerCivilianTab />}
        {activeTab === 'complainants' && <ComplainantsTab />}
      </div>
    </div>
  );
};

export default DataVisualizationsTabs;
