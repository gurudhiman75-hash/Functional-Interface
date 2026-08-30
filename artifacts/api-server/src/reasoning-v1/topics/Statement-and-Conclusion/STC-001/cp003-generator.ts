import { STC_CP003_ORDER_AUTHORITIES } from "./cp003-order-authorities.ts";
import { STC_CP003_TEMPORAL_AUTHORITIES } from "./cp003-temporal-authorities.ts";
import { STC_EXAM_REALNESS_ORDER_AUTHORITIES, STC_EXAM_REALNESS_TEMPORAL_AUTHORITIES } from "./exam-realness-expansion-cp003-v1.ts";
import { stcOrderEntails } from "./strict-order-solver.ts";
import { stcTemporalEntails } from "./temporal-trend-solver.ts";
import type { GeneratedStcQuestion, StcAnswerClass, StcLocale, StcOrderDefect, StcTemporalDefect } from "./types.ts";

const ORDER_AUTHORITIES = [...STC_CP003_ORDER_AUTHORITIES, ...STC_EXAM_REALNESS_ORDER_AUTHORITIES] as const;
const TEMPORAL_AUTHORITIES = [...STC_CP003_TEMPORAL_AUTHORITIES, ...STC_EXAM_REALNESS_TEMPORAL_AUTHORITIES] as const;
const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]] as const;

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
  for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 16777619); }
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
  return value === "ONLY_I" ? 0 : value === "ONLY_II" ? 1 : value === "BOTH" ? 2 : 3;
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
  REVERSED_ORDER: { "en-IN": "this reverses the comparison established by the statement", "hi-IN": "यह कथन से स्थापित तुलना-क्रम को उलट देता है", "pa-IN": "ਇਹ ਕਥਨ ਤੋਂ ਸਥਾਪਿਤ ਤੁਲਨਾ-ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ" },
  UNSUPPORTED_RELATION: { "en-IN": "the statement compares a different property, so this relation is not established", "hi-IN": "कथन किसी दूसरी विशेषता की तुलना करता है, इसलिए यह संबंध सिद्ध नहीं होता", "pa-IN": "ਕਥਨ ਕਿਸੇ ਹੋਰ ਵਿਸ਼ੇਸ਼ਤਾ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਬੰਧ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ" },
  UNRELATED_ENTITY: { "en-IN": "this introduces an entity outside the given comparison", "hi-IN": "यह दी गई तुलना से बाहर की इकाई जोड़ता है", "pa-IN": "ਇਹ ਦਿੱਤੀ ਤੁਲਨਾ ਤੋਂ ਬਾਹਰ ਦੀ ਇਕਾਈ ਜੋੜਦਾ ਹੈ" },
};
const TEMPORAL_DEFECT_TEXT: Record<StcTemporalDefect, Record<StcLocale, string>> = {
  REVERSED_TIME: { "en-IN": "this reverses the established order of events", "hi-IN": "यह घटनाओं के स्थापित समय-क्रम को उलट देता है", "pa-IN": "ਇਹ ਘਟਨਾਵਾਂ ਦੇ ਸਥਾਪਿਤ ਸਮਾਂ-ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ" },
  REVERSED_TREND: { "en-IN": "this reverses the stated direction of change", "hi-IN": "यह बताई गई बढ़त या गिरावट की दिशा उलट देता है", "pa-IN": "ਇਹ ਦੱਸੀ ਵਾਧੇ ਜਾਂ ਘਟਾਅ ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ" },
  UNSUPPORTED_EXTRA: { "en-IN": "the statement gives no information about this extra event or measure", "hi-IN": "कथन इस अतिरिक्त घटना या माप के बारे में कोई जानकारी नहीं देता", "pa-IN": "ਕਥਨ ਇਸ ਵਾਧੂ ਘਟਨਾ ਜਾਂ ਮਾਪ ਬਾਰੇ ਕੋਈ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੰਦਾ" },
};
const ORDER_FOLLOWS: Record<StcLocale, string> = {
  "en-IN": "the stated comparison chain establishes this order",
  "hi-IN": "दी गई तुलना-श्रृंखला से यह क्रम स्थापित होता है",
  "pa-IN": "ਦਿੱਤੀ ਤੁਲਨਾ-ਲੜੀ ਤੋਂ ਇਹ ਕ੍ਰਮ ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ",
};
const TEMPORAL_FOLLOWS: Record<StcLocale, string> = {
  "en-IN": "the stated event sequence or trend establishes this conclusion",
  "hi-IN": "दिए गए समय-क्रम या बदलाव से यह निष्कर्ष स्थापित होता है",
  "pa-IN": "ਦਿੱਤੇ ਸਮਾਂ-ਕ੍ਰਮ ਜਾਂ ਬਦਲਾਅ ਤੋਂ ਇਹ ਨਤੀਜਾ ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ",
};
const FALLBACK: Record<StcLocale, string> = {
  "en-IN": "the statement does not establish this",
  "hi-IN": "कथन से यह बात निश्चित नहीं होती",
  "pa-IN": "ਕਥਨ ਤੋਂ ਇਹ ਗੱਲ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੁੰਦੀ",
};

