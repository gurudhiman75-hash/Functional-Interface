import {
  generateClusterAnalogy,
  type GeneratedClusterAnalogy,
} from "./generator";
import type { AnaCp006RuleId } from "./question-language.en";
import type {
  ClusterRuleContext,
  DeletePositionRule,
  InsertDerivation,
  InsertionRule,
  ParityProfile,
  TwoStageProfile,
} from "./rule-definitions";

export type ClusterLocale = "hi-IN" | "pa-IN";

export interface LocalizedClusterAnalogy extends GeneratedClusterAnalogy {
  locale: ClusterLocale;
}

function signedMovement(value: number, locale: ClusterLocale): string {
  const amount = Math.abs(value);
  if (locale === "hi-IN") return `${amount} स्थान ${value > 0 ? "आगे" : "पीछे"}`;
  return `${amount} ਥਾਂ ${value > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ"}`;
}

function vectorText(shifts: readonly number[]): string {
  return shifts.map((value) => `${value >= 0 ? "+" : ""}${value}`).join(", ");
}

function deletionLabel(rule: DeletePositionRule, locale: ClusterLocale): string {
  const hi: Record<DeletePositionRule, string> = {
    FIRST: "पहला",
    LAST: "अंतिम",
    SECOND: "दूसरा",
    PENULTIMATE: "अंतिम से दूसरा",
    MIDDLE: "बीच का",
    LEFT_MIDDLE: "बीच का बायाँ",
    RIGHT_MIDDLE: "बीच का दायाँ",
  };
  const pa: Record<DeletePositionRule, string> = {
    FIRST: "ਪਹਿਲਾ",
    LAST: "ਆਖਰੀ",
    SECOND: "ਦੂਜਾ",
    PENULTIMATE: "ਆਖਰੀ ਤੋਂ ਦੂਜਾ",
    MIDDLE: "ਵਿਚਕਾਰਲਾ",
    LEFT_MIDDLE: "ਵਿਚਕਾਰਲਾ ਖੱਬਾ",
    RIGHT_MIDDLE: "ਵਿਚਕਾਰਲਾ ਸੱਜਾ",
  };
  return locale === "hi-IN" ? hi[rule] : pa[rule];
}

function derivationLabel(derivation: InsertDerivation, locale: ClusterLocale): string {
  const hi: Record<InsertDerivation, string> = {
    SUCCESSOR_OF_FIRST: "पहले अक्षर के तुरंत बाद वाला अक्षर",
    PREDECESSOR_OF_LAST: "अंतिम अक्षर के तुरंत पहले वाला अक्षर",
    OPPOSITE_OF_MIDDLE: "बीच के अक्षर का विपरीत अक्षर",
    MIDPOINT_FIRST_LAST: "पहले और अंतिम अक्षर की स्थितियों का मध्य अक्षर",
  };
  const pa: Record<InsertDerivation, string> = {
    SUCCESSOR_OF_FIRST: "ਪਹਿਲੇ ਅੱਖਰ ਤੋਂ ਤੁਰੰਤ ਅਗਲਾ ਅੱਖਰ",
    PREDECESSOR_OF_LAST: "ਆਖਰੀ ਅੱਖਰ ਤੋਂ ਤੁਰੰਤ ਪਿਛਲਾ ਅੱਖਰ",
    OPPOSITE_OF_MIDDLE: "ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ",
    MIDPOINT_FIRST_LAST: "ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਅੱਖਰ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਵਿਚਕਾਰਲਾ ਅੱਖਰ",
  };
  return locale === "hi-IN" ? hi[derivation] : pa[derivation];
}

function insertionLabel(rule: InsertionRule, locale: ClusterLocale): string {
  const hi: Record<InsertionRule, string> = {
    START: "आरंभ में",
    END: "अंत में",
    AFTER_FIRST: "पहले अक्षर के बाद",
    BEFORE_LAST: "अंतिम अक्षर से पहले",
    MIDDLE: "बीच में",
  };
  const pa: Record<InsertionRule, string> = {
    START: "ਸ਼ੁਰੂ ਵਿੱਚ",
    END: "ਅੰਤ ਵਿੱਚ",
    AFTER_FIRST: "ਪਹਿਲੇ ਅੱਖਰ ਤੋਂ ਬਾਅਦ",
    BEFORE_LAST: "ਆਖਰੀ ਅੱਖਰ ਤੋਂ ਪਹਿਲਾਂ",
    MIDDLE: "ਵਿਚਕਾਰ",
  };
  return locale === "hi-IN" ? hi[rule] : pa[rule];
}

