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

function shiftLetter(
  char: string,
  shift: number,
) {
  const base =
    char.charCodeAt(0) - 65;
  const normalized =
    (base + shift + 26 * 3) % 26;

  return String.fromCharCode(
    normalized + 65,
  );
}

function reverseAlphabetLetter(
  char: string,
) {
  const index =
    char.charCodeAt(0) - 65;

  return String.fromCharCode(
    90 - index,
  );
}

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
  const shift = values.shift ?? 1;

  switch (motif.id) {
    case "direct_alphabet_shift":
      return word
        .split("")
        .map((char) =>
          shiftLetter(char, shift),
        )
        .join("");
    case "reverse_alphabet_mapping":
      return word
        .split("")
        .map((char) =>
          reverseAlphabetLetter(
            char,
          ),
        )
        .join("");
    case "symbolic_position_encoding":
      return word
        .split("")
        .map((char, index) =>
          index % 2 === 0
            ? String(
                char.charCodeAt(0) -
                  64,
              )
            : shiftLetter(
                char,
                shift,
              ),
        )
        .join("-");
    case "conditional_letter_mapping":
      return word
        .split("")
        .map((char) =>
          /[AEIOU]/.test(char)
            ? shiftLetter(
                char,
                1,
              )
            : shiftLetter(
                char,
                -1,
              ),
        )
        .join("");
    case "multi_stage_word_transform":
      return word
        .split("")
        .reverse()
        .map((char, index) =>
          shiftLetter(
            char,
            index % 2 === 0
              ? 1
              : 2,
          ),
        )
        .join("");
    case "inference_based_decoding":
      return word
        .split("")
        .map((char, index) =>
          shiftLetter(
            char,
            index + 1,
          ),
        )
        .join("");
    default:
      return word
        .split("")
        .map((char) =>
          shiftLetter(char, shift),
        )
        .join("");
  }
}

export function buildCodingQuestionStem(
  sourceWord: string,
  motif: QuantMotif,
  values: Record<string, number>,
  exampleWord?: string,
  exampleCode?: string,
) {
  switch (motif.id) {
    case "direct_alphabet_shift":
      return `If each letter is shifted forward by ${values.shift ?? 1}, how will ${sourceWord} be coded?`;
    case "reverse_alphabet_mapping":
      return `If every letter is replaced by its opposite alphabet letter, how will ${sourceWord} be coded?`;
    case "symbolic_position_encoding":
      return `If odd-position letters are converted into positions and even-position letters are shifted, how will ${sourceWord} be coded?`;
    case "conditional_letter_mapping":
      return `If vowels are moved one step forward and consonants one step backward, how will ${sourceWord} be coded?`;
    case "multi_stage_word_transform":
      return `If the word is first reversed and then alternate letters are shifted, how will ${sourceWord} be coded?`;
    case "inference_based_decoding":
      if (exampleWord && exampleCode) {
        return `If ${exampleWord} is coded as ${exampleCode}, then how will ${sourceWord} be coded?`;
      }

      return `Infer the hidden coding rule and determine the code of ${sourceWord}.`;
    default:
      return `How will ${sourceWord} be coded according to the given rule?`;
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
        shiftLetter(
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
        shiftLetter(
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
    word
      .split("")
      .reverse()
      .join(""),
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
          shiftLetter(
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
          shiftLetter(
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
) {
  return `Apply the coding rule step by step to ${sourceWord} and obtain ${codedWord}.`;
}
