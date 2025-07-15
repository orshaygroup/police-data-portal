import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MapLoadingState from './MapLoadingState';
import { useMapDataContext } from '@/hooks/useMapDataContext';
import * as turf from '@turf/turf';

const TILESETS = [
  {
    id: 'police_reporting',
    url: 'mapbox://krystalklean.3px6gf79',
    label: 'Police Reporting',
    sourceLayer: 'kx-new-orleans-police-reporti-7ewy2n',
    fillColor: '#0080ff'
  },
  {
    id: 'police_zones',
    url: 'mapbox://krystalklean.cky5mxls',
    label: 'Police Zones',
    sourceLayer: 'kx-new-orleans-police-zones-S-dxvjpf',
    fillColor: '#ff8800'
  },
  {
    id: 'police_districts',
    url: 'mapbox://krystalklean.a9qyys45',
    label: 'Police Districts',
    sourceLayer: 'kx-new-orleans-police-distric-d9j3zz',
    fillColor: '#00b894'
  },
  {
    id: 'neighborhood',
    url: 'mapbox://krystalklean.bmwzounq',
    label: 'Neighborhood',
    sourceLayer: 'kx-new-orleans-neighborhood-a-79fmou',
    fillColor: '#d72660'
  }
];

const DEFAULT_TILESET = TILESETS[3]; // Neighborhood as default

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTokenError, setIsTokenError] = useState(false);
  const [activeTileset, setActiveTileset] = useState(DEFAULT_TILESET);
  const { complaints, filteredComplaints, selectedArea, setSelectedArea } = useMapDataContext();

  // Fetch the Mapbox token from the Edge Function
  const fetchMapboxToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsTokenError(false);
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        setError('Failed to load map: Could not retrieve API key');
        setIsLoading(false);
        return;
      }
      if (data && data.token) {
        setMapboxToken(data.token);
      } else {
        setError('Failed to load map: Invalid API key');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load map: Network error');
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMapboxToken(); }, []);

  // Initialize the map and layers
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/krystalklean/cm7l36unb009x01qpg2jabkuf',
      center: [-90.0715, 29.9511],
      zoom: 10.33,
      pitch: 5,
      interactive: true
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.on('load', () => {
      setMapLoaded(true);
      // Add the default tileset
      addTilesetLayer(DEFAULT_TILESET);
      // Add heatmap layer
      addHeatmapLayer(filteredComplaints);
    });
    // Cleanup
    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, [mapboxToken]);

  // Add or update the heatmap layer when filteredComplaints change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    updateHeatmapLayer(filteredComplaints);
  }, [filteredComplaints, mapLoaded]);

  // Add or update the tileset layer when activeTileset changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    addTilesetLayer(activeTileset);
  }, [activeTileset, mapLoaded]);

  // --- Map Layer Helpers ---
  function addTilesetLayer(tileset: { id: string; url: string; label: string; sourceLayer: string; fillColor: string }) {
    if (!map.current) return;
    // Remove all previous tileset layers and sources
    TILESETS.forEach(ts => {
      if (map.current.getLayer(ts.id)) {
        map.current.removeLayer(ts.id);
      }
      if (map.current.getSource(ts.id)) {
        map.current.removeSource(ts.id);
      }
    });
    // Add new tileset source/layer
    map.current.addSource(tileset.id, {
      type: 'vector',
      url: tileset.url
    });
    map.current.addLayer({
      id: tileset.id,
      type: 'fill',
      source: tileset.id,
      'source-layer': tileset.sourceLayer,
      paint: {
        'fill-color': tileset.fillColor,
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.4,
          0.15
        ],
        'fill-outline-color': '#fff'
      }
    });
    // Hover and click events
    let hoveredId: number | null = null;
    map.current.on('mousemove', tileset.id, (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        if (hoveredId !== null) {
          map.current!.setFeatureState({ source: tileset.id, id: hoveredId }, { hover: false });
        }
        hoveredId = feature.id as number;
        map.current!.setFeatureState({ source: tileset.id, id: hoveredId }, { hover: true });
        // Show tooltip
        map.current!.getCanvas().style.cursor = 'pointer';
        const centroid = turf.centroid(feature).geometry.coordinates;
        const coordinates: [number, number] = Array.isArray(centroid) && centroid.length === 2 ? [centroid[0], centroid[1]] : [-90.0715, 29.9511];
        // Use the correct property for each tileset
        let name = tileset.label;
        if (tileset.id === 'neighborhood') {
          name = feature.properties?.Neighborho || tileset.label;
        } else if (tileset.id === 'police_zones') {
          name = feature.properties?.Zone || tileset.label;
        } else if (tileset.id === 'police_districts') {
          name = feature.properties?.District || tileset.label;
        } else if (tileset.id === 'police_reporting') {
          name = feature.properties?.name || tileset.label;
        }
        // Optionally show more info (like ID or Shape_Leng)
        const popupHtml = `
          <strong>${name}</strong>
          ${feature.properties?.id ? `<br/>ID: ${feature.properties.id}` : ''}
          ${feature.properties?.Shape_Leng ? `<br/>Length: ${feature.properties.Shape_Leng}` : ''}
        `;
        new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(coordinates)
          .setHTML(popupHtml)
          .addTo(map.current!);
      }
    });
    map.current.on('mouseleave', tileset.id, () => {
      if (hoveredId !== null) {
        map.current!.setFeatureState({ source: tileset.id, id: hoveredId }, { hover: false });
      }
      hoveredId = null;
      map.current!.getCanvas().style.cursor = '';
      // Remove popup
      const popups = document.getElementsByClassName('mapboxgl-popup');
      while (popups[0]) popups[0].remove();
    });
    map.current.on('click', tileset.id, (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        setSelectedArea(feature as any); // Save to context
        // Zoom to area
        const bbox = turf.bbox(feature);
        map.current!.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 40 });
      }
    });
  }

  function addHeatmapLayer(complaints: any[]) {
    if (!map.current) return;
    if (map.current.getSource('complaints')) {
      map.current.removeLayer('complaints-heatmap');
      map.current.removeSource('complaints');
    }
    map.current.addSource('complaints', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: complaints.map(c => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [c.longitude, c.latitude] },
          properties: { ...c }
        }))
      }
    });
    map.current.addLayer({
      id: 'complaints-heatmap',
      type: 'heatmap',
      source: 'complaints',
      maxzoom: 15,
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': 1.2,
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': 18,
        'heatmap-opacity': 0.7
      }
    });
  }

  function updateHeatmapLayer(complaints: any[]) {
    if (!map.current) return;
    if (map.current.getSource('complaints')) {
      (map.current.getSource('complaints') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: complaints.map(c => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [c.longitude, c.latitude] },
          properties: { ...c }
        }))
      });
    } else {
      addHeatmapLayer(complaints);
    }
  }

  // Show loading state while fetching the token or initializing the map
  if (isLoading) {
    return (
      <MapLoadingState 
        height={400} 
        width={'100%'} 
        message="Loading map..."
      />
    );
  }
  if (error) {
    return (
      <MapLoadingState 
        height={400} 
        width={'100%'} 
        error={error}
        isTokenError={isTokenError}
        retryFn={fetchMapboxToken}
      />
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 400, width: '100%' }}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        {TILESETS.map(ts => (
          <button
            key={ts.id}
            className={`px-2 py-1 rounded ${activeTileset.id === ts.id ? 'bg-blue-600 text-white' : 'bg-white/80 text-blue-900'}`}
            onClick={() => setActiveTileset(ts)}
          >
            {ts.label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-portal-900">
        Police Complaints Heatmap
      </div>
    </div>
  );
};

export default MapView;
