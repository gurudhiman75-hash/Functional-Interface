import { STC_CP002_CONDITIONAL_AUTHORITIES } from "./cp002-conditional-authorities.ts";
import { STC_CP002_MODAL_AUTHORITIES } from "./cp002-modal-authorities.ts";
import { stcModalEntails } from "./modal-strength-solver.ts";
import { stcEntails } from "./truth-model-solver.ts";
import type {
  GeneratedStcQuestion,
  StcAnswerClass,
  StcLocale,
  StcLogicalDefect,
  StcModalDefect,
} from "./types.ts";

const PAIRS = [
  [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
] as const;

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function answerClass(first: boolean, second: boolean): StcAnswerClass {
  if (first && second) return "BOTH";
  if (first) return "ONLY_I";
  if (second) return "ONLY_II";
  return "NEITHER";
}

function indexForAnswer(value: StcAnswerClass): number {
  switch (value) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

const OPTION_TEXT: Record<StcLocale, readonly [string, string, string, string]> = {
  "en-IN": ["Only conclusion I follows", "Only conclusion II follows", "Both conclusions I and II follow", "Neither conclusion I nor II follows"],
  "hi-IN": ["केवल निष्कर्ष I अनुसरण करता है", "केवल निष्कर्ष II अनुसरण करता है", "निष्कर्ष I और II दोनों अनुसरण करते हैं", "न तो निष्कर्ष I और न ही II अनुसरण करता है"],
  "pa-IN": ["ਕੇਵਲ ਨਤੀਜਾ I ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਕੇਵਲ ਨਤੀਜਾ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ", "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ"],
};

const STEM_PREFIX: Record<StcLocale, string> = {
  "en-IN": "Read the statement and decide which conclusion(s) necessarily follow from it.",
  "hi-IN": "कथन पढ़िए और तय कीजिए कि कौन-सा/से निष्कर्ष उससे अनिवार्य रूप से अनुसरण करता/करते हैं।",
  "pa-IN": "ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਇਸ ਤੋਂ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ।",
};

const LOGICAL_DEFECT_TEXT: Record<StcLogicalDefect, Record<StcLocale, string>> = {
  POLARITY_FLIP: {
    "en-IN": "it reverses the stated fact",
    "hi-IN": "यह कथन की बात को उलट देता है",
    "pa-IN": "ਇਹ ਕਥਨ ਦੀ ਗੱਲ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  UNSUPPORTED_EXTRA: {
    "en-IN": "it adds information the statement never gives",
    "hi-IN": "यह ऐसी अतिरिक्त बात जोड़ता है जो कथन में दी ही नहीं गई",
    "pa-IN": "ਇਹ ਐਸੀ ਵਾਧੂ ਗੱਲ ਜੋੜਦਾ ਹੈ ਜੋ ਕਥਨ ਵਿੱਚ ਦਿੱਤੀ ਹੀ ਨਹੀਂ ਗਈ",
  },
  OVERCLAIM: {
    "en-IN": "it claims more than the statement proves",
    "hi-IN": "यह कथन से सिद्ध होने वाली बात से अधिक दावा करता है",
    "pa-IN": "ਇਹ ਕਥਨ ਤੋਂ ਸਾਬਤ ਹੋਣ ਵਾਲੀ ਗੱਲ ਨਾਲੋਂ ਵੱਧ ਦਾਅਵਾ ਕਰਦਾ ਹੈ",
  },
  INVALID_COMBINATION: {
    "en-IN": "it treats an alternative as if every part were compulsory",
    "hi-IN": "यह विकल्प को ऐसे मानता है जैसे हर भाग अनिवार्य हो",
    "pa-IN": "ਇਹ ਵਿਕਲਪ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਮੰਨਦਾ ਹੈ ਜਿਵੇਂ ਹਰ ਹਿੱਸਾ ਲਾਜ਼ਮੀ ਹੋਵੇ",
  },
  CONVERSE: {
    "en-IN": "it reverses the direction of the given if-then rule",
    "hi-IN": "यह दी गई यदि-तो शर्त की दिशा उलट देता है",
    "pa-IN": "ਇਹ ਦਿੱਤੀ ਜੇ-ਤਾਂ ਸ਼ਰਤ ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  INVERSE: {
    "en-IN": "the rule does not say that failure of the condition guarantees the opposite result",
    "hi-IN": "शर्त पूरी न होने पर विपरीत परिणाम निश्चित होगा, ऐसा कथन नहीं कहता",
    "pa-IN": "ਸ਼ਰਤ ਪੂਰੀ ਨਾ ਹੋਣ ਤੇ ਉਲਟ ਨਤੀਜਾ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ, ਕਥਨ ਇਹ ਨਹੀਂ ਕਹਿੰਦਾ",
  },
  DENYING_ANTECEDENT: {
    "en-IN": "it wrongly fixes the result just because the stated condition is absent",
    "hi-IN": "यह केवल शर्त के न होने से परिणाम को गलत रूप से निश्चित मानता है",
    "pa-IN": "ਇਹ ਕੇਵਲ ਸ਼ਰਤ ਨਾ ਹੋਣ ਕਰਕੇ ਨਤੀਜੇ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਨਿਸ਼ਚਿਤ ਮੰਨਦਾ ਹੈ",
  },
};

const MODAL_DEFECT_TEXT: Record<StcModalDefect, Record<StcLocale, string>> = {
  STRONGER_MODALITY: {
    "en-IN": "the statement says this may happen, not that it definitely will",
    "hi-IN": "कथन केवल संभावना बताता है, निश्चितता नहीं",
    "pa-IN": "ਕਥਨ ਸਿਰਫ਼ ਸੰਭਾਵਨਾ ਦੱਸਦਾ ਹੈ, ਨਿਸ਼ਚਿਤਤਾ ਨਹੀਂ",
  },
  POLARITY_FLIP: {
    "en-IN": "it says the opposite of the stated possibility or certainty",
    "hi-IN": "यह बताई गई संभावना या निश्चितता के विपरीत बात कहता है",
    "pa-IN": "ਇਹ ਦੱਸੀ ਸੰਭਾਵਨਾ ਜਾਂ ਨਿਸ਼ਚਿਤਤਾ ਦੇ ਉਲਟ ਗੱਲ ਕਹਿੰਦਾ ਹੈ",
  },
  UNSUPPORTED_EXTRA: {
    "en-IN": "it introduces an event the statement never mentions",
    "hi-IN": "यह ऐसी घटना जोड़ता है जिसका कथन में उल्लेख नहीं है",
    "pa-IN": "ਇਹ ਐਸੀ ਘਟਨਾ ਜੋੜਦਾ ਹੈ ਜਿਸਦਾ ਕਥਨ ਵਿੱਚ ਜ਼ਿਕਰ ਨਹੀਂ ਹੈ",
  },
};

const CONDITIONAL_FOLLOWS: Record<StcLocale, string> = {
  "en-IN": "the given condition(s) lead directly to this conclusion",
  "hi-IN": "दी गई शर्तों से यह निष्कर्ष सीधे निकलता है",
  "pa-IN": "ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਤੋਂ ਇਹ ਨਤੀਜਾ ਸਿੱਧਾ ਨਿਕਲਦਾ ਹੈ",
};

const MODAL_FOLLOWS: Record<StcLocale, string> = {
  "en-IN": "this does not claim more certainty than the statement provides",
  "hi-IN": "यह निष्कर्ष कथन से अधिक निश्चितता का दावा नहीं करता",
  "pa-IN": "ਇਹ ਨਤੀਜਾ ਕਥਨ ਨਾਲੋਂ ਵੱਧ ਨਿਸ਼ਚਿਤਤਾ ਦਾ ਦਾਅਵਾ ਨਹੀਂ ਕਰਦਾ",
};

function choosePair(seedBase: number): readonly [number, number] {
  const pair = PAIRS[mix32(seedBase ^ 0x9e3779b9) % PAIRS.length]!;
  return Boolean(mix32(seedBase ^ 0x85ebca6b) & 1) ? [pair[1], pair[0]] : pair;
}

export function generateStcCp002Question(input: {
  readonly qlId: "STC-QL-003" | "STC-QL-004";
  readonly locale: StcLocale;
  readonly seed: number;
}): GeneratedStcQuestion {
  const base = mix32((input.seed >>> 0) ^ hashText(input.qlId));

  if (input.qlId === "STC-QL-003") {
    const scenario = STC_CP002_CONDITIONAL_AUTHORITIES[base % STC_CP002_CONDITIONAL_AUTHORITIES.length]!;
    const [firstIndex, secondIndex] = choosePair(base);
    const first = scenario.candidates[firstIndex]!;
    const second = scenario.candidates[secondIndex]!;
    const firstFollows = stcEntails(scenario.premises, first.expression);
    const secondFollows = stcEntails(scenario.premises, second.expression);
    const cls = answerClass(firstFollows, secondFollows);
    const reason = (follows: boolean, defect: StcLogicalDefect | undefined) =>
      follows ? CONDITIONAL_FOLLOWS[input.locale] : defect ? LOGICAL_DEFECT_TEXT[defect][input.locale] : "the statement does not establish this";

    return {
      chapterId: "STC-001",
      checkpointId: "STC-CP-002",
      qlId: input.qlId,
      scenarioId: scenario.id,
      locale: input.locale,
      seed: input.seed,
      difficulty: scenario.difficulty,
      stem: `${STEM_PREFIX[input.locale]}\n\n${scenario.statement[input.locale]}`,
      conclusions: [first.text[input.locale], second.text[input.locale]],
      options: OPTION_TEXT[input.locale],
      correctIndex: indexForAnswer(cls),
      answerClass: cls,
      explanation: `I: ${first.text[input.locale]} — ${reason(firstFollows, first.defectIfNotEntailed)}. II: ${second.text[input.locale]} — ${reason(secondFollows, second.defectIfNotEntailed)}.`,
      metadata: {
        solver: "TRUTH_MODEL_ENTAILMENT_V1",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockEligible: false,
        publicEligible: false,
      },
    };
  }

  const scenario = STC_CP002_MODAL_AUTHORITIES[base % STC_CP002_MODAL_AUTHORITIES.length]!;
  const [firstIndex, secondIndex] = choosePair(base);
  const first = scenario.candidates[firstIndex]!;
  const second = scenario.candidates[secondIndex]!;
  const firstFollows = stcModalEntails(scenario.premise, first.claim);
  const secondFollows = stcModalEntails(scenario.premise, second.claim);
  const cls = answerClass(firstFollows, secondFollows);
  const reason = (follows: boolean, defect: StcModalDefect | undefined) =>
    follows ? MODAL_FOLLOWS[input.locale] : defect ? MODAL_DEFECT_TEXT[defect][input.locale] : "the statement does not establish this";

  return {
    chapterId: "STC-001",
    checkpointId: "STC-CP-002",
    qlId: input.qlId,
    scenarioId: scenario.id,
    locale: input.locale,
    seed: input.seed,
    difficulty: scenario.difficulty,
    stem: `${STEM_PREFIX[input.locale]}\n\n${scenario.statement[input.locale]}`,
    conclusions: [first.text[input.locale], second.text[input.locale]],
    options: OPTION_TEXT[input.locale],
    correctIndex: indexForAnswer(cls),
    answerClass: cls,
    explanation: `I: ${first.text[input.locale]} — ${reason(firstFollows, first.defectIfNotEntailed)}. II: ${second.text[input.locale]} — ${reason(secondFollows, second.defectIfNotEntailed)}.`,
    metadata: {
      solver: "MODAL_STRENGTH_ENTAILMENT_V1",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  };
}
