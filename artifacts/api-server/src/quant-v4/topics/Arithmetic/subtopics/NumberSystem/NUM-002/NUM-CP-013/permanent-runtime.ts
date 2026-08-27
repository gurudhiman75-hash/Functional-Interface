import {
  NUM_CP013_PERMANENT_ALLOCATION,
  type NumCp013PermanentAuthorityId,
  type NumCp013PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp013Wave01 } from "./wave01/runtime-v2.ts";
import type { NumCp013Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp013Wave02 } from "./wave02/runtime-v4.ts";
import type { NumCp013Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp013Wave03 } from "./wave03/runtime.ts";
import type { NumCp013Wave03PrototypeId } from "./wave03/types.ts";

export interface NumCp013PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-013";
  readonly authorityId: NumCp013PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp013PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly taskKind: string;
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
    permanentQlId: NumCp013PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "ENGLISH_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/(\d{3})$/u);
  if (!match) throw new Error(`Malformed NUM-CP-013 prototype id: ${prototypeId}`);
  return Number(match[1]);
}

function generateSource(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 8) return generateNumCp013Wave01(prototypeId as NumCp013Wave01PrototypeId, seed);
  if (number <= 14) return generateNumCp013Wave02(prototypeId as NumCp013Wave02PrototypeId, seed);
  if (number <= 22) return generateNumCp013Wave03(prototypeId as NumCp013Wave03PrototypeId, seed);
  throw new Error(`Unknown NUM-CP-013 prototype id: ${prototypeId}`);
}

type SourcePackage = ReturnType<typeof generateSource>;

function chooseSourcePrototype(sourcePrototypes: readonly string[], seed: number) {
  if (sourcePrototypes.length === 1) return sourcePrototypes[0]!;
  return sourcePrototypes[(seed - 1) % sourcePrototypes.length]!;
}

function normalizeOptionOrder(source: SourcePackage, seed: number) {
  const correct = source.options[source.correctIndex];
  if (!correct?.isCorrect || correct.value !== source.canonicalAnswer) {
    throw new Error(`${source.temporaryPrototypeId}/${seed}: source answer binding drift before permanent freeze.`);
  }
  const distractors = source.options.filter((_, index) => index !== source.correctIndex);
  if (distractors.length !== 3 || new Set(source.options.map((option) => option.value)).size !== 4) {
    throw new Error(`${source.temporaryPrototypeId}/${seed}: source option set is not a four-value MCQ.`);
  }
  const shift = seed % distractors.length;
  const rotated = [...distractors.slice(shift), ...distractors.slice(0, shift)];
  const targetCorrectIndex = (seed - 1) % 4;
  const options = [...rotated];
  options.splice(targetCorrectIndex, 0, correct);
  return {
    options: Object.freeze(options.map((option) => Object.freeze({ ...option }))),
    correctIndex: targetCorrectIndex,
  };
}

function freezeExplanation(source: SourcePackage) {
  const derivation = [...source.explanation.fullDerivation];
  const shortcuts = [...source.explanation.examShortcut];
  if (derivation.length < 3) throw new Error(`${source.temporaryPrototypeId}: derivation too thin for permanent English freeze.`);

  const coreConcept = derivation[0]!;
  const strategy = shortcuts[0] ?? derivation[1]!;
  const candidateSteps = derivation.slice(1, 5);
  while (candidateSteps.length < 2 && shortcuts.length > 0) {
    const next = shortcuts[candidateSteps.length];
    if (!next) break;
    candidateSteps.push(next);
  }
  if (candidateSteps.length < 2) throw new Error(`${source.temporaryPrototypeId}: fewer than two learner steps after permanent projection.`);

  return Object.freeze({
    coreConcept,
    strategy,
    steps: Object.freeze(candidateSteps.slice(0, 4)),
    finalAnswer: source.canonicalAnswer,
  });
}

export function generateNumCp013Permanent(
  qlId: NumCp013PermanentQlId,
  seed: number,
): NumCp013PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) {
    throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  }

  const allocation = NUM_CP013_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-013 permanent QL: ${qlId}`);

  const sourcePrototypeId = chooseSourcePrototype(allocation.sourcePrototypes, seed);
  const sourceSeed = seed;
  const source = generateSource(sourcePrototypeId, sourceSeed);

  if (source.temporaryPrototypeId !== sourcePrototypeId) {
    throw new Error(`${qlId}: source prototype drift; expected ${sourcePrototypeId}, received ${source.temporaryPrototypeId}`);
  }
  if (source.canonicalAnswer !== source.verifierAnswer) {
    throw new Error(`${qlId}/${seed}: certified source canonical/verifier drift (${source.canonicalAnswer} vs ${source.verifierAnswer}).`);
  }

  const normalizedOptions = normalizeOptionOrder(source, seed);

  return Object.freeze({
    ...source,
    authorityId: allocation.authorityId,
    authorityLabel: allocation.label,
    permanentQlId: qlId,
    seed,
    sourceSeed,
    answerSemantic: allocation.authorityAnswerSemantic,
    sourceAnswerSemantic: source.answerSemantic,
    options: normalizedOptions.options,
    correctIndex: normalizedOptions.correctIndex,
    explanation: freezeExplanation(source),
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
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  }) as NumCp013PermanentPackage;
}
