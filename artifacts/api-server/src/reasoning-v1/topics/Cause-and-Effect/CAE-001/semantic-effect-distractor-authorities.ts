import type { CaeMagnitude, CaeScope, CaeSemanticCandidateAuthority, LocalizedText } from "./types.ts";

const text = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const effect = (
  id: string, en: string, hi: string, pa: string, mechanism: CaeSemanticCandidateAuthority["mechanism"], scope: CaeScope, magnitude: CaeMagnitude, severity: CaeMagnitude, rationale: string,
): CaeSemanticCandidateAuthority => ({ id, text: text(en, hi, pa), mechanism, temporalOrder: 3, scope, magnitude, severity, causalDistance: null, editorialPlausibility: "CREDIBLE_ALTERNATIVE", editorialRationale: rationale });

/**
 * These are possible *effects*, authored independently of the cause-option
 * pool. They are complete events in the same situation, not rewritten causes.
 */
const BY_VARIANT: Readonly<Record<string, readonly CaeSemanticCandidateAuthority[]>> = {
  fog: [
    effect("fog-gate-wait", "A small number of passengers waited longer at one departure gate.", "कुछ यात्रियों को एक प्रस्थान द्वार पर अधिक देर प्रतीक्षा करनी पड़ी।", "ਕੁਝ ਯਾਤਰੀਆਂ ਨੂੰ ਇੱਕ ਰਵਾਨਗੀ ਗੇਟ ਤੇ ਵੱਧ ਸਮਾਂ ਉਡੀਕ ਕਰਨੀ ਪਈ।", "MAGNITUDE_MISMATCH", "PERSON", "LOW", "LOW", "A genuine airport consequence that is too limited for the observed operational effect."),
    effect("fog-boarding-announcement", "Airport staff delayed a boarding announcement at one gate.", "हवाई अड्डे के कर्मचारियों ने एक गेट पर बोर्डिंग घोषणा में देरी की।", "ਹਵਾਈ ਅੱਡੇ ਦੇ ਕਰਮਚਾਰੀਆਂ ਨੇ ਇੱਕ ਗੇਟ ਤੇ ਬੋਰਡਿੰਗ ਐਲਾਨ ਵਿੱਚ ਦੇਰੀ ਕੀਤੀ।", "WRONG_SCOPE", "PERSON", "LOW", "LOW", "A plausible response at one gate, not the immediate system-level effect."),
  ],
  signal: [
    effect("signal-platform-wait", "Passengers at one platform waited a few extra minutes.", "एक प्लेटफॉर्म पर यात्रियों ने कुछ अतिरिक्त मिनट प्रतीक्षा की।", "ਇੱਕ ਪਲੇਟਫਾਰਮ ਉੱਤੇ ਯਾਤਰੀਆਂ ਨੇ ਕੁਝ ਵਾਧੂ ਮਿੰਟ ਉਡੀਕ ਕੀਤੀ।", "MAGNITUDE_MISMATCH", "PERSON", "LOW", "LOW", "A natural passenger effect that is smaller than the service outcome."),
    effect("signal-branch-announcement", "A station announced a short delay on one branch line.", "एक स्टेशन ने एक शाखा लाइन पर छोटी देरी की घोषणा की।", "ਇੱਕ ਸਟੇਸ਼ਨ ਨੇ ਇੱਕ ਬਰਾਂਚ ਲਾਈਨ ਉੱਤੇ ਛੋਟੀ ਦੇਰੀ ਦਾ ਐਲਾਨ ਕੀਤਾ।", "WRONG_SCOPE", "SITE", "LOW", "LOW", "A credible local effect with narrower network coverage."),
  ],
  bridge: [
    effect("bridge-side-street-queue", "Traffic built up at one side-street junction.", "एक साइड सड़क चौराहे पर यातायात बढ़ गया।", "ਇੱਕ ਸਾਈਡ ਸੜਕ ਚੌਰਾਹੇ ਤੇ ਆਵਾਜਾਈ ਵੱਧ ਗਈ।", "MAGNITUDE_MISMATCH", "LOCAL", "LOW", "LOW", "A real diversion effect that is too small for the route-wide outcome."),
    effect("bridge-single-bus-delay", "One bus reached a nearby stop a few minutes late.", "एक बस पास के स्टॉप पर कुछ मिनट देर से पहुँची।", "ਇੱਕ ਬੱਸ ਨੇੜਲੇ ਸਟਾਪ ਤੇ ਕੁਝ ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀ।", "WRONG_SCOPE", "LOCAL", "LOW", "LOW", "A plausible local effect with insufficient coverage."),
  ],
  "waterlogged-rail": [
    effect("waterlogged-rail-platform-delay", "One platform had a short boarding delay.", "एक प्लेटफॉर्म पर बोर्डिंग में थोड़ी देरी हुई।", "ਇੱਕ ਪਲੇਟਫਾਰਮ ਉੱਤੇ ਬੋਰਡਿੰਗ ਵਿੱਚ ਥੋੜ੍ਹੀ ਦੇਰੀ ਹੋਈ।", "MAGNITUDE_MISMATCH", "SITE", "LOW", "LOW", "A genuine rail effect that cannot account for the wider disruption."),
    effect("waterlogged-rail-entry-advice", "A station advised passengers to use a different entrance.", "एक स्टेशन ने यात्रियों को दूसरे प्रवेश द्वार का उपयोग करने की सलाह दी।", "ਇੱਕ ਸਟੇਸ਼ਨ ਨੇ ਯਾਤਰੀਆਂ ਨੂੰ ਦੂਜੇ ਦਾਖਲੇ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿੱਤੀ।", "WRONG_SCOPE", "SITE", "LOW", "LOW", "A natural local response rather than the broad immediate effect."),
  ],
  server: [
    effect("server-form-retry", "A few applicants retried one form after a slow page response.", "धीमे पृष्ठ उत्तर के बाद कुछ आवेदकों ने एक फॉर्म फिर से भरा।", "ਹੌਲੀ ਪੰਨਾ ਪ੍ਰਤੀਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਕੁਝ ਅਰਜ਼ੀਦਾਰਾਂ ਨੇ ਇੱਕ ਫਾਰਮ ਮੁੜ ਭਰਿਆ।", "MAGNITUDE_MISMATCH", "PERSON", "LOW", "LOW", "A credible user effect with too little volume."),
    effect("server-extra-call", "The help desk handled one additional call.", "सहायता डेस्क ने एक अतिरिक्त कॉल संभाली।", "ਸਹਾਇਤਾ ਡੈਸਕ ਨੇ ਇੱਕ ਵਾਧੂ ਕਾਲ ਸੰਭਾਲੀ।", "WRONG_SCOPE", "PERSON", "LOW", "LOW", "A realistic local consequence that lacks service-wide coverage."),
  ],
  pump: [
    effect("pump-single-lane-dip", "Water pressure dipped briefly in one lane.", "एक गली में पानी का दबाव थोड़ी देर के लिए घटा।", "ਇੱਕ ਗਲੀ ਵਿੱਚ ਪਾਣੀ ਦਾ ਦਬਾਅ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਘਟਿਆ।", "MAGNITUDE_MISMATCH", "LOCAL", "LOW", "LOW", "A genuine utility effect too small for the observed supply event."),
    effect("pump-household-storage", "Residents in one block stored water for the evening.", "एक ब्लॉक के निवासियों ने शाम के लिए पानी जमा किया।", "ਇੱਕ ਬਲਾਕ ਦੇ ਨਿਵਾਸੀਆਂ ਨੇ ਸ਼ਾਮ ਲਈ ਪਾਣੀ ਸੰਭਾਲਿਆ।", "WRONG_SCOPE", "LOCAL", "LOW", "LOW", "A plausible consequence limited to one block."),
  ],
  roadwork: [
    effect("roadwork-single-bus-late", "One bus reached a stop a few minutes late.", "एक बस एक स्टॉप पर कुछ मिनट देर से पहुँची।", "ਇੱਕ ਬੱਸ ਇੱਕ ਸਟਾਪ ਤੇ ਕੁਝ ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀ।", "MAGNITUDE_MISMATCH", "LOCAL", "LOW", "LOW", "A common traffic effect with insufficient city-route coverage."),
    effect("roadwork-crossing-busy", "A school crossing became busy for a short time.", "एक स्कूल क्रॉसिंग थोड़ी देर के लिए व्यस्त हुई।", "ਇੱਕ ਸਕੂਲ ਕ੍ਰਾਸਿੰਗ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਵਿਅਸਤ ਹੋ ਗਈ।", "WRONG_SCOPE", "LOCAL", "LOW", "LOW", "A credible nearby effect that is narrower than the traffic outcome."),
  ],
  drill: [
    effect("drill-one-class-delay", "One class missed a few minutes of a lesson.", "एक कक्षा का पाठ कुछ मिनट छूट गया।", "ਇੱਕ ਕਲਾਸ ਦਾ ਪਾਠ ਕੁਝ ਮਿੰਟ ਛੁੱਟ ਗਿਆ।", "MAGNITUDE_MISMATCH", "PERSON", "LOW", "LOW", "A natural drill consequence that is smaller than the school-wide effect."),
    effect("drill-classroom-activity", "A teacher delayed one classroom activity.", "एक शिक्षक ने कक्षा की एक गतिविधि देर से कराई।", "ਇੱਕ ਅਧਿਆਪਕ ਨੇ ਕਲਾਸਰੂਮ ਦੀ ਇੱਕ ਗਤੀਵਿਧੀ ਦੇਰ ਨਾਲ ਕਰਾਈ।", "WRONG_SCOPE", "PERSON", "LOW", "LOW", "A plausible local consequence with insufficient coverage."),
  ],
  cleaning: [
    effect("cleaning-van-wait", "One delivery van waited outside a shop.", "एक डिलीवरी वैन दुकान के बाहर प्रतीक्षा करती रही।", "ਇੱਕ ਡਿਲੀਵਰੀ ਵੈਨ ਦੁਕਾਨ ਦੇ ਬਾਹਰ ਉਡੀਕ ਕਰਦੀ ਰਹੀ।", "MAGNITUDE_MISMATCH", "SITE", "LOW", "LOW", "A genuine access effect that is too limited for the market outcome."),
    effect("cleaning-customer-entrance", "A customer used another entrance for a short time.", "एक ग्राहक ने कुछ समय के लिए दूसरा प्रवेश द्वार इस्तेमाल किया।", "ਇੱਕ ਗਾਹਕ ਨੇ ਕੁਝ ਸਮੇਂ ਲਈ ਦੂਜਾ ਦਾਖਲਾ ਵਰਤਿਆ।", "WRONG_SCOPE", "PERSON", "LOW", "LOW", "A plausible individual effect, not the broader immediate consequence."),
  ],
};

export function semanticEffectCandidatesForVariant(variantId: string): readonly CaeSemanticCandidateAuthority[] {
  return BY_VARIANT[variantId] ?? [];
}
