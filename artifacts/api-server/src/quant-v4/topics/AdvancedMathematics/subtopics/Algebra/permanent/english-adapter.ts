import {
  generateAlgCp001DiscoveryItem,
  generateAlgCp002DiscoveryItem,
  generateAlgCp003DiscoveryItem,
  generateAlgCp004DiscoveryItem,
  generateAlgCp005DiscoveryItem,
} from "../ALG-001";
import {
  generateAlgCp006DiscoveryItem,
  generateAlgCp007DiscoveryItem,
  generateAlgCp008DiscoveryItem,
  generateAlgCp009DiscoveryItem,
  generateAlgCp010DiscoveryItem,
  generateAlgCp011DiscoveryItem,
  generateAlgCp012DiscoveryItem,
  generateAlgCp013DiscoveryItem,
  generateAlgCp014DiscoveryItem,
} from "../ALG-002";
import { getAlgPermanentAllocation, type AlgPermanentQlId } from "./allocation";

export const ALG_PERMANENT_PROTOTYPE_MAP: Readonly<Record<AlgPermanentQlId, readonly string[]>> = {
  "ALG-QL-001": ["ALG-CP001-CAND-001"],
  "ALG-QL-002": ["ALG-CP001-CAND-002", "ALG-CP001-CAND-007"],
  "ALG-QL-003": ["ALG-CP001-CAND-003"],
  "ALG-QL-004": ["ALG-CP001-CAND-004"],
  "ALG-QL-005": ["ALG-CP002-CAND-001", "ALG-CP002-CAND-008"],
  "ALG-QL-006": ["ALG-CP002-CAND-002"],
  "ALG-QL-007": ["ALG-CP002-CAND-003", "ALG-CP002-CAND-006"],
  "ALG-QL-008": ["ALG-CP002-CAND-004", "ALG-CP002-CAND-007"],
  "ALG-QL-009": ["ALG-CP002-CAND-005"],
  "ALG-QL-010": ["ALG-CP002-CAND-009"],
  "ALG-QL-011": ["ALG-CP003-CAND-001", "ALG-CP003-CAND-002", "ALG-CP003-CAND-004", "ALG-CP003-CAND-005"],
  "ALG-QL-012": ["ALG-CP003-CAND-003"],
  "ALG-QL-013": ["ALG-CP003-CAND-006"],
  "ALG-QL-014": ["ALG-CP004-CAND-002", "ALG-CP004-CAND-003"],
  "ALG-QL-015": ["ALG-CP004-CAND-001", "ALG-CP004-CAND-004", "ALG-CP004-CAND-005"],
  "ALG-QL-016": ["ALG-CP005-CAND-001", "ALG-CP005-CAND-002", "ALG-CP005-CAND-005"],
  "ALG-QL-017": ["ALG-CP005-CAND-003", "ALG-CP005-CAND-004", "ALG-CP005-CAND-006"],
  "ALG-QL-018": ["ALG-CP005-CAND-007"],
  "ALG-QL-019": ["ALG-CP005-CAND-008"],
  "ALG-QL-020": ["ALG-CP006-CAND-001", "ALG-CP006-CAND-002", "ALG-CP006-CAND-003", "ALG-CP006-CAND-004", "ALG-CP006-CAND-007", "ALG-CP001-CAND-005"],
  "ALG-QL-021": ["ALG-CP007-CAND-001", "ALG-CP007-CAND-002", "ALG-CP007-CAND-003", "ALG-CP007-CAND-004"],
  "ALG-QL-022": ["ALG-CP007-CAND-005", "ALG-CP007-CAND-006"],
  "ALG-QL-023": ["ALG-CP007-CAND-007"],
  "ALG-QL-024": ["ALG-CP008-CAND-001", "ALG-CP008-CAND-002", "ALG-CP008-CAND-003", "ALG-CP008-CAND-004", "ALG-CP008-CAND-005", "ALG-CP008-CAND-006", "ALG-CP008-CAND-007", "ALG-CP001-CAND-006"],
  "ALG-QL-025": ["ALG-CP009-CAND-001", "ALG-CP009-CAND-002", "ALG-CP009-CAND-003", "ALG-CP009-CAND-004"],
  "ALG-QL-026": ["ALG-CP009-CAND-005"],
  "ALG-QL-027": ["ALG-CP009-CAND-006"],
  "ALG-QL-028": ["ALG-CP010-CAND-001", "ALG-CP010-CAND-002", "ALG-CP010-CAND-009"],
  "ALG-QL-029": ["ALG-CP010-CAND-003", "ALG-CP010-CAND-004", "ALG-CP010-CAND-005"],
  "ALG-QL-030": ["ALG-CP010-CAND-006"],
  "ALG-QL-031": ["ALG-CP010-CAND-007", "ALG-CP010-CAND-008", "ALG-CP010-CAND-010", "ALG-CP010-CAND-011"],
  "ALG-QL-032": ["ALG-CP011-CAND-001", "ALG-CP011-CAND-002", "ALG-CP011-CAND-003", "ALG-CP011-CAND-004", "ALG-CP011-CAND-005", "ALG-CP011-CAND-006", "ALG-CP011-CAND-007"],
  "ALG-QL-033": ["ALG-CP012-CAND-001", "ALG-CP012-CAND-002", "ALG-CP012-CAND-003"],
  "ALG-QL-034": ["ALG-CP012-CAND-004", "ALG-CP012-CAND-005", "ALG-CP012-CAND-006", "ALG-CP012-CAND-010"],
  "ALG-QL-035": ["ALG-CP012-CAND-007", "ALG-CP012-CAND-008"],
  "ALG-QL-036": ["ALG-CP012-CAND-009"],
  "ALG-QL-037": ["ALG-CP013-CAND-001", "ALG-CP013-CAND-002", "ALG-CP013-CAND-003", "ALG-CP013-CAND-004", "ALG-CP013-CAND-008"],
  "ALG-QL-038": ["ALG-CP013-CAND-005", "ALG-CP013-CAND-006", "ALG-CP013-CAND-007", "ALG-CP013-CAND-009"],
  "ALG-QL-039": ["ALG-CP014-CAND-001", "ALG-CP014-CAND-002", "ALG-CP014-CAND-003"],
  "ALG-QL-040": ["ALG-CP014-CAND-004", "ALG-CP014-CAND-005", "ALG-CP014-CAND-006", "ALG-CP014-CAND-007", "ALG-CP014-CAND-008"],
};

