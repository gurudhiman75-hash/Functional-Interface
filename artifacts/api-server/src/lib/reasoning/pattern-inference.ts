import type {
  DifficultyLabel,
  OptionMetadata,
} from "../core/generator-engine";
import type {
  OptionResult,
  ReasoningStep,
} from "../shared";
import type { QuantMotif } from "../motifs/types";
import {
  pickRandomItem,
  shuffle,
} from "../shared";

export type PatternRuleId =
  | "shift-fixed"
  | "shift-incremental"
  | "shift-alternating"
  | "shift-vowel-consonant"
  | "map-opposite"
  | "map-cross"
  | "map-rank-math"
  | "math-power"
  | "math-difference-layer"
  | "math-interleaved";

export type PatternInferenceTopic =
  | "coding"
  | "series"
  | "analogy"
  | "classification";

export type TransformationOperator =
  | {
      type: "SHIFT";
      amount: number;
      circular?: boolean;
    }
  | { type: "REVERSE" }
  | { type: "OPPOSITE" }
  | { type: "RANK_SUM" }
  | { type: "ADJACENT_SWAP" };

export interface TransformationRule {
  id: PatternRuleId;
  label: string;
  operators: TransformationOperator[];
  traceLabel: string;
}

type SeriesRuleCandidate =
  | "arithmetic"
  | "geometric"
  | "second-difference"
  | "square-offset"
  | "cube-offset"
  | "interleaved";

export interface PatternInferenceScenario {
  stem: string;
  answer: string;
  options: OptionResult;
  explanation: string;
  reasoningSteps: ReasoningStep[];
  structuralSignature: string;
}

const VOWELS = new Set([
  "A",
  "E",
  "I",
  "O",
  "U",
]);

export const PATTERN_RULES: Record<
  PatternRuleId,
  TransformationRule
> = {
  "shift-fixed": {
    id: "shift-fixed",
    label: "Fixed alphabet shift",
    operators: [
      {
        type: "SHIFT",
        amount: 3,
        circular: true,
      },
    ],
    traceLabel:
      "Apply the same circular alphabet shift to every letter.",
  },
  "shift-incremental": {
    id: "shift-incremental",
    label: "Incremental alphabet shift",
    operators: [
      {
        type: "SHIFT",
        amount: 1,
        circular: true,
      },
    ],
    traceLabel:
      "Increase the shift by one position from left to right.",
  },
  "shift-alternating": {
    id: "shift-alternating",
    label: "Alternating alphabet shift",
    operators: [
      {
        type: "SHIFT",
        amount: 2,
        circular: true,
      },
      {
        type: "SHIFT",
        amount: -1,
        circular: true,
      },
    ],
    traceLabel:
      "Alternate the shift pattern as $+2, -1, +2, -1$.",
  },
  "shift-vowel-consonant": {
    id: "shift-vowel-consonant",
    label: "Vowel and consonant split shift",
    operators: [
      {
        type: "SHIFT",
        amount: 1,
        circular: true,
      },
      {
        type: "SHIFT",
        amount: -1,
        circular: true,
      },
    ],
    traceLabel:
      "Move vowels one step forward and consonants one step backward.",
  },
  "map-opposite": {
    id: "map-opposite",
    label: "Opposite alphabet mapping",
    operators: [{ type: "OPPOSITE" }],
    traceLabel:
      "Use the opposite alphabet map where $A \\to Z$, $B \\to Y$ and rank sums equal $27$.",
  },
  "map-cross": {
    id: "map-cross",
    label: "Adjacent pair cross mapping",
    operators: [{ type: "ADJACENT_SWAP" }],
    traceLabel:
      "Swap adjacent positions as $1 \\leftrightarrow 2$, $3 \\leftrightarrow 4$.",
  },
  "map-rank-math": {
    id: "map-rank-math",
    label: "Alphabet rank aggregation",
    operators: [{ type: "RANK_SUM" }],
    traceLabel:
      "Convert letters to alphabet ranks and aggregate the values.",
  },
  "math-power": {
    id: "math-power",
    label: "Power-pattern series",
    operators: [],
    traceLabel:
      "Recognize the power form such as $n^2$, $n^3$, or $n^2 \\pm 1$.",
  },
  "math-difference-layer": {
    id: "math-difference-layer",
    label: "Hidden difference-layer series",
    operators: [],
    traceLabel:
      "Move beyond first differences and inspect the second difference layer.",
  },
  "math-interleaved": {
    id: "math-interleaved",
    label: "Interleaved two-series pattern",
    operators: [],
    traceLabel:
      "Separate odd and even positions into two independent series.",
  },
};

