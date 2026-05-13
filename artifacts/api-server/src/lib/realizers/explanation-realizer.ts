import {
  detectCoverageCategory,
} from "./coverage";
import {
  localizeOptionText,
} from "./entity-registry";
import type {
  NativeRealizerInput,
  RealizerLanguage,
  RealizationCoverageCategory,
} from "./types";

type ExplanationMode =
  | "seating"
  | "time-work"
  | "percentage"
  | "ratio"
  | "profit-loss"
  | "quant";

type SeatingSnapshot = {
  participants: string[];
  arrangement: string[];
  layout: "linear" | "circular" | "parallel";
  orientation: string;
  generatedClues: string[];
};

type ExplanationPlan = {
  mode: ExplanationMode;
  insight: string;
  keyPoints: string[];
  finalAnswer: string;
  visualAnchor?: string;
  seating?: SeatingSnapshot;
};

type TutorCopy = {
  setupHeader: string;
  reasoningHeader: string;
  visualHeader: string;
  conclusionHeader: string;
  noAnswer: string;
  seatingSetup: (
    snapshot: SeatingSnapshot,
  ) => string;
  quantSetup: (
    mode: ExplanationMode,
  ) => string;
  transitions: string[];
  seatingInsight: string;
  timeWorkInsight: string;
  percentageInsight: string;
  ratioInsight: string;
  profitLossInsight: string;
  quantInsight: string;
  leftover: (
    names: string[],
    placements: string,
  ) => string;
  point: (
    transition: string,
    body: string,
  ) => string;
  visual: (visual: string) => string;
  final: (answer: string) => string;
};

