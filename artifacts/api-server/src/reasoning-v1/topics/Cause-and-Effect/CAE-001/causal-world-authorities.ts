import type {
  CaeCandidateAuthority,
  CaeCausalWorld,
  CaeProjectionAuthority,
  CaeScenarioFamilyAuthority,
  CaeScenarioNodeUnit,
  CaeScenarioVariant,
  LocalizedText,
} from "./types.ts";

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
type EventText = readonly [string, string, string];
const e = (en: string, hi: string, pa: string): EventText => [en, hi, pa];

const unit = (semanticSlot: string, role: CaeScenarioNodeUnit["role"], temporalOrder: number, value: EventText, primaryEffect = role === "EFFECT"): CaeScenarioNodeUnit => ({
  semanticSlot,
  role,
  temporalOrder,
  scope: "CITY",
  magnitude: role === "CAUSE" ? "HIGH" : "MODERATE",
  severity: role === "CAUSE" ? "HIGH" : "MODERATE",
  primaryEffect,
  text: l(...value),
});

const candidate = (
  id: string,
  value: EventText,
  mechanism: CaeCandidateAuthority["mechanism"],
  timingFit: CaeCandidateAuthority["timingFit"],
  scopeFit: CaeCandidateAuthority["scopeFit"],
  magnitudeFit: CaeCandidateAuthority["magnitudeFit"],
  causalDistance: number | null,
): CaeCandidateAuthority => ({ id, text: l(...value), mechanism, timingFit, scopeFit, magnitudeFit, causalDistance });

const neutral = (en: string, hi: string, pa: string) => l(en, hi, pa);
const defaultCandidates = (prefix: string): readonly CaeCandidateAuthority[] => [
  candidate(`${prefix}-weak`, e("A brief, minor disturbance affected one small part of the area.", "क्षेत्र के एक छोटे हिस्से में थोड़ी देर के लिए मामूली बाधा आई।", "ਇਲਾਕੇ ਦੇ ਇੱਕ ਛੋਟੇ ਹਿੱਸੇ ਵਿੱਚ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਮਾਮੂਲੀ ਰੁਕਾਵਟ ਆਈ।"), "WEAK_CAUSE", "ALIGNED", "TOO_NARROW", "TOO_WEAK", 1),
  candidate(`${prefix}-scope`, e("An event affected a different local service, not the reported operation.", "एक घटना ने किसी दूसरी स्थानीय सेवा को प्रभावित किया, बताई गई व्यवस्था को नहीं।", "ਇੱਕ ਘਟਨਾ ਨੇ ਕਿਸੇ ਹੋਰ ਸਥਾਨਕ ਸੇਵਾ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕੀਤਾ, ਦੱਸੀ ਗਈ ਵਿਵਸਥਾ ਨੂੰ ਨਹੀਂ।"), "WRONG_SCOPE", "ALIGNED", "TOO_BROAD", "ALIGNED", null),
  candidate(`${prefix}-late`, e("The reported outcome became visible later in the day.", "बताया गया परिणाम दिन में बाद में दिखाई दिया।", "ਦੱਸੀ ਗਈ ਘਟਨਾ ਦਿਨ ਵਿੱਚ ਬਾਅਦ ਵਿੱਚ ਨਜ਼ਰ ਆਈ।"), "REVERSE_CAUSATION", "LATE", "ALIGNED", "ALIGNED", null),
];

const chainVariant = (
  id: string,
  backdrop: LocalizedText,
  cause: EventText,
  bridge: EventText,
  effect: EventText,
  terminal: EventText,
  candidates: readonly CaeCandidateAuthority[] = defaultCandidates(id),
): CaeScenarioVariant => ({
  id,
  backdrop,
  nodes: [unit("cause", "CAUSE", 1, cause), unit("bridge", "INTERMEDIATE", 2, bridge, false), unit("effect", "EFFECT", 3, effect), unit("terminal", "EFFECT", 4, terminal, false)],
  edgeBindings: [{ from: "cause", to: "bridge" }, { from: "bridge", to: "effect" }, { from: "effect", to: "terminal", temporalRelation: "SHORT_DELAY" }],
  competingCandidates: candidates,
});

const branchVariant = (
  id: string,
  backdrop: LocalizedText,
  cause: EventText,
  first: EventText,
  second: EventText,
): CaeScenarioVariant => ({
  id,
  backdrop,
  nodes: [unit("cause", "CAUSE", 1, cause), unit("first-effect", "EFFECT", 2, first), unit("second-effect", "EFFECT", 2, second)],
  edgeBindings: [{ from: "cause", to: "first-effect" }, { from: "cause", to: "second-effect" }],
  competingCandidates: defaultCandidates(id),
});

const parallelVariant = (
  id: string,
  backdrop: LocalizedText,
  firstCause: EventText,
  firstEffect: EventText,
  secondCause: EventText,
  secondEffect: EventText,
): CaeScenarioVariant => ({
  id,
  backdrop,
  nodes: [unit("first-cause", "CAUSE", 1, firstCause), unit("first-effect", "EFFECT", 2, firstEffect), unit("second-cause", "CAUSE", 1, secondCause), unit("second-effect", "EFFECT", 2, secondEffect)],
  edgeBindings: [{ from: "first-cause", to: "first-effect" }, { from: "second-cause", to: "second-effect" }],
  competingCandidates: defaultCandidates(id),
});

const constraints = Object.freeze({
  hiddenCanonicalRoles: ["CAUSE", "INTERMEDIATE", "COMPETING"] as const,
  contextMustBeNeutral: true,
  prohibitAnswerInStem: true,
  prohibitIndependenceCue: true,
  explanationMustShowStructure: true,
});

/**
 * Families are composable causal units. A seed selects a compatible family,
 * variant, and graph substructure; these are not finished question records.
 */
