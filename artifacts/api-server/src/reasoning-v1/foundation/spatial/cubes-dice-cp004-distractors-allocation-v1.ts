import { ALL_CUBE_FACES_V1, enumeratePaintedCuboidCellsV1, paintedFaceCountDistributionV1 } from "./cubes-dice-foundation-v1";
import { generateCubesDiceEditorialQuestionV2, type CubesDiceEditorialQuestionV2 } from "./cubes-dice-editorial-runtime-v2";
import { CND_001_MERGE_SPLIT_AUTHORITY_V1, CND_001_CANONICAL_SKILLS_V1 } from "./cubes-dice-merge-split-v1";
import type { CubesDiceTaskKindV1 } from "./cubes-dice-production-generator-v1";

export type CubesDiceCp004TaskKindV1 = Extract<
  CubesDiceTaskKindV1,
  "DICE_OPPOSITE_FROM_TWO_VIEWS" | "CUBE_NET_OPPOSITE_FACE" | "PAINTED_CUBE_EXACT_FACE_COUNT"
>;

export type CubesDicePermanentQlIdV1 = "SPA-QL-043" | "SPA-QL-044" | "SPA-QL-045";

export interface CubesDiceDistractorEvidenceV1 {
  optionIndex: number;
  value: string | number;
  family:
    | "ADJACENT_FACE_CONFUSED_WITH_OPPOSITE"
    | "NET_NEIGHBOUR_CONFUSED_WITH_OPPOSITE"
    | "WRONG_PAINTED_FACE_CATEGORY"
    | "BOUNDARY_FORMULA_CONFUSION";
  solverAttestedIncorrect: true;
}

export type CubesDiceCp004QuestionV1 = Readonly<
  Omit<
    CubesDiceEditorialQuestionV2,
    "version" | "permanentQlId" | "nextPermanentQlId" | "options" | "correctIndex" | "lifecycle"
  > & {
    version: "CND-001-CP004-QUESTION-V1";
    permanentQlId: CubesDicePermanentQlIdV1;
    nextPermanentQlId: "SPA-QL-046";
    options: readonly (string | number)[];
    correctIndex: number;
    distractorEvidence: readonly CubesDiceDistractorEvidenceV1[];
    lifecycle: Readonly<{
      reviewOnly: true;
      permanentQlAllocated: true;
      questionStudioRegistered: false;
      persistenceAllowed: false;
      questionBankWritable: false;
      testEligible: false;
      publiclyPublishable: false;
      automaticStudentPublication: false;
    }>;
  }
>;

export const CND_001_CP004_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-CP004-DISTRACTORS-ALLOCATION-V1" as const,
  chapterCode: "CND-001" as const,
  mergeSplitAuthorityId: CND_001_MERGE_SPLIT_AUTHORITY_V1.authorityId,
  approvedCanonicalSkillIds: [
    "CND-CAN-A-DIE-FACE-RELATIONS",
    "CND-CAN-B-CUBE-NET-FOLDING",
    "CND-CAN-C-PAINTED-CUBE-EXPOSURE",
  ] as const,
  allocatedRange: "SPA-QL-043..SPA-QL-045" as const,
  nextPermanentQlId: "SPA-QL-046" as const,
  distractorPolicy: "SOLVER_ATTESTED_PLAUSIBLE_MISCONCEPTION_DISTRACTORS" as const,
  permanentQlAllocationAuthorized: true,
  englishRuntimeFrozen: false,
  localizationAllowed: false,
  questionStudioRegistrationAllowed: false,
  automaticStudentPublication: false,
});

const TASK_TO_QL: Readonly<Record<CubesDiceCp004TaskKindV1, CubesDicePermanentQlIdV1>> = Object.freeze({
  DICE_OPPOSITE_FROM_TWO_VIEWS: "SPA-QL-043",
  CUBE_NET_OPPOSITE_FACE: "SPA-QL-044",
  PAINTED_CUBE_EXACT_FACE_COUNT: "SPA-QL-045",
});

function paintedFaceCountFromStem(stem: string): number {
  const match = stem.match(/exactly (\d+) painted face/i);
  if (!match) throw new Error(`CND CP004 could not resolve painted-face count from stem: ${stem}`);
  return Number(match[1]);
}

