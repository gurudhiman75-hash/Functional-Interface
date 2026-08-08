import { runNumCp006PermanentPipeline } from "../permanent/runtime";
import type { NumCp006PermanentQlId } from "../permanent/allocation";
import type { NumCp006PermanentQuestion } from "../permanent/types";
import type {
  NumCp006LocalizedExplanation,
  NumCp006LocalizedOption,
  NumCp006LocalizedQuestion,
  NumCp006TranslatedLocale,
} from "./types";

export interface NumCp006LocalizedRuntimeInput {
  readonly questionLanguageId?: NumCp006PermanentQlId;
  readonly seed?: number;
  readonly locale: NumCp006TranslatedLocale;
}

type State = Readonly<Record<string, unknown>>;

function arr(state: State, key: string): string[] {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Missing array state ${key}`);
  return value.map(String);
}

function value(state: State, key: string): string {
  const result = state[key];
  if (result === undefined) throw new Error(`Missing state ${key}`);
  return String(result);
}

function list(values: readonly string[], locale: NumCp006TranslatedLocale): string {
  if (values.length === 2) return locale === "hi-IN" ? `${values[0]} और ${values[1]}` : `${values[0]} ਅਤੇ ${values[1]}`;
  const last = values.at(-1)!;
  return locale === "hi-IN"
    ? `${values.slice(0, -1).join(", ")} और ${last}`
    : `${values.slice(0, -1).join(", ")} ਅਤੇ ${last}`;
}

function unitText(unit: string, locale: NumCp006TranslatedLocale): string {
  const hi: Record<string, string> = {
    cm: "सेमी", m: "मीटर", kg: "किग्रा", seconds: "सेकंड", minutes: "मिनट",
  };
  const pa: Record<string, string> = {
    cm: "ਸੈਮੀ", m: "ਮੀਟਰ", kg: "ਕਿਲੋਗ੍ਰਾਮ", seconds: "ਸਕਿੰਟ", minutes: "ਮਿੰਟ",
  };
  return (locale === "hi-IN" ? hi : pa)[unit] ?? unit;
}

const OPTION_TRANSLATIONS = {
  "hi-IN": {
    "True": "सही",
    "False": "गलत",
    "Cannot be determined": "निर्धारित नहीं किया जा सकता",
    "True only for prime numbers": "केवल अभाज्य संख्याओं के लिए सही",
    "I only": "केवल I",
    "II only": "केवल II",
    "III only": "केवल III",
    "I and II only": "केवल I और II",
    "I and III only": "केवल I और III",
    "II and III only": "केवल II और III",
    "All three": "तीनों",
    "I alone is sufficient": "केवल I पर्याप्त है",
    "II alone is sufficient": "केवल II पर्याप्त है",
    "Both together are sufficient": "दोनों मिलकर पर्याप्त हैं",
    "Even together are insufficient": "दोनों मिलकर भी पर्याप्त नहीं हैं",
  },
  "pa-IN": {
    "True": "ਸਹੀ",
    "False": "ਗਲਤ",
    "Cannot be determined": "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
    "True only for prime numbers": "ਕੇਵਲ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਲਈ ਸਹੀ",
    "I only": "ਕੇਵਲ I",
    "II only": "ਕੇਵਲ II",
    "III only": "ਕੇਵਲ III",
    "I and II only": "ਕੇਵਲ I ਅਤੇ II",
    "I and III only": "ਕੇਵਲ I ਅਤੇ III",
    "II and III only": "ਕੇਵਲ II ਅਤੇ III",
    "All three": "ਤਿੰਨੇ",
    "I alone is sufficient": "ਕੇਵਲ I ਕਾਫ਼ੀ ਹੈ",
    "II alone is sufficient": "ਕੇਵਲ II ਕਾਫ਼ੀ ਹੈ",
    "Both together are sufficient": "ਦੋਵੇਂ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ",
    "Even together are insufficient": "ਦੋਵੇਂ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  },
} as const;

export function translateNumCp006OptionValue(valueText: string, locale: NumCp006TranslatedLocale): string {
  const fixed = (OPTION_TRANSLATIONS[locale] as Readonly<Record<string, string>>)[valueText];
  if (fixed) return fixed;
  const unitMatch = valueText.match(/^(.+?)\s+(cm|m|kg|seconds|minutes)$/);
  if (unitMatch) return `${unitMatch[1]} ${unitText(unitMatch[2]!, locale)}`;
  return valueText;
}

function localizedStem(question: NumCp006PermanentQuestion, locale: NumCp006TranslatedLocale): string {
  const hi = locale === "hi-IN";
  const state = question.hiddenState;
  const ql = question.questionLanguageId;
  switch (ql) {
    case "NUM-QL-070":
      return hi ? `${list(arr(state, "numbers"), locale)} का महत्तम समापवर्तक ज्ञात कीजिए।` : `${list(arr(state, "numbers"), locale)} ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਕੱਢੋ।`;
    case "NUM-QL-071":
      return hi ? `${list(arr(state, "numbers"), locale)} का लघुत्तम समापवर्त्य ज्ञात कीजिए।` : `${list(arr(state, "numbers"), locale)} ਦਾ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਕੱਢੋ।`;
    case "NUM-QL-072":
      return hi ? `${list(arr(state, "numbers"), locale)} का महत्तम समापवर्तक ज्ञात कीजिए।` : `${list(arr(state, "numbers"), locale)} ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਕੱਢੋ।`;
    case "NUM-QL-073":
      return hi ? `${list(arr(state, "numbers"), locale)} का लघुत्तम समापवर्त्य ज्ञात कीजिए।` : `${list(arr(state, "numbers"), locale)} ਦਾ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਕੱਢੋ।`;
    case "NUM-QL-074": {
      const rows = state.rows as readonly Record<string, string>[];
      const ladder = rows.map((row) => `${row.dividend} = ${row.divisor} × ${row.quotient} + ${row.remainder}`).join("; ");
      return hi ? `यूक्लिड विभाजन क्रम ${ladder} दिया है। अंतिम महत्तम समापवर्तक क्या है?` : `ਯੂਕਲਿਡ ਭਾਗ ਕ੍ਰਮ ${ladder} ਦਿੱਤਾ ਹੈ। ਅੰਤਿਮ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਕੀ ਹੈ?`;
    }
    case "NUM-QL-075": {
      const numbers = arr(state, "numbers");
      const target = value(state, "target");
      return hi
        ? `${numbers[0]} से ${numbers[1]} पूर्णतः विभाज्य है। दोनों का ${target === "HCF" ? "महत्तम समापवर्तक" : "लघुत्तम समापवर्त्य"} ज्ञात कीजिए।`
        : `${numbers[1]} ਨੂੰ ${numbers[0]} ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਦਿੰਦਾ ਹੈ। ਦੋਵਾਂ ਦਾ ${target === "HCF" ? "ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ" : "ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ"} ਕੱਢੋ।`;
    }
    case "NUM-QL-076": {
      const numbers = arr(state, "numbers");
      const target = value(state, "target");
      return hi
        ? `${numbers[0]} और ${numbers[1]} सह-अभाज्य हैं। उनका ${target === "HCF" ? "महत्तम समापवर्तक" : "लघुत्तम समापवर्त्य"} ज्ञात कीजिए।`
        : `${numbers[0]} ਅਤੇ ${numbers[1]} ਆਪਸੀ ਅਭਾਜ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ${target === "HCF" ? "ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ" : "ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ"} ਕੱਢੋ।`;
    }
    case "NUM-QL-077":
      return hi
        ? `दो धनात्मक पूर्णांकों का महत्तम समापवर्तक ${value(state, "hcf")} और लघुत्तम समापवर्त्य ${value(state, "lcm")} है। एक पूर्णांक ${value(state, "known")} है। दूसरा ज्ञात कीजिए।`
        : `ਦੋ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${value(state, "hcf")} ਅਤੇ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ${value(state, "lcm")} ਹੈ। ਇੱਕ ਅੰਕ ${value(state, "known")} ਹੈ। ਦੂਜਾ ਕੱਢੋ।`;
    case "NUM-QL-078":
      return hi
        ? `किस धनात्मक पूर्णांक-युग्म का महत्तम समापवर्तक ${value(state, "hcf")} और लघुत्तम समापवर्त्य ${value(state, "lcm")} है?`
        : `ਕਿਹੜੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ-ਜੋੜੇ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${value(state, "hcf")} ਅਤੇ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ${value(state, "lcm")} ਹੈ?`;
    case "NUM-QL-079":
      return hi
        ? `कितने अक्रमित धनात्मक पूर्णांक-युग्मों का महत्तम समापवर्तक ${value(state, "hcf")} और लघुत्तम समापवर्त्य ${value(state, "lcm")} है?`
        : `ਕਿੰਨੇ ਬਿਨਾਂ ਕ੍ਰਮ ਵਾਲੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ-ਜੋੜਿਆਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${value(state, "hcf")} ਅਤੇ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ${value(state, "lcm")} ਹੈ?`;
    case "NUM-QL-080":
      return hi
        ? `${list(arr(state, "values"), locale)} ${unitText(value(state, "unit"), locale)} की मात्राओं को बिना शेष बराबर सबसे बड़े भागों में बाँटना है। प्रत्येक भाग का माप क्या होगा?`
        : `${list(arr(state, "values"), locale)} ${unitText(value(state, "unit"), locale)} ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਨੂੰ ਬਿਨਾਂ ਬਚਤ ਬਰਾਬਰ ਸਭ ਤੋਂ ਵੱਡੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਣਾ ਹੈ। ਹਰ ਹਿੱਸੇ ਦਾ ਮਾਪ ਕੀ ਹੋਵੇਗਾ?`;
    case "NUM-QL-081":
      return hi
        ? `तीन घटनाएँ ${list(arr(state, "intervals"), locale)} ${unitText(value(state, "unit"), locale)} के अंतराल पर होती हैं और अभी साथ हुई हैं। अगली बार कितने समय बाद साथ होंगी?`
        : `ਤਿੰਨ ਘਟਨਾਵਾਂ ${list(arr(state, "intervals"), locale)} ${unitText(value(state, "unit"), locale)} ਦੇ ਅੰਤਰਾਲਾਂ ਤੇ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਹੁਣ ਇਕੱਠੀਆਂ ਹੋਈਆਂ ਹਨ। ਅਗਲੀ ਵਾਰ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਇਕੱਠੀਆਂ ਹੋਣਗੀਆਂ?`;
    case "NUM-QL-082":
      return hi
        ? `${value(state, "lowerBound")} से कम न होने वाला सबसे छोटा पूर्णांक ज्ञात कीजिए जो ${list(arr(state, "divisors"), locale)} से विभाज्य हो।`
        : `${value(state, "lowerBound")} ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜੋ ${list(arr(state, "divisors"), locale)} ਨਾਲ ਭਾਜਯ ਹੋਵੇ।`;
    case "NUM-QL-083":
      return hi
        ? `${value(state, "upperBound")} से अधिक न होने वाला सबसे बड़ा पूर्णांक ज्ञात कीजिए जो ${list(arr(state, "divisors"), locale)} से विभाज्य हो।`
        : `${value(state, "upperBound")} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜੋ ${list(arr(state, "divisors"), locale)} ਨਾਲ ਭਾਜਯ ਹੋਵੇ।`;
    case "NUM-QL-084":
      return hi
        ? `वह सबसे बड़ा धनात्मक पूर्णांक ज्ञात कीजिए जो ${arr(state, "numbers").join(", ")} को भाग देने पर प्रत्येक बार समान शेष छोड़े।`
        : `ਉਹ ਸਭ ਤੋਂ ਵੱਡਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜੋ ${arr(state, "numbers").join(", ")} ਨੂੰ ਭਾਗ ਦੇਣ ਤੇ ਹਰ ਵਾਰ ਇੱਕੋ ਬਾਕੀ ਛੱਡੇ।`;
    case "NUM-QL-085": {
      const numbers = arr(state, "numbers");
      const remainders = arr(state, "remainders");
      const conditions = numbers.map((number, index) => hi ? `${number} पर शेष ${remainders[index]}` : `${number} ਤੇ ਬਾਕੀ ${remainders[index]}`).join("; ");
      return hi ? `सबसे बड़ा धनात्मक भाजक d ज्ञात कीजिए: ${conditions}।` : `ਸਭ ਤੋਂ ਵੱਡਾ ਧਨਾਤਮਕ ਭਾਜਕ d ਕੱਢੋ: ${conditions}।`;
    }
    case "NUM-QL-086":
      return hi
        ? `${list(arr(state, "divisors"), locale)} में प्रत्येक भाजक से बड़ा वह सबसे छोटा धनात्मक पूर्णांक ज्ञात कीजिए जो प्रत्येक से भाग देने पर शेष ${value(state, "commonRemainder")} छोड़े।`
        : `${list(arr(state, "divisors"), locale)} ਦੇ ਹਰ ਭਾਜਕ ਤੋਂ ਵੱਡਾ ਉਹ ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜੋ ਹਰ ਇੱਕ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${value(state, "commonRemainder")} ਛੱਡੇ।`;
    case "NUM-QL-087":
      return hi
        ? `${value(state, "number")} में न्यूनतम कितना जोड़ा जाए ताकि परिणाम ${list(arr(state, "divisors"), locale)} से विभाज्य हो?`
        : `${value(state, "number")} ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਕਿੰਨਾ ਜੋੜਿਆ ਜਾਵੇ ਤਾਂ ਜੋ ਨਤੀਜਾ ${list(arr(state, "divisors"), locale)} ਨਾਲ ਭਾਜਯ ਹੋਵੇ?`;
    case "NUM-QL-088":
      return hi
        ? `${value(state, "number")} में से न्यूनतम कितना घटाया जाए ताकि परिणाम ${list(arr(state, "divisors"), locale)} से विभाज्य हो?`
        : `${value(state, "number")} ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਕਿੰਨਾ ਘਟਾਇਆ ਜਾਵੇ ਤਾਂ ਜੋ ਨਤੀਜਾ ${list(arr(state, "divisors"), locale)} ਨਾਲ ਭਾਜਯ ਹੋਵੇ?`;
    case "NUM-QL-089":
      return hi
        ? `${value(state, "lowerBound")} से बड़ा वह सबसे छोटा पूर्णांक ज्ञात कीजिए जो ${list(arr(state, "divisors"), locale)} से विभाज्य संख्या से ${value(state, "deficiency")} कम हो।`
        : `${value(state, "lowerBound")} ਤੋਂ ਵੱਡਾ ਉਹ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜੋ ${list(arr(state, "divisors"), locale)} ਨਾਲ ਭਾਜਯ ਸੰਖਿਆ ਤੋਂ ${value(state, "deficiency")} ਘੱਟ ਹੋਵੇ।`;
    case "NUM-QL-090":
      return hi
        ? `${value(state, "lower")} से ${value(state, "upper")} तक, दोनों सहित, कितने पूर्णांक ${list(arr(state, "divisors"), locale)} से विभाज्य हैं?`
        : `${value(state, "lower")} ਤੋਂ ${value(state, "upper")} ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ${list(arr(state, "divisors"), locale)} ਨਾਲ ਭਾਜਯ ਹਨ?`;
    case "NUM-QL-091":
    case "NUM-QL-092": {
      const target = ql === "NUM-QL-091" ? (hi ? "महत्तम समापवर्तक" : "ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ") : (hi ? "लघुत्तम समापवर्त्य" : "ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ");
      return hi
        ? `${arr(state, "displayValues").join(", ")} का ${target} सरलतम रूप में ज्ञात कीजिए।`
        : `${arr(state, "displayValues").join(", ")} ਦਾ ${target} ਸਰਲ ਰੂਪ ਵਿੱਚ ਕੱਢੋ।`;
    }
    case "NUM-QL-093": {
      const mode = Number(state.claimMode);
      if (mode === 0) return hi ? `दावे का मूल्यांकन कीजिए: दो धनात्मक पूर्णांकों के लिए महत्तम समापवर्तक × लघुत्तम समापवर्त्य = दोनों पूर्णांकों का गुणनफल।` : `ਦਾਅਵੇ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ: ਦੋ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਲਈ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ × ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ = ਦੋਵਾਂ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ।`;
      if (mode === 1) return hi ? `दावे का मूल्यांकन कीजिए: किसी भी तीन धनात्मक पूर्णांकों के लिए महत्तम समापवर्तक × लघुत्तम समापवर्त्य हमेशा तीनों के गुणनफल के बराबर होता है।` : `ਦਾਅਵੇ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ: ਕਿਸੇ ਵੀ ਤਿੰਨ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਲਈ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ × ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਹਮੇਸ਼ਾ ਤਿੰਨਾਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।`;
      if (mode === 2) return hi ? `दावे का मूल्यांकन कीजिए: दो सह-अभाज्य धनात्मक पूर्णांकों का लघुत्तम समापवर्त्य उनके गुणनफल के बराबर होता है।` : `ਦਾਅਵੇ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ: ਦੋ ਆਪਸੀ ਅਭਾਜ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਉਨ੍ਹਾਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।`;
      const digits = question.stem.match(/\d+/g) ?? [];
      return hi ? `दावे का मूल्यांकन कीजिए: यदि ${digits[0]} से ${digits[1]} विभाज्य है, तो उनका महत्तम समापवर्तक ${digits[1]} है।` : `ਦਾਅਵੇ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ: ਜੇ ${digits[1]} ਨੂੰ ${digits[0]} ਭਾਗ ਦਿੰਦਾ ਹੈ, ਤਾਂ ਉਨ੍ਹਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${digits[1]} ਹੈ।`;
    }
    case "NUM-QL-094": {
      const target = value(state, "target");
      return hi
        ? `समुच्चय A में ${arr(state, "setA").join(", ")} और समुच्चय B में ${arr(state, "setB").join(", ")} हैं। दोनों समुच्चयों के ${target === "HCF" ? "महत्तम समापवर्तक" : "लघुत्तम समापवर्त्य"} का सही युग्म चुनिए।`
        : `ਸਮੂਹ A ਵਿੱਚ ${arr(state, "setA").join(", ")} ਅਤੇ ਸਮੂਹ B ਵਿੱਚ ${arr(state, "setB").join(", ")} ਹਨ। ਦੋਵੇਂ ਸਮੂਹਾਂ ਦੇ ${target === "HCF" ? "ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ" : "ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ"} ਦਾ ਸਹੀ ਜੋੜਾ ਚੁਣੋ।`;
    }
    case "NUM-QL-095": {
      const numbers = [value(state, "a"), value(state, "b")];
      const claims = arr(state, "statementValues");
      return hi
        ? `${numbers[0]} और ${numbers[1]} के लिए कथन देखें: I. महत्तम समापवर्तक = ${claims[0]}; II. लघुत्तम समापवर्त्य = ${claims[1]}; III. महत्तम समापवर्तक × लघुत्तम समापवर्त्य = ${claims[2]}। कौन-से कथन सही हैं?`
        : `${numbers[0]} ਅਤੇ ${numbers[1]} ਲਈ ਕਥਨ ਵੇਖੋ: I. ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ = ${claims[0]}; II. ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ = ${claims[1]}; III. ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ × ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ = ${claims[2]}। ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?`;
    }
    case "NUM-QL-096": {
      const mode = Number(state.mode);
      const known = value(state, "known");
      const h = value(state, "hcf");
      const L = value(state, "lcm");
      const product = value(state, "product");
      const statementPairs = hi
        ? [
            [`दोनों पूर्णांकों का गुणनफल ${product} है।`, `उनका महत्तम समापवर्तक ${h} है।`],
            [`उनका महत्तम समापवर्तक ${h} है।`, `दोनों पूर्णांकों का गुणनफल ${product} है।`],
            [`उनका महत्तम समापवर्तक ${h} है।`, `उनका लघुत्तम समापवर्त्य ${L} है।`],
            [`उनका महत्तम समापवर्तक ${h} है।`, `अज्ञात पूर्णांक ${h} से विभाज्य है।`],
          ]
        : [
            [`ਦੋਵੇਂ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ${product} ਹੈ।`, `ਉਨ੍ਹਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${h} ਹੈ।`],
            [`ਉਨ੍ਹਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${h} ਹੈ।`, `ਦੋਵੇਂ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ${product} ਹੈ।`],
            [`ਉਨ੍ਹਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${h} ਹੈ।`, `ਉਨ੍ਹਾਂ ਦਾ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ${L} ਹੈ।`],
            [`ਉਨ੍ਹਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ${h} ਹੈ।`, `ਅਣਜਾਣ ਪੂਰਨ ਅੰਕ ${h} ਨਾਲ ਭਾਜਯ ਹੈ।`],
          ];
      const pair = statementPairs[mode]!;
      return hi
        ? `एक धनात्मक पूर्णांक a = ${known} है और b अज्ञात है। b ज्ञात करना है। कथन I: ${pair[0]} कथन II: ${pair[1]}`
        : `ਇੱਕ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ a = ${known} ਹੈ ਅਤੇ b ਅਣਜਾਣ ਹੈ। b ਕੱਢਣਾ ਹੈ। ਕਥਨ I: ${pair[0]} ਕਥਨ II: ${pair[1]}`;
    }
    case "NUM-QL-097": {
      const mode = value(state, "caseletMode");
      if (mode === "GROUPING") {
        return hi
          ? `एक कार्यशाला में ${arr(state, "lengths").join(", ")} सेमी लंबी तीन छड़ें हैं। इन्हें बिना शेष बराबर सबसे लंबे टुकड़ों में काटा जाता है। कुल कितने टुकड़े बनेंगे?`
          : `ਇੱਕ ਵਰਕਸ਼ਾਪ ਵਿੱਚ ${arr(state, "lengths").join(", ")} ਸੈਮੀ ਲੰਬੀਆਂ ਤਿੰਨ ਛੜਾਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਬਿਨਾਂ ਬਚਤ ਬਰਾਬਰ ਸਭ ਤੋਂ ਲੰਬੇ ਟੁਕੜਿਆਂ ਵਿੱਚ ਕੱਟਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ਟੁਕੜੇ ਬਣਣਗੇ?`;
      }
      return hi
        ? `तीन संकेतक दीपक ${arr(state, "intervals").join(", ")} सेकंड के अंतराल पर चमकते हैं और समय 0 पर साथ चमकते हैं। अगले ${value(state, "duration")} सेकंड में समय 0 के बाद वे कितनी बार साथ चमकेंगे?`
        : `ਤਿੰਨ ਸੰਕੇਤਕ ਬੱਤੀਆਂ ${arr(state, "intervals").join(", ")} ਸਕਿੰਟ ਦੇ ਅੰਤਰਾਲਾਂ ਤੇ ਚਮਕਦੀਆਂ ਹਨ ਅਤੇ ਸਮਾਂ 0 ਤੇ ਇਕੱਠੀਆਂ ਚਮਕਦੀਆਂ ਹਨ। ਅਗਲੇ ${value(state, "duration")} ਸਕਿੰਟਾਂ ਵਿੱਚ ਸਮਾਂ 0 ਤੋਂ ਬਾਅਦ ਉਹ ਕਿੰਨੀ ਵਾਰ ਇਕੱਠੀਆਂ ਚਮਕਣਗੀਆਂ?`;
    }
  }
}

function localizedExplanation(question: NumCp006PermanentQuestion, locale: NumCp006TranslatedLocale, localizedAnswer: string): NumCp006LocalizedExplanation {
  const hi = locale === "hi-IN";
  const qlNumber = Number(question.questionLanguageId.slice(-3));
  let coreConcept: string;
  let strategy: string;
  let steps: string[];
  let speed: string;
  let traps: [string, string, string];

  if (qlNumber <= 76) {
    coreConcept = hi ? "महत्तम समापवर्तक में समान अभाज्य घातों के न्यूनतम मान और लघुत्तम समापवर्त्य में आवश्यक अधिकतम मान लिए जाते हैं।" : "ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ ਵਿੱਚ ਸਾਂਝੇ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਘੱਟੋ-ਘੱਟ ਮੁੱਲ ਅਤੇ ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਵਿੱਚ ਲੋੜੀਂਦੇ ਵੱਧ ਤੋਂ ਵੱਧ ਮੁੱਲ ਲਏ ਜਾਂਦੇ ਹਨ।";
    strategy = hi ? "दिए गए संबंध को पहचानकर प्रत्यक्ष नियम, अभाज्य घात या यूक्लिड विधि का उपयोग कीजिए।" : "ਦਿੱਤੇ ਸੰਬੰਧ ਨੂੰ ਪਛਾਣ ਕੇ ਸਿੱਧਾ ਨਿਯਮ, ਅਭਾਜ ਘਾਤ ਜਾਂ ਯੂਕਲਿਡ ਵਿਧੀ ਵਰਤੋ।";
    steps = hi ? [`प्रश्न में माँगा गया मान ध्यान से पहचानें।`, `सभी दिए गए पूर्णांकों पर नियम लागू करने से मान ${localizedAnswer} मिलता है।`] : [`ਸਵਾਲ ਵਿੱਚ ਮੰਗਿਆ ਮੁੱਲ ਧਿਆਨ ਨਾਲ ਪਛਾਣੋ।`, `ਸਾਰੇ ਦਿੱਤੇ ਪੂਰਨ ਅੰਕਾਂ ਤੇ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ਮੁੱਲ ${localizedAnswer} ਮਿਲਦਾ ਹੈ।`];
    speed = hi ? "यदि एक संख्या दूसरी को पूरा भाग देती है या संख्याएँ सह-अभाज्य हैं, तो विशेष नियम सीधे लगाइए।" : "ਜੇ ਇੱਕ ਸੰਖਿਆ ਦੂਜੀ ਨੂੰ ਪੂਰਾ ਭਾਗ ਦਿੰਦੀ ਹੈ ਜਾਂ ਸੰਖਿਆਵਾਂ ਆਪਸੀ ਅਭਾਜ ਹਨ, ਤਾਂ ਖਾਸ ਨਿਯਮ ਸਿੱਧਾ ਲਗਾਓ।";
    traps = hi ? ["महत्तम समापवर्तक और लघुत्तम समापवर्त्य को न उलटें।", "हर दी गई संख्या को जाँचें।", "सिर्फ छोटी या बड़ी संख्या देखकर उत्तर न चुनें।"] : ["ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ ਅਤੇ ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਨੂੰ ਨਾ ਉਲਟੋ।", "ਹਰ ਦਿੱਤੀ ਸੰਖਿਆ ਜਾਂਚੋ।", "ਕੇਵਲ ਛੋਟੀ ਜਾਂ ਵੱਡੀ ਸੰਖਿਆ ਵੇਖ ਕੇ ਉੱਤਰ ਨਾ ਚੁਣੋ।"];
  } else if (qlNumber <= 79) {
    coreConcept = hi ? "दो धनात्मक पूर्णांकों के लिए गुणनफल = महत्तम समापवर्तक × लघुत्तम समापवर्त्य होता है और घटाए गए गुणक सह-अभाज्य होते हैं।" : "ਦੋ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਲਈ ਗੁਣਨਫਲ = ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ × ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਹੁੰਦਾ ਹੈ ਅਤੇ ਘਟਾਏ ਗੁਣਕ ਆਪਸੀ ਅਭਾਜ ਹੁੰਦੇ ਹਨ।";
    strategy = hi ? "दिए गए महत्तम समापवर्तक और लघुत्तम समापवर्त्य से लुप्त संख्या, मान्य युग्म या युग्मों की संख्या निकालें।" : "ਦਿੱਤੇ ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ ਅਤੇ ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਤੋਂ ਗੁੰਮ ਸੰਖਿਆ, ਸਹੀ ਜੋੜਾ ਜਾਂ ਜੋੜਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।";
    steps = hi ? ["पहले गुणनफल संबंध लिखें।", `सभी सह-अभाज्यता और विभाज्यता शर्तें जाँचने पर उत्तर ${localizedAnswer} है।`] : ["ਪਹਿਲਾਂ ਗੁਣਨਫਲ ਸੰਬੰਧ ਲਿਖੋ।", `ਸਾਰੀਆਂ ਆਪਸੀ ਅਭਾਜਤਾ ਅਤੇ ਭਾਜਯਤਾ ਸ਼ਰਤਾਂ ਜਾਂਚਣ ਤੇ ਉੱਤਰ ${localizedAnswer} ਹੈ।`];
    speed = hi ? "पहले गुणनफल की जाँच से गलत विकल्प हटाएँ, फिर महत्तम समापवर्तक सत्यापित करें।" : "ਪਹਿਲਾਂ ਗੁਣਨਫਲ ਦੀ ਜਾਂਚ ਨਾਲ ਗਲਤ ਚੋਣਾਂ ਹਟਾਓ, ਫਿਰ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਪੱਕਾ ਕਰੋ।";
    traps = hi ? ["यह गुणनफल संबंध केवल दो संख्याओं के लिए लगाएँ।", "घटाए गए गुणक सह-अभाज्य होने चाहिए।", "क्रमित और अक्रमित युग्मों में अंतर रखें।"] : ["ਇਹ ਗੁਣਨਫਲ ਸੰਬੰਧ ਕੇਵਲ ਦੋ ਸੰਖਿਆਵਾਂ ਲਈ ਲਗਾਓ।", "ਘਟਾਏ ਗੁਣਕ ਆਪਸੀ ਅਭਾਜ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।", "ਕ੍ਰਮ ਵਾਲੇ ਅਤੇ ਬਿਨਾਂ ਕ੍ਰਮ ਵਾਲੇ ਜੋੜਿਆਂ ਵਿੱਚ ਫਰਕ ਰੱਖੋ।"];
  } else if (qlNumber <= 83) {
    coreConcept = hi ? "सबसे बड़ा समान भाग महत्तम समापवर्तक से और पहली समान पुनरावृत्ति या साझा गुणज लघुत्तम समापवर्त्य से मिलता है।" : "ਸਭ ਤੋਂ ਵੱਡਾ ਬਰਾਬਰ ਹਿੱਸਾ ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ ਨਾਲ ਅਤੇ ਪਹਿਲੀ ਸਾਂਝੀ ਦੁਹਰਾਈ ਜਾਂ ਸਾਂਝਾ ਗੁਣਜ ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਨਾਲ ਮਿਲਦਾ ਹੈ।";
    strategy = hi ? "प्रश्न के संकेत शब्द पहचानें और सीमा हो तो लघुत्तम समापवर्त्य के उचित गुणज तक जाएँ।" : "ਸਵਾਲ ਦੇ ਸੰਕੇਤਕ ਸ਼ਬਦ ਪਛਾਣੋ ਅਤੇ ਹੱਦ ਹੋਵੇ ਤਾਂ ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਦੇ ਢੁੱਕਵੇਂ ਗੁਣਜ ਤੱਕ ਜਾਓ।";
    steps = hi ? ["समान भाग या समान समय का मूल मान निकालें।", `दी गई सीमा या इकाई लागू करने पर उत्तर ${localizedAnswer} है।`] : ["ਬਰਾਬਰ ਹਿੱਸੇ ਜਾਂ ਸਾਂਝੇ ਸਮੇਂ ਦਾ ਮੂਲ ਮੁੱਲ ਕੱਢੋ।", `ਦਿੱਤੀ ਹੱਦ ਜਾਂ ਇਕਾਈ ਲਗਾਉਣ ਤੇ ਉੱਤਰ ${localizedAnswer} ਹੈ।`];
    speed = hi ? "‘सबसे बड़ा बराबर’ के लिए महत्तम समापवर्तक और ‘अगली बार साथ’ के लिए लघुत्तम समापवर्त्य लें।" : "‘ਸਭ ਤੋਂ ਵੱਡਾ ਬਰਾਬਰ’ ਲਈ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਅਤੇ ‘ਅਗਲੀ ਵਾਰ ਇਕੱਠੇ’ ਲਈ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਲਵੋ।";
    traps = hi ? ["इकाई न भूलें।", "वर्तमान समय 0 को अगली घटना में न गिनें।", "सीमा के लिए ऊपर या नीचे सही गुणज चुनें।"] : ["ਇਕਾਈ ਨਾ ਭੁੱਲੋ।", "ਮੌਜੂਦਾ ਸਮਾਂ 0 ਨੂੰ ਅਗਲੀ ਘਟਨਾ ਵਿੱਚ ਨਾ ਗਿਣੋ।", "ਹੱਦ ਲਈ ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਸਹੀ ਗੁਣਜ ਚੁਣੋ।"];
  } else if (qlNumber <= 90) {
    coreConcept = hi ? "शेष वाली समस्याओं में उपयुक्त शेष घटाने पर समायोजित संख्याएँ किसी साझा भाजक या साझा गुणज से जुड़ती हैं।" : "ਬਾਕੀ ਵਾਲੀਆਂ ਸਮੱਸਿਆਵਾਂ ਵਿੱਚ ਢੁੱਕਵਾਂ ਬਾਕੀ ਘਟਾਉਣ ਤੇ ਸਮਾਯੋਜਿਤ ਸੰਖਿਆਵਾਂ ਕਿਸੇ ਸਾਂਝੇ ਭਾਜਕ ਜਾਂ ਸਾਂਝੇ ਗੁਣਜ ਨਾਲ ਜੁੜਦੀਆਂ ਹਨ।";
    strategy = hi ? "समान शेष में अंतर लें; निर्दिष्ट शेष में प्रत्येक संख्या से उसका शेष घटाएँ; साझा विभाज्यता में लघुत्तम समापवर्त्य लें।" : "ਇੱਕੋ ਬਾਕੀ ਵਿੱਚ ਅੰਤਰ ਲਵੋ; ਦਿੱਤੇ ਬਾਕੀ ਵਿੱਚ ਹਰ ਸੰਖਿਆ ਵਿੱਚੋਂ ਉਸਦਾ ਬਾਕੀ ਘਟਾਓ; ਸਾਂਝੀ ਭਾਜਯਤਾ ਵਿੱਚ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਲਵੋ।";
    steps = hi ? ["प्रश्न को समायोजित संख्या या गुणज के रूप में लिखें।", `महत्तम समापवर्तक या लघुत्तम समापवर्त्य लगाने पर उत्तर ${localizedAnswer} मिलता है।`] : ["ਸਵਾਲ ਨੂੰ ਸਮਾਯੋਜਿਤ ਸੰਖਿਆ ਜਾਂ ਗੁਣਜ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।", `ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਜਾਂ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਲਗਾਉਣ ਤੇ ਉੱਤਰ ${localizedAnswer} ਮਿਲਦਾ ਹੈ।`];
    speed = hi ? "‘समान शेष’ देखकर अंतर का महत्तम समापवर्तक और ‘सभी से विभाज्य’ देखकर लघुत्तम समापवर्त्य सोचें।" : "‘ਇੱਕੋ ਬਾਕੀ’ ਵੇਖ ਕੇ ਅੰਤਰਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਅਤੇ ‘ਸਭ ਨਾਲ ਭਾਜਯ’ ਵੇਖ ਕੇ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਸੋਚੋ।";
    traps = hi ? ["सही शेष सही संख्या से घटाएँ।", "जोड़ और घटाव के प्रश्नों को न उलटें।", "बंद अंतराल में दोनों सिरों की जाँच करें।"] : ["ਸਹੀ ਬਾਕੀ ਸਹੀ ਸੰਖਿਆ ਵਿੱਚੋਂ ਘਟਾਓ।", "ਜੋੜ ਅਤੇ ਘਟਾਉ ਵਾਲੇ ਸਵਾਲ ਨਾ ਉਲਟੋ।", "ਬੰਦ ਅੰਤਰਾਲ ਵਿੱਚ ਦੋਵੇਂ ਸਿਰਿਆਂ ਦੀ ਜਾਂਚ ਕਰੋ।"];
  } else if (qlNumber <= 92) {
    coreConcept = hi ? "भिन्नों में महत्तम समापवर्तक के लिए अंशों का महत्तम समापवर्तक और हरों का लघुत्तम समापवर्त्य लिया जाता है; लघुत्तम समापवर्त्य में इसका उलटा होता है।" : "ਭਿੰਨਾਂ ਵਿੱਚ ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ ਲਈ ਅੰਸ਼ਾਂ ਦਾ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਅਤੇ ਹਰਾਂ ਦਾ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਲਿਆ ਜਾਂਦਾ ਹੈ; ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਵਿੱਚ ਇਸਦਾ ਉਲਟ ਹੁੰਦਾ ਹੈ।";
    strategy = hi ? "दशमलवों को एक समान सटीक इकाई में बदलें और भिन्नों को सरल रूप में लिखें।" : "ਦਸ਼ਮਲਵਾਂ ਨੂੰ ਇੱਕੋ ਸਹੀ ਇਕਾਈ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਭਿੰਨਾਂ ਨੂੰ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।";
    steps = hi ? ["सभी मानों का एक समान रूप बनाइए।", `अंश और हर के नियम लगाने पर उत्तर ${localizedAnswer} है।`] : ["ਸਾਰੇ ਮੁੱਲਾਂ ਦਾ ਇੱਕੋ ਰੂਪ ਬਣਾਓ।", `ਅੰਸ਼ ਅਤੇ ਹਰ ਦੇ ਨਿਯਮ ਲਗਾਉਣ ਤੇ ਉੱਤਰ ${localizedAnswer} ਹੈ।`];
    speed = hi ? "दशमलव हटाने के लिए सभी मानों को एक ही 10 की घात से गुणा करें।" : "ਦਸ਼ਮਲਵ ਹਟਾਉਣ ਲਈ ਸਾਰੇ ਮੁੱਲਾਂ ਨੂੰ ਇੱਕੋ 10 ਦੀ ਘਾਤ ਨਾਲ ਗੁਣਾ ਕਰੋ।";
    traps = hi ? ["सभी दशमलवों के लिए एक ही पैमाना लें।", "भिन्न पहले सरल करें।", "अंश और हर के महत्तम/लघुत्तम नियम न उलटें।"] : ["ਸਾਰੇ ਦਸ਼ਮਲਵਾਂ ਲਈ ਇੱਕੋ ਪੈਮਾਨਾ ਲਵੋ।", "ਭਿੰਨਾਂ ਨੂੰ ਪਹਿਲਾਂ ਸਰਲ ਕਰੋ।", "ਅੰਸ਼ ਅਤੇ ਹਰ ਦੇ ਮਹਾਨਤਮ/ਲਘੁਤਮ ਨਿਯਮ ਨਾ ਉਲਟੋ।"];
  } else {
    coreConcept = hi ? "तर्क-आधारित प्रश्नों में हर कथन, तुलना या पर्याप्तता को सटीक महत्तम समापवर्तक और लघुत्तम समापवर्त्य नियम से अलग-अलग जाँचा जाता है।" : "ਤਰਕ-ਅਧਾਰਿਤ ਸਵਾਲਾਂ ਵਿੱਚ ਹਰ ਕਥਨ, ਤੁਲਨਾ ਜਾਂ ਕਾਫ਼ੀਪਣ ਨੂੰ ਸਹੀ ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ ਅਤੇ ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ ਨਿਯਮ ਨਾਲ ਵੱਖ-ਵੱਖ ਜਾਂਚਿਆ ਜਾਂਦਾ ਹੈ।";
    strategy = hi ? "पहले आवश्यक मान निकालें, फिर विकल्प, कथन या दोनों सूचनाओं की पर्याप्तता जाँचें।" : "ਪਹਿਲਾਂ ਲੋੜੀਂਦੇ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਚੋਣਾਂ, ਕਥਨਾਂ ਜਾਂ ਦੋਵੇਂ ਜਾਣਕਾਰੀਆਂ ਦੀ ਕਾਫ਼ੀਪਣ ਜਾਂਚੋ।";
    steps = hi ? ["दिए गए सभी मानों पर सटीक नियम लगाएँ।", `सभी शर्तों की जाँच के बाद सही निष्कर्ष ${localizedAnswer} है।`] : ["ਦਿੱਤੇ ਸਾਰੇ ਮੁੱਲਾਂ ਤੇ ਸਹੀ ਨਿਯਮ ਲਗਾਓ।", `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਜਾਂਚਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਨਤੀਜਾ ${localizedAnswer} ਹੈ।`];
    speed = hi ? "एक बार महत्तम समापवर्तक और लघुत्तम समापवर्त्य निकालकर सभी कथनों को उन्हीं मानों से जाँचें।" : "ਇੱਕ ਵਾਰ ਮਹਾਨਤਮ ਸਾਂਝਾ ਭਾਜਕ ਅਤੇ ਲਘੁਤਮ ਸਾਂਝਾ ਗੁਣਜ ਕੱਢ ਕੇ ਸਾਰੇ ਕਥਨ ਉਨ੍ਹਾਂ ਹੀ ਮੁੱਲਾਂ ਨਾਲ ਜਾਂਚੋ।";
    traps = hi ? ["दो-संख्या गुणनफल नियम को तीन संख्याओं पर न फैलाएँ।", "पर्याप्तता में केवल एक अद्वितीय मान स्वीकारें।", "केसलेट में अंतिम प्रश्न क्या पूछता है, यह दोबारा देखें।"] : ["ਦੋ-ਸੰਖਿਆ ਗੁਣਨਫਲ ਨਿਯਮ ਨੂੰ ਤਿੰਨ ਸੰਖਿਆਵਾਂ ਤੇ ਨਾ ਫੈਲਾਓ।", "ਕਾਫ਼ੀਪਣ ਵਿੱਚ ਕੇਵਲ ਇੱਕ ਵਿਲੱਖਣ ਮੁੱਲ ਮੰਨੋ।", "ਕੇਸਲੈਟ ਵਿੱਚ ਅੰਤਿਮ ਸਵਾਲ ਕੀ ਪੁੱਛਦਾ ਹੈ, ਦੁਬਾਰਾ ਵੇਖੋ।"];
  }

  return Object.freeze({
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze(steps),
    examSpeedMethod: speed,
    commonTraps: Object.freeze(traps),
    finalAnswer: hi ? `अंतिम उत्तर: ${localizedAnswer}` : `ਅੰਤਿਮ ਉੱਤਰ: ${localizedAnswer}`,
  });
}

export function generateNumCp006LocalizedQuestion(input: NumCp006LocalizedRuntimeInput): NumCp006LocalizedQuestion {
  const english = runNumCp006PermanentPipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });
  const language = input.locale === "hi-IN" ? "hi" : "pa";
  const options: readonly NumCp006LocalizedOption[] = Object.freeze(english.options.map((option) => Object.freeze({
    ...option,
    value: translateNumCp006OptionValue(option.value, input.locale),
    analysis: option.isCorrect
      ? input.locale === "hi-IN" ? "यह विकल्प सभी दी गई शर्तों को ठीक-ठीक पूरा करता है।" : "ਇਹ ਚੋਣ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਪੂਰਾ ਕਰਦੀ ਹੈ।"
      : input.locale === "hi-IN" ? "यह विकल्प किसी आवश्यक महत्तम समापवर्तक, लघुत्तम समापवर्त्य, सीमा या शेष की शर्त को तोड़ता है।" : "ਇਹ ਚੋਣ ਕਿਸੇ ਲੋੜੀਂਦੀ ਮਹਾਨਤਮ ਸਾਂਝੇ ਭਾਜਕ, ਲਘੁਤਮ ਸਾਂਝੇ ਗੁਣਜ, ਹੱਦ ਜਾਂ ਬਾਕੀ ਦੀ ਸ਼ਰਤ ਨੂੰ ਤੋੜਦੀ ਹੈ।",
  })));
  const canonicalAnswer = translateNumCp006OptionValue(english.canonicalAnswer, input.locale);
  if (options[english.correctIndex]?.value !== canonicalAnswer) {
    throw new Error(`${english.questionLanguageId}/${english.seed}/${input.locale}: localized answer/index mismatch`);
  }

  return Object.freeze({
    ...english,
    locale: input.locale,
    language,
    stem: localizedStem(english, input.locale),
    options,
    canonicalAnswer,
    verifierAnswer: translateNumCp006OptionValue(english.verifierAnswer, input.locale),
    explanation: localizedExplanation(english, input.locale, canonicalAnswer),
    traceability: Object.freeze({ ...english.traceability, language }),
    localization: Object.freeze({
      localizationVersion: "num-cp006-hi-pa-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: english.questionId,
      canonicalAnswer: english.canonicalAnswer,
      canonicalVerifierAnswer: english.verifierAnswer,
      locale: input.locale,
      language,
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      lifecycleLocked: true,
    }),
  });
}
