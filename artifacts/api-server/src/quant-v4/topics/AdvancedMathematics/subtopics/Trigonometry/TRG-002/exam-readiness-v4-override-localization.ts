import { createHash } from "node:crypto";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import { generateTrg002V4CanonicalQuestion, isTrg002V4CanonicalOverride } from "./exam-readiness-v4-canonical";

type AnyQuestion = Record<string, any>;
function stableJson(value: unknown) { return JSON.stringify(value, (_k, v) => typeof v === "bigint" ? `bigint:${v}` : v); }
function sha256(value: unknown) { return createHash("sha256").update(stableJson(value), "utf8").digest("hex"); }

function localize005(canonical: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  const match = /roof of a (.+?) m high building\. From a point (.+?) m from/u.exec(canonical.stem);
  if (!match) throw new Error("TRG-002-QL-005 V4: cannot parse building height and distance.");
  const building = match[1];
  const distance = match[2];
  const k = Number(building);
  if (!Number.isFinite(k)) throw new Error("TRG-002-QL-005 V4: nonnumeric building height.");
  const answer = `${k}(√3−1)`;
  if (locale === "hi-IN") {
    return {
      stem: `एक ${building} m ऊँची इमारत की छत पर एक ऊर्ध्वाधर झंडे का डंडा लगा है। इमारत के आधार से ${distance} m दूर एक बिंदु से झंडे के डंडे के शीर्ष का उन्नयन कोण 30° है। झंडे के डंडे की सटीक ऊँचाई ज्ञात कीजिए।`,
      explanation: {
        keyRule: "पहले जमीन से झंडे के डंडे के शीर्ष तक की कुल ऊँचाई निकालें, फिर इमारत की ऊँचाई घटाएँ।",
        steps: [
          { title: "कुल ऊँचाई", body: `कुल ऊँचाई = ${distance}×tan30° = ${k}√3 m।` },
          { title: "उत्तर", body: `झंडे के डंडे की ऊँचाई = ${k}√3 − ${building} = ${answer} m।` },
        ],
        shortcut: "tangent से मिली ऊँचाई जमीन से शीर्ष तक की कुल ऊँचाई है; केवल डंडे की ऊँचाई के लिए इमारत की ऊँचाई घटाएँ।",
        traps: ["${k}√3 m को सीधे झंडे के डंडे की ऊँचाई न मानें; उसमें इमारत की ऊँचाई भी शामिल है।".replace("${k}", String(k))],
      },
    };
  }
  return {
    stem: `ਇੱਕ ${building} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਉੱਤੇ ਇੱਕ ਖੜ੍ਹਾ ਝੰਡੇ ਦਾ ਡੰਡਾ ਲੱਗਿਆ ਹੈ। ਇਮਾਰਤ ਦੇ ਅਧਾਰ ਤੋਂ ${distance} m ਦੂਰ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
    explanation: {
      keyRule: "ਪਹਿਲਾਂ ਜ਼ਮੀਨ ਤੋਂ ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ ਚੋਟੀ ਤੱਕ ਕੁੱਲ ਉਚਾਈ ਕੱਢੋ, ਫਿਰ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਘਟਾਓ।",
      steps: [
        { title: "ਕੁੱਲ ਉਚਾਈ", body: `ਕੁੱਲ ਉਚਾਈ = ${distance}×tan30° = ${k}√3 m।` },
        { title: "ਉੱਤਰ", body: `ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ ਉਚਾਈ = ${k}√3 − ${building} = ${answer} m।` },
      ],
      shortcut: "tangent ਨਾਲ ਮਿਲੀ ਉਚਾਈ ਜ਼ਮੀਨ ਤੋਂ ਚੋਟੀ ਤੱਕ ਦੀ ਕੁੱਲ ਉਚਾਈ ਹੈ; ਸਿਰਫ਼ ਡੰਡੇ ਦੀ ਉਚਾਈ ਲਈ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਘਟਾਓ।",
      traps: [`${k}√3 m ਨੂੰ ਸਿੱਧਾ ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ ਉਚਾਈ ਨਾ ਮੰਨੋ; ਇਸ ਵਿੱਚ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਵੀ ਸ਼ਾਮਲ ਹੈ।`],
    },
  };
}

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

function localize028(canonical: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  const match = /is (.+?) m longer than the height/u.exec(canonical.stem);
  if (!match) throw new Error("TRG-002-QL-028 V4: cannot parse shadow-height difference.");
  const difference = match[1];
  const k = Number(difference) / 2;
  if (!Number.isFinite(k)) throw new Error("TRG-002-QL-028 V4: nonnumeric shadow-height difference.");
  const answer = `${k}(√3+1)`;
  if (locale === "hi-IN") {
    return {
      stem: `जब सूर्य का उन्नयन कोण 30° है, तब एक ऊर्ध्वाधर खंभे की छाया उसकी ऊँचाई से ${difference} m अधिक लंबी है। खंभे की सटीक ऊँचाई ज्ञात कीजिए।`,
      explanation: {
        keyRule: "30° पर छाया की लंबाई h√3 होती है। प्रश्न में छाया और ऊँचाई का अंतर दिया गया है।",
        steps: [
          { title: "समीकरण", body: `h√3 − h = ${difference}, इसलिए h(√3−1) = ${difference}।` },
          { title: "उत्तर", body: `h = ${difference}/(√3−1) = ${answer} m।` },
        ],
        shortcut: "दिए गए अंतर को छाया या ऊँचाई न मानें; वह shadow − height है।",
        traps: ["${difference} m केवल छाया की लंबाई नहीं है।".replace("${difference}", difference)],
      },
    };
  }
  return {
    stem: `ਜਦੋਂ ਸੂਰਜ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ, ਤਦ ਇੱਕ ਖੜ੍ਹੇ ਖੰਭੇ ਦੀ ਛਾਂ ਉਸ ਦੀ ਉਚਾਈ ਨਾਲੋਂ ${difference} m ਵੱਧ ਲੰਬੀ ਹੈ। ਖੰਭੇ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
    explanation: {
      keyRule: "30° 'ਤੇ ਛਾਂ ਦੀ ਲੰਬਾਈ h√3 ਹੁੰਦੀ ਹੈ। ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਛਾਂ ਅਤੇ ਉਚਾਈ ਦਾ ਅੰਤਰ ਦਿੱਤਾ ਹੈ।",
      steps: [
        { title: "ਸਮੀਕਰਨ", body: `h√3 − h = ${difference}, ਇਸ ਲਈ h(√3−1) = ${difference}।` },
        { title: "ਉੱਤਰ", body: `h = ${difference}/(√3−1) = ${answer} m।` },
      ],
      shortcut: "ਦਿੱਤੇ ਅੰਤਰ ਨੂੰ ਛਾਂ ਜਾਂ ਉਚਾਈ ਨਾ ਮੰਨੋ; ਇਹ shadow − height ਹੈ।",
      traps: [`${difference} m ਸਿਰਫ਼ ਛਾਂ ਦੀ ਲੰਬਾਈ ਨਹੀਂ ਹੈ।`],
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

function localize087(canonical: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  const match = /Two buildings are (.+?) m and (.+?) m high/u.exec(canonical.stem);
  if (!match) throw new Error("TRG-002-QL-087 V4: cannot parse building heights.");
  const shorter = match[1];
  const taller = match[2];
  const shortN = Number(shorter);
  const tallN = Number(taller);
  if (!Number.isFinite(shortN) || !Number.isFinite(tallN)) throw new Error("TRG-002-QL-087 V4: nonnumeric building heights.");
  const rise = tallN - shortN;
  const k = rise / 3;
  const answer = `${k}√3`;
  if (locale === "hi-IN") {
    return {
      stem: `दो इमारतों की ऊँचाइयाँ ${shorter} m और ${taller} m हैं। छोटी इमारत की छत से बड़ी इमारत के शीर्ष का उन्नयन कोण 60° है। दोनों इमारतों के आधारों के बीच की सटीक क्षैतिज दूरी ज्ञात कीजिए।`,
      explanation: {
        keyRule: "छत के स्तर से बनने वाले समकोण त्रिभुज में लंबवत भुजा दोनों इमारतों की ऊँचाइयों का अंतर है।",
        steps: [
          { title: "ऊँचाई का अंतर", body: `${taller} − ${shorter} = ${rise} m।` },
          { title: "उत्तर", body: `tan60° = ${rise}/d, इसलिए d = ${rise}/√3 = ${answer} m।` },
        ],
        shortcut: "पूरी इमारत की ऊँचाई नहीं, केवल दोनों छतों का ऊँचाई-अंतर tangent में उपयोग करें।",
        traps: ["${taller} m या ${shorter} m को सीधे लंबवत भुजा न लें।".replace("${taller}", taller).replace("${shorter}", shorter)],
      },
    };
  }
  return {
    stem: `ਦੋ ਇਮਾਰਤਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ${shorter} m ਅਤੇ ${taller} m ਹਨ। ਛੋਟੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਵੱਡੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 60° ਹੈ। ਦੋਵੇਂ ਇਮਾਰਤਾਂ ਦੇ ਅਧਾਰਾਂ ਵਿਚਕਾਰ ਸਟੀਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`,
    explanation: {
      keyRule: "ਛੱਤ ਦੇ ਪੱਧਰ 'ਤੇ ਬਣਦੇ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀ ਲੰਬ ਭੁਜਾ ਦੋਵੇਂ ਇਮਾਰਤਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ ਹੈ।",
      steps: [
        { title: "ਉਚਾਈ ਦਾ ਅੰਤਰ", body: `${taller} − ${shorter} = ${rise} m।` },
        { title: "ਉੱਤਰ", body: `tan60° = ${rise}/d, ਇਸ ਲਈ d = ${rise}/√3 = ${answer} m।` },
      ],
      shortcut: "ਪੂਰੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਨਹੀਂ, ਸਿਰਫ਼ ਦੋਵੇਂ ਛੱਤਾਂ ਦੀ ਉਚਾਈ ਦਾ ਅੰਤਰ tangent ਵਿੱਚ ਵਰਤੋ।",
      traps: [`${taller} m ਜਾਂ ${shorter} m ਨੂੰ ਸਿੱਧਾ ਲੰਬ ਭੁਜਾ ਨਾ ਮੰਨੋ।`],
    },
  };
}

export function generateLocalizedTrg002V4CanonicalOverride(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  if (!isTrg002V4CanonicalOverride(qlId)) throw new Error(`${qlId}: not a V4 canonical override.`);
  const canonical: AnyQuestion = generateTrg002V4CanonicalQuestion(qlId, seed);
  const localized = qlId === "TRG-002-QL-005" ? localize005(canonical, locale)
    : qlId === "TRG-002-QL-027" ? localize027(canonical, locale)
      : qlId === "TRG-002-QL-028" ? localize028(canonical, locale)
        : qlId === "TRG-002-QL-079" ? localize079(canonical, locale)
          : localize087(canonical, locale);
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
