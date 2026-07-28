import { letterPosition } from "../foundation/alphabet";
import { renderMixedToken } from "./foundation/mixed-token";
import type { ProvisionalMixedEvidence } from "./provisional-independent-solver";
import type { ProvisionalMixedContext } from "./provisional-rule-definitions";
import type { ProvisionalEnglishPrototypeId } from "./provisional-language-templates.en";
import {
  generateMixedAnalogy,
  type GeneratedMixedAnalogy,
  type MixedRuntimeLayout,
} from "./runtime";

export type MixedLocale = "hi-IN" | "pa-IN";
export type GeneratedLocalizedMixedAnalogy = GeneratedMixedAnalogy & { locale: MixedLocale };

function isHindi(locale: MixedLocale): boolean {
  return locale === "hi-IN";
}

function signed(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function digitSum(number: number): number {
  return [...String(Math.abs(number))].reduce((sum, digit) => sum + Number(digit), 0);
}

function punjabiMovement(letter: string, output: string, shift: number): string {
  if (shift > 0) return `${letter} ਤੋਂ ${shift} ਅੱਖਰ ਅੱਗੇ ${output}`;
  if (shift < 0) return `${letter} ਤੋਂ ${Math.abs(shift)} ਅੱਖਰ ਪਿੱਛੇ ${output}`;
  return `${letter} ਬਿਨਾਂ ਬਦਲਾਅ ${output}`;
}

function movementTrace(
  input: string,
  output: string,
  shifts: readonly number[],
  locale: MixedLocale,
): string {
  return [...input].map((letter, index) => {
    const shift = shifts[index] ?? 0;
    if (isHindi(locale)) {
      return shift >= 0
        ? `${letter} से ${shift} स्थान आगे ${output[index]}`
        : `${letter} से ${Math.abs(shift)} स्थान पीछे ${output[index]}`;
    }
    return punjabiMovement(letter, output[index], shift);
  }).join(isHindi(locale) ? ", और " : " ਅਤੇ ");
}

function ruleStatement(
  prototypeId: ProvisionalEnglishPrototypeId,
  locale: MixedLocale,
): string {
  const values: Record<ProvisionalEnglishPrototypeId, readonly [string, string]> = {
    PROTO_POSITION_SUM_TO_NUMBER: [
      "दोनों अक्षरों के सामान्य वर्णमाला-स्थान लिखकर उन्हें जोड़ते हैं।",
      "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਲਿਖ ਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜਦੇ ਹਾਂ।",
    ],
    PROTO_POSITION_PRODUCT_TO_NUMBER: [
      "दोनों अक्षरों के सामान्य वर्णमाला-स्थान लिखकर उनका गुणा करते हैं।",
      "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਲਿਖ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_POSITION_SUM_TO_LETTER: [
      "दोनों अक्षरों के स्थान जोड़कर उस योग के स्थान वाला अक्षर लेते हैं।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਜੋੜ ਕੇ ਉਸ ਨੰਬਰ ਵਾਲਾ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ।",
    ],
    PROTO_SINGLE_LETTER_POSITION_SQUARE: [
      "अक्षर के सामान्य वर्णमाला-स्थान का वर्ग करते हैं।",
      "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਅੱਖਰ ਦੀ ਥਾਂ ਦਾ ਵਰਗ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_INDEPENDENT_LETTER_NUMBER_DELTA: [
      "अक्षर और संख्या पर दो अलग-अलग निश्चित परिवर्तन लगते हैं।",
      "ਅੱਖਰ ਨੂੰ ਤੈਅ ਥਾਵਾਂ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਕਰਦੇ ਹਾਂ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਵੱਖਰਾ ਤੈਅ ਬਦਲਾਅ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_SHARED_CLUSTER_NUMBER_DELTA: [
      "दोनों अक्षरों और पूरी संख्या पर एक ही परिवर्तन लगाया जाता है।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਜੋੜ ਜਾਂ ਘਟਾਅ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA: [
      "दोनों अक्षरों और संख्या के लिए अलग-अलग निश्चित परिवर्तन होते हैं।",
      "ਹਰ ਅੱਖਰ ਅਤੇ ਗਿਣਤੀ ਲਈ ਵੱਖਰਾ ਤੈਅ ਬਦਲਾਅ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ।",
    ],
    PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST: [
      "अक्षरों को निश्चित रूप से बदलकर संख्या का दिए गए सही गुणक से गुणा करते हैं।",
      "ਅੱਖਰਾਂ ਨੂੰ ਤੈਅ ਤਰੀਕੇ ਨਾਲ ਬਦਲ ਕੇ ਗਿਣਤੀ ਨੂੰ ਪਹਿਲੇ ਜੋੜੇ ਵਾਲੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_EXACT_MULTIPLIER_NUMBER_FIRST: [
      "पहली संख्या का सही गुणा करते हैं, अक्षर बदलते हैं और संख्या-पहले क्रम रखते हैं।",
      "ਪਹਿਲੀ ਗਿਣਤੀ ਦਾ ਸਹੀ ਗੁਣਾ ਕਰਦੇ ਹਾਂ, ਅੱਖਰ ਬਦਲਦੇ ਹਾਂ ਅਤੇ ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਲਿਖਦੇ ਹਾਂ।",
    ],
    PROTO_DIRECT_CUBE_CLUSTER_FIRST: [
      "अक्षरों को निश्चित रूप से बदलकर दी गई संख्या का घन करते हैं।",
      "ਅੱਖਰਾਂ ਨੂੰ ਤੈਅ ਤਰੀਕੇ ਨਾਲ ਬਦਲ ਕੇ ਦਿੱਤੀ ਗਿਣਤੀ ਦਾ ਘਣ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST: [
      "दी गई पूर्ण-वर्ग संख्या का आधार निकालकर उसी आधार का घन करते हैं।",
      "ਦਿੱਤੀ ਗਿਣਤੀ ਕਿਸ ਗਿਣਤੀ ਦਾ ਵਰਗ ਹੈ, ਇਹ ਕੱਢ ਕੇ ਉਸ ਮੂਲ ਗਿਣਤੀ ਦਾ ਘਣ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST: [
      "संख्या में एक जोड़कर बने पूर्ण घन का सही घनमूल लेते हैं।",
      "ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜ ਕੇ ਬਣੇ ਪੂਰਨ ਘਣ ਦਾ ਸਹੀ ਘਣਮੂਲ ਲੈਂਦੇ ਹਾਂ।",
    ],
    PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST: [
      "पहली संख्या में एक जोड़कर सही वर्गमूल लेते हैं और संख्या-पहले क्रम रखते हैं।",
      "ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜ ਕੇ ਸਹੀ ਵਰਗਮੂਲ ਲੈਂਦੇ ਹਾਂ ਅਤੇ ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਲਿਖਦੇ ਹਾਂ।",
    ],
    PROTO_DIGIT_SUM_SQUARE_SUCCESSOR: [
      "संख्या को एक बढ़ाकर नई संख्या के अंकों के योग का वर्ग निकालते हैं और उससे अक्षर लेते हैं।",
      "ਗਿਣਤੀ ਨੂੰ ਇੱਕ ਵਧਾ ਕੇ ਨਵੀਂ ਗਿਣਤੀ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਕੱਢਦੇ ਹਾਂ, ਉਸ ਦਾ ਵਰਗ ਕਰਕੇ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ।",
    ],
  };
  return values[prototypeId][isHindi(locale) ? 0 : 1];
}

function trapStatement(
  prototypeId: ProvisionalEnglishPrototypeId,
  locale: MixedLocale,
): string {
  const values: Record<ProvisionalEnglishPrototypeId, readonly [string, string]> = {
    PROTO_POSITION_SUM_TO_NUMBER: [
      "स्थान का गुणा या अंतर निकालना गलत होगा; यहाँ दोनों स्थान जोड़ने हैं।",
      "ਥਾਵਾਂ ਦਾ ਗੁਣਾ ਜਾਂ ਫਰਕ ਕੱਢਣਾ ਗਲਤ ਹੈ; ਇੱਥੇ ਦੋਵੇਂ ਥਾਵਾਂ ਜੋੜਣੀਆਂ ਹਨ।",
    ],
    PROTO_POSITION_PRODUCT_TO_NUMBER: [
      "स्थान जोड़ना गलत होगा; दोनों स्थानों का गुणा करना है।",
      "ਥਾਵਾਂ ਜੋੜਨਾ ਗਲਤ ਹੈ; ਦੋਵੇਂ ਥਾਵਾਂ ਦਾ ਗੁਣਾ ਕਰਨਾ ਹੈ।",
    ],
    PROTO_POSITION_SUM_TO_LETTER: [
      "केवल योग पर न रुकें; उस स्थान का अक्षर भी लेना है।",
      "ਸਿਰਫ਼ ਜੋੜ ਕੱਢ ਕੇ ਨਾ ਰੁਕੋ; ਉਸ ਨੰਬਰ ਵਾਲਾ ਅੱਖਰ ਵੀ ਲੈਣਾ ਹੈ।",
    ],
    PROTO_SINGLE_LETTER_POSITION_SQUARE: [
      "केवल स्थान या उसका दुगुना लेना गलत है; स्थान का वर्ग चाहिए।",
      "ਸਿਰਫ਼ ਥਾਂ ਜਾਂ ਉਸ ਦਾ ਦੁੱਗਣਾ ਲੈਣਾ ਗਲਤ ਹੈ; ਥਾਂ ਦਾ ਵਰਗ ਕਰਨਾ ਹੈ।",
    ],
    PROTO_INDEPENDENT_LETTER_NUMBER_DELTA: [
      "अक्षर और संख्या पर एक ही परिवर्तन लगाना गलत है; दोनों अलग बदलते हैं।",
      "ਅੱਖਰ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕੋ ਬਦਲਾਅ ਕਰਨਾ ਗਲਤ ਹੈ; ਦੋਵੇਂ ਵੱਖਰੇ ਤਰੀਕੇ ਨਾਲ ਬਦਲਦੇ ਹਨ।",
    ],
    PROTO_SHARED_CLUSTER_NUMBER_DELTA: [
      "अलग-अलग परिवर्तन लगाना या संख्या को न बदलना गलत है; तीनों में एक ही परिवर्तन होता है।",
      "ਵੱਖਰੇ ਬਦਲਾਅ ਕਰਨਾ ਜਾਂ ਗਿਣਤੀ ਨੂੰ ਨਾ ਬਦਲਣਾ ਗਲਤ ਹੈ; ਤਿੰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ।",
    ],
    PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA: [
      "दोनों अक्षरों पर समान चाल लगाना गलत है; हर भाग का अपना परिवर्तन है।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਨੂੰ ਇੱਕੋ ਜਿੰਨੀਆਂ ਥਾਵਾਂ ਬਦਲਣਾ ਗਲਤ ਹੈ; ਹਰ ਹਿੱਸੇ ਦਾ ਬਦਲਾਅ ਵੱਖਰਾ ਹੈ।",
    ],
    PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST: [
      "गुणक को जोड़ना गलत है; संख्या का ठीक-ठीक गुणा करना है।",
      "ਗੁਣਾ ਕਰਨ ਵਾਲੀ ਗਿਣਤੀ ਨੂੰ ਜੋੜਨਾ ਗਲਤ ਹੈ; ਦਿੱਤੀ ਗਿਣਤੀ ਦਾ ਸਹੀ ਗੁਣਾ ਕਰਨਾ ਹੈ।",
    ],
    PROTO_EXACT_MULTIPLIER_NUMBER_FIRST: [
      "सही भागों को उलटे क्रम में लिखना भी गलत है; संख्या पहले रहेगी।",
      "ਸਹੀ ਹਿੱਸਿਆਂ ਨੂੰ ਉਲਟ ਲਿਖਣਾ ਵੀ ਗਲਤ ਹੈ; ਗਿਣਤੀ ਪਹਿਲਾਂ ਰਹੇਗੀ।",
    ],
    PROTO_DIRECT_CUBE_CLUSTER_FIRST: [
      "वर्ग करना या तीन से गुणा करना घन करने के समान नहीं है।",
      "ਵਰਗ ਕਰਨਾ ਜਾਂ ਤਿੰਨ ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਘਣ ਕਰਨ ਦੇ ਬਰਾਬਰ ਨਹੀਂ ਹੈ।",
    ],
    PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST: [
      "दिए गए वर्ग का सीधे घन न करें; पहले उसका वर्गमूल आधार निकालें।",
      "ਦਿੱਤੇ ਵਰਗ ਦਾ ਸਿੱਧਾ ਘਣ ਨਾ ਕਰੋ; ਪਹਿਲਾਂ ਉਸ ਦਾ ਵਰਗਮੂਲ ਕੱਢੋ।",
    ],
    PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST: [
      "मूल संख्या का घनमूल लेना गलत है; पहले एक जोड़ना आवश्यक है।",
      "ਮੂਲ ਗਿਣਤੀ ਦਾ ਘਣਮੂਲ ਲੈਣਾ ਗਲਤ ਹੈ; ਪਹਿਲਾਂ ਇੱਕ ਜੋੜਨਾ ਲਾਜ਼ਮੀ ਹੈ।",
    ],
    PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST: [
      "एक जोड़े बिना वर्गमूल लेना या क्रम उलटना दोनों गलत हैं।",
      "ਇੱਕ ਜੋੜੇ ਬਿਨਾਂ ਵਰਗਮੂਲ ਲੈਣਾ ਜਾਂ ਕ੍ਰਮ ਉਲਟਣਾ ਦੋਵੇਂ ਗਲਤ ਹਨ।",
    ],
    PROTO_DIGIT_SUM_SQUARE_SUCCESSOR: [
      "पुराने अक्षर को निश्चित चाल देना गलत है; नया अक्षर नई संख्या से दोबारा निकलता है।",
      "ਪੁਰਾਣੇ ਅੱਖਰ ਨੂੰ ਤੈਅ ਥਾਵਾਂ ਬਦਲਣਾ ਗਲਤ ਹੈ; ਨਵਾਂ ਅੱਖਰ ਨਵੀਂ ਗਿਣਤੀ ਤੋਂ ਮੁੜ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।",
    ],
  };
  return values[prototypeId][isHindi(locale) ? 0 : 1];
}

function localizedEvidence(
  context: ProvisionalMixedContext,
  evidence: ProvisionalMixedEvidence,
  locale: MixedLocale,
): string {
  const { input, output } = evidence;
  const hindi = isHindi(locale);
  switch (context.kind) {
    case "LETTER_GROUP_SCALAR": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "NUMBER") throw new Error("Localized scalar mismatch.");
      const first = letterPosition(input.letters[0]);
      const second = letterPosition(input.letters[1]);
      const operation = context.aggregate === "SUM" ? "+" : "×";
      return hindi
        ? `${input.letters} में ${input.letters[0]}=${first} और ${input.letters[1]}=${second}; ${first} ${operation} ${second} = ${output.number}।`
        : `${input.letters} ਵਿੱਚ ${input.letters[0]}=${first} ਅਤੇ ${input.letters[1]}=${second}; ${first} ${operation} ${second} = ${output.number}।`;
    }
    case "LETTER_GROUP_TO_LETTER": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "LETTER") throw new Error("Localized letter mismatch.");
      const first = letterPosition(input.letters[0]);
      const second = letterPosition(input.letters[1]);
      const total = first + second;
      return hindi
        ? `${input.letters} में ${first} + ${second} = ${total}; ${total}वाँ अक्षर ${output.letter} है।`
        : `${input.letters} ਵਿੱਚ ${first} + ${second} = ${total}; ${total}ਵਾਂ ਅੱਖਰ ${output.letter} ਹੈ।`;
    }
    case "SINGLE_LETTER_POSITION_POWER": {
      if (input.kind !== "LETTER" || output.kind !== "NUMBER") throw new Error("Localized square mismatch.");
      const position = letterPosition(input.letter);
      return hindi
        ? `${input.letter} का स्थान ${position} है और ${position}² = ${output.number}।`
        : `${input.letter} ਦੀ ਥਾਂ ${position} ਹੈ ਅਤੇ ${position}² = ${output.number}।`;
    }
    case "INDEPENDENT_LETTER_NUMBER": {
      if (input.kind !== "LETTER_NUMBER" || output.kind !== "LETTER_NUMBER") throw new Error("Localized independent mismatch.");
      const sign = context.numberOperation === "ADD" ? "+" : "−";
      return hindi
        ? `${renderMixedToken(input)} में ${input.letter}${signed(context.letterShift)}=${output.letter}, जबकि ${input.number} ${sign} ${context.numberAmount} = ${output.number}; इसलिए ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${punjabiMovement(input.letter, output.letter, context.letterShift)}; ${input.number} ${sign} ${context.numberAmount} = ${output.number}; ਇਸ ਲਈ ${renderMixedToken(output)}।`;
    }
    case "CLUSTER_NUMBER_SHARED_DELTA": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized shared mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${movementTrace(input.letters, output.letters, [context.delta, context.delta], locale)}, और ${input.number}${signed(context.delta)}=${output.number}; इसलिए ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${movementTrace(input.letters, output.letters, [context.delta, context.delta], locale)}; ${input.number}${signed(context.delta)}=${output.number}; ਇਸ ਲਈ ${renderMixedToken(output)}।`;
    }
    case "CLUSTER_NUMBER_INDEPENDENT_VECTOR": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized vector mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}, और ${input.number}${signed(context.numberDelta)}=${output.number}; इसलिए ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}; ${input.number}${signed(context.numberDelta)}=${output.number}; ਇਸ ਲਈ ${renderMixedToken(output)}।`;
    }
    case "CLUSTER_NUMBER_VECTOR_MULTIPLIER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized multiplier mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return hindi
        ? `${renderMixedToken(input)} में ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}, और ${arithmetic}; इसलिए ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}; ${arithmetic}; ਇਸ ਲਈ ${renderMixedToken(output)}।`;
    }
    case "NUMBER_CLUSTER_VECTOR_MULTIPLIER": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Localized number-first mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return hindi
        ? `${renderMixedToken(input)} में ${arithmetic}; ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}। संख्या पहले रखकर ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${arithmetic}; ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}। ਗਿਣਤੀ ਪਹਿਲਾਂ ਰੱਖ ਕੇ ${renderMixedToken(output)}।`;
    }
    case "CLUSTER_NUMBER_VECTOR_POWER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized power mismatch.");
      const numeric = context.transform === "CUBE"
        ? `${input.number}³ = ${output.number}`
        : `${input.number}=${Math.sqrt(input.number)}², ${Math.sqrt(input.number)}³=${output.number}`;
      return hindi
        ? `${renderMixedToken(input)} में ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}, और ${numeric}; इसलिए ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${movementTrace(input.letters, output.letters, context.letterShifts, locale)}; ${numeric}; ਇਸ ਲਈ ${renderMixedToken(output)}।`;
    }
    case "CLUSTER_NUMBER_VECTOR_ROOT": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized cube-root mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${input.number}+1=${input.number + 1}=${output.number}³; घनमूल ${output.number} और ${movementTrace(input.letters, output.letters, context.letterShifts, locale)} से ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${input.number}+1=${input.number + 1}=${output.number}³; ਘਣਮੂਲ ${output.number} ਅਤੇ ${movementTrace(input.letters, output.letters, context.letterShifts, locale)} ਨਾਲ ${renderMixedToken(output)}।`;
    }
    case "NUMBER_CLUSTER_VECTOR_ROOT": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Localized square-root mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${input.number}+1=${input.number + 1}=${output.number}²; वर्गमूल ${output.number} और ${movementTrace(input.letters, output.letters, context.letterShifts, locale)} से ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${input.number}+1=${input.number + 1}=${output.number}²; ਵਰਗਮੂਲ ${output.number} ਅਤੇ ${movementTrace(input.letters, output.letters, context.letterShifts, locale)} ਨਾਲ ${renderMixedToken(output)}।`;
    }
    case "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR": {
      if (input.kind !== "NUMBER_LETTER" || output.kind !== "NUMBER_LETTER") throw new Error("Localized digit mismatch.");
      const first = digitSum(input.number);
      const second = digitSum(output.number);
      return hindi
        ? `${renderMixedToken(input)} में अंकों का योग ${first} और ${first}²=${first * first}, इसलिए ${input.letter}। नई संख्या ${output.number} में योग ${second} और ${second}²=${second * second}, इसलिए ${output.letter}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ਅੰਕਾਂ ਦਾ ਜੋੜ ${first} ਅਤੇ ${first}²=${first * first}, ਇਸ ਲਈ ${input.letter}। ਨਵੀਂ ਗਿਣਤੀ ${output.number} ਵਿੱਚ ਜੋੜ ${second} ਅਤੇ ${second}²=${second * second}, ਇਸ ਲਈ ${output.letter}।`;
    }
  }
}