export function generateStcCp003Question(input: { readonly qlId: "STC-QL-005" | "STC-QL-006"; readonly locale: StcLocale; readonly seed: number }): GeneratedStcQuestion {
  const base = mix32((input.seed >>> 0) ^ hashText(input.qlId));
  const [firstIndex, secondIndex] = choosePair(base);

  if (input.qlId === "STC-QL-005") {
    const scenario = ORDER_AUTHORITIES[base % ORDER_AUTHORITIES.length]!;
    const first = scenario.candidates[firstIndex]!;
    const second = scenario.candidates[secondIndex]!;
    const firstFollows = stcOrderEntails(scenario.premises, first.claim);
    const secondFollows = stcOrderEntails(scenario.premises, second.claim);
    const cls = answerClass(firstFollows, secondFollows);
    const reason = (follows: boolean, defect: StcOrderDefect | undefined) => follows ? ORDER_FOLLOWS[input.locale] : defect ? ORDER_DEFECT_TEXT[defect][input.locale] : FALLBACK[input.locale];
    return {
      chapterId: "STC-001", checkpointId: "STC-CP-003", qlId: input.qlId, scenarioId: scenario.id,
      locale: input.locale, seed: input.seed, difficulty: scenario.difficulty,
      stem: `${STEM_PREFIX[input.locale]}\n\n${scenario.statement[input.locale]}`,
      conclusions: [first.text[input.locale], second.text[input.locale]], options: OPTION_TEXT[input.locale],
      correctIndex: indexForAnswer(cls), answerClass: cls,
      explanation: `I: ${first.text[input.locale]} — ${reason(firstFollows, first.defectIfNotEntailed)}. II: ${second.text[input.locale]} — ${reason(secondFollows, second.defectIfNotEntailed)}.`,
      metadata: { solver: "STRICT_ORDER_CLOSURE_V1", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
    };
  }

  const scenario = TEMPORAL_AUTHORITIES[base % TEMPORAL_AUTHORITIES.length]!;
  const first = scenario.candidates[firstIndex]!;
  const second = scenario.candidates[secondIndex]!;
  const firstFollows = stcTemporalEntails(scenario.premises, first.claim);
  const secondFollows = stcTemporalEntails(scenario.premises, second.claim);
  const cls = answerClass(firstFollows, secondFollows);
  const reason = (follows: boolean, defect: StcTemporalDefect | undefined) => follows ? TEMPORAL_FOLLOWS[input.locale] : defect ? TEMPORAL_DEFECT_TEXT[defect][input.locale] : FALLBACK[input.locale];
  return {
    chapterId: "STC-001", checkpointId: "STC-CP-003", qlId: input.qlId, scenarioId: scenario.id,
    locale: input.locale, seed: input.seed, difficulty: scenario.difficulty,
    stem: `${STEM_PREFIX[input.locale]}\n\n${scenario.statement[input.locale]}`,
    conclusions: [first.text[input.locale], second.text[input.locale]], options: OPTION_TEXT[input.locale],
    correctIndex: indexForAnswer(cls), answerClass: cls,
    explanation: `I: ${first.text[input.locale]} — ${reason(firstFollows, first.defectIfNotEntailed)}. II: ${second.text[input.locale]} — ${reason(secondFollows, second.defectIfNotEntailed)}.`,
    metadata: { solver: "TEMPORAL_TREND_CLOSURE_V1", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  };
}
