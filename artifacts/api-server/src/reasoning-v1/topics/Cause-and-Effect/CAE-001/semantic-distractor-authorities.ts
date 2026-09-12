import type { CaeMagnitude, CaeScope, CaeSemanticCandidateAuthority, LocalizedText } from "./types.ts";
import { causeCandidateApplicability } from "./semantic-candidate-applicability.ts";

const text = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const event = (
  id: string,
  value: LocalizedText,
  mechanism: CaeSemanticCandidateAuthority["mechanism"],
  temporalOrder: number,
  scope: CaeScope,
  magnitude: CaeMagnitude,
  severity: CaeMagnitude,
  editorialRationale: string,
): CaeSemanticCandidateAuthority => ({ id, text: value, mechanism, temporalOrder, scope, magnitude, severity, causalDistance: null, applicability: causeCandidateApplicability(id, mechanism), editorialRationale });

const credible = (
  id: string, en: string, hi: string, pa: string, mechanism: CaeSemanticCandidateAuthority["mechanism"], temporalOrder: number, scope: CaeScope, magnitude: CaeMagnitude, severity: CaeMagnitude, rationale: string,
) => event(id, text(en, hi, pa), mechanism, temporalOrder, scope, magnitude, severity, rationale);
const clear = (
  id: string, en: string, hi: string, pa: string, mechanism: CaeSemanticCandidateAuthority["mechanism"], temporalOrder: number, scope: CaeScope, magnitude: CaeMagnitude, severity: CaeMagnitude, rationale: string,
) => event(id, text(en, hi, pa), mechanism, temporalOrder + 1, scope, magnitude, severity, rationale);

/**
 * Variant-authored semantic events. These are complete, situation-specific
 * alternatives; generation never inserts a target or an anchor into them.
 */
