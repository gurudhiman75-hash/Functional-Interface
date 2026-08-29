import type { GeoJsonLineString } from "../geometry/geojson";

export type StaticGkSceneLayer = "base-map" | "latitude-line" | "state-highlight" | "labels" | "quiz";

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

export interface StaticGkMapPathSceneRecipe {
  schemaVersion: "1.0";
  rendererVersion: "atlas-map-v1";
  visualId: string;
  title: string;
  template: "india-map-path";
  status: "geometry-pending" | "render-ready";
  viewport: StaticGkSceneViewport;
  geometrySource: {
    geometryId: string;
    sourceProductCode: string;
    sourceArchiveSha256?: string;
    canonicalGeoJsonSha256?: string;
  };
  route: {
    latitude: number;
    editorialLabel: string;
    orderedStateNames: string[];
    resolvedSegments: StaticGkResolvedLatitudeSegment[];
  };
  cues: StaticGkSceneCue[];
  narration: Array<{ id: string; text: string; factIds: string[] }>;
  quiz: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  };
  qa: {
    requiredFactIds: string[];
    requiredGeoTargetIds: string[];
    assertions: string[];
  };
}
