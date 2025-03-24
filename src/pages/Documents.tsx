
import React from 'react';
import Layout from '../components/Layout';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { FileText, Download, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/complaint/ErrorBoundary';

// Helper function to format document type as a badge
const DocTypeBadge = ({ type }: { type: string | null }) => {
  if (!type) return null;
  
  const getColorClass = () => {
    switch (type.toLowerCase()) {
      case 'investigation': return 'bg-blue-100 text-blue-800';
      case 'lawsuit': return 'bg-orange-100 text-orange-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'complaint': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getColorClass()}`}>
      {type}
    </span>
  );
};

// Document table with pagination
const DocumentsTable = () => {
  const { 
    documents, 
    isLoading, 
    error, 
    page, 
    setPage, 
    pageSize, 
    totalCount 
  } = useDocumentsData();
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-500 mx-auto mb-4"></div>
          <p className="text-portal-600">Loading documents...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg border border-red-100">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading documents</h2>
        <p className="text-red-500">Please try again later</p>
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-portal-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-portal-700 mb-2">No documents found</h3>
        <p className="text-portal-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableCaption>
            Showing {documents.length} of {totalCount} documents
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Document</TableHead>
              <TableHead className="w-[15%]">Type</TableHead>
              <TableHead className="w-[20%]">Date</TableHead>
              <TableHead className="w-[10%]">Related To</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.document_id}>
                <TableCell className="font-medium">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-portal-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-portal-900">{doc.doc_title}</p>
                      {doc.description && (
                        <p className="text-sm text-portal-500 line-clamp-2 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DocTypeBadge type={doc.doc_type} />
                </TableCell>
                <TableCell>
                  {doc.created_at ? format(new Date(doc.created_at), 'MMM d, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {doc.complaint_id ? `Complaint #${doc.complaint_id}` : 
                   doc.officer_id ? `Officer #${doc.officer_id}` : 
                   doc.lawsuit_id ? `Lawsuit #${doc.lawsuit_id}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {doc.file_url ? (
                      <a 
                        href={doc.file_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-portal-100 text-portal-700"
                        title="View document"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                    {doc.file_url ? (
                      <a 
                        href={doc.file_url} 
                        download
                        className="p-2 rounded-md hover:bg-portal-100 text-portal-700"
                        title="Download document"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages: current-2, current-1, current, current+1, current+2
              // But ensure we're showing pages 1 to 5 at the beginning
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (page <= 3) {
                pageToShow = i + 1;
              } else if (page >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = page - 2 + i;
              }
              
              return (
                <PaginationItem key={pageToShow}>
                  <PaginationLink 
                    isActive={pageToShow === page}
                    onClick={() => setPage(pageToShow)}
                  >
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const Documents = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-md">
          <CardHeader className="border-b bg-muted/50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-2xl text-portal-900">Document Repository</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="search"
                placeholder="Search documents by title, type, or content..."
                className="w-full pl-10 p-2 rounded-md border border-input bg-background hover:border-accent focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <ErrorBoundary>
              <DocumentsTable />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documents;
