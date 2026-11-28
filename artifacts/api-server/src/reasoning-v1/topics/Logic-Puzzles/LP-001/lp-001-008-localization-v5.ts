import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4,
  LP_001_008_LOCALIZED_GENERATORS_V4,
} from "./lp-001-008-localization-v4.ts";
import type {
  Lp001008LocalizedCaselet,
  Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v1.ts";

/**
 * V5 — scenario-context variation for Hindi and Punjabi.
 *
 * Before V5, LP-002, LP-003, LP-004 and LP-006 rendered every Hindi/Punjabi
 * caselet with a single generic setup sentence, while English rotated six
 * scenario profiles. V5 prepends a natively written context sentence keyed by
 * the caselet's English `scenarioProfileId`, so each language rotates the same
 * six contexts.
 *
 * Invariants (enforced by lp-001-008-localization-v5.test.ts):
 * - The V4 structural sentence (people, days, places, positions, committee
 *   size) is kept byte-for-byte after the new context sentence.
 * - Clues, child stems, options, answers and explanations are untouched.
 * - Every scenario profile of these packages has a context in both languages.
 */

type ContextMap = Record<string, Record<Lp001008LocalizedLanguage, string>>;

export const LP_001_008_SCENARIO_CONTEXTS_V5: Readonly<Record<"LP-002" | "LP-003" | "LP-004" | "LP-006", ContextMap>> = Object.freeze({
  "LP-002": {
    BANK_BRANCH_REVIEW: {
      hi: "सेवा-लेखापरीक्षा के बाद एक बैंक अपनी चार शाखाओं की समीक्षा कर रहा है।",
      pa: "ਸੇਵਾ-ਆਡਿਟ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬੈਂਕ ਆਪਣੀਆਂ ਚਾਰ ਸ਼ਾਖਾਵਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰ ਰਿਹਾ ਹੈ।",
    },
    DISTRICT_SERVICE_CAMP: {
      hi: "जिला प्रशासन चार जन-सेवा शिविर लगा रहा है।",
      pa: "ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਨ ਚਾਰ ਲੋਕ-ਸੇਵਾ ਕੈਂਪ ਲਗਾ ਰਿਹਾ ਹੈ।",
    },
    SCHOLARSHIP_INTERVIEWS: {
      hi: "एक छात्रवृत्ति बोर्ड चार जिला केंद्रों पर साक्षात्कार ले रहा है।",
      pa: "ਇੱਕ ਵਜ਼ੀਫ਼ਾ ਬੋਰਡ ਚਾਰ ਜ਼ਿਲ੍ਹਾ ਕੇਂਦਰਾਂ 'ਤੇ ਇੰਟਰਵਿਊ ਲੈ ਰਿਹਾ ਹੈ।",
    },
    HEALTH_OUTREACH: {
      hi: "स्वास्थ्य विभाग चार चलते-फिरते क्लिनिक आयोजित कर रहा है।",
      pa: "ਸਿਹਤ ਵਿਭਾਗ ਚਾਰ ਮੋਬਾਈਲ ਕਲੀਨਿਕ ਲਗਾ ਰਿਹਾ ਹੈ।",
    },
    TEACHER_DEMONSTRATION: {
      hi: "एक शिक्षक-प्रशिक्षण बोर्ड चार विद्यालयों में प्रदर्शन-पाठों का निरीक्षण कर रहा है।",
      pa: "ਇੱਕ ਅਧਿਆਪਕ-ਸਿਖਲਾਈ ਬੋਰਡ ਚਾਰ ਸਕੂਲਾਂ ਵਿੱਚ ਪ੍ਰਦਰਸ਼ਨ-ਪਾਠਾਂ ਦਾ ਨਿਰੀਖਣ ਕਰ ਰਿਹਾ ਹੈ।",
    },
    FIELD_RESEARCH: {
      hi: "एक विश्वविद्यालय का शोध-दल चार स्थलों से पानी के नमूने एकत्र कर रहा है।",
      pa: "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ ਦੀ ਖੋਜ-ਟੀਮ ਚਾਰ ਥਾਵਾਂ ਤੋਂ ਪਾਣੀ ਦੇ ਨਮੂਨੇ ਇਕੱਠੇ ਕਰ ਰਹੀ ਹੈ।",
    },
  },
  "LP-003": {
    RELIEF_SUPPLIES: {
      hi: "एक राहत केंद्र के भंडार-कक्ष में सामग्री रखी जा रही है।",
      pa: "ਇੱਕ ਰਾਹਤ ਕੇਂਦਰ ਦੇ ਸਟੋਰ-ਕਮਰੇ ਵਿੱਚ ਸਮੱਗਰੀ ਰੱਖੀ ਜਾ ਰਹੀ ਹੈ।",
    },
    SCHOOL_ARCHIVE: {
      hi: "विद्यालय का पुस्तकालयाध्यक्ष अभिलेखों को भंडार-कक्ष में भेजने से पहले जमा रहा है।",
      pa: "ਸਕੂਲ ਦਾ ਲਾਇਬ੍ਰੇਰੀਅਨ ਰਿਕਾਰਡ ਨੂੰ ਸਟੋਰ-ਕਮਰੇ ਵਿੱਚ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਟਿਕਾ ਰਿਹਾ ਹੈ।",
    },
    BANK_RECORDS: {
      hi: "एक बैंक शाखा अपने अभिलेख एक खड़ी रैक में लगा रही है।",
      pa: "ਇੱਕ ਬੈਂਕ ਸ਼ਾਖਾ ਆਪਣਾ ਰਿਕਾਰਡ ਇੱਕ ਖੜ੍ਹੀ ਰੈਕ ਵਿੱਚ ਲਗਾ ਰਹੀ ਹੈ।",
    },
    RAILWAY_SPARES: {
      hi: "एक रेलवे डिपो अपने पुर्ज़ा-कक्ष में रखरखाव की सामग्री रख रहा है।",
      pa: "ਇੱਕ ਰੇਲਵੇ ਡਿਪੂ ਆਪਣੇ ਪੁਰਜ਼ਾ-ਕਮਰੇ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਸਮੱਗਰੀ ਰੱਖ ਰਿਹਾ ਹੈ।",
    },
    ELECTION_MATERIAL: {
      hi: "जिला निर्वाचन कार्यालय भेजने से पहले चुनाव सामग्री रख रहा है।",
      pa: "ਜ਼ਿਲ੍ਹਾ ਚੋਣ ਦਫ਼ਤਰ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਚੋਣ ਸਮੱਗਰੀ ਰੱਖ ਰਿਹਾ ਹੈ।",
    },
    HEALTH_CAMP_STOCK: {
      hi: "स्वास्थ्य शिविर शुरू होने से पहले उसके भंडार में सामग्री रखी जा रही है।",
      pa: "ਸਿਹਤ ਕੈਂਪ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸਦੇ ਸਟੋਰ ਵਿੱਚ ਸਮੱਗਰੀ ਰੱਖੀ ਜਾ ਰਹੀ ਹੈ।",
    },
  },
  "LP-004": {
    DISTRICT_HEALTH_TEAM: {
      hi: "जिला स्वास्थ्य कार्यालय टीकाकरण अभियान के लिए एक दल बना रहा है।",
      pa: "ਜ਼ਿਲ੍ਹਾ ਸਿਹਤ ਦਫ਼ਤਰ ਟੀਕਾਕਰਨ ਮੁਹਿੰਮ ਲਈ ਇੱਕ ਟੀਮ ਬਣਾ ਰਿਹਾ ਹੈ।",
    },
    SCHOOL_EVENT_PANEL: {
      hi: "एक सरकारी विद्यालय वार्षिकोत्सव की योजना के लिए समिति बना रहा है।",
      pa: "ਇੱਕ ਸਰਕਾਰੀ ਸਕੂਲ ਸਾਲਾਨਾ ਸਮਾਗਮ ਦੀ ਯੋਜਨਾ ਲਈ ਕਮੇਟੀ ਬਣਾ ਰਿਹਾ ਹੈ।",
    },
    BANK_AUDIT_TEAM: {
      hi: "एक बैंक शाखा आंतरिक लेखापरीक्षा के लिए दल चुन रही है।",
      pa: "ਇੱਕ ਬੈਂਕ ਸ਼ਾਖਾ ਅੰਦਰੂਨੀ ਆਡਿਟ ਲਈ ਟੀਮ ਚੁਣ ਰਹੀ ਹੈ।",
    },
    MUNICIPAL_WATER_SURVEY: {
      hi: "नगर निगम पेयजल सर्वेक्षण के लिए दल बना रहा है।",
      pa: "ਨਗਰ ਨਿਗਮ ਪੀਣ ਵਾਲੇ ਪਾਣੀ ਦੇ ਸਰਵੇਖਣ ਲਈ ਟੀਮ ਬਣਾ ਰਿਹਾ ਹੈ।",
    },
    RAILWAY_SAFETY_PANEL: {
      hi: "एक रेलवे डिपो सुरक्षा-समीक्षा पैनल बना रहा है।",
      pa: "ਇੱਕ ਰੇਲਵੇ ਡਿਪੂ ਸੁਰੱਖਿਆ-ਸਮੀਖਿਆ ਪੈਨਲ ਬਣਾ ਰਿਹਾ ਹੈ।",
    },
    EXAM_BOARD_COMMITTEE: {
      hi: "एक भर्ती बोर्ड परीक्षा केंद्र की समीक्षा के लिए समिति बना रहा है।",
      pa: "ਇੱਕ ਭਰਤੀ ਬੋਰਡ ਪ੍ਰੀਖਿਆ ਕੇਂਦਰ ਦੀ ਸਮੀਖਿਆ ਲਈ ਕਮੇਟੀ ਬਣਾ ਰਿਹਾ ਹੈ।",
    },
  },
  "LP-006": {
    EXAMINATION_BOARD: {
      hi: "एक परीक्षा बोर्ड चार उम्मीदवारों के साक्षात्कार निर्धारित कर रहा है।",
      pa: "ਇੱਕ ਪ੍ਰੀਖਿਆ ਬੋਰਡ ਚਾਰ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੰਟਰਵਿਊ ਤੈਅ ਕਰ ਰਿਹਾ ਹੈ।",
    },
    TEACHER_TRAINING: {
      hi: "एक प्रशिक्षण बोर्ड चार शिक्षकों की कार्यशाला निर्धारित कर रहा है।",
      pa: "ਇੱਕ ਸਿਖਲਾਈ ਬੋਰਡ ਚਾਰ ਅਧਿਆਪਕਾਂ ਦੀ ਵਰਕਸ਼ਾਪ ਤੈਅ ਕਰ ਰਿਹਾ ਹੈ।",
    },
    BANK_AUDIT: {
      hi: "एक बैंक चार अधिकारियों की समीक्षा-बैठक निर्धारित कर रहा है।",
      pa: "ਇੱਕ ਬੈਂਕ ਚਾਰ ਅਧਿਕਾਰੀਆਂ ਦੀ ਸਮੀਖਿਆ-ਮੀਟਿੰਗ ਤੈਅ ਕਰ ਰਿਹਾ ਹੈ।",
    },
    HEALTH_PROGRAMME: {
      hi: "स्वास्थ्य विभाग चार डॉक्टरों का प्रशिक्षण कार्यक्रम निर्धारित कर रहा है।",
      pa: "ਸਿਹਤ ਵਿਭਾਗ ਚਾਰ ਡਾਕਟਰਾਂ ਦਾ ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ ਤੈਅ ਕਰ ਰਿਹਾ ਹੈ।",
    },
    RESEARCH_REVIEW: {
      hi: "एक विश्वविद्यालय चार शोधकर्ताओं की क्षेत्रीय समीक्षा निर्धारित कर रहा है।",
      pa: "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ ਚਾਰ ਖੋਜਕਾਰਾਂ ਦੀ ਖੇਤਰੀ ਸਮੀਖਿਆ ਤੈਅ ਕਰ ਰਹੀ ਹੈ।",
    },
    RAILWAY_INSPECTION: {
      hi: "एक रेलवे बोर्ड चार निरीक्षकों की सुरक्षा-समीक्षा निर्धारित कर रहा है।",
      pa: "ਇੱਕ ਰੇਲਵੇ ਬੋਰਡ ਚਾਰ ਨਿਰੀਖਕਾਂ ਦੀ ਸੁਰੱਖਿਆ-ਸਮੀਖਿਆ ਤੈਅ ਕਰ ਰਿਹਾ ਹੈ।",
    },
  },
});

/** Localized heading shown above the clue list in Question Studio stems. */
export const LP_001_008_CLUES_HEADING_V5: Readonly<Record<"en" | Lp001008LocalizedLanguage, string>> = Object.freeze({
  en: "Clues:",
  hi: "संकेत:",
  pa: "ਸੰਕੇਤ:",
});

export const LP_001_008_HI_PA_LOCALIZATION_REVIEW_V5 = Object.freeze({
  ...LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4,
  authorityId: "LP_001_008_HI_PA_LOCALIZATION_REVIEW_V5" as const,
  supersedes: LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V5" as const,
  editorialFocus: "NATIVE_SCENARIO_CONTEXT_ROTATION_LP002_LP003_LP004_LP006_AND_LOCALIZED_CLUES_HEADING" as const,
  localizationFreezeStatus: "NOT_FROZEN" as const,
});

function withContext(packageId: string, language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const map = (LP_001_008_SCENARIO_CONTEXTS_V5 as Record<string, ContextMap>)[packageId];
  if (!map) return caselet;
  const context = map[caselet.scenarioProfileId]?.[language];
  if (!context) {
    throw new Error(`LP V5: missing ${language} scenario context for ${packageId}/${caselet.scenarioProfileId}`);
  }
  return { ...caselet, scenario: `${context} ${caselet.scenario}` };
}

export const LP_001_008_LOCALIZED_GENERATORS_V5 = Object.freeze(Object.fromEntries(
  Object.entries(LP_001_008_LOCALIZED_GENERATORS_V4).map(([packageId, generator]) => [
    packageId,
    (language: Lp001008LocalizedLanguage, seed = `${packageId.toLowerCase()}-localization-v4`, count = 8) =>
      generator(language, seed, count).map((caselet) => withContext(packageId, language, caselet)),
  ]),
) as Record<string, (language: Lp001008LocalizedLanguage, seed?: string, count?: number) => Lp001008LocalizedCaselet[]>);