const BY_VARIANT: Readonly<Record<string, readonly CaeSemanticCandidateAuthority[]>> = {
  fog: [
    credible("fog-taxiway-mist", "A thin patch of mist briefly covered one taxiway.", "हल्की धुंध ने कुछ समय के लिए एक टैक्सीवे को ढक लिया।", "ਹਲਕੀ ਧੁੰਦ ਨੇ ਕੁਝ ਸਮੇਂ ਲਈ ਇੱਕ ਟੈਕਸੀਵੇਅ ਢੱਕ ਲਿਆ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A real aviation visibility issue, but too limited to explain the wider disruption."),
    credible("fog-baggage-vehicle", "A baggage-loading vehicle broke down at one boarding gate.", "सामान लादने वाला वाहन एक बोर्डिंग गेट पर खराब हो गया।", "ਸਮਾਨ ਲੋਡ ਕਰਨ ਵਾਲਾ ਵਾਹਨ ਇੱਕ ਬੋਰਡਿੰਗ ਗੇਟ ਤੇ ਖਰਾਬ ਹੋ ਗਿਆ।", "WRONG_SCOPE", 1, "SITE", "MODERATE", "LOW", "A genuine airport disruption with insufficient operational coverage."),
  ],
  signal: [
    credible("signal-platform-display", "A platform display system briefly failed at one station.", "एक स्टेशन पर प्लेटफॉर्म डिस्प्ले प्रणाली थोड़ी देर के लिए बंद हुई।", "ਇੱਕ ਸਟੇਸ਼ਨ ਤੇ ਪਲੇਟਫਾਰਮ ਡਿਸਪਲੇ ਪ੍ਰਣਾਲੀ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਬੰਦ ਹੋ ਗਈ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A realistic rail incident that is too small to explain network movement."),
    credible("signal-branch-points", "A points failure slowed trains on a different branch line.", "दूसरी शाखा लाइन पर पॉइंट्स की खराबी से ट्रेनें धीमी हुईं।", "ਦੂਜੀ ਬਰਾਂਚ ਲਾਈਨ ਉੱਤੇ ਪੌਇੰਟਸ ਦੀ ਖਰਾਬੀ ਕਾਰਨ ਰੇਲਾਂ ਹੌਲੀਆਂ ਹੋਈਆਂ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A credible railway cause located outside the affected section."),
  ],
  bridge: [
    credible("bridge-service-lane-collision", "A minor collision slowed traffic in one service lane.", "एक छोटी टक्कर से एक सर्विस लेन में यातायात धीमा हुआ।", "ਇੱਕ ਛੋਟੀ ਟੱਕਰ ਕਾਰਨ ਇੱਕ ਸਰਵਿਸ ਲੇਨ ਵਿੱਚ ਆਵਾਜਾਈ ਹੌਲੀ ਹੋ ਗਈ।", "WEAK_CAUSE", 1, "LOCAL", "LOW", "LOW", "A familiar road cause whose magnitude is too low for a city-route outcome."),
    credible("bridge-feeder-roadwork", "Roadwork closed a lane on a nearby feeder road.", "पास की फीडर सड़क पर सड़क कार्य से एक लेन बंद हुई।", "ਨੇੜਲੀ ਫੀਡਰ ਸੜਕ ਉੱਤੇ ਕੰਮ ਕਾਰਨ ਇੱਕ ਲੇਨ ਬੰਦ ਹੋਈ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A plausible traffic explanation with narrower route coverage."),
  ],
  "waterlogged-rail": [
    credible("waterlogged-rail-signal-check", "A short signal check delayed one platform departure.", "एक छोटे सिग्नल परीक्षण से एक प्लेटफॉर्म की रवानगी में देरी हुई।", "ਇੱਕ ਛੋਟੀ ਸਿਗਨਲ ਜਾਂਚ ਕਾਰਨ ਇੱਕ ਪਲੇਟਫਾਰਮ ਦੀ ਰਵਾਨਗੀ ਵਿੱਚ ਦੇਰੀ ਹੋਈ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A believable rail delay that cannot account for a broader service failure."),
    credible("waterlogged-rail-bus", "A stalled bus blocked a side road near the station.", "स्टेशन के पास एक रुकी बस ने साइड रोड रोक दी।", "ਸਟੇਸ਼ਨ ਨੇੜੇ ਖੜ੍ਹੀ ਬੱਸ ਨੇ ਸਾਈਡ ਰੋਡ ਰੋਕ ਦਿੱਤੀ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A credible transport event with the wrong network scope."),
    clear("waterlogged-rail-alert", "Rail officials issued a service alert after the cancellations began.", "रद्दीकरण शुरू होने के बाद रेल अधिकारियों ने सेवा चेतावनी जारी की।", "ਰੱਦਗੀਆਂ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਰੇਲ ਅਧਿਕਾਰੀਆਂ ਨੇ ਸੇਵਾ ਚੇਤਾਵਨੀ ਜਾਰੀ ਕੀਤੀ।", "REVERSE_CAUSATION", 4, "REGIONAL", "MODERATE", "LOW", "A natural operational response that occurs too late to be causal."),
  ],
  server: [
    credible("server-maintenance-window", "A brief maintenance window slowed one online application form.", "एक छोटे रखरखाव समय ने एक ऑनलाइन आवेदन फॉर्म को धीमा किया।", "ਇੱਕ ਛੋਟੇ ਰੱਖ-ਰਖਾਵ ਸਮੇਂ ਨੇ ਇੱਕ ਆਨਲਾਈਨ ਅਰਜ਼ੀ ਫਾਰਮ ਨੂੰ ਹੌਲਾ ਕਰ ਦਿੱਤਾ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A realistic digital-service issue with insufficient scale."),
    credible("server-payment-gateway", "A payment gateway failed for applicants in a different district.", "दूसरे जिले के आवेदकों के लिए भुगतान गेटवे बंद हुआ।", "ਦੂਜੇ ਜ਼ਿਲ੍ਹੇ ਦੇ ਅਰਜ਼ੀਦਾਰਾਂ ਲਈ ਭੁਗਤਾਨ ਗੇਟਵੇ ਬੰਦ ਹੋ ਗਿਆ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A credible online-service failure affecting the wrong group."),
    clear("server-extra-counters", "The help desk opened extra counters after applicants began arriving.", "आवेदकों के आने के बाद सहायता डेस्क ने अतिरिक्त काउंटर खोले।", "ਅਰਜ਼ੀਦਾਰ ਆਉਣ ਤੋਂ ਬਾਅਦ ਸਹਾਇਤਾ ਡੈਸਕ ਨੇ ਵਾਧੂ ਕਾਊਂਟਰ ਖੋਲ੍ਹੇ।", "REVERSE_CAUSATION", 4, "SITE", "MODERATE", "LOW", "A sensible response to congestion, not its cause."),
  ],
  pump: [
    credible("pump-valve-test", "A valve test briefly reduced water flow to one street.", "वाल्व परीक्षण ने एक सड़क पर पानी का प्रवाह थोड़ी देर के लिए घटाया।", "ਵਾਲਵ ਜਾਂਚ ਨੇ ਇੱਕ ਸੜਕ ਵੱਲ ਪਾਣੀ ਦਾ ਵਹਾਅ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਘਟਾਇਆ।", "WEAK_CAUSE", 1, "LOCAL", "LOW", "LOW", "A real utility event that is too small for the observed supply impact."),
    credible("pump-other-zone", "A maintenance crew shut a small pump in another supply zone.", "रखरखाव दल ने दूसरे आपूर्ति क्षेत्र का छोटा पंप बंद किया।", "ਰੱਖ-ਰਖਾਵ ਟੀਮ ਨੇ ਦੂਜੇ ਸਪਲਾਈ ਖੇਤਰ ਦਾ ਛੋਟਾ ਪੰਪ ਬੰਦ ਕੀਤਾ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A plausible pumping issue with mismatched service coverage."),
    clear("pump-pressure-adjustment", "Technicians increased pressure after the supply line had fallen.", "आपूर्ति लाइन का दबाव घटने के बाद तकनीशियनों ने दबाव बढ़ाया।", "ਸਪਲਾਈ ਲਾਈਨ ਦਾ ਦਬਾਅ ਘਟਣ ਤੋਂ ਬਾਅਦ ਤਕਨੀਸ਼ੀਅਨਾਂ ਨੇ ਦਬਾਅ ਵਧਾਇਆ।", "REVERSE_CAUSATION", 4, "LOCAL", "HIGH", "MODERATE", "A natural corrective action that follows the observation."),
  ],
  metro: [
    credible("metro-signal-fault", "A traffic signal fault briefly slowed one junction.", "सिग्नल की खराबी से एक चौराहे पर यातायात थोड़ी देर धीमा हुआ।", "ਸਿਗਨਲ ਦੀ ਖਰਾਬੀ ਕਾਰਨ ਇੱਕ ਚੌਰਾਹੇ ਉੱਤੇ ਆਵਾਜਾਈ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਹੌਲੀ ਹੋਈ।", "WEAK_CAUSE", 1, "CITY", "LOW", "LOW", "A credible road delay that cannot explain a large commuter shift."),
    credible("metro-concert", "A concert ended near a different metro station.", "एक संगीत कार्यक्रम दूसरे मेट्रो स्टेशन के पास समाप्त हुआ।", "ਇੱਕ ਸੰਗੀਤ ਸਮਾਰੋਹ ਦੂਜੇ ਮੈਟਰੋ ਸਟੇਸ਼ਨ ਨੇੜੇ ਖਤਮ ਹੋਇਆ।", "WRONG_SCOPE", 1, "SITE", "MODERATE", "MODERATE", "A realistic passenger-demand alternative at the wrong station area."),
    clear("metro-extra-coaches", "Metro operators added coaches after ridership increased.", "यात्री संख्या बढ़ने के बाद मेट्रो संचालकों ने कोच जोड़े।", "ਯਾਤਰੀ ਗਿਣਤੀ ਵਧਣ ਤੋਂ ਬਾਅਦ ਮੈਟਰੋ ਸੰਚਾਲਕਾਂ ਨੇ ਕੋਚ ਜੋੜੇ।", "REVERSE_CAUSATION", 4, "CITY", "MODERATE", "LOW", "A realistic response rather than an explanation of increased use."),
  ],
  vegetables: [
    credible("vegetables-late-van", "One delivery van arrived late with a small load of vegetables.", "एक डिलीवरी वैन सब्जियों की छोटी खेप के साथ देर से पहुँची।", "ਇੱਕ ਡਿਲੀਵਰੀ ਵੈਨ ਸਬਜ਼ੀਆਂ ਦੀ ਛੋਟੀ ਖੇਪ ਨਾਲ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀ।", "WEAK_CAUSE", 1, "REGIONAL", "LOW", "LOW", "A familiar supply issue that is too small to explain the town-wide change."),
    credible("vegetables-stall-cleaning", "A local market closed one vegetable stall for cleaning.", "स्थानीय बाजार ने सफाई के लिए एक सब्जी स्टॉल बंद किया।", "ਸਥਾਨਕ ਬਾਜ਼ਾਰ ਨੇ ਸਫ਼ਾਈ ਲਈ ਇੱਕ ਸਬਜ਼ੀ ਸਟਾਲ ਬੰਦ ਕੀਤਾ।", "WRONG_SCOPE", 1, "SITE", "LOW", "LOW", "A real retail event with insufficient market coverage."),
    clear("vegetables-price-rise", "Shopkeepers raised prices after supplies had already fallen.", "आपूर्ति घटने के बाद दुकानदारों ने कीमतें बढ़ाईं।", "ਸਪਲਾਈ ਘਟਣ ਤੋਂ ਬਾਅਦ ਦੁਕਾਨਦਾਰਾਂ ਨੇ ਕੀਮਤਾਂ ਵਧਾਈਆਂ।", "REVERSE_CAUSATION", 4, "REGIONAL", "HIGH", "MODERATE", "A natural consequence of shortage, not its original cause."),
  ],
  "exam-centre": [
    credible("exam-centre-security-check", "A short security check delayed a few candidates at one gate.", "एक छोटे सुरक्षा जांच से एक गेट पर कुछ उम्मीदवारों को देर हुई।", "ਇੱਕ ਛੋਟੀ ਸੁਰੱਖਿਆ ਜਾਂਚ ਕਾਰਨ ਇੱਕ ਗੇਟ ਤੇ ਕੁਝ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਦੇਰੀ ਹੋਈ।", "WEAK_CAUSE", 1, "LOCAL", "LOW", "LOW", "A credible exam-day delay with insufficient scale."),
    credible("exam-centre-parking", "A parking shortage affected a coaching centre in another locality.", "पार्किंग की कमी ने दूसरी बस्ती के कोचिंग केंद्र को प्रभावित किया।", "ਪਾਰਕਿੰਗ ਦੀ ਘਾਟ ਨੇ ਦੂਜੇ ਇਲਾਕੇ ਦੇ ਕੋਚਿੰਗ ਕੇਂਦਰ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕੀਤਾ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A plausible candidate-arrival problem in the wrong location."),
    clear("exam-centre-reporting-time", "The centre extended reporting time after late-entry requests began.", "देर से प्रवेश के अनुरोध शुरू होने के बाद केंद्र ने रिपोर्टिंग समय बढ़ाया।", "ਦੇਰੀ ਨਾਲ ਦਾਖਲੇ ਦੀਆਂ ਬੇਨਤੀਆਂ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਕੇਂਦਰ ਨੇ ਰਿਪੋਰਟਿੰਗ ਸਮਾਂ ਵਧਾਇਆ।", "REVERSE_CAUSATION", 4, "LOCAL", "MODERATE", "LOW", "A reasonable administrative response that happens after the problem."),
  ],
  landslide: [
    credible("landslide-loose-stones", "Loose stones briefly blocked one lane of the hill road.", "ढीले पत्थरों ने पहाड़ी सड़क की एक लेन कुछ समय के लिए रोकी।", "ਢਿੱਲੇ ਪੱਥਰਾਂ ਨੇ ਪਹਾੜੀ ਸੜਕ ਦੀ ਇੱਕ ਲੇਨ ਕੁਝ ਸਮੇਂ ਲਈ ਰੋਕੀ।", "WEAK_CAUSE", 1, "REGIONAL", "LOW", "LOW", "A credible hill-road event with insufficient magnitude."),
    credible("landslide-tractor", "A tractor broke down on a village approach road.", "एक ट्रैक्टर गाँव की पहुंच सड़क पर खराब हो गया।", "ਇੱਕ ਟਰੈਕਟਰ ਪਿੰਡ ਦੀ ਪਹੁੰਚ ਸੜਕ ਉੱਤੇ ਖਰਾਬ ਹੋ ਗਿਆ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A real transport obstruction outside the relevant supply route."),
    clear("landslide-diversion-notice", "The road authority announced a diversion after deliveries had already slowed.", "डिलीवरी धीमी होने के बाद सड़क प्राधिकरण ने मार्ग परिवर्तन घोषित किया।", "ਡਿਲੀਵਰੀਆਂ ਹੌਲੀਆਂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਸੜਕ ਪ੍ਰਾਧਿਕਰਨ ਨੇ ਰਸਤਾ ਬਦਲਣ ਦੀ ਘੋਸ਼ਣਾ ਕੀਤੀ।", "REVERSE_CAUSATION", 4, "REGIONAL", "MODERATE", "LOW", "A sensible response occurring after the observed outcome."),
  ],
  drainage: [
    credible("drainage-leaves", "Leaves blocked a small roadside drain for a few minutes.", "पत्तियों ने एक छोटे सड़क किनारे नाले को कुछ मिनटों के लिए रोका।", "ਪੱਤਿਆਂ ਨੇ ਇੱਕ ਛੋਟੇ ਸੜਕ ਕਿਨਾਰੇ ਨਾਲੇ ਨੂੰ ਕੁਝ ਮਿੰਟਾਂ ਲਈ ਰੋਕਿਆ।", "WEAK_CAUSE", 1, "LOCAL", "LOW", "LOW", "A natural drainage event that lacks the scale to explain the delivery pattern."),
    credible("drainage-stalled-van", "A delivery van stalled in a nearby lane.", "एक डिलीवरी वैन पास की गली में रुक गई।", "ਇੱਕ ਡਿਲੀਵਰੀ ਵੈਨ ਨੇੜਲੀ ਗਲੀ ਵਿੱਚ ਰੁਕ ਗਈ।", "WRONG_SCOPE", 1, "SITE", "LOW", "LOW", "A credible delivery disruption with narrow coverage."),
    clear("drainage-pumping-request", "Residents requested pumping after parcels began arriving late.", "पार्सल देर से आने के बाद निवासियों ने पंपिंग की मांग की।", "ਪਾਰਸਲ ਦੇਰ ਨਾਲ ਆਉਣ ਤੋਂ ਬਾਅਦ ਨਿਵਾਸੀਆਂ ਨੇ ਪੰਪਿੰਗ ਦੀ ਮੰਗ ਕੀਤੀ।", "REVERSE_CAUSATION", 4, "LOCAL", "MODERATE", "LOW", "A realistic consequence of flooding rather than its cause."),
  ],
  "cold-storage": [
    credible("cold-storage-power-fluctuation", "A short power fluctuation paused one loading bay.", "बिजली के छोटे उतार-चढ़ाव से एक लोडिंग बे रुका।", "ਬਿਜਲੀ ਦੇ ਛੋਟੇ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਕਾਰਨ ਇੱਕ ਲੋਡਿੰਗ ਬੇ ਰੁਕ ਗਿਆ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A realistic warehouse interruption with limited magnitude."),
    credible("cold-storage-forklift", "A forklift needed repair in a different warehouse section.", "दूसरे गोदाम हिस्से में एक फोर्कलिफ्ट को मरम्मत चाहिए थी।", "ਗੋਦਾਮ ਦੇ ਦੂਜੇ ਹਿੱਸੇ ਵਿੱਚ ਇੱਕ ਫੋਰਕਲਿਫਟ ਨੂੰ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਸੀ।", "WRONG_SCOPE", 1, "SITE", "MODERATE", "MODERATE", "A plausible logistics event in the wrong operating area."),
    clear("cold-storage-extra-trucks", "Managers arranged extra trucks after the dispatch delay was noticed.", "डिस्पैच में देरी दिखने के बाद प्रबंधकों ने अतिरिक्त ट्रक लगाए।", "ਡਿਸਪੈਚ ਵਿੱਚ ਦੇਰੀ ਦਿਖਣ ਤੋਂ ਬਾਅਦ ਪ੍ਰਬੰਧਕਾਂ ਨੇ ਵਾਧੂ ਟਰੱਕ ਲਗਾਏ।", "REVERSE_CAUSATION", 4, "SITE", "MODERATE", "LOW", "A natural corrective action after the delay."),
  ],
  roadwork: [
    credible("roadwork-delivery-truck", "A delivery truck paused briefly in one lane.", "एक डिलीवरी ट्रक एक लेन में थोड़ी देर रुका।", "ਇੱਕ ਡਿਲੀਵਰੀ ਟਰੱਕ ਇੱਕ ਲੇਨ ਵਿੱਚ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਰੁਕਿਆ।", "WEAK_CAUSE", 1, "CITY", "LOW", "LOW", "A familiar road delay that cannot account for the wider queue."),
    credible("roadwork-school-bus-stop", "A school-bus stop was moved on a nearby street.", "पास की सड़क पर स्कूल बस स्टॉप बदला गया।", "ਨੇੜਲੀ ਸੜਕ ਉੱਤੇ ਸਕੂਲ ਬੱਸ ਸਟਾਪ ਬਦਲਿਆ ਗਿਆ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A real traffic change with insufficient route coverage."),
  ],
  drill: [
    credible("drill-projector", "A classroom projector fault paused one lesson.", "कक्षा के प्रोजेक्टर की खराबी से एक पाठ रुका।", "ਕਲਾਸਰੂਮ ਪ੍ਰੋਜੈਕਟਰ ਦੀ ਖਰਾਬੀ ਕਾਰਨ ਇੱਕ ਪਾਠ ਰੁਕਿਆ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A natural school interruption too small for the whole-school outcome."),
    credible("drill-sports-practice", "A sports practice used a different school corridor.", "खेल अभ्यास ने स्कूल के दूसरे गलियारे का उपयोग किया।", "ਖੇਡ ਅਭਿਆਸ ਨੇ ਸਕੂਲ ਦੇ ਦੂਜੇ ਗਲਿਆਰੇ ਦੀ ਵਰਤੋਂ ਕੀਤੀ।", "WRONG_SCOPE", 1, "SITE", "LOW", "LOW", "A plausible school event that does not cover the affected classes."),
  ],
  cleaning: [
    credible("cleaning-supplier-van", "A supplier's van waited briefly at one shop entrance.", "एक आपूर्तिकर्ता की वैन एक दुकान के प्रवेश पर थोड़ी देर रुकी।", "ਇੱਕ ਸਪਲਾਇਰ ਦੀ ਵੈਨ ਇੱਕ ਦੁਕਾਨ ਦੇ ਦਾਖਲੇ ਤੇ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਰੁਕੀ।", "WEAK_CAUSE", 1, "LOCAL", "LOW", "LOW", "A real delivery delay with too little coverage."),
    credible("cleaning-bakery-power-cut", "A power cut affected a bakery in the next block.", "अगले ब्लॉक की एक बेकरी बिजली कटौती से प्रभावित हुई।", "ਅਗਲੇ ਬਲਾਕ ਦੀ ਇੱਕ ਬੇਕਰੀ ਬਿਜਲੀ ਕੱਟ ਤੋਂ ਪ੍ਰਭਾਵਿਤ ਹੋਈ।", "WRONG_SCOPE", 1, "SITE", "MODERATE", "MODERATE", "A credible local disruption outside the market-access problem."),
  ],
  supply: [
    credible("supply-pallet-check", "One loader paused briefly to check a pallet.", "एक लोडर पैलेट जांचने के लिए थोड़ी देर रुका।", "ਇੱਕ ਲੋਡਰ ਪੈਲੇਟ ਜਾਂਚਣ ਲਈ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਰੁਕਿਆ।", "WEAK_CAUSE", 1, "REGIONAL", "LOW", "LOW", "A normal warehouse delay that is too small to explain the stock outcome."),
    credible("supply-shelf-rearrangement", "A local shop rearranged shelves during opening hours.", "एक स्थानीय दुकान ने खुलने के समय अलमारियाँ व्यवस्थित कीं।", "ਇੱਕ ਸਥਾਨਕ ਦੁਕਾਨ ਨੇ ਖੁੱਲ੍ਹਣ ਦੇ ਸਮੇਂ ਸ਼ੈਲਫਾਂ ਸਜਾਈਆਂ।", "WRONG_SCOPE", 1, "SITE", "MODERATE", "LOW", "A real shop event that cannot explain an upstream supply failure."),
    clear("supply-apology", "The warehouse sent an apology after stock reached the shop late.", "स्टॉक देर से पहुँचने के बाद गोदाम ने माफी भेजी।", "ਸਟਾਕ ਦੇਰ ਨਾਲ ਪਹੁੰਚਣ ਤੋਂ ਬਾਅਦ ਗੋਦਾਮ ਨੇ ਮਾਫ਼ੀ ਭੇਜੀ।", "REVERSE_CAUSATION", 4, "REGIONAL", "MODERATE", "LOW", "A natural response after the delivery outcome."),
  ],
  ferry: [
    credible("ferry-ticket-check", "A ticket check held one vehicle for a few minutes.", "टिकट जांच ने एक वाहन को कुछ मिनटों के लिए रोका।", "ਟਿਕਟ ਜਾਂਚ ਨੇ ਇੱਕ ਵਾਹਨ ਨੂੰ ਕੁਝ ਮਿੰਟਾਂ ਲਈ ਰੋਕਿਆ।", "WEAK_CAUSE", 1, "REGIONAL", "LOW", "LOW", "A genuine crossing delay with insufficient magnitude."),
    credible("ferry-other-crossing", "A roadside repair slowed cars near another river crossing.", "सड़क किनारे की मरम्मत ने दूसरे नदी पार स्थान के पास कारों को धीमा किया।", "ਸੜਕ ਕਿਨਾਰੇ ਮੁਰੰਮਤ ਨੇ ਦੂਜੇ ਦਰਿਆ ਪਾਰ ਸਥਾਨ ਨੇੜੇ ਕਾਰਾਂ ਨੂੰ ਹੌਲਾ ਕੀਤਾ।", "WRONG_SCOPE", 1, "LOCAL", "MODERATE", "MODERATE", "A plausible travel problem at the wrong crossing."),
    clear("ferry-extra-sailing", "The operator added an extra sailing after goods reached the market late.", "सामान देर से बाजार पहुँचने के बाद संचालक ने अतिरिक्त फेरी चलाई।", "ਸਮਾਨ ਦੇਰ ਨਾਲ ਬਾਜ਼ਾਰ ਪਹੁੰਚਣ ਤੋਂ ਬਾਅਦ ਸੰਚਾਲਕ ਨੇ ਵਾਧੂ ਫੇਰੀ ਚਲਾਈ।", "REVERSE_CAUSATION", 4, "REGIONAL", "MODERATE", "LOW", "A realistic operational response after the result."),
  ],
  printer: [
    credible("printer-form-check", "One clerk paused briefly to verify a form.", "एक क्लर्क फॉर्म सत्यापित करने के लिए थोड़ी देर रुका।", "ਇੱਕ ਕਲਰਕ ਫਾਰਮ ਦੀ ਤਸਦੀਕ ਕਰਨ ਲਈ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਰੁਕਿਆ।", "WEAK_CAUSE", 1, "SITE", "LOW", "LOW", "A normal office delay with insufficient scale."),
    credible("printer-visitor-register", "A nearby office changed its visitor-register system.", "पास के कार्यालय ने अपनी आगंतुक रजिस्टर प्रणाली बदली।", "ਨੇੜਲੇ ਦਫ਼ਤਰ ਨੇ ਆਪਣੀ ਮਹਿਮਾਨ ਰਜਿਸਟਰ ਪ੍ਰਣਾਲੀ ਬਦਲੀ।", "WRONG_SCOPE", 1, "SITE", "MODERATE", "LOW", "A realistic office change outside the certificate workflow."),
    clear("printer-delay-notice", "The office sent delay notices after certificates were issued late.", "प्रमाणपत्र देर से जारी होने के बाद कार्यालय ने देरी की सूचना भेजी।", "ਸਰਟੀਫਿਕੇਟ ਦੇਰ ਨਾਲ ਜਾਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦਫ਼ਤਰ ਨੇ ਦੇਰੀ ਦੀ ਸੂਚਨਾ ਭੇਜੀ।", "REVERSE_CAUSATION", 4, "SITE", "MODERATE", "LOW", "A natural response occurring after the observation."),
  ],
};

export function semanticCandidatesForVariant(variantId: string): readonly CaeSemanticCandidateAuthority[] {
  return BY_VARIANT[variantId] ?? [];
}
