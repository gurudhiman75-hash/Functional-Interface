import type { StaEnglishCorpusCoverage, StaEnglishCorpusScenario, StaCorpusDomain, StaSemanticShape } from "../english-corpus-types.ts";
import { STA_EXECUTABLE_SCENARIOS } from "../prototype-authorities.ts";
import type { StaQlId, StaScenarioAuthority } from "../types.ts";
import { STA_QL001_ENGLISH_EXPANSION } from "./ql001.ts";
import { STA_QL002_ENGLISH_EXPANSION } from "./ql002.ts";
import { STA_QL003_ENGLISH_EXPANSION } from "./ql003.ts";
import { STA_QL004_ENGLISH_EXPANSION } from "./ql004.ts";

interface ReviewedMetadata {
  readonly corpusFamilyId: string;
  readonly domain: StaCorpusDomain;
  readonly semanticShape: StaSemanticShape;
}

const REVIEWED_METADATA: Readonly<Record<string, ReviewedMetadata>> = {
  "STA-DISC-QL001-001": { corpusFamilyId: "QL001-PORTAL-ACCESS", domain: "DIGITAL_SERVICE", semanticShape: "SINGLE_PRECONDITION" },
  "STA-DISC-QL001-002": { corpusFamilyId: "QL001-FACILITY-AVAILABILITY", domain: "FACILITY_OPERATIONS", semanticShape: "SINGLE_PRECONDITION" },
  "STA-DISC-QL001-003": { corpusFamilyId: "QL001-EQUIPMENT-CAPABILITY", domain: "WORKPLACE", semanticShape: "SINGLE_PRECONDITION" },
  "STA-DISC-QL002-001": { corpusFamilyId: "QL002-TRANSPORT-CAPACITY", domain: "TRANSPORT", semanticShape: "NEED_PLUS_EFFICACY" },
  "STA-DISC-QL002-002": { corpusFamilyId: "QL002-SERVICE-CAPACITY", domain: "BANKING_SERVICE", semanticShape: "NEED_PLUS_EFFICACY" },
  "STA-DISC-QL002-003": { corpusFamilyId: "QL002-ACCESS-POLICY", domain: "WORKPLACE", semanticShape: "NEED_PLUS_EFFICACY" },
  "STA-DISC-QL002-004": { corpusFamilyId: "QL002-FACILITY-HOURS", domain: "EDUCATION", semanticShape: "NEED_PLUS_FEASIBILITY_PLUS_EFFICACY" },
  "STA-DISC-QL003-001": { corpusFamilyId: "QL003-DEADLINE-REMINDER", domain: "EDUCATION", semanticShape: "AUDIENCE_RELEVANCE_PLUS_CAPABILITY" },
  "STA-DISC-QL003-002": { corpusFamilyId: "QL003-DATA-REVIEW-NOTICE", domain: "BANKING_SERVICE", semanticShape: "AUDIENCE_RELEVANCE_PLUS_CAPABILITY" },
  "STA-DISC-QL003-003": { corpusFamilyId: "QL003-SERVICE-DIRECTION", domain: "PUBLIC_SERVICE", semanticShape: "SERVICE_RELEVANCE_PLUS_CAPABILITY" },
  "STA-DISC-QL004-001-V2": { corpusFamilyId: "QL004-PROCESSING-TO-QUEUE-BRIDGE", domain: "BANKING_SERVICE", semanticShape: "EXPLICIT_PREMISE_PLUS_HIDDEN_BRIDGE" },
  "STA-DISC-QL004-002-V2": { corpusFamilyId: "QL004-SHADE-TO-COMFORT-BRIDGE", domain: "PUBLIC_SERVICE", semanticShape: "EXPLICIT_PREMISE_PLUS_HIDDEN_BRIDGE" },
  "STA-DISC-QL004-003-V2": { corpusFamilyId: "QL004-REMINDER-TO-MEMORY-BRIDGE", domain: "PUBLIC_SERVICE", semanticShape: "EXPLICIT_PREMISE_PLUS_HIDDEN_BRIDGE" },
};

function promoteReviewed(scenario: StaScenarioAuthority): StaEnglishCorpusScenario {
  const metadata = REVIEWED_METADATA[scenario.scenarioId];
  if (!metadata) throw new Error(`Missing English-corpus metadata for reviewed scenario ${scenario.scenarioId}`);
  return {
    ...scenario,
    ...metadata,
    corpusStatus: "ENGLISH_CORPUS_CANDIDATE",
  };
}

function normalizeExpansionDomain(scenario: StaEnglishCorpusScenario): StaEnglishCorpusScenario {
  if (scenario.scenarioId === "STA-EN-QL001-COUPON-CODE") {
    return { ...scenario, domain: "EVERYDAY_DECISION" };
  }
  return scenario;
}

export const STA_ENGLISH_CORPUS_V1: readonly StaEnglishCorpusScenario[] = [
  ...STA_EXECUTABLE_SCENARIOS.map(promoteReviewed),
  ...STA_QL001_ENGLISH_EXPANSION.map(normalizeExpansionDomain),
  ...STA_QL002_ENGLISH_EXPANSION,
  ...STA_QL003_ENGLISH_EXPANSION,
  ...STA_QL004_ENGLISH_EXPANSION,
];

export const STA_ENGLISH_CORPUS_BY_QL: Readonly<Record<StaQlId, readonly StaEnglishCorpusScenario[]>> = {
  "STA-QL-001": STA_ENGLISH_CORPUS_V1.filter((scenario) => scenario.proposedQlId === "STA-QL-001"),
  "STA-QL-002": STA_ENGLISH_CORPUS_V1.filter((scenario) => scenario.proposedQlId === "STA-QL-002"),
  "STA-QL-003": STA_ENGLISH_CORPUS_V1.filter((scenario) => scenario.proposedQlId === "STA-QL-003"),
  "STA-QL-004": STA_ENGLISH_CORPUS_V1.filter((scenario) => scenario.proposedQlId === "STA-QL-004"),
};

export function getStaEnglishCorpusCoverage(): StaEnglishCorpusCoverage {
  return {
    totalScenarios: STA_ENGLISH_CORPUS_V1.length,
    byQl: {
      "STA-QL-001": STA_ENGLISH_CORPUS_BY_QL["STA-QL-001"].length,
      "STA-QL-002": STA_ENGLISH_CORPUS_BY_QL["STA-QL-002"].length,
      "STA-QL-003": STA_ENGLISH_CORPUS_BY_QL["STA-QL-003"].length,
      "STA-QL-004": STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"].length,
    },
    domains: [...new Set(STA_ENGLISH_CORPUS_V1.map((scenario) => scenario.domain))].sort(),
    familyCount: new Set(STA_ENGLISH_CORPUS_V1.map((scenario) => scenario.corpusFamilyId)).size,
    misconceptionClasses: [...new Set(STA_ENGLISH_CORPUS_V1.flatMap((scenario) => scenario.candidates.map((candidate) => candidate.misconceptionClass).filter((value): value is string => Boolean(value))))].sort(),
    dependencyRelations: [...new Set(STA_ENGLISH_CORPUS_V1.flatMap((scenario) => scenario.hiddenDependencies.map((dependency) => dependency.relation)))].sort(),
  };
}
