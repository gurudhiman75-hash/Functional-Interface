import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
  type SerCp007Question,
  type SerCp007SourceRuleId,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
  type SerCp007WaveBQuestion,
  type SerCp007WaveBSourceRuleId,
} from "../SER-CP-007-WAVE-B/foundation-expanded";

export const SER_CP007_WAVE_C_SOURCE_RULE_IDS = [
  "THREE_INTERLEAVED_CLUSTER_ROWS",
  "NEXT_TWO_COLUMNWISE_FIXED",
  "NEXT_TWO_INTERLEAVED_ROWS",
  "NEXT_TWO_ROTATION",
  "NEXT_TWO_EDGE_DELETION",
  "MISSING_TWO_COLUMNWISE_FIXED",
  "WRONG_WITH_REPLACEMENT_PAIR",
  "NEXT_TWO_GROWING_CLUSTER",
  "NEXT_TWO_SYMMETRIC_GROWTH",
] as const;

export type SerCp007WaveCSourceRuleId =
  (typeof SER_CP007_WAVE_C_SOURCE_RULE_IDS)[number];

export const SER_CP007_WAVE_C_AUTHORITY_IDS = [
  "K_INTERLEAVED_CLUSTER_SERIES",
  "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  "TWO_INTERLEAVED_CLUSTER_SERIES",
  "CYCLIC_CLUSTER_PERMUTATION",
  "EDGE_DELETION_WORD_SEQUENCE",
  "GROWING_CONSECUTIVE_CLUSTER",
  "SYMMETRIC_EDGE_GROWTH",
] as const;

export type SerCp007WaveCAuthorityId =
  (typeof SER_CP007_WAVE_C_AUTHORITY_IDS)[number];

export const SER_CP007_WAVE_C_EXCLUDED_SURFACES = [
  {
    surfaceId: "MATCHING_SERIES_OPTION_SET",
    owner: "CLS-001",
    reason: "The task classifies independent option series rather than continuing one sequence.",
  },
  {
    surfaceId: "EXPLICIT_INPUT_OUTPUT_CLUSTER_TRANSFORM",
    owner: "COD-001",
    reason: "A supplied group is transformed into an output code.",
  },
  {
    surfaceId: "CLUSTER_PAIR_RELATION_TRANSFER",
    owner: "ANA-001",
    reason: "A relation from one completed pair is transferred to another pair.",
  },
  {
    surfaceId: "WIDTH_ONE_MULTI_ANSWER_SERIES",
    owner: "SER-CP-006",
    reason: "Every sequence term is a single letter.",
  },
] as const;

export type SerCp007WaveCTaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM"
  | "NEXT_TWO_TERMS"
  | "MISSING_TWO_TERMS"
  | "WRONG_AND_REPLACEMENT";

export type SerCp007WaveCAnswerSemantic =
  | "SINGLE_CLUSTER"
  | "TWO_CLUSTER_LIST"
  | "WRONG_TO_CORRECT_PAIR";

export type SerCp007WaveCDisposition =
  | "COLLIDE_EXISTING_CP007_AUTHORITY"
  | "PROVISIONAL_RETAIN_CP007";

export type SerCp007WaveCTemporaryTemplateId = `SER-CP-007-WC-TMP-${string}`;
export type SerCp007WaveCDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp007WaveCTemplate {
  readonly temporaryTemplateId: SerCp007WaveCTemporaryTemplateId;
  readonly sourceRuleId: SerCp007WaveCSourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveCAuthorityId;
  readonly ownershipDisposition: SerCp007WaveCDisposition;
  readonly taskKind: SerCp007WaveCTaskKind;
  readonly answerSemantic: SerCp007WaveCAnswerSemantic;
}

