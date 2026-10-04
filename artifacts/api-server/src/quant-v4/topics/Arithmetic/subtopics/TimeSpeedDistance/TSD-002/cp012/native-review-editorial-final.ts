import { absRational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP012_NATIVE_HINDI_REVIEW, TSD_CP012_NATIVE_PUNJABI_REVIEW, type TsdCp012NativeReviewQuestion } from "./native-review-final";
import { calibrateTsdCp012ReviewedDifficulty } from "./reviewed-difficulty";

function v(value: Rational): string { return toMixedString(value); }
function hiSeconds(value: Rational): string { return `${v(value)} सेकंड`; }
function paSeconds(value: Rational): string { return `${v(value)} ਸਕਿੰਟ`; }
function hiMetres(value: Rational): string { return `${v(value)} मीटर`; }
function paMetres(value: Rational): string { return `${v(value)} ਮੀਟਰ`; }
function hiSpeed(value: Rational): string { return `${v(value)} मीटर/सेकंड`; }
function paSpeed(value: Rational): string { return `${v(value)} ਮੀਟਰ/ਸਕਿੰਟ`; }
function familyIndex(question: TsdCp012NativeReviewQuestion): number {
  const suffix = question.familyId.at(-1) ?? "A";
  return Math.max(0, suffix.charCodeAt(0) - 65);
}

const HI_NAMES = Object.freeze([
  Object.freeze(["अमन", "भारत"] as const),
  Object.freeze(["रवि", "करण"] as const),
  Object.freeze(["नीरज", "विकास"] as const),
  Object.freeze(["अरुण", "मोहन"] as const),
  Object.freeze(["कबीर", "साहिल"] as const),
  Object.freeze(["दीपक", "रोहित"] as const),
]);
const PA_NAMES = Object.freeze([
  Object.freeze(["ਅਮਨ", "ਭਾਰਤ"] as const),
  Object.freeze(["ਰਵੀ", "ਕਰਨ"] as const),
  Object.freeze(["ਨੀਰਜ", "ਵਿਕਾਸ"] as const),
  Object.freeze(["ਅਰੁਣ", "ਮੋਹਨ"] as const),
  Object.freeze(["ਕਬੀਰ", "ਸਾਹਿਲ"] as const),
  Object.freeze(["ਦੀਪਕ", "ਰੋਹਿਤ"] as const),
]);

function hiObservation(nameA: string, nameB: string, a: Rational, b: Rational, c: Rational): string {
  if (b.numerator < 0n) return `${hiSeconds(a)} में ${nameA} द्वारा तय दूरी, ${hiSeconds(absRational(b))} में ${nameB} द्वारा तय दूरी से ${hiMetres(c)} अधिक है`;
  return `${nameA} ${hiSeconds(a)} और ${nameB} ${hiSeconds(b)} दौड़ते हैं तथा दोनों की कुल तय दूरी ${hiMetres(c)} होती है`;
}
function paObservation(nameA: string, nameB: string, a: Rational, b: Rational, c: Rational): string {
  if (b.numerator < 0n) return `${paSeconds(a)} ਵਿੱਚ ${nameA} ਵੱਲੋਂ ਤੈਅ ਦੂਰੀ, ${paSeconds(absRational(b))} ਵਿੱਚ ${nameB} ਵੱਲੋਂ ਤੈਅ ਦੂਰੀ ਤੋਂ ${paMetres(c)} ਵੱਧ ਹੈ`;
  return `${nameA} ${paSeconds(a)} ਅਤੇ ${nameB} ${paSeconds(b)} ਦੌੜਦੇ ਹਨ ਅਤੇ ਦੋਨਾਂ ਦੀ ਕੁੱਲ ਤੈਅ ਦੂਰੀ ${paMetres(c)} ਹੁੰਦੀ ਹੈ`;
}

