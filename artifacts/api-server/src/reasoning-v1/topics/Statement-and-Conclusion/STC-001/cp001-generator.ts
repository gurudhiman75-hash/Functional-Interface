import { STC_CP001_ALL_AUTHORITIES } from "./cp001-authority-registry.ts";
import { STC_EXAM_REALNESS_CP001_AUTHORITIES } from "./exam-realness-expansion-cp001-v1.ts";
import { stcEntails } from "./truth-model-solver.ts";
import type { GeneratedStcQuestion, StcAnswerClass, StcLocale, StcLogicalDefect, StcQlId, StcScenarioAuthority } from "./types.ts";

const PAIRS = [
  [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
] as const;

const GENERATION_AUTHORITIES = [
  ...STC_CP001_ALL_AUTHORITIES,
  ...STC_EXAM_REALNESS_CP001_AUTHORITIES,
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

const OPTION_TEXT: Record<StcLocale, readonly [string, string, string, string]> = {
  "en-IN": ["Only conclusion I follows", "Only conclusion II follows", "Both conclusions I and II follow", "Neither conclusion I nor II follows"],
  "hi-IN": ["केवल निष्कर्ष I अनुसरण करता है", "केवल निष्कर्ष II अनुसरण करता है", "निष्कर्ष I और II दोनों अनुसरण करते हैं", "न तो निष्कर्ष I और न ही II अनुसरण करता है"],
  "pa-IN": ["ਕੇਵਲ ਨਤੀਜਾ I ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਕੇਵਲ ਨਤੀਜਾ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ", "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ"],
};

const STEM_PREFIX: Record<StcLocale, string> = {
  "en-IN": "Read the statement and decide which conclusion(s) logically follow. Do not use outside knowledge.",
  "hi-IN": "कथन पढ़िए और तय कीजिए कि कौन-सा/से निष्कर्ष तार्किक रूप से अनुसरण करता/करते हैं। बाहरी जानकारी का उपयोग न करें।",
  "pa-IN": "ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਤਰਕਸੰਗਤ ਤੌਰ ਤੇ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ। ਬਾਹਰੀ ਜਾਣਕਾਰੀ ਨਾ ਵਰਤੋ।",
};

const WHY_FOLLOWS: Record<StcLocale, string> = {
  "en-IN": "this is directly supported by the statement",
  "hi-IN": "यह निष्कर्ष कथन से सीधे निकलता है",
  "pa-IN": "ਇਹ ਨਤੀਜਾ ਕਥਨ ਤੋਂ ਸਿੱਧਾ ਨਿਕਲਦਾ ਹੈ",
};

const WHY_NOT: Record<StcLocale, string> = {
  "en-IN": "the statement does not establish this",
  "hi-IN": "कथन से यह बात निश्चित नहीं होती",
  "pa-IN": "ਕਥਨ ਤੋਂ ਇਹ ਗੱਲ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੁੰਦੀ",
};

const DEFECT_TEXT: Record<StcLogicalDefect, Record<StcLocale, string>> = {
  POLARITY_FLIP: {
    "en-IN": "this says the opposite of the stated fact",
    "hi-IN": "यह कथन में दी गई बात के विपरीत है",
    "pa-IN": "ਇਹ ਕਥਨ ਵਿੱਚ ਦਿੱਤੀ ਗੱਲ ਦੇ ਉਲਟ ਹੈ",
  },
  UNSUPPORTED_EXTRA: {
    "en-IN": "this adds a fact that the statement never gives",
    "hi-IN": "यह ऐसी अतिरिक्त बात जोड़ता है जो कथन में दी ही नहीं गई",
    "pa-IN": "ਇਹ ਐਸੀ ਵਾਧੂ ਗੱਲ ਜੋੜਦਾ ਹੈ ਜੋ ਕਥਨ ਵਿੱਚ ਦਿੱਤੀ ਹੀ ਨਹੀਂ ਗਈ",
  },
  OVERCLAIM: {
    "en-IN": "this goes beyond what the statement actually says",
    "hi-IN": "यह कथन में दी गई जानकारी से अधिक दावा करता है",
    "pa-IN": "ਇਹ ਕਥਨ ਵਿੱਚ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਨਾਲੋਂ ਵੱਧ ਦਾਅਵਾ ਕਰਦਾ ਹੈ",
  },
  INVALID_COMBINATION: {
    "en-IN": "this treats an alternative as though every part were compulsory",
    "hi-IN": "यह विकल्प को ऐसे मानता है जैसे हर भाग अनिवार्य हो",
    "pa-IN": "ਇਹ ਵਿਕਲਪ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਮੰਨਦਾ ਹੈ ਜਿਵੇਂ ਹਰ ਹਿੱਸਾ ਲਾਜ਼ਮੀ ਹੋਵੇ",
  },
  CONVERSE: {
    "en-IN": "this reverses the direction of the stated rule",
    "hi-IN": "यह दी गई शर्त की दिशा उलट देता है",
    "pa-IN": "ਇਹ ਦਿੱਤੀ ਸ਼ਰਤ ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  INVERSE: {
    "en-IN": "the statement does not guarantee the opposite result when the condition is absent",
    "hi-IN": "शर्त न होने पर विपरीत परिणाम निश्चित होगा, ऐसा कथन नहीं कहता",
    "pa-IN": "ਸ਼ਰਤ ਨਾ ਹੋਣ ਤੇ ਉਲਟ ਨਤੀਜਾ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ, ਕਥਨ ਇਹ ਨਹੀਂ ਕਹਿੰਦਾ",
  },
  DENYING_ANTECEDENT: {
    "en-IN": "the result cannot be fixed merely because the stated condition is absent",
    "hi-IN": "केवल शर्त न होने से परिणाम निश्चित नहीं किया जा सकता",
    "pa-IN": "ਕੇਵਲ ਸ਼ਰਤ ਨਾ ਹੋਣ ਕਰਕੇ ਨਤੀਜਾ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  },
};

function indexForAnswer(value: StcAnswerClass): number {
  switch (value) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

function scenariosFor(qlId: StcQlId): readonly StcScenarioAuthority[] {
  if (qlId !== "STC-QL-001" && qlId !== "STC-QL-002") {
    throw new Error(`${qlId} is reserved but not yet implemented in STC-CP-001`);
  }
  return GENERATION_AUTHORITIES.filter((scenario) => scenario.qlId === qlId);
}

export function generateStcCp001Question(input: {
  readonly qlId: "STC-QL-001" | "STC-QL-002";
  readonly locale: StcLocale;
  readonly seed: number;
}): GeneratedStcQuestion {
  const scenarios = scenariosFor(input.qlId);
  if (scenarios.length === 0) throw new Error(`No STC authority for ${input.qlId}`);
  const base = mix32((input.seed >>> 0) ^ hashText(input.qlId));
  const scenario = scenarios[base % scenarios.length]!;
  const pair = PAIRS[mix32(base ^ 0x9e3779b9) % PAIRS.length]!;
  const reverse = Boolean(mix32(base ^ 0x85ebca6b) & 1);
  const firstIndex = reverse ? pair[1] : pair[0];
  const secondIndex = reverse ? pair[0] : pair[1];
  const first = scenario.candidates[firstIndex]!;
  const second = scenario.candidates[secondIndex]!;
  const firstFollows = stcEntails(scenario.premises, first.expression);
  const secondFollows = stcEntails(scenario.premises, second.expression);
  const cls = answerClass(firstFollows, secondFollows);
  const reason = (follows: boolean, defect: StcLogicalDefect | undefined) =>
    follows ? WHY_FOLLOWS[input.locale] : defect ? DEFECT_TEXT[defect][input.locale] : WHY_NOT[input.locale];

  const explanation = [
    `I: ${first.text[input.locale]} — ${reason(firstFollows, first.defectIfNotEntailed)}.`,
    `II: ${second.text[input.locale]} — ${reason(secondFollows, second.defectIfNotEntailed)}.`,
  ].join(" ");

  return {
    chapterId: "STC-001",
    checkpointId: "STC-CP-001",
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
    explanation,
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
