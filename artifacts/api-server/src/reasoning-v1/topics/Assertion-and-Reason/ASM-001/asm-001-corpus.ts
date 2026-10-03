import type { AsmAnswerClass } from "./asm-001-authority";

export type AsmLanguage = "en" | "hi" | "pa";
export type AsmDifficulty = "Easy" | "Medium" | "Hard";

export interface AsmLocalizedText {
  readonly en: string;
  readonly hi: string;
  readonly pa: string;
}

export interface AsmScenarioAuthority {
  readonly id: string;
  readonly answerClass: AsmAnswerClass;
  readonly difficulty: AsmDifficulty;
  readonly assertionTruth: boolean;
  readonly reasonTruth: boolean;
  readonly reasonExplainsAssertion: boolean;
  readonly assertion: AsmLocalizedText;
  readonly reason: AsmLocalizedText;
  readonly rationale: AsmLocalizedText;
  readonly domain:
    | "PHYSICS"
    | "CHEMISTRY"
    | "BIOLOGY"
    | "EARTH_SCIENCE"
    | "EVERYDAY_SCIENCE";
}

const l = (en: string, hi: string, pa: string): AsmLocalizedText =>
  Object.freeze({ en, hi, pa });

const s = (
  id: string,
  answerClass: AsmAnswerClass,
  difficulty: AsmDifficulty,
  assertionTruth: boolean,
  reasonTruth: boolean,
  reasonExplainsAssertion: boolean,
  assertion: AsmLocalizedText,
  reason: AsmLocalizedText,
  rationale: AsmLocalizedText,
  domain: AsmScenarioAuthority["domain"],
): AsmScenarioAuthority =>
  Object.freeze({
    id,
    answerClass,
    difficulty,
    assertionTruth,
    reasonTruth,
    reasonExplainsAssertion,
    assertion,
    reason,
    rationale,
    domain,
  });

