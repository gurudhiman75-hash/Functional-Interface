import { required } from "./cp001-helpers";
import { divide, formatRational } from "./rational";
import { ratioText } from "./cp003-solver";
import type { TmwCp003Parameters } from "./cp003-types";
import { formatLocalizedTime } from "./localization-glossary";
import type { TmwLocalizedLanguage } from "./localization-types";

interface ReviewedQuestion {
  parameters: TmwCp003Parameters;
  stem: string;
  solution: {
    answerText: string;
    [key: string]: unknown;
  };
  explanation: {
    opening: string;
    shortcut: {
      title: string;
      steps: string[];
    };
    commonTrap: {
      explanation: string;
      [key: string]: unknown;
    };
    conclusion: string;
    [key: string]: unknown;
  };
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
  parameters: TmwCp003Parameters,
  language: TmwLocalizedLanguage,
  letter: "A" | "B" | "C",
): string {
  const noun = AGENTS[parameters.context.agentNoun]?.[language]
    ?? parameters.context.agentNoun;
  return `${noun} ${letter}`;
}

function outputUnit(
  parameters: TmwCp003Parameters,
  language: TmwLocalizedLanguage,
): string {
  return OUTPUTS[parameters.context.outputNoun]?.[language]
    ?? parameters.context.outputNoun;
}

function time(
  parameters: TmwCp003Parameters,
  value: NonNullable<TmwCp003Parameters["timeA"]>,
  language: TmwLocalizedLanguage,
): string {
  return formatLocalizedTime(value, parameters.timeUnit, language);
}

function efficiencyRatio(parameters: TmwCp003Parameters): string {
  return ratioText(divide(parameters.efficiencyA, parameters.efficiencyB));
}

function rebuildUnequalTimeWorkStem(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const p = question.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const durationA = time(p, required(p.durationA, "durationA"), language);
  const durationB = time(p, required(p.durationB, "durationB"), language);
  const ratio = efficiencyRatio(p);
  const femininePlural = p.context.agentNoun === "machine";
  const stem = language === "hi"
    ? `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। ${A} ${durationA} और ${B} ${durationB} तक काम ${femininePlural ? "करती हैं" : "करते हैं"}। किए गए काम का अनुपात ${A}:${B} क्या होगा?`
    : `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${A} ${durationA} ਅਤੇ ${B} ${durationB} ਤੱਕ ਕੰਮ ${["machine", "crew"].includes(p.context.agentNoun) ? "ਕਰਦੀਆਂ ਹਨ" : "ਕਰਦੇ ਹਨ"}। ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੀ ਹੋਵੇਗਾ?`;
  return { ...question, stem };
}

function rebuildUnequalWorkEfficiencyStem(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const p = question.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const workA = formatRational(required(p.workA, "workA"));
  const workB = formatRational(required(p.workB, "workB"));
  const timeA = time(p, required(p.timeA, "timeA"), language);
  const timeB = time(p, required(p.timeB, "timeB"), language);
  const stem = language === "hi"
    ? `${A} ने ${timeA} में ${workA} इकाइयाँ काम किया, जबकि ${B} ने ${timeB} में ${workB} इकाइयाँ काम किया। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`
    : `${A} ਨੇ ${timeA} ਵਿੱਚ ${workA} ਇਕਾਈਆਂ ਕੰਮ ਕੀਤਾ, ਜਦਕਿ ${B} ਨੇ ${timeB} ਵਿੱਚ ${workB} ਇਕਾਈਆਂ ਕੰਮ ਕੀਤਾ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`;
  return { ...question, stem };
}

function rebuildReferenceOutputStem(
  question: ReviewedQuestion,
  qlId: string,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const p = question.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const unit = outputUnit(p, language);
  const ratio = efficiencyRatio(p);
  const outputA = formatRational(required(p.outputA, "outputA"));
  const outputB = formatRational(required(p.outputB, "outputB"));
  let stem: string;

  if (qlId === "TMW-QL-047") {
    stem = language === "hi"
      ? `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${ratio} है। ${B} का उत्पादन ${outputB} ${unit} है। ${A} का उत्पादन कितना होगा?`
      : `${A} ਅਤੇ ${B} ਇੱਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${B} ਦਾ ਉਤਪਾਦਨ ${outputB} ${unit} ਹੈ। ${A} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
  } else {
    stem = language === "hi"
      ? `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${ratio} है। ${A} का उत्पादन ${outputA} ${unit} है। ${B} का उत्पादन कितना होगा?`
      : `${A} ਅਤੇ ${B} ਇੱਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${A} ਦਾ ਉਤਪਾਦਨ ${outputA} ${unit} ਹੈ। ${B} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
  }
  return { ...question, stem };
}

