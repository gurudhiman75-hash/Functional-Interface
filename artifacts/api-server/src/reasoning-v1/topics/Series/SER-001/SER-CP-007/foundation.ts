export const SER_CP007_SOURCE_RULE_IDS = [
  "UNIFORM_COLUMN_SHIFTS",
  "MIXED_COLUMN_SHIFTS",
  "PROGRESSIVE_COLUMN_SHIFTS",
  "TWO_INTERLEAVED_CLUSTER_ROWS",
  "CYCLIC_CLUSTER_ROTATION",
  "FIXED_FRONT_DELETION",
  "FIXED_END_DELETION",
  "ALTERNATING_EDGE_DELETION",
  "SHRINKING_CONSECUTIVE_BLOCKS",
  "REPEATED_BLOCK_GAPS",
  "ALTERNATING_BLOCK_GAPS",
] as const;

export type SerCp007SourceRuleId = (typeof SER_CP007_SOURCE_RULE_IDS)[number];

export const SER_CP007_CANONICAL_AUTHORITY_IDS = [
  "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  "TWO_INTERLEAVED_CLUSTER_SERIES",
  "CYCLIC_CLUSTER_PERMUTATION",
  "EDGE_DELETION_WORD_SEQUENCE",
  "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
  "REPEATED_BLOCK_COMPLETION",
  "ALTERNATING_BLOCK_COMPLETION",
] as const;

export type SerCp007CanonicalAuthorityId =
  (typeof SER_CP007_CANONICAL_AUTHORITY_IDS)[number];

export type SerCp007TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM"
  | "FILL_GAPS";

export type SerCp007Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SerCp007TemporaryTemplateId = `SER-CP-007-TMP-${string}`;
export type SerCp007AnswerSemantic =
  | "CLUSTER_VALUE"
  | "CORRECT_REPLACEMENT_CLUSTER"
  | "GAP_LETTER_GROUP";

export type SerCp007OwnershipDisposition =
  | "PROVISIONAL_RETAIN_CP007"
  | "PROVISIONAL_MERGE_SURFACE_VARIANTS"
  | "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY";

export interface SerCp007Template {
  readonly temporaryTemplateId: SerCp007TemporaryTemplateId;
  readonly sourceRuleId: SerCp007SourceRuleId;
  readonly canonicalAuthorityId: SerCp007CanonicalAuthorityId;
  readonly taskKind: SerCp007TaskKind;
  readonly answerSemantic: SerCp007AnswerSemantic;
  readonly ownershipDisposition: SerCp007OwnershipDisposition;
}

const FOUR_WAY_TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const satisfies readonly SerCp007TaskKind[];

const THREE_WAY_TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "WRONG_TERM",
] as const satisfies readonly SerCp007TaskKind[];

function tasksFor(sourceRuleId: SerCp007SourceRuleId): readonly SerCp007TaskKind[] {
  switch (sourceRuleId) {
    case "UNIFORM_COLUMN_SHIFTS":
    case "MIXED_COLUMN_SHIFTS":
    case "PROGRESSIVE_COLUMN_SHIFTS":
    case "TWO_INTERLEAVED_CLUSTER_ROWS":
    case "CYCLIC_CLUSTER_ROTATION":
      return FOUR_WAY_TASKS;
    case "FIXED_FRONT_DELETION":
    case "FIXED_END_DELETION":
    case "ALTERNATING_EDGE_DELETION":
    case "SHRINKING_CONSECUTIVE_BLOCKS":
      return THREE_WAY_TASKS;
    case "REPEATED_BLOCK_GAPS":
    case "ALTERNATING_BLOCK_GAPS":
      return ["FILL_GAPS"];
  }
}

