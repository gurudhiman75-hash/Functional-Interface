import { generateNumCp001Wave01Package } from "../wave01/runtime";
import { generateNumCp001Wave02 } from "../wave02/runtime";
import { generateNumCp001Wave03 } from "../wave03/runtime";
import { generateNumCp001Wave04 } from "../wave04/runtime";
import type {
  NumCp001Difficulty,
  NumCp001Explanation,
  NumCp001Option,
} from "../wave01/types";
import {
  NUM_CP001_PERMANENT_QL_IDS,
  getNumCp001PermanentAllocation,
  type NumCp001PermanentAllocationEntry,
  type NumCp001PermanentQlId,
} from "./allocation";

export interface NumCp001PermanentRuntimeInput {
  readonly questionLanguageId?: NumCp001PermanentQlId;
  readonly seed?: number;
  readonly language?: "en";
}

interface NumCp001TemporaryPackage {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-001";
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp001Difficulty;
  readonly answerSemantic: string;
  readonly stem: string;
  readonly options: readonly NumCp001Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp001Explanation;
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

export interface NumCp001PermanentLifecycle {
  readonly permanentQlId: NumCp001PermanentQlId;
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

export interface NumCp001PermanentQuestion {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-001";
  readonly permanentQlId: NumCp001PermanentQlId;
  readonly questionLanguageId: NumCp001PermanentQlId;
  readonly questionId: string;
  readonly qlTemplateId: NumCp001PermanentAllocationEntry["qlTemplateId"];
  readonly solveModeId: NumCp001PermanentAllocationEntry["solveModeId"];
  readonly proposalId: NumCp001PermanentAllocationEntry["proposalId"];
  readonly temporaryPrototypeId: string;
  readonly authorityPrototypeIds: readonly string[];
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly language: "en";
  readonly difficulty: NumCp001Difficulty;
  readonly answerSemantic: string;
  readonly stem: string;
  readonly options: readonly NumCp001Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp001Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly solveModeFrozen: true;
  readonly englishImplementationFrozen: true;
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly lifecycle: NumCp001PermanentLifecycle;
  readonly traceability: Readonly<{
    packageId: "NUM-001";
    canonicalProblemId: "NUM-CP-001";
    questionLanguageId: NumCp001PermanentQlId;
    qlTemplateId: NumCp001PermanentAllocationEntry["qlTemplateId"];
    solveModeId: NumCp001PermanentAllocationEntry["solveModeId"];
    proposalId: NumCp001PermanentAllocationEntry["proposalId"];
    authorityPrototypeIds: readonly string[];
    runtimePrototypeId: string;
    language: "en";
  }>;
}

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/NUM-CP001-PROT-(\d{3})$/);
  if (!match) throw new Error(`Invalid NUM-CP-001 prototype ID: ${prototypeId}`);
  return Number(match[1]);
}

export function generateNumCp001TemporaryAuthorityPackage(
  prototypeId: string,
  seed: number,
): NumCp001TemporaryPackage {
  const number = prototypeNumber(prototypeId);
  let result: unknown;
  if (number <= 8) result = generateNumCp001Wave01Package(prototypeId as never, seed);
  else if (number <= 16) result = generateNumCp001Wave02(prototypeId as never, seed);
  else if (number <= 24) result = generateNumCp001Wave03(prototypeId as never, seed);
  else if (number <= 26) result = generateNumCp001Wave04(prototypeId as never, seed);
  else throw new Error(`Unsupported NUM-CP-001 prototype ID: ${prototypeId}`);
  return result as NumCp001TemporaryPackage;
}

export function runNumCp001PermanentPipeline(
  input: NumCp001PermanentRuntimeInput = {},
): NumCp001PermanentQuestion {
  const questionLanguageId = input.questionLanguageId ?? NUM_CP001_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-CP-001 canonical permanent runtime only supports English; received ${language}. Use the localization adapter for frozen translated locales.`);
  }
  const seed = input.seed ?? 1;
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }

  const allocation = getNumCp001PermanentAllocation(questionLanguageId);
  const variantIndex = (seed - 1) % allocation.prototypeIds.length;
  const sourceSeed = Math.floor((seed - 1) / allocation.prototypeIds.length) + 1;
  const runtimePrototypeId = allocation.prototypeIds[variantIndex]!;
  const temporary = generateNumCp001TemporaryAuthorityPackage(runtimePrototypeId, sourceSeed);

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

  const lifecycle: NumCp001PermanentLifecycle = {
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
    questionId: `NUM-001:${allocation.qlId}:${seed}`,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    proposalId: allocation.proposalId,
    authorityPrototypeIds: allocation.prototypeIds,
    seed,
    sourceSeed,
    language: "en",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    solveModeFrozen: true,
    englishImplementationFrozen: true,
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    lifecycle,
    traceability: {
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-001",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      proposalId: allocation.proposalId,
      authorityPrototypeIds: allocation.prototypeIds,
      runtimePrototypeId,
      language: "en",
    },
  };
}
