import { required } from "./cp001-helpers";
import { formatRational } from "./rational";
import type { TmwCp003Parameters } from "./cp003-types";
import { formatLocalizedTime } from "./localization-glossary";
import type { TmwLocalizedLanguage } from "./localization-types";

interface CleanupQuestion {
  parameters: TmwCp003Parameters;
  stem: string;
  [key: string]: unknown;
}

const AGENTS: Record<string, { hi: string; pa: string }> = {
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

const OUTPUTS: Record<string, { hi: string; pa: string }> = {
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

function agent(
  p: TmwCp003Parameters,
  language: TmwLocalizedLanguage,
  letter: "A" | "B",
): string {
  return `${AGENTS[p.context.agentNoun]?.[language] ?? p.context.agentNoun} ${letter}`;
}

function output(
  p: TmwCp003Parameters,
  language: TmwLocalizedLanguage,
): string {
  return OUTPUTS[p.context.outputNoun]?.[language] ?? p.context.outputNoun;
}

function time(
  p: TmwCp003Parameters,
  value: NonNullable<TmwCp003Parameters["timeA"]>,
  language: TmwLocalizedLanguage,
): string {
  return formatLocalizedTime(value, p.timeUnit, language);
}

export function applyTmwCp003EditorialFieldCleanup<T extends CleanupQuestion>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  const p = question.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");

  if (qlId === "TMW-QL-046") {
    const workA = formatRational(required(p.workA, "workA"));
    const workB = formatRational(required(p.workB, "workB"));
    const timeA = time(p, required(p.timeA, "timeA"), language);
    const timeB = time(p, required(p.timeB, "timeB"), language);
    return {
      ...question,
      stem: language === "hi"
        ? `${A} ने ${timeA} में ${workA} इकाइयों का काम किया, जबकि ${B} ने ${timeB} में ${workB} इकाइयों का काम किया। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`
        : `${A} ਨੇ ${timeA} ਵਿੱਚ ${workA} ਇਕਾਈਆਂ ਦਾ ਕੰਮ ਕੀਤਾ, ਜਦਕਿ ${B} ਨੇ ${timeB} ਵਿੱਚ ${workB} ਇਕਾਈਆਂ ਦਾ ਕੰਮ ਕੀਤਾ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`,
    };
  }

  if (qlId === "TMW-QL-052") {
    const unit = output(p, language);
    const outputA = formatRational(required(p.outputA, "outputA"));
    const outputB = formatRational(required(p.outputB, "outputB"));
    const durationA = time(p, required(p.durationA, "durationA"), language);
    const durationB = time(p, required(p.durationB, "durationB"), language);
    return {
      ...question,
      stem: language === "hi"
        ? `${durationA} में ${A} का उत्पादन ${outputA} ${unit} रहा, जबकि ${durationB} में ${B} का उत्पादन ${outputB} ${unit} रहा। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`
        : `${durationA} ਵਿੱਚ ${A} ਦਾ ਉਤਪਾਦਨ ${outputA} ${unit} ਰਿਹਾ, ਜਦਕਿ ${durationB} ਵਿੱਚ ${B} ਦਾ ਉਤਪਾਦਨ ${outputB} ${unit} ਰਿਹਾ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`,
    };
  }

  if (qlId === "TMW-QL-053") {
    const unit = output(p, language);
    const outputB = formatRational(required(p.outputB, "outputB"));
    const durationA = time(p, required(p.durationA, "durationA"), language);
    const durationB = time(p, required(p.durationB, "durationB"), language);
    return {
      ...question,
      stem: language === "hi"
        ? `${A}:${B} की कार्यक्षमता का अनुपात ${formatRational(p.efficiencyA)}:${formatRational(p.efficiencyB)} है। ${durationB} में ${B} का उत्पादन ${outputB} ${unit} रहा। ${durationA} में ${A} का उत्पादन कितना होगा?`
        : `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${formatRational(p.efficiencyA)}:${formatRational(p.efficiencyB)} ਹੈ। ${durationB} ਵਿੱਚ ${B} ਦਾ ਉਤਪਾਦਨ ${outputB} ${unit} ਰਿਹਾ। ${durationA} ਵਿੱਚ ${A} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
    };
  }

  return question;
}
