export const SER_CP007_WAVE_B_SOURCE_RULE_IDS = [
  "PAIRED_EDGE_SHIFTS",
  "FIXED_OUTER_FRAME_CORE_SHIFT",
  "ALTERNATING_FRAME_CORE_ROWS",
  "GROWING_CONSECUTIVE_BLOCKS",
  "CUMULATIVE_PREFIX_GROWTH",
  "SYMMETRIC_EDGE_GROWTH",
  "REPEATED_BLOCK_MULTI_GAP_GROUPS",
  "ALTERNATING_BLOCK_MULTI_GAP_GROUPS",
] as const;

export type SerCp007WaveBSourceRuleId =
  (typeof SER_CP007_WAVE_B_SOURCE_RULE_IDS)[number];

export const SER_CP007_WAVE_B_AUTHORITY_IDS = [
  "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  "TWO_INTERLEAVED_CLUSTER_SERIES",
  "GROWING_CONSECUTIVE_CLUSTER",
  "CUMULATIVE_PREFIX_CLUSTER",
  "SYMMETRIC_EDGE_GROWTH",
  "REPEATED_BLOCK_COMPLETION",
  "ALTERNATING_BLOCK_COMPLETION",
] as const;

export type SerCp007WaveBAuthorityId =
  (typeof SER_CP007_WAVE_B_AUTHORITY_IDS)[number];

export type SerCp007WaveBTaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM"
  | "FILL_GAP_GROUPS";

export type SerCp007WaveBDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SerCp007WaveBTemporaryTemplateId = `SER-CP-007-WB-TMP-${string}`;

export type SerCp007WaveBOwnershipDisposition =
  | "COLLIDE_SER_CP007_WAVE_A"
  | "PROVISIONAL_RETAIN_CP007";

export interface SerCp007WaveBTemplate {
  readonly temporaryTemplateId: SerCp007WaveBTemporaryTemplateId;
  readonly sourceRuleId: SerCp007WaveBSourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveBAuthorityId;
  readonly ownershipDisposition: SerCp007WaveBOwnershipDisposition;
  readonly taskKind: SerCp007WaveBTaskKind;
}

const TERM_TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const satisfies readonly SerCp007WaveBTaskKind[];

function tasksFor(
  sourceRuleId: SerCp007WaveBSourceRuleId,
): readonly SerCp007WaveBTaskKind[] {
  return sourceRuleId === "REPEATED_BLOCK_MULTI_GAP_GROUPS" ||
    sourceRuleId === "ALTERNATING_BLOCK_MULTI_GAP_GROUPS"
    ? ["FILL_GAP_GROUPS"]
    : TERM_TASKS;
}

