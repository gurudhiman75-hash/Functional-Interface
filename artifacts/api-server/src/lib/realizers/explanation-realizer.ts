import {
  detectCoverageCategory,
} from "./coverage";
import type {
  NativeRealizerInput,
  RealizerLanguage,
  RealizationCoverageCategory,
} from "./types";

type ExplanationTone = {
  openings: string[];
  gamePlan: Record<HumanHook, string>;
  bridge: string;
  chainLead: string;
  visualHint: string;
  answerLead: string;
  trapLead: string;
  traps: Record<ExplanationKind, string>;
  fallbackChain: string;
};

type HumanHook =
  | "REASONING_CONSTRAINT"
  | "QUANT_HIDDEN_VAL"
  | "BACKWARD_TRACE"
  | "CHAIN_REACTION";

type ExplanationKind =
  | "reasoning"
  | "hidden-value"
  | "backward"
  | "successive-change"
  | "generic-quant";

type ExplanationPlan = {
  category: RealizationCoverageCategory;
  kind: ExplanationKind;
  hook: HumanHook;
  chainFacts: string[];
  answer: string;
  hasVisual: boolean;
};

const HUMAN_MAPPING: Record<
  HumanHook,
  Record<RealizerLanguage, string>
> = {
  REASONING_CONSTRAINT: {
    en: "First, let's mark the No-Go Zones: the places where someone definitely cannot sit.",
    hi: "सबसे पहले, आइए नो-गो ज़ोन पहचानें: वे जगहें जहाँ कोई निश्चित रूप से नहीं बैठ सकता।",
    pa: "ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਆਓ ਨੋ-ਗੋ ਜ਼ੋਨ ਪਛਾਣੀਏ: ਉਹ ਥਾਵਾਂ ਜਿੱਥੇ ਕੋਈ ਪੱਕੇ ਤੌਰ ਤੇ ਨਹੀਂ ਬੈਠ ਸਕਦਾ।",
  },
  QUANT_HIDDEN_VAL: {
    en: "Let's find the Missing Piece first. If the original value is hidden, imagining it as 100 usually makes the story easier.",
    hi: "पहले छिपी हुई संख्या को पकड़ते हैं। जब मूल संख्या छिपी हो, तो उसे 100 मानकर कहानी आसान हो जाती है।",
    pa: "ਪਹਿਲਾਂ ਗੁਪਤ ਸੰਖਿਆ ਨੂੰ ਫੜੀਏ। ਜਦੋਂ ਅਸਲੀ ਗਿਣਤੀ ਲੁਕੀ ਹੋਵੇ, ਉਸ ਨੂੰ 100 ਮੰਨਣ ਨਾਲ ਗੱਲ ਆਸਾਨ ਹੋ ਜਾਂਦੀ ਹੈ।",
  },
  BACKWARD_TRACE: {
    en: "It's time to Rewind the Story from the final position and work back to the Missing Piece.",
    hi: "अब कहानी को अंत से पीछे की ओर मोड़ते हैं और छिपी हुई संख्या तक पहुँचते हैं।",
    pa: "ਆਓ ਹੁਣ ਅਖੀਰ ਤੋਂ ਕਹਾਣੀ ਨੂੰ ਪਿੱਛੇ ਵੱਲ ਚਲਾ ਕੇ ਗੁਪਤ ਸੰਖਿਆ ਤੱਕ ਪਹੁੰਚੀਏ।",
  },
  CHAIN_REACTION: {
    en: "This is a Chain Reaction question, so each change must be applied to the latest value, not the old one.",
    hi: "यह चेन रिएक्शन वाला प्रश्न है, इसलिए हर बदलाव नए मान पर लगेगा, पुराने मान पर नहीं।",
    pa: "ਇਹ ਚੇਨ ਰੀਐਕਸ਼ਨ ਵਾਲਾ ਪ੍ਰਸ਼ਨ ਹੈ, ਇਸ ਲਈ ਹਰ ਬਦਲਾਅ ਨਵੇਂ ਮੁੱਲ ਤੇ ਲੱਗੇਗਾ, ਪੁਰਾਣੇ ਮੁੱਲ ਤੇ ਨਹੀਂ।",
  },
};