function directStem(
  locale: MixedLocale,
  layout: MixedRuntimeLayout,
  source: ProvisionalMixedEvidence,
  target: ProvisionalMixedEvidence,
): string {
  const first = `${renderMixedToken(source.input)} : ${renderMixedToken(source.output)}`;
  const second = `${renderMixedToken(target.input)} : ?`;
  if (layout === "ARROW") return `${renderMixedToken(source.input)} → ${renderMixedToken(source.output)} :: ${renderMixedToken(target.input)} → ?`;
  if (layout === "BOXED_PAIRS") return `[ ${first} ] :: [ ${second} ]`;
  if (layout === "TWO_ROW_TABLE") {
    return isHindi(locale)
      ? `उसी संबंध से दूसरी पंक्ति पूरी कीजिए।\n\n| युग्म | इनपुट | आउटपुट |\n|---|---|---|\n| A | ${renderMixedToken(source.input)} | ${renderMixedToken(source.output)} |\n| B | ${renderMixedToken(target.input)} | ? |`
      : `ਉਸੇ ਸੰਬੰਧ ਨਾਲ ਦੂਜੀ ਕਤਾਰ ਪੂਰੀ ਕਰੋ।\n\n| ਜੋੜਾ | ਦਿੱਤਾ ਰੂਪ | ਨਤੀਜਾ |\n|---|---|---|\n| A | ${renderMixedToken(source.input)} | ${renderMixedToken(source.output)} |\n| B | ${renderMixedToken(target.input)} | ? |`;
  }
  return isHindi(locale)
    ? `दोनों युग्मों में एक ही संबंध रखते हुए रिक्त स्थान भरिए: ${first} :: ${second}`
    : `ਦੋਵੇਂ ਜੋੜਿਆਂ ਵਿੱਚ ਇੱਕੋ ਸੰਬੰਧ ਰੱਖਦੇ ਹੋਏ ਖਾਲੀ ਥਾਂ ਭਰੋ: ${first} :: ${second}`;
}

