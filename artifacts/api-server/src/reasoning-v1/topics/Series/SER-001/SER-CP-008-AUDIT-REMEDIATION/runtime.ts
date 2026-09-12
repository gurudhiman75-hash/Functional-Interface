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

function integer(next: () => number, min: number, max: number): number {
  return min + Math.floor(next() * (max - min + 1));
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

function difficulty(score: number): SerCp008Difficulty {
  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}

function uniqueDistractors(correct: string, candidates: readonly SerCp008Option[]): SerCp008Option[] {
  const seen = new Set<string>([correct]);
  const output: SerCp008Option[] = [];
  for (const candidate of candidates) {
    if (!candidate.errorLabel || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    output.push(candidate);
    if (output.length === 3) break;
  }
  if (output.length !== 3) throw new Error(`SER-CP-008 could not build three unique misconception distractors for ${correct}.`);
  return output;
}

function buildOptions(
  correct: string,
  candidates: readonly SerCp008Option[],
  seed: number,
  qlId: SerCp008ProvisionalQlId,
): { readonly options: readonly SerCp008Option[]; readonly correctIndex: number } {
  const wrong = uniqueDistractors(correct, candidates);
  const raw: SerCp008Option[] = [{ value: correct, errorLabel: null }, ...wrong];
  const shuffled = shuffle(raw, seed * 31 + Number(qlId.slice(-3)));
  const requested = ((seed + Number(qlId.slice(-3))) % 4 + 4) % 4;
  const current = shuffled.findIndex((entry) => entry.errorLabel === null);
  const [answer] = shuffled.splice(current, 1);
  shuffled.splice(requested, 0, answer!);
  return { options: shuffled, correctIndex: requested };
}

function crossesAlphabet(start: string, jump: number, transitions: number): boolean {
  const position = oneBasedPosition(start);
  for (let step = 1; step <= transitions; step += 1) {
    const raw = position + jump * step;
    if (raw < 1 || raw > 26) return true;
  }
  return false;
}

function generateSingleProgressive(
  qlId: "SER-QL-014",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  const next = randomSource(seed * 101 + 14);
  const start = letterAtOneBased(integer(next, 1, 26));
  const firstJump = pick(next, [-4, -3, -2, 2, 3, 4] as const);
  const jumpIncrement = pick(next, [-2, -1, 1, 2] as const);
  const terms = Array.from({ length: 5 }, (_, index) =>
    independentlyContinueSingleLetterProgression({
      start,
      firstJump,
      jumpIncrement,
      transitionCount: index,
    }),
  );
  if (new Set(terms).size < 5) return generateSingleProgressive(qlId, seed + 997, locale);
  const correct = terms[4]!;
  const lastShown = terms[3]!;
  const lastPosition = oneBasedPosition(lastShown);
  const expectedNextJump = firstJump + 3 * jumpIncrement;
  const candidates = [
    { value: letterAtOneBased(lastPosition + firstJump), errorLabel: "REPEATED_FIRST_JUMP" },
    { value: letterAtOneBased(lastPosition + firstJump + 2 * jumpIncrement), errorLabel: "REPEATED_PREVIOUS_JUMP" },
    { value: letterAtOneBased(lastPosition - expectedNextJump), errorLabel: "REVERSED_NEXT_JUMP" },
    { value: letterAtOneBased(lastPosition + firstJump + 4 * jumpIncrement), errorLabel: "ADVANCED_JUMP_TOO_EARLY" },
    { value: letterAtOneBased(lastPosition + jumpIncrement), errorLabel: "USED_INCREMENT_AS_JUMP" },
  ];
  const { options, correctIndex } = buildOptions(correct, candidates, seed, qlId);
  const wrapped = terms.some((term, index) => index > 0 && crossesAlphabet(terms[index - 1]!, firstJump + (index - 1) * jumpIncrement, 1));
  return {
    qlId,
    authorityId: "SINGLE_LETTER_PROGRESSIVE_JUMP",
    seed,
    locale,
    difficulty: difficulty(2 + (wrapped ? 1 : 0)),
    stem: `${text(locale, "Find the next letter in the series.", "श्रृंखला में अगला अक्षर चुनिए।", "ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਅੱਖਰ ਚੁਣੋ।")}\n${terms.slice(0, 4).join(", ")}, ?`,
    options,
    correctIndex,
    correctAnswer: correct,
    explanation: [
      text(locale, "The jump changes by the same amount at every step.", "हर चरण में छलांग समान मात्रा से बदलती है।", "ਹਰ ਕਦਮ ਤੇ ਛਾਲ ਇੱਕੋ ਮਾਤਰਾ ਨਾਲ ਬਦਲਦੀ ਹੈ।"),
      `${terms[0]} → ${terms[1]} (${firstJump >= 0 ? "+" : ""}${firstJump}), ${terms[1]} → ${terms[2]} (${firstJump + jumpIncrement >= 0 ? "+" : ""}${firstJump + jumpIncrement}), ${terms[2]} → ${terms[3]} (${firstJump + 2 * jumpIncrement >= 0 ? "+" : ""}${firstJump + 2 * jumpIncrement}).`,
      `${text(locale, "Next jump", "अगली छलांग", "ਅਗਲੀ ਛਾਲ")}: ${expectedNextJump >= 0 ? "+" : ""}${expectedNextJump}; ${lastShown} → ${correct}.`,
    ],
    structuralFeatures: { activeChannels: 1, progressiveJump: true, alphabetWrap: wrapped },
  };
}

function generateSingleInterleaved(
  qlId: "SER-QL-015",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  const next = randomSource(seed * 103 + 15);
  const rowStarts = Array.from({ length: 3 }, () => letterAtOneBased(integer(next, 1, 26)));
  const rowJumps = [
    pick(next, [-3, -2, 2, 3] as const),
    pick(next, [-3, -2, 2, 3] as const),
    pick(next, [-2, -1, 1, 2] as const),
  ];
  if (new Set(rowJumps).size === 1) rowJumps[2] = rowJumps[2]! > 0 ? -1 : 1;
  const shownCycles = 3;
  const shown = Array.from({ length: shownCycles * 3 }, (_, index) => {
    const row = index % 3;
    const cycle = Math.floor(index / 3);
    return independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: cycle })[row]!;
  });
  const answerLetters = independentlyContinueInterleavedLetterRows({
    rowStarts,
    rowJumps,
    completedCycles: shownCycles,
  });
  const correct = answerLetters.join(", ");
  const previousCycle = independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: shownCycles - 1 }).join(", ");
  const overAdvanced = independentlyContinueInterleavedLetterRows({ rowStarts, rowJumps, completedCycles: shownCycles + 1 }).join(", ");
  const crossWired = rowStarts.map((start, row) =>
    letterAtOneBased(oneBasedPosition(start) + rowJumps[(row + 1) % 3]! * shownCycles),
  ).join(", ");
  const uniformWrong = rowStarts.map((start) =>
    letterAtOneBased(oneBasedPosition(start) + rowJumps[0]! * shownCycles),
  ).join(", ");
  const { options, correctIndex } = buildOptions(correct, [
    { value: previousCycle, errorLabel: "REPEATED_PREVIOUS_CYCLE" },
    { value: overAdvanced, errorLabel: "ADVANCED_ONE_CYCLE_TOO_FAR" },
    { value: crossWired, errorLabel: "MIXED_ROW_RULES" },
    { value: uniformWrong, errorLabel: "FORCED_ONE_JUMP_ON_ALL_ROWS" },
    { value: [...answerLetters].reverse().join(", "), errorLabel: "REVERSED_ROW_ORDER" },
  ], seed, qlId);
  return {
    qlId,
    authorityId: "SINGLE_LETTER_INTERLEAVED_ROWS",
    seed,
    locale,
    difficulty: difficulty(4),
    stem: `${text(locale, "Choose the next three letters in the correct order.", "अगले तीन अक्षर सही क्रम में चुनिए।", "ਅਗਲੇ ਤਿੰਨ ਅੱਖਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਚੁਣੋ।")}\n${shown.join(", ")}, ?, ?, ?`,
    options,
    correctIndex,
    correctAnswer: correct,
    explanation: [
      text(locale, "Separate positions 1,4,7...; 2,5,8...; and 3,6,9... into three rows.", "स्थान 1,4,7...; 2,5,8...; और 3,6,9... को तीन अलग पंक्तियों में रखें।", "ਥਾਂ 1,4,7...; 2,5,8...; ਅਤੇ 3,6,9... ਨੂੰ ਤਿੰਨ ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਰੱਖੋ।"),
      ...rowStarts.map((_, row) => `${text(locale, "Row", "पंक्ति", "ਕਤਾਰ")} ${row + 1}: ${shown.filter((__, index) => index % 3 === row).join(" → ")} → ${answerLetters[row]}.`),
      `${text(locale, "Therefore", "अतः", "ਇਸ ਲਈ")}: ${correct}.`,
    ],
    structuralFeatures: { interleavedRows: 3, activeChannels: 3, orderedMultiAnswer: true },
  };
}