const TUTOR_COPY: Record<RealizerLanguage, TutorCopy> = {
  en: {
    setupHeader: "Approach",
    reasoningHeader: "Step-by-step solution",
    visualHeader: "Final arrangement",
    conclusionHeader: "Correct answer",
    noAnswer: "the option asked for",
    seatingSetup: (snapshot) => {
      const names = joinNames(
        snapshot.participants,
        "en",
      );
      if (snapshot.layout === "circular") {
        return `${snapshot.participants.length} persons (${names}) are seated around a circular table, ${snapshot.orientation}. Fix one definite relation first, then place the remaining persons using the clues.`;
      }
      if (snapshot.layout === "parallel") {
        return `${snapshot.participants.length} persons (${names}) are seated in two rows, ${snapshot.orientation}. Treat row clues and facing clues together before fixing positions.`;
      }
      return `${snapshot.participants.length} persons (${names}) are seated in a straight line, ${snapshot.orientation}. Start from a clue that fixes a seat or an adjacent pair.`;
    },
    quantSetup: (mode) => {
      if (mode === "time-work") {
        return "Convert each worker’s rate into a per-day share of the work; combined rates add when people work together.";
      }
      if (mode === "percentage") {
        return "Identify the base on which the percentage is taken; most errors come from applying the percent to the wrong base.";
      }
      if (mode === "ratio") {
        return "Express the situation as a ratio of parts so you compare like quantities before computing totals.";
      }
      if (mode === "profit-loss") {
        return "Take cost price as the anchor; relate selling price, profit, loss, and discount back to that anchor.";
      }
      return "Pick the simplest fixed quantity first, then link the given values to what is asked.";
    },
    transitions: [
      "First,",
      "Note that",
      "From this,",
      "Alternatively,",
      "Therefore,",
    ],
    seatingInsight:
      "Build small confirmed blocks from the clues, then use negative clues to eliminate impossible seats until only one arrangement remains.",
    timeWorkInsight:
      "When people work together, their daily work shares add; that sum is the fastest way to the combined rate.",
    percentageInsight:
      "The base is the shortcut: once the base is fixed, each percentage change applies in a clear order.",
    ratioInsight:
      "Compare parts through the ratio first; compute a total only if the question asks for it.",
    profitLossInsight:
      "Every profit or loss is measured against cost price unless the wording clearly uses another reference.",
    quantInsight:
      "Clarify the relation between the given numbers before doing the final arithmetic.",
    leftover: (names, placements) =>
      `All names appear in the data, so even if ${joinNames(names, "en")} is lightly mentioned in the clues, the remaining seat must still be filled. That forces ${placements}.`,
    point: (transition, body) =>
      `${transition} ${body}`,
    visual: (visual) =>
      `The working order is ${visual}.`,
    final: (answer) =>
      `Therefore, the correct answer is ${answer}.`,
  },
  hi: {
    setupHeader: "विधि",
    reasoningHeader: "चरणबद्ध हल",
    visualHeader: "अंतिम व्यवस्था",
    conclusionHeader: "सही उत्तर",
    noAnswer: "पूछा गया विकल्प",
    seatingSetup: (snapshot) => {
      const names = joinNames(
        snapshot.participants,
        "hi",
      );
      if (snapshot.layout === "circular") {
        return `${snapshot.participants.length} व्यक्ति (${names}) एक वृत्ताकार मेज के चारों ओर ${snapshot.orientation} बैठे हैं। पहले एक निश्चित संबंध स्थिर कीजिए, फिर शेष स्थानों को संकेतों से भरिए।`;
      }
      if (snapshot.layout === "parallel") {
        return `${snapshot.participants.length} व्यक्ति (${names}) दो पंक्तियों में बैठे हैं, ${snapshot.orientation}। पंक्ति और मुख-दिशा वाले संकेत एक साथ लागू कीजिए।`;
      }
      return `${snapshot.participants.length} व्यक्ति (${names}) एक सीधी पंक्ति में बैठे हैं, ${snapshot.orientation}। जिस संकेत से कोई स्थान या पड़ोसी जोड़ी पक्की हो, वहाँ से शुरुआत कीजिए।`;
    },
    quantSetup: (mode) => {
      if (mode === "time-work") {
        return "हर व्यक्ति के काम को प्रतिदिन के हिस्से में बदलिए; साथ काम करने पर ये हिस्से जुड़ जाते हैं।";
      }
      if (mode === "percentage") {
        return "वह आधार स्पष्ट रखिए जिस पर प्रतिशत लगाया गया है; अक्सर गलती गलत आधार पर गणना करने से होती है।";
      }
      if (mode === "ratio") {
        return "अनुपात से समान प्रकार की राशियों की तुलना करिए; कुल तभी निकालिए जब प्रश्न माँगे।";
      }
      if (mode === "profit-loss") {
        return "क्रय मूल्य को आधार मानिए; लाभ, हानि, छूट और विक्रय मूल्य इसी से जुड़ते हैं।";
      }
      return "सबसे सरल निश्चित मान पहले चुनिए, फिर दिए गए मानों को प्रश्न से जोड़िए।";
    },
    transitions: [
      "सबसे पहले,",
      "ध्यान दें कि",
      "इससे स्पष्ट है कि",
      "वैकल्पिक रूप से,",
      "अतः,",
    ],
    seatingInsight:
      "छोटे-छोटे पक्के समूह बनाइए, फिर असंभव स्थानों को नकारात्मक संकेतों से हटाते जाइए जब तक केवल एक व्यवस्था न बचे।",
    timeWorkInsight:
      "साथ काम करने पर प्रत्येक की प्रतिदिन दक्षता जुड़ जाती है; संयुक्त दर यहीं से तेज़ी से मिलती है।",
    percentageInsight:
      "आधार ही मुख्य संकेत है; आधार सही होने पर प्रतिशत परिवर्तन क्रम से साफ हो जाता है।",
    ratioInsight:
      "पहले अनुपात से भागों की तुलना करें; कुल केवल तभी जब प्रश्न माँगे।",
    profitLossInsight:
      "लाभ या हानि सामान्यतः क्रय मूल्य से ही जुड़ती है जब तक कथन में और स्पष्ट न हो।",
    quantInsight:
      "अंतिम गणना से पहले दिए गए मानों के बीच संबंध स्पष्ट कर लीजिए।",
    leftover: (names, placements) =>
      `सभी नाम दिए गए हैं, इसलिए ${joinNames(names, "hi")} यदि संकेतों में कम भी आए, शेष स्थान फिर भी भरना होगा। इससे ${placements} मिलता है।`,
    point: (transition, body) =>
      `${transition} ${body}`,
    visual: (visual) =>
      `कार्य व्यवस्था इस प्रकार है: ${visual}।`,
    final: (answer) =>
      `अतः सही उत्तर ${answer} है।`,
  },
  pa: {
    setupHeader: "ਉਪਾਅ",
    reasoningHeader: "ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ",
    visualHeader: "ਅੰਤਿਮ ਵਿਵਸਥਾ",
    conclusionHeader: "ਸਹੀ ਉੱਤਰ",
    noAnswer: "ਪੁੱਛਿਆ ਗਿਆ ਵਿਕਲਪ",
    seatingSetup: (snapshot) => {
      const names = joinNames(
        snapshot.participants,
        "pa",
      );
      if (snapshot.layout === "circular") {
        return `${snapshot.participants.length} ਵਿਅਕਤੀ (${names}) ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ${snapshot.orientation} ਬੈਠੇ ਹਨ। ਪਹਿਲਾਂ ਇੱਕ ਪੱਕਾ ਸੰਬੰਧ ਬਣਾਓ, ਫਿਰ ਬਾਕੀ ਸਥਾਨ ਸੰਕੇਤਾਂ ਨਾਲ ਭਰੋ।`;
      }
      if (snapshot.layout === "parallel") {
        return `${snapshot.participants.length} ਵਿਅਕਤੀ (${names}) ਦੋ ਕਤਾਰਾਂ ਵਿੱਚ ਬੈਠੇ ਹਨ, ${snapshot.orientation}। ਕਤਾਰ ਅਤੇ ਮੂੰਹ-ਦਿਸ਼ਾ ਵਾਲੇ ਇਸ਼ਾਰੇ ਇਕੱਠੇ ਲਾਗੂ ਕਰੋ।`;
      }
      return `${snapshot.participants.length} ਵਿਅਕਤੀ (${names}) ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ, ${snapshot.orientation}। ਜਿਸ ਇਸ਼ਾਰੇ ਨਾਲ ਕੋਈ ਸਥਾਨ ਜਾਂ ਗੁਆਂਢੀ ਜੋੜੀ ਪੱਕੀ ਹੋਵੇ, ਉੱਥੋਂ ਸ਼ੁਰੂ ਕਰੋ।`;
    },
    quantSetup: (mode) => {
      if (mode === "time-work") {
        return "ਹਰ ਵਿਅਕਤੀ ਦੇ ਕੰਮ ਨੂੰ ਇੱਕ ਦਿਨ ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਲਿਖੋ; ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਵੇਲੇ ਇਹ ਹਿੱਸੇ ਜੁੜ ਜਾਂਦੇ ਹਨ।";
      }
      if (mode === "percentage") {
        return "ਉਹ ਅਧਾਰ ਮੁੱਲ ਸਾਫ਼ ਰੱਖੋ ਜਿਸ ਉੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਲਾਗੂ ਹੈ; ਜ਼ਿਆਦਾਤਰ ਗਲਤੀਆਂ ਗਲਤ ਅਧਾਰ ਉੱਤੇ ਗਿਣਤੀ ਕਰਨ ਕਰਕੇ ਹੁੰਦੀਆਂ ਹਨ।";
      }
      if (mode === "ratio") {
        return "ਅਨੁਪਾਤ ਰਾਹੀਂ ਇੱਕੋ ਜਿਹੀਆਂ ਰਾਸ਼ੀਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ; ਕੁੱਲ ਸਿਰਫ਼ ਉਦੋਂ ਕੱਢੋ ਜਦੋਂ ਪ੍ਰਸ਼ਨ ਮੰਗੇ।";
      }
      if (mode === "profit-loss") {
        return "ਲਾਗਤ ਮੁੱਲ ਨੂੰ ਆਧਾਰ ਮੰਨੋ; ਲਾਭ, ਹਾਨੀ, ਛੂਟ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ਇਸੇ ਨਾਲ ਜੁੜਦੇ ਹਨ।";
      }
      return "ਸਭ ਤੋਂ ਸਰਲ ਪੱਕਾ ਮੁੱਲ ਪਹਿਲਾਂ ਚੁਣੋ, ਫਿਰ ਦਿੱਤੇ ਮੁੱਲਾਂ ਨੂੰ ਪ੍ਰਸ਼ਨ ਨਾਲ ਜੋੜੋ।";
    },
    transitions: [
      "ਸਭ ਤੋਂ ਪਹਿਲਾਂ,",
      "ਧਿਆਨ ਦਿਓ ਕਿ",
      "ਇਸ ਤੋਂ ਸਪਸ਼ਟ ਹੈ ਕਿ",
      "ਬਦਲਵੇਂ ਤੌਰ ਤੇ,",
      "ਇਸ ਲਈ,",
    ],
    seatingInsight:
      "ਬੈਠਕ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਛੋਟੀਆਂ ਪੱਕੀਆਂ ਜੋੜੀਆਂ ਬਣਾਓ, ਫਿਰ ਅਸੰਭਵ ਸਥਾਨਾਂ ਨੂੰ ਨਕਾਰਾਤਮਕ ਇਸ਼ਾਰਿਆਂ ਨਾਲ ਹਟਾਉਂਦੇ ਜਾਓ ਜਦ ਤੱਕ ਸਿਰਫ਼ ਇੱਕ ਵਿਵਸਥਾ ਨਹੀਂ ਬਚਦੀ।",
    timeWorkInsight:
      "ਜਦੋਂ ਲੋਕ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ ਤਾਂ ਹਰੇਕ ਦੀ ਰੋਜ਼ਾਨਾ ਕਾਰਗੁਜ਼ਾਰੀ ਜੁੜਦੀ ਹੈ; ਇਕੱਠੀ ਦਰ ਇੱਥੋਂ ਤੇਜ਼ੀ ਨਾਲ ਮਿਲਦੀ ਹੈ।",
    percentageInsight:
      "ਅਧਾਰ ਹੀ ਮੁੱਖ ਸੰਕੇਤ ਹੈ; ਅਧਾਰ ਸਹੀ ਹੋਵੇ ਤਾਂ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਕ੍ਰਮਵਾਰ ਸਾਫ਼ ਹੋ ਜਾਂਦਾ ਹੈ।",
    ratioInsight:
      "ਪਹਿਲਾਂ ਅਨੁਪਾਤ ਰਾਹੀਂ ਹਿੱਸਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ; ਕੁੱਲ ਸਿਰਫ਼ ਉਦੋਂ ਜਦੋਂ ਪ੍ਰਸ਼ਨ ਮੰਗੇ।",
    profitLossInsight:
      "ਲਾਭ ਜਾਂ ਹਾਨੀ ਆਮ ਤੌਰ ਤੇ ਲਾਗਤ ਮੁੱਲ ਨਾਲ ਹੀ ਜੁੜਦੀ ਹੈ ਜਦ ਤੱਕ ਕਥਨ ਵਿੱਚ ਹੋਰ ਸਪਸ਼ਟ ਨ ਹੋਵੇ।",
    quantInsight:
      "ਅੰਤਿਮ ਗਿਣਤੀ ਤੋਂ ਪਹਿਲਾਂ ਦਿੱਤੇ ਮੁੱਲਾਂ ਦਾ ਆਪਸੀ ਰਿਸ਼ਤਾ ਸਪਸ਼ਟ ਕਰ ਲਓ।",
    leftover: (names, placements) =>
      `ਸਾਰੇ ਨਾਮ ਦਿੱਤੇ ਗਏ ਹਨ, ਇਸ ਲਈ ${joinNames(names, "pa")} ਭਾਵੇਂ ਇਸ਼ਾਰਿਆਂ ਵਿੱਚ ਘੱਟ ਆਵੇ, ਬਚਿਆ ਹੋਇਆ ਸਥਾਨ ਫਿਰ ਵੀ ਭਰਨਾ ਪਵੇਗਾ। ਇਸ ਨਾਲ ${placements} ਮਿਲਦਾ ਹੈ।`,
    point: (transition, body) =>
      `${transition} ${body}`,
    visual: (visual) =>
      `ਕੰਮ ਵਾਲੀ ਵਿਵਸਥਾ ਇਸ ਤਰ੍ਹਾਂ ਹੈ: ${visual}।`,
    final: (answer) =>
      `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => String(item).trim())
        .filter(Boolean)
    : [];
}

function unique(values: string[]) {
  return [
    ...new Set(
      values.filter(Boolean),
    ),
  ];
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickVariant<T>(
  values: T[],
  seed: string,
  offset = 0,
) {
  return values[
    (hashText(seed) + offset) %
      values.length
  ]!;
}

function joinNames(
  names: string[],
  language: RealizerLanguage,
) {
  if (names.length <= 1) {
    return names.join("");
  }

  const conjunction =
    language === "en"
      ? "and"
      : language === "hi"
        ? "और"
        : "ਅਤੇ";

  return `${names
    .slice(0, -1)
    .join(", ")} ${conjunction} ${names.at(-1)}`;
}

function getNestedRecords(input: NativeRealizerInput) {
  const question = input.question as any;
  const logic = asRecord(input.logic);
  const debug = asRecord(question.debugMetadata);
  const procedural = asRecord(
    debug.proceduralScenario,
  );

  return {
    question,
    logic,
    debug,
    procedural,
  };
}

function extractAnswer(
  input: NativeRealizerInput,
) {
  const option =
    input.question.options?.[
      input.question.correct
    ];

  return String(option ?? "").trim();
}

function extractLocalizedAnswer(
  input: NativeRealizerInput,
  language: RealizerLanguage,
) {
  const raw = extractAnswer(input);
  if (!raw) {
    return "";
  }
  if (language === "hi") {
    return localizeOptionText(
      raw,
      "hi",
    ).normalize("NFC");
  }
  if (language === "pa") {
    return localizeOptionText(
      raw,
      "pa",
    ).normalize("NFC");
  }
  return raw;
}

function localizeOrientation(
  orientation: string,
  layout: SeatingSnapshot["layout"],
  language: RealizerLanguage,
) {
  const normalized =
    orientation.toLowerCase();
  const isCenter =
    layout === "circular" &&
    (normalized.includes("center") ||
      normalized.includes("centre") ||
      normalized.includes("in"));
  const isAlternate =
    normalized.includes("alternate");
  const isParallel =
    layout === "parallel";

  if (language === "hi") {
    if (isParallel) return "एक-दूसरे की ओर मुख करके";
    if (isAlternate) return "बारी-बारी से अलग दिशाओं में मुख करके";
    if (isCenter) return "केंद्र की ओर मुख करके";
    if (normalized.includes("south")) return "दक्षिण की ओर मुख करके";
    return "उत्तर की ओर मुख करके";
  }

  if (language === "pa") {
    if (isParallel) return "ਇੱਕ-ਦੂਜੇ ਵੱਲ ਮੂੰਹ ਕਰਕੇ";
    if (isAlternate) return "ਵਾਰੀ-ਵਾਰੀ ਵੱਖ-ਵੱਖ ਦਿਸ਼ਾਵਾਂ ਵੱਲ ਮੂੰਹ ਕਰਕੇ";
    if (isCenter) return "ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ";
    if (normalized.includes("south")) return "ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ";
    return "ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ";
  }

  if (isParallel) return "facing each other";
  if (isAlternate) return "with alternate facing directions";
  if (isCenter) return "facing the centre";
  if (normalized.includes("south")) return "all facing South";
  return "all facing North";
}

function extractSeatingSnapshot(
  input: NativeRealizerInput,
  language: RealizerLanguage,
): SeatingSnapshot | null {
  const {
    logic,
    procedural,
  } = getNestedRecords(input);
  const candidates = [logic, procedural];
  const source = candidates.find(
    (candidate) =>
      asStringArray(candidate.participants).length ||
      asStringArray(candidate.arrangement).length ||
      typeof candidate.finalArrangement === "string",
  );

  if (!source) {
    return null;
  }

  const arrangement =
    asStringArray(source.arrangement).length > 0
      ? asStringArray(source.arrangement)
      : typeof source.finalArrangement === "string"
        ? source.finalArrangement
            .split(/\s*[|,]\s*/u)
            .map((item) =>
              item
                .replace(/[\[\]]/g, "")
                .trim(),
            )
            .filter(Boolean)
        : [];
  const participantFromNodes = Array.isArray(source.nodes)
    ? source.nodes
        .map((node: any) =>
          String(
            node.entityId ??
              node.id ??
              "",
          ).trim(),
        )
        .filter(Boolean)
    : [];
  const participants = unique([
    ...asStringArray(source.participants),
    ...participantFromNodes,
    ...arrangement,
  ]);

  if (!participants.length && !arrangement.length) {
    return null;
  }

  const arrangementType = String(
    source.arrangementType ??
      source.subtype ??
      input.patternId ??
      "",
  ).toLowerCase();
  const orientationType = String(
    source.orientationType ??
      source.facing ??
      "",
  ).toLowerCase();
  const layout =
    arrangementType.includes("double") ||
    arrangementType.includes("parallel")
      ? "parallel"
      : arrangementType.includes("circular") ||
          arrangementType.includes("ring")
        ? "circular"
        : "linear";

  return {
    participants,
    arrangement,
    layout,
    orientation: localizeOrientation(
      orientationType,
      layout,
      language,
    ),
    generatedClues: [
      ...asStringArray(source.generatedClues),
      ...(Array.isArray(source.clues)
        ? source.clues
            .map((clue: any) =>
              String(
                clue.text ??
                  clue.clue ??
                  clue.statement ??
                  clue.expression ??
                  "",
              ),
            )
            .filter(Boolean)
        : []),
    ],
  };
}

function classifyMode(
  input: NativeRealizerInput,
  coverage: RealizationCoverageCategory,
): ExplanationMode {
  if (coverage === "seating") {
    return "seating";
  }

  const haystack = [
    input.patternId,
    input.question.text,
    JSON.stringify(input.logic ?? {}),
  ]
    .join(" ")
    .toLowerCase();

  if (/time|work|pipe|cistern|efficien/.test(haystack)) {
    return "time-work";
  }
  if (/percent|percentage|%/.test(haystack)) {
    return "percentage";
  }
  if (/ratio|proportion/.test(haystack)) {
    return "ratio";
  }
  if (/profit|loss|discount|selling|cost/.test(haystack)) {
    return "profit-loss";
  }
  return "quant";
}

function stripRoboticText(text: string) {
  return text
    .replace(/^step\s*\d+\s*[:.)-]?\s*/iu, "")
    .replace(/\bvariable\b/giu, "missing value")
    .replace(/\bconstraint\b/giu, "clue")
    .replace(/\binference\b/giu, "deduction")
    .replace(/\bbackwardly\b/giu, "by working backward")
    .replace(/\btherefore\b/giu, "so")
    .replace(/\bhence\b/giu, "so")
    .replace(/\s+/g, " ")
    .trim();
}

function collectPublicReasoning(
  input: NativeRealizerInput,
) {
  const {
    question,
    logic,
    procedural,
  } = getNestedRecords(input);
  const raw = [
    ...(Array.isArray(question.reasoningSteps)
      ? question.reasoningSteps
      : []),
    ...(Array.isArray(question.deductionArray)
      ? question.deductionArray
      : []),
    ...(Array.isArray(logic.reasoningSteps)
      ? logic.reasoningSteps
      : []),
    ...(Array.isArray(procedural.reasoningSteps)
      ? procedural.reasoningSteps
      : []),
  ];

  return unique(
    raw
      .map((entry) =>
        typeof entry === "string"
          ? entry
          : String(
              entry?.statement ??
                entry?.detail ??
                entry?.text ??
                entry?.mathjax ??
                "",
            ),
      )
      .map(stripRoboticText)
      .filter(Boolean),
  ).slice(0, 4);
}

function extractNumbers(text: string) {
  return (
    text.match(/[-+]?\d+(?:\.\d+)?%?/gu) ?? []
  );
}

function insightForMode(
  copy: TutorCopy,
  mode: ExplanationMode,
) {
  switch (mode) {
    case "seating":
      return copy.seatingInsight;
    case "time-work":
      return copy.timeWorkInsight;
    case "percentage":
      return copy.percentageInsight;
    case "ratio":
      return copy.ratioInsight;
    case "profit-loss":
      return copy.profitLossInsight;
    default:
      return copy.quantInsight;
  }
}

function localizeReasoningPoint(
  point: string,
  mode: ExplanationMode,
  language: RealizerLanguage,
) {
  if (language === "en") {
    if (mode === "time-work" && /\d+\/\d+/.test(point)) {
      return `${point}. The reason this works is that daily work shares can be added directly.`;
    }
    return point;
  }

  const numbers = extractNumbers(point);
  const numberText = numbers.length
    ? numbers.join(", ")
    : "";

  if (language === "hi") {
    if (mode === "time-work") {
      return numberText
        ? `दिए गए मान (${numberText}) को दैनिक दक्षता के रूप में पढ़िए; साथ काम करने पर ये दक्षताएँ जुड़ती हैं।`
        : "दैनिक दक्षता को जोड़ने से संयुक्त काम सीधे मिल जाता है।";
    }
    if (mode === "percentage") {
      return numberText
        ? `इन मानों (${numberText}) में आधार संख्या को स्थिर रखकर प्रतिशत परिवर्तन निकालना है।`
        : "प्रतिशत में पहले आधार संख्या पहचानना जरूरी है।";
    }
    if (mode === "seating") {
      return "इस संकेत से एक छोटा पक्का समूह बनता है, फिर बाकी सीटों पर गलत संभावनाएँ हटती जाती हैं।";
    }
    return numberText
      ? `दिए गए मान (${numberText}) को आपस में जोड़कर आवश्यक मान निकाला जाता है।`
      : "दिए गए संबंध को सरल करके उत्तर तक पहुँचा जाता है।";
  }

  if (mode === "time-work") {
    return numberText
      ? `ਦਿੱਤੇ ਮੁੱਲਾਂ (${numberText}) ਨੂੰ ਪ੍ਰਤੀ ਦਿਨ ਦੇ ਕੰਮ ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਪੜ੍ਹੋ; ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਵੇਲੇ ਇਹ ਹਿੱਸੇ ਜੁੜ ਜਾਂਦੇ ਹਨ।`
      : "ਰੋਜ਼ਾਨਾ ਕੰਮ ਦੇ ਹਿੱਸੇ ਜੋੜਨ ਨਾਲ ਇਕੱਠਾ ਕੰਮ ਸਿੱਧਾ ਮਿਲ ਜਾਂਦਾ ਹੈ।";
  }
  if (mode === "percentage") {
    return numberText
      ? `ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ (${numberText}) ਵਿੱਚ ਅਧਾਰ ਮੁੱਲ ਪੱਕਾ ਰੱਖ ਕੇ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਕੱਢਣਾ ਹੈ।`
      : "ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਪਹਿਲਾਂ ਅਧਾਰ ਮੁੱਲ ਪਛਾਣਨਾ ਜ਼ਰੂਰੀ ਹੈ।";
  }
  if (mode === "seating") {
    return "ਇਸ ਇਸ਼ਾਰੇ ਨਾਲ ਇੱਕ ਛੋਟਾ ਪੱਕਾ ਸਮੂਹ ਬਣਦਾ ਹੈ, ਫਿਰ ਬਾਕੀ ਸੀਟਾਂ ਤੋਂ ਗਲਤ ਸੰਭਾਵਨਾਵਾਂ ਹਟਦੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।";
  }
  return numberText
    ? `ਦਿੱਤੇ ਮੁੱਲਾਂ (${numberText}) ਨੂੰ ਆਪਸ ਵਿੱਚ ਜੋੜ ਕੇ ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।`
    : "ਦਿੱਤੇ ਰਿਸ਼ਤੇ ਨੂੰ ਸੌਖਾ ਕਰਕੇ ਜਵਾਬ ਤੱਕ ਪਹੁੰਚਦੇ ਹਾਂ।";
}

function buildLeftoverPoint(
  snapshot: SeatingSnapshot,
  language: RealizerLanguage,
) {
  if (!snapshot.arrangement.length) {
    return undefined;
  }

  const mentionedText =
    snapshot.generatedClues.join(" ");
  const missing = snapshot.participants.filter(
    (name) => !mentionedText.includes(name),
  );

  if (!missing.length) {
    return undefined;
  }

  const placements = missing
    .map((name) => {
      const seatIndex =
        snapshot.arrangement.indexOf(name);
      const seatLabel =
        language === "hi"
          ? `सीट ${seatIndex + 1}`
          : language === "pa"
            ? `ਸੀਟ ${seatIndex + 1}`
            : `Seat ${seatIndex + 1}`;
      return `${name} - ${seatLabel}`;
    })
    .join(", ");

  return TUTOR_COPY[language].leftover(
    missing,
    placements,
  );
}

function buildPlan(
  input: NativeRealizerInput,
  language: RealizerLanguage,
): ExplanationPlan {
  const coverage =
    detectCoverageCategory(input);
  const mode = classifyMode(
    input,
    coverage,
  );
  const copy = TUTOR_COPY[language];
  const seating =
    mode === "seating"
      ? extractSeatingSnapshot(
          input,
          language,
        )
      : null;
  const publicSteps =
    collectPublicReasoning(input);
  const keyPoints = publicSteps.map((point) =>
    localizeReasoningPoint(
      point,
      mode,
      language,
    ),
  );

  if (seating) {
    const leftover = buildLeftoverPoint(
      seating,
      language,
    );
    if (leftover) {
      keyPoints.push(leftover);
    }
  }

  if (keyPoints.length === 0) {
    keyPoints.push(
      insightForMode(copy, mode),
    );
  }

  return {
    mode,
    insight: insightForMode(copy, mode),
    keyPoints: unique(keyPoints).slice(0, 4),
    finalAnswer:
      extractLocalizedAnswer(
        input,
        language,
      ) || copy.noAnswer,
    visualAnchor: seating?.arrangement.length
      ? `[${seating.arrangement.join(" | ")}]`
      : undefined,
    seating: seating ?? undefined,
  };
}

function renderPlan(
  plan: ExplanationPlan,
  language: RealizerLanguage,
  seed: string,
) {
  const copy = TUTOR_COPY[language];
  const setup =
    plan.mode === "seating" && plan.seating
      ? copy.seatingSetup(plan.seating)
      : copy.quantSetup(plan.mode);
  const insight = copy.point(
    pickVariant(copy.transitions, seed, 0),
    plan.insight,
  );
  const points = plan.keyPoints.map(
    (point, index) =>
      copy.point(
        pickVariant(
          copy.transitions,
          seed,
          index + 1,
        ),
        point,
      ),
  );
  const sections = [
    `${copy.setupHeader}\n${setup}`,
    `${copy.reasoningHeader}\n${[
      insight,
      ...points,
    ].join("\n")}`,
  ];

  if (plan.visualAnchor) {
    sections.push(
      `${copy.visualHeader}\n${copy.visual(plan.visualAnchor)}`,
    );
  }

  sections.push(
    `${copy.conclusionHeader}\n${copy.final(plan.finalAnswer)}`,
  );

  return sections.join("\n\n");
}

export function realizeExplanation(
  input: NativeRealizerInput,
  language: RealizerLanguage,
) {
  const plan = buildPlan(input, language);
  const seed = `${input.patternId ?? ""}:${input.question.text}:${language}`;

  return renderPlan(
    plan,
    language,
    seed,
  ).normalize("NFC");
}
