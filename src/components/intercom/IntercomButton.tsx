
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

  // This button can still be used as an additional way to open the chat
  // But the floating launcher will be shown by default
  return (
    <Button 
      onClick={openMessenger} 
      disabled={!isLoaded} 
      className={`flex items-center gap-2 ${className}`}
      variant="secondary"
    >
      <MessageSquare size={18} />
      {text}
    </Button>
  );
};

export default IntercomButton;