function formatParallelToken(order: "LETTER_NUMBER" | "NUMBER_LETTER", letter: string, number: number): string {
  return order === "LETTER_NUMBER" ? `${letter}-${number}` : `${number}${letter}`;
}

function generateParallelAlphaNumeric(
  qlId: "SER-QL-016",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  const next = randomSource(seed * 107 + 16);
  const startLetter = letterAtOneBased(integer(next, 1, 26));
  const startNumber = integer(next, 2, 40);
  const letterJump = pick(next, [-4, -3, -2, 2, 3, 4] as const);
  const numberJump = pick(next, [-9, -7, -5, 5, 7, 9] as const);
  const order = pick(next, ["LETTER_NUMBER", "NUMBER_LETTER"] as const);
  const states = Array.from({ length: 5 }, (_, transitions) =>
    independentlyContinueAlphanumericParallel({
      letter: startLetter,
      number: startNumber,
      letterJump,
      numberJump,
      transitions,
    }),
  );
  if (states.some((state) => state.number <= 0)) return generateParallelAlphaNumeric(qlId, seed + 991, locale);
  const tokens = states.map((state) => formatParallelToken(order, state.letter, state.number));
  const target = states[4]!;
  const previous = states[3]!;
  const correct = tokens[4]!;
  const { options, correctIndex } = buildOptions(correct, [
    { value: formatParallelToken(order, previous.letter, target.number), errorLabel: "NUMBER_CHANNEL_ONLY" },
    { value: formatParallelToken(order, target.letter, previous.number), errorLabel: "LETTER_CHANNEL_ONLY" },
    { value: formatParallelToken(order, target.letter, previous.number - numberJump), errorLabel: "REVERSED_NUMBER_JUMP" },
    { value: formatParallelToken(order, letterAtOneBased(oneBasedPosition(previous.letter) - letterJump), target.number), errorLabel: "REVERSED_LETTER_JUMP" },
    { value: formatParallelToken(order, letterAtOneBased(oneBasedPosition(previous.letter) + numberJump), target.number), errorLabel: "USED_NUMBER_JUMP_ON_LETTER" },
  ], seed, qlId);
  const wrapped = crossesAlphabet(startLetter, letterJump, 4);
  return {
    qlId,
    authorityId: "ALPHANUMERIC_PARALLEL_CHANNELS",
    seed,
    locale,
    difficulty: difficulty(2 + (Math.abs(letterJump) !== Math.abs(numberJump) ? 1 : 0) + (wrapped ? 1 : 0)),
    stem: `${text(locale, "Find the next term in the letter-number series.", "अक्षर-संख्या श्रृंखला का अगला पद चुनिए।", "ਅੱਖਰ-ਅੰਕ ਲੜੀ ਦਾ ਅਗਲਾ ਪਦ ਚੁਣੋ।")}\n${tokens.slice(0, 4).join(", ")}, ?`,
    options,
    correctIndex,
    correctAnswer: correct,
    explanation: [
      text(locale, "Track the letter and number separately.", "अक्षर और संख्या को अलग-अलग देखें।", "ਅੱਖਰ ਅਤੇ ਅੰਕ ਨੂੰ ਵੱਖ-ਵੱਖ ਦੇਖੋ।"),
      `${text(locale, "Letters", "अक्षर", "ਅੱਖਰ")}: ${states.slice(0, 4).map((state) => state.letter).join(" → ")} → ${target.letter} (${letterJump >= 0 ? "+" : ""}${letterJump}).`,
      `${text(locale, "Numbers", "संख्याएँ", "ਅੰਕ")}: ${states.slice(0, 4).map((state) => state.number).join(" → ")} → ${target.number} (${numberJump >= 0 ? "+" : ""}${numberJump}).`,
      `${text(locale, "Combine both results", "दोनों परिणाम मिलाएँ", "ਦੋਵੇਂ ਨਤੀਜੇ ਜੋੜੋ")}: ${correct}.`,
    ],
    structuralFeatures: { activeChannels: 2, interleavedRows: 1, alphabetWrap: wrapped, independentChannelSteps: true },
  };
}

