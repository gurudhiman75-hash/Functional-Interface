import { equals, formatRational, rational } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type {
  TmwCp010CycleSegment,
  TmwCp010GeneratedQuestion,
  TmwCp010Parameters,
  TmwCp010Stage,
} from "./cp010-types";
import type { TmwCp009Pipe } from "./cp009-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp009Copy,
  cp009Number,
  cp009PipeLabel,
  cp009Time,
} from "./localization-cp009-language";

const ZERO = rational(0);
const ONE = rational(1);

type Pair = { hi: string; pa: string };

const labelCopy: Record<string, Pair> = {
  "Before Inlet B opens": { hi: "भरने वाली पाइप B खुलने से पहले", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ B ਖੁੱਲ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After Inlet B opens": { hi: "भरने वाली पाइप B खुलने के बाद", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ B ਖੁੱਲ੍ਹਣ ਤੋਂ ਬਾਅਦ" },
  "Before Outlet B opens": { hi: "निकासी पाइप B खुलने से पहले", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਖੁੱਲ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After Outlet B opens": { hi: "निकासी पाइप B खुलने के बाद", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਖੁੱਲ੍ਹਣ ਤੋਂ ਬਾਅਦ" },
  "Before the leak begins": { hi: "रिसाव शुरू होने से पहले", pa: "ਰਿਸਾਅ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After the leak begins": { hi: "रिसाव शुरू होने के बाद", pa: "ਰਿਸਾਅ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ" },
  "Before the leak is repaired": { hi: "रिसाव की मरम्मत से पहले", pa: "ਰਿਸਾਅ ਦੀ ਮੁਰੰਮਤ ਤੋਂ ਪਹਿਲਾਂ" },
  "After the leak is repaired": { hi: "रिसाव की मरम्मत के बाद", pa: "ਰਿਸਾਅ ਦੀ ਮੁਰੰਮਤ ਤੋਂ ਬਾਅਦ" },
  "Before Outlet B closes": { hi: "निकासी पाइप B बंद होने से पहले", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਬੰਦ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After Outlet B closes": { hi: "निकासी पाइप B बंद होने के बाद", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ" },
  "Before Inlet A closes": { hi: "भरने वाली पाइप A बंद होने से पहले", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਬੰਦ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After Inlet A closes": { hi: "भरने वाली पाइप A बंद होने के बाद", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ" },
  "Before the temporary outlet is shut": { hi: "अस्थायी निकासी पाइप बंद होने से पहले", pa: "ਅਸਥਾਈ ਨਿਕਾਸੀ ਪਾਈਪ ਬੰਦ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After the temporary outlet is shut": { hi: "अस्थायी निकासी पाइप बंद होने के बाद", pa: "ਅਸਥਾਈ ਨਿਕਾਸੀ ਪਾਈਪ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ" },
  "First interval": { hi: "पहला अंतराल", pa: "ਪਹਿਲਾ ਅੰਤਰਾਲ" },
  "Second interval": { hi: "दूसरा अंतराल", pa: "ਦੂਜਾ ਅੰਤਰਾਲ" },
  "Final interval": { hi: "अंतिम अंतराल", pa: "ਅੰਤਿਮ ਅੰਤਰਾਲ" },
  "Initial pumping interval": { hi: "प्रारंभिक पंपिंग अंतराल", pa: "ਸ਼ੁਰੂਆਤੀ ਪੰਪਿੰਗ ਅੰਤਰਾਲ" },
  "Power-cut interval": { hi: "बिजली-बंदी अंतराल", pa: "ਬਿਜਲੀ ਬੰਦ ਅੰਤਰਾਲ" },
  "Pumping resumes": { hi: "पंपिंग दोबारा शुरू", pa: "ਪੰਪਿੰਗ ਮੁੜ ਸ਼ੁਰੂ" },
  "Initial scheduled interval": { hi: "प्रारंभिक निर्धारित अंतराल", pa: "ਸ਼ੁਰੂਆਤੀ ਨਿਰਧਾਰਤ ਅੰਤਰਾਲ" },
  "Final filling interval": { hi: "अंतिम भराव अंतराल", pa: "ਅੰਤਿਮ ਭਰਾਅ ਅੰਤਰਾਲ" },
  "Before the level sensor switches": { hi: "स्तर-सेंसर बदलने से पहले", pa: "ਪੱਧਰ ਸੈਂਸਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ" },
  "After the level sensor switches": { hi: "स्तर-सेंसर बदलने के बाद", pa: "ਪੱਧਰ ਸੈਂਸਰ ਬਦਲਣ ਤੋਂ ਬਾਅਦ" },
  "Before the event": { hi: "घटना से पहले", pa: "ਘਟਨਾ ਤੋਂ ਪਹਿਲਾਂ" },
  "After the event": { hi: "घटना के बाद", pa: "ਘਟਨਾ ਤੋਂ ਬਾਅਦ" },
  "Known first interval": { hi: "ज्ञात पहला अंतराल", pa: "ਪਤਾ ਪਹਿਲਾ ਅੰਤਰਾਲ" },
  "Required final interval": { hi: "आवश्यक अंतिम अंतराल", pa: "ਲੋੜੀਂਦਾ ਅੰਤਿਮ ਅੰਤਰਾਲ" },
  "Morning inlet": { hi: "सुबह का भराव", pa: "ਸਵੇਰ ਦਾ ਭਰਾਅ" },
  "Simultaneous inlet and outlet": { hi: "एक साथ भराव और निकासी", pa: "ਇਕੱਠੇ ਭਰਾਅ ਅਤੇ ਨਿਕਾਸੀ" },
  "Primary pump": { hi: "मुख्य पंप", pa: "ਮੁੱਖ ਪੰਪ" },
  "Reduced net flow": { hi: "घटा हुआ शुद्ध प्रवाह", pa: "ਘਟਿਆ ਹੋਇਆ ਸ਼ੁੱਧ ਪ੍ਰਵਾਹ" },
  "First shift": { hi: "पहली पाली", pa: "ਪਹਿਲੀ ਸ਼ਿਫ਼ਟ" },
  "Second shift": { hi: "दूसरी पाली", pa: "ਦੂਜੀ ਸ਼ਿਫ਼ਟ" },
  "Initial pumping": { hi: "प्रारंभिक पंपिंग", pa: "ਸ਼ੁਰੂਆਤੀ ਪੰਪਿੰਗ" },
  "Final pumping": { hi: "अंतिम पंपिंग", pa: "ਅੰਤਿਮ ਪੰਪਿੰਗ" },
  "Inlet A hour": { hi: "भरने वाली पाइप A का घंटा", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਦਾ ਘੰਟਾ" },
  "Outlet B hour": { hi: "निकासी पाइप B का घंटा", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਦਾ ਘੰਟਾ" },
  "Inlet B hour": { hi: "भरने वाली पाइप B का घंटा", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ B ਦਾ ਘੰਟਾ" },
  "Both inlets operate": { hi: "दोनों भरने वाली पाइपें चलती हैं", pa: "ਦੋਵੇਂ ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ ਚੱਲਦੀਆਂ ਹਨ" },
  "Only Inlet A operates": { hi: "केवल भरने वाली पाइप A चलती है", pa: "ਕੇਵਲ ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਚੱਲਦੀ ਹੈ" },
  "Outlet operates": { hi: "निकासी पाइप चलती है", pa: "ਨਿਕਾਸੀ ਪਾਈਪ ਚੱਲਦੀ ਹੈ" },
  "Inlet-only interval": { hi: "केवल भराव वाला अंतराल", pa: "ਕੇਵਲ ਭਰਾਅ ਵਾਲਾ ਅੰਤਰਾਲ" },
  "Mixed-flow interval": { hi: "मिश्रित-प्रवाह अंतराल", pa: "ਮਿਲਿਆ-ਜੁਲਿਆ ਪ੍ਰਵਾਹ ਅੰਤਰਾਲ" },
  "Fast inlet shift": { hi: "तेज़ भराव पाली", pa: "ਤੇਜ਼ ਭਰਾਅ ਸ਼ਿਫ਼ਟ" },
  "Slow inlet shift": { hi: "धीमी भराव पाली", pa: "ਹੌਲੀ ਭਰਾਅ ਸ਼ਿਫ਼ਟ" },
  "Drainage check": { hi: "निकासी जाँच", pa: "ਨਿਕਾਸੀ ਜਾਂਚ" },
  "Dual-pump interval": { hi: "दो-पंप अंतराल", pa: "ਦੋ-ਪੰਪ ਅੰਤਰਾਲ" },
  "Single-pump interval": { hi: "एक-पंप अंतराल", pa: "ਇੱਕ-ਪੰਪ ਅੰਤਰਾਲ" },
  "Inlet A shift": { hi: "भरने वाली पाइप A की पाली", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਦੀ ਸ਼ਿਫ਼ਟ" },
  "Outlet B shift": { hi: "निकासी पाइप B की पाली", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਦੀ ਸ਼ਿਫ਼ਟ" },
  "Inlet C shift": { hi: "भरने वाली पाइप C की पाली", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ C ਦੀ ਸ਼ਿਫ਼ਟ" },
  "Inlet interval": { hi: "भराव अंतराल", pa: "ਭਰਾਅ ਅੰਤਰਾਲ" },
  "Outlet interval": { hi: "निकासी अंतराल", pa: "ਨਿਕਾਸੀ ਅੰਤਰਾਲ" },
  "Inlet A interval": { hi: "भरने वाली पाइप A का अंतराल", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਦਾ ਅੰਤਰਾਲ" },
  "Outlet B interval": { hi: "निकासी पाइप B का अंतराल", pa: "ਨਿਕਾਸੀ ਪਾਈਪ B ਦਾ ਅੰਤਰਾਲ" },
  "Inlet C interval": { hi: "भरने वाली पाइप C का अंतराल", pa: "ਭਰਨ ਵਾਲੀ ਪਾਈਪ C ਦਾ ਅੰਤਰਾਲ" },
};

export function cp010Label(value: string, language: TmwLocalizedLanguage): string {
  return labelCopy[value]?.[language] ?? value
    .replace(/Inlet ([A-Z])/g, language === "hi" ? "भरने वाली पाइप $1" : "ਭਰਨ ਵਾਲੀ ਪਾਈਪ $1")
    .replace(/Outlet ([A-Z])/g, language === "hi" ? "निकासी पाइप $1" : "ਨਿਕਾਸੀ ਪਾਈਪ $1")
    .replace(/Leak ([A-Z])/g, language === "hi" ? "रिसाव $1" : "ਰਿਸਾਅ $1")
    .replace(/Final Pipe/g, language === "hi" ? "अंतिम पाइप" : "ਅੰਤਿਮ ਪਾਈਪ")
    .replace(/interval/gi, language === "hi" ? "अंतराल" : "ਅੰਤਰਾਲ")
    .replace(/shift/gi, language === "hi" ? "पाली" : "ਸ਼ਿਫ਼ਟ");
}

export function cp010ParseAnswerKey(key: string): Rational[] {
  return key.split("|").map((part) => {
    const [numerator, denominator] = part.split("/").map(Number);
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
      throw new Error(`Invalid CP-010 answer key: ${key}`);
    }
    return rational(numerator, denominator);
  });
}

function mixedLatex(value: Rational): string {
  const sign = value.numerator < 0 ? "-" : "";
  const absolute = Math.abs(value.numerator);
  const whole = Math.trunc(absolute / value.denominator);
  const remainder = absolute % value.denominator;
  if (remainder === 0) return `${sign}${whole}`;
  if (whole === 0) return `${sign}\\frac{${remainder}}{${value.denominator}}`;
  return `${sign}${whole}\\frac{${remainder}}{${value.denominator}}`;
}

function fractional(value: Rational, suffix: string): string {
  if (value.denominator === 1) return `${value.numerator} ${suffix}`;
  return `\\(${mixedLatex(value)}\\;\\text{${suffix}}\\)`;
}

export function cp010Level(value: Rational, language: TmwLocalizedLanguage): string {
  if (equals(value, ZERO)) return language === "hi" ? "पूरी तरह खाली" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ";
  if (equals(value, ONE)) return language === "hi" ? "पूरी तरह भरी" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ";
  return language === "hi" ? `${formatRational(value)} भरी` : `${formatRational(value)} ਭਰੀ`;
}

export function cp010Boundary(parameters: TmwCp010Parameters, language: TmwLocalizedLanguage): string {
  return parameters.targetBoundary === "EMPTY"
    ? (language === "hi" ? "पूरी तरह खाली" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ")
    : (language === "hi" ? "पूरी तरह भरी" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ");
}

export function cp010PipeFact(pipe: TmwCp009Pipe, tank: string, language: TmwLocalizedLanguage): string {
  const label = cp009PipeLabel(pipe, language);
  const time = cp009Time(pipe.soloTime, language);
  if (pipe.kind === "INLET") {
    return language === "hi"
      ? `${label} अकेले ${tank} को ${time} में भरती है`
      : `${label} ਇਕੱਲੀ ${tank} ਨੂੰ ${time} ਵਿੱਚ ਭਰਦੀ ਹੈ`;
  }
  if (pipe.kind === "LEAK") {
    return language === "hi"
      ? `${label} अकेला पूरी भरी ${tank} को ${time} में खाली करता है`
      : `${label} ਇਕੱਲਾ ਪੂਰੀ ਭਰੀ ${tank} ਨੂੰ ${time} ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ`;
  }
  return language === "hi"
    ? `${label} अकेले पूरी भरी ${tank} को ${time} में खाली करती है`
    : `${label} ਇਕੱਲੀ ਪੂਰੀ ਭਰੀ ${tank} ਨੂੰ ${time} ਵਿੱਚ ਖਾਲੀ ਕਰਦੀ ਹੈ`;
}

export function cp010UniquePipes(groups: readonly TmwCp009Pipe[][]): TmwCp009Pipe[] {
  const seen = new Set<string>();
  const result: TmwCp009Pipe[] = [];
  for (const group of groups) {
    for (const pipe of group) {
      const key = `${pipe.label}:${pipe.kind}:${pipe.soloTime.numerator}/${pipe.soloTime.denominator}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(pipe);
    }
  }
  return result;
}

export function cp010Capabilities(pipes: TmwCp009Pipe[], tank: string, language: TmwLocalizedLanguage): string {
  return pipes.map((pipe) => `${cp010PipeFact(pipe, tank, language)}।`).join(" ");
}

function joinLabels(labels: string[], language: TmwLocalizedLanguage): string {
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return labels.join(language === "hi" ? " और " : " ਅਤੇ ");
  return `${labels.slice(0, -1).join(", ")}${language === "hi" ? " और " : " ਅਤੇ "}${labels.at(-1)}`;
}

export function cp010Arrangement(pipes: TmwCp009Pipe[], language: TmwLocalizedLanguage): string {
  if (pipes.length === 0) return language === "hi" ? "सारा प्रवाह बंद रहता है" : "ਸਾਰਾ ਪ੍ਰਵਾਹ ਬੰਦ ਰਹਿੰਦਾ ਹੈ";
  const labels = joinLabels(pipes.map((pipe) => cp009PipeLabel(pipe, language)), language);
  if (language === "hi") return pipes.length === 1 ? `${labels} चलती है` : `${labels} एक साथ चलते हैं`;
  return pipes.length === 1 ? `${labels} ਚੱਲਦੀ ਹੈ` : `${labels} ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ`;
}

export function cp010StageText(stage: TmwCp010Stage, language: TmwLocalizedLanguage): string {
  const duration = stage.duration ? (language === "hi" ? ` ${cp009Time(stage.duration, language)} तक` : ` ${cp009Time(stage.duration, language)} ਲਈ`) : "";
  if (stage.idle || stage.pipes.length === 0) {
    return `${cp010Label(stage.label, language)}: ${language === "hi" ? "सारा प्रवाह बंद" : "ਸਾਰਾ ਪ੍ਰਵਾਹ ਬੰਦ"}${duration}`;
  }
  return `${cp010Label(stage.label, language)}: ${cp010Arrangement(stage.pipes, language)}${duration}`;
}

export function cp010SegmentText(segment: TmwCp010CycleSegment, language: TmwLocalizedLanguage): string {
  return `${cp010Label(segment.label, language)}: ${cp010Arrangement(segment.pipes, language)}${language === "hi" ? `, अवधि ${cp009Time(segment.duration, language)}` : `, ਮਿਆਦ ${cp009Time(segment.duration, language)}`}`;
}

export function cp010NumberedSegments(cycle: TmwCp010CycleSegment[], language: TmwLocalizedLanguage): string {
  return cycle.map((segment, index) => `${index + 1}. ${cp010SegmentText(segment, language)}।`).join(" ");
}

function indianInteger(value: Rational): string {
  if (value.denominator !== 1) return cp009Number(value);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value.numerator);
}

export function cp010AnswerText(
  source: TmwCp010GeneratedQuestion,
  values: Rational[],
  language: TmwLocalizedLanguage,
  terminalIndex?: number,
): string {
  const first = values[0];
  switch (source.solution.answerType) {
    case "TIME": {
      const time = cp009Time(first, language);
      if (source.solveMode !== "findScheduleAdjustmentForDeadline") return time;
      const direction = source.parameters.adjustmentDirection === "EARLIER"
        ? (language === "hi" ? "पहले" : "ਪਹਿਲਾਂ")
        : (language === "hi" ? "बाद में" : "ਬਾਅਦ");
      return `${time} ${direction}`;
    }
    case "LEVEL":
      return cp010Level(first, language);
    case "FLOW_RATE":
      return fractional(first, language === "hi" ? "टंकी प्रति घंटा भराव" : "ਟੈਂਕੀ ਪ੍ਰਤੀ ਘੰਟਾ ਭਰਾਅ");
    case "CAPACITY":
      return `${indianInteger(first)} ${language === "hi" ? "लीटर" : "ਲੀਟਰ"}`;
    case "COUNT":
      return language === "hi"
        ? `${first.numerator} पूरे चक्र`
        : `${first.numerator} ਪੂਰੇ ਚੱਕਰ`;
    case "SEGMENT": {
      const index = terminalIndex ?? first.numerator;
      return cp010Label(required(source.parameters.cycle, "cycle")[index].label, language);
    }
  }
}

export function cp010OptionText(
  source: TmwCp010GeneratedQuestion,
  key: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solution.answerType !== "SEGMENT") {
    return cp010AnswerText(source, cp010ParseAnswerKey(key), language, source.solution.terminalSegmentIndex);
  }
  if (key.startsWith("segment:")) {
    const index = Number(key.slice("segment:".length));
    return cp010Label(required(source.parameters.cycle, "cycle")[index].label, language);
  }
  if (key === "extra:0") return language === "hi" ? "इस कार्यक्रम में टंकी कभी पूरी नहीं भरती" : "ਇਸ ਕਾਰਜਕ੍ਰਮ ਵਿੱਚ ਟੈਂਕੀ ਕਦੇ ਪੂਰੀ ਨਹੀਂ ਭਰਦੀ";
  if (key === "extra:1") return language === "hi" ? "दोहराव कार्यक्रम शुरू होने से पहले" : "ਦੁਹਰਾਅ ਕਾਰਜਕ੍ਰਮ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ";
  return language === "hi" ? "अंतिम खंड निर्धारित नहीं किया जा सकता" : "ਅੰਤਿਮ ਖੰਡ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ";
}

export function cp010Context(parameters: TmwCp010Parameters, language: TmwLocalizedLanguage): { setting: string; tank: string } {
  return {
    setting: cp009Copy(parameters.context.setting, language),
    tank: cp009Copy(parameters.context.tankLabel, language),
  };
}
