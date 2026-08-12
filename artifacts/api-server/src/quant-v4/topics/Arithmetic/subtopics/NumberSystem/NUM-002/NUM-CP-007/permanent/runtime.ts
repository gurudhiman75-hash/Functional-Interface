import { generateNumCp007Wave01Package } from "../wave01/runtime.ts";
import { generateNumCp007Wave02Package } from "../wave02/runtime.ts";
import { generateNumCp007Wave03Package } from "../wave03/runtime.ts";
import { generateNumCp007Wave04Package } from "../wave04/runtime.ts";
import type { NumCp007Difficulty, NumCp007Explanation, NumCp007Option } from "../wave01/types.ts";
import {
  NUM_CP007_PERMANENT_QL_IDS,
  getNumCp007PermanentAllocation,
  type NumCp007PermanentAllocationEntry,
  type NumCp007PermanentQlId,
} from "./allocation.ts";

export interface NumCp007PermanentRuntimeInput {
  readonly questionLanguageId?: NumCp007PermanentQlId;
  readonly seed?: number;
  readonly language?: "en";
}

interface NumCp007TemporaryPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-007";
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp007Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp007Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp007Explanation;
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

export interface NumCp007PermanentLifecycle {
  readonly permanentQlId: NumCp007PermanentQlId;
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp007PermanentQuestion {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-007";
  readonly permanentQlId: NumCp007PermanentQlId;
  readonly questionLanguageId: NumCp007PermanentQlId;
  readonly questionId: string;
  readonly qlTemplateId: NumCp007PermanentAllocationEntry["qlTemplateId"];
  readonly solveModeId: NumCp007PermanentAllocationEntry["solveModeId"];
  readonly authorityId: NumCp007PermanentAllocationEntry["authorityId"];
  readonly temporaryPrototypeId: string;
  readonly authorityPrototypeIds: readonly string[];
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly language: "en";
  readonly difficulty: NumCp007Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp007Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp007Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly lifecycle: NumCp007PermanentLifecycle;
  readonly traceability: Readonly<{
    packageId: "NUM-002";
    canonicalProblemId: "NUM-CP-007";
    questionLanguageId: NumCp007PermanentQlId;
    qlTemplateId: NumCp007PermanentAllocationEntry["qlTemplateId"];
    solveModeId: NumCp007PermanentAllocationEntry["solveModeId"];
    authorityId: NumCp007PermanentAllocationEntry["authorityId"];
    authorityPrototypeIds: readonly string[];
    runtimePrototypeId: string;
    language: "en";
  }>;
}

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/NUM-CP007-PROT-(\d{3})$/);
  if (!match) throw new Error(`Invalid NUM-CP-007 prototype ID: ${prototypeId}`);
  return Number(match[1]);
}

export function generateNumCp007TemporaryAuthorityPackage(
  prototypeId: string,
  seed: number,
): NumCp007TemporaryPackage {
  const number = prototypeNumber(prototypeId);
  let result: unknown;
  if (number <= 8) result = generateNumCp007Wave01Package(prototypeId as never, seed);
  else if (number <= 16) result = generateNumCp007Wave02Package(prototypeId as never, seed);
  else if (number <= 24) result = generateNumCp007Wave03Package(prototypeId as never, seed);
  else if (number <= 32) result = generateNumCp007Wave04Package(prototypeId as never, seed);
  else throw new Error(`Unsupported NUM-CP-007 prototype ID: ${prototypeId}`);
  return result as NumCp007TemporaryPackage;
}

export function runNumCp007PermanentPipeline(
  input: NumCp007PermanentRuntimeInput = {},
): NumCp007PermanentQuestion {
  const questionLanguageId = input.questionLanguageId ?? NUM_CP007_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-CP-007 canonical permanent runtime only supports English; received ${language}. Use the localization adapter for frozen translated locales.`);
  }
  const seed = input.seed ?? 1;
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }

  const allocation = getNumCp007PermanentAllocation(questionLanguageId);
  const variantIndex = (seed - 1) % allocation.prototypeIds.length;
  const sourceSeed = Math.floor((seed - 1) / allocation.prototypeIds.length) + 1;
  const runtimePrototypeId = allocation.prototypeIds[variantIndex]!;
  const temporary = generateNumCp007TemporaryAuthorityPackage(runtimePrototypeId, sourceSeed);

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

  const lifecycle: NumCp007PermanentLifecycle = {
    permanentQlId: allocation.qlId,
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
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
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `NUM-002:${allocation.qlId}:${seed}`,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    authorityId: allocation.authorityId,
    authorityPrototypeIds: allocation.prototypeIds,
    seed,
    sourceSeed,
    language: "en",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    lifecycle,
    traceability: {
      packageId: "NUM-002",
      canonicalProblemId: "NUM-CP-007",
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