export const CAE_001_SCENARIO_FAMILIES = [
  {
    id: "CAE-FAM-OPERATIONS-CHAIN",
    domain: "TRANSPORT",
    topology: "DIRECT_CHAIN",
    allowedProjectionKinds: ["DIRECT_RELATIONSHIP", "PROBABLE_CAUSE", "PROBABLE_EFFECT", "INDIRECT_CAUSAL_CHAIN", "MULTI_EVENT_SEQUENCE", "MISSING_CAUSAL_LINK"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      chainVariant("fog", neutral("At an airport during the morning shift.", "सुबह की पाली में एक हवाई अड्डे पर।", "ਸਵੇਰ ਦੀ ਡਿਊਟੀ ਦੌਰਾਨ ਇੱਕ ਹਵਾਈ ਅੱਡੇ ਤੇ।"), e("Dense fog formed around the airport.", "हवाई अड्डे के आसपास घना कोहरा छा गया।", "ਹਵਾਈ ਅੱਡੇ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਘਣੀ ਧੁੰਦ ਛਾ ਗਈ।"), e("Visibility on the runway fell sharply.", "रनवे पर दृश्यता बहुत कम हो गई।", "ਰਨਵੇ ਉੱਤੇ ਦ੍ਰਿਸ਼ਟਤਾ ਬਹੁਤ ਘੱਟ ਹੋ ਗਈ।"), e("Several departures were delayed.", "कई उड़ानों की रवानगी में देरी हुई।", "ਕਈ ਉਡਾਣਾਂ ਦੀ ਰਵਾਨਗੀ ਵਿੱਚ ਦੇਰੀ ਹੋਈ।"), e("Passengers were moved to later flights.", "यात्रियों को बाद की उड़ानों में भेजा गया।", "ਯਾਤਰੀਆਂ ਨੂੰ ਬਾਅਦ ਦੀਆਂ ਉਡਾਣਾਂ ਵਿੱਚ ਭੇਜਿਆ ਗਿਆ।")),
      chainVariant("signal", neutral("At a suburban rail station before office hours.", "कार्यालय समय से पहले एक उपनगरीय रेल स्टेशन पर।", "ਦਫ਼ਤਰੀ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਉਪਨਗਰੀ ਰੇਲ ਸਟੇਸ਼ਨ ਤੇ।"), e("A signal fault was detected on one rail section.", "रेल के एक हिस्से में सिग्नल की खराबी मिली।", "ਰੇਲ ਦੇ ਇੱਕ ਹਿੱਸੇ ਵਿੱਚ ਸਿਗਨਲ ਦੀ ਖਰਾਬੀ ਮਿਲੀ।"), e("Trains were instructed to move cautiously through that section.", "ट्रेनों को उस हिस्से से सावधानी से चलने का निर्देश दिया गया।", "ਰੇਲਾਂ ਨੂੰ ਉਸ ਹਿੱਸੇ ਵਿੱਚੋਂ ਸਾਵਧਾਨੀ ਨਾਲ ਚਲਣ ਲਈ ਕਿਹਾ ਗਿਆ।"), e("Train movement slowed down.", "ट्रेनों की आवाजाही धीमी हो गई।", "ਰੇਲਾਂ ਦੀ ਆਵਾਜਾਈ ਹੌਲੀ ਹੋ ਗਈ।"), e("Commuters reached later than usual.", "यात्री सामान्य से देर से पहुँचे।", "ਯਾਤਰੀ ਆਮ ਤੋਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚੇ।")),
      chainVariant("bridge", neutral("On a major city route in the afternoon.", "दोपहर में एक प्रमुख शहर मार्ग पर।", "ਦੁਪਹਿਰ ਵੇਲੇ ਇੱਕ ਮੁੱਖ ਸ਼ਹਿਰੀ ਰਸਤੇ ਤੇ।"), e("A bridge was closed for urgent repairs.", "एक पुल को तुरंत मरम्मत के लिए बंद किया गया।", "ਇੱਕ ਪੁਲ ਨੂੰ ਤੁਰੰਤ ਮੁਰੰਮਤ ਲਈ ਬੰਦ ਕੀਤਾ ਗਿਆ।"), e("Traffic was diverted through nearby streets.", "यातायात को आस-पास की सड़कों से मोड़ा गया।", "ਆਵਾਜਾਈ ਨੂੰ ਨੇੜਲੀਆਂ ਸੜਕਾਂ ਰਾਹੀਂ ਮੋੜਿਆ ਗਿਆ।"), e("Travel time on the route increased.", "मार्ग पर यात्रा का समय बढ़ गया।", "ਰਸਤੇ ਉੱਤੇ ਯਾਤਰਾ ਦਾ ਸਮਾਂ ਵੱਧ ਗਿਆ।"), e("More commuters chose the metro.", "अधिक यात्रियों ने मेट्रो चुनी।", "ਵੱਧ ਯਾਤਰੀਆਂ ਨੇ ਮੈਟਰੋ ਚੁਣੀ।")),
    ],
  },
  {
    id: "CAE-FAM-SHARED-PRESSURE",
    domain: "UTILITIES",
    topology: "BRANCHING_COMMON_CAUSE",
    allowedProjectionKinds: ["DIRECT_RELATIONSHIP", "COMMON_OR_INDEPENDENT", "PROBABLE_EFFECT"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      branchVariant("heat", neutral("In a town over several summer days.", "गर्मी के कई दिनों में एक कस्बे में।", "ਗਰਮੀ ਦੇ ਕਈ ਦਿਨਾਂ ਦੌਰਾਨ ਇੱਕ ਕਸਬੇ ਵਿੱਚ।"), e("A prolonged heatwave affected the town.", "कस्बा लंबे समय तक गर्मी की लहर से प्रभावित रहा।", "ਕਸਬਾ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਗਰਮੀ ਦੀ ਲਹਿਰ ਤੋਂ ਪ੍ਰਭਾਵਿਤ ਰਿਹਾ।"), e("Water consumption rose sharply.", "पानी की खपत बहुत बढ़ गई।", "ਪਾਣੀ ਦੀ ਖਪਤ ਕਾਫ਼ੀ ਵੱਧ ਗਈ।"), e("Demand for electricity rose sharply.", "बिजली की माँग बहुत बढ़ गई।", "ਬਿਜਲੀ ਦੀ ਮੰਗ ਕਾਫ਼ੀ ਵੱਧ ਗਈ।")),
      branchVariant("festival", neutral("In the central market during a local festival.", "स्थानीय उत्सव के दौरान केंद्रीय बाजार में।", "ਸਥਾਨਕ ਮੇਲੇ ਦੌਰਾਨ ਕੇਂਦਰੀ ਬਾਜ਼ਾਰ ਵਿੱਚ।"), e("A large local festival began.", "एक बड़ा स्थानीय उत्सव शुरू हुआ।", "ਇੱਕ ਵੱਡਾ ਸਥਾਨਕ ਮੇਲਾ ਸ਼ੁਰੂ ਹੋਇਆ।"), e("Demand for local buses increased.", "स्थानीय बसों की माँग बढ़ गई।", "ਸਥਾਨਕ ਬੱਸਾਂ ਦੀ ਮੰਗ ਵੱਧ ਗਈ।"), e("Mobile data use in the area increased.", "क्षेत्र में मोबाइल डेटा का उपयोग बढ़ गया।", "ਇਲਾਕੇ ਵਿੱਚ ਮੋਬਾਈਲ ਡਾਟਾ ਦੀ ਵਰਤੋਂ ਵੱਧ ਗਈ।")),
      branchVariant("admissions", neutral("At a college-service centre during admissions week.", "प्रवेश सप्ताह में एक कॉलेज सेवा केंद्र पर।", "ਦਾਖਲਾ ਹਫ਼ਤੇ ਦੌਰਾਨ ਇੱਕ ਕਾਲਜ ਸੇਵਾ ਕੇਂਦਰ ਤੇ।"), e("College admissions opened for the new session.", "नए सत्र के लिए कॉलेज प्रवेश शुरू हुए।", "ਨਵੇਂ ਸੈਸ਼ਨ ਲਈ ਕਾਲਜ ਦਾਖਲੇ ਸ਼ੁਰੂ ਹੋਏ।"), e("Enquiries at the counselling desk increased.", "परामर्श डेस्क पर पूछताछ बढ़ गई।", "ਸਲਾਹ ਡੈਸਕ ਤੇ ਪੁੱਛਗਿੱਛ ਵੱਧ ਗਈ।"), e("Demand for student-hostel rooms increased.", "छात्रावास कमरों की माँग बढ़ गई।", "ਵਿਦਿਆਰਥੀ ਹੋਸਟਲ ਕਮਰਿਆਂ ਦੀ ਮੰਗ ਵੱਧ ਗਈ।")),
    ],
  },
  {
    id: "CAE-FAM-PARALLEL-INCIDENTS",
    domain: "MANUFACTURING",
    topology: "PARALLEL_CHAINS",
    allowedProjectionKinds: ["COMMON_OR_INDEPENDENT", "CORRELATION_CHECK"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      parallelVariant("factory-school", neutral("Two reports were received during the same day.", "एक ही दिन में दो रिपोर्ट मिलीं।", "ਇੱਕੋ ਦਿਨ ਵਿੱਚ ਦੋ ਰਿਪੋਰਟਾਂ ਮਿਲੀਆਂ।"), e("A technical fault occurred in a factory machine.", "एक फैक्टरी मशीन में तकनीकी खराबी आई।", "ਇੱਕ ਫੈਕਟਰੀ ਮਸ਼ੀਨ ਵਿੱਚ ਤਕਨੀਕੀ ਖਰਾਬੀ ਆਈ।"), e("Production at that factory paused temporarily.", "उस फैक्टरी का उत्पादन अस्थायी रूप से रुका।", "ਉਸ ਫੈਕਟਰੀ ਦਾ ਉਤਪਾਦਨ ਅਸਥਾਈ ਤੌਰ ਤੇ ਰੁਕਿਆ।"), e("Heavy rain fell near a school in another town.", "दूसरे कस्बे के एक स्कूल के पास तेज वर्षा हुई।", "ਦੂਜੇ ਕਸਬੇ ਦੇ ਇੱਕ ਸਕੂਲ ਨੇੜੇ ਤੇਜ਼ ਮੀਂਹ ਪਿਆ।"), e("That school closed for the day.", "वह स्कूल दिन भर के लिए बंद हुआ।", "ਉਹ ਸਕੂਲ ਦਿਨ ਲਈ ਬੰਦ ਹੋਇਆ।")),
      parallelVariant("pipe-clinic", neutral("Two municipal updates were issued that morning.", "उस सुबह दो नगरपालिका अपडेट जारी हुए।", "ਉਸ ਸਵੇਰੇ ਦੋ ਨਗਰ ਨਿਗਮ ਅਪਡੇਟ ਜਾਰੀ ਹੋਏ।"), e("A water pipe burst in one neighbourhood.", "एक मोहल्ले में पानी की पाइप फट गई।", "ਇੱਕ ਮੁਹੱਲੇ ਵਿੱਚ ਪਾਣੀ ਦੀ ਪਾਈਪ ਫੱਟ ਗਈ।"), e("Water supply there was interrupted.", "वहाँ पानी की आपूर्ति बाधित हुई।", "ਉੱਥੇ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਰੁਕ ਗਈ।"), e("A clinic updated its appointment software.", "एक क्लिनिक ने अपना अपॉइंटमेंट सॉफ्टवेयर अपडेट किया।", "ਇੱਕ ਕਲੀਨਿਕ ਨੇ ਆਪਣਾ ਅਪਾਇੰਟਮੈਂਟ ਸਾਫਟਵੇਅਰ ਅਪਡੇਟ ਕੀਤਾ।"), e("Online appointment slots briefly disappeared.", "ऑनलाइन अपॉइंटमेंट स्लॉट थोड़ी देर के लिए गायब हुए।", "ਆਨਲਾਈਨ ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਗਾਇਬ ਹੋਏ।")),
      parallelVariant("warehouse-library", neutral("Updates came from two different public services.", "दो अलग सार्वजनिक सेवाओं से अपडेट आए।", "ਦੋ ਵੱਖ-ਵੱਖ ਜਨਤਕ ਸੇਵਾਵਾਂ ਤੋਂ ਅਪਡੇਟ ਆਏ।"), e("A warehouse scanner stopped working.", "एक गोदाम का स्कैनर काम करना बंद कर गया।", "ਇੱਕ ਗੋਦਾਮ ਦਾ ਸਕੈਨਰ ਕੰਮ ਕਰਨਾ ਬੰਦ ਕਰ ਗਿਆ।"), e("Dispatch of packages slowed down.", "पार्सलों की भेजाई धीमी हो गई।", "ਪਾਰਸਲਾਂ ਦੀ ਭੇਜਾਈ ਹੌਲੀ ਹੋ ਗਈ।"), e("A library began its annual stock check.", "एक पुस्तकालय ने अपनी वार्षिक सूची जाँच शुरू की।", "ਇੱਕ ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਆਪਣੀ ਸਾਲਾਨਾ ਸੂਚੀ ਜਾਂਚ ਸ਼ੁਰੂ ਕੀਤੀ।"), e("Some books were temporarily unavailable for issue.", "कुछ पुस्तकें अस्थायी रूप से जारी नहीं हुईं।", "ਕੁਝ ਕਿਤਾਬਾਂ ਅਸਥਾਈ ਤੌਰ ਤੇ ਜਾਰੀ ਨਹੀਂ ਹੋਈਆਂ।")),
    ],
  },
  {
    id: "CAE-FAM-DIAGNOSTIC-DISRUPTION",
    domain: "INFRASTRUCTURE",
    topology: "DIRECT_CHAIN",
    allowedProjectionKinds: ["DIRECT_RELATIONSHIP", "PROBABLE_CAUSE", "PROBABLE_EFFECT", "COMPETING_EXPLANATION", "INDIRECT_CAUSAL_CHAIN"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      chainVariant("waterlogged-rail", neutral("At a rail section after a period of rain.", "बारिश के एक दौर के बाद रेल के एक हिस्से पर।", "ਮੀਂਹ ਦੇ ਇੱਕ ਦੌਰ ਤੋਂ ਬਾਅਦ ਰੇਲ ਦੇ ਇੱਕ ਹਿੱਸੇ ਤੇ।"), e("Continuous heavy rainfall occurred near the rail section.", "रेल हिस्से के पास लगातार तेज बारिश हुई।", "ਰੇਲ ਹਿੱਸੇ ਨੇੜੇ ਲਗਾਤਾਰ ਤੇਜ਼ ਮੀਂਹ ਪਿਆ।"), e("Water accumulated on the track section.", "पटरी के हिस्से पर पानी जमा हो गया।", "ਪਟੜੀ ਦੇ ਹਿੱਸੇ ਉੱਤੇ ਪਾਣੀ ਇਕੱਠਾ ਹੋ ਗਿਆ।"), e("Trains moved slowly through the section.", "ट्रेनें उस हिस्से से धीमी चलीं।", "ਰੇਲਾਂ ਉਸ ਹਿੱਸੇ ਵਿੱਚੋਂ ਹੌਲੀ ਚੱਲੀਆਂ।"), e("Several trains arrived late.", "कई ट्रेनें देर से पहुँचीं।", "ਕਈ ਰੇਲਾਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀਆਂ।")),
      chainVariant("server", neutral("At a public-service counter in the afternoon.", "दोपहर में एक सार्वजनिक सेवा काउंटर पर।", "ਦੁਪਹਿਰ ਵੇਲੇ ਇੱਕ ਜਨਤਕ ਸੇਵਾ ਕਾਊਂਟਰ ਤੇ।"), e("The service server received an unusually high number of requests.", "सेवा सर्वर को असामान्य रूप से बहुत अनुरोध मिले।", "ਸੇਵਾ ਸਰਵਰ ਨੂੰ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਬਹੁਤ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ।"), e("The server response queue grew.", "सर्वर की प्रतिक्रिया कतार बढ़ गई।", "ਸਰਵਰ ਦੀ ਜਵਾਬ ਕਤਾਰ ਵੱਧ ਗਈ।"), e("Online applications took longer to submit.", "ऑनलाइन आवेदन जमा होने में अधिक समय लगा।", "ਆਨਲਾਈਨ ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਹੋਣ ਵਿੱਚ ਵੱਧ ਸਮਾਂ ਲੱਗਾ।"), e("Applicants reached the counter for help.", "आवेदक सहायता के लिए काउंटर पर पहुँचे।", "ਬਿਨੈਕਾਰ ਮਦਦ ਲਈ ਕਾਊਂਟਰ ਤੇ ਪਹੁੰਚੇ।")),
      chainVariant("pump", neutral("At a city water station before noon.", "दोपहर से पहले एक शहर जल स्टेशन पर।", "ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਸ਼ਹਿਰੀ ਪਾਣੀ ਸਟੇਸ਼ਨ ਤੇ।"), e("A main pump stopped operating.", "एक मुख्य पंप काम करना बंद कर गया।", "ਇੱਕ ਮੁੱਖ ਪੰਪ ਕੰਮ ਕਰਨਾ ਬੰਦ ਕਰ ਗਿਆ।"), e("Pressure in the supply line fell.", "आपूर्ति लाइन में दबाव कम हुआ।", "ਸਪਲਾਈ ਲਾਈਨ ਵਿੱਚ ਦਬਾਅ ਘੱਟ ਹੋਇਆ।"), e("Water reached upper-floor homes slowly.", "ऊपरी मंजिलों के घरों तक पानी धीरे पहुँचा।", "ਉੱਪਰੀ ਮੰਜ਼ਿਲਾਂ ਦੇ ਘਰਾਂ ਤੱਕ ਪਾਣੀ ਹੌਲੀ ਪਹੁੰਚਿਆ।"), e("Residents stored water earlier than usual.", "निवासियों ने सामान्य से पहले पानी जमा किया।", "ਨਿਵਾਸੀਆਂ ਨੇ ਆਮ ਤੋਂ ਪਹਿਲਾਂ ਪਾਣੀ ਇਕੱਠਾ ਕੀਤਾ।")),
    ],
  },
  {
    id: "CAE-FAM-COMPETING-SCOPE",
    domain: "CIVIC",
    topology: "COMPETING_CAUSES",
    allowedProjectionKinds: ["PROBABLE_CAUSE", "COMPETING_EXPLANATION", "PROBABLE_EFFECT", "INDIRECT_CAUSAL_CHAIN"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      chainVariant("metro", neutral("On a weekday commute in a large city.", "एक बड़े शहर में कार्यदिवस की यात्रा के दौरान।", "ਇੱਕ ਵੱਡੇ ਸ਼ਹਿਰ ਵਿੱਚ ਕਾਰਜਦਿਵਸ ਦੀ ਯਾਤਰਾ ਦੌਰਾਨ।"), e("A bridge on the main route was closed.", "मुख्य मार्ग का एक पुल बंद किया गया।", "ਮੁੱਖ ਰਸਤੇ ਦਾ ਇੱਕ ਪੁਲ ਬੰਦ ਕੀਤਾ ਗਿਆ।"), e("Road traffic was diverted.", "सड़क यातायात मोड़ा गया।", "ਸੜਕ ਆਵਾਜਾਈ ਮੋੜੀ ਗਈ।"), e("The commute on that route became much longer.", "उस मार्ग की यात्रा बहुत लंबी हो गई।", "ਉਸ ਰਸਤੇ ਦੀ ਯਾਤਰਾ ਕਾਫ਼ੀ ਲੰਮੀ ਹੋ ਗਈ।"), e("Metro use from nearby stations increased.", "पास के स्टेशनों से मेट्रो उपयोग बढ़ा।", "ਨੇੜਲੇ ਸਟੇਸ਼ਨਾਂ ਤੋਂ ਮੈਟਰੋ ਦੀ ਵਰਤੋਂ ਵੱਧ ਗਈ।"), [
        candidate("metro-market", e("A small weekend market opened on a side street.", "एक छोटी सप्ताहांत बाजार साइड स्ट्रीट पर खुली।", "ਇੱਕ ਛੋਟਾ ਹਫ਼ਤਾਵਾਰੀ ਬਾਜ਼ਾਰ ਸਾਈਡ ਗਲੀ ਵਿੱਚ ਖੁੱਲ੍ਹਿਆ।"), "WRONG_SCOPE", "ALIGNED", "TOO_NARROW", "TOO_WEAK", null),
        candidate("metro-rain", e("Light rain fell briefly in another part of the city.", "शहर के दूसरे हिस्से में थोड़ी देर हल्की बारिश हुई।", "ਸ਼ਹਿਰ ਦੇ ਦੂਜੇ ਹਿੱਸੇ ਵਿੱਚ ਥੋੜ੍ਹੀ ਦੇਰ ਹਲਕਾ ਮੀਂਹ ਪਿਆ।"), "MAGNITUDE_MISMATCH", "ALIGNED", "TOO_BROAD", "TOO_WEAK", null),
        candidate("metro-late", e("Metro ridership was counted after the longer commute had begun.", "लंबी यात्रा शुरू होने के बाद मेट्रो यात्रियों की गिनती हुई।", "ਲੰਮੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਮੈਟਰੋ ਯਾਤਰੀਆਂ ਦੀ ਗਿਣਤੀ ਹੋਈ।"), "REVERSE_CAUSATION", "LATE", "ALIGNED", "ALIGNED", null),
      ]),
      chainVariant("vegetables", neutral("For a town supplied by one hill route.", "एक पहाड़ी मार्ग से आपूर्ति वाले कस्बे के लिए।", "ਇੱਕ ਪਹਾੜੀ ਰਸਤੇ ਤੋਂ ਸਪਲਾਈ ਵਾਲੇ ਕਸਬੇ ਲਈ।"), e("A landslide blocked the main supply road.", "भूस्खलन ने मुख्य आपूर्ति सड़क बंद कर दी।", "ਭੂਸਖਲਨ ਨੇ ਮੁੱਖ ਸਪਲਾਈ ਸੜਕ ਬੰਦ ਕਰ ਦਿੱਤੀ।"), e("Supply vehicles were delayed.", "आपूर्ति वाहन देर से पहुँचे।", "ਸਪਲਾਈ ਵਾਹਨ ਦੇਰ ਨਾਲ ਪਹੁੰਚੇ।"), e("Fresh vegetable deliveries fell sharply.", "ताजी सब्जियों की आपूर्ति बहुत घट गई।", "ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ ਦੀ ਸਪਲਾਈ ਕਾਫ਼ੀ ਘੱਟ ਗਈ।"), e("Vegetable prices in the town increased.", "कस्बे में सब्जियों के दाम बढ़े।", "ਕਸਬੇ ਵਿੱਚ ਸਬਜ਼ੀਆਂ ਦੇ ਭਾਅ ਵੱਧ ਗਏ।")),
      chainVariant("exam-centre", neutral("Near an examination centre on a scheduled test day.", "निर्धारित परीक्षा दिवस पर परीक्षा केंद्र के पास।", "ਨਿਰਧਾਰਤ ਪਰੀਖਿਆ ਦਿਨ ਤੇ ਪਰੀਖਿਆ ਕੇਂਦਰ ਨੇੜੇ।"), e("The approach road to the examination centre was closed.", "परीक्षा केंद्र की ओर जाने वाली सड़क बंद हुई।", "ਪਰੀਖਿਆ ਕੇਂਦਰ ਵੱਲ ਜਾਣ ਵਾਲੀ ਸੜਕ ਬੰਦ ਹੋਈ।"), e("Candidates used a longer alternate route.", "उम्मीदवारों ने लंबा वैकल्पिक मार्ग लिया।", "ਉਮੀਦਵਾਰਾਂ ਨੇ ਲੰਮਾ ਵਿਕਲਪਿਕ ਰਸਤਾ ਲਿਆ।"), e("Arrival time at the centre increased.", "केंद्र पर पहुँचने का समय बढ़ गया।", "ਕੇਂਦਰ ਤੇ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਵੱਧ ਗਿਆ।"), e("More candidates requested late-entry help.", "अधिक उम्मीदवारों ने विलंब प्रवेश सहायता माँगी।", "ਵੱਧ ਉਮੀਦਵਾਰਾਂ ਨੇ ਦੇਰੀ ਨਾਲ ਦਾਖਲਾ ਸਹਾਇਤਾ ਮੰਗੀ।")),
    ],
  },
  {
    id: "CAE-FAM-HIDDEN-CHAIN",
    domain: "WEATHER",
    topology: "HIDDEN_CHAIN",
    allowedProjectionKinds: ["INDIRECT_CAUSAL_CHAIN", "MULTI_EVENT_SEQUENCE", "MISSING_CAUSAL_LINK", "PROBABLE_CAUSE", "COMPETING_EXPLANATION"],
    allowedQuestionProfiles: ["FOUR_WAY"],
    renderingConstraints: constraints,
    variants: [
      chainVariant("landslide", neutral("On a hilly supply route after wet weather.", "गीले मौसम के बाद एक पहाड़ी आपूर्ति मार्ग पर।", "ਗਿੱਲੇ ਮੌਸਮ ਤੋਂ ਬਾਅਦ ਇੱਕ ਪਹਾੜੀ ਸਪਲਾਈ ਰਸਤੇ ਤੇ।"), e("Heavy rainfall continued in the hills.", "पहाड़ियों में तेज वर्षा जारी रही।", "ਪਹਾੜੀਆਂ ਵਿੱਚ ਤੇਜ਼ ਮੀਂਹ ਜਾਰੀ ਰਿਹਾ।"), e("A landslide occurred along the highway.", "राजमार्ग के पास भूस्खलन हुआ।", "ਰਾਜਮਾਰਗ ਦੇ ਨੇੜੇ ਭੂਸਖਲਨ ਹੋਇਆ।"), e("The highway was blocked.", "राजमार्ग बंद हो गया।", "ਰਾਜਮਾਰਗ ਬੰਦ ਹੋ ਗਿਆ।"), e("Supply vehicles were delayed.", "आपूर्ति वाहन देर से पहुँचे।", "ਸਪਲਾਈ ਵਾਹਨ ਦੇਰ ਨਾਲ ਪਹੁੰਚੇ।")),
      chainVariant("drainage", neutral("In a low-lying city neighbourhood after rain.", "बारिश के बाद निचले शहर मोहल्ले में।", "ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਨੀਵੇਂ ਸ਼ਹਿਰੀ ਮੁਹੱਲੇ ਵਿੱਚ।"), e("Heavy rain fell for several hours.", "कई घंटों तक तेज बारिश हुई।", "ਕਈ ਘੰਟਿਆਂ ਤੱਕ ਤੇਜ਼ ਮੀਂਹ ਪਿਆ।"), e("A storm drain became blocked.", "एक बरसाती नाला बंद हो गया।", "ਇੱਕ ਬਰਸਾਤੀ ਨਾਲਾ ਬੰਦ ਹੋ ਗਿਆ।"), e("Water collected on the access road.", "पहुँच मार्ग पर पानी भर गया।", "ਪਹੁੰਚ ਰਸਤੇ ਉੱਤੇ ਪਾਣੀ ਭਰ ਗਿਆ।"), e("Deliveries to the neighbourhood arrived late.", "मोहल्ले की डिलीवरी देर से पहुँची।", "ਮੁਹੱਲੇ ਦੀ ਡਿਲੀਵਰੀ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀ।")),
      chainVariant("cold-storage", neutral("At a food-distribution hub during the morning.", "सुबह एक खाद्य-वितरण केंद्र पर।", "ਸਵੇਰੇ ਇੱਕ ਖਾਦ-ਵੰਡ ਕੇਂਦਰ ਤੇ।"), e("The power supply to a cold-storage unit failed.", "कोल्ड-स्टोरेज इकाई की बिजली आपूर्ति बंद हुई।", "ਕੋਲਡ-ਸਟੋਰੇਜ ਇਕਾਈ ਦੀ ਬਿਜਲੀ ਸਪਲਾਈ ਬੰਦ ਹੋਈ।"), e("The backup generator took time to start.", "बैकअप जनरेटर शुरू होने में समय लगा।", "ਬੈਕਅੱਪ ਜਨਰੇਟਰ ਚਾਲੂ ਹੋਣ ਵਿੱਚ ਸਮਾਂ ਲੱਗਾ।"), e("Loading of perishable goods paused.", "नाशवान वस्तुओं की लोडिंग रुकी।", "ਨਾਸ਼ਵਾਨ ਵਸਤੂਆਂ ਦੀ ਲੋਡਿੰਗ ਰੁਕੀ।"), e("Dispatch vehicles left later than scheduled.", "भेजाई वाहन तय समय से देर से निकले।", "ਭੇਜਾਈ ਵਾਹਨ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੋਂ ਦੇਰ ਨਾਲ ਨਿਕਲੇ।")),
    ],
  },
  {
    id: "CAE-FAM-COINCIDENT-OBSERVATIONS",
    domain: "EDUCATION",
    topology: "PARALLEL_CHAINS",
    allowedProjectionKinds: ["CORRELATION_CHECK", "COMMON_OR_INDEPENDENT"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      parallelVariant("umbrellas-admissions", neutral("Two observations were reported during June.", "जून में दो अवलोकन बताए गए।", "ਜੂਨ ਵਿੱਚ ਦੋ ਨਿਰੀਖਣ ਦੱਸੇ ਗਏ।"), e("Seasonal rain began in the city.", "शहर में मौसमी वर्षा शुरू हुई।", "ਸ਼ਹਿਰ ਵਿੱਚ ਮੌਸਮੀ ਮੀਂਹ ਸ਼ੁਰੂ ਹੋਇਆ।"), e("Sales of umbrellas increased.", "छतरियों की बिक्री बढ़ गई।", "ਛਤਰੀਆਂ ਦੀ ਵਿਕਰੀ ਵੱਧ ਗਈ।"), e("Engineering admission results were announced.", "इंजीनियरिंग प्रवेश परिणाम घोषित हुए।", "ਇੰਜੀਨੀਅਰਿੰਗ ਦਾਖਲਾ ਨਤੀਜੇ ਘੋਸ਼ਿਤ ਹੋਏ।"), e("Admissions to engineering colleges increased.", "इंजीनियरिंग कॉलेजों में प्रवेश बढ़े।", "ਇੰਜੀਨੀਅਰਿੰਗ ਕਾਲਜਾਂ ਵਿੱਚ ਦਾਖਲੇ ਵੱਧ ਗਏ।")),
      parallelVariant("books-buses", neutral("Two city observations were recorded that week.", "उस सप्ताह शहर के दो अवलोकन दर्ज हुए।", "ਉਸ ਹਫ਼ਤੇ ਸ਼ਹਿਰ ਦੇ ਦੋ ਨਿਰੀਖਣ ਦਰਜ ਹੋਏ।"), e("The public library started a membership drive.", "सार्वजनिक पुस्तकालय ने सदस्यता अभियान शुरू किया।", "ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਮੈਂਬਰਸ਼ਿਪ ਮੁਹਿੰਮ ਸ਼ੁਰੂ ਕੀਤੀ।"), e("New library memberships increased.", "नई पुस्तकालय सदस्यताएँ बढ़ीं।", "ਨਵੀਆਂ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰਸ਼ਿਪਾਂ ਵੱਧੀਆਂ।"), e("A bus depot added two peak-hour services.", "बस डिपो ने पीक समय की दो सेवाएँ जोड़ीं।", "ਬੱਸ ਡਿਪੋ ਨੇ ਪੀਕ ਸਮੇਂ ਦੀਆਂ ਦੋ ਸੇਵਾਵਾਂ ਜੋੜੀਆਂ।"), e("Bus boarding at that depot increased.", "उस डिपो पर बस में चढ़ने वाले बढ़े।", "ਉਸ ਡਿਪੋ ਤੇ ਬੱਸ ਵਿੱਚ ਚੜ੍ਹਨ ਵਾਲੇ ਵੱਧੇ।")),
      parallelVariant("vaccination-market", neutral("Two public notices appeared on the same noticeboard.", "एक ही सूचना-पटल पर दो सार्वजनिक सूचनाएँ आईं।", "ਇੱਕੋ ਸੂਚਨਾ-ਪਟ ਤੇ ਦੋ ਜਨਤਕ ਸੂਚਨਾਵਾਂ ਆਈਆਂ।"), e("A vaccination camp opened near the civic centre.", "नागरिक केंद्र के पास टीकाकरण शिविर खुला।", "ਨਾਗਰਿਕ ਕੇਂਦਰ ਨੇੜੇ ਟੀਕਾਕਰਨ ਕੈਂਪ ਖੁੱਲ੍ਹਿਆ।"), e("Visits to the vaccination desk increased.", "टीकाकरण डेस्क पर आने वाले बढ़े।", "ਟੀਕਾਕਰਨ ਡੈਸਕ ਤੇ ਆਉਣ ਵਾਲੇ ਵੱਧੇ।"), e("A weekend craft market opened at the park.", "पार्क में सप्ताहांत हस्तशिल्प बाजार खुला।", "ਪਾਰਕ ਵਿੱਚ ਹਫ਼ਤਾਵਾਰੀ ਹਸਤਕਲਾ ਬਾਜ਼ਾਰ ਖੁੱਲ੍ਹਿਆ।"), e("Footfall at the park increased.", "पार्क में आने वाले बढ़े।", "ਪਾਰਕ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਵੱਧੇ।")),
    ],
  },
  {
    id: "CAE-FAM-CIVIC-SEQUENCE",
    domain: "CIVIC",
    topology: "HIDDEN_CHAIN",
    allowedProjectionKinds: ["DIRECT_RELATIONSHIP", "INDIRECT_CAUSAL_CHAIN", "MULTI_EVENT_SEQUENCE", "MISSING_CAUSAL_LINK", "PROBABLE_EFFECT"],
    allowedQuestionProfiles: ["FOUR_WAY", "FIVE_WAY"],
    renderingConstraints: constraints,
    variants: [
      chainVariant("roadwork", neutral("On a city road during scheduled maintenance.", "निर्धारित रखरखाव के दौरान शहर की सड़क पर।", "ਨਿਰਧਾਰਤ ਰੱਖ-ਰਖਾਵ ਦੌਰਾਨ ਸ਼ਹਿਰੀ ਸੜਕ ਉੱਤੇ।"), e("Roadwork closed one lane.", "सड़क कार्य ने एक लेन बंद की।", "ਸੜਕ ਕੰਮ ਨੇ ਇੱਕ ਲੇਨ ਬੰਦ ਕੀਤੀ।"), e("Vehicles merged into the remaining lane.", "वाहन बची हुई लेन में आए।", "ਵਾਹਨ ਬਚੀ ਹੋਈ ਲੇਨ ਵਿੱਚ ਆਏ।"), e("Traffic queues formed.", "यातायात की कतारें बनीं।", "ਆਵਾਜਾਈ ਦੀਆਂ ਕਤਾਰਾਂ ਬਣੀਆਂ।"), e("Bus arrival times became less predictable.", "बस आने का समय कम अनुमानित रहा।", "ਬੱਸ ਆਉਣ ਦਾ ਸਮਾਂ ਘੱਟ ਅਨੁਮਾਨਯੋਗ ਰਿਹਾ।")),
      chainVariant("drill", neutral("At a school during a safety drill.", "सुरक्षा अभ्यास के दौरान एक स्कूल में।", "ਸੁਰੱਖਿਆ ਅਭਿਆਸ ਦੌਰਾਨ ਇੱਕ ਸਕੂਲ ਵਿੱਚ।"), e("A safety drill was announced.", "एक सुरक्षा अभ्यास की घोषणा हुई।", "ਇੱਕ ਸੁਰੱਖਿਆ ਅਭਿਆਸ ਦੀ ਘੋਸ਼ਣਾ ਹੋਈ।"), e("Classes moved to the assembly area.", "कक्षाएँ सभा क्षेत्र में गईं।", "ਕਲਾਸਾਂ ਸਭਾ ਖੇਤਰ ਵਿੱਚ ਗਈਆਂ।"), e("Regular lessons paused.", "नियमित पाठ रुके।", "ਨਿਯਮਤ ਪਾਠ ਰੁਕੇ।"), e("The school timetable shifted for the day.", "दिन का स्कूल समय बदल गया।", "ਦਿਨ ਲਈ ਸਕੂਲ ਸਮਾਂ-ਸਾਰਣੀ ਬਦਲ ਗਈ।")),
      chainVariant("cleaning", neutral("At a neighbourhood market before opening time.", "खुलने के समय से पहले एक मोहल्ला बाजार में।", "ਖੁੱਲ੍ਹਣ ਦੇ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਮੁਹੱਲਾ ਬਾਜ਼ਾਰ ਵਿੱਚ।"), e("A water-main repair began near the market.", "बाजार के पास पानी की मुख्य पाइप की मरम्मत शुरू हुई।", "ਬਾਜ਼ਾਰ ਨੇੜੇ ਪਾਣੀ ਦੀ ਮੁੱਖ ਪਾਈਪ ਦੀ ਮੁਰੰਮਤ ਸ਼ੁਰੂ ਹੋਈ।"), e("The market entrance was temporarily restricted.", "बाजार प्रवेश अस्थायी रूप से सीमित हुआ।", "ਬਾਜ਼ਾਰ ਪ੍ਰਵੇਸ਼ ਅਸਥਾਈ ਤੌਰ ਤੇ ਸੀਮਿਤ ਹੋਇਆ।"), e("Delivery vans used a longer entry route.", "डिलीवरी वैन ने लंबा प्रवेश मार्ग लिया।", "ਡਿਲੀਵਰੀ ਵੈਨਾਂ ਨੇ ਲੰਮਾ ਪ੍ਰਵੇਸ਼ ਰਸਤਾ ਲਿਆ।"), e("Shop opening was delayed.", "दुकानें देर से खुलीं।", "ਦੁਕਾਨਾਂ ਦੇਰ ਨਾਲ ਖੁੱਲ੍ਹੀਆਂ।")),
    ],
  },
  {
    id: "CAE-FAM-MISSING-BRIDGE",
    domain: "RETAIL",
    topology: "HIDDEN_CHAIN",
    allowedProjectionKinds: ["MISSING_CAUSAL_LINK", "INDIRECT_CAUSAL_CHAIN", "MULTI_EVENT_SEQUENCE", "PROBABLE_CAUSE", "COMPETING_EXPLANATION"],
    allowedQuestionProfiles: ["FOUR_WAY"],
    renderingConstraints: constraints,
    variants: [
      chainVariant("supply", neutral("For a shop supplied from a regional warehouse.", "एक क्षेत्रीय गोदाम से आपूर्ति वाली दुकान के लिए।", "ਇੱਕ ਖੇਤਰੀ ਗੋਦਾਮ ਤੋਂ ਸਪਲਾਈ ਵਾਲੀ ਦੁਕਾਨ ਲਈ।"), e("A warehouse loading system stopped working.", "गोदाम की लोडिंग प्रणाली काम करना बंद कर गई।", "ਗੋਦਾਮ ਦੀ ਲੋਡਿੰਗ ਪ੍ਰਣਾਲੀ ਕੰਮ ਕਰਨਾ ਬੰਦ ਕਰ ਗਈ।"), e("Packages waited at the loading bay.", "पैकेज लोडिंग बे पर रुके रहे।", "ਪੈਕੇਜ ਲੋਡਿੰਗ ਬੇ ਤੇ ਰੁਕੇ ਰਹੇ।"), e("Delivery vehicles left late.", "डिलीवरी वाहन देर से निकले।", "ਡਿਲੀਵਰੀ ਵਾਹਨ ਦੇਰ ਨਾਲ ਨਿਕਲੇ।"), e("The shop received stock later than planned.", "दुकान को तय समय से देर से स्टॉक मिला।", "ਦੁਕਾਨ ਨੂੰ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੋਂ ਦੇਰ ਨਾਲ ਸਟਾਕ ਮਿਲਿਆ।")),
      chainVariant("ferry", neutral("At a riverside crossing during service hours.", "सेवा समय में नदी पार करने वाले स्थान पर।", "ਸੇਵਾ ਸਮੇਂ ਦੌਰਾਨ ਦਰਿਆ ਪਾਰ ਕਰਨ ਵਾਲੀ ਥਾਂ ਤੇ।"), e("Strong wind affected the ferry crossing.", "तेज हवा ने फेरी पारगमन को प्रभावित किया।", "ਤੇਜ਼ ਹਵਾ ਨੇ ਫੈਰੀ ਪਾਰਗਮਨ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕੀਤਾ।"), e("Ferry departures were paused.", "फेरी की रवानगी रोक दी गई।", "ਫੈਰੀ ਦੀ ਰਵਾਨਗੀ ਰੋਕ ਦਿੱਤੀ ਗਈ।"), e("Vehicles waited at the crossing.", "वाहन पारगमन पर प्रतीक्षा करने लगे।", "ਵਾਹਨ ਪਾਰਗਮਨ ਤੇ ਉਡੀਕ ਕਰਨ ਲੱਗੇ।"), e("Goods reached the market late.", "सामान बाजार देर से पहुँचा।", "ਸਮਾਨ ਬਾਜ਼ਾਰ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।")),
      chainVariant("printer", neutral("At a district service office before a deadline.", "समयसीमा से पहले एक जिला सेवा कार्यालय में।", "ਅੰਤਿਮ ਤਾਰੀਖ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਸੇਵਾ ਦਫ਼ਤਰ ਵਿੱਚ।"), e("The office printer network failed.", "कार्यालय का प्रिंटर नेटवर्क बंद हुआ।", "ਦਫ਼ਤਰ ਦਾ ਪ੍ਰਿੰਟਰ ਨੈੱਟਵਰਕ ਬੰਦ ਹੋਇਆ।"), e("Required forms could not be printed.", "आवश्यक फॉर्म प्रिंट नहीं हो सके।", "ਲੋੜੀਂਦੇ ਫਾਰਮ ਪ੍ਰਿੰਟ ਨਹੀਂ ਹੋ ਸਕੇ।"), e("Applications waited for verification.", "आवेदन सत्यापन के लिए रुके।", "ਅਰਜ਼ੀਆਂ ਤਸਦੀਕ ਲਈ ਰੁਕੀਆਂ।"), e("Some certificates were issued late.", "कुछ प्रमाणपत्र देर से जारी हुए।", "ਕੁਝ ਪ੍ਰਮਾਣਪੱਤਰ ਦੇਰ ਨਾਲ ਜਾਰੀ ਹੋਏ।")),
    ],
  },
] as const satisfies readonly CaeScenarioFamilyAuthority[];

