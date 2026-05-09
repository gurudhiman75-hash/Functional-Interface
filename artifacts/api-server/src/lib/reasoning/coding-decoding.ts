import type {
  DifficultyLabel,
  DistractorMetadata,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  pickRandomItem,
  shuffle,
} from "../shared";
import {
  applyPatternRuleToWord,
  buildPatternTrace,
  normalizePatternRuleId,
  shiftLetterCircular,
  swapAdjacentPairs,
} from "./pattern-inference";

const CODING_WORD_POOL = [
  "BANK",
  "MIND",
  "TEAM",
  "ROAD",
  "SCALE",
  "PLANT",
  "TRACK",
  "SMART",
  "CREDIT",
  "MARKET",
];

// Coding-decoding owns symbolic word transformation and coding-specific distractors.
// It does not own global orchestration, archetype selection, or difficulty scoring.
export function pickCodingWord(
  difficulty: DifficultyLabel,
) {
  const filteredWords =
    CODING_WORD_POOL.filter((word) =>
      difficulty === "Easy"
        ? word.length <= 5
        : difficulty === "Hard"
          ? word.length >= 5
          : word.length >= 4,
    );

  return pickRandomItem(
    filteredWords.length
      ? filteredWords
      : CODING_WORD_POOL,
  );
}

export function encodeWordByMotif(
  word: string,
  motif: QuantMotif,
  values: Record<string, number>,
) {
  if (
    motif.id ===
    "symbolic_position_encoding"
  ) {
    const shift = values.shift ?? 1;
    return word
      .split("")
      .map((char, index) =>
        index % 2 === 0
          ? String(
              char.charCodeAt(0) -
                64,
            )
          : shiftLetterCircular(
              char,
              shift,
            ),
      )
      .join("-");
  }

  switch (
    normalizePatternRuleId(motif.id)
  ) {
    case "map-rank-math":
      return word
        .split("")
        .map(
          (char) =>
            char.charCodeAt(0) -
            64,
        )
        .join("-");
    default:
      return applyPatternRuleToWord(
        word,
        motif.id,
        values,
      );
  }
}

export function buildCodingQuestionStem(
  sourceWord: string,
  motif: QuantMotif,
  values: Record<string, number>,
  exampleWord?: string,
  exampleCode?: string,
) {
  const ruleId =
    normalizePatternRuleId(motif.id);

  switch (motif.id) {
    case "direct_alphabet_shift":
      return `If each letter is shifted forward by $${values.shift ?? 1}$, how will $${sourceWord}$ be coded?`;
    case "reverse_alphabet_mapping":
      return `If every letter is replaced by its opposite alphabet letter using $A \\to Z$, how will $${sourceWord}$ be coded?`;
    case "symbolic_position_encoding":
      return `If odd-position letters are converted into alphabet ranks and even-position letters are shifted, how will $${sourceWord}$ be coded?`;
    case "conditional_letter_mapping":
      return `If vowels are moved one step forward and consonants one step backward, how will $${sourceWord}$ be coded?`;
    case "multi_stage_word_transform":
      return `If adjacent positions are swapped as $1 \\leftrightarrow 2$, $3 \\leftrightarrow 4$, how will $${sourceWord}$ be coded?`;
    case "inference_based_decoding":
      if (exampleWord && exampleCode) {
        return `If $${exampleWord} \\xrightarrow{R} ${exampleCode}$, then $${sourceWord} \\xrightarrow{R} ?$`;
      }

      return `Infer the hidden coding rule and determine the code of $${sourceWord}$.`;
    default:
      return `Using the ${ruleId.replaceAll("-", " ")} rule, how will $${sourceWord}$ be coded?`;
  }
}

export function buildCodingDistractorOptions(
  word: string,
  correctCode: string,
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  values: Record<string, number>,
) {
  const options = new Map<
    string,
    OptionMetadata
  >();
  options.set(correctCode, {
    value: correctCode,
    isCorrect: true,
  });

  const addOption = (
    value: string,
    metadata: DistractorMetadata,
  ) => {
    if (!options.has(value)) {
      options.set(value, {
        value,
        isCorrect: false,
        ...metadata,
      });
    }
  };

  addOption(
    word
      .split("")
      .map((char) =>
        shiftLetterCircular(
          char,
          -(values.shift ?? 1),
        ),
      )
      .join(""),
    {
      distractorType:
        "wrongIntermediateValue",
      likelyMistake:
        "Applied the shift in the opposite direction.",
      reasoningTrap:
        "Reverse-direction coding trap.",
    },
  );

  addOption(
    word
      .split("")
      .map((char) =>
        shiftLetterCircular(
          char,
          (values.shift ?? 1) + 1,
        ),
      )
      .join(""),
    {
      distractorType:
        "arithmeticSlip",
      likelyMistake:
        "Used an off-by-one letter movement.",
      reasoningTrap:
        "Close-shift coding trap.",
    },
  );

  addOption(
    swapAdjacentPairs(word),
    {
      distractorType:
        "comparisonTrap",
      likelyMistake:
        "Reordered the word without completing the coding rule.",
      reasoningTrap:
        "Partial transformation trap.",
    },
  );

  if (
    motif.id ===
    "inference_based_decoding"
  ) {
    addOption(
      word
        .split("")
        .map((char, index) =>
          shiftLetterCircular(
            char,
            index,
          ),
        )
        .join(""),
      {
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Started the inferred shift sequence from the wrong position.",
        reasoningTrap:
          "Inference-sequence trap.",
      },
    );
  }

  while (options.size < 4) {
    addOption(
      word
        .split("")
        .map((char, index) =>
          shiftLetterCircular(
            char,
            difficulty === "Hard"
              ? (index % 2) + 1
              : 1,
          ),
        )
        .join(""),
      {
        distractorType:
          "prematureRounding",
        likelyMistake:
          "Simplified the coding rule too early.",
        reasoningTrap:
          "Oversimplified coding trap.",
      },
    );
  }

  const correctOption =
    options.get(correctCode)!;
  const distractors = [
    ...options.values(),
  ]
    .filter(
      (option) => !option.isCorrect,
    )
    .slice(0, 3);

  const shuffled = shuffle([
    correctOption,
    ...distractors,
  ]);

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

export function buildCodingExplanation(
  sourceWord: string,
  codedWord: string,
  motif?: QuantMotif,
  values: Record<string, number> = {},
) {
  if (motif) {
    return buildPatternTrace(
      sourceWord,
      codedWord,
      motif.id,
      values,
    ).join("\n");
  }

  return `Apply the coding rule step by step to $${sourceWord}$ and obtain $${codedWord}$.`;
}
