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

function local(locale: SerCp009Locale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

/**
 * Constant-ratio series has a legitimately small rule alphabet (×/÷ by 2..5).
 * Expand visible state by a harmless common scale, which preserves every ratio
 * and does not change reasoning depth or difficulty. The scale is deliberately
 * excluded from difficulty scoring.
 */
function diversifyConstantRatio(
  question: GeneratedSerCp009Question,
  requestedSeed: number,
  locale: SerCp009Locale,
): GeneratedSerCp009Question {
  if (question.qlId !== "SER-QL-032") return question;
  const scale = 1 + (Math.floor(requestedSeed / 4) % 7);
  if (scale === 1) return question;

  const stemLines = question.stem.split("\n");
  const sourceTerms = parseSeries(question.stem);
  const scaledTerms = sourceTerms.map((token) => token === "?" ? token : String(Number(token) * scale));
  const scaledCorrect = String(Number(question.correctAnswer) * scale);
  const scaledOptions = question.options.map((option) => ({
    ...option,
    value: String(Number(option.value) * scale),
  }));
  const factor = Number(question.structuralFeatures.factor ?? 0);
  const operation = question.structuralFeatures.operation === "DIVIDE" ? "DIVIDE" : "MULTIPLY";
  const explanation = [
    local(
      locale,
      `The same ratio is used at every step: ${operation === "DIVIDE" ? "divide" : "multiply"} by ${factor}.`,
      `हर चरण में वही अनुपात है: ${factor} से ${operation === "DIVIDE" ? "भाग" : "गुणा"}।`,
      `ਹਰ ਪੜਾਅ 'ਤੇ ਉਹੀ ਅਨੁਪਾਤ ਹੈ: ${factor} ਨਾਲ ${operation === "DIVIDE" ? "ਭਾਗ" : "ਗੁਣਾ"}।`,
    ),
    scaledTerms.join(" → "),
    local(locale, `Therefore the missing number is ${scaledCorrect}.`, `अतः लुप्त संख्या ${scaledCorrect} है।`, `ਇਸ ਲਈ ਲੁਪਤ ਸੰਖਿਆ ${scaledCorrect} ਹੈ।`),
  ];
  return Object.freeze({
    ...question,
    stem: `${stemLines.slice(0, -1).join("\n")}\n${scaledTerms.join(", ")}`,
    correctAnswer: scaledCorrect,
    options: Object.freeze(scaledOptions),
    explanation: Object.freeze(explanation),
    structuralFeatures: Object.freeze({
      ...question.structuralFeatures,
      variationScale: scale,
    }),
  });
}

const PROGRESSIVE_MULTIPLIER_SHELLS: Readonly<Record<SerCp009Locale, readonly string[]>> = Object.freeze({
  "en-IN": Object.freeze([
    "Which number will replace the question mark in the following series?",
    "Find the missing number in the series.",
    "Select the number that should replace the question mark.",
    "Choose the correct number to complete the series.",
    "Which of the following numbers completes the series?",
    "What number should come in place of the question mark?",
  ]),
  "hi-IN": Object.freeze([
    "निम्नलिखित श्रृंखला में प्रश्नवाचक चिन्ह के स्थान पर कौन-सी संख्या आएगी?",
    "श्रृंखला में लुप्त संख्या ज्ञात कीजिए।",
    "प्रश्नवाचक चिन्ह के स्थान पर आने वाली संख्या चुनिए।",
    "श्रृंखला पूरी करने के लिए सही संख्या चुनिए।",
    "निम्नलिखित में से कौन-सी संख्या श्रृंखला को पूरा करेगी?",
    "प्रश्नवाचक चिन्ह के स्थान पर कौन-सी संख्या होनी चाहिए?",
  ]),
  "pa-IN": Object.freeze([
    "ਹੇਠਾਂ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਆਵੇਗੀ?",
    "ਲੜੀ ਵਿੱਚ ਲੁਪਤ ਸੰਖਿਆ ਲੱਭੋ।",
    "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੀ ਸੰਖਿਆ ਚੁਣੋ।",
    "ਲੜੀ ਪੂਰੀ ਕਰਨ ਲਈ ਸਹੀ ਸੰਖਿਆ ਚੁਣੋ।",
    "ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਖਿਆ ਲੜੀ ਨੂੰ ਪੂਰਾ ਕਰੇਗੀ?",
    "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
  ]),
});

function stableIndex(seed: number, salt: number, modulus: number): number {
  let value = (seed ^ Math.imul(salt, 0x9e3779b9)) >>> 0;
  value = (value ^ (value >>> 16)) >>> 0;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value = (value ^ (value >>> 15)) >>> 0;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value = (value ^ (value >>> 16)) >>> 0;
  return value % modulus;
}

/**
 * Expand only the parameters already admitted by the visible QL035 verifier:
 * starting multiplier 2..5 and fixed adjustment ±1..3. A broader starting-term
 * pool supplies source-safe instance variety without inventing new operations.
 * Difficulty stays HARD because the structure remains multiplier progression +
 * fixed adjustment + an internal gap; numeral size is not a scoring feature.
 */
function diversifyProgressiveMultiplierMath(
  question: GeneratedSerCp009Question,
  requestedSeed: number,
  locale: SerCp009Locale,
): GeneratedSerCp009Question {
  if (question.qlId !== "SER-QL-035") return question;

  const adjustments = [-3, -2, -1, 1, 2, 3] as const;
  const firstMultiplier = 2 + stableIndex(requestedSeed, 1, 4);
  const adjustment = adjustments[stableIndex(requestedSeed, 2, adjustments.length)]!;
  const start = 4 + stableIndex(requestedSeed, 3, 24);
  const values = [start];
  for (let i = 1; i < 6; i += 1) {
    values.push(values[i - 1]! * (firstMultiplier + i - 1) + adjustment);
  }

  const correct = values[4]!;
  const previous = values[3]!;
  const repeatedPreviousMultiplier = previous * (firstMultiplier + 2) + adjustment;
  const droppedAdjustment = previous * (firstMultiplier + 3);
  const reversedAdjustment = previous * (firstMultiplier + 3) - adjustment;
  const options: readonly SerCp009Option[] = Object.freeze([
    { value: String(correct), errorLabel: null },
    { value: String(repeatedPreviousMultiplier), errorLabel: "REPEATED_PREVIOUS_MULTIPLIER" },
    { value: String(droppedAdjustment), errorLabel: "DROPPED_FIXED_ADJUSTMENT" },
    { value: String(reversedAdjustment), errorLabel: "REVERSED_ADJUSTMENT" },
  ]);
  const sign = adjustment > 0 ? "+" : "−";
  const visible = [values[0], values[1], values[2], values[3], "?", values[5]];
  const explanation = Object.freeze([
    local(
      locale,
      `The multiplier increases by 1 at each step, while the fixed adjustment remains ${sign}${Math.abs(adjustment)}.`,
      `हर चरण में गुणक 1 बढ़ता है, जबकि स्थिर समायोजन ${sign}${Math.abs(adjustment)} रहता है।`,
      `ਹਰ ਪੜਾਅ 'ਤੇ ਗੁਣਕ 1 ਵੱਧਦਾ ਹੈ, ਜਦਕਿ ਸਥਿਰ ਸੋਧ ${sign}${Math.abs(adjustment)} ਰਹਿੰਦੀ ਹੈ।`,
    ),
    `${values[0]} × ${firstMultiplier} ${sign} ${Math.abs(adjustment)} = ${values[1]}; ${values[1]} × ${firstMultiplier + 1} ${sign} ${Math.abs(adjustment)} = ${values[2]}; ${values[2]} × ${firstMultiplier + 2} ${sign} ${Math.abs(adjustment)} = ${values[3]}; ${values[3]} × ${firstMultiplier + 3} ${sign} ${Math.abs(adjustment)} = ${correct}.`,
    `${correct} × ${firstMultiplier + 4} ${sign} ${Math.abs(adjustment)} = ${values[5]} (${local(locale, "check", "जाँच", "ਜਾਂਚ")}).`,
  ]);

  return Object.freeze({
    ...question,
    taskKind: "MISSING_TERM",
    stem: `${question.stem.split("\n")[0]}\n${visible.join(", ")}`,
    options,
    correctIndex: 0,
    correctAnswer: String(correct),
    explanation,
    difficulty: "HARD",
    structuralFeatures: Object.freeze({
      layers: 3,
      channels: 1,
      internalGap: true,
      firstMultiplier,
      multiplierStep: 1,
      adjustment,
      reasoningLayers: 3,
    }),
  });
}

/**
 * The 2024 SSC progressive-multiplier family is mathematically narrow by
 * design. Improve repeated exposure through normal exam-instruction variation,
 * not by inventing extra operations. The series line, solver state, options,
 * difficulty and misconception model remain unchanged.
 */
function diversifyProgressiveMultiplierShell(
  question: GeneratedSerCp009Question,
  requestedSeed: number,
  locale: SerCp009Locale,
): GeneratedSerCp009Question {
  if (question.qlId !== "SER-QL-035") return question;
  const seriesLine = question.stem.split("\n").at(-1)!;
  const shells = PROGRESSIVE_MULTIPLIER_SHELLS[locale];
  const shellIndex = (Math.floor(requestedSeed / 4) + Math.floor(requestedSeed / 17)) % shells.length;
  return Object.freeze({
    ...question,
    stem: `${shells[shellIndex]}\n${seriesLine}`,
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
      const ratioDiversified = diversifyConstantRatio(generated, seed, locale);
      const mathDiversified = diversifyProgressiveMultiplierMath(ratioDiversified, seed, locale);
      const diversified = diversifyProgressiveMultiplierShell(mathDiversified, seed, locale);
      const normalized = normalizeAnswerPosition(diversified, seed);
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

const _allIds: readonly SerCp009QlId[] = SER_CP009_NUMBER_SERIES_QL_IDS;
void _allIds;
void SER_CP009_QL_AUTHORITIES;
