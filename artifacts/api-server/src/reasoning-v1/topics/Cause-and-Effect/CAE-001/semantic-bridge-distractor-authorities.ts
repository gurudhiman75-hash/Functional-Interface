import type { CaeCandidateApplicability, CaeMagnitude, CaeScope, CaeSemanticCandidateAuthority, LocalizedText } from "./types.ts";

const text = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const rule = (id: string, projection: CaeCandidateApplicability["applicableProjectionKinds"][number], target: string, reference: string, relation: CaeCandidateApplicability["eligibleRelations"][number]): CaeCandidateApplicability => ({
  id, applicableProjectionKinds: [projection], eligibleTargetSemanticSlots: [target], eligibleReferenceSemanticSlots: [reference], eligibleRelations: [relation], editorialPlausibility: "CREDIBLE_ALTERNATIVE",
});
const bridge = (id: string, en: string, hi: string, pa: string, scope: CaeScope, magnitude: CaeMagnitude, severity: CaeMagnitude, rationale: string): CaeSemanticCandidateAuthority => ({
  id,
  text: text(en, hi, pa),
  mechanism: "MAGNITUDE_MISMATCH",
  temporalOrder: 2,
  scope,
  magnitude,
  severity,
  causalDistance: null,
  applicability: [
    rule(`${id}-pc-bridge`, "PROBABLE_CAUSE", "bridge", "cause", "CAUSE_OF_TARGET"),
    rule(`${id}-missing-effect`, "MISSING_CAUSAL_LINK", "effect", "bridge", "BRIDGE_TO_TARGET"),
  ],
  editorialRationale: rationale,
});

