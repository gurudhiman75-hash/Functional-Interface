import { generateNumCp005Wave01Package } from "../wave01/runtime";
import { generateNumCp005Wave02ProvenPackage } from "../wave02/runtime-proven";
import { generateNumCp005Wave03ProvenPackage } from "../wave03/runtime-proven";
import { generateNumCp005Wave04Package } from "../wave04/runtime-proven";
import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
} from "../wave01/types";
import {
  NUM_CP005_PERMANENT_QL_IDS,
  getNumCp005PermanentAllocation,
  type NumCp005PermanentAllocationEntry,
  type NumCp005PermanentQlId,
} from "./allocation";

export interface NumCp005PermanentRuntimeInput {
  readonly questionLanguageId?: NumCp005PermanentQlId;
  readonly seed?: number;
  readonly language?: "en";
}

interface NumCp005TemporaryPackage {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-005";
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp005Difficulty;
  readonly answerSemantic: string;
  readonly representation?: string;
  readonly stem: string;
  readonly options: readonly NumCp005Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp005Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

export interface NumCp005PermanentLifecycle {
  readonly permanentQlId: NumCp005PermanentQlId;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp005PermanentQuestion {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-005";
  readonly permanentQlId: NumCp005PermanentQlId;
  readonly questionLanguageId: NumCp005PermanentQlId;
  readonly questionId: string;
  readonly qlTemplateId: NumCp005PermanentAllocationEntry["qlTemplateId"];
  readonly solveModeId: NumCp005PermanentAllocationEntry["solveModeId"];
  readonly authorityId: NumCp005PermanentAllocationEntry["authorityId"];
  readonly temporaryPrototypeId: string;
  readonly authorityPrototypeIds: readonly string[];
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly language: "en";
  readonly difficulty: NumCp005Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp005Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp005Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly lifecycle: NumCp005PermanentLifecycle;
  readonly traceability: Readonly<{
    packageId: "NUM-001";
    canonicalProblemId: "NUM-CP-005";
    questionLanguageId: NumCp005PermanentQlId;
    qlTemplateId: NumCp005PermanentAllocationEntry["qlTemplateId"];
    solveModeId: NumCp005PermanentAllocationEntry["solveModeId"];
    authorityId: NumCp005PermanentAllocationEntry["authorityId"];
    authorityPrototypeIds: readonly string[];
    runtimePrototypeId: string;
    language: "en";
  }>;
}

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/NUM-CP005-PROT-(\d{3})$/);
  if (!match) throw new Error(`Invalid NUM-CP-005 prototype ID: ${prototypeId}`);
  return Number(match[1]);
}

export function generateNumCp005TemporaryAuthorityPackage(
  prototypeId: string,
  seed: number,
): NumCp005TemporaryPackage {
  const number = prototypeNumber(prototypeId);
  let result: unknown;
  if (number <= 8) {
    result = generateNumCp005Wave01Package(prototypeId as never, seed);
  } else if (number <= 16) {
    result = generateNumCp005Wave02ProvenPackage(prototypeId as never, seed);
  } else if (number <= 24) {
    result = generateNumCp005Wave03ProvenPackage(prototypeId as never, seed);
  } else if (number <= 32) {
    result = generateNumCp005Wave04Package(prototypeId as never, seed);
  } else {
    throw new Error(`Unsupported NUM-CP-005 prototype ID: ${prototypeId}`);
  }
  return result as NumCp005TemporaryPackage;
}

function permanentEnglishStem(
  qlId: NumCp005PermanentQlId,
  temporary: NumCp005TemporaryPackage,
): string {
  if (qlId === "NUM-QL-063") {
    const rows = temporary.hiddenState.pairTable;
    const integerValue = temporary.hiddenState.integerValue;
    if (Array.isArray(rows) && typeof integerValue === "string") {
      return `Complete the divisor pairs of ${integerValue}: ${rows.join(", ")}. What replaces ?`;
    }
  }
  return temporary.stem;
}

export function runNumCp005PermanentPipeline(
  input: NumCp005PermanentRuntimeInput = {},
): NumCp005PermanentQuestion {
  const questionLanguageId = input.questionLanguageId ?? NUM_CP005_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-CP-005 permanent runtime only supports English; received ${language}`);
  }
  const seed = input.seed ?? 1;
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }

  const allocation = getNumCp005PermanentAllocation(questionLanguageId);
  const variantIndex = (seed - 1) % allocation.prototypeIds.length;
  const sourceSeed = Math.floor((seed - 1) / allocation.prototypeIds.length) + 1;
  const runtimePrototypeId = allocation.prototypeIds[variantIndex]!;
  const temporary = generateNumCp005TemporaryAuthorityPackage(runtimePrototypeId, sourceSeed);

  if (temporary.temporaryPrototypeId !== runtimePrototypeId) {
    throw new Error(`${questionLanguageId}/${seed}: temporary-prototype mismatch`);
  }
  if (temporary.canonicalAnswer !== temporary.verifierAnswer) {
    throw new Error(`${questionLanguageId}/${seed}: independent verifier mismatch`);
  }
  if (
    temporary.permanentQlId !== null
    || temporary.lifecycle.permanentQlId !== null
    || temporary.lifecycle.active
    || temporary.lifecycle.questionStudioDiscoverable
    || temporary.lifecycle.questionBankWritable
    || temporary.lifecycle.testEligible
    || temporary.lifecycle.publiclyPublishable
  ) {
    throw new Error(`${questionLanguageId}/${seed}: discovery lifecycle boundary violated`);
  }

  const lifecycle: NumCp005PermanentLifecycle = {
    permanentQlId: allocation.qlId,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };

  return {
    ...temporary,
    stem: permanentEnglishStem(allocation.qlId, temporary),
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `NUM-001:${allocation.qlId}:${seed}`,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    authorityId: allocation.authorityId,
    authorityPrototypeIds: allocation.prototypeIds,
    seed,
    sourceSeed,
    language: "en",
    representation: temporary.representation ?? "DIRECT",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    lifecycle,
    traceability: {
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-005",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      authorityId: allocation.authorityId,
      authorityPrototypeIds: allocation.prototypeIds,
      runtimePrototypeId,
      language: "en",
    },
  };
}
