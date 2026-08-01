export const SER_CP006_SOURCE_RULE_IDS = [
  "UNIFORM_FORWARD_SHIFT",
  "UNIFORM_BACKWARD_SHIFT",
  "PROGRESSIVE_FORWARD_SHIFT",
  "PROGRESSIVE_BACKWARD_SHIFT",
  "ALTERNATING_SHIFT_PAIR",
  "TWO_INTERLEAVED_UNIFORM_LANES",
  "VOWEL_SUCCESSOR_CYCLE",
  "CONSONANT_SUCCESSOR_CYCLE",
] as const;

export type SerCp006SourceRuleId = (typeof SER_CP006_SOURCE_RULE_IDS)[number];

export const SER_CP006_CANONICAL_AUTHORITY_IDS = [
  "UNIFORM_CYCLIC_LETTER_SHIFT",
  "PROGRESSIVE_CYCLIC_LETTER_SHIFT",
  "TWO_INTERLEAVED_CYCLIC_LETTER_LANES",
  "ORDERED_LETTER_SUBSET_CYCLE",
] as const;

export type SerCp006CanonicalAuthorityId =
  (typeof SER_CP006_CANONICAL_AUTHORITY_IDS)[number];

export type SerCp006TemporaryTemplateId = `SER-CP-006-TMP-${string}`;
export type SerCp006TaskKind = "NEXT_TERM" | "MISSING_TERM" | "PREVIOUS_TERM" | "WRONG_TERM";
export type SerCp006Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SerCp006AnswerSemantic = "LETTER_VALUE" | "WRONG_DISPLAYED_LETTER";
export type SerCp006OwnershipDisposition =
  | "PROVISIONAL_RETAIN_CP006"
  | "PROVISIONAL_MERGE_DIRECTION_VARIANTS"
  | "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY"
  | "PROVISIONAL_MERGE_ORDERED_SUBSET_VARIANTS";

export interface SerCp006Template {
  readonly temporaryTemplateId: SerCp006TemporaryTemplateId;
  readonly sourceRuleId: SerCp006SourceRuleId;
  readonly canonicalAuthorityId: SerCp006CanonicalAuthorityId;
  readonly taskKind: SerCp006TaskKind;
  readonly answerSemantic: SerCp006AnswerSemantic;
  readonly ownershipDisposition: SerCp006OwnershipDisposition;
}

const TASKS: readonly SerCp006TaskKind[] = ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"];

function ownershipFor(sourceRuleId: SerCp006SourceRuleId): Pick<
  SerCp006Template,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (sourceRuleId) {
    case "UNIFORM_FORWARD_SHIFT":
    case "UNIFORM_BACKWARD_SHIFT":
      return {
        canonicalAuthorityId: "UNIFORM_CYCLIC_LETTER_SHIFT",
        ownershipDisposition: "PROVISIONAL_MERGE_DIRECTION_VARIANTS",
      };
    case "PROGRESSIVE_FORWARD_SHIFT":
    case "PROGRESSIVE_BACKWARD_SHIFT":
      return {
        canonicalAuthorityId: "PROGRESSIVE_CYCLIC_LETTER_SHIFT",
        ownershipDisposition: "PROVISIONAL_MERGE_DIRECTION_VARIANTS",
      };
    case "ALTERNATING_SHIFT_PAIR":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_CYCLIC_LETTER_LANES",
        ownershipDisposition: "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY",
      };
    case "TWO_INTERLEAVED_UNIFORM_LANES":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_CYCLIC_LETTER_LANES",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP006",
      };
    case "VOWEL_SUCCESSOR_CYCLE":
    case "CONSONANT_SUCCESSOR_CYCLE":
      return {
        canonicalAuthorityId: "ORDERED_LETTER_SUBSET_CYCLE",
        ownershipDisposition: "PROVISIONAL_MERGE_ORDERED_SUBSET_VARIANTS",
      };
  }
}