/** Target-specific alternatives for the first direct edge of each cause-producing chain. */
const BY_VARIANT: Readonly<Record<string, readonly CaeSemanticCandidateAuthority[]>> = {
  fog: [bridge("fog-runway-smoke", "Smoke from a nearby field briefly drifted across the runway.", "पास के खेत का धुआँ थोड़ी देर के लिए रनवे पर फैल गया।", "ਨੇੜਲੇ ਖੇਤ ਦਾ ਧੂੰਆਂ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਰਨਵੇ ਉੱਤੇ ਫੈਲ ਗਿਆ।", "SITE", "LOW", "LOW", "A real visibility alternative for the runway, but too small to explain the observed airport-wide condition.")],
  signal: [bridge("signal-track-circuit", "A track circuit gave an intermittent warning on the same rail section.", "उसी रेल हिस्से में ट्रैक सर्किट ने रुक-रुक कर चेतावनी दी।", "ਉਸੇ ਰੇਲ ਹਿੱਸੇ ਵਿੱਚ ਟਰੈਕ ਸਰਕਿਟ ਨੇ ਰੁਕ-ਰੁਕ ਕੇ ਚੇਤਾਵਨੀ ਦਿੱਤੀ।", "LOCAL", "LOW", "LOW", "A credible same-section rail condition with insufficient scale.")],
  bridge: [bridge("bridge-approach-vehicle", "An overturned vehicle blocked one lane on the bridge approach.", "पुल के पास एक पलटे वाहन ने एक लेन रोक दी।", "ਪੁਲ ਦੇ ਨੇੜੇ ਇੱਕ ਪਲਟੇ ਵਾਹਨ ਨੇ ਇੱਕ ਲੇਨ ਰੋਕ ਦਿੱਤੀ।", "CITY", "LOW", "LOW", "A natural traffic alternative whose magnitude is too low for the route-wide diversion.")],
  "waterlogged-rail": [bridge("waterlogged-rail-drain", "A drainage grate near the track became blocked.", "पटरी के पास एक जल निकासी जाली बंद हो गई।", "ਪਟੜੀ ਨੇੜੇ ਇੱਕ ਨਿਕਾਸੀ ਜਾਲੀ ਬੰਦ ਹੋ ਗਈ।", "LOCAL", "LOW", "LOW", "A plausible local source of water near the track, but not enough for the observed disruption.")],
  server: [bridge("server-duplicate-requests", "The application portal briefly received a burst of duplicate requests.", "आवेदन पोर्टल को थोड़ी देर के लिए डुप्लिकेट अनुरोधों की बाढ़ मिली।", "ਅਰਜ਼ੀ ਪੋਰਟਲ ਨੂੰ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਦੁਹਰਾਈਆਂ ਬੇਨਤੀਆਂ ਦੀ ਲਹਿਰ ਮਿਲੀ।", "SITE", "LOW", "LOW", "A credible technical contributor with too little sustained volume.")],
  pump: [bridge("pump-pressure-valve", "A pressure-control valve on the main line stuck partly closed.", "मुख्य लाइन का दबाव नियंत्रक वाल्व आंशिक रूप से बंद रह गया।", "ਮੁੱਖ ਲਾਈਨ ਦਾ ਦਬਾਅ-ਨਿਯੰਤਰਕ ਵਾਲਵ ਅੱਧਾ ਬੰਦ ਰਹਿ ਗਿਆ।", "LOCAL", "LOW", "LOW", "A plausible main-line cause that is weaker than the pump failure.")],
  metro: [bridge("metro-police-diversion", "Traffic police closed another lane on the main route.", "यातायात पुलिस ने मुख्य मार्ग की एक और लेन बंद कर दी।", "ਟ੍ਰੈਫਿਕ ਪੁਲਿਸ ਨੇ ਮੁੱਖ ਰਸਤੇ ਦੀ ਇੱਕ ਹੋਰ ਲੇਨ ਬੰਦ ਕਰ ਦਿੱਤੀ।", "CITY", "LOW", "LOW", "A believable route disruption with insufficient magnitude.")],
  vegetables: [bridge("vegetables-market-strike", "A wholesale-market strike delayed one morning consignment.", "थोक बाजार की हड़ताल ने सुबह की एक खेप में देरी की।", "ਥੋਕ ਬਾਜ਼ਾਰ ਦੀ ਹੜਤਾਲ ਨੇ ਸਵੇਰ ਦੀ ਇੱਕ ਖੇਪ ਵਿੱਚ ਦੇਰੀ ਕੀਤੀ।", "REGIONAL", "LOW", "LOW", "A realistic supply event too small to explain the observed delivery disruption.")],
  "exam-centre": [bridge("exam-centre-protest", "A large protest slowed traffic on the approach road.", "एक बड़े विरोध प्रदर्शन ने पहुंच सड़क पर यातायात धीमा किया।", "ਇੱਕ ਵੱਡੇ ਪ੍ਰਦਰਸ਼ਨ ਨੇ ਪਹੁੰਚ ਸੜਕ ਉੱਤੇ ਆਵਾਜਾਈ ਹੌਲੀ ਕੀਤੀ।", "LOCAL", "LOW", "LOW", "A plausible access problem that does not cover the actual road closure.")],
  landslide: [bridge("landslide-fallen-tree", "A fallen tree blocked part of the hill road.", "गिरे हुए पेड़ ने पहाड़ी सड़क का एक हिस्सा रोक दिया।", "ਡਿੱਗੇ ਦਰੱਖਤ ਨੇ ਪਹਾੜੀ ਸੜਕ ਦਾ ਇੱਕ ਹਿੱਸਾ ਰੋਕ ਦਿੱਤਾ।", "REGIONAL", "LOW", "LOW", "A genuine hill-road disruption with insufficient magnitude.")],
  drainage: [bridge("drainage-culvert-debris", "A culvert near the access road filled with debris.", "पहुंच सड़क के पास एक पुलिया मलबे से भर गई।", "ਪਹੁੰਚ ਸੜਕ ਨੇੜੇ ਇੱਕ ਪੁਲੀਆ ਮਲਬੇ ਨਾਲ ਭਰ ਗਈ।", "LOCAL", "LOW", "LOW", "A credible local drainage condition that cannot explain the full flooding pattern.")],
  "cold-storage": [bridge("cold-storage-generator-relay", "A faulty relay kept the backup generator from starting.", "खराब रिले ने बैकअप जनरेटर को शुरू नहीं होने दिया।", "ਖਰਾਬ ਰੀਲੇ ਨੇ ਬੈਕਅਪ ਜਨਰੇਟਰ ਨੂੰ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਣ ਦਿੱਤਾ।", "SITE", "LOW", "LOW", "A plausible technical contributor with lower impact than the power failure.")],
  roadwork: [bridge("roadwork-curbside-van", "A delivery van briefly stopped beside the open lane.", "एक डिलीवरी वैन खुली लेन के पास थोड़ी देर रुकी।", "ਇੱਕ ਡਿਲੀਵਰੀ ਵੈਨ ਖੁੱਲ੍ਹੀ ਲੇਨ ਦੇ ਕੋਲ ਥੋੜ੍ਹੀ ਦੇਰ ਰੁਕੀ।", "LOCAL", "LOW", "LOW", "A credible local reason for a few vehicles to merge, but not for the full lane closure.")],
  drill: [bridge("drill-hall-announcement", "One class was called to the hall for a short announcement.", "एक कक्षा को छोटी घोषणा के लिए हॉल में बुलाया गया।", "ਇੱਕ ਕਲਾਸ ਨੂੰ ਛੋਟੀ ਘੋਸ਼ਣਾ ਲਈ ਹਾਲ ਵਿੱਚ ਬੁਲਾਇਆ ਗਿਆ।", "SITE", "LOW", "LOW", "A familiar school event that could move one class, not the whole school.")],
  cleaning: [bridge("cleaning-entrance-truck", "A parked truck partly narrowed one market entrance.", "एक खड़े ट्रक ने बाजार के एक प्रवेश को आंशिक रूप से संकरा किया।", "ਇੱਕ ਖੜ੍ਹੇ ਟਰੱਕ ਨੇ ਬਾਜ਼ਾਰ ਦੇ ਇੱਕ ਦਾਖਲੇ ਨੂੰ ਅੰਸ਼ਿਕ ਤੌਰ ਤੇ ਤੰਗ ਕੀਤਾ।", "SITE", "LOW", "LOW", "A realistic access problem with less reach than the water-main repair.")],
  supply: [bridge("supply-conveyor-jam", "A loading-bay conveyor jammed during the morning dispatch.", "सुबह की भेजाई के दौरान लोडिंग बे का कन्वेयर जाम हो गया।", "ਸਵੇਰ ਦੀ ਭੇਜਾਈ ਦੌਰਾਨ ਲੋਡਿੰਗ ਬੇ ਦਾ ਕਨਵੇਅਰ ਜਾਮ ਹੋ ਗਿਆ।", "REGIONAL", "LOW", "LOW", "A realistic warehouse cause with insufficient scale.")],
  ferry: [bridge("ferry-safety-inspection", "A safety inspection kept the ferry at the dock.", "सुरक्षा जांच ने फेरी को घाट पर रोके रखा।", "ਸੁਰੱਖਿਆ ਜਾਂਚ ਨੇ ਫੈਰੀ ਨੂੰ ਘਾਟ ਤੇ ਰੋਕਿਆ ਰੱਖਿਆ।", "REGIONAL", "LOW", "LOW", "A plausible crossing delay that is weaker than the weather disruption.")],
  printer: [bridge("printer-paper-feed", "A paper-feed fault stopped the main office printer.", "कागज फीड की खराबी ने मुख्य कार्यालय प्रिंटर रोक दिया।", "ਕਾਗਜ਼ ਫੀਡ ਦੀ ਖਰਾਬੀ ਨੇ ਮੁੱਖ ਦਫ਼ਤਰ ਪ੍ਰਿੰਟਰ ਰੋਕ ਦਿੱਤਾ।", "SITE", "LOW", "LOW", "A credible office fault with less reach than the network failure.")],
};

export function semanticBridgeCandidatesForVariant(variantId: string): readonly CaeSemanticCandidateAuthority[] {
  return BY_VARIANT[variantId] ?? [];
}
