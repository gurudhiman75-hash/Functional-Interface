import { required } from "./cp001-helpers";
import { divide, formatRational } from "./rational";
import { ratioText } from "./cp003-solver";
import type {
  TmwCp003GeneratedQuestion,
  TmwCp003MisconceptionId,
  TmwCp003Parameters,
  TmwCp003SolveMode,
} from "./cp003-types";
import {
  displayLocale,
  type TmwLocalizedLanguage,
  type TmwLocalizedQuestion,
} from "./localization-types";
import {
  formatLocalizedTime,
  localizedOptionLabel,
  localizeMathStep,
} from "./localization-glossary";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const agentCopy: Record<string, { hi: string; pa: string }> = {
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

const jobCopy: Record<string, { hi: string; pa: string }> = {
  "a batch of customer records": { hi: "ग्राहक रिकॉर्डों का एक बैच", pa: "ਗਾਹਕ ਰਿਕਾਰਡਾਂ ਦਾ ਇੱਕ ਬੈਚ" },
  "an equipment overhaul": { hi: "उपकरण की पूरी मरम्मत", pa: "ਉਪਕਰਣ ਦੀ ਪੂਰੀ ਮੁਰੰਮਤ" },
  "a set of loan applications": { hi: "ऋण आवेदनों का एक सेट", pa: "ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਦਾ ਇੱਕ ਸੈੱਟ" },
  "a printing order": { hi: "छपाई का एक ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਇੱਕ ਆਰਡਰ" },
  "a road-marking project": { hi: "सड़क पर निशान लगाने का काम", pa: "ਸੜਕ ਉੱਤੇ ਨਿਸ਼ਾਨ ਲਗਾਉਣ ਦਾ ਕੰਮ" },
  "a packaging order": { hi: "पैकिंग का एक ऑर्डर", pa: "ਪੈਕਿੰਗ ਦਾ ਇੱਕ ਆਰਡਰ" },
  "a quality-inspection batch": { hi: "गुणवत्ता-जाँच का एक बैच", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚ ਦਾ ਇੱਕ ਬੈਚ" },
  "the typing of a manuscript": { hi: "एक पांडुलिपि टाइप करने का काम", pa: "ਇੱਕ ਪਾਂਡੁਲਿਪੀ ਟਾਈਪ ਕਰਨ ਦਾ ਕੰਮ" },
  "a school-building painting project": { hi: "स्कूल भवन की पेंटिंग", pa: "ਸਕੂਲ ਦੀ ਇਮਾਰਤ ਨੂੰ ਰੰਗ ਕਰਨ ਦਾ ਕੰਮ" },
  "a warehouse inventory count": { hi: "गोदाम का स्टॉक गिनने का काम", pa: "ਗੋਦਾਮ ਦਾ ਸਟਾਕ ਗਿਣਨ ਦਾ ਕੰਮ" },
  "a field survey": { hi: "मैदानी सर्वेक्षण", pa: "ਮੈਦਾਨੀ ਸਰਵੇਖਣ" },
  "an electronics assembly order": { hi: "इलेक्ट्रॉनिक उपकरण जोड़ने का ऑर्डर", pa: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਉਪਕਰਣ ਜੋੜਨ ਦਾ ਆਰਡਰ" },
};

const outputCopy: Record<string, { hi: string; pa: string }> = {
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
  return `${agentCopy[p.context.agentNoun]?.[language] ?? p.context.agentNoun} ${letter}`;
}

function job(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  return jobCopy[p.context.jobPhrase]?.[language] ?? p.context.jobPhrase;
}

function output(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  return outputCopy[p.context.outputNoun]?.[language] ?? p.context.outputNoun;
}

function time(p: TmwCp003Parameters, value: Parameters<typeof formatLocalizedTime>[0], language: TmwLocalizedLanguage): string {
  return formatLocalizedTime(value, p.timeUnit, language);
}

function efficiencyRatio(p: TmwCp003Parameters): string {
  return ratioText(divide(p.efficiencyA, p.efficiencyB));
}

function workRatio(p: TmwCp003Parameters): string {
  return ratioText(divide(required(p.workA, "workA"), required(p.workB, "workB")));
}

function percentage(value: Parameters<typeof formatRational>[0]): string {
  return `${formatRational(value)}%`;
}

function renderStem(source: TmwCp003GeneratedQuestion, language: TmwLocalizedLanguage): string {
  const p = source.parameters;
  const mode = source.solveMode as TmwCp003SolveMode;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const C = agent(p, language, "C");
  const assignment = job(p, language);
  const out = output(p, language);
  const ratio = efficiencyRatio(p);

  switch (mode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
      return copy(language,
        `${A} को ${assignment} पूरा करने में ${time(p, required(p.timeA, "timeA"), language)} और ${B} को वही काम पूरा करने में ${time(p, required(p.timeB, "timeB"), language)} लगते हैं। ${A}:${B} की कार्यक्षमता का अनुपात ज्ञात कीजिए।`,
        `${A} ਨੂੰ ${assignment} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeA, "timeA"), language)} ਅਤੇ ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`);
    case "findTimeRatioFromEfficiencyRatio":
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। दोनों को बराबर काम दिया जाए, तो उनके पूरा करने के समय का अनुपात ${A}:${B} क्या होगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਦੋਵਾਂ ਨੂੰ ਬਰਾਬਰ ਕੰਮ ਦਿੱਤਾ ਜਾਵੇ, ਤਾਂ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੀ ਹੋਵੇਗਾ?`);
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return copy(language,
        `${A} ${assignment} को ${time(p, required(p.timeA, "timeA"), language)} में और ${B} ${time(p, required(p.timeB, "timeB"), language)} में पूरा करता है। ${A}, ${B} से कितने प्रतिशत अधिक कार्यक्षम है?`,
        `${A} ${assignment} ਨੂੰ ${time(p, required(p.timeA, "timeA"), language)} ਵਿੱਚ ਅਤੇ ${B} ${time(p, required(p.timeB, "timeB"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ${A}, ${B} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਕਾਰਗਰ ਹੈ?`);
    case "findEfficiencyPercentLessFromCompletionTimes":
      return copy(language,
        `${A} ${assignment} को ${time(p, required(p.timeA, "timeA"), language)} में और ${B} ${time(p, required(p.timeB, "timeB"), language)} में पूरा करता है। ${A}, ${B} से कितने प्रतिशत कम कार्यक्षम है?`,
        `${A} ${assignment} ਨੂੰ ${time(p, required(p.timeA, "timeA"), language)} ਵਿੱਚ ਅਤੇ ${B} ${time(p, required(p.timeB, "timeB"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ${A}, ${B} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਕਾਰਗਰ ਹੈ?`);
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
      return copy(language,
        `${A}, ${B} से ${percentage(required(p.percentAOverB, "percentAOverB"))} अधिक कार्यक्षम है। यदि ${B} ${assignment} को ${time(p, required(p.timeB, "timeB"), language)} में पूरा करता है, तो ${A} कितना समय लेगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(required(p.percentAOverB, "percentAOverB"))} ਵੱਧ ਕਾਰਗਰ ਹੈ। ਜੇ ${B} ${assignment} ਨੂੰ ${time(p, required(p.timeB, "timeB"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ, ਤਾਂ ${A} ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`);
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
      return copy(language,
        `${A}, ${B} से ${percentage(required(p.percentAOverB, "percentAOverB"))} अधिक कार्यक्षम है। यदि ${A} ${assignment} को ${time(p, required(p.timeA, "timeA"), language)} में पूरा करता है, तो ${B} कितना समय लेगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(required(p.percentAOverB, "percentAOverB"))} ਵੱਧ ਕਾਰਗਰ ਹੈ। ਜੇ ${A} ${assignment} ਨੂੰ ${time(p, required(p.timeA, "timeA"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ, ਤਾਂ ${B} ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`);
    case "findTimePercentLessFromEfficiencyPercentMore":
      return copy(language,
        `${A}, ${B} से ${percentage(required(p.percentAOverB, "percentAOverB"))} अधिक कार्यक्षम है। समान काम के लिए ${A} का समय ${B} के समय से कितने प्रतिशत कम होगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(required(p.percentAOverB, "percentAOverB"))} ਵੱਧ ਕਾਰਗਰ ਹੈ। ਇਕੋ ਕੰਮ ਲਈ ${A} ਦਾ ਸਮਾਂ ${B} ਦੇ ਸਮੇਂ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੋਵੇਗਾ?`);
    case "findTimePercentMoreFromEfficiencyPercentLess":
      return copy(language,
        `${A}, ${B} से ${percentage(required(p.percentAOverB, "percentAOverB"))} कम कार्यक्षम है। समान काम के लिए ${A} का समय ${B} के समय से कितने प्रतिशत अधिक होगा?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(required(p.percentAOverB, "percentAOverB"))} ਘੱਟ ਕਾਰਗਰ ਹੈ। ਇਕੋ ਕੰਮ ਲਈ ${A} ਦਾ ਸਮਾਂ ${B} ਦੇ ਸਮੇਂ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੋਵੇਗਾ?`);
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
      return copy(language,
        `${A} और ${B} समान समय तक काम करते हैं। उनकी कार्यक्षमता का अनुपात ${ratio} है। उनके किए गए काम का अनुपात ${A}:${B} ज्ञात कीजिए।`,
        `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਉਨ੍ਹਾਂ ਵੱਲੋਂ ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`);
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। ${A} ${time(p, required(p.durationA, "durationA"), language)} और ${B} ${time(p, required(p.durationB, "durationB"), language)} काम करता है। किए गए काम का अनुपात ${A}:${B} क्या होगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${A} ${time(p, required(p.durationA, "durationA"), language)} ਅਤੇ ${B} ${time(p, required(p.durationB, "durationB"), language)} ਕੰਮ ਕਰਦਾ ਹੈ। ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੀ ਹੋਵੇਗਾ?`);
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} और उनके काम की मात्रा का अनुपात ${workRatio(p)} है। आवश्यक समय का अनुपात ${A}:${B} ज्ञात कीजिए।`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਕੰਮ ਦੀ ਮਾਤਰਾ ਦਾ ਅਨੁਪਾਤ ${workRatio(p)} ਹੈ। ਲੋੜੀਂਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`);
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
      return copy(language,
        `${A} ${formatRational(required(p.workA, "workA"))} इकाई काम ${time(p, required(p.timeA, "timeA"), language)} में और ${B} ${formatRational(required(p.workB, "workB"))} इकाई काम ${time(p, required(p.timeB, "timeB"), language)} में करता है। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`,
        `${A} ${formatRational(required(p.workA, "workA"))} ਇਕਾਈ ਕੰਮ ${time(p, required(p.timeA, "timeA"), language)} ਵਿੱਚ ਅਤੇ ${B} ${formatRational(required(p.workB, "workB"))} ਇਕਾਈ ਕੰਮ ${time(p, required(p.timeB, "timeB"), language)} ਵਿੱਚ ਕਰਦਾ ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`);
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
      return copy(language,
        `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${ratio} है। यदि ${B} ${formatRational(required(p.outputB, "outputB"))} ${out} पूरा करता है, तो ${A} कितने ${out} पूरे करेगा?`,
        `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਜੇ ${B} ${formatRational(required(p.outputB, "outputB"))} ${out} ਪੂਰੇ ਕਰਦਾ ਹੈ, ਤਾਂ ${A} ਕਿੰਨੇ ${out} ਪੂਰੇ ਕਰੇਗਾ?`);
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
      return copy(language,
        `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${ratio} है। यदि ${A} ${formatRational(required(p.outputA, "outputA"))} ${out} पूरा करता है, तो ${B} कितने ${out} पूरे करेगा?`,
        `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਜੇ ${A} ${formatRational(required(p.outputA, "outputA"))} ${out} ਪੂਰੇ ਕਰਦਾ ਹੈ, ਤਾਂ ${B} ਕਿੰਨੇ ${out} ਪੂਰੇ ਕਰੇਗਾ?`);
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। दोनों मिलकर ${assignment} को ${time(p, required(p.combinedTime, "combinedTime"), language)} में पूरा करते हैं। ${target} अकेले कितना समय लेगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ${assignment} ਨੂੰ ${time(p, required(p.combinedTime, "combinedTime"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${target} ਇਕੱਲਾ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`);
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। समान काम के लिए उनके अलग-अलग समय में ${time(p, required(p.timeDifference, "timeDifference"), language)} का अंतर है। ${target} का समय ज्ञात कीजिए।`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਇਕੋ ਕੰਮ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਵਿੱਚ ${time(p, required(p.timeDifference, "timeDifference"), language)} ਦਾ ਅੰਤਰ ਹੈ। ${target} ਦਾ ਸਮਾਂ ਕੱਢੋ।`);
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। समान काम के लिए उनके अलग-अलग समय का योग ${time(p, required(p.timeSum, "timeSum"), language)} है। ${target} का समय ज्ञात कीजिए।`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਇਕੋ ਕੰਮ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਦਾ ਜੋੜ ${time(p, required(p.timeSum, "timeSum"), language)} ਹੈ। ${target} ਦਾ ਸਮਾਂ ਕੱਢੋ।`);
    }
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return copy(language,
        `${A} ${time(p, required(p.durationA, "durationA"), language)} में ${formatRational(required(p.outputA, "outputA"))} ${out} और ${B} ${time(p, required(p.durationB, "durationB"), language)} में ${formatRational(required(p.outputB, "outputB"))} ${out} पूरे करता है। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`,
        `${A} ${time(p, required(p.durationA, "durationA"), language)} ਵਿੱਚ ${formatRational(required(p.outputA, "outputA"))} ${out} ਅਤੇ ${B} ${time(p, required(p.durationB, "durationB"), language)} ਵਿੱਚ ${formatRational(required(p.outputB, "outputB"))} ${out} ਪੂਰੇ ਕਰਦਾ ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`);
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। ${B} ${time(p, required(p.durationB, "durationB"), language)} में ${formatRational(required(p.outputB, "outputB"))} ${out} पूरा करता है। ${A} ${time(p, required(p.durationA, "durationA"), language)} में कितने ${out} पूरे करेगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${B} ${time(p, required(p.durationB, "durationB"), language)} ਵਿੱਚ ${formatRational(required(p.outputB, "outputB"))} ${out} ਪੂਰੇ ਕਰਦਾ ਹੈ। ${A} ${time(p, required(p.durationA, "durationA"), language)} ਵਿੱਚ ਕਿੰਨੇ ${out} ਪੂਰੇ ਕਰੇਗਾ?`);
    case "findComparativeDurationFromDifferentWorkAndEfficiencies":
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} और काम की मात्रा का अनुपात ${workRatio(p)} है। यदि ${B} को अपना काम पूरा करने में ${time(p, required(p.timeB, "timeB"), language)} लगते हैं, तो ${A} को कितना समय लगेगा?`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਅਤੇ ਕੰਮ ਦੀ ਮਾਤਰਾ ਦਾ ਅਨੁਪਾਤ ${workRatio(p)} ਹੈ। ਜੇ ${B} ਨੂੰ ਆਪਣਾ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${time(p, required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ, ਤਾਂ ${A} ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents": {
      const bc = ratioText(divide(p.efficiencyB, required(p.efficiencyC, "efficiencyC")));
      return copy(language,
        `${A}:${B} की कार्यक्षमता का अनुपात ${ratioText(p.efficiencyA)} और ${B}:${C} का अनुपात ${bc} है। ${A}:${C} की कार्यक्षमता का अनुपात ज्ञात कीजिए।`,
        `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratioText(p.efficiencyA)} ਅਤੇ ${B}:${C} ਦਾ ਅਨੁਪਾਤ ${bc} ਹੈ। ${A}:${C} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`);
    }
    case "findSuccessiveEfficiencyPercentComparison":
      return copy(language,
        `${A}, ${B} से ${percentage(required(p.percentAOverB, "percentAOverB"))} अधिक कार्यक्षम है और ${B}, ${C} से ${percentage(required(p.percentBOverC, "percentBOverC"))} अधिक कार्यक्षम है। ${A}, ${C} से कितने प्रतिशत अधिक कार्यक्षम है?`,
        `${A}, ${B} ਨਾਲੋਂ ${percentage(required(p.percentAOverB, "percentAOverB"))} ਵੱਧ ਕਾਰਗਰ ਹੈ ਅਤੇ ${B}, ${C} ਨਾਲੋਂ ${percentage(required(p.percentBOverC, "percentBOverC"))} ਵੱਧ ਕਾਰਗਰ ਹੈ। ${A}, ${C} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਕਾਰਗਰ ਹੈ?`);
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return copy(language,
        `कार्यक्षमता बढ़ने के बाद ${assignment} पूरा करने का समय ${time(p, required(p.originalTime, "originalTime"), language)} से घटकर ${time(p, required(p.changedTime, "changedTime"), language)} हो जाता है। कार्यक्षमता कितने प्रतिशत बढ़ी?`,
        `ਕਾਰਗੁਜ਼ਾਰੀ ਵਧਣ ਤੋਂ ਬਾਅਦ ${assignment} ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ${time(p, required(p.originalTime, "originalTime"), language)} ਤੋਂ ਘਟ ਕੇ ${time(p, required(p.changedTime, "changedTime"), language)} ਹੋ ਜਾਂਦਾ ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਧੀ?`);
  }
}

function localizedAnswerText(source: TmwCp003GeneratedQuestion, value: Parameters<typeof formatRational>[0], language: TmwLocalizedLanguage): string {
  switch (source.solution.answerType) {
    case "RATIO": return ratioText(value);
    case "PERCENT": return `${formatRational(value)}%`;
    case "TIME": return formatLocalizedTime(value, source.parameters.timeUnit, language);
    case "OUTPUT": return `${formatRational(value)} ${output(source.parameters, language)}`;
  }
}

function opening(mode: TmwCp003SolveMode, language: TmwLocalizedLanguage): string {
  if (["findEfficiencyRatioFromEqualWorkTimes", "findTimeRatioFromEfficiencyRatio", "findIndividualTimeFromEfficiencyRatioAndTimeDifference", "findIndividualTimeFromEfficiencyRatioAndTimeSum"].includes(mode)) {
    return copy(language, "समान काम के लिए कार्यक्षमता और समय उलटे अनुपात में होते हैं; एक बढ़े तो दूसरा घटता है।", "ਇਕੋ ਕੰਮ ਲਈ ਕਾਰਗੁਜ਼ਾਰੀ ਅਤੇ ਸਮਾਂ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੇ ਹਨ; ਇੱਕ ਵਧੇ ਤਾਂ ਦੂਜਾ ਘਟਦਾ ਹੈ।");
  }
  if (["findEfficiencyPercentMoreFromCompletionTimes", "findEfficiencyPercentLessFromCompletionTimes", "findFasterTimeFromSlowerTimeAndPercentMoreEfficient", "findSlowerTimeFromFasterTimeAndPercentMoreEfficient", "findTimePercentLessFromEfficiencyPercentMore", "findTimePercentMoreFromEfficiencyPercentLess", "findEfficiencyChangePercentFromCompletionTimeChange"].includes(mode)) {
    return copy(language, "प्रतिशत को गुणक में बदलें और समान काम के लिए कार्यक्षमता तथा समय के उलटे संबंध को सही आधार पर लागू करें।", "ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਗੁਣਕ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਇਕੋ ਕੰਮ ਲਈ ਕਾਰਗੁਜ਼ਾਰੀ ਤੇ ਸਮੇਂ ਦੇ ਉਲਟ ਸੰਬੰਧ ਨੂੰ ਸਹੀ ਆਧਾਰ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।");
  }
  if (mode === "findIndividualTimeFromEfficiencyRatioAndCombinedTime") {
    return copy(language, "व्यक्तिगत दरों को दिए गए कार्यक्षमता अनुपात में मानकर उनका योग संयुक्त दर के बराबर रखें।", "ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਨੂੰ ਦਿੱਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਅਨੁਪਾਤ ਵਿੱਚ ਮੰਨ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਸਾਂਝੀ ਦਰ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।");
  }
  if (["findSuccessiveEfficiencyRatioAcrossThreeAgents", "findSuccessiveEfficiencyPercentComparison"].includes(mode)) {
    return copy(language, "लगातार दी गई दोनों तुलनाओं को गुणा करके समान बीच वाले सदस्य को काटें; प्रतिशत सीधे नहीं जुड़ते।", "ਲਗਾਤਾਰ ਦਿੱਤੀਆਂ ਦੋਵੇਂ ਤੁਲਨਾਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਸਾਂਝੇ ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਨੂੰ ਕੱਟੋ; ਪ੍ਰਤੀਸ਼ਤ ਸਿੱਧੇ ਨਹੀਂ ਜੋੜੇ ਜਾਂਦੇ।");
  }
  return copy(language, "काम = कार्यक्षमता × समय का संबंध लगाएँ और तुलना में काम तथा समय—दोनों के गुणक बनाए रखें।", "ਕੰਮ = ਕਾਰਗੁਜ਼ਾਰੀ × ਸਮਾਂ ਦਾ ਸੰਬੰਧ ਲਗਾਓ ਅਤੇ ਤੁਲਨਾ ਵਿੱਚ ਕੰਮ ਤੇ ਸਮਾਂ—ਦੋਵੇਂ ਦੇ ਗੁਣਕ ਬਣਾਈ ਰੱਖੋ।");
}

const shortcutTitles: Record<TmwCp003SolveMode, [string, string]> = {
  findEfficiencyRatioFromEqualWorkTimes: ["10-सेकंड समय उलटें", "10-ਸਕਿੰਟ ਸਮਾਂ ਉਲਟੋ"],
  findTimeRatioFromEfficiencyRatio: ["10-सेकंड कार्यक्षमता उलटें", "10-ਸਕਿੰਟ ਕਾਰਗੁਜ਼ਾਰੀ ਉਲਟੋ"],
  findEfficiencyPercentMoreFromCompletionTimes: ["10-सेकंड अधिक कार्यक्षमता", "10-ਸਕਿੰਟ ਵੱਧ ਕਾਰਗੁਜ਼ਾਰੀ"],
  findEfficiencyPercentLessFromCompletionTimes: ["10-सेकंड कम कार्यक्षमता", "10-ਸਕਿੰਟ ਘੱਟ ਕਾਰਗੁਜ਼ਾਰੀ"],
  findFasterTimeFromSlowerTimeAndPercentMoreEfficient: ["10-सेकंड तेज समय", "10-ਸਕਿੰਟ ਤੇਜ਼ ਸਮਾਂ"],
  findSlowerTimeFromFasterTimeAndPercentMoreEfficient: ["10-सेकंड धीमा समय", "10-ਸਕਿੰਟ ਹੌਲਾ ਸਮਾਂ"],
  findTimePercentLessFromEfficiencyPercentMore: ["10-सेकंड समय की कमी", "10-ਸਕਿੰਟ ਸਮੇਂ ਦੀ ਘਾਟ"],
  findTimePercentMoreFromEfficiencyPercentLess: ["10-सेकंड समय की बढ़ोतरी", "10-ਸਕਿੰਟ ਸਮੇਂ ਦਾ ਵਾਧਾ"],
  findWorkRatioAtEqualTimeFromEfficiencyRatio: ["10-सेकंड समान-समय काम", "10-ਸਕਿੰਟ ਇਕੋ-ਸਮੇਂ ਕੰਮ"],
  findWorkRatioFromEfficiencyRatioAndUnequalTimes: ["10-सेकंड कार्यक्षमता × समय", "10-ਸਕਿੰਟ ਕਾਰਗੁਜ਼ਾਰੀ × ਸਮਾਂ"],
  findTimeRatioForUnequalWorkAndEfficiencyRatio: ["10-सेकंड काम ÷ कार्यक्षमता", "10-ਸਕਿੰਟ ਕੰਮ ÷ ਕਾਰਗੁਜ਼ਾਰੀ"],
  findEfficiencyRatioFromUnequalWorkAndTimes: ["10-सेकंड काम ÷ समय", "10-ਸਕਿੰਟ ਕੰਮ ÷ ਸਮਾਂ"],
  findOutputFromEfficiencyRatioAndReferenceOutput: ["10-सेकंड आउटपुट बढ़ाएँ", "10-ਸਕਿੰਟ ਉਤਪਾਦਨ ਵਧਾਓ"],
  findReferenceOutputFromEfficiencyRatioAndOtherOutput: ["10-सेकंड संदर्भ आउटपुट", "10-ਸਕਿੰਟ ਹਵਾਲਾ ਉਤਪਾਦਨ"],
  findIndividualTimeFromEfficiencyRatioAndCombinedTime: ["10-सेकंड संयुक्त दर बाँटें", "10-ਸਕਿੰਟ ਸਾਂਝੀ ਦਰ ਵੰਡੋ"],
  findIndividualTimeFromEfficiencyRatioAndTimeDifference: ["10-सेकंड अंतर से स्केल", "10-ਸਕਿੰਟ ਅੰਤਰ ਨਾਲ ਪੈਮਾਨਾ"],
  findIndividualTimeFromEfficiencyRatioAndTimeSum: ["10-सेकंड योग से स्केल", "10-ਸਕਿੰਟ ਜੋੜ ਨਾਲ ਪੈਮਾਨਾ"],
  findEfficiencyRatioFromOutputAndTimeComparison: ["10-सेकंड आउटपुट प्रति समय", "10-ਸਕਿੰਟ ਉਤਪਾਦਨ ਪ੍ਰਤੀ ਸਮਾਂ"],
  findComparativeOutputFromDifferentEfficienciesAndDurations: ["10-सेकंड दोहरा गुणक", "10-ਸਕਿੰਟ ਦੋਹਰਾ ਗੁਣਕ"],
  findComparativeDurationFromDifferentWorkAndEfficiencies: ["10-सेकंड काम-कार्यक्षमता समय", "10-ਸਕਿੰਟ ਕੰਮ-ਕਾਰਗੁਜ਼ਾਰੀ ਸਮਾਂ"],
  findSuccessiveEfficiencyRatioAcrossThreeAgents: ["10-सेकंड अनुपात जोड़ें", "10-ਸਕਿੰਟ ਅਨੁਪਾਤ ਜੋੜੋ"],
  findSuccessiveEfficiencyPercentComparison: ["10-सेकंड प्रतिशत गुणक", "10-ਸਕਿੰਟ ਪ੍ਰਤੀਸ਼ਤ ਗੁਣਕ"],
  findEfficiencyChangePercentFromCompletionTimeChange: ["10-सेकंड पुराना समय ÷ नया समय", "10-ਸਕਿੰਟ ਪੁਰਾਣਾ ਸਮਾਂ ÷ ਨਵਾਂ ਸਮਾਂ"],
};

function shortcut(mode: TmwCp003SolveMode, answerText: string, language: TmwLocalizedLanguage): { title: string; steps: string[] } {
  return {
    title: shortcutTitles[mode][language === "hi" ? 0 : 1],
    steps: [copy(language, `संबंध को सही क्रम और आधार में लगाने पर उत्तर ${answerText} है।`, `ਸੰਬੰਧ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਅਤੇ ਆਧਾਰ ਵਿੱਚ ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answerText} ਹੈ।`)],
  };
}

function trapReason(id: Exclude<TmwCp003MisconceptionId, "CORRECT">, language: TmwLocalizedLanguage): string {
  const reasons: Record<Exclude<TmwCp003MisconceptionId, "CORRECT">, [string, string]> = {
    DIRECT_TIME_RATIO: ["समान काम में समय का अनुपात सीधे लेने से कार्यक्षमता का क्रम उलटना भूल जाता है।", "ਇਕੋ ਕੰਮ ਵਿੱਚ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਸਿੱਧਾ ਲੈਣ ਨਾਲ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਕ੍ਰਮ ਉਲਟਣਾ ਰਹਿ ਜਾਂਦਾ ਹੈ।"],
    RATIO_ORDER_REVERSED: ["इस विकल्प में पूछे गए A:B क्रम के स्थान पर B:A लिखा गया है।", "ਇਸ ਚੋਣ ਵਿੱਚ ਪੁੱਛੇ A:B ਕ੍ਰਮ ਦੀ ਥਾਂ B:A ਲਿਖਿਆ ਗਿਆ ਹੈ।"],
    RATIO_SUM_USED: ["अनुपात के पदों को जोड़ देना तुलना को अनुपात से कुल में बदल देता है।", "ਅਨੁਪਾਤ ਦੇ ਪਦ ਜੋੜ ਦੇਣ ਨਾਲ ਤੁਲਨਾ ਅਨੁਪਾਤ ਤੋਂ ਕੁੱਲ ਵਿੱਚ ਬਦਲ ਜਾਂਦੀ ਹੈ।"],
    PERCENT_BASE_REVERSED: ["प्रतिशत की तुलना गलत व्यक्ति की कार्यक्षमता को आधार मानकर की गई है।", "ਪ੍ਰਤੀਸ਼ਤ ਦੀ ਤੁਲਨਾ ਗਲਤ ਵਿਅਕਤੀ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਨੂੰ ਆਧਾਰ ਮੰਨ ਕੇ ਕੀਤੀ ਗਈ ਹੈ।"],
    EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT: ["कार्यक्षमता में प्रतिशत बदलाव को समय का वही प्रतिशत मान लिया गया है, जबकि समय उलटे अनुपात में बदलता है।", "ਕਾਰਗੁਜ਼ਾਰੀ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਨੂੰ ਸਮੇਂ ਦਾ ਉਹੀ ਪ੍ਰਤੀਸ਼ਤ ਮੰਨਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਸਮਾਂ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।"],
    TIME_PERCENT_USED_AS_EFFICIENCY_PERCENT: ["समय में प्रतिशत बदलाव को कार्यक्षमता का वही प्रतिशत मान लेने से आधार गलत हो जाता है।", "ਸਮੇਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਨੂੰ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਉਹੀ ਪ੍ਰਤੀਸ਼ਤ ਮੰਨਣ ਨਾਲ ਆਧਾਰ ਗਲਤ ਹੋ ਜਾਂਦਾ ਹੈ।"],
    EFFICIENCY_MULTIPLIER_NOT_INVERTED: ["समान काम के समय पर कार्यक्षमता गुणक का उलटा प्रभाव लगना चाहिए; सीधे गुणा करने से यह विकल्प बनता है।", "ਇਕੋ ਕੰਮ ਦੇ ਸਮੇਂ ਉੱਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਗੁਣਕ ਦਾ ਉਲਟ ਅਸਰ ਲੱਗਣਾ ਚਾਹੀਦਾ ਹੈ; ਸਿੱਧਾ ਗੁਣਾ ਕਰਨ ਨਾਲ ਇਹ ਚੋਣ ਬਣਦੀ ਹੈ।"],
    EQUAL_TIME_ASSUMED: ["दोनों के काम करने के समय अलग हैं, पर इस विकल्प में उन्हें समान मान लिया गया है।", "ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਨ ਦੇ ਸਮੇਂ ਵੱਖ ਹਨ, ਪਰ ਇਸ ਚੋਣ ਵਿੱਚ ਉਨ੍ਹਾਂ ਨੂੰ ਇਕੋ ਮੰਨਿਆ ਗਿਆ ਹੈ।"],
    TIME_FACTOR_OMITTED: ["काम की तुलना में कार्यक्षमता ली गई, पर काम करने का समय छोड़ दिया गया।", "ਕੰਮ ਦੀ ਤੁਲਨਾ ਵਿੱਚ ਕਾਰਗੁਜ਼ਾਰੀ ਲਈ ਗਈ, ਪਰ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ ਛੱਡ ਦਿੱਤਾ ਗਿਆ।"],
    WORK_FACTOR_OMITTED: ["समय या कार्यक्षमता ली गई, पर अलग काम की मात्रा का गुणक छोड़ दिया गया।", "ਸਮਾਂ ਜਾਂ ਕਾਰਗੁਜ਼ਾਰੀ ਲਈ ਗਈ, ਪਰ ਵੱਖ ਕੰਮ ਦੀ ਮਾਤਰਾ ਦਾ ਗੁਣਕ ਛੱਡ ਦਿੱਤਾ ਗਿਆ।"],
    OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED: ["अधिक कार्यक्षमता वाले आउटपुट को बढ़ाने के बजाय अनुपात से भाग दिया गया है।", "ਵੱਧ ਕਾਰਗੁਜ਼ਾਰੀ ਵਾਲੇ ਉਤਪਾਦਨ ਨੂੰ ਵਧਾਉਣ ਦੀ ਥਾਂ ਅਨੁਪਾਤ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
    REFERENCE_OUTPUT_REPORTED: ["यह विकल्प गणना किए बिना प्रश्न में दिया गया संदर्भ आउटपुट ही दोहराता है।", "ਇਹ ਚੋਣ ਹਿਸਾਬ ਕੀਤੇ ਬਿਨਾਂ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤਾ ਹਵਾਲਾ ਉਤਪਾਦਨ ਹੀ ਦੁਹਰਾਉਂਦੀ ਹੈ।"],
    COMBINED_TIME_REPORTED: ["संयुक्त समय को ही किसी एक सदस्य का समय मान लिया गया है।", "ਸਾਂਝੇ ਸਮੇਂ ਨੂੰ ਹੀ ਕਿਸੇ ਇੱਕ ਮੈਂਬਰ ਦਾ ਸਮਾਂ ਮੰਨਿਆ ਗਿਆ ਹੈ।"],
    OTHER_AGENT_TIME_REPORTED: ["पूछे गए सदस्य के बजाय दूसरे सदस्य का समय बताया गया है।", "ਪੁੱਛੇ ਮੈਂਬਰ ਦੀ ਥਾਂ ਦੂਜੇ ਮੈਂਬਰ ਦਾ ਸਮਾਂ ਦੱਸਿਆ ਗਿਆ ਹੈ।"],
    TIME_DIFFERENCE_USED_DIRECTLY: ["समय-अनुपात का पैमाना निकाले बिना दिया गया अंतर ही उत्तर मान लिया गया है।", "ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਦਾ ਪੈਮਾਨਾ ਕੱਢੇ ਬਿਨਾਂ ਦਿੱਤਾ ਅੰਤਰ ਹੀ ਉੱਤਰ ਮੰਨਿਆ ਗਿਆ ਹੈ।"],
    TIME_SUM_USED_DIRECTLY: ["समय-अनुपात में बाँटे बिना दोनों समयों का कुल ही उत्तर मान लिया गया है।", "ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੇ ਬਿਨਾਂ ਦੋਵੇਂ ਸਮਿਆਂ ਦਾ ਕੁੱਲ ਹੀ ਉੱਤਰ ਮੰਨਿਆ ਗਿਆ ਹੈ।"],
    SUCCESSIVE_PERCENTAGES_ADDED: ["लगातार प्रतिशत अलग-अलग आधारों पर हैं; उन्हें सीधे जोड़ना सही नहीं है।", "ਲਗਾਤਾਰ ਪ੍ਰਤੀਸ਼ਤ ਵੱਖ-ਵੱਖ ਆਧਾਰਾਂ ਉੱਤੇ ਹਨ; ਉਨ੍ਹਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜਨਾ ਸਹੀ ਨਹੀਂ ਹੈ।"],
    SECOND_RELATION_OMITTED: ["तीन सदस्यों की श्रृंखला में दूसरी तुलना छोड़ देने से अंतिम अनुपात अधूरा रहता है।", "ਤਿੰਨ ਮੈਂਬਰਾਂ ਦੀ ਲੜੀ ਵਿੱਚ ਦੂਜੀ ਤੁਲਨਾ ਛੱਡਣ ਨਾਲ ਅੰਤਿਮ ਅਨੁਪਾਤ ਅਧੂਰਾ ਰਹਿੰਦਾ ਹੈ।"],
    TIME_CHANGE_PERCENT_REPORTED: ["यह विकल्प समय में कमी का प्रतिशत बताता है, जबकि पूछा गया बदलाव कार्यक्षमता में है।", "ਇਹ ਚੋਣ ਸਮੇਂ ਵਿੱਚ ਘਾਟ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਦੱਸਦੀ ਹੈ, ਜਦਕਿ ਪੁੱਛਿਆ ਬਦਲਾਅ ਕਾਰਗੁਜ਼ਾਰੀ ਵਿੱਚ ਹੈ।"],
    OLD_TIME_BASE_USED: ["प्रतिशत परिवर्तन की तुलना में गलत समय को आधार बनाया गया है।", "ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਦੀ ਤੁਲਨਾ ਵਿੱਚ ਗਲਤ ਸਮੇਂ ਨੂੰ ਆਧਾਰ ਬਣਾਇਆ ਗਿਆ ਹੈ।"],
    RAW_TIME_RATIO_PERCENT: ["समय के कच्चे अनुपात को 100 से गुणा कर दिया गया, पर 1 घटाकर वास्तविक वृद्धि नहीं निकाली गई।", "ਸਮੇਂ ਦੇ ਕੱਚੇ ਅਨੁਪਾਤ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ, ਪਰ 1 ਘਟਾ ਕੇ ਅਸਲ ਵਾਧਾ ਨਹੀਂ ਕੱਢਿਆ ਗਿਆ।"],
    PLAUSIBLE_SCALE_ERROR: ["सही संबंध के बाद अनुपात को गलत पैमाने से गुणा करने पर यह निकट लेकिन गलत मान बनता है।", "ਸਹੀ ਸੰਬੰਧ ਤੋਂ ਬਾਅਦ ਅਨੁਪਾਤ ਨੂੰ ਗਲਤ ਪੈਮਾਨੇ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਇਹ ਨੇੜਲਾ ਪਰ ਗਲਤ ਮਾਨ ਬਣਦਾ ਹੈ।"],
  };
  return reasons[id][language === "hi" ? 0 : 1];
}

function localizeMath(value: string, language: TmwLocalizedLanguage): string {
  let result = localizeMathStep(value, language);
  const pairs: Array<[string, string, string]> = [
    ["equal time", "समान समय", "ਇਕੋ ਸਮਾਂ"],
    ["target", "लक्षित सदस्य", "ਟੀਚੇ ਵਾਲਾ ਮੈਂਬਰ"],
    ["more efficient", "अधिक कार्यक्षम", "ਵੱਧ ਕਾਰਗਰ"],
    ["less efficient", "कम कार्यक्षम", "ਘੱਟ ਕਾਰਗਰ"],
    ["more time", "अधिक समय", "ਵੱਧ ਸਮਾਂ"],
    ["less time", "कम समय", "ਘੱਟ ਸਮਾਂ"],
    ["old", "पुराना", "ਪੁਰਾਣਾ"],
    ["new", "नया", "ਨਵਾਂ"],
  ];
  for (const [en, hi, pa] of pairs) result = result.replaceAll(en, language === "hi" ? hi : pa);
  return result;
}

function conclusion(source: TmwCp003GeneratedQuestion, answerText: string, language: TmwLocalizedLanguage): string {
  const p = source.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const C = agent(p, language, "C");
  switch (source.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return copy(language, `अतः कार्यक्षमता अनुपात ${A}:${B} = ${answerText} है।`, `ਇਸ ਲਈ ਕਾਰਗੁਜ਼ਾਰੀ ਅਨੁਪਾਤ ${A}:${B} = ${answerText} ਹੈ।`);
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents":
      return copy(language, `अतः कार्यक्षमता अनुपात ${A}:${C} = ${answerText} है।`, `ਇਸ ਲਈ ਕਾਰਗੁਜ਼ਾਰੀ ਅਨੁਪਾਤ ${A}:${C} = ${answerText} ਹੈ।`);
    case "findTimeRatioFromEfficiencyRatio":
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
      return copy(language, `अतः समय का अनुपात ${A}:${B} = ${answerText} है।`, `ਇਸ ਲਈ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${A}:${B} = ${answerText} ਹੈ।`);
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return copy(language, `अतः किए गए काम का अनुपात ${A}:${B} = ${answerText} है।`, `ਇਸ ਲਈ ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${A}:${B} = ${answerText} ਹੈ।`);
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return copy(language, `अतः ${A}, ${B} से ${answerText} अधिक कार्यक्षम है।`, `ਇਸ ਲਈ ${A}, ${B} ਨਾਲੋਂ ${answerText} ਵੱਧ ਕਾਰਗਰ ਹੈ।`);
    case "findEfficiencyPercentLessFromCompletionTimes":
      return copy(language, `अतः ${A}, ${B} से ${answerText} कम कार्यक्षम है।`, `ਇਸ ਲਈ ${A}, ${B} ਨਾਲੋਂ ${answerText} ਘੱਟ ਕਾਰਗਰ ਹੈ।`);
    case "findTimePercentLessFromEfficiencyPercentMore":
      return copy(language, `अतः ${A} समान काम में ${B} से ${answerText} कम समय लेता है।`, `ਇਸ ਲਈ ${A} ਇਕੋ ਕੰਮ ਵਿੱਚ ${B} ਨਾਲੋਂ ${answerText} ਘੱਟ ਸਮਾਂ ਲੈਂਦਾ ਹੈ।`);
    case "findTimePercentMoreFromEfficiencyPercentLess":
      return copy(language, `अतः ${A} समान काम में ${B} से ${answerText} अधिक समय लेता है।`, `ਇਸ ਲਈ ${A} ਇਕੋ ਕੰਮ ਵਿੱਚ ${B} ਨਾਲੋਂ ${answerText} ਵੱਧ ਸਮਾਂ ਲੈਂਦਾ ਹੈ।`);
    case "findSuccessiveEfficiencyPercentComparison":
      return copy(language, `अतः ${A}, ${C} से ${answerText} अधिक कार्यक्षम है।`, `ਇਸ ਲਈ ${A}, ${C} ਨਾਲੋਂ ${answerText} ਵੱਧ ਕਾਰਗਰ ਹੈ।`);
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return copy(language, `अतः कार्यक्षमता ${answerText} बढ़ी है।`, `ਇਸ ਲਈ ਕਾਰਗੁਜ਼ਾਰੀ ${answerText} ਵਧੀ ਹੈ।`);
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return copy(language, `अतः आवश्यक उत्पादन ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉਤਪਾਦਨ ${answerText} ਹੈ।`);
    default:
      return copy(language, `अतः आवश्यक समय ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
  }
}

export function localizeTmwCp003Question(source: TmwCp003GeneratedQuestion, language: TmwLocalizedLanguage): TmwLocalizedQuestion {
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: localizedAnswerText(source, option.value, language),
  }));
  const options = optionAudit.map((option) => option.text);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText);
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);
  const answerText = localizedAnswerText(source, source.solution.answer, language);
  const errors = [...source.validation.errors];
  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  const stem = renderStem(source, language);
  const learnerText = [stem, opening(source.solveMode, language), trapReason(trapId, language), conclusion(source, answerText, language)].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) errors.push("Punjabi delivery has no Gurmukhi text");

  return {
    archetypeId: source.archetypeId,
    canonicalProblemId: source.canonicalProblemId,
    questionLanguageId: source.questionLanguageId,
    solveMode: source.solveMode,
    language,
    locale: displayLocale(language),
    sourceLanguage: "en",
    seed: source.seed,
    stem,
    parameters: source.parameters,
    solution: { ...source.solution, answerText },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: opening(source.solveMode, language),
      formula: source.explanation.formula,
      steps: source.explanation.steps.map((step) => localizeMath(step, language)),
      shortcut: shortcut(source.solveMode, answerText, language),
      commonTrap: {
        optionLabel: localizedOptionLabel(trapIndex, language),
        optionText: options[trapIndex] ?? options[0] ?? "",
        misconceptionId: trapId,
        explanation: trapReason(trapId, language),
      },
      conclusion: conclusion(source, answerText, language),
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
