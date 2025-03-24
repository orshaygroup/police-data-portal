
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="glass-panel rounded-2xl p-8 md:p-12 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-portal-900 mb-6 slide-up">
              Police Accountability Database
            </h1>
            <p className="text-xl text-portal-600 mb-8 max-w-3xl slide-up">
              Access comprehensive data on police conduct, complaints, and disciplinary actions. Empowering transparency through data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-3 bg-portal-900 text-white rounded-lg hover:bg-portal-800 transition-colors"
              >
                Search Database
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/data"
                className="inline-flex items-center px-6 py-3 border border-portal-900 text-portal-900 rounded-lg hover:bg-portal-50 transition-colors"
              >
                View Data Tools
              </Link>
            </div>
          </div>

          {/* Mapbox Integration */}
          <div className="rounded-2xl h-[400px] mb-12 overflow-hidden">
            <iframe 
              width='100%' 
              height='400px' 
              src="https://api.mapbox.com/styles/v1/krystalklean/cm7l36unb009x01qpg2jabkuf.html?title=false&access_token=pk.eyJ1Ijoia3J5c3RhbGtsZWFuIiwiYSI6ImNtN2RtaWNhNzA0eXIycW9oNXF2ZGRvN3oifQ.UcFuoQmTxIPGo12Tz8Wq5w&zoomwheel=false#10.33/30.0247/-89.9019" 
              title="Police Complaints Heatmap" 
              style={{ border: 'none' }}
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Repeat Offenders */}
          <div className="glass-panel rounded-xl p-6 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold text-portal-900 mb-4">Repeat Offenders</h3>
            <p className="text-portal-600 mb-4">
              Track officers with multiple complaints and disciplinary actions.
            </p>
            <Link
              to="/ranking"
              className="inline-flex items-center text-portal-900 hover:text-portal-700"
            >
              View List <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>

          {/* Active Lawsuits */}
          <div className="glass-panel rounded-xl p-6 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold text-portal-900 mb-4">Active Lawsuits</h3>
            <p className="text-portal-600 mb-4">
              Monitor ongoing legal cases involving law enforcement.
            </p>
            <Link
              to="/lawsuits"
              className="inline-flex items-center text-portal-900 hover:text-portal-700"
            >
              View Cases <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>

          {/* Document Repository */}
          <div className="glass-panel rounded-xl p-6 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold text-portal-900 mb-4">Document Repository</h3>
            <p className="text-portal-600 mb-4">
              Access official reports, complaints, and related documentation.
            </p>
            <Link
              to="/documents"
              className="inline-flex items-center text-portal-900 hover:text-portal-700"
            >
              Browse Documents <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
