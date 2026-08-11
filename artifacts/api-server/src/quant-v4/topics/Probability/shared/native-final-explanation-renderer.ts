import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion, ProbabilityVisual } from "./types";

type ObjectContext = "BALLS" | "MARBLES" | "PENS" | "STONES" | "NONE";

function objectContext(source: ProbabilityQuestion): ObjectContext {
  const stem = source.stem;
  if (/\bjar\b|\bmarbles?\b/iu.test(stem)) return "MARBLES";
  if (/\bbox\b.*\bpens?\b|\bpens?\b/iu.test(stem)) return "PENS";
  if (/\bpouch\b|\bcolou?red stones?\b/iu.test(stem)) return "STONES";
  if (/\bbag\b.*\bballs?\b|\bballs?\b/iu.test(stem)) return "BALLS";
  return "NONE";
}

function polishHindiLine(line: string, context: ObjectContext): string {
  if (context === "MARBLES") {
    return line
      .replace(/बैग/gu, "जार")
      .replace(/गेंदों/gu, "कंचों")
      .replace(/गेंदें/gu, "कंचे")
      .replace(/गेंद/gu, "कंचा");
  }
  if (context === "PENS") {
    return line
      .replace(/बैग/gu, "बॉक्स")
      .replace(/गेंदों/gu, "पेनों")
      .replace(/गेंदें/gu, "पेन")
      .replace(/गेंद/gu, "पेन");
  }
  if (context === "STONES") {
    return line
      .replace(/बैग/gu, "पाउच")
      .replace(/गेंदों/gu, "रंगीन पत्थरों")
      .replace(/गेंदें/gu, "रंगीन पत्थर")
      .replace(/गेंद/gu, "रंगीन पत्थर");
  }
  return line;
}

function polishPunjabiLine(line: string, context: ObjectContext): string {
  if (context === "MARBLES") {
    return line
      .replace(/ਬੈਗ/gu, "ਜਾਰ")
      .replace(/ਗੇਂਦਾਂ/gu, "ਕੰਚਿਆਂ")
      .replace(/ਗੇਂਦ/gu, "ਕੰਚਾ");
  }
  if (context === "PENS") {
    return line
      .replace(/ਬੈਗ/gu, "ਬਾਕਸ")
      .replace(/ਗੇਂਦਾਂ/gu, "ਪੈਨਾਂ")
      .replace(/ਗੇਂਦ/gu, "ਪੈਨ");
  }
  if (context === "STONES") {
    return line
      .replace(/ਬੈਗ/gu, "ਪਾਊਚ")
      .replace(/ਗੇਂਦਾਂ/gu, "ਰੰਗੀਨ ਪੱਥਰਾਂ")
      .replace(/ਗੇਂਦ/gu, "ਰੰਗੀਨ ਪੱਥਰ");
  }
  return line;
}

export function polishNativeExplanationLines(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  lines: readonly string[],
): string[] {
  const context = objectContext(source);
  return lines.map((line) => language === "hi" ? polishHindiLine(line, context) : polishPunjabiLine(line, context));
}

export function polishNativeVisual(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  visual: ProbabilityVisual,
): ProbabilityVisual {
  if (visual.strategyId !== "URN_COMPOSITION_DISPLAY") return visual;
  const context = objectContext(source);
  if (context === "NONE" || context === "BALLS") return visual;

  const red = String(visual.data.red ?? "");
  const blue = String(visual.data.blue ?? "");

  if (language === "hi") {
    if (context === "MARBLES") return {
      ...visual,
      title: "जार में कंचों की संरचना",
      altText: `${red} लाल और ${blue} नीले कंचों वाला चयन-चित्र।`,
    };
    if (context === "PENS") return {
      ...visual,
      title: "बॉक्स में पेनों की संरचना",
      altText: `${red} लाल और ${blue} नीले पेनों वाला चयन-चित्र।`,
    };
    return {
      ...visual,
      title: "पाउच में रंगीन पत्थरों की संरचना",
      altText: `${red} लाल और ${blue} नीले रंगीन पत्थरों वाला चयन-चित्र।`,
    };
  }

  if (context === "MARBLES") return {
    ...visual,
    title: "ਜਾਰ ਵਿੱਚ ਕੰਚਿਆਂ ਦੀ ਬਣਤਰ",
    altText: `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਕੰਚਿਆਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`,
  };
  if (context === "PENS") return {
    ...visual,
    title: "ਬਾਕਸ ਵਿੱਚ ਪੈਨਾਂ ਦੀ ਬਣਤਰ",
    altText: `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਪੈਨਾਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`,
  };
  return {
    ...visual,
    title: "ਪਾਊਚ ਵਿੱਚ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੀ ਬਣਤਰ",
    altText: `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`,
  };
}
