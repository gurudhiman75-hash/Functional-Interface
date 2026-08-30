import type {
  GeoJsonAreaGeometry,
  GeoJsonFeature,
  GeoJsonLineString,
  IndiaAdminFeatureCollection,
  Position,
} from "./geojson";

const EPSILON = 1e-10;

function collectRingIntersections(ring: Position[], longitude: number): number[] {
  const ys: number[] = [];
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    const crosses = (x1 <= longitude && longitude < x2) || (x2 <= longitude && longitude < x1);
    if (!crosses) continue;
    const t = (longitude - x1) / (x2 - x1);
    ys.push(y1 + t * (y2 - y1));
  }
  return ys;
}

function clipLongitudeToPolygon(polygon: Position[][], longitude: number): Array<[number, number]> {
  const intersections = polygon
    .flatMap((ring) => collectRingIntersections(ring, longitude))
    .sort((a, b) => a - b);
  const deduped = intersections.filter(
    (value, index) => index === 0 || Math.abs(value - intersections[index - 1]) > EPSILON,
  );
  if (deduped.length % 2 !== 0) {
    throw new Error(`Invalid polygon scanline intersection count ${deduped.length} at longitude ${longitude}`);
  }

  const intervals: Array<[number, number]> = [];
  for (let i = 0; i < deduped.length; i += 2) {
    const start = deduped[i];
    const end = deduped[i + 1];
    if (end - start > EPSILON) intervals.push([start, end]);
  }
  return intervals;
}

function clipLongitudeToArea(geometry: GeoJsonAreaGeometry, longitude: number): Array<[number, number]> {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => clipLongitudeToPolygon(polygon, longitude));
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

function normalizeAdminLabel(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");
}

export interface LongitudeStateSegment {
  stateName: string;
  stateCode: string;
  longitude: number;
  line: GeoJsonFeature<GeoJsonLineString, { stateName: string; stateCode: string }>;
}

export interface LongitudeDistrictSegment {
  stateName: string;
  stateCode: string;
  districtName: string;
  districtCode?: string;
  longitude: number;
  line: GeoJsonFeature<
    GeoJsonLineString,
    { stateName: string; stateCode: string; districtName: string; districtCode?: string }
  >;
}

export function compileLongitudeSegmentsForState(
  geometry: IndiaAdminFeatureCollection,
  longitude: number,
  stateName: string,
): LongitudeStateSegment[] {
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(`Invalid longitude ${longitude}`);
  }
  const features = geometry.features.filter((feature) => feature.properties.stateName.trim() === stateName);
  if (features.length === 0) throw new Error(`No geometry found for state ${stateName}`);

  const intervals = mergeIntervals(features.flatMap((feature) => clipLongitudeToArea(feature.geometry, longitude)));
  if (intervals.length === 0) throw new Error(`Longitude ${longitude} does not intersect ${stateName}`);
  const stateCode = features[0].properties.stateCode;

  return intervals.map(([south, north]) => ({
    stateName,
    stateCode,
    longitude,
    line: {
      type: "Feature",
      properties: { stateName, stateCode },
      geometry: {
        type: "LineString",
        coordinates: [
          [longitude, south],
          [longitude, north],
        ],
      },
    },
  }));
}

export function compileLongitudeSegmentsForDistrict(
  geometry: IndiaAdminFeatureCollection,
  longitude: number,
  stateName: string,
  districtName: string,
): LongitudeDistrictSegment[] {
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(`Invalid longitude ${longitude}`);
  }

  const stateKey = normalizeAdminLabel(stateName);
  const districtKey = normalizeAdminLabel(districtName);
  const features = geometry.features.filter(
    (feature) =>
      normalizeAdminLabel(feature.properties.stateName) === stateKey &&
      typeof feature.properties.districtName === "string" &&
      normalizeAdminLabel(feature.properties.districtName) === districtKey,
  );
  if (features.length === 0) {
    throw new Error(`No geometry found for district ${districtName} in ${stateName}`);
  }

  const intervals = mergeIntervals(features.flatMap((feature) => clipLongitudeToArea(feature.geometry, longitude)));
  if (intervals.length === 0) {
    throw new Error(`Longitude ${longitude} does not intersect district ${districtName} in ${stateName}`);
  }

  const stateCode = features[0].properties.stateCode;
  const canonicalDistrictName = features[0].properties.districtName ?? districtName;
  const districtCode = features[0].properties.districtCode;

  return intervals.map(([south, north]) => ({
    stateName,
    stateCode,
    districtName: canonicalDistrictName,
    districtCode,
    longitude,
    line: {
      type: "Feature",
      properties: {
        stateName,
        stateCode,
        districtName: canonicalDistrictName,
        ...(districtCode ? { districtCode } : {}),
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [longitude, south],
          [longitude, north],
        ],
      },
    },
  }));
}

export function compileLongitudeAcrossIndia(
  geometry: IndiaAdminFeatureCollection,
  longitude: number,
): GeoJsonLineString[] {
  const intervals = mergeIntervals(
    geometry.features.flatMap((feature) => clipLongitudeToArea(feature.geometry, longitude)),
  );
  if (intervals.length === 0) {
    throw new Error(`Longitude ${longitude} does not intersect canonical India geometry`);
  }
  return intervals.map(([south, north]) => ({
    type: "LineString",
    coordinates: [
      [longitude, south],
      [longitude, north],
    ],
  }));
}
