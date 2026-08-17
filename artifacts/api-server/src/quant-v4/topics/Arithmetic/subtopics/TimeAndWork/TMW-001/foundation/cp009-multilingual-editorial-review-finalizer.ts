import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

type Language = "en" | "hi" | "pa";
type Triplet = readonly [string, string, string];

interface RationalLike { numerator: number; denominator: number }
interface Cp009Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: string;
  parameters?: {
    originalTime?: RationalLike;
    changedTime?: RationalLike;
  };
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, text: Triplet): string {
  return language === "hi" ? text[1] : language === "pa" ? text[2] : text[0];
}

function math(value: string): string { return `\\(${value}\\)`; }

function rationalText(value?: RationalLike): string | null {
  if (!value || !Number.isInteger(value.numerator) || !Number.isInteger(value.denominator) || value.denominator === 0) return null;
  return value.denominator === 1 ? String(value.numerator) : `\\frac{${value.numerator}}{${value.denominator}}`;
}

const METHODS: Record<string, Triplet> = {
  findFillTimeFromPositiveInlets: [
    "Add the inlet rates and take the reciprocal of the combined filling rate",
    "सभी भरने वाली पाइपों की दरें जोड़ें और संयुक्त भराव दर का व्युत्क्रम लें",
    "ਸਾਰੀਆਂ ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਸਾਂਝੀ ਭਰਨ ਦਰ ਦਾ ਉਲਟ ਲਵੋ",
  ],
  findFillTimeFromMixedPipes: [
    "Add inlet rates, subtract outlet or leak rates, then invert the positive net filling rate",
    "भराव दरें जोड़ें, निकासी या रिसाव दरें घटाएँ और धनात्मक शुद्ध भराव दर का व्युत्क्रम लें",
    "ਭਰਨ ਦਰਾਂ ਜੋੜੋ, ਨਿਕਾਸੀ ਜਾਂ ਰਿਸਾਅ ਦਰਾਂ ਘਟਾਓ ਅਤੇ ਧਨਾਤਮਕ ਸ਼ੁੱਧ ਭਰਨ ਦਰ ਦਾ ਉਲਟ ਲਵੋ",
  ],
  findEmptyTimeFromMixedPipes: [
    "Form the signed net flow and divide one full tank by the magnitude of the net emptying rate",
    "भराव और निकासी दरों का सही जोड़-घटाव करें और पूरी टंकी को शुद्ध निकासी दर के परिमाण से भाग दें",
    "ਭਰਨ ਅਤੇ ਨਿਕਾਸੀ ਦਰਾਂ ਦਾ ਸਹੀ ਜੋੜ-ਘਟਾਅ ਕਰੋ ਅਤੇ ਪੂਰੀ ਟੈਂਕੀ ਨੂੰ ਸ਼ੁੱਧ ਨਿਕਾਸੀ ਦਰ ਦੀ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ",
  ],
  findNetFractionChangedInGivenTime: [
    "Find the signed net rate and multiply its magnitude by the stated running time",
    "शुद्ध भराव या निकासी दर निकालें और उसके परिमाण को दिए समय से गुणा करें",
    "ਸ਼ੁੱਧ ਭਰਨ ਜਾਂ ਨਿਕਾਸੀ ਦਰ ਕੱਢੋ ਅਤੇ ਉਸ ਦੀ ਮਾਤਰਾ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ",
  ],
  findMissingInletTime: [
    "Convert the combined filling time to the required net rate, then isolate the unknown inlet rate",
    "संयुक्त भरने के समय से आवश्यक शुद्ध दर निकालें और ज्ञात निकासी दर को समायोजित करके अज्ञात भराव दर अलग करें",
    "ਸਾਂਝੇ ਭਰਨ ਸਮੇਂ ਤੋਂ ਲੋੜੀਂਦੀ ਸ਼ੁੱਧ ਦਰ ਕੱਢੋ ਅਤੇ ਪਤਾ ਨਿਕਾਸੀ ਦਰ ਨੂੰ ਸਮਾਇਤ ਕਰਕੇ ਅਣਜਾਣ ਭਰਨ ਦਰ ਵੱਖ ਕਰੋ",
  ],
  findMissingOutletOrLeakTime: [
    "Convert the combined result to a signed net rate, then isolate the unknown outlet or leak rate",
    "संयुक्त परिणाम को शुद्ध दर में बदलें और ज्ञात पाइपों की दरों से अज्ञात निकासी या रिसाव दर अलग करें",
    "ਸਾਂਝੇ ਨਤੀਜੇ ਨੂੰ ਸ਼ੁੱਧ ਦਰ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਪਤਾ ਪਾਈਪਾਂ ਦੀਆਂ ਦਰਾਂ ਤੋਂ ਅਣਜਾਣ ਨਿਕਾਸੀ ਜਾਂ ਰਿਸਾਅ ਦਰ ਵੱਖ ਕਰੋ",
  ],
  findIdenticalPipeCountForTargetTime: [
    "Compare the target filling rate with one pipe's filling rate to obtain the number of identical pipes",
    "लक्षित भराव दर की तुलना एक पाइप की भराव दर से करके समान पाइपों की संख्या निकालें",
    "ਟੀਚੇ ਵਾਲੀ ਭਰਨ ਦਰ ਦੀ ਤੁਲਨਾ ਇੱਕ ਪਾਈਪ ਦੀ ਭਰਨ ਦਰ ਨਾਲ ਕਰਕੇ ਇੱਕੋ ਜਿਹੀਆਂ ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ",
  ],
  findTankCapacityFromFlowAndTime: [
    "Use tank capacity = flow rate × filling time",
    "टंकी की क्षमता = प्रवाह दर × भरने का समय लगाएँ",
    "ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ = ਪ੍ਰਵਾਹ ਦਰ × ਭਰਨ ਸਮਾਂ ਲਗਾਓ",
  ],
  findFlowRateFromCapacityAndTime: [
    "Use flow rate = tank capacity ÷ filling time",
    "प्रवाह दर = टंकी की क्षमता ÷ भरने का समय लगाएँ",
    "ਪ੍ਰਵਾਹ ਦਰ = ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ÷ ਭਰਨ ਸਮਾਂ ਲਗਾਓ",
  ],
  findTimeFromCapacityAndNetFlow: [
    "Use filling time = tank capacity ÷ net inflow rate",
    "भरने का समय = टंकी की क्षमता ÷ शुद्ध भराव दर लगाएँ",
    "ਭਰਨ ਸਮਾਂ = ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ÷ ਸ਼ੁੱਧ ਭਰਨ ਦਰ ਲਗਾਓ",
  ],
  convertFlowUnits: [
    "Convert the time unit first: multiply by 60 from per minute to per hour, and divide by 60 in the reverse direction",
    "पहले समय की इकाई बदलें: प्रति मिनट से प्रति घंटा के लिए 60 से गुणा करें और उलटी दिशा में 60 से भाग दें",
    "ਪਹਿਲਾਂ ਸਮੇਂ ਦੀ ਇਕਾਈ ਬਦਲੋ: ਪ੍ਰਤੀ ਮਿੰਟ ਤੋਂ ਪ੍ਰਤੀ ਘੰਟਾ ਲਈ 60 ਨਾਲ ਗੁਣਾ ਕਰੋ ਅਤੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ 60 ਨਾਲ ਭਾਗ ਦਿਓ",
  ],
  findTimeFromInitialLevelToBoundary: [
    "Find the distance from the initial level to the required boundary, then divide by the magnitude of the net rate",
    "प्रारंभिक स्तर से माँगी गई सीमा तक का स्तर-अंतर निकालें और उसे शुद्ध दर के परिमाण से भाग दें",
    "ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਤੋਂ ਮੰਗੀ ਹੱਦ ਤੱਕ ਪੱਧਰ ਦਾ ਫਰਕ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਸ਼ੁੱਧ ਦਰ ਦੀ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ",
  ],
  findFinalLevelAfterGivenTime: [
    "Find net level change = signed net rate × time, then add it to the initial level",
    "शुद्ध स्तर परिवर्तन = शुद्ध दर × समय निकालकर उसे प्रारंभिक स्तर में जोड़ें",
    "ਸ਼ੁੱਧ ਪੱਧਰ ਬਦਲਾਅ = ਸ਼ੁੱਧ ਦਰ × ਸਮਾਂ ਕੱਢ ਕੇ ਉਸ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਵਿੱਚ ਜੋੜੋ",
  ],
  compareTankCapacities: [
    "Find each capacity as flow rate × filling time, then compare tank A with tank B in the stated order",
    "दोनों टंकियों की क्षमता प्रवाह दर × समय से निकालें और दिए क्रम A:B में अनुपात बनाएँ",
    "ਦੋਵੇਂ ਟੈਂਕੀਆਂ ਦੀ ਸਮਰੱਥਾ ਪ੍ਰਵਾਹ ਦਰ × ਸਮਾਂ ਨਾਲ ਕੱਢੋ ਅਤੇ ਦਿੱਤੇ ਕ੍ਰਮ A:B ਵਿੱਚ ਅਨੁਪਾਤ ਬਣਾਓ",
  ],
  findReducedPipeEfficiencyFromChangedTime: [
    "For the same tank, efficiency is inversely proportional to filling time; new:old efficiency = old:new time",
    "एक ही टंकी के लिए दक्षता समय के व्युत्क्रमानुपाती है; नई:पुरानी दक्षता = पुराना:नया समय",
    "ਇੱਕੋ ਟੈਂਕੀ ਲਈ ਦੱਖਤਾ ਸਮੇਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ; ਨਵੀਂ:ਪੁਰਾਣੀ ਦੱਖਤਾ = ਪੁਰਾਣਾ:ਨਵਾਂ ਸਮਾਂ",
  ],
  findBlockagePercentFromChangedTime: [
    "Find the retained flow fraction from old time ÷ new time, then subtract it from 100%",
    "पुराना समय ÷ नया समय से बची हुई प्रवाह-दक्षता निकालें और उसे 100% में से घटाएँ",
    "ਪੁਰਾਣਾ ਸਮਾਂ ÷ ਨਵਾਂ ਸਮਾਂ ਨਾਲ ਬਚੀ ਹੋਈ ਪ੍ਰਵਾਹ-ਦੱਖਤਾ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ 100% ਵਿੱਚੋਂ ਘਟਾਓ",
  ],
  findNetRateDirection: [
    "Add inflows and subtract outflows; the sign of the net rate tells whether the level rises, falls or stays unchanged",
    "भराव दरें जोड़ें और निकासी दरें घटाएँ; शुद्ध दर का चिन्ह बताता है कि स्तर बढ़ेगा, घटेगा या स्थिर रहेगा",
    "ਭਰਨ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਨਿਕਾਸੀ ਦਰਾਂ ਘਟਾਓ; ਸ਼ੁੱਧ ਦਰ ਦਾ ਨਿਸ਼ਾਨ ਦੱਸਦਾ ਹੈ ਕਿ ਪੱਧਰ ਵਧੇਗਾ, ਘਟੇਗਾ ਜਾਂ ਸਥਿਰ ਰਹੇਗਾ",
  ],
  findBoundaryEventFeasibility: [
    "Find the net direction and time to the relevant boundary, then compare that time with the available window",
    "शुद्ध दिशा और संबंधित सीमा तक पहुँचने का समय निकालें, फिर उस समय की उपलब्ध अवधि से तुलना करें",
    "ਸ਼ੁੱਧ ਦਿਸ਼ਾ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਉਸ ਸਮੇਂ ਦੀ ਉਪਲਬਧ ਮਿਆਦ ਨਾਲ ਤੁਲਨਾ ਕਰੋ",
  ],
};

