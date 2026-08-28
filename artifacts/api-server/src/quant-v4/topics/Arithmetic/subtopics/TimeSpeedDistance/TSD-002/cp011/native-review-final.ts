import { add, divide, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp011ExecutableInput, TsdCp011ExecutableSolution, TsdCp011MeasureUnit } from "./executable-types";
import { TSD_CP011_ENGLISH_REVIEW, type TsdCp011EnglishReviewQuestion } from "./english-review-final";

export type TsdCp011NativeLanguage = "hi" | "pa";
function v(r: Rational) { return toMixedString(r); }
function idx(familyId: string) { return familyId.charCodeAt(familyId.length - 1) - 65; }

function hiMeasure(r: Rational, unit: TsdCp011MeasureUnit) { return `${v(r)} ${unit === "METRE" ? "मीटर" : "सीढ़ियाँ"}`; }
function paMeasure(r: Rational, unit: TsdCp011MeasureUnit) { return `${v(r)} ${unit === "METRE" ? "ਮੀਟਰ" : "ਪੌੜੀਆਂ"}`; }
function hiRate(r: Rational, unit: TsdCp011MeasureUnit) { return `${v(r)} ${unit === "METRE" ? "मीटर/सेकंड" : "सीढ़ियाँ/सेकंड"}`; }
function paRate(r: Rational, unit: TsdCp011MeasureUnit) { return `${v(r)} ${unit === "METRE" ? "ਮੀਟਰ/ਸਕਿੰਟ" : "ਪੌੜੀਆਂ/ਸਕਿੰਟ"}`; }
function hiSeconds(r: Rational) { return `${v(r)} सेकंड`; }
function paSeconds(r: Rational) { return `${v(r)} ਸਕਿੰਟ`; }
function hiMinutes(r: Rational) { return `${v(r)} मिनट`; }
function paMinutes(r: Rational) { return `${v(r)} ਮਿੰਟ`; }
function hiMetres(r: Rational) { return `${v(r)} मीटर`; }
function paMetres(r: Rational) { return `${v(r)} ਮੀਟਰ`; }
function hiRevs(r: Rational) { return `${v(r)} चक्कर`; }
function paRevs(r: Rational) { return `${v(r)} ਚੱਕਰ`; }

function hiAnswer(solution: TsdCp011ExecutableSolution) {
  switch (solution.unit) {
    case "SECOND": return hiSeconds(solution.answer);
    case "MINUTE": return hiMinutes(solution.answer);
    case "METRE": return hiMetres(solution.answer);
    case "STEP": return `${v(solution.answer)} सीढ़ियाँ`;
    case "METRE_PER_SECOND": return `${v(solution.answer)} मीटर/सेकंड`;
    case "STEP_PER_SECOND": return `${v(solution.answer)} सीढ़ियाँ/सेकंड`;
    case "REVOLUTION": return hiRevs(solution.answer);
    case "METRE_PER_MINUTE": return `${v(solution.answer)} मीटर/मिनट`;
    case "REVOLUTION_PER_MINUTE": return `${v(solution.answer)} चक्कर प्रति मिनट`;
    case "RATIO": return v(solution.answer);
  }
}
function paAnswer(solution: TsdCp011ExecutableSolution) {
  switch (solution.unit) {
    case "SECOND": return paSeconds(solution.answer);
    case "MINUTE": return paMinutes(solution.answer);
    case "METRE": return paMetres(solution.answer);
    case "STEP": return `${v(solution.answer)} ਪੌੜੀਆਂ`;
    case "METRE_PER_SECOND": return `${v(solution.answer)} ਮੀਟਰ/ਸਕਿੰਟ`;
    case "STEP_PER_SECOND": return `${v(solution.answer)} ਪੌੜੀਆਂ/ਸਕਿੰਟ`;
    case "REVOLUTION": return paRevs(solution.answer);
    case "METRE_PER_MINUTE": return `${v(solution.answer)} ਮੀਟਰ/ਮਿੰਟ`;
    case "REVOLUTION_PER_MINUTE": return `${v(solution.answer)} ਚੱਕਰ ਪ੍ਰਤੀ ਮਿੰਟ`;
    case "RATIO": return v(solution.answer);
  }
}

