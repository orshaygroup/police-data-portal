
import React from 'react';
import { useIntercom } from '@/hooks/useIntercom';

const IntercomChat: React.FC = () => {
  // Use our custom hook to handle Intercom initialization
  const { isLoaded, isError } = useIntercom();

  // This component doesn't render anything visible
  // It just initializes Intercom in the background
  return null;
};

export default IntercomChat;
