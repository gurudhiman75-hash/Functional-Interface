import { hasDirectEdge } from "./causal-solver.ts";
import type {
  CaeCausalWorld,
  CaeDifficulty,
  CaeDifficultyEvidence,
  CaeDomain,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
  LocalizedText,
} from "./types.ts";

type ComboMode = "CAUSE_TWO" | "EFFECT_TWO" | "EFFECT_THREE";
type ComboScenario = Readonly<{
  id: string;
  qlId: "CAE-QL-003" | "CAE-QL-004";
  domain: CaeDomain;
  mode: ComboMode;
  anchor: LocalizedText;
  candidates: readonly LocalizedText[];
  validIndices: readonly number[];
  rationale: LocalizedText;
}>;

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });

export const CAE_COMBINATION_SCENARIOS: readonly ComboScenario[] = Object.freeze([
  {
    id: "mining-hub-two-causes",
    qlId: "CAE-QL-003",
    domain: "CIVIC",
    mode: "CAUSE_TWO",
    anchor: l("Despite rich mineral deposits, State M has not become a major mining hub.", "समृद्ध खनिज भंडार होने के बावजूद राज्य M बड़ा खनन केंद्र नहीं बन पाया है।", "ਖਣਿਜ ਭੰਡਾਰ ਪ੍ਰਚੁਰ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਰਾਜ M ਵੱਡਾ ਖਣਨ ਕੇਂਦਰ ਨਹੀਂ ਬਣਿਆ।"),
    candidates: [
      l("Strict environmental rules limit mining activity in the state.", "राज्य में कड़े पर्यावरणीय नियम खनन गतिविधियों को सीमित करते हैं।", "ਰਾਜ ਵਿੱਚ ਸਖ਼ਤ ਵਾਤਾਵਰਣੀ ਨਿਯਮ ਖਣਨ ਗਤੀਵਿਧੀਆਂ ਨੂੰ ਸੀਮਿਤ ਕਰਦੇ ਹਨ।"),
      l("A neighbouring state offers stronger incentives to mining companies.", "पड़ोसी राज्य खनन कंपनियों को बेहतर प्रोत्साहन देता है।", "ਪੜੋਸੀ ਰਾਜ ਖਣਨ ਕੰਪਨੀਆਂ ਨੂੰ ਵਧੀਆ ਪ੍ਰੋਤਸਾਹਨ ਦਿੰਦਾ ਹੈ।"),
    ],
    validIndices: [0, 1],
    rationale: l("Both factors can reasonably discourage mining activity in State M.", "दोनों कारक राज्य M में खनन गतिविधि को हतोत्साहित कर सकते हैं।", "ਦੋਵੇਂ ਕਾਰਕ ਰਾਜ M ਵਿੱਚ ਖਣਨ ਗਤੀਵਿਧੀ ਨੂੰ ਹੌਸਲਾ ਘਟਾ ਸਕਦੇ ਹਨ।"),
  },
  {
    id: "duplicate-bills-one-cause",
    qlId: "CAE-QL-003",
    domain: "UTILITIES",
    mode: "CAUSE_TWO",
    anchor: l("Many households received two electricity bills for the same month.", "कई घरों को एक ही महीने के लिए बिजली के दो बिल मिले।", "ਕਈ ਘਰਾਂ ਨੂੰ ਇੱਕੋ ਮਹੀਨੇ ਲਈ ਬਿਜਲੀ ਦੇ ਦੋ ਬਿੱਲ ਮਿਲੇ।"),
    candidates: [
      l("A billing-system error generated duplicate bills.", "बिलिंग सिस्टम की त्रुटि से डुप्लीकेट बिल बने।", "ਬਿਲਿੰਗ ਸਿਸਟਮ ਦੀ ਗਲਤੀ ਨਾਲ ਡੁਪਲੀਕੇਟ ਬਿੱਲ ਬਣੇ।"),
      l("The electricity board announced next month's maintenance schedule.", "बिजली बोर्ड ने अगले महीने का रखरखाव कार्यक्रम घोषित किया।", "ਬਿਜਲੀ ਬੋਰਡ ਨੇ ਅਗਲੇ ਮਹੀਨੇ ਦਾ ਰੱਖ-ਰਖਾਵ ਕਾਰਜਕ੍ਰਮ ਘੋਸ਼ਿਤ ਕੀਤਾ।"),
    ],
    validIndices: [0],
    rationale: l("A billing error explains duplicate bills; a maintenance announcement does not.", "बिलिंग त्रुटि डुप्लीकेट बिल समझाती है; रखरखाव की घोषणा नहीं।", "ਬਿਲਿੰਗ ਗਲਤੀ ਡੁਪਲੀਕੇਟ ਬਿੱਲ ਸਮਝਾਉਂਦੀ ਹੈ; ਰੱਖ-ਰਖਾਵ ਦੀ ਘੋਸ਼ਣਾ ਨਹੀਂ।"),
  },
  {
    id: "late-deliveries-second-cause",
    qlId: "CAE-QL-003",
    domain: "RETAIL",
    mode: "CAUSE_TWO",
    anchor: l("A large number of customer deliveries reached a day later than scheduled.", "बहुत सी ग्राहक डिलीवरी तय समय से एक दिन देर से पहुँचीं।", "ਬਹੁਤ ਸਾਰੀਆਂ ਗਾਹਕ ਡਿਲੀਵਰੀਆਂ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੋਂ ਇੱਕ ਦਿਨ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀਆਂ।"),
    candidates: [
      l("The company changed the colour of its delivery uniforms.", "कंपनी ने डिलीवरी कर्मचारियों की वर्दी का रंग बदला।", "ਕੰਪਨੀ ਨੇ ਡਿਲੀਵਰੀ ਕਰਮਚਾਰੀਆਂ ਦੀ ਵਰਦੀ ਦਾ ਰੰਗ ਬਦਲਿਆ।"),
      l("A route-planning outage delayed vehicle dispatch.", "रूट-प्लानिंग सिस्टम बंद होने से वाहनों की रवानगी देर से हुई।", "ਰੂਟ-ਪਲੈਨਿੰਗ ਸਿਸਟਮ ਬੰਦ ਹੋਣ ਕਾਰਨ ਵਾਹਨਾਂ ਦੀ ਰਵਾਨਗੀ ਦੇਰ ਨਾਲ ਹੋਈ।"),
    ],
    validIndices: [1],
    rationale: l("Delayed dispatch can explain late deliveries; a uniform-colour change cannot.", "देर से रवानगी देर से डिलीवरी समझा सकती है; वर्दी का रंग बदलना नहीं।", "ਦੇਰ ਨਾਲ ਰਵਾਨਗੀ ਦੇਰ ਨਾਲ ਡਿਲੀਵਰੀ ਸਮਝਾ ਸਕਦੀ ਹੈ; ਵਰਦੀ ਦਾ ਰੰਗ ਬਦਲਣਾ ਨਹੀਂ।"),
  },
  {
    id: "library-visits-neither-cause",
    qlId: "CAE-QL-003",
    domain: "EDUCATION",
    mode: "CAUSE_TWO",
    anchor: l("Evening visits to a college library increased sharply this week.", "इस सप्ताह कॉलेज पुस्तकालय में शाम की विजिट तेजी से बढ़ी।", "ਇਸ ਹਫ਼ਤੇ ਕਾਲਜ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਸ਼ਾਮ ਦੀਆਂ ਮੁਲਾਕਾਤਾਂ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀਆਂ।"),
    candidates: [
      l("The college repainted the staff parking area.", "कॉलेज ने स्टाफ पार्किंग क्षेत्र को दोबारा रंगा।", "ਕਾਲਜ ਨੇ ਸਟਾਫ਼ ਪਾਰਕਿੰਗ ਖੇਤਰ ਨੂੰ ਮੁੜ ਰੰਗਿਆ।"),
      l("The sports department changed the colour of team jerseys.", "खेल विभाग ने टीम की जर्सियों का रंग बदला।", "ਖੇਡ ਵਿਭਾਗ ਨੇ ਟੀਮ ਜਰਸੀਆਂ ਦਾ ਰੰਗ ਬਦਲਿਆ।"),
    ],
    validIndices: [],
    rationale: l("Neither event provides a reasonable causal explanation for the rise in library visits.", "दोनों में से कोई भी घटना पुस्तकालय विजिट बढ़ने का उचित कारण नहीं बताती।", "ਦੋਵੇਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਘਟਨਾ ਲਾਇਬ੍ਰੇਰੀ ਮੁਲਾਕਾਤਾਂ ਵਧਣ ਦਾ ਵਾਜਬ ਕਾਰਨ ਨਹੀਂ ਦਿੰਦੀ।"),
  },
  {
    id: "fashion-trend-two-effects",
    qlId: "CAE-QL-004",
    domain: "RETAIL",
    mode: "EFFECT_TWO",
    anchor: l("Ripped jeans became a strong fashion trend in the market.", "बाजार में रिप्ड जींस एक मजबूत फैशन ट्रेंड बन गई।", "ਬਾਜ਼ਾਰ ਵਿੱਚ ਰਿਪਡ ਜੀਨਜ਼ ਇੱਕ ਮਜ਼ਬੂਤ ਫੈਸ਼ਨ ਰੁਝਾਨ ਬਣ ਗਈ।"),
    candidates: [
      l("Retailers increased their stock of ripped jeans.", "खुदरा विक्रेताओं ने रिप्ड जींस का स्टॉक बढ़ाया।", "ਖੁਦਰਾ ਵਿਕਰੇਤਿਆਂ ਨੇ ਰਿਪਡ ਜੀਨਜ਼ ਦਾ ਸਟਾਕ ਵਧਾਇਆ।"),
      l("Producers earned higher profits from stronger demand for ripped jeans.", "रिप्ड जींस की अधिक मांग से उत्पादकों का लाभ बढ़ा।", "ਰਿਪਡ ਜੀਨਜ਼ ਦੀ ਵਧੀ ਮੰਗ ਨਾਲ ਉਤਪਾਦਕਾਂ ਦਾ ਮੁਨਾਫ਼ਾ ਵਧਿਆ।"),
    ],
    validIndices: [0, 1],
    rationale: l("Higher demand can reasonably increase both retailer stock and producer profits.", "अधिक मांग से खुदरा स्टॉक और उत्पादक लाभ दोनों बढ़ सकते हैं।", "ਵਧੀ ਮੰਗ ਨਾਲ ਖੁਦਰਾ ਸਟਾਕ ਅਤੇ ਉਤਪਾਦਕ ਮੁਨਾਫ਼ਾ ਦੋਵੇਂ ਵੱਧ ਸਕਦੇ ਹਨ।"),
  },
  {
    id: "bridge-closure-one-effect",
    qlId: "CAE-QL-004",
    domain: "TRANSPORT",
    mode: "EFFECT_TWO",
    anchor: l("A bridge on the main route was closed for urgent repairs.", "मुख्य मार्ग का एक पुल तुरंत मरम्मत के लिए बंद कर दिया गया।", "ਮੁੱਖ ਰਸਤੇ ਦਾ ਇੱਕ ਪੁਲ ਤੁਰੰਤ ਮੁਰੰਮਤ ਲਈ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।"),
    candidates: [
      l("Traffic was diverted through nearby streets.", "यातायात को पास की सड़कों से मोड़ा गया।", "ਆਵਾਜਾਈ ਨੂੰ ਨੇੜਲੀਆਂ ਸੜਕਾਂ ਰਾਹੀਂ ਮੋੜਿਆ ਗਿਆ।"),
      l("The railway station changed the colour of platform signs.", "रेलवे स्टेशन ने प्लेटफॉर्म संकेतों का रंग बदल दिया।", "ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨੇ ਪਲੇਟਫਾਰਮ ਨਿਸ਼ਾਨਾਂ ਦਾ ਰੰਗ ਬਦਲ ਦਿੱਤਾ।"),
    ],
    validIndices: [0],
    rationale: l("A route closure can require diversion; it does not explain an unrelated sign-colour change.", "मार्ग बंद होने से यातायात मोड़ना पड़ सकता है; संकेतों का रंग बदलना इसका प्रभाव नहीं है।", "ਰਸਤਾ ਬੰਦ ਹੋਣ ਨਾਲ ਆਵਾਜਾਈ ਮੋੜਨੀ ਪੈ ਸਕਦੀ ਹੈ; ਨਿਸ਼ਾਨਾਂ ਦਾ ਰੰਗ ਬਦਲਣਾ ਇਸ ਦਾ ਪ੍ਰਭਾਵ ਨਹੀਂ।"),
  },
  {
    id: "heatwave-two-effects",
    qlId: "CAE-QL-004",
    domain: "WEATHER",
    mode: "EFFECT_TWO",
    anchor: l("A prolonged heatwave affected the town for several days.", "कस्बे में कई दिनों तक तेज गर्मी की लहर रही।", "ਕਸਬੇ ਵਿੱਚ ਕਈ ਦਿਨਾਂ ਤੱਕ ਤੀਬਰ ਗਰਮੀ ਦੀ ਲਹਿਰ ਰਹੀ।"),
    candidates: [
      l("Water consumption increased sharply.", "पानी की खपत तेजी से बढ़ी।", "ਪਾਣੀ ਦੀ ਖਪਤ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
      l("Electricity demand increased sharply.", "बिजली की मांग तेजी से बढ़ी।", "ਬਿਜਲੀ ਦੀ ਮੰਗ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
    ],
    validIndices: [0, 1],
    rationale: l("A heatwave can raise demand for both water and electricity.", "गर्मी की लहर पानी और बिजली दोनों की मांग बढ़ा सकती है।", "ਗਰਮੀ ਦੀ ਲਹਿਰ ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਦੋਵਾਂ ਦੀ ਮੰਗ ਵਧਾ ਸਕਦੀ ਹੈ।"),
  },
  {
    id: "server-load-second-effect",
    qlId: "CAE-QL-004",
    domain: "INFRASTRUCTURE",
    mode: "EFFECT_TWO",
    anchor: l("A public-service server received an unusually high number of requests.", "एक सार्वजनिक सेवा सर्वर को असामान्य रूप से बहुत अनुरोध मिले।", "ਇੱਕ ਜਨਤਕ ਸੇਵਾ ਸਰਵਰ ਨੂੰ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਬਹੁਤ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ।"),
    candidates: [
      l("The office garden received new plants.", "कार्यालय के बगीचे में नए पौधे लगाए गए।", "ਦਫ਼ਤਰ ਦੇ ਬਾਗ ਵਿੱਚ ਨਵੇਂ ਪੌਦੇ ਲਗਾਏ ਗਏ।"),
      l("The server response queue grew rapidly.", "सर्वर की प्रतिक्रिया कतार तेजी से बढ़ी।", "ਸਰਵਰ ਦੀ ਜਵਾਬ ਕਤਾਰ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
    ],
    validIndices: [1],
    rationale: l("High request volume can enlarge the response queue; the garden change is unrelated.", "अधिक अनुरोध प्रतिक्रिया कतार बढ़ा सकते हैं; बगीचे का बदलाव असंबंधित है।", "ਵੱਧ ਬੇਨਤੀਆਂ ਜਵਾਬ ਕਤਾਰ ਵਧਾ ਸਕਦੀਆਂ ਹਨ; ਬਾਗ ਦਾ ਬਦਲਾਅ ਅਸੰਬੰਧਤ ਹੈ।"),
  },
  {
    id: "heavy-rain-three-effects",
    qlId: "CAE-QL-004",
    domain: "WEATHER",
    mode: "EFFECT_THREE",
    anchor: l("City X received lightning and heavy rain for two days.", "शहर X में दो दिनों तक बिजली चमकने के साथ तेज बारिश हुई।", "ਸ਼ਹਿਰ X ਵਿੱਚ ਦੋ ਦਿਨ ਤੱਕ ਬਿਜਲੀ ਚਮਕਣ ਨਾਲ ਤੇਜ਼ ਮੀਂਹ ਪਿਆ।"),
    candidates: [
      l("The electricity board increased the tariff by 50 paise per unit.", "बिजली बोर्ड ने शुल्क 50 पैसे प्रति यूनिट बढ़ा दिया।", "ਬਿਜਲੀ ਬੋਰਡ ਨੇ ਦਰ 50 ਪੈਸੇ ਪ੍ਰਤੀ ਯੂਨਿਟ ਵਧਾ ਦਿੱਤੀ।"),
      l("Water-logging was reported in several areas.", "कई क्षेत्रों में जलभराव की सूचना मिली।", "ਕਈ ਇਲਾਕਿਆਂ ਵਿੱਚ ਪਾਣੀ ਭਰਨ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਆਈਆਂ।"),
      l("Several trees fell during the storm.", "तूफान के दौरान कई पेड़ गिर गए।", "ਤੂਫ਼ਾਨ ਦੌਰਾਨ ਕਈ ਦਰੱਖਤ ਡਿੱਗ ਗਏ।"),
    ],
    validIndices: [1, 2],
    rationale: l("Heavy rain can cause water-logging and falling trees; it does not by itself justify a tariff increase.", "तेज बारिश जलभराव और पेड़ गिरने का कारण बन सकती है; इससे अपने-आप शुल्क वृद्धि नहीं होती।", "ਤੇਜ਼ ਮੀਂਹ ਪਾਣੀ ਭਰਨ ਅਤੇ ਦਰੱਖਤ ਡਿੱਗਣ ਦਾ ਕਾਰਨ ਬਣ ਸਕਦਾ ਹੈ; ਇਸ ਨਾਲ ਆਪਣੇ ਆਪ ਦਰ ਵਾਧਾ ਨਹੀਂ ਹੁੰਦਾ।"),
  },
  {
    id: "power-failure-three-effects",
    qlId: "CAE-QL-004",
    domain: "INFRASTRUCTURE",
    mode: "EFFECT_THREE",
    anchor: l("Power supply to a cold-storage unit failed during dispatch hours.", "डिस्पैच के समय कोल्ड-स्टोरेज इकाई की बिजली आपूर्ति बंद हो गई।", "ਡਿਸਪੈਚ ਸਮੇਂ ਕੋਲਡ-ਸਟੋਰੇਜ ਇਕਾਈ ਦੀ ਬਿਜਲੀ ਸਪਲਾਈ ਬੰਦ ਹੋ ਗਈ।"),
    candidates: [
      l("Loading of perishable goods paused.", "नाशवान सामान की लोडिंग रुक गई।", "ਨਾਸ਼ਵਾਨ ਸਮਾਨ ਦੀ ਲੋਡਿੰਗ ਰੁਕ ਗਈ।"),
      l("Dispatch vehicles left later than scheduled.", "डिस्पैच वाहन तय समय से देर से निकले।", "ਡਿਸਪੈਚ ਵਾਹਨ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੋਂ ਦੇਰ ਨਾਲ ਨਿਕਲੇ।"),
      l("A nearby school changed its morning assembly song.", "पास के स्कूल ने सुबह की प्रार्थना का गीत बदल दिया।", "ਨੇੜਲੇ ਸਕੂਲ ਨੇ ਸਵੇਰ ਦੀ ਸਭਾ ਦਾ ਗੀਤ ਬਦਲ ਦਿੱਤਾ।"),
    ],
    validIndices: [0, 1],
    rationale: l("The power failure can interrupt loading and delay dispatch; the school event is unrelated.", "बिजली बंद होने से लोडिंग रुक सकती है और डिस्पैच देर से हो सकता है; स्कूल की घटना असंबंधित है।", "ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਨਾਲ ਲੋਡਿੰਗ ਰੁਕ ਸਕਦੀ ਹੈ ਅਤੇ ਡਿਸਪੈਚ ਦੇਰ ਨਾਲ ਹੋ ਸਕਦਾ ਹੈ; ਸਕੂਲ ਦੀ ਘਟਨਾ ਅਸੰਬੰਧਤ ਹੈ।"),
  },
]);

const ROMAN = ["I", "II", "III"] as const;
const LABELS: Record<CaeLocale, Readonly<{ causePrompt: string; effectPrompt: string; statement: string; causes: string; effects: string }>> = {
  "en-IN": { causePrompt: "Which of the following can reasonably explain the observation?", effectPrompt: "Which of the following can reasonably follow from the cause?", statement: "Statement", causes: "Possible causes", effects: "Possible effects" },
  "hi-IN": { causePrompt: "निम्नलिखित में से कौन-सा अवलोकन का उचित कारण हो सकता है?", effectPrompt: "निम्नलिखित में से कौन-सा कारण से उचित रूप से हो सकता है?", statement: "कथन", causes: "संभावित कारण", effects: "संभावित प्रभाव" },
  "pa-IN": { causePrompt: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਿਰੀਖਣ ਦਾ ਵਾਜਬ ਕਾਰਨ ਹੋ ਸਕਦਾ ਹੈ?", effectPrompt: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਾਰਨ ਤੋਂ ਵਾਜਬ ਤੌਰ ਤੇ ਹੋ ਸਕਦਾ ਹੈ?", statement: "ਕਥਨ", causes: "ਸੰਭਾਵਿਤ ਕਾਰਨ", effects: "ਸੰਭਾਵਿਤ ਪ੍ਰਭਾਵ" },
};

const COMBO_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": { NONE: "Neither is possible.", I: "Only I is possible.", II: "Only II is possible.", III: "Only III is possible.", I_II: "Only I and II are possible.", I_III: "Only I and III are possible.", II_III: "Only II and III are possible.", ALL: "I, II and III are all possible.", BOTH: "Both I and II are possible." },
  "hi-IN": { NONE: "दोनों में से कोई भी संभव नहीं है।", I: "केवल I संभव है।", II: "केवल II संभव है।", III: "केवल III संभव है।", I_II: "केवल I और II संभव हैं।", I_III: "केवल I और III संभव हैं।", II_III: "केवल II और III संभव हैं।", ALL: "I, II और III तीनों संभव हैं।", BOTH: "I और II दोनों संभव हैं।" },
  "pa-IN": { NONE: "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਸੰਭਵ ਨਹੀਂ ਹੈ।", I: "ਕੇਵਲ I ਸੰਭਵ ਹੈ।", II: "ਕੇਵਲ II ਸੰਭਵ ਹੈ।", III: "ਕੇਵਲ III ਸੰਭਵ ਹੈ।", I_II: "ਕੇਵਲ I ਅਤੇ II ਸੰਭਵ ਹਨ।", I_III: "ਕੇਵਲ I ਅਤੇ III ਸੰਭਵ ਹਨ।", II_III: "ਕੇਵਲ II ਅਤੇ III ਸੰਭਵ ਹਨ।", ALL: "I, II ਅਤੇ III ਤਿੰਨੇ ਸੰਭਵ ਹਨ।", BOTH: "I ਅਤੇ II ਦੋਵੇਂ ਸੰਭਵ ਹਨ।" },
};

function mix32(value: number): number { let x = value | 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
function hashText(value: string): number { let hash = 2166136261; for (const ch of value) { hash ^= ch.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function shuffled<T>(values: readonly T[], seed: number): readonly T[] { const out = [...values]; let state = mix32(seed); for (let i = out.length - 1; i > 0; i -= 1) { state = mix32(state + i); const j = state % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }

function makeWorld(scenario: ComboScenario): CaeCausalWorld {
  const id = `CAE-WORLD-COMBO-${scenario.id}`;
  const causeMode = scenario.qlId === "CAE-QL-003";
  const anchorId = `${id}:anchor`;
  const nodes = [
    {
      id: anchorId,
      semanticSlot: "anchor",
      role: causeMode ? "EFFECT" as const : "CAUSE" as const,
      temporalOrder: causeMode ? 2 : 1,
      timeBand: causeMode ? "IMMEDIATE_RESPONSE" as const : "TRIGGER" as const,
      scope: "LOCAL" as const,
      magnitude: "MODERATE" as const,
      severity: "MODERATE" as const,
      primaryEffect: causeMode,
      text: scenario.anchor,
    },
    ...scenario.candidates.map((candidate, index) => ({
      id: `${id}:candidate-${index + 1}`,
      semanticSlot: `candidate-${index + 1}`,
      role: scenario.validIndices.includes(index) ? (causeMode ? "CAUSE" as const : "EFFECT" as const) : "COMPETING" as const,
      temporalOrder: causeMode ? 1 : 2,
      timeBand: causeMode ? "TRIGGER" as const : "IMMEDIATE_RESPONSE" as const,
      scope: "LOCAL" as const,
      magnitude: "MODERATE" as const,
      severity: "LOW" as const,
      primaryEffect: !causeMode && scenario.validIndices.includes(index),
      text: candidate,
    })),
  ];
  const edges = scenario.validIndices.map((index) => ({
    from: causeMode ? `${id}:candidate-${index + 1}` : anchorId,
    to: causeMode ? anchorId : `${id}:candidate-${index + 1}`,
    strength: "PRIMARY" as const,
    temporalRelation: "IMMEDIATE" as const,
    directness: "DIRECT" as const,
  }));
  return { id, scenarioFamilyId: causeMode ? "CAE-FAM-POSSIBLE-CAUSE-COMBINATION" : "CAE-FAM-POSSIBLE-EFFECT-COMBINATION", scenarioVariantId: scenario.id, domain: scenario.domain, nodes, edges, sourceMode: "CURATED_COMPOSABLE_SCENARIO" };
}

export const CAE_COMBINATION_WORLDS = Object.freeze(CAE_COMBINATION_SCENARIOS.map(makeWorld));

function truthIndices(scenario: ComboScenario, world: CaeCausalWorld): readonly number[] {
  const anchorId = `${world.id}:anchor`;
  return scenario.candidates.flatMap((_, index) => {
    const candidateId = `${world.id}:candidate-${index + 1}`;
    const valid = scenario.qlId === "CAE-QL-003" ? hasDirectEdge(world, candidateId, anchorId) : hasDirectEdge(world, anchorId, candidateId);
    return valid ? [index] : [];
  });
}

function comboId(indices: readonly number[], count: number): string {
  if (indices.length === 0) return "NONE";
  if (count === 2 && indices.length === 2) return "BOTH";
  if (indices.length === count) return "ALL";
  return indices.map((index) => ROMAN[index]).join("_");
}

function optionIdsFor(scenario: ComboScenario, correctId: string, seed: number): readonly string[] {
  if (scenario.candidates.length === 2) return shuffled(["I", "II", "BOTH", "NONE"], seed);
  const all = ["I", "II", "III", "I_II", "I_III", "II_III", "ALL", "NONE"];
  const wrong = shuffled(all.filter((id) => id !== correctId), seed).slice(0, 3);
  return shuffled([correctId, ...wrong], seed ^ 0x43f1);
}

function difficultyFor(scenario: ComboScenario): Readonly<{ difficulty: CaeDifficulty; evidence: CaeDifficultyEvidence }> {
  const three = scenario.mode === "EFFECT_THREE";
  return {
    difficulty: three ? "HARD" : "MEDIUM",
    evidence: {
      causalDistance: 1,
      hiddenLinks: 0,
      topologyComplexity: scenario.validIndices.length > 1 ? 2 : 1,
      plausibleDistractors: scenario.candidates.length - scenario.validIndices.length,
      visibleEventCount: 1 + scenario.candidates.length,
      inferenceBurden: three ? 5 : 3,
      candidatePlausibilityBurden: three ? 4 : 2,
      score: three ? 18 : 12,
    },
  };
}

export function generateCaeCombinationQuestion(input: Readonly<{ qlId: "CAE-QL-003" | "CAE-QL-004"; locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const pool = CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === input.qlId);
  const scenario = pool[mix32((input.seed >>> 0) ^ hashText(input.qlId)) % pool.length]!;
  const world = CAE_COMBINATION_WORLDS.find((entry) => entry.scenarioVariantId === scenario.id)!;
  const truth = truthIndices(scenario, world);
  if (truth.join(",") !== scenario.validIndices.join(",")) throw new Error(`${scenario.id}: declared truth vector does not match canonical graph.`);
  const correctId = comboId(truth, scenario.candidates.length);
  const ids = optionIdsFor(scenario, correctId, mix32(input.seed ^ 0x74c9));
  const options: readonly CaeRenderedOption[] = ids.map((id) => ({ id, text: COMBO_TEXT[input.locale][id]!, isCorrect: id === correctId, distractorRole: id === correctId ? undefined : "OVERGENERALISATION" as const }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const labels = LABELS[input.locale];
  const listHeading = input.qlId === "CAE-QL-003" ? labels.causes : labels.effects;
  const prompt = input.qlId === "CAE-QL-003" ? labels.causePrompt : labels.effectPrompt;
  const stem = `${prompt}\n\n${labels.statement}: ${scenario.anchor[input.locale]}\n\n${listHeading}:\n${scenario.candidates.map((candidate, index) => `${ROMAN[index]}. ${candidate[input.locale]}`).join("\n")}`;
  const candidateIds = scenario.candidates.map((_, index) => `${world.id}:candidate-${index + 1}`);
  const anchorId = `${world.id}:anchor`;
  const stateId = [`projection:${input.qlId === "CAE-QL-003" ? "CAE-PLAN-PROBABLE-CAUSE-COMBINATION" : "CAE-PLAN-PROBABLE-EFFECT-COMBINATION"}`, `family:${world.scenarioFamilyId}`, `variant:${scenario.id}`, `truth:${truth.join("-") || "none"}`].join("|");
  const itemVariantId = [stateId, "profile:FOUR_WAY", `presentation:${options.map((option) => option.id).join(">")}`].join("|");
  const derived = difficultyFor(scenario);
  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: input.qlId === "CAE-QL-003" ? "CAE-CP-003" : "CAE-CP-004",
    qlId: input.qlId,
    projectionId: input.qlId === "CAE-QL-003" ? "CAE-PLAN-PROBABLE-CAUSE-COMBINATION" : "CAE-PLAN-PROBABLE-EFFECT-COMBINATION",
    scenarioFamilyId: world.scenarioFamilyId,
    scenarioVariantId: scenario.id,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: world.id,
    causalStructure: `${scenario.mode}:${correctId}`,
    locale: input.locale,
    seed: input.seed,
    difficulty: derived.difficulty,
    difficultyEvidence: derived.evidence,
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: [anchorId, ...candidateIds], hiddenNodeIds: [] },
    stem,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: correctId,
    explanation: scenario.rationale[input.locale],
    causalTrace: input.qlId === "CAE-QL-003" ? [...truth.map((index) => candidateIds[index]!), anchorId] : [anchorId, ...truth.map((index) => candidateIds[index]!)],
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: options,
    metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  });
}
