import type { StaQlId, StaScenarioAuthority } from "./types.ts";

export type StaCorpusDomain =
  | "EDUCATION"
  | "BANKING_SERVICE"
  | "WORKPLACE"
  | "TRANSPORT"
  | "PUBLIC_SERVICE"
  | "CIVIC_ADMIN"
  | "CONSUMER_SERVICE"
  | "EVERYDAY_DECISION"
  | "DIGITAL_SERVICE"
  | "FACILITY_OPERATIONS";

export type StaSemanticShape =
  | "SINGLE_PRECONDITION"
  | "MULTI_PRECONDITION"
  | "NEED_PLUS_EFFICACY"
  | "NEED_PLUS_FEASIBILITY"
  | "NEED_PLUS_FEASIBILITY_PLUS_EFFICACY"
  | "AUDIENCE_RELEVANCE_PLUS_CAPABILITY"
  | "SERVICE_RELEVANCE_PLUS_CAPABILITY"
  | "EXPLICIT_PREMISE_PLUS_HIDDEN_BRIDGE";

export interface StaEnglishCorpusScenario extends StaScenarioAuthority {
  readonly corpusFamilyId: string;
  readonly domain: StaCorpusDomain;
  readonly semanticShape: StaSemanticShape;
  readonly corpusStatus: "ENGLISH_CORPUS_CANDIDATE";
}

export interface StaEnglishCorpusCoverage {
  readonly totalScenarios: number;
  readonly byQl: Readonly<Record<StaQlId, number>>;
  readonly domains: readonly StaCorpusDomain[];
  readonly familyCount: number;
  readonly misconceptionClasses: readonly string[];
  readonly dependencyRelations: readonly string[];
}