function oddStem(locale: MixedLocale, layout: MixedRuntimeLayout): string {
  if (layout === "ARROW") {
    return isHindi(locale)
      ? "तीन तीर-युग्म एक ही नियम मानते हैं। अलग युग्म चुनिए।"
      : "ਤਿੰਨ ਤੀਰ ਵਾਲੇ ਜੋੜੇ ਇੱਕੋ ਨਿਯਮ ਮੰਨਦੇ ਹਨ। ਵੱਖਰਾ ਜੋੜਾ ਚੁਣੋ।";
  }
  if (layout === "BOXED_PAIRS") {
    return isHindi(locale)
      ? "तीन बॉक्स एक ही संबंध दिखाते हैं। अलग बॉक्स चुनिए।"
      : "ਤਿੰਨ ਡੱਬੇ ਇੱਕੋ ਸੰਬੰਧ ਦਿਖਾਉਂਦੇ ਹਨ। ਵੱਖਰਾ ਡੱਬਾ ਚੁਣੋ।";
  }
  return isHindi(locale)
    ? "तीन युग्म एक ही संबंध का पालन करते हैं। वह युग्म चुनिए जो अलग है।"
    : "ਤਿੰਨ ਜੋੜੇ ਇੱਕੋ ਸੰਬੰਧ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ। ਵੱਖਰਾ ਜੋੜਾ ਚੁਣੋ।";
}

