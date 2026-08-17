import { generateIopAdvancedCaselet } from "./advanced-generator.ts";
import { generateIopFoundationCaselet } from "./generator.ts";
import { generateIopMixedSourceCaselet } from "./mixed-source-gap.ts";
import {
  generateIopEnglishBoxSource,
  generateIopEnglishNumericSource,
  generateIopEnglishTextSource,
} from "./english-source-engines.ts";
import type { IopAdvancedPrototypeId } from "./advanced-types.ts";
import type { IopPermanentQlId, IopPermanentSolveMode } from "./permanent-authorities.ts";
import type { IopPrototypeId } from "./types.ts";
import type {
  IopEnglishChildQuestion,
  IopEnglishGeneratedSource,
  IopEnglishOption,
  IopEnglishProductionCaselet,
  IopEnglishQueryEvidence,
  IopEnglishTrace,
} from "./english-production-types.ts";

export type IopEnglishEngineKind =
  | "FOUNDATION_PROTOTYPE"
  | "ADVANCED_PROTOTYPE"
  | "NUMERIC_PARITY_SOURCE"
  | "TEXT_RBI_SOURCE"
  | "MIXED_RBI_SOURCE"
  | "BOX_SOURCE";

export interface IopEnglishSourceModeAuthority {
  readonly sourceModeId: string;
  readonly qlId: IopPermanentQlId;
  readonly title: string;
  readonly engineKind: IopEnglishEngineKind;
  readonly prototypeId?: IopPrototypeId | IopAdvancedPrototypeId;
  readonly sourceEvidenceIds: readonly string[];
  readonly sourceStatus: "SOURCE_WHITELISTED_V1";
  readonly supportedSolveModes: readonly IopPermanentSolveMode[];
}

const ALL_SOLVE_MODES: readonly IopPermanentSolveMode[] = [
  "STEP_OUTPUT",
  "FINAL_OUTPUT",
  "ELEMENT_AT_POSITION",
  "POSITION_OF_ELEMENT",
  "STEP_NUMBER",
  "PREVIOUS_STEP",
  "MISSING_STEP",
  "REMAINING_STEP_COUNT",
] as const;

const BOX_SOLVE_MODES: readonly IopPermanentSolveMode[] = [
  "STEP_OUTPUT",
  "FINAL_OUTPUT",
  "STEP_NUMBER",
  "PREVIOUS_STEP",
  "MISSING_STEP",
  "REMAINING_STEP_COUNT",
] as const;

