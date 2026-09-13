import { solveCaeRelationship } from "./causal-solver.ts";
import type {
  CaeCausalWorld,
  CaeDifficulty,
  CaeDomain,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
  LocalizedText,
} from "./types.ts";

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });

type CorrelationScenario = Readonly<{
  id: string;
  domain: CaeDomain;
  difficulty: CaeDifficulty;
  world: CaeCausalWorld;
  visibleSlots: readonly [string, string];
  rationale: LocalizedText;
}>;

function node(worldId: string, slot: string, role: "CAUSE" | "EFFECT", order: number, text: LocalizedText) {
  return {
    id: `${worldId}:${slot}`,
    semanticSlot: slot,
    role,
    temporalOrder: order,
    timeBand: order === 1 ? "TRIGGER" as const : "SAME_SHIFT" as const,
    scope: "CITY" as const,
    magnitude: "MODERATE" as const,
    severity: "MODERATE" as const,
    primaryEffect: role === "EFFECT",
    text,
  };
}

function directScenario(id: string, domain: CaeDomain, difficulty: CaeDifficulty, cause: LocalizedText, effect: LocalizedText, rationale: LocalizedText): CorrelationScenario {
  const worldId = `CAE-CORR-${id}`;
  const causeNode = node(worldId, "cause", "CAUSE", 1, cause);
  const effectNode = node(worldId, "effect", "EFFECT", 2, effect);
  return {
    id,
    domain,
    difficulty,
    world: {
      id: worldId,
      scenarioFamilyId: "CAE-FAM-CORRELATION-TRAPS",
      scenarioVariantId: id,
      domain,
      nodes: [causeNode, effectNode],
      edges: [{ from: causeNode.id, to: effectNode.id, strength: "PRIMARY", temporalRelation: "IMMEDIATE", directness: "DIRECT" }],
      sourceMode: "CURATED_COMPOSABLE_SCENARIO",
    },
    visibleSlots: ["cause", "effect"],
    rationale,
  };
}

function commonCauseScenario(id: string, domain: CaeDomain, difficulty: CaeDifficulty, common: LocalizedText, first: LocalizedText, second: LocalizedText, rationale: LocalizedText): CorrelationScenario {
  const worldId = `CAE-CORR-${id}`;
  const commonNode = node(worldId, "common-cause", "CAUSE", 1, common);
  const firstNode = node(worldId, "first-effect", "EFFECT", 2, first);
  const secondNode = node(worldId, "second-effect", "EFFECT", 2, second);
  return {
    id,
    domain,
    difficulty,
    world: {
      id: worldId,
      scenarioFamilyId: "CAE-FAM-CORRELATION-TRAPS",
      scenarioVariantId: id,
      domain,
      nodes: [commonNode, firstNode, secondNode],
      edges: [
        { from: commonNode.id, to: firstNode.id, strength: "PRIMARY", temporalRelation: "IMMEDIATE", directness: "DIRECT" },
        { from: commonNode.id, to: secondNode.id, strength: "PRIMARY", temporalRelation: "IMMEDIATE", directness: "DIRECT" },
      ],
      sourceMode: "CURATED_COMPOSABLE_SCENARIO",
    },
    visibleSlots: ["first-effect", "second-effect"],
    rationale,
  };
}

