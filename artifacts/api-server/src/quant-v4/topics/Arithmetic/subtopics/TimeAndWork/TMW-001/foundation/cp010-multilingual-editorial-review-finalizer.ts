import {
  validateTmwLearnerExplanationV2,
  type TmwLearnerExplanationV2,
} from "./learner-explanation-contract";
import type { TmwCp010Parameters, TmwCp010Solution } from "./cp010-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp010Label } from "./localization-cp010-language";
import { toLatex } from "./rational";

type Language = "en" | TmwLocalizedLanguage;
type Triplet = readonly [string, string, string];

interface Cp010Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: string;
  stem?: string;
  parameters?: TmwCp010Parameters;
  solution?: TmwCp010Solution;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, text: Triplet): string {
  return language === "hi" ? text[1] : language === "pa" ? text[2] : text[0];
}

function punctuation(language: Language): string { return language === "en" ? "." : "।"; }
function math(value: string): string { return `\\(${value}\\)`; }

function ordinal(language: Exclude<Language, "en">, value: number): string {
  if (language === "hi") {
    if (value === 1) return "पहली";
    if (value === 2) return "दूसरी";
    if (value === 3) return "तीसरी";
    return `${value}वीं`;
  }
  if (value === 1) return "ਪਹਿਲੀ";
  if (value === 2) return "ਦੂਜੀ";
  if (value === 3) return "ਤੀਜੀ";
  return `${value}ਵੀਂ`;
}

