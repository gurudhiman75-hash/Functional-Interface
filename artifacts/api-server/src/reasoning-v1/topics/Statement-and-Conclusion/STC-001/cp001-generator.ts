import { STC_CP001_ALL_AUTHORITIES } from "./cp001-authority-registry.ts";
import { stcEntails } from "./truth-model-solver.ts";
import type { GeneratedStcQuestion, StcAnswerClass, StcLocale, StcQlId, StcScenarioAuthority } from "./types.ts";

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
  "en-IN": "is guaranteed by the statement",
  "hi-IN": "कथन से निश्चित रूप से स्थापित होता है",
  "pa-IN": "ਕਥਨ ਤੋਂ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ",
};

const WHY_NOT: Record<StcLocale, string> = {
  "en-IN": "is not guaranteed by the statement",
  "hi-IN": "कथन से निश्चित रूप से स्थापित नहीं होता",
  "pa-IN": "ਕਥਨ ਤੋਂ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਸਥਾਪਿਤ ਨਹੀਂ ਹੁੰਦਾ",
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
  return STC_CP001_ALL_AUTHORITIES.filter((scenario) => scenario.qlId === qlId);
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

  const explanation = [
    `I: ${first.text[input.locale]} — ${firstFollows ? WHY_FOLLOWS[input.locale] : WHY_NOT[input.locale]}.`,
    `II: ${second.text[input.locale]} — ${secondFollows ? WHY_FOLLOWS[input.locale] : WHY_NOT[input.locale]}.`,
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
