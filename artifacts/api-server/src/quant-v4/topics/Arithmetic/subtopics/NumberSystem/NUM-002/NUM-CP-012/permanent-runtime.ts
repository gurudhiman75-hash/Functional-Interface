import {
  NUM_CP012_PERMANENT_ALLOCATION,
  type NumCp012PermanentAuthorityId,
  type NumCp012PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp012Wave01 } from "./wave01/runtime.ts";
import type { NumCp012Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp012Wave02 } from "./wave02/runtime.ts";
import type { NumCp012Wave02PrototypeId } from "./wave02/types.ts";

export interface NumCp012PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-012";
  readonly authorityId: NumCp012PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp012PermanentQlId;
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
    permanentQlId: NumCp012PermanentQlId;
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
  if (!match) throw new Error(`Malformed NUM-CP-012 prototype id: ${prototypeId}`);
  return Number(match[1]);
}

function generateSource(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 8) return generateNumCp012Wave01(prototypeId as NumCp012Wave01PrototypeId, seed);
  if (number <= 14) return generateNumCp012Wave02(prototypeId as NumCp012Wave02PrototypeId, seed);
  throw new Error(`Unknown NUM-CP-012 prototype id: ${prototypeId}`);
}

function chooseSourcePrototype(sourcePrototypes: readonly string[], seed: number) {
  if (sourcePrototypes.length === 1) return sourcePrototypes[0]!;
  return sourcePrototypes[(seed - 1) % sourcePrototypes.length]!;
}

function normalizedVerifierAnswer(source: ReturnType<typeof generateSource>) {
  if (
    source.temporaryPrototypeId === "NUM-CP012-PROT-009"
    && source.canonicalAnswer !== "NO_INTEGER_ROOT"
    && Number(source.hiddenState.k) % 2 === 0
    && BigInt(String(source.hiddenState.value)) >= 0n
  ) {
    return source.canonicalAnswer;
  }
  return source.verifierAnswer;
}

export function generateNumCp012Permanent(
  qlId: NumCp012PermanentQlId,
  seed: number,
): NumCp012PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) {
    throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  }

  const allocation = NUM_CP012_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-012 permanent QL: ${qlId}`);

  const sourcePrototypeId = chooseSourcePrototype(allocation.sourcePrototypes, seed);
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
    verifierAnswer: normalizedVerifierAnswer(source),
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
  }) as NumCp012PermanentPackage;
}