export const ASM_001_SCENARIO_AUTHORITIES: readonly AsmScenarioAuthority[] =
  Object.freeze([
    s(
      "ASM-SC-001",
      "BOTH_TRUE_REASON_EXPLAINS",
      "Easy",
      true,
      true,
      true,
      l(
        "Food generally cooks faster in a pressure cooker.",
        "प्रेशर कुकर में भोजन सामान्यतः जल्दी पकता है।",
        "ਪ੍ਰੈਸ਼ਰ ਕੁੱਕਰ ਵਿੱਚ ਭੋਜਨ ਆਮ ਤੌਰ 'ਤੇ ਜਲਦੀ ਪੱਕਦਾ ਹੈ।",
      ),
      l(
        "Higher pressure raises the boiling point of water.",
        "अधिक दबाव पानी के क्वथनांक को बढ़ाता है।",
        "ਵੱਧ ਦਬਾਅ ਪਾਣੀ ਦੇ ਉਬਾਲ ਬਿੰਦੂ ਨੂੰ ਵਧਾਉਂਦਾ ਹੈ।",
      ),
      l(
        "Both statements are true, and the higher boiling temperature lets food cook at a higher temperature, which explains the faster cooking.",
        "दोनों कथन सही हैं। अधिक क्वथन तापमान के कारण भोजन अधिक तापमान पर पकता है, इसलिए कारण कथन दावे की सही व्याख्या करता है।",
        "ਦੋਵੇਂ ਬਿਆਨ ਸਹੀ ਹਨ। ਉੱਚੇ ਉਬਾਲ ਤਾਪਮਾਨ ਕਾਰਨ ਭੋਜਨ ਵੱਧ ਤਾਪਮਾਨ 'ਤੇ ਪੱਕਦਾ ਹੈ, ਇਸ ਲਈ ਕਾਰਨ ਬਿਆਨ ਦਾਅਵੇ ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਕਰਦਾ ਹੈ।",
      ),
      "EVERYDAY_SCIENCE",
    ),
    s(
      "ASM-SC-002",
      "BOTH_TRUE_REASON_EXPLAINS",
      "Easy",
      true,
      true,
      true,
      l(
        "Ice floats on liquid water.",
        "बर्फ तरल पानी पर तैरती है।",
        "ਬਰਫ਼ ਤਰਲ ਪਾਣੀ ਉੱਤੇ ਤੈਰਦੀ ਹੈ।",
      ),
      l(
        "Ice is less dense than liquid water.",
        "बर्फ का घनत्व तरल पानी से कम होता है।",
        "ਬਰਫ਼ ਦੀ ਘਣਤਾ ਤਰਲ ਪਾਣੀ ਨਾਲੋਂ ਘੱਟ ਹੁੰਦੀ ਹੈ।",
      ),
      l(
        "Both are true, and the lower density of ice is the direct reason it floats on liquid water.",
        "दोनों सही हैं और बर्फ का कम घनत्व ही उसके पानी पर तैरने का प्रत्यक्ष कारण है।",
        "ਦੋਵੇਂ ਸਹੀ ਹਨ ਅਤੇ ਬਰਫ਼ ਦੀ ਘੱਟ ਘਣਤਾ ਹੀ ਉਸ ਦੇ ਪਾਣੀ ਉੱਤੇ ਤੈਰਨ ਦਾ ਸਿੱਧਾ ਕਾਰਨ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-003",
      "BOTH_TRUE_REASON_EXPLAINS",
      "Medium",
      true,
      true,
      true,
      l(
        "Evaporation from the skin produces a cooling effect.",
        "त्वचा से वाष्पीकरण होने पर ठंडक महसूस होती है।",
        "ਚਮੜੀ ਤੋਂ ਬਾਫ਼ ਬਣਨ ਨਾਲ ਠੰਢਕ ਮਹਿਸੂਸ ਹੁੰਦੀ ਹੈ।",
      ),
      l(
        "During evaporation, higher-energy molecules escape from the liquid.",
        "वाष्पीकरण में अधिक ऊर्जा वाले अणु तरल से बाहर निकल जाते हैं।",
        "ਬਾਫ਼ ਬਣਨ ਦੌਰਾਨ ਵੱਧ ਊਰਜਾ ਵਾਲੇ ਅਣੂ ਤਰਲ ਤੋਂ ਬਾਹਰ ਨਿਕਲ ਜਾਂਦੇ ਹਨ।",
      ),
      l(
        "Both statements are true. When higher-energy molecules leave, the average energy of the remaining liquid falls, producing cooling.",
        "दोनों कथन सही हैं। अधिक ऊर्जा वाले अणुओं के निकलने से बचे हुए तरल की औसत ऊर्जा घटती है और ठंडक पैदा होती है।",
        "ਦੋਵੇਂ ਬਿਆਨ ਸਹੀ ਹਨ। ਵੱਧ ਊਰਜਾ ਵਾਲੇ ਅਣੂ ਨਿਕਲਣ ਨਾਲ ਬਚੇ ਤਰਲ ਦੀ ਔਸਤ ਊਰਜਾ ਘਟਦੀ ਹੈ ਅਤੇ ਠੰਢਕ ਪੈਦਾ ਹੁੰਦੀ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-004",
      "BOTH_TRUE_REASON_EXPLAINS",
      "Easy",
      true,
      true,
      true,
      l(
        "Sound cannot travel through a vacuum.",
        "ध्वनि निर्वात में यात्रा नहीं कर सकती।",
        "ਧੁਨੀ ਖ਼ਲਾਅ ਵਿੱਚ ਯਾਤਰਾ ਨਹੀਂ ਕਰ ਸਕਦੀ।",
      ),
      l(
        "Sound needs a material medium for its mechanical vibrations to propagate.",
        "ध्वनि के यांत्रिक कंपन के प्रसार के लिए पदार्थ माध्यम आवश्यक है।",
        "ਧੁਨੀ ਦੇ ਮਕੈਨਿਕਲ ਕੰਪਨਾਂ ਦੇ ਫੈਲਾਅ ਲਈ ਪਦਾਰਥਕ ਮਾਧਿਅਮ ਲੋੜੀਂਦਾ ਹੈ।",
      ),
      l(
        "Both are true, and the need for a material medium directly explains why sound cannot propagate in a vacuum.",
        "दोनों सही हैं और पदार्थ माध्यम की आवश्यकता सीधे समझाती है कि ध्वनि निर्वात में क्यों नहीं चल सकती।",
        "ਦੋਵੇਂ ਸਹੀ ਹਨ ਅਤੇ ਪਦਾਰਥਕ ਮਾਧਿਅਮ ਦੀ ਲੋੜ ਸਿੱਧੇ ਤੌਰ 'ਤੇ ਸਮਝਾਉਂਦੀ ਹੈ ਕਿ ਧੁਨੀ ਖ਼ਲਾਅ ਵਿੱਚ ਕਿਉਂ ਨਹੀਂ ਫੈਲ ਸਕਦੀ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-005",
      "BOTH_TRUE_REASON_EXPLAINS",
      "Medium",
      true,
      true,
      true,
      l(
        "Water boils at a lower temperature at high altitudes than at sea level.",
        "समुद्र तल की तुलना में ऊँचाई पर पानी कम तापमान पर उबलता है।",
        "ਸਮੁੰਦਰ ਤਲ ਨਾਲੋਂ ਉੱਚਾਈ 'ਤੇ ਪਾਣੀ ਘੱਟ ਤਾਪਮਾਨ 'ਤੇ ਉਬਲਦਾ ਹੈ।",
      ),
      l(
        "Atmospheric pressure decreases as altitude increases.",
        "ऊँचाई बढ़ने पर वायुमंडलीय दबाव घटता है।",
        "ਉੱਚਾਈ ਵਧਣ ਨਾਲ ਵਾਤਾਵਰਣੀ ਦਬਾਅ ਘਟਦਾ ਹੈ।",
      ),
      l(
        "Both are true. Lower external pressure lowers the temperature at which water's vapour pressure matches the surroundings.",
        "दोनों सही हैं। बाहरी दबाव कम होने पर पानी का वाष्प-दाब आसपास के दबाव के बराबर कम तापमान पर हो जाता है।",
        "ਦੋਵੇਂ ਸਹੀ ਹਨ। ਬਾਹਰੀ ਦਬਾਅ ਘੱਟ ਹੋਣ ਨਾਲ ਪਾਣੀ ਦਾ ਭਾਫ਼ ਦਬਾਅ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਦਬਾਅ ਦੇ ਬਰਾਬਰ ਘੱਟ ਤਾਪਮਾਨ 'ਤੇ ਹੋ ਜਾਂਦਾ ਹੈ।",
      ),
      "EARTH_SCIENCE",
    ),
    s(
      "ASM-SC-006",
      "BOTH_TRUE_REASON_EXPLAINS",
      "Medium",
      true,
      true,
      true,
      l(
        "Iron rusts more readily in moist air than in dry air.",
        "सूखी हवा की तुलना में नम हवा में लोहे पर जंग अधिक आसानी से लगती है।",
        "ਸੁੱਕੀ ਹਵਾ ਨਾਲੋਂ ਨਮੀ ਵਾਲੀ ਹਵਾ ਵਿੱਚ ਲੋਹੇ ਨੂੰ ਜੰਗ ਵੱਧ ਆਸਾਨੀ ਨਾਲ ਲੱਗਦੀ ਹੈ।",
      ),
      l(
        "Rusting of iron requires both oxygen and water.",
        "लोहे में जंग लगने के लिए ऑक्सीजन और पानी दोनों की आवश्यकता होती है।",
        "ਲੋਹੇ ਨੂੰ ਜੰਗ ਲੱਗਣ ਲਈ ਆਕਸੀਜਨ ਅਤੇ ਪਾਣੀ ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਹਨ।",
      ),
      l(
        "Both are true, and the availability of water in moist air helps provide the conditions required for rusting.",
        "दोनों सही हैं और नम हवा में उपलब्ध पानी जंग लगने के लिए आवश्यक परिस्थितियाँ प्रदान करता है।",
        "ਦੋਵੇਂ ਸਹੀ ਹਨ ਅਤੇ ਨਮੀ ਵਾਲੀ ਹਵਾ ਵਿੱਚ ਮੌਜੂਦ ਪਾਣੀ ਜੰਗ ਲੱਗਣ ਲਈ ਲੋੜੀਂਦੀਆਂ ਹਾਲਤਾਂ ਮੁਹੱਈਆ ਕਰਦਾ ਹੈ।",
      ),
      "CHEMISTRY",
    ),
    s(
      "ASM-SC-007",
      "BOTH_TRUE_REASON_NOT_EXPLAINS",
      "Easy",
      true,
      true,
      false,
      l(
        "Earth rotates from west to east.",
        "पृथ्वी पश्चिम से पूर्व की ओर घूमती है।",
        "ਧਰਤੀ ਪੱਛਮ ਤੋਂ ਪੂਰਬ ਵੱਲ ਘੁੰਮਦੀ ਹੈ।",
      ),
      l(
        "Earth revolves around the Sun.",
        "पृथ्वी सूर्य की परिक्रमा करती है।",
        "ਧਰਤੀ ਸੂਰਜ ਦੀ ਪਰਿਕਰਮਾ ਕਰਦੀ ਹੈ।",
      ),
      l(
        "Both statements are true, but Earth's revolution around the Sun does not explain the direction of its rotation about its own axis.",
        "दोनों कथन सही हैं, लेकिन सूर्य की परिक्रमा करना पृथ्वी के अपने अक्ष पर घूमने की दिशा की व्याख्या नहीं करता।",
        "ਦੋਵੇਂ ਬਿਆਨ ਸਹੀ ਹਨ, ਪਰ ਸੂਰਜ ਦੀ ਪਰਿਕਰਮਾ ਕਰਨਾ ਧਰਤੀ ਦੇ ਆਪਣੇ ਅਕਸ 'ਤੇ ਘੁੰਮਣ ਦੀ ਦਿਸ਼ਾ ਦੀ ਵਿਆਖਿਆ ਨਹੀਂ ਕਰਦਾ।",
      ),
      "EARTH_SCIENCE",
    ),
    s(
      "ASM-SC-008",
      "BOTH_TRUE_REASON_NOT_EXPLAINS",
      "Easy",
      true,
      true,
      false,
      l(
        "Copper is a good conductor of electricity.",
        "ताँबा विद्युत का अच्छा चालक है।",
        "ਤਾਂਬਾ ਬਿਜਲੀ ਦਾ ਚੰਗਾ ਚਾਲਕ ਹੈ।",
      ),
      l(
        "Copper has a reddish-brown colour.",
        "ताँबे का रंग लाल-भूरा होता है।",
        "ਤਾਂਬੇ ਦਾ ਰੰਗ ਲਾਲ-ਭੂਰਾ ਹੁੰਦਾ ਹੈ।",
      ),
      l(
        "Both statements are true, but copper's colour does not explain its electrical conductivity.",
        "दोनों कथन सही हैं, लेकिन ताँबे का रंग उसकी विद्युत चालकता की व्याख्या नहीं करता।",
        "ਦੋਵੇਂ ਬਿਆਨ ਸਹੀ ਹਨ, ਪਰ ਤਾਂਬੇ ਦਾ ਰੰਗ ਉਸ ਦੀ ਬਿਜਲੀ ਚਾਲਕਤਾ ਦੀ ਵਿਆਖਿਆ ਨਹੀਂ ਕਰਦਾ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-009",
      "BOTH_TRUE_REASON_NOT_EXPLAINS",
      "Medium",
      true,
      true,
      false,
      l(
        "Green plants require light for photosynthesis.",
        "हरे पौधों को प्रकाश-संश्लेषण के लिए प्रकाश की आवश्यकता होती है।",
        "ਹਰੇ ਪੌਦਿਆਂ ਨੂੰ ਪ੍ਰਕਾਸ਼ ਸੰਸ਼ਲੇਸ਼ਣ ਲਈ ਰੌਸ਼ਨੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।",
      ),
      l(
        "Plant roots absorb water from the soil.",
        "पौधों की जड़ें मिट्टी से पानी अवशोषित करती हैं।",
        "ਪੌਦਿਆਂ ਦੀਆਂ ਜੜਾਂ ਮਿੱਟੀ ਤੋਂ ਪਾਣੀ ਸੋਖਦੀਆਂ ਹਨ।",
      ),
      l(
        "Both statements are true. Root water uptake is relevant to plant function, but it does not explain why light is required for photosynthesis.",
        "दोनों कथन सही हैं। जड़ों द्वारा पानी लेना पौधे के लिए आवश्यक है, पर यह प्रकाश-संश्लेषण में प्रकाश की आवश्यकता की व्याख्या नहीं करता।",
        "ਦੋਵੇਂ ਬਿਆਨ ਸਹੀ ਹਨ। ਜੜਾਂ ਵੱਲੋਂ ਪਾਣੀ ਸੋਖਣਾ ਪੌਦੇ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਇਹ ਪ੍ਰਕਾਸ਼ ਸੰਸ਼ਲੇਸ਼ਣ ਵਿੱਚ ਰੌਸ਼ਨੀ ਦੀ ਲੋੜ ਦੀ ਵਿਆਖਿਆ ਨਹੀਂ ਕਰਦਾ।",
      ),
      "BIOLOGY",
    ),
    s(
      "ASM-SC-010",
      "BOTH_TRUE_REASON_NOT_EXPLAINS",
      "Medium",
      true,
      true,
      false,
      l(
        "The human heart pumps blood through the body.",
        "मानव हृदय शरीर में रक्त पंप करता है।",
        "ਮਨੁੱਖੀ ਦਿਲ ਸਰੀਰ ਵਿੱਚ ਖੂਨ ਪੰਪ ਕਰਦਾ ਹੈ।",
      ),
      l(
        "Red blood cells contain haemoglobin.",
        "लाल रक्त कोशिकाओं में हीमोग्लोबिन होता है।",
        "ਲਾਲ ਖੂਨ ਕੋਸ਼ਿਕਾਵਾਂ ਵਿੱਚ ਹੀਮੋਗਲੋਬਿਨ ਹੁੰਦਾ ਹੈ।",
      ),
      l(
        "Both are true, but haemoglobin in red blood cells does not explain the pumping action of the heart.",
        "दोनों सही हैं, लेकिन लाल रक्त कोशिकाओं में हीमोग्लोबिन होना हृदय की पंपिंग क्रिया की व्याख्या नहीं करता।",
        "ਦੋਵੇਂ ਸਹੀ ਹਨ, ਪਰ ਲਾਲ ਖੂਨ ਕੋਸ਼ਿਕਾਵਾਂ ਵਿੱਚ ਹੀਮੋਗਲੋਬਿਨ ਹੋਣਾ ਦਿਲ ਦੀ ਪੰਪ ਕਰਨ ਵਾਲੀ ਕਿਰਿਆ ਦੀ ਵਿਆਖਿਆ ਨਹੀਂ ਕਰਦਾ।",
      ),
      "BIOLOGY",
    ),
    s(
      "ASM-SC-011",
      "ASSERTION_TRUE_REASON_FALSE",
      "Easy",
      true,
      false,
      false,
      l(
        "Sound generally travels faster in solids than in gases.",
        "ध्वनि सामान्यतः गैसों की तुलना में ठोस पदार्थों में अधिक तेज चलती है।",
        "ਧੁਨੀ ਆਮ ਤੌਰ 'ਤੇ ਗੈਸਾਂ ਨਾਲੋਂ ਠੋਸ ਪਦਾਰਥਾਂ ਵਿੱਚ ਤੇਜ਼ ਚਲਦੀ ਹੈ।",
      ),
      l(
        "Sound cannot travel through solids.",
        "ध्वनि ठोस पदार्थों में यात्रा नहीं कर सकती।",
        "ਧੁਨੀ ਠੋਸ ਪਦਾਰਥਾਂ ਵਿੱਚ ਯਾਤਰਾ ਨਹੀਂ ਕਰ ਸਕਦੀ।",
      ),
      l(
        "The Assertion is true, but the Reason is false because sound can and does propagate through solids.",
        "कथन सही है, लेकिन कारण गलत है क्योंकि ध्वनि ठोस पदार्थों में भी प्रसारित हो सकती है।",
        "ਬਿਆਨ ਸਹੀ ਹੈ, ਪਰ ਕਾਰਨ ਗਲਤ ਹੈ ਕਿਉਂਕਿ ਧੁਨੀ ਠੋਸ ਪਦਾਰਥਾਂ ਵਿੱਚ ਵੀ ਫੈਲ ਸਕਦੀ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-012",
      "ASSERTION_TRUE_REASON_FALSE",
      "Easy",
      true,
      false,
      false,
      l(
        "A convex lens can converge a parallel beam of light.",
        "उत्तल लेंस समानांतर प्रकाश किरणों को अभिसरित कर सकता है।",
        "ਉੱਤਲ ਲੈਂਸ ਸਮਾਂਤਰ ਰੌਸ਼ਨੀ ਦੀਆਂ ਕਿਰਨਾਂ ਨੂੰ ਇਕੱਠਾ ਕਰ ਸਕਦਾ ਹੈ।",
      ),
      l(
        "A convex lens always diverges light rays.",
        "उत्तल लेंस हमेशा प्रकाश किरणों को अपसारित करता है।",
        "ਉੱਤਲ ਲੈਂਸ ਹਮੇਸ਼ਾਂ ਰੌਸ਼ਨੀ ਦੀਆਂ ਕਿਰਨਾਂ ਨੂੰ ਫੈਲਾਉਂਦਾ ਹੈ।",
      ),
      l(
        "The Assertion is true. The Reason is false because a convex lens is a converging lens for a parallel beam in the usual medium.",
        "कथन सही है। कारण गलत है क्योंकि सामान्य माध्यम में उत्तल लेंस समानांतर किरणों के लिए अभिसारी लेंस है।",
        "ਬਿਆਨ ਸਹੀ ਹੈ। ਕਾਰਨ ਗਲਤ ਹੈ ਕਿਉਂਕਿ ਆਮ ਮਾਧਿਅਮ ਵਿੱਚ ਉੱਤਲ ਲੈਂਸ ਸਮਾਂਤਰ ਕਿਰਨਾਂ ਲਈ ਇਕੱਠਾ ਕਰਨ ਵਾਲਾ ਲੈਂਸ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-013",
      "ASSERTION_TRUE_REASON_FALSE",
      "Medium",
      true,
      false,
      false,
      l(
        "Friction can produce heat.",
        "घर्षण से ऊष्मा उत्पन्न हो सकती है।",
        "ਘਰਸ਼ਣ ਨਾਲ ਗਰਮੀ ਪੈਦਾ ਹੋ ਸਕਦੀ ਹੈ।",
      ),
      l(
        "Friction acts only when two objects are stationary relative to each other.",
        "घर्षण केवल तब कार्य करता है जब दो वस्तुएँ एक-दूसरे के सापेक्ष स्थिर हों।",
        "ਘਰਸ਼ਣ ਕੇਵਲ ਤਦ ਹੀ ਕੰਮ ਕਰਦਾ ਹੈ ਜਦੋਂ ਦੋ ਵਸਤੂਆਂ ਇਕ-ਦੂਜੇ ਦੇ ਸਬੰਧ ਵਿੱਚ ਥਿਰ ਹੋਣ।",
      ),
      l(
        "The Assertion is true. The Reason is false because friction also acts during sliding and other relative motion.",
        "कथन सही है। कारण गलत है क्योंकि फिसलने और अन्य सापेक्ष गति के दौरान भी घर्षण कार्य करता है।",
        "ਬਿਆਨ ਸਹੀ ਹੈ। ਕਾਰਨ ਗਲਤ ਹੈ ਕਿਉਂਕਿ ਫਿਸਲਣ ਅਤੇ ਹੋਰ ਸਬੰਧਤ ਗਤੀ ਦੌਰਾਨ ਵੀ ਘਰਸ਼ਣ ਕੰਮ ਕਰਦਾ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-014",
      "ASSERTION_TRUE_REASON_FALSE",
      "Hard",
      true,
      false,
      false,
      l(
        "A steel spoon may feel colder than a wooden spoon kept in the same room.",
        "एक ही कमरे में रखे स्टील के चम्मच को लकड़ी के चम्मच से अधिक ठंडा महसूस किया जा सकता है।",
        "ਇੱਕੋ ਕਮਰੇ ਵਿੱਚ ਰੱਖਿਆ ਸਟੀਲ ਦਾ ਚਮਚਾ ਲੱਕੜ ਦੇ ਚਮਚੇ ਨਾਲੋਂ ਵੱਧ ਠੰਢਾ ਮਹਿਸੂਸ ਹੋ ਸਕਦਾ ਹੈ।",
      ),
      l(
        "The steel spoon must always be at a lower temperature than the wooden spoon.",
        "स्टील का चम्मच हमेशा लकड़ी के चम्मच से कम तापमान पर ही होता है।",
        "ਸਟੀਲ ਦਾ ਚਮਚਾ ਹਮੇਸ਼ਾਂ ਲੱਕੜ ਦੇ ਚਮਚੇ ਨਾਲੋਂ ਘੱਟ ਤਾਪਮਾਨ 'ਤੇ ਹੀ ਹੁੰਦਾ ਹੈ।",
      ),
      l(
        "The Assertion can be true because steel transfers heat away from the hand faster. The Reason is false: objects left in the same room can be at nearly the same temperature.",
        "कथन सही हो सकता है क्योंकि स्टील हाथ से ऊष्मा तेजी से लेता है। कारण गलत है; एक ही कमरे में रखी वस्तुएँ लगभग समान तापमान पर हो सकती हैं।",
        "ਬਿਆਨ ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ ਕਿਉਂਕਿ ਸਟੀਲ ਹੱਥ ਤੋਂ ਗਰਮੀ ਤੇਜ਼ੀ ਨਾਲ ਲੈਂਦਾ ਹੈ। ਕਾਰਨ ਗਲਤ ਹੈ; ਇੱਕੋ ਕਮਰੇ ਵਿੱਚ ਪਈਆਂ ਵਸਤੂਆਂ ਲਗਭਗ ਇੱਕੋ ਤਾਪਮਾਨ 'ਤੇ ਹੋ ਸਕਦੀਆਂ ਹਨ।",
      ),
      "EVERYDAY_SCIENCE",
    ),
    s(
      "ASM-SC-015",
      "ASSERTION_FALSE_REASON_TRUE",
      "Medium",
      false,
      true,
      false,
      l(
        "Water boils at a higher temperature at high altitudes than at sea level.",
        "समुद्र तल की तुलना में ऊँचाई पर पानी अधिक तापमान पर उबलता है।",
        "ਸਮੁੰਦਰ ਤਲ ਨਾਲੋਂ ਉੱਚਾਈ 'ਤੇ ਪਾਣੀ ਵੱਧ ਤਾਪਮਾਨ 'ਤੇ ਉਬਲਦਾ ਹੈ।",
      ),
      l(
        "Atmospheric pressure decreases as altitude increases.",
        "ऊँचाई बढ़ने पर वायुमंडलीय दबाव घटता है।",
        "ਉੱਚਾਈ ਵਧਣ ਨਾਲ ਵਾਤਾਵਰਣੀ ਦਬਾਅ ਘਟਦਾ ਹੈ।",
      ),
      l(
        "The Assertion is false: water boils at a lower temperature at high altitude. The Reason is true.",
        "कथन गलत है; ऊँचाई पर पानी कम तापमान पर उबलता है। कारण सही है।",
        "ਬਿਆਨ ਗਲਤ ਹੈ; ਉੱਚਾਈ 'ਤੇ ਪਾਣੀ ਘੱਟ ਤਾਪਮਾਨ 'ਤੇ ਉਬਲਦਾ ਹੈ। ਕਾਰਨ ਸਹੀ ਹੈ।",
      ),
      "EARTH_SCIENCE",
    ),
    s(
      "ASM-SC-016",
      "ASSERTION_FALSE_REASON_TRUE",
      "Easy",
      false,
      true,
      false,
      l(
        "All metals are attracted strongly by ordinary magnets.",
        "सभी धातुएँ साधारण चुंबकों से प्रबल रूप से आकर्षित होती हैं।",
        "ਸਾਰੀਆਂ ਧਾਤਾਂ ਆਮ ਚੁੰਬਕਾਂ ਵੱਲੋਂ ਤੀਬਰ ਤੌਰ 'ਤੇ ਆਕਰਸ਼ਿਤ ਹੁੰਦੀਆਂ ਹਨ।",
      ),
      l(
        "Iron is attracted by an ordinary magnet.",
        "लोहा साधारण चुंबक से आकर्षित होता है।",
        "ਲੋਹਾ ਆਮ ਚੁੰਬਕ ਵੱਲੋਂ ਆਕਰਸ਼ਿਤ ਹੁੰਦਾ ਹੈ।",
      ),
      l(
        "The Assertion is false because many metals are not strongly attracted by ordinary magnets. The Reason about iron is true.",
        "कथन गलत है क्योंकि अनेक धातुएँ साधारण चुंबकों से प्रबल रूप से आकर्षित नहीं होतीं। लोहे के बारे में कारण सही है।",
        "ਬਿਆਨ ਗਲਤ ਹੈ ਕਿਉਂਕਿ ਕਈ ਧਾਤਾਂ ਆਮ ਚੁੰਬਕਾਂ ਵੱਲੋਂ ਤੀਬਰ ਤੌਰ 'ਤੇ ਆਕਰਸ਼ਿਤ ਨਹੀਂ ਹੁੰਦੀਆਂ। ਲੋਹੇ ਬਾਰੇ ਕਾਰਨ ਸਹੀ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-017",
      "ASSERTION_FALSE_REASON_TRUE",
      "Medium",
      false,
      true,
      false,
      l(
        "Plants release only oxygen during respiration.",
        "पौधे श्वसन के दौरान केवल ऑक्सीजन छोड़ते हैं।",
        "ਪੌਦੇ ਸਾਸ ਲੈਣ ਦੌਰਾਨ ਕੇਵਲ ਆਕਸੀਜਨ ਹੀ ਛੱਡਦੇ ਹਨ।",
      ),
      l(
        "Plants respire during both day and night.",
        "पौधे दिन और रात दोनों समय श्वसन करते हैं।",
        "ਪੌਦੇ ਦਿਨ ਅਤੇ ਰਾਤ ਦੋਵੇਂ ਸਮੇਂ ਸਾਸ ਲੈਂਦੇ ਹਨ।",
      ),
      l(
        "The Assertion is false because respiration consumes oxygen and releases carbon dioxide. The Reason is true.",
        "कथन गलत है क्योंकि श्वसन में ऑक्सीजन का उपयोग होता है और कार्बन डाइऑक्साइड निकलती है। कारण सही है।",
        "ਬਿਆਨ ਗਲਤ ਹੈ ਕਿਉਂਕਿ ਸਾਸ ਲੈਣ ਵਿੱਚ ਆਕਸੀਜਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਕਾਰਬਨ ਡਾਈਆਕਸਾਈਡ ਨਿਕਲਦੀ ਹੈ। ਕਾਰਨ ਸਹੀ ਹੈ।",
      ),
      "BIOLOGY",
    ),
    s(
      "ASM-SC-018",
      "ASSERTION_FALSE_REASON_TRUE",
      "Hard",
      false,
      true,
      false,
      l(
        "Sound generally travels fastest in gases.",
        "ध्वनि सामान्यतः गैसों में सबसे तेज चलती है।",
        "ਧੁਨੀ ਆਮ ਤੌਰ 'ਤੇ ਗੈਸਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਤੇਜ਼ ਚਲਦੀ ਹੈ।",
      ),
      l(
        "Particles are usually much more closely packed in solids than in gases.",
        "ठोस पदार्थों में कण सामान्यतः गैसों की तुलना में बहुत अधिक पास-पास होते हैं।",
        "ਠੋਸ ਪਦਾਰਥਾਂ ਵਿੱਚ ਕਣ ਆਮ ਤੌਰ 'ਤੇ ਗੈਸਾਂ ਨਾਲੋਂ ਕਾਫ਼ੀ ਨੇੜੇ-ਨੇੜੇ ਹੁੰਦੇ ਹਨ।",
      ),
      l(
        "The Assertion is false; under ordinary conditions sound is generally faster in solids than in gases. The Reason is true.",
        "कथन गलत है; सामान्य परिस्थितियों में ध्वनि गैसों की तुलना में ठोस पदार्थों में अधिक तेज चलती है। कारण सही है।",
        "ਬਿਆਨ ਗਲਤ ਹੈ; ਆਮ ਹਾਲਤਾਂ ਵਿੱਚ ਧੁਨੀ ਗੈਸਾਂ ਨਾਲੋਂ ਠੋਸ ਪਦਾਰਥਾਂ ਵਿੱਚ ਵੱਧ ਤੇਜ਼ ਚਲਦੀ ਹੈ। ਕਾਰਨ ਸਹੀ ਹੈ।",
      ),
      "PHYSICS",
    ),
    s(
      "ASM-SC-019",
      "BOTH_FALSE",
      "Easy",
      false,
      false,
      false,
      l(
        "The Sun is a planet.",
        "सूर्य एक ग्रह है।",
        "ਸੂਰਜ ਇੱਕ ਗ੍ਰਹਿ ਹੈ।",
      ),
      l(
        "Planets produce their own visible light in the same way as stars.",
        "ग्रह तारों की तरह अपना दृश्य प्रकाश स्वयं उत्पन्न करते हैं।",
        "ਗ੍ਰਹਿ ਤਾਰਿਆਂ ਵਾਂਗ ਆਪਣੀ ਦਿੱਖਣਯੋਗ ਰੌਸ਼ਨੀ ਆਪ ਪੈਦਾ ਕਰਦੇ ਹਨ।",
      ),
      l(
        "Both statements are false: the Sun is a star, and planets are ordinarily seen mainly by reflected light rather than star-like light production.",
        "दोनों कथन गलत हैं; सूर्य एक तारा है और ग्रह सामान्यतः तारों की तरह प्रकाश उत्पन्न करने के बजाय परावर्तित प्रकाश से दिखाई देते हैं।",
        "ਦੋਵੇਂ ਬਿਆਨ ਗਲਤ ਹਨ; ਸੂਰਜ ਇੱਕ ਤਾਰਾ ਹੈ ਅਤੇ ਗ੍ਰਹਿ ਆਮ ਤੌਰ 'ਤੇ ਤਾਰਿਆਂ ਵਾਂਗ ਰੌਸ਼ਨੀ ਬਣਾਉਣ ਦੀ ਬਜਾਏ ਪਰਾਵਰਤਿਤ ਰੌਸ਼ਨੀ ਨਾਲ ਦਿਸਦੇ ਹਨ।",
      ),
      "EARTH_SCIENCE",
    ),
    s(
      "ASM-SC-020",
      "BOTH_FALSE",
      "Medium",
      false,
      false,
      false,
      l(
        "Sound travels through a perfect vacuum.",
        "ध्वनि पूर्ण निर्वात में यात्रा करती है।",
        "ਧੁਨੀ ਪੂਰਨ ਖ਼ਲਾਅ ਵਿੱਚ ਯਾਤਰਾ ਕਰਦੀ ਹੈ।",
      ),
      l(
        "A perfect vacuum contains a dense material medium that carries sound.",
        "पूर्ण निर्वात में ध्वनि को ले जाने वाला घना पदार्थ माध्यम होता है।",
        "ਪੂਰਨ ਖ਼ਲਾਅ ਵਿੱਚ ਧੁਨੀ ਨੂੰ ਲਿਜਾਣ ਵਾਲਾ ਘਣਾ ਪਦਾਰਥਕ ਮਾਧਿਅਮ ਹੁੰਦਾ ਹੈ।",
      ),
      l(
        "Both statements are false. A perfect vacuum has no material medium, so ordinary mechanical sound cannot propagate through it.",
        "दोनों कथन गलत हैं। पूर्ण निर्वात में पदार्थ माध्यम नहीं होता, इसलिए सामान्य यांत्रिक ध्वनि उसमें प्रसारित नहीं हो सकती।",
        "ਦੋਵੇਂ ਬਿਆਨ ਗਲਤ ਹਨ। ਪੂਰਨ ਖ਼ਲਾਅ ਵਿੱਚ ਪਦਾਰਥਕ ਮਾਧਿਅਮ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਆਮ ਮਕੈਨਿਕਲ ਧੁਨੀ ਉਸ ਵਿੱਚ ਨਹੀਂ ਫੈਲ ਸਕਦੀ।",
      ),
      "PHYSICS",
    ),
  ]);

export const ASM_001_ANSWER_CLASS_COUNTS = Object.freeze(
  ASM_001_SCENARIO_AUTHORITIES.reduce<Record<AsmAnswerClass, number>>(
    (acc, scenario) => {
      acc[scenario.answerClass] += 1;
      return acc;
    },
    {
      BOTH_TRUE_REASON_EXPLAINS: 0,
      BOTH_TRUE_REASON_NOT_EXPLAINS: 0,
      ASSERTION_TRUE_REASON_FALSE: 0,
      ASSERTION_FALSE_REASON_TRUE: 0,
      BOTH_FALSE: 0,
    },
  ),
);

export function asmLocalized(
  value: AsmLocalizedText,
  language: AsmLanguage,
): string {
  return value[language];
}
