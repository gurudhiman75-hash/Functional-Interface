import {
  validateTmwLearnerExplanationV2,
  type TmwLearnerExplanationV2,
} from "./learner-explanation-contract";
import type { TmwLocalizedLanguage } from "./localization-types";

export type TmwR2LearnerLanguage = "en" | TmwLocalizedLanguage;

interface LegacyExplanationShape {
  opening?: string;
  steps?: string[];
  conclusion?: string;
  commonTrap?: { explanation?: string };
}

interface R2LearnerQuestion {
  canonicalProblemId?: string;
  questionLanguageId?: string;
  solveMode?: string;
  solution?: {
    answerText?: string;
    workedLatex?: string[];
  };
  explanation?: LegacyExplanationShape;
  validation?: {
    valid: boolean;
    errors: string[];
  };
  publiclyPublishable?: boolean;
}

const R2_MAX_QL = 127;

function qlOrdinal(qlId: string): number | null {
  const match = /^TMW-QL-(\d{3})$/.exec(qlId);
  return match ? Number(match[1]) : null;
}

function answerText(question: R2LearnerQuestion): string {
  return question.solution?.answerText?.trim() || "the stated answer";
}

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?।]+$/u, "");
}

function lowerInitialEnglish(value: string): string {
  if (!value) return value;
  return `${value[0].toLowerCase()}${value.slice(1)}`;
}

function firstSentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const match = /^(.+?[.!?।])(?:\s|$)/u.exec(trimmed);
  return stripTerminalPunctuation(match?.[1] ?? trimmed);
}

export function normalizeTmwLearnerDisplayTextR2(value: string): string {
  let normalized = value.trim();
  let previous = "";
  while (normalized !== previous) {
    previous = normalized;
    normalized = normalized.replace(
      /\\\(([\s\S]*?)\\(?:;|,|quad|qquad)?\\text\{([^{}]+)\}([\s\S]*?)\\\)/g,
      (_full, before: string, label: string, after: string) => {
        const math = `${before}${after}`.trim().replace(/\\[;,]\s*$/u, "");
        const text = label.trim();
        if (!math) return text;
        return `\\(${math}\\) ${text}`;
      },
    );
  }
  return normalized.replace(/\s{2,}/g, " ").trim();
}

function learnerAnswerText(question: R2LearnerQuestion): string {
  return normalizeTmwLearnerDisplayTextR2(answerText(question));
}

