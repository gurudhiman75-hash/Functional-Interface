import { BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS } from "./advanced-prototype-contracts";
import { generateBlrCp001AdvancedPrototypeQuestion } from "./advanced-prototype-generator";
import type { BlrCp001AdvancedPrototypeId } from "./advanced-prototype-types";
import { BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS } from "./lineage-prototype-contracts";
import { generateBlrCp001LineagePrototypeQuestion } from "./lineage-prototype-generator";
import type { BlrCp001LineagePrototypeId } from "./lineage-prototype-types";
import { BLR_CP001_PROTOTYPE_CONTRACTS } from "./prototype-contracts";
import { generateBlrCp001PrototypeQuestion } from "./prototype-generator";
import type { BlrCp001PrototypeId } from "../foundation/types";

export type BlrCp001ProvisionalAuthority =
  | "RESOLVE_NAMED_PERSON_RELATION"
  | "IDENTIFY_PERSON_BY_RELATION"
  | "IDENTIFY_PERSON_BY_GENDER"
  | "IDENTIFY_ORDERED_RELATION_PAIR"
  | "SELECT_RELATION_CLAIM"
  | "COMPARE_GENERATIONS"
  | "RESOLVE_EXACT_LINEAGE_RELATION";

export interface BlrCp001ReviewQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-001";
  prototypeId: string;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  ruleId: string;
  seed: number;
  locale: "en-IN";
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: {
    clues: readonly unknown[];
    personNames: Readonly<Record<string, string>>;
    query: unknown;
  };
  options: readonly {
    value: string;
    isCorrect: boolean;
    errorLabel?: string;
  }[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    normalizedClues: readonly string[];
    queryPath: readonly string[];
    conclusion: string;
    closestTrapRejection?: string;
  };
  metadata: {
    runtimeVersion: string;
    hiddenFingerprint: string;
    [key: string]: unknown;
  };
}

export interface BlrCp001ReviewEntry {
  prototypeId: string;
  authority: BlrCp001ProvisionalAuthority;
  generate(seed: number): BlrCp001ReviewQuestion;
}

function initialAuthority(
  prototypeId: BlrCp001PrototypeId,
): BlrCp001ProvisionalAuthority {
  void prototypeId;
  return "RESOLVE_NAMED_PERSON_RELATION";
}

function advancedAuthority(
  prototypeId: BlrCp001AdvancedPrototypeId,
): BlrCp001ProvisionalAuthority {
  if (prototypeId === "BLR-CP001-PROT-IDENTIFY-PERSON") {
    return "IDENTIFY_PERSON_BY_RELATION";
  }
  if (prototypeId === "BLR-CP001-PROT-IDENTIFY-PAIR") {
    return "IDENTIFY_ORDERED_RELATION_PAIR";
  }
  if (prototypeId === "BLR-CP001-PROT-RELATION-CLAIM") {
    return "SELECT_RELATION_CLAIM";
  }
  if (prototypeId === "BLR-CP001-PROT-GENERATION-COMPARISON") {
    return "COMPARE_GENERATIONS";
  }
  return "RESOLVE_NAMED_PERSON_RELATION";
}

function lineageAuthority(
  prototypeId: BlrCp001LineagePrototypeId,
): BlrCp001ProvisionalAuthority {
  return prototypeId === "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER"
    ? "IDENTIFY_PERSON_BY_GENDER"
    : "RESOLVE_EXACT_LINEAGE_RELATION";
}

export const BLR_CP001_REVIEW_REGISTRY: readonly BlrCp001ReviewEntry[] = [
  ...BLR_CP001_PROTOTYPE_CONTRACTS.map((contract) => ({
    prototypeId: contract.prototypeId,
    authority: initialAuthority(contract.prototypeId),
    generate: (seed: number) =>
      generateBlrCp001PrototypeQuestion(
        contract.prototypeId,
        seed,
      ) as unknown as BlrCp001ReviewQuestion,
  })),
  ...BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS.map((contract) => ({
    prototypeId: contract.prototypeId,
    authority: advancedAuthority(contract.prototypeId),
    generate: (seed: number) =>
      generateBlrCp001AdvancedPrototypeQuestion(
        contract.prototypeId,
        seed,
      ) as unknown as BlrCp001ReviewQuestion,
  })),
  ...BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS.map((contract) => ({
    prototypeId: contract.prototypeId,
    authority: lineageAuthority(contract.prototypeId),
    generate: (seed: number) =>
      generateBlrCp001LineagePrototypeQuestion(
        contract.prototypeId,
        seed,
      ) as unknown as BlrCp001ReviewQuestion,
  })),
] as const;

export function getBlrCp001ReviewEntry(
  prototypeId: string,
): BlrCp001ReviewEntry {
  const entry = BLR_CP001_REVIEW_REGISTRY.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!entry) throw new Error(`Unknown BLR-CP-001 review prototype ${prototypeId}.`);
  return entry;
}
