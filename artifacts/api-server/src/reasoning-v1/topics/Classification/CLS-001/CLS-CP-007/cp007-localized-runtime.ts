import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "./cp007-english-contracts";
import {
  clsCp007FormatItem,
  clsCp007GapEqualityPattern,
  clsCp007LetterPosition,
  clsCp007NormalizedGapRatio,
  clsCp007RepeatPattern,
  clsCp007SignedGaps,
} from "./cluster-domain";
import { clsCp007FormatPairItem } from "./cluster-pair-domain";
import type { ClsCp007PairItem } from "./cluster-pair-types";
import type { ClsCp007ClusterItem, ClsCp007PrototypeId, ClsCp007RuleId } from "./types";

export type ClsCp007LocalizedLocale = "hi-IN" | "pa-IN";

function tx(locale: ClsCp007LocalizedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function displayPattern(value: string): string {
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return value
    .split("-")
    .map((entry) => labels[Number(entry) - 1] ?? entry)
    .join("–");
}

function singleStem(locale: ClsCp007LocalizedLocale, seed: number): string {
  const hindi = [
    "निम्नलिखित में से अलग अक्षर-समूह चुनिए।",
    "कौन-सा अक्षर-समूह बाकी समूहों से अलग है?",
    "बाकी अक्षर-समूह एक समान नियम का पालन करते हैं। अलग समूह पहचानिए।",
    "वह अक्षर-समूह चुनिए जिसका आंतरिक वर्णक्रम बाकी से अलग है।",
    "कौन-सा पूरा अक्षर-समूह समान वर्णमाला संबंध का पालन नहीं करता?",
  ];
  const punjabi = [
    "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਅੱਖਰ-ਸਮੂਹ ਚੁਣੋ।",
    "ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਬਾਕੀ ਸਮੂਹਾਂ ਤੋਂ ਵੱਖਰਾ ਹੈ?",
    "ਬਾਕੀ ਅੱਖਰ-ਸਮੂਹ ਇੱਕੋ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ। ਵੱਖਰਾ ਸਮੂਹ ਪਛਾਣੋ।",
    "ਉਹ ਅੱਖਰ-ਸਮੂਹ ਚੁਣੋ ਜਿਸ ਦਾ ਅੰਦਰੂਨੀ ਵਰਣ-ਕ੍ਰਮ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ।",
    "ਕਿਹੜਾ ਪੂਰਾ ਅੱਖਰ-ਸਮੂਹ ਸਾਂਝੇ ਵਰਣਮਾਲਾ ਸੰਬੰਧ ਦੀ ਪਾਲਣਾ ਨਹੀਂ ਕਰਦਾ?",
  ];
  const forms = locale === "hi-IN" ? hindi : punjabi;
  return forms[seed % forms.length]!;
}

function relationText(
  ruleId: ClsCp007RuleId,
  commonValue: string,
  locale: ClsCp007LocalizedLocale,
): string {
  const vector = commonValue.split(",").map(Number);
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return tx(locale, `क्रमिक अंतर ${vector.map(signed).join(", ")}`, `ਲੜੀਵਾਰ ਅੰਤਰ ${vector.map(signed).join(", ")}`);
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return tx(locale, `क्रमिक अंतर के परिमाण ${vector.map(Math.abs).join(", ")}`, `ਲੜੀਵਾਰ ਅੰਤਰਾਂ ਦੇ ਪਰਿਮਾਣ ${vector.map(Math.abs).join(", ")}`);
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return tx(locale, `घटाया हुआ अंतर-अनुपात ${vector.map(signed).join(":")}`, `ਘਟਾਇਆ ਹੋਇਆ ਅੰਤਰ-ਅਨੁਪਾਤ ${vector.map(signed).join(":")}`);
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return tx(locale, `अंतर-समानता क्रम ${displayPattern(commonValue)}`, `ਅੰਤਰ-ਸਮਾਨਤਾ ਕ੍ਰਮ ${displayPattern(commonValue)}`);
    case "CLUSTER_VOWEL_COUNT":
      return tx(locale, `${commonValue} स्वर`, `${commonValue} ਸਵਰ`);
    case "CLUSTER_REPEAT_PATTERN":
      return tx(locale, `दोहराव क्रम ${displayPattern(commonValue)}`, `ਦੁਹਰਾਵ ਕ੍ਰਮ ${displayPattern(commonValue)}`);
    case "CLUSTER_POSITION_SUM":
      return tx(locale, `वर्णमाला स्थानों का योग ${commonValue}`, `ਵਰਣਮਾਲਾ ਸਥਾਨਾਂ ਦਾ ਜੋੜ ${commonValue}`);
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return tx(locale, "पहले दो स्थानों का योग तीसरे स्थान के बराबर", "ਪਹਿਲੇ ਦੋ ਸਥਾਨਾਂ ਦਾ ਜੋੜ ਤੀਜੇ ਸਥਾਨ ਦੇ ਬਰਾਬਰ");
    case "CLUSTER_HALF_SUM_DIFFERENCE":
      return tx(locale, `पहली और दूसरी जोड़ी के योगों का अंतर ${commonValue}`, `ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਜੋੜੀ ਦੇ ਜੋੜਾਂ ਦਾ ਅੰਤਰ ${commonValue}`);
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return tx(locale, "स्थान 1–3 और 2–4 की प्रत्येक विपरीत जोड़ी का योग 27", "ਸਥਾਨ 1–3 ਅਤੇ 2–4 ਦੀ ਹਰ ਵਿਰੋਧੀ ਜੋੜੀ ਦਾ ਜੋੜ 27");
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return tx(locale, "स्थान 1–2 और 3–4 की प्रत्येक विपरीत जोड़ी का योग 27", "ਸਥਾਨ 1–2 ਅਤੇ 3–4 ਦੀ ਹਰ ਵਿਰੋਧੀ ਜੋੜੀ ਦਾ ਜੋੜ 27");
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return tx(locale, `दोनों पास-पास जोड़ियों के क्रमिक अंतर ${vector.map(signed).join(", ")}`, `ਦੋਵੇਂ ਨਾਲ-ਨਾਲ ਜੋੜੀਆਂ ਦੇ ਲੜੀਵਾਰ ਅੰਤਰ ${vector.map(signed).join(", ")}`);
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return tx(locale, `बीच के दो अक्षरों के स्थानों का अंतर ${commonValue}`, `ਵਿਚਕਾਰਲੇ ਦੋ ਅੱਖਰਾਂ ਦੇ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ${commonValue}`);
  }
}

