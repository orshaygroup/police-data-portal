
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentResult {
  document_id: number;
  doc_title: string;
  doc_type: string | null;
  created_at: string;
  description: string | null;
}

interface DocumentSearchResultsProps {
  results: DocumentResult[] | undefined;
  isLoading: boolean;
  formatDate: (dateString?: string | null) => string;
}

const DocumentSearchResults = ({ results, isLoading, formatDate }: DocumentSearchResultsProps) => {
  if (isLoading) {
    return (
      <>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-64" />
          </div>
        ))}
      </>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-portal-500">
        No documents found matching your search
      </div>
    );
  }

  return (
    <>
      {results.map((document) => (
        <Link
          key={document.document_id}
          to={`/documents?id=${document.document_id}`}
          className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-portal-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-portal-900 mb-2">
                  {document.doc_title}
                </h3>
                <p className="text-portal-600 mb-2">
                  Type: {document.doc_type || 'Unknown'} • Created: {formatDate(document.created_at)}
                </p>
                {document.description && (
                  <p className="text-sm text-portal-500 line-clamp-2">
                    {document.description}
                  </p>
                )}
              </div>
            </div>
            <ArrowRight className="text-portal-400" size={24} />
          </div>
        </Link>
      ))}
    </>
  );
};

export default DocumentSearchResults;