export function generateLocalizedMixedAnalogy(
  qlId: string,
  seed: number,
  locale: MixedLocale,
): GeneratedLocalizedMixedAnalogy {
  const base = generateMixedAnalogy(qlId, seed);
  const hindi = isHindi(locale);

  if (base.presentationMode === "DIRECT_COMPLETION") {
    const answer = renderMixedToken(base.target.output);
    return {
      ...base,
      locale,
      stem: directStem(locale, base.layout, base.source, base.target),
      explanation: {
        ruleStatement: ruleStatement(base.prototypeId, locale),
        sourceDemonstration: localizedEvidence(base.context, base.source, locale),
        targetApplication: localizedEvidence(base.context, base.target, locale),
        conclusion: hindi
          ? `अतः सही उत्तर ${answer} है।`
          : `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${answer} ਹੈ।`,
        closestTrapRejection: trapStatement(base.prototypeId, locale),
      },
    };
  }

  const oddInput = renderMixedToken(base.oddPair.input);
  const oddOutput = renderMixedToken(base.oddPair.output);
  const expected = renderMixedToken(base.expectedOddOutput);
  return {
    ...base,
    locale,
    stem: oddStem(locale, base.layout),
    explanation: {
      commonRule: ruleStatement(base.prototypeId, locale),
      validPairDemonstrations: base.validPairs.map((entry) =>
        localizedEvidence(base.context, entry, locale)) as [string, string, string],
      oddPairRejection: hindi
        ? `${oddInput} पर यही नियम लगाने से ${expected} मिलना चाहिए, ${oddOutput} नहीं।`
        : `${oddInput} ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ${expected} ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ, ${oddOutput} ਨਹੀਂ।`,
      conclusion: hindi
        ? `अतः ${oddInput} : ${oddOutput} अलग युग्म है।`
        : `ਇਸ ਲਈ ${oddInput} : ${oddOutput} ਵੱਖਰਾ ਜੋੜਾ ਹੈ।`,
    },
  };
}
