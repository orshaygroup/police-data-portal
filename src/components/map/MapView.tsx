
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MapLoadingState from './MapLoadingState';

interface MapViewProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  heatmapLayer?: boolean;
  interactiveMarkers?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  className = '',
  height = '400px',
  width = '100%',
  style = {},
  initialCenter = [-90.0715, 29.9511], // New Orleans coordinates
  initialZoom = 10.33,
  heatmapLayer = true,
  interactiveMarkers = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTokenError, setIsTokenError] = useState(false);

  // Fetch the Mapbox token from the Edge Function
  const fetchMapboxToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsTokenError(false);
      
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) {
        console.error('Error fetching Mapbox token:', error);
        setError('Failed to load map: Could not retrieve API key');
        toast({
          title: "Map Error",
          description: "Could not load the map. Please try again later.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (data && data.error) {
        console.error('Error in token response:', data.error);
        setError(data.error);
        
        // Check if it's a token format error
        if (data.error.includes('public token') || data.details?.includes('public token')) {
          setIsTokenError(true);
          toast({
            title: "Mapbox Token Error",
            description: "Invalid token format. Please update to a public token (pk.*) in Supabase secrets.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Map Error",
            description: "Could not initialize the map. Please try again later.",
            variant: "destructive"
          });
        }
        
        setIsLoading(false);
        return;
      }
      
      if (data && data.token) {
        setMapboxToken(data.token);
      } else {
        setError('Failed to load map: Invalid API key');
        toast({
          title: "Map Error",
          description: "Could not initialize the map. Please try again later.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Exception when fetching Mapbox token:', err);
      setError('Failed to load map: Network error');
      setIsLoading(false);
      toast({
        title: "Map Error",
        description: "Could not load map data. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  // Fetch the token on component mount
  useEffect(() => {
    fetchMapboxToken();
  }, []);

  // Initialize the map once we have the token
  useEffect(() => {
    // Only initialize the map if we have the token and the container is ready
    if (!mapboxToken || !mapContainer.current || map.current) return;

    try {
      // Set the Mapbox access token
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/krystalklean/cm7l36unb009x01qpg2jabkuf',
        center: initialCenter,
        zoom: initialZoom,
        pitch: 5,
        interactive: true
      });

      // Add navigation controls (zoom, pan, etc)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle map load
      map.current.on('load', () => {
        setMapLoaded(true);
        console.log('Mapbox map loaded successfully');
      });

      // Add popup for interactive markers if enabled
      if (interactiveMarkers) {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.current.on('mouseenter', 'complaint-points', (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;
          
          // Change the cursor style
          map.current.getCanvas().style.cursor = 'pointer';
          
          const feature = e.features[0];
          const coordinates = feature.geometry.type === 'Point' 
            ? (feature.geometry as any).coordinates.slice() 
            : null;
            
          if (!coordinates) return;
          
          const description = `
            <strong>Complaint ID: ${feature.properties?.complaint_id || 'Unknown'}</strong><br/>
            Type: ${feature.properties?.complaint_type || 'Not specified'}<br/>
            Date: ${feature.properties?.incident_date || 'Unknown'}<br/>
            Status: ${feature.properties?.final_finding || 'Pending'}
          `;
          
          popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
        });

        map.current.on('mouseleave', 'complaint-points', () => {
          if (!map.current) return;
          map.current.getCanvas().style.cursor = '';
          popup.remove();
        });
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err.message}`);
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please try again later.",
        variant: "destructive"
      });
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, initialCenter, initialZoom, interactiveMarkers]);

  // Resize handler to make the map responsive
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Show loading state while fetching the token or initializing the map
  if (isLoading) {
    return (
      <MapLoadingState 
        height={height} 
        width={width} 
        message="Loading map..."
      />
    );
  }

  // Show error state if there was a problem
  if (error) {
    return (
      <MapLoadingState 
        height={height} 
        width={width} 
        error={error}
        isTokenError={isTokenError}
        retryFn={fetchMapboxToken}
      />
    );
  }

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden ${className}`} 
      style={{ 
        height, 
        width, 
        ...style 
      }}
    >
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-portal-900">
        Police Complaints Heatmap
      </div>
    </div>
  );
};

export default MapView;
