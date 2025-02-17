
import React from 'react';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';

const Documents = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">Document Repository</h1>
          
          <div className="mb-8">
            <input
              type="search"
              placeholder="Search documents..."
              className="w-full max-w-2xl p-4 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Document Card - Will be replaced with real data */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-portal-900">Investigation Report #2024-001</h3>
                <ArrowRight className="text-portal-400" size={20} />
              </div>
              <p className="text-portal-600 mb-4 text-sm">Filed on January 15, 2024</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-portal-100 text-portal-600 rounded text-sm">Investigation</span>
                <span className="px-2 py-1 bg-portal-100 text-portal-600 rounded text-sm">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