function uniquePaintedDistractors(base: CubesDiceEditorialQuestionV2): readonly { value: number; family: CubesDiceDistractorEvidenceV1["family"] }[] {
  const n = Number(base.scene.subdivisionsPerEdge);
  const requestedFaceCount = paintedFaceCountFromStem(base.stem);
  const cells = enumeratePaintedCuboidCellsV1({ xCount: n, yCount: n, zCount: n, paintedFaces: ALL_CUBE_FACES_V1 });
  const distribution = paintedFaceCountDistributionV1(cells);
  const correct = Number(base.answer);
  const candidates: { value: number; family: CubesDiceDistractorEvidenceV1["family"] }[] = [];

  for (let faceCount = 0; faceCount <= 3; faceCount += 1) {
    if (faceCount === requestedFaceCount) continue;
    candidates.push({ value: distribution[faceCount] ?? 0, family: "WRONG_PAINTED_FACE_CATEGORY" });
  }

  candidates.push(
    { value: Math.max(0, (n - 2) ** 2), family: "BOUNDARY_FORMULA_CONFUSION" },
    { value: Math.max(0, 4 * (n - 2)), family: "BOUNDARY_FORMULA_CONFUSION" },
    { value: Math.max(0, 6 * (n - 2)), family: "BOUNDARY_FORMULA_CONFUSION" },
    { value: Math.max(0, n ** 2), family: "BOUNDARY_FORMULA_CONFUSION" },
    { value: Math.max(0, correct + n), family: "BOUNDARY_FORMULA_CONFUSION" },
    { value: Math.max(0, correct - n), family: "BOUNDARY_FORMULA_CONFUSION" },
  );

  const seen = new Set<number>([correct]);
  const unique: { value: number; family: CubesDiceDistractorEvidenceV1["family"] }[] = [];
  for (const candidate of candidates) {
    if (!Number.isFinite(candidate.value) || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    unique.push(candidate);
    if (unique.length === 3) break;
  }
  if (unique.length !== 3) throw new Error(`CND CP004 could not build three unique painted-cube distractors for ${base.seed}.`);
  return Object.freeze(unique);
}

function hardenOptions(base: CubesDiceEditorialQuestionV2): Readonly<{
  options: readonly (string | number)[];
  correctIndex: number;
  evidence: readonly CubesDiceDistractorEvidenceV1[];
}> {
  if (base.taskKind !== "PAINTED_CUBE_EXACT_FACE_COUNT") {
    const family = base.taskKind === "DICE_OPPOSITE_FROM_TWO_VIEWS"
      ? "ADJACENT_FACE_CONFUSED_WITH_OPPOSITE"
      : "NET_NEIGHBOUR_CONFUSED_WITH_OPPOSITE";
    const evidence = base.options
      .map((value, optionIndex) => ({ value, optionIndex }))
      .filter(({ optionIndex }) => optionIndex !== base.correctIndex)
      .map(({ value, optionIndex }) => Object.freeze({ optionIndex, value, family, solverAttestedIncorrect: true as const }));
    return Object.freeze({ options: base.options, correctIndex: base.correctIndex, evidence: Object.freeze(evidence) });
  }

  const distractors = uniquePaintedDistractors(base);
  const options: (string | number)[] = new Array(4);
  options[base.correctIndex] = base.answer;
  let cursor = 0;
  const evidence: CubesDiceDistractorEvidenceV1[] = [];
  for (let optionIndex = 0; optionIndex < options.length; optionIndex += 1) {
    if (optionIndex === base.correctIndex) continue;
    const distractor = distractors[cursor++]!;
    options[optionIndex] = distractor.value;
    evidence.push(Object.freeze({
      optionIndex,
      value: distractor.value,
      family: distractor.family,
      solverAttestedIncorrect: true as const,
    }));
  }
  return Object.freeze({ options: Object.freeze(options), correctIndex: base.correctIndex, evidence: Object.freeze(evidence) });
}

export function assertCubesDiceCp004QuestionV1(question: CubesDiceCp004QuestionV1): void {
  if (question.options.length !== 4) throw new Error(`${question.seed}: expected exactly four options.`);
  if (new Set(question.options.map(String)).size !== 4) throw new Error(`${question.seed}: options must be unique.`);
  if (question.correctIndex < 0 || question.correctIndex > 3) throw new Error(`${question.seed}: correctIndex is invalid.`);
  if (question.options[question.correctIndex] !== question.answer) throw new Error(`${question.seed}: correctIndex does not point to solver answer.`);
  if (question.options.filter((option) => option === question.answer).length !== 1) throw new Error(`${question.seed}: solver answer must appear exactly once.`);
  if (question.distractorEvidence.length !== 3) throw new Error(`${question.seed}: exactly three distractors require evidence.`);
  for (const evidence of question.distractorEvidence) {
    if (evidence.optionIndex === question.correctIndex) throw new Error(`${question.seed}: answer cannot be tagged as distractor.`);
    if (question.options[evidence.optionIndex] !== evidence.value) throw new Error(`${question.seed}: distractor evidence does not match option.`);
    if (evidence.value === question.answer) throw new Error(`${question.seed}: distractor duplicates solver answer.`);
    if (!evidence.solverAttestedIncorrect) throw new Error(`${question.seed}: distractor must be solver-attested incorrect.`);
  }
}

export function generateCubesDiceCp004QuestionV1(input: Readonly<{ seed: string; taskKind: CubesDiceCp004TaskKindV1 }>): CubesDiceCp004QuestionV1 {
  const base = generateCubesDiceEditorialQuestionV2(input);
  const hardened = hardenOptions(base);
  const question: CubesDiceCp004QuestionV1 = Object.freeze({
    ...base,
    version: "CND-001-CP004-QUESTION-V1",
    permanentQlId: TASK_TO_QL[input.taskKind],
    nextPermanentQlId: "SPA-QL-046",
    options: hardened.options,
    correctIndex: hardened.correctIndex,
    distractorEvidence: hardened.evidence,
    lifecycle: Object.freeze({
      reviewOnly: true,
      permanentQlAllocated: true,
      questionStudioRegistered: false,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
  assertCubesDiceCp004QuestionV1(question);
  return question;
}

const approved = CND_001_CANONICAL_SKILLS_V1.filter((skill) => CND_001_CP004_AUTHORITY_V1.approvedCanonicalSkillIds.includes(skill.canonicalSkillId as (typeof CND_001_CP004_AUTHORITY_V1.approvedCanonicalSkillIds)[number]));
if (approved.length !== 3) throw new Error("CND CP004 must authorize exactly three retained canonical skills.");