function hiStem(input: TsdCp011ExecutableInput, i: number): string {
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      const dir = input.direction === "SAME" ? "चलती सतह की दिशा में" : "चलती सतह की दिशा के विपरीत";
      if (input.target === "TIME") return i % 2 === 0
        ? `एक ${input.measureUnit === "METRE" ? "चलती पट्टी" : "चलती सीढ़ी"} की लंबाई ${hiMeasure(input.length, input.measureUnit)} है। एक व्यक्ति उस पर अपनी चाल ${hiRate(input.personRate, input.measureUnit)} से चलता है और सतह की चाल ${hiRate(input.surfaceRate, input.measureUnit)} है। व्यक्ति ${dir} चलता है। पूरा रास्ता तय करने में कितना समय लगेगा?`
        : `किसी चलती सतह पर ${hiMeasure(input.length, input.measureUnit)} की दूरी तय करनी है। व्यक्ति की अपनी चाल ${hiRate(input.personRate, input.measureUnit)} और सतह की चाल ${hiRate(input.surfaceRate, input.measureUnit)} है। व्यक्ति ${dir} चलता है। समय ज्ञात कीजिए।`;
      if (input.target === "LENGTH") return `एक व्यक्ति ${dir} अपनी चाल ${hiRate(input.personRate, input.measureUnit)} से चलता है। चलती सतह की चाल ${hiRate(input.surfaceRate, input.measureUnit)} है और पूरा रास्ता ${hiSeconds(input.time)} में तय होता है। सतह की लंबाई ज्ञात कीजिए।`;
      if (input.target === "PERSON_RATE") return `${hiMeasure(input.length, input.measureUnit)} लंबी चलती सतह ${hiSeconds(input.time)} में पार की जाती है। सतह की चाल ${hiRate(input.surfaceRate, input.measureUnit)} है और व्यक्ति ${dir} चलता है। व्यक्ति की अपनी चाल ज्ञात कीजिए।`;
      return `एक व्यक्ति ${hiMeasure(input.length, input.measureUnit)} लंबी चलती सतह को ${hiSeconds(input.time)} में पार करता है। उसकी अपनी चाल ${hiRate(input.personRate, input.measureUnit)} है और वह सतह ${input.direction === "SAME" ? "की दिशा में" : "के विपरीत"} चलता है। चलती सतह की चाल ज्ञात कीजिए।`;
    }
    case "stationaryStepCountState": {
      const dir = input.direction === "SAME" ? "व्यक्ति की दिशा में" : "व्यक्ति की दिशा के विपरीत";
      if (input.target === "TOTAL_STEPS") return i % 2 === 0
        ? `चलती सीढ़ी पर एक व्यक्ति वास्तव में ${v(input.walkedSteps)} सीढ़ियाँ चढ़ता है। उसकी चाल ${v(input.personStepRate)} सीढ़ियाँ/सेकंड और सीढ़ी की चाल ${v(input.escalatorStepRate)} सीढ़ियाँ/सेकंड है, जो ${dir} चल रही है। यदि सीढ़ी रोक दी जाए तो कुल कितनी सीढ़ियाँ दिखाई देंगी?`
        : `एक व्यक्ति चलती सीढ़ी पर ${v(input.walkedSteps)} सीढ़ियाँ चलता है। व्यक्ति की चाल ${v(input.personStepRate)} सीढ़ियाँ/सेकंड और चलती सीढ़ी की चाल ${v(input.escalatorStepRate)} सीढ़ियाँ/सेकंड है। सीढ़ी ${dir} चलती है। स्थिर अवस्था में कुल सीढ़ियों की संख्या ज्ञात कीजिए।`;
      if (input.target === "WALKED_STEPS") return `रुकी हुई अवस्था में एक चलती सीढ़ी में ${v(input.totalSteps)} सीढ़ियाँ हैं। व्यक्ति ${v(input.personStepRate)} सीढ़ियाँ/सेकंड से चलता है और सीढ़ी ${v(input.escalatorStepRate)} सीढ़ियाँ/सेकंड की चाल से ${dir} चलती है। अंत तक पहुँचने में व्यक्ति वास्तव में कितनी सीढ़ियाँ चलेगा?`;
      if (input.target === "PERSON_RATE") return `रुकी हुई अवस्था में चलती सीढ़ी में ${v(input.totalSteps)} सीढ़ियाँ हैं। चलते समय व्यक्ति ${v(input.walkedSteps)} सीढ़ियाँ चलता है और सीढ़ी की चाल ${v(input.escalatorStepRate)} सीढ़ियाँ/सेकंड है। सीढ़ी ${dir} चलती है। व्यक्ति की चाल ज्ञात कीजिए।`;
      return `एक चलती सीढ़ी में स्थिर अवस्था में ${v(input.totalSteps)} सीढ़ियाँ हैं। व्यक्ति ${v(input.personStepRate)} सीढ़ियाँ/सेकंड से चलते हुए वास्तव में ${v(input.walkedSteps)} सीढ़ियाँ चलता है और वह सीढ़ी ${input.direction === "SAME" ? "की दिशा में" : "के विपरीत"} बढ़ता है। चलती सीढ़ी की चाल ज्ञात कीजिए।`;
    }
    case "dualEscalatorObservationState": {
      if (input.target === "STOPPED_TIME") return i % 2 === 0
        ? `एक व्यक्ति ऊपर की ओर चलती सीढ़ी पर ऊपर जाते समय ${hiSeconds(input.upTime)} और उसी सीढ़ी पर नीचे, उसकी चाल के विपरीत जाते समय ${hiSeconds(input.downTime)} लेता है। व्यक्ति की चलने की चाल समान रहती है। यदि सीढ़ी रोक दी जाए तो उसे पूरा रास्ता तय करने में कितना समय लगेगा?`
        : `उसी चलती सीढ़ी पर एक व्यक्ति ऊपर जाते समय ${hiSeconds(input.upTime)} और नीचे जाते समय ${hiSeconds(input.downTime)} लेता है। उसकी अपनी चाल नहीं बदलती। रुकी हुई सीढ़ी पर लगने वाला समय ज्ञात कीजिए।`;
      return i % 2 === 0
        ? `एक ही लंबाई की चलती सीढ़ी पर व्यक्ति को सीढ़ी की दिशा में जाने में ${hiSeconds(input.upTime)} और विपरीत दिशा में जाने में ${hiSeconds(input.downTime)} लगते हैं। व्यक्ति की अपनी चाल और चलती सीढ़ी की चाल का अनुपात ज्ञात कीजिए।`
        : `चलती सीढ़ी की दिशा में और उसके विपरीत समान दूरी तय करने के समय क्रमशः ${hiSeconds(input.upTime)} और ${hiSeconds(input.downTime)} हैं। व्यक्ति की चाल स्थिर है। व्यक्ति की चाल : सीढ़ी की चाल ज्ञात कीजिए।`;
    }
    case "movingSurfaceStateComparison": {
      if (input.target === "COMBINED_TIME") return i % 2 === 0
        ? `रुकी हुई चलती सीढ़ी पर पैदल चढ़ने में एक व्यक्ति को ${hiSeconds(input.stoppedWalkingTime)} लगते हैं। उसी सीढ़ी पर बिना चले खड़े रहने पर चलती सीढ़ी उसे ${hiSeconds(input.carriedStandingTime)} में ऊपर पहुँचा देती है। यदि व्यक्ति चलती सीढ़ी पर चलते हुए ऊपर जाए तो कितना समय लगेगा?`
        : `एक चलती पट्टी किसी खड़े व्यक्ति को एक छोर से दूसरे छोर तक ${hiSeconds(input.carriedStandingTime)} में ले जाती है। वही व्यक्ति रुकी हुई पट्टी को पैदल ${hiSeconds(input.stoppedWalkingTime)} में पार करता है। पट्टी की दिशा में चलते हुए उसे कितना समय लगेगा?`;
      if (input.target === "STOPPED_WALKING_TIME") return `चलती सीढ़ी पर चलते हुए एक व्यक्ति को ${hiSeconds(input.combinedTime)} लगते हैं। यदि केवल खड़े रहने पर वही सीढ़ी उसे ${hiSeconds(input.carriedStandingTime)} में ऊपर पहुँचाती है, तो रुकी हुई सीढ़ी पर पैदल चढ़ने का समय ज्ञात कीजिए।`;
      if (input.target === "CARRIED_STANDING_TIME") return `एक व्यक्ति रुकी हुई चलती पट्टी को ${hiSeconds(input.stoppedWalkingTime)} में पैदल पार करता है और उसी दिशा में चलती पट्टी पर चलते हुए ${hiSeconds(input.combinedTime)} लेता है। केवल खड़े रहने पर पट्टी उसे कितने समय में पार कराएगी?`;
      return `एक व्यक्ति रुकी हुई पट्टी को ${hiSeconds(input.stoppedWalkingTime)} में पैदल पार करता है। पट्टी अकेले किसी खड़े व्यक्ति को ${hiSeconds(input.carriedStandingTime)} में पार कराती है। पट्टी की दिशा में चलते हुए व्यक्ति का कितना समय बचता है?`;
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") return `एक पहिए की परिधि ${hiMetres(input.circumference)} है। बिना फिसले ${hiRevs(input.revolutions)} चक्कर लगाने पर वह कितनी दूरी तय करेगा?`;
      if (input.target === "REVOLUTIONS") return `${hiMetres(input.circumference)} परिधि वाला पहिया बिना फिसले ${hiMetres(input.distance)} दूरी तय करता है। वह कितने चक्कर लगाएगा?`;
      if (input.target === "CIRCUMFERENCE") return `एक पहिया बिना फिसले ${hiRevs(input.revolutions)} चक्कर में ${hiMetres(input.distance)} दूरी तय करता है। उसकी परिधि ज्ञात कीजिए।`;
      if (input.target === "DIAMETER") return `एक पहिया बिना फिसले ${hiRevs(input.revolutions)} चक्कर में ${hiMetres(input.distance)} चलता है। π = ${v(input.pi)} लेते हुए पहिए का व्यास ज्ञात कीजिए।`;
      return `एक पहिया ${hiMetres(input.distance)} दूरी तय करते समय बिना फिसले ${hiRevs(input.revolutions)} चक्कर लगाता है। π = ${v(input.pi)} लेते हुए उसकी त्रिज्या ज्ञात कीजिए।`;
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") return `${hiMetres(input.circumference)} परिधि वाला पहिया बिना फिसले ${v(input.rpm)} चक्कर प्रति मिनट की दर से घूमता है। उसकी रैखिक चाल मीटर प्रति मिनट में ज्ञात कीजिए।`;
      if (input.target === "RPM") return `एक पहिए की परिधि ${hiMetres(input.circumference)} है और वह बिना फिसले ${v(input.linearSpeedPerMinute)} मीटर/मिनट की रैखिक चाल से चलता है। वह प्रति मिनट कितने चक्कर लगाता है?`;
      if (input.target === "DISTANCE") return `${hiMetres(input.circumference)} परिधि वाला पहिया ${v(input.rpm)} चक्कर प्रति मिनट की दर से ${hiMinutes(input.timeMinutes)} तक बिना फिसले घूमता है। तय दूरी ज्ञात कीजिए।`;
      return `${hiMetres(input.circumference)} परिधि वाला पहिया ${v(input.rpm)} चक्कर प्रति मिनट की दर से घूमते हुए ${hiMetres(input.distance)} दूरी तय करता है। लगा समय मिनट में ज्ञात कीजिए।`;
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") return i % 2 === 0
        ? `दो पहियों की परिधियाँ क्रमशः ${hiMetres(input.circumferenceA)} और ${hiMetres(input.circumferenceB)} हैं। दोनों बिना फिसले समान दूरी तय करते हैं। पहले पहिए के चक्करों और दूसरे पहिए के चक्करों का अनुपात ज्ञात कीजिए।`
        : `पहिया क और पहिया ख की परिधियाँ ${hiMetres(input.circumferenceA)} और ${hiMetres(input.circumferenceB)} हैं। समान दूरी तय करने पर क के चक्करों : ख के चक्करों का अनुपात क्या होगा?`;
      return `दो पहियों की परिधियाँ ${hiMetres(input.circumferenceA)} और ${hiMetres(input.circumferenceB)} हैं। दोनों बिना फिसले ${hiMetres(input.distance)} दूरी तय करते हैं। उनके चक्करों की संख्या में कितना अंतर होगा?`;
    }
  }
}

