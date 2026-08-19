import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Wave01ReviewFinal } from "./wave01/runtime-review-final.ts";
import type { NumCp008Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp008Wave02ReviewFinal } from "./wave02/runtime-review-final.ts";
import type { NumCp008Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp008Wave03Reviewed } from "./wave03/runtime-review-final.ts";
import type { NumCp008Wave03PrototypeId } from "./wave03/types.ts";
import { generateNumCp008Wave04Reviewed } from "./wave04/runtime-review-final.ts";
import type { NumCp008Wave04PrototypeId } from "./wave04/types.ts";

export type NumCp008PermanentQlId = `NUM-QL-${string}`;

export interface NumCp008PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-008";
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp008PermanentQlId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly { readonly value: string; readonly isCorrect: boolean; readonly misconceptionId: string }[];
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
    permanentQlId: NumCp008PermanentQlId;
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
  const match = prototypeId.match(/(\d{3})$/);
  if (!match) throw new Error(`Malformed CP008 prototype id: ${prototypeId}`);
  return Number(match[1]);
}

function reviewedSource(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 8) return generateNumCp008Wave01ReviewFinal(prototypeId as NumCp008Wave01PrototypeId, seed);
  if (number <= 16) return generateNumCp008Wave02ReviewFinal(prototypeId as NumCp008Wave02PrototypeId, seed);
  if (number <= 24) return generateNumCp008Wave03Reviewed(prototypeId as NumCp008Wave03PrototypeId, seed);
  return generateNumCp008Wave04Reviewed(prototypeId as NumCp008Wave04PrototypeId, seed);
}

export function generateNumCp008Permanent(qlId: NumCp008PermanentQlId, seed: number): NumCp008PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  const allocation = NUM_CP008_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-008 permanent QL: ${qlId}`);

  const sourcePrototypeId = allocation.prototypes[(seed - 1) % allocation.prototypes.length]!;
  const source = reviewedSource(sourcePrototypeId, seed);

  return Object.freeze({
    ...source,
    permanentQlId: qlId,
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
  }) as NumCp008PermanentPackage;
}
