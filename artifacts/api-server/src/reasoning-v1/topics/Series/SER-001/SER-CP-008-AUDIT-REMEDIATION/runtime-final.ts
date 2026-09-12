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

export type GeneratedSerCp008FinalQuestion =
  | GeneratedSerCp008Question
  | GeneratedSerCp008MixedQuestion;

const SQUARE_SERIES_SHELLS = {
  "en-IN": [
    "Which term comes next in the series?",
    "Select the term that will come next in the following series.",
    "Choose the correct term to continue the series.",
    "Which of the following will replace the question mark in the series?",
  ],
  "hi-IN": [
    "श्रृंखला में अगला पद कौन-सा होगा?",
    "निम्न श्रृंखला में अगला आने वाला पद चुनिए।",
    "श्रृंखला को आगे बढ़ाने वाला सही पद चुनिए।",
    "श्रृंखला में प्रश्नवाचक चिन्ह के स्थान पर क्या आएगा?",
  ],
  "pa-IN": [
    "ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਪਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?",
    "ਹੇਠਾਂ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਆਉਣ ਵਾਲਾ ਪਦ ਚੁਣੋ।",
    "ਲੜੀ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣ ਵਾਲਾ ਸਹੀ ਪਦ ਚੁਣੋ।",
    "ਲੜੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕੀ ਆਵੇਗਾ?",
  ],
} as const;

function diversifyNarrowSourceShell(
  question: GeneratedSerCp008MixedQuestion,
  seed: number,
  locale: SerCp008Locale,
): GeneratedSerCp008MixedQuestion {
  if (question.qlId !== "SER-QL-023") return question;

  // This source family is mathematically narrow by design: consecutive square
  // roots coupled to wrapped alphabet positions. Preserve that rule instead of
  // inventing extra mathematics merely to inflate entropy, but vary the normal
  // competitive-exam instruction shell independently of answer position.
  const shellIndex = Math.floor(seed / 4) % SQUARE_SERIES_SHELLS[locale].length;
  const visibleSeries = question.stem.split("\n").at(-1)!;
  return {
    ...question,
    stem: `${SQUARE_SERIES_SHELLS[locale][shellIndex]}\n${visibleSeries}`,
  };
}

export function generateSerCp008Final(
  qlId: SerCp008AllProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008FinalQuestion {
  if ((SER_CP008_MIXED_QL_IDS as readonly string[]).includes(qlId)) {
    const mixed = generateSerCp008Mixed(qlId as SerCp008MixedQlId, seed, locale);
    return diversifyNarrowSourceShell(mixed, seed, locale);
  }
  return generateSerCp008(qlId as SerCp008CoreQlId, seed, locale);
}