function singleEvidence(
  item: ClsCp007ClusterItem,
  ruleId: ClsCp007RuleId,
  locale: ClsCp007LocalizedLocale,
  matches: boolean,
): string {
  const cluster = clsCp007FormatItem(item);
  const p = item.letters.map(clsCp007LetterPosition);
  const gaps = clsCp007SignedGaps(item);
  const ending = tx(
    locale,
    matches ? "यह समान नियम का पालन करता है।" : "यह समान नियम का पालन नहीं करता।",
    matches ? "ਇਹ ਸਾਂਝੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।" : "ਇਹ ਸਾਂਝੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਨਹੀਂ ਕਰਦਾ।",
  );
  let detail: string;
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      detail = tx(locale, `स्थान ${p.join(", ")}; अंतर ${gaps.map(signed).join(", ")}`, `ਸਥਾਨ ${p.join(", ")}; ਅੰਤਰ ${gaps.map(signed).join(", ")}`);
      break;
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      detail = tx(locale, `स्थान ${p.join(", ")}; अंतर के परिमाण ${gaps.map((gap) => Math.abs(gap)).join(", ")}`, `ਸਥਾਨ ${p.join(", ")}; ਅੰਤਰਾਂ ਦੇ ਪਰਿਮਾਣ ${gaps.map((gap) => Math.abs(gap)).join(", ")}`);
      break;
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO": {
      const ratio = clsCp007NormalizedGapRatio(gaps).map(signed).join(":");
      detail = tx(locale, `अंतर ${gaps.map(signed).join(", ")}; घटाया अनुपात ${ratio}`, `ਅੰਤਰ ${gaps.map(signed).join(", ")}; ਘਟਾਇਆ ਅਨੁਪਾਤ ${ratio}`);
      break;
    }
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      detail = tx(locale, `अंतर ${gaps.map(signed).join(", ")}; समानता क्रम ${displayPattern(clsCp007GapEqualityPattern(item))}`, `ਅੰਤਰ ${gaps.map(signed).join(", ")}; ਸਮਾਨਤਾ ਕ੍ਰਮ ${displayPattern(clsCp007GapEqualityPattern(item))}`);
      break;
    case "CLUSTER_VOWEL_COUNT": {
      const count = item.letters.filter((letter) => "AEIOU".includes(letter)).length;
      detail = tx(locale, `${count} स्वर`, `${count} ਸਵਰ`);
      break;
    }
    case "CLUSTER_REPEAT_PATTERN":
      detail = tx(locale, `दोहराव क्रम ${displayPattern(clsCp007RepeatPattern(item))}`, `ਦੁਹਰਾਵ ਕ੍ਰਮ ${displayPattern(clsCp007RepeatPattern(item))}`);
      break;
    case "CLUSTER_POSITION_SUM":
      detail = tx(locale, `${p.join(" + ")} = ${p.reduce((total, value) => total + value, 0)}`, `${p.join(" + ")} = ${p.reduce((total, value) => total + value, 0)}`);
      break;
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      detail = `${p[0]} + ${p[1]} = ${p[0]! + p[1]!}; ${tx(locale, "तीसरा स्थान", "ਤੀਜਾ ਸਥਾਨ")} ${p[2]}`;
      break;
    case "CLUSTER_HALF_SUM_DIFFERENCE": {
      const left = p[0]! + p[1]!;
      const right = p[2]! + p[3]!;
      detail = `|(${p[0]} + ${p[1]}) - (${p[2]} + ${p[3]})| = |${left} - ${right}| = ${Math.abs(left - right)}`;
      break;
    }
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      detail = tx(locale, `स्थान 1+3 = ${p[0]! + p[2]!}; स्थान 2+4 = ${p[1]! + p[3]!}`, `ਸਥਾਨ 1+3 = ${p[0]! + p[2]!}; ਸਥਾਨ 2+4 = ${p[1]! + p[3]!}`);
      break;
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      detail = tx(locale, `स्थान 1+2 = ${p[0]! + p[1]!}; स्थान 3+4 = ${p[2]! + p[3]!}`, `ਸਥਾਨ 1+2 = ${p[0]! + p[1]!}; ਸਥਾਨ 3+4 = ${p[2]! + p[3]!}`);
      break;
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      detail = tx(locale, `पहली जोड़ी का अंतर ${signed(p[1]! - p[0]!)}, दूसरी जोड़ी का अंतर ${signed(p[3]! - p[2]!)}`, `ਪਹਿਲੀ ਜੋੜੀ ਦਾ ਅੰਤਰ ${signed(p[1]! - p[0]!)}, ਦੂਜੀ ਜੋੜੀ ਦਾ ਅੰਤਰ ${signed(p[3]! - p[2]!)}`);
      break;
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      detail = tx(locale, `बीच के स्थान ${p[1]} और ${p[2]}; अंतर ${Math.abs(p[2]! - p[1]!)}`, `ਵਿਚਕਾਰਲੇ ਸਥਾਨ ${p[1]} ਅਤੇ ${p[2]}; ਅੰਤਰ ${Math.abs(p[2]! - p[1]!)}`);
      break;
  }
  return `${cluster}: ${detail}; ${ending}`;
}

