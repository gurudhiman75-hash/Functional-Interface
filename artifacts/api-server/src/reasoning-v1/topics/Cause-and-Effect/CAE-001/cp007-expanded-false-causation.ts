import type { CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion, LocalizedText } from "./types.ts";

type Pattern = "CO_MOVEMENT" | "POST_HOC";
type Scenario = Readonly<{
  id: string;
  pattern: Pattern;
  firstCause: LocalizedText;
  firstEffect: LocalizedText;
  secondCause: LocalizedText;
  secondEffect: LocalizedText;
}>;

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });

export const CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID = "CAE-FAM-FALSE-CAUSATION-EVIDENCE";

export const CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS: readonly Scenario[] = Object.freeze([
  {
    id: "bank-app-queue",
    pattern: "POST_HOC",
    firstCause: l("The bank launched cashback on mobile payments.", "बैंक ने मोबाइल भुगतान पर कैशबैक शुरू किया।", "ਬੈਂਕ ਨੇ ਮੋਬਾਈਲ ਭੁਗਤਾਨ ਉੱਤੇ ਕੈਸ਼ਬੈਕ ਸ਼ੁਰੂ ਕੀਤਾ।"),
    firstEffect: l("Mobile-payment transactions increased.", "मोबाइल भुगतान लेनदेन बढ़ गए।", "ਮੋਬਾਈਲ ਭੁਗਤਾਨ ਲੈਣ-ਦੇਣ ਵੱਧ ਗਏ।"),
    secondCause: l("The bank opened two additional service counters later that week.", "उसी सप्ताह बाद में बैंक ने दो अतिरिक्त सेवा काउंटर खोले।", "ਉਸੇ ਹਫ਼ਤੇ ਬਾਅਦ ਬੈਂਕ ਨੇ ਦੋ ਵਾਧੂ ਸੇਵਾ ਕਾਊਂਟਰ ਖੋਲ੍ਹੇ।"),
    secondEffect: l("Branch waiting time decreased afterward.", "इसके बाद शाखा में प्रतीक्षा समय घट गया।", "ਇਸ ਤੋਂ ਬਾਅਦ ਸ਼ਾਖਾ ਵਿੱਚ ਉਡੀਕ ਸਮਾਂ ਘਟ ਗਿਆ।"),
  },
  {
    id: "exam-download-entry",
    pattern: "POST_HOC",
    firstCause: l("The examination board released admit cards online.", "परीक्षा बोर्ड ने प्रवेश पत्र ऑनलाइन जारी किए।", "ਪਰੀਖਿਆ ਬੋਰਡ ਨੇ ਐਡਮਿਟ ਕਾਰਡ ਆਨਲਾਈਨ ਜਾਰੀ ਕੀਤੇ।"),
    firstEffect: l("Portal downloads rose sharply.", "पोर्टल से डाउनलोड तेजी से बढ़ गए।", "ਪੋਰਟਲ ਤੋਂ ਡਾਊਨਲੋਡ ਤੇਜ਼ੀ ਨਾਲ ਵੱਧ ਗਏ।"),
    secondCause: l("Centres added an extra entry gate two days later.", "दो दिन बाद केंद्रों ने एक अतिरिक्त प्रवेश द्वार खोला।", "ਦੋ ਦਿਨ ਬਾਅਦ ਕੇਂਦਰਾਂ ਨੇ ਇੱਕ ਵਾਧੂ ਦਾਖਲਾ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਿਆ।"),
    secondEffect: l("Entry queues became shorter.", "प्रवेश कतारें छोटी हो गईं।", "ਦਾਖਲਾ ਕਤਾਰਾਂ ਛੋਟੀਆਂ ਹੋ ਗਈਆਂ।"),
  },
  {
    id: "warehouse-orders-loading",
    pattern: "CO_MOVEMENT",
    firstCause: l("A retailer began a weekend discount campaign.", "एक खुदरा विक्रेता ने सप्ताहांत छूट अभियान शुरू किया।", "ਇੱਕ ਖੁਦਰਾ ਵਿਕਰੇਤਾ ਨੇ ਹਫ਼ਤਾ-ਅੰਤ ਛੂਟ ਮੁਹਿੰਮ ਸ਼ੁਰੂ ਕੀਤੀ।"),
    firstEffect: l("Warehouse order volume increased.", "गोदाम में ऑर्डर की मात्रा बढ़ गई।", "ਗੋਦਾਮ ਵਿੱਚ ਆਰਡਰ ਦੀ ਮਾਤਰਾ ਵੱਧ ਗਈ।"),
    secondCause: l("The warehouse assigned more workers to loading bays.", "गोदाम ने लोडिंग बे पर अधिक कर्मचारी लगाए।", "ਗੋਦਾਮ ਨੇ ਲੋਡਿੰਗ ਬੇ ਉੱਤੇ ਹੋਰ ਕਰਮਚਾਰੀ ਲਗਾਏ।"),
    secondEffect: l("Average loading time decreased.", "औसत लोडिंग समय घट गया।", "ਔਸਤ ਲੋਡਿੰਗ ਸਮਾਂ ਘਟ ਗਿਆ।"),
  },
  {
    id: "hospital-reminder-pharmacy",
    pattern: "CO_MOVEMENT",
    firstCause: l("The hospital started SMS appointment reminders.", "अस्पताल ने एसएमएस अपॉइंटमेंट रिमाइंडर शुरू किए।", "ਹਸਪਤਾਲ ਨੇ ਐਸਐਮਐਸ ਅਪਾਇੰਟਮੈਂਟ ਰਿਮਾਈਂਡਰ ਸ਼ੁਰੂ ਕੀਤੇ।"),
    firstEffect: l("Missed appointments decreased.", "छूटे हुए अपॉइंटमेंट घट गए।", "ਛੁੱਟੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ ਘਟ ਗਈਆਂ।"),
    secondCause: l("The pharmacy added a second billing desk.", "फार्मेसी ने दूसरा बिलिंग डेस्क जोड़ा।", "ਫਾਰਮੇਸੀ ਨੇ ਦੂਜਾ ਬਿਲਿੰਗ ਡੈਸਕ ਜੋੜਿਆ।"),
    secondEffect: l("Pharmacy checkout time decreased.", "फार्मेसी में बिलिंग समय घट गया।", "ਫਾਰਮੇਸੀ ਵਿੱਚ ਬਿਲਿੰਗ ਸਮਾਂ ਘਟ ਗਿਆ।"),
  },
  {
    id: "telecom-data-service",
    pattern: "POST_HOC",
    firstCause: l("The telecom operator reduced the price of a data pack.", "टेलीकॉम ऑपरेटर ने डेटा पैक की कीमत घटाई।", "ਟੈਲੀਕਾਮ ਓਪਰੇਟਰ ਨੇ ਡਾਟਾ ਪੈਕ ਦੀ ਕੀਮਤ ਘਟਾਈ।"),
    firstEffect: l("Mobile data use increased.", "मोबाइल डेटा उपयोग बढ़ गया।", "ਮੋਬਾਈਲ ਡਾਟਾ ਵਰਤੋਂ ਵੱਧ ਗਈ।"),
    secondCause: l("Engineers upgraded a congested service cluster later that week.", "उसी सप्ताह बाद में इंजीनियरों ने भीड़ वाले सेवा क्लस्टर को अपग्रेड किया।", "ਉਸੇ ਹਫ਼ਤੇ ਬਾਅਦ ਇੰਜੀਨੀਅਰਾਂ ਨੇ ਭੀੜ ਵਾਲਾ ਸੇਵਾ ਕਲੱਸਟਰ ਅੱਪਗ੍ਰੇਡ ਕੀਤਾ।"),
    secondEffect: l("Complaint volume fell afterward.", "इसके बाद शिकायतों की संख्या घट गई।", "ਇਸ ਤੋਂ ਬਾਅਦ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਗਿਣਤੀ ਘਟ ਗਈ।"),
  },
  {
    id: "factory-training-defects",
    pattern: "CO_MOVEMENT",
    firstCause: l("The factory introduced operator skill training.", "फैक्टरी ने ऑपरेटर कौशल प्रशिक्षण शुरू किया।", "ਫੈਕਟਰੀ ਨੇ ਓਪਰੇਟਰ ਹੁਨਰ ਟ੍ਰੇਨਿੰਗ ਸ਼ੁਰੂ ਕੀਤੀ।"),
    firstEffect: l("Setup mistakes decreased.", "सेटअप की गलतियाँ घट गईं।", "ਸੈਟਅੱਪ ਗਲਤੀਆਂ ਘਟ ਗਈਆਂ।"),
    secondCause: l("A supplier improved the quality of incoming components.", "एक आपूर्तिकर्ता ने आने वाले पुर्जों की गुणवत्ता सुधारी।", "ਇੱਕ ਸਪਲਾਇਰ ਨੇ ਆਉਣ ਵਾਲੇ ਪੁਰਜ਼ਿਆਂ ਦੀ ਗੁਣਵੱਤਾ ਸੁਧਾਰੀ।"),
    secondEffect: l("Material-defect rejections decreased.", "सामग्री दोष के कारण अस्वीकृतियां घट गईं।", "ਸਮੱਗਰੀ ਦੋਸ਼ ਕਾਰਨ ਰੱਦ ਹੋਣ ਵਾਲੀਆਂ ਇਕਾਈਆਂ ਘਟ ਗਈਆਂ।"),
  },
  {
    id: "college-results-canteen",
    pattern: "POST_HOC",
    firstCause: l("The college published semester results online.", "कॉलेज ने सेमेस्टर परिणाम ऑनलाइन जारी किए।", "ਕਾਲਜ ਨੇ ਸਮੈਸਟਰ ਨਤੀਜੇ ਆਨਲਾਈਨ ਜਾਰੀ ਕੀਤੇ।"),
    firstEffect: l("Student portal logins increased sharply.", "छात्र पोर्टल लॉगिन तेजी से बढ़ गए।", "ਵਿਦਿਆਰਥੀ ਪੋਰਟਲ ਲਾਗਇਨ ਤੇਜ਼ੀ ਨਾਲ ਵੱਧ ਗਏ।"),
    secondCause: l("The canteen introduced an additional billing counter the next week.", "अगले सप्ताह कैंटीन ने एक अतिरिक्त बिलिंग काउंटर शुरू किया।", "ਅਗਲੇ ਹਫ਼ਤੇ ਕੈਂਟੀਨ ਨੇ ਇੱਕ ਵਾਧੂ ਬਿਲਿੰਗ ਕਾਊਂਟਰ ਸ਼ੁਰੂ ਕੀਤਾ।"),
    secondEffect: l("Canteen queues became shorter.", "कैंटीन की कतारें छोटी हो गईं।", "ਕੈਂਟੀਨ ਦੀਆਂ ਕਤਾਰਾਂ ਛੋਟੀਆਂ ਹੋ ਗਈਆਂ।"),
  },
  {
    id: "power-alert-repair",
    pattern: "CO_MOVEMENT",
    firstCause: l("The utility introduced outage-status alerts for customers.", "बिजली कंपनी ने ग्राहकों के लिए आउटेज-स्थिति अलर्ट शुरू किए।", "ਬਿਜਲੀ ਕੰਪਨੀ ਨੇ ਗਾਹਕਾਂ ਲਈ ਆਊਟੇਜ-ਸਥਿਤੀ ਅਲਰਟ ਸ਼ੁਰੂ ਕੀਤੇ।"),
    firstEffect: l("Calls asking for outage information decreased.", "आउटेज जानकारी पूछने वाली कॉल घट गईं।", "ਆਊਟੇਜ ਜਾਣਕਾਰੀ ਪੁੱਛਣ ਵਾਲੀਆਂ ਕਾਲਾਂ ਘਟ ਗਈਆਂ।"),
    secondCause: l("Repair crews received new fault-location equipment.", "मरम्मत दल को नया फॉल्ट-लोकेशन उपकरण मिला।", "ਮੁਰੰਮਤ ਟੀਮਾਂ ਨੂੰ ਨਵਾਂ ਫਾਲਟ-ਲੋਕੇਸ਼ਨ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਮਿਲਿਆ।"),
    secondEffect: l("Average restoration time decreased.", "औसत बहाली समय घट गया।", "ਔਸਤ ਬਹਾਲੀ ਸਮਾਂ ਘਟ ਗਿਆ।"),
  },
  {
    id: "bus-pass-punctuality",
    pattern: "POST_HOC",
    firstCause: l("The city introduced discounted monthly bus passes.", "शहर ने रियायती मासिक बस पास शुरू किए।", "ਸ਼ਹਿਰ ਨੇ ਰਿਆਯਤੀ ਮਹੀਨਾਵਾਰ ਬੱਸ ਪਾਸ ਸ਼ੁਰੂ ਕੀਤੇ।"),
    firstEffect: l("Monthly pass use increased.", "मासिक पास का उपयोग बढ़ गया।", "ਮਹੀਨਾਵਾਰ ਪਾਸ ਦੀ ਵਰਤੋਂ ਵੱਧ ਗਈ।"),
    secondCause: l("Traffic signals on a busy corridor were retimed later that month.", "उसी महीने बाद में व्यस्त कॉरिडोर के ट्रैफिक सिग्नल का समय बदला गया।", "ਉਸੇ ਮਹੀਨੇ ਬਾਅਦ ਰੁਸ਼ ਵਾਲੇ ਕੌਰੀਡੋਰ ਦੇ ਟ੍ਰੈਫਿਕ ਸਿਗਨਲਾਂ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ।"),
    secondEffect: l("Bus punctuality improved afterward.", "इसके बाद बसों की समयपालन दर सुधरी।", "ਇਸ ਤੋਂ ਬਾਅਦ ਬੱਸਾਂ ਦੀ ਸਮੇਂ-ਸਿਰ ਪਹੁੰਚ ਸੁਧਰੀ।"),
  },
  {
    id: "farm-advisory-irrigation",
    pattern: "CO_MOVEMENT",
    firstCause: l("Farmers began receiving pest-control advisories.", "किसानों को कीट-नियंत्रण सलाह मिलने लगी।", "ਕਿਸਾਨਾਂ ਨੂੰ ਕੀਟ-ਨਿਯੰਤਰਣ ਸਲਾਹ ਮਿਲਣ ਲੱਗੀ।"),
    firstEffect: l("Reported pest damage decreased.", "दर्ज की गई कीट क्षति घट गई।", "ਦਰਜ ਕੀਤੀ ਕੀਟ ਹਾਨੀ ਘਟ ਗਈ।"),
    secondCause: l("The irrigation department extended canal-release hours.", "सिंचाई विभाग ने नहर में पानी छोड़ने का समय बढ़ाया।", "ਸਿੰਚਾਈ ਵਿਭਾਗ ਨੇ ਨਹਿਰ ਵਿੱਚ ਪਾਣੀ ਛੱਡਣ ਦਾ ਸਮਾਂ ਵਧਾਇਆ।"),
    secondEffect: l("Irrigation availability improved.", "सिंचाई की उपलब्धता सुधरी।", "ਸਿੰਚਾਈ ਦੀ ਉਪਲਬਧਤਾ ਸੁਧਰੀ।"),
  },
]);

