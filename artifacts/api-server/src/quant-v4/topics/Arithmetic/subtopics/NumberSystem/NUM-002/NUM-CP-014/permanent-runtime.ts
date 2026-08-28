import {
  NUM_CP014_PERMANENT_ALLOCATION,
  type NumCp014PermanentAuthorityId,
  type NumCp014PermanentQlId,
} from "./permanent-allocation.ts";
import { resolveNumCp014AuthorityCandidate } from "./wave05/freeze-readiness-projection.ts";

export interface NumCp014PermanentPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-014";
  readonly authorityId: NumCp014PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly permanentQlId: NumCp014PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly sourcePrototypeId: string;
  readonly locale: "en-IN";
  readonly difficulty: "HARD";
  readonly taskKind: string;
  readonly answerSemantic: string;
  readonly sourceAnswerSemantic: string;
  readonly representation: string;
  readonly representationPayload?: unknown;
  readonly stem: string;
  readonly options: readonly Readonly<{
    value: string;
    isCorrect: boolean;
    misconceptionId: string;
  }>[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly componentEngines: readonly string[];
  readonly ablation: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
    fullDerivation: readonly string[];
    examShortcut: readonly string[];
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: NumCp014PermanentQlId;
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

function normalizeOptions(source: any, permanentSeed: number) {
  if (!Array.isArray(source.options) || source.options.length !== 4) {
    throw new Error(`${source.temporaryPrototypeId}: source option set is not a four-option MCQ.`);
  }
  if (!Number.isInteger(source.correctIndex) || source.correctIndex < 0 || source.correctIndex > 3) {
    throw new Error(`${source.temporaryPrototypeId}: invalid source correct index.`);
  }
  const sourceCorrect = source.options[source.correctIndex];
  if (!sourceCorrect || String(sourceCorrect.value) !== String(source.canonicalAnswer)) {
    throw new Error(`${source.temporaryPrototypeId}: source answer binding drift before permanent freeze.`);
  }
  if (new Set(source.options.map((option: any) => String(option.value))).size !== 4) {
    throw new Error(`${source.temporaryPrototypeId}: source options are not four unique values.`);
  }

  const correct = Object.freeze({
    value: String(source.canonicalAnswer),
    isCorrect: true,
    misconceptionId: "CORRECT",
  });
  const distractors = source.options
    .filter((_: unknown, index: number) => index !== source.correctIndex)
    .map((option: any) => Object.freeze({
      value: String(option.value),
      isCorrect: false,
      misconceptionId: String(option.misconceptionId ?? "SYNTHESIS_DISTRACTOR"),
    }));
  const rotate = permanentSeed % distractors.length;
  const rotated = [...distractors.slice(rotate), ...distractors.slice(0, rotate)];
  const targetCorrectIndex = (permanentSeed - 1) % 4;
  const options = [...rotated];
  options.splice(targetCorrectIndex, 0, correct);
  return Object.freeze({
    options: Object.freeze(options),
    correctIndex: targetCorrectIndex,
  });
}

function freezeExplanation(source: any) {
  const fullDerivation = Object.freeze([...(source.explanation?.fullDerivation ?? [])].map(String));
  const examShortcut = Object.freeze([...(source.explanation?.examShortcut ?? [])].map(String));
  if (source.explanation?.standard !== "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1") {
    throw new Error(`${source.temporaryPrototypeId}: explanation standard drift.`);
  }
  if (fullDerivation.length < 3 || examShortcut.length < 1) {
    throw new Error(`${source.temporaryPrototypeId}: permanent explanation is too thin.`);
  }
  return Object.freeze({
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
    fullDerivation,
    examShortcut,
    coreConcept: fullDerivation[0]!,
    strategy: examShortcut[0]!,
    steps: Object.freeze(fullDerivation.slice(1)),
    finalAnswer: String(source.canonicalAnswer),
  });
}

export function generateNumCp014Permanent(
  qlId: NumCp014PermanentQlId,
  seed: number,
): NumCp014PermanentPackage {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  const allocation = NUM_CP014_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId);
  if (!allocation) throw new Error(`Unknown NUM-CP-014 permanent QL: ${qlId}`);

  const projection = resolveNumCp014AuthorityCandidate(allocation.authorityId, seed);
  const source = projection.sourcePackage as any;

  if (!allocation.sourcePrototypes.includes(projection.sourcePrototypeId as never)) {
    throw new Error(`${qlId}/${seed}: projected source ${projection.sourcePrototypeId} is outside permanent authority ancestry.`);
  }
  if (String(source.canonicalAnswer) !== String(source.verifierAnswer)) {
    throw new Error(`${qlId}/${seed}: canonical/verifier answer drift.`);
  }
  if (!source.ablation || !source.componentEngines || source.componentEngines.length < 2) {
    throw new Error(`${qlId}/${seed}: synthesis necessity evidence missing.`);
  }

  const normalizedOptions = normalizeOptions(source, seed);
  const explanation = freezeExplanation(source);
  const representation = String(source.representation ?? "STANDARD_SYNTHESIS");
  const taskKind = String(source.taskKind ?? source.answerSemantic ?? projection.answerSemantic);

  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-014" as const,
    authorityId: allocation.authorityId,
    authorityLabel: allocation.label,
    permanentQlId: qlId,
    seed,
    sourceSeed: projection.sourceSeed,
    sourcePrototypeId: projection.sourcePrototypeId,
    locale: "en-IN" as const,
    difficulty: "HARD" as const,
    taskKind,
    answerSemantic: allocation.authorityAnswerSemantic,
    sourceAnswerSemantic: projection.answerSemantic,
    representation,
    ...(source.representationPayload ? { representationPayload: source.representationPayload } : {}),
    stem: String(source.stem),
    options: normalizedOptions.options,
    correctIndex: normalizedOptions.correctIndex,
    canonicalAnswer: String(source.canonicalAnswer),
    verifierAnswer: String(source.verifierAnswer),
    hiddenState: Object.freeze({ ...source.hiddenState }),
    componentEngines: Object.freeze([...source.componentEngines].map(String)),
    ablation: Object.freeze({ ...source.ablation }),
    mathematicalFingerprint: String(source.mathematicalFingerprint),
    explanation,
    sourceAncestry: Object.freeze([
      "NUM-002",
      "NUM-CP-014",
      allocation.authorityId,
      projection.sourcePrototypeId,
    ]),
    prototypeAncestry: Object.freeze([projection.sourcePrototypeId]),
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
  });
}
