export type Position = [longitude: number, latitude: number];

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: Position[][];
}

export interface GeoJsonMultiPolygon {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export interface GeoJsonLineString {
  type: "LineString";
  coordinates: Position[];
}

export interface GeoJsonMultiLineString {
  type: "MultiLineString";
  coordinates: Position[][];
}

export type GeoJsonAreaGeometry = GeoJsonPolygon | GeoJsonMultiPolygon;
export type GeoJsonLinearGeometry = GeoJsonLineString | GeoJsonMultiLineString;

export interface GeoJsonFeature<G, P extends Record<string, unknown> = Record<string, unknown>> {
  type: "Feature";
  id?: string | number;
  properties: P;
  geometry: G;
}

export interface GeoJsonFeatureCollection<G, P extends Record<string, unknown> = Record<string, unknown>> {
  type: "FeatureCollection";
  features: Array<GeoJsonFeature<G, P>>;
}

export interface IndiaAdminProperties extends Record<string, unknown> {
  stateName: string;
  stateCode: string;
  districtName?: string;
  districtCode?: string;
}

export type IndiaAdminFeature = GeoJsonFeature<GeoJsonAreaGeometry, IndiaAdminProperties>;
export type IndiaAdminFeatureCollection = GeoJsonFeatureCollection<GeoJsonAreaGeometry, IndiaAdminProperties>;

export function assertFinitePosition(position: Position, context: string): void {
  const [longitude, latitude] = position;
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new Error(`${context}: non-finite coordinate`);
  }
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new Error(`${context}: coordinate outside EPSG:4326 bounds`);
  }
}

export function assertAreaGeometryIsValid(geometry: GeoJsonAreaGeometry, context: string): void {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  if (polygons.length === 0) throw new Error(`${context}: no polygons`);

  polygons.forEach((polygon, polygonIndex) => {
    if (polygon.length === 0) throw new Error(`${context}: polygon ${polygonIndex} has no rings`);
    polygon.forEach((ring, ringIndex) => {
      if (ring.length < 4) throw new Error(`${context}: ring ${polygonIndex}/${ringIndex} has fewer than four positions`);
      ring.forEach((position, positionIndex) => assertFinitePosition(position, `${context}:${polygonIndex}/${ringIndex}/${positionIndex}`));
    });
  });
}