export function normalizePatternRuleId(
  motifId: string,
): PatternRuleId {
  switch (motifId) {
    case "direct_alphabet_shift":
    case "alphabet-transform":
      return "shift-fixed";
    case "reverse_alphabet_mapping":
      return "map-opposite";
    case "symbolic_position_encoding":
      return "map-rank-math";
    case "conditional_letter_mapping":
      return "shift-vowel-consonant";
    case "multi_stage_word_transform":
      return "map-cross";
    case "inference_based_decoding":
      return "shift-incremental";
    case "shift-fixed":
    case "shift-incremental":
    case "shift-alternating":
    case "shift-vowel-consonant":
    case "map-opposite":
    case "map-cross":
    case "map-rank-math":
    case "math-power":
    case "math-difference-layer":
    case "math-interleaved":
      return motifId;
    default:
      return "shift-fixed";
  }
}

export function isPatternInferenceMotif(
  motifId: string,
) {
  return (
    motifId in PATTERN_RULES ||
    [
      "direct_alphabet_shift",
      "reverse_alphabet_mapping",
      "symbolic_position_encoding",
      "conditional_letter_mapping",
      "multi_stage_word_transform",
      "inference_based_decoding",
      "alphabet-transform",
    ].includes(motifId)
  );
}

export function letterRank(char: string) {
  return (
    char.toUpperCase().charCodeAt(0) -
    64
  );
}

export function letterFromRank(
  rank: number,
) {
  const normalized =
    ((rank - 1) % 26) + 1;
  return String.fromCharCode(
    normalized + 64,
  );
}

export function shiftLetterCircular(
  char: string,
  shift: number,
) {
  return letterFromRank(
    letterRank(char) + shift,
  );
}

export function oppositeLetter(
  char: string,
) {
  return letterFromRank(
    27 - letterRank(char),
  );
}

export function swapAdjacentPairs(
  value: string,
) {
  const chars = value.split("");
  for (
    let index = 0;
    index < chars.length - 1;
    index += 2
  ) {
    const current = chars[index]!;
    chars[index] = chars[index + 1]!;
    chars[index + 1] = current;
  }

  return chars.join("");
}

export function applyPatternRuleToWord(
  word: string,
  motifId: string,
  values: Record<string, number> = {},
) {
  const ruleId =
    normalizePatternRuleId(motifId);
  const shift = values.shift ?? 3;

  switch (ruleId) {
    case "shift-fixed":
      return word
        .split("")
        .map((char) =>
          shiftLetterCircular(
            char,
            shift,
          ),
        )
        .join("");
    case "shift-incremental":
      return word
        .split("")
        .map((char, index) =>
          shiftLetterCircular(
            char,
            index + 1,
          ),
        )
        .join("");
    case "shift-alternating":
      return word
        .split("")
        .map((char, index) =>
          shiftLetterCircular(
            char,
            index % 2 === 0
              ? 2
              : -1,
          ),
        )
        .join("");
    case "shift-vowel-consonant":
      return word
        .split("")
        .map((char) =>
          shiftLetterCircular(
            char,
            VOWELS.has(char)
              ? 1
              : -1,
          ),
        )
        .join("");
    case "map-opposite":
      return word
        .split("")
        .map(oppositeLetter)
        .join("");
    case "map-cross":
      return swapAdjacentPairs(word);
    case "map-rank-math":
      return String(
        word
          .split("")
          .reduce(
            (sum, char) =>
              sum + letterRank(char),
            0,
          ),
      );
    default:
      return word;
  }
}

