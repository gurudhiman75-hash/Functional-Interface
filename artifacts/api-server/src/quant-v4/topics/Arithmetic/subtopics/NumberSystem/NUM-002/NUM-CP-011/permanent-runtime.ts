import {
  NUM_CP011_PERMANENT_ALLOCATION,
  type NumCp011PermanentAuthorityId,
  type NumCp011PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp011Wave01 } from "./wave01/runtime.ts";
import type { NumCp011Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp011Wave02 } from "./wave02/runtime.ts";
import type { NumCp011Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp011Wave03 } from "./wave03/runtime.ts";
import type { NumCp011Wave03PrototypeId } from "./wave03/types.ts";

export interface NumCp011PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-011";
  readonly authorityId: NumCp011PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp011PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly answerSemantic: string;
  readonly sourceAnswerSemantic: string;
  readonly representation: string;
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
    permanentQlId: NumCp011PermanentQlId;
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
  if (!match) throw new Error(`Malformed NUM-CP-011 prototype id: ${prototypeId}`);
  return Number(match[1]);
}

function generateSource(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 6) return generateNumCp011Wave01(prototypeId as NumCp011Wave01PrototypeId, seed);
  if (number <= 11) return generateNumCp011Wave02(prototypeId as NumCp011Wave02PrototypeId, seed);
  if (number <= 13) return generateNumCp011Wave03(prototypeId as NumCp011Wave03PrototypeId, seed);
  throw new Error(`Unknown NUM-CP-011 prototype id: ${prototypeId}`);
}

export function generateNumCp011Permanent(
  qlId: NumCp011PermanentQlId,
  seed: number,
): NumCp011PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) {
    throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  }

  const allocation = NUM_CP011_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-011 permanent QL: ${qlId}`);

  const sourcePrototypeId = allocation.sourcePrototypes[0];
  const sourceSeed = seed;
  const source = generateSource(sourcePrototypeId, sourceSeed);

  if (source.temporaryPrototypeId !== sourcePrototypeId) {
    throw new Error(`${qlId}: source prototype drift; expected ${sourcePrototypeId}, received ${source.temporaryPrototypeId}`);
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
  }) as NumCp011PermanentPackage;
}
