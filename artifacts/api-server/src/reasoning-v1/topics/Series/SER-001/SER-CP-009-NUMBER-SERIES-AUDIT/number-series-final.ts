import {
  generateSerCp009NumberSeries as generateBase,
  SER_CP009_NUMBER_SERIES_QL_IDS,
  SER_CP009_QL_AUTHORITIES,
  solveVisibleNumberSeries as solveBase,
  type GeneratedSerCp009Question,
  type SerCp009Locale,
  type SerCp009Option,
  type SerCp009QlId,
} from "./number-series";

export {
  SER_CP009_NUMBER_SERIES_QL_IDS,
  SER_CP009_QL_AUTHORITIES,
};
export type {
  GeneratedSerCp009Question,
  SerCp009Locale,
  SerCp009Option,
  SerCp009QlId,
} from "./number-series";

function parseSeries(stem: string): string[] {
  const line = stem.split("\n").at(-1)?.trim() ?? stem.trim();
  return line.split(",").map((token) => token.trim()).filter(Boolean);
}

function solveGroupedMultiMissing(stem: string): string {
  const tokens = parseSeries(stem);
  if (tokens.length !== 8 || tokens[6] !== "?" || tokens[7] !== "?") {
    throw new Error("QL041 malformed.");
  }
  const numbers = tokens.slice(0, 6).map(Number);
  if (numbers.some((value) => !Number.isFinite(value))) throw new Error("QL041 needs numeric anchors.");
  const [a0, b0, marker0, a1, b1, marker1] = numbers as [number, number, number, number, number, number];
  if (marker0 !== marker1) throw new Error("QL041 fixed marker does not repeat.");
  const da = a1 - a0;
  const db = b1 - b0;
  if (da === 0 || db === 0) throw new Error("QL041 progressing rows cannot be stationary.");
  return `${a1 + da}, ${b1 + db}`;
}

/**
 * Final visible-state verifier for CP009.
 *
 * QL041 deliberately permits equal progressions in its first two rows because
 * the exact SSC source fixture `3, 5, 35, 10, 12, 35, ?, ?` uses +7 in both
 * rows. The repeated third-position marker is sufficient to establish the
 * grouped three-term topology; requiring unequal row steps would reject a real
 * source pattern for an artificial anti-degeneracy rule.
 */
export function solveVisibleNumberSeries(
  qlId: SerCp009QlId,
  stem: string,
  options: readonly string[] = [],
): string {
  if (qlId === "SER-QL-041") return solveGroupedMultiMissing(stem);
  return solveBase(qlId, stem, options);
}

function normalizeAnswerPosition(
  question: GeneratedSerCp009Question,
  requestedSeed: number,
): GeneratedSerCp009Question {
  const desired = (requestedSeed + Number(question.qlId.slice(-3))) % 4;
  const correct = question.options.find((option) => option.errorLabel === null);
  if (!correct) throw new Error(`${question.qlId}: correct semantic option missing.`);
  const distractors = question.options.filter((option) => option.errorLabel !== null);
  if (distractors.length !== 3) throw new Error(`${question.qlId}: expected exactly three distractors.`);
  const options = [...distractors];
  options.splice(desired, 0, correct);
  return Object.freeze({
    ...question,
    seed: requestedSeed,
    options: Object.freeze(options),
    correctIndex: desired,
  });
}

/**
 * Review-only hardened generator facade.
 *
 * Some prototype builders use deterministic internal retries to avoid invalid
 * mathematical states. This facade preserves the caller's external seed and
 * requested answer position regardless of the internal retry seed. If a narrow
 * prototype combination cannot build three unique distractors, the facade
 * advances through a deterministic retry sequence and still exposes the
 * original seed to Question Studio/review tooling.
 */
export function generateSerCp009NumberSeries(
  qlId: SerCp009QlId,
  seed = 1,
  locale: SerCp009Locale = "en-IN",
): GeneratedSerCp009Question {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const internalSeed = seed + attempt * 997;
    try {
      const generated = generateBase(qlId, internalSeed, locale);
      const normalized = normalizeAnswerPosition(generated, seed);
      const solved = solveVisibleNumberSeries(
        qlId,
        normalized.stem,
        normalized.options.map((option) => option.value),
      );
      if (solved !== normalized.correctAnswer) {
        lastError = new Error(`${qlId}:${seed}: visible solver disagrees after normalization.`);
        continue;
      }
      return normalized;
    } catch (error) {
      lastError = error;
    }
  }
  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${qlId}:${seed}: exhausted deterministic prototype retries: ${message}`);
}

// Compile-time ownership proof: the facade covers exactly the provisional IDs.
const _allIds: readonly SerCp009QlId[] = SER_CP009_NUMBER_SERIES_QL_IDS;
void _allIds;
void SER_CP009_QL_AUTHORITIES;
