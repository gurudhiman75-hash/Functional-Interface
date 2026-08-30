import type {
  GeoJsonAreaGeometry,
  GeoJsonFeature,
  GeoJsonLineString,
  IndiaAdminFeatureCollection,
  IndiaAdminProperties,
  Position,
} from "./geojson";

export interface LatitudeStateSegment {
  stateName: string;
  stateCode: string;
  latitude: number;
  line: GeoJsonFeature<GeoJsonLineString, { stateName: string; stateCode: string }>;
}

const EPSILON = 1e-10;

function collectRingIntersections(ring: Position[], latitude: number): number[] {
  const xs: number[] = [];
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];

    // Half-open edge test avoids double-counting vertices shared by adjacent edges.
    const crosses = (y1 <= latitude && latitude < y2) || (y2 <= latitude && latitude < y1);
    if (!crosses) continue;
    const t = (latitude - y1) / (y2 - y1);
    xs.push(x1 + t * (x2 - x1));
  }
  return xs;
}

function clipLatitudeToPolygon(polygon: Position[][], latitude: number): Array<[number, number]> {
  const intersections = polygon.flatMap((ring) => collectRingIntersections(ring, latitude)).sort((a, b) => a - b);
  const deduped = intersections.filter((value, index) => index === 0 || Math.abs(value - intersections[index - 1]) > EPSILON);
  if (deduped.length % 2 !== 0) {
    throw new Error(`Invalid polygon scanline intersection count ${deduped.length} at latitude ${latitude}`);
  }

  const intervals: Array<[number, number]> = [];
  for (let i = 0; i < deduped.length; i += 2) {
    const start = deduped[i];
    const end = deduped[i + 1];
    if (end - start > EPSILON) intervals.push([start, end]);
  }
  return intervals;
}

function clipLatitudeToArea(geometry: GeoJsonAreaGeometry, latitude: number): Array<[number, number]> {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => clipLatitudeToPolygon(polygon, latitude));
}

function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const previous = merged[merged.length - 1];
    if (current[0] <= previous[1] + EPSILON) previous[1] = Math.max(previous[1], current[1]);
    else merged.push([current[0], current[1]]);
  }
  return merged;
}

function groupStateFeatures(geometry: IndiaAdminFeatureCollection): Map<string, Array<{ geometry: GeoJsonAreaGeometry; properties: IndiaAdminProperties }>> {
  const grouped = new Map<string, Array<{ geometry: GeoJsonAreaGeometry; properties: IndiaAdminProperties }>>();
  for (const feature of geometry.features) {
    const key = feature.properties.stateName.trim();
    const collection = grouped.get(key) ?? [];
    collection.push({ geometry: feature.geometry, properties: feature.properties });
    grouped.set(key, collection);
  }
  return grouped;
}

export function compileLatitudeSegmentsByState(
  geometry: IndiaAdminFeatureCollection,
  latitude: number,
  orderedStateNames: readonly string[],
): LatitudeStateSegment[] {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) throw new Error(`Invalid latitude ${latitude}`);
  const grouped = groupStateFeatures(geometry);

  return orderedStateNames.map((stateName) => {
    const features = grouped.get(stateName);
    if (!features?.length) throw new Error(`No geometry found for state ${stateName}`);
    const intervals = mergeIntervals(features.flatMap((feature) => clipLatitudeToArea(feature.geometry, latitude)));
    if (intervals.length === 0) throw new Error(`Latitude ${latitude} does not intersect ${stateName}`);

    const widest = intervals.reduce((best, interval) => (interval[1] - interval[0] > best[1] - best[0] ? interval : best));
    const stateCode = features[0].properties.stateCode;
    return {
      stateName,
      stateCode,
      latitude,
      line: {
        type: "Feature",
        properties: { stateName, stateCode },
        geometry: {
          type: "LineString",
          coordinates: [
            [widest[0], latitude],
            [widest[1], latitude],
          ],
        },
      },
    };
  });
}

export function assertWestToEastOrder(segments: readonly LatitudeStateSegment[], expectedStateNames: readonly string[]): void {
  if (segments.length !== expectedStateNames.length) throw new Error("State segment count differs from fact-locked sequence");
  let previousLongitude = -Infinity;
  segments.forEach((segment, index) => {
    if (segment.stateName !== expectedStateNames[index]) {
      throw new Error(`State order mismatch at ${index}: expected ${expectedStateNames[index]}, received ${segment.stateName}`);
    }
    const startLongitude = segment.line.geometry.coordinates[0][0];
    if (startLongitude + EPSILON < previousLongitude) {
      throw new Error(`Geographic west-to-east order fails at ${segment.stateName}`);
    }
    previousLongitude = startLongitude;
  });
}