function rebuildOutputTimeComparisonStem(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const p = question.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const unit = outputUnit(p, language);
  const outputA = formatRational(required(p.outputA, "outputA"));
  const outputB = formatRational(required(p.outputB, "outputB"));
  const durationA = time(p, required(p.durationA, "durationA"), language);
  const durationB = time(p, required(p.durationB, "durationB"), language);
  const stem = language === "hi"
    ? `${A} ने ${durationA} में ${outputA} ${unit} और ${B} ने ${durationB} में ${outputB} ${unit} पूरे किए। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`
    : `${A} ਨੇ ${durationA} ਵਿੱਚ ${outputA} ${unit} ਅਤੇ ${B} ਨੇ ${durationB} ਵਿੱਚ ${outputB} ${unit} ਪੂਰੇ ਕੀਤੇ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`;
  return { ...question, stem };
}

function rebuildComparativeOutputStem(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const p = question.parameters;
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const unit = outputUnit(p, language);
  const outputB = formatRational(required(p.outputB, "outputB"));
  const durationA = time(p, required(p.durationA, "durationA"), language);
  const durationB = time(p, required(p.durationB, "durationB"), language);
  const ratio = efficiencyRatio(p);
  const stem = language === "hi"
    ? `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। ${B} ने ${durationB} में ${outputB} ${unit} पूरे किए। ${A} ${durationA} में कितना उत्पादन करेगा?`
    : `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${B} ਨੇ ${durationB} ਵਿੱਚ ${outputB} ${unit} ਪੂਰੇ ਕੀਤੇ। ${A} ${durationA} ਵਿੱਚ ਕਿੰਨਾ ਉਤਪਾਦਨ ਕਰੇਗਾ?`;
  return { ...question, stem };
}

function withShortcut(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
  hi: string,
  pa: string,
): ReviewedQuestion {
  return {
    ...question,
    explanation: {
      ...question.explanation,
      shortcut: {
        ...question.explanation.shortcut,
        steps: [language === "hi" ? hi : pa],
      },
    },
  };
}

function withTrap(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
  hi: string,
  pa: string,
): ReviewedQuestion {
  return {
    ...question,
    explanation: {
      ...question.explanation,
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: language === "hi" ? hi : pa,
      },
    },
  };
}

export function applyTmwCp003EditorialReviewRemediation<
  T extends ReviewedQuestion,
