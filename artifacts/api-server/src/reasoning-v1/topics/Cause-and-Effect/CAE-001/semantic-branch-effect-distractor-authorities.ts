import type { CaeMagnitude, CaeScope, CaeSemanticCandidateAuthority, LocalizedText } from "./types.ts";
import { branchingEffectCandidateApplicability } from "./semantic-candidate-applicability.ts";

const text = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const event = (id: string, en: string, hi: string, pa: string, mechanism: CaeSemanticCandidateAuthority["mechanism"], temporalOrder: number, scope: CaeScope, magnitude: CaeMagnitude, severity: CaeMagnitude, rationale: string): CaeSemanticCandidateAuthority => ({
  id, text: text(en, hi, pa), mechanism, temporalOrder, scope, magnitude, severity, causalDistance: null, applicability: branchingEffectCandidateApplicability(id, mechanism === "REVERSE_CAUSATION" ? "CLEAR_REJECT" : "CREDIBLE_ALTERNATIVE"), editorialRationale: rationale,
});

/** Purpose-authored effects for the restored branching/common-cause CP-004 states. */
const BY_VARIANT: Readonly<Record<string, readonly CaeSemanticCandidateAuthority[]>> = {
  heat: [
    event("heat-cold-drinks", "A few residents bought extra cold drinks.", "कुछ निवासियों ने अतिरिक्त ठंडे पेय खरीदे।", "ਕੁਝ ਨਿਵਾਸੀਆਂ ਨੇ ਵਾਧੂ ਠੰਢੇ ਪੇਅ ਖਰੀਦੇ।", "MAGNITUDE_MISMATCH", 2, "PERSON", "LOW", "LOW", "A natural heatwave effect with far less scale than town-wide demand."),
    event("heat-shaded-rest", "One neighbourhood opened a shaded rest area.", "एक मोहल्ले ने छायादार विश्राम क्षेत्र खोला।", "ਇੱਕ ਮੁਹੱਲੇ ਨੇ ਛਾਂਦਾਰ ਆਰਾਮ ਥਾਂ ਖੋਲੀ।", "WRONG_SCOPE", 2, "LOCAL", "LOW", "LOW", "A plausible local response, not the direct town-wide effect."),
    event("heat-radio-update", "A local radio station gave its usual morning weather update.", "एक स्थानीय रेडियो स्टेशन ने अपना नियमित सुबह का मौसम अपडेट दिया।", "ਇੱਕ ਸਥਾਨਕ ਰੇਡੀਓ ਸਟੇਸ਼ਨ ਨੇ ਆਪਣਾ ਨਿਯਮਿਤ ਸਵੇਰ ਦਾ ਮੌਸਮ ਅਪਡੇਟ ਦਿੱਤਾ।", "REVERSE_CAUSATION", 0, "LOCAL", "LOW", "LOW", "A natural prior event that cannot be an effect of the heatwave."),
  ],
  festival: [
    event("festival-shop-hours", "One shop extended its evening hours.", "एक दुकान ने अपने शाम के समय बढ़ाए।", "ਇੱਕ ਦੁਕਾਨ ਨੇ ਆਪਣੇ ਸ਼ਾਮ ਦੇ ਘੰਟੇ ਵਧਾਏ।", "MAGNITUDE_MISMATCH", 2, "SITE", "LOW", "LOW", "A real festival response with insufficient coverage."),
    event("festival-cafe-worker", "A nearby café hired one extra worker for the day.", "पास के एक कैफे ने दिन के लिए एक अतिरिक्त कर्मचारी रखा।", "ਨੇੜਲੇ ਇੱਕ ਕੈਫੇ ਨੇ ਦਿਨ ਲਈ ਇੱਕ ਵਾਧੂ ਕਰਮਚਾਰੀ ਰੱਖਿਆ।", "WRONG_SCOPE", 2, "SITE", "LOW", "LOW", "A plausible local consequence rather than the broader transport or data effect."),
    event("festival-timetable", "The bus depot published its regular timetable before the festival opened.", "बस डिपो ने उत्सव शुरू होने से पहले अपनी नियमित समय-सारिणी प्रकाशित की।", "ਬੱਸ ਡਿਪੋ ਨੇ ਮੇਲਾ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਨਿਯਮਿਤ ਸਮਾਂ-ਸਾਰਣੀ ਜਾਰੀ ਕੀਤੀ।", "REVERSE_CAUSATION", 0, "LOCAL", "LOW", "LOW", "A prior operational event, not an effect of the festival."),
  ],
  admissions: [
    event("admissions-campus-tour", "A few families joined one campus tour.", "कुछ परिवार एक परिसर भ्रमण में शामिल हुए।", "ਕੁਝ ਪਰਿਵਾਰ ਇੱਕ ਕੈਂਪਸ ਦੌਰੇ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਏ।", "MAGNITUDE_MISMATCH", 2, "PERSON", "LOW", "LOW", "A natural admissions-week consequence with too little scale."),
    event("admissions-canteen-queue", "A brief line developed outside the college canteen.", "कॉलेज कैंटीन के बाहर थोड़ी देर कतार लगी।", "ਕਾਲਜ ਕੈਂਟੀਨ ਦੇ ਬਾਹਰ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਲਾਈਨ ਲੱਗੀ।", "WRONG_SCOPE", 2, "SITE", "LOW", "LOW", "A plausible campus effect that does not match the counselling or hostel outcome."),
    event("admissions-email", "The college sent a routine admissions email before registrations opened.", "कॉलेज ने पंजीकरण शुरू होने से पहले नियमित प्रवेश ईमेल भेजा।", "ਕਾਲਜ ਨੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਨਿਯਮਿਤ ਦਾਖਲਾ ਈਮੇਲ ਭੇਜੀ।", "REVERSE_CAUSATION", 0, "SITE", "LOW", "LOW", "A prior communication, not a direct effect of admissions opening."),
  ],
};

export function semanticBranchEffectCandidatesForVariant(variantId: string): readonly CaeSemanticCandidateAuthority[] {
  return BY_VARIANT[variantId] ?? [];
}