const OPTIONS: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the cause and Statement I is its effect.",
    COMMON_CAUSE: "Both statements are effects of the same common cause.",
    CORRELATION_ONLY: "The statements occur together or in sequence, but the information does not support a cause-effect link between them.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II कारण है और कथन I उसका प्रभाव है।",
    COMMON_CAUSE: "दोनों कथन एक ही सामान्य कारण के प्रभाव हैं।",
    CORRELATION_ONLY: "कथन साथ या क्रम में हुए हैं, लेकिन दी गई जानकारी उनके बीच कारण-प्रभाव संबंध सिद्ध नहीं करती।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    COMMON_CAUSE: "ਦੋਵੇਂ ਕਥਨ ਇੱਕੋ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    CORRELATION_ONLY: "ਕਥਨ ਇਕੱਠੇ ਜਾਂ ਕ੍ਰਮ ਵਿੱਚ ਹੋਏ ਹਨ, ਪਰ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਸੰਬੰਧ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
  },
};

const COPY: Record<CaeLocale, Readonly<{ prompt: string; one: string; two: string; evidence: string; explanation: string; timing: string }>> = {
  "en-IN": { prompt: "Read the two statements and decide which conclusion is supported by the information given.", one: "Statement I", two: "Statement II", evidence: "Additional information", explanation: "Each statement has a different supported cause, so neither statement is shown to cause the other.", timing: "The order in time does not by itself establish causation." },
  "hi-IN": { prompt: "दोनों कथन पढ़िए और दी गई जानकारी से समर्थित निष्कर्ष चुनिए।", one: "कथन I", two: "कथन II", evidence: "अतिरिक्त जानकारी", explanation: "दोनों कथनों के अलग-अलग समर्थित कारण हैं, इसलिए कोई भी कथन दूसरे का कारण सिद्ध नहीं होता।", timing: "केवल समय-क्रम से कारण-प्रभाव सिद्ध नहीं होता।" },
  "pa-IN": { prompt: "ਦੋਵੇਂ ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਸਮਰਥਿਤ ਨਤੀਜਾ ਚੁਣੋ।", one: "ਕਥਨ I", two: "ਕਥਨ II", evidence: "ਵਾਧੂ ਜਾਣਕਾਰੀ", explanation: "ਦੋਵੇਂ ਕਥਨਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਮਰਥਿਤ ਕਾਰਨ ਹਨ, ਇਸ ਲਈ ਕੋਈ ਵੀ ਕਥਨ ਦੂਜੇ ਦਾ ਕਾਰਨ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।", timing: "ਕੇਵਲ ਸਮੇਂ ਦੇ ਕ੍ਰਮ ਨਾਲ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।" },
};

