import { generateNumCp013Permanent, type NumCp013PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp013PermanentQlId } from "../permanent-allocation.ts";
import type {
  NumCp013LocalizedLanguage,
  NumCp013LocalizedLocale,
  NumCp013LocalizedPackage,
} from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type LocalizedContent = Readonly<{
  stem: string;
  coreConcept: string;
  strategy: string;
  steps: readonly string[];
}>;

function choose(language: NumCp013LocalizedLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function localeFor(language: NumCp013LocalizedLanguage): NumCp013LocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function value(state: State, key: string): unknown {
  if (!(key in state)) throw new Error(`Missing CP013 state field ${key}`);
  return state[key];
}

function text(state: State, key: string): string {
  return String(value(state, key));
}

function numberValue(state: State, key: string): number {
  const parsed = Number(value(state, key));
  if (!Number.isFinite(parsed)) throw new Error(`Expected numeric CP013 state field ${key}`);
  return parsed;
}

function numberList(state: State, key: string): number[] {
  const item = value(state, key);
  if (!Array.isArray(item)) throw new Error(`Expected array CP013 state field ${key}`);
  return item.map((entry) => Number(entry));
}

function notation(digits: string, base: number) {
  return `(${digits})_${base}`;
}

function positionalTerms(digits: readonly number[], base: number) {
  return digits.map((digit, index) => `${digit} × ${base}^${digits.length - 1 - index}`);
}

function localizedAnswer(answer: string, language: NumCp013LocalizedLanguage): string {
  switch (answer) {
    case "First numeral is greater":
      return choose(language, "पहली संख्या बड़ी है", "ਪਹਿਲੀ ਸੰਖਿਆ ਵੱਡੀ ਹੈ");
    case "Second numeral is greater":
      return choose(language, "दूसरी संख्या बड़ी है", "ਦੂਜੀ ਸੰਖਿਆ ਵੱਡੀ ਹੈ");
    case "Both numerals are equal":
      return choose(language, "दोनों संख्याएँ बराबर हैं", "ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਬਰਾਬਰ ਹਨ");
    case "Cannot be determined":
    case "CANNOT_DETERMINE":
      return choose(language, "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ");
    case "NO_SOLUTION":
      return choose(language, "कोई समाधान नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ");
    case "ONE_SOLUTION":
      return choose(language, "एक समाधान", "ਇੱਕ ਹੱਲ");
    case "MULTIPLE_SOLUTIONS":
      return choose(language, "एक से अधिक समाधान", "ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ");
    default:
      return answer;
  }
}

function content(q: NumCp013PermanentPackage, language: NumCp013LocalizedLanguage): LocalizedContent {
  const s = q.hiddenState as State;
  const L = (hi: string, pa: string) => choose(language, hi, pa);

  switch (q.taskKind) {
    case "BASE_TO_DECIMAL": {
      const base = numberValue(s, "base");
      const numeralText = text(s, "numeral");
      const digits = numberList(s, "digits");
      return {
        stem: L(`${notation(numeralText, base)} का दशमलव मान ज्ञात कीजिए।`, `${notation(numeralText, base)} ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੱਢੋ।`),
        coreConcept: L(`आधार ${base} में दाएँ से स्थान-मूल्य ${base}^0, ${base}^1, ${base}^2 ... होते हैं।`, `ਆਧਾਰ ${base} ਵਿੱਚ ਸੱਜੇ ਪਾਸੋਂ ਸਥਾਨ-ਮੁੱਲ ${base}^0, ${base}^1, ${base}^2 ... ਹੁੰਦੇ ਹਨ।`),
        strategy: L("हर अंक को उसके स्थान की घात से गुणा करके जोड़ें।", "ਹਰ ਅੰਕ ਨੂੰ ਉਸਦੇ ਸਥਾਨ ਦੀ ਘਾਤ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਜੋੜੋ।"),
        steps: [
          L(`${notation(numeralText, base)} = ${positionalTerms(digits, base).join(" + ")}.`, `${notation(numeralText, base)} = ${positionalTerms(digits, base).join(" + ")}.`),
          L(`इन स्थान-मूल्यों का योग ${q.canonicalAnswer} है।`, `ਇਨ੍ਹਾਂ ਸਥਾਨ-ਮੁੱਲਾਂ ਦਾ ਜੋੜ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "DECIMAL_TO_BASE": {
      const base = numberValue(s, "base");
      const decimal = numberValue(s, "decimal");
      const numeralText = text(s, "numeral");
      return {
        stem: L(`दशमलव संख्या ${decimal} को आधार ${base} में लिखिए।`, `ਦਸ਼ਮਲਵ ਸੰਖਿਆ ${decimal} ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਲਿਖੋ।`),
        coreConcept: L(`दशमलव पूर्णांक को आधार ${base} में बदलने के लिए बार-बार ${base} से भाग देकर शेष लिखे जाते हैं।`, `ਦਸ਼ਮਲਵ ਪੂਰਨ ਅੰਕ ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਬਦਲਣ ਲਈ ਵਾਰ-ਵਾਰ ${base} ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਲਿਖੇ ਜਾਂਦੇ ਹਨ।`),
        strategy: L("अंत में शेषों को नीचे से ऊपर पढ़ें।", "ਅੰਤ ਵਿੱਚ ਬਾਕੀਆਂ ਨੂੰ ਹੇਠੋਂ ਉੱਪਰ ਪੜ੍ਹੋ।"),
        steps: [
          L(`${decimal} को ${base} से क्रमशः भाग देने पर आधार-${base} के अंक ${numeralText} मिलते हैं।`, `${decimal} ਨੂੰ ${base} ਨਾਲ ਲਗਾਤਾਰ ਭਾਗ ਦੇਣ ਤੇ ਆਧਾਰ-${base} ਦੇ ਅੰਕ ${numeralText} ਮਿਲਦੇ ਹਨ।`),
          L(`अतः ${decimal} = ${notation(numeralText, base)}।`, `ਇਸ ਲਈ ${decimal} = ${notation(numeralText, base)}।`),
        ],
      };
    }
    case "NON_DECIMAL_TO_NON_DECIMAL": {
      const sourceBase = numberValue(s, "sourceBase");
      const targetBase = numberValue(s, "targetBase");
      const sourceText = text(s, "sourceText");
      const targetText = text(s, "targetText");
      const decimal = numberValue(s, "decimal");
      return {
        stem: L(`${notation(sourceText, sourceBase)} को आधार ${targetBase} में बदलिए।`, `${notation(sourceText, sourceBase)} ਨੂੰ ਆਧਾਰ ${targetBase} ਵਿੱਚ ਬਦਲੋ।`),
        coreConcept: L("दो अलग गैर-दशमलव आधारों के बीच सुरक्षित तरीका पहले वास्तविक पूर्णांक मान निकालना है।", "ਦੋ ਵੱਖਰੇ ਗੈਰ-ਦਸ਼ਮਲਵ ਆਧਾਰਾਂ ਵਿਚਕਾਰ ਸੁਰੱਖਿਅਤ ਤਰੀਕਾ ਪਹਿਲਾਂ ਅਸਲ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ਕੱਢਣਾ ਹੈ।"),
        strategy: L(`पहले स्रोत का मान ${decimal} निकालें, फिर उसे आधार ${targetBase} में बदलें।`, `ਪਹਿਲਾਂ ਸਰੋਤ ਦਾ ਮੁੱਲ ${decimal} ਕੱਢੋ, ਫਿਰ ਉਸਨੂੰ ਆਧਾਰ ${targetBase} ਵਿੱਚ ਬਦਲੋ।`),
        steps: [
          L(`${notation(sourceText, sourceBase)} का दशमलव मान ${decimal} है।`, `${notation(sourceText, sourceBase)} ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ${decimal} ਹੈ।`),
          L(`${decimal} को आधार ${targetBase} में लिखने पर ${notation(targetText, targetBase)} मिलता है।`, `${decimal} ਨੂੰ ਆਧਾਰ ${targetBase} ਵਿੱਚ ਲਿਖਣ ਤੇ ${notation(targetText, targetBase)} ਮਿਲਦਾ ਹੈ।`),
        ],
      };
    }
    case "MINIMUM_VALID_BASE": {
      const numeralText = text(s, "numeral");
      const maxDigit = numberValue(s, "maxDigit");
      return {
        stem: L(`(${numeralText})_b के लिए न्यूनतम संभव आधार b ज्ञात कीजिए।`, `(${numeralText})_b ਲਈ ਘੱਟੋ-ਘੱਟ ਸੰਭਵ ਆਧਾਰ b ਕੱਢੋ।`),
        coreConcept: L("किसी आधार में हर अंक का मान आधार से छोटा होना चाहिए।", "ਕਿਸੇ ਆਧਾਰ ਵਿੱਚ ਹਰ ਅੰਕ ਦਾ ਮੁੱਲ ਆਧਾਰ ਤੋਂ ਛੋਟਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
        strategy: L("सिर्फ सबसे बड़े अंक को देखें; न्यूनतम आधार उससे एक अधिक होगा।", "ਸਿਰਫ਼ ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਕ ਵੇਖੋ; ਘੱਟੋ-ਘੱਟ ਆਧਾਰ ਉਸ ਤੋਂ ਇੱਕ ਵੱਧ ਹੋਵੇਗਾ।"),
        steps: [
          L(`सबसे बड़ा अंक ${maxDigit} है, इसलिए b > ${maxDigit} होना चाहिए।`, `ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਕ ${maxDigit} ਹੈ, ਇਸ ਲਈ b > ${maxDigit} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`),
          L(`सबसे छोटा ऐसा पूर्णांक आधार ${maxDigit + 1} है।`, `ਸਭ ਤੋਂ ਛੋਟਾ ਐਸਾ ਪੂਰਨ ਅੰਕ ਆਧਾਰ ${maxDigit + 1} ਹੈ।`),
        ],
      };
    }
    case "UNKNOWN_DIGIT_IN_NUMERAL_EQUALITY": {
      const base = numberValue(s, "base");
      const a = numberValue(s, "a");
      const c = numberValue(s, "c");
      const decimal = numberValue(s, "decimal");
      const otherPart = numberValue(s, "otherPart");
      const numerator = numberValue(s, "derivedNumerator");
      return {
        stem: L(`यदि (${a}x${c})_${base} का दशमलव मान ${decimal} है, तो अंक x ज्ञात कीजिए।`, `ਜੇ (${a}x${c})_${base} ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ${decimal} ਹੈ, ਤਾਂ ਅੰਕ x ਕੱਢੋ।`),
        coreConcept: L(`बीच का अंक x, ${base} के स्थान पर है; इसलिए उसका योगदान ${base}x है।`, `ਵਿਚਕਾਰਲਾ ਅੰਕ x, ${base} ਦੇ ਸਥਾਨ ਤੇ ਹੈ; ਇਸ ਲਈ ਉਸਦਾ ਯੋਗਦਾਨ ${base}x ਹੈ।`),
        strategy: L("पहले ज्ञात अंकों का योगदान घटाएँ, फिर शेष को आधार से भाग दें।", "ਪਹਿਲਾਂ ਜਾਣੇ ਅੰਕਾਂ ਦਾ ਯੋਗਦਾਨ ਘਟਾਓ, ਫਿਰ ਬਾਕੀ ਨੂੰ ਆਧਾਰ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        steps: [
          L(`ज्ञात भाग ${a} × ${base}^2 + ${c} = ${otherPart}; इसलिए ${base}x = ${decimal} − ${otherPart} = ${numerator}।`, `ਜਾਣਿਆ ਭਾਗ ${a} × ${base}^2 + ${c} = ${otherPart}; ਇਸ ਲਈ ${base}x = ${decimal} − ${otherPart} = ${numerator}।`),
          L(`x = ${numerator} ÷ ${base} = ${q.canonicalAnswer}।`, `x = ${numerator} ÷ ${base} = ${q.canonicalAnswer}।`),
        ],
      };
    }
    case "UNKNOWN_BASE_FROM_DECIMAL_EQUALITY": {
      const base = numberValue(s, "base");
      const numeralText = text(s, "numeral");
      const decimal = numberValue(s, "decimal");
      const minBase = numberValue(s, "minBase");
      return {
        stem: L(`यदि (${numeralText})_b = ${decimal}, तो आधार b ज्ञात कीजिए।`, `ਜੇ (${numeralText})_b = ${decimal}, ਤਾਂ ਆਧਾਰ b ਕੱਢੋ।`),
        coreConcept: L("अज्ञात आधार वाले अंक-समूह को b की घातों वाली समीकरण में बदलना होता है।", "ਅਣਜਾਣ ਆਧਾਰ ਵਾਲੇ ਅੰਕ-ਸਮੂਹ ਨੂੰ b ਦੀਆਂ ਘਾਤਾਂ ਵਾਲੀ ਸਮੀਕਰਨ ਵਿੱਚ ਬਦਲਣਾ ਹੁੰਦਾ ਹੈ।"),
        strategy: L(`अंकों की वैधता से पहले b ≥ ${minBase} लें, फिर समीकरण जाँचें।`, `ਅੰਕਾਂ ਦੀ ਵੈਧਤਾ ਤੋਂ ਪਹਿਲਾਂ b ≥ ${minBase} ਲਵੋ, ਫਿਰ ਸਮੀਕਰਨ ਜਾਂਚੋ।`),
        steps: [
          L(`दिए गए अंक स्थान-मूल्यों के अनुसार b^2, b और 1 से गुणा होते हैं।`, `ਦਿੱਤੇ ਅੰਕ ਸਥਾਨ-ਮੁੱਲਾਂ ਅਨੁਸਾਰ b^2, b ਅਤੇ 1 ਨਾਲ ਗੁਣਾ ਹੁੰਦੇ ਹਨ।`),
          L(`b = ${base} रखने पर मान ठीक ${decimal} आता है; वैध सीमा में यही समाधान है।`, `b = ${base} ਰੱਖਣ ਤੇ ਮੁੱਲ ਠੀਕ ${decimal} ਆਉਂਦਾ ਹੈ; ਵੈਧ ਸੀਮਾ ਵਿੱਚ ਇਹੀ ਹੱਲ ਹੈ।`),
        ],
      };
    }
    case "ADDITION_IN_BASE":
    case "ADDITION_WITH_NEW_LEADING_CARRY": {
      const base = numberValue(s, "base");
      const leftText = "leftText" in s ? text(s, "leftText") : numberList(s, "left").join("");
      const rightText = "rightText" in s ? text(s, "rightText") : numberList(s, "right").join("");
      const resultText = "resultDigits" in s ? numberList(s, "resultDigits").join("") : q.canonicalAnswer;
      return {
        stem: L(`${notation(leftText, base)} + ${notation(rightText, base)} को आधार ${base} में जोड़िए।`, `${notation(leftText, base)} + ${notation(rightText, base)} ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਜੋੜੋ।`),
        coreConcept: L(`आधार ${base} में किसी कॉलम का कुल ${base} या अधिक होने पर कैरी अगले कॉलम में जाता है।`, `ਆਧਾਰ ${base} ਵਿੱਚ ਕਿਸੇ ਕਾਲਮ ਦਾ ਜੋੜ ${base} ਜਾਂ ਵੱਧ ਹੋਣ ਤੇ ਕੈਰੀ ਅਗਲੇ ਕਾਲਮ ਵਿੱਚ ਜਾਂਦਾ ਹੈ।`),
        strategy: L("दाएँ से जोड़ें; हर कॉलम में लिखे अंक और कैरी को अलग रखें।", "ਸੱਜੇ ਪਾਸੋਂ ਜੋੜੋ; ਹਰ ਕਾਲਮ ਵਿੱਚ ਲਿਖੇ ਅੰਕ ਅਤੇ ਕੈਰੀ ਨੂੰ ਵੱਖ ਰੱਖੋ।"),
        steps: [
          L(`हर कॉलम में कुल = कैरी × ${base} + लिखा गया अंक प्रयोग करें।`, `ਹਰ ਕਾਲਮ ਵਿੱਚ ਜੋੜ = ਕੈਰੀ × ${base} + ਲਿਖਿਆ ਅੰਕ ਵਰਤੋ।`),
          L(`सभी कॉलम और अंतिम कैरी लिखने पर योग ${q.canonicalAnswer}${resultText === q.canonicalAnswer ? "" : `, अर्थात ${resultText}`} मिलता है।`, `ਸਾਰੇ ਕਾਲਮ ਅਤੇ ਆਖਰੀ ਕੈਰੀ ਲਿਖਣ ਤੇ ਜੋੜ ${q.canonicalAnswer}${resultText === q.canonicalAnswer ? "" : `, ਅਰਥਾਤ ${resultText}`} ਮਿਲਦਾ ਹੈ।`),
        ],
      };
    }
    case "SUBTRACTION_IN_BASE":
    case "SUBTRACTION_BORROW_CHAIN_ACROSS_ZEROES": {
      const base = numberValue(s, "base");
      const topText = "topText" in s ? text(s, "topText") : numberList(s, "top").join("");
      const bottomText = "bottomText" in s ? text(s, "bottomText") : numberList(s, "bottom").join("");
      return {
        stem: L(`${notation(topText, base)} − ${notation(bottomText, base)} को आधार ${base} में घटाइए।`, `${notation(topText, base)} − ${notation(bottomText, base)} ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਘਟਾਓ।`),
        coreConcept: L(`आधार ${base} में उधार लेने पर किसी कॉलम को 10 नहीं, बल्कि ${base} इकाइयाँ मिलती हैं।`, `ਆਧਾਰ ${base} ਵਿੱਚ ਉਧਾਰ ਲੈਣ ਤੇ ਕਿਸੇ ਕਾਲਮ ਨੂੰ 10 ਨਹੀਂ, ਸਗੋਂ ${base} ਇਕਾਈਆਂ ਮਿਲਦੀਆਂ ਹਨ।`),
        strategy: L("दाएँ से घटाएँ; जरूरत हो तो उधार को शून्य वाले कॉलमों के पार सही तरह पहुँचाएँ।", "ਸੱਜੇ ਪਾਸੋਂ ਘਟਾਓ; ਲੋੜ ਹੋਵੇ ਤਾਂ ਉਧਾਰ ਨੂੰ ਸਿਫ਼ਰ ਵਾਲੇ ਕਾਲਮਾਂ ਪਾਰ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਪਹੁੰਚਾਓ।"),
        steps: [
          L(`जहाँ ऊपरी अंक छोटा है, अगले स्थान से एक समूह लेकर उसमें ${base} जोड़ें।`, `ਜਿੱਥੇ ਉੱਪਰਲਾ ਅੰਕ ਛੋਟਾ ਹੈ, ਅਗਲੇ ਸਥਾਨ ਤੋਂ ਇੱਕ ਸਮੂਹ ਲੈ ਕੇ ਉਸ ਵਿੱਚ ${base} ਜੋੜੋ।`),
          L(`उधार समायोजित करने के बाद परिणाम ${q.canonicalAnswer} है।`, `ਉਧਾਰ ਠੀਕ ਕਰਨ ਤੋਂ ਬਾਅਦ ਨਤੀਜਾ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "BINARY_TO_OCTAL_GROUPING":
    case "BINARY_TO_HEX_GROUPING":
    case "OCTAL_TO_BINARY_GROUPING":
    case "HEX_TO_BINARY_GROUPING": {
      const sourceBase = numberValue(s, "sourceBase");
      const targetBase = numberValue(s, "targetBase");
      const sourceText = text(s, "sourceText");
      const targetText = text(s, "targetText");
      const width = sourceBase === 2 ? (targetBase === 8 ? 3 : 4) : (sourceBase === 8 ? 3 : 4);
      return {
        stem: L(`${notation(sourceText, sourceBase)} को आधार ${targetBase} में सीधे समूह बनाकर बदलिए।`, `${notation(sourceText, sourceBase)} ਨੂੰ ਆਧਾਰ ${targetBase} ਵਿੱਚ ਸਿੱਧੇ ਸਮੂਹ ਬਣਾ ਕੇ ਬਦਲੋ।`),
        coreConcept: L(`2 की घात वाले आधारों में ${width} बाइनरी बिट एक आधार-${sourceBase === 2 ? targetBase : sourceBase} अंक के बराबर होते हैं।`, `2 ਦੀ ਘਾਤ ਵਾਲੇ ਆਧਾਰਾਂ ਵਿੱਚ ${width} ਬਾਈਨਰੀ ਬਿਟ ਇੱਕ ਆਧਾਰ-${sourceBase === 2 ? targetBase : sourceBase} ਅੰਕ ਦੇ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।`),
        strategy: L("समूहों का क्रम न बदलें; केवल बाएँ तरफ आवश्यक शून्य भरें।", "ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ਨਾ ਬਦਲੋ; ਸਿਰਫ਼ ਖੱਬੇ ਪਾਸੇ ਲੋੜੀਂਦੇ ਸਿਫ਼ਰ ਭਰੋ।"),
        steps: [
          L(`${notation(sourceText, sourceBase)} को ${width}-${width} बिट के समूहों में मैप करें।`, `${notation(sourceText, sourceBase)} ਨੂੰ ${width}-${width} ਬਿਟ ਦੇ ਸਮੂਹਾਂ ਵਿੱਚ ਮੈਪ ਕਰੋ।`),
          L(`मैप किए गए अंक ${targetText} देते हैं, इसलिए उत्तर ${notation(targetText, targetBase)} है।`, `ਮੈਪ ਕੀਤੇ ਅੰਕ ${targetText} ਦਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਉੱਤਰ ${notation(targetText, targetBase)} ਹੈ।`),
        ],
      };
    }
    case "NUMERAL_VALIDITY_CLASSIFICATION": {
      const base = numberValue(s, "base");
      const invalidSymbol = text(s, "invalidSymbol");
      const invalidText = text(s, "invalidText");
      return {
        stem: L(`निम्न में कौन-सा अंक-समूह आधार ${base} में वैध नहीं है?`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੰਕ-ਸਮੂਹ ਆਧਾਰ ${base} ਵਿੱਚ ਵੈਧ ਨਹੀਂ ਹੈ?`),
        coreConcept: L(`आधार ${base} में हर अंक का मान 0 से ${base - 1} तक होना चाहिए।`, `ਆਧਾਰ ${base} ਵਿੱਚ ਹਰ ਅੰਕ ਦਾ ਮੁੱਲ 0 ਤੋਂ ${base - 1} ਤੱਕ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`),
        strategy: L("हर विकल्प में सबसे बड़ा अंक देखें; आधार के बराबर या उससे बड़ा अंक अवैध है।", "ਹਰ ਚੋਣ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਕ ਵੇਖੋ; ਆਧਾਰ ਦੇ ਬਰਾਬਰ ਜਾਂ ਉਸ ਤੋਂ ਵੱਡਾ ਅੰਕ ਅਵੈਧ ਹੈ।"),
        steps: [
          L(`${invalidSymbol} का अंक-मूल्य ${base} है, जो आधार ${base} से छोटा नहीं है।`, `${invalidSymbol} ਦਾ ਅੰਕ-ਮੁੱਲ ${base} ਹੈ, ਜੋ ਆਧਾਰ ${base} ਤੋਂ ਛੋਟਾ ਨਹੀਂ ਹੈ।`),
          L(`इसलिए ${notation(invalidText, base)} वैध आधार-${base} संख्या नहीं है।`, `ਇਸ ਲਈ ${notation(invalidText, base)} ਵੈਧ ਆਧਾਰ-${base} ਸੰਖਿਆ ਨਹੀਂ ਹੈ।`),
        ],
      };
    }
    case "PLACE_VALUE_IN_BASE": {
      const base = numberValue(s, "base");
      const numeralText = text(s, "text");
      const index = numberValue(s, "index");
      const power = numberValue(s, "power");
      const digits = numberList(s, "digits");
      const selected = digits[index]!;
      return {
        stem: L(`${notation(numeralText, base)} में बाएँ से स्थान ${index + 1} वाले अंक का दशमलव स्थान-मूल्य ज्ञात कीजिए।`, `${notation(numeralText, base)} ਵਿੱਚ ਖੱਬੇ ਪਾਸੋਂ ਸਥਾਨ ${index + 1} ਵਾਲੇ ਅੰਕ ਦਾ ਦਸ਼ਮਲਵ ਸਥਾਨ-ਮੁੱਲ ਕੱਢੋ।`),
        coreConcept: L(`किसी अंक का स्थान-मूल्य = अंक-मूल्य × आधार की संबंधित घात।`, `ਕਿਸੇ ਅੰਕ ਦਾ ਸਥਾਨ-ਮੁੱਲ = ਅੰਕ-ਮੁੱਲ × ਆਧਾਰ ਦੀ ਸੰਬੰਧਿਤ ਘਾਤ।`),
        strategy: L("दाएँ से इकाई स्थान को घात 0 मानकर चुने हुए स्थान की घात गिनें।", "ਸੱਜੇ ਪਾਸੋਂ ਇਕਾਈ ਸਥਾਨ ਨੂੰ ਘਾਤ 0 ਮੰਨ ਕੇ ਚੁਣੇ ਹੋਏ ਸਥਾਨ ਦੀ ਘਾਤ ਗਿਣੋ।"),
        steps: [
          L(`चुना अंक ${selected} है और उसका स्थान ${base}^${power} है।`, `ਚੁਣਿਆ ਅੰਕ ${selected} ਹੈ ਅਤੇ ਉਸਦਾ ਸਥਾਨ ${base}^${power} ਹੈ।`),
          L(`${selected} × ${base}^${power} = ${q.canonicalAnswer}।`, `${selected} × ${base}^${power} = ${q.canonicalAnswer}।`),
        ],
      };
    }
    case "NUMBER_OF_DIGITS_IN_BASE": {
      const base = numberValue(s, "base");
      const decimal = numberValue(s, "decimal");
      const digitsCount = numberValue(s, "digitsCount");
      const lower = numberValue(s, "lower");
      return {
        stem: L(`दशमलव संख्या ${decimal} को आधार ${base} में लिखने के लिए कितने अंक चाहिए?`, `ਦਸ਼ਮਲਵ ਸੰਖਿਆ ${decimal} ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਲਿਖਣ ਲਈ ਕਿੰਨੇ ਅੰਕ ਚਾਹੀਦੇ ਹਨ?`),
        coreConcept: L(`आधार ${base} में n अंकों की संख्या के लिए ${base}^(n−1) ≤ N < ${base}^n होता है।`, `ਆਧਾਰ ${base} ਵਿੱਚ n ਅੰਕਾਂ ਦੀ ਸੰਖਿਆ ਲਈ ${base}^(n−1) ≤ N < ${base}^n ਹੁੰਦਾ ਹੈ।`),
        strategy: L("संख्या को लगातार दो घात-सीमाओं के बीच रखें।", "ਸੰਖਿਆ ਨੂੰ ਲਗਾਤਾਰ ਦੋ ਘਾਤ-ਹੱਦਾਂ ਦੇ ਵਿਚਕਾਰ ਰੱਖੋ।"),
        steps: [
          L(`${lower} = ${base}^${digitsCount - 1} ≤ ${decimal} < ${base}^${digitsCount}।`, `${lower} = ${base}^${digitsCount - 1} ≤ ${decimal} < ${base}^${digitsCount}।`),
          L(`इसलिए आधार ${base} में ठीक ${digitsCount} अंक चाहिए।`, `ਇਸ ਲਈ ਆਧਾਰ ${base} ਵਿੱਚ ਠੀਕ ${digitsCount} ਅੰਕ ਚਾਹੀਦੇ ਹਨ।`),
        ],
      };
    }
    case "LARGEST_N_DIGIT_BASE_NUMERAL":
    case "SMALLEST_N_DIGIT_BASE_NUMERAL": {
      const base = numberValue(s, "base");
      const n = numberValue(s, "n");
      const largest = q.taskKind === "LARGEST_N_DIGIT_BASE_NUMERAL";
      return {
        stem: L(`आधार ${base} की ${n}-अंकीय ${largest ? "सबसे बड़ी" : "सबसे छोटी"} संख्या का दशमलव मान ज्ञात कीजिए।`, `ਆਧਾਰ ${base} ਦੀ ${n}-ਅੰਕੀ ${largest ? "ਸਭ ਤੋਂ ਵੱਡੀ" : "ਸਭ ਤੋਂ ਛੋਟੀ"} ਸੰਖਿਆ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੱਢੋ।`),
        coreConcept: largest
          ? L(`आधार b में सबसे बड़ी n-अंकीय संख्या का मान b^n − 1 होता है।`, `ਆਧਾਰ b ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ n-ਅੰਕੀ ਸੰਖਿਆ ਦਾ ਮੁੱਲ b^n − 1 ਹੁੰਦਾ ਹੈ।`)
          : L(`आधार b में सबसे छोटी n-अंकीय संख्या 1 के बाद n−1 शून्य होती है और उसका मान b^(n−1) है।`, `ਆਧਾਰ b ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ n-ਅੰਕੀ ਸੰਖਿਆ 1 ਤੋਂ ਬਾਅਦ n−1 ਸਿਫ਼ਰ ਹੁੰਦੀ ਹੈ ਅਤੇ ਉਸਦਾ ਮੁੱਲ b^(n−1) ਹੈ।`),
        strategy: L("सीमा-सूत्र सीधे लागू करें; पूरी संख्या को स्थान-मूल्यों से फैलाने की जरूरत नहीं है।", "ਹੱਦ-ਸੂਤਰ ਸਿੱਧਾ ਲਗਾਓ; ਪੂਰੀ ਸੰਖਿਆ ਨੂੰ ਸਥਾਨ-ਮੁੱਲਾਂ ਨਾਲ ਖੋਲ੍ਹਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"),
        steps: [
          largest ? L(`${base}^${n} − 1 = ${q.canonicalAnswer}।`, `${base}^${n} − 1 = ${q.canonicalAnswer}।`) : L(`${base}^${n - 1} = ${q.canonicalAnswer}।`, `${base}^${n - 1} = ${q.canonicalAnswer}।`),
          L(`अतः मांगा गया दशमलव मान ${q.canonicalAnswer} है।`, `ਇਸ ਲਈ ਮੰਗਿਆ ਦਸ਼ਮਲਵ ਮੁੱਲ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "COUNT_VALID_BASES_IN_RANGE": {
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const maxDigit = numberValue(s, "maxDigit");
      const numeralText = text(s, "text");
      const validBases = numberList(s, "validBases");
      return {
        stem: L(`${lower} ≤ b ≤ ${upper} में कितने पूर्णांक आधारों के लिए (${numeralText})_b वैध है?`, `${lower} ≤ b ≤ ${upper} ਵਿੱਚ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਆਧਾਰਾਂ ਲਈ (${numeralText})_b ਵੈਧ ਹੈ?`),
        coreConcept: L(`आधार को सबसे बड़े अंक ${maxDigit} से बड़ा होना चाहिए।`, `ਆਧਾਰ ਸਭ ਤੋਂ ਵੱਡੇ ਅੰਕ ${maxDigit} ਤੋਂ ਵੱਡਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`),
        strategy: L("दी गई आधार-सीमा को b > सबसे बड़ा अंक वाली शर्त से काटें।", "ਦਿੱਤੀ ਆਧਾਰ-ਹੱਦ ਨੂੰ b > ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਕ ਵਾਲੀ ਸ਼ਰਤ ਨਾਲ ਕਾਟੋ।"),
        steps: [
          L(`वैध आधार ${validBases.length ? validBases.join(", ") : "कोई नहीं"} हैं।`, `ਵੈਧ ਆਧਾਰ ${validBases.length ? validBases.join(", ") : "ਕੋਈ ਨਹੀਂ"} ਹਨ।`),
          L(`इसलिए कुल संख्या ${q.canonicalAnswer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਗਿਣਤੀ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "UNKNOWN_BASE_FROM_ARITHMETIC_STATEMENT": {
      const base = numberValue(s, "base");
      const leftText = text(s, "leftText");
      const rightText = text(s, "rightText");
      const resultText = text(s, "resultText");
      const p = numberValue(s, "p");
      const qDigit = numberValue(s, "q");
      const r = numberValue(s, "s");
      return {
        stem: L(`यदि आधार b में (${leftText})_b + (${rightText})_b = (${resultText})_b, तो b ज्ञात कीजिए।`, `ਜੇ ਆਧਾਰ b ਵਿੱਚ (${leftText})_b + (${rightText})_b = (${resultText})_b, ਤਾਂ b ਕੱਢੋ।`),
        coreConcept: L("अज्ञात आधार वाली जोड़ में इकाई कॉलम कैरी की सीधी समीकरण देता है।", "ਅਣਜਾਣ ਆਧਾਰ ਵਾਲੇ ਜੋੜ ਵਿੱਚ ਇਕਾਈ ਕਾਲਮ ਕੈਰੀ ਦੀ ਸਿੱਧੀ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ।"),
        strategy: L("इकाई अंकों को जोड़कर लिखे गए इकाई अंक को घटाएँ; एक कैरी होने पर यही आधार है।", "ਇਕਾਈ ਅੰਕਾਂ ਨੂੰ ਜੋੜ ਕੇ ਲਿਖਿਆ ਇਕਾਈ ਅੰਕ ਘਟਾਓ; ਇੱਕ ਕੈਰੀ ਹੋਣ ਤੇ ਇਹੀ ਆਧਾਰ ਹੈ।"),
        steps: [
          L(`${p} + ${qDigit} = b + ${r}।`, `${p} + ${qDigit} = b + ${r}।`),
          L(`इसलिए b = ${p} + ${qDigit} − ${r} = ${base}।`, `ਇਸ ਲਈ b = ${p} + ${qDigit} − ${r} = ${base}।`),
        ],
      };
    }
    case "MULTIPLICATION_IN_BASE": {
      const base = numberValue(s, "base");
      const multiplicandText = text(s, "multiplicandText");
      const multiplierText = text(s, "multiplierText");
      const unitsTotal = numberValue(s, "unitsTotal");
      const carry = numberValue(s, "carry");
      const resultText = text(s, "resultText");
      return {
        stem: L(`${notation(multiplicandText, base)} × ${notation(multiplierText, base)} को आधार ${base} में गुणा कीजिए।`, `${notation(multiplicandText, base)} × ${notation(multiplierText, base)} ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਗੁਣਾ ਕਰੋ।`),
        coreConcept: L(`आधार ${base} की गुणा में हर आंशिक गुणनफल को आधार से भाग देकर लिखा अंक और कैरी मिलता है।`, `ਆਧਾਰ ${base} ਦੀ ਗੁਣਾ ਵਿੱਚ ਹਰ ਅੰਸ਼ਕ ਗੁਣਨਫਲ ਨੂੰ ਆਧਾਰ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਲਿਖਿਆ ਅੰਕ ਅਤੇ ਕੈਰੀ ਮਿਲਦਾ ਹੈ।`),
        strategy: L("इकाई स्थान से शुरू करें और कैरी को अगले गुणन में जोड़ें।", "ਇਕਾਈ ਸਥਾਨ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਕੈਰੀ ਨੂੰ ਅਗਲੇ ਗੁਣਾ ਵਿੱਚ ਜੋੜੋ।"),
        steps: [
          L(`इकाई गुणनफल ${unitsTotal} है; इसे ${base} से बाँटने पर कैरी ${carry} मिलता है।`, `ਇਕਾਈ ਗੁਣਨਫਲ ${unitsTotal} ਹੈ; ਇਸਨੂੰ ${base} ਨਾਲ ਵੰਡਣ ਤੇ ਕੈਰੀ ${carry} ਮਿਲਦਾ ਹੈ।`),
          L(`अगले स्थान में कैरी जोड़कर परिणाम के अंक ${resultText} मिलते हैं; उत्तर ${q.canonicalAnswer} है।`, `ਅਗਲੇ ਸਥਾਨ ਵਿੱਚ ਕੈਰੀ ਜੋੜ ਕੇ ਨਤੀਜੇ ਦੇ ਅੰਕ ${resultText} ਮਿਲਦੇ ਹਨ; ਉੱਤਰ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "COMPARE_NUMERALS_ACROSS_BASES": {
      const baseA = numberValue(s, "baseA");
      const baseB = numberValue(s, "baseB");
      const textA = text(s, "textA");
      const textB = text(s, "textB");
      const valueA = numberValue(s, "valueA");
      const valueB = numberValue(s, "valueB");
      return {
        stem: L(`${notation(textA, baseA)} और ${notation(textB, baseB)} की तुलना कीजिए।`, `${notation(textA, baseA)} ਅਤੇ ${notation(textB, baseB)} ਦੀ ਤੁਲਨਾ ਕਰੋ।`),
        coreConcept: L("अलग आधारों में लिखी संख्याओं की अंक-लंबाई या दिखावट की नहीं, वास्तविक मान की तुलना होती है।", "ਵੱਖਰੇ ਆਧਾਰਾਂ ਵਿੱਚ ਲਿਖੀਆਂ ਸੰਖਿਆਵਾਂ ਦੀ ਅੰਕ-ਲੰਬਾਈ ਜਾਂ ਦਿੱਖ ਦੀ ਨਹੀਂ, ਅਸਲ ਮੁੱਲ ਦੀ ਤੁਲਨਾ ਹੁੰਦੀ ਹੈ।"),
        strategy: L("दोनों का समान दशमलव मान निकालकर सीधे तुलना करें।", "ਦੋਵਾਂ ਦਾ ਇੱਕੋ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੱਢ ਕੇ ਸਿੱਧੀ ਤੁਲਨਾ ਕਰੋ।"),
        steps: [
          L(`${notation(textA, baseA)} = ${valueA} और ${notation(textB, baseB)} = ${valueB}।`, `${notation(textA, baseA)} = ${valueA} ਅਤੇ ${notation(textB, baseB)} = ${valueB}।`),
          L(`तुलना से निष्कर्ष: ${localizedAnswer(q.canonicalAnswer, language)}।`, `ਤੁਲਨਾ ਤੋਂ ਨਤੀਜਾ: ${localizedAnswer(q.canonicalAnswer, language)}।`),
        ],
      };
    }
    case "REMAINDER_OF_BASE_NUMERAL": {
      const base = numberValue(s, "base");
      const numeralText = text(s, "text");
      const divisor = numberValue(s, "divisor");
      const integerValue = numberValue(s, "value");
      const quotient = numberValue(s, "quotient");
      const remainder = numberValue(s, "remainder");
      return {
        stem: L(`${notation(numeralText, base)} को ${divisor} से भाग देने पर शेष ज्ञात कीजिए।`, `${notation(numeralText, base)} ਨੂੰ ${divisor} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੱਢੋ।`),
        coreConcept: L("आधार में लिखी संख्या का शेष निकालते समय उसी आधार के स्थान-मूल्य बनाए रखना आवश्यक है।", "ਆਧਾਰ ਵਿੱਚ ਲਿਖੀ ਸੰਖਿਆ ਦਾ ਬਾਕੀ ਕੱਢਦੇ ਸਮੇਂ ਉਸੇ ਆਧਾਰ ਦੇ ਸਥਾਨ-ਮੁੱਲ ਕਾਇਮ ਰੱਖਣੇ ਲਾਜ਼ਮੀ ਹਨ।"),
        strategy: L("या तो पूर्ण मान निकालें, या हर अंक पर मॉड्यूलर चाल चलाएँ।", "ਜਾਂ ਪੂਰਾ ਮੁੱਲ ਕੱਢੋ, ਜਾਂ ਹਰ ਅੰਕ ਤੇ ਮੋਡਿਊਲਰ ਕਦਮ ਚਲਾਓ।"),
        steps: [
          L(`${notation(numeralText, base)} का पूर्णांक मान ${integerValue} है।`, `${notation(numeralText, base)} ਦਾ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ${integerValue} ਹੈ।`),
          L(`${integerValue} = ${quotient} × ${divisor} + ${remainder}; इसलिए शेष ${remainder} है।`, `${integerValue} = ${quotient} × ${divisor} + ${remainder}; ਇਸ ਲਈ ਬਾਕੀ ${remainder} ਹੈ।`),
        ],
      };
    }
    case "TERMINAL_DIGIT_IN_STATED_BASE": {
      const base = numberValue(s, "base");
      const leftText = text(s, "leftText");
      const rightText = text(s, "rightText");
      const unitProduct = numberValue(s, "unitProduct");
      const unit = numberValue(s, "unit");
      return {
        stem: L(`${notation(leftText, base)} × ${notation(rightText, base)} का आधार-${base} में अंतिम अंक ज्ञात कीजिए।`, `${notation(leftText, base)} × ${notation(rightText, base)} ਦਾ ਆਧਾਰ-${base} ਵਿੱਚ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`),
        coreConcept: L(`आधार ${base} में अंतिम अंक केवल इकाई अंकों के गुणनफल का ${base} से शेष है।`, `ਆਧਾਰ ${base} ਵਿੱਚ ਆਖਰੀ ਅੰਕ ਸਿਰਫ਼ ਇਕਾਈ ਅੰਕਾਂ ਦੇ ਗੁਣਨਫਲ ਦਾ ${base} ਨਾਲ ਬਾਕੀ ਹੈ।`),
        strategy: L("ऊँचे स्थानों को छोड़कर केवल दोनों इकाई अंक गुणा करें।", "ਉੱਚੇ ਸਥਾਨ ਛੱਡ ਕੇ ਸਿਰਫ਼ ਦੋਵੇਂ ਇਕਾਈ ਅੰਕ ਗੁਣਾ ਕਰੋ।"),
        steps: [
          L(`इकाई अंकों का गुणनफल ${unitProduct} है।`, `ਇਕਾਈ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ${unitProduct} ਹੈ।`),
          L(`${unitProduct} mod ${base} = ${unit}; आधार-${base} का अंतिम अंक ${q.canonicalAnswer} है।`, `${unitProduct} mod ${base} = ${unit}; ਆਧਾਰ-${base} ਦਾ ਆਖਰੀ ਅੰਕ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "LEADING_ZERO_THREE_DIGIT_CLASSIFICATION": {
      const base = numberValue(s, "base");
      const invalid = text(s, "invalid");
      return {
        stem: L(`कौन-सा विकल्प आधार ${base} में वास्तव में तीन-अंकीय पूर्णांक संख्या नहीं है?`, `ਕਿਹੜੀ ਚੋਣ ਆਧਾਰ ${base} ਵਿੱਚ ਅਸਲ ਵਿੱਚ ਤਿੰਨ-ਅੰਕੀ ਪੂਰਨ ਅੰਕ ਸੰਖਿਆ ਨਹੀਂ ਹੈ?`),
        coreConcept: L("n-अंकीय स्थानिक संख्या का पहला अंक शून्य नहीं हो सकता।", "n-ਅੰਕੀ ਸਥਾਨਕ ਸੰਖਿਆ ਦਾ ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਨਹੀਂ ਹੋ ਸਕਦਾ।"),
        strategy: L("पहला अंक देखें; शुरुआती शून्य सबसे ऊँचे स्थान को समाप्त कर देता है।", "ਪਹਿਲਾ ਅੰਕ ਵੇਖੋ; ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਸਭ ਤੋਂ ਉੱਚੇ ਸਥਾਨ ਨੂੰ ਖਤਮ ਕਰ ਦਿੰਦਾ ਹੈ।"),
        steps: [
          L(`${notation(invalid, base)} का पहला अंक 0 है, इसलिए उसका ${base}^2 स्थान योगदान शून्य है।`, `${notation(invalid, base)} ਦਾ ਪਹਿਲਾ ਅੰਕ 0 ਹੈ, ਇਸ ਲਈ ਉਸਦਾ ${base}^2 ਸਥਾਨ ਯੋਗਦਾਨ ਸਿਫ਼ਰ ਹੈ।`),
          L(`इस कारण यह तीन-अंकीय संख्या नहीं है; सही विकल्प ${q.canonicalAnswer} है।`, `ਇਸ ਕਰਕੇ ਇਹ ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ਨਹੀਂ ਹੈ; ਸਹੀ ਚੋਣ ${q.canonicalAnswer} ਹੈ।`),
        ],
      };
    }
    case "UNKNOWN_BASE_SOLUTION_TOPOLOGY": {
      const equation = text(s, "equation");
      const validBases = numberList(s, "validBases");
      return {
        stem: L(`पूर्णांक आधार 2 ≤ b ≤ 12 के लिए ${equation} के समाधानों का प्रकार बताइए।`, `ਪੂਰਨ ਅੰਕ ਆਧਾਰ 2 ≤ b ≤ 12 ਲਈ ${equation} ਦੇ ਹੱਲਾਂ ਦੀ ਕਿਸਮ ਦੱਸੋ।`),
        coreConcept: L("पहले आधार-b के अंक-समूहों को b वाली बीजीय अभिव्यक्तियों में बदलें, फिर केवल वैध आधार रखें।", "ਪਹਿਲਾਂ ਆਧਾਰ-b ਦੇ ਅੰਕ-ਸਮੂਹਾਂ ਨੂੰ b ਵਾਲੀਆਂ ਬੀਜਗਣਿਤੀ ਅਭਿਵਿਅਕਤੀਆਂ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਸਿਰਫ਼ ਵੈਧ ਆਧਾਰ ਰੱਖੋ।"),
        strategy: L("समीकरण हल करने के बाद 2 से 12 की घोषित सीमा में समाधानों की संख्या गिनें।", "ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਤੋਂ ਬਾਅਦ 2 ਤੋਂ 12 ਦੀ ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ਹੱਲਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।"),
        steps: [
          L(`वैध आधारों का समुच्चय ${validBases.length ? validBases.join(", ") : "रिक्त"} है।`, `ਵੈਧ ਆਧਾਰਾਂ ਦਾ ਸਮੂਹ ${validBases.length ? validBases.join(", ") : "ਖਾਲੀ"} ਹੈ।`),
          L(`इसलिए समाधान-प्रकार ${localizedAnswer(q.canonicalAnswer, language)} है।`, `ਇਸ ਲਈ ਹੱਲਾਂ ਦੀ ਕਿਸਮ ${localizedAnswer(q.canonicalAnswer, language)} ਹੈ।`),
        ],
      };
    }
    case "ZERO_NUMERAL_MINIMUM_BASE_BOUNDARY": {
      return {
        stem: L(`एक-अंकीय संख्या (0)_b के लिए न्यूनतम मान्य स्थानिक आधार b क्या है?`, `ਇੱਕ-ਅੰਕੀ ਸੰਖਿਆ (0)_b ਲਈ ਘੱਟੋ-ਘੱਟ ਵੈਧ ਸਥਾਨਕ ਆਧਾਰ b ਕੀ ਹੈ?`),
        coreConcept: L("सामान्य स्थानिक आधार-प्रणाली में आधार कम से कम 2 होता है; अंक 0 आधार 2 में भी वैध है।", "ਆਮ ਸਥਾਨਕ ਆਧਾਰ-ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਆਧਾਰ ਘੱਟੋ-ਘੱਟ 2 ਹੁੰਦਾ ਹੈ; ਅੰਕ 0 ਆਧਾਰ 2 ਵਿੱਚ ਵੀ ਵੈਧ ਹੈ।"),
        strategy: L("अंक 0 के कारण आधार 1 न लें; अध्याय की स्थानिक आधार परिभाषा b ≥ 2 लागू करें।", "ਅੰਕ 0 ਕਰਕੇ ਆਧਾਰ 1 ਨਾ ਲਵੋ; ਅਧਿਆਇ ਦੀ ਸਥਾਨਕ ਆਧਾਰ ਪਰਿਭਾਸ਼ਾ b ≥ 2 ਲਾਗੂ ਕਰੋ।"),
        steps: [
          L("आधार 2 में 0 एक वैध अंक है।", "ਆਧਾਰ 2 ਵਿੱਚ 0 ਇੱਕ ਵੈਧ ਅੰਕ ਹੈ।"),
          L("आधार 1 सामान्य स्थानिक आधार-b प्रणाली में शामिल नहीं है; इसलिए न्यूनतम आधार 2 है।", "ਆਧਾਰ 1 ਆਮ ਸਥਾਨਕ ਆਧਾਰ-b ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ; ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਆਧਾਰ 2 ਹੈ।"),
        ],
      };
    }
    default:
      throw new Error(`No CP013 localization content for task kind ${q.taskKind}`);
  }
}

export function generateNumCp013Localized(
  qlId: NumCp013PermanentQlId,
  seed: number,
  language: NumCp013LocalizedLanguage,
): NumCp013LocalizedPackage {
  const en = generateNumCp013Permanent(qlId, seed);
  const localized = content(en, language);
  const canonicalAnswer = localizedAnswer(en.canonicalAnswer, language);
  const verifierAnswer = localizedAnswer(en.verifierAnswer, language);
  const options = Object.freeze(en.options.map((option) => Object.freeze({
    value: localizedAnswer(option.value, language),
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  })));

  if (canonicalAnswer !== verifierAnswer) throw new Error(`${qlId}/${language}/${seed}: localized verifier drift.`);
  if (options[en.correctIndex]?.value !== canonicalAnswer || options[en.correctIndex]?.isCorrect !== true) {
    throw new Error(`${qlId}/${language}/${seed}: localized option binding drift.`);
  }

  return Object.freeze({
    ...en,
    language,
    locale: localeFor(language),
    stem: localized.stem,
    options,
    canonicalAnswer,
    verifierAnswer,
    explanation: Object.freeze({
      coreConcept: localized.coreConcept,
      strategy: localized.strategy,
      steps: Object.freeze([...localized.steps]),
      finalAnswer: canonicalAnswer,
    }),
    lifecycle: Object.freeze({
      permanentQlId: qlId,
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  }) as NumCp013LocalizedPackage;
}
