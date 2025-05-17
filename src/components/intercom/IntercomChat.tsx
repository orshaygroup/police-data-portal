
import React, { useEffect } from 'react';
import { useIntercom } from '@/hooks/useIntercom';

const IntercomChat: React.FC = () => {
  // Use our custom hook to handle Intercom initialization
  const { isLoaded, isError } = useIntercom();
  
  // Log status for debugging
  useEffect(() => {
    console.log('Intercom initialization status:', { isLoaded, isError });
  }, [isLoaded, isError]);

  // This component doesn't render anything visible
  // It just initializes Intercom in the background
  return null;
};

export default IntercomChat;
