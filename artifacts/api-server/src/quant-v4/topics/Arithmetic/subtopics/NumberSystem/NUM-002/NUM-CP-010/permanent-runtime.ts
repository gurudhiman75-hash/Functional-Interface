import {
  NUM_CP010_PERMANENT_ALLOCATION,
  type NumCp010PermanentAuthorityId,
  type NumCp010PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp010Wave01 } from "./wave01/runtime.ts";
import type { NumCp010Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp010Wave02 } from "./wave02/runtime.ts";
import type { NumCp010Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp010Wave03 } from "./wave03/runtime.ts";
import type { NumCp010Wave03PrototypeId } from "./wave03/types.ts";
import { generateNumCp010Wave04 } from "./wave04/runtime.ts";
import type { NumCp010Wave04PrototypeId } from "./wave04/types.ts";

export interface NumCp010PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-010";
  readonly authorityId: NumCp010PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp010PermanentQlId;
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
    permanentQlId: NumCp010PermanentQlId;
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
  if (!match) throw new Error(`Malformed NUM-CP-010 prototype id: ${prototypeId}`);
  return Number(match[1]);
}

function generateSource(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 8) return generateNumCp010Wave01(prototypeId as NumCp010Wave01PrototypeId, seed);
  if (number <= 17) return generateNumCp010Wave02(prototypeId as NumCp010Wave02PrototypeId, seed);
  if (number <= 25) return generateNumCp010Wave03(prototypeId as NumCp010Wave03PrototypeId, seed);
  if (number === 26) return generateNumCp010Wave04(prototypeId as NumCp010Wave04PrototypeId, seed);
  throw new Error(`Unknown NUM-CP-010 prototype id: ${prototypeId}`);
}

export function generateNumCp010Permanent(
  qlId: NumCp010PermanentQlId,
  seed: number,
): NumCp010PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) {
    throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  }

  const allocation = NUM_CP010_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-010 permanent QL: ${qlId}`);

  const sourceIndex = (seed - 1) % allocation.sourcePrototypes.length;
  const sourcePrototypeId = allocation.sourcePrototypes[sourceIndex]!;
  const sourceSeed = Math.floor((seed - 1) / allocation.sourcePrototypes.length) + 1;
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
  }) as NumCp010PermanentPackage;
}