export function buildPatternTrace(
  input: string,
  output: string,
  motifId: string,
  values: Record<string, number> = {},
) {
  const ruleId =
    normalizePatternRuleId(motifId);
  const rule = PATTERN_RULES[ruleId];

  if (ruleId === "shift-fixed") {
    const shift = values.shift ?? 3;
    return [
      `Step 1: Map each letter to its alphabet rank.`,
      `Step 2: Apply a circular shift of $${shift > 0 ? "+" : ""}${shift}$ to every rank.`,
      `Step 3: Therefore $${input} \\xrightarrow{R} ${output}$.`,
    ];
  }

  if (ruleId === "map-rank-math") {
    const ranks = input
      .split("")
      .map(
        (char) =>
          `${char}=${letterRank(char)}`,
      )
      .join(", ");

    return [
      `Step 1: Convert letters into ranks: $${ranks}$.`,
      `Step 2: Add the ranks to get $${output}$.`,
      `Step 3: Therefore $${input} \\xrightarrow{R} ${output}$.`,
    ];
  }

  return [
    `Step 1: Identify the rule: ${rule.traceLabel}`,
    `Step 2: Apply the same rule to the new input.`,
    `Step 3: Therefore $${input} \\xrightarrow{R} ${output}$.`,
  ];
}

function buildOptions(
  correct: string,
  distractors: string[],
): OptionResult {
  const optionMap = new Map<
    string,
    OptionMetadata
  >();

  optionMap.set(correct, {
    value: correct,
    isCorrect: true,
  });

  for (const distractor of distractors) {
    if (
      distractor !== correct &&
      !optionMap.has(distractor)
    ) {
      optionMap.set(distractor, {
        value: distractor,
        isCorrect: false,
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Applied a nearby but incorrect transformation rule.",
        reasoningTrap:
          "Pattern-inference trap.",
      });
    }
  }

  let filler = 1;
  while (optionMap.size < 4) {
    const value = `${correct}${filler}`;
    if (!optionMap.has(value)) {
      optionMap.set(value, {
        value,
        isCorrect: false,
        distractorType:
          "arithmeticSlip",
        likelyMistake:
          "Made a small calculation or mapping slip.",
        reasoningTrap:
          "Plausible close option.",
      });
    }
    filler += 1;
  }

  const shuffled = shuffle(
    [...optionMap.values()].slice(0, 4),
  );

  return {
    options: shuffled.map(
      (option) => option.value,
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect,
    ),
    optionMetadata: shuffled,
  };
}

function getDifferences(
  values: number[],
) {
  return values
    .slice(1)
    .map(
      (value, index) =>
        value - values[index]!,
    );
}

function allEqual(values: number[]) {
  return values.every(
    (value) => value === values[0],
  );
}

export function findMatchingSeriesRules(
  sequence: number[],
): SeriesRuleCandidate[] {
  const matches: SeriesRuleCandidate[] = [];

  if (sequence.length >= 3) {
    const firstDiff =
      getDifferences(sequence);
    if (allEqual(firstDiff)) {
      matches.push("arithmetic");
    }

    const secondDiff =
      getDifferences(firstDiff);
    if (
      secondDiff.length > 0 &&
      allEqual(secondDiff)
    ) {
      matches.push(
        "second-difference",
      );
    }
  }

  if (
    sequence.length >= 3 &&
    sequence.every(
      (value) => value !== 0,
    )
  ) {
    const ratios = sequence
      .slice(1)
      .map(
        (value, index) =>
          value / sequence[index]!,
      );
    if (
      ratios.every(
        (ratio) =>
          Number.isInteger(ratio) &&
          ratio === ratios[0],
      )
    ) {
      matches.push("geometric");
    }
  }

  const squareOffsets = sequence.map(
    (value, index) =>
      value - (index + 1) ** 2,
  );
  if (allEqual(squareOffsets)) {
    matches.push("square-offset");
  }

  const cubeOffsets = sequence.map(
    (value, index) =>
      value - (index + 1) ** 3,
  );
  if (allEqual(cubeOffsets)) {
    matches.push("cube-offset");
  }

  if (sequence.length >= 6) {
    const odd = sequence.filter(
      (_, index) => index % 2 === 0,
    );
    const even = sequence.filter(
      (_, index) => index % 2 === 1,
    );
    if (
      allEqual(getDifferences(odd)) &&
      allEqual(getDifferences(even))
    ) {
      matches.push("interleaved");
    }
  }

  return [...new Set(matches)];
}

function nextSeriesTerm(
  sequence: number[],
  ruleId: PatternRuleId,
) {
  if (ruleId === "math-power") {
    const n = sequence.length + 1;
    return n ** 2 + 1;
  }

  if (
    ruleId === "math-difference-layer"
  ) {
    const firstDiff =
      getDifferences(sequence);
    const secondDiff =
      getDifferences(firstDiff);
    const delta =
      secondDiff[0] ?? 3;
    return (
      sequence[sequence.length - 1]! +
      firstDiff[firstDiff.length - 1]! +
      delta
    );
  }

  const odd = sequence.filter(
    (_, index) => index % 2 === 0,
  );
  const even = sequence.filter(
    (_, index) => index % 2 === 1,
  );
  if (sequence.length % 2 === 0) {
    return odd[odd.length - 1]! + 2;
  }
  return even[even.length - 1]! + 10;
}

