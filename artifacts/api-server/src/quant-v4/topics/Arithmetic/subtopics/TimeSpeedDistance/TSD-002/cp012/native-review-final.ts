import {
  absRational,
  add,
  divide,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../../TSD-001/foundation/rational";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import type { TsdCp012EnglishReviewQuestion, TsdCp012ReviewInput } from "./english-review-final";
import type { TsdCp012ExecutableSolution, TsdCp012Route, TsdCp012Stage, TsdCp012TimedStage } from "./executable-types";
import { TSD_CP012_TWO_ENGINE_PROVENANCE } from "./two-engine-provenance";

export type TsdCp012NativeLanguage = "hi" | "pa";
export type TsdCp012NativeReviewQuestion = Readonly<Omit<TsdCp012EnglishReviewQuestion, "stem" | "explanation"> & {
  stem: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
}>;

const ZERO = rational(0);
function v(value: Rational): string { return toMixedString(value); }
function idx(familyId: string): number { return Math.max(0, (familyId.at(-1) ?? "A").charCodeAt(0) - 65); }
function sum(values: readonly Rational[]): Rational { return values.reduce((total, value) => add(total, value), ZERO); }
function timedDistance(stage: TsdCp012TimedStage): Rational { return multiply(stage.speed, stage.duration); }
function stageTime(stage: TsdCp012Stage): Rational { return divide(stage.distance, stage.speed); }
function routeTime(route: TsdCp012Route): Rational { return sum(route.segments.map(stageTime)); }

function hiSeconds(value: Rational): string { return `${v(value)} सेकंड`; }
function paSeconds(value: Rational): string { return `${v(value)} ਸਕਿੰਟ`; }
function hiMetres(value: Rational): string { return `${v(value)} मीटर`; }
function paMetres(value: Rational): string { return `${v(value)} ਮੀਟਰ`; }
function hiSpeed(value: Rational): string { return `${v(value)} मीटर/सेकंड`; }
function paSpeed(value: Rational): string { return `${v(value)} ਮੀਟਰ/ਸਕਿੰਟ`; }
function hiTimedPlan(stages: readonly TsdCp012TimedStage[]): string {
  return stages.map((stage, index) => `चरण ${index + 1} में ${hiSpeed(stage.speed)} की चाल से ${hiSeconds(stage.duration)}`).join(", ");
}
function paTimedPlan(stages: readonly TsdCp012TimedStage[]): string {
  return stages.map((stage, index) => `ਪੜਾਅ ${index + 1} ਵਿੱਚ ${paSpeed(stage.speed)} ਦੀ ਚਾਲ ਨਾਲ ${paSeconds(stage.duration)}`).join(", ");
}
function hiDistancePlan(stages: readonly TsdCp012Stage[]): string {
  return stages.map((stage, index) => `खंड ${index + 1}: ${hiMetres(stage.distance)} को ${hiSpeed(stage.speed)} से`).join(", ");
}
function paDistancePlan(stages: readonly TsdCp012Stage[]): string {
  return stages.map((stage, index) => `ਖੰਡ ${index + 1}: ${paMetres(stage.distance)} ਨੂੰ ${paSpeed(stage.speed)} ਨਾਲ`).join(", ");
}
function hiRoute(route: TsdCp012Route): string { return hiDistancePlan(route.segments); }
function paRoute(route: TsdCp012Route): string { return paDistancePlan(route.segments); }

function hiAnswer(solution: TsdCp012ExecutableSolution): string {
  if (solution.kind === "SET") return `{${solution.values.map(v).join(", ")}} मीटर/सेकंड`;
  switch (solution.unit) {
    case "SECOND": return hiSeconds(solution.answer);
    case "METRE": return hiMetres(solution.answer);
    case "METRE_PER_SECOND": return hiSpeed(solution.answer);
    case "COUNT": return v(solution.answer);
    case "INDEX": return `मार्ग ${v(solution.answer)}`;
    case "RATIO": return v(solution.answer);
    case "PARAMETER": return hiSpeed(solution.answer);
  }
}
function paAnswer(solution: TsdCp012ExecutableSolution): string {
  if (solution.kind === "SET") return `{${solution.values.map(v).join(", ")}} ਮੀਟਰ/ਸਕਿੰਟ`;
  switch (solution.unit) {
    case "SECOND": return paSeconds(solution.answer);
    case "METRE": return paMetres(solution.answer);
    case "METRE_PER_SECOND": return paSpeed(solution.answer);
    case "COUNT": return v(solution.answer);
    case "INDEX": return `ਰਸਤਾ ${v(solution.answer)}`;
    case "RATIO": return v(solution.answer);
    case "PARAMETER": return paSpeed(solution.answer);
  }
}

function hiEquation(a: Rational, b: Rational, c: Rational): string {
  const sign = b.numerator < 0n ? "−" : "+";
  return `${v(a)}×प ${sign} ${v(absRational(b))}×क = ${v(c)}`;
}
function paEquation(a: Rational, b: Rational, c: Rational): string {
  const sign = b.numerator < 0n ? "−" : "+";
  return `${v(a)}×ਪ ${sign} ${v(absRational(b))}×ਕ = ${v(c)}`;
}
function hiEngine(caseId: string): string {
  const p = TSD_CP012_TWO_ENGINE_PROVENANCE.find((row) => row.caseId === caseId);
  if (!p) return "दो अलग गति-स्थितियों";
  const names: Record<string, string> = {
    trainScheduleSynthesisState: "रेल-समय स्थिति",
    mediumPursuitSynthesisState: "धारा में पीछा स्थिति",
    closedTrackRaceSynthesisState: "वृत्ताकार दौड़ स्थिति",
    movingSurfaceScheduleSynthesisState: "चलती सतह की समय-सारणी स्थिति",
    routeProfileProgramState: "खंडित मार्ग स्थिति",
    terminalConstraintProgramState: "समय-सीमा वाली यात्रा स्थिति",
    discreteSpeedProgramState: "बदलती चाल के चरणों वाली स्थिति",
    periodicTravelRestProgramState: "चलना-विश्राम चक्र स्थिति",
    motionReconstructionProgramState: "यात्रा पुनर्निर्माण स्थिति",
  };
  return `${names[p.engineA] ?? "पहली गति स्थिति"} और ${names[p.engineB] ?? "दूसरी गति स्थिति"}`;
}
function paEngine(caseId: string): string {
  const p = TSD_CP012_TWO_ENGINE_PROVENANCE.find((row) => row.caseId === caseId);
  if (!p) return "ਦੋ ਵੱਖ ਗਤੀ-ਸਥਿਤੀਆਂ";
  const names: Record<string, string> = {
    trainScheduleSynthesisState: "ਰੇਲ ਸਮਾਂ-ਸਥਿਤੀ",
    mediumPursuitSynthesisState: "ਧਾਰਾ ਵਿੱਚ ਪਿੱਛਾ ਸਥਿਤੀ",
    closedTrackRaceSynthesisState: "ਗੋਲ ਦੌੜ ਸਥਿਤੀ",
    movingSurfaceScheduleSynthesisState: "ਚੱਲਦੀ ਸਤਹ ਦੀ ਸਮਾਂ-ਸੂਚੀ ਸਥਿਤੀ",
    routeProfileProgramState: "ਖੰਡਿਤ ਰਸਤਾ ਸਥਿਤੀ",
    terminalConstraintProgramState: "ਸਮਾਂ-ਸੀਮਾ ਵਾਲੀ ਯਾਤਰਾ ਸਥਿਤੀ",
    discreteSpeedProgramState: "ਬਦਲਦੀ ਚਾਲ ਦੇ ਪੜਾਵਾਂ ਵਾਲੀ ਸਥਿਤੀ",
    periodicTravelRestProgramState: "ਚੱਲਣ-ਆਰਾਮ ਚੱਕਰ ਸਥਿਤੀ",
    motionReconstructionProgramState: "ਯਾਤਰਾ ਪੁਨਰ-ਨਿਰਮਾਣ ਸਥਿਤੀ",
  };
  return `${names[p.engineA] ?? "ਪਹਿਲੀ ਗਤੀ ਸਥਿਤੀ"} ਅਤੇ ${names[p.engineB] ?? "ਦੂਜੀ ਗਤੀ ਸਥਿਤੀ"}`;
}

function hiStem(input: TsdCp012ReviewInput, caseId: string, i: number): string {
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") return i % 2 === 0
        ? `एक वाहन लगातार इन चाल-चरणों का पालन करता है: ${hiTimedPlan(input.stages)}। सभी चरण पूरे करने पर कुल दूरी कितनी होगी?`
        : `परीक्षण यात्रा में वाहन की चाल क्रमशः इस प्रकार रहती है: ${hiTimedPlan(input.stages)}। अंतिम चरण के अंत तक तय कुल दूरी ज्ञात कीजिए।`;
      if (input.target === "TOTAL_TIME") return `एक यात्री बिना रुके क्रमशः ${hiDistancePlan(input.stages)} चलता है। पूरी यात्रा में लगा कुल समय ज्ञात कीजिए।`;
      if (input.target === "UNKNOWN_FINAL_SPEED") return `एक वाहन पहले ${hiTimedPlan(input.priorStages)} चलता है। इसके बाद वह ${hiSeconds(input.finalDuration)} तक एक अज्ञात स्थिर चाल से चलता है और कुल ${hiMetres(input.totalDistance)} दूरी पूरी करता है। अंतिम चाल ज्ञात कीजिए।`;
      if (input.target === "PERIODIC_DISTANCE") return `एक वाहन बार-बार यही चाल-चक्र दोहराता है: ${hiTimedPlan(input.cycle)}। वह ${input.fullCycles} पूरे चक्र और फिर ${hiTimedPlan(input.partialStages)} पूरा करता है। कुल दूरी ज्ञात कीजिए।`;
      return `एक धावक बिना विश्राम के यह चाल-चक्र बार-बार दोहराता है: ${hiTimedPlan(input.cycle)}। ${hiMetres(input.distance)} दूरी पहली बार पूरी होने का ठीक समय ज्ञात कीजिए।`;
    }
    case "periodicTravelRestProgramState": {
      if (input.target === "COMPLETION_TIME") return `एक व्यक्ति ${hiSpeed(input.travelSpeed)} की चाल से हर बार ${hiSeconds(input.travelDurationPerBlock)} चलता है, फिर ${hiSeconds(input.restDuration)} विश्राम करता है। गंतव्य ${hiMetres(input.distance)} दूर है और पहुँचने के बाद कोई विश्राम नहीं होता। कुल लगा समय ज्ञात कीजिए।`;
      if (input.target === "REST_COUNT") return `एक यात्री को ${hiMetres(input.distance)} दूरी तय करनी है। वह हर चाल-खंड में ${hiSeconds(input.travelDurationPerBlock)} तक ${hiSpeed(input.travelSpeed)} से चलता है और हर पूरे चाल-खंड के बाद, अंतिम पहुँच को छोड़कर, विश्राम करता है। कुल विश्रामों की संख्या ज्ञात कीजिए।`;
      return `एक व्यक्ति ${hiMetres(input.distance)} दूरी को ${hiSpeed(input.travelSpeed)} की चाल से, प्रत्येक चाल-खंड में ${hiSeconds(input.travelDurationPerBlock)} चलते हुए तय करता है। बीच के सभी विश्राम बराबर हैं और पूरी यात्रा ${hiSeconds(input.totalElapsedTime)} में पूरी होती है। एक विश्राम की अवधि ज्ञात कीजिए।`;
    }
    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") return `एक वाहन ${hiMetres(input.completedDistance)} दूरी ${hiSeconds(input.elapsedTime)} में तय कर चुका है। कुल दूरी ${hiMetres(input.totalDistance)} है और पूरी यात्रा ${hiSeconds(input.deadline)} के भीतर पूरी करनी है। शेष दूरी के लिए आवश्यक स्थिर चाल ज्ञात कीजिए।`;
      if (input.target === "REQUIRED_FINAL_TIME") return `एक यात्री ${hiMetres(input.totalDistance)} की यात्रा में ${hiMetres(input.completedDistance)} दूरी ${hiSeconds(input.elapsedTime)} में तय कर चुका है। शेष दूरी ${hiSpeed(input.finalSpeed)} से तय होगी। अंतिम चरण में लगने वाला समय ज्ञात कीजिए।`;
      if (input.target === "STAGE_BOUNDARY_DISTANCE") return `${hiMetres(input.totalDistance)} की यात्रा कुल ${hiSeconds(input.totalTime)} में पूरी होती है। पहले भाग में चाल ${hiSpeed(input.firstSpeed)} और बाद के भाग में ${hiSpeed(input.secondSpeed)} है। चाल बदलने का बिंदु प्रारंभ से कितनी दूरी पर है?`;
      if (input.target === "MAXIMUM_DELAY") return `एक वाहन को ${hiMetres(input.distance)} दूरी ${hiSpeed(input.speed)} की चाल से तय करनी है और अभी से ${hiSeconds(input.arrivalDeadline)} के भीतर पहुँचना है। प्रस्थान में अधिकतम कितनी देरी की जा सकती है?`;
      if (input.target === "MINIMUM_SPEED") return `${hiMetres(input.distance)} की यात्रा अधिकतम ${hiSeconds(input.availableTime)} में पूरी करनी है। पूरी दूरी एक ही स्थिर चाल से तय की जाए तो न्यूनतम आवश्यक चाल ज्ञात कीजिए।`;
      return `एक वाहन की कुल नियोजित दूरी ${hiMetres(input.totalDistance)} है। वह पहले ही इन चाल-चरणों को पूरा कर चुका है: ${hiTimedPlan(input.completedStages)}। अब कितनी दूरी शेष है?`;
    }
    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") return i % 2 === 0
        ? `एक मार्ग के अलग-अलग खंडों पर चाल अलग है: ${hiDistancePlan(input.segments)}। पूरा मार्ग तय करने का कुल समय ज्ञात कीजिए।`
        : `सेवा वाहन इस निश्चित मार्ग-क्रम से चलता है: ${hiDistancePlan(input.segments)}। चाल केवल बताए गए खंडों पर बदलती है। कुल यात्रा समय ज्ञात कीजिए।`;
      if (input.target === "DISTANCE_SPLIT_A") return `${hiMetres(input.totalDistance)} की यात्रा ${hiSeconds(input.totalTime)} में पूरी होती है। कुछ दूरी ${hiSpeed(input.speedA)} और शेष ${hiSpeed(input.speedB)} से तय होती है। ${hiSpeed(input.speedA)} से तय दूरी ज्ञात कीजिए।`;
      if (input.target === "FASTEST_ROUTE_INDEX") return `तीन पूरे मार्ग उपलब्ध हैं। मार्ग 1: ${hiRoute(input.routes[0]!)}। मार्ग 2: ${hiRoute(input.routes[1]!)}। मार्ग 3: ${hiRoute(input.routes[2]!)}। सबसे कम समय वाला मार्ग चुनिए।`;
      if (input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") return `एक ही आरंभ और अंत के बीच दो मार्ग हैं। मार्ग क: ${hiRoute(input.routeA)}। मार्ग ख: ${hiRoute(input.routeB)}। दोनों के यात्रा समय का अंतर ज्ञात कीजिए।`;
      return `दो धावक एक आयताकार बंद मार्ग के एक ही कोने से एक साथ विपरीत दिशाओं में चलते हैं। घड़ी की दिशा वाला क्रम: ${hiDistancePlan(input.clockwiseSegments)}। विपरीत दिशा वाला क्रम: ${hiDistancePlan(input.counterclockwiseSegments)}। चाल केवल कोनों पर बदलती है। पहली मुलाकात का समय ज्ञात कीजिए।`;
    }
    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return `एक यात्रा कुल ${hiMetres(input.totalDistance)} की है। दर्ज चरण-दूरियाँ ${input.knownDistances.map(hiMetres).join(", ")} हैं और एक चरण की दूरी छूट गई है। छूटी दूरी ज्ञात कीजिए।`;
      if (input.target === "MISSING_TIME") return `पूरी यात्रा ${hiSeconds(input.totalTime)} की है। दर्ज चरण-समय ${input.knownTimes.map(hiSeconds).join(", ")} हैं और एक समय दर्ज नहीं हुआ। छूटा समय ज्ञात कीजिए।`;
      if (input.target === "MISSING_SPEED") return `यात्रा-सारणी की एक पंक्ति में ${hiMetres(input.missingDistance)} दूरी ${hiSeconds(input.missingTime)} में तय की गई है, पर चाल का मान नहीं दिया गया। अज्ञात चाल ज्ञात कीजिए।`;
      return `दो चरणों की यात्रा ${hiMetres(input.totalDistance)} दूरी ${hiSeconds(input.totalTime)} में पूरी होती है। ज्ञात चरण में ${hiMetres(input.knownStage.distance)} दूरी ${hiSpeed(input.knownStage.speed)} से तय होती है और दूसरे चरण की चाल ${hiSpeed(input.missingSpeed)} है। दूसरे चरण की दूरी ज्ञात कीजिए।`;
    }
    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return i % 3 === 0
        ? `दो रेलगाड़ियाँ ${hiMetres(input.stationDistance)} दूर स्टेशनों से एक-दूसरे की ओर चलती हैं। पहली गाड़ी ${hiSpeed(input.speedA)} से पहले चलती है और दूसरी ${hiSeconds(input.delayB)} बाद ${hiSpeed(input.speedB)} से चलती है। पहली गाड़ी के प्रस्थान से मुलाकात तक का समय ज्ञात कीजिए।`
        : `पहली रेलगाड़ी ${hiSpeed(input.speedA)} से चलती है। ${hiMetres(input.stationDistance)} दूर दूसरे स्टेशन से दूसरी गाड़ी ${hiSeconds(input.delayB)} बाद ${hiSpeed(input.speedB)} से उसकी ओर चलती है। पहली गाड़ी के चलने के कितने समय बाद वे मिलेंगी?`;
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") return `दो रेलगाड़ियों के अग्र भागों के बीच आरंभिक दूरी ${hiMetres(input.initialGap)} है। उनकी लंबाइयाँ ${hiMetres(input.lengthA)} और ${hiMetres(input.lengthB)} हैं। पहली गाड़ी ${hiSpeed(input.speedA)} से तुरंत चलती है, दूसरी ${hiSeconds(input.delayB)} बाद ${hiSpeed(input.speedB)} से सामने की ओर चलती है। पहली गाड़ी के चलने से पूर्ण पार होने तक का समय ज्ञात कीजिए।`;
      return `दो रेलगाड़ियाँ ${hiMetres(input.stationDistance)} दूर हैं और एक-दूसरे की ओर ${hiSpeed(input.speedA)} तथा ${hiSpeed(input.speedB)} से चलती हैं। पहली गाड़ी तुरंत चलती है, दूसरी बाद में। वे पहली गाड़ी के प्रस्थान के ${hiSeconds(input.meetingTimeFromFirstDeparture)} बाद मिलती हैं। दूसरी गाड़ी की देरी ज्ञात कीजिए।`;
    }
    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return `एक बेड़ा ${hiSpeed(input.currentSpeed)} की धारा के साथ बहता है। उसी स्थान से ${hiSpeed(input.boatStillWaterSpeed)} की स्थिर जल चाल वाली नाव ${hiSeconds(input.boatStartDelay)} बाद नीचे की ओर चलती है। बेड़े के चलने से पकड़ तक का समय ज्ञात कीजिए।`;
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") return `एक बेड़ा ${hiSpeed(input.currentSpeed)} की धारा के साथ बहना शुरू करता है। ${hiSeconds(input.boatStartDelay)} बाद उसी स्थान से ${hiSpeed(input.boatStillWaterSpeed)} की स्थिर जल चाल वाली नाव नीचे की ओर पीछा करती है। प्रारंभिक स्थान से पकड़ की दूरी ज्ञात कीजिए।`;
      if (input.target === "CURRENT_SPEED") return `एक बेड़ा बहना शुरू करता है। ${hiSpeed(input.boatStillWaterSpeed)} की स्थिर जल चाल वाली नाव ${hiSeconds(input.boatStartDelay)} बाद उसी स्थान से नीचे की ओर चलती है और बेड़े को उसके चलने के ${hiSeconds(input.catchTimeFromRaftStart)} बाद पकड़ती है। धारा की चाल ज्ञात कीजिए।`;
      return `धारा में चलती नाव से एक तैरती वस्तु गिर जाती है। धारा की चाल ${hiSpeed(input.currentSpeed)} है। ${hiSeconds(input.detectionDelay)} बाद वस्तु के गिरने का पता चलता है और ${hiSpeed(input.boatStillWaterSpeed)} की स्थिर जल चाल वाली नाव तुरंत लौटती है। पकड़ के समय वस्तु गिरने के स्थान से कितनी नीचे पहुँच चुकी होगी?`;
    }
    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") return i % 3 === 0
        ? `${hiMetres(input.trackLength)} लंबे वृत्ताकार पथ पर ${input.raceLaps} चक्कर की दौड़ है। तेज धावक ${hiSpeed(input.fasterSpeed)} से और धीमा धावक ${hiSpeed(input.slowerSpeed)} से दौड़ता है; धीमे को ${hiMetres(input.slowerHeadStart)} की बढ़त मिली है। तेज धावक के समाप्त करते ही धीमे धावक को समाप्ति तक कितनी दूरी और तय करनी है?`
        : `${input.raceLaps} चक्कर की दौड़ ${hiMetres(input.trackLength)} के वृत्ताकार पथ पर होती है। चालें ${hiSpeed(input.fasterSpeed)} और ${hiSpeed(input.slowerSpeed)} हैं तथा धीमे धावक को ${hiMetres(input.slowerHeadStart)} आगे से शुरू कराया गया है। तेज धावक के समाप्ति बिंदु पर पहुँचते समय धीमे की शेष दूरी ज्ञात कीजिए।`;
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") return `${hiMetres(input.trackLength)} के वृत्ताकार पथ पर ${input.raceLaps} चक्कर की दौड़ में चालें ${hiSpeed(input.fasterSpeed)} और ${hiSpeed(input.slowerSpeed)} हैं। दोनों को एक साथ समाप्त कराने के लिए धीमे धावक को कितनी आरंभिक बढ़त देनी चाहिए?`;
      return `${hiMetres(input.trackLength)} लंबे वृत्ताकार पथ पर तेज धावक ${hiSpeed(input.fasterSpeed)} और धीमा धावक ${hiSpeed(input.slowerSpeed)} से दौड़ता है। धीमा धावक ${hiMetres(input.slowerHeadStart)} आगे से शुरू करता है। तेज धावक पहली बार उसे कितने समय बाद पीछे छोड़ेगा?`;
    }
    case "movingSurfaceScheduleSynthesisState": {
      if (input.target === "TIME_WITH_STOP_AFTER") return i % 2 === 0
        ? `एक व्यक्ति ${hiMetres(input.length)} लंबी चलती पट्टी पर पट्टी के सापेक्ष ${hiSpeed(input.personRate)} से चलता है। पट्टी पहले ${hiSeconds(input.surfaceActiveTime)} तक उसी दिशा में ${hiSpeed(input.surfaceRate)} जोड़ती है और फिर रुक जाती है। कुल पार करने का समय ज्ञात कीजिए।`
        : `${hiMetres(input.length)} लंबी चलती सतह पर यात्री की अपनी चाल ${hiSpeed(input.personRate)} है। सतह ${hiSpeed(input.surfaceRate)} से ${hiSeconds(input.surfaceActiveTime)} तक मदद करती है, फिर बंद हो जाती है। दूसरे सिरे तक पहुँचने का कुल समय ज्ञात कीजिए।`;
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return `एक व्यक्ति ${hiMetres(input.length)} लंबी पट्टी पर ${hiSpeed(input.personRate)} से चलना शुरू करता है। पट्टी पहले रुकी है और ${hiSeconds(input.activationDelay)} बाद उसी दिशा में ${hiSpeed(input.surfaceRate)} से चलने लगती है। कुल पार करने का समय ज्ञात कीजिए।`;
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return `एक व्यक्ति ${hiMetres(input.length)} लंबी चलती सतह पर अपनी चाल ${hiSpeed(input.personRate)} से चलता है। सतह पहले ${hiSpeed(input.surfaceRate)} से उसकी दिशा में चलती है और ${hiSeconds(input.reversalTime)} बाद दिशा बदल देती है। कुल पार करने का समय ज्ञात कीजिए।`;
      return `एक व्यक्ति ${hiMetres(input.length)} लंबी पट्टी पर अपनी चाल ${hiSpeed(input.personRate)} से चलता है। पट्टी चलने के समय ${hiSpeed(input.surfaceRate)} की अतिरिक्त चाल देती है और कुल यात्रा ${hiSeconds(input.totalTime)} में पूरी होती है। पट्टी कितने समय तक चलती रही, ज्ञात कीजिए।`;
    }
    case "twoEngineInverseState": {
      const variants = [
        `${hiEngine(caseId)} से दो स्वतंत्र समीकरण मिलते हैं। पहली अज्ञात चाल को प और दूसरी को क मानने पर समीकरण हैं: ${hiEquation(input.a1, input.b1, input.c1)} तथा ${hiEquation(input.a2, input.b2, input.c2)}। ${input.target === "X" ? "प" : "क"} की चाल ज्ञात कीजिए।`,
        `दो स्वतंत्र गति-प्रेक्षण एक ही दो अज्ञात चालों को बाँधते हैं। प और क के लिए ${hiEquation(input.a1, input.b1, input.c1)} तथा ${hiEquation(input.a2, input.b2, input.c2)} प्राप्त होते हैं। ${input.target === "X" ? "पहली" : "दूसरी"} अज्ञात चाल ज्ञात कीजिए।`,
        `${hiEngine(caseId)} दोनों आवश्यक हैं; कोई एक प्रेक्षण अकेले माँगी गई चाल नहीं देता। यदि अज्ञात चालें प और क हैं और ${hiEquation(input.a1, input.b1, input.c1)}, ${hiEquation(input.a2, input.b2, input.c2)} हैं, तो ${input.target === "X" ? "प" : "क"} ज्ञात कीजिए।`,
      ];
      return variants[i % variants.length]!;
    }
    case "feasibleParameterSetState": {
      const request = input.target === "VALID_SET" ? "शर्त पूरी करने वाली सभी अनुमत चालें लिखिए।" : "शर्त पूरी करने वाली अनुमत चालों की संख्या ज्ञात कीजिए।";
      const variants = [
        `एक वाहन को ${hiMetres(input.distance)} दूरी तय करनी है। चाल केवल ${input.minimumCandidate} से ${input.maximumCandidate} मीटर/सेकंड के बीच पूर्णांक हो सकती है। ${hiSeconds(input.fixedDelay)} की निश्चित देरी जोड़कर कुल समय ${hiSeconds(input.deadline)} से अधिक नहीं होना चाहिए। ${request}`,
        `${hiMetres(input.distance)} की यात्रा में ${hiSeconds(input.fixedDelay)} का निश्चित ठहराव भी कुल समय में शामिल है। चुनी जाने वाली चाल ${input.minimumCandidate} से ${input.maximumCandidate} मीटर/सेकंड के बीच पूर्णांक है और समय-सीमा ${hiSeconds(input.deadline)} है। ${request}`,
        `सेवा वाहन के लिए अनुमत पूर्णांक चालें ${input.minimumCandidate} से ${input.maximumCandidate} मीटर/सेकंड हैं। उसे ${hiMetres(input.distance)} दूरी और ${hiSeconds(input.fixedDelay)} की निश्चित देरी सहित ${hiSeconds(input.deadline)} के भीतर काम पूरा करना है। ${request}`,
      ];
      return variants[i % variants.length]!;
    }
  }
}

