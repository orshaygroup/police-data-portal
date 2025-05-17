
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    Intercom?: any;
    intercomSettings?: any;
  }
}

// Define the Intercom function interface with the properties we need
interface IntercomFunction extends Function {
  c: (args: any) => void;
  q: any[];
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
        
        // Initialize Intercom with the fetched App ID and make the launcher visible
        window.intercomSettings = {
          app_id: appId,
          alignment: 'right',
          horizontal_padding: 20,
          vertical_padding: 20,
          hide_default_launcher: false, // Show the default floating launcher
          custom_launcher_selector: '', // No custom launcher
          background_color: '#6E59A5', // Purple color for the launcher
          launcher_color: '#FFFFFF' // White icon color
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
            } as unknown as IntercomFunction; // Cast to our custom interface
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
        
        // Boot Intercom with custom styling settings
        if (window.Intercom) {
          window.Intercom('boot', {
            app_id: appId,
            hide_default_launcher: false,
            custom_launcher_selector: '',
            alignment: 'right',
            horizontal_padding: 20,
            vertical_padding: 20
          });
        }
        
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
