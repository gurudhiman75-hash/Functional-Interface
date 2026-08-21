import {
  NUM_CP009_PERMANENT_ALLOCATION,
  type NumCp009PermanentAuthorityId,
  type NumCp009PermanentQlId,
  type NumCp009SourceSlice,
} from "./permanent-allocation.ts";
import { generateNumCp009Wave01 } from "./wave01/runtime.ts";
import type { NumCp009Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp009Wave02 } from "./wave02/runtime.ts";
import type { NumCp009Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp009Wave03 } from "./wave03/runtime.ts";
import type { NumCp009Wave03PrototypeId } from "./wave03/types.ts";

export interface NumCp009PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-009";
  readonly authorityId: NumCp009PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp009PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly answerSemantic: string;
  readonly sourceAnswerSemantic: string;
  readonly representation: string;
  readonly stemFamily: string;
  readonly stem: string;
  readonly options: readonly {
    readonly value: string;
    readonly isCorrect: boolean;
    readonly misconceptionId: string;
  }[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: NumCp009PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "ENGLISH_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/(\d{3})$/u);
  if (!match) throw new Error(`Malformed NUM-CP-009 prototype id: ${prototypeId}`);
  return Number(match[1]);
}

function generateSource(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 8) {
    return generateNumCp009Wave01(prototypeId as NumCp009Wave01PrototypeId, seed);
  }
  if (number <= 14) {
    return generateNumCp009Wave02(prototypeId as NumCp009Wave02PrototypeId, seed);
  }
  return generateNumCp009Wave03(prototypeId as NumCp009Wave03PrototypeId, seed);
}

function resolveSourceSlice(slice: NumCp009SourceSlice, baseSourceSeed: number) {
  if (!slice.requiredAnswerSemantic) {
    return { source: generateSource(slice.prototypeId, baseSourceSeed), sourceSeed: baseSourceSeed };
  }

  for (let offset = 0; offset < 8; offset += 1) {
    const sourceSeed = baseSourceSeed + offset;
    const source = generateSource(slice.prototypeId, sourceSeed);
    if (source.answerSemantic === slice.requiredAnswerSemantic) return { source, sourceSeed };
  }

  throw new Error(
    `${slice.prototypeId}: unable to resolve required answer semantic ${slice.requiredAnswerSemantic} from source seed ${baseSourceSeed}`,
  );
}

export function generateNumCp009Permanent(
  qlId: NumCp009PermanentQlId,
  seed: number,
): NumCp009PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) {
    throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  }

  const allocation = NUM_CP009_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-009 permanent QL: ${qlId}`);

  const sourceSliceIndex = (seed - 1) % allocation.sourceSlices.length;
  const sourceSlice = allocation.sourceSlices[sourceSliceIndex]!;
  const sourceRound = Math.floor((seed - 1) / allocation.sourceSlices.length) + 1;
  const { source, sourceSeed } = resolveSourceSlice(sourceSlice, sourceRound);

  if (sourceSlice.requiredAnswerSemantic && source.answerSemantic !== sourceSlice.requiredAnswerSemantic) {
    throw new Error(
      `${qlId}: source slice semantic drift; expected ${sourceSlice.requiredAnswerSemantic}, received ${source.answerSemantic}`,
    );
  }

  return Object.freeze({
    ...source,
    authorityId: allocation.authorityId,
    authorityLabel: allocation.label,
    permanentQlId: qlId,
    seed,
    sourceSeed,
    answerSemantic: allocation.authorityAnswerSemantic,
    sourceAnswerSemantic: source.answerSemantic,
    lifecycle: Object.freeze({
      permanentQlId: qlId,
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "ENGLISH_FROZEN" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  }) as NumCp009PermanentPackage;
}
