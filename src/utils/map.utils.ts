import { LatLng, Region } from 'react-native-maps';

export function getRegionForCoordinates(points: LatLng[]) {
  const delta = 0.0025;
  // points should be an array of { latitude: X, longitude: Y }
  let minX: number, maxX: number, minY: number, maxY: number;
  
  // init first point
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);
  
  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude) - delta;
    maxX = Math.max(maxX, point.latitude) + delta;
    minY = Math.min(minY, point.longitude) - delta;
    maxY = Math.max(maxY, point.longitude) + delta;
  });
  
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = (maxX - minX);
  const deltaY = (maxY - minY);
  
  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY,
  };
}

export function getFocusedRegion(point: LatLng): Region {
  return {
    latitude: point.latitude,
    longitude: point.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };
}