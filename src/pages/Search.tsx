
import React from 'react';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';

const Search = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Search Database</h1>
          
          <div className="max-w-2xl mb-8">
            <input
              type="search"
              placeholder="Search officers, complaints, or documents..."
              className="w-full p-4 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400 text-lg"
            />
          </div>

          <div className="space-y-6">
            {/* Sample Results - Will be replaced with real data */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-portal-900 mb-2">Officer John Doe</h3>
                  <p className="text-portal-600 mb-4">Badge #12345 • Central Division</p>
                  <div className="flex gap-4 text-sm text-portal-500">
                    <span>5 Complaints</span>
                    <span>2 Use of Force Reports</span>
                    <span>3 Commendations</span>
                  </div>
                </div>
                <ArrowRight className="text-portal-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
