import {
  generateSerCp008,
  type GeneratedSerCp008Question,
  type SerCp008Locale,
} from "./runtime";
import {
  generateSerCp008Mixed,
  type GeneratedSerCp008MixedQuestion,
} from "./mixed-runtime";
import {
  SER_CP008_MIXED_QL_IDS,
  type SerCp008AllProvisionalQlId,
  type SerCp008CoreQlId,
  type SerCp008MixedQlId,
} from "./question-language";
import { letterAtOneBased, oneBasedPosition } from "./independent-solver";

export type GeneratedSerCp008FinalQuestion =
  | GeneratedSerCp008Question
  | GeneratedSerCp008MixedQuestion;

const SQUARE_SERIES_SHELLS = {
  "en-IN": [
    "Which term comes next in the series?",
    "Select the term that will come next in the following series.",
    "Choose the correct term to continue the series.",
    "Which of the following will replace the question mark in the series?",
    "Select the correct option to complete the series.",
    "Find the term that logically continues the series.",
  ],
  "hi-IN": [
    "श्रृंखला में अगला पद कौन-सा होगा?",
    "निम्न श्रृंखला में अगला आने वाला पद चुनिए।",
    "श्रृंखला को आगे बढ़ाने वाला सही पद चुनिए।",
    "श्रृंखला में प्रश्नवाचक चिन्ह के स्थान पर क्या आएगा?",
    "श्रृंखला पूरी करने के लिए सही विकल्प चुनिए।",
    "श्रृंखला को तार्किक रूप से आगे बढ़ाने वाला पद ज्ञात कीजिए।",
  ],
  "pa-IN": [
    "ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਪਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?",
    "ਹੇਠਾਂ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਆਉਣ ਵਾਲਾ ਪਦ ਚੁਣੋ।",
    "ਲੜੀ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣ ਵਾਲਾ ਸਹੀ ਪਦ ਚੁਣੋ।",
    "ਲੜੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕੀ ਆਵੇਗਾ?",
    "ਲੜੀ ਪੂਰੀ ਕਰਨ ਲਈ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਲੜੀ ਨੂੰ ਤਰਕ ਅਨੁਸਾਰ ਅੱਗੇ ਵਧਾਉਣ ਵਾਲਾ ਪਦ ਲੱਭੋ।",
  ],
} as const;

const MULTI_BLANK_MASKS: readonly (readonly number[])[] = [
  [2, 3, 5, 10, 15],
  [3, 6, 9, 12, 14],
  [2, 7, 9, 13, 15],
  [5, 6, 11, 12, 14],
  [3, 7, 10, 13, 14],
  [2, 6, 10, 12, 15],
  [3, 5, 9, 11, 14],
  [2, 7, 10, 13, 15],
  [3, 6, 10, 12, 15],
  [2, 7, 9, 12, 14],
  [5, 6, 10, 13, 15],
  [3, 7, 11, 12, 14],
  [2, 6, 9, 13, 15],
  [3, 5, 10, 12, 14],
  [2, 5, 7, 11, 14],
  [3, 6, 8, 13, 15],
  [2, 6, 9, 11, 13],
  [3, 5, 10, 14, 15],
  [2, 7, 8, 12, 15],
  [3, 6, 9, 13, 14],
  [2, 5, 10, 11, 15],
  [3, 7, 9, 12, 14],
  [2, 6, 11, 13, 15],
  [3, 5, 8, 10, 14],
];