function hiStem(question: TsdCp012NativeReviewQuestion): string {
  const input = question.input;
  if (input.authorityKey === "feasibleParameterSetState") {
    const request = input.target === "VALID_SET"
      ? "निम्न विकल्पों में से कौन-सा सभी मान्य चालों का पूरा समूह देता है?"
      : "कितनी अनुमत चालें शर्त पूरी करती हैं?";
    const variants = [
      `एक आपात वाहन को ${hiMetres(input.distance)} दूरी तय करनी है। चाल ${input.minimumCandidate} से ${input.maximumCandidate} मीटर/सेकंड के बीच पूर्णांक होनी चाहिए। ${hiSeconds(input.fixedDelay)} की निश्चित देरी सहित कुल समय ${hiSeconds(input.deadline)} से अधिक नहीं हो सकता। ${request}`,
      `${hiMetres(input.distance)} की निरीक्षण यात्रा में चालक केवल ${input.minimumCandidate} से ${input.maximumCandidate} मीटर/सेकंड के बीच की पूर्णांक चाल चुन सकता है। ${hiSeconds(input.fixedDelay)} का अनिवार्य ठहराव जोड़ने के बाद यात्रा ${hiSeconds(input.deadline)} के भीतर पूरी होनी चाहिए। ${request}`,
      `एक सेवा वाहन को ${hiMetres(input.distance)} दूरी तय करनी है और कुल समय-सीमा ${hiSeconds(input.deadline)} है, जिसमें ${hiSeconds(input.fixedDelay)} की निश्चित देरी शामिल है। केवल ${input.minimumCandidate} से ${input.maximumCandidate} मीटर/सेकंड तक की पूर्णांक चालें मान्य हैं। ${request}`,
    ];
    return variants[familyIndex(question) % variants.length]!;
  }
  if (input.authorityKey === "routeProfileProgramState" && input.target === "DISTANCE_SPLIT_A") {
    const variants = [
      `एक निश्चित ${hiMetres(input.totalDistance)} मार्ग में लगातार दो अलग भू-खंड हैं। पहले खंड पर चाल ${hiSpeed(input.speedA)} और शेष खंड पर ${hiSpeed(input.speedB)} है। पूरा मार्ग ${hiSeconds(input.totalTime)} में तय होता है। पहले भू-खंड की लंबाई ज्ञात कीजिए।`,
      `${hiMetres(input.totalDistance)} के सेवा-मार्ग पर एक अज्ञात सीमा तक चाल ${hiSpeed(input.speedA)} है और उस सीमा के बाद ${hiSpeed(input.speedB)} है। कुल यात्रा समय ${hiSeconds(input.totalTime)} है। प्रारंभ से चाल बदलने वाली मार्ग-सीमा की दूरी ज्ञात कीजिए।`,
    ];
    return variants[familyIndex(question) % variants.length]!;
  }
  if (input.authorityKey === "twoEngineInverseState") {
    const [nameA, nameB] = HI_NAMES[familyIndex(question) % HI_NAMES.length]!;
    const first = hiObservation(nameA, nameB, input.a1, input.b1, input.c1);
    const second = hiObservation(nameA, nameB, input.a2, input.b2, input.c2);
    const asked = input.target === "X" ? nameA : nameB;
    return `${nameA} और ${nameB} दो धावक हैं जिनकी स्थिर चालें अज्ञात हैं। एक स्वतंत्र निरीक्षण में ${first}। दूसरे स्वतंत्र निरीक्षण में ${second}। ${asked} की चाल ज्ञात कीजिए।`;
  }
  return question.stem;
}
function paStem(question: TsdCp012NativeReviewQuestion): string {
  const input = question.input;
  if (input.authorityKey === "feasibleParameterSetState") {
    const request = input.target === "VALID_SET"
      ? "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਾਰੀਆਂ ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਦਿੰਦਾ ਹੈ?"
      : "ਕਿੰਨੀਆਂ ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀਆਂ ਹਨ?";
    const variants = [
      `ਇੱਕ ਐਮਰਜੈਂਸੀ ਵਾਹਨ ਨੇ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਨੀ ਹੈ। ਚਾਲ ${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਮੀਟਰ/ਸਕਿੰਟ ਵਿਚਕਾਰ ਪੂਰਨ ਅੰਕ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ। ${paSeconds(input.fixedDelay)} ਦੀ ਨਿਸ਼ਚਿਤ ਦੇਰੀ ਸਮੇਤ ਕੁੱਲ ਸਮਾਂ ${paSeconds(input.deadline)} ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋ ਸਕਦਾ। ${request}`,
      `${paMetres(input.distance)} ਦੀ ਜਾਂਚ ਯਾਤਰਾ ਵਿੱਚ ਚਾਲਕ ਸਿਰਫ਼ ${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਮੀਟਰ/ਸਕਿੰਟ ਵਿਚਕਾਰ ਪੂਰਨ ਅੰਕ ਚਾਲ ਚੁਣ ਸਕਦਾ ਹੈ। ${paSeconds(input.fixedDelay)} ਦਾ ਲਾਜ਼ਮੀ ਠਹਿਰਾਅ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਯਾਤਰਾ ${paSeconds(input.deadline)} ਦੇ ਅੰਦਰ ਪੂਰੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ। ${request}`,
      `ਇੱਕ ਸੇਵਾ ਵਾਹਨ ਨੇ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਨੀ ਹੈ ਅਤੇ ਕੁੱਲ ਸਮਾਂ-ਸੀਮਾ ${paSeconds(input.deadline)} ਹੈ, ਜਿਸ ਵਿੱਚ ${paSeconds(input.fixedDelay)} ਦੀ ਨਿਸ਼ਚਿਤ ਦੇਰੀ ਸ਼ਾਮਲ ਹੈ। ਸਿਰਫ਼ ${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਮੀਟਰ/ਸਕਿੰਟ ਤੱਕ ਦੀਆਂ ਪੂਰਨ ਅੰਕ ਚਾਲਾਂ ਮਨਜ਼ੂਰ ਹਨ। ${request}`,
    ];
    return variants[familyIndex(question) % variants.length]!;
  }
  if (input.authorityKey === "routeProfileProgramState" && input.target === "DISTANCE_SPLIT_A") {
    const variants = [
      `ਇੱਕ ਨਿਸ਼ਚਿਤ ${paMetres(input.totalDistance)} ਰਸਤੇ ਵਿੱਚ ਲਗਾਤਾਰ ਦੋ ਵੱਖ ਭੂ-ਖੰਡ ਹਨ। ਪਹਿਲੇ ਖੰਡ ਤੇ ਚਾਲ ${paSpeed(input.speedA)} ਅਤੇ ਬਾਕੀ ਖੰਡ ਤੇ ${paSpeed(input.speedB)} ਹੈ। ਪੂਰਾ ਰਸਤਾ ${paSeconds(input.totalTime)} ਵਿੱਚ ਤੈਅ ਹੁੰਦਾ ਹੈ। ਪਹਿਲੇ ਭੂ-ਖੰਡ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
      `${paMetres(input.totalDistance)} ਦੇ ਸੇਵਾ-ਰਸਤੇ ਤੇ ਇੱਕ ਅਣਜਾਣ ਹੱਦ ਤੱਕ ਚਾਲ ${paSpeed(input.speedA)} ਹੈ ਅਤੇ ਉਸ ਹੱਦ ਤੋਂ ਬਾਅਦ ${paSpeed(input.speedB)} ਹੈ। ਕੁੱਲ ਯਾਤਰਾ ਸਮਾਂ ${paSeconds(input.totalTime)} ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਚਾਲ ਬਦਲਣ ਵਾਲੀ ਰਸਤਾ-ਹੱਦ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
    ];
    return variants[familyIndex(question) % variants.length]!;
  }
  if (input.authorityKey === "twoEngineInverseState") {
    const [nameA, nameB] = PA_NAMES[familyIndex(question) % PA_NAMES.length]!;
    const first = paObservation(nameA, nameB, input.a1, input.b1, input.c1);
    const second = paObservation(nameA, nameB, input.a2, input.b2, input.c2);
    const asked = input.target === "X" ? nameA : nameB;
    return `${nameA} ਅਤੇ ${nameB} ਦੋ ਦੌੜਾਕ ਹਨ ਜਿਨ੍ਹਾਂ ਦੀਆਂ ਸਥਿਰ ਚਾਲਾਂ ਅਣਜਾਣ ਹਨ। ਇੱਕ ਸੁਤੰਤਰ ਨਿਰੀਖਣ ਵਿੱਚ ${first}। ਦੂਜੇ ਸੁਤੰਤਰ ਨਿਰੀਖਣ ਵਿੱਚ ${second}। ${asked} ਦੀ ਚਾਲ ਕੱਢੋ।`;
  }
  return question.stem;
}

