import type { GeoJsonLineString } from "../geometry/geojson";

export type StaticGkSceneLayer =
  | "base-map"
  | "latitude-line"
  | "longitude-line"
  | "state-highlight"
  | "district-highlight"
  | "point-marker"
  | "labels"
  | "quiz";

export interface StaticGkSceneViewport {
  aspectRatio: "9:16";
  width: 1080;
  height: 1920;
  safeArea: { top: number; right: number; bottom: number; left: number };
  projection: "geoMercator";
}

export interface StaticGkSceneCue {
  id: string;
  startMs: number;
  endMs: number;
  layer: StaticGkSceneLayer;
  action: "show" | "trace" | "highlight" | "label" | "hold" | "quiz";
  targetRef?: string;
  text?: string;
  factIds: string[];
}

export interface StaticGkResolvedLatitudeSegment {
  stateName: string;
  stateCode: string;
  geometry: GeoJsonLineString;
}

export interface StaticGkSceneGeometrySource {
  geometryId: string;
  sourceProductCode: string;
  sourceArchiveSha256?: string;
  canonicalGeoJsonSha256?: string;
}

export interface StaticGkSceneQuiz {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface StaticGkSceneQa {
  requiredFactIds: string[];
  requiredGeoTargetIds: string[];
  assertions: string[];
}

export interface StaticGkMapPathSceneRecipe {
  schemaVersion: "1.0";
  rendererVersion: "atlas-map-v1";
  visualId: string;
  title: string;
  template: "india-map-path";
  status: "geometry-pending" | "render-ready";
  viewport: StaticGkSceneViewport;
  geometrySource: StaticGkSceneGeometrySource;
  route: {
    latitude: number;
    editorialLabel: string;
    orderedStateNames: string[];
    resolvedSegments: StaticGkResolvedLatitudeSegment[];
  };
  cues: StaticGkSceneCue[];
  narration: Array<{ id: string; text: string; factIds: string[] }>;
  quiz: StaticGkSceneQuiz;
  qa: StaticGkSceneQa;
}

export interface StaticGkMeridianSceneRecipe {
  schemaVersion: "1.0";
  rendererVersion: "atlas-map-v1";
  visualId: string;
  title: string;
  template: "india-map-path";
  status: "geometry-pending" | "district-verification-pending" | "render-ready";
  viewport: StaticGkSceneViewport;
  geometrySource: StaticGkSceneGeometrySource;
  meridian: {
    longitude: number;
    editorialLabel: string;
    indiaSegments: GeoJsonLineString[];
    upSegments: GeoJsonLineString[];
  };
  districtOfInterest: {
    id: "district.mirzapur";
    name: "Mirzapur";
    stateName: "Uttar Pradesh";
    featureCount: number;
    meridianSegments: GeoJsonLineString[];
  };
  cues: StaticGkSceneCue[];
  narration: Array<{ id: string; text: string; factIds: string[] }>;
  quiz: StaticGkSceneQuiz;
  qa: StaticGkSceneQa;
}
