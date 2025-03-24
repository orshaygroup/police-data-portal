
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Document {
  document_id: number;
  doc_title: string;
  doc_type: string | null;
  description: string | null;
  created_at: string;
  file_url: string | null;
  officer_id: number | null;
  complaint_id: number | null;
  lawsuit_id: number | null;
}

export function useDocumentsData() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchDocuments = async (): Promise<{
    documents: Document[];
    count: number;
  }> => {
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize - 1;

    // Get total count
    const { count, error: countError } = await supabase
      .from('Police_Data_Documents')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching document count:', countError);
      throw new Error('Failed to load documents count');
    }

    // Get documents with pagination
    const { data, error } = await supabase
      .from('Police_Data_Documents')
      .select('*')
      .range(startRange, endRange)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to load documents');
    }

    return {
      documents: data as Document[],
      count: count || 0,
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', page],
    queryFn: fetchDocuments,
  });

  return {
    documents: data?.documents || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    page,
    setPage,
    pageSize,
  };
}