function hiExplanation(question: TsdCp012NativeReviewQuestion): TsdCp012NativeReviewQuestion["explanation"] | undefined {
  const input = question.input;
  if (input.authorityKey !== "twoEngineInverseState" || question.solution.kind !== "SCALAR") return undefined;
  const [nameA, nameB] = HI_NAMES[familyIndex(question) % HI_NAMES.length]!;
  const sign1 = input.b1.numerator < 0n ? "−" : "+";
  const sign2 = input.b2.numerator < 0n ? "−" : "+";
  const asked = input.target === "X" ? nameA : nameB;
  const answer = hiSpeed(question.solution.answer);
  return Object.freeze({
    steps: Object.freeze([
      `${nameA} की चाल प और ${nameB} की चाल क मानें। दूरी = चाल × समय लगाने पर दोनों निरीक्षण ${v(input.a1)}प ${sign1} ${v(absRational(input.b1))}क = ${v(input.c1)} और ${v(input.a2)}प ${sign2} ${v(absRational(input.b2))}क = ${v(input.c2)} देते हैं।`,
      `दोनों स्वतंत्र संबंधों को साथ हल करने पर ${asked} की चाल ${answer} मिलती है।`,
    ]),
    conclusion: `उत्तर: ${answer}।`,
  });
}
function paExplanation(question: TsdCp012NativeReviewQuestion): TsdCp012NativeReviewQuestion["explanation"] | undefined {
  const input = question.input;
  if (input.authorityKey !== "twoEngineInverseState" || question.solution.kind !== "SCALAR") return undefined;
  const [nameA, nameB] = PA_NAMES[familyIndex(question) % PA_NAMES.length]!;
  const sign1 = input.b1.numerator < 0n ? "−" : "+";
  const sign2 = input.b2.numerator < 0n ? "−" : "+";
  const asked = input.target === "X" ? nameA : nameB;
  const answer = paSpeed(question.solution.answer);
  return Object.freeze({
    steps: Object.freeze([
      `${nameA} ਦੀ ਚਾਲ ਪ ਅਤੇ ${nameB} ਦੀ ਚਾਲ ਕ ਮੰਨੋ। ਦੂਰੀ = ਚਾਲ × ਸਮਾਂ ਲਗਾਉਣ ਤੇ ਦੋਵੇਂ ਨਿਰੀਖਣ ${v(input.a1)}ਪ ${sign1} ${v(absRational(input.b1))}ਕ = ${v(input.c1)} ਅਤੇ ${v(input.a2)}ਪ ${sign2} ${v(absRational(input.b2))}ਕ = ${v(input.c2)} ਦਿੰਦੇ ਹਨ।`,
      `ਦੋਨਾਂ ਸੁਤੰਤਰ ਸੰਬੰਧਾਂ ਨੂੰ ਇਕੱਠੇ ਹੱਲ ਕਰਨ ਤੇ ${asked} ਦੀ ਚਾਲ ${answer} ਮਿਲਦੀ ਹੈ।`,
    ]),
    conclusion: `ਜਵਾਬ: ${answer}।`,
  });
}

export const TSD_CP012_NATIVE_HINDI_REVIEW_FINAL = Object.freeze(TSD_CP012_NATIVE_HINDI_REVIEW.map((question) => Object.freeze({
  ...question,
  difficulty: calibrateTsdCp012ReviewedDifficulty(question.difficulty),
  stem: hiStem(question),
  explanation: hiExplanation(question) ?? question.explanation,
})));
export const TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL = Object.freeze(TSD_CP012_NATIVE_PUNJABI_REVIEW.map((question) => Object.freeze({
  ...question,
  difficulty: calibrateTsdCp012ReviewedDifficulty(question.difficulty),
  stem: paStem(question),
  explanation: paExplanation(question) ?? question.explanation,
})));
