import { reopenedEditorialLifecycle } from "../editorial-contract";
import { divide, type Rational } from "../foundation/rational";
import {
  TSD_CP003_LEARNER_AUTHORITIES,
  cp003AuthorityByProvisionalId,
  type TsdCp003DiscoveryAuthority,
} from "./discovery-registry";
import { deriveSaturatedCp003WrongWorkings } from "./distractor-saturation";
import {
  SeededRng,
  fingerprint,
  formatClockMinute,
  formatDurationHours,
  formatSolvedValue,
  hashSeed,
} from "./generation-support";
import { cp003Difficulty, cp003Teaching, renderCp003Stem } from "./render";
import type {
  TsdCp003GeneratedQuestion,
  TsdCp003MisconceptionId,
  TsdCp003OptionAnalysis,
  TsdCp003OptionAudit,
  TsdCp003WrongWorking,
} from "./runtime-types";
import { generateSaturatedCp003State } from "./source-saturation";
import { remediateCp003Stem } from "./stem-remediation";
import { solveCp003 } from "./solver";
import type { TsdCp003SolveInput } from "./types";
import { verifyCp003 } from "./verifier";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

function authorityOrdinal(authority: TsdCp003DiscoveryAuthority): number {
  return Number(authority.provisionalId.slice(-3));
}

