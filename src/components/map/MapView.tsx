
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Use the existing Mapbox token from your project
mapboxgl.accessToken = 'pk.eyJ1Ijoia3J5c3RhbGtsZWFuIiwiYSI6ImNtN2RtaWNhNzA0eXIycW9oNXF2ZGRvN3oifQ.UcFuoQmTxIPGo12Tz8Wq5w';

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

  useEffect(() => {
    // Initialize the map only once
    if (!map.current && mapContainer.current) {
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
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom, interactiveMarkers]);

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
