import { required } from "./cp001-helpers";
import { divide, formatRational, toMixedLatex } from "./rational";
import { ratioText } from "./cp003-solver";
import type { TmwCp003Parameters, TmwCp003SolveMode } from "./cp003-types";
import type { Rational } from "./types";
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

const taskActions: Record<string, { hi: string; pa: string }> = {
  "a batch of customer records": { hi: "ग्राहक रिकॉर्डों का बैच पूरा करने", pa: "ਗਾਹਕ ਰਿਕਾਰਡਾਂ ਦਾ ਬੈਚ ਪੂਰਾ ਕਰਨ" },
  "an equipment overhaul": { hi: "उपकरण की पूरी मरम्मत करने", pa: "ਉਪਕਰਣ ਦੀ ਪੂਰੀ ਮੁਰੰਮਤ ਕਰਨ" },
  "a set of loan applications": { hi: "ऋण आवेदनों का सेट पूरा करने", pa: "ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਦਾ ਸੈੱਟ ਪੂਰਾ ਕਰਨ" },
  "a printing order": { hi: "छपाई का ऑर्डर पूरा करने", pa: "ਛਪਾਈ ਦਾ ਆਰਡਰ ਪੂਰਾ ਕਰਨ" },
  "a road-marking project": { hi: "सड़क पर निशान लगाने", pa: "ਸੜਕ ਉੱਤੇ ਨਿਸ਼ਾਨ ਲਗਾਉਣ" },
  "a packaging order": { hi: "पैकिंग का ऑर्डर पूरा करने", pa: "ਪੈਕਿੰਗ ਦਾ ਆਰਡਰ ਪੂਰਾ ਕਰਨ" },
  "a quality-inspection batch": { hi: "गुणवत्ता-जाँच का बैच पूरा करने", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚ ਦਾ ਬੈਚ ਪੂਰਾ ਕਰਨ" },
  "the typing of a manuscript": { hi: "पांडुलिपि टाइप करने", pa: "ਪਾਂਡੁਲਿਪੀ ਟਾਈਪ ਕਰਨ" },
  "a school-building painting project": { hi: "स्कूल भवन को पेंट करने", pa: "ਸਕੂਲ ਦੀ ਇਮਾਰਤ ਨੂੰ ਰੰਗ ਕਰਨ" },
  "a warehouse inventory count": { hi: "गोदाम का स्टॉक गिनने", pa: "ਗੋਦਾਮ ਦਾ ਸਟਾਕ ਗਿਣਨ" },
  "a field survey": { hi: "मैदानी सर्वेक्षण पूरा करने", pa: "ਮੈਦਾਨੀ ਸਰਵੇਖਣ ਪੂਰਾ ਕਰਨ" },
  "an electronics assembly order": { hi: "इलेक्ट्रॉनिक उपकरण जोड़ने का ऑर्डर पूरा करने", pa: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਉਪਕਰਣ ਜੋੜਨ ਦਾ ਆਰਡਰ ਪੂਰਾ ਕਰਨ" },
};

const outputs: Record<string, { hi: string; pa: string }> = {
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ" },
  metres: { hi: "मीटर", pa: "ਮੀਟਰ" },
  cartons: { hi: "कार्टन", pa: "ਕਾਰਟਨ" },
  units: { hi: "इकाइयाँ", pa: "ਇਕਾਈਆਂ" },
  pages: { hi: "पृष्ठ", pa: "ਸਫ਼ੇ" },
  rooms: { hi: "कमरे", pa: "ਕਮਰੇ" },
  items: { hi: "वस्तुएँ", pa: "ਵਸਤੂਆਂ" },
  forms: { hi: "फॉर्म", pa: "ਫਾਰਮ" },
  devices: { hi: "उपकरण", pa: "ਉਪਕਰਣ" },
};

function agent(p: TmwCp003Parameters, language: TmwLocalizedLanguage, letter: "A" | "B" | "C"): string {
  return `${agents[p.context.agentNoun]?.[language] ?? p.context.agentNoun} ${letter}`;
}

function taskAction(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  return taskActions[p.context.jobPhrase]?.[language] ?? p.context.jobPhrase;
}

function output(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  return outputs[p.context.outputNoun]?.[language] ?? p.context.outputNoun;
}

function time(p: TmwCp003Parameters, value: Rational, language: TmwLocalizedLanguage): string {
  return formatLocalizedTime(value, p.timeUnit, language);
}

function percentText(value: Rational): string {
  if (value.denominator === 1) return `${value.numerator}%`;
  return `\\(${toMixedLatex(value)}\\%\\)`;
}

function efficiencyRatio(p: TmwCp003Parameters): string {
  return ratioText(divide(p.efficiencyA, p.efficiencyB));
}

function naturalStem(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = question.parameters as TmwCp003Parameters;
  const mode = question.solveMode as TmwCp003SolveMode;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const action = taskAction(p, language);
  const out = output(p, language);

  switch (mode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
      return copy(
        language,
        `${A} को ${action} में ${time(p, required(p.timeA, "timeA"), language)} और ${B} को उतना ही काम पूरा करने में ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A}:${B} की कार्यक्षमता का अनुपात ज्ञात कीजिए।`,
        `${A} ਨੂੰ ${action} ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਅਤੇ ${B} ਨੂੰ ਉਨਾ ਹੀ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
      );
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return copy(
        language,
        `${A} को ${action} में ${time(p, required(p.timeA, "timeA"), language)} और ${B} को ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A}, ${B} से कितने प्रतिशत अधिक कार्यक्षम है?`,
        `${A} ਨੂੰ ${action} ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਅਤੇ ${B} ਨੂੰ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A}, ${B} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਕਾਰਗਰ ਹੈ?`,
      );
    case "findEfficiencyPercentLessFromCompletionTimes":
      return copy(
        language,
        `${A} को ${action} में ${time(p, required(p.timeA, "timeA"), language)} और ${B} को ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A}, ${B} से कितने प्रतिशत कम कार्यक्षम है?`,
        `${A} ਨੂੰ ${action} ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਅਤੇ ${B} ਨੂੰ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A}, ${B} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਕਾਰਗਰ ਹੈ?`,
      );
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
      return copy(
        language,
        `${A}, ${B} से ${formatRational(required(p.percentAOverB, "percentAOverB"))}% अधिक कार्यक्षम है। ${B} को ${action} में ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A} को कितना समय लगेगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${formatRational(required(p.percentAOverB, "percentAOverB"))}% ਵੱਧ ਕਾਰਗਰ ਹੈ। ${B} ਨੂੰ ${action} ਵਿੱਚ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A} ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
      return copy(
        language,
        `${A}, ${B} से ${formatRational(required(p.percentAOverB, "percentAOverB"))}% अधिक कार्यक्षम है। ${A} को ${action} में ${time(p, required(p.timeA, "timeA"), language)} लगते हैं। ${B} को कितना समय लगेगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${formatRational(required(p.percentAOverB, "percentAOverB"))}% ਵੱਧ ਕਾਰਗਰ ਹੈ। ${A} ਨੂੰ ${action} ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਲੱਗਦੇ ਹਨ। ${B} ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return copy(
        language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${efficiencyRatio(p)} है। ${A} ${time(p, required(p.durationA, "durationA"), language)} और ${B} ${time(p, required(p.durationB, "durationB"), language)} तक काम करते हैं। किए गए काम का अनुपात ${A}:${B} क्या होगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${efficiencyRatio(p)} ਹੈ। ${A} ${time(p, required(p.durationA, "durationA"), language)} ਅਤੇ ${B} ${time(p, required(p.durationB, "durationB"), language)} ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੀ ਹੋਵੇਗਾ?`,
      );
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
      return copy(
        language,
        `${A} का ${time(p, required(p.timeA, "timeA"), language)} में किया गया काम ${formatRational(required(p.workA, "workA"))} इकाई है, जबकि ${B} का ${time(p, required(p.timeB, "timeB"), language)} में किया गया काम ${formatRational(required(p.workB, "workB"))} इकाई है। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`,
        `${A} ਵੱਲੋਂ ${time(p, required(p.timeA, "timeA"), language)} ਵਿੱਚ ਕੀਤਾ ਕੰਮ ${formatRational(required(p.workA, "workA"))} ਇਕਾਈ ਹੈ, ਜਦਕਿ ${B} ਵੱਲੋਂ ${time(p, required(p.timeB, "timeB"), language)} ਵਿੱਚ ਕੀਤਾ ਕੰਮ ${formatRational(required(p.workB, "workB"))} ਇਕਾਈ ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`,
      );
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
      return copy(
        language,
        `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${efficiencyRatio(p)} है। ${B} का उत्पादन ${formatRational(required(p.outputB, "outputB"))} ${out} है। ${A} का उत्पादन कितना होगा?`,
        `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${efficiencyRatio(p)} ਹੈ। ${B} ਦਾ ਉਤਪਾਦਨ ${formatRational(required(p.outputB, "outputB"))} ${out} ਹੈ। ${A} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
      return copy(
        language,
        `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${efficiencyRatio(p)} है। ${A} का उत्पादन ${formatRational(required(p.outputA, "outputA"))} ${out} है। ${B} का उत्पादन कितना होगा?`,
        `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${efficiencyRatio(p)} ਹੈ। ${A} ਦਾ ਉਤਪਾਦਨ ${formatRational(required(p.outputA, "outputA"))} ${out} ਹੈ। ${B} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return copy(
        language,
        `${A} का ${time(p, required(p.durationA, "durationA"), language)} में उत्पादन ${formatRational(required(p.outputA, "outputA"))} ${out} है, जबकि ${B} का ${time(p, required(p.durationB, "durationB"), language)} में उत्पादन ${formatRational(required(p.outputB, "outputB"))} ${out} है। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`,
        `${A} ਦਾ ${time(p, required(p.durationA, "durationA"), language)} ਵਿੱਚ ਉਤਪਾਦਨ ${formatRational(required(p.outputA, "outputA"))} ${out} ਹੈ, ਜਦਕਿ ${B} ਦਾ ${time(p, required(p.durationB, "durationB"), language)} ਵਿੱਚ ਉਤਪਾਦਨ ${formatRational(required(p.outputB, "outputB"))} ${out} ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`,
      );
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return copy(
        language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${efficiencyRatio(p)} है। ${B} का ${time(p, required(p.durationB, "durationB"), language)} में उत्पादन ${formatRational(required(p.outputB, "outputB"))} ${out} है। ${A} ${time(p, required(p.durationA, "durationA"), language)} में कितना उत्पादन करेगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${efficiencyRatio(p)} ਹੈ। ${B} ਦਾ ${time(p, required(p.durationB, "durationB"), language)} ਵਿੱਚ ਉਤਪਾਦਨ ${formatRational(required(p.outputB, "outputB"))} ${out} ਹੈ। ${A} ${time(p, required(p.durationA, "durationA"), language)} ਵਿੱਚ ਕਿੰਨਾ ਉਤਪਾਦਨ ਕਰੇਗਾ?`,
      );
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return copy(
        language,
        `कार्यक्षमता बढ़ने के बाद ${action} में लगने वाला समय ${time(p, required(p.originalTime, "originalTime"), language)} से घटकर ${time(p, required(p.changedTime, "changedTime"), language)} हो जाता है। कार्यक्षमता कितने प्रतिशत बढ़ी?`,
        `ਕਾਰਗੁਜ਼ਾਰੀ ਵਧਣ ਤੋਂ ਬਾਅਦ ${action} ਵਿੱਚ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ${time(p, required(p.originalTime, "originalTime"), language)} ਤੋਂ ਘਟ ਕੇ ${time(p, required(p.changedTime, "changedTime"), language)} ਹੋ ਜਾਂਦਾ ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਧੀ?`,
      );
    default:
      return question.stem;
  }
}

function naturalTitle(mode: TmwCp003SolveMode, language: TmwLocalizedLanguage, current: string): string {
  if (mode === "findFasterTimeFromSlowerTimeAndPercentMoreEfficient") return copy(language, "10-सेकंड कम समय", "10-ਸਕਿੰਟ ਘੱਟ ਸਮਾਂ");
  if (mode === "findSlowerTimeFromFasterTimeAndPercentMoreEfficient") return copy(language, "10-सेकंड अधिक समय", "10-ਸਕਿੰਟ ਵੱਧ ਸਮਾਂ");
  if (mode === "findSuccessiveEfficiencyRatioAcrossThreeAgents") return copy(language, "10-सेकंड अनुपात श्रृंखला", "10-ਸਕਿੰਟ ਅਨੁਪਾਤ ਲੜੀ");
  return current.replaceAll("आउटपुट", "उत्पादन");
}

export function finalizeTmwCp003LocalizedQuestion(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const p = question.parameters as TmwCp003Parameters;
  const mode = question.solveMode as TmwCp003SolveMode;
  const oldAnswerText = question.solution.answerText;
  let answerText = oldAnswerText;
  let optionAudit = question.optionAudit;
  let options = question.options;
  let commonTrap = question.explanation.commonTrap;

  if (question.solution.answerType === "PERCENT") {
    optionAudit = question.optionAudit.map((option) => ({ ...option, text: percentText(option.value) }));
    options = optionAudit.map((option) => option.text);
    answerText = percentText(question.solution.answer);
    const trapIndex = optionAudit.findIndex((option) => option.misconceptionId === commonTrap.misconceptionId);
    commonTrap = { ...commonTrap, optionText: options[trapIndex] ?? options[0] ?? "" };
  }

  let opening = question.explanation.opening;
  if (mode === "findSuccessiveEfficiencyRatioAcrossThreeAgents") {
    opening = copy(language, "दोनों अनुपातों को समान बीच वाले सदस्य पर बराबर करके जोड़ें, फिर पहले और तीसरे सदस्य का अनुपात पढ़ें।", "ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਨੂੰ ਸਾਂਝੇ ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਉੱਤੇ ਬਰਾਬਰ ਕਰਕੇ ਜੋੜੋ, ਫਿਰ ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਮੈਂਬਰ ਦਾ ਅਨੁਪਾਤ ਪੜ੍ਹੋ।");
  }
  if (mode === "findSuccessiveEfficiencyPercentComparison") {
    opening = copy(language, "दोनों प्रतिशतों को अलग-अलग गुणकों में बदलकर गुणा करें; उन्हें सीधे जोड़ना सही नहीं है।", "ਦੋਵੇਂ ਪ੍ਰਤੀਸ਼ਤਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਗੁਣਕਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਗੁਣਾ ਕਰੋ; ਉਨ੍ਹਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜਨਾ ਸਹੀ ਨਹੀਂ ਹੈ।");
  }

  const title = naturalTitle(mode, language, question.explanation.shortcut.title);
  let shortcutSteps = question.explanation.shortcut.steps.map((line) => line.replaceAll(oldAnswerText, answerText).replaceAll("आउटपुट", "उत्पादन"));
  if (["findOutputFromEfficiencyRatioAndReferenceOutput", "findReferenceOutputFromEfficiencyRatioAndOtherOutput", "findComparativeOutputFromDifferentEfficienciesAndDurations"].includes(mode)) {
    shortcutSteps = [copy(language, `अनुपात और समय के गुणक लगाने पर आवश्यक उत्पादन ${answerText} मिलता है।`, `ਅਨੁਪਾਤ ਅਤੇ ਸਮੇਂ ਦੇ ਗੁਣਕ ਲਗਾਉਣ ਉੱਤੇ ਲੋੜੀਂਦਾ ਉਤਪਾਦਨ ${answerText} ਮਿਲਦਾ ਹੈ।`)];
  }
  if (mode === "findSuccessiveEfficiencyRatioAcrossThreeAgents") {
    shortcutSteps = [copy(language, `बीच वाले सदस्य को बराबर करके श्रृंखला जोड़ने पर अनुपात ${answerText} मिलता है।`, `ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਨੂੰ ਬਰਾਬਰ ਕਰਕੇ ਲੜੀ ਜੋੜਨ ਉੱਤੇ ਅਨੁਪਾਤ ${answerText} ਮਿਲਦਾ ਹੈ।`)];
  }

  let conclusion = question.explanation.conclusion.replaceAll(oldAnswerText, answerText);
  if (mode === "findTimePercentLessFromEfficiencyPercentMore") {
    conclusion = copy(language, `अतः ${agent(p, language, "A")} को समान काम में ${agent(p, language, "B")} से ${answerText} कम समय लगेगा।`, `ਇਸ ਲਈ ${agent(p, language, "A")} ਨੂੰ ਇਕੋ ਕੰਮ ਵਿੱਚ ${agent(p, language, "B")} ਨਾਲੋਂ ${answerText} ਘੱਟ ਸਮਾਂ ਲੱਗੇਗਾ।`);
  }
  if (mode === "findTimePercentMoreFromEfficiencyPercentLess") {
    conclusion = copy(language, `अतः ${agent(p, language, "A")} को समान काम में ${agent(p, language, "B")} से ${answerText} अधिक समय लगेगा।`, `ਇਸ ਲਈ ${agent(p, language, "A")} ਨੂੰ ਇਕੋ ਕੰਮ ਵਿੱਚ ${agent(p, language, "B")} ਨਾਲੋਂ ${answerText} ਵੱਧ ਸਮਾਂ ਲੱਗੇਗਾ।`);
  }
  if (["findOutputFromEfficiencyRatioAndReferenceOutput", "findReferenceOutputFromEfficiencyRatioAndOtherOutput", "findComparativeOutputFromDifferentEfficienciesAndDurations"].includes(mode)) {
    conclusion = copy(language, `अतः आवश्यक उत्पादन की मात्रा ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੇ ਉਤਪਾਦਨ ਦੀ ਮਾਤਰਾ ${answerText} ਹੈ।`);
  }

  return {
    ...question,
    stem: naturalStem(question, language),
    solution: { ...question.solution, answerText },
    options,
    optionAudit,
    explanation: {
      ...question.explanation,
      opening,
      shortcut: { title, steps: shortcutSteps },
      commonTrap,
      conclusion,
    },
  };
}