function diversifyNarrowSourceShell(
  question: GeneratedSerCp008MixedQuestion,
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008MixedQuestion {
  if (question.qlId !== "SER-QL-023" && question.qlId !== "SER-QL-024") return question;

  // These two square-coupled source families are deliberately narrow. Preserve
  // the proven mathematics instead of inventing extra transforms merely to
  // inflate entropy, while varying normal competitive-exam instruction shells
  // independently of the answer position.
  const shellCount = SQUARE_SERIES_SHELLS[locale].length;
  const shellIndex = (Math.floor(seed / 4) + Math.floor(seed / 17)) % shellCount;
  const visibleSeries = question.stem.split("\n").at(-1)!;
  return {
    ...question,
    stem: `${SQUARE_SERIES_SHELLS[locale][shellIndex]}\n${visibleSeries}`,
  };
}

function diversifyMultiBlankRow(
  question: GeneratedSerCp008MixedQuestion,
  seed: number,
): GeneratedSerCp008MixedQuestion {
  if (question.qlId !== "SER-QL-028") return question;

  const stemLines = question.stem.split("\n");
  const row = stemLines.at(-1)?.trim().split(/\s+/).filter(Boolean) ?? [];
  const start = Number(row[0]);
  if (!Number.isInteger(start) || row.length !== 16) return question;

  const full: string[] = [];
  for (let block = 0; block < 4; block += 1) {
    const first = start + block * 2;
    const second = first + 1;
    full.push(String(first), String(second), letterAtOneBased(first), letterAtOneBased(second));
  }

  // Blank placement is an editorial degree of freedom in this source-backed
  // family. Use a broader, deterministic mask library rather than adding fake
  // mathematics or longer values merely to manufacture diversity.
  const maskIndex = (Math.floor(seed / 4) + Math.floor(seed / 31)) % MULTI_BLANK_MASKS.length;
  const mask = MULTI_BLANK_MASKS[maskIndex]!;
  const displayed = full.map((value, index) => mask.includes(index) ? "_" : value);
  const missing = mask.map((index) => full[index]!);
  const correctAnswer = missing.join(" ");

  const wrongCandidates = [
    { value: [...missing].reverse().join(" "), errorLabel: "REVERSED_BLANK_ORDER" },
    {
      value: missing.map((value) => /^[A-Z]$/.test(value) ? letterAtOneBased(oneBasedPosition(value) + 1) : value).join(" "),
      errorLabel: "SHIFTED_LETTER_CORRESPONDENCE",
    },
    {
      value: missing.map((value) => /^\d+$/.test(value) ? String(Number(value) + 1) : value).join(" "),
      errorLabel: "SHIFTED_NUMBER_SEQUENCE",
    },
    {
      value: missing.map((value) => /^[A-Z]$/.test(value)
        ? letterAtOneBased(oneBasedPosition(value) + 1)
        : String(Number(value) + 1)).join(" "),
      errorLabel: "SHIFTED_BOTH_CHANNELS",
    },
    {
      value: [...missing.slice(1), missing[0]!].join(" "),
      errorLabel: "ROTATED_BLANK_ORDER",
    },
  ];

  const seen = new Set<string>([correctAnswer]);
  const wrong: { value: string; errorLabel: string }[] = [];
  for (const candidate of wrongCandidates) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) return question;

  const options: { value: string; errorLabel: string | null }[] = [...wrong];
  options.splice(question.correctIndex, 0, { value: correctAnswer, errorLabel: null });

  const answerLine = question.explanation.at(-1) ?? "";
  const answerPrefix = answerLine.includes(":") ? answerLine.slice(0, answerLine.indexOf(":")) : answerLine;
  const explanation = [
    ...question.explanation.slice(0, -1),
    `${answerPrefix}: ${correctAnswer}.`,
  ];

  return {
    ...question,
    stem: `${stemLines.slice(0, -1).join("\n")}\n${displayed.join(" ")}`,
    correctAnswer,
    options,
    explanation,
    structuralFeatures: {
      ...question.structuralFeatures,
      blankCount: mask.length,
      blankMaskVariant: maskIndex,
    },
  };
}

export function generateSerCp008Final(
  qlId: SerCp008AllProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008FinalQuestion {
  if ((SER_CP008_MIXED_QL_IDS as readonly string[]).includes(qlId)) {
    const mixed = generateSerCp008Mixed(qlId as SerCp008MixedQlId, seed, locale);
    return diversifyMultiBlankRow(diversifyNarrowSourceShell(mixed, seed, locale), seed);
  }
  return generateSerCp008(qlId as SerCp008CoreQlId, seed, locale);
}
