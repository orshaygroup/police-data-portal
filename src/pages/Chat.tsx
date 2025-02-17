
import React from 'react';
import Layout from '../components/Layout';

const Chat = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-portal-900 mb-6">AI Assistant</h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <p className="text-portal-600 mb-4">
                Ask questions about police data, complaints, or investigations. The AI assistant will help you understand the information available in our database.
              </p>
              <p className="text-sm text-portal-500">
                Note: The AI can only read and explain data. It cannot modify or create new records.
              </p>
            </div>

            <div className="bg-white rounded-lg h-[400px] shadow-sm mb-6 p-4">
              {/* Chat messages will appear here */}
              <div className="h-full flex items-center justify-center">
                <p className="text-portal-500">AI Chat Coming Soon</p>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Type your question here..."
                className="flex-1 p-4 rounded-lg border border-portal-200 focus:border-portal-400 focus:ring-1 focus:ring-portal-400"
              />
              <button className="px-6 py-4 bg-portal-900 text-white rounded-lg hover:bg-portal-800 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