function trailingOrdinal(seed: string): number | null {
  const match = seed.match(/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function correctPosition(authority: TsdCp003DiscoveryAuthority, seed: string): number {
  const ordinal = trailingOrdinal(seed);
  if (ordinal !== null) return (ordinal + authorityOrdinal(authority)) % 4;
  return (hashSeed(seed) + authorityOrdinal(authority)) % 4;
}

function stableSerialize(value: unknown): string {
  if (typeof value === "bigint") return `${value}n`;
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${key}:${stableSerialize(entry)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

function rationalValues(value: unknown, output: Rational[] = []): Rational[] {
  if (!value || typeof value !== "object") return output;
  const candidate = value as Partial<Rational>;
  if (typeof candidate.numerator === "bigint" && typeof candidate.denominator === "bigint") {
    output.push(candidate as Rational);
    return output;
  }
  for (const child of Object.values(value as Record<string, unknown>)) rationalValues(child, output);
  return output;
}

interface RuntimeOption {
  readonly text: string;
  readonly misconceptionId: TsdCp003MisconceptionId;
  readonly isCorrect: boolean;
  readonly wrongWorking: TsdCp003WrongWorking | null;
}

function learnerFacingWrongWorkings(
  input: TsdCp003SolveInput,
  wrongWorkings: readonly TsdCp003WrongWorking[],
): readonly TsdCp003WrongWorking[] {
  if (input.solveMode !== "scheduledArrivalTimeFromActualSpeed") return wrongWorkings;

  const departureClock = formatClockMinute(input.departureMinuteFromDayZero);
  const travelDuration = formatDurationHours(divide(input.distance, input.actualSpeed));

  return Object.freeze(wrongWorkings.map((working) => {
    if (working.misconceptionId === "COPY_DEPARTURE_CLOCK") {
      return Object.freeze({
        ...working,
        calculation: `copy ${departureClock}`,
        diagnosis: `This simply copies the departure time. The journey lasts ${travelDuration}, so that duration must be added to the departure clock.`,
      });
    }
    if (working.misconceptionId === "SUBTRACT_TRAVEL_TIME_FROM_CLOCK") {
      return Object.freeze({
        ...working,
        calculation: `${departureClock} − ${travelDuration}`,
        diagnosis: "This moves the clock backward by the journey duration. Arrival time is found by moving forward from departure.",
      });
    }
    if (working.misconceptionId === "DOUBLE_TRAVEL_TIME_ON_CLOCK") {
      return Object.freeze({
        ...working,
        calculation: `${departureClock} + 2 × ${travelDuration}`,
        diagnosis: "This adds the journey duration twice. Add the journey duration only once to the departure time.",
      });
    }
    return working;
  }));
}

function buildOptions(
  authority: TsdCp003DiscoveryAuthority,
  seed: string,
  solution: ReturnType<typeof solveCp003>,
  wrongWorkings: readonly TsdCp003WrongWorking[],
): readonly RuntimeOption[] {
  const correct: RuntimeOption = Object.freeze({
    text: formatSolvedValue(solution.answer, solution.unit),
    misconceptionId: "CORRECT",
    isCorrect: true,
    wrongWorking: null,
  });
  const wrongs = wrongWorkings.map((working): RuntimeOption => Object.freeze({
    text: formatSolvedValue(working.value, solution.unit),
    misconceptionId: working.misconceptionId,
    isCorrect: false,
    wrongWorking: working,
  }));
  const rng = new SeededRng(`${authority.provisionalId}:${seed}:wrong-order`);
  const shuffledWrongs = rng.shuffle(wrongs);
  const position = correctPosition(authority, seed);
  return Object.freeze([
    ...shuffledWrongs.slice(0, position),
    correct,
    ...shuffledWrongs.slice(position),
  ]);
}

function optionAudit(options: readonly RuntimeOption[]): readonly TsdCp003OptionAudit[] {
  return Object.freeze(options.map((option) => Object.freeze({
    text: option.text,
    misconceptionId: option.misconceptionId,
    isCorrect: option.isCorrect,
    wrongWorking: option.wrongWorking,
    applicability: option.isCorrect ? "CORRECT" : "EXACT_METHOD",
  })));
}

function optionAnalysis(
  options: readonly RuntimeOption[],
  solution: ReturnType<typeof solveCp003>,
  correctCheckLine: string,
): readonly TsdCp003OptionAnalysis[] {
  const numericalCheck = correctCheckLine.replace(/^5\.\s*/, "");
  return Object.freeze(options.map((option, index) => {
    const reason = option.isCorrect
      ? `✅ ${option.text}: ${numericalCheck}`
      : `⚠️ ${option.text}: ${option.wrongWorking!.calculation} = ${option.text}. ${option.wrongWorking!.diagnosis}`;
    return Object.freeze({
      option: OPTION_LABELS[index],
      text: option.text,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
      reason,
    });
  }));
}

function validateQuestion(question: Omit<TsdCp003GeneratedQuestion, "validation">): TsdCp003GeneratedQuestion["validation"] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const verification = verifyCp003(question.input, question.solution);
  if (!verification.valid) errors.push(...verification.errors);
  if (question.options.length !== 4 || new Set(question.options).size !== 4) errors.push("options must contain four unique displayed values");
  if (question.correctIndex < 0 || question.correctIndex > 3) errors.push("correct option index is outside 0..3");
  if (question.answerText !== question.options[question.correctIndex]) errors.push("answer text does not match the keyed option");
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) errors.push("option audit must contain exactly one correct option");
  if (question.optionAudit.filter((option) => !option.isCorrect).some((option) => option.wrongWorking === null || option.applicability !== "EXACT_METHOD")) errors.push("every wrong option must carry exact wrong-working provenance");
  if (question.explanation.stepByStepSolution.length !== 6) errors.push("learner explanation must contain exactly six steps during CP-003 discovery");
  if (question.explanation.optionAnalysis.length !== 4) errors.push("option analysis must cover all four options");
  if (question.explanation.optionAnalysis.some((analysis, index) => analysis.text !== question.options[index])) errors.push("option analysis is not position-aligned");
  if (question.explanation.optionAnalysis.some((analysis) => !analysis.reason.includes(analysis.text))) errors.push("an option explanation does not name its displayed value");
  if (question.permanentQlId !== null) errors.push("permanent QL allocated during CP-003 discovery");
  if (question.lifecycle.englishFreezeStatus !== "UNFROZEN") errors.push("CP-003 English frozen during discovery");
  if (question.lifecycle.questionBankStatus !== "NOT_STORED") errors.push("Question Bank storage enabled during CP-003 discovery");
  if (question.lifecycle.testEligibility !== "INELIGIBLE") errors.push("test eligibility enabled during CP-003 discovery");
  if (question.publiclyPublishable !== false) errors.push("public delivery enabled during CP-003 discovery");
  if (question.difficulty.status !== "EDITORIAL_CALIBRATION_REQUIRED") warnings.push("difficulty no longer marked for editorial calibration");
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze(warnings) });
}