function paStem(input: TsdCp011ExecutableInput, i: number): string {
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      const dir = input.direction === "SAME" ? "ਚੱਲਦੀ ਸਤਹ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਚੱਲਦੀ ਸਤਹ ਦੀ ਦਿਸ਼ਾ ਦੇ ਉਲਟ";
      if (input.target === "TIME") return i % 2 === 0
        ? `ਇੱਕ ${input.measureUnit === "METRE" ? "ਚੱਲਦੀ ਪੱਟੀ" : "ਚੱਲਦੀ ਸੀੜ੍ਹੀ"} ਦੀ ਲੰਬਾਈ ${paMeasure(input.length, input.measureUnit)} ਹੈ। ਇੱਕ ਵਿਅਕਤੀ ਉਸ ਉੱਤੇ ਆਪਣੀ ਰਫ਼ਤਾਰ ${paRate(input.personRate, input.measureUnit)} ਨਾਲ ਤੁਰਦਾ ਹੈ ਅਤੇ ਸਤਹ ਦੀ ਰਫ਼ਤਾਰ ${paRate(input.surfaceRate, input.measureUnit)} ਹੈ। ਵਿਅਕਤੀ ${dir} ਤੁਰਦਾ ਹੈ। ਪੂਰਾ ਰਸਤਾ ਤੈਅ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`
        : `ਚੱਲਦੀ ਸਤਹ ਉੱਤੇ ${paMeasure(input.length, input.measureUnit)} ਦੂਰੀ ਤੈਅ ਕਰਨੀ ਹੈ। ਵਿਅਕਤੀ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ${paRate(input.personRate, input.measureUnit)} ਅਤੇ ਸਤਹ ਦੀ ਰਫ਼ਤਾਰ ${paRate(input.surfaceRate, input.measureUnit)} ਹੈ। ਵਿਅਕਤੀ ${dir} ਤੁਰਦਾ ਹੈ। ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "LENGTH") return `ਇੱਕ ਵਿਅਕਤੀ ${dir} ਆਪਣੀ ਰਫ਼ਤਾਰ ${paRate(input.personRate, input.measureUnit)} ਨਾਲ ਤੁਰਦਾ ਹੈ। ਚੱਲਦੀ ਸਤਹ ਦੀ ਰਫ਼ਤਾਰ ${paRate(input.surfaceRate, input.measureUnit)} ਹੈ ਅਤੇ ਪੂਰਾ ਰਸਤਾ ${paSeconds(input.time)} ਵਿੱਚ ਤੈਅ ਹੁੰਦਾ ਹੈ। ਸਤਹ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`;
      if (input.target === "PERSON_RATE") return `${paMeasure(input.length, input.measureUnit)} ਲੰਬੀ ਚੱਲਦੀ ਸਤਹ ${paSeconds(input.time)} ਵਿੱਚ ਪਾਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਸਤਹ ਦੀ ਰਫ਼ਤਾਰ ${paRate(input.surfaceRate, input.measureUnit)} ਹੈ ਅਤੇ ਵਿਅਕਤੀ ${dir} ਤੁਰਦਾ ਹੈ। ਵਿਅਕਤੀ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
      return `ਇੱਕ ਵਿਅਕਤੀ ${paMeasure(input.length, input.measureUnit)} ਲੰਬੀ ਚੱਲਦੀ ਸਤਹ ਨੂੰ ${paSeconds(input.time)} ਵਿੱਚ ਪਾਰ ਕਰਦਾ ਹੈ। ਉਸ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ${paRate(input.personRate, input.measureUnit)} ਹੈ ਅਤੇ ਉਹ ਸਤਹ ${input.direction === "SAME" ? "ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਦੇ ਉਲਟ"} ਤੁਰਦਾ ਹੈ। ਚੱਲਦੀ ਸਤਹ ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }
    case "stationaryStepCountState": {
      const dir = input.direction === "SAME" ? "ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਦੇ ਉਲਟ";
      if (input.target === "TOTAL_STEPS") return i % 2 === 0
        ? `ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਇੱਕ ਵਿਅਕਤੀ ਅਸਲ ਵਿੱਚ ${v(input.walkedSteps)} ਪੌੜੀਆਂ ਤੁਰਦਾ ਹੈ। ਉਸ ਦੀ ਰਫ਼ਤਾਰ ${v(input.personStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਅਤੇ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ${v(input.escalatorStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਹੈ, ਜੋ ${dir} ਚੱਲਦੀ ਹੈ। ਜੇ ਸੀੜ੍ਹੀ ਰੋਕ ਦਿੱਤੀ ਜਾਵੇ ਤਾਂ ਕੁੱਲ ਕਿੰਨੀਆਂ ਪੌੜੀਆਂ ਹੋਣਗੀਆਂ?`
        : `ਇੱਕ ਵਿਅਕਤੀ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ${v(input.walkedSteps)} ਪੌੜੀਆਂ ਤੁਰਦਾ ਹੈ। ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ${v(input.personStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਅਤੇ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ${v(input.escalatorStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਹੈ। ਸੀੜ੍ਹੀ ${dir} ਚੱਲਦੀ ਹੈ। ਰੁਕੀ ਹਾਲਤ ਵਿੱਚ ਕੁੱਲ ਪੌੜੀਆਂ ਕੱਢੋ।`;
      if (input.target === "WALKED_STEPS") return `ਰੁਕੀ ਹਾਲਤ ਵਿੱਚ ਇੱਕ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਵਿੱਚ ${v(input.totalSteps)} ਪੌੜੀਆਂ ਹਨ। ਵਿਅਕਤੀ ${v(input.personStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਨਾਲ ਤੁਰਦਾ ਹੈ ਅਤੇ ਸੀੜ੍ਹੀ ${v(input.escalatorStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਨਾਲ ${dir} ਚੱਲਦੀ ਹੈ। ਅੰਤ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਵਿਅਕਤੀ ਅਸਲ ਵਿੱਚ ਕਿੰਨੀਆਂ ਪੌੜੀਆਂ ਤੁਰੇਗਾ?`;
      if (input.target === "PERSON_RATE") return `ਰੁਕੀ ਹਾਲਤ ਵਿੱਚ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਵਿੱਚ ${v(input.totalSteps)} ਪੌੜੀਆਂ ਹਨ। ਚੱਲਣ ਵੇਲੇ ਵਿਅਕਤੀ ${v(input.walkedSteps)} ਪੌੜੀਆਂ ਤੁਰਦਾ ਹੈ ਅਤੇ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ${v(input.escalatorStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਹੈ। ਸੀੜ੍ਹੀ ${dir} ਚੱਲਦੀ ਹੈ। ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
      return `ਇੱਕ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਵਿੱਚ ਰੁਕੀ ਹਾਲਤ ਵਿੱਚ ${v(input.totalSteps)} ਪੌੜੀਆਂ ਹਨ। ਵਿਅਕਤੀ ${v(input.personStepRate)} ਪੌੜੀਆਂ/ਸਕਿੰਟ ਨਾਲ ਤੁਰਦਿਆਂ ਅਸਲ ਵਿੱਚ ${v(input.walkedSteps)} ਪੌੜੀਆਂ ਤੁਰਦਾ ਹੈ ਅਤੇ ਉਹ ਸੀੜ੍ਹੀ ${input.direction === "SAME" ? "ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਦੇ ਉਲਟ"} ਵਧਦਾ ਹੈ। ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }
    case "dualEscalatorObservationState": {
      if (input.target === "STOPPED_TIME") return i % 2 === 0
        ? `ਇੱਕ ਵਿਅਕਤੀ ਉੱਪਰ ਵੱਲ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਉੱਪਰ ਜਾਂਦਿਆਂ ${paSeconds(input.upTime)} ਅਤੇ ਉਸੇ ਸੀੜ੍ਹੀ ਉੱਤੇ ਹੇਠਾਂ, ਉਸ ਦੀ ਚਾਲ ਦੇ ਉਲਟ ਜਾਂਦਿਆਂ ${paSeconds(input.downTime)} ਲੈਂਦਾ ਹੈ। ਵਿਅਕਤੀ ਦੀ ਤੁਰਨ ਦੀ ਰਫ਼ਤਾਰ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ। ਜੇ ਸੀੜ੍ਹੀ ਰੋਕ ਦਿੱਤੀ ਜਾਵੇ ਤਾਂ ਪੂਰਾ ਰਸਤਾ ਤੈਅ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`
        : `ਉਸੇ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਇੱਕ ਵਿਅਕਤੀ ਉੱਪਰ ਜਾਂਦਿਆਂ ${paSeconds(input.upTime)} ਅਤੇ ਹੇਠਾਂ ਜਾਂਦਿਆਂ ${paSeconds(input.downTime)} ਲੈਂਦਾ ਹੈ। ਉਸ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ। ਰੁਕੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ਕੱਢੋ।`;
      return i % 2 === 0
        ? `ਇੱਕੋ ਲੰਬਾਈ ਦੀ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਵਿਅਕਤੀ ਨੂੰ ਸੀੜ੍ਹੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਜਾਣ ਲਈ ${paSeconds(input.upTime)} ਅਤੇ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ ਜਾਣ ਲਈ ${paSeconds(input.downTime)} ਲੱਗਦੇ ਹਨ। ਵਿਅਕਤੀ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਅਤੇ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`
        : `ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਤੇ ਉਸ ਦੇ ਉਲਟ ਇੱਕੋ ਦੂਰੀ ਤੈਅ ਕਰਨ ਦੇ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${paSeconds(input.upTime)} ਅਤੇ ${paSeconds(input.downTime)} ਹਨ। ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ਸਥਿਰ ਹੈ। ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ : ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }
    case "movingSurfaceStateComparison": {
      if (input.target === "COMBINED_TIME") return i % 2 === 0
        ? `ਰੁਕੀ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਪੈਦਲ ਚੜ੍ਹਨ ਵਿੱਚ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ${paSeconds(input.stoppedWalkingTime)} ਲੱਗਦੇ ਹਨ। ਉਸੇ ਸੀੜ੍ਹੀ ਉੱਤੇ ਬਿਨਾਂ ਤੁਰੇ ਖੜ੍ਹੇ ਰਹਿਣ ਨਾਲ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉਸ ਨੂੰ ${paSeconds(input.carriedStandingTime)} ਵਿੱਚ ਉੱਪਰ ਪਹੁੰਚਾ ਦਿੰਦੀ ਹੈ। ਜੇ ਵਿਅਕਤੀ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਤੁਰਦਾ ਵੀ ਰਹੇ ਤਾਂ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`
        : `ਇੱਕ ਚੱਲਦੀ ਪੱਟੀ ਖੜ੍ਹੇ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਸਿਰੇ ਤੋਂ ਦੂਜੇ ਤੱਕ ${paSeconds(input.carriedStandingTime)} ਵਿੱਚ ਲੈ ਜਾਂਦੀ ਹੈ। ਉਹੀ ਵਿਅਕਤੀ ਰੁਕੀ ਪੱਟੀ ਨੂੰ ਪੈਦਲ ${paSeconds(input.stoppedWalkingTime)} ਵਿੱਚ ਪਾਰ ਕਰਦਾ ਹੈ। ਪੱਟੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਤੁਰਦਿਆਂ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
      if (input.target === "STOPPED_WALKING_TIME") return `ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਤੁਰਦਿਆਂ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ${paSeconds(input.combinedTime)} ਲੱਗਦੇ ਹਨ। ਜੇ ਸਿਰਫ਼ ਖੜ੍ਹੇ ਰਹਿਣ ਨਾਲ ਉਹੀ ਸੀੜ੍ਹੀ ਉਸ ਨੂੰ ${paSeconds(input.carriedStandingTime)} ਵਿੱਚ ਉੱਪਰ ਪਹੁੰਚਾਉਂਦੀ ਹੈ, ਤਾਂ ਰੁਕੀ ਸੀੜ੍ਹੀ ਉੱਤੇ ਪੈਦਲ ਚੜ੍ਹਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "CARRIED_STANDING_TIME") return `ਇੱਕ ਵਿਅਕਤੀ ਰੁਕੀ ਚੱਲਦੀ ਪੱਟੀ ਨੂੰ ${paSeconds(input.stoppedWalkingTime)} ਵਿੱਚ ਪੈਦਲ ਪਾਰ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦੀ ਪੱਟੀ ਉੱਤੇ ਤੁਰਦਿਆਂ ${paSeconds(input.combinedTime)} ਲੈਂਦਾ ਹੈ। ਸਿਰਫ਼ ਖੜ੍ਹੇ ਰਹਿਣ ਨਾਲ ਪੱਟੀ ਉਸ ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪਾਰ ਕਰਾਏਗੀ?`;
      return `ਇੱਕ ਵਿਅਕਤੀ ਰੁਕੀ ਪੱਟੀ ਨੂੰ ${paSeconds(input.stoppedWalkingTime)} ਵਿੱਚ ਪੈਦਲ ਪਾਰ ਕਰਦਾ ਹੈ। ਪੱਟੀ ਇਕੱਲੀ ਖੜ੍ਹੇ ਵਿਅਕਤੀ ਨੂੰ ${paSeconds(input.carriedStandingTime)} ਵਿੱਚ ਪਾਰ ਕਰਾਉਂਦੀ ਹੈ। ਪੱਟੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਤੁਰਦਿਆਂ ਵਿਅਕਤੀ ਦਾ ਕਿੰਨਾ ਸਮਾਂ ਬਚਦਾ ਹੈ?`;
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") return `ਇੱਕ ਪਹੀਏ ਦਾ ਘੇਰਾ ${paMetres(input.circumference)} ਹੈ। ਬਿਨਾਂ ਫਿਸਲੇ ${paRevs(input.revolutions)} ਚੱਕਰ ਲਗਾਉਣ ਉੱਤੇ ਉਹ ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰੇਗਾ?`;
      if (input.target === "REVOLUTIONS") return `${paMetres(input.circumference)} ਘੇਰੇ ਵਾਲਾ ਪਹੀਆ ਬਿਨਾਂ ਫਿਸਲੇ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਉਹ ਕਿੰਨੇ ਚੱਕਰ ਲਗਾਏਗਾ?`;
      if (input.target === "CIRCUMFERENCE") return `ਇੱਕ ਪਹੀਆ ਬਿਨਾਂ ਫਿਸਲੇ ${paRevs(input.revolutions)} ਚੱਕਰਾਂ ਵਿੱਚ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਉਸ ਦਾ ਘੇਰਾ ਕੱਢੋ।`;
      if (input.target === "DIAMETER") return `ਇੱਕ ਪਹੀਆ ਬਿਨਾਂ ਫਿਸਲੇ ${paRevs(input.revolutions)} ਚੱਕਰਾਂ ਵਿੱਚ ${paMetres(input.distance)} ਤੈਅ ਕਰਦਾ ਹੈ। π = ${v(input.pi)} ਲੈ ਕੇ ਪਹੀਏ ਦਾ ਵਿਆਸ ਕੱਢੋ।`;
      return `ਇੱਕ ਪਹੀਆ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਦਿਆਂ ਬਿਨਾਂ ਫਿਸਲੇ ${paRevs(input.revolutions)} ਚੱਕਰ ਲਗਾਉਂਦਾ ਹੈ। π = ${v(input.pi)} ਲੈ ਕੇ ਉਸ ਦਾ ਅਰਧ-ਵਿਆਸ ਕੱਢੋ।`;
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") return `${paMetres(input.circumference)} ਘੇਰੇ ਵਾਲਾ ਪਹੀਆ ਬਿਨਾਂ ਫਿਸਲੇ ${v(input.rpm)} ਚੱਕਰ ਪ੍ਰਤੀ ਮਿੰਟ ਦੀ ਦਰ ਨਾਲ ਘੁੰਮਦਾ ਹੈ। ਉਸ ਦੀ ਰੇਖੀ ਰਫ਼ਤਾਰ ਮੀਟਰ ਪ੍ਰਤੀ ਮਿੰਟ ਵਿੱਚ ਕੱਢੋ।`;
      if (input.target === "RPM") return `ਇੱਕ ਪਹੀਏ ਦਾ ਘੇਰਾ ${paMetres(input.circumference)} ਹੈ ਅਤੇ ਉਹ ਬਿਨਾਂ ਫਿਸਲੇ ${v(input.linearSpeedPerMinute)} ਮੀਟਰ/ਮਿੰਟ ਦੀ ਰੇਖੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ਉਹ ਪ੍ਰਤੀ ਮਿੰਟ ਕਿੰਨੇ ਚੱਕਰ ਲਗਾਉਂਦਾ ਹੈ?`;
      if (input.target === "DISTANCE") return `${paMetres(input.circumference)} ਘੇਰੇ ਵਾਲਾ ਪਹੀਆ ${v(input.rpm)} ਚੱਕਰ ਪ੍ਰਤੀ ਮਿੰਟ ਦੀ ਦਰ ਨਾਲ ${paMinutes(input.timeMinutes)} ਤੱਕ ਬਿਨਾਂ ਫਿਸਲੇ ਘੁੰਮਦਾ ਹੈ। ਤੈਅ ਦੂਰੀ ਕੱਢੋ।`;
      return `${paMetres(input.circumference)} ਘੇਰੇ ਵਾਲਾ ਪਹੀਆ ${v(input.rpm)} ਚੱਕਰ ਪ੍ਰਤੀ ਮਿੰਟ ਦੀ ਦਰ ਨਾਲ ਘੁੰਮਦਿਆਂ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਲੱਗਿਆ ਸਮਾਂ ਮਿੰਟਾਂ ਵਿੱਚ ਕੱਢੋ।`;
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") return i % 2 === 0
        ? `ਦੋ ਪਹੀਆਂ ਦੇ ਘੇਰੇ ਕ੍ਰਮਵਾਰ ${paMetres(input.circumferenceA)} ਅਤੇ ${paMetres(input.circumferenceB)} ਹਨ। ਦੋਵੇਂ ਬਿਨਾਂ ਫਿਸਲੇ ਇੱਕੋ ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਨ। ਪਹਿਲੇ ਪਹੀਏ ਦੇ ਚੱਕਰਾਂ ਅਤੇ ਦੂਜੇ ਪਹੀਏ ਦੇ ਚੱਕਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`
        : `ਪਹੀਆ ਕ ਅਤੇ ਪਹੀਆ ਖ ਦੇ ਘੇਰੇ ${paMetres(input.circumferenceA)} ਅਤੇ ${paMetres(input.circumferenceB)} ਹਨ। ਇੱਕੋ ਦੂਰੀ ਤੈਅ ਕਰਨ ਉੱਤੇ ਕ ਦੇ ਚੱਕਰਾਂ : ਖ ਦੇ ਚੱਕਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?`;
      return `ਦੋ ਪਹੀਆਂ ਦੇ ਘੇਰੇ ${paMetres(input.circumferenceA)} ਅਤੇ ${paMetres(input.circumferenceB)} ਹਨ। ਦੋਵੇਂ ਬਿਨਾਂ ਫਿਸਲੇ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?`;
    }
  }
}

function hiExplanation(input: TsdCp011ExecutableInput, solution: TsdCp011ExecutableSolution): readonly string[] {
  const answer = hiAnswer(solution);
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": return Object.freeze([`सतह और व्यक्ति की चाल एक ही दिशा में हों तो जोड़ते हैं और विपरीत दिशा में हों तो घटाते हैं। इससे वास्तविक चाल मिलती है।`, `दूरी = चाल × समय के संबंध को दिए मानों पर लगाने से मांगा गया मान ${answer} मिलता है।`]);
    case "stationaryStepCountState": return Object.freeze([`व्यक्ति ने जितनी सीढ़ियाँ चलीं, उससे उसकी चाल के आधार पर यात्रा का समय निकलता है। इसी समय में चलती सीढ़ी भी अपना हिस्सा जोड़ती या घटाती है।`, `स्थिर सीढ़ियों, व्यक्ति की चाल और चलती सीढ़ी की चाल के इसी साझा समय संबंध से उत्तर ${answer} है।`]);
    case "dualEscalatorObservationState": return input.target === "STOPPED_TIME"
      ? Object.freeze([`ऊपर जाते समय व्यक्ति और सीढ़ी की चालें जुड़ती हैं, जबकि नीचे जाते समय वही चालें घटती हैं। दोनों यात्राओं की लंबाई समान है।`, `दोनों समीकरणों से सीढ़ी की चाल हटाने पर रुकी हुई सीढ़ी का समय ${answer} मिलता है।`])
      : Object.freeze([`समान दूरी के लिए दिशा के साथ और विपरीत समय क्रमशः व्यक्ति की चाल में सीढ़ी की चाल जोड़ने और घटाने से बनते हैं।`, `इन दोनों समयों से व्यक्ति की चाल और सीढ़ी की चाल का अनुपात ${answer}:1 मिलता है।`]);
    case "movingSurfaceStateComparison": return Object.freeze([`एक ही लंबाई के लिए रुकी सतह पर व्यक्ति की चाल और केवल चलती सतह की चाल को अलग-अलग समयों से लिखा जाता है। साथ चलने पर दोनों चालें जुड़ती हैं।`, `इसीलिए संयुक्त समय के लिए उलटे समय जुड़ते हैं; दिए मान रखने पर उत्तर ${answer} है।`]);
    case "wheelRollState": return Object.freeze([`बिना फिसले पहिए का हर एक चक्कर उसकी एक परिधि के बराबर दूरी तय करता है।`, `दूरी = परिधि × चक्कर और परिधि = π × व्यास का सही संबंध लगाने पर उत्तर ${answer} है।`]);
    case "wheelRateTranslationState": return Object.freeze([`हर चक्कर में पहिया अपनी परिधि जितनी दूरी तय करता है, इसलिए प्रति मिनट दूरी = परिधि × प्रति मिनट चक्कर।`, `इस रैखिक चाल को दिए समय या दूरी से जोड़ने पर मांगा गया मान ${answer} मिलता है।`]);
    case "twoWheelComparisonState": return Object.freeze([`समान दूरी के लिए चक्करों की संख्या पहिए की परिधि के व्युत्क्रमानुपाती होती है।`, `दोनों पहियों के लिए दूरी ÷ परिधि करने और तुलना करने पर उत्तर ${answer} मिलता है।`]);
  }
}
function paExplanation(input: TsdCp011ExecutableInput, solution: TsdCp011ExecutableSolution): readonly string[] {
  const answer = paAnswer(solution);
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": return Object.freeze([`ਸਤਹ ਅਤੇ ਵਿਅਕਤੀ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਣ ਤਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਣ ਤਾਂ ਘਟਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇਸ ਨਾਲ ਅਸਲ ਰਫ਼ਤਾਰ ਮਿਲਦੀ ਹੈ।`, `ਦੂਰੀ = ਰਫ਼ਤਾਰ × ਸਮਾਂ ਦਾ ਸੰਬੰਧ ਦਿੱਤੇ ਅੰਕਾਂ ਉੱਤੇ ਲਗਾਉਣ ਨਾਲ ਮੰਗਿਆ ਮੁੱਲ ${answer} ਮਿਲਦਾ ਹੈ।`]);
    case "stationaryStepCountState": return Object.freeze([`ਵਿਅਕਤੀ ਨੇ ਜਿੰਨੀਆਂ ਪੌੜੀਆਂ ਤੁਰੀਆਂ, ਉਨ੍ਹਾਂ ਅਤੇ ਉਸ ਦੀ ਰਫ਼ਤਾਰ ਤੋਂ ਯਾਤਰਾ ਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ। ਇਸੇ ਸਮੇਂ ਵਿੱਚ ਚੱਲਦੀ ਸੀੜ੍ਹੀ ਵੀ ਆਪਣਾ ਹਿੱਸਾ ਜੋੜਦੀ ਜਾਂ ਘਟਾਉਂਦੀ ਹੈ।`, `ਰੁਕੀ ਸੀੜ੍ਹੀ ਦੀਆਂ ਪੌੜੀਆਂ ਅਤੇ ਦੋਵਾਂ ਰਫ਼ਤਾਰਾਂ ਦੇ ਇਸ ਸਾਂਝੇ ਸਮੇਂ ਵਾਲੇ ਸੰਬੰਧ ਤੋਂ ਉੱਤਰ ${answer} ਹੈ।`]);
    case "dualEscalatorObservationState": return input.target === "STOPPED_TIME"
      ? Object.freeze([`ਉੱਪਰ ਜਾਂਦਿਆਂ ਵਿਅਕਤੀ ਅਤੇ ਸੀੜ੍ਹੀ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਜੁੜਦੀਆਂ ਹਨ, ਜਦਕਿ ਹੇਠਾਂ ਜਾਂਦਿਆਂ ਉਹ ਘਟਦੀਆਂ ਹਨ। ਦੋਵਾਂ ਯਾਤਰਾਵਾਂ ਦੀ ਲੰਬਾਈ ਇੱਕੋ ਹੈ।`, `ਦੋਵਾਂ ਸਮੀਕਰਨਾਂ ਵਿੱਚੋਂ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਹਟਾਉਣ ਉੱਤੇ ਰੁਕੀ ਸੀੜ੍ਹੀ ਦਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`])
      : Object.freeze([`ਇੱਕੋ ਦੂਰੀ ਲਈ ਸੀੜ੍ਹੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਤੇ ਉਲਟ ਸਮੇਂ ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ਵਿੱਚ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਜੋੜਨ ਅਤੇ ਘਟਾਉਣ ਨਾਲ ਬਣਦੇ ਹਨ।`, `ਇਨ੍ਹਾਂ ਦੋ ਸਮਿਆਂ ਤੋਂ ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ਅਤੇ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${answer}:1 ਮਿਲਦਾ ਹੈ।`]);
    case "movingSurfaceStateComparison": return Object.freeze([`ਇੱਕੋ ਲੰਬਾਈ ਲਈ ਰੁਕੀ ਸਤਹ ਉੱਤੇ ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ਅਤੇ ਸਿਰਫ਼ ਚੱਲਦੀ ਸਤਹ ਦੀ ਰਫ਼ਤਾਰ ਨੂੰ ਵੱਖਰੇ ਸਮਿਆਂ ਨਾਲ ਲਿਖਦੇ ਹਾਂ। ਇਕੱਠੇ ਚੱਲਣ ਉੱਤੇ ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਜੁੜਦੀਆਂ ਹਨ।`, `ਇਸ ਲਈ ਮਿਲੇ-ਜੁਲੇ ਸਮੇਂ ਲਈ ਉਲਟੇ ਸਮੇਂ ਜੋੜੇ ਜਾਂਦੇ ਹਨ; ਦਿੱਤੇ ਅੰਕ ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answer} ਹੈ।`]);
    case "wheelRollState": return Object.freeze([`ਬਿਨਾਂ ਫਿਸਲੇ ਪਹੀਏ ਦਾ ਹਰ ਚੱਕਰ ਉਸ ਦੇ ਇੱਕ ਘੇਰੇ ਦੇ ਬਰਾਬਰ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ।`, `ਦੂਰੀ = ਘੇਰਾ × ਚੱਕਰ ਅਤੇ ਘੇਰਾ = π × ਵਿਆਸ ਦਾ ਸਹੀ ਸੰਬੰਧ ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answer} ਹੈ।`]);
    case "wheelRateTranslationState": return Object.freeze([`ਹਰ ਚੱਕਰ ਵਿੱਚ ਪਹੀਆ ਆਪਣੇ ਘੇਰੇ ਜਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਪ੍ਰਤੀ ਮਿੰਟ ਦੂਰੀ = ਘੇਰਾ × ਪ੍ਰਤੀ ਮਿੰਟ ਚੱਕਰ।`, `ਇਸ ਰੇਖੀ ਰਫ਼ਤਾਰ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਜਾਂ ਦੂਰੀ ਨਾਲ ਜੋੜਨ ਉੱਤੇ ਮੰਗਿਆ ਮੁੱਲ ${answer} ਮਿਲਦਾ ਹੈ।`]);
    case "twoWheelComparisonState": return Object.freeze([`ਇੱਕੋ ਦੂਰੀ ਲਈ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਪਹੀਏ ਦੇ ਘੇਰੇ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।`, `ਦੋਵਾਂ ਪਹੀਆਂ ਲਈ ਦੂਰੀ ÷ ਘੇਰਾ ਕਰਕੇ ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`]);
  }
}

export type TsdCp011NativeReviewQuestion = Readonly<Omit<TsdCp011EnglishReviewQuestion, "stem" | "explanation"> & {
  language: TsdCp011NativeLanguage;
  stem: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
}>;

function localize(question: TsdCp011EnglishReviewQuestion, language: TsdCp011NativeLanguage): TsdCp011NativeReviewQuestion {
  const i = idx(question.familyId);
  const steps = language === "hi" ? hiExplanation(question.input, question.solution) : paExplanation(question.input, question.solution);
  return Object.freeze({
    familyId: question.familyId,
    qlId: question.qlId,
    authorityKey: question.authorityKey,
    difficulty: question.difficulty,
    input: question.input,
    solution: question.solution,
    language,
    stem: language === "hi" ? hiStem(question.input, i) : paStem(question.input, i),
    explanation: Object.freeze({ steps, conclusion: language === "hi" ? `उत्तर: ${hiAnswer(question.solution)}।` : `ਉੱਤਰ: ${paAnswer(question.solution)}।` }),
  });
}

export const TSD_CP011_NATIVE_HINDI_REVIEW = Object.freeze(TSD_CP011_ENGLISH_REVIEW.map((q) => localize(q, "hi")));
export const TSD_CP011_NATIVE_PUNJABI_REVIEW = Object.freeze(TSD_CP011_ENGLISH_REVIEW.map((q) => localize(q, "pa")));
export const TSD_CP011_NATIVE_REVIEW = Object.freeze([...TSD_CP011_NATIVE_HINDI_REVIEW, ...TSD_CP011_NATIVE_PUNJABI_REVIEW]);