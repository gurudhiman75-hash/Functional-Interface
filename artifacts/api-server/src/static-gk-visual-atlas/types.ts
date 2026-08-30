export type StaticGkLocale = "en" | "hi" | "pa";

export type StaticGkDomain =
  | "india-geography"
  | "world-geography"
  | "history"
  | "art-culture"
  | "environment"
  | "polity-static"
  | "economy-static";

export type StaticGkVisualTemplate =
  | "india-map-path"
  | "india-state-highlight"
  | "india-point-zoom"
  | "india-region-compare"
  | "timeline-map"
  | "object-3d"
  | "compare-split"
  | "rapid-recall";

export type StaticGkAuthoringState =
  | "backlog"
  | "fact-lock"
  | "storyboard"
  | "render-ready"
  | "rendered"
  | "qa"
  | "approved"
  | "published"
  | "retired";

export type StaticGkFactStability = "stable" | "review-periodically" | "time-sensitive";

export interface StaticGkSourceReference {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  editionOrVersion?: string;
  checkedAt: string;
  notes?: string;
}

export interface StaticGkFact {
  id: string;
  statement: string;
  sourceIds: string[];
  stability: StaticGkFactStability;
  examImportance: "core" | "supporting" | "enrichment";
  visualRole?: "label" | "route" | "highlight" | "callout" | "quiz" | "voiceover-only";
}

export interface StaticGkGeoTarget {
  id: string;
  name: string;
  kind: "country" | "state" | "ut" | "river" | "mountain" | "pass" | "dam" | "lake" | "park" | "city" | "point" | "region";
  geometryRef?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
}

export interface StaticGkVisualBeat {
  id: string;
  startMs: number;
  endMs: number;
  action:
    | "show"
    | "hide"
    | "highlight"
    | "trace-path"
    | "zoom"
    | "pan"
    | "rotate"
    | "label"
    | "compare"
    | "quiz-pause";
  targetIds: string[];
  text?: string;
  factIds: string[];
  cameraPreset?: string;
}

export interface StaticGkQuizPrompt {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  factIds: string[];
}

export interface StaticGkLocalizedCopy {
  locale: StaticGkLocale;
  title: string;
  hook: string;
  voiceover: string;
  captions: string[];
  quiz?: StaticGkQuizPrompt;
}

export interface StaticGkVisualManifest {
  id: string;
  slug: string;
  domain: StaticGkDomain;
  category: string;
  subcategory: string;
  title: string;
  learningObjective: string;
  template: StaticGkVisualTemplate;
  authoringState: StaticGkAuthoringState;
  targetDurationSeconds: number;
  aspectRatio: "9:16";
  resolution: "1080x1920";
  locales: StaticGkLocale[];
  sourceRefs: StaticGkSourceReference[];
  facts: StaticGkFact[];
  geoTargets: StaticGkGeoTarget[];
  beats: StaticGkVisualBeat[];
  localizedCopy: StaticGkLocalizedCopy[];
  relatedTopicIds: string[];
  relatedQuestionIds: string[];
  tags: string[];
  rendererVersion: string;
  schemaVersion: "1.0";
}

export interface StaticGkPilotCandidate {
  id: string;
  title: string;
  domain: StaticGkDomain;
  category: string;
  subcategory: string;
  learningObjective: string;
  template: StaticGkVisualTemplate;
  priority: 1 | 2 | 3;
  targetDurationSeconds: number;
  visualAssets: string[];
  factLockRequired: string[];
  authoringState: "backlog" | "fact-lock";
}
