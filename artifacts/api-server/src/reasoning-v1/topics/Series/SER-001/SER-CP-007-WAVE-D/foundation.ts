export const SER_CP007_WAVE_D_SOURCE_RULE_IDS = [
  "PAIRWISE_ADJACENT_SWAP_PERMUTATION",
  "FULL_REVERSAL_PERMUTATION",
  "ODD_EVEN_POSITION_REORDERING",
  "ALPHABET_COMPLEMENT_CLUSTER",
  "ALPHABET_COMPLEMENT_WITH_ROTATION",
  "CENTER_INSERTION_GROWTH",
  "ALTERNATING_INTERIOR_INSERTION_GROWTH",
  "FOUR_INTERLEAVED_CLUSTER_ROWS",
] as const;

export type SerCp007WaveDSourceRuleId =
  (typeof SER_CP007_WAVE_D_SOURCE_RULE_IDS)[number];

export const SER_CP007_WAVE_D_AUTHORITY_IDS = [
  "FIXED_POSITION_PERMUTATION_CLUSTER",
  "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  "PATTERNED_INTERIOR_INSERTION_GROWTH",
  "K_INTERLEAVED_CLUSTER_SERIES",
] as const;

export type SerCp007WaveDAuthorityId =
  (typeof SER_CP007_WAVE_D_AUTHORITY_IDS)[number];

export type SerCp007WaveDTaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerCp007WaveDDisposition =
  | "PROVISIONAL_RETAIN_CP007"
  | "COLLIDE_EXISTING_CP007_AUTHORITY";