function coexistenceScenario(id: string, domain: CaeDomain, difficulty: CaeDifficulty, firstCause: LocalizedText, first: LocalizedText, secondCause: LocalizedText, second: LocalizedText, rationale: LocalizedText): CorrelationScenario {
  const worldId = `CAE-CORR-${id}`;
  const firstCauseNode = node(worldId, "first-cause", "CAUSE", 1, firstCause);
  const firstNode = node(worldId, "first-effect", "EFFECT", 2, first);
  const secondCauseNode = node(worldId, "second-cause", "CAUSE", 1, secondCause);
  const secondNode = node(worldId, "second-effect", "EFFECT", 2, second);
  return {
    id,
    domain,
    difficulty,
    world: {
      id: worldId,
      scenarioFamilyId: "CAE-FAM-CORRELATION-TRAPS",
      scenarioVariantId: id,
      domain,
      nodes: [firstCauseNode, firstNode, secondCauseNode, secondNode],
      edges: [
        { from: firstCauseNode.id, to: firstNode.id, strength: "PRIMARY", temporalRelation: "IMMEDIATE", directness: "DIRECT" },
        { from: secondCauseNode.id, to: secondNode.id, strength: "PRIMARY", temporalRelation: "IMMEDIATE", directness: "DIRECT" },
      ],
      sourceMode: "CURATED_COMPOSABLE_SCENARIO",
    },
    visibleSlots: ["first-effect", "second-effect"],
    rationale,
  };
}

