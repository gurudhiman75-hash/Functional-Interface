export const SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS = [
  "CONSTANT_NONZERO_FOURTH_DIFFERENCE",
  "CONSTANT_NONZERO_FIFTH_DIFFERENCE",
  "ADD_PREVIOUS_TWO_REPROBE",
  "DIFFERENCE_PREVIOUS_TWO",
  "WEIGHTED_PREVIOUS_TWO",
  "AFFINE_PREVIOUS_TWO_PLUS_CONSTANT",
  "ADD_PREVIOUS_THREE",
  "WEIGHTED_PREVIOUS_THREE",
] as const;

export type SerNumericWaveB1SourceFamilyId =
  (typeof SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS)[number];

export const SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS = [
  "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE",
  "LINEAR_STATEFUL_RECURRENCE",
] as const;

export type SerNumericWaveB1CanonicalAuthorityId =
  (typeof SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS)[number];

export type SerNumericWaveB1TemporaryTemplateId = `SER-NUMERIC-WAVE-B1-TMP-${string}`;

export const SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS = Array.from(
  { length: SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS.length * 4 },
  (_, index) =>
    `SER-NUMERIC-WAVE-B1-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerNumericWaveB1TemporaryTemplateId[];

export type SerNumericWaveB1TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerNumericWaveB1Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SerNumericWaveB1OwnershipDisposition =
  | "PROVISIONAL_EXTENSION_CP003"
  | "PROVISIONAL_GENERALISE_CP004"
  | "PROVISIONAL_NEW_WAVE_B1";

export interface SerNumericWaveB1Template {
  readonly temporaryTemplateId: SerNumericWaveB1TemporaryTemplateId;
  readonly sourceFamilyId: SerNumericWaveB1SourceFamilyId;
  readonly canonicalAuthorityId: SerNumericWaveB1CanonicalAuthorityId;
  readonly taskKind: SerNumericWaveB1TaskKind;
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly ownershipDisposition: SerNumericWaveB1OwnershipDisposition;
  readonly provisionalOwnerCheckpoint: "SER-CP-003" | "SER-CP-004" | "SER-NUMERIC-WAVE-B1";
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const;

function authorityFor(sourceFamilyId: SerNumericWaveB1SourceFamilyId): Pick<
  SerNumericWaveB1Template,
  | "canonicalAuthorityId"
  | "ownershipDisposition"
  | "provisionalOwnerCheckpoint"
> {
  switch (sourceFamilyId) {
    case "CONSTANT_NONZERO_FOURTH_DIFFERENCE":
    case "CONSTANT_NONZERO_FIFTH_DIFFERENCE":
      return {
        canonicalAuthorityId: "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE",
        ownershipDisposition: "PROVISIONAL_EXTENSION_CP003",
        provisionalOwnerCheckpoint: "SER-CP-003",
      };
    case "ADD_PREVIOUS_TWO_REPROBE":
      return {
        canonicalAuthorityId: "LINEAR_STATEFUL_RECURRENCE",
        ownershipDisposition: "PROVISIONAL_GENERALISE_CP004",
        provisionalOwnerCheckpoint: "SER-CP-004",
      };
    case "DIFFERENCE_PREVIOUS_TWO":
    case "WEIGHTED_PREVIOUS_TWO":
    case "AFFINE_PREVIOUS_TWO_PLUS_CONSTANT":
      return {
        canonicalAuthorityId: "LINEAR_STATEFUL_RECURRENCE",
        ownershipDisposition: "PROVISIONAL_NEW_WAVE_B1",
        provisionalOwnerCheckpoint: "SER-NUMERIC-WAVE-B1",
      };
    case "ADD_PREVIOUS_THREE":
    case "WEIGHTED_PREVIOUS_THREE":
      return {
        canonicalAuthorityId: "LINEAR_STATEFUL_RECURRENCE",
        ownershipDisposition: "PROVISIONAL_NEW_WAVE_B1",
        provisionalOwnerCheckpoint: "SER-NUMERIC-WAVE-B1",
      };
  }
}

export const SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATES: readonly SerNumericWaveB1Template[] =
  SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const sourceFamilyId =
      SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS[Math.floor(index / 4)]!;
    const taskKind = TASKS[index % 4]!;
    return {
      temporaryTemplateId,
      sourceFamilyId,
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM" ? "WRONG_DISPLAYED_TERM" : "TERM_VALUE",
      ...authorityFor(sourceFamilyId),
    };
  });

export interface SerNumericWaveB1HiddenState {
  readonly parameterKey: string;
  readonly canonicalSequence: readonly number[];
  readonly targetIndex: number;
  readonly corruptedValue: number | null;
  readonly correctReplacement: number;
}

export interface SerNumericWaveB1Explanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerNumericWaveB1Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-NUMERIC-WAVE-B1";
  readonly temporaryTemplateId: SerNumericWaveB1TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceFamilyId: SerNumericWaveB1SourceFamilyId;
  readonly canonicalAuthorityId: SerNumericWaveB1CanonicalAuthorityId;
  readonly ownershipDisposition: SerNumericWaveB1OwnershipDisposition;
  readonly provisionalOwnerCheckpoint: "SER-CP-003" | "SER-CP-004" | "SER-NUMERIC-WAVE-B1";
  readonly taskKind: SerNumericWaveB1TaskKind;
  readonly solveMode:
    | "INFER_HIGHER_ORDER_FINITE_DIFFERENCE"
    | "INFER_STATEFUL_LINEAR_RECURRENCE";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly language: "en-IN";
  readonly difficulty: SerNumericWaveB1Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (number | null)[];
  readonly options: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerNumericWaveB1Explanation;
  readonly hiddenState: SerNumericWaveB1HiddenState;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SerNumericWaveB1IndependentSolution {
  readonly answer: number;
  readonly canonicalAuthorityId: SerNumericWaveB1CanonicalAuthorityId;
  readonly parameterKeys: readonly string[];
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}
