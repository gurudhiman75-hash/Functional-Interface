import { createHash } from "node:crypto";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import { generateTrg002V4CanonicalQuestion, isTrg002V4CanonicalOverride } from "./exam-readiness-v4-canonical";

type AnyQuestion = Record<string, any>;
function stableJson(value: unknown) { return JSON.stringify(value, (_k, v) => typeof v === "bigint" ? `bigint:${v}` : v); }
function sha256(value: unknown) { return createHash("sha256").update(stableJson(value), "utf8").digest("hex"); }

function localize027(canonical: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  const match = /shadows of a vertical pole is (.+?) m\./u.exec(canonical.stem);
  if (!match) throw new Error("TRG-002-QL-027 V4: cannot parse shadow difference.");
  const difference = match[1];
  const half = Number(difference) / 2;
  if (!Number.isFinite(half)) throw new Error("TRG-002-QL-027 V4: nonnumeric shadow difference.");
  if (locale === "hi-IN") {
    return {
      stem: `दो अलग-अलग समय पर सूर्य के उन्नयन कोण 30° और 60° हैं। एक ऊर्ध्वाधर खंभे की दोनों छायाओं की लंबाइयों का अंतर ${difference} m है। खंभे की सटीक ऊँचाई ज्ञात कीजिए।`,
      explanation: {
        keyRule: "एक ही खंभे के लिए छाया की लंबाई h cotθ होती है। दोनों छायाओं का अंतर उपयोग करें।",
        steps: [
          { title: "समाधान", body: "30° पर छाया = h√3 और 60° पर छाया = h/√3।" },
          { title: "गणना", body: `इसलिए h√3 − h/√3 = ${difference}, अर्थात 2h/√3 = ${difference}।` },
          { title: "उत्तर", body: `अतः h = ${half}√3 m।` },
        ],
        shortcut: "30° और 60° वाली छायाओं का अंतर 2h/√3 होता है।",
        traps: ["दिया गया अंतर किसी एक छाया की लंबाई नहीं है।"],
      },
    };
  }
  return {
    stem: `ਦੋ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ 'ਤੇ ਸੂਰਜ ਦੇ ਉਚਾਣ ਕੋਣ 30° ਅਤੇ 60° ਹਨ। ਇੱਕ ਖੜ੍ਹੇ ਖੰਭੇ ਦੀਆਂ ਦੋ ਛਾਵਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਦਾ ਅੰਤਰ ${difference} m ਹੈ। ਖੰਭੇ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
    explanation: {
      keyRule: "ਇੱਕੋ ਖੰਭੇ ਲਈ ਛਾਂ ਦੀ ਲੰਬਾਈ h cotθ ਹੁੰਦੀ ਹੈ। ਦੋਵੇਂ ਛਾਵਾਂ ਦਾ ਅੰਤਰ ਵਰਤੋ।",
      steps: [
        { title: "ਹੱਲ", body: "30° 'ਤੇ ਛਾਂ = h√3 ਅਤੇ 60° 'ਤੇ ਛਾਂ = h/√3।" },
        { title: "ਗਣਨਾ", body: `ਇਸ ਲਈ h√3 − h/√3 = ${difference}, ਅਰਥਾਤ 2h/√3 = ${difference}।` },
        { title: "ਉੱਤਰ", body: `ਇਸ ਲਈ h = ${half}√3 m।` },
      ],
      shortcut: "30° ਅਤੇ 60° ਵਾਲੀਆਂ ਛਾਵਾਂ ਦਾ ਅੰਤਰ 2h/√3 ਹੁੰਦਾ ਹੈ।",
      traps: ["ਦਿੱਤਾ ਅੰਤਰ ਕਿਸੇ ਇੱਕ ਛਾਂ ਦੀ ਲੰਬਾਈ ਨਹੀਂ ਹੈ।"],
    },
  };
}

function localize079(canonical: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  const match = /road (.+?) m wide/u.exec(canonical.stem);
  if (!match) throw new Error("TRG-002-QL-079 V4: cannot parse road width.");
  const width = match[1];
  const near = Number(width) / 4;
  if (!Number.isFinite(near)) throw new Error("TRG-002-QL-079 V4: nonnumeric road width.");
  if (locale === "hi-IN") {
    return {
      stem: `एक सीधी ${width} m चौड़ी सड़क के दोनों किनारों पर समान ऊँचाई के दो खंभे खड़े हैं। उनके बीच सड़क पर स्थित एक बिंदु से खंभों के शीर्षों के उन्नयन कोण क्रमशः 60° और 30° हैं। प्रत्येक खंभे की ऊँचाई ज्ञात कीजिए।`,
      explanation: {
        keyRule: "दोनों खंभों की ऊँचाई समान है और अवलोकन बिंदु से दोनों आधारों की दूरियों का योग सड़क की चौड़ाई है।",
        steps: [
          { title: "समाधान", body: "60° वाले खंभे की दूरी x मानें। तब समान ऊँचाई h = x√3 होगी।" },
          { title: "गणना", body: `दूसरे खंभे की दूरी ${width}−x है, इसलिए h = (${width}−x)/√3। दोनों बराबर करने पर 3x = ${width}−x, अतः x = ${near} m।` },
          { title: "उत्तर", body: `अतः प्रत्येक खंभे की ऊँचाई = ${near}√3 m।` },
        ],
        shortcut: "60° वाले खंभे तक दूरी सड़क की कुल चौड़ाई का एक-चौथाई होती है।",
        traps: ["दोनों कोण अलग हैं, इसलिए अवलोकन बिंदु सड़क के मध्य में नहीं है।"],
      },
    };
  }
  return {
    stem: `ਇੱਕ ਸਿੱਧੀ ${width} m ਚੌੜੀ ਸੜਕ ਦੇ ਦੋਵੇਂ ਕਿਨਾਰਿਆਂ 'ਤੇ ਬਰਾਬਰ ਉਚਾਈ ਦੇ ਦੋ ਖੰਭੇ ਖੜ੍ਹੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਸੜਕ ਉੱਤੇ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਖੰਭਿਆਂ ਦੀਆਂ ਚੋਟੀਆਂ ਦੇ ਉਚਾਣ ਕੋਣ ਕ੍ਰਮਵਾਰ 60° ਅਤੇ 30° ਹਨ। ਹਰ ਖੰਭੇ ਦੀ ਉਚਾਈ ਕੱਢੋ।`,
    explanation: {
      keyRule: "ਦੋਵੇਂ ਖੰਭਿਆਂ ਦੀ ਉਚਾਈ ਬਰਾਬਰ ਹੈ ਅਤੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ਦੋਵੇਂ ਅਧਾਰਾਂ ਤੱਕ ਦੀਆਂ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਸੜਕ ਦੀ ਚੌੜਾਈ ਹੈ।",
      steps: [
        { title: "ਹੱਲ", body: "60° ਵਾਲੇ ਖੰਭੇ ਤੱਕ ਦੂਰੀ x ਮੰਨੋ। ਤਦ ਬਰਾਬਰ ਉਚਾਈ h = x√3 ਹੋਵੇਗੀ।" },
        { title: "ਗਣਨਾ", body: `ਦੂਜੇ ਖੰਭੇ ਤੱਕ ਦੂਰੀ ${width}−x ਹੈ, ਇਸ ਲਈ h = (${width}−x)/√3। ਦੋਵੇਂ ਬਰਾਬਰ ਕਰਨ 'ਤੇ 3x = ${width}−x, ਇਸ ਲਈ x = ${near} m।` },
        { title: "ਉੱਤਰ", body: `ਇਸ ਲਈ ਹਰ ਖੰਭੇ ਦੀ ਉਚਾਈ = ${near}√3 m।` },
      ],
      shortcut: "60° ਵਾਲੇ ਖੰਭੇ ਤੱਕ ਦੂਰੀ ਸੜਕ ਦੀ ਕੁੱਲ ਚੌੜਾਈ ਦਾ ਇੱਕ-ਚੌਥਾਈ ਹੁੰਦੀ ਹੈ।",
      traps: ["ਦੋਵੇਂ ਕੋਣ ਵੱਖਰੇ ਹਨ, ਇਸ ਲਈ ਨਿਰੀਖਣ ਬਿੰਦੂ ਸੜਕ ਦੇ ਵਿਚਕਾਰ ਨਹੀਂ ਹੈ।"],
    },
  };
}

export function generateLocalizedTrg002V4CanonicalOverride(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  if (!isTrg002V4CanonicalOverride(qlId)) throw new Error(`${qlId}: not a V4 canonical override.`);
  const canonical: AnyQuestion = generateTrg002V4CanonicalQuestion(qlId, seed);
  const localized = qlId === "TRG-002-QL-027" ? localize027(canonical, locale) : localize079(canonical, locale);
  const fingerprint = sha256({ qlId, seed, locale, stem: localized.stem, explanation: localized.explanation, canonicalState: canonical.canonicalSpatialState ?? canonical.state });
  return {
    ...canonical,
    stem: localized.stem,
    explanation: localized.explanation,
    localizationMetadata: { version: "TRG002_EXAM_READINESS_V4", authority: "V4_CANONICAL_OVERRIDE", locale, humanLanguageReviewRequired: true },
    localizationProof: { v4CanonicalOverride: true, canonicalSemanticsPreserved: true, localizationFingerprint: fingerprint, multilingualFreezeGranted: false },
    humanReviewStatus: "PENDING" as const,
    frozen: false,
    freezeEligible: false,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
  };
}