const ANSWER_LABELS: Record<string, Triplet> = {
  findFillTimeFromPositiveInlets: ["the required filling time", "आवश्यक भरने का समय", "ਲੋੜੀਂਦਾ ਭਰਨ ਸਮਾਂ"],
  findFillTimeFromMixedPipes: ["the required filling time", "आवश्यक भरने का समय", "ਲੋੜੀਂਦਾ ਭਰਨ ਸਮਾਂ"],
  findEmptyTimeFromMixedPipes: ["the required emptying time", "आवश्यक खाली होने का समय", "ਲੋੜੀਂਦਾ ਖਾਲੀ ਹੋਣ ਦਾ ਸਮਾਂ"],
  findNetFractionChangedInGivenTime: ["the net fraction changed", "शुद्ध स्तर परिवर्तन", "ਸ਼ੁੱਧ ਪੱਧਰ ਬਦਲਾਅ"],
  findMissingInletTime: ["the inlet's solo filling time", "अज्ञात भराव पाइप का अकेले भरने का समय", "ਅਣਜਾਣ ਭਰਨ ਪਾਈਪ ਦਾ ਇਕੱਲੇ ਭਰਨ ਸਮਾਂ"],
  findMissingOutletOrLeakTime: ["the outlet or leak's solo emptying time", "अज्ञात निकासी या रिसाव का अकेले खाली करने का समय", "ਅਣਜਾਣ ਨਿਕਾਸੀ ਜਾਂ ਰਿਸਾਅ ਦਾ ਇਕੱਲੇ ਖਾਲੀ ਕਰਨ ਦਾ ਸਮਾਂ"],
  findIdenticalPipeCountForTargetTime: ["the required number of identical pipes", "आवश्यक समान पाइपों की संख्या", "ਲੋੜੀਂਦੀਆਂ ਇੱਕੋ ਜਿਹੀਆਂ ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ"],
  findTankCapacityFromFlowAndTime: ["the tank capacity", "टंकी की क्षमता", "ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ"],
  findFlowRateFromCapacityAndTime: ["the pipe's flow rate", "पाइप की प्रवाह दर", "ਪਾਈਪ ਦੀ ਪ੍ਰਵਾਹ ਦਰ"],
  findTimeFromCapacityAndNetFlow: ["the required filling time", "आवश्यक भरने का समय", "ਲੋੜੀਂਦਾ ਭਰਨ ਸਮਾਂ"],
  convertFlowUnits: ["the converted flow rate", "परिवर्तित प्रवाह दर", "ਬਦਲੀ ਹੋਈ ਪ੍ਰਵਾਹ ਦਰ"],
  findTimeFromInitialLevelToBoundary: ["the required boundary time", "सीमा तक पहुँचने का समय", "ਹੱਦ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ"],
  findFinalLevelAfterGivenTime: ["the final tank level", "टंकी का अंतिम स्तर", "ਟੈਂਕੀ ਦਾ ਅੰਤਿਮ ਪੱਧਰ"],
  compareTankCapacities: ["the capacity ratio (A:B)", "क्षमता अनुपात (A:B)", "ਸਮਰੱਥਾ ਅਨੁਪਾਤ (A:B)"],
  findReducedPipeEfficiencyFromChangedTime: ["the new:old efficiency ratio", "नई:पुरानी दक्षता का अनुपात", "ਨਵੀਂ:ਪੁਰਾਣੀ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ"],
  findBlockagePercentFromChangedTime: ["the percentage reduction in flow", "प्रवाह दर में प्रतिशत कमी", "ਪ੍ਰਵਾਹ ਦਰ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਘਾਟ"],
  findNetRateDirection: ["the net direction", "पानी के स्तर की दिशा", "ਪਾਣੀ ਦੇ ਪੱਧਰ ਦੀ ਦਿਸ਼ਾ"],
  findBoundaryEventFeasibility: ["the correct conclusion", "सही निष्कर्ष", "ਸਹੀ ਨਤੀਜਾ"],
};