function pairStem(locale: ClsCp007LocalizedLocale, seed: number): string {
  const hindi = [
    "निम्नलिखित में से अलग अक्षर-समूह जोड़ी चुनिए।",
    "कौन-सी अक्षर-समूह जोड़ी बाकी जोड़ियों से अलग है?",
    "बाकी जोड़ियों में दायाँ समूह बाएँ समूह से समान वर्णमाला संबंध से बना है। अलग जोड़ी चुनिए।",
    "वह जोड़ी पहचानिए जिसमें संबंधित अक्षर बाकी जोड़ियों वाला नियम नहीं मानते।",
  ];
  const punjabi = [
    "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰੀ ਅੱਖਰ-ਸਮੂਹ ਜੋੜੀ ਚੁਣੋ।",
    "ਕਿਹੜੀ ਅੱਖਰ-ਸਮੂਹ ਜੋੜੀ ਬਾਕੀ ਜੋੜੀਆਂ ਤੋਂ ਵੱਖਰੀ ਹੈ?",
    "ਬਾਕੀ ਜੋੜੀਆਂ ਵਿੱਚ ਸੱਜਾ ਸਮੂਹ ਖੱਬੇ ਸਮੂਹ ਤੋਂ ਇੱਕੋ ਵਰਣਮਾਲਾ ਸੰਬੰਧ ਨਾਲ ਬਣਿਆ ਹੈ। ਵੱਖਰੀ ਜੋੜੀ ਚੁਣੋ।",
    "ਉਹ ਜੋੜੀ ਪਛਾਣੋ ਜਿਸ ਵਿੱਚ ਸੰਬੰਧਿਤ ਅੱਖਰ ਬਾਕੀ ਜੋੜੀਆਂ ਵਾਲਾ ਨਿਯਮ ਨਹੀਂ ਮੰਨਦੇ।",
  ];
  const forms = locale === "hi-IN" ? hindi : punjabi;
  return forms[seed % forms.length]!;
}