const TUTOR_TONE: Record<RealizerLanguage, ExplanationTone> = {
  en: {
    openings: [
      "Let's solve this calmly.",
      "To solve this one, we only need to follow the story carefully.",
      "Let's dive in and keep the moving parts simple.",
      "A good way into this question is to pick the clearest anchor first.",
    ],
    gamePlan: {
      REASONING_CONSTRAINT:
        HUMAN_MAPPING.REASONING_CONSTRAINT.en,
      QUANT_HIDDEN_VAL:
        HUMAN_MAPPING.QUANT_HIDDEN_VAL.en,
      BACKWARD_TRACE:
        HUMAN_MAPPING.BACKWARD_TRACE.en,
      CHAIN_REACTION:
        HUMAN_MAPPING.CHAIN_REACTION.en,
    },
    bridge: "This tells us that",
    chainLead:
      "Now we connect the clues like bridges, one at a time.",
    visualHint:
      "Look at the diagram as the seat turns green; that is the point where the clue becomes fixed.",
    answerLead:
      "So the final answer is",
    trapLead: "Trap alert:",
    traps: {
      reasoning:
        "Do not read left and right from your own side unless the question says so. Always follow the facing direction in the arrangement.",
      "hidden-value":
        "It is tempting to calculate on the new number, but the percentage story usually points back to the original Missing Piece.",
      backward:
        "The common mistake is to move forward from the first number. Here, the finish line gives the cleaner path.",
      "successive-change":
        "Do not add the two percentages directly. After the first change, the base itself has changed.",
      "generic-quant":
        "Keep the base clear. Most wrong answers come from using the right numbers in the wrong order.",
    },
    fallbackChain:
      "Once the main link is clear, the remaining value follows directly from the question.",
  },
  hi: {
    openings: [
      "आइए अब इस पहेली को आराम से सुलझाते हैं।",
      "इस प्रश्न में बस कहानी को सही क्रम में पकड़ना है।",
      "ध्यान दें, यहाँ सबसे आसान रास्ता एक साफ शुरुआत चुनना है।",
      "चलिए, पहले सबसे मजबूत संकेत को पकड़ते हैं।",
    ],
    gamePlan: {
      REASONING_CONSTRAINT:
        HUMAN_MAPPING.REASONING_CONSTRAINT.hi,
      QUANT_HIDDEN_VAL:
        HUMAN_MAPPING.QUANT_HIDDEN_VAL.hi,
      BACKWARD_TRACE:
        HUMAN_MAPPING.BACKWARD_TRACE.hi,
      CHAIN_REACTION:
        HUMAN_MAPPING.CHAIN_REACTION.hi,
    },
    bridge: "इसका अर्थ है कि",
    chainLead:
      "अब संकेतों को एक-एक पुल की तरह जोड़ते हैं।",
    visualHint:
      "चित्र में जहाँ सीट हरी होती है, वहीं यह संकेत पक्का हो जाता है।",
    answerLead: "इसलिए अंतिम उत्तर है",
    trapLead: "सावधान रहें:",
    traps: {
      reasoning:
        "बाएँ और दाएँ को अपनी तरफ से न पढ़ें। बैठने की दिशा को आधार बनाकर ही जगह तय करें।",
      "hidden-value":
        "अक्सर गलती नए मान पर प्रतिशत लगाने से होती है, जबकि कहानी हमें मूल छिपी हुई संख्या तक ले जाती है।",
      backward:
        "यहाँ शुरुआत से आगे बढ़ना लंबा रास्ता है। अंत से पीछे लौटना ज्यादा साफ है।",
      "successive-change":
        "दो प्रतिशतों को सीधे मत जोड़िए। पहले बदलाव के बाद आधार बदल जाता है।",
      "generic-quant":
        "आधार को साफ रखें। अधिकतर गलतियाँ सही संख्याओं को गलत क्रम में रखने से होती हैं।",
    },
    fallbackChain:
      "मुख्य संबंध साफ होते ही बचा हुआ मान सीधे मिल जाता है।",
  },
  pa: {
    openings: [
      "ਆਓ ਇਸ ਪ੍ਰਸ਼ਨ ਨੂੰ ਆਰਾਮ ਨਾਲ ਸੁਲਝਾਈਏ।",
      "ਧਿਆਨ ਦਿਓ, ਇੱਥੇ ਸਿਰਫ ਕਹਾਣੀ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਫੜਨਾ ਹੈ।",
      "ਚਲੋ ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਸਾਫ ਇਸ਼ਾਰੇ ਨੂੰ ਫੜੀਏ।",
      "ਇਸ ਨੂੰ ਹੌਲੀ-ਹੌਲੀ ਜੋੜੀਏ, ਤਾਂ ਗੱਲ ਸਾਫ ਹੋ ਜਾਵੇਗੀ।",
    ],
    gamePlan: {
      REASONING_CONSTRAINT:
        HUMAN_MAPPING.REASONING_CONSTRAINT.pa,
      QUANT_HIDDEN_VAL:
        HUMAN_MAPPING.QUANT_HIDDEN_VAL.pa,
      BACKWARD_TRACE:
        HUMAN_MAPPING.BACKWARD_TRACE.pa,
      CHAIN_REACTION:
        HUMAN_MAPPING.CHAIN_REACTION.pa,
    },
    bridge: "ਇਸ ਦਾ ਮਤਲਬ ਹੈ ਕਿ",
    chainLead:
      "ਹੁਣ ਇਸ਼ਾਰਿਆਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਪੁਲ ਵਾਂਗ ਜੋੜਦੇ ਹਾਂ।",
    visualHint:
      "ਡਾਇਗ੍ਰਾਮ ਵਿੱਚ ਜਿੱਥੇ ਸੀਟ ਹਰੀ ਹੁੰਦੀ ਹੈ, ਓਥੇ ਇਹ ਇਸ਼ਾਰਾ ਪੱਕਾ ਹੋ ਜਾਂਦਾ ਹੈ।",
    answerLead: "ਇਸ ਲਈ ਅੰਤਿਮ ਉੱਤਰ ਹੈ",
    trapLead: "ਧਿਆਨ ਰੱਖੋ:",
    traps: {
      reasoning:
        "ਖੱਬੇ ਤੇ ਸੱਜੇ ਨੂੰ ਆਪਣੀ ਦਿਸ਼ਾ ਤੋਂ ਨਾ ਪੜ੍ਹੋ। ਬੈਠਣ ਵਾਲੇ ਦੀ ਦਿਸ਼ਾ ਦੇ ਅਨੁਸਾਰ ਹੀ ਜਗ੍ਹਾ ਤੈਅ ਕਰੋ।",
      "hidden-value":
        "ਅਕਸਰ ਗਲਤੀ ਨਵੇਂ ਮੁੱਲ ਤੇ ਪ੍ਰਤੀਸ਼ਤ ਲਗਾਉਣ ਨਾਲ ਹੁੰਦੀ ਹੈ, ਜਦਕਿ ਕਹਾਣੀ ਸਾਨੂੰ ਅਸਲੀ ਗੁਪਤ ਸੰਖਿਆ ਵੱਲ ਲੈ ਜਾਂਦੀ ਹੈ।",
      backward:
        "ਇੱਥੇ ਸ਼ੁਰੂ ਤੋਂ ਅੱਗੇ ਵਧਣਾ ਲੰਮਾ ਰਸਤਾ ਹੈ। ਅਖੀਰ ਤੋਂ ਪਿੱਛੇ ਆਉਣਾ ਜ਼ਿਆਦਾ ਸਾਫ ਹੈ।",
      "successive-change":
        "ਦੋ ਪ੍ਰਤੀਸ਼ਤਾਂ ਨੂੰ ਸਿੱਧਾ ਨਾ ਜੋੜੋ। ਪਹਿਲੇ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਆਧਾਰ ਹੀ ਬਦਲ ਜਾਂਦਾ ਹੈ।",
      "generic-quant":
        "ਆਧਾਰ ਨੂੰ ਸਾਫ ਰੱਖੋ। ਜ਼ਿਆਦਾਤਰ ਗਲਤੀਆਂ ਸਹੀ ਗਿਣਤੀਆਂ ਨੂੰ ਗਲਤ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਣ ਨਾਲ ਹੁੰਦੀਆਂ ਹਨ।",
    },
    fallbackChain:
      "ਮੁੱਖ ਲਿੰਕ ਸਾਫ ਹੋਣ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਹੋਇਆ ਮੁੱਲ ਸਿੱਧਾ ਮਿਲ ਜਾਂਦਾ ਹੈ।",
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stablePick(
  values: string[],
  input: NativeRealizerInput,
) {
  const source = [
    input.patternId,
    input.question.text,
    input.question.correct,
    input.question.options?.join("|"),
  ].join("|");
  const score = [...source].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return values[score % values.length] ?? values[0] ?? "";
}

function cleanFact(text: string) {
  return text
    .replace(/^step\s*\d+\s*[:.)-]?\s*/iu, "")
    .replace(/\s*[-=]>\s*/g, " tells us ")
    .replace(/\bformula\b/giu, "shortcut")
    .replace(/\bsubstitution\b/giu, "putting the values in")
    .replace(/\bconstraint\b/giu, "clue")
    .replace(/\binference\b/giu, "clear link")
    .replace(/\s+/g, " ")
    .trim();
}

function collectTraceFacts(input: NativeRealizerInput) {
  const question = input.question as any;
  const logic = asRecord(input.logic);
  const debug = asRecord(question.debugMetadata);
  const procedural = asRecord(
    debug.proceduralScenario,
  );

  const rawCandidates = [
    ...(Array.isArray(question.reasoningSteps)
      ? question.reasoningSteps
      : []),
    ...(Array.isArray(question.inferenceTrace?.steps)
      ? question.inferenceTrace.steps
      : []),
    ...(Array.isArray(logic.reasoningSteps)
      ? logic.reasoningSteps
      : []),
    ...(Array.isArray(procedural.reasoningSteps)
      ? procedural.reasoningSteps
      : []),
    ...(Array.isArray(logic.steps)
      ? logic.steps
      : []),
    ...(Array.isArray(procedural.steps)
      ? procedural.steps
      : []),
  ];

  const deductionCandidates = [
    ...(Array.isArray(question.deductionArray)
      ? question.deductionArray
      : []),
    ...(Array.isArray(question.inferenceTrace?.deductionArray)
      ? question.inferenceTrace.deductionArray
      : []),
    ...(Array.isArray(logic.deductionArray)
      ? logic.deductionArray
      : []),
    ...(Array.isArray(procedural.deductionArray)
      ? procedural.deductionArray
      : []),
    ...(Array.isArray(logic.solverTraceExport?.steps)
      ? logic.solverTraceExport.steps
      : []),
    ...(Array.isArray(procedural.solverTraceExport?.steps)
      ? procedural.solverTraceExport.steps
      : []),
  ];

  const facts = [
    ...rawCandidates.map((entry) =>
      typeof entry === "string"
        ? entry
        : String(
            entry?.statement ??
              entry?.deduction ??
              entry?.text ??
              "",
          ),
    ),
    ...deductionCandidates.map((entry) =>
      String(
        entry?.statement ??
          entry?.deduction ??
          entry?.text ??
          "",
      ),
    ),
  ]
    .map(cleanFact)
    .filter(Boolean);

  return [...new Set(facts)].slice(0, 3);
}

function detectExplanationKind(
  input: NativeRealizerInput,
  category: RealizationCoverageCategory,
): Pick<ExplanationPlan, "kind" | "hook"> {
  const logic = asRecord(input.logic);
  const haystack = [
    category,
    input.patternId,
    input.question.section,
    input.question.topic,
    input.question.subtopic,
    input.question.text,
    logic.motifId,
    logic.scenarioType,
    logic.scenarioLogicBranch,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (category !== "quant") {
    return {
      kind: "reasoning",
      hook: "REASONING_CONSTRAINT",
    };
  }

  if (
    haystack.includes("restore") ||
    haystack.includes("reverse") ||
    haystack.includes("find original") ||
    haystack.includes("what number")
  ) {
    return {
      kind: "backward",
      hook: "BACKWARD_TRACE",
    };
  }

  if (
    haystack.includes("successive") ||
    haystack.includes("compound") ||
    haystack.includes("growth") ||
    haystack.includes("depreciation") ||
    haystack.includes("increase followed")
  ) {
    return {
      kind: "successive-change",
      hook: "CHAIN_REACTION",
    };
  }

  if (
    haystack.includes("percentage") ||
    haystack.includes("percent") ||
    haystack.includes("%") ||
    haystack.includes("average") ||
    haystack.includes("profit") ||
    haystack.includes("loss")
  ) {
    return {
      kind: "hidden-value",
      hook: "QUANT_HIDDEN_VAL",
    };
  }

  return {
    kind: "generic-quant",
    hook: "QUANT_HIDDEN_VAL",
  };
}

function getAnswerText(input: NativeRealizerInput) {
  const option =
    input.question.options?.[
      input.question.correct
    ];
  return String(option ?? "").trim();
}

function buildPlan(
  input: NativeRealizerInput,
): ExplanationPlan {
  const category =
    detectCoverageCategory(input);
  const kindAndHook =
    detectExplanationKind(input, category);
  const chainFacts = collectTraceFacts(input);

  return {
    category,
    ...kindAndHook,
    chainFacts,
    answer: getAnswerText(input),
    hasVisual: Boolean(
      input.question.seatingDiagram ||
        input.question.seatingExplanationFlow ||
        asRecord(input.logic).layoutManifest,
    ),
  };
}

function localizeFact(
  fact: string,
  language: RealizerLanguage,
) {
  if (language === "en") {
    return fact;
  }

  // Keep names/numbers intact. These are concise bridge phrases, not machine
  // translation; native realizers provide the question text itself.
  const replacements: Array<[RegExp, string]> =
    language === "hi"
      ? [
          [/\bis not\b/giu, "नहीं है"],
          [/\bnot\b/giu, "नहीं"],
          [/\bnext to\b/giu, "के पास"],
          [/\badjacent to\b/giu, "के पास"],
          [/\bopposite\b/giu, "के सामने"],
          [/\bleft of\b/giu, "के बाईं ओर"],
          [/\bright of\b/giu, "के दाईं ओर"],
          [/\btherefore\b/giu, "इसलिए"],
        ]
      : [
          [/\bis not\b/giu, "ਨਹੀਂ ਹੈ"],
          [/\bnot\b/giu, "ਨਹੀਂ"],
          [/\bnext to\b/giu, "ਦੇ ਕੋਲ"],
          [/\badjacent to\b/giu, "ਦੇ ਕੋਲ"],
          [/\bopposite\b/giu, "ਦੇ ਸਾਹਮਣੇ"],
          [/\bleft of\b/giu, "ਦੇ ਖੱਬੇ ਪਾਸੇ"],
          [/\bright of\b/giu, "ਦੇ ਸੱਜੇ ਪਾਸੇ"],
          [/\btherefore\b/giu, "ਇਸ ਲਈ"],
        ];

  return replacements.reduce(
    (text, [pattern, replacement]) =>
      text.replace(pattern, replacement),
    fact,
  );
}

function renderChain(
  plan: ExplanationPlan,
  tone: ExplanationTone,
  language: RealizerLanguage,
) {
  if (!plan.chainFacts.length) {
    return tone.fallbackChain;
  }

  const facts = plan.chainFacts.map((fact) =>
    localizeFact(fact, language),
  );

  if (language === "en") {
    return `${tone.chainLead} ${facts
      .map((fact) => `${tone.bridge} ${fact}`)
      .join(". ")}.`;
  }

  if (language === "hi") {
    return `${tone.chainLead} ${facts
      .map((fact) => `${tone.bridge} ${fact}`)
      .join("। ")}।`;
  }

  return `${tone.chainLead} ${facts
    .map((fact) => `${tone.bridge} ${fact}`)
    .join("। ")}।`;
}

export function realizeExplanation(
  input: NativeRealizerInput,
  language: RealizerLanguage,
) {
  const tone = TUTOR_TONE[language];
  const plan = buildPlan(input);
  const opening = stablePick(
    tone.openings,
    input,
  );
  const answerSentence = plan.answer
    ? `${tone.answerLead} ${plan.answer}.`
    : "";
  const visualSentence =
    plan.category === "seating" && plan.hasVisual
      ? tone.visualHint
      : "";

  return [
    `${opening} ${tone.gamePlan[plan.hook]}`,
    [renderChain(plan, tone, language), visualSentence]
      .filter(Boolean)
      .join(" "),
    `${tone.trapLead} ${tone.traps[plan.kind]} ${answerSentence}`.trim(),
  ]
    .filter(Boolean)
    .join("\n\n")
    .normalize("NFC");
}