function hasUnsafeLearnerNotation(value: string): boolean {
  return /_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/u.test(value)
    || /_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u.test(value)
    || /\\text\{/u.test(value);
}

function methodLead(question: R2LearnerQuestion, language: TmwR2LearnerLanguage): string {
  const cp = question.canonicalProblemId ?? "";
  const mode = question.solveMode ?? "";

  if (cp === "TMW-CP-001") {
    if (/Delay|TimeSaved/i.test(mode)) {
      return language === "hi"
        ? "दर और समय के व्युत्क्रम संबंध का उपयोग करें"
        : language === "pa"
          ? "ਦਰ ਅਤੇ ਸਮੇਂ ਦੇ ਉਲਟ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰੋ"
          : "Use the inverse rate-time relation";
    }
    if (/compare/i.test(mode)) {
      return language === "hi"
        ? "दोनों स्थितियों की समान आधार पर सीधी तुलना करें"
        : language === "pa"
          ? "ਦੋਵੇਂ ਹਾਲਤਾਂ ਦੀ ਇੱਕੋ ਅਧਾਰ ਉੱਤੇ ਸਿੱਧੀ ਤੁਲਨਾ ਕਰੋ"
          : "Compare the two cases on the same rate-time basis";
    }
    if (/Fraction|Whole|Part|TimeForGivenPercent/i.test(mode)) {
      return language === "hi"
        ? "पूरे काम को 1 मानकर दर–समय संबंध लगाएँ"
        : language === "pa"
          ? "ਪੂਰੇ ਕੰਮ ਨੂੰ 1 ਮੰਨ ਕੇ ਦਰ–ਸਮਾਂ ਸੰਬੰਧ ਲਗਾਓ"
          : "Treat the whole work as 1 and use the rate-time relation";
    }
    return language === "hi"
      ? "सीधे काम = दर × समय संबंध का उपयोग करें"
      : language === "pa"
        ? "ਸਿੱਧਾ ਕੰਮ = ਦਰ × ਸਮਾਂ ਸੰਬੰਧ ਵਰਤੋ"
        : "Use the direct work = rate × time relation";
  }

  if (cp === "TMW-CP-002") {
    if (/Pairwise/i.test(mode)) {
      return language === "hi"
        ? "जोड़ी की दरों को जोड़कर आवश्यक व्यक्तिगत या संयुक्त दर निकालें"
        : language === "pa"
          ? "ਜੋੜਿਆਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜ ਕੇ ਲੋੜੀਂਦੀ ਵਿਅਕਤੀਗਤ ਜਾਂ ਸਾਂਝੀ ਦਰ ਕੱਢੋ"
          : "Use the pairwise rates to isolate the required individual or combined rate";
    }
    if (/Destructive|Signed|Rework/i.test(mode)) {
      return language === "hi"
        ? "उत्पादक दरें जोड़ें और दोबारा होने वाले काम की दर घटाएँ"
        : language === "pa"
          ? "ਉਤਪਾਦਕ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਮੁੜ ਹੋਣ ਵਾਲੇ ਕੰਮ ਦੀ ਦਰ ਘਟਾਓ"
          : "Add productive rates and subtract the rework rate";
    }
    if (/Identical/i.test(mode)) {
      return language === "hi"
        ? "एक इकाई की दर को समान इकाइयों की संख्या से गुणा करें"
        : language === "pa"
          ? "ਇੱਕ ਇਕਾਈ ਦੀ ਦਰ ਨੂੰ ਇੱਕੋ ਜਿਹੀਆਂ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ"
          : "Scale one unit's rate by the number of identical units";
    }
    if (/Output|Rate/i.test(mode)) {
      return language === "hi"
        ? "दी गई उत्पादन दरों को चिन्ह सहित जोड़कर कुल दर निकालें"
        : language === "pa"
          ? "ਦਿੱਤੀਆਂ ਉਤਪਾਦਨ ਦਰਾਂ ਨੂੰ ਨਿਸ਼ਾਨ ਸਮੇਤ ਜੋੜ ਕੇ ਕੁੱਲ ਦਰ ਕੱਢੋ"
          : "Combine the stated output rates with the correct signs";
    }
    return language === "hi"
      ? "हर व्यक्ति की एक-इकाई समय की दर निकालकर दरें जोड़ें"
      : language === "pa"
        ? "ਹਰ ਵਿਅਕਤੀ ਦੀ ਇੱਕ-ਇਕਾਈ ਸਮੇਂ ਦੀ ਦਰ ਕੱਢ ਕੇ ਦਰਾਂ ਜੋੜੋ"
        : "Convert the individual times to unit rates and add the rates";
  }

  if (cp === "TMW-CP-003") {
    if (/CombinedTime/i.test(mode)) {
      return language === "hi"
        ? "दक्षता अनुपात को दर अनुपात मानकर संयुक्त दर बनाएँ"
        : language === "pa"
          ? "ਦੱਖਤਾ ਅਨੁਪਾਤ ਨੂੰ ਦਰ ਅਨੁਪਾਤ ਮੰਨ ਕੇ ਸਾਂਝੀ ਦਰ ਬਣਾਓ"
          : "Treat the efficiency ratio as a rate ratio and form the combined rate";
    }
    if (/Successive/i.test(mode)) {
      return language === "hi"
        ? "लगातार दिए दक्षता अनुपातों को एक सामान्य अनुपात में जोड़ें"
        : language === "pa"
          ? "ਲਗਾਤਾਰ ਦਿੱਤੇ ਦੱਖਤਾ ਅਨੁਪਾਤਾਂ ਨੂੰ ਇੱਕ ਸਾਂਝੇ ਅਨੁਪਾਤ ਵਿੱਚ ਜੋੜੋ"
          : "Chain the successive efficiency ratios into one common ratio";
    }
    if (/Output|Work/i.test(mode)) {
      return language === "hi"
        ? "काम की तुलना के लिए दक्षता × समय का अनुपात लें"
        : language === "pa"
          ? "ਕੰਮ ਦੀ ਤੁਲਨਾ ਲਈ ਦੱਖਤਾ × ਸਮਾਂ ਦਾ ਅਨੁਪਾਤ ਲਓ"
          : "Compare work through the efficiency × time ratio";
    }
    return language === "hi"
      ? "समान काम के लिए दक्षता और समय के व्युत्क्रम संबंध का उपयोग करें"
      : language === "pa"
        ? "ਇੱਕੋ ਕੰਮ ਲਈ ਦੱਖਤਾ ਅਤੇ ਸਮੇਂ ਦੇ ਉਲਟ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰੋ"
        : "Use the inverse relation between efficiency and time for the same work";
  }

  if (cp === "TMW-CP-004") {
    if (/Unknown|JoinTime|LeaveTime|EventTime|RequiredRemaining/i.test(mode)) {
      return language === "hi"
        ? "काम को चरणों में बाँटकर अंतिम स्थिति से पीछे की ओर हिसाब करें"
        : language === "pa"
          ? "ਕੰਮ ਨੂੰ ਪੜਾਵਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਅੰਤਿਮ ਹਾਲਤ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਹਿਸਾਬ ਕਰੋ"
          : "Use a stage ledger and work backward from the final condition";
    }
    if (/Negative/i.test(mode)) {
      return language === "hi"
        ? "हर चरण की शुद्ध दर लिखें और नकारात्मक काम को घटाएँ"
        : language === "pa"
          ? "ਹਰ ਪੜਾਅ ਦੀ ਸ਼ੁੱਧ ਦਰ ਲਿਖੋ ਅਤੇ ਨਕਾਰਾਤਮਕ ਕੰਮ ਨੂੰ ਘਟਾਓ"
          : "Track the net rate in each stage and subtract negative work";
    }
    if (/WorkerCount|Workforce/i.test(mode)) {
      return language === "hi"
        ? "हर चरण के श्रमिक-दिन लिखकर शेष काम के लिए कर्मचारी संख्या निकालें"
        : language === "pa"
          ? "ਹਰ ਪੜਾਅ ਦੇ ਮਜ਼ਦੂਰ-ਦਿਨ ਲਿਖ ਕੇ ਬਾਕੀ ਕੰਮ ਲਈ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ"
          : "Use worker-days for each stage and solve the workforce change from the remaining work";
    }
    return language === "hi"
      ? "समय-रेखा बनाकर हर चरण का किया काम अलग-अलग जोड़ें"
      : language === "pa"
        ? "ਸਮਾਂ-ਰੇਖਾ ਬਣਾ ਕੇ ਹਰ ਪੜਾਅ ਦਾ ਕੀਤਾ ਕੰਮ ਵੱਖ-ਵੱਖ ਜੋੜੋ"
        : "Use a stage timeline and account for the work done in each phase";
  }

  if (cp === "TMW-CP-005") {
    if (/Unknown|RequiredCycleRate|Deadline/i.test(mode)) {
      return language === "hi"
        ? "एक पूरे चक्र का काम निकालकर अज्ञात दर या समय को शेष काम से हल करें"
        : language === "pa"
          ? "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਕੰਮ ਕੱਢ ਕੇ ਅਣਜਾਣ ਦਰ ਜਾਂ ਸਮਾਂ ਬਾਕੀ ਕੰਮ ਤੋਂ ਹੱਲ ਕਰੋ"
          : "Find one complete cycle's work, then solve the unknown from the remaining work";
    }
    if (/Rest|Weekend|Holiday|TwoDaysOn/i.test(mode)) {
      return language === "hi"
        ? "काम और विश्राम दोनों दिनों को शामिल करके पूरा कैलेंडर चक्र बनाएँ"
        : language === "pa"
          ? "ਕੰਮ ਅਤੇ ਆਰਾਮ ਦੋਵੇਂ ਦਿਨ ਸ਼ਾਮਲ ਕਰਕੇ ਪੂਰਾ ਕੈਲੰਡਰ ਚੱਕਰ ਬਣਾਓ"
          : "Build the full calendar cycle, including zero-work rest days";
    }
    if (/Negative/i.test(mode)) {
      return language === "hi"
        ? "चक्र में सकारात्मक काम जोड़ें और उलटा हुआ काम घटाएँ"
        : language === "pa"
          ? "ਚੱਕਰ ਵਿੱਚ ਸਕਾਰਾਤਮਕ ਕੰਮ ਜੋੜੋ ਅਤੇ ਉਲਟਿਆ ਕੰਮ ਘਟਾਓ"
          : "Add positive work and subtract undone work within each cycle";
    }
    if (/OutputUnderPeriodic/i.test(mode)) {
      return language === "hi"
        ? "हर मशीन का प्रति चक्र उत्पादन जोड़कर चक्रों की संख्या से गुणा करें"
        : language === "pa"
          ? "ਹਰ ਮਸ਼ੀਨ ਦਾ ਪ੍ਰਤੀ ਚੱਕਰ ਉਤਪਾਦਨ ਜੋੜ ਕੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ"
          : "Add each machine's output for one cycle and multiply by the number of cycles";
    }
    return language === "hi"
      ? "एक पूरा चक्र निकालें, पूरे चक्र दोहराएँ और अंतिम अधूरा भाग अलग हल करें"
      : language === "pa"
        ? "ਇੱਕ ਪੂਰਾ ਚੱਕਰ ਕੱਢੋ, ਪੂਰੇ ਚੱਕਰ ਦੁਹਰਾਓ ਅਤੇ ਆਖਰੀ ਅਧੂਰਾ ਹਿੱਸਾ ਵੱਖ ਹੱਲ ਕਰੋ"
        : "Use a cycle table: repeat full cycles, then solve only the terminal segment";
  }

  if (cp === "TMW-CP-006") {
    if (/Dimensional/i.test(mode)) {
      return language === "hi"
        ? "पहले आयामों से काम का अनुपात निकालें, फिर संसाधन–समय संतुलन लगाएँ"
        : language === "pa"
          ? "ਪਹਿਲਾਂ ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਸਰੋਤ–ਸਮਾਂ ਸੰਤੁਲਨ ਲਗਾਓ"
          : "Find the dimensional work ratio first, then apply the resource-time balance";
    }
    if (/Population|ResourceDuration|Stock/i.test(mode)) {
      return language === "hi"
        ? "कुल उपलब्ध मात्रा को व्यक्ति-दिन में बदलकर नई जनसंख्या से भाग दें"
        : language === "pa"
          ? "ਕੁੱਲ ਉਪਲਬਧ ਮਾਤਰਾ ਨੂੰ ਵਿਅਕਤੀ-ਦਿਨਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਨਵੀਂ ਆਬਾਦੀ ਨਾਲ ਭਾਗ ਦਿਓ"
          : "Convert the stock to person-days and divide by the changed population";
    }
    if (/BatchWorkerAdditions/i.test(mode)) {
      return language === "hi"
        ? "हर दिन के श्रमिकों को श्रेणी की तरह जोड़कर आवश्यक श्रमिक-दिन से मिलाएँ"
        : language === "pa"
          ? "ਹਰ ਦਿਨ ਦੇ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਲੜੀ ਵਾਂਗ ਜੋੜ ਕੇ ਲੋੜੀਂਦੇ ਮਜ਼ਦੂਰ-ਦਿਨਾਂ ਨਾਲ ਮਿਲਾਓ"
          : "Sum the changing daily workforce as a series until the required worker-days are reached";
    }
    if (/Progress/i.test(mode)) {
      return language === "hi"
        ? "अब तक की वास्तविक प्रगति से वास्तविक दर निकालकर शेष काम पर लागू करें"
        : language === "pa"
          ? "ਹੁਣ ਤੱਕ ਦੀ ਅਸਲ ਤਰੱਕੀ ਤੋਂ ਅਸਲ ਦਰ ਕੱਢ ਕੇ ਬਾਕੀ ਕੰਮ ਉੱਤੇ ਲਗਾਓ"
          : "Use the observed progress to recover the actual rate, then apply it to the remaining work";
    }
    if (/Production|Shift|WorkQuantity/i.test(mode)) {
      return language === "hi"
        ? "प्रति संसाधन प्रति पाली उत्पादन से कुल उत्पादन क्षमता बनाएँ"
        : language === "pa"
          ? "ਪ੍ਰਤੀ ਸਰੋਤ ਪ੍ਰਤੀ ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ ਤੋਂ ਕੁੱਲ ਉਤਪਾਦਨ ਸਮਰੱਥਾ ਬਣਾਓ"
          : "Build total production from resources × shifts × output per resource";
    }
    return language === "hi"
      ? "संसाधन × दिन × दैनिक घंटे × दक्षता का संतुलन बनाएँ"
      : language === "pa"
        ? "ਸਰੋਤ × ਦਿਨ × ਰੋਜ਼ਾਨਾ ਘੰਟੇ × ਦੱਖਤਾ ਦਾ ਸੰਤੁਲਨ ਬਣਾਓ"
        : "Balance resources × days × daily hours × efficiency";
  }

  return language === "hi"
    ? "दिए गए मानों को सीधे आवश्यक संबंध में रखें"
    : language === "pa"
      ? "ਦਿੱਤੇ ਮੁੱਲਾਂ ਨੂੰ ਸਿੱਧਾ ਲੋੜੀਂਦੇ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖੋ"
      : "Use the direct relation required by the question";
}

function methodText(question: R2LearnerQuestion, language: TmwR2LearnerLanguage): string {
  const lead = methodLead(question, language);
  const opening = firstSentence(question.explanation?.opening ?? "");
  if (!opening || hasUnsafeLearnerNotation(opening)) return `${lead}.`;
  const clause = language === "en" ? lowerInitialEnglish(opening) : opening;
  return `${lead}: ${clause}.`;
}

function unwrapInlineMath(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("\\(") && trimmed.endsWith("\\)")) return trimmed.slice(2, -2).trim();
  return trimmed;
}