const templateRows: Omit<SerCp007WaveCTemplate, "temporaryTemplateId">[] = [
  ...(["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const).map(
    (taskKind) => ({
      sourceRuleId: "THREE_INTERLEAVED_CLUSTER_ROWS" as const,
      canonicalAuthorityId: "K_INTERLEAVED_CLUSTER_SERIES" as const,
      ownershipDisposition: "PROVISIONAL_RETAIN_CP007" as const,
      taskKind,
      answerSemantic: "SINGLE_CLUSTER" as const,
    }),
  ),
  {
    sourceRuleId: "NEXT_TWO_COLUMNWISE_FIXED",
    canonicalAuthorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "NEXT_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
  {
    sourceRuleId: "NEXT_TWO_INTERLEAVED_ROWS",
    canonicalAuthorityId: "TWO_INTERLEAVED_CLUSTER_SERIES",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "NEXT_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
  {
    sourceRuleId: "NEXT_TWO_ROTATION",
    canonicalAuthorityId: "CYCLIC_CLUSTER_PERMUTATION",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "NEXT_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
  {
    sourceRuleId: "NEXT_TWO_EDGE_DELETION",
    canonicalAuthorityId: "EDGE_DELETION_WORD_SEQUENCE",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "NEXT_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
  {
    sourceRuleId: "MISSING_TWO_COLUMNWISE_FIXED",
    canonicalAuthorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "MISSING_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
  {
    sourceRuleId: "WRONG_WITH_REPLACEMENT_PAIR",
    canonicalAuthorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "WRONG_AND_REPLACEMENT",
    answerSemantic: "WRONG_TO_CORRECT_PAIR",
  },
  {
    sourceRuleId: "NEXT_TWO_GROWING_CLUSTER",
    canonicalAuthorityId: "GROWING_CONSECUTIVE_CLUSTER",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "NEXT_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
  {
    sourceRuleId: "NEXT_TWO_SYMMETRIC_GROWTH",
    canonicalAuthorityId: "SYMMETRIC_EDGE_GROWTH",
    ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
    taskKind: "NEXT_TWO_TERMS",
    answerSemantic: "TWO_CLUSTER_LIST",
  },
];

export const SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS = templateRows.map(
  (_, index) =>
    `SER-CP-007-WC-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp007WaveCTemporaryTemplateId[];

export const SER_CP007_WAVE_C_TEMPORARY_TEMPLATES: readonly SerCp007WaveCTemplate[] =
  templateRows.map((row, index) => ({
    temporaryTemplateId: SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS[index]!,
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

function mutateLetters(value: string, seed: number): string {
  const output = [...value];
  const indexes = output
    .map((character, index) => (/[A-Z]/.test(character) ? index : -1))
    .filter((index) => index >= 0);
  const selected = indexes[seed % indexes.length]!;
  output[selected] = letterAt(positionOf(output[selected]!) + 1 + (seed % 3));
  return output.join("");
}

function shiftLetters(value: string, amount: number): string {
  return [...value]
    .map((character) =>
      /[A-Z]/.test(character)
        ? letterAt(positionOf(character) + amount)
        : character,
    )
    .join("");
}

function reverseLetters(value: string): string {
  const letters = [...value].filter((character) => /[A-Z]/.test(character)).reverse();
  let cursor = 0;
  return [...value]
    .map((character) => (/[A-Z]/.test(character) ? letters[cursor++]! : character))
    .join("");
}

function templateFor(
  temporaryTemplateId: SerCp007WaveCTemporaryTemplateId,
): SerCp007WaveCTemplate {
  const template = SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) throw new Error(`Unknown Wave C template ${temporaryTemplateId}`);
  return template;
}

interface FamilyEvidence {
  readonly terms: readonly string[];
  readonly parameterKey: string;
  readonly rule: string;
  readonly steps: readonly string[];
  readonly quickMethod: string;
  readonly commonMistake: string;
  readonly trapCode: string;
}

function sourceTemplate(
  sourceRuleId: SerCp007SourceRuleId,
): SerCp007Question["temporaryTemplateId"] {
  const template = SER_CP007_TEMPORARY_TEMPLATES.find(
    (entry) => entry.sourceRuleId === sourceRuleId && entry.taskKind === "NEXT_TERM",
  );
  if (!template) throw new Error(`Missing Wave A source template ${sourceRuleId}`);
  return template.temporaryTemplateId;
}

function waveBTemplate(
  sourceRuleId: SerCp007WaveBSourceRuleId,
): SerCp007WaveBQuestion["temporaryTemplateId"] {
  const template = SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.find(
    (entry) => entry.sourceRuleId === sourceRuleId && entry.taskKind === "NEXT_TERM",
  );
  if (!template) throw new Error(`Missing Wave B source template ${sourceRuleId}`);
  return template.temporaryTemplateId;
}

function fromWaveA(
  sourceRuleId: SerCp007SourceRuleId,
  seed: number,
): FamilyEvidence {
  const question = generateSerCp007Question(sourceTemplate(sourceRuleId), seed);
  return {
    terms: question.hiddenState.canonicalTerms,
    parameterKey: question.hiddenState.parameterKey,
    rule: question.explanation.rule,
    steps: question.explanation.steps,
    quickMethod: question.explanation.quickMethod,
    commonMistake: question.explanation.commonMistake,
    trapCode: question.explanation.trapCode,
  };
}

function fromWaveB(
  sourceRuleId: SerCp007WaveBSourceRuleId,
  seed: number,
): FamilyEvidence {
  const question = generateSerCp007WaveBQuestion(waveBTemplate(sourceRuleId), seed);
  return {
    terms: question.hiddenState.canonicalTerms,
    parameterKey: question.hiddenState.parameterKey,
    rule: question.explanation.rule,
    steps: question.explanation.steps,
    quickMethod: question.explanation.quickMethod,
    commonMistake: question.explanation.commonMistake,
    trapCode: question.explanation.trapCode,
  };
}

function generateThreeRows(seed: number): FamilyEvidence {
  const next = createPrng(seed * 65537 + 71);
  const width = integer(next, 2, 4);
  const rowStarts = Array.from({ length: 3 }, () =>
    Array.from({ length: width }, () => integer(next, 0, 25)),
  );
  const rowShifts = Array.from({ length: 3 }, () =>
    Array.from({ length: width }, () => nonZero(next, -4, 4)),
  );
  const terms = Array.from({ length: 12 }, (_, index) => {
    const row = index % 3;
    const rowIndex = Math.floor(index / 3);
    return rowStarts[row]!
      .map((start, column) =>
        letterAt(start + rowShifts[row]![column]! * rowIndex),
      )
      .join("");
  });
  const rows = [0, 1, 2].map(
    (row) =>
      `Row ${row + 1}: ${terms.filter((_, index) => index % 3 === row).join(" → ")}`,
  );
  return {
    terms,
    parameterKey: rowStarts
      .map((starts, row) => `${starts.join(".")}:${rowShifts[row]!.join(".")}`)
      .join("|"),
    rule: `Put the 1st, 4th, 7th... groups in one row, the 2nd, 5th, 8th... groups in a second row, and the 3rd, 6th, 9th... groups in a third row.`,
    steps: rows,
    quickMethod: `Mark group positions 1, 2, 3 and repeat that row pattern before comparing letters.`,
    commonMistake: `Do not compare neighbouring groups; they belong to three different rows.`,
    trapCode: "THREE_ROWS_MIXED",
  };
}

function familyFor(
  sourceRuleId: SerCp007WaveCSourceRuleId,
  seed: number,
): FamilyEvidence {
  switch (sourceRuleId) {
    case "THREE_INTERLEAVED_CLUSTER_ROWS":
      return generateThreeRows(seed);
    case "NEXT_TWO_COLUMNWISE_FIXED":
    case "MISSING_TWO_COLUMNWISE_FIXED":
    case "WRONG_WITH_REPLACEMENT_PAIR":
      return fromWaveA("UNIFORM_COLUMN_SHIFTS", seed);
    case "NEXT_TWO_INTERLEAVED_ROWS":
      return fromWaveA("TWO_INTERLEAVED_CLUSTER_ROWS", seed);
    case "NEXT_TWO_ROTATION":
      return fromWaveA("CYCLIC_CLUSTER_ROTATION", seed);
    case "NEXT_TWO_EDGE_DELETION":
      return fromWaveA("FIXED_FRONT_DELETION", seed);
    case "NEXT_TWO_GROWING_CLUSTER":
      return fromWaveB("GROWING_CONSECUTIVE_BLOCKS", seed);
    case "NEXT_TWO_SYMMETRIC_GROWTH":
      return fromWaveB("SYMMETRIC_EDGE_GROWTH", seed);
  }
}

function optionCandidates(correctAnswer: string, seed: number): readonly string[] {
  const candidates = [
    correctAnswer,
    mutateLetters(correctAnswer, seed),
    shiftLetters(correctAnswer, 1),
    shiftLetters(correctAnswer, -1),
    reverseLetters(correctAnswer),
  ];
  const unique = [...new Set(candidates)];
  let offset = 2;
  while (unique.length < 4) {
    const candidate = shiftLetters(correctAnswer, offset);
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

export interface SerCp007WaveCQuestion {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-007";
  readonly waveId: "SER-CP-007-WAVE-C";
  readonly temporaryTemplateId: SerCp007WaveCTemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp007WaveCSourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveCAuthorityId;
  readonly ownershipDisposition: SerCp007WaveCDisposition;
  readonly taskKind: SerCp007WaveCTaskKind;
  readonly answerSemantic: SerCp007WaveCAnswerSemantic;
  readonly solveMode: "INFER_CLUSTER_SERIES_WITH_GROUPED_ANSWER";
  readonly language: "en-IN";
  readonly difficulty: SerCp007WaveCDifficulty;
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
    readonly answerIndexes: readonly number[];
    readonly corruptedIndex: number | null;
    readonly displayedWrongTerm: string | null;
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

function renderSequence(sequence: readonly (string | null)[]): string {
  return sequence.map((term) => term ?? "?").join(", ");
}

export function generateSerCp007WaveCQuestion(
  temporaryTemplateId: SerCp007WaveCTemporaryTemplateId,
  seed: number,
): SerCp007WaveCQuestion {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS.indexOf(
    temporaryTemplateId,
  );
  const family = familyFor(template.sourceRuleId, seed);
  const terms = family.terms;
  const correctIndex = (seed + templateIndex) % 4;

  let sequence: readonly (string | null)[];
  let correctAnswer: string;
  let answerIndexes: readonly number[];
  let corruptedIndex: number | null = null;
  let displayedWrongTerm: string | null = null;
  let stem: string;
  let conclusion: string;

  switch (template.taskKind) {
    case "NEXT_TERM":
      sequence = terms.slice(0, 11);
      answerIndexes = [11];
      correctAnswer = terms[11]!;
      stem = `Which letter group should come next?\n${renderSequence(sequence)}, ?`;
      conclusion = `Therefore, the answer is ${correctAnswer}.`;
      break;
    case "MISSING_TERM": {
      const index = 3 + ((seed + templateIndex) % 6);
      sequence = terms.slice(0, 11).map((term, termIndex) =>
        termIndex === index ? null : term,
      );
      answerIndexes = [index];
      correctAnswer = terms[index]!;
      stem = `Which letter group should replace the question mark?\n${renderSequence(sequence)}`;
      conclusion = `Therefore, the answer is ${correctAnswer}.`;
      break;
    }
    case "PREVIOUS_TERM":
      sequence = terms.slice(1, 12);
      answerIndexes = [0];
      correctAnswer = terms[0]!;
      stem = `Which letter group should come immediately before the given series?\n?, ${renderSequence(sequence)}`;
      conclusion = `Therefore, the answer is ${correctAnswer}.`;
      break;
    case "WRONG_TERM": {
      corruptedIndex = 3 + ((seed + templateIndex) % 6);
      const displayed = [...terms.slice(0, 11)];
      displayedWrongTerm = mutateLetters(displayed[corruptedIndex]!, seed + templateIndex);
      displayed[corruptedIndex] = displayedWrongTerm;
      sequence = displayed;
      answerIndexes = [corruptedIndex];
      correctAnswer = terms[corruptedIndex]!;
      stem = `Which letter group should replace the incorrectly placed group?\n${renderSequence(sequence)}`;
      conclusion = `${displayedWrongTerm} is wrong at that place. It should be ${correctAnswer}.`;
      break;
    }
    case "NEXT_TWO_TERMS":
      sequence = terms.slice(0, 6);
      answerIndexes = [6, 7];
      correctAnswer = `${terms[6]}, ${terms[7]}`;
      stem = `Which two letter groups should come next?\n${renderSequence(sequence)}, ?, ?`;
      conclusion = `The next two groups are ${correctAnswer}.`;
      break;
    case "MISSING_TWO_TERMS": {
      const first = 2 + ((seed + templateIndex) % 2);
      const second = 5 + ((seed + templateIndex) % 2);
      sequence = terms.slice(0, 8).map((term, index) =>
        index === first || index === second ? null : term,
      );
      answerIndexes = [first, second];
      correctAnswer = `${terms[first]}, ${terms[second]}`;
      stem = `Which two letter groups should replace the question marks from left to right?\n${renderSequence(sequence)}`;
      conclusion = `The missing groups, from left to right, are ${correctAnswer}.`;
      break;
    }
    case "WRONG_AND_REPLACEMENT": {
      corruptedIndex = 2 + ((seed + templateIndex) % 4);
      const displayed = [...terms.slice(0, 8)];
      displayedWrongTerm = mutateLetters(displayed[corruptedIndex]!, seed + templateIndex);
      displayed[corruptedIndex] = displayedWrongTerm;
      sequence = displayed;
      answerIndexes = [corruptedIndex];
      correctAnswer = `${displayedWrongTerm} → ${terms[corruptedIndex]}`;
      stem = `Which option correctly shows the wrong group and its replacement?\n${renderSequence(sequence)}`;
      conclusion = `${displayedWrongTerm} is the wrong group and ${terms[corruptedIndex]} is its replacement.`;
      break;
    }
  }

  const steps =
    template.taskKind === "WRONG_TERM" || template.taskKind === "WRONG_AND_REPLACEMENT"
      ? [
          `First write the correct series: ${terms.slice(0, sequence.length).join(", ")}.`,
          ...family.steps.slice(0, 4),
        ]
      : template.taskKind === "PREVIOUS_TERM"
        ? [
            `First check the shown groups: ${terms.slice(1, 7).join(", ")}.`,
            `Now move one step backward in the correct row.`,
            ...family.steps.slice(0, 4),
          ]
        : family.steps;

  return {
    questionId: `${temporaryTemplateId}-${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-007",
    waveId: "SER-CP-007-WAVE-C",
    temporaryTemplateId,
    permanentQlId: null,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    answerSemantic: template.answerSemantic,
    solveMode: "INFER_CLUSTER_SERIES_WITH_GROUPED_ANSWER",
    language: "en-IN",
    difficulty: (["EASY", "MEDIUM", "HARD"] as const)[
      (seed + templateIndex) % 3
    ]!,
    seed,
    stem,
    sequence,
    options: buildOptions(correctAnswer, seed + templateIndex * 43, correctIndex),
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: [
      template.canonicalAuthorityId,
      family.parameterKey,
      template.taskKind,
      answerIndexes.join("."),
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
      answerIndexes,
      corruptedIndex,
      displayedWrongTerm,
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

export const SER_CP007_WAVE_C_OPTION_LABELS = ["1", "2", "3", "4"] as const;

export function renderSerCp007WaveCReview(
  question: SerCp007WaveCQuestion,
): string {
  const options = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${SER_CP007_WAVE_C_OPTION_LABELS[index]}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...options,
    "",
    `**Answer:** ${SER_CP007_WAVE_C_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
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