export const CAE_001_PROJECTION_AUTHORITIES = [
  { id: "CAE-PLAN-DIRECT", checkpointId: "CAE-CP-001", qlId: "CAE-QL-001", kind: "DIRECT_RELATIONSHIP", compatibleFamilyIds: ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-DIAGNOSTIC-DISRUPTION", "CAE-FAM-CIVIC-SEQUENCE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY", "FIVE_WAY"] },
  { id: "CAE-PLAN-COMMON-INDEPENDENT", checkpointId: "CAE-CP-002", qlId: "CAE-QL-002", kind: "COMMON_OR_INDEPENDENT", compatibleFamilyIds: ["CAE-FAM-SHARED-PRESSURE", "CAE-FAM-PARALLEL-INCIDENTS", "CAE-FAM-COINCIDENT-OBSERVATIONS"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY", "FIVE_WAY"] },
  { id: "CAE-PLAN-PROBABLE-CAUSE", checkpointId: "CAE-CP-003", qlId: "CAE-QL-003", kind: "PROBABLE_CAUSE", compatibleFamilyIds: ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-DIAGNOSTIC-DISRUPTION", "CAE-FAM-COMPETING-SCOPE", "CAE-FAM-HIDDEN-CHAIN", "CAE-FAM-MISSING-BRIDGE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY"] },
  { id: "CAE-PLAN-PROBABLE-EFFECT", checkpointId: "CAE-CP-004", qlId: "CAE-QL-004", kind: "PROBABLE_EFFECT", compatibleFamilyIds: ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-SHARED-PRESSURE", "CAE-FAM-DIAGNOSTIC-DISRUPTION", "CAE-FAM-CIVIC-SEQUENCE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY"] },
  { id: "CAE-PLAN-COMPETING", checkpointId: "CAE-CP-005", qlId: "CAE-QL-005", kind: "COMPETING_EXPLANATION", compatibleFamilyIds: ["CAE-FAM-DIAGNOSTIC-DISRUPTION", "CAE-FAM-COMPETING-SCOPE", "CAE-FAM-HIDDEN-CHAIN", "CAE-FAM-MISSING-BRIDGE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY"] },
  { id: "CAE-PLAN-INDIRECT", checkpointId: "CAE-CP-006", qlId: "CAE-QL-006", kind: "INDIRECT_CAUSAL_CHAIN", compatibleFamilyIds: ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-HIDDEN-CHAIN", "CAE-FAM-CIVIC-SEQUENCE", "CAE-FAM-MISSING-BRIDGE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY"] },
  { id: "CAE-PLAN-CORRELATION", checkpointId: "CAE-CP-007", qlId: "CAE-QL-007", kind: "CORRELATION_CHECK", compatibleFamilyIds: ["CAE-FAM-PARALLEL-INCIDENTS", "CAE-FAM-COINCIDENT-OBSERVATIONS"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY", "FIVE_WAY"] },
  { id: "CAE-PLAN-SEQUENCE", checkpointId: "CAE-CP-008", qlId: "CAE-QL-008", kind: "MULTI_EVENT_SEQUENCE", compatibleFamilyIds: ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-HIDDEN-CHAIN", "CAE-FAM-CIVIC-SEQUENCE", "CAE-FAM-MISSING-BRIDGE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY"] },
  { id: "CAE-PLAN-MISSING", checkpointId: "CAE-CP-009", qlId: "CAE-QL-009", kind: "MISSING_CAUSAL_LINK", compatibleFamilyIds: ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-HIDDEN-CHAIN", "CAE-FAM-CIVIC-SEQUENCE", "CAE-FAM-MISSING-BRIDGE"], qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION", examProfiles: ["FOUR_WAY"] },
] as const satisfies readonly CaeProjectionAuthority[];

export function familyForCae001(id: string): CaeScenarioFamilyAuthority {
  const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === id);
  if (!family) throw new Error(`Unknown CAE-001 scenario family '${id}'.`);
  return family;
}

export function materializeCae001World(family: CaeScenarioFamilyAuthority, variant: CaeScenarioVariant): CaeCausalWorld {
  const id = `CAE-WORLD-${family.id.replace("CAE-FAM-", "")}-${variant.id}`;
  const nodes = variant.nodes.map((entry) => ({ ...entry, id: `${id}:${entry.semanticSlot}` }));
  const nodeId = (slot: string) => {
    const node = nodes.find((entry) => entry.semanticSlot === slot);
    if (!node) throw new Error(`${id}: unknown slot '${slot}'.`);
    return node.id;
  };
  return {
    id,
    scenarioFamilyId: family.id,
    scenarioVariantId: variant.id,
    domain: family.domain,
    nodes,
    edges: variant.edgeBindings.map((edge) => ({ from: nodeId(edge.from), to: nodeId(edge.to), strength: edge.strength ?? "PRIMARY", temporalRelation: edge.temporalRelation ?? "IMMEDIATE", directness: "DIRECT" as const })),
    sourceMode: "CURATED_COMPOSABLE_SCENARIO",
  };
}

/** Canonical source states for audit only; generation never selects a finished question from this list. */
export const CAE_001_CAUSAL_WORLDS = CAE_001_SCENARIO_FAMILIES.flatMap((family) => family.variants.map((variant) => materializeCae001World(family, variant)));
