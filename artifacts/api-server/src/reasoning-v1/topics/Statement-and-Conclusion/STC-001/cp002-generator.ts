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
    "hi-IN": "यह कथित तथ्य को उलट देता है",
    "pa-IN": "ਇਹ ਦਿੱਤੇ ਤੱਥ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  UNSUPPORTED_EXTRA: {
    "en-IN": "it adds information not established by the statement",
    "hi-IN": "यह ऐसी अतिरिक्त जानकारी जोड़ता है जो कथन से स्थापित नहीं होती",
    "pa-IN": "ਇਹ ਐਸੀ ਵਾਧੂ ਜਾਣਕਾਰੀ ਜੋੜਦਾ ਹੈ ਜੋ ਕਥਨ ਤੋਂ ਸਥਾਪਿਤ ਨਹੀਂ ਹੁੰਦੀ",
  },
  OVERCLAIM: {
    "en-IN": "it claims more than the statement guarantees",
    "hi-IN": "यह कथन की गारंटी से अधिक दावा करता है",
    "pa-IN": "ਇਹ ਕਥਨ ਦੀ ਗਾਰੰਟੀ ਤੋਂ ਵੱਧ ਦਾਅਵਾ ਕਰਦਾ ਹੈ",
  },
  INVALID_COMBINATION: {
    "en-IN": "it treats an alternative as if every part were compulsory",
    "hi-IN": "यह विकल्प को ऐसे मानता है जैसे प्रत्येक भाग अनिवार्य हो",
    "pa-IN": "ਇਹ ਵਿਕਲਪ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਮੰਨਦਾ ਹੈ ਜਿਵੇਂ ਹਰ ਹਿੱਸਾ ਲਾਜ਼ਮੀ ਹੋਵੇ",
  },
  CONVERSE: {
    "en-IN": "it reverses the direction of the stated conditional rule",
    "hi-IN": "यह दी गई शर्त का दिशा-विपरीत निष्कर्ष निकालता है",
    "pa-IN": "ਇਹ ਦਿੱਤੀ ਸ਼ਰਤ ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਕੇ ਨਤੀਜਾ ਕੱਢਦਾ ਹੈ",
  },
  INVERSE: {
    "en-IN": "it assumes the inverse of the stated conditional rule",
    "hi-IN": "यह दी गई शर्त के व्युत्क्रम को मान लेता है",
    "pa-IN": "ਇਹ ਦਿੱਤੀ ਸ਼ਰਤ ਦੇ ਇਨਵਰਸ ਨੂੰ ਮੰਨ ਲੈਂਦਾ ਹੈ",
  },
  DENYING_ANTECEDENT: {
    "en-IN": "it denies the antecedent and incorrectly fixes the result",
    "hi-IN": "यह पूर्वशर्त के न होने से परिणाम को गलत रूप से निश्चित मानता है",
    "pa-IN": "ਇਹ ਪੂਰਵ-ਸ਼ਰਤ ਨਾ ਹੋਣ ਤੋਂ ਨਤੀਜੇ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਨਿਸ਼ਚਿਤ ਮੰਨਦਾ ਹੈ",
  },
};

const MODAL_DEFECT_TEXT: Record<StcModalDefect, Record<StcLocale, string>> = {
  STRONGER_MODALITY: {
    "en-IN": "it turns a possibility into certainty",
    "hi-IN": "यह संभावना को निश्चितता में बदल देता है",
    "pa-IN": "ਇਹ ਸੰਭਾਵਨਾ ਨੂੰ ਨਿਸ਼ਚਿਤਤਾ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ",
  },
  POLARITY_FLIP: {
    "en-IN": "it reverses the stated possibility or certainty",
    "hi-IN": "यह बताई गई संभावना या निश्चितता को उलट देता है",
    "pa-IN": "ਇਹ ਦੱਸੀ ਸੰਭਾਵਨਾ ਜਾਂ ਨਿਸ਼ਚਿਤਤਾ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ",
  },
  UNSUPPORTED_EXTRA: {
    "en-IN": "it introduces an event not mentioned by the statement",
    "hi-IN": "यह ऐसी घटना जोड़ता है जिसका कथन में उल्लेख नहीं है",
    "pa-IN": "ਇਹ ਐਸੀ ਘਟਨਾ ਜੋੜਦਾ ਹੈ ਜਿਸਦਾ ਕਥਨ ਵਿੱਚ ਜ਼ਿਕਰ ਨਹੀਂ ਹੈ",
  },
};

const FOLLOWS_TEXT: Record<StcLocale, string> = {
  "en-IN": "it is guaranteed at the same or weaker logical strength",
  "hi-IN": "यह समान या कमजोर तार्किक शक्ति पर कथन से सुनिश्चित है",
  "pa-IN": "ਇਹ ਸਮਾਨ ਜਾਂ ਕਮਜ਼ੋਰ ਤਰਕ-ਸ਼ਕਤੀ ਤੇ ਕਥਨ ਤੋਂ ਯਕੀਨੀ ਹੈ",
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
      follows ? FOLLOWS_TEXT[input.locale] : defect ? LOGICAL_DEFECT_TEXT[defect][input.locale] : "not entailed";

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
    follows ? FOLLOWS_TEXT[input.locale] : defect ? MODAL_DEFECT_TEXT[defect][input.locale] : "not entailed";

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