function isSafeNumericMathCandidate(value: string): boolean {
  if (!/\d/.test(value) || hasUnsafeLearnerNotation(value)) return false;
  const withoutCommands = value.replace(/\\[A-Za-z]+/g, "");
  return !/[A-Za-z\u0900-\u097F\u0A00-\u0A7F]/u.test(withoutCommands);
}

function safeMathFragment(value: string): string | null {
  const raw = unwrapInlineMath(value);
  if (!isSafeNumericMathCandidate(raw)) return null;
  return `\\(${raw}\\)`;
}

function recoverSafeEqualityFragment(value: string): string | null {
  const raw = unwrapInlineMath(value);
  const segments = raw.split("=").map((segment) => segment.trim()).filter(Boolean);
  for (let index = 1; index < segments.length; index += 1) {
    const candidate = segments[index];
    if (isSafeNumericMathCandidate(candidate)) return `\\(${candidate}\\)`;
  }
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const candidate = segments[index];
    if (isSafeNumericMathCandidate(candidate)) return `\\(${candidate}\\)`;
  }
  return null;
}

function learnerCalculations(question: R2LearnerQuestion): string[] {
  const source = Array.isArray(question.explanation?.steps)
    ? question.explanation?.steps ?? []
    : question.solution?.workedLatex ?? [];
  const calculations: string[] = [];
  for (const step of source) {
    const recovered = safeMathFragment(step) ?? recoverSafeEqualityFragment(step);
    if (recovered && !calculations.includes(recovered)) calculations.push(recovered);
    if (calculations.length === 3) break;
  }
  return calculations;
}

