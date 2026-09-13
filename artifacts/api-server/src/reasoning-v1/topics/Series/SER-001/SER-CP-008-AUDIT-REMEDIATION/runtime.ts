import {
  independentlyContinueAlphanumericInterleaved,
  independentlyContinueAlphanumericParallel,
  independentlyContinueClusterNumber,
  independentlyContinueInterleavedLetterRows,
  independentlyContinueSingleLetterProgression,
  letterAtOneBased,
  oneBasedPosition,
} from "./independent-solver";
import {
  serCp008AuthorityByQlId,
  type SerCp008AuthorityId,
  type SerCp008ProvisionalQlId,
} from "./question-language";

export type SerCp008Locale = "en-IN" | "hi-IN" | "pa-IN";
export type SerCp008Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp008Option {
  readonly value: string;
  readonly errorLabel: string | null;
}

export interface GeneratedSerCp008Question {
  readonly qlId: SerCp008ProvisionalQlId;
  readonly authorityId: SerCp008AuthorityId;
  readonly seed: number;
  readonly locale: SerCp008Locale;
  readonly difficulty: SerCp008Difficulty;
  readonly stem: string;
  readonly options: readonly SerCp008Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly explanation: readonly string[];
  readonly structuralFeatures: Readonly<Record<string, number | boolean | string>>;
}

const MAX_ATTEMPTS = 64;

