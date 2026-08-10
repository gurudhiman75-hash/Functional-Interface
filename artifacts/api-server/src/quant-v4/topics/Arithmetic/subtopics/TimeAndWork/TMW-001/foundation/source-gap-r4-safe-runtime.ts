import {
  add,
  compare,
  divide,
  rational,
  reciprocal,
  subtract,
} from "./rational";
import type { Rational } from "./types";
import type { Tmw001ChapterLanguage } from "./chapter-localized-runtime";
import {
  runTmwR4SourceGapPipeline as runCandidate,
  type TmwR4GeneratedQuestion,
} from "./source-gap-r4-runtime";
import { polishTmwR4StudentPackage } from "./source-gap-r4-student-polish";

const ZERO = rational(0);
const TWO = rational(2);

function isPositive(value: Rational): boolean {
  return compare(value, ZERO) > 0;
}

function rationalParameter(question: TmwR4GeneratedQuestion, key: string): Rational {
  const value = question.parameters[key];
  if (!value || typeof value === "number" || typeof value === "string") {
    throw new Error(`${question.questionLanguageId}: missing rational parameter ${key}`);
  }
  return value;
}

/**
 * For the overlapping-subset pipe contract:
 *   S_ABC = a+b+c
 *   S_BCD = b+c+d
 *   S_AD  = a+d
 * Hence a-d = S_ABC-S_BCD and a+d=S_AD.
 * The state is physically admissible for four inlet pipes only when a,d and
 * the residual b+c are all strictly positive. Individual b/c need not be
 * identified because the target is the all-pipe rate.
 */
function physicalOverlappingPipeState(question: TmwR4GeneratedQuestion): boolean {
  if (question.questionLanguageId !== "TMW-QL-221") return true;
  const sAbc = reciprocal(rationalParameter(question, "timeABC"));
  const sBcd = reciprocal(rationalParameter(question, "timeBCD"));
  const sAd = reciprocal(rationalParameter(question, "timeAD"));
  const aMinusD = subtract(sAbc, sBcd);
  const a = divide(add(sAd, aMinusD), TWO);
  const d = divide(subtract(sAd, aMinusD), TWO);
  const bc = subtract(sAbc, a);
  return isPositive(a) && isPositive(d) && isPositive(bc);
}

function candidateSeed(seed: string, attempt: number): string {
  return attempt === 0 ? seed : `${seed}|r4-valid-state:${attempt}`;
}

/**
 * R4 source-gap parameter pools intentionally use rejection sampling at the
 * final extension boundary. This prevents a mathematically convenient seed
 * from leaking a singular heterogeneous system or a nonphysical inlet state.
 * The requested external seed is retained on the returned package; the
 * accepted mathematical fingerprint records the actual valid generated state.
 */
export function runTmwR4SafeSourceGapPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Tmw001ChapterLanguage;
}): TmwR4GeneratedQuestion {
  const MAX_ATTEMPTS = 16;
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const question = runCandidate({
        ...input,
        seed: candidateSeed(input.seed, attempt),
      });
      if (!question.validation.valid) {
        lastError = new Error(question.validation.errors.join(" | "));
        continue;
      }
      if (!physicalOverlappingPipeState(question)) {
        lastError = new Error("Overlapping pipe state is not physically admissible for four positive inlets");
        continue;
      }
      const polished = polishTmwR4StudentPackage({
        ...question,
        seed: input.seed,
      });
      if (!polished.validation.valid) {
        throw new Error(`${input.questionLanguageId}: polished learner package is invalid: ${polished.validation.errors.join(" | ")}`);
      }
      return polished;
    } catch (error) {
      lastError = error;
      if (input.questionLanguageId !== "TMW-QL-225" && input.questionLanguageId !== "TMW-QL-221") {
        throw error;
      }
    }
  }

  throw new Error(
    `${input.questionLanguageId}: failed to obtain a valid R4 source-gap state after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}