function pairEvidence(item: ClsCp007PairItem, locale: ClsCp007LocalizedLocale, matches: boolean): string {
  const left = item.left.map(clsCp007LetterPosition);
  const right = item.right.map(clsCp007LetterPosition);
  const totals = left.map((value, index) => value + right[index]!);
  const checks = item.left.map((letter, index) => `${letter}(${left[index]}) + ${item.right[index]}(${right[index]}) = ${totals[index]}`);
  return `${clsCp007FormatPairItem(item)}: ${checks.join("; ")}; ${tx(
    locale,
    matches ? "हर संबंधित जोड़ी का योग 27 है।" : "हर संबंधित जोड़ी का योग 27 नहीं है।",
    matches ? "ਹਰ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਹੈ।" : "ਹਰ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਨਹੀਂ ਹੈ।",
  )}`;
}

export function generateClsCp007LocalizedClusterQuestion(
  locale: ClsCp007LocalizedLocale,
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  const source = generateClsCp007PermanentClusterQuestion(prototypeId, seed, optionCount);
  const evidenceByOption = source.items.map((item, index) =>
    singleEvidence(item, source.intendedRuleId, locale, index !== source.correctIndex),
  );
  return {
    ...source,
    stem: singleStem(locale, seed),
    evidenceByOption,
    explanation: {
      coreConcept: [tx(locale, `बाकी समूहों में समान संबंध है: ${relationText(source.intendedRuleId, source.intendedRuleValue, locale)}।`, `ਬਾਕੀ ਸਮੂਹਾਂ ਵਿੱਚ ਸਾਂਝਾ ਸੰਬੰਧ ਹੈ: ${relationText(source.intendedRuleId, source.intendedRuleValue, locale)}।`)],
      stepByStep: [
        ...evidenceByOption,
        tx(locale, `इसलिए ${source.answer} अलग अक्षर-समूह है।`, `ਇਸ ਲਈ ${source.answer} ਵੱਖਰਾ ਅੱਖਰ-ਸਮੂਹ ਹੈ।`),
      ],
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...source.metadata,
      locale,
      runtimeVersion: "cls-cp007-multilingual-review-v1" as const,
      canonicalLocale: "en-IN" as const,
      canonicalRuntimeVersion: "cls-cp007-permanent-english-v1" as const,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED" as const,
    },
    lifecycle: {
      ...source.lifecycle,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED" as const,
    },
  };
}

export function generateClsCp007LocalizedPairQuestion(
  locale: ClsCp007LocalizedLocale,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  const source = generateClsCp007PermanentClusterPairQuestion(seed, optionCount);
  const evidenceByOption = source.items.map((item, index) => pairEvidence(item, locale, index !== source.correctIndex));
  return {
    ...source,
    stem: pairStem(locale, seed),
    evidenceByOption,
    explanation: {
      coreConcept: [tx(
        locale,
        "बाकी जोड़ियों में बाएँ और दाएँ समूह के संबंधित अक्षर वर्णमाला में विपरीत स्थानों पर हैं; हर संबंधित स्थान का योग 27 है।",
        "ਬਾਕੀ ਜੋੜੀਆਂ ਵਿੱਚ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਸਮੂਹ ਦੇ ਸੰਬੰਧਿਤ ਅੱਖਰ ਵਰਣਮਾਲਾ ਵਿੱਚ ਵਿਰੋਧੀ ਸਥਾਨਾਂ ਉੱਤੇ ਹਨ; ਹਰ ਸੰਬੰਧਿਤ ਸਥਾਨ ਦਾ ਜੋੜ 27 ਹੈ।",
      )],
      stepByStep: [
        ...evidenceByOption,
        tx(locale, `इसलिए ${source.answer} अलग अक्षर-समूह जोड़ी है।`, `ਇਸ ਲਈ ${source.answer} ਵੱਖਰੀ ਅੱਖਰ-ਸਮੂਹ ਜੋੜੀ ਹੈ।`),
      ],
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...source.metadata,
      locale,
      runtimeVersion: "cls-cp007-multilingual-review-v1" as const,
      canonicalLocale: "en-IN" as const,
      canonicalRuntimeVersion: "cls-cp007-permanent-english-v1" as const,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED" as const,
    },
    lifecycle: {
      ...source.lifecycle,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED" as const,
    },
  };
}