function randomSource(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function integer(next: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function pick<T>(next: () => number, values: readonly T[]): T {
  return values[Math.floor(next() * values.length)]!;
}

function shuffle<T>(values: readonly T[], seed: number): T[] {
  const output = [...values];
  const next = randomSource(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}

function text(locale: SerCp008Locale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function crossesAlphabet(start: string, jump: number, transitions: number): boolean {
  let position = oneBasedPosition(start);
  for (let step = 0; step < transitions; step += 1) {
    const raw = position + jump;
    if (raw < 1 || raw > 26) return true;
    position = oneBasedPosition(letterAtOneBased(raw));
  }
  return false;
}

function deriveDifficulty(features: Readonly<Record<string, number | boolean | string>>): SerCp008Difficulty {
  const wrap = features.alphabetWrap === true;
  const activeChannels = Number(features.activeChannels ?? 1);
  const interleavedRows = Number(features.interleavedRows ?? 1);
  let burden = 0;
  if (features.progressiveJump === true) burden += 2;
  if (features.independentChannelSteps === true && activeChannels >= 2) burden += 2;
  if (activeChannels >= 3) burden += 1;
  if (interleavedRows >= 2) burden += 2;
  if (features.orderedMultiAnswer === true) burden += 1;
  if (features.heterogeneousChannels === true) burden += 1;
  if (wrap) burden += 2;
  if (burden <= 1) return "EASY";
  if (burden <= 3) return "MEDIUM";
  return "HARD";
}

function validValueForQl(qlId: SerCp008ProvisionalQlId, value: string): boolean {
  if (qlId === "SER-QL-014") return /^[A-Z]$/.test(value);
  if (qlId === "SER-QL-015") return /^[A-Z](, [A-Z]){2}$/.test(value);
  if (qlId === "SER-QL-016") {
    const letterFirst = value.match(/^[A-Z]-(\d+)$/);
    const numberFirst = value.match(/^(\d+)[A-Z]$/);
    const number = letterFirst?.[1] ?? numberFirst?.[1];
    return number !== undefined && Number(number) > 0;
  }
  if (qlId === "SER-QL-017") {
    const match = value.match(/^(\d+)[A-Z]$/);
    return Boolean(match && Number(match[1]) > 0);
  }
  const match = value.match(/^[A-Z]{2}(\d+)$/);
  return Boolean(match && Number(match[1]) > 0);
}

function buildOptions(
  qlId: SerCp008ProvisionalQlId,
  correct: string,
  candidates: readonly SerCp008Option[],
  requestedSeed: number,
): { readonly options: readonly SerCp008Option[]; readonly correctIndex: number } | null {
  if (!validValueForQl(qlId, correct)) return null;
  const seen = new Set<string>([correct]);
  const wrong: SerCp008Option[] = [];
  for (const candidate of candidates) {
    if (!candidate.errorLabel || !validValueForQl(qlId, candidate.value) || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) return null;

  const raw: SerCp008Option[] = [{ value: correct, errorLabel: null }, ...wrong];
  const shuffled = shuffle(raw, requestedSeed * 31 + Number(qlId.slice(-3)));
  const requestedIndex = ((requestedSeed + Number(qlId.slice(-3))) % 4 + 4) % 4;
  const currentIndex = shuffled.findIndex((option) => option.errorLabel === null);
  const [answer] = shuffled.splice(currentIndex, 1);
  shuffled.splice(requestedIndex, 0, answer!);
  return { options: shuffled, correctIndex: requestedIndex };
}

function generated(
  qlId: SerCp008ProvisionalQlId,
  authorityId: SerCp008AuthorityId,
  seed: number,
  locale: SerCp008Locale,
  stem: string,
  correctAnswer: string,
  optionResult: { readonly options: readonly SerCp008Option[]; readonly correctIndex: number },
  explanation: readonly string[],
  structuralFeatures: Readonly<Record<string, number | boolean | string>>,
): GeneratedSerCp008Question {
  return {
    qlId,
    authorityId,
    seed,
    locale,
    difficulty: deriveDifficulty(structuralFeatures),
    stem,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    correctAnswer,
    explanation,
    structuralFeatures,
  };
}

function generateSingleProgressive(
  qlId: "SER-QL-014",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 101 + 14 + attempt * 1009);
    const start = letterAtOneBased(integer(next, 1, 26));
    const firstJump = pick(next, [-4, -3, -2, 2, 3, 4] as const);
    const jumpIncrement = pick(next, [-2, -1, 1, 2] as const);
    const terms = Array.from({ length: 5 }, (_, index) =>
      independentlyContinueSingleLetterProgression({ start, firstJump, jumpIncrement, transitionCount: index }),
    );
    if (new Set(terms).size < 5) continue;

    const lastShown = terms[3]!;
    const correct = terms[4]!;
    const lastPosition = oneBasedPosition(lastShown);
    const nextJump = firstJump + 3 * jumpIncrement;
    const optionResult = buildOptions(qlId, correct, [
      { value: letterAtOneBased(lastPosition + firstJump), errorLabel: "REPEATED_FIRST_JUMP" },
      { value: letterAtOneBased(lastPosition + firstJump + 2 * jumpIncrement), errorLabel: "REPEATED_PREVIOUS_JUMP" },
      { value: letterAtOneBased(lastPosition - nextJump), errorLabel: "REVERSED_NEXT_JUMP" },
      { value: letterAtOneBased(lastPosition + firstJump + 4 * jumpIncrement), errorLabel: "ADVANCED_JUMP_TOO_EARLY" },
      { value: letterAtOneBased(lastPosition + jumpIncrement), errorLabel: "USED_INCREMENT_AS_JUMP" },
    ], seed);
    if (!optionResult) continue;

    const wrapped = terms.slice(0, 4).some((term, index) =>
      crossesAlphabet(term, firstJump + index * jumpIncrement, 1),
    );
    const structuralFeatures = { activeChannels: 1, progressiveJump: true, alphabetWrap: wrapped } as const;
    return generated(
      qlId,
      "SINGLE_LETTER_PROGRESSIVE_JUMP",
      seed,
      locale,
      `${text(locale, "Find the next letter in the series.", "श्रृंखला में अगला अक्षर चुनिए।", "ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਅੱਖਰ ਚੁਣੋ।")}\n${terms.slice(0, 4).join(", ")}, ?`,
      correct,
      optionResult,
      [
        text(locale, "The jump changes by the same amount at every step.", "हर चरण में छलांग समान मात्रा से बदलती है।", "ਹਰ ਕਦਮ ਤੇ ਛਾਲ ਇੱਕੋ ਮਾਤਰਾ ਨਾਲ ਬਦਲਦੀ ਹੈ।"),
        `${terms[0]} → ${terms[1]} (${firstJump >= 0 ? "+" : ""}${firstJump}), ${terms[1]} → ${terms[2]} (${firstJump + jumpIncrement >= 0 ? "+" : ""}${firstJump + jumpIncrement}), ${terms[2]} → ${terms[3]} (${firstJump + 2 * jumpIncrement >= 0 ? "+" : ""}${firstJump + 2 * jumpIncrement}).`,
        `${text(locale, "Next jump", "अगली छलांग", "ਅਗਲੀ ਛਾਲ")}: ${nextJump >= 0 ? "+" : ""}${nextJump}; ${lastShown} → ${correct}.`,
      ],
      structuralFeatures,
    );
  }
  throw new Error(`${qlId} could not produce a valid bounded instance for seed ${seed}.`);
}

function generateSingleInterleaved(
  qlId: "SER-QL-015",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 103 + 15 + attempt * 1009);
    const rowStarts = Array.from({ length: 3 }, () => letterAtOneBased(integer(next, 1, 26)));
    const rowJumps: number[] = [
      pick(next, [-3, -2, 2, 3] as const),
      pick(next, [-3, -2, 2, 3] as const),
      pick(next, [-2, -1, 1, 2] as const),
    ];
    if (new Set(rowJumps).size === 1) rowJumps[2] = rowJumps[2]! > 0 ? -1 : 1;

    const shown = Array.from({ length: 9 }, (_, index) => {
      const row = index % 3;
      const cycle = Math.floor(index / 3);
      return independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: cycle })[row]!;
    });
    const answerLetters = independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: 3 });
    const correct = answerLetters.join(", ");
    const previousCycle = independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: 2 }).join(", ");
    const overAdvanced = independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: 4 }).join(", ");
    const crossWired = rowStarts.map((start, row) =>
      letterAtOneBased(oneBasedPosition(start) + rowJumps[(row + 1) % 3]! * 3),
    ).join(", ");
    const uniformWrong = rowStarts.map((start) =>
      letterAtOneBased(oneBasedPosition(start) + rowJumps[0]! * 3),
    ).join(", ");
    const optionResult = buildOptions(qlId, correct, [
      { value: previousCycle, errorLabel: "REPEATED_PREVIOUS_CYCLE" },
      { value: overAdvanced, errorLabel: "ADVANCED_ONE_CYCLE_TOO_FAR" },
      { value: crossWired, errorLabel: "MIXED_ROW_RULES" },
      { value: uniformWrong, errorLabel: "FORCED_ONE_JUMP_ON_ALL_ROWS" },
      { value: [...answerLetters].reverse().join(", "), errorLabel: "REVERSED_ROW_ORDER" },
    ], seed);
    if (!optionResult) continue;

    const structuralFeatures = { interleavedRows: 3, activeChannels: 3, orderedMultiAnswer: true } as const;
    return generated(
      qlId,
      "SINGLE_LETTER_INTERLEAVED_ROWS",
      seed,
      locale,
      `${text(locale, "Choose the next three letters in the correct order.", "अगले तीन अक्षर सही क्रम में चुनिए।", "ਅਗਲੇ ਤਿੰਨ ਅੱਖਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਚੁਣੋ।")}\n${shown.join(", ")}, ?, ?, ?`,
      correct,
      optionResult,
      [
        text(locale, "Separate positions 1,4,7...; 2,5,8...; and 3,6,9... into three rows.", "स्थान 1,4,7...; 2,5,8...; और 3,6,9... को तीन अलग पंक्तियों में रखें।", "ਥਾਂ 1,4,7...; 2,5,8...; ਅਤੇ 3,6,9... ਨੂੰ ਤਿੰਨ ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਰੱਖੋ।"),
        ...rowStarts.map((_, row) => `${text(locale, "Row", "पंक्ति", "ਕਤਾਰ")} ${row + 1}: ${shown.filter((__, index) => index % 3 === row).join(" → ")} → ${answerLetters[row]}.`),
        `${text(locale, "Therefore", "अतः", "ਇਸ ਲਈ")}: ${correct}.`,
      ],
      structuralFeatures,
    );
  }
  throw new Error(`${qlId} could not produce a valid bounded instance for seed ${seed}.`);
}

