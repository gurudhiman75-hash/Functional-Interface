import { letterPosition, oppositeLetter } from "../foundation/alphabet";
import { generateAlphabetAnalogy, type AlphabetLayout, type GeneratedAlphabetAnalogy } from "./generator";
import type { AlphabetRuleContext } from "./rule-definitions";

export type AlphabetLocale = "hi-IN" | "pa-IN";

export interface LocalizedAlphabetAnalogy extends GeneratedAlphabetAnalogy {
  locale: AlphabetLocale;
}

function ruleText(ruleId: string, context: AlphabetRuleContext, locale: AlphabetLocale): string {
  const hi = locale === "hi-IN";
  const shift = context.shift;
  const texts: Record<string, string> = hi ? {
    ALPHA_SHIFT_FORWARD: `अक्षर को वर्णमाला में ${shift} स्थान आगे बढ़ाते हैं`,
    ALPHA_SHIFT_BACKWARD: `अक्षर को वर्णमाला में ${shift} स्थान पीछे ले जाते हैं`,
    ALPHA_OPPOSITE: "वर्णमाला का विपरीत अक्षर लेते हैं",
    ALPHA_OPPOSITE_FORWARD: `पहले विपरीत अक्षर लेते हैं और फिर ${shift} स्थान आगे बढ़ते हैं`,
    ALPHA_OPPOSITE_BACKWARD: `पहले विपरीत अक्षर लेते हैं और फिर ${shift} स्थान पीछे जाते हैं`,
    ALPHA_POSITION_DOUBLE: "अक्षर की वर्णमाला-स्थिति को दोगुना करते हैं",
    ALPHA_POSITION_DOUBLE_MINUS_ONE: "अक्षर की स्थिति को दोगुना करके एक घटाते हैं",
    ALPHA_POSITION_HALF: "सम वर्णमाला-स्थिति को आधा करते हैं",
    ALPHA_POSITION_HALF_ROUND_UP: "विषम वर्णमाला-स्थिति में एक जोड़कर आधा करते हैं",
    ALPHA_OPPOSITE_OF_DOUBLE: "स्थिति को दोगुना करके प्राप्त स्थिति का विपरीत लेते हैं",
  } : {
    ALPHA_SHIFT_FORWARD: `ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${shift} ਥਾਂ ਅੱਗੇ ਲਿਜਾਇਆ ਜਾਂਦਾ ਹੈ`,
    ALPHA_SHIFT_BACKWARD: `ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${shift} ਥਾਂ ਪਿੱਛੇ ਲਿਜਾਇਆ ਜਾਂਦਾ ਹੈ`,
    ALPHA_OPPOSITE: "ਵਰਣਮਾਲਾ ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ ਲਿਆ ਜਾਂਦਾ ਹੈ",
    ALPHA_OPPOSITE_FORWARD: `ਪਹਿਲਾਂ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈ ਕੇ ${shift} ਥਾਂ ਅੱਗੇ ਵਧਦੇ ਹਾਂ`,
    ALPHA_OPPOSITE_BACKWARD: `ਪਹਿਲਾਂ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈ ਕੇ ${shift} ਥਾਂ ਪਿੱਛੇ ਜਾਂਦੇ ਹਾਂ`,
    ALPHA_POSITION_DOUBLE: "ਅੱਖਰ ਦੀ ਵਰਣਮਾਲਾ-ਸਥਿਤੀ ਨੂੰ ਦੁੱਗਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
    ALPHA_POSITION_DOUBLE_MINUS_ONE: "ਅੱਖਰ ਦੀ ਸਥਿਤੀ ਨੂੰ ਦੁੱਗਣਾ ਕਰਕੇ ਇੱਕ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ",
    ALPHA_POSITION_HALF: "ਜੋੜੀ ਵਰਣਮਾਲਾ-ਸਥਿਤੀ ਨੂੰ ਅੱਧਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
    ALPHA_POSITION_HALF_ROUND_UP: "ਟਾਂਕ ਵਰਣਮਾਲਾ-ਸਥਿਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜ ਕੇ ਅੱਧਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
    ALPHA_OPPOSITE_OF_DOUBLE: "ਸਥਿਤੀ ਨੂੰ ਦੁੱਗਣਾ ਕਰਕੇ ਮਿਲੀ ਸਥਿਤੀ ਦਾ ਵਿਰੋਧੀ ਲਿਆ ਜਾਂਦਾ ਹੈ",
  };
  const text = texts[ruleId];
  if (!text) throw new Error(`Missing ${locale} text for ${ruleId}`);
  return text;
}

