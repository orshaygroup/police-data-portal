import { point, booleanPointInPolygon } from '@turf/turf';

// Complaint type for filtering
export interface ComplaintForFilter {
  id: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

// Check if a point is inside a polygon (GeoJSON)
export function isPointInPolygon(pointCoords: [number, number], polygon: any): boolean {
  const pt = point(pointCoords);
  return booleanPointInPolygon(pt, polygon);
}

// Filter complaints by area geometry (GeoJSON)
export function filterComplaintsByArea(complaints: ComplaintForFilter[], areaGeoJson: any) {
  return complaints.filter(c =>
    isPointInPolygon([c.longitude, c.latitude], areaGeoJson)
  );
}