function polishStem(question: Cp010Question, language: Language): string {
  let stem = question.stem ?? "";
  if (language === "en") return stem;

  if (language === "hi") {
    stem = stem
      .replace(/चलती है ([^;।?]+?) तक चलता है/gu, "चलती है $1 तक")
      .replace(/चलते हैं ([^;।?]+?) तक चलता है/gu, "चलते हैं $1 तक")
      .replace(/काम करती हैं चलता है/gu, "काम करती हैं")
      .replace(/चलते हैं चलता है/gu, "चलते हैं")
      .replace(/चलती है चलता है/gu, "चलती है")
      .replace(/((?:भरने वाली|निकासी) पाइप [A-Z]) चलती है स्तर ([^;।?]+?) भरी तक/gu, "$1 तब तक चलती है जब तक स्तर $2 न हो जाए")
      .replace(/फिर सेंसर ((?:भरने वाली|निकासी) पाइप [A-Z]) चलती है चालू करता है/gu, "फिर सेंसर $1 को चालू कर देता है")
      .replace(/फिर सेंसर (.+?) एक साथ चलते हैं चालू करता है/gu, "फिर सेंसर $1 को एक साथ चालू कर देता है")
      .replace(/अज्ञात समय पर व्यवस्था (.+?) चलती है हो जाती है/gu, "अज्ञात समय पर व्यवस्था बदलती है और केवल $1 चलती है")
      .replace(/उसकी प्रति घंटा दर क्या होनी चाहिए\?/gu, "अज्ञात अंतिम भराव पाइप की प्रति घंटा दर क्या होनी चाहिए?");
    const hit = question.parameters?.levelControl?.targetUpperHits;
    if (hit) {
      stem = stem
        .replace(/ऊपरी स्तर पर अगली \d+वीं वापसी तक/gu, `ऊपरी स्तर पर ${ordinal("hi", hit)} वापसी तक`)
        .replace(/ऊपरी स्तर की अगली \d+वीं प्राप्ति तक/gu, `ऊपरी स्तर पर ${ordinal("hi", hit)} वापसी तक`);
    }
    return stem;
  }

  stem = stem
    .replace(/ਚੱਲਦੀ ਹੈ ([^;।?]+?) ਲਈ ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਹੈ $1 ਲਈ")
    .replace(/ਚੱਲਦੀ ਹੈ ([^;।?]+?) ਤੱਕ ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਹੈ $1 ਤੱਕ")
    .replace(/ਚੱਲਦੇ ਹਨ ([^;।?]+?) ਲਈ ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੇ ਹਨ $1 ਲਈ")
    .replace(/ਚੱਲਦੇ ਹਨ ([^;।?]+?) ਤੱਕ ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੇ ਹਨ $1 ਤੱਕ")
    .replace(/ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ ਚੱਲਦਾ ਹੈ/gu, "ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ")
    .replace(/ਚੱਲਦੇ ਹਨ ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੇ ਹਨ")
    .replace(/ਚੱਲਦੀ ਹੈ ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਹੈ")
    .replace(/((?:ਭਰਨ ਵਾਲੀ|ਨਿਕਾਸੀ) ਪਾਈਪ [A-Z]) ਚੱਲਦੀ ਹੈ ਪੱਧਰ ([^;।?]+?) ਭਰੀ ਤੱਕ/gu, "$1 ਤਦ ਤੱਕ ਚੱਲਦੀ ਹੈ ਜਦ ਤੱਕ ਪੱਧਰ $2 ਨਾ ਹੋ ਜਾਵੇ")
    .replace(/ਫਿਰ ਸੈਂਸਰ ((?:ਭਰਨ ਵਾਲੀ|ਨਿਕਾਸੀ) ਪਾਈਪ [A-Z]) ਚੱਲਦੀ ਹੈ ਚਾਲੂ ਕਰਦਾ ਹੈ/gu, "ਫਿਰ ਸੈਂਸਰ $1 ਨੂੰ ਚਾਲੂ ਕਰ ਦਿੰਦਾ ਹੈ")
    .replace(/ਫਿਰ ਸੈਂਸਰ (.+?) ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ ਚਾਲੂ ਕਰਦਾ ਹੈ/gu, "ਫਿਰ ਸੈਂਸਰ $1 ਨੂੰ ਇਕੱਠੇ ਚਾਲੂ ਕਰ ਦਿੰਦਾ ਹੈ")
    .replace(/ਅਣਜਾਣ ਸਮੇਂ ਉੱਤੇ ਵਿਵਸਥਾ (.+?) ਚੱਲਦੀ ਹੈ ਹੋ ਜਾਂਦੀ ਹੈ/gu, "ਅਣਜਾਣ ਸਮੇਂ ਉੱਤੇ ਵਿਵਸਥਾ ਬਦਲਦੀ ਹੈ ਅਤੇ ਕੇਵਲ $1 ਚੱਲਦੀ ਹੈ")
    .replace(/ਉਸ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਕੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ\?/gu, "ਅਣਜਾਣ ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਕੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?");
  const hit = question.parameters?.levelControl?.targetUpperHits;
  if (hit) {
    stem = stem
      .replace(/ਉੱਪਰਲੇ ਪੱਧਰ ਤੇ ਅਗਲੀ \d+ਵੀਂ ਵਾਪਸੀ ਤੱਕ/gu, `ਉੱਪਰਲੇ ਪੱਧਰ ਤੇ ${ordinal("pa", hit)} ਵਾਪਸੀ ਤੱਕ`)
      .replace(/ਉੱਪਰਲੇ ਪੱਧਰ ਦੀ ਅਗਲੀ \d+ਵੀਂ ਪ੍ਰਾਪਤੀ ਤੱਕ/gu, `ਉੱਪਰਲੇ ਪੱਧਰ ਤੇ ${ordinal("pa", hit)} ਵਾਪਸੀ ਤੱਕ`);
  }
  return stem;
}

const METHODS: Record<string, Triplet> = {
  findCompletionAfterDelayedActivation: [
    "Find the level reached before the delayed pipe opens, then use the new net rate for the remaining level",
    "देरी वाली पाइप खुलने से पहले पहुँचा स्तर निकालें, फिर नई शुद्ध दर से बचा स्तर पूरा करें",
    "ਦੇਰ ਨਾਲ ਖੁੱਲ੍ਹਣ ਵਾਲੀ ਪਾਈਪ ਤੋਂ ਪਹਿਲਾਂ ਪਹੁੰਚਿਆ ਪੱਧਰ ਕੱਢੋ, ਫਿਰ ਨਵੀਂ ਸ਼ੁੱਧ ਦਰ ਨਾਲ ਬਾਕੀ ਪੱਧਰ ਪੂਰਾ ਕਰੋ",
  ],
  findCompletionAfterDelayedDeactivation: [
    "Find the level at the closing event, then carry it into the reduced-flow stage",
    "पाइप बंद होने तक का स्तर निकालें और उसी स्तर से अगला चरण हल करें",
    "ਪਾਈਪ ਬੰਦ ਹੋਣ ਤੱਕ ਦਾ ਪੱਧਰ ਕੱਢੋ ਅਤੇ ਉਸੇ ਪੱਧਰ ਤੋਂ ਅਗਲਾ ਪੜਾਅ ਹੱਲ ਕਰੋ",
  ],
  findCompletionWithMultipleStaggeredEvents: [
    "Advance the tank level stage by stage, changing the net rate only at each stated event",
    "हर दी गई घटना पर शुद्ध दर बदलते हुए टंकी का स्तर चरण-दर-चरण आगे बढ़ाएँ",
    "ਹਰ ਦਿੱਤੀ ਘਟਨਾ ਤੇ ਸ਼ੁੱਧ ਦਰ ਬਦਲਦੇ ਹੋਏ ਟੈਂਕੀ ਦਾ ਪੱਧਰ ਪੜਾਅ-ਦਰ-ਪੜਾਅ ਅੱਗੇ ਲੈ ਜਾਓ",
  ],
  findCompletionWithInterruptedFlow: [
    "Treat the no-flow interval as a separate stage in which the tank level stays unchanged",
    "बिना प्रवाह वाले अंतराल को अलग चरण मानें, जिसमें टंकी का स्तर नहीं बदलता",
    "ਬਿਨਾਂ ਪ੍ਰਵਾਹ ਵਾਲੇ ਅੰਤਰਾਲ ਨੂੰ ਵੱਖ ਪੜਾਅ ਮੰਨੋ, ਜਿਸ ਵਿੱਚ ਟੈਂਕੀ ਦਾ ਪੱਧਰ ਨਹੀਂ ਬਦਲਦਾ",
  ],
  findCompletionFromPartialLevelAndStages: [
    "Start from the given partial level, apply each stage change, then time the remaining part",
    "दिए गए प्रारंभिक स्तर से शुरू करें, हर चरण का परिवर्तन जोड़ें और बचे भाग का समय निकालें",
    "ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ, ਹਰ ਪੜਾਅ ਦਾ ਬਦਲਾਅ ਜੋੜੋ ਅਤੇ ਬਾਕੀ ਹਿੱਸੇ ਦਾ ਸਮਾਂ ਕੱਢੋ",
  ],
  findFinalLevelAfterStagedSchedule: [
    "Add every signed stage change to the initial tank level",
    "प्रारंभिक स्तर में हर चरण का धनात्मक या ऋणात्मक परिवर्तन जोड़ें",
    "ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਵਿੱਚ ਹਰ ਪੜਾਅ ਦਾ ਧਨਾਤਮਕ ਜਾਂ ਰਿਣਾਤਮਕ ਬਦਲਾਅ ਜੋੜੋ",
  ],
  findCompletionAfterThresholdSwitch: [
    "First time the tank to the trigger level, then solve the post-sensor stage from that exact level",
    "पहले सेंसर वाले स्तर तक का समय निकालें, फिर उसी स्तर से अगला चरण हल करें",
    "ਪਹਿਲਾਂ ਸੈਂਸਰ ਵਾਲੇ ਪੱਧਰ ਤੱਕ ਦਾ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਉਸੇ ਪੱਧਰ ਤੋਂ ਅਗਲਾ ਪੜਾਅ ਹੱਲ ਕਰੋ",
  ],
  findEventTimeFromKnownCompletion: [
    "Let the change occur after x hours and use the known total completion time to form one two-stage equation",
    "बदलाव का समय x घंटे मानकर ज्ञात कुल समय से दो चरणों की एक समीकरण बनाएँ",
    "ਬਦਲਾਅ ਦਾ ਸਮਾਂ x ਘੰਟੇ ਮੰਨ ਕੇ ਪਤਾ ਕੁੱਲ ਸਮੇਂ ਤੋਂ ਦੋ ਪੜਾਵਾਂ ਦੀ ਇੱਕ ਸਮੀਕਰਨ ਬਣਾਓ",
  ],
  findRequiredFinalStageRate: [
    "Find the work completed in the known first stage, then divide the remaining work by the remaining time",
    "पहले ज्ञात चरण में भरा भाग निकालें, फिर बचे भाग को बचे समय से भाग देकर अंतिम दर निकालें",
    "ਪਹਿਲੇ ਪਤਾ ਪੜਾਅ ਵਿੱਚ ਭਰਿਆ ਹਿੱਸਾ ਕੱਢੋ, ਫਿਰ ਬਾਕੀ ਹਿੱਸੇ ਨੂੰ ਬਾਕੀ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਅੰਤਿਮ ਦਰ ਕੱਢੋ",
  ],
  findCapacityFromStagedPhysicalFlows: [
    "For each physical-flow stage compute flow × time, then add the stage volumes",
    "हर चरण में प्रवाह दर × समय से आयतन निकालें और सभी आयतन जोड़ें",
    "ਹਰ ਪੜਾਅ ਵਿੱਚ ਪ੍ਰਵਾਹ ਦਰ × ਸਮਾਂ ਨਾਲ ਆਇਤਨ ਕੱਢੋ ਅਤੇ ਸਾਰੇ ਆਇਤਨ ਜੋੜੋ",
  ],
  findCompletionWithAlternatingPipes: [
    "Find the net gain of one alternating cycle, use only safe full cycles, then solve the terminal turn",
    "एक वैकल्पिक चक्र का शुद्ध लाभ निकालें, सुरक्षित पूरे चक्र लगाएँ और अंतिम पाली अलग हल करें",
    "ਇੱਕ ਬਦਲਵੇਂ ਚੱਕਰ ਦਾ ਸ਼ੁੱਧ ਲਾਭ ਕੱਢੋ, ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ ਅਤੇ ਅੰਤਿਮ ਵਾਰੀ ਵੱਖ ਹੱਲ ਕਰੋ",
  ],
  findCompletionWithPeriodicSchedule: [
    "Add all segments of one full period, use safe full cycles, then replay the terminal period in order",
    "एक पूरे आवर्ती चक्र के सभी हिस्से जोड़ें, सुरक्षित पूरे चक्र लगाएँ और अंतिम चक्र क्रम से चलाएँ",
    "ਇੱਕ ਪੂਰੇ ਆਵਰਤੀ ਚੱਕਰ ਦੇ ਸਾਰੇ ਹਿੱਸੇ ਜੋੜੋ, ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ ਅਤੇ ਅੰਤਿਮ ਚੱਕਰ ਕ੍ਰਮ ਨਾਲ ਚਲਾਓ",
  ],
  findAutomaticLevelControlCompletion: [
    "Find one lower-to-upper controller cycle time and multiply by the required number of returns",
    "निचले और ऊपरी स्तर के बीच एक पूरा नियंत्रक चक्र निकालें और माँगी गई वापसी की संख्या से गुणा करें",
    "ਹੇਠਲੇ ਅਤੇ ਉੱਪਰਲੇ ਪੱਧਰ ਵਿਚਕਾਰ ਇੱਕ ਪੂਰਾ ਕੰਟਰੋਲਰ ਚੱਕਰ ਕੱਢੋ ਅਤੇ ਮੰਗੀਆਂ ਵਾਪਸੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ",
  ],
  findCompletionFromArbitraryCyclePhase: [
    "Respect the stated starting phase, then use full cycles and solve the terminal segment in order",
    "दिए गए शुरुआती भाग से क्रम शुरू करें, फिर पूरे चक्र लगाकर अंतिम हिस्सा क्रम से हल करें",
    "ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਹਿੱਸੇ ਤੋਂ ਕ੍ਰਮ ਸ਼ੁਰੂ ਕਰੋ, ਫਿਰ ਪੂਰੇ ਚੱਕਰ ਲਗਾ ਕੇ ਅੰਤਿਮ ਹਿੱਸਾ ਕ੍ਰਮ ਨਾਲ ਹੱਲ ਕਰੋ",
  ],
  findFullCycleCountToBoundary: [
    "Find one cycle's net change and count only complete cycles that finish before the terminal cycle",
    "एक चक्र का शुद्ध परिवर्तन निकालें और केवल वे पूरे चक्र गिनें जो अंतिम चक्र से पहले समाप्त होते हैं",
    "ਇੱਕ ਚੱਕਰ ਦਾ ਸ਼ੁੱਧ ਬਦਲਾਅ ਕੱਢੋ ਅਤੇ ਸਿਰਫ਼ ਉਹ ਪੂਰੇ ਚੱਕਰ ਗਿਣੋ ਜੋ ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਮੁਕੰਮਲ ਹੁੰਦੇ ਹਨ",
  ],
  findTerminalActiveSegment: [
    "Use safe complete cycles, then test the next cycle's segments in order until the boundary is reached",
    "सुरक्षित पूरे चक्र लगाएँ, फिर अगले चक्र के हिस्सों को क्रम से जाँचें जब तक सीमा न मिल जाए",
    "ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ, ਫਿਰ ਅਗਲੇ ਚੱਕਰ ਦੇ ਹਿੱਸਿਆਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਜਾਂਚੋ ਜਦ ਤੱਕ ਹੱਦ ਨਾ ਮਿਲ ਜਾਵੇ",
  ],
  findBoundaryEventTimeUnderSchedule: [
    "Use full cycles only while they are safe, then compute the exact time inside the terminal segment",
    "सिर्फ सुरक्षित पूरे चक्र लगाएँ और अंतिम हिस्से के भीतर सीमा तक का ठीक समय निकालें",
    "ਸਿਰਫ਼ ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ ਅਤੇ ਅੰਤਿਮ ਹਿੱਸੇ ਦੇ ਅੰਦਰ ਹੱਦ ਤੱਕ ਦਾ ਸਹੀ ਸਮਾਂ ਕੱਢੋ",
  ],
  findScheduleAdjustmentForDeadline: [
    "Solve the change time required by the deadline, then compare it with the originally planned change time",
    "समय-सीमा के लिए आवश्यक बदलाव समय निकालें और उसकी तुलना मूल नियोजित बदलाव समय से करें",
    "ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦਾ ਬਦਲਾਅ ਸਮਾਂ ਕੱਢੋ ਅਤੇ ਉਸ ਦੀ ਤੁਲਨਾ ਮੂਲ ਯੋਜਿਤ ਬਦਲਾਅ ਸਮੇਂ ਨਾਲ ਕਰੋ",
  ],
};

function cleanMath(raw: string): { expression: string; stage?: string; unit?: "hours" | "tank/hour" | "litres" } {
  const stage = raw.match(/^\\text\{Stage (\d+): \}/)?.[1];
  let unit: "hours" | "tank/hour" | "litres" | undefined;
  if (/\\;\\text\{tank\/hour\}/.test(raw)) unit = "tank/hour";
  else if (/\\;\\text\{hours\}/.test(raw)) unit = "hours";
  else if (/\\;\\text\{litres\}/.test(raw)) unit = "litres";
  const expression = raw
    .replace(/^\\text\{Stage \d+: \}/, "")
    .replace(/\\;\\text\{(?:tank\/hour|hours|litres)\}/g, "")
    .trim();
  return { expression, stage, unit };
}

function unitText(language: Language, unit?: "hours" | "tank/hour" | "litres"): string {
  if (!unit) return "";
  if (unit === "hours") return t(language, ["hours", "घंटे", "ਘੰਟੇ"]);
  if (unit === "litres") return t(language, ["litres", "लीटर", "ਲੀਟਰ"]);
  return t(language, ["tank/hour", "टंकी/घंटा", "ਟੈਂਕੀ/ਘੰਟਾ"]);
}

function standardSteps(solution: TmwCp010Solution, language: Language): string[] {
  return solution.workedLatex.slice(0, 5).map((raw) => {
    const cleaned = cleanMath(raw);
    const prefix = cleaned.stage
      ? `${t(language, ["Stage", "चरण", "ਪੜਾਅ"])} ${cleaned.stage}: `
      : "";
    const unit = unitText(language, cleaned.unit);
    return `${prefix}${math(cleaned.expression)}${unit ? ` ${unit}` : ""}${punctuation(language)}`;
  });
}

function cycleFacts(solution: TmwCp010Solution): { cycles?: string; remaining?: string } {
  const raw = solution.workedLatex[1] ?? "";
  const match = raw.match(/\\text\{Complete cycles before the terminal cycle\}=(\d+),\\quad \\text\{level still required at its start\}=(.+)$/);
  return { cycles: match?.[1], remaining: match?.[2] };
}

function terminalLabel(question: Cp010Question, language: Language): string {
  const index = question.solution?.terminalSegmentIndex;
  const segment = index === undefined ? undefined : question.parameters?.cycle?.[index];
  if (!segment) return t(language, ["terminal segment", "अंतिम हिस्सा", "ਅੰਤਿਮ ਹਿੱਸਾ"]);
  return language === "en" ? segment.label : cp010Label(segment.label, language);
}

function cycleSteps(question: Cp010Question, language: Language): string[] {
  const solution = question.solution!;
  const first = cleanMath(solution.workedLatex[0] ?? "").expression;
  const facts = cycleFacts(solution);
  const cycles = facts.cycles ?? "?";
  const remaining = facts.remaining ?? "?";
  const mode = question.solveMode ?? "";
  const label = terminalLabel(question, language);
  const answer = cleanAnswer(solution.answerText, language);
  const steps = [
    `${t(language, ["Net change in one full cycle", "एक पूरे चक्र में शुद्ध स्तर परिवर्तन", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਸ਼ੁੱਧ ਪੱਧਰ ਬਦਲਾਅ"])}: ${math(first)}${punctuation(language)}`,
    `${t(language, ["Safe complete cycles before the terminal cycle", "अंतिम चक्र से पहले सुरक्षित पूरे चक्र", "ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ"])} = ${cycles}; ${t(language, ["level still required", "अभी बचा स्तर", "ਹਾਲੇ ਲੋੜੀਂਦਾ ਪੱਧਰ"])} = ${math(remaining)}${punctuation(language)}`,
  ];

  if (mode === "findFullCycleCountToBoundary") {
    steps.push(`${t(language, ["The next cycle is the terminal cycle, so the required complete-cycle count is", "अगला चक्र अंतिम चक्र है, इसलिए पूरे चक्रों की आवश्यक संख्या", "ਅਗਲਾ ਚੱਕਰ ਅੰਤਿਮ ਚੱਕਰ ਹੈ, ਇਸ ਲਈ ਪੂਰੇ ਚੱਕਰਾਂ ਦੀ ਲੋੜੀਂਦੀ ਗਿਣਤੀ"])} ${cycles}${punctuation(language)}`);
    return steps;
  }
  if (mode === "findTerminalActiveSegment") {
    steps.push(`${t(language, ["Testing the next segments in order, the tank first reaches the boundary during", "अगले हिस्सों को क्रम से जाँचने पर टंकी पहली बार इस हिस्से में सीमा तक पहुँचती है", "ਅਗਲੇ ਹਿੱਸਿਆਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਜਾਂਚਣ ਤੇ ਟੈਂਕੀ ਪਹਿਲੀ ਵਾਰ ਇਸ ਹਿੱਸੇ ਵਿੱਚ ਹੱਦ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ"])} ${label}${punctuation(language)}`);
    return steps;
  }

  steps.push(`${t(language, ["The boundary is reached during", "सीमा इस हिस्से में मिलती है", "ਹੱਦ ਇਸ ਹਿੱਸੇ ਵਿੱਚ ਮਿਲਦੀ ਹੈ"])} ${label}; ${t(language, ["total time", "कुल समय", "ਕੁੱਲ ਸਮਾਂ"])} = ${answer}${punctuation(language)}`);
  return steps;
}

function eventInverseSteps(question: Cp010Question, language: Language): string[] {
  const solution = question.solution!;
  const equation = cleanMath(solution.workedLatex[1] ?? "").expression;
  const x = solution.answerValues[0] ? toLatex(solution.answerValues[0]) : "x";
  return [
    t(language, ["Let x be the number of hours from the start until the change.", "शुरू से बदलाव तक का समय x घंटे मानें।", "ਸ਼ੁਰੂ ਤੋਂ ਬਦਲਾਅ ਤੱਕ ਦਾ ਸਮਾਂ x ਘੰਟੇ ਮੰਨੋ।"]),
    `${t(language, ["Using the two stages and the known completion time", "दोनों चरणों और ज्ञात कुल समय से", "ਦੋਵੇਂ ਪੜਾਵਾਂ ਅਤੇ ਪਤਾ ਕੁੱਲ ਸਮੇਂ ਤੋਂ"])}: ${math(equation)}${punctuation(language)}`,
    `${t(language, ["Solving gives", "हल करने पर", "ਹੱਲ ਕਰਨ ਤੇ"])} ${math(`x=${x}`)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}${punctuation(language)}`,
  ];
}

function finalRateSteps(question: Cp010Question, language: Language): string[] {
  const solution = question.solution!;
  const raws = solution.workedLatex.slice(0, 3).map((raw) => cleanMath(raw).expression);
  return [
    `${t(language, ["Work completed in the first stage", "पहले चरण में भरा भाग", "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਭਰਿਆ ਹਿੱਸਾ"])}: ${math(raws[0] ?? "")}${punctuation(language)}`,
    `${t(language, ["Remaining work and remaining time", "बचा भाग और बचा समय", "ਬਾਕੀ ਹਿੱਸਾ ਅਤੇ ਬਾਕੀ ਸਮਾਂ"])}: ${math(raws[1] ?? "")}${punctuation(language)}`,
    `${t(language, ["Required rate of the final inlet", "अंतिम भराव पाइप की आवश्यक दर", "ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦੀ ਲੋੜੀਂਦੀ ਦਰ"])}: ${math(raws[2] ?? "")} ${t(language, ["tank/hour", "टंकी/घंटा", "ਟੈਂਕੀ/ਘੰਟਾ"])}${punctuation(language)}`,
  ];
}

function capacitySteps(question: Cp010Question, language: Language): string[] {
  const solution = question.solution!;
  return solution.workedLatex.slice(0, 3).map((raw, index) => {
    const cleaned = cleanMath(raw);
    const lead = index < 2
      ? `${t(language, ["Stage volume", "चरण का आयतन", "ਪੜਾਅ ਦਾ ਆਇਤਨ"])} ${index + 1}`
      : t(language, ["Total tank capacity", "टंकी की कुल क्षमता", "ਟੈਂਕੀ ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ"]);
    return `${lead}: ${math(cleaned.expression)} ${t(language, ["litres", "लीटर", "ਲੀਟਰ"])}${punctuation(language)}`;
  });
}

function controllerSteps(question: Cp010Question, language: Language): string[] {
  const solution = question.solution!;
  const hit = question.parameters?.levelControl?.targetUpperHits ?? 1;
  const raws = solution.workedLatex.slice(0, 3).map((raw) => cleanMath(raw).expression);
  return [
    `${t(language, ["Upper-to-lower time", "ऊपरी से निचले स्तर का समय", "ਉੱਪਰਲੇ ਤੋਂ ਹੇਠਲੇ ਪੱਧਰ ਦਾ ਸਮਾਂ"])}: ${math(raws[0] ?? "")}${punctuation(language)}`,
    `${t(language, ["Lower-to-upper return time", "निचले से ऊपरी स्तर की वापसी का समय", "ਹੇਠਲੇ ਤੋਂ ਉੱਪਰਲੇ ਪੱਧਰ ਦੀ ਵਾਪਸੀ ਦਾ ਸਮਾਂ"])}: ${math(raws[1] ?? "")}${punctuation(language)}`,
    `${t(language, ["For the required number of returns", "माँगी गई वापसी की संख्या के लिए", "ਮੰਗੀਆਂ ਵਾਪਸੀਆਂ ਦੀ ਗਿਣਤੀ ਲਈ"])} (${hit}): ${math(raws[2] ?? "")} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}${punctuation(language)}`,
  ];
}

function deadlineSteps(question: Cp010Question, language: Language): string[] {
  const solution = question.solution!;
  const requiredRaw = cleanMath(solution.workedLatex[0] ?? "").expression;
  const oldTime = question.parameters?.adjustmentBaseDuration ? toLatex(question.parameters.adjustmentBaseDuration) : "x_{old}";
  const delta = solution.answerValues[0] ? toLatex(solution.answerValues[0]) : "\\Delta";
  const direction = question.parameters?.adjustmentDirection === "EARLIER"
    ? t(language, ["earlier", "पहले", "ਪਹਿਲਾਂ"])
    : t(language, ["later", "बाद", "ਬਾਅਦ"]);
  return [
    `${t(language, ["Change time required by the deadline", "समय-सीमा के लिए आवश्यक बदलाव समय", "ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦਾ ਬਦਲਾਅ ਸਮਾਂ"])}: ${math(requiredRaw)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}${punctuation(language)}`,
    `${t(language, ["Originally planned change time", "मूल नियोजित बदलाव समय", "ਮੂਲ ਯੋਜਿਤ ਬਦਲਾਅ ਸਮਾਂ"])}: ${math(`x_{old}=${oldTime}`)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}${punctuation(language)}`,
    `${t(language, ["Required adjustment", "आवश्यक बदलाव", "ਲੋੜੀਂਦਾ ਬਦਲਾਅ"])}: ${math(`\\Delta=${delta}`)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])} ${direction}${punctuation(language)}`,
  ];
}

function cleanAnswer(value: string, language: Language): string {
  if (language === "hi") return value.replace(/बाद में/g, "बाद").trim();
  if (language === "pa") return value.replace(/ਬਾਅਦ ਵਿੱਚ/g, "ਬਾਅਦ").trim();
  return value.trim();
}

function answerLine(question: Cp010Question, language: Language): string {
  const mode = question.solveMode ?? "";
  const answer = cleanAnswer(question.solution?.answerText ?? question.learnerExplanation?.answer ?? "", language);
  const count = question.solution?.answerValues[0]?.numerator;
  if (mode === "findFinalLevelAfterStagedSchedule") {
    return t(language, [`Therefore, the final tank level is ${answer}.`, `अतः अंत में टंकी ${answer} है।`, `ਇਸ ਲਈ ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ${answer} ਹੈ।`]);
  }
  if (mode === "findEventTimeFromKnownCompletion") {
    return t(language, [`Therefore, the change occurred after ${answer}.`, `अतः बदलाव शुरू से ${answer} बाद हुआ।`, `ਇਸ ਲਈ ਬਦਲਾਅ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਬਾਅਦ ਹੋਇਆ।`]);
  }
  if (mode === "findRequiredFinalStageRate") {
    return t(language, [`Therefore, the required final-inlet rate is ${answer}.`, `अतः अंतिम भराव पाइप की आवश्यक दर ${answer} है।`, `ਇਸ ਲਈ ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦੀ ਲੋੜੀਂਦੀ ਦਰ ${answer} ਹੈ।`]);
  }
  if (mode === "findCapacityFromStagedPhysicalFlows") {
    return t(language, [`Therefore, the tank capacity is ${answer}.`, `अतः टंकी की क्षमता ${answer} है।`, `ਇਸ ਲਈ ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ${answer} ਹੈ।`]);
  }
  if (mode === "findFullCycleCountToBoundary") {
    const n = count ?? answer;
    return t(language, [`Therefore, ${n} complete cycles finish before the terminal cycle.`, `अतः अंतिम अपूर्ण चक्र से पहले ${n} पूरे चक्र समाप्त होते हैं।`, `ਇਸ ਲਈ ਅੰਤਿਮ ਅਧੂਰੇ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ${n} ਪੂਰੇ ਚੱਕਰ ਮੁਕੰਮਲ ਹੁੰਦੇ ਹਨ।`]);
  }
  if (mode === "findTerminalActiveSegment") {
    return t(language, [`Therefore, the terminal segment is ${answer}.`, `अतः टंकी ${answer} में पहली बार पूरी भरती है।`, `ਇਸ ਲਈ ਟੈਂਕੀ ${answer} ਵਿੱਚ ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਭਰਦੀ ਹੈ।`]);
  }
  if (mode === "findScheduleAdjustmentForDeadline") {
    return t(language, [`Therefore, the schedule change must be ${answer}.`, `अतः बदलाव को ${answer} करना होगा।`, `ਇਸ ਲਈ ਬਦਲਾਅ ਨੂੰ ${answer} ਕਰਨਾ ਹੋਵੇਗਾ।`]);
  }
  if (mode === "findAutomaticLevelControlCompletion") {
    return t(language, [`Therefore, the required controller-return time is ${answer}.`, `अतः माँगी गई वापसी तक समय ${answer} है।`, `ਇਸ ਲਈ ਮੰਗੀ ਵਾਪਸੀ ਤੱਕ ਸਮਾਂ ${answer} ਹੈ।`]);
  }
  return t(language, [`Therefore, the required total time is ${answer}.`, `अतः आवश्यक कुल समय ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਕੁੱਲ ਸਮਾਂ ${answer} ਹੈ।`]);
}

function buildSolution(question: Cp010Question, language: Language): string[] {
  const mode = question.solveMode ?? "";
  if (!question.solution) return question.learnerExplanation?.solution ?? [];
  if (["findCompletionWithAlternatingPipes", "findCompletionWithPeriodicSchedule", "findCompletionFromArbitraryCyclePhase", "findFullCycleCountToBoundary", "findTerminalActiveSegment", "findBoundaryEventTimeUnderSchedule"].includes(mode)) {
    return cycleSteps(question, language);
  }
  if (mode === "findEventTimeFromKnownCompletion") return eventInverseSteps(question, language);
  if (mode === "findRequiredFinalStageRate") return finalRateSteps(question, language);
  if (mode === "findCapacityFromStagedPhysicalFlows") return capacitySteps(question, language);
  if (mode === "findAutomaticLevelControlCompletion") return controllerSteps(question, language);
  if (mode === "findScheduleAdjustmentForDeadline") return deadlineSteps(question, language);
  return standardSteps(question.solution, language);
}

function containsBrokenScheduleProse(stem: string): boolean {
  return /चलती है[^।;?]*चलता है|चलते हैं[^।;?]*चलता है|चलती है हो जाती है|चलती है चालू करता है|ਚੱਲਦੀ ਹੈ[^।;?]*ਚੱਲਦਾ ਹੈ|ਚੱਲਦੇ ਹਨ[^।;?]*ਚੱਲਦਾ ਹੈ|ਚੱਲਦੀ ਹੈ ਹੋ ਜਾਂਦੀ ਹੈ|ਚੱਲਦੀ ਹੈ ਚਾਲੂ ਕਰਦਾ ਹੈ/u.test(stem);
}

export function finalizeTmwCp010MultilingualEditorialReview(question: Cp010Question, language: Language): Cp010Question {
  const cp = question.canonicalProblemId ?? question.cpId ?? "";
  if (cp !== "TMW-CP-010" || !question.learnerExplanation) return question;

  const mode = question.solveMode ?? "";
  const learner: TmwLearnerExplanationV2 = {
    ...question.learnerExplanation,
    method: t(language, METHODS[mode] ?? [question.learnerExplanation.method, question.learnerExplanation.method, question.learnerExplanation.method]),
    solution: buildSolution(question, language).slice(0, 5),
    answer: answerLine(question, language),
  };
  const stem = polishStem(question, language);
  const editorialErrors = validateTmwLearnerExplanationV2(learner);
  if (containsBrokenScheduleProse(stem)) editorialErrors.push("Broken staged-schedule agreement remains in stem");
  if (/\\text\{(?:Stage|Complete cycles before|level still required|completion occurs|terminal segment)/i.test(learner.solution.join(" "))) {
    editorialErrors.push("Internal schedule prose remains inside learner MathJax");
  }
  if (/घंटा\\\) घंटे|ਘੰਟਾ\\\) ਘੰਟੇ/u.test(learner.solution.join(" "))) editorialErrors.push("Segment label is incorrectly presented as a duration");
  if (mode === "findRequiredFinalStageRate" && language !== "en" && !/अज्ञात अंतिम भराव पाइप|ਅਣਜਾਣ ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ/u.test(stem)) {
    editorialErrors.push("Unknown final-stage rate target is ambiguous in localized stem");
  }
  if (mode === "findAutomaticLevelControlCompletion" && language !== "en" && /\d+(?:वीं|ਵੀਂ)/u.test(stem)) {
    editorialErrors.push("Numeric ordinal remains in controller stem");
  }

  const inherited = question.validation?.errors ?? [];
  const errors = [
    ...inherited.filter((error) => !error.startsWith("CP010 editorial review:")),
    ...editorialErrors.map((error) => `CP010 editorial review: ${error}`),
  ];

  return {
    ...question,
    stem,
    learnerExplanation: learner,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
