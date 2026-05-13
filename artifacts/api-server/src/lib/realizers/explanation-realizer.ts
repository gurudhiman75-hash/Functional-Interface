import {
  detectCoverageCategory,
} from "./coverage";
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
    setupHeader: "Game plan",
    reasoningHeader: "How to think about it",
    visualHeader: "Final arrangement",
    conclusionHeader: "Answer",
    noAnswer: "the required option",
    seatingSetup: (snapshot) => {
      const names = joinNames(
        snapshot.participants,
        "en",
      );
      if (snapshot.layout === "circular") {
        return `${snapshot.participants.length} persons (${names}) are seated around a circular table, ${snapshot.orientation}. The important thing is to lock one relation first and then fill the remaining seats around it.`;
      }
      if (snapshot.layout === "parallel") {
        return `${snapshot.participants.length} persons (${names}) are seated in two rows, ${snapshot.orientation}. In this type, row and facing clues should be handled together.`;
      }
      return `${snapshot.participants.length} persons (${names}) are seated in a straight line, ${snapshot.orientation}. Start from the clue that fixes a position or a pair.`;
    },
    quantSetup: (mode) => {
      if (mode === "time-work") {
        return "Use efficiency thinking here. Instead of treating the work as a long story, convert each person's work into a per-day share.";
      }
      if (mode === "percentage") {
        return "Keep the base value clear. Most percentage mistakes happen when the calculation is made on the changed value instead of the original value.";
      }
      if (mode === "ratio") {
        return "Ratios make the calculation lighter because they compare parts directly without carrying unnecessary totals.";
      }
      if (mode === "profit-loss") {
        return "Track cost price as the anchor. Profit, loss, discount, and selling price become easier once the anchor is fixed.";
      }
      return "Pick the easiest anchor first, then connect the given values to the required answer.";
    },
    transitions: [
      "First,",
      "Notice that,",
      "Since this is fixed,",
      "A quicker approach is,",
      "This tells us that",
    ],
    seatingInsight:
      "For seating puzzles, avoid jumping to the answer. Build small confirmed blocks and use No-Go Zones to remove impossible seats.",
    timeWorkInsight:
      "Efficiencies add when people work together, so the combined daily work is the key shortcut.",
    percentageInsight:
      "The base is the real shortcut. Once the base is clear, the percentage change follows naturally.",
    ratioInsight:
      "The useful move is to compare parts, not absolute values, unless the question asks for a final total.",
    profitLossInsight:
      "Cost price is the anchor; every gain or loss is compared against it unless stated otherwise.",
    quantInsight:
      "Focus on the relationship between the given values before doing arithmetic.",
    leftover: (names, placements) =>
      `The intro names every person, so even if ${joinNames(names, "en")} is not heavily used in the clues, the remaining empty seat must still be filled. That gives us ${placements}.`,
    point: (transition, body) =>
      `${transition} ${body}`,
    visual: (visual) =>
      `So the working layout becomes ${visual}.`,
    final: (answer) =>
      `Hence, the correct answer is ${answer}.`,
  },
  hi: {
    setupHeader: "रणनीति",
    reasoningHeader: "सोचने का सही तरीका",
    visualHeader: "अंतिम व्यवस्था",
    conclusionHeader: "उत्तर",
    noAnswer: "आवश्यक विकल्प",
    seatingSetup: (snapshot) => {
      const names = joinNames(
        snapshot.participants,
        "hi",
      );
      if (snapshot.layout === "circular") {
        return `${snapshot.participants.length} व्यक्ति (${names}) एक वृत्ताकार मेज के चारों ओर ${snapshot.orientation} बैठे हैं। ऐसे प्रश्नों में पहले एक पक्का संबंध बनाइए, फिर बाकी सीटें उसी के आसपास भरती हैं।`;
      }
      if (snapshot.layout === "parallel") {
        return `${snapshot.participants.length} व्यक्ति (${names}) दो पंक्तियों में बैठे हैं, ${snapshot.orientation}। यहाँ पंक्ति और सामने बैठने वाले संकेतों को साथ-साथ पढ़ना बेहतर रहता है।`;
      }
      return `${snapshot.participants.length} व्यक्ति (${names}) एक सीधी पंक्ति में बैठे हैं, ${snapshot.orientation}। सबसे पहले उस संकेत को पकड़िए जो कोई स्थान या जोड़ी पक्की करता है।`;
    },
    quantSetup: (mode) => {
      if (mode === "time-work") {
        return "यहाँ दक्षता वाला तरीका सबसे तेज है। पूरे काम को लंबा बनाकर न देखें; हर व्यक्ति एक दिन में कितना काम करता है, इसे पकड़ें।";
      }
      if (mode === "percentage") {
        return "आधार संख्या साफ रखिए। प्रतिशत के अधिकतर जाल इसलिए बनते हैं क्योंकि गणना बदले हुए मान पर कर दी जाती है।";
      }
      if (mode === "ratio") {
        return "अनुपात सीधे भागों की तुलना कर देता है, इसलिए अनावश्यक कुल मान लेकर चलने की जरूरत कम हो जाती है।";
      }
      if (mode === "profit-loss") {
        return "क्रय मूल्य को आधार मानिए। लाभ, हानि, छूट और विक्रय मूल्य उसी आधार से साफ हो जाते हैं।";
      }
      return "सबसे आसान आधार पहले पकड़िए, फिर दिए गए मानों को उत्तर से जोड़िए।";
    },
    transitions: [
      "सबसे पहले,",
      "ध्यान दें कि",
      "इससे साफ होता है कि",
      "सीधे गणना करने के बजाय,",
      "अब",
    ],
    seatingInsight:
      "बैठक व्यवस्था में उत्तर पर सीधे न जाएँ। छोटी-छोटी पक्की जोड़ियाँ बनाइए और No-Go Zones से गलत सीटें हटाइए।",
    timeWorkInsight:
      "जब लोग साथ काम करते हैं तो उनकी दैनिक दक्षताएँ जुड़ती हैं; यही इस प्रकार का सबसे तेज संकेत है।",
    percentageInsight:
      "आधार संख्या ही असली शॉर्टकट है। आधार साफ होते ही प्रतिशत परिवर्तन आसान हो जाता है।",
    ratioInsight:
      "पहले भागों की तुलना करें; कुल मान तभी निकालें जब प्रश्न सच में कुल पूछ रहा हो।",
    profitLossInsight:
      "क्रय मूल्य को एंकर रखिए, क्योंकि लाभ या हानि उसी से तुलना करके निकाली जाती है।",
    quantInsight:
      "गणना शुरू करने से पहले दिए गए मानों के संबंध को समझना ज्यादा उपयोगी है।",
    leftover: (names, placements) =>
      `प्रश्न की शुरुआत में सभी नाम दिए गए हैं, इसलिए ${joinNames(names, "hi")} यदि संकेतों में कम भी आए, तब भी बची हुई सीट भरनी ही होगी। इससे ${placements} मिलता है।`,
    point: (transition, body) =>
      `${transition} ${body}`,
    visual: (visual) =>
      `इसलिए कामचलाऊ व्यवस्था ${visual} बनती है।`,
    final: (answer) =>
      `अतः सही उत्तर ${answer} है।`,
  },
  pa: {
    setupHeader: "ਹੱਲ ਦੀ ਸੋਚ",
    reasoningHeader: "ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਕਿਵੇਂ ਸੋਚੀਏ",
    visualHeader: "ਅੰਤਿਮ ਵਿਵਸਥਾ",
    conclusionHeader: "ਜਵਾਬ",
    noAnswer: "ਲੋੜੀਂਦਾ ਵਿਕਲਪ",
    seatingSetup: (snapshot) => {
      const names = joinNames(
        snapshot.participants,
        "pa",
      );
      if (snapshot.layout === "circular") {
        return `${snapshot.participants.length} ਵਿਅਕਤੀ (${names}) ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ${snapshot.orientation} ਬੈਠੇ ਹਨ। ਇਸ ਕਿਸਮ ਦੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪਹਿਲਾਂ ਇੱਕ ਪੱਕਾ ਸੰਬੰਧ ਬਣਾਓ, ਫਿਰ ਬਾਕੀ ਸੀਟਾਂ ਉਸ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਭਰਦੀਆਂ ਹਨ।`;
      }
      if (snapshot.layout === "parallel") {
        return `${snapshot.participants.length} ਵਿਅਕਤੀ (${names}) ਦੋ ਕਤਾਰਾਂ ਵਿੱਚ ਬੈਠੇ ਹਨ, ${snapshot.orientation}। ਇੱਥੇ ਕਤਾਰ ਅਤੇ ਸਾਹਮਣੇ ਵਾਲੇ ਇਸ਼ਾਰਿਆਂ ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹਨਾ ਵਧੀਆ ਰਹਿੰਦਾ ਹੈ।`;
      }
      return `${snapshot.participants.length} ਵਿਅਕਤੀ (${names}) ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ, ${snapshot.orientation}। ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਉਹ ਇਸ਼ਾਰਾ ਫੜੋ ਜੋ ਕੋਈ ਜਗ੍ਹਾ ਜਾਂ ਜੋੜੀ ਪੱਕੀ ਕਰਦਾ ਹੈ।`;
    },
    quantSetup: (mode) => {
      if (mode === "time-work") {
        return "ਇੱਥੇ efficiency ਵਾਲੀ ਸੋਚ ਤੇਜ਼ ਹੈ। ਪੂਰੇ ਕੰਮ ਨੂੰ ਲੰਮਾ ਨਾ ਬਣਾਓ; ਇਹ ਦੇਖੋ ਕਿ ਹਰ ਵਿਅਕਤੀ ਇੱਕ ਦਿਨ ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰਦਾ ਹੈ।";
      }
      if (mode === "percentage") {
        return "base value ਸਾਫ਼ ਰੱਖੋ। percentage ਦੇ ਜ਼ਿਆਦਾਤਰ traps ਇਸ ਲਈ ਬਣਦੇ ਹਨ ਕਿਉਂਕਿ ਗਿਣਤੀ ਬਦਲੇ ਹੋਏ ਮੁੱਲ 'ਤੇ ਕਰ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।";
      }
      if (mode === "ratio") {
        return "ratio ਸਿੱਧਾ ਹਿੱਸਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਬਿਨਾਂ ਲੋੜ ਦੇ total ਨਾਲ ਕੰਮ ਭਾਰੀ ਨਹੀਂ ਹੁੰਦਾ।";
      }
      if (mode === "profit-loss") {
        return "cost price ਨੂੰ anchor ਮੰਨੋ। profit, loss, discount ਅਤੇ selling price ਉਸੇ ਨਾਲ ਸਾਫ਼ ਹੋ ਜਾਂਦੇ ਹਨ।";
      }
      return "ਸਭ ਤੋਂ ਆਸਾਨ anchor ਪਹਿਲਾਂ ਫੜੋ, ਫਿਰ ਦਿੱਤੇ ਮੁੱਲਾਂ ਨੂੰ ਜਵਾਬ ਨਾਲ ਜੋੜੋ।";
    },
    transitions: [
      "ਸਭ ਤੋਂ ਪਹਿਲਾਂ,",
      "ਧਿਆਨ ਦਿਓ ਕਿ",
      "ਇਸ ਤੋਂ ਸਾਫ਼ ਹੁੰਦਾ ਹੈ ਕਿ",
      "ਸਿੱਧੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਬਜਾਏ,",
      "ਹੁਣ",
    ],
    seatingInsight:
      "seating puzzle ਵਿੱਚ ਸਿੱਧਾ ਜਵਾਬ ਲੱਭਣ ਦੀ ਬਜਾਏ ਛੋਟੀਆਂ ਪੱਕੀਆਂ ਜੋੜੀਆਂ ਬਣਾਓ ਅਤੇ No-Go Zones ਨਾਲ ਗਲਤ ਸੀਟਾਂ ਹਟਾਓ।",
    timeWorkInsight:
      "ਜਦੋਂ ਲੋਕ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ ਤਾਂ ਉਨ੍ਹਾਂ ਦੀ ਦਿਨ ਦੀ efficiency ਜੁੜਦੀ ਹੈ; ਇਹੀ ਇਸ topic ਦਾ ਤੇਜ਼ shortcut ਹੈ।",
    percentageInsight:
      "base ਹੀ ਅਸਲ shortcut ਹੈ। base ਸਾਫ਼ ਹੋਵੇ ਤਾਂ percentage change ਆਪਣੇ ਆਪ ਆਸਾਨ ਹੋ ਜਾਂਦਾ ਹੈ।",
    ratioInsight:
      "ਪਹਿਲਾਂ ਹਿੱਸਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ; total ਸਿਰਫ਼ ਉਦੋਂ ਕੱਢੋ ਜਦੋਂ ਪ੍ਰਸ਼ਨ total ਪੁੱਛੇ।",
    profitLossInsight:
      "cost price ਨੂੰ anchor ਰੱਖੋ, ਕਿਉਂਕਿ profit ਜਾਂ loss ਉਸੇ ਨਾਲ compare ਹੁੰਦਾ ਹੈ।",
    quantInsight:
      "ਗਿਣਤੀ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦਿੱਤੇ ਮੁੱਲਾਂ ਦਾ ਆਪਸੀ ਰਿਸ਼ਤਾ ਸਮਝਣਾ ਜ਼ਿਆਦਾ ਲਾਭਦਾਇਕ ਹੈ।",
    leftover: (names, placements) =>
      `ਪ੍ਰਸ਼ਨ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਸਾਰੇ ਨਾਮ ਦਿੱਤੇ ਗਏ ਹਨ, ਇਸ ਲਈ ${joinNames(names, "pa")} ਭਾਵੇਂ ਇਸ਼ਾਰਿਆਂ ਵਿੱਚ ਘੱਟ ਆਵੇ, ਬਚੀ ਹੋਈ ਸੀਟ ਫਿਰ ਵੀ ਭਰਨੀ ਪਵੇਗੀ। ਇਸ ਨਾਲ ${placements} ਮਿਲਦਾ ਹੈ।`,
    point: (transition, body) =>
      `${transition} ${body}`,
    visual: (visual) =>
      `ਇਸ ਲਈ ਕੰਮ ਵਾਲੀ ਵਿਵਸਥਾ ${visual} ਬਣਦੀ ਹੈ।`,
    final: (answer) =>
      `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${answer} ਹੈ।`,
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
      return "इस संकेत से एक छोटा पक्का ब्लॉक बनता है, फिर बाकी सीटों पर गलत संभावनाएँ हटती जाती हैं।";
    }
    return numberText
      ? `दिए गए मान (${numberText}) को आपस में जोड़कर आवश्यक मान निकाला जाता है।`
      : "दिए गए संबंध को सरल करके उत्तर तक पहुँचा जाता है।";
  }

  if (mode === "time-work") {
    return numberText
      ? `ਦਿੱਤੇ ਮੁੱਲਾਂ (${numberText}) ਨੂੰ ਦਿਨ ਦੀ efficiency ਵਜੋਂ ਪੜ੍ਹੋ; ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਤੇ ਇਹ efficiencies ਜੁੜਦੀਆਂ ਹਨ।`
      : "ਦਿਨ ਦੀ efficiency ਜੋੜਨ ਨਾਲ combined work ਸਿੱਧਾ ਮਿਲ ਜਾਂਦਾ ਹੈ।";
  }
  if (mode === "percentage") {
    return numberText
      ? `ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ (${numberText}) ਵਿੱਚ base value ਨੂੰ ਪੱਕਾ ਰੱਖ ਕੇ percentage change ਕੱਢਣਾ ਹੈ।`
      : "percentage ਵਿੱਚ ਪਹਿਲਾਂ base value ਪਛਾਣਨੀ ਜ਼ਰੂਰੀ ਹੈ।";
  }
  if (mode === "seating") {
    return "ਇਸ ਇਸ਼ਾਰੇ ਨਾਲ ਇੱਕ ਛੋਟਾ ਪੱਕਾ block ਬਣਦਾ ਹੈ, ਫਿਰ ਬਾਕੀ ਸੀਟਾਂ ਤੋਂ ਗਲਤ ਸੰਭਾਵਨਾਵਾਂ ਹਟਦੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।";
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
      extractAnswer(input) || copy.noAnswer,
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
