import { createHash } from "node:crypto";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
  type Trg001LocalizedLocale,
} from "./localization-v1";
import { localizeFrozenTrg001QuestionNativeV4 } from "./localization-native-v4";
import {
  TRG_001_LOCALIZATION_NATIVE_V5_VERSION,
  TRG_001_V5_BINDINGS,
  TRG_001_V5_RULES,
  trg001V5BindingFor,
  type Trg001V5RuleKey,
  type Trg001V5StemKind,
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

function cleanMath(value: string) {
  return value.trim().replace(/[?.]$/u, "").replace(/\s+/g, " ");
}

function replaceConnectors(value: string, locale: Locale) {
  return value
    .replace(/\band\b/gi, native(locale, "और", "ਅਤੇ"))
    .replace(/wherever defined/gi, native(locale, "जहाँ यह परिभाषित है", "ਜਿੱਥੇ ਇਹ ਪਰਿਭਾਸ਼ਿਤ ਹੈ"))
    .replace(/where all terms are defined/gi, native(locale, "जहाँ सभी पद परिभाषित हैं", "ਜਿੱਥੇ ਸਾਰੇ ਪਦ ਪਰਿਭਾਸ਼ਿਤ ਹਨ"));
}

function nativeClause(value: string, locale: Locale) {
  let text = cleanMath(value);
  text = text
    .replace(/θ is acute/gi, native(locale, "θ न्यूनकोण है", "θ ਨਿਊਨ ਕੋਣ ਹੈ"))
    .replace(/the included angle is acute/gi, native(locale, "अंतर्विष्ट कोण न्यूनकोण है", "ਸ਼ਾਮਲ ਕੋਣ ਨਿਊਨ ਕੋਣ ਹੈ"))
    .replace(/the hypotenuse is ([^,]+?) units/gi, (_m, n) => native(locale, `कर्ण ${n} इकाई है`, `ਕਰਣ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/the side opposite θ is ([^,]+?) units/gi, (_m, n) => native(locale, `θ के सामने वाली भुजा ${n} इकाई है`, `θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/the side adjacent to θ is ([^,]+?) units/gi, (_m, n) => native(locale, `θ से सटी हुई भुजा ${n} इकाई है`, `θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/the adjacent side is ([^,]+?) units/gi, (_m, n) => native(locale, `सटी हुई भुजा ${n} इकाई है`, `ਲੱਗਦੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/the opposite side is ([^,]+?) units/gi, (_m, n) => native(locale, `सामने वाली भुजा ${n} इकाई है`, `ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ${n} ਇਕਾਈ ਹੈ`))
    .replace(/its area is ([^,]+?) square units/gi, (_m, n) => native(locale, `क्षेत्रफल ${n} वर्ग इकाई है`, `ਖੇਤਰਫਲ ${n} ਵਰਗ ਇਕਾਈ ਹੈ`))
    .replace(/opposite:hypotenuse/gi, native(locale, "सामने वाली भुजा:कर्ण", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ:ਕਰਣ"))
    .replace(/adjacent:hypotenuse/gi, native(locale, "सटी हुई भुजा:कर्ण", "ਲੱਗਦੀ ਭੁਜਾ:ਕਰਣ"))
    .replace(/opposite:adjacent/gi, native(locale, "सामने वाली भुजा:सटी हुई भुजा", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ:ਲੱਗਦੀ ਭੁਜਾ"))
    .replace(/adjacent:opposite/gi, native(locale, "सटी हुई भुजा:सामने वाली भुजा", "ਲੱਗਦੀ ਭੁਜਾ:ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"));
  return replaceConnectors(text, locale);
}

function nativeTarget(value: string, locale: Locale) {
  return cleanMath(value)
    .replace(/the side opposite θ/gi, native(locale, "θ के सामने वाली भुजा", "θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"))
    .replace(/the side adjacent to θ/gi, native(locale, "θ से सटी हुई भुजा", "θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ"))
    .replace(/the opposite side/gi, native(locale, "सामने वाली भुजा", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"))
    .replace(/the adjacent side/gi, native(locale, "सटी हुई भुजा", "ਲੱਗਦੀ ਭੁਜਾ"))
    .replace(/the hypotenuse/gi, native(locale, "कर्ण", "ਕਰਣ"))
    .replace(/that angle/gi, native(locale, "वह कोण", "ਉਹ ਕੋਣ"))
    .replace(/its area/gi, native(locale, "उसका क्षेत्रफल", "ਉਸਦਾ ਖੇਤਰਫਲ"));
}

function exactStem(expr: string, locale: Locale) {
  const e = cleanMath(expr);
  return native(locale, `${e} का सटीक मान ज्ञात कीजिए।`, `${e} ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।`);
}

function evaluateStem(expr: string, locale: Locale) {
  const e = cleanMath(expr);
  return native(locale, `${e} का मान ज्ञात कीजिए।`, `${e} ਦਾ ਮਾਨ ਕੱਢੋ।`);
}

function simplifyStem(expr: string, locale: Locale) {
  const e = cleanMath(expr);
  return native(locale, `${e} को सरल कीजिए।`, `${e} ਨੂੰ ਸਰਲ ਕਰੋ।`);
}

function parseActionStem(source: string, locale: Locale) {
  let m = source.match(/^Find the exact value of (.+)\.$/u);
  if (m) return exactStem(m[1], locale);
  m = source.match(/^Find (.+) exactly\.$/u);
  if (m) return exactStem(m[1], locale);
  m = source.match(/^Find (.+) in exact form\.$/u);
  if (m) return exactStem(m[1], locale);
  m = source.match(/^Find the (?:product|sum|difference) (.+)\.$/u);
  if (m) return exactStem(m[1], locale);
  m = source.match(/^Find the value of (.+)\.$/u);
  if (m) return evaluateStem(m[1], locale);
  m = source.match(/^Evaluate exactly:\s*(.+)\.$/u);
  if (m) return exactStem(m[1], locale);
  m = source.match(/^Evaluate (.+) exactly\.$/u);
  if (m) return exactStem(m[1], locale);
  m = source.match(/^Evaluate:\s*(.+)\.$/u);
  if (m) return evaluateStem(m[1], locale);
  m = source.match(/^Evaluate (.+)\.$/u);
  if (m) return evaluateStem(m[1], locale);
  m = source.match(/^Simplify exactly:\s*(.+)\.$/u);
  if (m) return simplifyStem(m[1], locale);
  m = source.match(/^Simplify:\s*(.+)\.$/u);
  if (m) return simplifyStem(m[1], locale);
  m = source.match(/^Simplify (.+)\.$/u);
  if (m) return simplifyStem(m[1], locale);
  throw new Error(`V5 action template did not match: ${source}`);
}

function renderStem(sourceStem: string, kind: Trg001V5StemKind, locale: Locale) {
  const source = sourceStem.trim();
  let m: RegExpMatchArray | null;

  switch (kind) {
    case "opposite_side": {
      m = source.match(/^In right triangle ([A-Z]+), ∠([A-Z]) = 90°\. Relative to angle ([A-Z]), which side is opposite\?$/u);
      if (!m) m = source.match(/^In right triangle ([A-Z]+), the right angle is at ([A-Z])\. Which side lies opposite ∠([A-Z])\?$/u);
      if (!m) break;
      return native(locale,
        `समकोण त्रिभुज ${m[1]} में ∠${m[2]} = 90° है। कोण ${m[3]} के सामने वाली भुजा कौन-सी है?`,
        `ਸਮਕੋਣ ਤਿਕੋਣ ${m[1]} ਵਿੱਚ ∠${m[2]} = 90° ਹੈ। ਕੋਣ ${m[3]} ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ?`);
    }
    case "adjacent_side": {
      m = source.match(/^In right triangle ([A-Z]+), ∠([A-Z]) = 90°\. Which leg is adjacent to angle ([A-Z])\?$/u);
      if (!m) m = source.match(/^Triangle ([A-Z]+) is right-angled at ([A-Z])\. Which leg is adjacent to ∠([A-Z])\?$/u);
      if (!m) break;
      return native(locale,
        `समकोण त्रिभुज ${m[1]} में ∠${m[2]} = 90° है। कोण ${m[3]} से सटी हुई भुजा कौन-सी है?`,
        `ਸਮਕੋਣ ਤਿਕੋਣ ${m[1]} ਵਿੱਚ ∠${m[2]} = 90° ਹੈ। ਕੋਣ ${m[3]} ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ?`);
    }
    case "hypotenuse_identify": {
      m = source.match(/^In right triangle ([A-Z]+), ∠([A-Z]) = 90°\. Which side is the hypotenuse\?$/u);
      if (!m) m = source.match(/^Triangle ([A-Z]+) is right-angled at ([A-Z])\. Identify its hypotenuse\.$/u);
      if (!m) break;
      return native(locale,
        `समकोण त्रिभुज ${m[1]} में ∠${m[2]} = 90° है। कर्ण कौन-सी भुजा है?`,
        `ਸਮਕੋਣ ਤਿਕੋਣ ${m[1]} ਵਿੱਚ ∠${m[2]} = 90° ਹੈ। ਕਰਣ ਕਿਹੜੀ ਭੁਜਾ ਹੈ?`);
    }
    case "sine_ratio_identify": {
      m = source.match(/^In right triangle ([A-Z]+) with ∠([A-Z]) = 90°, which ratio represents sin ([A-Z])\?$/u);
      if (!m) m = source.match(/^In right triangle ([A-Z]+) with ∠([A-Z])=90°, choose the ratio equal to sin ([A-Z])\.$/u);
      if (!m) break;
      return native(locale,
        `समकोण त्रिभुज ${m[1]} में ∠${m[2]} = 90° है। sin ${m[3]} को दर्शाने वाला अनुपात कौन-सा है?`,
        `ਸਮਕੋਣ ਤਿਕੋਣ ${m[1]} ਵਿੱਚ ∠${m[2]} = 90° ਹੈ। sin ${m[3]} ਨੂੰ ਦਰਸਾਉਣ ਵਾਲਾ ਅਨੁਪਾਤ ਕਿਹੜਾ ਹੈ?`);
    }
    case "ratio_what":
      m = source.match(/^For acute θ in a right triangle, (.+?) = (.+?)\. What is (.+)\?$/u);
      if (!m) break;
      return native(locale,
        `समकोण त्रिभुज में θ न्यूनकोण है और ${nativeClause(m[1], locale)} = ${m[2]}। ${nativeTarget(m[3], locale)} का मान ज्ञात कीजिए।`,
        `ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)} = ${m[2]}। ${nativeTarget(m[3], locale)} ਦਾ ਮਾਨ ਕੱਢੋ।`);
    case "ratio_find":
      m = source.match(/^In a right triangle, (.+?) relative to θ is (.+?)\. Find (.+)\.$/u);
      if (!m) break;
      return native(locale,
        `समकोण त्रिभुज में θ के सापेक्ष ${nativeClause(m[1], locale)} = ${m[2]} है। ${nativeTarget(m[3], locale)} ज्ञात कीजिए।`,
        `ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ θ ਦੇ ਸਬੰਧ ਵਿੱਚ ${nativeClause(m[1], locale)} = ${m[2]} ਹੈ। ${nativeTarget(m[3], locale)} ਕੱਢੋ।`);
    case "for_acute_if_find":
      m = source.match(/^For acute θ, (.+?)\. (?:Evaluate|Find) (.+?)\.$/u);
      if (!m) break;
      return native(locale,
        `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। ${nativeTarget(m[2], locale)} ज्ञात कीजिए।`,
        `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। ${nativeTarget(m[2], locale)} ਕੱਢੋ।`);
    case "legs_opposite_find":
      m = source.match(/^A right triangle has legs (.+?) and (.+?) units; the (.+?)-unit leg is opposite θ\. Find (.+)\.$/u);
      if (!m) break;
      return native(locale,
        `एक समकोण त्रिभुज की लंबवत भुजाएँ ${m[1]} और ${m[2]} इकाई हैं तथा ${m[3]} इकाई वाली भुजा θ के सामने है। ${nativeTarget(m[4], locale)} ज्ञात कीजिए।`,
        `ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਲੰਬ ਭੁਜਾਵਾਂ ${m[1]} ਅਤੇ ${m[2]} ਇਕਾਈ ਹਨ ਅਤੇ ${m[3]} ਇਕਾਈ ਵਾਲੀ ਭੁਜਾ θ ਦੇ ਸਾਹਮਣੇ ਹੈ। ${nativeTarget(m[4], locale)} ਕੱਢੋ।`);
    case "legs_adjacent_find":
      m = source.match(/^The legs of a right triangle are (.+?) and (.+?) units, with (.+?) adjacent to θ\. Find (.+)\.$/u);
      if (!m) break;
      return native(locale,
        `एक समकोण त्रिभुज की लंबवत भुजाएँ ${m[1]} और ${m[2]} इकाई हैं तथा ${m[3]} इकाई वाली भुजा θ से सटी हुई है। ${nativeTarget(m[4], locale)} ज्ञात कीजिए।`,
        `ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਲੰਬ ਭੁਜਾਵਾਂ ${m[1]} ਅਤੇ ${m[2]} ਇਕਾਈ ਹਨ ਅਤੇ ${m[3]} ਇਕਾਈ ਵਾਲੀ ਭੁਜਾ θ ਨਾਲ ਲੱਗਦੀ ਹੈ। ${nativeTarget(m[4], locale)} ਕੱਢੋ।`);
    case "hyp_opposite_find":
      m = source.match(/^In a right triangle, the hypotenuse is (.+?) units and the side opposite θ is (.+?) units\. Find (.+)\.$/u);
      if (!m) break;
      return native(locale,
        `एक समकोण त्रिभुज में कर्ण ${m[1]} इकाई और θ के सामने वाली भुजा ${m[2]} इकाई है। ${nativeTarget(m[3], locale)} ज्ञात कीजिए।`,
        `ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ ${m[1]} ਇਕਾਈ ਅਤੇ θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ${m[2]} ਇਕਾਈ ਹੈ। ${nativeTarget(m[3], locale)} ਕੱਢੋ।`);
    case "hyp_adjacent_find":
      m = source.match(/^In a right triangle, the hypotenuse is (.+?) units and the side adjacent to θ is (.+?) units\. Find (.+)\.$/u);
      if (!m) break;
      return native(locale,
        `एक समकोण त्रिभुज में कर्ण ${m[1]} इकाई और θ से सटी हुई भुजा ${m[2]} इकाई है। ${nativeTarget(m[3], locale)} ज्ञात कीजिए।`,
        `ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ ${m[1]} ਇਕਾਈ ਅਤੇ θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ${m[2]} ਇਕਾਈ ਹੈ। ${nativeTarget(m[3], locale)} ਕੱਢੋ।`);
    case "if_find":
    case "given_evaluate":
      m = source.match(/^If (.+?), (?:find|evaluate) (.+?)\.$/iu);
      if (!m) break;
      return native(locale,
        `यदि ${nativeClause(m[1], locale)}, तो ${nativeTarget(m[2], locale)} ज्ञात कीजिए।`,
        `ਜੇ ${nativeClause(m[1], locale)}, ਤਾਂ ${nativeTarget(m[2], locale)} ਕੱਢੋ।`);
    case "for_acute_determine_exact":
      m = source.match(/^For acute θ, (.+?)\. Determine (.+?) exactly\.$/u);
      if (!m) break;
      return native(locale,
        `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। ${nativeTarget(m[2], locale)} का सटीक मान ज्ञात कीजिए।`,
        `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। ${nativeTarget(m[2], locale)} ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।`);
    case "compare_sin_cos":
      m = source.match(/^An acute angle θ satisfies (.+?)\. Compare (.+?) and (.+?)\.$/u);
      if (!m) break;
      return native(locale,
        `न्यूनकोण θ के लिए ${nativeClause(m[1], locale)} है। ${m[2]} और ${m[3]} की तुलना कीजिए।`,
        `ਨਿਊਨ ਕੋਣ θ ਲਈ ${nativeClause(m[1], locale)} ਹੈ। ${m[2]} ਅਤੇ ${m[3]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
    case "given_reciprocal":
      m = source.match(/^Given (.+?), determine its reciprocal trig function (.+?)\.$/u);
      if (!m) break;
      return native(locale,
        `${nativeClause(m[1], locale)} दिया है। इसका व्युत्क्रम त्रिकोणमितीय फलन ${m[2]} ज्ञात कीजिए।`,
        `${nativeClause(m[1], locale)} ਦਿੱਤਾ ਹੈ। ਇਸਦਾ ਪਰਸਪਰ ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨ ${m[2]} ਕੱਢੋ।`);
    case "exact_expression":
    case "expression_action":
      return parseActionStem(source, locale);
    case "tan90_domain":
      m = source.match(/^What is the value of (.+?)\?$/u);
      if (m) return native(locale, `${m[1]} का मान क्या है?`, `${m[1]} ਦਾ ਮਾਨ ਕੀ ਹੈ?`);
      m = source.match(/^Which option correctly describes (.+?)\?$/u);
      if (m) return native(locale, `${m[1]} के बारे में सही कथन चुनिए।`, `${m[1]} ਬਾਰੇ ਸਹੀ ਕਥਨ ਚੁਣੋ।`);
      break;
    case "defined_finite":
      return native(locale,
        "निम्नलिखित में से कौन-सा त्रिकोणमितीय मान परिभाषित और सीमित है?",
        "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਤਿਕੋਣਮਿਤੀ ਮਾਨ ਪਰਿਭਾਸ਼ਿਤ ਅਤੇ ਸੀਮਿਤ ਹੈ?");
    case "deg_to_rad":
      m = source.match(/^Convert (.+?)° to radians in terms of π\.$/u);
      if (!m) break;
      return native(locale, `${m[1]}° को π के रूप में रेडियन में बदलिए।`, `${m[1]}° ਨੂੰ π ਦੇ ਰੂਪ ਵਿੱਚ ਰੇਡੀਅਨ ਵਿੱਚ ਬਦਲੋ।`);
    case "rad_to_deg":
      m = source.match(/^Convert (.+?) to degrees\.$/u);
      if (!m) break;
      return native(locale, `${m[1]} रेडियन को डिग्री में बदलिए।`, `${m[1]} ਰੇਡੀਅਨ ਨੂੰ ਡਿਗਰੀ ਵਿੱਚ ਬਦਲੋ।`);
    case "if_evaluate":
      m = source.match(/^If (.+?), evaluate (.+?)\.$/iu);
      if (!m) break;
      return native(locale,
        `यदि ${nativeClause(m[1], locale)}, तो ${nativeTarget(m[2], locale)} का मान ज्ञात कीजिए।`,
        `ਜੇ ${nativeClause(m[1], locale)}, ਤਾਂ ${nativeTarget(m[2], locale)} ਦਾ ਮਾਨ ਕੱਢੋ।`);
    case "for_condition_simplify":
      m = source.match(/^For (.+?), simplify (.+?)\.$/iu);
      if (!m) break;
      return native(locale,
        `${nativeClause(m[1], locale)} होने पर ${nativeTarget(m[2], locale)} को सरल कीजिए।`,
        `${nativeClause(m[1], locale)} ਹੋਣ ਤੇ ${nativeTarget(m[2], locale)} ਨੂੰ ਸਰਲ ਕਰੋ।`);
    case "equivalent_identity":
      m = source.match(/^Which expression is equivalent to (.+?), wherever it is defined\?$/u);
      if (!m) break;
      return native(locale,
        `जहाँ ${m[1]} परिभाषित है, उसके समतुल्य व्यंजक का चयन कीजिए।`,
        `ਜਿੱਥੇ ${m[1]} ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ਉਸਦੇ ਬਰਾਬਰ ਵਿਅੰਜਕ ਦੀ ਚੋਣ ਕਰੋ।`);
    case "acute_solve":
      m = source.match(/^If (.+?) and 0° < θ < 90°, find θ\.$/u);
      if (!m) break;
      return native(locale,
        `0° < θ < 90° और ${nativeClause(m[1], locale)} है। θ ज्ञात कीजिए।`,
        `0° < θ < 90° ਅਤੇ ${nativeClause(m[1], locale)} ਹੈ। θ ਕੱਢੋ।`);
    case "acute_find_theta":
      m = source.match(/^For acute θ, find θ if (.+?)\.$/u);
      if (!m) break;
      return native(locale,
        `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। θ ज्ञात कीजिए।`,
        `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। θ ਕੱਢੋ।`);
    case "simplify_where":
      m = source.match(/^Simplify (.+?), wherever defined\.$/u);
      if (!m) break;
      return native(locale,
        `जहाँ व्यंजक परिभाषित है, ${m[1]} को सरल कीजिए।`,
        `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);
    case "acute_with_evaluate":
      m = source.match(/^For acute θ(?: with|,) (.+?), evaluate (.+?)(?: exactly)?\.$/iu);
      if (!m) break;
      return native(locale,
        `θ न्यूनकोण है और ${nativeClause(m[1], locale)}। ${nativeTarget(m[2], locale)} का मान ज्ञात कीजिए।`,
        `θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ ${nativeClause(m[1], locale)}। ${nativeTarget(m[2], locale)} ਦਾ ਮਾਨ ਕੱਢੋ।`);
    case "maximum":
      m = source.match(/^Find the maximum value of (.+?)\.$/u);
      if (!m) break;
      return native(locale, `${m[1]} का अधिकतम मान ज्ञात कीजिए।`, `${m[1]} ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਮਾਨ ਕੱਢੋ।`);
    case "minimum":
      m = source.match(/^For real θ, find the minimum value of (.+?)\.$/u);
      if (!m) break;
      return native(locale, `वास्तविक θ के लिए ${m[1]} का न्यूनतम मान ज्ञात कीजिए।`, `ਵਾਸਤਵਿਕ θ ਲਈ ${m[1]} ਦਾ ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ ਕੱਢੋ।`);
    case "triangle_area":
      m = source.match(/^Two sides of a triangle are (.+?) and (.+?) units, with included angle (.+?)\. Find its area\.$/u);
      if (!m) break;
      return native(locale,
        `एक त्रिभुज की दो भुजाएँ ${m[1]} और ${m[2]} इकाई हैं तथा उनके बीच का कोण ${m[3]} है। त्रिभुज का क्षेत्रफल ज्ञात कीजिए।`,
        `ਇੱਕ ਤਿਕੋਣ ਦੀਆਂ ਦੋ ਭੁਜਾਵਾਂ ${m[1]} ਅਤੇ ${m[2]} ਇਕਾਈ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕੋਣ ${m[3]} ਹੈ। ਤਿਕੋਣ ਦਾ ਖੇਤਰਫਲ ਕੱਢੋ।`);
    case "triangle_angle_area":
      m = source.match(/^Two sides of a triangle are (.+?) and (.+?) units, and its area is (.+?) square units\. If the included angle is acute, find that angle\.$/u);
      if (!m) break;
      return native(locale,
        `एक त्रिभुज की दो भुजाएँ ${m[1]} और ${m[2]} इकाई हैं तथा क्षेत्रफल ${m[3]} वर्ग इकाई है। यदि उनके बीच का कोण न्यूनकोण है, तो वह कोण ज्ञात कीजिए।`,
        `ਇੱਕ ਤਿਕੋਣ ਦੀਆਂ ਦੋ ਭੁਜਾਵਾਂ ${m[1]} ਅਤੇ ${m[2]} ਇਕਾਈ ਹਨ ਅਤੇ ਖੇਤਰਫਲ ${m[3]} ਵਰਗ ਇਕਾਈ ਹੈ। ਜੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕੋਣ ਨਿਊਨ ਕੋਣ ਹੈ, ਤਾਂ ਉਹ ਕੋਣ ਕੱਢੋ।`);
    case "simplify_where_prefix":
      m = source.match(/^Where defined, simplify (.+?)\.$/u);
      if (!m) break;
      return native(locale, `जहाँ व्यंजक परिभाषित है, ${m[1]} को सरल कीजिए।`, `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);
    case "find_where":
      m = source.match(/^Simplify:\s*(.+?), where all terms are defined\.$/u);
      if (!m) break;
      return native(locale, `जहाँ सभी पद परिभाषित हैं, ${m[1]} को सरल कीजिए।`, `ਜਿੱਥੇ ਸਾਰੇ ਪਦ ਪਰਿਭਾਸ਼ਿਤ ਹਨ, ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);
    case "trig_equivalent":
      m = source.match(/^Where the expression is defined, (.+?) is equal to:$/u);
      if (!m) break;
      return native(locale, `जहाँ व्यंजक परिभाषित है, ${m[1]} के बराबर व्यंजक का चयन कीजिए।`, `ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ${m[1]} ਦੇ ਬਰਾਬਰ ਵਿਅੰਜਕ ਦੀ ਚੋਣ ਕਰੋ।`);
  }

  throw new Error(`V5 stem template '${kind}' did not match source stem: ${source}`);
}

export function trg001V5RuleText(ruleKey: Trg001V5RuleKey, locale: Locale) {
  const pair = TRG_001_V5_RULES[ruleKey];
  if (!pair) throw new Error(`Missing TRG-001 V5 rule '${ruleKey}'.`);
  return locale === "hi-IN" ? pair[0] : pair[1];
}

function nativeTrap(ruleKey: Trg001V5RuleKey, locale: Locale) {
  if (["opposite_side", "adjacent_side", "hypotenuse"].includes(ruleKey)) return native(locale,
    "भुजाओं की भूमिका तय करते समय संदर्भ कोण और समकोण को न मिलाएँ।",
    "ਭੁਜਾਵਾਂ ਦੀ ਭੂਮਿਕਾ ਤੈਅ ਕਰਦੇ ਸਮੇਂ ਹਵਾਲਾ ਕੋਣ ਅਤੇ ਸਮਕੋਣ ਨੂੰ ਨਾ ਗਡ਼ਬਡ਼ ਕਰੋ।");
  if (["sine_ratio", "cosine_ratio", "tangent_ratio", "cotangent_ratio", "reciprocal"].includes(ruleKey)) return native(locale,
    "अनुपात में अंश और हर की भुजाओं का क्रम न उलटें।",
    "ਅਨੁਪਾਤ ਵਿੱਚ ਅੰਸ਼ ਅਤੇ ਹਰ ਵਾਲੀਆਂ ਭੁਜਾਵਾਂ ਦਾ ਕ੍ਰਮ ਨਾ ਉਲਟੋ।");
  if (["degree_radian", "radian_degree"].includes(ruleKey)) return native(locale,
    "डिग्री और रेडियन के रूपांतरण गुणक को उल्टा न लगाएँ।",
    "ਡਿਗਰੀ ਅਤੇ ਰੇਡੀਅਨ ਦੇ ਰੂਪਾਂਤਰਨ ਗੁਣਕ ਨੂੰ ਉਲਟਾ ਨਾ ਲਗਾਓ।");
  if (ruleKey === "quadrant_reduction") return native(locale,
    "संदर्भ कोण निकालने के बाद चतुर्थांश का चिह्न लगाना न भूलें।",
    "ਹਵਾਲਾ ਕੋਣ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਚਤੁਰਭਾਗ ਦਾ ਚਿੰਨ੍ਹ ਲਗਾਉਣਾ ਨਾ ਭੁੱਲੋ।");
  if (ruleKey === "domain") return native(locale,
    "जिस स्थिति में हर शून्य हो, उसे परिभाषित मान न समझें।",
    "ਜਿਸ ਸਥਿਤੀ ਵਿੱਚ ਹਰ ਸਿਫ਼ਰ ਹੋਵੇ, ਉਸਨੂੰ ਪਰਿਭਾਸ਼ਿਤ ਨਾ ਮੰਨੋ।");
  if (ruleKey === "triangle_area") return native(locale,
    "क्षेत्रफल के सूत्र में उन्हीं दो भुजाओं के बीच वाला कोण प्रयोग करें।",
    "ਖੇਤਰਫਲ ਦੇ ਸੂਤਰ ਵਿੱਚ ਉਹੀ ਕੋਣ ਵਰਤੋ ਜੋ ਦਿੱਤੀਆਂ ਦੋ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ।");
  return native(locale,
    "सूत्र या सर्वसमिका लगाते समय चिह्न, वर्ग और व्युत्क्रम संबंधों पर ध्यान दें।",
    "ਸੂਤਰ ਜਾਂ ਸਰਬਸਮਿਕਾ ਲਗਾਉਂਦੇ ਸਮੇਂ ਚਿੰਨ੍ਹ, ਵਰਗ ਅਤੇ ਪਰਸਪਰ ਸੰਬੰਧਾਂ ਦਾ ਧਿਆਨ ਰੱਖੋ।");
}

function nativeSetup(ruleKey: Trg001V5RuleKey, locale: Locale) {
  if (["opposite_side", "adjacent_side", "hypotenuse", "sine_ratio", "cosine_ratio", "tangent_ratio", "cotangent_ratio", "pythagorean_trig", "reconstruct_triangle"].includes(ruleKey)) return native(locale,
    "दिए गए भुजा-माप और संदर्भ कोण की भूमिका नोट करें।",
    "ਦਿੱਤੇ ਭੁਜਾ-ਮਾਪ ਅਤੇ ਹਵਾਲਾ ਕੋਣ ਦੀ ਭੂਮਿਕਾ ਨੋਟ ਕਰੋ।");
  if (["degree_radian", "radian_degree"].includes(ruleKey)) return native(locale,
    "दिए गए कोण और मांगी गई इकाई को पहचानें।",
    "ਦਿੱਤੇ ਕੋਣ ਅਤੇ ਮੰਗੀ ਗਈ ਇਕਾਈ ਨੂੰ ਪਛਾਣੋ।");
  if (ruleKey === "triangle_area") return native(locale,
    "दी गई दोनों भुजाएँ, उनके बीच का कोण और क्षेत्रफल संबंध नोट करें।",
    "ਦਿੱਤੀਆਂ ਦੋਵੇਂ ਭੁਜਾਵਾਂ, ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕੋਣ ਅਤੇ ਖੇਤਰਫਲ ਸੰਬੰਧ ਨੋਟ ਕਰੋ।");
  if (ruleKey === "domain") return native(locale,
    "पहले जाँचें कि संबंधित त्रिकोणमितीय फलन दिए कोण पर परिभाषित है या नहीं।",
    "ਪਹਿਲਾਂ ਜਾਂਚੋ ਕਿ ਸੰਬੰਧਿਤ ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨ ਦਿੱਤੇ ਕੋਣ ਤੇ ਪਰਿਭਾਸ਼ਿਤ ਹੈ ਜਾਂ ਨਹੀਂ।");
  return native(locale,
    "दिए गए मानों और कोण की शर्त को व्यवस्थित करें।",
    "ਦਿੱਤੇ ਮਾਨਾਂ ਅਤੇ ਕੋਣ ਦੀ ਸ਼ਰਤ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰੋ।");
}

function nativeExplanation(source: AnyQuestion, localized: AnyQuestion, ruleKey: Trg001V5RuleKey, locale: Locale) {
  const rule = trg001V5RuleText(ruleKey, locale);
  const answer = String(localized.localizedAnswerDisplay ?? localized.options?.[localized.correctIndex]?.display ?? source.answer);
  return {
    keyRule: rule,
    steps: [
      { title: native(locale, "चरण 1", "ਕਦਮ 1"), body: nativeSetup(ruleKey, locale) },
      { title: native(locale, "चरण 2", "ਕਦਮ 2"), body: rule },
      { title: native(locale, "चरण 3", "ਕਦਮ 3"), body: native(locale,
        `दिए गए मानों को लागू करने पर सही उत्तर ${answer} मिलता है।`,
        `ਦਿੱਤੇ ਮਾਨ ਲਗਾਉਣ ਤੇ ਸਹੀ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`) },
    ],
    shortcut: native(locale,
      `मुख्य सूत्र या सर्वसमिका को सीधे लागू करने पर ${answer} मिलता है।`,
      `ਮੁੱਖ ਸੂਤਰ ਜਾਂ ਸਰਬਸਮਿਕਾ ਸਿੱਧੀ ਲਗਾਉਣ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`),
    traps: [nativeTrap(ruleKey, locale)],
  };
}

export function localizeFrozenTrg001QuestionNativeV5(canonicalQuestion: AnyQuestion, locale: Locale) {
  if (!TRG_001_LOCALIZATION_QL_IDS.includes(canonicalQuestion.qlId)) throw new Error(`${canonicalQuestion.qlId}: outside TRG-001 V5 localization scope.`);
  const binding = trg001V5BindingFor(canonicalQuestion.qlId);
  if (!binding) throw new Error(`${canonicalQuestion.qlId}: missing mandatory V5 binding.`);

  const v4 = localizeFrozenTrg001QuestionNativeV4(canonicalQuestion, locale) as AnyQuestion;
  const stem = renderStem(canonicalQuestion.stem, binding.stemKind, locale);
  const explanation = nativeExplanation(canonicalQuestion, v4, binding.ruleKey, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(v4);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_V5_VERSION,
    locale,
    qlId: v4.qlId,
    seed: v4.seed,
    canonicalSemanticFingerprint,
    stemKind: binding.stemKind,
    ruleKey: binding.ruleKey,
    stem,
    explanation,
    optionDisplays: v4.options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay: v4.localizedAnswerDisplay,
  });

  return {
    ...v4,
    stem,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5" as const,
    localizationLifecycle: {
      ...v4.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_V5_VERSION,
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
      ...v4.localizationProof,
      localizationFingerprint,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_MANDATORY_QL_BOUND_NATIVE_V5_TEMPLATES" as const,
      v5TemplateHit: true as const,
      v5StemKind: binding.stemKind,
      v5RuleKey: binding.ruleKey,
      v5BindingSource: "TRG_001_V5_BINDINGS" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeV5(qlId: string, seed: string, locale: Locale) {
  return localizeFrozenTrg001QuestionNativeV5(generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion, locale);
}

export function trg001V5BindingCount() {
  return Object.keys(TRG_001_V5_BINDINGS).length;
}