export const SER_CP006_TEMPORARY_TEMPLATE_IDS = Array.from(
  { length: SER_CP006_SOURCE_RULE_IDS.length * TASKS.length },
  (_, index) => `SER-CP-006-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp006TemporaryTemplateId[];

export const SER_CP006_TEMPORARY_TEMPLATES: readonly SerCp006Template[] =
  SER_CP006_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const sourceRuleId = SER_CP006_SOURCE_RULE_IDS[Math.floor(index / TASKS.length)]!;
    const taskKind = TASKS[index % TASKS.length]!;
    return {
      temporaryTemplateId,
      sourceRuleId,
      taskKind,
      answerSemantic: taskKind === "WRONG_TERM" ? "WRONG_DISPLAYED_LETTER" : "LETTER_VALUE",
      ...ownershipFor(sourceRuleId),
    };
  });

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VOWELS = ["A", "E", "I", "O", "U"] as const;
const CONSONANTS = [...ALPHABET].filter((letter) => !VOWELS.includes(letter as (typeof VOWELS)[number]));

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function letterAt(position: number): string {
  return ALPHABET[mod(position, ALPHABET.length)]!;
}

function positionOf(letter: string): number {
  const index = ALPHABET.indexOf(letter);
  if (index < 0) throw new Error(`Invalid alphabetic term: ${letter}`);
  return index;
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

function difficultyFor(seed: number, templateIndex: number): SerCp006Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed + templateIndex) % 3]!;
}

interface GeneratedSequence {
  readonly parameterKey: string;
  readonly sequence: readonly string[];
  readonly ruleStatement: string;
  readonly working: readonly string[];
}

function generateCanonical(sourceRuleId: SerCp006SourceRuleId, seed: number): GeneratedSequence {
  const next = createPrng(seed * 97 + SER_CP006_SOURCE_RULE_IDS.indexOf(sourceRuleId) * 997);
  const length = 8;

  switch (sourceRuleId) {
    case "UNIFORM_FORWARD_SHIFT":
    case "UNIFORM_BACKWARD_SHIFT": {
      const direction = sourceRuleId === "UNIFORM_FORWARD_SHIFT" ? 1 : -1;
      const start = integer(next, 0, 25);
      const step = integer(next, 1, 8);
      const sequence = Array.from({ length }, (_, index) => letterAt(start + direction * step * index));
      return {
        parameterKey: `${start}:${direction}:${step}`,
        sequence,
        ruleStatement: `Move ${step} alphabet position${step === 1 ? "" : "s"} ${direction > 0 ? "forward" : "backward"} each time, wrapping after ${direction > 0 ? "Z" : "A"}.`,
        working: sequence.slice(0, -1).map((letter, index) => `${letter} → ${sequence[index + 1]} (${direction > 0 ? "+" : "−"}${step})`),
      };
    }
    case "PROGRESSIVE_FORWARD_SHIFT":
    case "PROGRESSIVE_BACKWARD_SHIFT": {
      const direction = sourceRuleId === "PROGRESSIVE_FORWARD_SHIFT" ? 1 : -1;
      const start = integer(next, 0, 25);
      const firstStep = integer(next, 1, 3);
      const increment = integer(next, 1, 3);
      const positions = [start];
      const transitions: string[] = [];
      for (let index = 1; index < length; index += 1) {
        const step = firstStep + (index - 1) * increment;
        positions.push(positions[index - 1]! + direction * step);
        transitions.push(`${letterAt(positions[index - 1]!)} → ${letterAt(positions[index]!)} (${direction > 0 ? "+" : "−"}${step})`);
      }
      return {
        parameterKey: `${start}:${direction}:${firstStep}:${increment}`,
        sequence: positions.map(letterAt),
        ruleStatement: `Move ${direction > 0 ? "forward" : "backward"} by ${firstStep}, then increase the jump by ${increment} each time.`,
        working: transitions,
      };
    }
    case "ALTERNATING_SHIFT_PAIR": {
      const start = integer(next, 0, 25);
      const firstShift = integer(next, 1, 6);
      let secondShift = -integer(next, 1, 6);
      if (firstShift + secondShift === 0) secondShift -= 1;
      const positions = [start];
      const transitions: string[] = [];
      for (let index = 1; index < length; index += 1) {
        const shift = index % 2 === 1 ? firstShift : secondShift;
        positions.push(positions[index - 1]! + shift);
        transitions.push(`${letterAt(positions[index - 1]!)} → ${letterAt(positions[index]!)} (${shift > 0 ? "+" : "−"}${Math.abs(shift)})`);
      }
      return {
        parameterKey: `${start}:${firstShift}:${secondShift}`,
        sequence: positions.map(letterAt),
        ruleStatement: `Alternate the shifts ${firstShift > 0 ? "+" : "−"}${Math.abs(firstShift)} and ${secondShift > 0 ? "+" : "−"}${Math.abs(secondShift)}. The same pattern can be read as two interleaved letter lanes.`,
        working: transitions,
      };
    }
    case "TWO_INTERLEAVED_UNIFORM_LANES": {
      const firstStart = integer(next, 0, 25);
      const secondStart = integer(next, 0, 25);
      const firstStep = integer(next, 1, 7);
      let secondStep = integer(next, 1, 7);
      if (secondStep === firstStep) secondStep = mod(secondStep + 2, 7) + 1;
      const sequence = Array.from({ length }, (_, index) => {
        const laneIndex = Math.floor(index / 2);
        return index % 2 === 0
          ? letterAt(firstStart + laneIndex * firstStep)
          : letterAt(secondStart + laneIndex * secondStep);
      });
      return {
        parameterKey: `${firstStart}:${firstStep}|${secondStart}:${secondStep}`,
        sequence,
        ruleStatement: `Read alternate positions as two independent letter series: the first lane moves +${firstStep}, and the second lane moves +${secondStep}.`,
        working: [
          `Positions 1, 3, 5, 7: ${sequence.filter((_, index) => index % 2 === 0).join(" → ")}`,
          `Positions 2, 4, 6, 8: ${sequence.filter((_, index) => index % 2 === 1).join(" → ")}`,
        ],
      };
    }
    case "VOWEL_SUCCESSOR_CYCLE":
    case "CONSONANT_SUCCESSOR_CYCLE": {
      const subset = sourceRuleId === "VOWEL_SUCCESSOR_CYCLE" ? [...VOWELS] : CONSONANTS;
      const start = integer(next, 0, subset.length - 1);
      const step = integer(next, 1, Math.min(3, subset.length - 1));
      const sequence = Array.from({ length }, (_, index) => subset[mod(start + index * step, subset.length)]!);
      return {
        parameterKey: `${sourceRuleId}:${start}:${step}`,
        sequence,
        ruleStatement: `Move ${step} place${step === 1 ? "" : "s"} at a time through the ordered ${sourceRuleId === "VOWEL_SUCCESSOR_CYCLE" ? "vowel" : "consonant"} list, cycling back to the beginning when needed.`,
        working: sequence.slice(0, -1).map((letter, index) => `${letter} → ${sequence[index + 1]}`),
      };
    }
  }
}

function templateFor(temporaryTemplateId: SerCp006TemporaryTemplateId): SerCp006Template {
  const template = SER_CP006_TEMPORARY_TEMPLATES.find((entry) => entry.temporaryTemplateId === temporaryTemplateId);
  if (!template) throw new Error(`Unknown SER-CP-006 temporary template: ${temporaryTemplateId}`);
  return template;
}

function stemFor(taskKind: SerCp006TaskKind, sequence: readonly (string | null)[]): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM": return `Which letter should come next in the series?\n${rendered}, ?`;
    case "MISSING_TERM": return `Which letter should replace the question mark in the series?\n${rendered}`;
    case "PREVIOUS_TERM": return `Which letter should come immediately before the given series?\n?, ${rendered}`;
    case "WRONG_TERM": return `Which displayed letter is incorrectly placed in the series?\n${rendered}`;
  }
}

function optionPoolFor(sourceRuleId: SerCp006SourceRuleId): readonly string[] {
  if (sourceRuleId === "VOWEL_SUCCESSOR_CYCLE") return VOWELS;
  if (sourceRuleId === "CONSONANT_SUCCESSOR_CYCLE") return CONSONANTS;
  return [...ALPHABET];
}

function buildOptions(
  sourceRuleId: SerCp006SourceRuleId,
  correctAnswer: string,
  correctReplacement: string,
  seed: number,
  correctIndex: number,
): readonly string[] {
  const pool = optionPoolFor(sourceRuleId);
  const anchor = Math.max(0, pool.indexOf(correctReplacement));
  const candidates = [
    correctAnswer,
    correctReplacement,
    pool[mod(anchor + 1 + (seed % 2), pool.length)]!,
    pool[mod(anchor - 1 - (seed % 2), pool.length)]!,
    pool[mod(anchor + 3, pool.length)]!,
  ];
  const unique = [...new Set(candidates)];
  for (let offset = 1; unique.length < 4; offset += 1) {
    const candidate = pool[mod(anchor + offset * 2, pool.length)]!;
    if (!unique.includes(candidate)) unique.push(candidate);
  }
  const distractors = unique.filter((value) => value !== correctAnswer).slice(0, 3);
  const options = [...distractors];
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

export interface SerCp006Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-006";
  readonly temporaryTemplateId: SerCp006TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp006SourceRuleId;
  readonly canonicalAuthorityId: SerCp006CanonicalAuthorityId;
  readonly ownershipDisposition: SerCp006OwnershipDisposition;
  readonly taskKind: SerCp006TaskKind;
  readonly answerSemantic: SerCp006AnswerSemantic;
  readonly solveMode: "INFER_SINGLE_LETTER_ALPHABETIC_SEQUENCE";
  readonly language: "en-IN";
  readonly difficulty: SerCp006Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (string | null)[];
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: {
    readonly ruleStatement: string;
    readonly working: readonly string[];
    readonly conclusion: string;
    readonly trapAnalyses: readonly string[];
  };
  readonly hiddenState: {
    readonly parameterKey: string;
    readonly canonicalSequence: readonly string[];
    readonly targetIndex: number;
    readonly corruptedValue: string | null;
    readonly correctReplacement: string;
  };
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export function generateSerCp006Question(
  temporaryTemplateId: SerCp006TemporaryTemplateId,
  seed: number,
): SerCp006Question {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error(`SER-CP-006 seed must be a positive integer; received ${seed}`);
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP006_TEMPORARY_TEMPLATE_IDS.indexOf(temporaryTemplateId);
  const generated = generateCanonical(template.sourceRuleId, seed);
  const canonicalSequence = [...generated.sequence];
  const displayed: (string | null)[] = [...canonicalSequence];
  let targetIndex = canonicalSequence.length - 1;
  let corruptedValue: string | null = null;

  if (template.taskKind === "NEXT_TERM") {
    displayed.pop();
  } else if (template.taskKind === "PREVIOUS_TERM") {
    targetIndex = 0;
    displayed.shift();
  } else if (template.taskKind === "MISSING_TERM") {
    targetIndex = 2 + (seed % 4);
    displayed[targetIndex] = null;
  } else {
    targetIndex = 2 + (seed % 4);
    corruptedValue = letterAt(positionOf(canonicalSequence[targetIndex]!) + 1 + (seed % 5));
    displayed[targetIndex] = corruptedValue;
  }

  const correctReplacement = canonicalSequence[targetIndex]!;
  const correctAnswer = template.taskKind === "WRONG_TERM" ? corruptedValue! : correctReplacement;
  const correctIndex = (seed + templateIndex) % 4;
  const options = buildOptions(template.sourceRuleId, correctAnswer, correctReplacement, seed, correctIndex);
  const conclusion = template.taskKind === "WRONG_TERM"
    ? `${correctAnswer} is the incorrectly displayed letter; it should be ${correctReplacement}.`
    : `Therefore, the required letter is ${correctAnswer}.`;

  return {
    questionId: `${temporaryTemplateId}-${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-006",
    temporaryTemplateId,
    permanentQlId: null,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    answerSemantic: template.answerSemantic,
    solveMode: "INFER_SINGLE_LETTER_ALPHABETIC_SEQUENCE",
    language: "en-IN",
    difficulty: difficultyFor(seed, templateIndex),
    seed,
    stem: stemFor(template.taskKind, displayed),
    sequence: displayed,
    options,
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: `${template.canonicalAuthorityId}|${generated.parameterKey}|${template.taskKind}|${targetIndex}`,
    explanation: {
      ruleStatement: generated.ruleStatement,
      working: generated.working,
      conclusion,
      trapAnalyses: options.map((option) => option === correctAnswer
        ? `${option}: follows the complete series rule.`
        : `${option}: results from using an incomplete jump, ignoring the cycle, or reading adjacent positions as one lane.`),
    },
    hiddenState: {
      parameterKey: generated.parameterKey,
      canonicalSequence,
      targetIndex,
      corruptedValue,
      correctReplacement,
    },
    lifecycle: {
      maturity: "OPEN_EXECUTABLE_DISCOVERY",
      sourceSaturation: "OPEN",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function independentlyProjectSerCp006(
  sourceRuleId: SerCp006SourceRuleId,
  seed: number,
): readonly string[] {
  return generateCanonical(sourceRuleId, seed).sequence;
}

export function renderSerCp006Review(question: SerCp006Question): string {
  const optionLines = question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`);
  return [
    `## ${question.questionId}`,
    "",
    `- Source family: ${question.sourceRuleId}`,
    `- Canonical authority: ${question.canonicalAuthorityId}`,
    `- Task: ${question.taskKind}`,
    `- Difficulty: ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`,
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    "",
    ...question.explanation.working.map((step) => `- ${step}`),
    "",
    `**Conclusion:** ${question.explanation.conclusion}`,
  ].join("\n");
}
