import { createHash } from "node:crypto";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS, trg001CanonicalSemanticFingerprint, type Trg001LocalizedLocale } from "./localization-v1";
import {
  localizeFrozenTrg001QuestionEditorialV2,
  trg001ResidualEnglishTokens,
} from "./localization-editorial-v2";

export const TRG_001_LOCALIZATION_EDITORIAL_V3_VERSION = "TRG001_HI_PA_LOCALIZATION_EDITORIAL_V3" as const;

type AnyQuestion = Record<string, any>;

function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value), "utf8").digest("hex");
}

function naturalizeHindi(input: unknown) {
  return String(input ?? "")
    .replace(/अनुपातnal-/g, "परिमेय-")
    .replace(/^कौन-सा option correctly describes ([^?]+)\?$/u, "$1 का सही वर्णन करने वाला विकल्प कौन-सा है?")
    .replace(/^Among निम्नलिखित मानक-कोण व्यंजक, पहचानें एक having एक वास्तविक ससीम मान\.$/u, "निम्नलिखित मानक-कोण व्यंजकों में से वास्तविक ससीम मान वाला व्यंजक पहचानें।")
    .replace(/^(.+) है identically बराबर को कौन-सा व्यंजक\?$/u, "कौन-सा व्यंजक $1 के सर्वसमिक रूप से बराबर है?")
    .replace(/^मान ज्ञात कीजिए प्रत्येक component सटीक रूप से\.$/u, "प्रत्येक पद का सटीक मान ज्ञात कीजिए।")
    .replace(/^त्रिभुज ([A-Z]{3}) है समकोण-angled पर ([A-Z])\./u, "त्रिभुज $1 में $2 पर समकोण है।")
    .replace(/कौन-सी भुजा है सटी हुई को ∠([A-Z])\?/g, "∠$1 से सटी हुई भुजा कौन-सी है?")
    .replace(/कौन-सी भुजा है सटा हुआ को ∠([A-Z])\?/g, "∠$1 से सटी हुई भुजा कौन-सी है?")
    .replace(/^में (समकोण त्रिभुज [A-Z]{2,4}) के साथ/u, "$1 में")
    .replace(/^में (समकोण त्रिभुज [A-Z]{2,4}),/u, "$1 में,")
    .replace(/^न्यूनकोण ([^,]+) एक समकोण त्रिभुज में के लिए,/u, "एक समकोण त्रिभुज में न्यूनकोण $1 के लिए,")
    .replace(/^एक समकोण त्रिभुज में हैं भुजाएँ ([^;,.]+)([;,.])/u, "एक समकोण त्रिभुज की भुजाएँ $1 हैं$2")
    .replace(/^भुजाएँ का एक समकोण त्रिभुज हैं ([^,]+),/u, "एक समकोण त्रिभुज की भुजाएँ $1 हैं,")
    .replace(/कौन-सी भुजा है सटा हुआ को कोण ([A-Z])/g, "कोण $1 से सटी हुई भुजा कौन-सी है")
    .replace(/कौन-सी भुजा है सटी हुई को कोण ([A-Z])/g, "कोण $1 से सटी हुई भुजा कौन-सी है")
    .replace(/कौन-सी भुजा है सामने\?/g, "सामने वाली भुजा कौन-सी है?")
    .replace(/कौन-सी भुजा है कर्ण\?/g, "कर्ण कौन-सी भुजा है?")
    .replace(/सटा हुआ/g, "सटी हुई")
    .replace(/([^,;]+):([^,;]+) के संदर्भ में (θ|[A-Za-z]+) है ([^,;.]+)/g, "$3 के संदर्भ में $1:$2 = $4")
    .replace(/के साथ (\d+) सटी हुई को (θ|[A-Za-z]+)/g, "जहाँ $1 इकाई वाली भुजा $2 से सटी हुई है")
    .replace(/^सामने वाली भुजा नहीं करता स्पर्श करती संदर्भ कोण\.?$/u, "सामने वाली भुजा संदर्भ कोण को स्पर्श नहीं करती।")
    .replace(/^कोण ([A-Z]) है बनता है से ([A-Z]{2}) और ([A-Z]{2})\.?$/u, "कोण $1, $2 और $3 से बनता है।")
    .replace(/^शेष भुजा ([A-Z]{2}) स्थित है सामने कोण ([A-Z])\.?$/u, "शेष भुजा $1, कोण $2 के सामने है।")
    .replace(/^न कहें कर्ण सामने वाली भुजा केवल क्योंकि यह है सबसे लंबी\.?$/u, "केवल सबसे लंबी होने के कारण कर्ण को सामने वाली भुजा न मानें।")
    .replace(/^सटी हुई भुजा स्पर्श करती है संदर्भ कोण लेकिन नहीं है कर्ण\.?$/u, "सटी हुई भुजा संदर्भ कोण को स्पर्श करती है, लेकिन कर्ण नहीं होती।")
    .replace(/^अतः ([A-Z]{2}) है सटी हुई भुजा को कोण ([A-Z])\.?$/u, "अतः $1, कोण $2 से सटी हुई भुजा है।")
    .replace(/^के लिए त्रिकोणमितीय भुजा भूमिकाएँ, हटा दें कर्ण जब नाम देते समय सटी हुई भुजा\.?$/u, "सटी हुई भुजा निर्धारित करते समय कर्ण को अलग रखें।")
    .replace(/^कर्ण है सामने समकोण\.?$/u, "कर्ण समकोण के सामने होता है।")
    .replace(/^समकोण है पर ([A-Z])\.?$/u, "समकोण $1 पर है।")
    .replace(/^([A-Z]) के सामने वाली भुजा ([A-Z]{2}) है, इसलिए ([A-Z]{2}) है कर्ण\.?$/u, "$1 के सामने वाली भुजा $2 है, इसलिए $3 कर्ण है।")
    .replace(/^के विपरीत सामने\/सटी हुई भुजाएँ, कर्ण नहीं करता बदलता के साथ चुने हुए न्यूनकोण कोण\.?$/u, "सामने/सटी हुई भुजाओं के विपरीत, चुना गया न्यूनकोण बदलने पर कर्ण नहीं बदलता।")
    .replace(/न करें\s+([\p{L}-]+) करें/gu, "$1 न करें")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function naturalizePunjabi(input: unknown) {
  return String(input ?? "")
    .replace(/ਅਨੁਪਾਤnal-/g, "ਪਰਿਮੇਯ-")
    .replace(/^ਕਿਹੜਾ option correctly describes ([^?]+)\?$/u, "$1 ਦਾ ਸਹੀ ਵਰਣਨ ਕਰਨ ਵਾਲਾ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?")
    .replace(/^Among ਹੇਠਾਂ ਦਿੱਤੇ ਮਿਆਰੀ-ਕੋਣ ਵਿਅੰਜਕ, ਪਛਾਣੋ ਇੱਕ having ਇੱਕ ਵਾਸਤਵਿਕ ਸੀਮਿਤ ਮਾਨ\.$/u, "ਹੇਠਾਂ ਦਿੱਤੇ ਮਿਆਰੀ-ਕੋਣ ਵਿਅੰਜਕਾਂ ਵਿੱਚੋਂ ਵਾਸਤਵਿਕ ਸੀਮਿਤ ਮਾਨ ਵਾਲਾ ਵਿਅੰਜਕ ਪਛਾਣੋ।")
    .replace(/^(.+) ਹੈ identically ਬਰਾਬਰ ਨੂੰ ਕਿਹੜਾ ਵਿਅੰਜਕ\?$/u, "ਕਿਹੜਾ ਵਿਅੰਜਕ $1 ਦੇ ਸਰਬਸਮਿਕ ਤੌਰ ਤੇ ਬਰਾਬਰ ਹੈ?")
    .replace(/^ਮਾਨ ਕੱਢੋ ਹਰੇਕ component ਸਹੀ ਤੌਰ ਤੇ\.$/u, "ਹਰੇਕ ਪਦ ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਤਿਕੋਣ ([A-Z]{3}) ਹੈ ਸਮਕੋਣ-angled ਤੇ ([A-Z])\./u, "ਤਿਕੋਣ $1 ਵਿੱਚ $2 ਤੇ ਸਮਕੋਣ ਹੈ।")
    .replace(/ਕਿਹੜੀ ਭੁਜਾ ਹੈ ਲੱਗਦੀ ਨੂੰ ∠([A-Z])\?/g, "∠$1 ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ?")
    .replace(/ਕਿਹੜੀ ਭੁਜਾ ਹੈ ਲੱਗਦਾ ਨੂੰ ∠([A-Z])\?/g, "∠$1 ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ?")
    .replace(/^ਵਿੱਚ (ਸਮਕੋਣ ਤਿਕੋਣ [A-Z]{2,4}) ਨਾਲ/u, "$1 ਵਿੱਚ")
    .replace(/^ਵਿੱਚ (ਸਮਕੋਣ ਤਿਕੋਣ [A-Z]{2,4}),/u, "$1 ਵਿੱਚ,")
    .replace(/^ਨਿਊਨ ਕੋਣ ([^,]+) ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਲਈ,/u, "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਨਿਊਨ ਕੋਣ $1 ਲਈ,")
    .replace(/^ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਹਨ ਭੁਜਾਵਾਂ ([^;,.]+)([;,.])/u, "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ $1 ਹਨ$2")
    .replace(/^ਭੁਜਾਵਾਂ ਦਾ ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਹਨ ([^,]+),/u, "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ $1 ਹਨ,")
    .replace(/ਕਿਹੜੀ ਭੁਜਾ ਹੈ ਲੱਗਦਾ ਨੂੰ ਕੋਣ ([A-Z])/g, "ਕੋਣ $1 ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ")
    .replace(/ਕਿਹੜੀ ਭੁਜਾ ਹੈ ਲੱਗਦੀ ਨੂੰ ਕੋਣ ([A-Z])/g, "ਕੋਣ $1 ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ")
    .replace(/ਕਿਹੜੀ ਭੁਜਾ ਹੈ ਸਾਹਮਣੇ\?/g, "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਕਿਹੜੀ ਹੈ?")
    .replace(/ਕਿਹੜੀ ਭੁਜਾ ਹੈ ਕਰਣ\?/g, "ਕਰਣ ਕਿਹੜੀ ਭੁਜਾ ਹੈ?")
    .replace(/ਲੱਗਦਾ/g, "ਲੱਗਦੀ")
    .replace(/([^,;]+):([^,;]+) ਦੇ ਸਬੰਧ ਵਿੱਚ (θ|[A-Za-z]+) ਹੈ ([^,;.]+)/g, "$3 ਦੇ ਸਬੰਧ ਵਿੱਚ $1:$2 = $4")
    .replace(/ਨਾਲ (\d+) ਲੱਗਦੀ ਨੂੰ (θ|[A-Za-z]+)/g, "ਜਿੱਥੇ $1 ਇਕਾਈ ਵਾਲੀ ਭੁਜਾ $2 ਨਾਲ ਲੱਗਦੀ ਹੈ")
    .replace(/^ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਨਹੀਂ ਕਰਦਾ ਛੂਹਦੀ ਹਵਾਲਾ ਕੋਣ\.?$/u, "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹਵਾਲਾ ਕੋਣ ਨੂੰ ਨਹੀਂ ਛੂਹਦੀ।")
    .replace(/^ਕੋਣ ([A-Z]) ਹੈ ਬਣਦਾ ਹੈ ਨਾਲ ([A-Z]{2}) ਅਤੇ ([A-Z]{2})\.?$/u, "ਕੋਣ $1, $2 ਅਤੇ $3 ਨਾਲ ਬਣਦਾ ਹੈ।")
    .replace(/^ਬਾਕੀ ਭੁਜਾ ([A-Z]{2}) ਸਥਿਤ ਹੈ ਸਾਹਮਣੇ ਕੋਣ ([A-Z])\.?$/u, "ਬਾਕੀ ਭੁਜਾ $1, ਕੋਣ $2 ਦੇ ਸਾਹਮਣੇ ਹੈ।")
    .replace(/^ਨਾ ਕਹੋ ਕਰਣ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਕੇਵਲ ਕਿਉਂਕਿ ਇਹ ਹੈ ਸਭ ਤੋਂ ਲੰਮੀ\.?$/u, "ਕੇਵਲ ਸਭ ਤੋਂ ਲੰਮੀ ਹੋਣ ਕਰਕੇ ਕਰਣ ਨੂੰ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਨਾ ਮੰਨੋ।")
    .replace(/^ਲੱਗਦੀ ਭੁਜਾ ਛੂਹਦੀ ਹੈ ਹਵਾਲਾ ਕੋਣ ਪਰ ਨਹੀਂ ਹੈ ਕਰਣ\.?$/u, "ਲੱਗਦੀ ਭੁਜਾ ਹਵਾਲਾ ਕੋਣ ਨੂੰ ਛੂਹਦੀ ਹੈ, ਪਰ ਕਰਣ ਨਹੀਂ ਹੁੰਦੀ।")
    .replace(/^ਇਸ ਲਈ ([A-Z]{2}) ਹੈ ਲੱਗਦੀ ਭੁਜਾ ਨੂੰ ਕੋਣ ([A-Z])\.?$/u, "ਇਸ ਲਈ $1, ਕੋਣ $2 ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਹੈ।")
    .replace(/^ਲਈ ਤਿਕੋਣਮਿਤੀ ਭੁਜਾ ਭੂਮਿਕਾਵਾਂ, ਹਟਾਓ ਕਰਣ ਜਦੋਂ ਨਾਮ ਦੇਣ ਵੇਲੇ ਲੱਗਦੀ ਭੁਜਾ\.?$/u, "ਲੱਗਦੀ ਭੁਜਾ ਨਿਰਧਾਰਤ ਕਰਦੇ ਸਮੇਂ ਕਰਣ ਨੂੰ ਵੱਖ ਰੱਖੋ।")
    .replace(/^ਕਰਣ ਹੈ ਸਾਹਮਣੇ ਸਮਕੋਣ\.?$/u, "ਕਰਣ ਸਮਕੋਣ ਦੇ ਸਾਹਮਣੇ ਹੁੰਦਾ ਹੈ।")
    .replace(/^ਸਮਕੋਣ ਹੈ ਤੇ ([A-Z])\.?$/u, "ਸਮਕੋਣ $1 ਤੇ ਹੈ।")
    .replace(/^([A-Z]) ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ([A-Z]{2}) ਹੈ, ਇਸ ਲਈ ([A-Z]{2}) ਹੈ ਕਰਣ\.?$/u, "$1 ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ $2 ਹੈ, ਇਸ ਲਈ $3 ਕਰਣ ਹੈ।")
    .replace(/^ਦੇ ਉਲਟ ਸਾਹਮਣੇ\/ਲੱਗਦੀ ਭੁਜਾਵਾਂ, ਕਰਣ ਨਹੀਂ ਕਰਦਾ ਬਦਲਦਾ ਨਾਲ ਚੁਣੇ ਹੋਏ ਨਿਊਨ ਕੋਣ ਕੋਣ\.?$/u, "ਸਾਹਮਣੇ/ਲੱਗਦੀ ਭੁਜਾਵਾਂ ਦੇ ਉਲਟ, ਚੁਣਿਆ ਨਿਊਨ ਕੋਣ ਬਦਲਣ ਤੇ ਕਰਣ ਨਹੀਂ ਬਦਲਦਾ।")
    .replace(/ਨਾ ਕਰੋ\s+([\p{L}-]+) ਕਰੋ/gu, "$1 ਨਾ ਕਰੋ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function naturalizeTrg001LocalizedV3(value: unknown, locale: Trg001LocalizedLocale) {
  return locale === "hi-IN" ? naturalizeHindi(value) : naturalizePunjabi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Trg001LocalizedLocale) {
  return {
    ...explanation,
    keyRule: naturalizeTrg001LocalizedV3(explanation?.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: naturalizeTrg001LocalizedV3(step.title, locale),
      body: naturalizeTrg001LocalizedV3(step.body, locale),
    })),
    shortcut: naturalizeTrg001LocalizedV3(explanation?.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => naturalizeTrg001LocalizedV3(trap, locale)),
  };
}

export function localizeFrozenTrg001QuestionEditorialV3(canonicalQuestion: AnyQuestion, locale: Trg001LocalizedLocale) {
  const v2 = localizeFrozenTrg001QuestionEditorialV2(canonicalQuestion, locale) as AnyQuestion;
  const stem = naturalizeTrg001LocalizedV3(v2.stem, locale);
  const explanation = mapExplanation(v2.explanation, locale);
  const options = v2.options.map((option: AnyQuestion) => ({
    ...option,
    display: naturalizeTrg001LocalizedV3(option.display, locale),
  }));
  const localizedAnswerDisplay = naturalizeTrg001LocalizedV3(v2.localizedAnswerDisplay, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(v2);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_EDITORIAL_V3_VERSION,
    locale,
    qlId: v2.qlId,
    seed: v2.seed,
    canonicalSemanticFingerprint,
    stem,
    explanation,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
  });

  return {
    ...v2,
    stem,
    explanation,
    options,
    localizedAnswerDisplay,
    reviewStatus: "LOCALIZATION_EDITORIAL_REVIEW_CANDIDATE_V3" as const,
    localizationLifecycle: {
      ...v2.localizationLifecycle,
      version: TRG_001_LOCALIZATION_EDITORIAL_V3_VERSION,
      hindiPunjabi: "EDITORIAL_REVIEW_CANDIDATE_V3" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...v2.localizationProof,
      localizationFingerprint,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_NATIVE_EDITORIAL_V3_NATURALIZATION" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionEditorialV3(qlId: string, seed: string, locale: Trg001LocalizedLocale) {
  if (!TRG_001_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-001 localization scope.`);
  return localizeFrozenTrg001QuestionEditorialV3(generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion, locale);
}

function isConcatenatedTrigMathToken(token: string) {
  return /^(?:(?:sin|cos|tan|cot|sec|cosec)[A-Za-z]){2,}$/iu.test(token);
}

export function trg001V3ResidualEnglishTokens(value: unknown) {
  return trg001ResidualEnglishTokens(value).filter((token) => !isConcatenatedTrigMathToken(token));
}
