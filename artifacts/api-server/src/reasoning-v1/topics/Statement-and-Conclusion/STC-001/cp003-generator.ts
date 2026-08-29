import { STC_CP003_ORDER_AUTHORITIES } from "./cp003-order-authorities.ts";
import { STC_CP003_TEMPORAL_AUTHORITIES } from "./cp003-temporal-authorities.ts";
import { stcOrderEntails } from "./strict-order-solver.ts";
import { stcTemporalEntails } from "./temporal-trend-solver.ts";
import type {
  GeneratedStcQuestion,
  StcAnswerClass,
  StcLocale,
  StcOrderDefect,
  StcTemporalDefect,
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

function choosePair(seedBase: number): readonly [number, number] {
  const pair = PAIRS[mix32(seedBase ^ 0x9e3779b9) % PAIRS.length]!;
  return Boolean(mix32(seedBase ^ 0x85ebca6b) & 1) ? [pair[1], pair[0]] : pair;
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
  "en-IN": "Read the statement and decide which conclusion(s) logically follow from the stated relations only.",
  "hi-IN": "कथन पढ़िए और केवल दी गई संबंध-सूचना के आधार पर तय कीजिए कि कौन-सा/से निष्कर्ष तार्किक रूप से अनुसरण करता/करते हैं।",
  "pa-IN": "ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਕੇਵਲ ਦਿੱਤੀ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਤਰਕਸੰਗਤ ਤੌਰ ਤੇ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ।",
};

const ORDER_DEFECT_TEXT: Record<StcOrderDefect, Record<StcLocale, string>> = {
  REVERSED_ORDER: {
    "en-IN": "it reverses the established order",
    "hi-IN": "यह स्थापित क्रम को उलट देता है",
    "pa-IN": "ਇਹ ਸਥਾਪਿਤ ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  UNSUPPORTED_RELATION: {
    "en-IN": "it switches to a relation the statement never establishes",
    "hi-IN": "यह ऐसे संबंध पर चला जाता है जिसे कथन स्थापित नहीं करता",
    "pa-IN": "ਇਹ ਐਸੇ ਸੰਬੰਧ ਵੱਲ ਚਲਾ ਜਾਂਦਾ ਹੈ ਜੋ ਕਥਨ ਸਥਾਪਿਤ ਨਹੀਂ ਕਰਦਾ",
  },
  UNRELATED_ENTITY: {
    "en-IN": "it introduces an entity outside the stated comparison chain",
    "hi-IN": "यह तुलना-श्रृंखला से बाहर की इकाई जोड़ता है",
    "pa-IN": "ਇਹ ਤੁਲਨਾ-ਲੜੀ ਤੋਂ ਬਾਹਰ ਦੀ ਇਕਾਈ ਜੋੜਦਾ ਹੈ",
  },
};

const TEMPORAL_DEFECT_TEXT: Record<StcTemporalDefect, Record<StcLocale, string>> = {
  REVERSED_TIME: {
    "en-IN": "it reverses the established time order",
    "hi-IN": "यह स्थापित समय-क्रम को उलट देता है",
    "pa-IN": "ਇਹ ਸਥਾਪਿਤ ਸਮਾਂ-ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  REVERSED_TREND: {
    "en-IN": "it reverses the established direction of change",
    "hi-IN": "यह स्थापित परिवर्तन-दिशा को उलट देता है",
    "pa-IN": "ਇਹ ਸਥਾਪਿਤ ਬਦਲਾਅ ਦੀ ਦਿਸ਼ਾ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  UNSUPPORTED_EXTRA: {
    "en-IN": "it adds an event or metric not established by the statement",
    "hi-IN": "यह ऐसी घटना या माप जोड़ता है जिसे कथन स्थापित नहीं करता",
    "pa-IN": "ਇਹ ਐਸੀ ਘਟਨਾ ਜਾਂ ਮਾਪ ਜੋੜਦਾ ਹੈ ਜੋ ਕਥਨ ਸਥਾਪਿਤ ਨਹੀਂ ਕਰਦਾ",
  },
};

const FOLLOWS_TEXT: Record<StcLocale, string> = {
  "en-IN": "it is established by the direct or transitive relation",
  "hi-IN": "यह प्रत्यक्ष या संक्रमणीय संबंध से स्थापित होता है",
  "pa-IN": "ਇਹ ਸਿੱਧੇ ਜਾਂ ਸੰਕ੍ਰਾਮਕ ਸੰਬੰਧ ਤੋਂ ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ",
};

export function generateStcCp003Question(input: {
  readonly qlId: "STC-QL-005" | "STC-QL-006";
  readonly locale: StcLocale;
  readonly seed: number;
}): GeneratedStcQuestion {
  const base = mix32((input.seed >>> 0) ^ hashText(input.qlId));

  if (input.qlId === "STC-QL-005") {
    const scenario = STC_CP003_ORDER_AUTHORITIES[base % STC_CP003_ORDER_AUTHORITIES.length]!;
    const [firstIndex, secondIndex] = choosePair(base);
    const first = scenario.candidates[firstIndex]!;
    const second = scenario.candidates[secondIndex]!;
    const firstFollows = stcOrderEntails(scenario.premises, first.claim);
    const secondFollows = stcOrderEntails(scenario.premises, second.claim);
    const cls = answerClass(firstFollows, secondFollows);
    const reason = (follows: boolean, defect: StcOrderDefect | undefined) =>
      follows ? FOLLOWS_TEXT[input.locale] : defect ? ORDER_DEFECT_TEXT[defect][input.locale] : "not entailed";

    return {
      chapterId: "STC-001",
      checkpointId: "STC-CP-003",
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
        solver: "STRICT_ORDER_CLOSURE_V1",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockEligible: false,
        publicEligible: false,
      },
    };
  }

  const scenario = STC_CP003_TEMPORAL_AUTHORITIES[base % STC_CP003_TEMPORAL_AUTHORITIES.length]!;
  const [firstIndex, secondIndex] = choosePair(base);
  const first = scenario.candidates[firstIndex]!;
  const second = scenario.candidates[secondIndex]!;
  const firstFollows = stcTemporalEntails(scenario.premises, first.claim);
  const secondFollows = stcTemporalEntails(scenario.premises, second.claim);
  const cls = answerClass(firstFollows, secondFollows);
  const reason = (follows: boolean, defect: StcTemporalDefect | undefined) =>
    follows ? FOLLOWS_TEXT[input.locale] : defect ? TEMPORAL_DEFECT_TEXT[defect][input.locale] : "not entailed";

  return {
    chapterId: "STC-001",
    checkpointId: "STC-CP-003",
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
      solver: "TEMPORAL_TREND_CLOSURE_V1",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  };
}