export type SerCp007WaveDTemporaryTemplateId = `SER-CP-007-WD-TMP-${string}`;
export type SerCp007WaveDDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp007WaveDTemplate {
  readonly temporaryTemplateId: SerCp007WaveDTemporaryTemplateId;
  readonly sourceRuleId: SerCp007WaveDSourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveDAuthorityId;
  readonly ownershipDisposition: SerCp007WaveDDisposition;
  readonly taskKind: SerCp007WaveDTaskKind;
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const satisfies readonly SerCp007WaveDTaskKind[];

function ownershipFor(
  sourceRuleId: SerCp007WaveDSourceRuleId,
): Pick<
  SerCp007WaveDTemplate,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (sourceRuleId) {
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
    case "FULL_REVERSAL_PERMUTATION":
    case "ODD_EVEN_POSITION_REORDERING":
      return {
        canonicalAuthorityId: "FIXED_POSITION_PERMUTATION_CLUSTER",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "ALPHABET_COMPLEMENT_CLUSTER":
    case "ALPHABET_COMPLEMENT_WITH_ROTATION":
      return {
        canonicalAuthorityId: "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "CENTER_INSERTION_GROWTH":
    case "ALTERNATING_INTERIOR_INSERTION_GROWTH":
      return {
        canonicalAuthorityId: "PATTERNED_INTERIOR_INSERTION_GROWTH",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "FOUR_INTERLEAVED_CLUSTER_ROWS":
      return {
        canonicalAuthorityId: "K_INTERLEAVED_CLUSTER_SERIES",
        ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
      };
  }
}

const templateRows: Omit<SerCp007WaveDTemplate, "temporaryTemplateId">[] = [];
for (const sourceRuleId of SER_CP007_WAVE_D_SOURCE_RULE_IDS) {
  for (const taskKind of TASKS) {
    templateRows.push({ sourceRuleId, taskKind, ...ownershipFor(sourceRuleId) });
  }
}

export const SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS = templateRows.map(
  (_, index) =>
    `SER-CP-007-WD-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp007WaveDTemporaryTemplateId[];

export const SER_CP007_WAVE_D_TEMPORARY_TEMPLATES: readonly SerCp007WaveDTemplate[] =
  templateRows.map((row, index) => ({
    temporaryTemplateId: SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS[index]!,
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

function uniqueToken(next: () => number, width: number): string {
  const letters = new Set<string>();
  while (letters.size < width) letters.add(letterAt(integer(next, 0, 25)));
  return [...letters].join("");
}

function applyPermutation(token: string, order: readonly number[]): string {
  return order.map((index) => token[index]).join("");
}

function rotateLeft(token: string, amount: number): string {
  const safe = mod(amount, token.length);
  return token.slice(safe) + token.slice(0, safe);
}

function complementToken(token: string): string {
  return [...token].map((letter) => letterAt(25 - positionOf(letter))).join("");
}

function insertAt(token: string, index: number, letter: string): string {
  return token.slice(0, index) + letter + token.slice(index);
}

function mutateToken(token: string, seed: number): string {
  const letters = [...token];
  const index = seed % letters.length;
  letters[index] = letterAt(positionOf(letters[index]!) + 1 + (seed % 3));
  return letters.join("");
}

function shiftToken(token: string, amount: number): string {
  return [...token]
    .map((letter) => letterAt(positionOf(letter) + amount))
    .join("");
}

interface GeneratedFamily {
  readonly terms: readonly string[];
  readonly parameterKey: string;
  readonly rule: string;
  readonly steps: readonly string[];
  readonly quickMethod: string;
  readonly commonMistake: string;
  readonly trapCode: string;
  readonly permutationOrder: readonly number[];
  readonly rotationAmount: number;
  readonly insertionIndexes: readonly number[];
  readonly insertedLetters: readonly string[];
  readonly rowCount: number;
}

function permutationTerms(
  base: string,
  order: readonly number[],
  count = 8,
): readonly string[] {
  const terms = [base];
  for (let index = 1; index < count; index += 1) {
    terms.push(applyPermutation(terms[index - 1]!, order));
  }
  return terms;
}

function generatePairSwap(next: () => number): GeneratedFamily {
  const width = next() < 0.5 ? 4 : 6;
  const base = uniqueToken(next, width);
  const order = Array.from({ length: width }, (_, index) =>
    index % 2 === 0 ? index + 1 : index - 1,
  );
  const terms = permutationTerms(base, order);
  return {
    terms,
    parameterKey: `${base}|${order.join(".")}`,
    rule: `Swap the 1st and 2nd letters, the 3rd and 4th letters, and so on. Repeat the same swaps each time.`,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod: `Divide the group into pairs and reverse each pair.`,
    commonMistake: `Do not reverse the whole group. Only each neighbouring pair changes places.`,
    trapCode: "WHOLE_GROUP_REVERSED",
    permutationOrder: order,
    rotationAmount: 0,
    insertionIndexes: [],
    insertedLetters: [],
    rowCount: 0,
  };
}

function generateReversal(next: () => number): GeneratedFamily {
  const width = integer(next, 3, 7);
  const base = uniqueToken(next, width);
  const order = Array.from({ length: width }, (_, index) => width - 1 - index);
  const terms = permutationTerms(base, order);
  return {
    terms,
    parameterKey: `${base}|${order.join(".")}`,
    rule: `Reverse the order of all letters in the group at every step.`,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod: `Read the current group from right to left.`,
    commonMistake: `Do not change the letters themselves; only their order is reversed.`,
    trapCode: "LETTERS_SHIFTED_INSTEAD_OF_REVERSED",
    permutationOrder: order,
    rotationAmount: 0,
    insertionIndexes: [],
    insertedLetters: [],
    rowCount: 0,
  };
}

function generateOddEvenReorder(next: () => number): GeneratedFamily {
  const width = integer(next, 5, 8);
  const base = uniqueToken(next, width);
  const oddIndexes = Array.from({ length: width }, (_, index) => index).filter(
    (index) => index % 2 === 0,
  );
  const evenIndexes = Array.from({ length: width }, (_, index) => index).filter(
    (index) => index % 2 === 1,
  );
  const order = [...oddIndexes, ...evenIndexes];
  const terms = permutationTerms(base, order);
  return {
    terms,
    parameterKey: `${base}|${order.join(".")}`,
    rule: `Write the letters from odd positions first, then the letters from even positions. Apply the same order again to the new group.`,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod: `Mark positions 1, 3, 5... and then 2, 4, 6...`,
    commonMistake: `Do not separate odd and even alphabet letters. Use their positions inside the group.`,
    trapCode: "ALPHABET_PARITY_USED",
    permutationOrder: order,
    rotationAmount: 0,
    insertionIndexes: [],
    insertedLetters: [],
    rowCount: 0,
  };
}

function generateComplement(next: () => number, withRotation: boolean): GeneratedFamily {
  const width = integer(next, 3, 7);
  const base = uniqueToken(next, width);
  const rotation = withRotation ? integer(next, 1, width - 1) : 0;
  const terms = [base];
  for (let index = 1; index < 8; index += 1) {
    const complemented = complementToken(terms[index - 1]!);
    terms.push(rotation === 0 ? complemented : rotateLeft(complemented, rotation));
  }
  return {
    terms,
    parameterKey: `${base}|complement|rotation:${rotation}`,
    rule:
      rotation === 0
        ? `Replace each letter with its opposite letter: A with Z, B with Y, C with X, and so on.`
        : `First replace every letter with its opposite letter, then move the first ${rotation} letter${rotation === 1 ? "" : "s"} to the end.`,
    steps: terms.slice(0, -1).map((term, index) => `${term} → ${terms[index + 1]}`),
    quickMethod:
      rotation === 0
        ? `Use opposite alphabet pairs such as A–Z, B–Y and C–X.`
        : `Find the opposite letters first; change their order only after that.`,
    commonMistake:
      rotation === 0
        ? `Do not treat opposite letters as a fixed forward jump.`
        : `Do not rotate before finding the opposite letters.`,
    trapCode:
      rotation === 0
        ? "COMPLEMENT_MISTAKEN_FOR_SHIFT"
        : "ROTATION_APPLIED_BEFORE_COMPLEMENT",
    permutationOrder: [],
    rotationAmount: rotation,
    insertionIndexes: [],
    insertedLetters: [],
    rowCount: 0,
  };
}

function generateInsertion(next: () => number, alternating: boolean): GeneratedFamily {
  const core = uniqueToken(next, integer(next, 2, 3));
  const insertedLetters = Array.from({ length: 7 }, () => letterAt(integer(next, 0, 25)));
  const insertionIndexes: number[] = [];
  const terms = [core];
  for (let step = 0; step < 7; step += 1) {
    const current = terms[step]!;
    const centre = Math.floor(current.length / 2);
    const insertionIndex = alternating
      ? step % 2 === 0
        ? Math.max(1, centre - 1)
        : Math.min(current.length - 1, centre + 1)
      : centre;
    insertionIndexes.push(insertionIndex);
    terms.push(insertAt(current, insertionIndex, insertedLetters[step]!));
  }
  return {
    terms,
    parameterKey: `${core}|${insertedLetters.join("")}|${insertionIndexes.join(".")}`,
    rule: alternating
      ? `Keep the existing letters in order. Insert one new letter just left of the centre, then just right of the centre, and repeat.`
      : `Keep the existing letters in order and insert one new letter in the centre at every step.`,
    steps: terms.slice(0, -1).map((term, index) =>
      `${term} + insert ${insertedLetters[index]} at place ${insertionIndexes[index]! + 1} = ${terms[index + 1]}`,
    ),
    quickMethod: `Remove the newly inserted letter; the previous group must remain in the same order.`,
    commonMistake: `Do not rearrange the old letters while inserting the new one.`,
    trapCode: "OLD_LETTERS_REARRANGED",
    permutationOrder: [],
    rotationAmount: 0,
    insertionIndexes,
    insertedLetters,
    rowCount: 0,
  };
}

function generateFourRows(next: () => number): GeneratedFamily {
  const width = integer(next, 2, 4);
  const starts = Array.from({ length: 4 }, () =>
    Array.from({ length: width }, () => integer(next, 0, 25)),
  );
  const shifts = Array.from({ length: 4 }, () =>
    Array.from({ length: width }, () => nonZero(next, -4, 4)),
  );
  const terms = Array.from({ length: 16 }, (_, index) => {
    const row = index % 4;
    const rowIndex = Math.floor(index / 4);
    return starts[row]!
      .map((start, column) => letterAt(start + shifts[row]![column]! * rowIndex))
      .join("");
  });
  return {
    terms,
    parameterKey: starts
      .map((rowStarts, row) => `${rowStarts.join(".")}:${shifts[row]!.join(".")}`)
      .join("|"),
    rule: `Put positions 1, 5, 9... in the first row; 2, 6, 10... in the second; 3, 7, 11... in the third; and 4, 8, 12... in the fourth. Continue the required row.`,
    steps: [0, 1, 2, 3].map(
      (row) =>
        `Row ${row + 1}: ${terms.filter((_, index) => index % 4 === row).join(" → ")}`,
    ),
    quickMethod: `Number the groups 1 to 4 repeatedly before comparing them.`,
    commonMistake: `Do not compare neighbouring groups; they belong to four separate rows.`,
    trapCode: "FOUR_ROWS_MIXED",
    permutationOrder: [],
    rotationAmount: 0,
    insertionIndexes: [],
    insertedLetters: [],
    rowCount: 4,
  };
}

function generateFamily(
  sourceRuleId: SerCp007WaveDSourceRuleId,
  seed: number,
): GeneratedFamily {
  const sourceIndex = SER_CP007_WAVE_D_SOURCE_RULE_IDS.indexOf(sourceRuleId);
  const next = createPrng(seed * 8191 + sourceIndex * 131071 + 97);
  switch (sourceRuleId) {
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return generatePairSwap(next);
    case "FULL_REVERSAL_PERMUTATION":
      return generateReversal(next);
    case "ODD_EVEN_POSITION_REORDERING":
      return generateOddEvenReorder(next);
    case "ALPHABET_COMPLEMENT_CLUSTER":
      return generateComplement(next, false);
    case "ALPHABET_COMPLEMENT_WITH_ROTATION":
      return generateComplement(next, true);
    case "CENTER_INSERTION_GROWTH":
      return generateInsertion(next, false);
    case "ALTERNATING_INTERIOR_INSERTION_GROWTH":
      return generateInsertion(next, true);
    case "FOUR_INTERLEAVED_CLUSTER_ROWS":
      return generateFourRows(next);
  }
}

function templateFor(
  temporaryTemplateId: SerCp007WaveDTemporaryTemplateId,
): SerCp007WaveDTemplate {
  const template = SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) throw new Error(`Unknown Wave D template ${temporaryTemplateId}`);
  return template;
}

function optionCandidates(correctAnswer: string, seed: number): readonly string[] {
  const candidates = [
    correctAnswer,
    mutateToken(correctAnswer, seed),
    shiftToken(correctAnswer, 1),
    shiftToken(correctAnswer, -1),
    [...correctAnswer].reverse().join(""),
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

function stemFor(
  taskKind: SerCp007WaveDTaskKind,
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

export interface SerCp007WaveDQuestion {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-007";
  readonly waveId: "SER-CP-007-WAVE-D";
  readonly temporaryTemplateId: SerCp007WaveDTemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp007WaveDSourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveDAuthorityId;
  readonly ownershipDisposition: SerCp007WaveDDisposition;
  readonly taskKind: SerCp007WaveDTaskKind;
  readonly solveMode: "INFER_PERMUTATION_COMPLEMENT_INSERTION_OR_K_ROW";
  readonly language: "en-IN";
  readonly difficulty: SerCp007WaveDDifficulty;
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
    readonly answerIndex: number;
    readonly corruptedIndex: number | null;
    readonly displayedWrongTerm: string | null;
    readonly permutationOrder: readonly number[];
    readonly rotationAmount: number;
    readonly insertionIndexes: readonly number[];
    readonly insertedLetters: readonly string[];
    readonly rowCount: number;
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

export function generateSerCp007WaveDQuestion(
  temporaryTemplateId: SerCp007WaveDTemporaryTemplateId,
  seed: number,
): SerCp007WaveDQuestion {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS.indexOf(
    temporaryTemplateId,
  );
  const family = generateFamily(template.sourceRuleId, seed);
  const terms = family.terms;
  const displayLength = terms.length - 1;
  const correctIndex = (seed + templateIndex) % 4;

  let sequence: readonly (string | null)[];
  let answerIndex: number;
  let corruptedIndex: number | null = null;
  let displayedWrongTerm: string | null = null;

  switch (template.taskKind) {
    case "NEXT_TERM":
      sequence = terms.slice(0, displayLength);
      answerIndex = displayLength;
      break;
    case "MISSING_TERM": {
      answerIndex = 2 + ((seed + templateIndex) % Math.max(2, displayLength - 4));
      sequence = terms.slice(0, displayLength).map((term, index) =>
        index === answerIndex ? null : term,
      );
      break;
    }
    case "PREVIOUS_TERM":
      sequence = terms.slice(1);
      answerIndex = 0;
      break;
    case "WRONG_TERM": {
      corruptedIndex = 2 + ((seed + templateIndex) % Math.max(2, displayLength - 4));
      const displayed = [...terms.slice(0, displayLength)];
      displayedWrongTerm = mutateToken(displayed[corruptedIndex]!, seed + templateIndex);
      displayed[corruptedIndex] = displayedWrongTerm;
      sequence = displayed;
      answerIndex = corruptedIndex;
      break;
    }
  }

  const correctAnswer = terms[answerIndex]!;
  const steps =
    template.taskKind === "WRONG_TERM"
      ? [
          `First write the correct series: ${terms.slice(0, displayLength).join(", ")}.`,
          ...family.steps.slice(0, 5),
        ]
      : template.taskKind === "PREVIOUS_TERM"
        ? [
            `First check the shown groups: ${terms.slice(1, Math.min(7, terms.length)).join(", ")}.`,
            `Now move one step backward using the same rule.`,
            ...family.steps.slice(0, 4),
          ]
        : family.steps;
  const conclusion =
    template.taskKind === "WRONG_TERM"
      ? `${displayedWrongTerm} is wrong at that place. It should be ${correctAnswer}.`
      : `Therefore, the answer is ${correctAnswer}.`;

  return {
    questionId: `${temporaryTemplateId}-${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-007",
    waveId: "SER-CP-007-WAVE-D",
    temporaryTemplateId,
    permanentQlId: null,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    solveMode: "INFER_PERMUTATION_COMPLEMENT_INSERTION_OR_K_ROW",
    language: "en-IN",
    difficulty: (["EASY", "MEDIUM", "HARD"] as const)[
      (seed + templateIndex) % 3
    ]!,
    seed,
    stem: stemFor(template.taskKind, sequence),
    sequence,
    options: buildOptions(correctAnswer, seed + templateIndex * 59, correctIndex),
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: [
      template.canonicalAuthorityId,
      family.parameterKey,
      template.taskKind,
      answerIndex,
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
      canonicalTerms: terms,
      answerIndex,
      corruptedIndex,
      displayedWrongTerm,
      permutationOrder: family.permutationOrder,
      rotationAmount: family.rotationAmount,
      insertionIndexes: family.insertionIndexes,
      insertedLetters: family.insertedLetters,
      rowCount: family.rowCount,
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

export const SER_CP007_WAVE_D_OPTION_LABELS = ["1", "2", "3", "4"] as const;

export function renderSerCp007WaveDReview(
  question: SerCp007WaveDQuestion,
): string {
  const options = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${SER_CP007_WAVE_D_OPTION_LABELS[index]}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...options,
    "",
    `**Answer:** ${SER_CP007_WAVE_D_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
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