export const CAE_CP007_CORRELATION_SCENARIOS: readonly CorrelationScenario[] = Object.freeze([
  directScenario(
    "signal-slowdown", "TRANSPORT", "EASY",
    l("A signal fault was detected on a rail section.", "रेल के एक हिस्से में सिग्नल की खराबी मिली।", "ਰੇਲ ਦੇ ਇੱਕ ਹਿੱਸੇ ਵਿੱਚ ਸਿਗਨਲ ਦੀ ਖਰਾਬੀ ਮਿਲੀ।"),
    l("Trains were instructed to move cautiously through that section.", "ट्रेनों को उस हिस्से से सावधानी से चलने का निर्देश दिया गया।", "ਰੇਲਾਂ ਨੂੰ ਉਸ ਹਿੱਸੇ ਵਿੱਚੋਂ ਸਾਵਧਾਨੀ ਨਾਲ ਲੰਘਣ ਲਈ ਕਿਹਾ ਗਿਆ।"),
    l("The instruction follows directly from the signal fault; this is causation, not mere co-occurrence.", "सावधानी का निर्देश सीधे सिग्नल की खराबी के कारण दिया गया; यह केवल साथ-साथ होना नहीं है।", "ਸਾਵਧਾਨੀ ਵਾਲੀ ਹਦਾਇਤ ਸਿੱਧੇ ਸਿਗਨਲ ਦੀ ਖਰਾਬੀ ਕਾਰਨ ਦਿੱਤੀ ਗਈ; ਇਹ ਸਿਰਫ਼ ਇਕੱਠੇ ਵਾਪਰਨਾ ਨਹੀਂ ਹੈ।"),
  ),
  directScenario(
    "bridge-diversion", "TRANSPORT", "EASY",
    l("A bridge on the main route was closed for urgent repairs.", "मुख्य मार्ग का पुल जरूरी मरम्मत के लिए बंद किया गया।", "ਮੁੱਖ ਰਸਤੇ ਦਾ ਪੁਲ ਤੁਰੰਤ ਮੁਰੰਮਤ ਲਈ ਬੰਦ ਕੀਤਾ ਗਿਆ।"),
    l("Traffic was diverted through nearby streets.", "यातायात को पास की सड़कों से मोड़ा गया।", "ਆਵਾਜਾਈ ਨੂੰ ਨੇੜਲੀਆਂ ਸੜਕਾਂ ਰਾਹੀਂ ਮੋੜਿਆ ਗਿਆ।"),
    l("The diversion was a direct response to the bridge closure.", "यातायात मोड़ना पुल बंद होने की सीधी प्रतिक्रिया थी।", "ਆਵਾਜਾਈ ਮੋੜਨਾ ਪੁਲ ਬੰਦ ਹੋਣ ਦੀ ਸਿੱਧੀ ਪ੍ਰਤੀਕ੍ਰਿਆ ਸੀ।"),
  ),
  directScenario(
    "server-queue", "INFRASTRUCTURE", "MEDIUM",
    l("A public-service server received an unusually high number of requests.", "एक सार्वजनिक सेवा सर्वर को असामान्य रूप से बहुत अनुरोध मिले।", "ਇੱਕ ਜਨਤਕ ਸੇਵਾ ਸਰਵਰ ਨੂੰ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਬਹੁਤ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ।"),
    l("The server response queue grew rapidly.", "सर्वर की प्रतिक्रिया कतार तेजी से बढ़ गई।", "ਸਰਵਰ ਦੀ ਜਵਾਬ ਕਤਾਰ ਤੇਜ਼ੀ ਨਾਲ ਵੱਧ ਗਈ।"),
    l("The unusually high request load directly produced the larger response queue.", "असामान्य अनुरोध भार ने सीधे प्रतिक्रिया कतार बढ़ाई।", "ਅਸਧਾਰਣ ਬੇਨਤੀ ਭਾਰ ਨੇ ਸਿੱਧੇ ਜਵਾਬ ਕਤਾਰ ਵਧਾਈ।"),
  ),
  directScenario(
    "roadwork-merge", "CIVIC", "MEDIUM",
    l("Roadwork closed one lane of a busy road.", "सड़क मरम्मत के कारण व्यस्त सड़क की एक लेन बंद हुई।", "ਸੜਕ ਮੁਰੰਮਤ ਕਾਰਨ ਰੁਸ਼ ਵਾਲੀ ਸੜਕ ਦੀ ਇੱਕ ਲੇਨ ਬੰਦ ਹੋਈ।"),
    l("Vehicles merged into the remaining lane.", "वाहन बची हुई लेन में मिलने लगे।", "ਵਾਹਨ ਬਚੀ ਹੋਈ ਲੇਨ ਵਿੱਚ ਮਿਲਣ ਲੱਗੇ।"),
    l("The lane closure directly forced vehicles to merge.", "लेन बंद होने से वाहनों को सीधे दूसरी लेन में मिलना पड़ा।", "ਲੇਨ ਬੰਦ ਹੋਣ ਕਾਰਨ ਵਾਹਨਾਂ ਨੂੰ ਸਿੱਧੇ ਬਚੀ ਲੇਨ ਵਿੱਚ ਮਿਲਣਾ ਪਿਆ।"),
  ),
  commonCauseScenario(
    "heat-demand", "WEATHER", "MEDIUM",
    l("A prolonged heatwave affected the town.", "कस्बे में लंबे समय तक लू चली।", "ਕਸਬੇ ਵਿੱਚ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਗਰਮੀ ਦੀ ਲਹਿਰ ਰਹੀ।"),
    l("Water consumption rose sharply.", "पानी की खपत तेजी से बढ़ी।", "ਪਾਣੀ ਦੀ ਖਪਤ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
    l("Electricity demand rose sharply.", "बिजली की मांग तेजी से बढ़ी।", "ਬਿਜਲੀ ਦੀ ਮੰਗ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
    l("Neither rise causes the other; both are explained by the heatwave.", "एक बढ़ोतरी दूसरी का कारण नहीं है; दोनों का सामान्य कारण लू है।", "ਇੱਕ ਵਾਧਾ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ; ਦੋਵਾਂ ਦਾ ਸਾਂਝਾ ਕਾਰਨ ਗਰਮੀ ਦੀ ਲਹਿਰ ਹੈ।"),
  ),
  commonCauseScenario(
    "festival-demand", "CIVIC", "MEDIUM",
    l("A large local festival began in the town centre.", "शहर के केंद्र में बड़ा स्थानीय उत्सव शुरू हुआ।", "ਸ਼ਹਿਰ ਦੇ ਕੇਂਦਰ ਵਿੱਚ ਵੱਡਾ ਸਥਾਨਕ ਮੇਲਾ ਸ਼ੁਰੂ ਹੋਇਆ।"),
    l("Demand for local buses increased.", "स्थानीय बसों की मांग बढ़ी।", "ਸਥਾਨਕ ਬੱਸਾਂ ਦੀ ਮੰਗ ਵਧੀ।"),
    l("Mobile-data use in the area increased.", "क्षेत्र में मोबाइल डेटा का उपयोग बढ़ा।", "ਇਲਾਕੇ ਵਿੱਚ ਮੋਬਾਈਲ ਡਾਟਾ ਦੀ ਵਰਤੋਂ ਵਧੀ।"),
    l("The festival explains both increases; bus demand does not cause mobile-data use or vice versa.", "उत्सव दोनों बढ़ोतरी समझाता है; बसों की मांग मोबाइल डेटा उपयोग का कारण नहीं है और न इसका उलटा।", "ਮੇਲਾ ਦੋਵੇਂ ਵਾਧੇ ਸਮਝਾਉਂਦਾ ਹੈ; ਬੱਸਾਂ ਦੀ ਮੰਗ ਮੋਬਾਈਲ ਡਾਟਾ ਵਰਤੋਂ ਦਾ ਕਾਰਨ ਨਹੀਂ ਅਤੇ ਨਾ ਹੀ ਇਸ ਦਾ ਉਲਟ।"),
  ),
  commonCauseScenario(
    "admissions-pressure", "EDUCATION", "HARD",
    l("College admissions opened for the new session.", "नए सत्र के लिए कॉलेज प्रवेश शुरू हुए।", "ਨਵੇਂ ਸੈਸ਼ਨ ਲਈ ਕਾਲਜ ਦਾਖਲੇ ਸ਼ੁਰੂ ਹੋਏ।"),
    l("Enquiries at counselling desks increased.", "काउंसलिंग डेस्क पर पूछताछ बढ़ी।", "ਕਾਊਂਸਲਿੰਗ ਡੈਸਕਾਂ ਤੇ ਪੁੱਛਗਿੱਛ ਵਧੀ।"),
    l("Demand for student-hostel rooms increased.", "छात्रावास कमरों की मांग बढ़ी।", "ਵਿਦਿਆਰਥੀ ਹੋਸਟਲ ਕਮਰਿਆਂ ਦੀ ਮੰਗ ਵਧੀ।"),
    l("Both observations follow from the admission period; neither observation by itself causes the other.", "दोनों घटनाएं प्रवेश अवधि से उत्पन्न होती हैं; कोई भी एक घटना दूसरी का कारण नहीं है।", "ਦੋਵੇਂ ਨਿਰੀਖਣ ਦਾਖਲਾ ਅਵਧੀ ਤੋਂ ਪੈਦਾ ਹੁੰਦੇ ਹਨ; ਕੋਈ ਇੱਕ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੈ।"),
  ),
  commonCauseScenario(
    "rain-city-effects", "WEATHER", "HARD",
    l("Heavy rain continued across the city for several hours.", "शहर में कई घंटों तक तेज बारिश जारी रही।", "ਸ਼ਹਿਰ ਵਿੱਚ ਕਈ ਘੰਟਿਆਂ ਤੱਕ ਤੇਜ਼ ਮੀਂਹ ਜਾਰੀ ਰਿਹਾ।"),
    l("Umbrella sales increased at local shops.", "स्थानीय दुकानों पर छतरियों की बिक्री बढ़ी।", "ਸਥਾਨਕ ਦੁਕਾਨਾਂ ਤੇ ਛਤਰੀਆਂ ਦੀ ਵਿਕਰੀ ਵਧੀ।"),
    l("Traffic moved more slowly on several roads.", "कई सड़कों पर यातायात धीमा चला।", "ਕਈ ਸੜਕਾਂ ਤੇ ਆਵਾਜਾਈ ਹੌਲੀ ਚੱਲੀ।"),
    l("The rain can explain both observations; increased umbrella sales do not make traffic slower.", "बारिश दोनों घटनाओं को समझाती है; छतरियों की अधिक बिक्री से यातायात धीमा नहीं होता।", "ਮੀਂਹ ਦੋਵੇਂ ਨਿਰੀਖਣ ਸਮਝਾਉਂਦਾ ਹੈ; ਛਤਰੀਆਂ ਦੀ ਵਧੀ ਵਿਕਰੀ ਆਵਾਜਾਈ ਨੂੰ ਹੌਲਾ ਨਹੀਂ ਕਰਦੀ।"),
  ),
  coexistenceScenario(
    "january-trends", "CIVIC", "MEDIUM",
    l("A New Year membership offer was introduced at several gyms.", "कई जिमों में नए साल की सदस्यता पेशकश शुरू हुई।", "ਕਈ ਜਿਮਾਂ ਵਿੱਚ ਨਵੇਂ ਸਾਲ ਦੀ ਮੈਂਬਰਸ਼ਿਪ ਪੇਸ਼ਕਸ਼ ਸ਼ੁਰੂ ਹੋਈ।"),
    l("Gym memberships increased in January.", "जनवरी में जिम सदस्यताएं बढ़ीं।", "ਜਨਵਰੀ ਵਿੱਚ ਜਿਮ ਮੈਂਬਰਸ਼ਿਪ ਵਧੀ।"),
    l("A bank expanded cashback offers for digital payments.", "एक बैंक ने डिजिटल भुगतान पर कैशबैक ऑफर बढ़ाए।", "ਇੱਕ ਬੈਂਕ ਨੇ ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਲਈ ਕੈਸ਼ਬੈਕ ਪੇਸ਼ਕਸ਼ਾਂ ਵਧਾਈਆਂ।"),
    l("Digital-payment transactions increased in January.", "जनवरी में डिजिटल भुगतान लेनदेन बढ़े।", "ਜਨਵਰੀ ਵਿੱਚ ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਲੈਣ-ਦੇਣ ਵਧੇ।"),
    l("The two increases occurred in the same month, but the information gives separate explanations and no causal link between them.", "दोनों बढ़ोतरी एक ही महीने में हुईं, लेकिन दी गई जानकारी उनके अलग कारण बताती है और उनके बीच कारणात्मक संबंध नहीं बनाती।", "ਦੋਵੇਂ ਵਾਧੇ ਇੱਕੋ ਮਹੀਨੇ ਵਿੱਚ ਹੋਏ, ਪਰ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਵੱਖਰੇ ਕਾਰਨ ਦਿੰਦੀ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਨਹੀਂ ਬਣਾਉਂਦੀ।"),
  ),
  coexistenceScenario(
    "friday-evening", "CIVIC", "HARD",
    l("A fuel-price increase was announced for the next morning.", "अगली सुबह ईंधन कीमत बढ़ने की घोषणा हुई।", "ਅਗਲੀ ਸਵੇਰ ਇੰਧਨ ਕੀਮਤ ਵਧਣ ਦੀ ਘੋਸ਼ਣਾ ਹੋਈ।"),
    l("Queues formed at several fuel stations on Friday evening.", "शुक्रवार शाम कई ईंधन स्टेशनों पर कतारें लगीं।", "ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ ਕਈ ਇੰਧਨ ਸਟੇਸ਼ਨਾਂ ਤੇ ਕਤਾਰਾਂ ਲੱਗੀਆਂ।"),
    l("Advance booking opened for a popular film.", "एक लोकप्रिय फिल्म की अग्रिम बुकिंग शुरू हुई।", "ਇੱਕ ਲੋਕਪ੍ਰਿਯ ਫ਼ਿਲਮ ਦੀ ਅਗਾਊਂ ਬੁਕਿੰਗ ਸ਼ੁਰੂ ਹੋਈ।"),
    l("Online movie-ticket bookings increased on Friday evening.", "शुक्रवार शाम ऑनलाइन फिल्म टिकट बुकिंग बढ़ी।", "ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ ਆਨਲਾਈਨ ਫ਼ਿਲਮ ਟਿਕਟ ਬੁਕਿੰਗ ਵਧੀ।"),
    l("The events share timing, but each has its own stated cause. Same-time movement does not establish causation.", "घटनाओं का समय समान है, लेकिन दोनों के अलग बताए गए कारण हैं। केवल एक ही समय पर बढ़ना कारण सिद्ध नहीं करता।", "ਘਟਨਾਵਾਂ ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੈ, ਪਰ ਦੋਵਾਂ ਦੇ ਵੱਖਰੇ ਦਿੱਤੇ ਕਾਰਨ ਹਨ। ਸਿਰਫ਼ ਇੱਕੋ ਵੇਲੇ ਵਧਣਾ ਕਾਰਨ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।"),
  ),
  coexistenceScenario(
    "city-evening", "TRANSPORT", "HARD",
    l("A private office shuttle service was suspended for the evening.", "एक निजी कार्यालय शटल सेवा शाम के लिए बंद हुई।", "ਇੱਕ ਨਿੱਜੀ ਦਫ਼ਤਰੀ ਸ਼ਟਲ ਸੇਵਾ ਸ਼ਾਮ ਲਈ ਬੰਦ ਹੋਈ।"),
    l("Metro ridership increased in the business district that evening.", "उस शाम व्यावसायिक क्षेत्र में मेट्रो यात्रियों की संख्या बढ़ी।", "ਉਸ ਸ਼ਾਮ ਕਾਰੋਬਾਰੀ ਇਲਾਕੇ ਵਿੱਚ ਮੈਟਰੋ ਯਾਤਰੀ ਵਧੇ।"),
    l("A televised sports final began that evening.", "उस शाम टीवी पर एक खेल फाइनल शुरू हुआ।", "ਉਸ ਸ਼ਾਮ ਟੀਵੀ ਤੇ ਇੱਕ ਖੇਡ ਫਾਈਨਲ ਸ਼ੁਰੂ ਹੋਇਆ।"),
    l("Food-delivery orders increased in nearby residential areas that evening.", "उस शाम पास के आवासीय क्षेत्रों में भोजन डिलीवरी ऑर्डर बढ़े।", "ਉਸ ਸ਼ਾਮ ਨੇੜਲੇ ਰਿਹਾਇਸ਼ੀ ਇਲਾਕਿਆਂ ਵਿੱਚ ਖਾਣੇ ਦੀ ਡਿਲੀਵਰੀ ਦੇ ਆਰਡਰ ਵਧੇ।"),
    l("The observations rose at the same time for different stated reasons; neither establishes causation of the other.", "दोनों घटनाएं एक ही समय बढ़ीं, पर उनके बताए कारण अलग हैं; कोई भी दूसरी का कारण सिद्ध नहीं होती।", "ਦੋਵੇਂ ਨਿਰੀਖਣ ਇੱਕੋ ਸਮੇਂ ਵਧੇ, ਪਰ ਦਿੱਤੇ ਕਾਰਨ ਵੱਖਰੇ ਹਨ; ਕੋਈ ਵੀ ਦੂਜੇ ਦਾ ਕਾਰਨ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।"),
  ),
  coexistenceScenario(
    "education-month", "EDUCATION", "HARD",
    l("A public library started a citywide membership drive.", "एक सार्वजनिक पुस्तकालय ने शहरव्यापी सदस्यता अभियान शुरू किया।", "ਇੱਕ ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਸ਼ਹਿਰ-ਪੱਧਰੀ ਮੈਂਬਰਸ਼ਿਪ ਮੁਹਿੰਮ ਸ਼ੁਰੂ ਕੀਤੀ।"),
    l("New library memberships increased during the month.", "महीने के दौरान नई पुस्तकालय सदस्यताएं बढ़ीं।", "ਮਹੀਨੇ ਦੌਰਾਨ ਨਵੀਆਂ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰਸ਼ਿਪਾਂ ਵਧੀਆਂ।"),
    l("A university bus route added two peak-hour services.", "एक विश्वविद्यालय बस मार्ग ने व्यस्त समय की दो सेवाएं जोड़ीं।", "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ ਬੱਸ ਰੂਟ ਨੇ ਪੀਕ ਸਮੇਂ ਦੀਆਂ ਦੋ ਸੇਵਾਵਾਂ ਜੋੜੀਆਂ।"),
    l("Boarding at the university bus stop increased during the month.", "महीने के दौरान विश्वविद्यालय बस स्टॉप पर चढ़ने वाले यात्रियों की संख्या बढ़ी।", "ਮਹੀਨੇ ਦੌਰਾਨ ਯੂਨੀਵਰਸਿਟੀ ਬੱਸ ਸਟਾਪ ਤੇ ਚੜ੍ਹਨ ਵਾਲੇ ਯਾਤਰੀ ਵਧੇ।"),
    l("The increases occur in the same broad setting and period, but each has a separate stated driver. Co-occurrence alone is not causation.", "दोनों बढ़ोतरी एक ही व्यापक परिवेश और अवधि में हुईं, लेकिन उनके अलग बताए कारण हैं। साथ-साथ होना ही कारण नहीं है।", "ਦੋਵੇਂ ਵਾਧੇ ਇੱਕੋ ਵੱਡੇ ਪ੍ਰਸੰਗ ਅਤੇ ਸਮੇਂ ਵਿੱਚ ਹੋਏ, ਪਰ ਉਨ੍ਹਾਂ ਦੇ ਵੱਖਰੇ ਦਿੱਤੇ ਕਾਰਨ ਹਨ। ਇਕੱਠੇ ਵਾਪਰਨਾ ਹੀ ਕਾਰਨ ਨਹੀਂ ਹੈ।"),
  ),
]);

const OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the direct cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the direct cause and Statement I is its effect.",
    COMMON_CAUSE: "Both statements are effects of a common cause.",
    CORRELATION_ONLY: "The observations may occur together, but the information does not establish that either causes the other.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I प्रत्यक्ष कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II प्रत्यक्ष कारण है और कथन I उसका प्रभाव है।",
    COMMON_CAUSE: "दोनों कथन एक सामान्य कारण के प्रभाव हैं।",
    CORRELATION_ONLY: "दोनों घटनाएं साथ हो सकती हैं, लेकिन दी गई जानकारी से यह सिद्ध नहीं होता कि एक दूसरी का कारण है।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਸਿੱਧਾ ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਸਿੱਧਾ ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    COMMON_CAUSE: "ਦੋਵੇਂ ਕਥਨ ਇੱਕ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    CORRELATION_ONLY: "ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਇਕੱਠੇ ਹੋ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ ਕਿ ਇੱਕ ਦੂਜੇ ਦਾ ਕਾਰਨ ਹੈ।",
  },
};