function ownershipFor(
  sourceRuleId: SerCp007WaveBSourceRuleId,
): Pick<
  SerCp007WaveBTemplate,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (sourceRuleId) {
    case "PAIRED_EDGE_SHIFTS":
    case "FIXED_OUTER_FRAME_CORE_SHIFT":
      return {
        canonicalAuthorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
        ownershipDisposition: "COLLIDE_SER_CP007_WAVE_A",
      };
    case "ALTERNATING_FRAME_CORE_ROWS":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_CLUSTER_SERIES",
        ownershipDisposition: "COLLIDE_SER_CP007_WAVE_A",
      };
    case "GROWING_CONSECUTIVE_BLOCKS":
      return {
        canonicalAuthorityId: "GROWING_CONSECUTIVE_CLUSTER",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "CUMULATIVE_PREFIX_GROWTH":
      return {
        canonicalAuthorityId: "CUMULATIVE_PREFIX_CLUSTER",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "SYMMETRIC_EDGE_GROWTH":
      return {
        canonicalAuthorityId: "SYMMETRIC_EDGE_GROWTH",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "REPEATED_BLOCK_MULTI_GAP_GROUPS":
      return {
        canonicalAuthorityId: "REPEATED_BLOCK_COMPLETION",
        ownershipDisposition: "COLLIDE_SER_CP007_WAVE_A",
      };
    case "ALTERNATING_BLOCK_MULTI_GAP_GROUPS":
      return {
        canonicalAuthorityId: "ALTERNATING_BLOCK_COMPLETION",
        ownershipDisposition: "COLLIDE_SER_CP007_WAVE_A",
      };
  }
}

const templateRows: Omit<
  SerCp007WaveBTemplate,
  "temporaryTemplateId"
>[] = [];

for (const sourceRuleId of SER_CP007_WAVE_B_SOURCE_RULE_IDS) {
  for (const taskKind of tasksFor(sourceRuleId)) {
    templateRows.push({ sourceRuleId, taskKind, ...ownershipFor(sourceRuleId) });
  }
}

export const SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS = templateRows.map(
  (_, index) =>
    `SER-CP-007-WB-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp007WaveBTemporaryTemplateId[];

export const SER_CP007_WAVE_B_TEMPORARY_TEMPLATES: readonly SerCp007WaveBTemplate[] =
  templateRows.map((row, index) => ({
    temporaryTemplateId: SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS[index]!,
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
  if (position < 0) throw new Error(`Invalid letter ${letter}`);
  return position;
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

function nonZero(next: () => number, minimum: number, maximum: number): number {
  let value = 0;
  while (value === 0) value = integer(next, minimum, maximum);
  return value;
}

function shiftToken(token: string, amount: number): string {
  return [...token]
    .map((character) =>
      /[A-Z]/.test(character)
        ? letterAt(positionOf(character) + amount)
        : character,
    )
    .join("");
}

function mutateLetters(value: string, seed: number): string {
  const letters = [...value];
  const indexes = letters
    .map((character, index) => (/[A-Z]/.test(character) ? index : -1))
    .filter((index) => index >= 0);
  if (indexes.length === 0) throw new Error("Cannot mutate an answer without letters.");
  const selected = indexes[seed % indexes.length]!;
  letters[selected] = letterAt(positionOf(letters[selected]!) + 1 + (seed % 3));
  return letters.join("");
}

function reverseLetters(value: string): string {
  const letters = [...value].filter((character) => /[A-Z]/.test(character)).reverse();
  let cursor = 0;
  return [...value]
    .map((character) => (/[A-Z]/.test(character) ? letters[cursor++]! : character))
    .join("");
}

interface GeneratedWaveBFamily {
  readonly terms: readonly string[];
  readonly parameterKey: string;
  readonly rule: string;
  readonly steps: readonly string[];
  readonly quickMethod: string;
  readonly commonMistake: string;
  readonly trapCode: string;
  readonly fullText?: string;
  readonly maskedText?: string;
  readonly gapGroups?: readonly (readonly number[])[];
  readonly answerGroups?: readonly string[];
}

function fixedColumnTerms(
  starts: readonly number[],
  shifts: readonly number[],
): readonly string[] {
  return Array.from({ length: 8 }, (_, termIndex) =>
    starts
      .map((start, column) => letterAt(start + shifts[column]! * termIndex))
      .join(""),
  );
}

function generatePairedEdgeShifts(next: () => number): GeneratedWaveBFamily {
  const width = integer(next, 3, 6);
  const starts = Array.from({ length: width }, () => integer(next, 0, 25));
  const leftShift = nonZero(next, -5, 5);
  let rightShift = nonZero(next, -5, 5);
  if (rightShift === leftShift) rightShift = rightShift > 0 ? -1 : 1;
  const shifts = Array(width).fill(0) as number[];
  shifts[0] = leftShift;
  shifts[width - 1] = rightShift;
  const terms = fixedColumnTerms(starts, shifts);
  return {
    terms,
    parameterKey: `${starts.join(".")}|${shifts.join(".")}`,
    rule: `Follow the first and last letters separately. The middle letters stay unchanged.`,
    steps: [
      `First letters: ${terms.map((term) => term[0]).join(" → ")}`,
      `Last letters: ${terms.map((term) => term[term.length - 1]).join(" → ")}`,
      `Middle part: ${terms[0]!.slice(1, -1)} stays the same.`,
    ],
    quickMethod: `Check only the two edges first; then confirm that the middle part is fixed.`,
    commonMistake: `Do not move every letter when only the first and last letters change.`,
    trapCode: "FIXED_MIDDLE_MOVED",
  };
}

function generateFixedFrameCoreShift(next: () => number): GeneratedWaveBFamily {
  const width = integer(next, 4, 7);
  const starts = Array.from({ length: width }, () => integer(next, 0, 25));
  const coreShift = nonZero(next, -5, 5);
  const shifts = Array.from({ length: width }, (_, index) =>
    index === 0 || index === width - 1 ? 0 : coreShift,
  );
  const terms = fixedColumnTerms(starts, shifts);
  return {
    terms,
    parameterKey: `${starts.join(".")}|frame|${coreShift}`,
    rule: `The first and last letters form a fixed frame. Move each inner letter by the same amount.`,
    steps: [
      `Outer frame: ${terms[0]![0]} _ ${terms[0]![width - 1]} stays fixed.`,
      ...terms.slice(0, -1).map((term, index) =>
        `Inner part: ${term.slice(1, -1)} → ${terms[index + 1]!.slice(1, -1)}`,
      ),
    ],
    quickMethod: `Ignore the fixed edge letters for a moment and compare only the inner part.`,
    commonMistake: `Do not apply the inner-letter jump to the fixed first and last letters.`,
    trapCode: "FRAME_LETTERS_MOVED",
  };
}

function rowTerms(
  frameStart: string,
  frameEnd: string,
  coreStarts: readonly number[],
  coreShifts: readonly number[],
): readonly string[] {
  return Array.from({ length: 4 }, (_, rowIndex) =>
    frameStart +
    coreStarts
      .map((start, column) => letterAt(start + coreShifts[column]! * rowIndex))
      .join("") +
    frameEnd,
  );
}

function generateAlternatingFrameRows(next: () => number): GeneratedWaveBFamily {
  const coreWidth = integer(next, 2, 4);
  const oddCore = Array.from({ length: coreWidth }, () => integer(next, 0, 25));
  const evenCore = Array.from({ length: coreWidth }, () => integer(next, 0, 25));
  const oddShifts = Array.from({ length: coreWidth }, () => nonZero(next, -4, 4));
  const evenShifts = Array.from({ length: coreWidth }, () => nonZero(next, -4, 4));
  const oddFrame = [letterAt(integer(next, 0, 25)), letterAt(integer(next, 0, 25))] as const;
  let evenFrame = [letterAt(integer(next, 0, 25)), letterAt(integer(next, 0, 25))] as const;
  if (evenFrame.join("") === oddFrame.join("")) {
    evenFrame = [letterAt(positionOf(evenFrame[0]) + 1), evenFrame[1]];
  }
  const oddTerms = rowTerms(oddFrame[0], oddFrame[1], oddCore, oddShifts);
  const evenTerms = rowTerms(evenFrame[0], evenFrame[1], evenCore, evenShifts);
  const terms = Array.from({ length: 8 }, (_, index) =>
    index % 2 === 0 ? oddTerms[index / 2]! : evenTerms[(index - 1) / 2]!,
  );
  return {
    terms,
    parameterKey: `${oddFrame.join("")}:${oddCore.join(".")}:${oddShifts.join(".")}|${evenFrame.join("")}:${evenCore.join(".")}:${evenShifts.join(".")}`,
    rule: `Put the odd-position and even-position groups in separate rows. Each row has its own fixed edge letters and inner-letter movement.`,
    steps: [
      `Odd-position row: ${oddTerms.join(" → ")}`,
      `Even-position row: ${evenTerms.join(" → ")}`,
    ],
    quickMethod: `Separate alternate groups before checking the fixed frames or inner letters.`,
    commonMistake: `Do not compare neighbouring groups because they belong to different rows.`,
    trapCode: "ALTERNATE_FRAMED_ROWS_MIXED",
  };
}

function consecutiveBlock(start: number, length: number, direction: number): string {
  return Array.from({ length }, (_, index) => letterAt(start + direction * index)).join("");
}

function generateGrowingBlocks(next: () => number): GeneratedWaveBFamily {
  const baseLength = integer(next, 2, 3);
  const direction = next() < 0.5 ? 1 : -1;
  const gap = integer(next, 0, 3);
  const starts: number[] = [integer(next, 0, 25)];
  const terms: string[] = [];
  for (let index = 0; index < 8; index += 1) {
    const length = baseLength + index;
    const start = starts[index]!;
    terms.push(consecutiveBlock(start, length, direction));
    if (index < 7) starts.push(start + direction * (length + gap));
  }
  return {
    terms,
    parameterKey: `${starts[0]}|${baseLength}|${direction}|${gap}`,
    rule: `Each group contains consecutive letters and becomes one letter longer. The same gap is kept before the next group starts.`,
    steps: terms.map((term, index) =>
      `Group ${index + 1}: ${term} (${term.length} letters)`,
    ),
    quickMethod: `Check the group lengths first; then count the fixed gap between groups.`,
    commonMistake: `Do not look only at the first letters. The growing length is part of the rule.`,
    trapCode: "GROWING_LENGTH_IGNORED",
  };
}

function generatePrefixGrowth(next: () => number): GeneratedWaveBFamily {
  const start = integer(next, 0, 25);
  const step = nonZero(next, -4, 4);
  const stream = Array.from({ length: 9 }, (_, index) => letterAt(start + step * index));
  const terms = Array.from({ length: 8 }, (_, index) =>
    stream.slice(0, index + 2).join(""),
  );
  return {
    terms,
    parameterKey: `${start}|${step}|${stream.join("")}`,
    rule: `Keep the existing group and add the next letter of the same letter sequence at the end.`,
    steps: terms.slice(0, -1).map((term, index) =>
      `${term} + ${stream[index + 2]} = ${terms[index + 1]}`,
    ),
    quickMethod: `Compare two neighbouring groups; the longer one should contain the shorter one unchanged at the beginning.`,
    commonMistake: `Do not replace the old letters. Only one new letter is added at the end.`,
    trapCode: "OLD_PREFIX_CHANGED",
  };
}

function generateSymmetricGrowth(next: () => number): GeneratedWaveBFamily {
  const leftStart = integer(next, 0, 25);
  const rightStart = integer(next, 0, 25);
  const leftStep = nonZero(next, -4, 4);
  let rightStep = nonZero(next, -4, 4);
  if (rightStep === leftStep) rightStep = rightStep > 0 ? -1 : 1;
  const core = letterAt(integer(next, 0, 25)) + letterAt(integer(next, 0, 25));
  const terms: string[] = [core];
  let current = core;
  for (let index = 0; index < 7; index += 1) {
    const left = letterAt(leftStart + leftStep * index);
    const right = letterAt(rightStart + rightStep * index);
    current = left + current + right;
    terms.push(current);
  }
  return {
    terms,
    parameterKey: `${core}|${leftStart}:${leftStep}|${rightStart}:${rightStep}`,
    rule: `Keep the middle group unchanged and add one new letter to each side at every step.`,
    steps: terms.slice(0, -1).map((term, index) =>
      `${terms[index + 1]![0]} + ${term} + ${terms[index + 1]!.at(-1)} = ${terms[index + 1]}`,
    ),
    quickMethod: `Remove the first and last letters of a longer group; the previous group should remain in the middle.`,
    commonMistake: `Do not rearrange the middle letters. Only the two new edge letters are added.`,
    trapCode: "MIDDLE_GROUP_REARRANGED",
  };
}

function buildBlock(next: () => number, width: number, direction: number): string {
  const start = integer(next, 0, 25);
  const step = integer(next, 1, 5) * direction;
  return Array.from({ length: width }, (_, index) => letterAt(start + step * index)).join("");
}

function chooseGapGroups(
  next: () => number,
  length: number,
): readonly (readonly number[])[] {
  const groupCount = integer(next, 2, 3);
  const groups: number[][] = [];
  const occupied = new Set<number>();
  let attempts = 0;
  while (groups.length < groupCount && attempts < 500) {
    attempts += 1;
    const groupLength = integer(next, 1, 3);
    const start = integer(next, 1, length - groupLength - 1);
    const indexes = Array.from({ length: groupLength }, (_, index) => start + index);
    if (indexes.some((index) => occupied.has(index))) continue;
    indexes.forEach((index) => occupied.add(index));
    groups.push(indexes);
  }
  if (groups.length !== groupCount) throw new Error("Unable to place distinct gap groups.");
  return groups.sort((a, b) => a[0]! - b[0]!);
}

function maskGroups(
  fullText: string,
  groups: readonly (readonly number[])[],
): string {
  const hidden = new Set(groups.flat());
  return [...fullText]
    .map((letter, index) => (hidden.has(index) ? "_" : letter))
    .join(" ");
}

function answerGroupsFor(
  fullText: string,
  groups: readonly (readonly number[])[],
): readonly string[] {
  return groups.map((group) => group.map((index) => fullText[index]).join(""));
}

function generateRepeatedMultiGap(next: () => number): GeneratedWaveBFamily {
  const width = integer(next, 2, 4);
  const block = buildBlock(next, width, 1);
  const repeats = integer(next, 5, 7);
  const fullText = block.repeat(repeats);
  const gapGroups = chooseGapGroups(next, fullText.length);
  const answerGroups = answerGroupsFor(fullText, gapGroups);
  return {
    terms: [fullText],
    fullText,
    maskedText: maskGroups(fullText, gapGroups),
    gapGroups,
    answerGroups,
    parameterKey: `${block}|${repeats}|${gapGroups.map((group) => group.join(".")).join("|")}`,
    rule: `The same block, ${block}, repeats throughout the line. Fill each visible gap group from left to right.`,
    steps: [
      `Complete line: ${Array.from({ length: repeats }, () => block).join(" / ")}`,
      `Missing groups: ${answerGroups.join(", ")}`,
    ],
    quickMethod: `Mark the repeated block boundaries, then read each blank group from left to right.`,
    commonMistake: `Do not join separated blank groups into the wrong order.`,
    trapCode: "GAP_GROUP_ORDER_CHANGED",
  };
}

function generateAlternatingMultiGap(next: () => number): GeneratedWaveBFamily {
  const width = integer(next, 2, 4);
  const first = buildBlock(next, width, 1);
  let second = buildBlock(next, width, -1);
  if (second === first) second = shiftToken(second, 1);
  const pairs = integer(next, 3, 5);
  const blocks = Array.from({ length: pairs * 2 }, (_, index) =>
    index % 2 === 0 ? first : second,
  );
  const fullText = blocks.join("");
  const gapGroups = chooseGapGroups(next, fullText.length);
  const answerGroups = answerGroupsFor(fullText, gapGroups);
  return {
    terms: [fullText],
    fullText,
    maskedText: maskGroups(fullText, gapGroups),
    gapGroups,
    answerGroups,
    parameterKey: `${first}|${second}|${pairs}|${gapGroups.map((group) => group.join(".")).join("|")}`,
    rule: `Two blocks repeat in turn: ${first}, ${second}, ${first}, ${second}... Fill the visible gap groups in order.`,
    steps: [
      `Complete line: ${blocks.join(" / ")}`,
      `Missing groups: ${answerGroups.join(", ")}`,
    ],
    quickMethod: `Split the line into equal blocks and compare odd and even block positions.`,
    commonMistake: `Do not treat the two alternating blocks as one identical block.`,
    trapCode: "ALTERNATING_BLOCKS_MERGED",
  };
}

function generateFamily(
  sourceRuleId: SerCp007WaveBSourceRuleId,
  seed: number,
): GeneratedWaveBFamily {
  const index = SER_CP007_WAVE_B_SOURCE_RULE_IDS.indexOf(sourceRuleId);
  const next = createPrng(seed * 3571 + index * 104729 + 29);
  switch (sourceRuleId) {
    case "PAIRED_EDGE_SHIFTS":
      return generatePairedEdgeShifts(next);
    case "FIXED_OUTER_FRAME_CORE_SHIFT":
      return generateFixedFrameCoreShift(next);
    case "ALTERNATING_FRAME_CORE_ROWS":
      return generateAlternatingFrameRows(next);
    case "GROWING_CONSECUTIVE_BLOCKS":
      return generateGrowingBlocks(next);
    case "CUMULATIVE_PREFIX_GROWTH":
      return generatePrefixGrowth(next);
    case "SYMMETRIC_EDGE_GROWTH":
      return generateSymmetricGrowth(next);
    case "REPEATED_BLOCK_MULTI_GAP_GROUPS":
      return generateRepeatedMultiGap(next);
    case "ALTERNATING_BLOCK_MULTI_GAP_GROUPS":
      return generateAlternatingMultiGap(next);
  }
}

function templateFor(
  temporaryTemplateId: SerCp007WaveBTemporaryTemplateId,
): SerCp007WaveBTemplate {
  const template = SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) throw new Error(`Unknown Wave B template ${temporaryTemplateId}`);
  return template;
}

function optionCandidates(correctAnswer: string, seed: number): readonly string[] {
  const candidates = [
    correctAnswer,
    mutateLetters(correctAnswer, seed),
    shiftToken(correctAnswer, 1),
    shiftToken(correctAnswer, -1),
    reverseLetters(correctAnswer),
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
    .filter((candidate) => candidate !== correctAnswer)
    .slice(0, 3);
  const options = [...distractors];
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function stemForTermTask(
  taskKind: Exclude<SerCp007WaveBTaskKind, "FILL_GAP_GROUPS">,
  sequence: readonly (string | null)[],
): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the given series?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrectly placed group?\n${rendered}`;
  }
}