function extractAnswer(current: string, language: Language): string {
  let value = current.trim();
  if (language === "hi") {
    value = value
      .replace(/^अतः\s+(?:आवश्यक समय|आवश्यक संख्या|आवश्यक दर|आवश्यक अनुपात|आवश्यक भाग|आवश्यक उत्पादन|उत्तर|शुद्ध परिवर्तन|सीमा संबंधी सही निष्कर्ष|सही निष्कर्ष)\s+/u, "")
      .replace(/\s+है।$/u, "")
      .replace(/।$/u, "");
  } else if (language === "pa") {
    value = value
      .replace(/^ਇਸ ਲਈ\s+(?:ਲੋੜੀਂਦਾ ਸਮਾਂ|ਲੋੜੀਂਦੀ ਗਿਣਤੀ|ਲੋੜੀਂਦੀ ਦਰ|ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ|ਲੋੜੀਂਦਾ ਹਿੱਸਾ|ਲੋੜੀਂਦਾ ਉਤਪਾਦਨ|ਉੱਤਰ|ਸ਼ੁੱਧ ਬਦਲਾਅ|ਹੱਦ ਬਾਰੇ ਸਹੀ ਨਤੀਜਾ|ਸਹੀ ਨਤੀਜਾ)\s+/u, "")
      .replace(/\s+ਹੈ।$/u, "")
      .replace(/।$/u, "");
  } else {
    value = value
      .replace(/^Therefore,\s+(?:the\s+)?(?:required time|required count|required rate|required ratio|required fraction|required output|answer|net fraction changed|correct boundary decision|correct decision)\s+is\s+/i, "")
      .replace(/\.$/, "");
  }
  return value.trim();
}