const STEM: Record<CaeLocale, string> = {
  "en-IN": "Read the two observations and choose the causal conclusion that is actually supported.",
  "hi-IN": "दोनों अवलोकन पढ़िए और वही कारणात्मक निष्कर्ष चुनिए जो वास्तव में समर्थित है।",
  "pa-IN": "ਦੋਵੇਂ ਨਿਰੀਖਣ ਪੜ੍ਹੋ ਅਤੇ ਉਹੀ ਕਾਰਨਾਤਮਕ ਨਤੀਜਾ ਚੁਣੋ ਜੋ ਵਾਸਤਵ ਵਿੱਚ ਸਮਰਥਿਤ ਹੈ।",
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

function shuffled<T>(values: readonly T[], seed: number): readonly T[] {
  const result = [...values];
  let state = mix32(seed ^ 0x6ac1e7);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

export function generateCaeCorrelationQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const scenario = CAE_CP007_CORRELATION_SCENARIOS[mix32(input.seed ^ 0x7017) % CAE_CP007_CORRELATION_SCENARIOS.length]!;
  const bySlot = (slot: string) => scenario.world.nodes.find((entry) => entry.semanticSlot === slot)!;
  let visibleIds: readonly [string, string] = [bySlot(scenario.visibleSlots[0]).id, bySlot(scenario.visibleSlots[1]).id];
  if ((mix32(input.seed ^ 0x17) & 1) === 1) visibleIds = [visibleIds[1], visibleIds[0]];

  const solved = solveCaeRelationship(scenario.world, visibleIds[0], visibleIds[1]);
  const answerId = solved === "NO_CAUSAL_LINK" || solved === "INDEPENDENT_EFFECTS" || solved === "INDEPENDENT_CAUSES" ? "CORRELATION_ONLY" : solved;
  if (!["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"].includes(answerId)) {
    throw new Error(`${scenario.id}: unsupported CP-007 relationship '${solved}'.`);
  }

  const optionIds = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"] as const;
  const options: readonly CaeRenderedOption[] = shuffled(optionIds.map((id) => ({
    id,
    text: OPTION_TEXT[input.locale][id]!,
    isCorrect: id === answerId,
    distractorRole: id === answerId ? undefined : id === "COMMON_CAUSE" ? "COMMON_CAUSE_CONFUSION" as const : id === "CORRELATION_ONLY" ? "CORRELATION" as const : "REVERSE_CAUSATION" as const,
  })), input.seed);
  const correctIndex = options.findIndex((entry) => entry.isCorrect);
  const first = scenario.world.nodes.find((entry) => entry.id === visibleIds[0])!;
  const second = scenario.world.nodes.find((entry) => entry.id === visibleIds[1])!;
  const hiddenNodeIds = scenario.world.nodes.filter((entry) => !visibleIds.includes(entry.id)).map((entry) => entry.id);
  const causalStateId = `projection:CAE-PLAN-CORRELATION-V2|scenario:${scenario.id}|visible:${first.semanticSlot},${second.semanticSlot}|relation:${answerId}`;
  const itemVariantId = `${causalStateId}|presentation:${options.map((entry) => entry.id).join(">")}`;
  const score = scenario.difficulty === "EASY" ? 6 : scenario.difficulty === "MEDIUM" ? 11 : 17;

  return {
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-007",
    qlId: "CAE-QL-007",
    projectionId: "CAE-PLAN-CORRELATION-V2",
    scenarioFamilyId: "CAE-FAM-CORRELATION-TRAPS",
    scenarioVariantId: scenario.id,
    causalStateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: scenario.world.id,
    causalStructure: `CORRELATION_TRAP:${first.semanticSlot}>${second.semanticSlot}`,
    locale: input.locale,
    seed: input.seed,
    difficulty: scenario.difficulty,
    difficultyEvidence: {
      causalDistance: solved === "FIRST_DIRECT_CAUSES_SECOND" || solved === "SECOND_DIRECT_CAUSES_FIRST" ? 1 : 0,
      hiddenLinks: hiddenNodeIds.length,
      topologyComplexity: scenario.world.edges.length,
      plausibleDistractors: scenario.difficulty === "HARD" ? 2 : 1,
      visibleEventCount: 2,
      inferenceBurden: scenario.difficulty === "EASY" ? 1 : scenario.difficulty === "MEDIUM" ? 2 : 3,
      candidatePlausibilityBurden: scenario.difficulty === "HARD" ? 8 : scenario.difficulty === "MEDIUM" ? 4 : 1,
      score,
    },
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: visibleIds, hiddenNodeIds },
    stem: `${STEM[input.locale]}\n\n${input.locale === "en-IN" ? "Statement I" : input.locale === "hi-IN" ? "कथन I" : "ਕਥਨ I"}: ${first.text[input.locale]}\n\n${input.locale === "en-IN" ? "Statement II" : input.locale === "hi-IN" ? "कथन II" : "ਕਥਨ II"}: ${second.text[input.locale]}`,
    options: options.map((entry) => entry.text),
    correctIndex,
    answerId,
    explanation: scenario.rationale[input.locale],
    causalTrace: visibleIds,
    distractorMechanisms: options.flatMap((entry) => entry.distractorRole ? [entry.distractorRole] : []),
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
  };
}