export interface SerCp007WaveBQuestion {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-007";
  readonly waveId: "SER-CP-007-WAVE-B";
  readonly temporaryTemplateId: SerCp007WaveBTemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp007WaveBSourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveBAuthorityId;
  readonly ownershipDisposition: SerCp007WaveBOwnershipDisposition;
  readonly taskKind: SerCp007WaveBTaskKind;
  readonly solveMode: "INFER_RICH_CLUSTER_GRAMMAR";
  readonly language: "en-IN";
  readonly difficulty: SerCp007WaveBDifficulty;
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
    readonly gapGroups: readonly (readonly number[])[];
    readonly answerGroups: readonly string[];
  };
  readonly ownershipBoundary: {
    readonly minimumTermWidth: 2;
    readonly autonomousSequence: true;
    readonly explicitInputOutputMapping: false;
    readonly pairRelationTransfer: false;
    readonly classifyIndependentOptions: false;
  };
  readonly lifecycleLocks: {
    readonly questionStudioVisible: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
    readonly localizationStarted: false;
  };
}

export function generateSerCp007WaveBQuestion(
  temporaryTemplateId: SerCp007WaveBTemporaryTemplateId,
  seed: number,
): SerCp007WaveBQuestion {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS.indexOf(
    temporaryTemplateId,
  );
  const family = generateFamily(template.sourceRuleId, seed);
  const correctIndex = (seed + templateIndex) % 4;

  let stem: string;
  let sequence: readonly (string | null)[];
  let correctAnswer: string;
  let answerIndex: number | null = null;
  let corruptedIndex: number | null = null;
  let displayedWrongTerm: string | null = null;
  let conclusion: string;

  if (template.taskKind === "FILL_GAP_GROUPS") {
    if (!family.maskedText || !family.answerGroups || !family.fullText) {
      throw new Error("Multi-gap family is incomplete.");
    }
    correctAnswer = family.answerGroups.join(", ");
    sequence = [family.maskedText];
    stem = `Which groups of letters should fill the blanks from left to right?\n${family.maskedText}`;
    conclusion = `The missing groups, from left to right, are ${correctAnswer}.`;
  } else {
    const terms = family.terms;
    switch (template.taskKind) {
      case "NEXT_TERM":
        sequence = terms.slice(0, 7);
        answerIndex = 7;
        correctAnswer = terms[7]!;
        break;
      case "MISSING_TERM": {
        answerIndex = 2 + ((seed + templateIndex) % 4);
        sequence = terms.slice(0, 7).map((term, index) =>
          index === answerIndex ? null : term,
        );
        correctAnswer = terms[answerIndex]!;
        break;
      }
      case "PREVIOUS_TERM":
        sequence = terms.slice(1, 8);
        answerIndex = 0;
        correctAnswer = terms[0]!;
        break;
      case "WRONG_TERM": {
        corruptedIndex = 2 + ((seed + templateIndex) % 4);
        const displayed = [...terms.slice(0, 7)];
        displayedWrongTerm = mutateLetters(
          displayed[corruptedIndex]!,
          seed + templateIndex,
        );
        displayed[corruptedIndex] = displayedWrongTerm;
        sequence = displayed;
        answerIndex = corruptedIndex;
        correctAnswer = terms[corruptedIndex]!;
        break;
      }
    }
    stem = stemForTermTask(template.taskKind, sequence);
    conclusion =
      template.taskKind === "WRONG_TERM"
        ? `${displayedWrongTerm} is wrong at that place. It should be ${correctAnswer}.`
        : `Therefore, the answer is ${correctAnswer}.`;
  }

  const steps =
    template.taskKind === "WRONG_TERM"
      ? [
          `First write the correct series: ${family.terms.slice(0, 7).join(", ")}.`,
          ...family.steps.slice(0, 4),
        ]
      : template.taskKind === "PREVIOUS_TERM"
        ? [
            `First check the shown groups: ${family.terms.slice(1, 5).join(", ")}.`,
            `Now move one step backward using the same rule.`,
            ...family.steps.slice(0, 3),
          ]
        : family.steps;

  return {
    questionId: `${temporaryTemplateId}-${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-007",
    waveId: "SER-CP-007-WAVE-B",
    temporaryTemplateId,
    permanentQlId: null,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    solveMode: "INFER_RICH_CLUSTER_GRAMMAR",
    language: "en-IN",
    difficulty: (["EASY", "MEDIUM", "HARD"] as const)[
      (seed + templateIndex) % 3
    ]!,
    seed,
    stem,
    sequence,
    options: buildOptions(correctAnswer, seed + templateIndex * 31, correctIndex),
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: [
      template.canonicalAuthorityId,
      family.parameterKey,
      template.taskKind,
      answerIndex ?? "gap-groups",
      corruptedIndex ?? "clean",
    ].join("|"),
    explanation: {
      rule: family.rule,
      steps,
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
      gapGroups: family.gapGroups ?? [],
      answerGroups: family.answerGroups ?? [],
    },
    ownershipBoundary: {
      minimumTermWidth: 2,
      autonomousSequence: true,
      explicitInputOutputMapping: false,
      pairRelationTransfer: false,
      classifyIndependentOptions: false,
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

export const SER_CP007_WAVE_B_OPTION_LABELS = ["1", "2", "3", "4"] as const;

export function renderSerCp007WaveBReview(
  question: SerCp007WaveBQuestion,
): string {
  const optionLines = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${SER_CP007_WAVE_B_OPTION_LABELS[index]}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${SER_CP007_WAVE_B_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
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