function answerLine(mode: string, answer: string, language: Language): string {
  const label = t(language, ANSWER_LABELS[mode] ?? ["answer", "उत्तर", "ਉੱਤਰ"]);
  if (language === "en") return `Therefore, ${label} is ${answer}.`;
  return `${language === "hi" ? "अतः" : "ਇਸ ਲਈ"} ${label}: ${answer}।`;
}

function rhsFromMathEquality(step: string): string | null {
  const match = step.match(/^\\\((?:[^=]+)=([\s\S]+)\\\)[।.]?$/u);
  return match?.[1]?.trim() ?? null;
}

function removeTrailingAnswerStep(solution: string[], answer: string): string[] {
  if (!solution.length) return solution;
  const last = solution[solution.length - 1]?.trim() ?? "";
  return last === answer.trim() ? solution.slice(0, -1) : solution;
}

function polishSolution(question: Cp009Question, language: Language, answer: string, currentAnswer: string): string[] {
  const qlId = question.questionLanguageId ?? "";
  let steps = removeTrailingAnswerStep([...(question.learnerExplanation?.solution ?? [])], currentAnswer);

  if (qlId === "TMW-QL-163" && steps[0]) {
    steps[0] = steps[0]
      .replace(/^Net rate\s*=\s*/i, "One pipe's filling rate = ")
      .replace(/^शुद्ध दर\s*=\s*/u, "एक पाइप की भराव दर = ")
      .replace(/^ਸ਼ੁੱਧ ਦਰ\s*=\s*/u, "ਇੱਕ ਪਾਈਪ ਦੀ ਭਰਨ ਦਰ = ");
  }

  if (qlId === "TMW-QL-167" && steps.length >= 2) {
    steps[1] = t(language, ["1 hour = 60 minutes.", "1 घंटा = 60 मिनट।", "1 ਘੰਟਾ = 60 ਮਿੰਟ।"]);
  }

  if (qlId === "TMW-QL-168" && steps[1]) {
    const rhs = rhsFromMathEquality(steps[1]);
    if (rhs) steps[1] = `${t(language, ["Required level change", "आवश्यक स्तर परिवर्तन", "ਲੋੜੀਂਦਾ ਪੱਧਰ ਬਦਲਾਅ"])} = ${math(rhs)}${language === "en" ? "." : "।"}`;
  }

  if (qlId === "TMW-QL-170" && steps.length >= 3) {
    steps[0] = steps[0].replace(/^V\s*=\s*/u, `${t(language, ["Tank A capacity", "टंकी A की क्षमता", "ਟੈਂਕੀ A ਦੀ ਸਮਰੱਥਾ"])} = `);
    steps[1] = steps[1].replace(/^V\s*=\s*/u, `${t(language, ["Tank B capacity", "टंकी B की क्षमता", "ਟੈਂਕੀ B ਦੀ ਸਮਰੱਥਾ"])} = `);
    steps[2] = `${t(language, ["Capacity ratio (A:B)", "क्षमता अनुपात (A:B)", "ਸਮਰੱਥਾ ਅਨੁਪਾਤ (A:B)"])} = ${math(answer)}${language === "en" ? "." : "।"}`;
  }

  if (qlId === "TMW-QL-171") {
    const oldTime = rationalText(question.parameters?.originalTime);
    const newTime = rationalText(question.parameters?.changedTime);
    if (oldTime && newTime) {
      steps = [
        `${t(language, ["Old filling time", "पुराना भरने का समय", "ਪੁਰਾਣਾ ਭਰਨ ਸਮਾਂ"])} = ${math(oldTime)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}; ${t(language, ["new filling time", "नया भरने का समय", "ਨਵਾਂ ਭਰਨ ਸਮਾਂ"])} = ${math(newTime)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}${language === "en" ? "." : "।"}`,
        `${t(language, ["New:old efficiency", "नई:पुरानी दक्षता", "ਨਵੀਂ:ਪੁਰਾਣੀ ਦੱਖਤਾ"])} = ${math(`${oldTime}:${newTime}`)}${language === "en" ? "." : "।"}`,
        `${t(language, ["Simplified ratio", "सरल अनुपात", "ਸਧਾਰਿਆ ਅਨੁਪਾਤ"])} = ${math(answer)}${language === "en" ? "." : "।"}`,
      ];
    }
  }

  if (qlId === "TMW-QL-172" && steps.length >= 3) {
    steps[0] = steps[0].replace(/^\\\(\\frac\{E\}\{E\}=/u, `${t(language, ["Retained flow fraction", "बची हुई प्रवाह-दक्षता", "ਬਚੀ ਹੋਈ ਪ੍ਰਵਾਹ-ਦੱਖਤਾ"])} = \\(`);
    const loss = rhsFromMathEquality(steps[1]);
    if (loss) steps[1] = `${t(language, ["Fractional reduction", "दक्षता में कमी", "ਦੱਖਤਾ ਵਿੱਚ ਘਾਟ"])} = ${math(loss)}${language === "en" ? "." : "।"}`;
    const percent = rhsFromMathEquality(steps[2]);
    if (percent) steps[2] = `${t(language, ["Percentage blockage", "प्रतिशत रुकावट", "ਪ੍ਰਤੀਸ਼ਤ ਰੁਕਾਵਟ"])} = ${math(percent)}${language === "en" ? "." : "।"}`;
  }

  if (qlId === "TMW-QL-173" && steps[2]) {
    const condition = steps[2].match(/^\\\(([\s\S]*?)\\Rightarrow[\s\S]*\\\)[।.]?$/u)?.[1]?.trim();
    if (condition) {
      steps[2] = `${math(condition)} ⇒ ${answer}${language === "en" ? "." : "।"}`;
    } else if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(steps[2])) {
      steps[2] = `${t(language, ["Hence the net direction", "अतः पानी के स्तर की दिशा", "ਇਸ ਲਈ ਪਾਣੀ ਦੇ ਪੱਧਰ ਦੀ ਦਿਸ਼ਾ"])}: ${answer}${language === "en" ? "." : "।"}`;
    }
  }

  if (qlId === "TMW-QL-174" && steps[2]) {
    const localized = steps[2].replace(
      /boundary is reached within the window/gi,
      t(language, ["the boundary is reached within the available window", "सीमा उपलब्ध अवधि के भीतर पहुँच जाती है", "ਹੱਦ ਉਪਲਬਧ ਮਿਆਦ ਦੇ ਅੰਦਰ ਪਹੁੰਚ ਜਾਂਦੀ ਹੈ"]),
    );
    const condition = localized.match(/^\\\(([\s\S]*?)\\Rightarrow[\s\S]*\\\)[।.]?$/u)?.[1]?.trim();
    if (condition) {
      steps[2] = `${math(condition)} ⇒ ${answer}${language === "en" ? "." : "।"}`;
    } else if (/\\\([^)]*[\u0900-\u097F\u0A00-\u0A7F][^)]*\\\)/u.test(localized)) {
      steps[2] = `${t(language, ["Boundary check", "सीमा-जाँच", "ਹੱਦ ਦੀ ਜਾਂਚ"])}: ${answer}${language === "en" ? "." : "।"}`;
    } else {
      steps[2] = localized;
    }
  }

  return steps.slice(0, 5);
}