function formatParallel(order: "LETTER_NUMBER" | "NUMBER_LETTER", letter: string, number: number): string {
  return order === "LETTER_NUMBER" ? `${letter}-${number}` : `${number}${letter}`;
}

function generateParallelAlphaNumeric(
  qlId: "SER-QL-016",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 107 + 16 + attempt * 1009);
    const startLetter = letterAtOneBased(integer(next, 1, 26));
    const letterJump = pick(next, [-4, -3, -2, 2, 3, 4] as const);
    const numberJump = pick(next, [-9, -7, -5, 5, 7, 9] as const);
    const startNumber = numberJump < 0
      ? integer(next, Math.abs(numberJump) * 4 + 2, Math.abs(numberJump) * 4 + 40)
      : integer(next, 2, 40);
    const order = pick(next, ["LETTER_NUMBER", "NUMBER_LETTER"] as const);
    const states = Array.from({ length: 5 }, (_, transitions) =>
      independentlyContinueAlphanumericParallel({ letter: startLetter, number: startNumber, letterJump, numberJump, transitions }),
    );
    const target = states[4]!;
    const previous = states[3]!;
    const correct = formatParallel(order, target.letter, target.number);
    const optionResult = buildOptions(qlId, correct, [
      { value: formatParallel(order, previous.letter, target.number), errorLabel: "NUMBER_CHANNEL_ONLY" },
      { value: formatParallel(order, target.letter, previous.number), errorLabel: "LETTER_CHANNEL_ONLY" },
      { value: formatParallel(order, target.letter, previous.number - numberJump), errorLabel: "REVERSED_NUMBER_JUMP" },
      { value: formatParallel(order, letterAtOneBased(oneBasedPosition(previous.letter) - letterJump), target.number), errorLabel: "REVERSED_LETTER_JUMP" },
      { value: formatParallel(order, letterAtOneBased(oneBasedPosition(previous.letter) + numberJump), target.number), errorLabel: "USED_NUMBER_JUMP_ON_LETTER" },
    ], seed);
    if (!optionResult) continue;

    const wrapped = crossesAlphabet(startLetter, letterJump, 4);
    const structuralFeatures = { activeChannels: 2, interleavedRows: 1, independentChannelSteps: true, alphabetWrap: wrapped } as const;
    return generated(
      qlId,
      "ALPHANUMERIC_PARALLEL_CHANNELS",
      seed,
      locale,
      `${text(locale, "Find the next term in the letter-number series.", "अक्षर-संख्या श्रृंखला का अगला पद चुनिए।", "ਅੱਖਰ-ਅੰਕ ਲੜੀ ਦਾ ਅਗਲਾ ਪਦ ਚੁਣੋ।")}\n${states.slice(0, 4).map((state) => formatParallel(order, state.letter, state.number)).join(", ")}, ?`,
      correct,
      optionResult,
      [
        text(locale, "Track the letter and number separately.", "अक्षर और संख्या को अलग-अलग देखें।", "ਅੱਖਰ ਅਤੇ ਅੰਕ ਨੂੰ ਵੱਖ-ਵੱਖ ਦੇਖੋ।"),
        `${text(locale, "Letters", "अक्षर", "ਅੱਖਰ")}: ${states.slice(0, 4).map((state) => state.letter).join(" → ")} → ${target.letter} (${letterJump >= 0 ? "+" : ""}${letterJump}).`,
        `${text(locale, "Numbers", "संख्याएँ", "ਅੰਕ")}: ${states.slice(0, 4).map((state) => state.number).join(" → ")} → ${target.number} (${numberJump >= 0 ? "+" : ""}${numberJump}).`,
        `${text(locale, "Combine both results", "दोनों परिणाम मिलाएँ", "ਦੋਵੇਂ ਨਤੀਜੇ ਜੋੜੋ")}: ${correct}.`,
      ],
      structuralFeatures,
    );
  }
  throw new Error(`${qlId} could not produce a valid bounded instance for seed ${seed}.`);
}