function parityProfileLabel(profile: ParityProfile, locale: ClusterLocale): string {
  const hi: Record<ParityProfile, string> = {
    ODD_FORWARD_EVEN_FORWARD: "पहले विषम स्थान आगे के क्रम में, फिर सम स्थान आगे के क्रम में",
    EVEN_FORWARD_ODD_FORWARD: "पहले सम स्थान आगे के क्रम में, फिर विषम स्थान आगे के क्रम में",
    ODD_FORWARD_EVEN_REVERSE: "विषम स्थान आगे के क्रम में, फिर सम स्थान उल्टे क्रम में",
    EVEN_FORWARD_ODD_REVERSE: "सम स्थान आगे के क्रम में, फिर विषम स्थान उल्टे क्रम में",
    ODD_REVERSE_EVEN_FORWARD: "विषम स्थान उल्टे क्रम में, फिर सम स्थान आगे के क्रम में",
    EVEN_REVERSE_ODD_FORWARD: "सम स्थान उल्टे क्रम में, फिर विषम स्थान आगे के क्रम में",
  };
  const pa: Record<ParityProfile, string> = {
    ODD_FORWARD_EVEN_FORWARD: "ਪਹਿਲਾਂ ਟਾਂਕ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ, ਫਿਰ ਜਿਸਤ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ",
    EVEN_FORWARD_ODD_FORWARD: "ਪਹਿਲਾਂ ਜਿਸਤ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ, ਫਿਰ ਟਾਂਕ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ",
    ODD_FORWARD_EVEN_REVERSE: "ਟਾਂਕ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ, ਫਿਰ ਜਿਸਤ ਥਾਵਾਂ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ",
    EVEN_FORWARD_ODD_REVERSE: "ਜਿਸਤ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ, ਫਿਰ ਟਾਂਕ ਥਾਵਾਂ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ",
    ODD_REVERSE_EVEN_FORWARD: "ਟਾਂਕ ਥਾਵਾਂ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ, ਫਿਰ ਜਿਸਤ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ",
    EVEN_REVERSE_ODD_FORWARD: "ਜਿਸਤ ਥਾਵਾਂ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ, ਫਿਰ ਟਾਂਕ ਥਾਵਾਂ ਸਿੱਧੇ ਕ੍ਰਮ ਵਿੱਚ",
  };
  return locale === "hi-IN" ? hi[profile] : pa[profile];
}

function twoStageLabel(profile: TwoStageProfile, locale: ClusterLocale): string {
  const hi: Record<TwoStageProfile, string> = {
    OPPOSITE_ROTATE_LEFT: "पहले विपरीत अक्षर लेते हैं, फिर समूह को बाएँ घुमाते हैं",
    OPPOSITE_ROTATE_RIGHT: "पहले विपरीत अक्षर लेते हैं, फिर समूह को दाएँ घुमाते हैं",
    ADJACENT_SWAP_UNIFORM_SHIFT: "पहले पास-पास के अक्षर बदलते हैं, फिर सभी अक्षरों पर समान चाल लगाते हैं",
    FIRST_LAST_SWAP_OPPOSITE: "पहले पहला और अंतिम अक्षर बदलते हैं, फिर विपरीत अक्षर लेते हैं",
    ODD_SHIFT_HALF_SWAP: "पहले विषम स्थान बदलते हैं, फिर दोनों बाहरी भागों को अदलते हैं",
    PARITY_REGROUP_UNIFORM_SHIFT: "पहले विषम-सम स्थानों को दिए क्रम में रखते हैं, फिर समान चाल लगाते हैं",
  };
  const pa: Record<TwoStageProfile, string> = {
    OPPOSITE_ROTATE_LEFT: "ਪਹਿਲਾਂ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ, ਫਿਰ ਸਮੂਹ ਨੂੰ ਖੱਬੇ ਘੁਮਾਉਂਦੇ ਹਾਂ",
    OPPOSITE_ROTATE_RIGHT: "ਪਹਿਲਾਂ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ, ਫਿਰ ਸਮੂਹ ਨੂੰ ਸੱਜੇ ਘੁਮਾਉਂਦੇ ਹਾਂ",
    ADJACENT_SWAP_UNIFORM_SHIFT: "ਪਹਿਲਾਂ ਨਾਲ-ਨਾਲ ਦੇ ਅੱਖਰ ਬਦਲਦੇ ਹਾਂ, ਫਿਰ ਸਾਰੇ ਅੱਖਰਾਂ ਉੱਤੇ ਇੱਕੋ ਚਾਲ ਲਗਾਉਂਦੇ ਹਾਂ",
    FIRST_LAST_SWAP_OPPOSITE: "ਪਹਿਲਾਂ ਪਹਿਲਾ ਅਤੇ ਆਖਰੀ ਅੱਖਰ ਬਦਲਦੇ ਹਾਂ, ਫਿਰ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ",
    ODD_SHIFT_HALF_SWAP: "ਪਹਿਲਾਂ ਟਾਂਕ ਥਾਵਾਂ ਬਦਲਦੇ ਹਾਂ, ਫਿਰ ਦੋਵੇਂ ਬਾਹਰੀ ਭਾਗ ਅਦਲਦੇ ਹਾਂ",
    PARITY_REGROUP_UNIFORM_SHIFT: "ਪਹਿਲਾਂ ਟਾਂਕ-ਜਿਸਤ ਥਾਵਾਂ ਨੂੰ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਦੇ ਹਾਂ, ਫਿਰ ਇੱਕੋ ਚਾਲ ਲਗਾਉਂਦੇ ਹਾਂ",
  };
  return locale === "hi-IN" ? hi[profile] : pa[profile];
}