export function ensureUniqueSeriesRule(
  seed: number[],
  ruleId: PatternRuleId,
) {
  const sequence = [...seed];
  let guard = 0;

  while (
    guard < 5 &&
    findMatchingSeriesRules(sequence)
      .length > 1
  ) {
    sequence.push(
      nextSeriesTerm(
        sequence,
        ruleId,
      ),
    );
    guard += 1;
  }

  return sequence;
}

function createSeriesScenario(
  motif: QuantMotif,
): PatternInferenceScenario {
  const ruleId =
    normalizePatternRuleId(motif.id);
  const seed =
    ruleId === "math-difference-layer"
      ? [3, 7, 13, 21]
      : ruleId === "math-interleaved"
        ? [1, 10, 3, 20, 5, 30]
        : [2, 5, 10, 17];
  const sequence =
    ensureUniqueSeriesRule(
      seed,
      ruleId,
    );
  const answer = String(
    nextSeriesTerm(
      sequence,
      ruleId,
    ),
  );
  const distractors = [
    String(
      Number(answer) +
        (ruleId ===
        "math-interleaved"
          ? 10
          : 2),
    ),
    String(
      sequence[
        sequence.length - 1
      ]! +
        getDifferences(sequence).at(
          -1,
        )!,
    ),
    String(Number(answer) - 1),
  ];
  const display = sequence.join(", ");
  const options = buildOptions(
    answer,
    distractors,
  );

  return {
    stem: `Find the next term in the series: $${display}, \\ ?$`,
    answer,
    options,
    explanation: [
      `The sequence is checked for ambiguity before use.`,
      PATTERN_RULES[ruleId].traceLabel,
      `So the next term is $${answer}$.`,
    ].join("\n"),
    reasoningSteps: [
      {
        operation: "infer",
        detail:
          "Identify the transformation rule between terms.",
      },
      {
        operation: "compare",
        detail:
          "Reject ambiguous competing rules before asking for the next term.",
      },
    ],
    structuralSignature: `${ruleId}:series:${sequence.join("-")}`,
  };
}

function createLetterSeriesScenario(
  motif: QuantMotif,
  values: Record<string, number>,
): PatternInferenceScenario {
  const ruleId =
    normalizePatternRuleId(motif.id);
  const seed =
    ruleId === "shift-alternating"
      ? ["C", "B", "D", "C", "E"]
      : ruleId === "shift-incremental"
        ? ["A", "B", "D", "G", "K"]
        : ["A", "D", "G", "J"];
  const answer =
    ruleId === "shift-alternating"
      ? "D"
      : ruleId === "shift-incremental"
        ? "P"
        : shiftLetterCircular(
            seed.at(-1)!,
            values.shift ?? 3,
          );
  const options = buildOptions(
    answer,
    [
      shiftLetterCircular(answer, 1),
      shiftLetterCircular(answer, -1),
      oppositeLetter(answer),
    ],
  );

  return {
    stem: `Find the next letter in the series: $${seed.join(", ")}, \\ ?$`,
    answer,
    options,
    explanation: [
      PATTERN_RULES[ruleId].traceLabel,
      `So the next letter is $${answer}$.`,
    ].join("\n"),
    reasoningSteps: [
      {
        operation: "infer",
        detail:
          "Infer the alphabetic transformation between terms.",
      },
      {
        operation: "transform",
        detail:
          "Apply the same transformation to obtain the next letter.",
      },
    ],
    structuralSignature: `${ruleId}:letter-series:${seed.join("-")}`,
  };
}