function ownershipFor(sourceRuleId: SerCp007SourceRuleId): Pick<
  SerCp007Template,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (sourceRuleId) {
    case "UNIFORM_COLUMN_SHIFTS":
    case "MIXED_COLUMN_SHIFTS":
      return {
        canonicalAuthorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
        ownershipDisposition: "PROVISIONAL_MERGE_SURFACE_VARIANTS",
      };
    case "PROGRESSIVE_COLUMN_SHIFTS":
      return {
        canonicalAuthorityId: "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "TWO_INTERLEAVED_CLUSTER_ROWS":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_CLUSTER_SERIES",
        ownershipDisposition: "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY",
      };
    case "CYCLIC_CLUSTER_ROTATION":
      return {
        canonicalAuthorityId: "CYCLIC_CLUSTER_PERMUTATION",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "FIXED_FRONT_DELETION":
    case "FIXED_END_DELETION":
    case "ALTERNATING_EDGE_DELETION":
      return {
        canonicalAuthorityId: "EDGE_DELETION_WORD_SEQUENCE",
        ownershipDisposition: "PROVISIONAL_MERGE_SURFACE_VARIANTS",
      };
    case "SHRINKING_CONSECUTIVE_BLOCKS":
      return {
        canonicalAuthorityId: "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "REPEATED_BLOCK_GAPS":
      return {
        canonicalAuthorityId: "REPEATED_BLOCK_COMPLETION",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "ALTERNATING_BLOCK_GAPS":
      return {
        canonicalAuthorityId: "ALTERNATING_BLOCK_COMPLETION",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
  }
}

const templateRows: Omit<SerCp007Template, "temporaryTemplateId">[] = [];
for (const sourceRuleId of SER_CP007_SOURCE_RULE_IDS) {
  for (const taskKind of tasksFor(sourceRuleId)) {
    templateRows.push({
      sourceRuleId,
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM"
          ? "CORRECT_REPLACEMENT_CLUSTER"
          : taskKind === "FILL_GAPS"
            ? "GAP_LETTER_GROUP"
            : "CLUSTER_VALUE",
      ...ownershipFor(sourceRuleId),
    });
  }
}

export const SER_CP007_TEMPORARY_TEMPLATE_IDS = templateRows.map(
  (_, index) => `SER-CP-007-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp007TemporaryTemplateId[];

export const SER_CP007_TEMPORARY_TEMPLATES: readonly SerCp007Template[] =
  templateRows.map((row, index) => ({
    temporaryTemplateId: SER_CP007_TEMPORARY_TEMPLATE_IDS[index]!,
    ...row,
  }));

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function letterAt(position: number): string {
  return ALPHABET[mod(position, 26)]!;
}

function positionOf(letter: string): number {
  const position = ALPHABET.indexOf(letter);
  if (position < 0) throw new Error(`Invalid letter: ${letter}`);
  return position;
}

function shiftToken(token: string, amount: number): string {
  return [...token].map((letter) => letterAt(positionOf(letter) + amount)).join("");
}

function rotateLeft(token: string, amount: number): string {
  const safe = mod(amount, token.length);
  return token.slice(safe) + token.slice(0, safe);
}

function createPrng(seed: number): () => number {
  let state = seed >>> 0;
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

function pickNonZero(next: () => number, minimum: number, maximum: number): number {
  let value = 0;
  while (value === 0) value = integer(next, minimum, maximum);
  return value;
}

function difficultyFor(seed: number, templateIndex: number): SerCp007Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed + templateIndex) % 3]!;
}

interface GeneratedFamily {
  readonly terms: readonly string[];
  readonly parameterKey: string;
  readonly rule: string;
  readonly steps: readonly string[];
  readonly quickMethod: string;
  readonly commonMistake: string;
  readonly trapCode: string;
  readonly fullText?: string;
  readonly maskedText?: string;
  readonly gapIndexes?: readonly number[];
  readonly missingLetters?: string;
}

function fixedColumnTerms(
  starts: readonly number[],
  shifts: readonly number[],
  count: number,
): readonly string[] {
  return Array.from({ length: count }, (_, termIndex) =>
    starts.map((start, column) => letterAt(start + shifts[column]! * termIndex)).join(""),
  );
}

function generateUniformColumns(next: () => number): GeneratedFamily {
  const width = integer(next, 2, 5);
  const starts = Array.from({ length: width }, () => integer(next, 0, 25));
  const shift = pickNonZero(next, -5, 5);
  const terms = fixedColumnTerms(starts, Array(width).fill(shift), 8);
  return {
    terms,
    parameterKey: `${starts.join(".")}|${shift}`,
    rule: `Move every letter in the group by ${Math.abs(shift)} place${Math.abs(shift) === 1 ? "" : "s"} ${shift > 0 ? "forward" : "backward"} each time.`,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod: `Check the first two groups and repeat the same letter jump in every position.`,
    commonMistake: `Do not move only the first letter. Each position in the group follows the same jump.`,
    trapCode: "ONLY_FIRST_LETTER_MOVED",
  };
}

function generateMixedColumns(next: () => number): GeneratedFamily {
  const width = integer(next, 3, 5);
  const starts = Array.from({ length: width }, () => integer(next, 0, 25));
  const shifts = Array.from({ length: width }, () => pickNonZero(next, -4, 4));
  if (new Set(shifts).size === 1) shifts[width - 1] = shifts[width - 1]! > 0 ? -1 : 1;
  const terms = fixedColumnTerms(starts, shifts, 8);
  return {
    terms,
    parameterKey: `${starts.join(".")}|${shifts.join(".")}`,
    rule: `Read the groups from top to bottom by position. Each letter position has its own fixed jump.`,
    steps: shifts.map(
      (shift, column) =>
        `Position ${column + 1}: ${terms.map((term) => term[column]).join(" → ")} (${shift > 0 ? "+" : "−"}${Math.abs(shift)})`,
    ),
    quickMethod: `Write the groups one below another and follow each vertical position separately.`,
    commonMistake: `Do not force one jump on the whole group. The letter positions can move by different amounts.`,
    trapCode: "ONE_JUMP_FOR_ALL_COLUMNS",
  };
}

function generateProgressiveColumns(next: () => number): GeneratedFamily {
  const width = integer(next, 2, 4);
  const starts = Array.from({ length: width }, () => integer(next, 0, 25));
  const firstShifts = Array.from({ length: width }, () => pickNonZero(next, -3, 3));
  const increments = Array.from({ length: width }, () => pickNonZero(next, -2, 2));
  const states = [...starts];
  const terms: string[] = [states.map(letterAt).join("")];
  const stepLines: string[] = [];
  for (let transition = 0; transition < 7; transition += 1) {
    const used = firstShifts.map(
      (first, column) => first + increments[column]! * transition,
    );
    for (let column = 0; column < width; column += 1) {
      states[column] = states[column]! + used[column]!;
    }
    terms.push(states.map(letterAt).join(""));
    stepLines.push(
      `${terms[transition]} → ${terms[transition + 1]} using ${used
        .map((value) => `${value >= 0 ? "+" : "−"}${Math.abs(value)}`)
        .join(", ")}`,
    );
  }
  return {
    terms,
    parameterKey: `${starts.join(".")}|${firstShifts.join(".")}|${increments.join(".")}`,
    rule: `Follow each letter position separately. Its jump changes by a fixed amount at every step.`,
    steps: stepLines,
    quickMethod: `Compare the jump used in the same position across three consecutive groups.`,
    commonMistake: `Do not reuse the first jump forever. The jump itself changes from one group to the next.`,
    trapCode: "PROGRESSIVE_JUMP_IGNORED",
  };
}

function generateInterleavedRows(next: () => number): GeneratedFamily {
  const width = integer(next, 2, 4);
  const oddStarts = Array.from({ length: width }, () => integer(next, 0, 25));
  const evenStarts = Array.from({ length: width }, () => integer(next, 0, 25));
  const oddShifts = Array.from({ length: width }, () => pickNonZero(next, -4, 4));
  const evenShifts = Array.from({ length: width }, () => pickNonZero(next, -4, 4));
  if (
    oddShifts.join(",") === evenShifts.join(",") &&
    oddStarts.join(",") === evenStarts.join(",")
  ) {
    evenShifts[0] = evenShifts[0]! > 0 ? -1 : 1;
  }
  const terms = Array.from({ length: 8 }, (_, index) => {
    const rowIndex = Math.floor(index / 2);
    const starts = index % 2 === 0 ? oddStarts : evenStarts;
    const shifts = index % 2 === 0 ? oddShifts : evenShifts;
    return starts.map((start, column) => letterAt(start + shifts[column]! * rowIndex)).join("");
  });
  return {
    terms,
    parameterKey: `${oddStarts.join(".")}:${oddShifts.join(".")}|${evenStarts.join(".")}:${evenShifts.join(".")}`,
    rule: `Put the 1st, 3rd, 5th... groups in one row and the 2nd, 4th, 6th... groups in another. Continue the required row.`,
    steps: [
      `Odd-position row: ${terms.filter((_, index) => index % 2 === 0).join(" → ")}`,
      `Even-position row: ${terms.filter((_, index) => index % 2 === 1).join(" → ")}`,
    ],
    quickMethod: `Check alternate groups instead of comparing neighbouring groups.`,
    commonMistake: `Do not join the two rows into one rule. The answer must follow the row containing the blank.`,
    trapCode: "ALTERNATE_ROWS_MIXED",
  };
}

function generateRotation(next: () => number): GeneratedFamily {
  const width = integer(next, 3, 6);
  const start = integer(next, 0, 25);
  const gap = integer(next, 1, 5);
  const base = Array.from({ length: width }, (_, index) => letterAt(start + index * gap)).join("");
  let rotation = integer(next, 1, width - 1);
  if (width % rotation === 0 && rotation !== 1) rotation = 1;
  const terms = Array.from({ length: 8 }, (_, index) => rotateLeft(base, index * rotation));
  return {
    terms,
    parameterKey: `${base}|${rotation}`,
    rule: `Keep the same letters and move the first ${rotation} letter${rotation === 1 ? "" : "s"} to the end each time.`,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod: `Check whether the letters stay the same and only their order changes.`,
    commonMistake: `Do not apply alphabet jumps when the same letters are simply changing places.`,
    trapCode: "ROTATION_MISTAKEN_FOR_SHIFT",
  };
}

function buildBaseWord(next: () => number): string {
  const length = 10;
  const letters: string[] = [];
  while (letters.length < length) {
    const candidate = letterAt(integer(next, 0, 25));
    if (candidate !== letters[letters.length - 1]) letters.push(candidate);
  }
  return letters.join("");
}

function generateDeletion(
  next: () => number,
  kind: "FRONT" | "END" | "ALTERNATING",
): GeneratedFamily {
  const base = buildBaseWord(next);
  const terms: string[] = [base];
  let left = 0;
  let right = base.length;
  for (let step = 1; step < 8; step += 1) {
    if (kind === "FRONT" || (kind === "ALTERNATING" && step % 2 === 1)) left += 1;
    else right -= 1;
    terms.push(base.slice(left, right));
  }
  const rule =
    kind === "FRONT"
      ? "Remove one letter from the beginning each time."
      : kind === "END"
        ? "Remove one letter from the end each time."
        : "Remove one letter from the beginning, then one from the end, and repeat.";
  return {
    terms,
    parameterKey: `${kind}|${base}`,
    rule,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod: `Compare the length and the edge that changes at each step.`,
    commonMistake: `Do not change the remaining letters. Only the stated edge letter is removed.`,
    trapCode: "INNER_LETTERS_CHANGED",
  };
}

function generateShrinkingBlocks(next: () => number): GeneratedFamily {
  const initialLength = integer(next, 8, 10);
  const gap = integer(next, 1, 4);
  const direction = next() < 0.5 ? 1 : -1;
  let start = integer(next, 0, 25);
  const terms: string[] = [];
  for (let index = 0; index < 8; index += 1) {
    const length = initialLength - index;
    const term = Array.from(
      { length },
      (_, offset) => letterAt(start + direction * offset),
    ).join("");
    terms.push(term);
    start += direction * (length + gap);
  }
  return {
    terms,
    parameterKey: `${terms[0]}|${gap}|${direction}`,
    rule: `Each group contains consecutive letters. The group becomes one letter shorter, and the same number of letters is skipped before the next group starts.`,
    steps: terms.map((term, index) => `Group ${index + 1}: ${term} (${term.length} letters)`),
    quickMethod: `Check the group lengths first, then count the fixed gap before the next group.`,
    commonMistake: `Do not compare only the first letters. Both the group length and the skipped letters matter.`,
    trapCode: "GROUP_LENGTH_IGNORED",
  };
}

function chooseGapIndexes(next: () => number, length: number, count: number): readonly number[] {
  const indexes = new Set<number>();
  while (indexes.size < count) indexes.add(integer(next, 1, length - 2));
  return [...indexes].sort((a, b) => a - b);
}

function maskText(fullText: string, indexes: readonly number[]): string {
  const hidden = new Set(indexes);
  return [...fullText].map((letter, index) => (hidden.has(index) ? "_" : letter)).join(" ");
}

function generateRepeatedGaps(next: () => number): GeneratedFamily {
  const width = integer(next, 2, 4);
  const start = integer(next, 0, 25);
  const step = integer(next, 1, 5);
  const block = Array.from({ length: width }, (_, index) => letterAt(start + index * step)).join("");
  const repeats = integer(next, 5, 7);
  const fullText = block.repeat(repeats);
  const gapIndexes = chooseGapIndexes(next, fullText.length, integer(next, 4, 7));
  const missingLetters = gapIndexes.map((index) => fullText[index]).join("");
  return {
    terms: [fullText],
    fullText,
    maskedText: maskText(fullText, gapIndexes),
    gapIndexes,
    missingLetters,
    parameterKey: `${block}|${repeats}|${gapIndexes.join(".")}`,
    rule: `The same letter block, ${block}, repeats throughout the line.`,
    steps: [`Complete line: ${Array.from({ length: repeats }, () => block).join(" / ")}`],
    quickMethod: `Mark the repeating block boundaries before filling any blank.`,
    commonMistake: `Do not fill each blank separately without checking the repeated block.`,
    trapCode: "BLOCK_BOUNDARY_IGNORED",
  };
}

function generateAlternatingGaps(next: () => number): GeneratedFamily {
  const width = integer(next, 2, 3);
  const startA = integer(next, 0, 25);
  const startB = integer(next, 0, 25);
  const stepA = integer(next, 1, 4);
  const stepB = integer(next, 1, 4);
  const blockA = Array.from({ length: width }, (_, index) => letterAt(startA + index * stepA)).join("");
  let blockB = Array.from({ length: width }, (_, index) => letterAt(startB - index * stepB)).join("");
  if (blockB === blockA) blockB = rotateLeft(blockB, 1);
  const pairs = integer(next, 3, 5);
  const fullText = Array.from({ length: pairs * 2 }, (_, index) =>
    index % 2 === 0 ? blockA : blockB,
  ).join("");
  const gapIndexes = chooseGapIndexes(next, fullText.length, integer(next, 5, 8));
  const missingLetters = gapIndexes.map((index) => fullText[index]).join("");
  return {
    terms: [fullText],
    fullText,
    maskedText: maskText(fullText, gapIndexes),
    gapIndexes,
    missingLetters,
    parameterKey: `${blockA}|${blockB}|${pairs}|${gapIndexes.join(".")}`,
    rule: `Two letter blocks repeat in turn: ${blockA}, ${blockB}, ${blockA}, ${blockB}...`,
    steps: [
      `Complete line: ${Array.from({ length: pairs * 2 }, (_, index) =>
        index % 2 === 0 ? blockA : blockB,
      ).join(" / ")}`,
    ],
    quickMethod: `Separate the line into equal blocks and check the odd and even blocks.`,
    commonMistake: `Do not treat the whole line as one repeated block when two blocks alternate.`,
    trapCode: "TWO_BLOCKS_MERGED",
  };
}

function generateFamily(sourceRuleId: SerCp007SourceRuleId, seed: number): GeneratedFamily {
  const sourceIndex = SER_CP007_SOURCE_RULE_IDS.indexOf(sourceRuleId);
  const next = createPrng(seed * 1013 + sourceIndex * 7919 + 17);
  switch (sourceRuleId) {
    case "UNIFORM_COLUMN_SHIFTS":
      return generateUniformColumns(next);
    case "MIXED_COLUMN_SHIFTS":
      return generateMixedColumns(next);
    case "PROGRESSIVE_COLUMN_SHIFTS":
      return generateProgressiveColumns(next);
    case "TWO_INTERLEAVED_CLUSTER_ROWS":
      return generateInterleavedRows(next);
    case "CYCLIC_CLUSTER_ROTATION":
      return generateRotation(next);
    case "FIXED_FRONT_DELETION":
      return generateDeletion(next, "FRONT");
    case "FIXED_END_DELETION":
      return generateDeletion(next, "END");
    case "ALTERNATING_EDGE_DELETION":
      return generateDeletion(next, "ALTERNATING");
    case "SHRINKING_CONSECUTIVE_BLOCKS":
      return generateShrinkingBlocks(next);
    case "REPEATED_BLOCK_GAPS":
      return generateRepeatedGaps(next);
    case "ALTERNATING_BLOCK_GAPS":
      return generateAlternatingGaps(next);
  }
}

function templateFor(id: SerCp007TemporaryTemplateId): SerCp007Template {
  const template = SER_CP007_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === id,
  );
  if (!template) throw new Error(`Unknown SER-CP-007 temporary template: ${id}`);
  return template;
}

function mutatedToken(token: string, seed: number): string {
  const index = seed % token.length;
  const letters = [...token];
  letters[index] = letterAt(positionOf(letters[index]!) + 1 + (seed % 3));
  return letters.join("");
}

function optionCandidates(correctAnswer: string, seed: number): readonly string[] {
  const candidates = [
    correctAnswer,
    shiftToken(correctAnswer, 1),
    shiftToken(correctAnswer, -1),
    rotateLeft(correctAnswer, 1),
    [...correctAnswer].reverse().join(""),
    mutatedToken(correctAnswer, seed + 3),
  ];
  const unique = [...new Set(candidates)];
  let offset = 2;
  while (unique.length < 4) {
    const candidate = shiftToken(correctAnswer, offset);
    if (!unique.includes(candidate)) unique.push(candidate);
    offset += 1;
  }
  return unique;
}

function buildOptions(
  correctAnswer: string,
  seed: number,
  correctIndex: number,
): readonly string[] {
  const distractors = optionCandidates(correctAnswer, seed)
    .filter((value) => value !== correctAnswer)
    .slice(0, 3);
  const options = [...distractors];
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function stemForTerms(
  taskKind: Exclude<SerCp007TaskKind, "FILL_GAPS">,
  display: readonly (string | null)[],
): string {
  const rendered = display.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next in the series?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the given series?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrectly placed group?\n${rendered}`;
  }
}

export interface SerCp007Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-007";
  readonly temporaryTemplateId: SerCp007TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp007SourceRuleId;
  readonly canonicalAuthorityId: SerCp007CanonicalAuthorityId;
  readonly ownershipDisposition: SerCp007OwnershipDisposition;
  readonly taskKind: SerCp007TaskKind;
  readonly answerSemantic: SerCp007AnswerSemantic;
  readonly solveMode: "INFER_CLUSTER_OR_BLOCK_SERIES";
  readonly language: "en-IN";
  readonly difficulty: SerCp007Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (string | null)[];
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: {
    readonly rule: string;
    readonly steps: readonly string[];
    readonly quickMethod: string;
    readonly commonMistake: string;
    readonly trapCode: string;
    readonly conclusion: string;
  };
  readonly hiddenState: {
    readonly parameterKey: string;
    readonly canonicalTerms: readonly string[];
    readonly answerIndex: number | null;
    readonly corruptedIndex: number | null;
    readonly displayedWrongTerm: string | null;
    readonly fullText: string | null;
    readonly maskedText: string | null;
    readonly gapIndexes: readonly number[];
  };
  readonly lifecycleLocks: {
    readonly questionStudioVisible: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
    readonly localizationStarted: false;
  };
}

export function generateSerCp007Question(
  temporaryTemplateId: SerCp007TemporaryTemplateId,
  seed: number,
): SerCp007Question {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP007_TEMPORARY_TEMPLATE_IDS.indexOf(temporaryTemplateId);
  const family = generateFamily(template.sourceRuleId, seed);
  const correctIndex = (seed + templateIndex) % 4;

  let stem: string;
  let sequence: readonly (string | null)[];
  let correctAnswer: string;
  let answerIndex: number | null = null;
  let corruptedIndex: number | null = null;
  let displayedWrongTerm: string | null = null;
  let conclusion: string;

  if (template.taskKind === "FILL_GAPS") {
    if (!family.maskedText || !family.missingLetters || !family.fullText) {
      throw new Error("Gap family did not provide its masked text.");
    }
    stem = `Which group of letters should be placed in the blanks from left to right?\n${family.maskedText}`;
    sequence = [family.maskedText];
    correctAnswer = family.missingLetters;
    conclusion = `The missing letters, read from left to right, are ${correctAnswer}.`;
  } else {
    const terms = family.terms;
    if (terms.length < 8) throw new Error("Term family must provide eight terms.");
    switch (template.taskKind) {
      case "NEXT_TERM":
        sequence = terms.slice(0, 7);
        correctAnswer = terms[7]!;
        answerIndex = 7;
        break;
      case "MISSING_TERM": {
        answerIndex = 2 + ((seed + templateIndex) % 4);
        const display = terms.slice(0, 7).map((term, index) =>
          index === answerIndex ? null : term,
        );
        sequence = display;
        correctAnswer = terms[answerIndex]!;
        break;
      }
      case "PREVIOUS_TERM":
        sequence = terms.slice(1, 8);
        correctAnswer = terms[0]!;
        answerIndex = 0;
        break;
      case "WRONG_TERM": {
        corruptedIndex = 2 + ((seed + templateIndex) % 4);
        const display = terms.slice(0, 7);
        displayedWrongTerm = mutatedToken(display[corruptedIndex]!, seed + templateIndex);
        display[corruptedIndex] = displayedWrongTerm;
        sequence = display;
        correctAnswer = terms[corruptedIndex]!;
        answerIndex = corruptedIndex;
        break;
      }
    }
    stem = stemForTerms(template.taskKind, sequence);
    conclusion =
      template.taskKind === "WRONG_TERM"
        ? `${displayedWrongTerm} is wrong at that place. It should be ${correctAnswer}.`
        : `Therefore, the answer is ${correctAnswer}.`;
  }

  const options = buildOptions(correctAnswer, seed + templateIndex * 13, correctIndex);

  return {
    questionId: `${temporaryTemplateId}-${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-007",
    temporaryTemplateId,
    permanentQlId: null,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    answerSemantic: template.answerSemantic,
    solveMode: "INFER_CLUSTER_OR_BLOCK_SERIES",
    language: "en-IN",
    difficulty: difficultyFor(seed, templateIndex),
    seed,
    stem,
    sequence,
    options,
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: [
      template.canonicalAuthorityId,
      family.parameterKey,
      template.taskKind,
      answerIndex ?? "gaps",
      corruptedIndex ?? "clean",
    ].join("|"),
    explanation: {
      rule: family.rule,
      steps:
        template.taskKind === "WRONG_TERM"
          ? [
              `First write the correct series: ${family.terms.slice(0, 7).join(", ")}.`,
              ...family.steps.slice(0, 4),
            ]
          : template.taskKind === "PREVIOUS_TERM"
            ? [
                `First check the shown groups: ${family.terms.slice(1, 5).join(", ")}.`,
                `Now move one step backward using the same rule.`,
                ...family.steps.slice(0, 2),
              ]
            : family.steps,
      quickMethod: family.quickMethod,
      commonMistake: family.commonMistake,
      trapCode: family.trapCode,
      conclusion,
    },
    hiddenState: {
      parameterKey: family.parameterKey,
      canonicalTerms: family.terms,
      answerIndex,
      corruptedIndex,
      displayedWrongTerm,
      fullText: family.fullText ?? null,
      maskedText: family.maskedText ?? null,
      gapIndexes: family.gapIndexes ?? [],
    },
    lifecycleLocks: {
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      localizationStarted: false,
    },
  };
}

export const SER_CP007_OPTION_LABELS = ["1", "2", "3", "4"] as const;

export function renderSerCp007Review(question: SerCp007Question): string {
  const optionLines = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${SER_CP007_OPTION_LABELS[index]}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${SER_CP007_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
    "",
    "📌 **Rule**",
    question.explanation.rule,
    "",
    "📝 **Solution**",
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    `${question.explanation.steps.length + 1}. ${question.explanation.conclusion}`,
    "",
    "⚡ **Quick Method**",
    question.explanation.quickMethod,
    "",
    "⚠️ **Common Mistake**",
    `${question.explanation.commonMistake} [${question.explanation.trapCode}]`,
  ].join("\n");
}