function containsLocalizedProseInsideMath(value: string): boolean {
  for (const match of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(match[1] ?? "")) return true;
  }
  return false;
}

export function finalizeTmwCp009MultilingualEditorialReview(question: Cp009Question, language: Language): Cp009Question {
  const cp = question.canonicalProblemId ?? question.cpId ?? "";
  if (cp !== "TMW-CP-009" || !question.learnerExplanation) return question;

  const mode = question.solveMode ?? "";
  const currentAnswer = question.learnerExplanation.answer;
  const answer = extractAnswer(currentAnswer, language);
  const learner: TmwLearnerExplanationV2 = {
    ...question.learnerExplanation,
    method: t(language, METHODS[mode] ?? [question.learnerExplanation.method, question.learnerExplanation.method, question.learnerExplanation.method]),
    solution: polishSolution(question, language, answer, currentAnswer),
    answer: answerLine(mode, answer, language),
  };

  const editorialErrors = validateTmwLearnerExplanationV2(learner);
  const presentation = [learner.method, ...learner.solution, learner.answer].join(" ");
  if (language !== "en" && /boundary is reached within the window/i.test(presentation)) editorialErrors.push("English boundary-window wording remains in localized learner explanation");
  if (containsLocalizedProseInsideMath(presentation)) editorialErrors.push("Localized prose remains inside learner MathJax");
  if (/\\\(V:V=|\\frac\{E\}\{E\}|\bE:E\b/u.test(presentation)) editorialErrors.push("Ambiguous stripped ratio symbols remain in learner explanation");
  if (/\\\(1=60\\\)\s+(?:मिनट घंटा|ਮਿੰਟ ਘੰਟਾ)/u.test(presentation)) editorialErrors.push("Malformed hour-minute conversion remains in learner explanation");

  const inherited = question.validation?.errors ?? [];
  const errors = [...inherited.filter((error) => !error.startsWith("CP009 editorial review:")), ...editorialErrors.map((error) => `CP009 editorial review: ${error}`)];
  return {
    ...question,
    learnerExplanation: learner,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
