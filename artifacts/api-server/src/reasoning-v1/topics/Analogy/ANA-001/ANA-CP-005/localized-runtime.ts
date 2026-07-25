import { letterPosition, oppositeLetter } from "../foundation/alphabet";
import { generateAlphabetAnalogy, type GeneratedAlphabetAnalogy } from "./generator";
import type { AlphabetRuleContext } from "./rule-definitions";

export type AlphabetLocale = "hi-IN" | "pa-IN";

export interface LocalizedAlphabetAnalogy extends GeneratedAlphabetAnalogy {
  locale: AlphabetLocale;
}

const VOWELS = ["A", "E", "I", "O", "U"] as const;
const CORRESPONDING_CONSONANTS = ["B", "C", "D", "F", "G"] as const;

function signedMovement(value: number, locale: AlphabetLocale): string {
  const amount = Math.abs(value);
  if (locale === "hi-IN") return `${amount} स्थान ${value > 0 ? "आगे" : "पीछे"}`;
  return `${amount} ਥਾਂ ${value > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ"}`;
}

function ruleText(ruleId: string, context: AlphabetRuleContext, locale: AlphabetLocale): string {
  const hi = locale === "hi-IN";
  const texts: Record<string, string> = hi ? {
    ALPHA_FIXED_SHIFT_FORWARD: `वर्णमाला में ${context.shift} स्थान आगे बढ़ते हैं, बिना Z को पार किए`,
    ALPHA_FIXED_SHIFT_BACKWARD: `वर्णमाला में ${context.shift} स्थान पीछे जाते हैं, बिना A को पार किए`,
    ALPHA_CYCLIC_SHIFT_FORWARD: `वर्णमाला में ${context.shift} स्थान आगे बढ़ते हैं और Z के बाद A से जारी रखते हैं`,
    ALPHA_CYCLIC_SHIFT_BACKWARD: `वर्णमाला में ${context.shift} स्थान पीछे जाते हैं और A से पहले Z से जारी रखते हैं`,
    ALPHA_OPPOSITE: "वर्णमाला का विपरीत अक्षर लेते हैं",
    ALPHA_EQUAL_DISTANCE: `वर्णमाला के मध्य की ओर समान ${context.distance} स्थान चलते हैं`,
    ALPHA_REVERSE_POSITION: `पहले विपरीत अक्षर लेते हैं, फिर ${signedMovement(context.offset!, locale)} चलते हैं`,
    ALPHA_DOUBLED_MOVEMENT: "अक्षर की वर्णमाला-स्थिति को दोगुना करते हैं",
    ALPHA_CLASS_CORRESPONDENCE: context.classDirection === "VOWEL_TO_CONSONANT"
      ? "स्वरों और व्यंजनों को उनके क्रम के अनुसार मिलाते हैं"
      : "व्यंजनों और स्वरों को उनके क्रम के अनुसार मिलाते हैं",
    ALPHA_TWO_STEP_POSITION: `स्थिति को दोगुना करके ${context.adjustment === 1 ? "एक जोड़ते" : "एक घटाते"} हैं`,
  } : {
    ALPHA_FIXED_SHIFT_FORWARD: `ਵਰਣਮਾਲਾ ਵਿੱਚ ${context.shift} ਥਾਂ ਅੱਗੇ ਜਾਂਦੇ ਹਾਂ, Z ਨੂੰ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ`,
    ALPHA_FIXED_SHIFT_BACKWARD: `ਵਰਣਮਾਲਾ ਵਿੱਚ ${context.shift} ਥਾਂ ਪਿੱਛੇ ਜਾਂਦੇ ਹਾਂ, A ਨੂੰ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ`,
    ALPHA_CYCLIC_SHIFT_FORWARD: `ਵਰਣਮਾਲਾ ਵਿੱਚ ${context.shift} ਥਾਂ ਅੱਗੇ ਜਾਂਦੇ ਹਾਂ ਅਤੇ Z ਤੋਂ ਬਾਅਦ A ਤੋਂ ਜਾਰੀ ਰੱਖਦੇ ਹਾਂ`,
    ALPHA_CYCLIC_SHIFT_BACKWARD: `ਵਰਣਮਾਲਾ ਵਿੱਚ ${context.shift} ਥਾਂ ਪਿੱਛੇ ਜਾਂਦੇ ਹਾਂ ਅਤੇ A ਤੋਂ ਪਹਿਲਾਂ Z ਤੋਂ ਜਾਰੀ ਰੱਖਦੇ ਹਾਂ`,
    ALPHA_OPPOSITE: "ਵਰਣਮਾਲਾ ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ",
    ALPHA_EQUAL_DISTANCE: `ਵਰਣਮਾਲਾ ਦੇ ਵਿਚਕਾਰ ਵੱਲ ਇੱਕੋ ਜਿਹੀਆਂ ${context.distance} ਥਾਵਾਂ ਜਾਂਦੇ ਹਾਂ`,
    ALPHA_REVERSE_POSITION: `ਪਹਿਲਾਂ ਵਿਰੋਧੀ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ, ਫਿਰ ${signedMovement(context.offset!, locale)} ਜਾਂਦੇ ਹਾਂ`,
    ALPHA_DOUBLED_MOVEMENT: "ਅੱਖਰ ਦੀ ਵਰਣਮਾਲਾ-ਸਥਿਤੀ ਨੂੰ ਦੁੱਗਣਾ ਕਰਦੇ ਹਾਂ",
    ALPHA_CLASS_CORRESPONDENCE: context.classDirection === "VOWEL_TO_CONSONANT"
      ? "ਸਵਰਾਂ ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਮਿਲਾਉਂਦੇ ਹਾਂ"
      : "ਵਿਅੰਜਨਾਂ ਅਤੇ ਸਵਰਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਮਿਲਾਉਂਦੇ ਹਾਂ",
    ALPHA_TWO_STEP_POSITION: `ਸਥਿਤੀ ਨੂੰ ਦੁੱਗਣਾ ਕਰਕੇ ${context.adjustment === 1 ? "ਇੱਕ ਜੋੜਦੇ" : "ਇੱਕ ਘਟਾਉਂਦੇ"} ਹਾਂ`,
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

  if (ruleId === "ALPHA_FIXED_SHIFT_FORWARD") return hi
    ? `${input} की स्थिति ${p} है; ${p} + ${context.shift} = ${q}, इसलिए ${output} मिलता है।`
    : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; ${p} + ${context.shift} = ${q}, ਇਸ ਲਈ ${output} ਮਿਲਦਾ ਹੈ।`;
  if (ruleId === "ALPHA_FIXED_SHIFT_BACKWARD") return hi
    ? `${input} की स्थिति ${p} है; ${p} - ${context.shift} = ${q}, इसलिए ${output} मिलता है।`
    : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; ${p} - ${context.shift} = ${q}, ਇਸ ਲਈ ${output} ਮਿਲਦਾ ਹੈ।`;
  if (ruleId === "ALPHA_CYCLIC_SHIFT_FORWARD") {
    const raw = p + context.shift!;
    return hi
      ? `${input} की स्थिति ${p} है; ${p} + ${context.shift} = ${raw} और ${raw} - 26 = ${q}, इसलिए ${output} मिलता है।`
      : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; ${p} + ${context.shift} = ${raw} ਅਤੇ ${raw} - 26 = ${q}, ਇਸ ਲਈ ${output} ਮਿਲਦਾ ਹੈ।`;
  }
  if (ruleId === "ALPHA_CYCLIC_SHIFT_BACKWARD") {
    const raw = p - context.shift!;
    return hi
      ? `${input} की स्थिति ${p} है; ${p} - ${context.shift} = ${raw} और ${raw} + 26 = ${q}, इसलिए ${output} मिलता है।`
      : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; ${p} - ${context.shift} = ${raw} ਅਤੇ ${raw} + 26 = ${q}, ਇਸ ਲਈ ${output} ਮਿਲਦਾ ਹੈ।`;
  }
  if (ruleId === "ALPHA_OPPOSITE") return hi
    ? `${input} की स्थिति ${p} है; 27 - ${p} = ${q}, इसलिए विपरीत अक्षर ${output} है।`
    : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; 27 - ${p} = ${q}, ਇਸ ਲਈ ਵਿਰੋਧੀ ਅੱਖਰ ${output} ਹੈ।`;
  if (ruleId === "ALPHA_EQUAL_DISTANCE") {
    const direction = p <= 13 ? (hi ? "आगे" : "ਅੱਗੇ") : (hi ? "पीछे" : "ਪਿੱਛੇ");
    return hi
      ? `${input} से वर्णमाला के मध्य की ओर ${context.distance} स्थान ${direction} जाने पर ${output} मिलता है।`
      : `${input} ਤੋਂ ਵਰਣਮਾਲਾ ਦੇ ਵਿਚਕਾਰ ਵੱਲ ${context.distance} ਥਾਂ ${direction} ਜਾਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
  }
  if (ruleId === "ALPHA_REVERSE_POSITION") {
    const reverse = oppositeLetter(input);
    return hi
      ? `${input} का विपरीत अक्षर ${reverse} है; वहाँ से ${signedMovement(context.offset!, locale)} जाने पर ${output} मिलता है।`
      : `${input} ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ ${reverse} ਹੈ; ਉੱਥੋਂ ${signedMovement(context.offset!, locale)} ਜਾਣ 'ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
  }
  if (ruleId === "ALPHA_DOUBLED_MOVEMENT") return hi
    ? `${input} की स्थिति ${p} है; 2 × ${p} = ${q}, अतः अक्षर ${output} है।`
    : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; 2 × ${p} = ${q}, ਇਸ ਲਈ ਅੱਖਰ ${output} ਹੈ।`;
  if (ruleId === "ALPHA_CLASS_CORRESPONDENCE") {
    const inputList = context.classDirection === "VOWEL_TO_CONSONANT" ? VOWELS : CORRESPONDING_CONSONANTS;
    const classIndex = inputList.indexOf(input as never) + 1;
    return hi
      ? `${input} अपने वर्ग में क्रम संख्या ${classIndex} पर है; दूसरे वर्ग का उसी क्रम का अक्षर ${output} है।`
      : `${input} ਆਪਣੇ ਵਰਗ ਵਿੱਚ ਕ੍ਰਮ ਨੰਬਰ ${classIndex} 'ਤੇ ਹੈ; ਦੂਜੇ ਵਰਗ ਦਾ ਉਸੇ ਕ੍ਰਮ ਵਾਲਾ ਅੱਖਰ ${output} ਹੈ।`;
  }
  if (ruleId === "ALPHA_TWO_STEP_POSITION") {
    const sign = context.adjustment === 1 ? "+ 1" : "- 1";
    return hi
      ? `${input} की स्थिति ${p} है; 2 × ${p} ${sign} = ${q}, अतः अक्षर ${output} है।`
      : `${input} ਦੀ ਸਥਿਤੀ ${p} ਹੈ; 2 × ${p} ${sign} = ${q}, ਇਸ ਲਈ ਅੱਖਰ ${output} ਹੈ।`;
  }
  throw new Error(`Missing localized calculation for ${ruleId}`);
}

function renderStem(base: GeneratedAlphabetAnalogy, locale: AlphabetLocale): string {
  const hi = locale === "hi-IN";
  const { source, target, layout } = base;
  if (base.presentationMode === "DIRECT_COMPLETION") {
    if (layout === "ARROW") return `${source.left} → ${source.right}  ::  ${target.left} → ?`;
    if (layout === "TWO_ROW_TABLE") {
      return `${hi ? "उसी वर्णमाला-संबंध से दूसरी पंक्ति पूरी कीजिए।" : "ਉਸੇ ਵਰਣਮਾਲਾ-ਸੰਬੰਧ ਨਾਲ ਦੂਜੀ ਕਤਾਰ ਪੂਰੀ ਕਰੋ।"}\n\n| ${hi ? "जोड़ा" : "ਜੋੜਾ"} | ${hi ? "पहला अक्षर" : "ਪਹਿਲਾ ਅੱਖਰ"} | ${hi ? "दूसरा अक्षर" : "ਦੂਜਾ ਅੱਖਰ"} |\n|---|---|---|\n| A | ${source.left} | ${source.right} |\n| B | ${target.left} | ? |`;
    }
    if (layout === "BOXED_PAIRS") return `[ ${source.left} : ${source.right} ]  ::  [ ${target.left} : ? ]`;
    return `${source.left} : ${source.right} :: ${target.left} : ?`;
  }
  const prefix = hi
    ? "वह अक्षर-जोड़ा चुनिए जिसमें यही संबंध है"
    : "ਉਹ ਅੱਖਰ-ਜੋੜਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਇਹੀ ਸੰਬੰਧ ਹੈ";
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
      conclusion: base.presentationMode === "DIRECT_COMPLETION"
        ? (hi ? `अतः रिक्त स्थान पर ${base.target.right} आएगा।` : `ਇਸ ਲਈ ਖਾਲੀ ਥਾਂ 'ਤੇ ${base.target.right} ਆਵੇਗਾ।`)
        : (hi ? `अतः ${base.target.left} : ${base.target.right} में यही नियम है।` : `ਇਸ ਲਈ ${base.target.left} : ${base.target.right} ਵਿੱਚ ਇਹੀ ਨਿਯਮ ਹੈ।`),
      closestTrapRejection: hi
        ? "अन्य विकल्प गलत दिशा, एक स्थान की भूल, वर्णमाला के चक्र को छोड़ने या किसी सरल अलग नियम से बने हैं।"
        : "ਹੋਰ ਵਿਕਲਪ ਗਲਤ ਦਿਸ਼ਾ, ਇੱਕ ਥਾਂ ਦੀ ਗਲਤੀ, ਵਰਣਮਾਲਾ ਦੇ ਚੱਕਰ ਨੂੰ ਛੱਡਣ ਜਾਂ ਕਿਸੇ ਹੋਰ ਸੌਖੇ ਨਿਯਮ ਨਾਲ ਬਣੇ ਹਨ।",
    },
  };
}
