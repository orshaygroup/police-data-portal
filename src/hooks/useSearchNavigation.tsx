
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchResult } from './useSearchData';
import { toast } from '@/components/ui/use-toast';

export interface NavigationOptions {
  openInNewTab?: boolean;
  showToast?: boolean;
  preserveSearchTerm?: boolean;
  highlightId?: string;
}

/**
 * Custom hook that handles navigation logic for search results
 */
export const useSearchNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles navigation when a search result is clicked
   * 
   * @param result The search result that was clicked
   * @param options Navigation options
   * @param onNavigate Optional callback after navigation occurs
   */
  const navigateToResult = (
    result: SearchResult, 
    options: NavigationOptions = {}, 
    onNavigate?: () => void
  ) => {
    const { 
      openInNewTab = false, 
      showToast = false, 
      preserveSearchTerm = false,
      highlightId = '' 
    } = options;

    if (!result.id && !result.value) {
      console.error('Invalid search result for navigation:', result);
      return;
    }
    
    // For general search terms without specific ID
    if (!result.id) {
      const path = '/search';
      const state = { searchTerm: result.value };
      
      if (openInNewTab) {
        window.open(`${path}?q=${encodeURIComponent(result.value)}`, '_blank');
      } else {
        navigate(path, { state });
        
        if (showToast) {
          toast({
            title: "Search initiated",
            description: `Searching for "${result.value}"`,
          });
        }
      }
      
      onNavigate?.();
      return;
    }

    // Prepare navigation parameters
    let path = '';
    let params = '';
    let toastMessage = '';

    // Navigate based on result type
    switch (result.type) {
      case 'Officer':
        path = `/officers/${result.id}`;
        toastMessage = `Viewing officer profile`;
        break;
      case 'Incident':
        path = `/complaints/${result.id}`;
        toastMessage = `Viewing complaint details`;
        break;
      case 'Document':
        path = `/documents`;
        params = `?id=${result.id}${highlightId ? `&highlight=${highlightId}` : ''}`;
        toastMessage = `Viewing document: ${result.value}`;
        break;
      case 'Lawsuit':
        path = `/lawsuits`;
        params = `?id=${result.id}${highlightId ? `&highlight=${highlightId}` : ''}`;
        toastMessage = `Viewing lawsuit: ${result.value}`;
        break;
      default:
        // For other result types, use the search page with the value as search term
        path = '/search';
        params = `?q=${encodeURIComponent(result.value)}`;
        toastMessage = `Searching for ${result.type}: ${result.value}`;
    }

    // Handle navigation
    if (openInNewTab) {
      window.open(`${path}${params}`, '_blank');
    } else {
      navigate(`${path}${params}`);
      
      if (showToast) {
        toast({
          title: "Navigation",
          description: toastMessage,
        });
      }
    }

    // Save the search term to session storage if needed
    if (preserveSearchTerm && result.value) {
      sessionStorage.setItem('lastSearchTerm', result.value);
    }

    // Execute the callback if provided (e.g., to clear the search query)
    onNavigate?.();
  };

  /**
   * Retrieves the search parameters from the URL or location state
   */
  const getSearchParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('q') || 
      (location.state as { searchTerm?: string })?.searchTerm || 
      sessionStorage.getItem('lastSearchTerm') || 
      '';
    
    const currentId = queryParams.get('id');
    const highlightId = queryParams.get('highlight');
    
    return {
      searchTerm,
      currentId,
      highlightId
    };
  };

  /**
   * Constructs a search URL with the given parameters
   */
  const buildSearchUrl = (searchTerm: string, additionalParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    
    return `/search?${params.toString()}`;
  };

  return { 
    navigateToResult, 
    getSearchParams,
    buildSearchUrl
  };
};
