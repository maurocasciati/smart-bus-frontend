import { LatLng, Region } from 'react-native-maps';

export function getRegionForCoordinates(points: LatLng[]) {
  const delta = 0.002;
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
    minX = Math.min(minX, point.latitude) - 2  *delta;
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

export function getDistance(point1: LatLng, point2: LatLng): number {
  const prevLatInRad = toRad(point1.latitude);
  const prevLongInRad = toRad(point1.longitude);
  const latInRad = toRad(point2.latitude);
  const longInRad = toRad(point2.longitude);

  const dis = (
    6377.830272 * // Radio de la tierra en KMs
    1000 * // Pasado a metros
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
    )
  );

  console.log(dis);

  return dis;
}

function toRad(angle: number) {
  return (angle * Math.PI) / 180;
}