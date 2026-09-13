import { generateCp009IntegratedQuestion } from "./cp009-integrated.ts";
import type { CaeLocale, CaeRenderedOption, GeneratedCaeQuestion } from "./types.ts";

const RELATION_EVIDENCE: Readonly<Record<CaeLocale, string>> = {
  "en-IN": "The causal information establishes the chain P → Q → R → S.",
  "hi-IN": "कारणात्मक जानकारी P → Q → R → S की श्रृंखला स्थापित करती है।",
  "pa-IN": "ਕਾਰਨਾਤਮਕ ਜਾਣਕਾਰੀ P → Q → R → S ਦੀ ਲੜੀ ਸਥਾਪਤ ਕਰਦੀ ਹੈ।",
};

const COMMON_CAUSE_ALTERNATIVES: Readonly<Record<string, Readonly<Record<CaeLocale, readonly string[]>>>> = {
  heat: {
    "en-IN": [
      "A leak in one neighbourhood increased recorded water loss.",
      "Several offices extended their air-conditioning hours.",
      "The water department changed supply timings in one zone.",
    ],
    "hi-IN": [
      "एक मोहल्ले में रिसाव से दर्ज पानी की हानि बढ़ गई।",
      "कई कार्यालयों ने एयर-कंडीशनिंग का समय बढ़ा दिया।",
      "जल विभाग ने एक क्षेत्र में पानी की आपूर्ति का समय बदल दिया।",
    ],
    "pa-IN": [
      "ਇੱਕ ਮੁਹੱਲੇ ਵਿੱਚ ਲੀਕੇਜ ਕਾਰਨ ਦਰਜ ਪਾਣੀ ਦੀ ਹਾਨੀ ਵਧ ਗਈ।",
      "ਕਈ ਦਫ਼ਤਰਾਂ ਨੇ ਏਅਰ-ਕੰਡੀਸ਼ਨਿੰਗ ਦਾ ਸਮਾਂ ਵਧਾ ਦਿੱਤਾ।",
      "ਜਲ ਵਿਭਾਗ ਨੇ ਇੱਕ ਇਲਾਕੇ ਵਿੱਚ ਪਾਣੀ ਸਪਲਾਈ ਦਾ ਸਮਾਂ ਬਦਲ ਦਿੱਤਾ।",
    ],
  },
  festival: {
    "en-IN": [
      "Bus frequency on one market route was reduced because of road repairs.",
      "A telecom operator launched a weekend mobile-data offer.",
      "A parking area near the market was closed for resurfacing.",
    ],
    "hi-IN": [
      "सड़क मरम्मत के कारण बाजार के एक मार्ग पर बसों की आवृत्ति घटा दी गई।",
      "एक दूरसंचार कंपनी ने सप्ताहांत मोबाइल-डेटा ऑफर शुरू किया।",
      "बाजार के पास एक पार्किंग क्षेत्र मरम्मत के लिए बंद किया गया।",
    ],
    "pa-IN": [
      "ਸੜਕ ਮੁਰੰਮਤ ਕਾਰਨ ਬਾਜ਼ਾਰ ਦੇ ਇੱਕ ਰਸਤੇ ਉੱਤੇ ਬੱਸਾਂ ਦੀ ਆਵ੍ਰਿਤੀ ਘਟਾ ਦਿੱਤੀ ਗਈ।",
      "ਇੱਕ ਟੈਲੀਕਾਮ ਕੰਪਨੀ ਨੇ ਹਫ਼ਤੇਅੰਤ ਮੋਬਾਈਲ-ਡਾਟਾ ਆਫ਼ਰ ਸ਼ੁਰੂ ਕੀਤਾ।",
      "ਬਾਜ਼ਾਰ ਨੇੜੇ ਇੱਕ ਪਾਰਕਿੰਗ ਖੇਤਰ ਮੁੜ ਸਤਹ ਬਣਾਉਣ ਲਈ ਬੰਦ ਕੀਤਾ ਗਿਆ।",
    ],
  },
  admissions: {
    "en-IN": [
      "Hostel room-allocation dates for current students were announced.",
      "The counselling desk extended its working hours by one hour.",
      "One department published its revised class timetable.",
    ],
    "hi-IN": [
      "वर्तमान छात्रों के लिए छात्रावास कक्ष आवंटन की तिथियाँ घोषित की गईं।",
      "परामर्श डेस्क ने अपना कार्य समय एक घंटे बढ़ा दिया।",
      "एक विभाग ने अपनी संशोधित कक्षा समय-सारणी जारी की।",
    ],
    "pa-IN": [
      "ਮੌਜੂਦਾ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਹੋਸਟਲ ਕਮਰਾ-ਵੰਡ ਦੀਆਂ ਤਾਰੀਖਾਂ ਘੋਸ਼ਿਤ ਕੀਤੀਆਂ ਗਈਆਂ।",
      "ਸਲਾਹ ਡੈਸਕ ਨੇ ਆਪਣਾ ਕੰਮ ਦਾ ਸਮਾਂ ਇੱਕ ਘੰਟਾ ਵਧਾ ਦਿੱਤਾ।",
      "ਇੱਕ ਵਿਭਾਗ ਨੇ ਆਪਣੀ ਸੋਧੀ ਹੋਈ ਕਲਾਸ ਸਮਾਂ-ਸਾਰਣੀ ਜਾਰੀ ਕੀਤੀ।",
    ],
  },
};

function polishCommonCause(
  base: GeneratedCaeQuestion,
  locale: CaeLocale,
): GeneratedCaeQuestion {
  const alternatives = COMMON_CAUSE_ALTERNATIVES[base.scenarioVariantId]?.[locale];
  if (!alternatives) return base;

  let wrongIndex = 0;
  const optionMetadata: readonly CaeRenderedOption[] = base.optionMetadata.map((option) => {
    if (option.isCorrect) return option;
    const index = wrongIndex++;
    return {
      ...option,
      id: `REVIEW_ALT:${base.scenarioVariantId}:${index + 1}`,
      text: alternatives[index]!,
      distractorRole: "COMMON_CAUSE_CONFUSION" as const,
    };
  });
  const correctIndex = optionMetadata.findIndex((option) => option.isCorrect);
  const itemVariantId = `${base.causalStateId}|surface:credible-common-cause-v2|presentation:${optionMetadata.map((option) => option.id).join(">")}`;

  return Object.freeze({
    ...base,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    options: optionMetadata.map((option) => option.text),
    optionMetadata,
    correctIndex,
  });
}

/**
 * Editorial polish for reviewed CP009 items.
 * The semantic graph and keyed answer remain unchanged. Relation-type items
 * remove the answer-leading explicit chain cue; hidden-common-cause items use
 * same-context partial alternatives instead of generic unrelated events.
 */
export function generateReviewedCp009Question(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  const base = generateCp009IntegratedQuestion(input);
  const mode = base.causalStructure.split(":")[1];

  if (mode === "COMMON_CAUSE_RECONSTRUCTION") {
    return polishCommonCause(base, input.locale);
  }
  if (mode !== "RELATION_TYPE") return base;

  const cue = RELATION_EVIDENCE[input.locale];
  const stem = base.stem
    .split("\n")
    .filter((line) => line.trim() !== cue)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const causalStateId = `${base.causalStateId}|surface:no-explicit-chain-cue`;
  const itemVariantId = `${causalStateId}|presentation:${base.optionMetadata.map((option) => option.id).join(">")}`;

  return Object.freeze({
    ...base,
    causalStateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    stem,
  });
}
