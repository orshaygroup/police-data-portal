
import React from 'react';
import { useIntercom } from '@/hooks/useIntercom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface IntercomButtonProps {
  text?: string;
  className?: string;
}

const IntercomButton: React.FC<IntercomButtonProps> = ({ 
  text = "Chat with Support", 
  className = "" 
}) => {
  const { openMessenger, isLoaded } = useIntercom();

  return (
    <Button 
      onClick={openMessenger} 
      disabled={!isLoaded} 
      className={`flex items-center gap-2 ${className}`}
    >
      <MessageSquare size={18} />
      {text}
    </Button>
  );
};

export default IntercomButton;
