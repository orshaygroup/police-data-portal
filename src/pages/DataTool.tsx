
import React from 'react';
import Layout from '../components/Layout';

const DataTool = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Data Analysis Tool</h1>
          
          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-portal-600 mb-2">Officer Name</label>
              <input
                type="text"
                placeholder="Search by name"
                className="w-full p-2 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-portal-600 mb-2">Keywords</label>
              <input
                type="text"
                placeholder="Enter keywords"
                className="w-full p-2 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-portal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-portal-600 mb-2">Allegations</label>
              <input
                type="text"
                placeholder="Search allegations"
                className="w-full p-2 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-portal-400"
              />
            </div>
          </div>

          {/* Map and Graphs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Heat Map Placeholder */}
            <div className="bg-portal-100 rounded-xl h-[400px] flex items-center justify-center">
              <p className="text-portal-500">Heat Map Coming Soon</p>
            </div>

            {/* Graphs Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="border-b border-portal-200 pb-4">
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-portal-900 border-b-2 border-portal-900">
                    Outcomes
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-portal-500 hover:text-portal-900">
                    Categories
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-portal-500 hover:text-portal-900">
                    Complainants
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-portal-500 hover:text-portal-900">
                    Accused
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-portal-500 hover:text-portal-900">
                    Officer/Civilian
                  </button>
                </div>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-portal-500">Graph Data Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataTool;