export const ALG_ENGINE_ONLY_DISCOVERY_CANDIDATE_IDS = [
  "ALG-CP006-CAND-005",
  "ALG-CP006-CAND-006",
] as const;

export const ALG_COMPOSITION_ONLY_CP015_PREFIX = "ALG-CP015-" as const;

interface DiscoveryLike {
  cpId: string;
  candidateId: string;
  seed: number;
  stem: string;
  explanation: string;
  sourceStatus: string;
}

function generateDiscoveryPrototype(candidateId: string, seed: number): DiscoveryLike {
  if (candidateId.startsWith("ALG-CP001-")) return generateAlgCp001DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP002-")) return generateAlgCp002DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP003-")) return generateAlgCp003DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP004-")) return generateAlgCp004DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP005-")) return generateAlgCp005DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP006-")) return generateAlgCp006DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP007-")) return generateAlgCp007DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP008-")) return generateAlgCp008DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP009-")) return generateAlgCp009DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP010-")) return generateAlgCp010DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP011-")) return generateAlgCp011DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP012-")) return generateAlgCp012DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP013-")) return generateAlgCp013DiscoveryItem(candidateId, seed);
  if (candidateId.startsWith("ALG-CP014-")) return generateAlgCp014DiscoveryItem(candidateId, seed);
  throw new Error(`No permanent English prototype dispatcher for ${candidateId}`);
}

export interface AlgPermanentEnglishCandidateItem {
  qlId: AlgPermanentQlId;
  freezeKey: string;
  packageId: "ALG-001" | "ALG-002";
  cpId: string;
  title: string;
  prototypeId: string;
  variantIndex: number;
  seed: number;
  question: string;
  explanation: string;
  rawDiscoveryItem: DiscoveryLike;
  maturity: "PERMANENT_IDENTITY_ENGLISH_CANDIDATE";
  englishImplementationFrozen: false;
  active: false;
  questionStudioDiscoverable: false;
}

export function getAlgPermanentPrototypeIds(qlId: AlgPermanentQlId): readonly string[] {
  const ids = ALG_PERMANENT_PROTOTYPE_MAP[qlId];
  if (!ids?.length) throw new Error(`Permanent Algebra QL ${qlId} has no English prototype mapping`);
  return ids;
}

export function generateAlgPermanentEnglishCandidate(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishCandidateItem {
  const allocation = getAlgPermanentAllocation(qlId);
  const prototypeIds = getAlgPermanentPrototypeIds(qlId);
  const variantIndex = requestedVariantIndex === undefined
    ? ((seed >>> 0) % prototypeIds.length)
    : requestedVariantIndex;
  if (!Number.isInteger(variantIndex) || variantIndex < 0 || variantIndex >= prototypeIds.length) {
    throw new Error(`Invalid variant index ${variantIndex} for ${qlId}`);
  }
  const prototypeId = prototypeIds[variantIndex]!;
  const raw = generateDiscoveryPrototype(prototypeId, seed);
  return {
    qlId,
    freezeKey: allocation.freezeKey,
    packageId: allocation.packageId,
    cpId: allocation.cpId,
    title: allocation.title,
    prototypeId,
    variantIndex,
    seed,
    question: raw.stem,
    explanation: raw.explanation,
    rawDiscoveryItem: raw,
    maturity: "PERMANENT_IDENTITY_ENGLISH_CANDIDATE",
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
  };
}