function setupSentence(question: R2LearnerQuestion, language: TmwR2LearnerLanguage): string {
  switch (question.canonicalProblemId) {
    case "TMW-CP-001":
      return language === "hi" ? "प्रश्न में दिए काम, दर और समय के मान रखें" : language === "pa" ? "ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਕੰਮ, ਦਰ ਅਤੇ ਸਮੇਂ ਦੇ ਮੁੱਲ ਰੱਖੋ" : "Substitute the work, rate and time values given in the question";
    case "TMW-CP-002":
      return language === "hi" ? "दिए समयों को दरों में बदलकर आवश्यक जोड़ या घटाव करें" : language === "pa" ? "ਦਿੱਤੇ ਸਮਿਆਂ ਨੂੰ ਦਰਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਲੋੜੀਂਦਾ ਜੋੜ ਜਾਂ ਘਟਾਓ ਕਰੋ" : "Convert the stated times to rates and combine them with the required signs";
    case "TMW-CP-003":
      return language === "hi" ? "दिए दक्षता, काम और समय का आवश्यक अनुपात लिखें" : language === "pa" ? "ਦਿੱਤੀ ਦੱਖਤਾ, ਕੰਮ ਅਤੇ ਸਮੇਂ ਦਾ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਲਿਖੋ" : "Write the required ratio using the stated efficiency, work and time values";
    case "TMW-CP-004":
      return language === "hi" ? "पहले चरण का काम निकालें और उसे पूरे काम से घटाएँ" : language === "pa" ? "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਪੂਰੇ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾਓ" : "Find the work completed in the first stage and subtract it from the whole work";
    case "TMW-CP-005":
      return language === "hi" ? "एक पूरे चक्र का काम और समय निकालें" : language === "pa" ? "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਕੰਮ ਅਤੇ ਸਮਾਂ ਕੱਢੋ" : "Find the work and time for one complete cycle";
    case "TMW-CP-006":
      return language === "hi" ? "दोनों स्थितियों के संसाधन–समय–दक्षता मान लिखें" : language === "pa" ? "ਦੋਵੇਂ ਹਾਲਤਾਂ ਦੇ ਸਰੋਤ–ਸਮਾਂ–ਦੱਖਤਾ ਮੁੱਲ ਲਿਖੋ" : "Write the resource-time-efficiency quantities for the two states";
    default:
      return language === "hi" ? "दिए मान आवश्यक संबंध में रखें" : language === "pa" ? "ਦਿੱਤੇ ਮੁੱਲ ਲੋੜੀਂਦੇ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖੋ" : "Substitute the given values in the required relation";
  }
}

