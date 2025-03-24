
import { useMemo } from 'react';

export const useFormattingUtils = () => {
  const formatDate = useMemo(() => (dateString?: string | null) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  }, []);

  const formatCurrency = useMemo(() => (amount?: number | null) => {
    if (amount == null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }, []);
  
  return { formatDate, formatCurrency };
};
