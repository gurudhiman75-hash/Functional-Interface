import { toCanonicalString, type Rational } from "../foundation/rational";
import { deriveCp004WrongWorkings } from "./distractors";
import { generateCp004State, renderCp004Stem } from "./generator";
import { independentlyVerifyCp004 } from "./independent-verifier";
import { cp004PermanentQlForAuthority } from "./ql-allocation";
import { buildCp004Options, cp004DifficultyForAuthority } from "./options";
import { solveCp004Core } from "./relative-motion-foundation";
import { buildCp004Teaching } from "./teaching";
import type { TsdCp004GeneratedQuestion } from "./runtime-types";

function rationals(value: unknown, output: Rational[] = []): Rational[] {
  if (!value || typeof value !== "object") return output;
  const candidate = value as Partial<Rational>;
  if (typeof candidate.numerator === "bigint" && typeof candidate.denominator === "bigint") {
    output.push(candidate as Rational);
    return output;
  }
  for (const child of Object.values(value as Record<string, unknown>)) rationals(child, output);
  return output;
}

function terminalOrdinal(seed: string): string {
  return seed.match(/(\d+)$/)?.[1] ?? "0";
}

function generateSolvableState(authorityKey: string, seed: string) {
  const ordinal = terminalOrdinal(seed);
  const failures: string[] = [];
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}:valid-${attempt}:${ordinal}`;
    const state = generateCp004State(authorityKey, candidateSeed);
    try {
      const solution = solveCp004Core(state.solveMode, state.input);
      const independent = independentlyVerifyCp004(state.solveMode, state.input, solution);
      if (!independent.valid) {
        failures.push(`${candidateSeed}: ${independent.errors.join("; ")}`);
        continue;
      }
      return Object.freeze({ state, solution });
    } catch (error) {
      failures.push(`${candidateSeed}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(`${authorityKey}: could not construct a valid CP004 state for seed ${seed}; ${failures.slice(-3).join(" | ")}`);
}

function validateQuestion(question: Omit<TsdCp004GeneratedQuestion, "validation">): TsdCp004GeneratedQuestion["validation"] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const independent = independentlyVerifyCp004(question.solveMode, question.input, question.solution);
  if (!independent.valid) errors.push(...independent.errors);
  if (question.options.length !== 4 || new Set(question.options).size !== 4) errors.push("options must contain four unique displayed values");
  if (question.correctIndex < 0 || question.correctIndex > 3) errors.push("correct option index outside 0..3");
  if (question.options[question.correctIndex] !== question.answerText) errors.push("keyed option does not equal answer text");
  if (question.internalOptionAudit.filter((entry) => entry.isCorrect).length !== 1) errors.push("option audit must contain one correct option");
  if (question.internalOptionAudit.filter((entry) => !entry.isCorrect).length !== 3) errors.push("option audit must contain three wrong options");
  if (question.internalOptionAudit.some((entry) => !entry.isCorrect && (entry.wrongWorking === null || entry.applicability !== "EXACT_METHOD"))) errors.push("wrong option missing exact-method provenance");
  if (question.explanation.steps.length < 2) errors.push("learner explanation is too short");
  if ((question.explanation as unknown as Record<string, unknown>).optionAnalysis !== undefined) errors.push("public explanation must not contain option analysis");
  if (cp004PermanentQlForAuthority(question.authorityKey).permanentQlId !== question.permanentQlId) errors.push("permanent QL does not match authority allocation");
  if (question.lifecycle.englishFreezeStatus !== "UNFROZEN") errors.push("English frozen before product-owner approval");
  if (question.lifecycle.questionStudioEnabled || question.lifecycle.questionBankStatus !== "NOT_STORED" || question.lifecycle.testEligibility !== "INELIGIBLE" || question.lifecycle.publiclyPublishable) errors.push("downstream lifecycle unlocked during review");
  if (question.stem.length < 55) warnings.push("stem is unusually concise for CP004 editorial review");
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze(warnings) });
}

export function generateCp004Question(authorityKey: string, seed: string): TsdCp004GeneratedQuestion {
  const { state, solution } = generateSolvableState(authorityKey, seed);
  const wrongWorkings = deriveCp004WrongWorkings(state.solveMode, state.input, solution);
  const built = buildCp004Options(solution, wrongWorkings, state.permanentQlId, seed);
  const answerText = built.options[built.correctIndex];
  const stem = renderCp004Stem(state);
  const fingerprintValues = rationals(state.input).map(toCanonicalString).join("|");
  const draft = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-004" as const,
    authorityKey: state.authorityKey,
    permanentQlId: state.permanentQlId,
    solveMode: state.solveMode,
    representation: state.representation,
    context: state.context,
    language: "en" as const,
    seed,
    difficulty: cp004DifficultyForAuthority(state.authorityKey),
    stem,
    input: state.input,
    solution,
    answerText,
    options: built.options,
    correctIndex: built.correctIndex,
    internalOptionAudit: built.audit,
    explanation: buildCp004Teaching(state.authorityKey, state.input, solution, answerText),
    mathematicalFingerprint: `${state.authorityKey}|${state.solveMode}|${fingerprintValues}`,
    lifecycle: Object.freeze({
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      englishFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  };
  return Object.freeze({ ...draft, validation: validateQuestion(draft) });
}
