
import { useNavigate } from 'react-router-dom';
import { SearchResult } from './useSearchData';

/**
 * Custom hook that handles navigation logic for search results
 */
export const useSearchNavigation = () => {
  const navigate = useNavigate();

  /**
   * Handles navigation when a search result is clicked
   * 
   * @param result The search result that was clicked
   * @param onNavigate Optional callback after navigation occurs
   */
  const navigateToResult = (result: SearchResult, onNavigate?: () => void) => {
    if (!result.id) {
      navigate('/search', { state: { searchTerm: result.value } });
      onNavigate?.();
      return;
    }

    // Navigate based on result type
    switch (result.type) {
      case 'Officer':
        navigate(`/officers/${result.id}`);
        break;
      case 'Incident':
        navigate(`/complaints/${result.id}`);
        break;
      case 'Document':
        navigate(`/documents?id=${result.id}`);
        break;
      case 'Lawsuit':
        navigate(`/lawsuits?id=${result.id}`);
        break;
      default:
        // For other result types, just use the search page with the value as search term
        navigate('/search', { state: { searchTerm: result.value } });
    }

    // Execute the callback if provided (e.g., to clear the search query)
    onNavigate?.();
  };

  return { navigateToResult };
};