function mix32(value: number): number { let x = value | 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
function shuffled<T>(values: readonly T[], seed: number): readonly T[] { const out = [...values]; let state = mix32(seed ^ 0x707e71d); for (let i = out.length - 1; i > 0; i -= 1) { state = mix32(state + i); const j = state % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function difficulty(pattern: Pattern): CaeDifficultyEvidence {
  const hard = pattern === "POST_HOC";
  return { causalDistance: 0, hiddenLinks: 0, topologyComplexity: 2, plausibleDistractors: hard ? 3 : 2, visibleEventCount: 4, inferenceBurden: hard ? 5 : 3, candidatePlausibilityBurden: hard ? 4 : 2, score: hard ? 18 : 14 };
}

export function generateCp007ExpandedFalseCausationQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const selectionSeed = mix32((input.seed >>> 0) ^ 0x7cae7007);
  const scenario = CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS[selectionSeed % CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS.length]!;
  const reverse = mix32(selectionSeed ^ 0x7f71) % 2 === 1;
  const firstEffectId = `${scenario.id}:first-effect`;
  const secondEffectId = `${scenario.id}:second-effect`;
  const firstCauseId = `${scenario.id}:first-cause`;
  const secondCauseId = `${scenario.id}:second-cause`;
  const visibleEffects = reverse ? [secondEffectId, firstEffectId] : [firstEffectId, secondEffectId];
  const firstVisibleText = reverse ? scenario.secondEffect[input.locale] : scenario.firstEffect[input.locale];
  const secondVisibleText = reverse ? scenario.firstEffect[input.locale] : scenario.secondEffect[input.locale];
  const ids = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"] as const;
  const options: readonly CaeRenderedOption[] = shuffled(ids.map((id) => ({ id, text: OPTIONS[input.locale][id]!, isCorrect: id === "CORRELATION_ONLY", distractorRole: id === "FIRST_DIRECT_CAUSES_SECOND" ? "CORRELATION" as const : id === "SECOND_DIRECT_CAUSES_FIRST" ? "REVERSE_CAUSATION" as const : id === "COMMON_CAUSE" ? "COMMON_CAUSE_CONFUSION" as const : undefined })), selectionSeed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const copy = COPY[input.locale];
  const stateId = ["projection:CAE-PLAN-CORRELATION", `family:${CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID}`, `variant:${scenario.id}`, "graph:PARALLEL_CHAINS", `pattern:${scenario.pattern}`, `visible:${reverse ? "second-effect,first-effect" : "first-effect,second-effect"}`, "evidence:independent-causes-visible"].join("|");
  const itemVariantId = `${stateId}|profile:FOUR_WAY|presentation:${options.map((option) => option.id).join(">")}`;
  const stem = `${copy.prompt}\n\n${copy.one}: ${firstVisibleText}\n\n${copy.two}: ${secondVisibleText}\n\n${copy.evidence}:\n${scenario.firstCause[input.locale]}\n${scenario.secondCause[input.locale]}`;
  const explanation = `${scenario.firstCause[input.locale].replace(/[.।]+$/u, "")} → ${scenario.firstEffect[input.locale].replace(/[.।]+$/u, "")}. ${scenario.secondCause[input.locale].replace(/[.।]+$/u, "")} → ${scenario.secondEffect[input.locale].replace(/[.।]+$/u, "")}. ${copy.explanation}${scenario.pattern === "POST_HOC" ? ` ${copy.timing}` : ""}`;

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-007",
    qlId: "CAE-QL-007",
    projectionId: "CAE-PLAN-CORRELATION",
    scenarioFamilyId: CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID,
    scenarioVariantId: scenario.id,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: `CAE-WORLD-EXPANDED-FALSE-${scenario.id}`,
    causalStructure: `PARALLEL_CHAINS:${scenario.pattern}:first-cause>first-effect|second-cause>second-effect`,
    locale: input.locale,
    seed: input.seed,
    difficulty: scenario.pattern === "POST_HOC" ? "HARD" : "MEDIUM",
    difficultyEvidence: difficulty(scenario.pattern),
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: [visibleEffects[0]!, visibleEffects[1]!, firstCauseId, secondCauseId], hiddenNodeIds: [] },
    stem,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: "CORRELATION_ONLY",
    explanation,
    causalTrace: [firstCauseId, firstEffectId, secondCauseId, secondEffectId],
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: options,
    metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  });
}