function paStem(input: TsdCp012ReviewInput, caseId: string, i: number): string {
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") return i % 2 === 0
        ? `ਇੱਕ ਵਾਹਨ ਲਗਾਤਾਰ ਇਹ ਚਾਲ-ਪੜਾਅ ਮੰਨਦਾ ਹੈ: ${paTimedPlan(input.stages)}। ਸਾਰੇ ਪੜਾਅ ਪੂਰੇ ਹੋਣ ਤੇ ਕੁੱਲ ਦੂਰੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`
        : `ਜਾਂਚ ਯਾਤਰਾ ਵਿੱਚ ਵਾਹਨ ਦੀ ਚਾਲ ਕ੍ਰਮਵਾਰ ਇਹ ਰਹਿੰਦੀ ਹੈ: ${paTimedPlan(input.stages)}। ਆਖਰੀ ਪੜਾਅ ਦੇ ਅੰਤ ਤੱਕ ਤੈਅ ਕੀਤੀ ਕੁੱਲ ਦੂਰੀ ਕੱਢੋ।`;
      if (input.target === "TOTAL_TIME") return `ਇੱਕ ਯਾਤਰੀ ਬਿਨਾਂ ਰੁਕੇ ਕ੍ਰਮਵਾਰ ${paDistancePlan(input.stages)} ਤੈਅ ਕਰਦਾ ਹੈ। ਪੂਰੀ ਯਾਤਰਾ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "UNKNOWN_FINAL_SPEED") return `ਇੱਕ ਵਾਹਨ ਪਹਿਲਾਂ ${paTimedPlan(input.priorStages)} ਤੈਅ ਕਰਦਾ ਹੈ। ਫਿਰ ਉਹ ${paSeconds(input.finalDuration)} ਲਈ ਇੱਕ ਅਣਜਾਣ ਸਥਿਰ ਚਾਲ ਨਾਲ ਚਲ ਕੇ ਕੁੱਲ ${paMetres(input.totalDistance)} ਦੂਰੀ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਆਖਰੀ ਪੜਾਅ ਦੀ ਚਾਲ ਕੱਢੋ।`;
      if (input.target === "PERIODIC_DISTANCE") return `ਇੱਕ ਵਾਹਨ ਇਹੀ ਚਾਲ-ਚੱਕਰ ਵਾਰ-ਵਾਰ ਦੁਹਰਾਉਂਦਾ ਹੈ: ${paTimedPlan(input.cycle)}। ਉਹ ${input.fullCycles} ਪੂਰੇ ਚੱਕਰ ਅਤੇ ਫਿਰ ${paTimedPlan(input.partialStages)} ਪੂਰੇ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕੱਢੋ।`;
      return `ਇੱਕ ਦੌੜਾਕ ਬਿਨਾਂ ਆਰਾਮ ਇਹ ਚਾਲ-ਚੱਕਰ ਵਾਰ-ਵਾਰ ਦੁਹਰਾਉਂਦਾ ਹੈ: ${paTimedPlan(input.cycle)}। ${paMetres(input.distance)} ਦੂਰੀ ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਹੋਣ ਦਾ ਠੀਕ ਸਮਾਂ ਕੱਢੋ।`;
    }
    case "periodicTravelRestProgramState": {
      if (input.target === "COMPLETION_TIME") return `ਇੱਕ ਵਿਅਕਤੀ ${paSpeed(input.travelSpeed)} ਦੀ ਚਾਲ ਨਾਲ ਹਰ ਵਾਰ ${paSeconds(input.travelDurationPerBlock)} ਚਲਦਾ ਹੈ, ਫਿਰ ${paSeconds(input.restDuration)} ਆਰਾਮ ਕਰਦਾ ਹੈ। ਮੰਜ਼ਿਲ ${paMetres(input.distance)} ਦੂਰ ਹੈ ਅਤੇ ਪਹੁੰਚਣ ਤੋਂ ਬਾਅਦ ਕੋਈ ਆਰਾਮ ਨਹੀਂ ਹੁੰਦਾ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "REST_COUNT") return `ਇੱਕ ਯਾਤਰੀ ਨੇ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਨੀ ਹੈ। ਉਹ ਹਰ ਚੱਲਣ ਵਾਲੇ ਪੜਾਅ ਵਿੱਚ ${paSeconds(input.travelDurationPerBlock)} ਲਈ ${paSpeed(input.travelSpeed)} ਨਾਲ ਚਲਦਾ ਹੈ ਅਤੇ ਹਰ ਪੂਰੇ ਪੜਾਅ ਤੋਂ ਬਾਅਦ, ਆਖਰੀ ਪਹੁੰਚ ਤੋਂ ਇਲਾਵਾ, ਆਰਾਮ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਆਰਾਮਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`;
      return `ਇੱਕ ਵਿਅਕਤੀ ${paMetres(input.distance)} ਦੂਰੀ ${paSpeed(input.travelSpeed)} ਦੀ ਚਾਲ ਨਾਲ, ਹਰ ਪੜਾਅ ਵਿੱਚ ${paSeconds(input.travelDurationPerBlock)} ਚਲ ਕੇ ਤੈਅ ਕਰਦਾ ਹੈ। ਵਿਚਕਾਰਲੇ ਸਾਰੇ ਆਰਾਮ ਬਰਾਬਰ ਹਨ ਅਤੇ ਪੂਰੀ ਯਾਤਰਾ ${paSeconds(input.totalElapsedTime)} ਵਿੱਚ ਮੁੱਕਦੀ ਹੈ। ਇੱਕ ਆਰਾਮ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
    }
    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") return `ਇੱਕ ਵਾਹਨ ${paMetres(input.completedDistance)} ਦੂਰੀ ${paSeconds(input.elapsedTime)} ਵਿੱਚ ਤੈਅ ਕਰ ਚੁੱਕਾ ਹੈ। ਕੁੱਲ ਦੂਰੀ ${paMetres(input.totalDistance)} ਹੈ ਅਤੇ ਪੂਰੀ ਯਾਤਰਾ ${paSeconds(input.deadline)} ਦੇ ਅੰਦਰ ਪੂਰੀ ਕਰਨੀ ਹੈ। ਬਾਕੀ ਦੂਰੀ ਲਈ ਲੋੜੀਂਦੀ ਸਥਿਰ ਚਾਲ ਕੱਢੋ।`;
      if (input.target === "REQUIRED_FINAL_TIME") return `ਇੱਕ ਯਾਤਰੀ ${paMetres(input.totalDistance)} ਦੀ ਯਾਤਰਾ ਵਿੱਚ ${paMetres(input.completedDistance)} ਦੂਰੀ ${paSeconds(input.elapsedTime)} ਵਿੱਚ ਤੈਅ ਕਰ ਚੁੱਕਾ ਹੈ। ਬਾਕੀ ਦੂਰੀ ${paSpeed(input.finalSpeed)} ਨਾਲ ਤੈਅ ਹੋਵੇਗੀ। ਆਖਰੀ ਪੜਾਅ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "STAGE_BOUNDARY_DISTANCE") return `${paMetres(input.totalDistance)} ਦੀ ਯਾਤਰਾ ਕੁੱਲ ${paSeconds(input.totalTime)} ਵਿੱਚ ਪੂਰੀ ਹੁੰਦੀ ਹੈ। ਪਹਿਲੇ ਭਾਗ ਵਿੱਚ ਚਾਲ ${paSpeed(input.firstSpeed)} ਅਤੇ ਬਾਕੀ ਭਾਗ ਵਿੱਚ ${paSpeed(input.secondSpeed)} ਹੈ। ਚਾਲ ਬਦਲਣ ਵਾਲਾ ਬਿੰਦੂ ਸ਼ੁਰੂ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ ਤੇ ਹੈ?`;
      if (input.target === "MAXIMUM_DELAY") return `ਇੱਕ ਵਾਹਨ ਨੇ ${paMetres(input.distance)} ਦੂਰੀ ${paSpeed(input.speed)} ਨਾਲ ਤੈਅ ਕਰਨੀ ਹੈ ਅਤੇ ਹੁਣ ਤੋਂ ${paSeconds(input.arrivalDeadline)} ਦੇ ਅੰਦਰ ਪਹੁੰਚਣਾ ਹੈ। ਰਵਾਨਗੀ ਵਿੱਚ ਵੱਧ ਤੋਂ ਵੱਧ ਕਿੰਨੀ ਦੇਰੀ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ?`;
      if (input.target === "MINIMUM_SPEED") return `${paMetres(input.distance)} ਦੀ ਯਾਤਰਾ ਵੱਧ ਤੋਂ ਵੱਧ ${paSeconds(input.availableTime)} ਵਿੱਚ ਪੂਰੀ ਕਰਨੀ ਹੈ। ਪੂਰੀ ਦੂਰੀ ਇੱਕੋ ਸਥਿਰ ਚਾਲ ਨਾਲ ਤੈਅ ਕੀਤੀ ਜਾਵੇ ਤਾਂ ਘੱਟੋ-ਘੱਟ ਲੋੜੀਂਦੀ ਚਾਲ ਕੱਢੋ।`;
      return `ਇੱਕ ਵਾਹਨ ਦੀ ਕੁੱਲ ਯੋਜਿਤ ਦੂਰੀ ${paMetres(input.totalDistance)} ਹੈ। ਉਹ ਪਹਿਲਾਂ ਹੀ ਇਹ ਚਾਲ-ਪੜਾਅ ਪੂਰੇ ਕਰ ਚੁੱਕਾ ਹੈ: ${paTimedPlan(input.completedStages)}। ਹੁਣ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੈ?`;
    }
    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") return i % 2 === 0
        ? `ਇੱਕ ਰਸਤੇ ਦੇ ਵੱਖ-ਵੱਖ ਖੰਡਾਂ ਤੇ ਚਾਲ ਵੱਖਰੀ ਹੈ: ${paDistancePlan(input.segments)}। ਪੂਰਾ ਰਸਤਾ ਤੈਅ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`
        : `ਸੇਵਾ ਵਾਹਨ ਇਸ ਨਿਸ਼ਚਿਤ ਰਸਤਾ-ਕ੍ਰਮ ਨਾਲ ਚਲਦਾ ਹੈ: ${paDistancePlan(input.segments)}। ਚਾਲ ਸਿਰਫ਼ ਦਿੱਤੀਆਂ ਹੱਦਾਂ ਤੇ ਬਦਲਦੀ ਹੈ। ਕੁੱਲ ਯਾਤਰਾ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "DISTANCE_SPLIT_A") return `${paMetres(input.totalDistance)} ਦੀ ਯਾਤਰਾ ${paSeconds(input.totalTime)} ਵਿੱਚ ਪੂਰੀ ਹੁੰਦੀ ਹੈ। ਕੁਝ ਦੂਰੀ ${paSpeed(input.speedA)} ਅਤੇ ਬਾਕੀ ${paSpeed(input.speedB)} ਨਾਲ ਤੈਅ ਹੁੰਦੀ ਹੈ। ${paSpeed(input.speedA)} ਨਾਲ ਤੈਅ ਦੂਰੀ ਕੱਢੋ।`;
      if (input.target === "FASTEST_ROUTE_INDEX") return `ਤਿੰਨ ਪੂਰੇ ਰਸਤੇ ਉਪਲਬਧ ਹਨ। ਰਸਤਾ 1: ${paRoute(input.routes[0]!)}। ਰਸਤਾ 2: ${paRoute(input.routes[1]!)}। ਰਸਤਾ 3: ${paRoute(input.routes[2]!)}। ਸਭ ਤੋਂ ਘੱਟ ਸਮਾਂ ਲੈਣ ਵਾਲਾ ਰਸਤਾ ਚੁਣੋ।`;
      if (input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") return `ਇੱਕੋ ਸ਼ੁਰੂ ਅਤੇ ਅੰਤ ਵਿਚਕਾਰ ਦੋ ਰਸਤੇ ਹਨ। ਰਸਤਾ ਕ: ${paRoute(input.routeA)}। ਰਸਤਾ ਖ: ${paRoute(input.routeB)}। ਦੋਨਾਂ ਦੇ ਯਾਤਰਾ ਸਮੇਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`;
      return `ਦੋ ਦੌੜਾਕ ਇੱਕ ਆਇਤਾਕਾਰ ਬੰਦ ਰਸਤੇ ਦੇ ਇੱਕੋ ਕੋਨੇ ਤੋਂ ਇਕੱਠੇ ਉਲਟ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਚਲਦੇ ਹਨ। ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਾਲਾ ਕ੍ਰਮ: ${paDistancePlan(input.clockwiseSegments)}। ਉਲਟ ਦਿਸ਼ਾ ਵਾਲਾ ਕ੍ਰਮ: ${paDistancePlan(input.counterclockwiseSegments)}। ਚਾਲ ਸਿਰਫ਼ ਕੋਨਿਆਂ ਤੇ ਬਦਲਦੀ ਹੈ। ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
    }
    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return `ਇੱਕ ਯਾਤਰਾ ਕੁੱਲ ${paMetres(input.totalDistance)} ਦੀ ਹੈ। ਦਰਜ ਪੜਾਅ-ਦੂਰੀਆਂ ${input.knownDistances.map(paMetres).join(", ")} ਹਨ ਅਤੇ ਇੱਕ ਪੜਾਅ ਦੀ ਦੂਰੀ ਗੁੰਮ ਹੈ। ਗੁੰਮ ਦੂਰੀ ਕੱਢੋ।`;
      if (input.target === "MISSING_TIME") return `ਪੂਰੀ ਯਾਤਰਾ ${paSeconds(input.totalTime)} ਦੀ ਹੈ। ਦਰਜ ਪੜਾਅ-ਸਮੇਂ ${input.knownTimes.map(paSeconds).join(", ")} ਹਨ ਅਤੇ ਇੱਕ ਸਮਾਂ ਦਰਜ ਨਹੀਂ ਹੋਇਆ। ਗੁੰਮ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "MISSING_SPEED") return `ਯਾਤਰਾ-ਸਾਰਣੀ ਦੀ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ${paMetres(input.missingDistance)} ਦੂਰੀ ${paSeconds(input.missingTime)} ਵਿੱਚ ਤੈਅ ਕੀਤੀ ਗਈ ਹੈ, ਪਰ ਚਾਲ ਦਾ ਮੁੱਲ ਨਹੀਂ ਦਿੱਤਾ। ਅਣਜਾਣ ਚਾਲ ਕੱਢੋ।`;
      return `ਦੋ ਪੜਾਵਾਂ ਦੀ ਯਾਤਰਾ ${paMetres(input.totalDistance)} ਦੂਰੀ ${paSeconds(input.totalTime)} ਵਿੱਚ ਪੂਰੀ ਹੁੰਦੀ ਹੈ। ਜਾਣੇ ਪੜਾਅ ਵਿੱਚ ${paMetres(input.knownStage.distance)} ਦੂਰੀ ${paSpeed(input.knownStage.speed)} ਨਾਲ ਤੈਅ ਹੁੰਦੀ ਹੈ ਅਤੇ ਦੂਜੇ ਪੜਾਅ ਦੀ ਚਾਲ ${paSpeed(input.missingSpeed)} ਹੈ। ਦੂਜੇ ਪੜਾਅ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
    }
    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return i % 3 === 0
        ? `ਦੋ ਰੇਲਗੱਡੀਆਂ ${paMetres(input.stationDistance)} ਦੂਰ ਸਟੇਸ਼ਨਾਂ ਤੋਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚਲਦੀਆਂ ਹਨ। ਪਹਿਲੀ ਗੱਡੀ ${paSpeed(input.speedA)} ਨਾਲ ਪਹਿਲਾਂ ਚਲਦੀ ਹੈ ਅਤੇ ਦੂਜੀ ${paSeconds(input.delayB)} ਬਾਅਦ ${paSpeed(input.speedB)} ਨਾਲ ਚਲਦੀ ਹੈ। ਪਹਿਲੀ ਗੱਡੀ ਦੀ ਰਵਾਨਗੀ ਤੋਂ ਮੁਲਾਕਾਤ ਤੱਕ ਦਾ ਸਮਾਂ ਕੱਢੋ।`
        : `ਪਹਿਲੀ ਰੇਲਗੱਡੀ ${paSpeed(input.speedA)} ਨਾਲ ਚਲਦੀ ਹੈ। ${paMetres(input.stationDistance)} ਦੂਰ ਦੂਜੇ ਸਟੇਸ਼ਨ ਤੋਂ ਦੂਜੀ ਗੱਡੀ ${paSeconds(input.delayB)} ਬਾਅਦ ${paSpeed(input.speedB)} ਨਾਲ ਉਸ ਵੱਲ ਚਲਦੀ ਹੈ। ਪਹਿਲੀ ਗੱਡੀ ਦੇ ਚੱਲਣ ਤੋਂ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਉਹ ਮਿਲਣਗੀਆਂ?`;
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") return `ਦੋ ਰੇਲਗੱਡੀਆਂ ਦੇ ਅੱਗਲੇ ਸਿਰਿਆਂ ਵਿਚਕਾਰ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${paMetres(input.initialGap)} ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ${paMetres(input.lengthA)} ਅਤੇ ${paMetres(input.lengthB)} ਹਨ। ਪਹਿਲੀ ਗੱਡੀ ${paSpeed(input.speedA)} ਨਾਲ ਤੁਰੰਤ ਚਲਦੀ ਹੈ, ਦੂਜੀ ${paSeconds(input.delayB)} ਬਾਅਦ ${paSpeed(input.speedB)} ਨਾਲ ਸਾਹਮਣੇ ਵੱਲ ਚਲਦੀ ਹੈ। ਪਹਿਲੀ ਗੱਡੀ ਦੇ ਚੱਲਣ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਹੋਣ ਤੱਕ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
      return `ਦੋ ਰੇਲਗੱਡੀਆਂ ${paMetres(input.stationDistance)} ਦੂਰ ਹਨ ਅਤੇ ਇੱਕ-ਦੂਜੇ ਵੱਲ ${paSpeed(input.speedA)} ਅਤੇ ${paSpeed(input.speedB)} ਨਾਲ ਚਲਦੀਆਂ ਹਨ। ਪਹਿਲੀ ਗੱਡੀ ਤੁਰੰਤ ਚਲਦੀ ਹੈ, ਦੂਜੀ ਬਾਅਦ ਵਿੱਚ। ਉਹ ਪਹਿਲੀ ਗੱਡੀ ਦੀ ਰਵਾਨਗੀ ਤੋਂ ${paSeconds(input.meetingTimeFromFirstDeparture)} ਬਾਅਦ ਮਿਲਦੀਆਂ ਹਨ। ਦੂਜੀ ਗੱਡੀ ਦੀ ਦੇਰੀ ਕੱਢੋ।`;
    }
    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return `ਇੱਕ ਬੇੜਾ ${paSpeed(input.currentSpeed)} ਦੀ ਧਾਰਾ ਨਾਲ ਵਗਦਾ ਹੈ। ਉਸੇ ਥਾਂ ਤੋਂ ${paSpeed(input.boatStillWaterSpeed)} ਦੀ ਠਹਿਰੇ ਪਾਣੀ ਵਾਲੀ ਚਾਲ ਰੱਖਣ ਵਾਲੀ ਕਿਸ਼ਤੀ ${paSeconds(input.boatStartDelay)} ਬਾਅਦ ਹੇਠਾਂ ਵੱਲ ਚਲਦੀ ਹੈ। ਬੇੜੇ ਦੇ ਚੱਲਣ ਤੋਂ ਫੜੇ ਜਾਣ ਤੱਕ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") return `ਇੱਕ ਬੇੜਾ ${paSpeed(input.currentSpeed)} ਦੀ ਧਾਰਾ ਨਾਲ ਵਗਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${paSeconds(input.boatStartDelay)} ਬਾਅਦ ਉਸੇ ਥਾਂ ਤੋਂ ${paSpeed(input.boatStillWaterSpeed)} ਦੀ ਠਹਿਰੇ ਪਾਣੀ ਵਾਲੀ ਚਾਲ ਵਾਲੀ ਕਿਸ਼ਤੀ ਹੇਠਾਂ ਵੱਲ ਪਿੱਛਾ ਕਰਦੀ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਥਾਂ ਤੋਂ ਫੜੇ ਜਾਣ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
      if (input.target === "CURRENT_SPEED") return `ਇੱਕ ਬੇੜਾ ਵਗਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${paSpeed(input.boatStillWaterSpeed)} ਦੀ ਠਹਿਰੇ ਪਾਣੀ ਵਾਲੀ ਚਾਲ ਵਾਲੀ ਕਿਸ਼ਤੀ ${paSeconds(input.boatStartDelay)} ਬਾਅਦ ਉਸੇ ਥਾਂ ਤੋਂ ਹੇਠਾਂ ਵੱਲ ਚਲਦੀ ਹੈ ਅਤੇ ਬੇੜੇ ਨੂੰ ਉਸ ਦੇ ਚੱਲਣ ਤੋਂ ${paSeconds(input.catchTimeFromRaftStart)} ਬਾਅਦ ਫੜਦੀ ਹੈ। ਧਾਰਾ ਦੀ ਚਾਲ ਕੱਢੋ।`;
      return `ਧਾਰਾ ਵਿੱਚ ਚੱਲਦੀ ਕਿਸ਼ਤੀ ਤੋਂ ਇੱਕ ਤੈਰਦੀ ਵਸਤੂ ਡਿੱਗ ਜਾਂਦੀ ਹੈ। ਧਾਰਾ ਦੀ ਚਾਲ ${paSpeed(input.currentSpeed)} ਹੈ। ${paSeconds(input.detectionDelay)} ਬਾਅਦ ਪਤਾ ਲੱਗਦਾ ਹੈ ਅਤੇ ${paSpeed(input.boatStillWaterSpeed)} ਦੀ ਠਹਿਰੇ ਪਾਣੀ ਵਾਲੀ ਚਾਲ ਵਾਲੀ ਕਿਸ਼ਤੀ ਤੁਰੰਤ ਮੁੜਦੀ ਹੈ। ਫੜਨ ਵੇਲੇ ਵਸਤੂ ਡਿੱਗਣ ਵਾਲੀ ਥਾਂ ਤੋਂ ਕਿੰਨੀ ਹੇਠਾਂ ਪਹੁੰਚ ਚੁੱਕੀ ਹੋਵੇਗੀ?`;
    }
    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") return i % 3 === 0
        ? `${paMetres(input.trackLength)} ਲੰਬੇ ਗੋਲ ਪੱਥ ਤੇ ${input.raceLaps} ਚੱਕਰਾਂ ਦੀ ਦੌੜ ਹੈ। ਤੇਜ਼ ਦੌੜਾਕ ${paSpeed(input.fasterSpeed)} ਨਾਲ ਅਤੇ ਹੌਲਾ ਦੌੜਾਕ ${paSpeed(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ; ਹੌਲੇ ਨੂੰ ${paMetres(input.slowerHeadStart)} ਦੀ ਅਗਵਾਈ ਮਿਲੀ ਹੈ। ਤੇਜ਼ ਦੌੜਾਕ ਦੇ ਮੁਕਾਉਂਦੇ ਹੀ ਹੌਲੇ ਨੂੰ ਅੰਤ ਤੱਕ ਕਿੰਨੀ ਦੂਰੀ ਹੋਰ ਤੈਅ ਕਰਨੀ ਹੈ?`
        : `${input.raceLaps} ਚੱਕਰਾਂ ਦੀ ਦੌੜ ${paMetres(input.trackLength)} ਦੇ ਗੋਲ ਪੱਥ ਤੇ ਹੁੰਦੀ ਹੈ। ਚਾਲਾਂ ${paSpeed(input.fasterSpeed)} ਅਤੇ ${paSpeed(input.slowerSpeed)} ਹਨ ਅਤੇ ਹੌਲੇ ਦੌੜਾਕ ਨੂੰ ${paMetres(input.slowerHeadStart)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਗਿਆ ਹੈ। ਤੇਜ਼ ਦੌੜਾਕ ਦੇ ਅੰਤ ਬਿੰਦੂ ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ਹੌਲੇ ਦੀ ਬਾਕੀ ਦੂਰੀ ਕੱਢੋ।`;
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") return `${paMetres(input.trackLength)} ਦੇ ਗੋਲ ਪੱਥ ਤੇ ${input.raceLaps} ਚੱਕਰਾਂ ਦੀ ਦੌੜ ਵਿੱਚ ਚਾਲਾਂ ${paSpeed(input.fasterSpeed)} ਅਤੇ ${paSpeed(input.slowerSpeed)} ਹਨ। ਦੋਨਾਂ ਨੂੰ ਇਕੱਠੇ ਸਮਾਪਤ ਕਰਵਾਉਣ ਲਈ ਹੌਲੇ ਦੌੜਾਕ ਨੂੰ ਕਿੰਨੀ ਸ਼ੁਰੂਆਤੀ ਅਗਵਾਈ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?`;
      return `${paMetres(input.trackLength)} ਲੰਬੇ ਗੋਲ ਪੱਥ ਤੇ ਤੇਜ਼ ਦੌੜਾਕ ${paSpeed(input.fasterSpeed)} ਅਤੇ ਹੌਲਾ ਦੌੜਾਕ ${paSpeed(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਹੌਲਾ ਦੌੜਾਕ ${paMetres(input.slowerHeadStart)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਤੇਜ਼ ਦੌੜਾਕ ਪਹਿਲੀ ਵਾਰ ਉਸਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਪਾਰ ਕਰੇਗਾ?`;
    }
    case "movingSurfaceScheduleSynthesisState": {
      if (input.target === "TIME_WITH_STOP_AFTER") return i % 2 === 0
        ? `ਇੱਕ ਵਿਅਕਤੀ ${paMetres(input.length)} ਲੰਬੀ ਚੱਲਦੀ ਪੱਟੀ ਤੇ ਪੱਟੀ ਦੇ ਸਬੰਧ ਵਿੱਚ ${paSpeed(input.personRate)} ਨਾਲ ਚਲਦਾ ਹੈ। ਪੱਟੀ ਪਹਿਲੇ ${paSeconds(input.surfaceActiveTime)} ਤੱਕ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${paSpeed(input.surfaceRate)} ਜੋੜਦੀ ਹੈ ਅਤੇ ਫਿਰ ਰੁਕ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।`
        : `${paMetres(input.length)} ਲੰਬੀ ਚੱਲਦੀ ਸਤਹ ਤੇ ਯਾਤਰੀ ਦੀ ਆਪਣੀ ਚਾਲ ${paSpeed(input.personRate)} ਹੈ। ਸਤਹ ${paSpeed(input.surfaceRate)} ਨਾਲ ${paSeconds(input.surfaceActiveTime)} ਤੱਕ ਮਦਦ ਕਰਦੀ ਹੈ, ਫਿਰ ਬੰਦ ਹੋ ਜਾਂਦੀ ਹੈ। ਦੂਜੇ ਸਿਰੇ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return `ਇੱਕ ਵਿਅਕਤੀ ${paMetres(input.length)} ਲੰਬੀ ਪੱਟੀ ਤੇ ${paSpeed(input.personRate)} ਨਾਲ ਚਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਪੱਟੀ ਪਹਿਲਾਂ ਰੁਕੀ ਹੈ ਅਤੇ ${paSeconds(input.activationDelay)} ਬਾਅਦ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${paSpeed(input.surfaceRate)} ਨਾਲ ਚਲਣ ਲੱਗਦੀ ਹੈ। ਕੁੱਲ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return `ਇੱਕ ਵਿਅਕਤੀ ${paMetres(input.length)} ਲੰਬੀ ਚੱਲਦੀ ਸਤਹ ਤੇ ਆਪਣੀ ਚਾਲ ${paSpeed(input.personRate)} ਨਾਲ ਚਲਦਾ ਹੈ। ਸਤਹ ਪਹਿਲਾਂ ${paSpeed(input.surfaceRate)} ਨਾਲ ਉਸ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚਲਦੀ ਹੈ ਅਤੇ ${paSeconds(input.reversalTime)} ਬਾਅਦ ਦਿਸ਼ਾ ਬਦਲ ਲੈਂਦੀ ਹੈ। ਕੁੱਲ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
      return `ਇੱਕ ਵਿਅਕਤੀ ${paMetres(input.length)} ਲੰਬੀ ਪੱਟੀ ਤੇ ਆਪਣੀ ਚਾਲ ${paSpeed(input.personRate)} ਨਾਲ ਚਲਦਾ ਹੈ। ਪੱਟੀ ਚੱਲਣ ਵੇਲੇ ${paSpeed(input.surfaceRate)} ਦੀ ਵਾਧੂ ਚਾਲ ਦਿੰਦੀ ਹੈ ਅਤੇ ਕੁੱਲ ਯਾਤਰਾ ${paSeconds(input.totalTime)} ਵਿੱਚ ਪੂਰੀ ਹੁੰਦੀ ਹੈ। ਪੱਟੀ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਚੱਲਦੀ ਰਹੀ, ਕੱਢੋ।`;
    }
    case "twoEngineInverseState": {
      const variants = [
        `${paEngine(caseId)} ਤੋਂ ਦੋ ਸੁਤੰਤਰ ਸਮੀਕਰਨ ਮਿਲਦੇ ਹਨ। ਪਹਿਲੀ ਅਣਜਾਣ ਚਾਲ ਨੂੰ ਪ ਅਤੇ ਦੂਜੀ ਨੂੰ ਕ ਮੰਨਣ ਤੇ ਸਮੀਕਰਨ ਹਨ: ${paEquation(input.a1, input.b1, input.c1)} ਅਤੇ ${paEquation(input.a2, input.b2, input.c2)}। ${input.target === "X" ? "ਪ" : "ਕ"} ਦੀ ਚਾਲ ਕੱਢੋ।`,
        `ਦੋ ਸੁਤੰਤਰ ਗਤੀ-ਨਿਰੀਖਣ ਇੱਕੋ ਦੋ ਅਣਜਾਣ ਚਾਲਾਂ ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਦੇ ਹਨ। ਪ ਅਤੇ ਕ ਲਈ ${paEquation(input.a1, input.b1, input.c1)} ਅਤੇ ${paEquation(input.a2, input.b2, input.c2)} ਮਿਲਦੇ ਹਨ। ${input.target === "X" ? "ਪਹਿਲੀ" : "ਦੂਜੀ"} ਅਣਜਾਣ ਚਾਲ ਕੱਢੋ।`,
        `${paEngine(caseId)} ਦੋਵੇਂ ਲਾਜ਼ਮੀ ਹਨ; ਕੋਈ ਇੱਕ ਨਿਰੀਖਣ ਇਕੱਲਾ ਮੰਗੀ ਚਾਲ ਨਹੀਂ ਦਿੰਦਾ। ਜੇ ਅਣਜਾਣ ਚਾਲਾਂ ਪ ਅਤੇ ਕ ਹਨ ਅਤੇ ${paEquation(input.a1, input.b1, input.c1)}, ${paEquation(input.a2, input.b2, input.c2)} ਹਨ, ਤਾਂ ${input.target === "X" ? "ਪ" : "ਕ"} ਕੱਢੋ।`,
      ];
      return variants[i % variants.length]!;
    }
    case "feasibleParameterSetState": {
      const request = input.target === "VALID_SET" ? "ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਸਾਰੀਆਂ ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਲਿਖੋ।" : "ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।";
      const variants = [
        `ਇੱਕ ਵਾਹਨ ਨੇ ${paMetres(input.distance)} ਦੂਰੀ ਤੈਅ ਕਰਨੀ ਹੈ। ਚਾਲ ਸਿਰਫ਼ ${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਮੀਟਰ/ਸਕਿੰਟ ਵਿਚਕਾਰ ਪੂਰਨ ਅੰਕ ਹੋ ਸਕਦੀ ਹੈ। ${paSeconds(input.fixedDelay)} ਦੀ ਨਿਸ਼ਚਿਤ ਦੇਰੀ ਜੋੜ ਕੇ ਕੁੱਲ ਸਮਾਂ ${paSeconds(input.deadline)} ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ। ${request}`,
        `${paMetres(input.distance)} ਦੀ ਯਾਤਰਾ ਵਿੱਚ ${paSeconds(input.fixedDelay)} ਦਾ ਨਿਸ਼ਚਿਤ ਠਹਿਰਾਅ ਵੀ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੈ। ਚੁਣੀ ਜਾਣ ਵਾਲੀ ਚਾਲ ${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਮੀਟਰ/ਸਕਿੰਟ ਵਿਚਕਾਰ ਪੂਰਨ ਅੰਕ ਹੈ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ${paSeconds(input.deadline)} ਹੈ। ${request}`,
        `ਸੇਵਾ ਵਾਹਨ ਲਈ ਮਨਜ਼ੂਰ ਪੂਰਨ ਅੰਕ ਚਾਲਾਂ ${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਮੀਟਰ/ਸਕਿੰਟ ਹਨ। ਉਸ ਨੇ ${paMetres(input.distance)} ਦੂਰੀ ਅਤੇ ${paSeconds(input.fixedDelay)} ਦੀ ਨਿਸ਼ਚਿਤ ਦੇਰੀ ਸਮੇਤ ${paSeconds(input.deadline)} ਦੇ ਅੰਦਰ ਕੰਮ ਪੂਰਾ ਕਰਨਾ ਹੈ। ${request}`,
      ];
      return variants[i % variants.length]!;
    }
  }
}

function hiExplanation(input: TsdCp012ReviewInput, solution: TsdCp012ExecutableSolution): readonly string[] {
  const answer = hiAnswer(solution);
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") return Object.freeze([`हर चरण की दूरी चाल × समय से मिलती है; दिए चरण ${hiTimedPlan(input.stages)} हैं।`, `सभी चरण-दूरियों को जोड़ने पर कुल दूरी ${answer} मिलती है।`]);
      if (input.target === "TOTAL_TIME") return Object.freeze([`हर खंड का समय दूरी ÷ चाल से निकलेगा; दिए खंड ${hiDistancePlan(input.stages)} हैं।`, `सभी खंडों के समय जोड़ने पर कुल समय ${answer} मिलता है।`]);
      if (input.target === "UNKNOWN_FINAL_SPEED") return Object.freeze([`पहले चरणों की दूरी चाल × समय से निकालकर ${hiMetres(input.totalDistance)} में से घटाने पर अंतिम चरण की दूरी मिलती है।`, `उस शेष दूरी को ${hiSeconds(input.finalDuration)} से भाग देने पर अंतिम चाल ${answer} मिलती है।`]);
      if (input.target === "PERIODIC_DISTANCE") return Object.freeze([`एक पूरे चक्र की दूरी में ${hiTimedPlan(input.cycle)} के सभी चरणों की दूरियाँ जुड़ती हैं।`, `${input.fullCycles} पूरे चक्रों और अंतिम आंशिक चरणों की दूरी जोड़ने पर ${answer} मिलता है।`]);
      return Object.freeze([`एक पूरे चाल-चक्र की दूरी और समय पहले निकालते हैं, फिर लक्ष्य ${hiMetres(input.distance)} तक पूरे चक्र गिनते हैं।`, `अंतिम अधूरे चरण में बची दूरी को उस चरण की चाल से भाग देने पर कुल समय ${answer} मिलता है।`]);
    }
    case "periodicTravelRestProgramState": {
      const blockDistance = multiply(input.travelSpeed, input.travelDurationPerBlock);
      if (input.target === "REST_COUNT") return Object.freeze([`हर चाल-खंड में ${hiMetres(blockDistance)} दूरी तय होती है और अंतिम पहुँच के बाद विश्राम नहीं गिना जाता।`, `लक्ष्य दूरी तक आवश्यक पूरे चाल-खंडों के बीच आने वाले विश्रामों की संख्या ${answer} है।`]);
      if (input.target === "COMPLETION_TIME") return Object.freeze([`चलने का कुल समय दूरी ÷ चाल से मिलता है और ${hiMetres(blockDistance)} के हर पूरे मध्य खंड के बाद ही विश्राम जुड़ता है।`, `चलने के समय में सभी आवश्यक विश्राम जोड़ने पर कुल समय ${answer} मिलता है।`]);
      return Object.freeze([`पहले ${hiMetres(input.distance)} ÷ ${hiSpeed(input.travelSpeed)} से शुद्ध चलने का समय निकालते हैं और उसे कुल ${hiSeconds(input.totalElapsedTime)} से घटाते हैं।`, `बचा समय बीच के विश्रामों में बराबर बाँटने पर एक विश्राम ${answer} का होता है।`]);
    }
    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") return Object.freeze([`शेष दूरी ${hiMetres(input.totalDistance)} − ${hiMetres(input.completedDistance)} और शेष समय ${hiSeconds(input.deadline)} − ${hiSeconds(input.elapsedTime)} है।`, `शेष दूरी ÷ शेष समय से आवश्यक अंतिम चाल ${answer} मिलती है।`]);
      if (input.target === "REQUIRED_FINAL_TIME") return Object.freeze([`अंतिम चरण की दूरी कुल ${hiMetres(input.totalDistance)} में से पूरी ${hiMetres(input.completedDistance)} दूरी घटाकर मिलती है।`, `उस दूरी को ${hiSpeed(input.finalSpeed)} से भाग देने पर अंतिम चरण का समय ${answer} मिलता है।`]);
      if (input.target === "STAGE_BOUNDARY_DISTANCE") return Object.freeze([`यदि पहले भाग की दूरी द मानें, तो समय द ÷ ${hiSpeed(input.firstSpeed)} और शेष भाग का समय (${hiMetres(input.totalDistance)} − द) ÷ ${hiSpeed(input.secondSpeed)} होगा।`, `दोनों समय का योग ${hiSeconds(input.totalTime)} रखने पर चाल बदलने की दूरी ${answer} मिलती है।`]);
      if (input.target === "MAXIMUM_DELAY") return Object.freeze([`${hiMetres(input.distance)} दूरी को ${hiSpeed(input.speed)} से तय करने का चलने का समय पहले निकालते हैं।`, `उसे उपलब्ध ${hiSeconds(input.arrivalDeadline)} से घटाने पर अधिकतम देरी ${answer} मिलती है।`]);
      if (input.target === "MINIMUM_SPEED") return Object.freeze([`समय-सीमा पर ठीक पहुँचने की सीमा में चाल = ${hiMetres(input.distance)} ÷ ${hiSeconds(input.availableTime)} है।`, `इससे कम चाल समय-सीमा तोड़ेगी, इसलिए न्यूनतम चाल ${answer} है।`]);
      return Object.freeze([`पूरा किए चरणों की दूरियाँ चाल × समय से निकालकर जोड़ी जाती हैं।`, `उस योग को कुल ${hiMetres(input.totalDistance)} से घटाने पर शेष दूरी ${answer} मिलती है।`]);
    }
    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") return Object.freeze([`हर मार्ग-खंड का समय उसकी दूरी ÷ उसकी चाल से अलग-अलग निकालते हैं।`, `सभी खंडों के समय जोड़ने पर कुल यात्रा समय ${answer} मिलता है।`]);
      if (input.target === "DISTANCE_SPLIT_A") return Object.freeze([`पहली चाल पर दूरी द मानें, तो दूसरी चाल पर दूरी ${hiMetres(input.totalDistance)} − द होगी।`, `द/${v(input.speedA)} + (${v(input.totalDistance)} − द)/${v(input.speedB)} = ${v(input.totalTime)} हल करने पर पहली दूरी ${answer} मिलती है।`]);
      if (input.target === "FASTEST_ROUTE_INDEX") return Object.freeze([`हर पूरे मार्ग के सभी खंडों के समय दूरी ÷ चाल से जोड़कर उसका कुल समय निकालते हैं।`, `सबसे कम कुल समय वाला विकल्प ${answer} है।`]);
      if (input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") return Object.freeze([`मार्ग क और मार्ग ख के कुल समय अलग-अलग उनके खंडों से निकाले जाते हैं।`, `दो कुल समयों का निरपेक्ष अंतर ${answer} है।`]);
      return Object.freeze([`दोनों धावकों की तय दूरी को एक ही बंद मार्ग की परिधि पर जोड़ते हैं; चाल कोने पर बदलने पर नया खंड लिया जाता है।`, `पहली बार संयुक्त तय दूरी एक पूरी परिधि होने का समय ${answer} है।`]);
    }
    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return Object.freeze([`ज्ञात चरण-दूरियों को जोड़कर कुल ${hiMetres(input.totalDistance)} से घटाते हैं।`, `अंतर ही छूटी चरण-दूरी है, इसलिए उत्तर ${answer} है।`]);
      if (input.target === "MISSING_TIME") return Object.freeze([`ज्ञात चरण-समयों को जोड़कर कुल ${hiSeconds(input.totalTime)} से घटाते हैं।`, `बचा समय ही छूटा चरण-समय है, इसलिए उत्तर ${answer} है।`]);
      if (input.target === "MISSING_SPEED") return Object.freeze([`अज्ञात चाल वाले चरण में दूरी ${hiMetres(input.missingDistance)} और समय ${hiSeconds(input.missingTime)} दिया है।`, `चाल = दूरी ÷ समय से ${answer} मिलती है।`]);
      return Object.freeze([`ज्ञात चरण का समय ${hiMetres(input.knownStage.distance)} ÷ ${hiSpeed(input.knownStage.speed)} से निकालकर कुल समय से घटाते हैं।`, `बचे समय × ${hiSpeed(input.missingSpeed)} से दूसरे चरण की दूरी ${answer} मिलती है।`]);
    }
    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return Object.freeze([`दूसरी गाड़ी के चलने से पहले पहली गाड़ी ${hiSeconds(input.delayB)} तक अकेले दूरी घटाती है; उसके बाद दोनों की चालें जुड़ती हैं।`, `इस समय-संतुलन को ${hiMetres(input.stationDistance)} पर रखने से पहली गाड़ी के प्रस्थान से मुलाकात का समय ${answer} मिलता है।`]);
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") return Object.freeze([`पूर्ण पार होने के लिए आरंभिक अंतर के साथ दोनों रेलगाड़ियों की लंबाइयाँ भी बंद करनी होती हैं।`, `पहली गाड़ी द्वारा देरी में बंद की दूरी घटाकर शेष को दोनों चालों के योग से बाँटने पर कुल समय ${answer} मिलता है।`]);
      return Object.freeze([`मुलाकात समय में पहली गाड़ी पूरी अवधि चलती है, जबकि दूसरी गाड़ी अपनी प्रस्थान देरी के बाद ही चलती है।`, `दोनों तय दूरियों का योग ${hiMetres(input.stationDistance)} रखने पर दूसरी गाड़ी की देरी ${answer} मिलती है।`]);
    }
    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return Object.freeze([`बेड़ा धारा की चाल से चलता है और नाव नीचे की ओर स्थिर जल चाल + धारा की चाल से, लेकिन ${hiSeconds(input.boatStartDelay)} देर से चलती है।`, `दोनों की समान स्थान वाली समीकरण से पकड़ का समय ${answer} मिलता है।`]);
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") return Object.freeze([`पहले बेड़े और देर से चली नाव की समान स्थान वाली स्थिति से पकड़ का समय निकालते हैं।`, `उस समय × धारा की चाल से प्रारंभ से पकड़ की दूरी ${answer} मिलती है।`]);
      if (input.target === "CURRENT_SPEED") return Object.freeze([`नाव केवल पकड़ समय और ${hiSeconds(input.boatStartDelay)} के अंतर तक चलती है, जबकि बेड़ा पूरे पकड़ समय तक बहता है।`, `दोनों की दूरी बराबर रखने पर धारा की चाल ${answer} मिलती है।`]);
      return Object.freeze([`वस्तु धारा के साथ बहती रहती है; नाव के लौटने की दोनों दिशाओं में धारा का प्रभाव संतुलित होने से देरी का असर दुगना आता है।`, `वस्तु की कुल नीचे की ओर दूरी 2 × धारा की चाल × ${hiSeconds(input.detectionDelay)} = ${answer} है।`]);
    }
    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") return Object.freeze([`तेज धावक के ${input.raceLaps} चक्कर पूरे करने का समय निकालकर उसी समय धीमे धावक की बढ़त सहित स्थिति बंद पथ पर ज्ञात करते हैं।`, `उस स्थिति से समान समाप्ति बिंदु तक आगे की शेष दूरी ${answer} है।`]);
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") return Object.freeze([`तेज धावक के ${input.raceLaps} चक्कर पूरे करने का समय पहले निकालते हैं।`, `उसी समय धीमे धावक की तय दूरी को दौड़ दूरी तक पहुँचाने के लिए आवश्यक आरंभिक बढ़त ${answer} है।`]);
      return Object.freeze([`तेज और धीमे धावक की सापेक्ष चाल ${hiSpeed(subtract(input.fasterSpeed, input.slowerSpeed))} है।`, `आरंभिक बंद-पथ अंतर को इस सापेक्ष चाल से भाग देने पर पहली बार पीछे छोड़ने का समय ${answer} मिलता है।`]);
    }
    case "movingSurfaceScheduleSynthesisState": {
      if (input.target === "TIME_WITH_STOP_AFTER") return Object.freeze([`जब तक सतह चलती है, प्रभावी चाल व्यक्ति की ${hiSpeed(input.personRate)} और सतह की ${hiSpeed(input.surfaceRate)} का योग है; फिर केवल व्यक्ति की चाल रहती है।`, `दोनों समय-खंडों की दूरी ${hiMetres(input.length)} के बराबर रखने पर कुल समय ${answer} मिलता है।`]);
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return Object.freeze([`पहले ${hiSeconds(input.activationDelay)} तक केवल व्यक्ति की चाल से दूरी तय होती है, फिर व्यक्ति और सतह की चालें जुड़ती हैं।`, `पहले तय दूरी घटाकर शेष दूरी के समय को जोड़ने पर कुल समय ${answer} मिलता है।`]);
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return Object.freeze([`दिशा बदलने से पहले चालें जुड़ती हैं और बाद में सतह की चाल व्यक्ति की चाल से घटती है।`, `दोनों चरणों की कुल दूरी ${hiMetres(input.length)} रखने पर पार करने का समय ${answer} मिलता है।`]);
      return Object.freeze([`सतह जितनी देर चलती है, उतनी देर उसकी ${hiSpeed(input.surfaceRate)} की अतिरिक्त दूरी व्यक्ति की अपनी दूरी में जुड़ती है।`, `कुल ${hiMetres(input.length)} और ${hiSeconds(input.totalTime)} से चलती सतह की सक्रिय अवधि ${answer} मिलती है।`]);
    }
    case "twoEngineInverseState": return Object.freeze([`दो स्वतंत्र गति-स्थितियाँ मिलकर ${hiEquation(input.a1, input.b1, input.c1)} और ${hiEquation(input.a2, input.b2, input.c2)} देती हैं।`, `दोनों समीकरण साथ हल करने पर माँगी गई अज्ञात चाल ${answer} मिलती है।`]);
    case "feasibleParameterSetState": {
      if (solution.kind === "SET") return Object.freeze([`हर अनुमत पूर्णांक चाल के लिए चलने का समय ${hiMetres(input.distance)} ÷ चाल है और उसमें निश्चित ${hiSeconds(input.fixedDelay)} जोड़ा जाता है।`, `जो मान कुल ${hiSeconds(input.deadline)} के भीतर रहते हैं, उनका पूरा समूह ${answer} है।`]);
      return Object.freeze([`समय-सीमा पूरी करने के लिए दूरी ÷ चाल + ${hiSeconds(input.fixedDelay)} ≤ ${hiSeconds(input.deadline)} होना चाहिए।`, `${input.minimumCandidate} से ${input.maximumCandidate} तक इस शर्त को पूरा करने वाले पूर्णांक मानों की संख्या ${answer} है।`]);
    }
  }
}

function paExplanation(input: TsdCp012ReviewInput, solution: TsdCp012ExecutableSolution): readonly string[] {
  const answer = paAnswer(solution);
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") return Object.freeze([`ਹਰ ਪੜਾਅ ਦੀ ਦੂਰੀ ਚਾਲ × ਸਮਾਂ ਨਾਲ ਮਿਲਦੀ ਹੈ; ਦਿੱਤੇ ਪੜਾਅ ${paTimedPlan(input.stages)} ਹਨ।`, `ਸਾਰੇ ਪੜਾਵਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਜੋੜਨ ਤੇ ਕੁੱਲ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "TOTAL_TIME") return Object.freeze([`ਹਰ ਖੰਡ ਦਾ ਸਮਾਂ ਦੂਰੀ ÷ ਚਾਲ ਨਾਲ ਕੱਢਦੇ ਹਾਂ; ਦਿੱਤੇ ਖੰਡ ${paDistancePlan(input.stages)} ਹਨ।`, `ਸਾਰੇ ਖੰਡਾਂ ਦੇ ਸਮੇਂ ਜੋੜਨ ਤੇ ਕੁੱਲ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "UNKNOWN_FINAL_SPEED") return Object.freeze([`ਪਹਿਲੇ ਪੜਾਵਾਂ ਦੀ ਦੂਰੀ ਚਾਲ × ਸਮਾਂ ਨਾਲ ਕੱਢ ਕੇ ${paMetres(input.totalDistance)} ਵਿੱਚੋਂ ਘਟਾਉਣ ਤੇ ਆਖਰੀ ਪੜਾਅ ਦੀ ਦੂਰੀ ਮਿਲਦੀ ਹੈ।`, `ਉਸ ਬਾਕੀ ਦੂਰੀ ਨੂੰ ${paSeconds(input.finalDuration)} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਆਖਰੀ ਚਾਲ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "PERIODIC_DISTANCE") return Object.freeze([`ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦੀ ਦੂਰੀ ਵਿੱਚ ${paTimedPlan(input.cycle)} ਦੇ ਸਾਰੇ ਪੜਾਵਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।`, `${input.fullCycles} ਪੂਰੇ ਚੱਕਰਾਂ ਅਤੇ ਆਖਰੀ ਅਧੂਰੇ ਪੜਾਵਾਂ ਦੀ ਦੂਰੀ ਜੋੜਨ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      return Object.freeze([`ਇੱਕ ਪੂਰੇ ਚਾਲ-ਚੱਕਰ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮਾਂ ਪਹਿਲਾਂ ਕੱਢ ਕੇ ਟੀਚੇ ${paMetres(input.distance)} ਤੱਕ ਪੂਰੇ ਚੱਕਰ ਗਿਣਦੇ ਹਾਂ।`, `ਆਖਰੀ ਅਧੂਰੇ ਪੜਾਅ ਦੀ ਬਾਕੀ ਦੂਰੀ ਨੂੰ ਉਸ ਪੜਾਅ ਦੀ ਚਾਲ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕੁੱਲ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
    }
    case "periodicTravelRestProgramState": {
      const blockDistance = multiply(input.travelSpeed, input.travelDurationPerBlock);
      if (input.target === "REST_COUNT") return Object.freeze([`ਹਰ ਚੱਲਣ ਵਾਲੇ ਪੜਾਅ ਵਿੱਚ ${paMetres(blockDistance)} ਦੂਰੀ ਤੈਅ ਹੁੰਦੀ ਹੈ ਅਤੇ ਆਖਰੀ ਪਹੁੰਚ ਤੋਂ ਬਾਅਦ ਆਰਾਮ ਨਹੀਂ ਗਿਣਿਆ ਜਾਂਦਾ।`, `ਟੀਚੇ ਤੱਕ ਲੋੜੀਂਦੇ ਚੱਲਣ ਵਾਲੇ ਪੜਾਵਾਂ ਵਿਚਕਾਰ ਆਉਣ ਵਾਲੇ ਆਰਾਮਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`]);
      if (input.target === "COMPLETION_TIME") return Object.freeze([`ਚੱਲਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ਦੂਰੀ ÷ ਚਾਲ ਨਾਲ ਮਿਲਦਾ ਹੈ ਅਤੇ ${paMetres(blockDistance)} ਦੇ ਹਰ ਪੂਰੇ ਵਿਚਕਾਰਲੇ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਹੀ ਆਰਾਮ ਜੁੜਦਾ ਹੈ।`, `ਚੱਲਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਸਾਰੇ ਲੋੜੀਂਦੇ ਆਰਾਮ ਜੋੜਨ ਤੇ ਕੁੱਲ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      return Object.freeze([`ਪਹਿਲਾਂ ${paMetres(input.distance)} ÷ ${paSpeed(input.travelSpeed)} ਨਾਲ ਸਿਰਫ਼ ਚੱਲਣ ਦਾ ਸਮਾਂ ਕੱਢ ਕੇ ਉਸਨੂੰ ਕੁੱਲ ${paSeconds(input.totalElapsedTime)} ਵਿੱਚੋਂ ਘਟਾਉਂਦੇ ਹਾਂ।`, `ਬਚਿਆ ਸਮਾਂ ਵਿਚਕਾਰਲੇ ਆਰਾਮਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡਣ ਤੇ ਇੱਕ ਆਰਾਮ ${answer} ਦਾ ਹੁੰਦਾ ਹੈ।`]);
    }
    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") return Object.freeze([`ਬਾਕੀ ਦੂਰੀ ${paMetres(input.totalDistance)} − ${paMetres(input.completedDistance)} ਅਤੇ ਬਾਕੀ ਸਮਾਂ ${paSeconds(input.deadline)} − ${paSeconds(input.elapsedTime)} ਹੈ।`, `ਬਾਕੀ ਦੂਰੀ ÷ ਬਾਕੀ ਸਮਾਂ ਨਾਲ ਲੋੜੀਂਦੀ ਆਖਰੀ ਚਾਲ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "REQUIRED_FINAL_TIME") return Object.freeze([`ਆਖਰੀ ਪੜਾਅ ਦੀ ਦੂਰੀ ਕੁੱਲ ${paMetres(input.totalDistance)} ਵਿੱਚੋਂ ਪੂਰੀ ${paMetres(input.completedDistance)} ਦੂਰੀ ਘਟਾ ਕੇ ਮਿਲਦੀ ਹੈ।`, `ਉਸ ਦੂਰੀ ਨੂੰ ${paSpeed(input.finalSpeed)} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਆਖਰੀ ਪੜਾਅ ਦਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "STAGE_BOUNDARY_DISTANCE") return Object.freeze([`ਜੇ ਪਹਿਲੇ ਭਾਗ ਦੀ ਦੂਰੀ ਦ ਮੰਨੀਏ, ਤਾਂ ਸਮਾਂ ਦ ÷ ${paSpeed(input.firstSpeed)} ਅਤੇ ਬਾਕੀ ਭਾਗ ਦਾ ਸਮਾਂ (${paMetres(input.totalDistance)} − ਦ) ÷ ${paSpeed(input.secondSpeed)} ਹੋਵੇਗਾ।`, `ਦੋਨਾਂ ਸਮਿਆਂ ਦਾ ਜੋੜ ${paSeconds(input.totalTime)} ਰੱਖਣ ਤੇ ਚਾਲ ਬਦਲਣ ਦੀ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "MAXIMUM_DELAY") return Object.freeze([`${paMetres(input.distance)} ਦੂਰੀ ਨੂੰ ${paSpeed(input.speed)} ਨਾਲ ਤੈਅ ਕਰਨ ਦਾ ਚੱਲਣ ਸਮਾਂ ਪਹਿਲਾਂ ਕੱਢਦੇ ਹਾਂ।`, `ਉਸਨੂੰ ਉਪਲਬਧ ${paSeconds(input.arrivalDeadline)} ਵਿੱਚੋਂ ਘਟਾਉਣ ਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਦੇਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "MINIMUM_SPEED") return Object.freeze([`ਸਮਾਂ-ਸੀਮਾ ਤੇ ਠੀਕ ਪਹੁੰਚਣ ਲਈ ਚਾਲ = ${paMetres(input.distance)} ÷ ${paSeconds(input.availableTime)} ਹੈ।`, `ਇਸ ਤੋਂ ਘੱਟ ਚਾਲ ਸਮਾਂ-ਸੀਮਾ ਤੋੜੇਗੀ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਚਾਲ ${answer} ਹੈ।`]);
      return Object.freeze([`ਪੂਰੇ ਹੋਏ ਪੜਾਵਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਚਾਲ × ਸਮਾਂ ਨਾਲ ਕੱਢ ਕੇ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।`, `ਉਸ ਜੋੜ ਨੂੰ ਕੁੱਲ ${paMetres(input.totalDistance)} ਵਿੱਚੋਂ ਘਟਾਉਣ ਤੇ ਬਾਕੀ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
    }
    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") return Object.freeze([`ਹਰ ਰਸਤਾ-ਖੰਡ ਦਾ ਸਮਾਂ ਉਸ ਦੀ ਦੂਰੀ ÷ ਉਸ ਦੀ ਚਾਲ ਨਾਲ ਵੱਖਰਾ ਕੱਢਦੇ ਹਾਂ।`, `ਸਾਰੇ ਖੰਡਾਂ ਦੇ ਸਮੇਂ ਜੋੜਨ ਤੇ ਕੁੱਲ ਯਾਤਰਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "DISTANCE_SPLIT_A") return Object.freeze([`ਪਹਿਲੀ ਚਾਲ ਤੇ ਦੂਰੀ ਦ ਮੰਨੀਏ, ਤਾਂ ਦੂਜੀ ਚਾਲ ਤੇ ਦੂਰੀ ${paMetres(input.totalDistance)} − ਦ ਹੋਵੇਗੀ।`, `ਦ/${v(input.speedA)} + (${v(input.totalDistance)} − ਦ)/${v(input.speedB)} = ${v(input.totalTime)} ਹੱਲ ਕਰਨ ਤੇ ਪਹਿਲੀ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "FASTEST_ROUTE_INDEX") return Object.freeze([`ਹਰ ਪੂਰੇ ਰਸਤੇ ਦੇ ਸਾਰੇ ਖੰਡਾਂ ਦੇ ਸਮੇਂ ਦੂਰੀ ÷ ਚਾਲ ਨਾਲ ਜੋੜ ਕੇ ਕੁੱਲ ਸਮਾਂ ਕੱਢਦੇ ਹਾਂ।`, `ਸਭ ਤੋਂ ਘੱਟ ਕੁੱਲ ਸਮਾਂ ਵਾਲਾ ਵਿਕਲਪ ${answer} ਹੈ।`]);
      if (input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") return Object.freeze([`ਰਸਤਾ ਕ ਅਤੇ ਰਸਤਾ ਖ ਦੇ ਕੁੱਲ ਸਮੇਂ ਵੱਖ-ਵੱਖ ਉਨ੍ਹਾਂ ਦੇ ਖੰਡਾਂ ਤੋਂ ਕੱਢੇ ਜਾਂਦੇ ਹਨ।`, `ਦੋ ਕੁੱਲ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ${answer} ਹੈ।`]);
      return Object.freeze([`ਦੋਨਾਂ ਦੌੜਾਕਾਂ ਦੀ ਤੈਅ ਦੂਰੀ ਨੂੰ ਇੱਕੋ ਬੰਦ ਰਸਤੇ ਦੇ ਘੇਰੇ ਤੇ ਜੋੜਦੇ ਹਾਂ; ਚਾਲ ਕੋਨੇ ਤੇ ਬਦਲਣ ਨਾਲ ਨਵਾਂ ਖੰਡ ਲਿਆ ਜਾਂਦਾ ਹੈ।`, `ਪਹਿਲੀ ਵਾਰ ਮਿਲੀ ਹੋਈ ਤੈਅ ਦੂਰੀ ਇੱਕ ਪੂਰੇ ਘੇਰੇ ਦੇ ਬਰਾਬਰ ਹੋਣ ਦਾ ਸਮਾਂ ${answer} ਹੈ।`]);
    }
    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return Object.freeze([`ਜਾਣੀਆਂ ਪੜਾਅ-ਦੂਰੀਆਂ ਨੂੰ ਜੋੜ ਕੇ ਕੁੱਲ ${paMetres(input.totalDistance)} ਵਿੱਚੋਂ ਘਟਾਉਂਦੇ ਹਾਂ।`, `ਅੰਤਰ ਹੀ ਗੁੰਮ ਪੜਾਅ-ਦੂਰੀ ਹੈ, ਇਸ ਲਈ ਜਵਾਬ ${answer} ਹੈ।`]);
      if (input.target === "MISSING_TIME") return Object.freeze([`ਜਾਣੇ ਪੜਾਅ-ਸਮਿਆਂ ਨੂੰ ਜੋੜ ਕੇ ਕੁੱਲ ${paSeconds(input.totalTime)} ਵਿੱਚੋਂ ਘਟਾਉਂਦੇ ਹਾਂ।`, `ਬਚਿਆ ਸਮਾਂ ਹੀ ਗੁੰਮ ਪੜਾਅ-ਸਮਾਂ ਹੈ, ਇਸ ਲਈ ਜਵਾਬ ${answer} ਹੈ।`]);
      if (input.target === "MISSING_SPEED") return Object.freeze([`ਅਣਜਾਣ ਚਾਲ ਵਾਲੇ ਪੜਾਅ ਵਿੱਚ ਦੂਰੀ ${paMetres(input.missingDistance)} ਅਤੇ ਸਮਾਂ ${paSeconds(input.missingTime)} ਦਿੱਤਾ ਹੈ।`, `ਚਾਲ = ਦੂਰੀ ÷ ਸਮਾਂ ਨਾਲ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      return Object.freeze([`ਜਾਣੇ ਪੜਾਅ ਦਾ ਸਮਾਂ ${paMetres(input.knownStage.distance)} ÷ ${paSpeed(input.knownStage.speed)} ਨਾਲ ਕੱਢ ਕੇ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਘਟਾਉਂਦੇ ਹਾਂ।`, `ਬਚੇ ਸਮੇਂ × ${paSpeed(input.missingSpeed)} ਨਾਲ ਦੂਜੇ ਪੜਾਅ ਦੀ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
    }
    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return Object.freeze([`ਦੂਜੀ ਗੱਡੀ ਦੇ ਚੱਲਣ ਤੋਂ ਪਹਿਲਾਂ ਪਹਿਲੀ ਗੱਡੀ ${paSeconds(input.delayB)} ਤੱਕ ਇਕੱਲੀ ਦੂਰੀ ਘਟਾਉਂਦੀ ਹੈ; ਉਸ ਤੋਂ ਬਾਅਦ ਦੋਨਾਂ ਚਾਲਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।`, `ਇਸ ਸਮਾਂ-ਸੰਤੁਲਨ ਨੂੰ ${paMetres(input.stationDistance)} ਤੇ ਰੱਖਣ ਨਾਲ ਪਹਿਲੀ ਗੱਡੀ ਦੀ ਰਵਾਨਗੀ ਤੋਂ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") return Object.freeze([`ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਹੋਣ ਲਈ ਸ਼ੁਰੂਆਤੀ ਫਾਸਲੇ ਨਾਲ ਦੋਨਾਂ ਰੇਲਗੱਡੀਆਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਵੀ ਬੰਦ ਕਰਨੀ ਹੁੰਦੀਆਂ ਹਨ।`, `ਪਹਿਲੀ ਗੱਡੀ ਵੱਲੋਂ ਦੇਰੀ ਦੌਰਾਨ ਬੰਦ ਕੀਤੀ ਦੂਰੀ ਘਟਾ ਕੇ ਬਾਕੀ ਨੂੰ ਦੋਨਾਂ ਚਾਲਾਂ ਦੇ ਜੋੜ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕੁੱਲ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      return Object.freeze([`ਮੁਲਾਕਾਤ ਸਮੇਂ ਵਿੱਚ ਪਹਿਲੀ ਗੱਡੀ ਪੂਰਾ ਸਮਾਂ ਚਲਦੀ ਹੈ, ਜਦਕਿ ਦੂਜੀ ਆਪਣੀ ਰਵਾਨਗੀ ਦੀ ਦੇਰੀ ਤੋਂ ਬਾਅਦ ਹੀ ਚਲਦੀ ਹੈ।`, `ਦੋਨਾਂ ਤੈਅ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ${paMetres(input.stationDistance)} ਰੱਖਣ ਤੇ ਦੂਜੀ ਗੱਡੀ ਦੀ ਦੇਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
    }
    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return Object.freeze([`ਬੇੜਾ ਧਾਰਾ ਦੀ ਚਾਲ ਨਾਲ ਚਲਦਾ ਹੈ ਅਤੇ ਕਿਸ਼ਤੀ ਹੇਠਾਂ ਵੱਲ ਠਹਿਰੇ ਪਾਣੀ ਦੀ ਚਾਲ + ਧਾਰਾ ਦੀ ਚਾਲ ਨਾਲ, ਪਰ ${paSeconds(input.boatStartDelay)} ਦੇਰ ਨਾਲ ਚਲਦੀ ਹੈ।`, `ਦੋਨਾਂ ਦੀ ਇੱਕੋ ਥਾਂ ਵਾਲੀ ਸਮੀਕਰਨ ਤੋਂ ਫੜਨ ਦਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") return Object.freeze([`ਪਹਿਲਾਂ ਬੇੜੇ ਅਤੇ ਦੇਰ ਨਾਲ ਚੱਲੀ ਕਿਸ਼ਤੀ ਦੀ ਇੱਕੋ ਥਾਂ ਵਾਲੀ ਸਥਿਤੀ ਤੋਂ ਫੜਨ ਦਾ ਸਮਾਂ ਕੱਢਦੇ ਹਾਂ।`, `ਉਸ ਸਮੇਂ × ਧਾਰਾ ਦੀ ਚਾਲ ਨਾਲ ਸ਼ੁਰੂ ਤੋਂ ਫੜਨ ਦੀ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      if (input.target === "CURRENT_SPEED") return Object.freeze([`ਕਿਸ਼ਤੀ ਸਿਰਫ਼ ਫੜਨ ਦੇ ਸਮੇਂ ਅਤੇ ${paSeconds(input.boatStartDelay)} ਦੇ ਅੰਤਰ ਤੱਕ ਚਲਦੀ ਹੈ, ਜਦਕਿ ਬੇੜਾ ਪੂਰੇ ਫੜਨ ਸਮੇਂ ਤੱਕ ਵਗਦਾ ਹੈ।`, `ਦੋਨਾਂ ਦੀ ਦੂਰੀ ਬਰਾਬਰ ਰੱਖਣ ਤੇ ਧਾਰਾ ਦੀ ਚਾਲ ${answer} ਮਿਲਦੀ ਹੈ।`]);
      return Object.freeze([`ਵਸਤੂ ਧਾਰਾ ਨਾਲ ਵਗਦੀ ਰਹਿੰਦੀ ਹੈ; ਕਿਸ਼ਤੀ ਦੇ ਮੁੜਨ ਦੀਆਂ ਦੋਨਾਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਧਾਰਾ ਦਾ ਅਸਰ ਸੰਤੁਲਿਤ ਹੋਣ ਨਾਲ ਦੇਰੀ ਦਾ ਅਸਰ ਦੁੱਗਣਾ ਆਉਂਦਾ ਹੈ।`, `ਵਸਤੂ ਦੀ ਕੁੱਲ ਹੇਠਾਂ ਵੱਲ ਦੂਰੀ 2 × ਧਾਰਾ ਦੀ ਚਾਲ × ${paSeconds(input.detectionDelay)} = ${answer} ਹੈ।`]);
    }
    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") return Object.freeze([`ਤੇਜ਼ ਦੌੜਾਕ ਦੇ ${input.raceLaps} ਚੱਕਰ ਪੂਰੇ ਕਰਨ ਦਾ ਸਮਾਂ ਕੱਢ ਕੇ ਉਸੇ ਵੇਲੇ ਹੌਲੇ ਦੌੜਾਕ ਦੀ ਅਗਵਾਈ ਸਮੇਤ ਸਥਿਤੀ ਬੰਦ ਪੱਥ ਤੇ ਕੱਢਦੇ ਹਾਂ।`, `ਉਸ ਸਥਿਤੀ ਤੋਂ ਉਸੇ ਅੰਤ ਬਿੰਦੂ ਤੱਕ ਅੱਗੇ ਦੀ ਬਾਕੀ ਦੂਰੀ ${answer} ਹੈ।`]);
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") return Object.freeze([`ਤੇਜ਼ ਦੌੜਾਕ ਦੇ ${input.raceLaps} ਚੱਕਰ ਪੂਰੇ ਕਰਨ ਦਾ ਸਮਾਂ ਪਹਿਲਾਂ ਕੱਢਦੇ ਹਾਂ।`, `ਉਸੇ ਸਮੇਂ ਹੌਲੇ ਦੌੜਾਕ ਦੀ ਤੈਅ ਦੂਰੀ ਨੂੰ ਦੌੜ ਦੀ ਦੂਰੀ ਤੱਕ ਪਹੁੰਚਾਉਣ ਲਈ ਲੋੜੀਂਦੀ ਸ਼ੁਰੂਆਤੀ ਅਗਵਾਈ ${answer} ਹੈ।`]);
      return Object.freeze([`ਤੇਜ਼ ਅਤੇ ਹੌਲੇ ਦੌੜਾਕ ਦੀ ਸਾਪੇਖ ਚਾਲ ${paSpeed(subtract(input.fasterSpeed, input.slowerSpeed))} ਹੈ।`, `ਸ਼ੁਰੂਆਤੀ ਬੰਦ-ਪੱਥ ਫਾਸਲੇ ਨੂੰ ਇਸ ਸਾਪੇਖ ਚਾਲ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਪਹਿਲੀ ਵਾਰ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
    }
    case "movingSurfaceScheduleSynthesisState": {
      if (input.target === "TIME_WITH_STOP_AFTER") return Object.freeze([`ਜਦ ਤੱਕ ਸਤਹ ਚਲਦੀ ਹੈ, ਪ੍ਰਭਾਵੀ ਚਾਲ ਵਿਅਕਤੀ ਦੀ ${paSpeed(input.personRate)} ਅਤੇ ਸਤਹ ਦੀ ${paSpeed(input.surfaceRate)} ਦਾ ਜੋੜ ਹੈ; ਫਿਰ ਸਿਰਫ਼ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਰਹਿੰਦੀ ਹੈ।`, `ਦੋਨਾਂ ਸਮਾਂ-ਪੜਾਵਾਂ ਦੀ ਦੂਰੀ ${paMetres(input.length)} ਦੇ ਬਰਾਬਰ ਰੱਖਣ ਤੇ ਕੁੱਲ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return Object.freeze([`ਪਹਿਲੇ ${paSeconds(input.activationDelay)} ਤੱਕ ਸਿਰਫ਼ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਨਾਲ ਦੂਰੀ ਤੈਅ ਹੁੰਦੀ ਹੈ, ਫਿਰ ਵਿਅਕਤੀ ਅਤੇ ਸਤਹ ਦੀਆਂ ਚਾਲਾਂ ਜੁੜਦੀਆਂ ਹਨ।`, `ਪਹਿਲਾਂ ਤੈਅ ਦੂਰੀ ਘਟਾ ਕੇ ਬਾਕੀ ਦੂਰੀ ਦੇ ਸਮੇਂ ਨੂੰ ਜੋੜਨ ਤੇ ਕੁੱਲ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return Object.freeze([`ਦਿਸ਼ਾ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਚਾਲਾਂ ਜੁੜਦੀਆਂ ਹਨ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਸਤਹ ਦੀ ਚਾਲ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਵਿੱਚੋਂ ਘਟਦੀ ਹੈ।`, `ਦੋਨਾਂ ਪੜਾਵਾਂ ਦੀ ਕੁੱਲ ਦੂਰੀ ${paMetres(input.length)} ਰੱਖਣ ਤੇ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`]);
      return Object.freeze([`ਸਤਹ ਜਿੰਨੀ ਦੇਰ ਚਲਦੀ ਹੈ, ਉੱਨੀ ਦੇਰ ਉਸ ਦੀ ${paSpeed(input.surfaceRate)} ਦੀ ਵਾਧੂ ਦੂਰੀ ਵਿਅਕਤੀ ਦੀ ਆਪਣੀ ਦੂਰੀ ਵਿੱਚ ਜੁੜਦੀ ਹੈ।`, `ਕੁੱਲ ${paMetres(input.length)} ਅਤੇ ${paSeconds(input.totalTime)} ਤੋਂ ਚੱਲਦੀ ਸਤਹ ਦੀ ਸਰਗਰਮ ਮਿਆਦ ${answer} ਮਿਲਦੀ ਹੈ।`]);
    }
    case "twoEngineInverseState": return Object.freeze([`ਦੋ ਸੁਤੰਤਰ ਗਤੀ-ਸਥਿਤੀਆਂ ਮਿਲ ਕੇ ${paEquation(input.a1, input.b1, input.c1)} ਅਤੇ ${paEquation(input.a2, input.b2, input.c2)} ਦਿੰਦੀਆਂ ਹਨ।`, `ਦੋਨਾਂ ਸਮੀਕਰਨਾਂ ਨੂੰ ਇਕੱਠੇ ਹੱਲ ਕਰਨ ਤੇ ਮੰਗੀ ਅਣਜਾਣ ਚਾਲ ${answer} ਮਿਲਦੀ ਹੈ।`]);
    case "feasibleParameterSetState": {
      if (solution.kind === "SET") return Object.freeze([`ਹਰ ਮਨਜ਼ੂਰ ਪੂਰਨ ਅੰਕ ਚਾਲ ਲਈ ਚੱਲਣ ਦਾ ਸਮਾਂ ${paMetres(input.distance)} ÷ ਚਾਲ ਹੈ ਅਤੇ ਉਸ ਵਿੱਚ ਨਿਸ਼ਚਿਤ ${paSeconds(input.fixedDelay)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।`, `ਜੋ ਮੁੱਲ ਕੁੱਲ ${paSeconds(input.deadline)} ਦੇ ਅੰਦਰ ਰਹਿੰਦੇ ਹਨ, ਉਨ੍ਹਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ${answer} ਹੈ।`]);
      return Object.freeze([`ਸਮਾਂ-ਸੀਮਾ ਪੂਰੀ ਕਰਨ ਲਈ ਦੂਰੀ ÷ ਚਾਲ + ${paSeconds(input.fixedDelay)} ≤ ${paSeconds(input.deadline)} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`, `${input.minimumCandidate} ਤੋਂ ${input.maximumCandidate} ਤੱਕ ਇਸ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਪੂਰਨ ਅੰਕ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`]);
    }
  }
}

function localized(question: TsdCp012EnglishReviewQuestion, language: TsdCp012NativeLanguage): TsdCp012NativeReviewQuestion {
  const i = idx(question.familyId);
  const steps = language === "hi" ? hiExplanation(question.input, question.solution) : paExplanation(question.input, question.solution);
  return Object.freeze({
    ...question,
    stem: language === "hi" ? hiStem(question.input, question.caseId, i) : paStem(question.input, question.caseId, i),
    explanation: Object.freeze({
      steps,
      conclusion: language === "hi" ? `उत्तर: ${hiAnswer(question.solution)}।` : `ਜਵਾਬ: ${paAnswer(question.solution)}।`,
    }),
  });
}

export const TSD_CP012_NATIVE_HINDI_REVIEW = Object.freeze(TSD_CP012_ENGLISH_REVIEW_FINAL.map((question) => localized(question, "hi")));
export const TSD_CP012_NATIVE_PUNJABI_REVIEW = Object.freeze(TSD_CP012_ENGLISH_REVIEW_FINAL.map((question) => localized(question, "pa")));