>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  let updated: ReviewedQuestion = question;
  const answer = question.solution.answerText;

  if (qlId === "TMW-QL-037") {
    updated = withShortcut(
      updated,
      language,
      `समय अनुपात उलटने पर पहले सदस्य की कार्यक्षमता दूसरे से ${answer} अधिक है।`,
      `ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਉਲਟਣ ਉੱਤੇ ਪਹਿਲੇ ਮੈਂਬਰ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦੂਜੇ ਨਾਲੋਂ ${answer} ਵੱਧ ਹੈ।`,
    );
  }
  if (qlId === "TMW-QL-038") {
    updated = withShortcut(
      updated,
      language,
      `समय अनुपात उलटने पर पहले सदस्य की कार्यक्षमता दूसरे से ${answer} कम है।`,
      `ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਉਲਟਣ ਉੱਤੇ ਪਹਿਲੇ ਮੈਂਬਰ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦੂਜੇ ਨਾਲੋਂ ${answer} ਘੱਟ ਹੈ।`,
    );
  }
  if (qlId === "TMW-QL-039") {
    updated = withShortcut(
      updated,
      language,
      `अधिक कार्यक्षम सदस्य का समय = कम कार्यक्षम सदस्य का समय ÷ कार्यक्षमता-गुणक; उत्तर ${answer} है।`,
      `ਵੱਧ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ ਦਾ ਸਮਾਂ = ਘੱਟ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ ਦਾ ਸਮਾਂ ÷ ਕਾਰਗੁਜ਼ਾਰੀ-ਗੁਣਕ; ਜਵਾਬ ${answer} ਹੈ।`,
    );
  }
  if (qlId === "TMW-QL-040") {
    updated = withShortcut(
      updated,
      language,
      `कम कार्यक्षम सदस्य का समय = अधिक कार्यक्षम सदस्य का समय × कार्यक्षमता-गुणक; उत्तर ${answer} है।`,
      `ਘੱਟ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ ਦਾ ਸਮਾਂ = ਵੱਧ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ ਦਾ ਸਮਾਂ × ਕਾਰਗੁਜ਼ਾਰੀ-ਗੁਣਕ; ਜਵਾਬ ${answer} ਹੈ।`,
    );
    updated = withTrap(
      updated,
      language,
      "इस विकल्प में अधिक कार्यक्षम सदस्य के समय को गुणक से गुणा करने के बजाय भाग दिया गया है; कम कार्यक्षम सदस्य को अधिक समय लगना चाहिए।",
      "ਇਸ ਚੋਣ ਵਿੱਚ ਵੱਧ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ ਦੇ ਸਮੇਂ ਨੂੰ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਨ ਦੀ ਥਾਂ ਭਾਗ ਦਿੱਤਾ ਗਿਆ ਹੈ; ਘੱਟ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ ਨੂੰ ਵੱਧ ਸਮਾਂ ਲੱਗਣਾ ਚਾਹੀਦਾ ਹੈ।",
    );
  }
  if (qlId === "TMW-QL-044") {
    updated = rebuildUnequalTimeWorkStem(updated, language);
  }
  if (qlId === "TMW-QL-045") {
    updated = withTrap(
      updated,
      language,
      "यह विकल्प काम के अनुपात को ही समय का अनुपात मानता है; अलग कार्यक्षमताओं का उलटा प्रभाव नहीं लगाया गया।",
      "ਇਹ ਚੋਣ ਕੰਮ ਦੇ ਅਨੁਪਾਤ ਨੂੰ ਹੀ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਮੰਨਦੀ ਹੈ; ਵੱਖਰੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਉਲਟ ਅਸਰ ਨਹੀਂ ਲਗਾਇਆ ਗਿਆ।",
    );
  }
  if (qlId === "TMW-QL-046") {
    updated = rebuildUnequalWorkEfficiencyStem(updated, language);
    updated = withTrap(
      updated,
      language,
      "यह काम का अनुपात है; अलग-अलग समय से प्रति-दिन कार्यक्षमता निकालना छोड़ दिया गया है।",
      "ਇਹ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਹੈ; ਵੱਖਰੇ ਸਮਿਆਂ ਤੋਂ ਪ੍ਰਤੀ ਦਿਨ ਕਾਰਗੁਜ਼ਾਰੀ ਕੱਢਣੀ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ।",
    );
  }
  if (qlId === "TMW-QL-047" || qlId === "TMW-QL-048") {
    updated = rebuildReferenceOutputStem(updated, qlId, language);
  }
  if (qlId === "TMW-QL-049") {
    updated = withShortcut(
      updated,
      language,
      `व्यक्तिगत दरों को अनुपात के भाग मानें; संयुक्त दर से एक भाग निकालने पर आवश्यक अकेला समय ${answer} मिलता है।`,
      `ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ ਮੰਨੋ; ਸਾਂਝੀ ਦਰ ਤੋਂ ਇੱਕ ਹਿੱਸਾ ਕੱਢਣ ਉੱਤੇ ਲੋੜੀਂਦਾ ਇਕੱਲਾ ਸਮਾਂ ${answer} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if (qlId === "TMW-QL-052") {
    updated = rebuildOutputTimeComparisonStem(updated, language);
  }
  if (qlId === "TMW-QL-053") {
    updated = rebuildComparativeOutputStem(updated, language);
  }
  if (qlId === "TMW-QL-055") {
    updated = {
      ...updated,
      explanation: {
        ...updated.explanation,
        opening: language === "hi"
          ? "बीच वाले सदस्य की संख्या दोनों अनुपातों में समान करें, फिर दोनों अनुपात मिलाकर पहले और तीसरे सदस्य की तुलना निकालें।"
          : "ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਵਾਲੀ ਸੰਖਿਆ ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਵਿੱਚ ਇੱਕੋ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾ ਕੇ ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਮੈਂਬਰ ਦੀ ਤੁਲਨਾ ਕੱਢੋ।",
        shortcut: {
          ...updated.explanation.shortcut,
          steps: [language === "hi"
            ? `बीच वाले सदस्य की संख्या समान करके दोनों अनुपात मिलाने पर ${answer} मिलता है।`
            : `ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਵਾਲੀ ਸੰਖਿਆ ਇੱਕੋ ਕਰਕੇ ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਉਣ ਉੱਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`],
        },
      },
    };
  }
  if (qlId === "TMW-QL-056") {
    updated = withShortcut(
      updated,
      language,
      `दोनों प्रतिशतों के गुणक आपस में गुणा करें, 1 घटाएँ और प्रतिशत में बदलें; कुल बढ़त ${answer} है।`,
      `ਦੋਵੇਂ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦੇ ਗੁਣਕ ਆਪਸ ਵਿੱਚ ਗੁਣਾ ਕਰੋ, 1 ਘਟਾਓ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ; ਕੁੱਲ ਵਾਧਾ ${answer} ਹੈ।`,
    );
  }
  if (qlId === "TMW-QL-057") {
    updated = withTrap(
      updated,
      language,
      "समय की प्रतिशत कमी को ही कार्यक्षमता की प्रतिशत वृद्धि मान लिया गया है; कार्यक्षमता समय के उलटे अनुपात में बदलती है।",
      "ਸਮੇਂ ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਘਾਟ ਨੂੰ ਹੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਮੰਨਿਆ ਗਿਆ ਹੈ; ਕਾਰਗੁਜ਼ਾਰੀ ਸਮੇਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲਦੀ ਹੈ।",
    );
  }

  return updated as T;
}
