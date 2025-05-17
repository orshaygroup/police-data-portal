
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    Intercom?: any;
    intercomSettings?: any;
  }
}

export const useIntercom = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    const loadIntercom = async () => {
      try {
        // Fetch the Intercom App ID securely from our Edge Function
        const { data, error } = await supabase.functions.invoke('get-intercom-app-id');
        
        if (error || !data || !data.appId) {
          console.error('Error fetching Intercom App ID:', error || 'No App ID returned');
          setIsError(true);
          return;
        }
        
        const appId = data.appId;
        
        // Initialize Intercom with the fetched App ID
        window.intercomSettings = {
          app_id: appId,
          alignment: 'right',
          horizontal_padding: 20,
          vertical_padding: 20
        };
        
        // Load the Intercom script
        (function(){
          var w = window;
          var ic = w.Intercom;
          if (typeof ic === "function") {
            ic('reattach_activator');
            ic('update', w.intercomSettings);
          } else {
            var d = document;
            var i = function() {
              i.c(arguments);
            };
            i.q = [];
            i.c = function(args) {
              i.q.push(args);
            };
            w.Intercom = i;
            var l = function() {
              var s = d.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src = 'https://widget.intercom.io/widget/' + appId;
              var x = d.getElementsByTagName('script')[0];
              x.parentNode?.insertBefore(s, x);
            };
            l();
          }
        })();
        
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Intercom:', err);
        setIsError(true);
        toast({
          title: "Chat Widget Error",
          description: "Failed to load the chat support widget.",
          variant: "destructive"
        });
      }
    };

    // Load Intercom only once when the component mounts
    loadIntercom();

    // Cleanup function to remove Intercom when component unmounts
    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
        delete window.Intercom;
      }
    };
  }, []);

  // Method to open the Intercom messenger
  const openMessenger = () => {
    if (window.Intercom && isLoaded) {
      window.Intercom('show');
    }
  };

  return {
    isLoaded,
    isError,
    openMessenger
  };
};
