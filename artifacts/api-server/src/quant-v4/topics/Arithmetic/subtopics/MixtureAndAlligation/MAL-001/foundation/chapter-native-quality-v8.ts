import { applyMal001NativeQualityV7 } from "./chapter-native-quality-v7";
import type { Mal001LocalizedLanguage as Lang } from "./chapter-multilingual-question-studio-v1";
import { MAL_CP006_WAVE02_OBJECT_CONTEXTS } from "./cp006-object-contexts";
import {
  formatRational,
  multiplyRational,
  divideRational,
  rational,
} from "./rational";

// Native stems are authored from source givens, never from answer text.
type Rule = { ql: number; pattern: RegExp; hi: string; pa: string };
const rules: Rule[] = [];
function normaliseReplacementStem(stem: string): string {
  return stem
    .replace(
      /^(?:During an equal-replacement process, |For a repeated-replacement calculation, |In a competitive-exam (?:vessel|mixture) problem, |A student records the following operation: |Consider this repeated remove-and-refill process: |A storekeeper records this repeated operation: |A technician performs the same replacement repeatedly\. )/i,
      "",
    )
    .replace(/^a /, "A ")
    .replace(/\b(?:drum|cask|can|container|tank)\b/g, "vessel");
}
function concentrationStem(
  q: Record<string, any>,
  hi: boolean,
  tr: (s: string) => string,
): string | undefined {
  const s = q.exactState ?? q.parameters?.exactState;
  if (!s) return;
  const fmt = (k: string) => formatRational(s[k]);
  const pct = (k: string) =>
    formatRational(multiplyRational(s[k], rational(100))) + "%";
  // Context names can be revised editorially; read the current learner stem,
  // rather than stale labels such as exactState.givenComponent.
  const material =
    /\b(syrup concentrate|fruit concentrate|concentrate|alcohol|acid|salt)\b/i
      .exec(q.stem)?.[1]
      ?.toLowerCase();
  const x = material ? tr(material) : "";
  switch (q.representationVariant ?? q.parameters?.representationVariant) {
    case "TRACKED_COMPONENT_AMOUNT":
    case "OTHER_COMPONENT_AMOUNT": {
      if (!x) return;
      const requested = tr(
        (q.representationVariant ?? q.parameters?.representationVariant) ===
          "OTHER_COMPONENT_AMOUNT"
          ? "water"
          : material!,
      );
      return hi
        ? `${fmt("total")} लीटर घोल में ${x} का हिस्सा ${pct("trackedRate")} है और शेष पानी है। इसमें ${requested} की मात्रा कितनी है?`
        : `${fmt("total")} ਲੀਟਰ ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਹਿੱਸਾ ${pct("trackedRate")} ਹੈ ਅਤੇ ਬਾਕੀ ਪਾਣੀ ਹੈ। ਇਸ ਵਿੱਚ ${requested} ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?`;
    }
    case "TRACKED_COMPONENT_PERCENT":
      if (!x) return;
      return hi
        ? `${fmt("total")} लीटर घोल में ${fmt("trackedAmount")} लीटर ${x} और शेष पानी है। घोल में ${x} का प्रतिशत कितना है?`
        : `${fmt("total")} ਲੀਟਰ ਘੋਲ ਵਿੱਚ ${fmt("trackedAmount")} ਲੀਟਰ ${x} ਅਤੇ ਬਾਕੀ ਪਾਣੀ ਹੈ। ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`;
    case "TOTAL_FROM_TRACKED_COMPONENT":
    case "TOTAL_FROM_OTHER_COMPONENT": {
      if (!x) return;
      const given =
        (q.representationVariant ?? q.parameters?.representationVariant) ===
        "TOTAL_FROM_OTHER_COMPONENT"
          ? hi
            ? "पानी"
            : "ਪਾਣੀ"
          : x;
      return hi
        ? `एक घोल में ${x} का हिस्सा ${pct("trackedRate")} है और शेष पानी है। यदि इसमें ${fmt("givenAmount")} लीटर ${given} है, तो घोल का कुल आयतन कितना है?`
        : `ਇੱਕ ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਹਿੱਸਾ ${pct("trackedRate")} ਹੈ ਅਤੇ ਬਾਕੀ ਪਾਣੀ ਹੈ। ਜੇ ਇਸ ਵਿੱਚ ${fmt("givenAmount")} ਲੀਟਰ ${given} ਹੈ, ਤਾਂ ਘੋਲ ਦਾ ਕੁੱਲ ਆਇਤਨ ਕਿੰਨਾ ਹੈ?`;
    }
    case "SOLVENT_ADDED":
    case "PURE_SOLUTE_ADDED": {
      if (!x) return;
      const add =
        (q.representationVariant ?? q.parameters?.representationVariant) ===
        "SOLVENT_ADDED"
          ? hi
            ? "पानी"
            : "ਪਾਣੀ"
          : hi
            ? `शुद्ध ${x}`
            : `ਸ਼ੁੱਧ ${x}`;
      return hi
        ? `${fmt("initialTotal")} लीटर घोल में ${x} का हिस्सा ${pct("initialRate")} है और शेष पानी है। ${x} का प्रतिशत ${pct("targetRate")} करने के लिए कितना ${add} मिलाना चाहिए?`
        : `${fmt("initialTotal")} ਲੀਟਰ ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਹਿੱਸਾ ${pct("initialRate")} ਹੈ ਅਤੇ ਬਾਕੀ ਪਾਣੀ ਹੈ। ${x} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ${pct("targetRate")} ਕਰਨ ਲਈ ਕਿੰਨਾ ${add} ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?`;
    }
    case "EVAPORATED_AMOUNT":
    case "FINAL_TOTAL_AFTER_EVAPORATION": {
      if (!x) return;
      const ask =
        (q.representationVariant ?? q.parameters?.representationVariant) ===
        "EVAPORATED_AMOUNT"
          ? hi
            ? "कितने लीटर पानी का वाष्पीकरण होगा?"
            : "ਕਿੰਨੇ ਲੀਟਰ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਹੋਵੇਗਾ?"
          : hi
            ? "घोल का अंतिम आयतन कितना होगा?"
            : "ਘੋਲ ਦਾ ਅੰਤਿਮ ਆਇਤਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?";
      return hi
        ? `${fmt("initialTotal")} लीटर घोल में ${x} का हिस्सा ${pct("initialRate")} है। केवल पानी का वाष्पीकरण होने से यह ${pct("targetRate")} हो जाता है। ${ask}`
        : `${fmt("initialTotal")} ਲੀਟਰ ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਹਿੱਸਾ ${pct("initialRate")} ਹੈ। ਸਿਰਫ਼ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਹੋਣ ਨਾਲ ਇਹ ${pct("targetRate")} ਹੋ ਜਾਂਦਾ ਹੈ। ${ask}`;
    }
    case "FINAL_CONCENTRATION_AFTER_SOLVENT_ADDITION":
    case "FINAL_CONCENTRATION_AFTER_SOLVENT_EVAPORATION": {
      if (!x) return;
      const action =
        s.direction === "ADD"
          ? hi
            ? `${fmt("solventChange")} लीटर पानी मिलाया जाता है`
            : `${fmt("solventChange")} ਲੀਟਰ ਪਾਣੀ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ`
          : hi
            ? `केवल ${fmt("solventChange")} लीटर पानी का वाष्पीकरण होता है`
            : `ਸਿਰਫ਼ ${fmt("solventChange")} ਲੀਟਰ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਹੁੰਦਾ ਹੈ`;
      return hi
        ? `${fmt("initialTotal")} लीटर घोल में ${x} का हिस्सा ${pct("initialRate")} है। इसमें ${action}। घोल में ${x} का अंतिम प्रतिशत कितना होगा?`
        : `${fmt("initialTotal")} ਲੀਟਰ ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਹਿੱਸਾ ${pct("initialRate")} ਹੈ। ਇਸ ਵਿੱਚ ${action}। ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਅੰਤਿਮ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    }
    case "INITIAL_TOTAL_BEFORE_EVAPORATION":
      if (!x) return;
      return hi
        ? `एक घोल में ${x} का हिस्सा ${pct("initialRate")} है। केवल ${fmt("evaporated")} लीटर पानी का वाष्पीकरण होने पर यह ${pct("targetRate")} हो जाता है। घोल का प्रारंभिक आयतन कितना था?`
        : `ਇੱਕ ਘੋਲ ਵਿੱਚ ${x} ਦਾ ਹਿੱਸਾ ${pct("initialRate")} ਹੈ। ਸਿਰਫ਼ ${fmt("evaporated")} ਲੀਟਰ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਹੋਣ ਉੱਤੇ ਇਹ ${pct("targetRate")} ਹੋ ਜਾਂਦਾ ਹੈ। ਘੋਲ ਦਾ ਸ਼ੁਰੂਆਤੀ ਆਇਤਨ ਕਿੰਨਾ ਸੀ?`;
    case "FINAL_MASS":
    case "MOISTURE_LOST": {
      const ask =
        (q.representationVariant ?? q.parameters?.representationVariant) ===
        "MOISTURE_LOST"
          ? hi
            ? "कितनी नमी कम हुई?"
            : "ਕਿੰਨੀ ਨਮੀ ਘਟੀ?"
          : hi
            ? `सूखने के बाद ${tr(s.finalMaterial)} का द्रव्यमान कितना है?`
            : `ਸੁੱਕਣ ਤੋਂ ਬਾਅਦ ${tr(s.finalMaterial)} ਦਾ ਪੁੰਜ ਕਿੰਨਾ ਹੈ?`;
      return hi
        ? `${fmt("initialMass")} किग्रा ${tr(s.material)} में ${pct("initialMoisture")} नमी है। सुखाने पर केवल नमी कम होती है और अंतिम नमी ${pct("finalMoisture")} रह जाती है। ${ask}`
        : `${fmt("initialMass")} ਕਿਗ੍ਰਾ ${tr(s.material)} ਵਿੱਚ ${pct("initialMoisture")} ਨਮੀ ਹੈ। ਸੁਕਾਉਣ ਉੱਤੇ ਸਿਰਫ਼ ਨਮੀ ਘਟਦੀ ਹੈ ਅਤੇ ਅੰਤਿਮ ਨਮੀ ${pct("finalMoisture")} ਰਹਿ ਜਾਂਦੀ ਹੈ। ${ask}`;
    }
    case "INITIAL_MASS":
      return hi
        ? `सुखाने के बाद ${fmt("finalMass")} किग्रा ${tr(s.finalMaterial)} में ${pct("finalMoisture")} नमी है। मूल ${tr(s.material)} में ${pct("initialMoisture")} नमी थी। यदि केवल नमी कम हुई हो, तो प्रारंभिक द्रव्यमान कितना था?`
        : `ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ ${fmt("finalMass")} ਕਿਗ੍ਰਾ ${tr(s.finalMaterial)} ਵਿੱਚ ${pct("finalMoisture")} ਨਮੀ ਹੈ। ਮੂਲ ${tr(s.material)} ਵਿੱਚ ${pct("initialMoisture")} ਨਮੀ ਸੀ। ਜੇ ਸਿਰਫ਼ ਨਮੀ ਘਟੀ ਹੋਵੇ, ਤਾਂ ਸ਼ੁਰੂਆਤੀ ਪੁੰਜ ਕਿੰਨਾ ਸੀ?`;
  }
}

export function applyMal001NativeQualityV8<T extends Record<string, any>>(
  source: T,
  language: Lang,
): T {
  const ql = Number(String(source.questionLanguageId).slice(-3));
  const prepared =
    ql >= 29 && ql <= 37
      ? { ...source, stem: normaliseReplacementStem(source.stem) }
      : source;
  const localized = applyMal001NativeQualityV7(prepared, language) as T & {
    stem: string;
    traceability: Record<string, any>;
  };
  const tr = (stem: string) =>
    nativeNouns[stem.toLowerCase()]?.[language === "hi" ? 0 : 1] ??
    applyMal001NativeQualityV7(
      { stem, answer: "", options: [], questionLanguageId: "FRAGMENT" },
      language,
    ).stem;
  let authored = localized.traceability.nativeStemAuthored;
  let ruleId: string | undefined;
  if (ql >= 38 && ql <= 47) {
    const stem = concentrationStem(source, language === "hi", tr);
    if (stem) {
      localized.stem = stem;
      authored = true;
      ruleId = `CP004:${source.representationVariant ?? source.parameters?.representationVariant}`;
    }
  }
  if (ql >= 61 && ql <= 67) {
    const stem = vesselStem(source, language === "hi", tr);
    if (stem) {
      localized.stem = stem;
      authored = true;
      ruleId = `CP006:${ql}:${source.sourceVariantId ?? "BASE"}`;
    }
  }
  for (const [index, rule] of rules.entries()) {
    if (rule.ql !== ql) continue;
    const match = rule.pattern.exec(
      prepared.stem.replace(/^Vessel C is initially empty\. /, ""),
    );
    if (!match) continue;
    localized.stem = (language === "hi" ? rule.hi : rule.pa).replace(
      /\$(\d+)/g,
      (_, i) => tr(match[Number(i)]!),
    );
    // Keep the added source premise even for forms that place C later.
    if (source.stem.startsWith("Vessel C is initially empty. "))
      localized.stem =
        (language === "hi"
          ? "पात्र C शुरू में खाली है। "
          : "ਭਾਂਡਾ C ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ") + localized.stem;
    authored = true;
    ruleId = `MAL-V8:${ql}:${index}`;
    break;
  }
  const residualNouns: Record<string, readonly [string, string]> = {
    red: ["लाल", "ਲਾਲ"],
    nilgiri: ["नीलगिरि", "ਨੀਲਗਿਰੀ"],
    oats: ["जई", "ਜਵੀ"],
    olive: ["जैतून", "ਜੈਤੂਨ"],
  };
  localized.stem = localized.stem.replace(
    /\b(?:Red|Nilgiri|oats|olive)\b/gi,
    (word: string) =>
      residualNouns[word.toLowerCase()]![language === "hi" ? 0 : 1],
  );
  return {
    ...localized,
    traceability: {
      ...localized.traceability,
      nativeQualityRevision: "MAL-NATIVE-QUALITY-V8",
      nativeStemAuthored: authored,
      nativeStemRuleId:
        ruleId ?? (authored ? "V7_AUTHORED" : "LEXICAL_FALLBACK"),
    },
  } as T;
}

rules.push(
  {
    ql: 29,
    pattern:
      /^A vessel contains (.+?) of (.+?) in a total volume of (.+?)\. Each time, (.+?) of the well-mixed liquid are removed and replaced with (.+?)\. After (.+?) such operations, how much of the original (.+?) remains\?$/,
    hi: "$3 कुल आयतन वाले पात्र में शुरू में $1 $2 है। हर बार अच्छी तरह मिले द्रव में से $4 निकालकर उतना ही $5 भरा जाता है। $6 क्रियाओं के बाद मूल $7 की कितनी मात्रा बचेगी?",
    pa: "$3 ਕੁੱਲ ਆਇਤਨ ਵਾਲੇ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ $4 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $5 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $6 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ $7 ਦੀ ਕਿੰਨੀ ਮਾਤਰਾ ਬਚੇਗੀ?",
  },
  {
    ql: 33,
    pattern:
      /^A vessel of volume (.+?) contains (.+?) of (.+?)\. Successive well-mixed samples of (.+?) are removed, and the vessel is restored with (.+?) after every removal\. How much of the original (.+?) remains\?$/,
    hi: "$1 कुल आयतन वाले पात्र में $2 $3 है। अच्छी तरह मिले मिश्रण में से क्रमशः $4 निकाले जाते हैं। हर बार निकालने के बाद उतनी ही मात्रा में $5 भरकर अच्छी तरह मिलाया जाता है। अंत में मूल $6 की कितनी मात्रा बचेगी?",
    pa: "$1 ਕੁੱਲ ਆਇਤਨ ਵਾਲੇ ਭਾਂਡੇ ਵਿੱਚ $2 $3 ਹੈ। ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ਕ੍ਰਮਵਾਰ $4 ਕੱਢੇ ਜਾਂਦੇ ਹਨ। ਹਰ ਵਾਰ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਉੱਨੀ ਹੀ ਮਾਤਰਾ ਵਿੱਚ $5 ਭਰ ਕੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ ਮੂਲ $6 ਦੀ ਕਿੰਨੀ ਮਾਤਰਾ ਬਚੇਗੀ?",
  },
  {
    ql: 35,
    pattern:
      /^A vessel initially contains (.+?) of (.+?)\. Each time, (.+?) are drawn out and replaced with (.+?)\. After (.+?) replacements, what is the final ratio of (.+?)\?$/,
    hi: "एक पात्र में शुरू में $1 $2 है। हर बार अच्छी तरह मिले द्रव में से $3 निकालकर उतना ही $4 भरा जाता है। $5 प्रतिस्थापनों के बाद $6 का अंतिम अनुपात क्या होगा?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ $3 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $4 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $5 ਬਦਲੀਆਂ ਤੋਂ ਬਾਅਦ $6 ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
  },
  {
    ql: 37,
    pattern:
      /^A (.+?)-litre vessel is full of (.+?)\. Every time, (.+?) are removed and replaced with (.+?)\. After at least how many operations will the quantity of (.+?) exceed the remaining (.+?)\?$/,
    hi: "$1 लीटर का पात्र $2 से भरा है। हर बार अच्छी तरह मिले द्रव में से $3 निकालकर उतना ही $4 भरा जाता है। कम-से-कम कितनी क्रियाओं के बाद $5 की मात्रा शेष $6 से अधिक हो जाएगी?",
    pa: "$1 ਲੀਟਰ ਦਾ ਭਾਂਡਾ $2 ਨਾਲ ਭਰਿਆ ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ $3 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $4 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀਆਂ ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ $5 ਦੀ ਮਾਤਰਾ ਬਾਕੀ $6 ਤੋਂ ਵੱਧ ਹੋ ਜਾਵੇਗੀ?",
  },
  {
    ql: 37,
    pattern:
      /^From a vessel holding (.+?) of (.+?), (.+?) are repeatedly replaced by (.+?)\. Find the first operation after which the original (.+?) falls below (.+?)\?$/,
    hi: "एक पात्र में शुरू में $1 $2 है। हर बार अच्छी तरह मिले द्रव में से $3 निकालकर उतना ही $4 भरा जाता है। पहली बार किस क्रिया के बाद मूल $5 की मात्रा $6 से कम होगी?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ $3 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $4 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੀ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਮੂਲ $5 ਦੀ ਮਾਤਰਾ $6 ਤੋਂ ਘੱਟ ਹੋਵੇਗੀ?",
  },
  {
    ql: 53,
    pattern:
      /^(.+?) of an? (.+?)-water mixture is water\. The mixture is sold at the cost price of pure (.+?)\. What is the profit percentage\?$/,
    hi: "एक $2-पानी मिश्रण में पानी का हिस्सा $1 है। पानी निःशुल्क है। मिश्रण को शुद्ध $3 की प्रति इकाई लागत पर बेचा जाता है। लाभ प्रतिशत कितना है?",
    pa: "ਇੱਕ $2-ਪਾਣੀ ਮਿਸ਼ਰਣ ਵਿੱਚ ਪਾਣੀ ਦਾ ਹਿੱਸਾ $1 ਹੈ। ਪਾਣੀ ਮੁਫ਼ਤ ਹੈ। ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ $3 ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ਉੱਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?",
  },
  {
    ql: 59,
    pattern:
      /^An? (.+?) mixes (.+?) costing (.+?) per (.+?) and (.+?) costing (.+?) per (.+?) in the ratio (.+?)\. At what rate should the mixture be sold to earn (.+?) profit\?$/,
    hi: "एक विक्रेता $2 और $5 को $8 के अनुपात में मिलाता है। इनकी लागत क्रमशः $3 प्रति $4 और $6 प्रति $7 है। $9 लाभ कमाने के लिए मिश्रण की बिक्री दर कितनी होनी चाहिए?",
    pa: "ਇੱਕ ਵਿਕਰੇਤਾ $2 ਅਤੇ $5 ਨੂੰ $8 ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਂਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਦੀ ਲਾਗਤ ਕ੍ਰਮਵਾਰ $3 ਪ੍ਰਤੀ $4 ਅਤੇ $6 ਪ੍ਰਤੀ $7 ਹੈ। $9 ਲਾਭ ਕਮਾਉਣ ਲਈ ਮਿਸ਼ਰਣ ਦੀ ਵਿਕਰੀ ਦਰ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
  },
  {
    ql: 60,
    pattern:
      /^An? (.+?) buys (.+?) of pure (.+?) at (.+?) per (.+?)\. He adds water equal to (.+?) of the original quantity and sells the mixture at a price (.+?) above the cost price per unit\. What is his total profit\?$/,
    hi: "एक विक्रेता $2 शुद्ध $3 को $4 प्रति $5 की दर से खरीदता है। वह मूल मात्रा का $6 निःशुल्क पानी मिलाता है और मिश्रण को प्रति इकाई लागत से $7 अधिक दर पर बेचता है। उसका कुल लाभ कितना है?",
    pa: "ਇੱਕ ਵਿਕਰੇਤਾ $2 ਸ਼ੁੱਧ $3 ਨੂੰ $4 ਪ੍ਰਤੀ $5 ਦੀ ਦਰ ਨਾਲ ਖਰੀਦਦਾ ਹੈ। ਉਹ ਮੂਲ ਮਾਤਰਾ ਦਾ $6 ਮੁਫ਼ਤ ਪਾਣੀ ਮਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਮਿਸ਼ਰਣ ਨੂੰ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ਤੋਂ $7 ਵੱਧ ਦਰ ਉੱਤੇ ਵੇਚਦਾ ਹੈ। ਉਸ ਦਾ ਕੁੱਲ ਲਾਭ ਕਿੰਨਾ ਹੈ?",
  },
  {
    ql: 60,
    pattern:
      /^An? (.+?) has (.+?) of pure (.+?) bought at (.+?) per (.+?)\. After adding free water equal to (.+?) of the pure quantity, the mixture is sold at (.+?) above the cost price per unit\. What profit does he make in all\?$/,
    hi: "एक विक्रेता के पास $2 शुद्ध $3 है, जिसकी लागत $4 प्रति $5 है। वह शुद्ध मात्रा का $6 निःशुल्क पानी मिलाकर मिश्रण को प्रति इकाई लागत से $7 अधिक दर पर बेचता है। उसका कुल लाभ कितना है?",
    pa: "ਇੱਕ ਵਿਕਰੇਤਾ ਕੋਲ $2 ਸ਼ੁੱਧ $3 ਹੈ, ਜਿਸ ਦੀ ਲਾਗਤ $4 ਪ੍ਰਤੀ $5 ਹੈ। ਉਹ ਸ਼ੁੱਧ ਮਾਤਰਾ ਦਾ $6 ਮੁਫ਼ਤ ਪਾਣੀ ਮਿਲਾ ਕੇ ਮਿਸ਼ਰਣ ਨੂੰ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ਤੋਂ $7 ਵੱਧ ਦਰ ਉੱਤੇ ਵੇਚਦਾ ਹੈ। ਉਸ ਦਾ ਕੁੱਲ ਲਾਭ ਕਿੰਨਾ ਹੈ?",
  },
);

function vesselStem(
  q: Record<string, any>,
  hi: boolean,
  tr: (s: string) => string,
): string | undefined {
  const ql = Number(q.questionLanguageId.slice(-3));
  const key = String(q.stateKey);
  const rat = (v: string) => {
    const [n, d = "1"] = v.split("/");
    return rational(BigInt(n!), BigInt(d));
  };
  const f = (v: string) => formatRational(rat(v));
  const percent = (amount: string, volume: string) =>
    formatRational(
      multiplyRational(divideRational(rat(amount), rat(volume)), rational(100)),
    ) + "%";
  const context = MAL_CP006_WAVE02_OBJECT_CONTEXTS.find(
    (c) => c.id === q.sourceObjectContextId,
  );
  if (
    ql === 66 ||
    ql === 67 ||
    q.sourceVariantId === "THREE_LEG_ALTERNATING_FORWARD"
  ) {
    if (!context) return;
    const p = tr(context.primary),
      o = tr(context.secondary),
      pi = tr(context.primaryInitial),
      oi = tr(context.secondaryInitial);
    const fields = key.split(":");
    const volume = f(fields[0]!);
    if (ql === 61) {
      if (fields.length !== 4) return;
      const [, a, b, c] = fields.map(f);
      return hi
        ? `पात्र A में ${volume} लीटर ${pi} और पात्र B में ${volume} लीटर ${oi} है। पहले A से B में ${a} लीटर भेजे जाते हैं। B को अच्छी तरह मिलाकर उसमें से ${b} लीटर A में लौटाए जाते हैं। फिर A को अच्छी तरह मिलाकर उसमें से ${c} लीटर B में भेजे जाते हैं। अंत में B में ${p} : ${o} का अनुपात क्या होगा?`
        : `ਭਾਂਡੇ A ਵਿੱਚ ${volume} ਲੀਟਰ ${pi} ਅਤੇ ਭਾਂਡੇ B ਵਿੱਚ ${volume} ਲੀਟਰ ${oi} ਹੈ। ਪਹਿਲਾਂ A ਤੋਂ B ਵਿੱਚ ${a} ਲੀਟਰ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। B ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾ ਕੇ ਉਸ ਵਿੱਚੋਂ ${b} ਲੀਟਰ A ਵਿੱਚ ਵਾਪਸ ਪਾਏ ਜਾਂਦੇ ਹਨ। ਫਿਰ A ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾ ਕੇ ਉਸ ਵਿੱਚੋਂ ${c} ਲੀਟਰ B ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ਅੰਤ ਵਿੱਚ B ਵਿੱਚ ${p} : ${o} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?`;
    }
    const ratio = q.stem.match(/\b\d+\s*:\s*\d+\b/)?.[0];
    if (!ratio) return;
    if (ql === 66) {
      const initial = hi
        ? `पात्र A में ${volume} लीटर ${pi} और पात्र B में ${volume} लीटर ${oi} है।`
        : `ਭਾਂਡੇ A ਵਿੱਚ ${volume} ਲੀਟਰ ${pi} ਅਤੇ ਭਾਂਡੇ B ਵਿੱਚ ${volume} ਲੀਟਰ ${oi} ਹੈ।`;
      if (q.sourceVariantId === "ASYMMETRIC_INVERSE_RETURN") {
        // fields[2] is the solved return quantity: deliberately never read it.
        const first = f(fields[1]!);
        return (
          initial +
          (hi
            ? ` A से B में ${first} लीटर भेजकर B को अच्छी तरह मिलाया जाता है। फिर B में से कुछ मिश्रण A में लौटाया जाता है। यदि अंत में A में ${p} : ${o} = ${ratio} हो, तो कितने लीटर मिश्रण लौटाया गया?`
            : ` A ਤੋਂ B ਵਿੱਚ ${first} ਲੀਟਰ ਭੇਜ ਕੇ B ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਫਿਰ B ਵਿੱਚੋਂ ਕੁਝ ਮਿਸ਼ਰਣ A ਵਿੱਚ ਵਾਪਸ ਪਾਇਆ ਜਾਂਦਾ ਹੈ। ਜੇ ਅੰਤ ਵਿੱਚ A ਵਿੱਚ ${p} : ${o} = ${ratio} ਹੋਵੇ, ਤਾਂ ਕਿੰਨੇ ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਾਪਸ ਪਾਇਆ ਗਿਆ?`)
        );
      }
      // fields[1] is the unknown common transfer: only volume and source ratio are givens.
      return (
        initial +
        (hi
          ? ` पहले A से B में कुछ द्रव भेजा जाता है। B को अच्छी तरह मिलाकर उतनी ही मात्रा A में लौटाई जाती है। यदि अंत में A में ${p} : ${o} = ${ratio} हो, तो हर बार कितने लीटर द्रव भेजा गया?`
          : ` ਪਹਿਲਾਂ A ਤੋਂ B ਵਿੱਚ ਕੁਝ ਤਰਲ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। B ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾ ਕੇ ਉੱਨੀ ਹੀ ਮਾਤਰਾ A ਵਿੱਚ ਵਾਪਸ ਪਾਈ ਜਾਂਦੀ ਹੈ। ਜੇ ਅੰਤ ਵਿੱਚ A ਵਿੱਚ ${p} : ${o} = ${ratio} ਹੋਵੇ, ਤਾਂ ਹਰ ਵਾਰ ਕਿੰਨੇ ਲੀਟਰ ਤਰਲ ਭੇਜਿਆ ਗਿਆ?`)
      );
    }
    // QL067 key = initial B volume : first x coefficient : second x coefficient : solved x.
    // The solved x is deliberately excluded from the native stem.
    const a = f(fields[1]!),
      b = f(fields[2]!);
    return hi
      ? `पात्र B में शुरू में ${volume} लीटर ${oi} है और पात्र C खाली है। A से ${a}x लीटर ${p} को B में मिलाया जाता है। B को अच्छी तरह मिलाकर उसमें से ${b}x लीटर मिश्रण C में भेजा जाता है। यदि C में ${o} : ${p} = ${ratio} हो, तो अंत में B में कितने लीटर ${p} बचेगा?`
      : `ਭਾਂਡੇ B ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${volume} ਲੀਟਰ ${oi} ਹੈ ਅਤੇ ਭਾਂਡਾ C ਖਾਲੀ ਹੈ। A ਤੋਂ ${a}x ਲੀਟਰ ${p} ਨੂੰ B ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। B ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾ ਕੇ ਉਸ ਵਿੱਚੋਂ ${b}x ਲੀਟਰ ਮਿਸ਼ਰਣ C ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਜੇ C ਵਿੱਚ ${o} : ${p} = ${ratio} ਹੋਵੇ, ਤਾਂ ਅੰਤ ਵਿੱਚ B ਵਿੱਚ ਕਿੰਨੇ ਲੀਟਰ ${p} ਬਚੇਗਾ?`;
  }
  if (ql === 62) {
    const m = /^A:(\d+):(\d+)\|B:(\d+):(\d+)\|X:/.exec(key);
    if (!m) return;
    const material = /\b(milk|acid|salt|alcohol)\b/.exec(q.stem)?.[1];
    if (!material) return;
    const p = tr(material);
    return hi
      ? `पात्र A में ${m[1]} लीटर और पात्र B में ${m[3]} लीटर ${p}-पानी का मिश्रण है। इनमें ${p} का प्रतिशत क्रमशः ${m[2]}% और ${m[4]}% है। दोनों पात्रों से एक ही समय पर समान मात्रा निकालकर एक-दूसरे में डाली जाती है। अंतिम सांद्रता समान करने के लिए प्रत्येक पात्र से कितने लीटर बदलने होंगे?`
      : `ਭਾਂਡੇ A ਵਿੱਚ ${m[1]} ਲੀਟਰ ਅਤੇ ਭਾਂਡੇ B ਵਿੱਚ ${m[3]} ਲੀਟਰ ${p}-ਪਾਣੀ ਦਾ ਮਿਸ਼ਰਣ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚ ${p} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕ੍ਰਮਵਾਰ ${m[2]}% ਅਤੇ ${m[4]}% ਹੈ। ਦੋਵਾਂ ਭਾਂਡਿਆਂ ਵਿੱਚੋਂ ਇੱਕੋ ਸਮੇਂ ਬਰਾਬਰ ਮਾਤਰਾ ਕੱਢ ਕੇ ਇੱਕ-ਦੂਜੇ ਵਿੱਚ ਪਾਈ ਜਾਂਦੀ ਹੈ। ਅੰਤਿਮ ਸੰਘਣਾਪਣ ਬਰਾਬਰ ਕਰਨ ਲਈ ਹਰੇਕ ਭਾਂਡੇ ਵਿੱਚੋਂ ਕਿੰਨੇ ਲੀਟਰ ਬਦਲਣੇ ਪੈਣਗੇ?`;
  }
  const [initial, eventKey] = key.split("::");
  if (!initial || !eventKey) return;
  const vessels = initial.split("|").map((v) => v.split(":"));
  const events = eventKey.split("|").map((v) => v.split(":"));
  const a = vessels.find((v) => v[0] === "A"),
    b = vessels.find((v) => v[0] === "B"),
    c = vessels.find((v) => v[0] === "C");
  if (!a || !b) return;
  const va = f(a[1]!),
    vb = f(b[1]!);
  if (ql === 61) {
    const material = /\b(acid|alcohol|milk|salt|spirit)\b/.exec(q.stem)?.[1];
    if (!material) return;
    const p = tr(material),
      pa = percent(a[2]!, a[1]!),
      pb = percent(b[2]!, b[1]!);
    const transfers = events
      .map((e) => {
        if (e[0] !== "T") return "";
        const [from, to] = e[1]!.split(">");
        return hi
          ? `${from} से ${to} में ${f(e[2]!)} लीटर भेजे जाते हैं। ${to} को अच्छी तरह मिलाया जाता है।`
          : `${from} ਤੋਂ ${to} ਵਿੱਚ ${f(e[2]!)} ਲੀਟਰ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ${to} ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ।`;
      })
      .join(" ");
    return hi
      ? `पात्र A में ${va} लीटर और पात्र B में ${vb} लीटर ${p}-पानी का मिश्रण है। इनमें ${p} का प्रतिशत क्रमशः ${pa} और ${pb} है। ${transfers} अंत में B में ${p} : पानी का अनुपात क्या होगा?`
      : `ਭਾਂਡੇ A ਵਿੱਚ ${va} ਲੀਟਰ ਅਤੇ ਭਾਂਡੇ B ਵਿੱਚ ${vb} ਲੀਟਰ ${p}-ਪਾਣੀ ਦਾ ਮਿਸ਼ਰਣ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚ ${p} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕ੍ਰਮਵਾਰ ${pa} ਅਤੇ ${pb} ਹੈ। ${transfers} ਅੰਤ ਵਿੱਚ B ਵਿੱਚ ${p} : ਪਾਣੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?`;
  }
  if (ql === 63 && c) {
    const pa = percent(a[2]!, a[1]!),
      pb = percent(b[2]!, b[1]!),
      pc = percent(c[2]!, c[1]!);
    const transfers = events
      .map(
        (e) =>
          `${e[1]!.replace(">", "→")}: ${f(e[2]!)} ${hi ? "मिलीलीटर" : "ਮਿਲੀਲੀਟਰ"}`,
      )
      .join(", ");
    return hi
      ? `पात्र A, B और C में प्रत्येक में ${va} मिलीलीटर नमक-पानी का घोल है। इनमें नमक का प्रतिशत क्रमशः ${pa}, ${pb} और ${pc} है। द्रव का स्थानांतरण इस क्रम में होता है: ${transfers}। अगला स्थानांतरण करने से पहले संबंधित पात्र के घोल को अच्छी तरह मिलाया जाता है। अंत में A में नमक का प्रतिशत कितना होगा?`
      : `ਭਾਂਡਿਆਂ A, B ਅਤੇ C ਵਿੱਚ ਹਰੇਕ ਵਿੱਚ ${va} ਮਿਲੀਲੀਟਰ ਨਮਕ-ਪਾਣੀ ਦਾ ਘੋਲ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚ ਨਮਕ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕ੍ਰਮਵਾਰ ${pa}, ${pb} ਅਤੇ ${pc} ਹੈ। ਤਰਲ ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ: ${transfers}। ਅਗਲੀ ਵਾਰ ਤਰਲ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਸੰਬੰਧਿਤ ਭਾਂਡੇ ਦੇ ਘੋਲ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ A ਵਿੱਚ ਨਮਕ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
  }
  if (ql === 64) {
    const pa = percent(a[2]!, a[1]!);
    const first = f(events[0]![2]!),
      refill = f(events[1]![2]!),
      last = f(events[2]![2]!);
    return hi
      ? `पात्र A में ${va} लीटर स्पिरिट-पानी का मिश्रण है, जिसमें स्पिरिट ${pa} है। पात्र B खाली है। A से ${first} लीटर B में भेजे जाते हैं। फिर A में ${refill} लीटर शुद्ध पानी मिलाकर अच्छी तरह मिलाया जाता है। इसके बाद A से ${last} लीटर मिश्रण B में भेजे जाते हैं। अंत में B में पानी : स्पिरिट का अनुपात क्या होगा?`
      : `ਭਾਂਡੇ A ਵਿੱਚ ${va} ਲੀਟਰ ਸਪਿਰਿਟ-ਪਾਣੀ ਦਾ ਮਿਸ਼ਰਣ ਹੈ, ਜਿਸ ਵਿੱਚ ਸਪਿਰਿਟ ${pa} ਹੈ। ਭਾਂਡਾ B ਖਾਲੀ ਹੈ। A ਤੋਂ ${first} ਲੀਟਰ B ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ਫਿਰ A ਵਿੱਚ ${refill} ਲੀਟਰ ਸ਼ੁੱਧ ਪਾਣੀ ਪਾ ਕੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ A ਤੋਂ ${last} ਲੀਟਰ ਮਿਸ਼ਰਣ B ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ਅੰਤ ਵਿੱਚ B ਵਿੱਚ ਪਾਣੀ : ਸਪਿਰਿਟ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?`;
  }
  if (ql === 65) {
    const first = f(events[0]![2]!),
      last = f(events[1]![2]!);
    return hi
      ? `पात्र A में ${va} लीटर शुद्ध दूध और पात्र B में ${vb} लीटर शुद्ध पानी है। A से ${first} लीटर दूध B में डालकर अच्छी तरह मिलाया जाता है। फिर B से ${last} लीटर मिश्रण A में लौटाया जाता है। अंत में A में दूध की मात्रा और B में पानी की मात्रा का अनुपात क्या होगा?`
      : `ਭਾਂਡੇ A ਵਿੱਚ ${va} ਲੀਟਰ ਸ਼ੁੱਧ ਦੁੱਧ ਅਤੇ ਭਾਂਡੇ B ਵਿੱਚ ${vb} ਲੀਟਰ ਸ਼ੁੱਧ ਪਾਣੀ ਹੈ। A ਤੋਂ ${first} ਲੀਟਰ ਦੁੱਧ B ਵਿੱਚ ਪਾ ਕੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਫਿਰ B ਤੋਂ ${last} ਲੀਟਰ ਮਿਸ਼ਰਣ A ਵਿੱਚ ਵਾਪਸ ਪਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ A ਵਿੱਚ ਦੁੱਧ ਦੀ ਮਾਤਰਾ ਅਤੇ B ਵਿੱਚ ਪਾਣੀ ਦੀ ਮਾਤਰਾ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?`;
  }
}

rules.push(
  {
    ql: 29,
    pattern:
      /^In every operation, (.+?) of a well-mixed vessel is removed and replaced with a liquid containing none of the original component\. After (.+?) operations, what fraction of the original component remains\?$/,
    hi: "हर बार अच्छी तरह मिले द्रव का $1 भाग निकालकर उतनी ही मात्रा में ऐसा द्रव भरा जाता है जिसमें मूल घटक नहीं है। $2 क्रियाओं के बाद मूल घटक का कितना अंश बचेगा?",
    pa: "ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਦਾ $1 ਹਿੱਸਾ ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ਮਾਤਰਾ ਵਿੱਚ ਅਜਿਹਾ ਤਰਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ਮੂਲ ਘਟਕ ਨਹੀਂ ਹੈ। $2 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਘਟਕ ਦਾ ਕਿੰਨਾ ਅੰਸ਼ ਬਚੇਗਾ?",
  },
  {
    ql: 58,
    pattern:
      /^An? (.+?) mixes (.+?) costing (.+?) per (.+?) with (.+?) costing (.+?) per (.+?)\. The mixture is sold at (.+?) per (.+?) for a profit of (.+?)\. In what ratio should (.+?) and (.+?) be mixed\?$/,
    hi: "एक विक्रेता $2 और $5 को मिलाता है। इनकी लागत क्रमशः $3 प्रति $4 और $6 प्रति $7 है। मिश्रण को $8 प्रति $9 पर बेचने से $10 लाभ होता है। $11 और $12 को किस अनुपात में मिलाना चाहिए?",
    pa: "ਇੱਕ ਵਿਕਰੇਤਾ $2 ਅਤੇ $5 ਨੂੰ ਮਿਲਾਉਂਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਦੀ ਲਾਗਤ ਕ੍ਰਮਵਾਰ $3 ਪ੍ਰਤੀ $4 ਅਤੇ $6 ਪ੍ਰਤੀ $7 ਹੈ। ਮਿਸ਼ਰਣ ਨੂੰ $8 ਪ੍ਰਤੀ $9 ਉੱਤੇ ਵੇਚਣ ਨਾਲ $10 ਲਾਭ ਹੁੰਦਾ ਹੈ। $11 ਅਤੇ $12 ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
);

const nativeNouns: Record<string, readonly [string, string]> = {
  water: ["पानी", "ਪਾਣੀ"],
  "pure water": ["शुद्ध पानी", "ਸ਼ੁੱਧ ਪਾਣੀ"],
  milk: ["दूध", "ਦੁੱਧ"],
  "pure milk": ["शुद्ध दूध", "ਸ਼ੁੱਧ ਦੁੱਧ"],
  spirit: ["स्पिरिट", "ਸਪਿਰਿਟ"],
  wine: ["वाइन", "ਵਾਈਨ"],
  syrup: ["शरबत", "ਸ਼ਰਬਤ"],
  juice: ["रस", "ਰਸ"],
  honey: ["शहद", "ਸ਼ਹਿਦ"],
  vinegar: ["सिरका", "ਸਿਰਕਾ"],
  glycerin: ["ग्लिसरीन", "ਗਲਿਸਰੀਨ"],
  petrol: ["पेट्रोल", "ਪੈਟਰੋਲ"],
  diesel: ["डीज़ल", "ਡੀਜ਼ਲ"],
  kerosene: ["मिट्टी का तेल", "ਮਿੱਟੀ ਦਾ ਤੇਲ"],
  "mustard oil": ["सरसों का तेल", "ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ"],
  "coconut oil": ["नारियल का तेल", "ਨਾਰੀਅਲ ਦਾ ਤੇਲ"],
  "olive oil": ["जैतून का तेल", "ਜੈਤੂਨ ਦਾ ਤੇਲ"],
  "sunflower oil": ["सूरजमुखी का तेल", "ਸੂਰਜਮੁਖੀ ਦਾ ਤੇਲ"],
  "soyabean oil": ["सोयाबीन का तेल", "ਸੋਇਆਬੀਨ ਦਾ ਤੇਲ"],
  acid: ["अम्ल", "ਤੇਜ਼ਾਬ"],
  alcohol: ["अल्कोहल", "ਅਲਕੋਹਲ"],
  salt: ["नमक", "ਨਮਕ"],
  "fruit concentrate": ["सांद्रित फलों का रस", "ਸੰਘਣਾ ਫਲਾਂ ਦਾ ਰਸ"],
  "syrup concentrate": ["सांद्रित शरबत", "ਸੰਘਣਾ ਸ਼ਰਬਤ"],
  concentrate: ["सांद्र द्रव", "ਸੰਘਣਾ ਤਰਲ"],
  "fresh grapes": ["ताज़े अंगूर", "ਤਾਜ਼ੇ ਅੰਗੂਰ"],
  "dried grapes": ["सूखे अंगूर", "ਸੁੱਕੇ ਅੰਗੂਰ"],
  raisins: ["किशमिश", "ਕਿਸ਼ਮਿਸ਼"],
  "fresh fruit": ["ताज़े फल", "ਤਾਜ਼ੇ ਫਲ"],
  "dried fruit": ["सूखे फल", "ਸੁੱਕੇ ਫਲ"],
  "dry fruit": ["सूखे फल", "ਸੁੱਕੇ ਫਲ"],
  "wet grain": ["गीला अनाज", "ਗਿੱਲਾ ਅਨਾਜ"],
  "dried grain": ["सूखा अनाज", "ਸੁੱਕਾ ਅਨਾਜ"],
  "fresh mango pulp": ["आम का ताज़ा गूदा", "ਅੰਬ ਦਾ ਤਾਜ਼ਾ ਗੁੱਦਾ"],
  "dried pulp": ["सूखा गूदा", "ਸੁੱਕਾ ਗੁੱਦਾ"],
  "wet timber": ["गीली लकड़ी", "ਗਿੱਲੀ ਲੱਕੜ"],
  "seasoned timber": ["सूखी लकड़ी", "ਸੁੱਕੀ ਲੱਕੜ"],
  "fresh vegetable matter": ["ताज़ी वनस्पति सामग्री", "ਤਾਜ਼ੀ ਬਨਸਪਤੀ ਸਮੱਗਰੀ"],
  "partly dried matter": [
    "आंशिक रूप से सूखी सामग्री",
    "ਅੰਸ਼ਕ ਤੌਰ ਉੱਤੇ ਸੁੱਕੀ ਸਮੱਗਰੀ",
  ],
  "wet fodder": ["गीला चारा", "ਗਿੱਲਾ ਚਾਰਾ"],
  "dry fodder": ["सूखा चारा", "ਸੁੱਕਾ ਚਾਰਾ"],
};