function createAnalogyScenario(
  motif: QuantMotif,
  values: Record<string, number>,
): PatternInferenceScenario {
  const ruleId =
    normalizePatternRuleId(motif.id);
  const left = "MIND";
  const right =
    applyPatternRuleToWord(
      left,
      ruleId,
      values,
    );
  const target = "BANK";
  const answer =
    applyPatternRuleToWord(
      target,
      ruleId,
      values,
    );
  const options = buildOptions(
    answer,
    [
      applyPatternRuleToWord(
        target,
        "map-opposite",
      ),
      applyPatternRuleToWord(
        target,
        "shift-fixed",
        { shift: -1 },
      ),
      swapAdjacentPairs(target),
    ],
  );

  return {
    stem: `Complete the analogy: $${left} \\xrightarrow{R} ${right} :: ${target} \\xrightarrow{R} ?$`,
    answer,
    options,
    explanation: buildPatternTrace(
      target,
      answer,
      ruleId,
      values,
    ).join("\n"),
    reasoningSteps: [
      {
        operation: "infer",
        detail:
          "Infer the shared transformation from the first pair.",
      },
      {
        operation: "transform",
        detail:
          "Apply the same transformation to the second input.",
      },
    ],
    structuralSignature: `${ruleId}:analogy:${left}:${target}`,
  };
}

function createClassificationScenario(): PatternInferenceScenario {
  const options = [
    "ACE",
    "BDF",
    "CEG",
    "DHL",
  ];
  const correct = "DHL";
  const shuffled = shuffle(
    options.map((value) => ({
      value,
      isCorrect: value === correct,
      distractorType:
        value === correct
          ? undefined
          : "wrongIntermediateValue",
      likelyMistake:
        value === correct
          ? undefined
          : "Focused on letters instead of the rank gaps.",
      reasoningTrap:
        value === correct
          ? undefined
          : "Classification trap.",
    })),
  ) as OptionMetadata[];

  return {
    stem: `Choose the odd one out by inspecting alphabet-rank gaps: $ACE, BDF, CEG, DHL$`,
    answer: correct,
    options: {
      options: shuffled.map(
        (option) => option.value,
      ),
      correct: shuffled.findIndex(
        (option) => option.isCorrect,
      ),
      optionMetadata: shuffled,
    },
    explanation:
      "In $ACE$, $BDF$, and $CEG$, consecutive letters move by $+2, +2$. In $DHL$, the gaps are $+4, +4$, so it is the odd one out.",
    reasoningSteps: [
      {
        operation: "compare",
        detail:
          "Compare the same structural property across all options.",
      },
    ],
    structuralSignature:
      "classification:rank-gap",
  };
}

export function createPatternInferenceScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  subtopic: string,
  values: Record<string, number> = {},
): PatternInferenceScenario {
  const normalizedSubtopic =
    subtopic.toLowerCase();

  if (
    normalizedSubtopic.includes(
      "letter series",
    )
  ) {
    return createLetterSeriesScenario(
      motif,
      values,
    );
  }

  if (
    normalizedSubtopic.includes(
      "series",
    ) ||
    motif.id.startsWith("math-")
  ) {
    return createSeriesScenario(motif);
  }

  if (
    normalizedSubtopic.includes(
      "analogy",
    )
  ) {
    return createAnalogyScenario(
      motif,
      values,
    );
  }

  if (
    normalizedSubtopic.includes(
      "odd",
    ) ||
    normalizedSubtopic.includes(
      "classification",
    )
  ) {
    return createClassificationScenario();
  }

  const example = pickRandomItem([
    "MIND",
    "TEAM",
    "ROAD",
  ]);
  const target =
    difficulty === "Easy"
      ? "BANK"
      : "MARKET";
  const ruleId =
    normalizePatternRuleId(motif.id);
  const codedExample =
    applyPatternRuleToWord(
      example,
      ruleId,
      values,
    );
  const answer =
    applyPatternRuleToWord(
      target,
      ruleId,
      values,
    );
  const options = buildOptions(
    answer,
    [
      applyPatternRuleToWord(
        target,
        "shift-fixed",
        { shift: -1 },
      ),
      applyPatternRuleToWord(
        target,
        "map-opposite",
      ),
      swapAdjacentPairs(target),
    ],
  );

  return {
    stem: `If $${example} \\xrightarrow{R} ${codedExample}$, then $${target} \\xrightarrow{R} ?$`,
    answer,
    options,
    explanation: buildPatternTrace(
      target,
      answer,
      ruleId,
      values,
    ).join("\n"),
    reasoningSteps: [
      {
        operation: "infer",
        detail:
          "Infer the hidden transformation rule from the coded example.",
      },
      {
        operation: "transform",
        detail:
          "Apply the same transformation to the target input.",
      },
    ],
    structuralSignature: `${ruleId}:coding:${target}`,
  };
}
