/**
 * Estimate travel time in minutes from distance (km) and speed (km/h).
 * @param distanceKm Distance in kilometers
 * @param speedKmh Speed in kilometers per hour (default: 30 km/h for city traffic)
 * @returns Estimated time in minutes (rounded up)
 */
export function getTravelTime(distanceKm: number, speedKmh: number = 30): number {
  if (!distanceKm || distanceKm === Infinity) return -1;
  const hours = distanceKm / speedKmh;
  return Math.ceil(hours * 60); // in minutes
}