function continueSentence(language: TmwR2LearnerLanguage): string {
  return language === "hi"
    ? "अब शेष गणना पूरी करें"
    : language === "pa"
      ? "ਹੁਣ ਬਾਕੀ ਗਣਨਾ ਪੂਰੀ ਕਰੋ"
      : "Continue the calculation with the remaining quantity";
}

function finalSentence(answer: string, language: TmwR2LearnerLanguage): string {
  return language === "hi"
    ? `सरलीकरण करने पर आवश्यक मान ${answer} मिलता है।`
    : language === "pa"
      ? `ਸਰਲ ਕਰਨ ਉੱਤੇ ਲੋੜੀਂਦਾ ਮੁੱਲ ${answer} ਮਿਲਦਾ ਹੈ।`
      : `After simplification, the required value is ${answer}.`;
}

function solutionSteps(question: R2LearnerQuestion, language: TmwR2LearnerLanguage): string[] {
  const calculations = learnerCalculations(question);
  const answer = learnerAnswerText(question);
  const result: string[] = [];

  if (calculations.length > 0) {
    result.push(`${setupSentence(question, language)}: ${calculations[0]}.`);
    for (const calculation of calculations.slice(1)) {
      result.push(`${continueSentence(language)}: ${calculation}.`);
    }
  } else {
    result.push(`${setupSentence(question, language)}.`);
  }

  result.push(finalSentence(answer, language));
  return result.slice(0, 5);
}