function generateInterleavedAlphaNumeric(
  qlId: "SER-QL-017",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  const next = randomSource(seed * 109 + 17);
  const starts = [
    { letter: letterAtOneBased(integer(next, 1, 26)), number: integer(next, 10, 40) },
    { letter: letterAtOneBased(integer(next, 1, 26)), number: integer(next, 2, 20) },
  ] as const;
  const letterJumps = [pick(next, [-2, -1, 1, 2] as const), pick(next, [-2, -1, 1, 2] as const)] as const;
  const numberJumps = [pick(next, [-4, -2, 2, 4] as const), pick(next, [-4, -2, 2, 4] as const)] as const;
  const tokenFor = (row: number, cycle: number) => {
    const state = independentlyContinueAlphanumericInterleaved({
      targetRowStartLetter: starts[row]!.letter,
      targetRowStartNumber: starts[row]!.number,
      targetRowLetterJump: letterJumps[row]!,
      targetRowNumberJump: numberJumps[row]!,
      completedTargetRowTransitions: cycle,
    });
    return `${state.number}${state.letter}`;
  };
  const shown = Array.from({ length: 6 }, (_, index) => tokenFor(index % 2, Math.floor(index / 2)));
  if (shown.some((token) => Number.parseInt(token, 10) <= 0)) return generateInterleavedAlphaNumeric(qlId, seed + 983, locale);
  const targetState = independentlyContinueAlphanumericInterleaved({
    targetRowStartLetter: starts[0].letter,
    targetRowStartNumber: starts[0].number,
    targetRowLetterJump: letterJumps[0],
    targetRowNumberJump: numberJumps[0],
    completedTargetRowTransitions: 3,
  });
  if (targetState.number <= 0) return generateInterleavedAlphaNumeric(qlId, seed + 977, locale);
  const correct = `${targetState.number}${targetState.letter}`;
  const wrongRow = independentlyContinueAlphanumericInterleaved({
    targetRowStartLetter: starts[1].letter,
    targetRowStartNumber: starts[1].number,
    targetRowLetterJump: letterJumps[1],
    targetRowNumberJump: numberJumps[1],
    completedTargetRowTransitions: 3,
  });
  const rowAPrevious = independentlyContinueAlphanumericInterleaved({
    targetRowStartLetter: starts[0].letter,
    targetRowStartNumber: starts[0].number,
    targetRowLetterJump: letterJumps[0],
    targetRowNumberJump: numberJumps[0],
    completedTargetRowTransitions: 2,
  });
  const { options, correctIndex } = buildOptions(correct, [
    { value: `${wrongRow.number}${wrongRow.letter}`, errorLabel: "CONTINUED_WRONG_INTERLEAVED_ROW" },
    { value: `${targetState.number}${rowAPrevious.letter}`, errorLabel: "NUMBER_ADVANCED_LETTER_NOT_ADVANCED" },
    { value: `${rowAPrevious.number}${targetState.letter}`, errorLabel: "LETTER_ADVANCED_NUMBER_NOT_ADVANCED" },
    { value: `${rowAPrevious.number - numberJumps[0]}${targetState.letter}`, errorLabel: "REVERSED_TARGET_NUMBER_STEP" },
    { value: `${targetState.number}${letterAtOneBased(oneBasedPosition(rowAPrevious.letter) - letterJumps[0])}`, errorLabel: "REVERSED_TARGET_LETTER_STEP" },
  ], seed, qlId);
  return {
    qlId,
    authorityId: "ALPHANUMERIC_INTERLEAVED_CHANNELS",
    seed,
    locale,
    difficulty: difficulty(4),
    stem: `${text(locale, "Find the next term in the interleaved letter-number series.", "अंतर्विन्यस्त अक्षर-संख्या श्रृंखला का अगला पद चुनिए।", "ਆਪਸੀ ਗੁੰਥੀ ਅੱਖਰ-ਅੰਕ ਲੜੀ ਦਾ ਅਗਲਾ ਪਦ ਚੁਣੋ।")}\n${shown.join(", ")}, ?`,
    options,
    correctIndex,
    correctAnswer: correct,
    explanation: [
      text(locale, "Separate the odd-position and even-position terms.", "विषम और सम स्थान वाले पद अलग करें।", "ਟਾਂਕ ਅਤੇ ਜੁੜੇ ਸਥਾਨਾਂ ਵਾਲੇ ਪਦ ਵੱਖ ਕਰੋ।"),
      `${text(locale, "Odd-position row", "विषम-स्थान पंक्ति", "ਟਾਂਕ-ਸਥਾਨ ਕਤਾਰ")}: ${shown.filter((_, index) => index % 2 === 0).join(" → ")} → ${correct}.`,
      `${text(locale, "In that row, both the number and letter keep their own fixed step.", "उस पंक्ति में संख्या और अक्षर दोनों अपनी-अपनी निश्चित चाल रखते हैं।", "ਉਸ ਕਤਾਰ ਵਿੱਚ ਅੰਕ ਅਤੇ ਅੱਖਰ ਦੋਵੇਂ ਆਪਣੀ-ਆਪਣੀ ਨਿਸ਼ਚਿਤ ਚਾਲ ਰੱਖਦੇ ਹਨ।")}`,
    ],
    structuralFeatures: { interleavedRows: 2, activeChannels: 2, independentChannelSteps: true },
  };
}

