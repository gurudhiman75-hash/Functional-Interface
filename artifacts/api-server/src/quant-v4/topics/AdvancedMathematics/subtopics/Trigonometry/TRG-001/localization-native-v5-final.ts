import { createHash } from "node:crypto";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  trg001CanonicalSemanticFingerprint,
  type Trg001LocalizedLocale,
} from "./localization-v1";
import { localizeFrozenTrg001QuestionNativeV4 } from "./localization-native-v4";
import {
  localizeFrozenTrg001QuestionNativeV5 as localizeBaseV5,
  trg001V5BindingCount,
  trg001V5RuleText,
} from "./localization-native-v5";
import {
  TRG_001_LOCALIZATION_NATIVE_V5_VERSION,
  trg001V5BindingFor,
  type Trg001V5RuleKey,
} from "./localization-native-v5-registry";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function native(locale: Locale, hi: string, pa: string) {
  return locale === "hi-IN" ? hi : pa;
}

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function nativeClause(value: string, locale: Locale) {
  return clean(value)
    .replace(/\ban acute angle θ\b/gi, native(locale, "न्यूनकोण θ", "ਨਿਊਨ ਕੋਣ θ"))
    .replace(/\bθ is acute\b/gi, native(locale, "θ न्यूनकोण है", "θ ਨਿਊਨ ਕੋਣ ਹੈ"))
    .replace(/\bthe included angle is acute\b/gi, native(locale, "अंतर्विष्ट कोण न्यूनकोण है", "ਸ਼ਾਮਲ ਕੋਣ ਨਿਊਨ ਕੋਣ ਹੈ"))
    .replace(/\bthe hypotenuse is ([^,;.]+?) units\b/gi, (_m, n) => native(locale, `कर्ण ${n} इकाई है`, `ਕਰਣ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/\bthe side opposite θ is ([^,;.]+?) units\b/gi, (_m, n) => native(locale, `θ के सामने वाली भुजा ${n} इकाई है`, `θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/\bthe side adjacent to θ is ([^,;.]+?) units\b/gi, (_m, n) => native(locale, `θ से सटी हुई भुजा ${n} इकाई है`, `θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/\bthe opposite side is ([^,;.]+?) units\b/gi, (_m, n) => native(locale, `सामने वाली भुजा ${n} इकाई है`, `ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/\bthe adjacent side is ([^,;.]+?) units\b/gi, (_m, n) => native(locale, `सटी हुई भुजा ${n} इकाई है`, `ਲੱਗਦੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/\bopposite:hypotenuse\b/gi, native(locale, "सामने वाली भुजा:कर्ण", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ:ਕਰਣ"))
    .replace(/\badjacent:hypotenuse\b/gi, native(locale, "सटी हुई भुजा:कर्ण", "ਲੱਗਦੀ ਭੁਜਾ:ਕਰਣ"))
    .replace(/\bopposite:adjacent\b/gi, native(locale, "सामने वाली भुजा:सटी हुई भुजा", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ:ਲੱਗਦੀ ਭੁਜਾ"))
    .replace(/\badjacent:opposite\b/gi, native(locale, "सटी हुई भुजा:सामने वाली भुजा", "ਲੱਗਦੀ ਭੁਜਾ:ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"))
    .replace(/\bwhere all terms are defined\b/gi, native(locale, "जहाँ सभी पद परिभाषित हैं", "ਜਿੱਥੇ ਸਾਰੇ ਪਦ ਪਰਿਭਾਸ਼ਿਤ ਹਨ"))
    .replace(/\bwherever defined\b/gi, native(locale, "जहाँ यह परिभाषित है", "ਜਿੱਥੇ ਇਹ ਪਰਿਭਾਸ਼ਿਤ ਹੈ"))
    .replace(/\bwhere the expression is defined\b/gi, native(locale, "जहाँ व्यंजक परिभाषित है", "ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ"))
    .replace(/\band\b/gi, native(locale, "और", "ਅਤੇ"));
}

function valueStem(expression: string, locale: Locale, exact = false) {
  const expr = clean(expression).replace(/[?.]$/u, "");
  return exact
    ? native(locale, `${expr} का सटीक मान ज्ञात कीजिए।`, `${expr} ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।`)
    : native(locale, `${expr} का मान ज्ञात कीजिए।`, `${expr} ਦਾ ਮਾਨ ਕੱਢੋ।`);
}

function fallbackStem(sourceStem: string, locale: Locale): string | null {
  const source = clean(sourceStem);
  let m: RegExpMatchArray | null;

  m = source.match(/^(.+?) is identically equal to which expression\?$/iu);
  if (m) return native(locale,
    `${m[1]} के सर्वसमिक रूप से बराबर व्यंजक का चयन कीजिए।`,
    `${m[1]} ਦੇ ਸਰਬਸਮਿਕ ਤੌਰ ਤੇ ਬਰਾਬਰ ਵਿਅੰਜਕ ਦੀ ਚੋਣ ਕਰੋ।`);

  m = source.match(/^Which trigonometric function is equivalent to (.+?),\s*wherever defined\?$/iu);
  if (m) return native(locale,
    `जहाँ ${m[1]} परिभाषित है, उसके समतुल्य त्रिकोणमितीय फलन का चयन कीजिए।`,
    `ਜਿੱਥੇ ${m[1]} ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ਉਸਦੇ ਬਰਾਬਰ ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨ ਦੀ ਚੋਣ ਕਰੋ।`);

  m = source.match(/^Given (.+?),\s*(?:evaluate|find) (.+?)\.$/iu);
  if (m) return native(locale,
    `${nativeClause(m[1], locale)} दिया है। ${m[2]} का मान ज्ञात कीजिए।`,
    `${nativeClause(m[1], locale)} ਦਿੱਤਾ ਹੈ। ${m[2]} ਦਾ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^For an? acute angle θ,\s*solve (.+?)\.$/iu);
  if (m) return native(locale,
    `θ न्यूनकोण है। ${nativeClause(m[1], locale)} के लिए θ ज्ञात कीजिए।`,
    `θ ਨਿਊਨ ਕੋਣ ਹੈ। ${nativeClause(m[1], locale)} ਲਈ θ ਕੱਢੋ।`);

  m = source.match(/^For acute θ,\s*solve (.+?)\.$/iu);
  if (m) return native(locale,
    `θ न्यूनकोण है। ${nativeClause(m[1], locale)} के लिए θ ज्ञात कीजिए।`,
    `θ ਨਿਊਨ ਕੋਣ ਹੈ। ${nativeClause(m[1], locale)} ਲਈ θ ਕੱਢੋ।`);

  m = source.match(/^For acute θ,\s*find θ if (.+?)\.$/iu);
  if (m) return native(locale,
    `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। θ ज्ञात कीजिए।`,
    `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। θ ਕੱਢੋ।`);

  m = source.match(/^For\s+0°\s*<\s*θ\s*<\s*90°,\s*find θ if (.+?)\.$/iu);
  if (m) return native(locale,
    `0° < θ < 90° और ${nativeClause(m[1], locale)}। θ ज्ञात कीजिए।`,
    `0° < θ < 90° ਅਤੇ ${nativeClause(m[1], locale)}। θ ਕੱਢੋ।`);

  m = source.match(/^If (.+?) and\s+0°\s*<\s*θ\s*<\s*90°,\s*find θ\.$/iu);
  if (m) return native(locale,
    `0° < θ < 90° और ${nativeClause(m[1], locale)}। θ ज्ञात कीजिए।`,
    `0° < θ < 90° ਅਤੇ ${nativeClause(m[1], locale)}। θ ਕੱਢੋ।`);

  m = source.match(/^For acute θ,\s*(.+?)\.\s*(?:evaluate|find) (.+?)(?: exactly)?\.$/iu);
  if (m) return native(locale,
    `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। ${m[2]} का मान ज्ञात कीजिए।`,
    `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। ${m[2]} ਦਾ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^For acute θ with (.+?),\s*(?:evaluate|find) (.+?)(?: exactly)?\.$/iu);
  if (m) return native(locale,
    `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। ${m[2]} का मान ज्ञात कीजिए।`,
    `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। ${m[2]} ਦਾ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^If (.+?) and θ is acute,\s*(?:find|evaluate) (.+?)\.$/iu);
  if (m) return native(locale,
    `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। ${m[2]} का मान ज्ञात कीजिए।`,
    `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। ${m[2]} ਦਾ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^If (.+?),\s*(?:find|evaluate) (.+?)\.$/iu);
  if (m) return native(locale,
    `यदि ${nativeClause(m[1], locale)}, तो ${m[2]} का मान ज्ञात कीजिए।`,
    `ਜੇ ${nativeClause(m[1], locale)}, ਤਾਂ ${m[2]} ਦਾ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^Evaluate exactly:\s*(.+?)\.$/iu);
  if (m) return valueStem(m[1], locale, true);

  m = source.match(/^Evaluate (.+?) in exact form\.$/iu);
  if (m) return valueStem(m[1], locale, true);

  m = source.match(/^Find the exact product (.+?)\.$/iu);
  if (m) return native(locale,
    `${m[1]} का सटीक गुणनफल ज्ञात कीजिए।`,
    `${m[1]} ਦਾ ਸਹੀ ਗੁਣਨਫਲ ਕੱਢੋ।`);

  m = source.match(/^Find the exact value of (.+?) by reduction\.$/iu);
  if (m) return native(locale,
    `कोण-रूपांतरण का उपयोग करके ${m[1]} का सटीक मान ज्ञात कीजिए।`,
    `ਕੋਣ-ਰੂਪਾਂਤਰਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${m[1]} ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^Find the exact value of (.+?)\.$/iu);
  if (m) return valueStem(m[1], locale, true);

  m = source.match(/^Find (.+?) in exact form\.$/iu);
  if (m) return valueStem(m[1], locale, true);

  m = source.match(/^Find (.+?) exactly\.$/iu);
  if (m) return valueStem(m[1], locale, true);

  m = source.match(/^Find the value of (.+?),\s*where defined\.$/iu);
  if (m) return native(locale,
    `जहाँ व्यंजक परिभाषित है, ${m[1]} का मान ज्ञात कीजिए।`,
    `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਦਾ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^Evaluate (.+?) exactly\.$/iu);
  if (m) return valueStem(m[1], locale, true);

  m = source.match(/^Evaluate:\s*(.+?)\.$/iu);
  if (m) return valueStem(m[1], locale, false);

  m = source.match(/^Evaluate (.+?)\.$/iu);
  if (m) return valueStem(m[1], locale, false);

  m = source.match(/^Simplify (.+?),\s*wherever defined\.$/iu);
  if (m) return native(locale,
    `जहाँ व्यंजक परिभाषित है, ${m[1]} को सरल कीजिए।`,
    `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);

  m = source.match(/^Where defined,\s*simplify (.+?)\.$/iu);
  if (m) return native(locale,
    `जहाँ व्यंजक परिभाषित है, ${m[1]} को सरल कीजिए।`,
    `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);

  m = source.match(/^Simplify:\s*(.+?),\s*where all terms are defined\.$/iu);
  if (m) return native(locale,
    `जहाँ सभी पद परिभाषित हैं, ${m[1]} को सरल कीजिए।`,
    `ਜਿੱਥੇ ਸਾਰੇ ਪਦ ਪਰਿਭਾਸ਼ਿਤ ਹਨ, ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);

  m = source.match(/^Which expression is equivalent to (.+?),\s*wherever it is defined\?$/iu);
  if (m) return native(locale,
    `जहाँ ${m[1]} परिभाषित है, उसके समतुल्य व्यंजक का चयन कीजिए।`,
    `ਜਿੱਥੇ ${m[1]} ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ਉਸਦੇ ਬਰਾਬਰ ਵਿਅੰਜਕ ਦੀ ਚੋਣ ਕਰੋ।`);

  m = source.match(/^Where the expression is defined,\s*(.+?) is equal to:$/iu);
  if (m) return native(locale,
    `जहाँ व्यंजक परिभाषित है, ${m[1]} के बराबर व्यंजक का चयन कीजिए।`,
    `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਦੇ ਬਰਾਬਰ ਵਿਅੰਜਕ ਦੀ ਚੋਣ ਕਰੋ।`);

  m = source.match(/^Find the maximum value of (.+?)\.$/iu);
  if (m) return native(locale,
    `${m[1]} का अधिकतम मान ज्ञात कीजिए।`,
    `${m[1]} ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਮਾਨ ਕੱਢੋ।`);

  m = source.match(/^For real θ,\s*find the minimum value of (.+?)\.$/iu);
  if (m) return native(locale,
    `वास्तविक θ के लिए ${m[1]} का न्यूनतम मान ज्ञात कीजिए।`,
    `ਵਾਸਤਵਿਕ θ ਲਈ ${m[1]} ਦਾ ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ ਕੱਢੋ।`);

  return null;
}

function nativeSetup(ruleKey: Trg001V5RuleKey, locale: Locale) {
  if (["opposite_side", "adjacent_side", "hypotenuse", "sine_ratio", "cosine_ratio", "tangent_ratio", "cotangent_ratio", "pythagorean_trig", "reconstruct_triangle"].includes(ruleKey)) {
    return native(locale,
      "दिए गए भुजा-माप और संदर्भ कोण की भूमिका तय करें।",
      "ਦਿੱਤੇ ਭੁਜਾ-ਮਾਪ ਅਤੇ ਹਵਾਲਾ ਕੋਣ ਦੀ ਭੂਮਿਕਾ ਤੈਅ ਕਰੋ।");
  }
  if (["degree_radian", "radian_degree"].includes(ruleKey)) {
    return native(locale,
      "दिए गए कोण और मांगी गई इकाई को पहचानें।",
      "ਦਿੱਤੇ ਕੋਣ ਅਤੇ ਮੰਗੀ ਗਈ ਇਕਾਈ ਨੂੰ ਪਛਾਣੋ।");
  }
  if (ruleKey === "domain") {
    return native(locale,
      "पहले जाँचें कि संबंधित त्रिकोणमितीय फलन दिए कोण पर परिभाषित है या नहीं।",
      "ਪਹਿਲਾਂ ਜਾਂਚੋ ਕਿ ਸੰਬੰਧਿਤ ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨ ਦਿੱਤੇ ਕੋਣ ਤੇ ਪਰਿਭਾਸ਼ਿਤ ਹੈ ਜਾਂ ਨਹੀਂ।");
  }
  if (ruleKey === "triangle_area") {
    return native(locale,
      "दी गई भुजाओं, उनके बीच के कोण और क्षेत्रफल संबंध को व्यवस्थित करें।",
      "ਦਿੱਤੀਆਂ ਭੁਜਾਵਾਂ, ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕੋਣ ਅਤੇ ਖੇਤਰਫਲ ਸੰਬੰਧ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰੋ।");
  }
  return native(locale,
    "दिए गए मानों और कोण की शर्त को व्यवस्थित करें।",
    "ਦਿੱਤੇ ਮਾਨਾਂ ਅਤੇ ਕੋਣ ਦੀ ਸ਼ਰਤ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰੋ।");
}

function nativeExplanation(localized: AnyQuestion, ruleKey: Trg001V5RuleKey, locale: Locale) {
  const rule = trg001V5RuleText(ruleKey, locale);
  const answer = String(localized.localizedAnswerDisplay ?? localized.options?.[localized.correctIndex]?.display ?? localized.answer);
  return {
    keyRule: rule,
    steps: [
      { title: native(locale, "चरण 1", "ਕਦਮ 1"), body: nativeSetup(ruleKey, locale) },
      { title: native(locale, "चरण 2", "ਕਦਮ 2"), body: rule },
      { title: native(locale, "चरण 3", "ਕਦਮ 3"), body: native(locale,
        `दिए गए मान लगाने पर सही उत्तर ${answer} मिलता है।`,
        `ਦਿੱਤੇ ਮਾਨ ਲਗਾਉਣ ਤੇ ਸਹੀ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`) },
    ],
    shortcut: native(locale,
      `मुख्य सूत्र या सर्वसमिका को सीधे लागू करने पर ${answer} मिलता है।`,
      `ਮੁੱਖ ਸੂਤਰ ਜਾਂ ਸਰਬਸਮਿਕਾ ਸਿੱਧੀ ਲਗਾਉਣ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`),
    traps: [native(locale,
      "सूत्र लगाते समय चिह्न, वर्ग, कोण की शर्त और व्युत्क्रम संबंध ध्यान से जाँचें।",
      "ਸੂਤਰ ਲਗਾਉਂਦੇ ਸਮੇਂ ਚਿੰਨ੍ਹ, ਵਰਗ, ਕੋਣ ਦੀ ਸ਼ਰਤ ਅਤੇ ਪਰਸਪਰ ਸੰਬੰਧ ਧਿਆਨ ਨਾਲ ਜਾਂਚੋ।")],
  };
}

function finalize(canonical: AnyQuestion, localized: AnyQuestion, stem: string, locale: Locale, fallbackUsed: boolean) {
  const binding = trg001V5BindingFor(canonical.qlId);
  if (!binding) throw new Error(`${canonical.qlId}: missing mandatory V5 binding in final hardening layer.`);
  const explanation = fallbackUsed ? nativeExplanation(localized, binding.ruleKey, locale) : localized.explanation;
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(localized);
  const localizationFingerprint = sha256({
    version: `${TRG_001_LOCALIZATION_NATIVE_V5_VERSION}_FINAL_HARDENING`,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint,
    stemKind: binding.stemKind,
    ruleKey: binding.ruleKey,
    stem,
    explanation,
    optionDisplays: localized.options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay: localized.localizedAnswerDisplay,
    fallbackUsed,
  });

  return {
    ...localized,
    stem,
    explanation,
    humanReviewStatus: "PENDING" as const,
    frozen: false as const,
    freezeEligible: false as const,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5" as const,
    localizationLifecycle: {
      ...localized.localizationLifecycle,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...localized.localizationProof,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_MANDATORY_QL_BOUND_NATIVE_V5_TEMPLATES" as const,
      v5TemplateHit: true as const,
      v5StemKind: binding.stemKind,
      v5RuleKey: binding.ruleKey,
      v5BindingSource: "TRG_001_V5_BINDINGS" as const,
      v5FinalHardening: true as const,
      v5FallbackRendererUsed: fallbackUsed,
      humanLanguageReviewRequired: true,
    },
  };
}

export function localizeFrozenTrg001QuestionNativeV5(canonicalQuestion: AnyQuestion, locale: Locale) {
  const sourceHardeningStem = fallbackStem(canonicalQuestion.stem, locale);

  try {
    const base = localizeBaseV5(canonicalQuestion, locale) as AnyQuestion;
    const hasResidualInstruction = /\bin exact form\b|\bby reduction\b/iu.test(String(base.stem ?? ""));
    if (!hasResidualInstruction) return finalize(canonicalQuestion, base, base.stem, locale, false);
    if (!sourceHardeningStem) throw new Error(`${canonicalQuestion.qlId}: residual V5 instruction has no final hardening template.`);
    return finalize(canonicalQuestion, base, sourceHardeningStem, locale, false);
  } catch (baseError) {
    if (!sourceHardeningStem) throw baseError;
    const v4 = localizeFrozenTrg001QuestionNativeV4(canonicalQuestion, locale) as AnyQuestion;
    return finalize(canonicalQuestion, v4, sourceHardeningStem, locale, true);
  }
}

export function generateLocalizedTrg001QuestionNativeV5(qlId: string, seed: string, locale: Locale) {
  const canonical = generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion;
  return localizeFrozenTrg001QuestionNativeV5(canonical, locale);
}

export { trg001V5BindingCount, trg001V5RuleText };
