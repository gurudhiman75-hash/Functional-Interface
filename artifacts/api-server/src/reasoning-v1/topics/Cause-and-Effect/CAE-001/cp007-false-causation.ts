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

type Pattern = "CO_MOVEMENT" | "POST_HOC";
type FalseCausationVariant = Readonly<{
  id: string;
  domain: CaeDomain;
  pattern: Pattern;
  firstCause: LocalizedText;
  firstEffect: LocalizedText;
  secondCause: LocalizedText;
  secondEffect: LocalizedText;
}>;

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });

/**
 * CP-007 deliberately uses same-domain parallel chains. The visible outcomes
 * are tempting to connect, while the canonical world records separate causes.
 * This is materially different from pairing obviously unrelated incidents.
 */
export const CP007_FALSE_CAUSATION_VARIANTS: readonly FalseCausationVariant[] = Object.freeze([
  {
    id: "retail-orders-delivery",
    domain: "RETAIL",
    pattern: "POST_HOC",
    firstCause: l("The retailer started a week-long app discount.", "खुदरा विक्रेता ने ऐप पर एक सप्ताह की छूट शुरू की।", "ਖੁਦਰਾ ਵਿਕਰੇਤਾ ਨੇ ਐਪ ਉੱਤੇ ਇੱਕ ਹਫ਼ਤੇ ਦੀ ਛੂਟ ਸ਼ੁਰੂ ਕੀਤੀ।"),
    firstEffect: l("Online orders increased during the week.", "उस सप्ताह ऑनलाइन ऑर्डर बढ़ गए।", "ਉਸ ਹਫ਼ਤੇ ਆਨਲਾਈਨ ਆਰਡਰ ਵੱਧ ਗਏ।"),
    secondCause: l("The courier introduced route optimisation a few days later.", "कुछ दिन बाद कुरियर कंपनी ने मार्ग नियोजन में सुधार किया।", "ਕੁਝ ਦਿਨ ਬਾਅਦ ਕੂਰੀਅਰ ਕੰਪਨੀ ਨੇ ਰੂਟ ਯੋਜਨਾ ਵਿੱਚ ਸੁਧਾਰ ਕੀਤਾ।"),
    secondEffect: l("On-time deliveries improved later that month.", "उस महीने बाद में समय पर डिलीवरी बढ़ गई।", "ਉਸ ਮਹੀਨੇ ਬਾਅਦ ਵਿੱਚ ਸਮੇਂ ਸਿਰ ਡਿਲੀਵਰੀ ਵੱਧ ਗਈ।"),
  },
  {
    id: "rail-bookings-punctuality",
    domain: "TRANSPORT",
    pattern: "POST_HOC",
    firstCause: l("A fare discount was introduced for mobile tickets.", "मोबाइल टिकटों पर किराये में छूट शुरू की गई।", "ਮੋਬਾਈਲ ਟਿਕਟਾਂ ਉੱਤੇ ਕਿਰਾਏ ਦੀ ਛੂਟ ਸ਼ੁਰੂ ਕੀਤੀ ਗਈ।"),
    firstEffect: l("Mobile ticket bookings increased.", "मोबाइल टिकट बुकिंग बढ़ गई।", "ਮੋਬਾਈਲ ਟਿਕਟ ਬੁਕਿੰਗ ਵੱਧ ਗਈ।"),
    secondCause: l("A revised track-maintenance schedule began later in the month.", "महीने में बाद में पटरी रखरखाव का नया कार्यक्रम शुरू हुआ।", "ਮਹੀਨੇ ਵਿੱਚ ਬਾਅਦ ਵਿੱਚ ਪਟੜੀ ਰੱਖ-ਰਖਾਵ ਦਾ ਨਵਾਂ ਕਾਰਜਕ੍ਰਮ ਸ਼ੁਰੂ ਹੋਇਆ।"),
    secondEffect: l("Train delays decreased later in the month.", "महीने में बाद में ट्रेनों की देरी कम हुई।", "ਮਹੀਨੇ ਵਿੱਚ ਬਾਅਦ ਵਿੱਚ ਰੇਲਾਂ ਦੀ ਦੇਰੀ ਘੱਟ ਹੋਈ।"),
  },
  {
    id: "hospital-appointments-wait",
    domain: "CIVIC",
    pattern: "CO_MOVEMENT",
    firstCause: l("The hospital began sending appointment reminders.", "अस्पताल ने अपॉइंटमेंट की याद दिलाने वाले संदेश भेजने शुरू किए।", "ਹਸਪਤਾਲ ਨੇ ਅਪਾਇੰਟਮੈਂਟ ਯਾਦ ਦਿਵਾਉਣ ਵਾਲੇ ਸੁਨੇਹੇ ਭੇਜਣੇ ਸ਼ੁਰੂ ਕੀਤੇ।"),
    firstEffect: l("Missed appointments decreased.", "छूटे हुए अपॉइंटमेंट कम हो गए।", "ਛੁੱਟੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ ਘੱਟ ਹੋ ਗਈਆਂ।"),
    secondCause: l("An additional registration counter was opened.", "एक अतिरिक्त पंजीकरण काउंटर खोला गया।", "ਇੱਕ ਵਾਧੂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਾਊਂਟਰ ਖੋਲ੍ਹਿਆ ਗਿਆ।"),
    secondEffect: l("Registration waiting time decreased.", "पंजीकरण की प्रतीक्षा अवधि कम हो गई।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ਉਡੀਕ ਸਮਾਂ ਘੱਟ ਹੋ ਗਿਆ।"),
  },
  {
    id: "factory-downtime-electricity",
    domain: "MANUFACTURING",
    pattern: "CO_MOVEMENT",
    firstCause: l("The factory introduced preventive machine maintenance.", "फैक्टरी ने मशीनों का निवारक रखरखाव शुरू किया।", "ਫੈਕਟਰੀ ਨੇ ਮਸ਼ੀਨਾਂ ਦਾ ਰੋਕਥਾਮੀ ਰੱਖ-ਰਖਾਵ ਸ਼ੁਰੂ ਕੀਤਾ।"),
    firstEffect: l("Machine downtime decreased during the quarter.", "तिमाही के दौरान मशीनों का बंद रहने का समय घट गया।", "ਤਿਮਾਹੀ ਦੌਰਾਨ ਮਸ਼ੀਨਾਂ ਦੇ ਬੰਦ ਰਹਿਣ ਦਾ ਸਮਾਂ ਘੱਟ ਗਿਆ।"),
    secondCause: l("The factory replaced old lighting with LED fixtures.", "फैक्टरी ने पुरानी लाइटों की जगह एलईडी लाइटें लगाईं।", "ਫੈਕਟਰੀ ਨੇ ਪੁਰਾਣੀਆਂ ਲਾਈਟਾਂ ਦੀ ਥਾਂ ਐਲਈਡੀ ਲਾਈਟਾਂ ਲਗਾਈਆਂ।"),
    secondEffect: l("Electricity use decreased during the quarter.", "तिमाही के दौरान बिजली की खपत घट गई।", "ਤਿਮਾਹੀ ਦੌਰਾਨ ਬਿਜਲੀ ਦੀ ਖਪਤ ਘੱਟ ਗਈ।"),
  },
  {
    id: "college-portal-library",
    domain: "EDUCATION",
    pattern: "CO_MOVEMENT",
    firstCause: l("The college announced semester results online.", "कॉलेज ने सेमेस्टर के परिणाम ऑनलाइन घोषित किए।", "ਕਾਲਜ ਨੇ ਸਮੈਸਟਰ ਦੇ ਨਤੀਜੇ ਆਨਲਾਈਨ ਘੋਸ਼ਿਤ ਕੀਤੇ।"),
    firstEffect: l("Student logins to the college portal increased.", "कॉलेज पोर्टल पर छात्रों के लॉगिन बढ़ गए।", "ਕਾਲਜ ਪੋਰਟਲ ਉੱਤੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਲਾਗਇਨ ਵੱਧ ਗਏ।"),
    secondCause: l("The library extended its evening opening hours.", "पुस्तकालय ने शाम के खुलने का समय बढ़ा दिया।", "ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਸ਼ਾਮ ਦੇ ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ ਵਧਾ ਦਿੱਤਾ।"),
    secondEffect: l("Evening visits to the library increased.", "शाम के समय पुस्तकालय में आने वाले छात्र बढ़ गए।", "ਸ਼ਾਮ ਵੇਲੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਵੱਧ ਗਏ।"),
  },
  {
    id: "telecom-data-call-drops",
    domain: "INFRASTRUCTURE",
    pattern: "POST_HOC",
    firstCause: l("The telecom company introduced a lower-cost data pack.", "दूरसंचार कंपनी ने कम कीमत वाला डेटा पैक शुरू किया।", "ਟੈਲੀਕਾਮ ਕੰਪਨੀ ਨੇ ਘੱਟ ਕੀਮਤ ਵਾਲਾ ਡਾਟਾ ਪੈਕ ਸ਼ੁਰੂ ਕੀਤਾ।"),
    firstEffect: l("Mobile data use increased.", "मोबाइल डेटा का उपयोग बढ़ गया।", "ਮੋਬਾਈਲ ਡਾਟਾ ਦੀ ਵਰਤੋਂ ਵੱਧ ਗਈ।"),
    secondCause: l("Network engineers retuned several towers later that week.", "उस सप्ताह बाद में नेटवर्क इंजीनियरों ने कई टावरों की सेटिंग सुधारी।", "ਉਸ ਹਫ਼ਤੇ ਬਾਅਦ ਵਿੱਚ ਨੈੱਟਵਰਕ ਇੰਜੀਨੀਅਰਾਂ ਨੇ ਕਈ ਟਾਵਰਾਂ ਦੀ ਸੈਟਿੰਗ ਸੁਧਾਰੀ।"),
    secondEffect: l("Call-drop complaints decreased afterward.", "इसके बाद कॉल ड्रॉप की शिकायतें कम हो गईं।", "ਇਸ ਤੋਂ ਬਾਅਦ ਕਾਲ ਡਰਾਪ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਘੱਟ ਹੋ ਗਈਆਂ।"),
  },
  {
    id: "cinema-tickets-snack-wait",
    domain: "RETAIL",
    pattern: "POST_HOC",
    firstCause: l("The cinema introduced discounted weekday tickets.", "सिनेमा ने कार्यदिवस के टिकटों पर छूट शुरू की।", "ਸਿਨੇਮਾ ਨੇ ਹਫ਼ਤੇ ਦੇ ਕਾਰਜ ਦਿਨਾਂ ਵਾਲੀਆਂ ਟਿਕਟਾਂ ਉੱਤੇ ਛੂਟ ਸ਼ੁਰੂ ਕੀਤੀ।"),
    firstEffect: l("Weekday ticket sales increased.", "कार्यदिवस के टिकटों की बिक्री बढ़ गई।", "ਕਾਰਜ ਦਿਨਾਂ ਦੀਆਂ ਟਿਕਟਾਂ ਦੀ ਵਿਕਰੀ ਵੱਧ ਗਈ।"),
    secondCause: l("A second billing counter was added at the snack area.", "स्नैक क्षेत्र में दूसरा बिलिंग काउंटर जोड़ा गया।", "ਸਨੈਕ ਖੇਤਰ ਵਿੱਚ ਦੂਜਾ ਬਿਲਿੰਗ ਕਾਊਂਟਰ ਜੋੜਿਆ ਗਿਆ।"),
    secondEffect: l("Waiting time at the snack counter decreased.", "स्नैक काउंटर पर प्रतीक्षा समय कम हो गया।", "ਸਨੈਕ ਕਾਊਂਟਰ ਉੱਤੇ ਉਡੀਕ ਸਮਾਂ ਘੱਟ ਹੋ ਗਿਆ।"),
  },
  {
    id: "warehouse-volume-damage",
    domain: "RETAIL",
    pattern: "CO_MOVEMENT",
    firstCause: l("An online marketplace began a promotion for the warehouse's products.", "एक ऑनलाइन मार्केटप्लेस ने गोदाम के उत्पादों पर प्रचार शुरू किया।", "ਇੱਕ ਆਨਲਾਈਨ ਮਾਰਕੀਟਪਲੇਸ ਨੇ ਗੋਦਾਮ ਦੇ ਉਤਪਾਦਾਂ ਲਈ ਪ੍ਰਚਾਰ ਸ਼ੁਰੂ ਕੀਤਾ।"),
    firstEffect: l("The number of parcels dispatched increased.", "भेजे गए पार्सलों की संख्या बढ़ गई।", "ਭੇਜੇ ਗਏ ਪਾਰਸਲਾਂ ਦੀ ਗਿਣਤੀ ਵੱਧ ਗਈ।"),
    secondCause: l("The warehouse introduced a new packaging checklist.", "गोदाम ने पैकिंग के लिए नई जांच सूची लागू की।", "ਗੋਦਾਮ ਨੇ ਪੈਕਿੰਗ ਲਈ ਨਵੀਂ ਜਾਂਚ ਸੂਚੀ ਲਾਗੂ ਕੀਤੀ।"),
    secondEffect: l("Reports of damaged parcels decreased.", "क्षतिग्रस्त पार्सलों की शिकायतें कम हो गईं।", "ਖਰਾਬ ਪਾਰਸਲਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਘੱਟ ਹੋ ਗਈਆਂ।"),
  },
]);

const OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the cause and Statement I is its effect.",
    COMMON_CAUSE: "Both statements are effects of one common cause.",
    CORRELATION_ONLY: "The statements occur together or in sequence, but this does not establish causation between them.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II कारण है और कथन I उसका प्रभाव है।",
    COMMON_CAUSE: "दोनों कथन एक ही सामान्य कारण के प्रभाव हैं।",
    CORRELATION_ONLY: "कथन साथ-साथ या क्रम में हुए हैं, लेकिन इससे उनके बीच कारण-प्रभाव संबंध सिद्ध नहीं होता।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    COMMON_CAUSE: "ਦੋਵੇਂ ਕਥਨ ਇੱਕੋ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    CORRELATION_ONLY: "ਕਥਨ ਇਕੱਠੇ ਜਾਂ ਕ੍ਰਮ ਵਿੱਚ ਹੋਏ ਹਨ, ਪਰ ਇਸ ਨਾਲ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਸੰਬੰਧ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।",
  },
};

const COPY: Record<CaeLocale, Readonly<{ prompt: string; statementOne: string; statementTwo: string; separate: string; timing: string }>> = {
  "en-IN": {
    prompt: "Read the two statements and decide which conclusion is supported by the information given.",
    statementOne: "Statement I",
    statementTwo: "Statement II",
    separate: "Each visible change has its own supported cause; neither visible statement lies on a causal path to the other.",
    timing: "The timing may suggest a link, but sequence alone does not prove that one visible event caused the other.",
  },
  "hi-IN": {
    prompt: "दोनों कथन पढ़िए और दी गई जानकारी से समर्थित निष्कर्ष चुनिए।",
    statementOne: "कथन I",
    statementTwo: "कथन II",
    separate: "दिखाई गई दोनों घटनाओं के अलग-अलग समर्थित कारण हैं; कोई भी दिखाई गई घटना दूसरी के कारणात्मक पथ पर नहीं है।",
    timing: "समय-क्रम से संबंध लग सकता है, लेकिन केवल पहले-पश्चात होने से कारण-प्रभाव सिद्ध नहीं होता।",
  },
  "pa-IN": {
    prompt: "ਦੋਵੇਂ ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਸਮਰਥਿਤ ਨਤੀਜਾ ਚੁਣੋ।",
    statementOne: "ਕਥਨ I",
    statementTwo: "ਕਥਨ II",
    separate: "ਦਿਖਾਈਆਂ ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਮਰਥਿਤ ਕਾਰਨ ਹਨ; ਕੋਈ ਵੀ ਦਿਖਾਈ ਘਟਨਾ ਦੂਜੀ ਦੇ ਕਾਰਨਾਤਮਕ ਰਸਤੇ ਉੱਤੇ ਨਹੀਂ ਹੈ।",
    timing: "ਸਮੇਂ ਦੇ ਕ੍ਰਮ ਨਾਲ ਸੰਬੰਧ ਲੱਗ ਸਕਦਾ ਹੈ, ਪਰ ਕੇਵਲ ਪਹਿਲਾਂ-ਬਾਅਦ ਹੋਣ ਨਾਲ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।",
  },
};

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffled<T>(values: readonly T[], seed: number): readonly T[] {
  const result = [...values];
  let state = mix32(seed ^ 0x9e3779b9);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function materializeWorld(variant: FalseCausationVariant): CaeCausalWorld {
  const id = `CAE-WORLD-FALSE-CAUSATION-${variant.id}`;
  const secondCauseOrder = variant.pattern === "POST_HOC" ? 2 : 1;
  const secondEffectOrder = variant.pattern === "POST_HOC" ? 3 : 2;
  const nodes = [
    { id: `${id}:first-cause`, semanticSlot: "first-cause", role: "CAUSE" as const, temporalOrder: 1, timeBand: "TRIGGER" as const, scope: "SITE" as const, magnitude: "MODERATE" as const, severity: "LOW" as const, primaryEffect: false, text: variant.firstCause },
    { id: `${id}:first-effect`, semanticSlot: "first-effect", role: "EFFECT" as const, temporalOrder: 2, timeBand: "IMMEDIATE_RESPONSE" as const, scope: "SITE" as const, magnitude: "MODERATE" as const, severity: "LOW" as const, primaryEffect: true, text: variant.firstEffect },
    { id: `${id}:second-cause`, semanticSlot: "second-cause", role: "CAUSE" as const, temporalOrder: secondCauseOrder, timeBand: secondCauseOrder === 1 ? "TRIGGER" as const : "IMMEDIATE_RESPONSE" as const, scope: "SITE" as const, magnitude: "MODERATE" as const, severity: "LOW" as const, primaryEffect: false, text: variant.secondCause },
    { id: `${id}:second-effect`, semanticSlot: "second-effect", role: "EFFECT" as const, temporalOrder: secondEffectOrder, timeBand: secondEffectOrder === 2 ? "IMMEDIATE_RESPONSE" as const : "SAME_SHIFT" as const, scope: "SITE" as const, magnitude: "MODERATE" as const, severity: "LOW" as const, primaryEffect: true, text: variant.secondEffect },
  ];
  return {
    id,
    scenarioFamilyId: "CAE-FAM-FALSE-CAUSATION",
    scenarioVariantId: variant.id,
    domain: variant.domain,
    nodes,
    edges: [
      { from: `${id}:first-cause`, to: `${id}:first-effect`, strength: "PRIMARY", temporalRelation: "IMMEDIATE", directness: "DIRECT" },
      { from: `${id}:second-cause`, to: `${id}:second-effect`, strength: "PRIMARY", temporalRelation: variant.pattern === "POST_HOC" ? "SHORT_DELAY" : "IMMEDIATE", directness: "DIRECT" },
    ],
    sourceMode: "CURATED_COMPOSABLE_SCENARIO",
  };
}

export const CP007_FALSE_CAUSATION_WORLDS: readonly CaeCausalWorld[] = Object.freeze(CP007_FALSE_CAUSATION_VARIANTS.map(materializeWorld));

function optionRole(id: string) {
  if (id === "COMMON_CAUSE") return "COMMON_CAUSE_CONFUSION" as const;
  if (id === "SECOND_DIRECT_CAUSES_FIRST") return "REVERSE_CAUSATION" as const;
  if (id === "FIRST_DIRECT_CAUSES_SECOND") return "CORRELATION" as const;
  return undefined;
}

function difficulty(pattern: Pattern): Readonly<{ difficulty: CaeDifficulty; evidence: CaeDifficultyEvidence }> {
  const postHoc = pattern === "POST_HOC";
  const plausibleDistractors = postHoc ? 3 : 2;
  const candidatePlausibilityBurden = postHoc ? 3 : 0;
  const inferenceBurden = postHoc ? 5 : 3;
  const score = 0 + 2 * 2 + 2 + plausibleDistractors + Math.ceil(candidatePlausibilityBurden / 3) + 2 + inferenceBurden;
  return {
    difficulty: score >= 17 ? "HARD" : score >= 9 ? "MEDIUM" : "EASY",
    evidence: {
      causalDistance: 0,
      hiddenLinks: 2,
      topologyComplexity: 2,
      plausibleDistractors,
      visibleEventCount: 2,
      inferenceBurden,
      candidatePlausibilityBurden,
      score,
    },
  };
}

export function generateCp007FalseCausationQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const selectionSeed = mix32((input.seed >>> 0) ^ hashText("CAE-PLAN-CORRELATION:FALSE-CAUSATION"));
  const variant = CP007_FALSE_CAUSATION_VARIANTS[selectionSeed % CP007_FALSE_CAUSATION_VARIANTS.length]!;
  const world = CP007_FALSE_CAUSATION_WORLDS.find((entry) => entry.scenarioVariantId === variant.id)!;
  const firstEffect = `${world.id}:first-effect`;
  const secondEffect = `${world.id}:second-effect`;
  const reverse = mix32(selectionSeed ^ 0x71c7) % 2 === 1;
  const visibleNodeIds = reverse ? [secondEffect, firstEffect] : [firstEffect, secondEffect];
  const locale = input.locale;
  const copy = COPY[locale];
  const ids = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"] as const;
  const options: readonly CaeRenderedOption[] = shuffled(ids.map((id) => ({
    id,
    text: OPTION_TEXT[locale][id]!,
    isCorrect: id === "CORRELATION_ONLY",
    distractorRole: optionRole(id),
  })), mix32(selectionSeed ^ 0x4ac7));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const firstVisible = world.nodes.find((node) => node.id === visibleNodeIds[0])!;
  const secondVisible = world.nodes.find((node) => node.id === visibleNodeIds[1])!;
  const firstCause = world.nodes.find((node) => node.semanticSlot === (firstVisible.semanticSlot === "first-effect" ? "first-cause" : "second-cause"))!;
  const secondCause = world.nodes.find((node) => node.semanticSlot === (secondVisible.semanticSlot === "first-effect" ? "first-cause" : "second-cause"))!;
  const stateId = [
    "projection:CAE-PLAN-CORRELATION",
    "family:CAE-FAM-FALSE-CAUSATION",
    `variant:${variant.id}`,
    "graph:PARALLEL_CHAINS",
    `pattern:${variant.pattern}`,
    `visible:${firstVisible.semanticSlot},${secondVisible.semanticSlot}`,
  ].join("|");
  const itemVariantId = [
    stateId,
    "distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST",
    "profile:FOUR_WAY",
    `presentation:${options.map((option) => option.id).join(">")}`,
  ].join("|");
  const derived = difficulty(variant.pattern);
  const explanation = `${firstCause.text[locale].replace(/[.।]+$/u, "")} → ${firstVisible.text[locale].replace(/[.।]+$/u, "")}. ${secondCause.text[locale].replace(/[.।]+$/u, "")} → ${secondVisible.text[locale].replace(/[.।]+$/u, "")}. ${copy.separate}${variant.pattern === "POST_HOC" ? ` ${copy.timing}` : ""}`;

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-007",
    qlId: "CAE-QL-007",
    projectionId: "CAE-PLAN-CORRELATION",
    scenarioFamilyId: "CAE-FAM-FALSE-CAUSATION",
    scenarioVariantId: variant.id,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: world.id,
    causalStructure: `PARALLEL_CHAINS:${variant.pattern}:first-cause>first-effect|second-cause>second-effect`,
    locale,
    seed: input.seed,
    difficulty: derived.difficulty,
    difficultyEvidence: derived.evidence,
    questionProfile: "FOUR_WAY",
    visibleContext: {
      backdrop: null,
      visibleNodeIds,
      hiddenNodeIds: world.nodes.filter((node) => !visibleNodeIds.includes(node.id)).map((node) => node.id),
    },
    stem: `${copy.prompt}\n\n${copy.statementOne}: ${firstVisible.text[locale]}\n\n${copy.statementTwo}: ${secondVisible.text[locale]}`,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: "CORRELATION_ONLY",
    explanation,
    causalTrace: visibleNodeIds,
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: options,
    metadata: {
      solver: "CAE_CAUSAL_WORLD_SOLVER_V3",
      sourceMode: "CURATED_COMPOSABLE_SCENARIO",
      qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  });
}