function localizedRuleText(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  locale: ClusterLocale,
): string {
  const hi = locale === "hi-IN";
  switch (ruleId) {
    case "CLUSTER_UNIFORM_SHIFT_FORWARD":
    case "CLUSTER_UNIFORM_SHIFT_BACKWARD":
      return context.kind === "UNIFORM_SHIFT"
        ? (hi
            ? `हर अक्षर को वर्णमाला में ${signedMovement(context.shift, locale)} बढ़ाते हैं`
            : `ਹਰ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${signedMovement(context.shift, locale)} ਲਿਜਾਂਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_POSITIONAL_FIXED_SHIFTS":
      return context.kind === "POSITION_VECTOR"
        ? (hi
            ? `हर स्थान पर यही चाल दोहराते हैं: ${vectorText(context.shifts)}`
            : `ਹਰ ਥਾਂ ਉੱਤੇ ਇਹੋ ਚਾਲ ਦੁਹਰਾਉਂਦੇ ਹਾਂ: ${vectorText(context.shifts)}`)
        : "";
    case "CLUSTER_ALTERNATING_SIGN_SHIFT":
      return context.kind === "ALTERNATING_SIGN"
        ? (hi
            ? `${context.magnitude} स्थान की आगे और पीछे की चाल बारी-बारी लगाते हैं`
            : `${context.magnitude} ਥਾਂ ਦੀ ਅੱਗੇ ਅਤੇ ਪਿੱਛੇ ਵਾਲੀ ਚਾਲ ਵਾਰੀ-ਵਾਰੀ ਲਗਾਉਂਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_INCREASING_SHIFT":
      return hi ? "बाएँ से दाएँ चाल हर स्थान पर एक बढ़ती है" : "ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਚਾਲ ਹਰ ਥਾਂ ਇੱਕ ਵੱਧਦੀ ਹੈ";
    case "CLUSTER_DECREASING_SHIFT":
      return hi ? "बाएँ से दाएँ चाल हर स्थान पर एक घटती है" : "ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਚਾਲ ਹਰ ਥਾਂ ਇੱਕ ਘਟਦੀ ਹੈ";
    case "CLUSTER_REVERSE":
      return hi ? "पूरे अक्षर-समूह को उल्टे क्रम में लिखते हैं" : "ਪੂਰੇ ਅੱਖਰ-ਸਮੂਹ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਦੇ ਹਾਂ";
    case "CLUSTER_ADJACENT_PAIR_SWAP":
      return hi ? "पास-पास के प्रत्येक अक्षर-जोड़े को आपस में बदलते हैं" : "ਨਾਲ-ਨਾਲ ਦੇ ਹਰ ਅੱਖਰ-ਜੋੜੇ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਦੇ ਹਾਂ";
    case "CLUSTER_FIRST_LAST_SWAP":
      return hi ? "केवल पहला और अंतिम अक्षर आपस में बदलते हैं" : "ਕੇਵਲ ਪਹਿਲਾ ਅਤੇ ਆਖਰੀ ਅੱਖਰ ਆਪਸ ਵਿੱਚ ਬਦਲਦੇ ਹਾਂ";
    case "CLUSTER_ROTATE_LEFT":
    case "CLUSTER_ROTATE_RIGHT":
      return context.kind === "ROTATION"
        ? (hi
            ? `पूरे समूह को ${context.count} स्थान ${ruleId.endsWith("LEFT") ? "बाएँ" : "दाएँ"} घुमाते हैं`
            : `ਪੂਰੇ ਸਮੂਹ ਨੂੰ ${context.count} ਥਾਂ ${ruleId.endsWith("LEFT") ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਘੁਮਾਉਂਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_OPPOSITE_SUBSTITUTION":
      return hi ? "हर अक्षर के स्थान पर उसका विपरीत वर्णमाला-अक्षर रखते हैं" : "ਹਰ ਅੱਖਰ ਦੀ ਥਾਂ ਉਸ ਦਾ ਵਿਰੋਧੀ ਵਰਣਮਾਲਾ-ਅੱਖਰ ਰੱਖਦੇ ਹਾਂ";
    case "CLUSTER_ODD_POSITION_TRANSFORM":
    case "CLUSTER_EVEN_POSITION_TRANSFORM":
      return context.kind === "POSITION_CLASS_SHIFT"
        ? (hi
            ? `${ruleId.includes("ODD") ? "विषम" : "सम"} स्थानों के अक्षरों को ${signedMovement(context.shift, locale)} बदलते हैं; बाकी अक्षर वैसे ही रहते हैं`
            : `${ruleId.includes("ODD") ? "ਟਾਂਕ" : "ਜਿਸਤ"} ਥਾਵਾਂ ਦੇ ਅੱਖਰਾਂ ਨੂੰ ${signedMovement(context.shift, locale)} ਬਦਲਦੇ ਹਾਂ; ਬਾਕੀ ਅੱਖਰ ਜਿਵੇਂ ਦੇ ਤਿਵੇਂ ਰਹਿੰਦੇ ਹਨ`)
        : "";
    case "CLUSTER_REVERSE_THEN_SHIFT":
      return context.kind === "ORDERED_POSITION_VECTOR"
        ? (hi ? `पहले क्रम उलटते हैं, फिर स्थानवार चाल ${vectorText(context.shifts)} लगाते हैं` : `ਪਹਿਲਾਂ ਕ੍ਰਮ ਉਲਟਦੇ ਹਾਂ, ਫਿਰ ਥਾਂ-ਵਾਰ ਚਾਲ ${vectorText(context.shifts)} ਲਗਾਉਂਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_SHIFT_THEN_REVERSE":
      return context.kind === "ORDERED_POSITION_VECTOR"
        ? (hi ? `पहले स्थानवार चाल ${vectorText(context.shifts)} लगाते हैं, फिर क्रम उलटते हैं` : `ਪਹਿਲਾਂ ਥਾਂ-ਵਾਰ ਚਾਲ ${vectorText(context.shifts)} ਲਗਾਉਂਦੇ ਹਾਂ, ਫਿਰ ਕ੍ਰਮ ਉਲਟਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_DELETE_POSITION":
      return context.kind === "DELETE_POSITION"
        ? (hi ? `${deletionLabel(context.positionRule, locale)} अक्षर हटाते हैं` : `${deletionLabel(context.positionRule, locale)} ਅੱਖਰ ਹਟਾਉਂਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_INSERT_DERIVED_LETTER":
      return context.kind === "INSERT_DERIVED"
        ? (hi
            ? `${derivationLabel(context.derivation, locale)} निकालकर उसे ${insertionLabel(context.insertionRule, locale)} रखते हैं`
            : `${derivationLabel(context.derivation, locale)} ਕੱਢ ਕੇ ਉਸ ਨੂੰ ${insertionLabel(context.insertionRule, locale)} ਰੱਖਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_NEIGHBOUR_EXPANSION":
      return context.kind === "NEIGHBOUR_EXPANSION"
        ? (hi
            ? `हर अक्षर को उसके ${context.order === "PREV_NEXT" ? "पिछले और अगले" : "अगले और पिछले"} अक्षर से बदलते हैं`
            : `ਹਰ ਅੱਖਰ ਨੂੰ ਉਸ ਦੇ ${context.order === "PREV_NEXT" ? "ਪਿਛਲੇ ਅਤੇ ਅਗਲੇ" : "ਅਗਲੇ ਅਤੇ ਪਿਛਲੇ"} ਅੱਖਰ ਨਾਲ ਬਦਲਦੇ ਹਾਂ`)
        : "";
    case "CLUSTER_TWO_STAGE_MIXED":
      return context.kind === "TWO_STAGE" ? twoStageLabel(context.profile, locale) : "";
    case "CLUSTER_HALF_BLOCK_SWAP":
      return hi ? "दोनों समान बाहरी भागों को उनकी अंदरूनी क्रम-व्यवस्था बनाए रखते हुए अदलते हैं" : "ਦੋਵੇਂ ਬਰਾਬਰ ਬਾਹਰੀ ਭਾਗਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦਾ ਅੰਦਰਲਾ ਕ੍ਰਮ ਜਿਉਂ ਦਾ ਤਿਉਂ ਰੱਖ ਕੇ ਅਦਲਦੇ ਹਾਂ";
    case "CLUSTER_REVERSE_EACH_BLOCK":
      return hi ? "हर आधे या बाहरी भाग को उसकी जगह पर अलग-अलग उलटते हैं" : "ਹਰ ਅੱਧੇ ਜਾਂ ਬਾਹਰੀ ਭਾਗ ਨੂੰ ਉਸ ਦੀ ਥਾਂ ਉੱਤੇ ਵੱਖ-ਵੱਖ ਉਲਟਦੇ ਹਾਂ";
    case "CLUSTER_PARITY_REGROUP":
      return context.kind === "PARITY_REGROUP" ? parityProfileLabel(context.profile, locale) : "";
    case "CLUSTER_ALPHABETICAL_SORT":
      return context.kind === "ALPHABETICAL_SORT"
        ? (hi
            ? `अक्षरों को ${context.direction === "ASC" ? "A से Z" : "Z से A"} के क्रम में रखते हैं`
            : `ਅੱਖਰਾਂ ਨੂੰ ${context.direction === "ASC" ? "A ਤੋਂ Z" : "Z ਤੋਂ A"} ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਦੇ ਹਾਂ`)
        : "";
  }
}

function localizedStep(
  ruleId: AnaCp006RuleId,
  input: string,
  output: string,
  context: ClusterRuleContext,
  locale: ClusterLocale,
): string {
  const hi = locale === "hi-IN";
  const arrow = `${input} → ${output}`;
  switch (ruleId) {
    case "CLUSTER_UNIFORM_SHIFT_FORWARD":
    case "CLUSTER_UNIFORM_SHIFT_BACKWARD":
      return context.kind === "UNIFORM_SHIFT"
        ? (hi ? `${input} के हर अक्षर को ${signedMovement(context.shift, locale)} ले जाने पर ${output} बनता है।` : `${input} ਦੇ ਹਰ ਅੱਖਰ ਨੂੰ ${signedMovement(context.shift, locale)} ਲਿਜਾਣ 'ਤੇ ${output} ਬਣਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_POSITIONAL_FIXED_SHIFTS":
      return context.kind === "POSITION_VECTOR"
        ? (hi ? `${input} पर स्थानवार चाल ${vectorText(context.shifts)} लगाने से ${output} मिलता है।` : `${input} ਉੱਤੇ ਥਾਂ-ਵਾਰ ਚਾਲ ${vectorText(context.shifts)} ਲਗਾਉਣ ਨਾਲ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_ALTERNATING_SIGN_SHIFT":
      return context.kind === "ALTERNATING_SIGN"
        ? (hi ? `${input} में ${context.magnitude} स्थान की आगे-पीछे चाल बारी-बारी लगाने पर ${output} मिलता है।` : `${input} ਵਿੱਚ ${context.magnitude} ਥਾਂ ਦੀ ਅੱਗੇ-ਪਿੱਛੇ ਚਾਲ ਵਾਰੀ-ਵਾਰੀ ਲਗਾਉਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_INCREASING_SHIFT":
    case "CLUSTER_DECREASING_SHIFT":
      return hi ? `${input} में क्रमशः बदलती स्थानवार चाल लगाने पर ${output} बनता है।` : `${input} ਵਿੱਚ ਕ੍ਰਮਵਾਰ ਬਦਲਦੀ ਥਾਂ-ਵਾਰ ਚਾਲ ਲਗਾਉਣ 'ਤੇ ${output} ਬਣਦਾ ਹੈ।`;
    case "CLUSTER_REVERSE":
      return hi ? `${input} को दाएँ से बाएँ लिखने पर ${output} मिलता है।` : `${input} ਨੂੰ ਸੱਜੇ ਤੋਂ ਖੱਬੇ ਲਿਖਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
    case "CLUSTER_ADJACENT_PAIR_SWAP":
      return hi ? `${input} के पास-पास के जोड़े बदलने पर ${output} बनता है।` : `${input} ਦੇ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਜੋੜੇ ਬਦਲਣ 'ਤੇ ${output} ਬਣਦਾ ਹੈ।`;
    case "CLUSTER_FIRST_LAST_SWAP":
      return hi ? `${input} में केवल दोनों सिरों के अक्षर बदलने पर ${output} मिलता है।` : `${input} ਵਿੱਚ ਕੇਵਲ ਦੋਵੇਂ ਸਿਰਿਆਂ ਦੇ ਅੱਖਰ ਬਦਲਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
    case "CLUSTER_ROTATE_LEFT":
    case "CLUSTER_ROTATE_RIGHT":
      return context.kind === "ROTATION"
        ? (hi ? `${input} को ${context.count} स्थान ${ruleId.endsWith("LEFT") ? "बाएँ" : "दाएँ"} घुमाने पर ${output} मिलता है।` : `${input} ਨੂੰ ${context.count} ਥਾਂ ${ruleId.endsWith("LEFT") ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਘੁਮਾਉਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_OPPOSITE_SUBSTITUTION":
      return hi ? `${input} के प्रत्येक अक्षर का विपरीत अक्षर लेने पर ${output} बनता है।` : `${input} ਦੇ ਹਰ ਅੱਖਰ ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਣ 'ਤੇ ${output} ਬਣਦਾ ਹੈ।`;
    case "CLUSTER_ODD_POSITION_TRANSFORM":
    case "CLUSTER_EVEN_POSITION_TRANSFORM":
      return context.kind === "POSITION_CLASS_SHIFT"
        ? (hi ? `${input} के ${ruleId.includes("ODD") ? "विषम" : "सम"} स्थानों को ${signedMovement(context.shift, locale)} बदलने पर ${output} मिलता है।` : `${input} ਦੀਆਂ ${ruleId.includes("ODD") ? "ਟਾਂਕ" : "ਜਿਸਤ"} ਥਾਵਾਂ ਨੂੰ ${signedMovement(context.shift, locale)} ਬਦਲਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_REVERSE_THEN_SHIFT":
      return context.kind === "ORDERED_POSITION_VECTOR"
        ? (hi ? `${input} को पहले उलटकर, फिर ${vectorText(context.shifts)} की चाल लगाने पर ${output} मिलता है।` : `${input} ਨੂੰ ਪਹਿਲਾਂ ਉਲਟ ਕੇ, ਫਿਰ ${vectorText(context.shifts)} ਦੀ ਚਾਲ ਲਗਾਉਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_SHIFT_THEN_REVERSE":
      return context.kind === "ORDERED_POSITION_VECTOR"
        ? (hi ? `${input} पर पहले ${vectorText(context.shifts)} की चाल लगाकर, फिर उलटने पर ${output} मिलता है।` : `${input} ਉੱਤੇ ਪਹਿਲਾਂ ${vectorText(context.shifts)} ਦੀ ਚਾਲ ਲਗਾ ਕੇ, ਫਿਰ ਉਲਟਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_DELETE_POSITION":
      return context.kind === "DELETE_POSITION"
        ? (hi ? `${input} से ${deletionLabel(context.positionRule, locale)} अक्षर हटाने पर ${output} बचता है।` : `${input} ਵਿੱਚੋਂ ${deletionLabel(context.positionRule, locale)} ਅੱਖਰ ਹਟਾਉਣ 'ਤੇ ${output} ਬਚਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_INSERT_DERIVED_LETTER":
      return context.kind === "INSERT_DERIVED"
        ? (hi ? `${derivationLabel(context.derivation, locale)} को ${insertionLabel(context.insertionRule, locale)} रखने पर ${input} से ${output} बनता है।` : `${derivationLabel(context.derivation, locale)} ਨੂੰ ${insertionLabel(context.insertionRule, locale)} ਰੱਖਣ 'ਤੇ ${input} ਤੋਂ ${output} ਬਣਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_NEIGHBOUR_EXPANSION":
      return hi ? `${input} के प्रत्येक अक्षर को उसके दोनों वर्णमाला-पड़ोसियों में फैलाने पर ${output} मिलता है।` : `${input} ਦੇ ਹਰ ਅੱਖਰ ਨੂੰ ਉਸ ਦੇ ਦੋਵੇਂ ਵਰਣਮਾਲਾ-ਗੁਆਂਢੀ ਅੱਖਰਾਂ ਵਿੱਚ ਫੈਲਾਉਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
    case "CLUSTER_TWO_STAGE_MIXED":
      return context.kind === "TWO_STAGE"
        ? (hi ? `${twoStageLabel(context.profile, locale)}; इसलिए ${arrow}।` : `${twoStageLabel(context.profile, locale)}; ਇਸ ਲਈ ${arrow}।`)
        : arrow;
    case "CLUSTER_HALF_BLOCK_SWAP":
      return hi ? `${input} के दोनों समान बाहरी भाग अदलने पर ${output} बनता है।` : `${input} ਦੇ ਦੋਵੇਂ ਬਰਾਬਰ ਬਾਹਰੀ ਭਾਗ ਅਦਲਣ 'ਤੇ ${output} ਬਣਦਾ ਹੈ।`;
    case "CLUSTER_REVERSE_EACH_BLOCK":
      return hi ? `${input} के हर आधे/बाहरी भाग को अलग-अलग उलटने पर ${output} मिलता है।` : `${input} ਦੇ ਹਰ ਅੱਧੇ/ਬਾਹਰੀ ਭਾਗ ਨੂੰ ਵੱਖ-ਵੱਖ ਉਲਟਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
    case "CLUSTER_PARITY_REGROUP":
      return context.kind === "PARITY_REGROUP"
        ? (hi ? `${parityProfileLabel(context.profile, locale)} रखने पर ${input} से ${output} बनता है।` : `${parityProfileLabel(context.profile, locale)} ਰੱਖਣ 'ਤੇ ${input} ਤੋਂ ${output} ਬਣਦਾ ਹੈ।`)
        : arrow;
    case "CLUSTER_ALPHABETICAL_SORT":
      return context.kind === "ALPHABETICAL_SORT"
        ? (hi ? `${input} के अक्षरों को ${context.direction === "ASC" ? "A से Z" : "Z से A"} क्रम में रखने पर ${output} मिलता है।` : `${input} ਦੇ ਅੱਖਰਾਂ ਨੂੰ ${context.direction === "ASC" ? "A ਤੋਂ Z" : "Z ਤੋਂ A"} ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`)
        : arrow;
  }
}

const ENGLISH_TRAPS = [
  "The nearest wrong option uses the same broad idea with a different shift, rotation count, position or direction.",
  "The nearest wrong option rotates the letters in the wrong direction or by the wrong number of places.",
  "The nearest wrong option changes the shift direction or uses a nearby but unequal movement.",
  "The nearest wrong option substitutes opposite letters instead of preserving the demonstrated operation.",
  "The nearest wrong option removes a different position from the one established by the source pair.",
  "The nearest wrong option either derives the inserted letter incorrectly or places it at the wrong position.",
  "The nearest wrong option reverses the odd/even group order or the direction inside one group.",
  "The nearest wrong option splits the cluster at a different boundary or changes the letters inside a block.",
  "The nearest wrong option sorts in the opposite direction or leaves one neighbouring pair out of order.",
  "The nearest wrong option changes only part of the demonstrated order or applies another simple rearrangement.",
  "The nearest wrong option exchanges only one nearby pair instead of completing the full rule.",
  "The nearest wrong option changes only one pair of positions.",
  "The nearest wrong option differs by one alphabet place at the first transformed position.",
  "The nearest wrong option makes a one-place error at the final transformed position.",
  "The nearest wrong option reverses the whole cluster instead of applying the demonstrated relation.",
  "The nearest wrong option does not preserve the source relation when checked position by position.",
] as const;

const HINDI_TRAPS = [
  "निकटतम गलत विकल्प में वही सामान्य विचार है, पर चाल, घुमाव, स्थान या दिशा अलग है।",
  "निकटतम गलत विकल्प अक्षरों को गलत दिशा में या गलत संख्या में घुमाता है।",
  "निकटतम गलत विकल्प चाल की दिशा बदल देता है या पास की परंतु असमान चाल लेता है।",
  "निकटतम गलत विकल्प दिखाए गए नियम के स्थान पर विपरीत अक्षर लेता है।",
  "निकटतम गलत विकल्प स्रोत से स्थापित स्थान के बजाय दूसरा स्थान हटाता है।",
  "निकटतम गलत विकल्प नया अक्षर गलत निकालता है या उसे गलत स्थान पर रखता है।",
  "निकटतम गलत विकल्प विषम-सम समूहों का क्रम या किसी समूह की अंदरूनी दिशा उलट देता है।",
  "निकटतम गलत विकल्प समूह को दूसरी सीमा पर बाँटता है या भाग के अंदर का क्रम बदल देता है।",
  "निकटतम गलत विकल्प उलटी दिशा में क्रम लगाता है या एक पास-पास का जोड़ा गलत छोड़ देता है।",
  "निकटतम गलत विकल्प पूरे नियम के बजाय केवल एक भाग बदलता है।",
  "निकटतम गलत विकल्प पूरा नियम लगाने के बजाय केवल एक पास-पास का जोड़ा बदलता है।",
  "निकटतम गलत विकल्प केवल एक स्थान-जोड़ा बदलता है।",
  "निकटतम गलत विकल्प पहले बदले हुए स्थान पर एक अक्षर की चूक करता है।",
  "निकटतम गलत विकल्प अंतिम बदले हुए स्थान पर एक अक्षर की चूक करता है।",
  "निकटतम गलत विकल्प दिखाए गए संबंध के बजाय पूरे समूह को उलट देता है।",
  "निकटतम गलत विकल्प को स्थानवार जाँचने पर स्रोत वाला संबंध बना नहीं रहता।",
] as const;

const PUNJABI_TRAPS = [
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਉਹੀ ਆਮ ਵਿਚਾਰ ਲੈਂਦਾ ਹੈ, ਪਰ ਚਾਲ, ਘੁੰਮਾਅ, ਥਾਂ ਜਾਂ ਦਿਸ਼ਾ ਵੱਖਰੀ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਅੱਖਰਾਂ ਨੂੰ ਗਲਤ ਦਿਸ਼ਾ ਵਿੱਚ ਜਾਂ ਗਲਤ ਗਿਣਤੀ ਨਾਲ ਘੁਮਾਉਂਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਚਾਲ ਦੀ ਦਿਸ਼ਾ ਬਦਲਦਾ ਹੈ ਜਾਂ ਨੇੜਲੀ ਪਰ ਅਸਮਾਨ ਚਾਲ ਲੈਂਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਦਿਖਾਏ ਨਿਯਮ ਦੀ ਥਾਂ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਂਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਸਰੋਤ ਤੋਂ ਨਿਰਧਾਰਤ ਥਾਂ ਦੀ ਬਜਾਏ ਹੋਰ ਥਾਂ ਹਟਾਉਂਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਨਵਾਂ ਅੱਖਰ ਗਲਤ ਕੱਢਦਾ ਹੈ ਜਾਂ ਉਸ ਨੂੰ ਗਲਤ ਥਾਂ ਰੱਖਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਟਾਂਕ-ਜਿਸਤ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ਜਾਂ ਕਿਸੇ ਸਮੂਹ ਦੀ ਅੰਦਰਲੀ ਦਿਸ਼ਾ ਉਲਟਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਸਮੂਹ ਨੂੰ ਹੋਰ ਹੱਦ ਉੱਤੇ ਵੰਡਦਾ ਹੈ ਜਾਂ ਭਾਗ ਦੇ ਅੰਦਰਲਾ ਕ੍ਰਮ ਬਦਲਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮ ਲਗਾਉਂਦਾ ਹੈ ਜਾਂ ਇੱਕ ਨਾਲ-ਨਾਲ ਜੋੜਾ ਗਲਤ ਛੱਡਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਪੂਰਾ ਨਿਯਮ ਲਗਾਉਣ ਦੀ ਥਾਂ ਕੇਵਲ ਇੱਕ ਭਾਗ ਬਦਲਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਪੂਰਾ ਨਿਯਮ ਲਗਾਉਣ ਦੀ ਥਾਂ ਕੇਵਲ ਇੱਕ ਨੇੜਲਾ ਜੋੜਾ ਬਦਲਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਕੇਵਲ ਇੱਕ ਥਾਂ-ਜੋੜਾ ਬਦਲਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਪਹਿਲੀ ਬਦਲੀ ਥਾਂ ਉੱਤੇ ਇੱਕ ਅੱਖਰ ਦੀ ਗਲਤੀ ਕਰਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਆਖਰੀ ਬਦਲੀ ਥਾਂ ਉੱਤੇ ਇੱਕ ਅੱਖਰ ਦੀ ਗਲਤੀ ਕਰਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਦਿਖਾਏ ਸੰਬੰਧ ਦੀ ਥਾਂ ਪੂਰੇ ਸਮੂਹ ਨੂੰ ਉਲਟਦਾ ਹੈ।",
  "ਸਭ ਤੋਂ ਨੇੜਲੇ ਗਲਤ ਵਿਕਲਪ ਨੂੰ ਥਾਂ-ਵਾਰ ਜਾਂਚਣ 'ਤੇ ਸਰੋਤ ਵਾਲਾ ਸੰਬੰਧ ਨਹੀਂ ਬਣਦਾ।",
] as const;

function localizedTrap(english: string, locale: ClusterLocale): string {
  const index = ENGLISH_TRAPS.indexOf(english as (typeof ENGLISH_TRAPS)[number]);
  if (index < 0) {
    return locale === "hi-IN"
      ? "अन्य विकल्प पूरे स्रोत-संबंध को बनाए नहीं रखते।"
      : "ਹੋਰ ਵਿਕਲਪ ਪੂਰਾ ਸਰੋਤ-ਸੰਬੰਧ ਕਾਇਮ ਨਹੀਂ ਰੱਖਦੇ।";
  }
  return locale === "hi-IN" ? HINDI_TRAPS[index] : PUNJABI_TRAPS[index];
}

function renderStem(base: GeneratedClusterAnalogy, locale: ClusterLocale): string {
  const hi = locale === "hi-IN";
  const { source, target, layout } = base;
  if (base.presentationMode === "DIRECT_COMPLETION") {
    if (layout === "ARROW") return `${source.left} → ${source.right}  ::  ${target.left} → ?`;
    if (layout === "TWO_ROW_TABLE") {
      return `${hi ? "उसी अक्षर-समूह संबंध से दूसरी पंक्ति पूरी कीजिए।" : "ਉਸੇ ਅੱਖਰ-ਸਮੂਹ ਸੰਬੰਧ ਨਾਲ ਦੂਜੀ ਕਤਾਰ ਪੂਰੀ ਕਰੋ।"}\n\n| ${hi ? "जोड़ा" : "ਜੋੜਾ"} | ${hi ? "पहला समूह" : "ਪਹਿਲਾ ਸਮੂਹ"} | ${hi ? "दूसरा समूह" : "ਦੂਜਾ ਸਮੂਹ"} |\n|---|---|---|\n| A | ${source.left} | ${source.right} |\n| B | ${target.left} | ? |`;
    }
    if (layout === "BOXED_PAIRS") return `[ ${source.left} : ${source.right} ]  ::  [ ${target.left} : ? ]`;
    return `${source.left} : ${source.right} :: ${target.left} : ?`;
  }

  const prefix = hi
    ? "वह अक्षर-समूह जोड़ा चुनिए जिसमें यही संबंध है"
    : "ਉਹ ਅੱਖਰ-ਸਮੂਹ ਜੋੜਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਇਹੀ ਸੰਬੰਧ ਹੈ";
  if (layout === "ARROW") return `${prefix}: ${source.left} → ${source.right}`;
  if (layout === "TWO_ROW_TABLE") return `${prefix}: | ${source.left} | ${source.right} |`;
  if (layout === "BOXED_PAIRS") return `${prefix}: [ ${source.left} : ${source.right} ]`;
  return `${prefix}: ${source.left} : ${source.right}`;
}

export function generateLocalizedClusterAnalogy(
  qlId: string,
  locale: ClusterLocale,
  seed = 0,
): LocalizedClusterAnalogy {
  const base = generateClusterAnalogy(qlId, seed);
  const hi = locale === "hi-IN";
  return {
    ...base,
    locale,
    stem: renderStem(base, locale),
    explanation: {
      ruleStatement: `${hi ? "संबंध का नियम है" : "ਸੰਬੰਧ ਦਾ ਨਿਯਮ ਹੈ"}: ${localizedRuleText(base.ruleId, base.context, locale)}।`,
      sourceDemonstration: localizedStep(base.ruleId, base.source.left, base.source.right, base.context, locale),
      targetApplication: localizedStep(base.ruleId, base.target.left, base.target.right, base.context, locale),
      conclusion: base.presentationMode === "DIRECT_COMPLETION"
        ? (hi ? `अतः रिक्त स्थान पर ${base.target.right} आएगा।` : `ਇਸ ਲਈ ਖਾਲੀ ਥਾਂ 'ਤੇ ${base.target.right} ਆਵੇਗਾ।`)
        : (hi ? `अतः ${base.target.left} : ${base.target.right} में यही नियम है।` : `ਇਸ ਲਈ ${base.target.left} : ${base.target.right} ਵਿੱਚ ਇਹੀ ਨਿਯਮ ਹੈ।`),
      closestTrapRejection: localizedTrap(base.explanation.closestTrapRejection, locale),
    },
  };
}