export const IOP_ENGLISH_SOURCE_MODES: readonly IopEnglishSourceModeAuthority[] = Object.freeze([
  {
    sourceModeId: "QL001_WORD_ALPHA_ASC_LEFT",
    qlId: "IOP-QL-001",
    title: "Alphabetical word select-and-fix",
    engineKind: "FOUNDATION_PROTOTYPE",
    prototypeId: "IOP-CP001-PROT-001",
    sourceEvidenceIds: ["SATHEE_BANK_INPUT_OUTPUT", "TESTBOOK_SINGLE_SHIFT"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL001_WORD_ALPHA_DESC_RIGHT",
    qlId: "IOP-QL-001",
    title: "Reverse-alphabetical word select-and-fix",
    engineKind: "FOUNDATION_PROTOTYPE",
    prototypeId: "IOP-CP001-PROT-002",
    sourceEvidenceIds: ["SATHEE_BANK_INPUT_OUTPUT"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL001_NUMBER_ASC_LEFT",
    qlId: "IOP-QL-001",
    title: "Ascending number select-and-fix",
    engineKind: "FOUNDATION_PROTOTYPE",
    prototypeId: "IOP-CP001-PROT-003",
    sourceEvidenceIds: ["SATHEE_BANK_INPUT_OUTPUT", "TESTBOOK_SINGLE_SHIFT"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL001_WORD_LENGTH_ASC_LEFT",
    qlId: "IOP-QL-001",
    title: "Word-length select-and-fix",
    engineKind: "ADVANCED_PROTOTYPE",
    prototypeId: "IOP-CP005-PROT-001",
    sourceEvidenceIds: ["SATHEE_BANK_INPUT_OUTPUT", "CAREERS360_INPUT_OUTPUT_2026"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL001_NUMBER_DIGIT_SUM_ASC_LEFT",
    qlId: "IOP-QL-001",
    title: "Digit-sum select-and-fix",
    engineKind: "ADVANCED_PROTOTYPE",
    prototypeId: "IOP-CP005-PROT-002",
    sourceEvidenceIds: ["PRACTICEMOCK_RBI_WORD_NUMBER_PIPELINE", "CAREERS360_INPUT_OUTPUT_2026"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL001_WORD_LENGTH_DESC_RIGHT",
    qlId: "IOP-QL-001",
    title: "Descending word-length select-and-fix",
    engineKind: "ADVANCED_PROTOTYPE",
    prototypeId: "IOP-CP005-PROT-003",
    sourceEvidenceIds: ["SATHEE_BANK_INPUT_OUTPUT", "CAREERS360_INPUT_OUTPUT_2026"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  ...(["001", "002", "003"] as const).map((suffix) => ({
    sourceModeId: `QL002_BLOCKED_${suffix}`,
    qlId: "IOP-QL-002" as const,
    title: `Blocked multi-category rearrangement ${suffix}`,
    engineKind: "FOUNDATION_PROTOTYPE" as const,
    prototypeId: `IOP-CP002-PROT-${suffix}` as IopPrototypeId,
    sourceEvidenceIds: ["TESTBOOK_MACHINE_INPUT_OUTPUT", "SATHEE_BANK_INPUT_OUTPUT"],
    sourceStatus: "SOURCE_WHITELISTED_V1" as const,
    supportedSolveModes: ALL_SOLVE_MODES,
  })),
  ...(["001", "002", "003"] as const).map((suffix) => ({
    sourceModeId: `QL003_SIMULTANEOUS_${suffix}`,
    qlId: "IOP-QL-003" as const,
    title: `Simultaneous multi-action rearrangement ${suffix}`,
    engineKind: "FOUNDATION_PROTOTYPE" as const,
    prototypeId: `IOP-CP003-PROT-${suffix}` as IopPrototypeId,
    sourceEvidenceIds: ["SATHEE_SIMULTANEOUS_INPUT_OUTPUT", "TESTBOOK_DOUBLE_SHIFT"],
    sourceStatus: "SOURCE_WHITELISTED_V1" as const,
    supportedSolveModes: ALL_SOLVE_MODES,
  })),
  ...(["001", "002", "003"] as const).map((suffix) => ({
    sourceModeId: `QL004_ALTERNATING_${suffix}`,
    qlId: "IOP-QL-004" as const,
    title: `Alternating/interleaved rearrangement ${suffix}`,
    engineKind: "FOUNDATION_PROTOTYPE" as const,
    prototypeId: `IOP-CP004-PROT-${suffix}` as IopPrototypeId,
    sourceEvidenceIds: ["RBI_BANKING_ALTERNATING_INPUT_OUTPUT", "SATHEE_BANK_INPUT_OUTPUT"],
    sourceStatus: "SOURCE_WHITELISTED_V1" as const,
    supportedSolveModes: ALL_SOLVE_MODES,
  })),
  {
    sourceModeId: "QL005_NUM_PARITY_REVERSE_INCREMENT_TWO_ENDED",
    qlId: "IOP-QL-005",
    title: "Odd reverse / even increment two-ended numeric machine",
    engineKind: "NUMERIC_PARITY_SOURCE",
    sourceEvidenceIds: ["BANKERSADDA_INPUT_OUTPUT_FOR_BANK_EXAMS"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL006_TEXT_RBI_LASTLETTER_VOWELCOUNT_REMOVE_SORT_SHIFT",
    qlId: "IOP-QL-006",
    title: "RBI-style five-stage word transformation pipeline",
    engineKind: "TEXT_RBI_SOURCE",
    sourceEvidenceIds: ["PRACTICEMOCK_RBI_WORD_NUMBER_PIPELINE"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL007_RBI2024_TRANSFORMED_PAIR",
    qlId: "IOP-QL-007",
    title: "RBI Grade B 2024 mixed transformed-pair machine",
    engineKind: "MIXED_RBI_SOURCE",
    sourceEvidenceIds: ["RBI_GRADE_B_2024_SHIFT1_PYQ_RECONSTRUCTION"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: ALL_SOLVE_MODES,
  },
  {
    sourceModeId: "QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE",
    qlId: "IOP-QL-008",
    title: "Cross-product box arithmetic pipeline",
    engineKind: "BOX_SOURCE",
    sourceEvidenceIds: ["AFFAIRSCLOUD_MACHINE_INPUT_OUTPUT_SET37"],
    sourceStatus: "SOURCE_WHITELISTED_V1",
    supportedSolveModes: BOX_SOLVE_MODES,
  },
] as const);

const ENGLISH_LIFECYCLE: IopEnglishProductionCaselet["lifecycle"] = Object.freeze({
  maturity: "ENGLISH_REVIEW_CANDIDATE",
  permanentQlCount: 8,
  englishFreeze: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  hindiPunjabiStatus: "NOT_STARTED",
});

function hashSeed(seed: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 0x9e3779b9;
}

function makeRng(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

function rowFingerprint(row: readonly string[]): string {
  return row.join("\u241f");
}

function renderRow(row: readonly string[]): string {
  return row.join("  ");
}

function visibleRowsAreUnique(trace: IopEnglishTrace): boolean {
  const fingerprints = [trace.input, ...trace.steps].map(rowFingerprint);
  return new Set(fingerprints).size === fingerprints.length;
}

function normalizeFoundation(seed: string, prototypeId: IopPrototypeId): IopEnglishGeneratedSource {
  const caselet = generateIopFoundationCaselet(seed, prototypeId);
  const normalize = (trace: typeof caselet.target): IopEnglishTrace => ({
    input: trace.input.map((token) => token.visibleValue),
    steps: trace.steps.map((step) => step.tokens.map((token) => token.visibleValue)),
  });
  if (!caselet.identifiability.passed || !caselet.oracleParity) throw new Error(`${prototypeId} failed foundation production evidence`);
  return {
    demonstration: normalize(caselet.demonstration),
    target: normalize(caselet.target),
    ruleExplanation: caselet.ruleExplanation,
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

function normalizeAdvanced(seed: string, prototypeId: IopAdvancedPrototypeId): IopEnglishGeneratedSource {
  const caselet = generateIopAdvancedCaselet(seed, prototypeId);
  const normalize = (trace: typeof caselet.target): IopEnglishTrace => ({
    input: trace.input.map((token) => token.visibleValue),
    steps: trace.steps.map((step) => step.tokens.map((token) => token.visibleValue)),
  });
  if (!caselet.identifiability.passed || !caselet.oracleParity) throw new Error(`${prototypeId} failed advanced production evidence`);
  return {
    demonstration: normalize(caselet.demonstration),
    target: normalize(caselet.target),
    ruleExplanation: caselet.ruleExplanation,
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

function normalizeMixed(seed: string): IopEnglishGeneratedSource {
  const caselet = generateIopMixedSourceCaselet(seed);
  const normalize = (trace: typeof caselet.target): IopEnglishTrace => ({
    input: trace.input.map((token) => token.visibleValue),
    steps: trace.steps.map((step) => step.tokens.map((token) => token.visibleValue)),
  });
  if (!caselet.identifiability.passed || !caselet.oracleParity) throw new Error("RBI mixed source authority failed production evidence");
  return {
    demonstration: normalize(caselet.demonstration),
    target: normalize(caselet.target),
    ruleExplanation: caselet.ruleExplanation,
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

function modeFor(qlId: IopPermanentQlId, seed: string, requested?: string): IopEnglishSourceModeAuthority {
  const modes = IOP_ENGLISH_SOURCE_MODES.filter((mode) => mode.qlId === qlId);
  if (modes.length === 0) throw new Error(`No English source mode for ${qlId}`);
  if (requested) {
    const exact = modes.find((mode) => mode.sourceModeId === requested);
    if (!exact) throw new Error(`${requested} is not whitelisted for ${qlId}`);
    return exact;
  }
  return modes[hashSeed(`${seed}|MODE`) % modes.length]!;
}

function generatedFor(mode: IopEnglishSourceModeAuthority, seed: string): IopEnglishGeneratedSource {
  if (mode.engineKind === "FOUNDATION_PROTOTYPE") return normalizeFoundation(seed, mode.prototypeId as IopPrototypeId);
  if (mode.engineKind === "ADVANCED_PROTOTYPE") return normalizeAdvanced(seed, mode.prototypeId as IopAdvancedPrototypeId);
  if (mode.engineKind === "NUMERIC_PARITY_SOURCE") return generateIopEnglishNumericSource(seed);
  if (mode.engineKind === "TEXT_RBI_SOURCE") return generateIopEnglishTextSource(seed);
  if (mode.engineKind === "MIXED_RBI_SOURCE") return normalizeMixed(seed);
  return generateIopEnglishBoxSource(seed);
}

function difficultyFor(qlId: IopPermanentQlId): IopEnglishProductionCaselet["difficulty"] {
  if (qlId === "IOP-QL-001") return "Easy";
  if (["IOP-QL-002", "IOP-QL-003", "IOP-QL-004"].includes(qlId)) return "Medium";
  return "Hard";
}

function makeOption(display: string, fingerprint: string, isCorrect: boolean, misconception: string): IopEnglishOption {
  return { display, semanticFingerprint: fingerprint, isCorrect, misconception };
}

function fourOptions(
  correct: IopEnglishOption,
  wrong: readonly IopEnglishOption[],
  seed: string,
): readonly [IopEnglishOption, IopEnglishOption, IopEnglishOption, IopEnglishOption] {
  const unique = new Map<string, IopEnglishOption>([[correct.semanticFingerprint, correct]]);
  for (const option of wrong) if (!unique.has(option.semanticFingerprint)) unique.set(option.semanticFingerprint, option);
  const distractors = [...unique.values()].filter((option) => !option.isCorrect);
  if (distractors.length < 3) throw new Error(`Not enough semantic distractors for ${seed}`);
  const result = shuffle([correct, ...distractors.slice(0, 3)], makeRng(seed));
  return [result[0]!, result[1]!, result[2]!, result[3]!];
}

function mutateRow(row: readonly string[]): string[][] {
  const candidates: string[][] = [];
  if (row.length > 1) {
    candidates.push([...row].reverse());
    candidates.push([...row.slice(1), row[0]!]);
    const adjacent = [...row];
    [adjacent[0], adjacent[1]] = [adjacent[1]!, adjacent[0]!];
    candidates.push(adjacent);
    const ends = [...row];
    [ends[0], ends[ends.length - 1]] = [ends[ends.length - 1]!, ends[0]!];
    candidates.push(ends);
  } else {
    const value = Number(row[0]);
    if (Number.isFinite(value)) {
      const decimals = row[0]!.includes(".") ? 2 : 0;
      for (const delta of [1, -1, 2, -2]) candidates.push([(value + delta).toFixed(decimals)]);
    }
  }
  return candidates;
}

function rowOptions(
  trace: IopEnglishTrace,
  correctRow: readonly string[],
  seed: string,
): readonly [IopEnglishOption, IopEnglishOption, IopEnglishOption, IopEnglishOption] {
  const fingerprint = rowFingerprint(correctRow);
  const wrongRows: IopEnglishOption[] = [trace.input, ...trace.steps]
    .filter((row) => row.length === correctRow.length && rowFingerprint(row) !== fingerprint)
    .map((row) => makeOption(renderRow(row), `ROW:${rowFingerprint(row)}`, false, "wrong-step-state"));
  for (const candidate of mutateRow(correctRow)) {
    if (rowFingerprint(candidate) !== fingerprint) {
      wrongRows.push(makeOption(renderRow(candidate), `ROW:${rowFingerprint(candidate)}`, false, "local-state-mutation"));
    }
  }
  return fourOptions(makeOption(renderRow(correctRow), `ROW:${fingerprint}`, true, "correct"), wrongRows, seed);
}

function boundedNumericOptions(
  correct: number,
  minimum: number,
  maximum: number,
  prefix: string,
  suffix: string,
  seed: string,
): readonly [IopEnglishOption, IopEnglishOption, IopEnglishOption, IopEnglishOption] {
  const candidates = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index).filter((value) => value !== correct);
  const wrong = shuffle(candidates, makeRng(`${seed}|WRONG`)).map((value) => makeOption(`${prefix}${value}${suffix}`, `${prefix}:${value}`, false, "off-by-one"));
  return fourOptions(makeOption(`${prefix}${correct}${suffix}`, `${prefix}:${correct}`, true, "correct"), wrong, seed);
}

function ordinal(value: number): string {
  if (value % 100 >= 11 && value % 100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function findStepForElementQuery(trace: IopEnglishTrace, seed: string): number {
  const candidates = trace.steps
    .map((row, index) => ({ row, stepNumber: index + 1 }))
    .filter(({ row }) => row.length >= 4 && new Set(row).size === row.length);
  if (candidates.length === 0) throw new Error("No step supports a four-option element query");
  return candidates[hashSeed(seed) % candidates.length]!.stepNumber;
}

export function recomputeIopEnglishAnswer(trace: IopEnglishTrace, evidence: IopEnglishQueryEvidence): string {
  if (evidence.kind === "FINAL_OUTPUT") return renderRow(trace.steps.at(-1)!);
  if (evidence.kind === "STEP_OUTPUT") return renderRow(trace.steps[evidence.stepNumber - 1]!);
  if (evidence.kind === "ELEMENT_AT_POSITION") return trace.steps[evidence.stepNumber - 1]![evidence.position - 1]!;
  if (evidence.kind === "POSITION_OF_ELEMENT") {
    const position = trace.steps[evidence.stepNumber - 1]!.indexOf(evidence.element);
    if (position < 0) throw new Error("Element is absent from target step");
    return `${ordinal(position + 1)} from the left`;
  }
  if (evidence.kind === "STEP_NUMBER") {
    const step = trace.steps.findIndex((row) => rowFingerprint(row) === evidence.stateFingerprint);
    if (step < 0) throw new Error("State not found in target trace");
    return `Step ${step + 1}`;
  }
  if (evidence.kind === "PREVIOUS_STEP") {
    return renderRow(evidence.currentStepNumber === 1 ? trace.input : trace.steps[evidence.currentStepNumber - 2]!);
  }
  if (evidence.kind === "MISSING_STEP") return renderRow(trace.steps[evidence.missingStepNumber - 1]!);
  return `${trace.steps.length - evidence.stepNumber} steps`;
}

function makeQuestion(
  kind: IopPermanentSolveMode,
  trace: IopEnglishTrace,
  ruleExplanation: string,
  seed: string,
  questionOrder: 1 | 2 | 3 | 4,
): IopEnglishChildQuestion {
  const rng = makeRng(`${seed}|${kind}`);
  let evidence: IopEnglishQueryEvidence;
  let text: string;
  let options: readonly [IopEnglishOption, IopEnglishOption, IopEnglishOption, IopEnglishOption];
  let answerDisplay: string;
  let detail: string;

  if (kind === "FINAL_OUTPUT") {
    evidence = { kind };
    const row = trace.steps.at(-1)!;
    answerDisplay = renderRow(row);
    options = rowOptions(trace, row, `${seed}|OPTIONS`);
    text = "Which of the following is the final output for the new input?";
    detail = `The machine finishes at ${answerDisplay}.`;
  } else if (kind === "STEP_OUTPUT") {
    const stepNumber = 1 + Math.floor(rng() * trace.steps.length);
    evidence = { kind, stepNumber };
    const row = trace.steps[stepNumber - 1]!;
    answerDisplay = renderRow(row);
    options = rowOptions(trace, row, `${seed}|OPTIONS`);
    text = `Which of the following is Step ${stepNumber} for the new input?`;
    detail = `Applying the rule ${stepNumber} time${stepNumber === 1 ? "" : "s"} gives ${answerDisplay}.`;
  } else if (kind === "ELEMENT_AT_POSITION") {
    const stepNumber = findStepForElementQuery(trace, `${seed}|STEP`);
    const row = trace.steps[stepNumber - 1]!;
    const position = 1 + Math.floor(rng() * row.length);
    evidence = { kind, stepNumber, position };
    answerDisplay = row[position - 1]!;
    const wrong = shuffle(row.filter((value) => value !== answerDisplay), makeRng(`${seed}|WRONG`))
      .map((value) => makeOption(value, `ELEMENT:${value}`, false, "nearby-element"));
    options = fourOptions(makeOption(answerDisplay, `ELEMENT:${answerDisplay}`, true, "correct"), wrong, `${seed}|OPTIONS`);
    text = `Which element is at the ${ordinal(position)} position from the left in Step ${stepNumber}?`;
    detail = `Step ${stepNumber} is ${renderRow(row)}, so its ${ordinal(position)} element is ${answerDisplay}.`;
  } else if (kind === "POSITION_OF_ELEMENT") {
    const stepNumber = findStepForElementQuery(trace, `${seed}|STEP`);
    const row = trace.steps[stepNumber - 1]!;
    const position = 1 + Math.floor(rng() * row.length);
    const element = row[position - 1]!;
    evidence = { kind, stepNumber, element };
    answerDisplay = `${ordinal(position)} from the left`;
    const wrong = Array.from({ length: row.length }, (_, index) => index + 1)
      .filter((value) => value !== position)
      .map((value) => makeOption(`${ordinal(value)} from the left`, `POSITION:${value}`, false, "off-by-one-position"));
    options = fourOptions(makeOption(answerDisplay, `POSITION:${position}`, true, "correct"), shuffle(wrong, makeRng(`${seed}|WRONG`)), `${seed}|OPTIONS`);
    text = `What is the position of ${element} from the left in Step ${stepNumber}?`;
    detail = `In Step ${stepNumber}, ${element} is at the ${ordinal(position)} position from the left.`;
  } else if (kind === "STEP_NUMBER") {
    const stepNumber = 1 + Math.floor(rng() * trace.steps.length);
    const row = trace.steps[stepNumber - 1]!;
    evidence = { kind, stateFingerprint: rowFingerprint(row) };
    answerDisplay = `Step ${stepNumber}`;
    options = boundedNumericOptions(stepNumber, 1, trace.steps.length, "Step ", "", `${seed}|OPTIONS`);
    text = `At which step does the arrangement ${renderRow(row)} occur?`;
    detail = `Tracing from the new input shows this state first appears at Step ${stepNumber}.`;
  } else if (kind === "PREVIOUS_STEP") {
    const currentStepNumber = 2 + Math.floor(rng() * (trace.steps.length - 1));
    const current = trace.steps[currentStepNumber - 1]!;
    const previous = trace.steps[currentStepNumber - 2]!;
    evidence = { kind, currentStepNumber };
    answerDisplay = renderRow(previous);
    options = rowOptions(trace, previous, `${seed}|OPTIONS`);
    text = `The machine is at ${renderRow(current)} in Step ${currentStepNumber}. Which of the following was Step ${currentStepNumber - 1}?`;
    detail = `One stage earlier, the trace is ${answerDisplay}.`;
  } else if (kind === "MISSING_STEP") {
    const missingStepNumber = 2 + Math.floor(rng() * (trace.steps.length - 2));
    const before = trace.steps[missingStepNumber - 2]!;
    const missing = trace.steps[missingStepNumber - 1]!;
    const after = trace.steps[missingStepNumber]!;
    evidence = { kind, missingStepNumber };
    answerDisplay = renderRow(missing);
    options = rowOptions(trace, missing, `${seed}|OPTIONS`);
    text = `Step ${missingStepNumber - 1} is ${renderRow(before)} and Step ${missingStepNumber + 1} is ${renderRow(after)}. Which arrangement is the missing Step ${missingStepNumber}?`;
    detail = `Applying exactly one machine stage to Step ${missingStepNumber - 1} gives ${answerDisplay}, which then produces the printed next state.`;
  } else {
    const stepNumber = 1 + Math.floor(rng() * (trace.steps.length - 1));
    const remaining = trace.steps.length - stepNumber;
    evidence = { kind, stepNumber };
    answerDisplay = `${remaining} steps`;
    options = boundedNumericOptions(remaining, 0, trace.steps.length - 1, "", " steps", `${seed}|OPTIONS`);
    text = `After Step ${stepNumber}, how many more steps are required to reach the final output?`;
    detail = `The final state is Step ${trace.steps.length}, so ${trace.steps.length} - ${stepNumber} = ${remaining} more steps are required.`;
  }

  const answerIndex = options.findIndex((option) => option.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder,
    kind,
    evidence,
    text,
    options,
    answerIndex,
    answerDisplay,
    explanation: `${ruleExplanation} ${detail}`,
  };
}

function queryKindsFor(
  mode: IopEnglishSourceModeAuthority,
  seed: string,
): readonly [IopPermanentSolveMode, IopPermanentSolveMode, IopPermanentSolveMode, IopPermanentSolveMode] {
  const supported = mode.supportedSolveModes;
  if (supported.length < 4) throw new Error(`${mode.sourceModeId} supports fewer than four query kinds`);
  const start = hashSeed(`${seed}|QUERY-KINDS`) % supported.length;
  const selected: IopPermanentSolveMode[] = [];
  for (let offset = 0; selected.length < 4 && offset < supported.length * 2; offset += 1) {
    const candidate = supported[(start + offset * 2) % supported.length]!;
    if (!selected.includes(candidate)) selected.push(candidate);
  }
  if (selected.length < 4) {
    for (const candidate of supported) if (!selected.includes(candidate) && selected.length < 4) selected.push(candidate);
  }
  return [selected[0]!, selected[1]!, selected[2]!, selected[3]!];
}

function directionsFor(mode: IopEnglishSourceModeAuthority): string {
  if (mode.engineKind === "BOX_SOURCE") {
    return "An input-output machine performs a sequence of operations on six numbered boxes. Study the complete illustration carefully and apply the same stage rules to the new set of boxes.";
  }
  if (mode.engineKind === "TEXT_RBI_SOURCE") {
    return "A word-processing machine changes and rearranges the given words in a fixed sequence of stages. Study the illustration carefully and apply exactly the same stages to the new input.";
  }
  if (mode.engineKind === "NUMERIC_PARITY_SOURCE") {
    return "A number arrangement machine selects and transforms two numbers in each step. Study how odd and even numbers are processed in the illustration and apply the same rule to the new input.";
  }
  if (mode.engineKind === "MIXED_RBI_SOURCE") {
    return "A word and number arrangement machine changes one word and one number in each step. Study the illustration carefully and apply exactly the same rule to the new input.";
  }
  return "A word and number arrangement machine follows a particular rule in each step. Study the illustration carefully and apply the same rule to the new input.";
}

export function generateIopEnglishProductionCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  requestedSourceModeId?: string,
): IopEnglishProductionCaselet {
  const mode = modeFor(qlId, seed, requestedSourceModeId);
  const generated = generatedFor(mode, `${seed}|${mode.sourceModeId}`);
  if (!generated.ruleIdentifiable || !generated.oracleParity) throw new Error(`${mode.sourceModeId} failed its production safety evidence`);
  if (!visibleRowsAreUnique(generated.demonstration) || !visibleRowsAreUnique(generated.target)) throw new Error(`${mode.sourceModeId} produced duplicate visible states`);

  const queryKinds = queryKindsFor(mode, seed);
  const children = queryKinds.map((kind, index) => makeQuestion(
    kind,
    generated.target,
    generated.ruleExplanation,
    `${seed}|Q${index + 1}`,
    (index + 1) as 1 | 2 | 3 | 4,
  )) as unknown as IopEnglishProductionCaselet["children"];

  const caselet: IopEnglishProductionCaselet = {
    caseletId: `IOP-001-EN-${qlId}-${hashSeed(`${seed}|${mode.sourceModeId}`).toString(16).padStart(8, "0")}`,
    packageId: "IOP-001",
    chapterId: "REAS-INP",
    qlId,
    sourceModeId: mode.sourceModeId,
    seed,
    locale: "en-IN",
    examProfile: "BANKING",
    difficulty: difficultyFor(qlId),
    directions: directionsFor(mode),
    demonstration: generated.demonstration,
    target: generated.target,
    ruleExplanation: generated.ruleExplanation,
    sourceEvidenceIds: mode.sourceEvidenceIds,
    safeguards: {
      sourceWhitelisted: true,
      ruleIdentifiable: true,
      oracleParity: true,
      queryOracleParity: true,
    },
    children,
    lifecycle: ENGLISH_LIFECYCLE,
  };
  assertIopEnglishProductionCaseletIntegrity(caselet);
  return caselet;
}

export function assertIopEnglishProductionCaseletIntegrity(caselet: IopEnglishProductionCaselet): void {
  const authority = IOP_ENGLISH_SOURCE_MODES.find((mode) => mode.sourceModeId === caselet.sourceModeId && mode.qlId === caselet.qlId);
  if (!authority) throw new Error("English caselet uses a non-whitelisted source mode");
  if (!caselet.safeguards.sourceWhitelisted || !caselet.safeguards.ruleIdentifiable || !caselet.safeguards.oracleParity || !caselet.safeguards.queryOracleParity) {
    throw new Error("English caselet safety evidence is incomplete");
  }
  if (!visibleRowsAreUnique(caselet.demonstration) || !visibleRowsAreUnique(caselet.target)) throw new Error("English caselet contains duplicate visible machine states");
  if (caselet.children.length !== 4) throw new Error("English caselet must contain four child questions");

  for (const child of caselet.children) {
    if (!authority.supportedSolveModes.includes(child.kind)) throw new Error(`${child.kind} is not supported by ${authority.sourceModeId}`);
    if (child.options.length !== 4 || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4) throw new Error("English child has duplicate semantic options");
    if (child.options.filter((option) => option.isCorrect).length !== 1) throw new Error("English child must have exactly one correct option");
    if (!child.options[child.answerIndex]?.isCorrect || child.options[child.answerIndex]?.display !== child.answerDisplay) throw new Error("English answer index/display mismatch");
    if (recomputeIopEnglishAnswer(caselet.target, child.evidence) !== child.answerDisplay) throw new Error(`English query oracle mismatch for ${child.kind}`);
    if (!child.explanation.includes(child.answerDisplay)) throw new Error(`English explanation is not customized for ${child.kind}`);
  }

  if (
    caselet.lifecycle.permanentQlCount !== 8 ||
    caselet.lifecycle.englishFreeze ||
    caselet.lifecycle.questionStudioDiscoverable ||
    caselet.lifecycle.questionBankWritable ||
    caselet.lifecycle.testEligible ||
    caselet.lifecycle.publiclyPublishable
  ) {
    throw new Error("English review candidate leaked into product delivery lifecycle");
  }
}

export function getIopEnglishSourceModes(qlId: IopPermanentQlId): readonly IopEnglishSourceModeAuthority[] {
  return IOP_ENGLISH_SOURCE_MODES.filter((mode) => mode.qlId === qlId);
}