function answerSentence(question: R2LearnerQuestion, language: TmwR2LearnerLanguage): string {
  const conclusion = question.explanation?.conclusion?.trim();
  if (conclusion) return normalizeTmwLearnerDisplayTextR2(conclusion);
  const answer = learnerAnswerText(question);
  return language === "hi"
    ? `अतः उत्तर ${answer} है।`
    : language === "pa"
      ? `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`
      : `Therefore, the answer is ${answer}.`;
}

function buildLearnerExplanation(
  question: R2LearnerQuestion,
  language: TmwR2LearnerLanguage,
): TmwLearnerExplanationV2 {
  return {
    method: methodText(question, language),
    solution: solutionSteps(question, language),
    answer: answerSentence(question, language),
  };
}

function learnerPolicyErrors(value: TmwLearnerExplanationV2): string[] {
  const errors = validateTmwLearnerExplanationV2(value);
  const visible = [value.method, ...value.solution, value.answer].join(" ");
  if (/10[- ]Second|10[- ]सेकंड|10[- ]ਸੈਕਿੰਡ/i.test(visible)) errors.push("Learner V2 contains a generic 10-second claim");
  if (hasUnsafeLearnerNotation(visible)) errors.push("Learner V2 contains an unexplained word-based or localized subscript");
  if (/\bGivens\b|दिए गए मान:|ਦਿੱਤੇ ਮੁੱਲ:/i.test(visible)) errors.push("Learner V2 exposes a separate givens block");
  return errors;
}

export function applyTmw001LearnerExplanationR2Cp001To006<T extends R2LearnerQuestion>(
  question: T,
  qlId: string,
  language: TmwR2LearnerLanguage,
): T & {
  learnerExplanationVersion?: "TMW_LEARNER_V2";
  learnerExplanation?: TmwLearnerExplanationV2;
} {
  const ordinal = qlOrdinal(qlId);
  if (ordinal === null || ordinal < 1 || ordinal > R2_MAX_QL) return question;

  const learnerExplanation = buildLearnerExplanation(question, language);
  const learnerErrors = learnerPolicyErrors(learnerExplanation);
  const existingErrors = question.validation?.errors ?? [];
  const combinedErrors = [
    ...existingErrors,
    ...learnerErrors.map((error) => `Learner V2: ${error}`),
  ];

  return {
    ...question,
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation,
    validation: question.validation
      ? { valid: question.validation.valid && learnerErrors.length === 0, errors: combinedErrors }
      : question.validation,
    publiclyPublishable: false,
  };
}