function generateInterleavedAlphaNumeric(
  qlId: "SER-QL-017",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 109 + 17 + attempt * 1009);
    const letterJumps = [pick(next, [-2, -1, 1, 2] as const), pick(next, [-2, -1, 1, 2] as const)] as const;
    const numberJumps = [pick(next, [-4, -2, 2, 4] as const), pick(next, [-4, -2, 2, 4] as const)] as const;
    const starts = [0, 1].map((row) => ({
      letter: letterAtOneBased(integer(next, 1, 26)),
      number: numberJumps[row]! < 0
        ? integer(next, Math.abs(numberJumps[row]!) * 2 + 2, Math.abs(numberJumps[row]!) * 2 + 30)
        : integer(next, 2, 30),
    }));
    const state = (row: number, cycle: number) => independentlyContinueAlphanumericInterleaved({
      targetRowStartLetter: starts[row]!.letter,
      targetRowStartNumber: starts[row]!.number,
      targetRowLetterJump: letterJumps[row]!,
      targetRowNumberJump: numberJumps[row]!,
      completedTargetRowTransitions: cycle,
    });
    const shownStates = [state(0, 0), state(1, 0), state(0, 1), state(1, 1), state(0, 2)];
    const target = state(1, 2);
    const wrongRow = state(0, 3);
    const evenPrevious = state(1, 1);
    const token = (value: { readonly letter: string; readonly number: number }) => `${value.number}${value.letter}`;
    const correct = token(target);
    const optionResult = buildOptions(qlId, correct, [
      { value: token(wrongRow), errorLabel: "CONTINUED_WRONG_INTERLEAVED_ROW" },
      { value: `${target.number}${evenPrevious.letter}`, errorLabel: "NUMBER_ADVANCED_LETTER_NOT_ADVANCED" },
      { value: `${evenPrevious.number}${target.letter}`, errorLabel: "LETTER_ADVANCED_NUMBER_NOT_ADVANCED" },
      { value: `${evenPrevious.number - numberJumps[1]!}${target.letter}`, errorLabel: "REVERSED_TARGET_NUMBER_STEP" },
      { value: `${target.number}${letterAtOneBased(oneBasedPosition(evenPrevious.letter) - letterJumps[1]!)}`, errorLabel: "REVERSED_TARGET_LETTER_STEP" },
    ], seed);
    if (!optionResult) continue;

    const wrapped = crossesAlphabet(starts[0]!.letter, letterJumps[0], 2) || crossesAlphabet(starts[1]!.letter, letterJumps[1], 2);
    const structuralFeatures = { interleavedRows: 2, activeChannels: 2, independentChannelSteps: true, limitedTargetEvidence: true, alphabetWrap: wrapped } as const;
    return generated(
      qlId,
      "ALPHANUMERIC_INTERLEAVED_CHANNELS",
      seed,
      locale,
      `${text(locale, "Find the next term in the interleaved letter-number series.", "अंतर्विन्यस्त अक्षर-संख्या श्रृंखला का अगला पद चुनिए।", "ਆਪਸੀ ਗੁੰਥੀ ਅੱਖਰ-ਅੰਕ ਲੜੀ ਦਾ ਅਗਲਾ ਪਦ ਚੁਣੋ।")}\n${shownStates.map(token).join(", ")}, ?`,
      correct,
      optionResult,
      [
        text(locale, "Separate the odd-position and even-position terms.", "विषम और सम स्थान वाले पद अलग करें।", "ਵਿਸ਼ਮ ਅਤੇ ਸਮ ਸਥਾਨਾਂ ਵਾਲੇ ਪਦ ਵੱਖ ਕਰੋ।"),
        `${text(locale, "Odd-position row", "विषम-स्थान पंक्ति", "ਵਿਸ਼ਮ-ਸਥਾਨ ਕਤਾਰ")}: ${shownStates.filter((_, index) => index % 2 === 0).map(token).join(" → ")}.`,
        `${text(locale, "Even-position row", "सम-स्थान पंक्ति", "ਸਮ-ਸਥਾਨ ਕਤਾਰ")}: ${shownStates.filter((_, index) => index % 2 === 1).map(token).join(" → ")} → ${correct}.`,
        text(locale, "Both the number and the letter keep their own fixed step inside the target row.", "लक्ष्य पंक्ति में संख्या और अक्षर दोनों अपनी-अपनी निश्चित चाल रखते हैं।", "ਲਕਸ਼ ਕਤਾਰ ਵਿੱਚ ਅੰਕ ਅਤੇ ਅੱਖਰ ਦੋਵੇਂ ਆਪਣੀ-ਆਪਣੀ ਨਿਸ਼ਚਿਤ ਚਾਲ ਰੱਖਦੇ ਹਨ।"),
      ],
      structuralFeatures,
    );
  }
  throw new Error(`${qlId} could not produce a valid bounded instance for seed ${seed}.`);
}

