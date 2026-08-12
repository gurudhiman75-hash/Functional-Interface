import type { ProbabilityNativeLanguage } from "../multilingual-foundation";

type NativeMathEventLabelRule = Readonly<{
  source: string;
  hi: string;
  pa: string;
}>;

export const PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES: readonly NativeMathEventLabelRule[] = Object.freeze([
  { source: "required event", hi: "\\text{आवश्यक घटना}", pa: "\\text{ਲੋੜੀਂਦੀ ਘਟਨਾ}" },
  { source: "at least one head", hi: "\\text{कम-से-कम एक चित}", pa: "\\text{ਘੱਟੋ-ਘੱਟ ਇੱਕ ਚਿੱਤ}" },
  { source: "not E", hi: "\\text{E की पूरक घटना}", pa: "\\text{E ਦੀ ਪੂਰਕ ਘਟਨਾ}" },
  { source: "A or B", hi: "A\\text{ या }B", pa: "A\\text{ ਜਾਂ }B" },
  { source: "Section A", hi: "\\text{सेक्शन A}", pa: "\\text{ਸੈਕਸ਼ਨ A}" },
  { source: "Section B", hi: "\\text{सेक्शन B}", pa: "\\text{ਸੈਕਸ਼ਨ B}" },
  { source: "Section A and Section B", hi: "\\text{सेक्शन A और सेक्शन B}", pa: "\\text{ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B}" },
  { source: "Section A or Section B", hi: "\\text{सेक्शन A या सेक्शन B}", pa: "\\text{ਸੈਕਸ਼ਨ A ਜਾਂ ਸੈਕਸ਼ਨ B}" },
  { source: "at least one red ball", hi: "\\text{कम-से-कम एक लाल गेंद}", pa: "\\text{ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ}" },
  { source: "red ball", hi: "\\text{लाल गेंद}", pa: "\\text{ਲਾਲ ਗੇਂਦ}" },
  { source: "blue ball", hi: "\\text{नीली गेंद}", pa: "\\text{ਨੀਲੀ ਗੇਂਦ}" },
  { source: "red pen", hi: "\\text{लाल पेन}", pa: "\\text{ਲਾਲ ਪੈਨ}" },
  { source: "red first", hi: "\\text{पहला चयन लाल}", pa: "\\text{ਪਹਿਲੀ ਚੋਣ ਲਾਲ}" },
  { source: "blue second", hi: "\\text{दूसरा चयन नीला}", pa: "\\text{ਦੂਜੀ ਚੋਣ ਨੀਲੀ}" },
  { source: "red-red", hi: "\\text{लाल-लाल}", pa: "\\text{ਲਾਲ-ਲਾਲ}" },
  { source: "red-blue", hi: "\\text{लाल-नीला}", pa: "\\text{ਲਾਲ-ਨੀਲਾ}" },
  { source: "blue-red", hi: "\\text{नीला-लाल}", pa: "\\text{ਨੀਲਾ-ਲਾਲ}" },
  { source: "blue-blue", hi: "\\text{नीला-नीला}", pa: "\\text{ਨੀਲਾ-ਨੀਲਾ}" },
  { source: "same colour", hi: "\\text{एक ही रंग}", pa: "\\text{ਇੱਕੋ ਰੰਗ}" },
  { source: "different colours", hi: "\\text{अलग-अलग रंग}", pa: "\\text{ਵੱਖ-ਵੱਖ ਰੰਗ}" },
  { source: "both", hi: "\\text{दोनों घटनाएँ}", pa: "\\text{ਦੋਵੇਂ ਘਟਨਾਵਾਂ}" },
  { source: "both red balls", hi: "\\text{दोनों लाल गेंदें}", pa: "\\text{ਦੋਵੇਂ ਲਾਲ ਗੇਂਦਾਂ}" },
  { source: "both red marbles", hi: "\\text{दोनों लाल कंचे}", pa: "\\text{ਦੋਵੇਂ ਲਾਲ ਕੰਚੇ}" },
  { source: "both red pens", hi: "\\text{दोनों लाल पेन}", pa: "\\text{ਦੋਵੇਂ ਲਾਲ ਪੈਨ}" },
  { source: "both red coloured stones", hi: "\\text{दोनों लाल रंगीन पत्थर}", pa: "\\text{ਦੋਵੇਂ ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ}" },
  { source: "red marble on each selection", hi: "\\text{हर चयन में लाल कंचा}", pa: "\\text{ਹਰ ਚੋਣ ਵਿੱਚ ਲਾਲ ਕੰਚਾ}" },
  { source: "red stone on each selection", hi: "\\text{हर चयन में लाल पत्थर}", pa: "\\text{ਹਰ ਚੋਣ ਵਿੱਚ ਲਾਲ ਪੱਥਰ}" },
  { source: "first post goes to a woman", hi: "\\text{पहला पद महिला को मिले}", pa: "\\text{ਪਹਿਲਾ ਅਹੁਦਾ ਔਰਤ ਨੂੰ ਮਿਲੇ}" },
]);

const EVENT_PATTERN = /P\\!\\left\((.*?)\\right\)/gu;

function localizedLabel(rule: NativeMathEventLabelRule, language: ProbabilityNativeLanguage): string {
  return language === "hi" ? rule.hi : rule.pa;
}

export function localizeProbabilityExplanationMathSegment(
  sourceMath: string,
  language: ProbabilityNativeLanguage,
): string {
  return sourceMath.replace(EVENT_PATTERN, (whole, label: string) => {
    const rule = PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES.find((candidate) => candidate.source === label);
    if (!rule) return whole;
    return `P\\!\\left(${localizedLabel(rule, language)}\\right)`;
  });
}

export function canonicalizeProbabilityExplanationMathSegment(
  nativeMath: string,
  language: ProbabilityNativeLanguage,
): string {
  let result = nativeMath;
  for (const rule of PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES) {
    const localized = `P\\!\\left(${localizedLabel(rule, language)}\\right)`;
    const source = `P\\!\\left(${rule.source}\\right)`;
    result = result.split(localized).join(source);
  }
  return result;
}

export function listProbabilityNativeMathEventLabels(): readonly string[] {
  return PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES.map((rule) => rule.source);
}