function localizedStep(
  ruleId: string,
  input: string,
  output: string,
  context: AlphabetRuleContext,
  locale: AlphabetLocale,
): string {
  const p = letterPosition(input);
  const q = letterPosition(output);
  const hi = locale === "hi-IN";
  const shift = context.shift;
  if (ruleId === "ALPHA_SHIFT_FORWARD") return hi
    ? `${input} से ${shift} स्थान आगे बढ़ने पर ${output} मिलता है।`
    : `${input} ਤੋਂ ${shift} ਥਾਂ ਅੱਗੇ ਜਾਣ ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
  if (ruleId === "ALPHA_SHIFT_BACKWARD") return hi
    ? `${input} से ${shift} स्थान पीछे जाने पर ${output} मिलता है।`
    : `${input} ਤੋਂ ${shift} ਥਾਂ ਪਿੱਛੇ ਜਾਣ ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
  if (ruleId === "ALPHA_OPPOSITE") return hi
    ? `${input} की स्थिति ${p} है; इसकी विपरीत स्थिति ${27 - p} है, इसलिए अक्षर ${output} है।`
    : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; ਇਸ ਦੀ ਵਿਰੋਧੀ ਸਥਿਤੀ ${27 - p} ਹੈ, ਇਸ ਲਈ ਅੱਖਰ ${output} ਹੈ।`;
  if (ruleId === "ALPHA_OPPOSITE_FORWARD" || ruleId === "ALPHA_OPPOSITE_BACKWARD") {
    const opposite = oppositeLetter(input);
    const direction = ruleId.endsWith("FORWARD")
      ? (hi ? "आगे" : "ਅੱਗੇ")
      : (hi ? "पीछे" : "ਪਿੱਛੇ");
    return hi
      ? `${input} का विपरीत अक्षर ${opposite} है; वहाँ से ${shift} स्थान ${direction} जाने पर ${output} मिलता है।`
      : `${input} ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ ${opposite} ਹੈ; ਉੱਥੋਂ ${shift} ਥਾਂ ${direction} ਜਾਣ ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
  }
  const calculations: Record<string, string> = {
    ALPHA_POSITION_DOUBLE: `2 × ${p} = ${q}`,
    ALPHA_POSITION_DOUBLE_MINUS_ONE: `2 × ${p} - 1 = ${q}`,
    ALPHA_POSITION_HALF: `${p} ÷ 2 = ${q}`,
    ALPHA_POSITION_HALF_ROUND_UP: `(${p} + 1) ÷ 2 = ${q}`,
    ALPHA_OPPOSITE_OF_DOUBLE: `27 - (2 × ${p}) = ${q}`,
  };
  const calculation = calculations[ruleId];
  if (!calculation) throw new Error(`Missing localized calculation for ${ruleId}`);
  return hi
    ? `${input} की स्थिति ${p} है; ${calculation}, अतः अक्षर ${output} है।`
    : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; ${calculation}, ਇਸ ਲਈ ਅੱਖਰ ${output} ਹੈ।`;
}

function renderStem(base: GeneratedAlphabetAnalogy, locale: AlphabetLocale): string {
  const hi = locale === "hi-IN";
  const { source, target, layout } = base;
  if (base.presentationMode === "MISSING_FOURTH_TERM") {
    if (layout === "ARROW") return `${source.left} → ${source.right}  ::  ${target.left} → ?`;
    if (layout === "TWO_ROW_TABLE") {
      return `${hi ? "उसी वर्णमाला-संबंध से दूसरी पंक्ति पूरी कीजिए।" : "ਉਸੇ ਵਰਣਮਾਲਾ-ਸੰਬੰਧ ਨਾਲ ਦੂਜੀ ਕਤਾਰ ਪੂਰੀ ਕਰੋ।"}\n\n| ${hi ? "युग्म" : "ਜੋੜਾ"} | ${hi ? "पहला अक्षर" : "ਪਹਿਲਾ ਅੱਖਰ"} | ${hi ? "दूसरा अक्षर" : "ਦੂਜਾ ਅੱਖਰ"} |\n|---|---|---|\n| A | ${source.left} | ${source.right} |\n| B | ${target.left} | ? |`;
    }
    if (layout === "BOXED_PAIRS") return `[ ${source.left} : ${source.right} ]  ::  [ ${target.left} : ? ]`;
    return `${source.left} : ${source.right} :: ${target.left} : ?`;
  }
  const prefix = hi
    ? "उस अक्षर-युग्म को चुनिए जो इसी संबंध का पालन करता है"
    : "ਉਹ ਅੱਖਰ-ਜੋੜਾ ਚੁਣੋ ਜੋ ਇਸੇ ਸੰਬੰਧ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ";
  if (layout === "ARROW") return `${prefix}: ${source.left} → ${source.right}`;
  if (layout === "TWO_ROW_TABLE") return `${prefix}: | ${source.left} | ${source.right} |`;
  if (layout === "BOXED_PAIRS") return `${prefix}: [ ${source.left} : ${source.right} ]`;
  return `${prefix}: ${source.left} : ${source.right}`;
}

export function generateLocalizedAlphabetAnalogy(
  qlId: string,
  locale: AlphabetLocale,
  seed = 0,
): LocalizedAlphabetAnalogy {
  const base = generateAlphabetAnalogy(qlId, seed);
  const hi = locale === "hi-IN";
  return {
    ...base,
    locale,
    stem: renderStem(base, locale),
    explanation: {
      ruleStatement: `${hi ? "संबंध का नियम है" : "ਸੰਬੰਧ ਦਾ ਨਿਯਮ ਹੈ"}: ${ruleText(base.ruleId, base.context, locale)}।`,
      sourceDemonstration: localizedStep(base.ruleId, base.source.left, base.source.right, base.context, locale),
      targetApplication: localizedStep(base.ruleId, base.target.left, base.target.right, base.context, locale),
      conclusion: base.presentationMode === "MISSING_FOURTH_TERM"
        ? (hi ? `अतः ${base.target.right} लुप्त अक्षर है।` : `ਇਸ ਲਈ ${base.target.right} ਗੁੰਮ ਅੱਖਰ ਹੈ।`)
        : (hi ? `अतः ${base.target.left} : ${base.target.right} समान नियम का पालन करता है।` : `ਇਸ ਲਈ ${base.target.left} : ${base.target.right} ਉਸੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।`),
      closestTrapRejection: hi
        ? "अन्य विकल्प निकटवर्ती स्थान, विपरीत अक्षर या दिशा की सामान्य भूलों से बने हैं, पर दिखाए गए नियम से नहीं।"
        : "ਹੋਰ ਵਿਕਲਪ ਨੇੜਲੀ ਸਥਿਤੀ, ਵਿਰੋਧੀ ਅੱਖਰ ਜਾਂ ਦਿਸ਼ਾ ਦੀਆਂ ਆਮ ਗਲਤੀਆਂ ਤੋਂ ਬਣੇ ਹਨ, ਪਰ ਦਿਖਾਏ ਨਿਯਮ ਤੋਂ ਨਹੀਂ।",
    },
  };
}