function generateClusterNumber(
  qlId: "SER-QL-018",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 113 + 18 + attempt * 1009);
    const startLetters = [letterAtOneBased(integer(next, 1, 26)), letterAtOneBased(integer(next, 1, 26))] as const;
    const jumpA = pick(next, [-2, -1, 1, 2] as const);
    let jumpB: number = pick(next, [-3, -2, 2, 3] as const);
    if (jumpA === jumpB) jumpB = jumpB > 0 ? jumpB + 1 : jumpB - 1;
    const numberJump = pick(next, [-6, -4, 4, 6] as const);
    const startNumber = numberJump < 0
      ? integer(next, Math.abs(numberJump) * 4 + 10, Math.abs(numberJump) * 4 + 70)
      : integer(next, 10, 55);
    const states = Array.from({ length: 5 }, (_, transitions) =>
      independentlyContinueClusterNumber({ letters: startLetters, number: startNumber, letterJumps: [jumpA, jumpB], numberJump, transitions }),
    );
    const target = states[4]!;
    const previous = states[3]!;
    const token = (state: (typeof states)[number]) => `${state.letters.join("")}${state.number}`;
    const correct = token(target);
    const optionResult = buildOptions(qlId, correct, [
      { value: `${previous.letters[0]}${target.letters[1]}${target.number}`, errorLabel: "FIRST_LETTER_NOT_ADVANCED" },
      { value: `${target.letters[0]}${previous.letters[1]}${target.number}`, errorLabel: "SECOND_LETTER_NOT_ADVANCED" },
      { value: `${target.letters.join("")}${previous.number}`, errorLabel: "NUMBER_NOT_ADVANCED" },
      { value: `${letterAtOneBased(oneBasedPosition(previous.letters[0]) + jumpB)}${letterAtOneBased(oneBasedPosition(previous.letters[1]) + jumpA)}${target.number}`, errorLabel: "SWAPPED_LETTER_CHANNEL_STEPS" },
      { value: `${target.letters.join("")}${previous.number - numberJump}`, errorLabel: "REVERSED_NUMBER_STEP" },
    ], seed);
    if (!optionResult) continue;

    const wrapped = crossesAlphabet(startLetters[0], jumpA, 4) || crossesAlphabet(startLetters[1], jumpB, 4);
    const structuralFeatures = { activeChannels: 3, interleavedRows: 1, independentChannelSteps: true, heterogeneousChannels: true, alphabetWrap: wrapped } as const;
    return generated(
      qlId,
      "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS",
      seed,
      locale,
      `${text(locale, "Find the next term in the series.", "श्रृंखला का अगला पद चुनिए।", "ਲੜੀ ਦਾ ਅਗਲਾ ਪਦ ਚੁਣੋ।")}\n${states.slice(0, 4).map(token).join(", ")}, ?`,
      correct,
      optionResult,
      [
        text(locale, "Track the first letter, second letter and number as three separate channels.", "पहले अक्षर, दूसरे अक्षर और संख्या को तीन अलग क्रमों में देखें।", "ਪਹਿਲੇ ਅੱਖਰ, ਦੂਜੇ ਅੱਖਰ ਅਤੇ ਅੰਕ ਨੂੰ ਤਿੰਨ ਵੱਖ ਲੜੀਆਂ ਵਾਂਗ ਦੇਖੋ।"),
        `${text(locale, "First letters", "पहले अक्षर", "ਪਹਿਲੇ ਅੱਖਰ")}: ${states.slice(0, 4).map((state) => state.letters[0]).join(" → ")} → ${target.letters[0]} (${jumpA >= 0 ? "+" : ""}${jumpA}).`,
        `${text(locale, "Second letters", "दूसरे अक्षर", "ਦੂਜੇ ਅੱਖਰ")}: ${states.slice(0, 4).map((state) => state.letters[1]).join(" → ")} → ${target.letters[1]} (${jumpB >= 0 ? "+" : ""}${jumpB}).`,
        `${text(locale, "Numbers", "संख्याएँ", "ਅੰਕ")}: ${states.slice(0, 4).map((state) => state.number).join(" → ")} → ${target.number} (${numberJump >= 0 ? "+" : ""}${numberJump}).`,
      ],
      structuralFeatures,
    );
  }
  throw new Error(`${qlId} could not produce a valid bounded instance for seed ${seed}.`);
}

export function generateSerCp008(
  qlId: SerCp008ProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008Question {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("SER-CP-008 seed must be a non-negative integer.");
  serCp008AuthorityByQlId(qlId);
  switch (qlId) {
    case "SER-QL-014": return generateSingleProgressive(qlId, seed, locale);
    case "SER-QL-015": return generateSingleInterleaved(qlId, seed, locale);
    case "SER-QL-016": return generateParallelAlphaNumeric(qlId, seed, locale);
    case "SER-QL-017": return generateInterleavedAlphaNumeric(qlId, seed, locale);
    case "SER-QL-018": return generateClusterNumber(qlId, seed, locale);
  }
}
