import { required } from "./cp001-helpers";
import { divide, formatRational } from "./rational";
import { ratioText } from "./cp003-solver";
import type { TmwCp003Parameters, TmwCp003SolveMode } from "./cp003-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import { formatLocalizedTime } from "./localization-glossary";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const agents: Record<string, { hi: string; pa: string }> = {
  operator: { hi: "ऑपरेटर", pa: "ਆਪਰੇਟਰ" },
  technician: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  clerk: { hi: "क्लर्क", pa: "ਕਲਰਕ" },
  machine: { hi: "मशीन", pa: "ਮਸ਼ੀਨ" },
  crew: { hi: "दल", pa: "ਟੀਮ" },
  packer: { hi: "पैकिंग कर्मी", pa: "ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ" },
  inspector: { hi: "निरीक्षक", pa: "ਜਾਂਚਕਰਤਾ" },
  typist: { hi: "टाइपिस्ट", pa: "ਟਾਈਪਿਸਟ" },
  painter: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  worker: { hi: "कर्मचारी", pa: "ਕਰਮਚਾਰੀ" },
  surveyor: { hi: "सर्वेक्षक", pa: "ਸਰਵੇਖਕ" },
  assembler: { hi: "असेंबली कर्मी", pa: "ਅਸੈਂਬਲੀ ਕਰਮਚਾਰੀ" },
};

const jobs: Record<string, { hi: string; pa: string }> = {
  "a batch of customer records": { hi: "ग्राहक रिकॉर्डों का बैच", pa: "ਗਾਹਕ ਰਿਕਾਰਡਾਂ ਦਾ ਬੈਚ" },
  "an equipment overhaul": { hi: "उपकरण की पूरी मरम्मत", pa: "ਉਪਕਰਣ ਦੀ ਪੂਰੀ ਮੁਰੰਮਤ" },
  "a set of loan applications": { hi: "ऋण आवेदनों का सेट", pa: "ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਦਾ ਸੈੱਟ" },
  "a printing order": { hi: "छपाई का ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਆਰਡਰ" },
  "a road-marking project": { hi: "सड़क पर निशान लगाने का काम", pa: "ਸੜਕ ਉੱਤੇ ਨਿਸ਼ਾਨ ਲਗਾਉਣ ਦਾ ਕੰਮ" },
  "a packaging order": { hi: "पैकिंग का ऑर्डर", pa: "ਪੈਕਿੰਗ ਦਾ ਆਰਡਰ" },
  "a quality-inspection batch": { hi: "गुणवत्ता-जाँच का बैच", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚ ਦਾ ਬੈਚ" },
  "the typing of a manuscript": { hi: "पांडुलिपि टाइप करने का काम", pa: "ਪਾਂਡੁਲਿਪੀ ਟਾਈਪ ਕਰਨ ਦਾ ਕੰਮ" },
  "a school-building painting project": { hi: "स्कूल भवन की पेंटिंग", pa: "ਸਕੂਲ ਦੀ ਇਮਾਰਤ ਨੂੰ ਰੰਗ ਕਰਨ ਦਾ ਕੰਮ" },
  "a warehouse inventory count": { hi: "गोदाम का स्टॉक गिनने का काम", pa: "ਗੋਦਾਮ ਦਾ ਸਟਾਕ ਗਿਣਨ ਦਾ ਕੰਮ" },
  "a field survey": { hi: "मैदानी सर्वेक्षण", pa: "ਮੈਦਾਨੀ ਸਰਵੇਖਣ" },
  "an electronics assembly order": { hi: "इलेक्ट्रॉनिक उपकरण जोड़ने का ऑर्डर", pa: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਉਪਕਰਣ ਜੋੜਨ ਦਾ ਆਰਡਰ" },
};

function agent(p: TmwCp003Parameters, language: TmwLocalizedLanguage, letter: "A" | "B"): string {
  return `${agents[p.context.agentNoun]?.[language] ?? p.context.agentNoun} ${letter}`;
}

function job(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  return jobs[p.context.jobPhrase]?.[language] ?? p.context.jobPhrase;
}

function time(p: TmwCp003Parameters, value: NonNullable<TmwCp003Parameters["timeA"]>, language: TmwLocalizedLanguage): string {
  return formatLocalizedTime(value, p.timeUnit, language);
}

function percentage(p: TmwCp003Parameters): string {
  return `${formatRational(required(p.percentAOverB, "percentAOverB"))}%`;
}

function efficiencyRatio(p: TmwCp003Parameters): string {
  return ratioText(divide(p.efficiencyA, p.efficiencyB));
}

function polishedStem(question: TmwLocalizedQuestion, language: TmwLocalizedLanguage): string {
  const p = question.parameters as TmwCp003Parameters;
  const mode = question.solveMode as TmwCp003SolveMode;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const assignment = job(p, language);

  switch (mode) {
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return copy(
        language,
        `${A} को ${assignment} पूरा करने में ${time(p, required(p.timeA, "timeA"), language)} और ${B} को ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A}, ${B} से कितने प्रतिशत अधिक कार्यक्षम है?`,
        `${A} ਨੂੰ ${assignment} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਅਤੇ ${B} ਨੂੰ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A}, ${B} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਕਾਰਗਰ ਹੈ?`,
      );
    case "findEfficiencyPercentLessFromCompletionTimes":
      return copy(
        language,
        `${A} को ${assignment} पूरा करने में ${time(p, required(p.timeA, "timeA"), language)} और ${B} को ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A}, ${B} से कितने प्रतिशत कम कार्यक्षम है?`,
        `${A} ਨੂੰ ${assignment} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਅਤੇ ${B} ਨੂੰ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A}, ${B} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਕਾਰਗਰ ਹੈ?`,
      );
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
      return copy(
        language,
        `${A}, ${B} से ${percentage(p)} अधिक कार्यक्षम है। ${B} को ${assignment} पूरा करने में ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A} को कितना समय लगेगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(p)} ਵੱਧ ਕਾਰਗਰ ਹੈ। ${B} ਨੂੰ ${assignment} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A} ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
      return copy(
        language,
        `${A}, ${B} से ${percentage(p)} अधिक कार्यक्षम है। ${A} को ${assignment} पूरा करने में ${time(p, required(p.timeA, "timeA"), language)} लगते हैं। ${B} को कितना समय लगेगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(p)} ਵੱਧ ਕਾਰਗਰ ਹੈ। ${A} ਨੂੰ ${assignment} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਲੱਗਦੇ ਹਨ। ${B} ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return copy(
        language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${efficiencyRatio(p)} है। दोनों मिलकर ${assignment} ${time(p, required(p.combinedTime, "combinedTime"), language)} में पूरा करते हैं। ${target} को अकेले कितना समय लगेगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${efficiencyRatio(p)} ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ${assignment} ${time(p, required(p.combinedTime, "combinedTime"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${target} ਨੂੰ ਇਕੱਲੇ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    }
    default:
      return question.stem;
  }
}

export function polishTmwCp003LocalizedQuestion(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  return {
    ...question,
    stem: polishedStem(question, language),
  };
}
