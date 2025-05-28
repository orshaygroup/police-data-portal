import * as turf from '@turf/turf';

// Complaint type for filtering
export interface ComplaintForFilter {
  id: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

// Check if a point is inside a polygon (GeoJSON)
export function isPointInPolygon(point: [number, number], polygon: turf.Feature<turf.Polygon | turf.MultiPolygon>): boolean {
  const pt = turf.point(point);
  return turf.booleanPointInPolygon(pt, polygon);
}

// Filter complaints by area geometry (GeoJSON)
export function filterComplaintsByArea(complaints: ComplaintForFilter[], areaGeoJson: turf.Feature<turf.Polygon | turf.MultiPolygon>) {
  return complaints.filter(c =>
    isPointInPolygon([c.longitude, c.latitude], areaGeoJson)
  );
} 