export function generateCp003Candidate(provisionalAuthorityId: string, seed: string): TsdCp003GeneratedQuestion {
  const authority = cp003AuthorityByProvisionalId(provisionalAuthorityId);
  if (!authority.learnerFacing) throw new Error(`${provisionalAuthorityId}: internal QA authority cannot generate a learner question`);
  const state = generateSaturatedCp003State(authority, seed);
  const solution = solveCp003(state.input);
  const independent = verifyCp003(state.input, solution);
  if (!independent.valid) throw new Error(`${authority.solveMode}: generated state failed independent verification: ${independent.errors.join("; ")}`);
  const wrongWorkings = learnerFacingWrongWorkings(state.input, deriveSaturatedCp003WrongWorkings(state.input, solution));
  const options = buildOptions(authority, seed, solution, wrongWorkings);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const teaching = cp003Teaching(state.input, solution);
  const lifecycle = reopenedEditorialLifecycle();
  const inputValues = rationalValues(state.input);
  const rawStem = renderCp003Stem(state);
  const draft = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-003" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-003" as const,
    provisionalAuthorityId: authority.provisionalId,
    permanentQlId: null,
    questionLanguageId: `TSD-CP-003:${authority.provisionalId}:${seed}:en`,
    solveMode: authority.solveMode,
    representation: state.representation,
    language: "en" as const,
    seed,
    difficulty: cp003Difficulty(state.input),
    stem: remediateCp003Stem(state, rawStem),
    input: state.input,
    solution,
    answerText: options[correctIndex].text,
    options: Object.freeze(options.map((option) => option.text)),
    optionAudit: optionAudit(options),
    correctIndex,
    explanation: Object.freeze({
      keyRule: teaching.keyRule,
      stepByStepSolution: teaching.steps,
      examSpeedShortcut: teaching.shortcut,
      optionAnalysis: optionAnalysis(options, solution, teaching.steps[4]),
      conclusion: teaching.conclusion,
    }),
    mathematicalFingerprint: `${authority.solveMode}|${state.representation}|${fingerprint(inputValues, [stableSerialize(state.input)])}`,
    lifecycle,
    publiclyPublishable: false as const,
  };
  return Object.freeze({ ...draft, validation: validateQuestion(draft) });
}

export function generateCp003ReviewRows(rowsPerAuthority = 3): readonly TsdCp003GeneratedQuestion[] {
  if (!Number.isInteger(rowsPerAuthority) || rowsPerAuthority < 1) throw new Error("rowsPerAuthority must be a positive integer");
  const rows: TsdCp003GeneratedQuestion[] = [];
  for (const authority of TSD_CP003_LEARNER_AUTHORITIES) {
    const selected: TsdCp003GeneratedQuestion[] = [];
    const stems = new Set<string>();
    const fingerprints = new Set<string>();
    for (let candidateIndex = 0; candidateIndex < 120 && selected.length < rowsPerAuthority; candidateIndex += 1) {
      const candidate = generateCp003Candidate(authority.provisionalId, `review-pool:${authority.provisionalId}:${candidateIndex}`);
      if (stems.has(candidate.stem) || fingerprints.has(candidate.mathematicalFingerprint)) continue;
      selected.push(candidate);
      stems.add(candidate.stem);
      fingerprints.add(candidate.mathematicalFingerprint);
    }
    if (selected.length !== rowsPerAuthority) {
      throw new Error(`${authority.solveMode}: could not select ${rowsPerAuthority} distinct editorial rows from the deterministic review pool`);
    }
    rows.push(...selected);
  }
  return Object.freeze(rows);
}

export function stableCp003Stringify(value: unknown): string {
  return stableSerialize(value);
}