function generateClusterNumber(
  qlId: "SER-QL-018",
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008Question {
  const next = randomSource(seed * 113 + 18);
  const startLetters = [letterAtOneBased(integer(next, 1, 26)), letterAtOneBased(integer(next, 1, 26))] as const;
  let jumpA = pick(next, [-2, -1, 1, 2] as const);
  let jumpB = pick(next, [-3, -2, 2, 3] as const);
  if (jumpA === jumpB) jumpB = jumpB > 0 ? jumpB + 1 : jumpB - 1;
  const numberJump = pick(next, [-6, -4, 4, 6] as const);
  const startNumber = numberJump < 0 ? integer(next, 55, 95) : integer(next, 10, 45);
  const states = Array.from({ length: 5 }, (_, transitions) =>
    independentlyContinueClusterNumber({
      letters: startLetters,
      number: startNumber,
      letterJumps: [jumpA, jumpB],
      numberJump,
      transitions,
    }),
  );
  if (states.some((state) => state.number <= 0)) return generateClusterNumber(qlId, seed + 971, locale);
  const token = (state: (typeof states)[number]) => `${state.letters.join("")}${state.number}`;
  const shown = states.slice(0, 4).map(token);
  const correct = token(states[4]!);
  const previous = states[3]!;
  const target = states[4]!;
  const { options, correctIndex } = buildOptions(correct, [
    { value: `${previous.letters[0]}${target.letters[1]}${target.number}`, errorLabel: "FIRST_LETTER_NOT_ADVANCED" },
    { value: `${target.letters[0]}${previous.letters[1]}${target.number}`, errorLabel: "SECOND_LETTER_NOT_ADVANCED" },
    { value: `${target.letters.join("")}${previous.number}`, errorLabel: "NUMBER_NOT_ADVANCED" },
    { value: `${letterAtOneBased(oneBasedPosition(previous.letters[0]) + jumpB)}${letterAtOneBased(oneBasedPosition(previous.letters[1]) + jumpA)}${target.number}`, errorLabel: "SWAPPED_LETTER_CHANNEL_STEPS" },
    { value: `${target.letters.join("")}${previous.number - numberJump}`, errorLabel: "REVERSED_NUMBER_STEP" },
  ], seed, qlId);
  const wrapped = crossesAlphabet(startLetters[0], jumpA, 4) || crossesAlphabet(startLetters[1], jumpB, 4);
  return {
    qlId,
    authorityId: "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS",
    seed,
    locale,
    difficulty: difficulty(3 + (jumpA !== jumpB ? 1 : 0) + (wrapped ? 1 : 0)),
    stem: `${text(locale, "Find the next term in the series.", "श्रृंखला का अगला पद चुनिए।", "ਲੜੀ ਦਾ ਅਗਲਾ ਪਦ ਚੁਣੋ।")}\n${shown.join(", ")}, ?`,
    options,
    correctIndex,
    correctAnswer: correct,
    explanation: [
      text(locale, "Track the first letter, second letter and number as three separate channels.", "पहले अक्षर, दूसरे अक्षर और संख्या को तीन अलग क्रमों में देखें।", "ਪਹਿਲੇ ਅੱਖਰ, ਦੂਜੇ ਅੱਖਰ ਅਤੇ ਅੰਕ ਨੂੰ ਤਿੰਨ ਵੱਖ ਲੜੀਆਂ ਵਾਂਗ ਦੇਖੋ।"),
      `${text(locale, "First letters", "पहले अक्षर", "ਪਹਿਲੇ ਅੱਖਰ")}: ${states.slice(0, 4).map((state) => state.letters[0]).join(" → ")} → ${target.letters[0]} (${jumpA >= 0 ? "+" : ""}${jumpA}).`,
      `${text(locale, "Second letters", "दूसरे अक्षर", "ਦੂਜੇ ਅੱਖਰ")}: ${states.slice(0, 4).map((state) => state.letters[1]).join(" → ")} → ${target.letters[1]} (${jumpB >= 0 ? "+" : ""}${jumpB}).`,
      `${text(locale, "Numbers", "संख्याएँ", "ਅੰਕ")}: ${states.slice(0, 4).map((state) => state.number).join(" → ")} → ${target.number} (${numberJump >= 0 ? "+" : ""}${numberJump}).`,
    ],
    structuralFeatures: { activeChannels: 3, interleavedRows: 1, independentChannelSteps: true, alphabetWrap: wrapped },
  };
}

export function generateSerCp008(
  qlId: SerCp008ProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008Question {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("SER-CP-008 seed must be a non-negative integer.");
  serCp008AuthorityByQlId(qlId);
  switch (qlId) {
    case "SER-QL-014":
      return generateSingleProgressive(qlId, seed, locale);
    case "SER-QL-015":
      return generateSingleInterleaved(qlId, seed, locale);
    case "SER-QL-016":
      return generateParallelAlphaNumeric(qlId, seed, locale);
    case "SER-QL-017":
      return generateInterleavedAlphaNumeric(qlId, seed, locale);
    case "SER-QL-018":
      return generateClusterNumber(qlId, seed, locale);
  }
}
