/**
 * Geolocation & Coordinate Transformation Utilities
 * Campus bounding box and spherical geometry
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

// Configurable Campus Reference Boundaries for GPS <-> Canvas Mapping
// Can be customized for any college or institution
export const CAMPUS_GEO_BOUNDS = {
  // Southwest corner (approx bottom-left: x=0, y=800)
  minLat: 20.24750,
  minLng: 85.79600,
  // Northeast corner (approx top-right: x=1000, y=0)
  maxLat: 20.25330,
  maxLng: 85.80320,
  canvasWidth: 1000,
  canvasHeight: 800,
};

const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate Great-Circle Distance using Haversine formula (meters)
 */
export function haversineDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Convert GPS (lat, lng) to Campus Canvas (x, y) coordinates
 */
export function gpsToCanvas(geo: GeoPoint): Point2D {
  const { minLat, maxLat, minLng, maxLng, canvasWidth, canvasHeight } = CAMPUS_GEO_BOUNDS;

  const clampedLat = Math.max(minLat, Math.min(maxLat, geo.lat));
  const clampedLng = Math.max(minLng, Math.min(maxLng, geo.lng));

  // Latitude: higher latitude is North (top of map, y = 0)
  const normY = (maxLat - clampedLat) / (maxLat - minLat);
  // Longitude: higher longitude is East (right of map, x = canvasWidth)
  const normX = (clampedLng - minLng) / (maxLng - minLng);

  return {
    x: Math.round(normX * canvasWidth),
    y: Math.round(normY * canvasHeight),
  };
}

/**
 * Convert Campus Canvas (x, y) to GPS (lat, lng)
 */
export function canvasToGps(pt: Point2D): GeoPoint {
  const { minLat, maxLat, minLng, maxLng, canvasWidth, canvasHeight } = CAMPUS_GEO_BOUNDS;

  const clampedX = Math.max(0, Math.min(canvasWidth, pt.x));
  const clampedY = Math.max(0, Math.min(canvasHeight, pt.y));

  const normX = clampedX / canvasWidth;
  const normY = clampedY / canvasHeight;

  const lat = maxLat - normY * (maxLat - minLat);
  const lng = minLng + normX * (maxLng - minLng);

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
}

/**
 * Calculate Initial Bearing from p1 to p2 in degrees (0 to 360)
 */
export function calculateBearing(p1: GeoPoint, p2: GeoPoint): number {
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const initialBearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (initialBearing + 360) % 360;
}

/**
 * Calculate turn angle difference between two bearings (-180 to +180 deg)
 * Positive = Right turn, Negative = Left turn
 */
export function calculateTurnAngle(bearing1: number, bearing2: number): number {
  let diff = bearing2 - bearing1;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

/**
 * Distance in meters from a point to a line segment (a -> b)
 */
export function distanceToSegmentMeters(point: GeoPoint, a: GeoPoint, b: GeoPoint): number {
  const dAB = haversineDistanceMeters(a, b);
  if (dAB < 0.1) return haversineDistanceMeters(point, a);

  // Vector projection in local approximation
  const dAP = haversineDistanceMeters(a, point);
  const dBP = haversineDistanceMeters(b, point);

  // Cosine rule check for projection bounds
  const cosA = (dAB * dAB + dAP * dAP - dBP * dBP) / (2 * dAB * dAP || 1);
  if (cosA < 0) return dAP; // Closer to endpoint A

  const cosB = (dAB * dAB + dBP * dBP - dAP * dAP) / (2 * dAB * dBP || 1);
  if (cosB < 0) return dBP; // Closer to endpoint B

  // Perpendicular distance
  const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
  return dAP * sinA;
}
