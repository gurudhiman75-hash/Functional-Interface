import { generateNumCp010Permanent, type NumCp010PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp010PermanentQlId } from "../permanent-allocation.ts";
import type {
  NumCp010LocalizedLanguage,
  NumCp010LocalizedLocale,
  NumCp010LocalizedPackage,
} from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type LocalizedContent = Readonly<{
  stem: string;
  coreConcept: string;
  strategy: string;
  steps: readonly string[];
  finalAnswer: string;
}>;

function localeFor(language: NumCp010LocalizedLanguage): NumCp010LocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function stateOf(q: NumCp010PermanentPackage): State {
  return q.hiddenState as State;
}

function n(s: State, key: string): number {
  const value = s[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Expected numeric state field ${key}`);
  return value;
}

function b(s: State, key: string): boolean {
  const value = s[key];
  if (typeof value !== "boolean") throw new Error(`Expected boolean state field ${key}`);
  return value;
}

function t(s: State, key: string): string {
  const value = s[key];
  if (typeof value !== "string") throw new Error(`Expected string state field ${key}`);
  return value;
}

function ns(s: State, key: string): number[] {
  const value = s[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number")) throw new Error(`Expected numeric-array state field ${key}`);
  return [...value] as number[];
}

function fmt(value: number): string {
  return value.toLocaleString("en-IN");
}

function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function choose(language: NumCp010LocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function localizedMultiplicity(value: string, language: NumCp010LocalizedLanguage): string {
  const map: Readonly<Record<string, readonly [string, string]>> = {
    "No number is possible": ["कोई संख्या संभव नहीं है", "ਕੋਈ ਸੰਖਿਆ ਸੰਭਵ ਨਹੀਂ ਹੈ"],
    "Exactly one number is possible": ["ठीक एक संख्या संभव है", "ਠੀਕ ਇੱਕ ਸੰਖਿਆ ਸੰਭਵ ਹੈ"],
    "More than one number is possible": ["एक से अधिक संख्याएँ संभव हैं", "ਇੱਕ ਤੋਂ ਵੱਧ ਸੰਖਿਆਵਾਂ ਸੰਭਵ ਹਨ"],
    "Every two-digit number is possible": ["हर दो-अंकीय संख्या संभव है", "ਹਰ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਸੰਭਵ ਹੈ"],
  };
  const row = map[value];
  if (!row) return value;
  return language === "hi" ? row[0] : row[1];
}

function content(q: NumCp010PermanentPackage, language: NumCp010LocalizedLanguage): LocalizedContent {
  const s = stateOf(q);
  const L = (hi: string, pa: string) => choose(language, hi, pa);
  const answer = q.canonicalAnswer;

  switch (q.temporaryPrototypeId) {
    case "NUM-CP010-PROT-001": {
      const numberText = t(s, "numberText");
      const target = n(s, "target");
      const position = n(s, "position");
      const positionalValue = 10 ** position;
      return {
        stem: L(`${numberText} में अंक ${target} का स्थानीय मान क्या है?`, `${numberText} ਵਿੱਚ ਅੰਕ ${target} ਦਾ ਸਥਾਨਕ ਮੁੱਲ ਕੀ ਹੈ?`),
        coreConcept: L("किसी अंक का स्थानीय मान उस अंक और उसके स्थान के मान का गुणनफल होता है।", "ਕਿਸੇ ਅੰਕ ਦਾ ਸਥਾਨਕ ਮੁੱਲ ਉਸ ਅੰਕ ਅਤੇ ਉਸਦੇ ਸਥਾਨ ਦੇ ਮੁੱਲ ਦਾ ਗੁਣਨਫਲ ਹੁੰਦਾ ਹੈ।"),
        strategy: L(`अंक ${target} इकाई स्थान से बाईं ओर ${position} स्थान पर है, इसलिए स्थान का मान 10^${position} है।`, `ਅੰਕ ${target} ਇਕਾਈ ਸਥਾਨ ਤੋਂ ਖੱਬੇ ${position} ਸਥਾਨ ਤੇ ਹੈ, ਇਸ ਲਈ ਸਥਾਨ ਦਾ ਮੁੱਲ 10^${position} ਹੈ।`),
        steps: [L(`स्थान का मान = ${positionalValue}.`, `ਸਥਾਨ ਦਾ ਮੁੱਲ = ${positionalValue}.`), L(`${target} का स्थानीय मान = ${target} × ${positionalValue} = ${answer}.`, `${target} ਦਾ ਸਥਾਨਕ ਮੁੱਲ = ${target} × ${positionalValue} = ${answer}.`)],
        finalAnswer: L(`उत्तर ${answer} है।`, `ਉੱਤਰ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-002": {
      const pattern = t(s, "pattern");
      const total = n(s, "total");
      const knownSum = n(s, "knownSum");
      return {
        stem: L(`पाँच-अंकीय संख्या ${pattern} के अंकों का योग ${total} है। x का मान ज्ञात कीजिए।`, `ਪੰਜ-ਅੰਕੀ ਸੰਖਿਆ ${pattern} ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${total} ਹੈ। x ਦਾ ਮੁੱਲ ਕੱਢੋ।`),
        coreConcept: L("अंकों का योग निकालते समय प्रत्येक अंक को एक बार जोड़ा जाता है।", "ਅੰਕਾਂ ਦਾ ਜੋੜ ਕੱਢਦੇ ਸਮੇਂ ਹਰ ਅੰਕ ਨੂੰ ਇੱਕ ਵਾਰ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।"),
        strategy: L("पहले दिखाई दे रहे अंकों को जोड़ें, फिर दिए गए कुल योग से घटाएँ।", "ਪਹਿਲਾਂ ਦਿੱਸ ਰਹੇ ਅੰਕ ਜੋੜੋ, ਫਿਰ ਦਿੱਤੇ ਕੁੱਲ ਜੋੜ ਵਿਚੋਂ ਘਟਾਓ।"),
        steps: [L(`दिखाई दे रहे अंकों का योग = ${knownSum}.`, `ਦਿੱਸ ਰਹੇ ਅੰਕਾਂ ਦਾ ਜੋੜ = ${knownSum}.`), L(`अतः x = ${total} − ${knownSum} = ${answer}.`, `ਇਸ ਲਈ x = ${total} − ${knownSum} = ${answer}.`)],
        finalAnswer: L(`x = ${answer}.`, `x = ${answer}.`),
      };
    }
    case "NUM-CP010-PROT-003": {
      const a = n(s, "a"); const bb = n(s, "b"); const sum = n(s, "sum"); const difference = n(s, "difference");
      return {
        stem: L(`एक दो-अंकीय संख्या अपने अंकों को उलटने पर बनी संख्या से ${difference} अधिक है। उसके अंकों का योग ${sum} है। मूल संख्या ज्ञात कीजिए।`, `ਇੱਕ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਆਪਣੇ ਅੰਕ ਉਲਟਣ ਨਾਲ ਬਣੀ ਸੰਖਿਆ ਤੋਂ ${difference} ਵੱਧ ਹੈ। ਉਸਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ। ਮੂਲ ਸੰਖਿਆ ਕੱਢੋ।`),
        coreConcept: L("यदि दहाई का अंक a और इकाई का अंक b हो, तो संख्या 10a + b और उलटी संख्या 10b + a होती है।", "ਜੇ ਦਹਾਈ ਦਾ ਅੰਕ a ਅਤੇ ਇਕਾਈ ਦਾ ਅੰਕ b ਹੋਵੇ, ਤਾਂ ਸੰਖਿਆ 10a + b ਅਤੇ ਉਲਟੀ ਸੰਖਿਆ 10b + a ਹੁੰਦੀ ਹੈ।"),
        strategy: L("उलटने से प्राप्त अंतर और अंकों के योग की दोनों समीकरणों को साथ हल करें।", "ਉਲਟਣ ਨਾਲ ਮਿਲੇ ਅੰਤਰ ਅਤੇ ਅੰਕਾਂ ਦੇ ਜੋੜ ਵਾਲੀਆਂ ਦੋਵੇਂ ਸਮੀਕਰਨਾਂ ਇਕੱਠੀਆਂ ਹੱਲ ਕਰੋ।"),
        steps: [L(`मूल − उलटी = 9(a − b) = ${difference}, इसलिए a − b = ${difference / 9}.`, `ਮੂਲ − ਉਲਟੀ = 9(a − b) = ${difference}, ਇਸ ਲਈ a − b = ${difference / 9}.`), L(`a + b = ${sum}. दोनों समीकरणों से a = ${a}, b = ${bb}.`, `a + b = ${sum}. ਦੋਵੇਂ ਸਮੀਕਰਨਾਂ ਤੋਂ a = ${a}, b = ${bb}.`), L(`मूल संख्या = 10 × ${a} + ${bb} = ${answer}.`, `ਮੂਲ ਸੰਖਿਆ = 10 × ${a} + ${bb} = ${answer}.`)],
        finalAnswer: L(`मूल संख्या ${answer} है।`, `ਮੂਲ ਸੰਖਿਆ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-004": {
      const a = n(s, "a"); const mid = n(s, "b"); const c = n(s, "c"); const outerSum = n(s, "outerSum"); const difference = n(s, "difference");
      return {
        stem: L(`एक तीन-अंकीय संख्या का दहाई अंक ${mid} है। यह अपने अंकों को उलटने पर बनी संख्या से ${difference} अधिक है और सैकड़ा तथा इकाई अंकों का योग ${outerSum} है। संख्या ज्ञात कीजिए।`, `ਇੱਕ ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ਦਾ ਦਹਾਈ ਅੰਕ ${mid} ਹੈ। ਇਹ ਆਪਣੇ ਅੰਕ ਉਲਟਣ ਨਾਲ ਬਣੀ ਸੰਖਿਆ ਤੋਂ ${difference} ਵੱਧ ਹੈ ਅਤੇ ਸੈਂਕੜੇ ਤੇ ਇਕਾਈ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${outerSum} ਹੈ। ਸੰਖਿਆ ਕੱਢੋ।`),
        coreConcept: L("तीन-अंकीय abc को उलटने पर cba मिलता है; बीच का अंक उसी स्थान पर रहता है।", "ਤਿੰਨ-ਅੰਕੀ abc ਨੂੰ ਉਲਟਣ ਤੇ cba ਮਿਲਦਾ ਹੈ; ਵਿਚਕਾਰਲਾ ਅੰਕ ਉਸੇ ਸਥਾਨ ਤੇ ਰਹਿੰਦਾ ਹੈ।"),
        strategy: L("उलटने का अंतर बाहरी अंकों का अंतर देता है और दिया गया योग उन्हीं दोनों अंकों को निश्चित करता है।", "ਉਲਟਣ ਦਾ ਅੰਤਰ ਬਾਹਰੀ ਅੰਕਾਂ ਦਾ ਅੰਤਰ ਦਿੰਦਾ ਹੈ ਅਤੇ ਦਿੱਤਾ ਜੋੜ ਉਹਨਾਂ ਦੋਵੇਂ ਅੰਕਾਂ ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।"),
        steps: [L(`मूल − उलटी = 99(a − c) = ${difference}, इसलिए a − c = ${difference / 99}.`, `ਮੂਲ − ਉਲਟੀ = 99(a − c) = ${difference}, ਇਸ ਲਈ a − c = ${difference / 99}.`), L(`a + c = ${outerSum}; अतः a = ${a}, c = ${c}.`, `a + c = ${outerSum}; ਇਸ ਲਈ a = ${a}, c = ${c}.`), L(`बीच में ${mid} रखने पर संख्या ${answer} है।`, `ਵਿਚਕਾਰ ${mid} ਰੱਖਣ ਤੇ ਸੰਖਿਆ ${answer} ਹੈ।`)],
        finalAnswer: L(`उत्तर ${answer} है।`, `ਉੱਤਰ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-005": {
      const addend = n(s, "addend"); const first = n(s, "first"); const result = n(s, "result"); const x = n(s, "correct");
      return {
        stem: L(`नीचे दिए जोड़ में x एक अंक है। x ज्ञात कीजिए।\n\n  ${Math.floor(first / 10)}x\n+ ${addend}\n-----\n  ${result}`, `ਹੇਠਾਂ ਦਿੱਤੇ ਜੋੜ ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। x ਕੱਢੋ।\n\n  ${Math.floor(first / 10)}x\n+ ${addend}\n-----\n  ${result}`),
        coreConcept: L("स्तंभ जोड़ में इकाई वाला स्तंभ लुप्त इकाई अंक और कैरी तय करता है।", "ਕਾਲਮ ਜੋੜ ਵਿੱਚ ਇਕਾਈ ਵਾਲਾ ਕਾਲਮ ਗੁੰਮ ਇਕਾਈ ਅੰਕ ਅਤੇ ਕੈਰੀ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।"),
        strategy: L("इकाई के स्तंभ से शुरू करें और फिर पूरे जोड़ से जाँच करें।", "ਇਕਾਈ ਦੇ ਕਾਲਮ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਫਿਰ ਪੂਰੇ ਜੋੜ ਨਾਲ ਜਾਂਚ ਕਰੋ।"),
        steps: [L(`इकाई स्तंभ से x = ${x} मिलता है।`, `ਇਕਾਈ ਕਾਲਮ ਤੋਂ x = ${x} ਮਿਲਦਾ ਹੈ।`), L(`जाँच: ${first} + ${addend} = ${result}.`, `ਜਾਂਚ: ${first} + ${addend} = ${result}.`)],
        finalAnswer: `x = ${answer}.`,
      };
    }
    case "NUM-CP010-PROT-006": {
      const minuend = n(s, "minuend"); const subtrahend = n(s, "subtrahend"); const result = n(s, "result"); const x = n(s, "correct"); const subUnits = subtrahend % 10;
      return {
        stem: L(`नीचे दिए घटाव में x एक अंक है। x ज्ञात कीजिए।\n\n  ${Math.floor(minuend / 10)}x\n- ${subtrahend}\n-----\n  ${String(result).padStart(2, "0")}`, `ਹੇਠਾਂ ਦਿੱਤੀ ਘਟਾਉ ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। x ਕੱਢੋ।\n\n  ${Math.floor(minuend / 10)}x\n- ${subtrahend}\n-----\n  ${String(result).padStart(2, "0")}`),
        coreConcept: L("यदि ऊपर का इकाई अंक छोटा हो, तो दहाई से 1 उधार लेकर इकाई में 10 जोड़ा जाता है।", "ਜੇ ਉੱਪਰਲਾ ਇਕਾਈ ਅੰਕ ਛੋਟਾ ਹੋਵੇ, ਤਾਂ ਦਹਾਈ ਤੋਂ 1 ਉਧਾਰ ਲੈ ਕੇ ਇਕਾਈ ਵਿੱਚ 10 ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।"),
        strategy: L("उधार लेने के बाद इकाई वाले स्तंभ से x निकालें और पूरे घटाव से जाँच करें।", "ਉਧਾਰ ਲੈਣ ਤੋਂ ਬਾਅਦ ਇਕਾਈ ਵਾਲੇ ਕਾਲਮ ਤੋਂ x ਕੱਢੋ ਅਤੇ ਪੂਰੀ ਘਟਾਉ ਨਾਲ ਜਾਂਚ ਕਰੋ।"),
        steps: [L(`इकाई स्तंभ में 10 + x − ${subUnits} = ${result % 10}.`, `ਇਕਾਈ ਕਾਲਮ ਵਿੱਚ 10 + x − ${subUnits} = ${result % 10}.`), L(`इससे x = ${x}. जाँच: ${minuend} − ${subtrahend} = ${result}.`, `ਇਸ ਤੋਂ x = ${x}. ਜਾਂਚ: ${minuend} − ${subtrahend} = ${result}.`)],
        finalAnswer: `x = ${answer}.`,
      };
    }
    case "NUM-CP010-PROT-007": {
      const a = n(s, "a"); const mid = n(s, "b"); const digitSum = n(s, "digitSum");
      return {
        stem: L(`एक चार-अंकीय पलिंड्रोम ${a} से शुरू होता है और उसके सभी अंकों का योग ${digitSum} है। पलिंड्रोम ज्ञात कीजिए।`, `ਇੱਕ ਚਾਰ-ਅੰਕੀ ਪੈਲਿੰਡਰੋਮ ${a} ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸਦੇ ਸਾਰੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${digitSum} ਹੈ। ਪੈਲਿੰਡਰੋਮ ਕੱਢੋ।`),
        coreConcept: L("चार-अंकीय पलिंड्रोम abba के रूप में होता है।", "ਚਾਰ-ਅੰਕੀ ਪੈਲਿੰਡਰੋਮ abba ਦੇ ਰੂਪ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।"),
        strategy: L("पहले पलिंड्रोम की सममिति लगाएँ, फिर अंकों के योग से बीच का दोहराया अंक निकालें।", "ਪਹਿਲਾਂ ਪੈਲਿੰਡਰੋਮ ਦੀ ਸਮਮਿਤੀ ਲਗਾਓ, ਫਿਰ ਅੰਕਾਂ ਦੇ ਜੋੜ ਤੋਂ ਵਿਚਕਾਰਲਾ ਦੁਹਰਾਇਆ ਅੰਕ ਕੱਢੋ।"),
        steps: [L(`2 × ${a} + 2b = ${digitSum}.`, `2 × ${a} + 2b = ${digitSum}.`), L(`इससे b = ${mid}.`, `ਇਸ ਤੋਂ b = ${mid}.`), L(`अतः पलिंड्रोम ${answer} है।`, `ਇਸ ਲਈ ਪੈਲਿੰਡਰੋਮ ${answer} ਹੈ।`)],
        finalAnswer: L(`उत्तर ${answer} है।`, `ਉੱਤਰ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-008":
    case "NUM-CP010-PROT-024": {
      const h = n(s, "h"); const middle = n(s, "middle"); const u = n(s, "u"); const sum = n(s, "sum"); const increasing = q.temporaryPrototypeId.endsWith("008");
      return {
        stem: increasing
          ? L(`एक तीन-अंकीय संख्या के अंक क्रमशः 1-1 बढ़ते हैं और उनका योग ${sum} है। संख्या ज्ञात कीजिए।`, `ਇੱਕ ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ਦੇ ਅੰਕ ਕ੍ਰਮਵਾਰ 1-1 ਵੱਧਦੇ ਹਨ ਅਤੇ ਉਹਨਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ। ਸੰਖਿਆ ਕੱਢੋ।`)
          : L(`एक तीन-अंकीय संख्या के अंक क्रमशः 1-1 घटते हैं और उनका योग ${sum} है। संख्या ज्ञात कीजिए।`, `ਇੱਕ ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ਦੇ ਅੰਕ ਕ੍ਰਮਵਾਰ 1-1 ਘਟਦੇ ਹਨ ਅਤੇ ਉਹਨਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ। ਸੰਖਿਆ ਕੱਢੋ।`),
        coreConcept: increasing ? L("क्रमागत बढ़ते अंकों में हर अगला अंक पिछले से 1 अधिक होता है।", "ਲਗਾਤਾਰ ਵੱਧਦੇ ਅੰਕਾਂ ਵਿੱਚ ਹਰ ਅਗਲਾ ਅੰਕ ਪਿਛਲੇ ਤੋਂ 1 ਵੱਧ ਹੁੰਦਾ ਹੈ।") : L("क्रमागत घटते अंकों में हर अगला अंक पिछले से 1 कम होता है।", "ਲਗਾਤਾਰ ਘਟਦੇ ਅੰਕਾਂ ਵਿੱਚ ਹਰ ਅਗਲਾ ਅੰਕ ਪਿਛਲੇ ਤੋਂ 1 ਘੱਟ ਹੁੰਦਾ ਹੈ।"),
        strategy: L("बीच के अंक को b मानें; तीनों अंकों का योग 3b बनता है।", "ਵਿਚਕਾਰਲੇ ਅੰਕ ਨੂੰ b ਮੰਨੋ; ਤਿੰਨਾਂ ਅੰਕਾਂ ਦਾ ਜੋੜ 3b ਬਣਦਾ ਹੈ।"),
        steps: [L(`3b = ${sum}, इसलिए b = ${middle}.`, `3b = ${sum}, ਇਸ ਲਈ b = ${middle}.`), L(`अंक ${h}, ${middle}, ${u} हैं।`, `ਅੰਕ ${h}, ${middle}, ${u} ਹਨ।`), L(`अतः संख्या ${answer} है।`, `ਇਸ ਲਈ ਸੰਖਿਆ ${answer} ਹੈ।`)],
        finalAnswer: L(`उत्तर ${answer} है।`, `ਉੱਤਰ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-009": {
      const digit = n(s, "digit"); const position = n(s, "position"); const positionalValue = n(s, "positionalValue"); const placeValue = n(s, "placeValue");
      return {
        stem: L(`किसी अंक का स्थानीय मान ${fmt(placeValue)} है और वह इकाई स्थान से ${position} स्थान बाईं ओर है। वह अंक कौन-सा है?`, `ਕਿਸੇ ਅੰਕ ਦਾ ਸਥਾਨਕ ਮੁੱਲ ${fmt(placeValue)} ਹੈ ਅਤੇ ਉਹ ਇਕਾਈ ਸਥਾਨ ਤੋਂ ${position} ਸਥਾਨ ਖੱਬੇ ਹੈ। ਉਹ ਅੰਕ ਕਿਹੜਾ ਹੈ?`),
        coreConcept: L("स्थानीय मान = अंक × स्थान का मान।", "ਸਥਾਨਕ ਮੁੱਲ = ਅੰਕ × ਸਥਾਨ ਦਾ ਮੁੱਲ।"),
        strategy: L("दिए स्थानीय मान को उस स्थान के मान से भाग दें।", "ਦਿੱਤੇ ਸਥਾਨਕ ਮੁੱਲ ਨੂੰ ਉਸ ਸਥਾਨ ਦੇ ਮੁੱਲ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        steps: [L(`स्थान का मान = 10^${position} = ${fmt(positionalValue)}.`, `ਸਥਾਨ ਦਾ ਮੁੱਲ = 10^${position} = ${fmt(positionalValue)}.`), L(`${fmt(placeValue)} ÷ ${fmt(positionalValue)} = ${digit}.`, `${fmt(placeValue)} ÷ ${fmt(positionalValue)} = ${digit}.`)],
        finalAnswer: L(`अंक ${answer} है।`, `ਅੰਕ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-010": {
      const digit = n(s, "digit"); const position = n(s, "position"); const placeValue = n(s, "placeValue");
      return {
        stem: L(`किसी संख्या में अंक ${digit} का स्थानीय मान ${fmt(placeValue)} है। वह इकाई स्थान से कितने स्थान बाईं ओर है?`, `ਕਿਸੇ ਸੰਖਿਆ ਵਿੱਚ ਅੰਕ ${digit} ਦਾ ਸਥਾਨਕ ਮੁੱਲ ${fmt(placeValue)} ਹੈ। ਉਹ ਇਕਾਈ ਸਥਾਨ ਤੋਂ ਕਿੰਨੇ ਸਥਾਨ ਖੱਬੇ ਹੈ?`),
        coreConcept: L("दशमलव पद्धति में बाईं ओर हर एक स्थान जाने पर स्थान का मान 10 गुना होता है।", "ਦਸ਼ਮਲਵ ਪੱਧਤੀ ਵਿੱਚ ਖੱਬੇ ਹਰ ਇੱਕ ਸਥਾਨ ਜਾਣ ਤੇ ਸਥਾਨ ਦਾ ਮੁੱਲ 10 ਗੁਣਾ ਹੁੰਦਾ ਹੈ।"),
        strategy: L("स्थानीय मान को अंक से भाग देकर 10 की घात पहचानें।", "ਸਥਾਨਕ ਮੁੱਲ ਨੂੰ ਅੰਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 10 ਦੀ ਘਾਤ ਪਛਾਣੋ।"),
        steps: [L(`${fmt(placeValue)} ÷ ${digit} = ${fmt(10 ** position)} = 10^${position}.`, `${fmt(placeValue)} ÷ ${digit} = ${fmt(10 ** position)} = 10^${position}.`), L(`इसलिए अंक इकाई से ${position} स्थान बाईं ओर है।`, `ਇਸ ਲਈ ਅੰਕ ਇਕਾਈ ਤੋਂ ${position} ਸਥਾਨ ਖੱਬੇ ਹੈ।`)],
        finalAnswer: L(`${answer} स्थान बाईं ओर।`, `${answer} ਸਥਾਨ ਖੱਬੇ।`),
      };
    }
    case "NUM-CP010-PROT-011": {
      const hundreds = n(s, "hundreds"); const x = n(s, "x"); const units = n(s, "units"); const addend = n(s, "addend"); const first = n(s, "first"); const result = n(s, "result"); const carry1 = n(s, "carry1"); const carry2 = n(s, "carry2"); const au = addend % 10; const at = Math.floor(addend / 10) % 10;
      return {
        stem: L(`नीचे दिए जोड़ में x एक अंक है। x ज्ञात कीजिए।\n\n  ${hundreds}x${units}\n+ ${addend}\n-----\n  ${result}`, `ਹੇਠਾਂ ਦਿੱਤੇ ਜੋੜ ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। x ਕੱਢੋ।\n\n  ${hundreds}x${units}\n+ ${addend}\n-----\n  ${result}`),
        coreConcept: L("लगातार कैरी वाले जोड़ में हर स्तंभ पर पिछले स्तंभ की कैरी शामिल करनी होती है।", "ਲਗਾਤਾਰ ਕੈਰੀ ਵਾਲੇ ਜੋੜ ਵਿੱਚ ਹਰ ਕਾਲਮ ਵਿੱਚ ਪਿਛਲੇ ਕਾਲਮ ਦੀ ਕੈਰੀ ਸ਼ਾਮਲ ਕਰਨੀ ਹੁੰਦੀ ਹੈ।"),
        strategy: L("इकाई से पहली कैरी निकालें, फिर दहाई वाले स्तंभ से x तय करें।", "ਇਕਾਈ ਤੋਂ ਪਹਿਲੀ ਕੈਰੀ ਕੱਢੋ, ਫਿਰ ਦਹਾਈ ਵਾਲੇ ਕਾਲਮ ਤੋਂ x ਨਿਰਧਾਰਤ ਕਰੋ।"),
        steps: [L(`इकाई: ${units} + ${au}; कैरी ${carry1}.`, `ਇਕਾਈ: ${units} + ${au}; ਕੈਰੀ ${carry1}.`), L(`दहाई: x + ${at} + ${carry1}; इससे x = ${x} और अगली कैरी ${carry2}.`, `ਦਹਾਈ: x + ${at} + ${carry1}; ਇਸ ਤੋਂ x = ${x} ਅਤੇ ਅਗਲੀ ਕੈਰੀ ${carry2}.`), L(`जाँच: ${first} + ${addend} = ${result}.`, `ਜਾਂਚ: ${first} + ${addend} = ${result}.`)],
        finalAnswer: `x = ${answer}.`,
      };
    }
    case "NUM-CP010-PROT-012": {
      const x = n(s, "x"); const units = n(s, "units"); const subtrahend = n(s, "subtrahend"); const minuend = n(s, "minuend"); const result = n(s, "result"); const su = subtrahend % 10; const st = Math.floor(subtrahend / 10) % 10;
      return {
        stem: L(`नीचे दिए घटाव में x एक अंक है। x ज्ञात कीजिए।\n\n  ${String(minuend).replace(String(x), "x")}\n- ${subtrahend}\n-----\n  ${String(result).padStart(3, "0")}`, `ਹੇਠਾਂ ਦਿੱਤੀ ਘਟਾਉ ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। x ਕੱਢੋ।\n\n  ${String(minuend).replace(String(x), "x")}\n- ${subtrahend}\n-----\n  ${String(result).padStart(3, "0")}`),
        coreConcept: L("उधार लेने पर वर्तमान स्तंभ में 10 जुड़ता है और बाईं ओर का स्तंभ 1 कम हो जाता है।", "ਉਧਾਰ ਲੈਣ ਤੇ ਮੌਜੂਦਾ ਕਾਲਮ ਵਿੱਚ 10 ਜੁੜਦਾ ਹੈ ਅਤੇ ਖੱਬੇ ਵਾਲਾ ਕਾਲਮ 1 ਘੱਟ ਹੋ ਜਾਂਦਾ ਹੈ।"),
        strategy: L("इकाई से दहाई और फिर दहाई से सैकड़ा तक दोनों उधारों को क्रम से लिखें।", "ਇਕਾਈ ਤੋਂ ਦਹਾਈ ਅਤੇ ਫਿਰ ਦਹਾਈ ਤੋਂ ਸੈਂਕੜੇ ਤੱਕ ਦੋਵੇਂ ਉਧਾਰ ਕ੍ਰਮ ਨਾਲ ਲਿਖੋ।"),
        steps: [L(`इकाई: ${units + 10} − ${su} = ${result % 10}.`, `ਇਕਾਈ: ${units + 10} − ${su} = ${result % 10}.`), L(`दहाई में x − 1 बचता है; फिर उधार लेकर x − 1 + 10 − ${st} = ${Math.floor(result / 10) % 10}.`, `ਦਹਾਈ ਵਿੱਚ x − 1 ਬਚਦਾ ਹੈ; ਫਿਰ ਉਧਾਰ ਲੈ ਕੇ x − 1 + 10 − ${st} = ${Math.floor(result / 10) % 10}.`), L(`इससे x = ${x}. जाँच: ${minuend} − ${subtrahend} = ${result}.`, `ਇਸ ਤੋਂ x = ${x}. ਜਾਂਚ: ${minuend} − ${subtrahend} = ${result}.`)],
        finalAnswer: `x = ${answer}.`,
      };
    }
    case "NUM-CP010-PROT-013": {
      const sum = n(s, "sum"); const candidates = ns(s, "candidates"); const greatest = b(s, "askGreatest");
      return {
        stem: greatest ? L(`एक तीन-अंकीय संख्या में सैकड़ा अंक इकाई अंक का दोगुना है और तीनों अंकों का योग ${sum} है। सबसे बड़ी संभव संख्या कौन-सी है?`, `ਇੱਕ ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ਵਿੱਚ ਸੈਂਕੜੇ ਦਾ ਅੰਕ ਇਕਾਈ ਅੰਕ ਦਾ ਦੁੱਗਣਾ ਹੈ ਅਤੇ ਤਿੰਨਾਂ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ। ਸਭ ਤੋਂ ਵੱਡੀ ਸੰਭਵ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`) : L(`एक तीन-अंकीय संख्या में सैकड़ा अंक इकाई अंक का दोगुना है और तीनों अंकों का योग ${sum} है। सबसे छोटी संभव संख्या कौन-सी है?`, `ਇੱਕ ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ਵਿੱਚ ਸੈਂਕੜੇ ਦਾ ਅੰਕ ਇਕਾਈ ਅੰਕ ਦਾ ਦੁੱਗਣਾ ਹੈ ਅਤੇ ਤਿੰਨਾਂ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ। ਸਭ ਤੋਂ ਛੋਟੀ ਸੰਭਵ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`),
        coreConcept: L("शर्तों से कई संख्याएँ बन सकती हैं; सबसे छोटी या बड़ी चुनने से पहले सभी मान्य संख्याएँ देखनी होती हैं।", "ਸ਼ਰਤਾਂ ਨਾਲ ਕਈ ਸੰਖਿਆਵਾਂ ਬਣ ਸਕਦੀਆਂ ਹਨ; ਸਭ ਤੋਂ ਛੋਟੀ ਜਾਂ ਵੱਡੀ ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਮੰਨਣਯੋਗ ਸੰਖਿਆਵਾਂ ਦੇਖਣੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।"),
        strategy: L("इकाई अंक u मानकर सैकड़ा अंक 2u लें और योग से दहाई अंक निकालें।", "ਇਕਾਈ ਅੰਕ u ਮੰਨ ਕੇ ਸੈਂਕੜੇ ਦਾ ਅੰਕ 2u ਲਵੋ ਅਤੇ ਜੋੜ ਤੋਂ ਦਹਾਈ ਅੰਕ ਕੱਢੋ।"),
        steps: [L(`मान्य संख्याएँ: ${candidates.join(", ")}.`, `ਮੰਨਣਯੋਗ ਸੰਖਿਆਵਾਂ: ${candidates.join(", ")}.`), greatest ? L(`इनमें सबसे बड़ी ${answer} है।`, `ਇਨ੍ਹਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ${answer} ਹੈ।`) : L(`इनमें सबसे छोटी ${answer} है।`, `ਇਨ੍ਹਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ${answer} ਹੈ।`)],
        finalAnswer: L(`उत्तर ${answer} है।`, `ਉੱਤਰ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-014": {
      const hundreds = n(s, "hundreds"); const units = n(s, "units"); const knownSum = n(s, "knownSum"); const lowerTotal = n(s, "lowerTotal"); const upperTotal = n(s, "upperTotal"); const valid = ns(s, "valid");
      return {
        stem: L(`तीन-अंकीय संख्या ${hundreds}x${units} में x एक अंक है। अंकों का योग कम-से-कम ${lowerTotal} और अधिक-से-अधिक ${upperTotal} है। x के सभी संभव मानों का समुच्चय कौन-सा है?`, `ਤਿੰਨ-ਅੰਕੀ ਸੰਖਿਆ ${hundreds}x${units} ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। ਅੰਕਾਂ ਦਾ ਜੋੜ ਘੱਟੋ-ਘੱਟ ${lowerTotal} ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ${upperTotal} ਹੈ। x ਦੇ ਸਾਰੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`),
        coreConcept: L("अंक 0 से 9 के बीच होना चाहिए और दोनों योग सीमाएँ एक साथ पूरी करनी चाहिए।", "ਅੰਕ 0 ਤੋਂ 9 ਵਿਚਕਾਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ ਦੋਵੇਂ ਜੋੜ ਸੀਮਾਵਾਂ ਇਕੱਠੀਆਂ ਪੂਰੀਆਂ ਕਰਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।"),
        strategy: L("दिखाई दे रहे अंकों का योग दोनों सीमाओं से घटाकर x की सीमा निकालें।", "ਦਿੱਸ ਰਹੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਦੋਵੇਂ ਸੀਮਾਵਾਂ ਵਿਚੋਂ ਘਟਾ ਕੇ x ਦੀ ਸੀਮਾ ਕੱਢੋ।"),
        steps: [L(`दिखाई दे रहे अंकों का योग = ${knownSum}.`, `ਦਿੱਸ ਰਹੇ ਅੰਕਾਂ ਦਾ ਜੋੜ = ${knownSum}.`), L(`${lowerTotal} ≤ ${knownSum} + x ≤ ${upperTotal}.`, `${lowerTotal} ≤ ${knownSum} + x ≤ ${upperTotal}.`), L(`अतः x के मान ${setText(valid)} हैं।`, `ਇਸ ਲਈ x ਦੇ ਮੁੱਲ ${setText(valid)} ਹਨ।`)],
        finalAnswer: answer,
      };
    }
    case "NUM-CP010-PROT-015": {
      const upper = n(s, "upper"); const digit = n(s, "digit"); const per = n(s, "perLowPlace"); const hundreds = n(s, "hundredsContribution");
      return {
        stem: L(`1 से ${upper} तक सभी पूर्णांक लिखने पर अंक ${digit} कुल कितनी बार आता है?`, `1 ਤੋਂ ${upper} ਤੱਕ ਸਾਰੇ ਪੂਰਨ ਅੰਕ ਲਿਖਣ ਤੇ ਅੰਕ ${digit} ਕੁੱਲ ਕਿੰਨੀ ਵਾਰ ਆਉਂਦਾ ਹੈ?`),
        coreConcept: L("अंक की आवृत्ति गिनते समय इकाई, दहाई और सैकड़ा स्थान अलग-अलग गिने जाते हैं।", "ਅੰਕ ਦੀ ਆਵਿਰਤੀ ਗਿਣਦੇ ਸਮੇਂ ਇਕਾਈ, ਦਹਾਈ ਅਤੇ ਸੈਂਕੜੇ ਦੇ ਸਥਾਨ ਵੱਖ-ਵੱਖ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।"),
        strategy: L("हर स्थान पर पूरे चक्रों में उस अंक की उपस्थिति गिनें और अंत में जोड़ें।", "ਹਰ ਸਥਾਨ ਤੇ ਪੂਰੇ ਚੱਕਰਾਂ ਵਿੱਚ ਉਸ ਅੰਕ ਦੀ ਹਾਜ਼ਰੀ ਗਿਣੋ ਅਤੇ ਅੰਤ ਵਿੱਚ ਜੋੜੋ।"),
        steps: [L(`इकाई में ${per} बार और दहाई में ${per} बार।`, `ਇਕਾਈ ਵਿੱਚ ${per} ਵਾਰ ਅਤੇ ਦਹਾਈ ਵਿੱਚ ${per} ਵਾਰ।`), L(`सैकड़ा स्थान से ${hundreds} बार।`, `ਸੈਂਕੜੇ ਦੇ ਸਥਾਨ ਤੋਂ ${hundreds} ਵਾਰ।`), L(`कुल = ${per} + ${per} + ${hundreds} = ${answer}.`, `ਕੁੱਲ = ${per} + ${per} + ${hundreds} = ${answer}.`)],
        finalAnswer: L(`अंक ${digit} कुल ${answer} बार आता है।`, `ਅੰਕ ${digit} ਕੁੱਲ ${answer} ਵਾਰ ਆਉਂਦਾ ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-016": {
      const a = n(s, "a"); const bb = n(s, "b"); const c = n(s, "c"); const digitSum = n(s, "digitSum");
      return {
        stem: L(`एक पाँच-अंकीय पलिंड्रोम ${a}${bb} से शुरू होता है और उसके सभी अंकों का योग ${digitSum} है। पलिंड्रोम ज्ञात कीजिए।`, `ਇੱਕ ਪੰਜ-ਅੰਕੀ ਪੈਲਿੰਡਰੋਮ ${a}${bb} ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸਦੇ ਸਾਰੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${digitSum} ਹੈ। ਪੈਲਿੰਡਰੋਮ ਕੱਢੋ।`),
        coreConcept: L("पाँच-अंकीय पलिंड्रोम abcba के रूप में होता है; केवल बीच का अंक अकेला होता है।", "ਪੰਜ-ਅੰਕੀ ਪੈਲਿੰਡਰੋਮ abcba ਦੇ ਰੂਪ ਵਿੱਚ ਹੁੰਦਾ ਹੈ; ਕੇਵਲ ਵਿਚਕਾਰਲਾ ਅੰਕ ਇਕੱਲਾ ਹੁੰਦਾ ਹੈ।"),
        strategy: L("दोनों प्रतिबिंबित जोड़ियों का योग पहले निकालें और कुल योग से घटाकर बीच का अंक पाएँ।", "ਦੋਵੇਂ ਪਰਛਾਵੇਂ ਵਾਲੀਆਂ ਜੋੜੀਆਂ ਦਾ ਜੋੜ ਪਹਿਲਾਂ ਕੱਢੋ ਅਤੇ ਕੁੱਲ ਜੋੜ ਵਿਚੋਂ ਘਟਾ ਕੇ ਵਿਚਕਾਰਲਾ ਅੰਕ ਲੱਭੋ।"),
        steps: [L(`जोड़ी वाले अंकों का योगदान = 2 × ${a} + 2 × ${bb} = ${2 * a + 2 * bb}.`, `ਜੋੜੀ ਵਾਲੇ ਅੰਕਾਂ ਦਾ ਯੋਗਦਾਨ = 2 × ${a} + 2 × ${bb} = ${2 * a + 2 * bb}.`), L(`बीच का अंक = ${digitSum} − ${2 * a + 2 * bb} = ${c}.`, `ਵਿਚਕਾਰਲਾ ਅੰਕ = ${digitSum} − ${2 * a + 2 * bb} = ${c}.`), L(`अतः पलिंड्रोम ${answer} है।`, `ਇਸ ਲਈ ਪੈਲਿੰਡਰੋਮ ${answer} ਹੈ।`)],
        finalAnswer: L(`उत्तर ${answer} है।`, `ਉੱਤਰ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-017": {
      const coefficient = n(s, "coefficient"); const power = n(s, "power"); const tail = n(s, "tail");
      return {
        stem: L(`संख्या ${coefficient} × 10^${power} + ${tail} में कुल कितने अंक हैं?`, `ਸੰਖਿਆ ${coefficient} × 10^${power} + ${tail} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਅੰਕ ਹਨ?`),
        coreConcept: L("10^n से 10^(n+1) − 1 तक की हर धनात्मक पूर्ण संख्या में n + 1 अंक होते हैं।", "10^n ਤੋਂ 10^(n+1) − 1 ਤੱਕ ਦੀ ਹਰ ਧਨਾਤਮਕ ਪੂਰਨ ਸੰਖਿਆ ਵਿੱਚ n + 1 ਅੰਕ ਹੁੰਦੇ ਹਨ।"),
        strategy: L("पूरी संख्या फैलाने के बजाय उसे लगातार दो घातों के बीच रखें।", "ਪੂਰੀ ਸੰਖਿਆ ਖੋਲ੍ਹਣ ਦੀ ਥਾਂ ਉਸਨੂੰ ਲਗਾਤਾਰ ਦੋ ਘਾਤਾਂ ਦੇ ਵਿਚਕਾਰ ਰੱਖੋ।"),
        steps: [L(`यह संख्या 10^${power} से कम नहीं है।`, `ਇਹ ਸੰਖਿਆ 10^${power} ਤੋਂ ਘੱਟ ਨਹੀਂ ਹੈ।`), L(`और ${coefficient} × 10^${power} + ${tail} < 10^${power + 1}.`, `ਅਤੇ ${coefficient} × 10^${power} + ${tail} < 10^${power + 1}.`), L(`इसलिए इसमें ${answer} अंक हैं।`, `ਇਸ ਲਈ ਇਸ ਵਿੱਚ ${answer} ਅੰਕ ਹਨ।`)],
        finalAnswer: L(`${answer} अंक।`, `${answer} ਅੰਕ।`),
      };
    }
    case "NUM-CP010-PROT-018": {
      const valid = ns(s, "valid"); const conditionText = t(s, "conditionText");
      const sumMatch = conditionText.match(/digits is (\d+)/u); const diffMatch = conditionText.match(/tens digit is (\d+) greater/u);
      const sum = Number(sumMatch?.[1] ?? n(s, "sum")); const diff = diffMatch ? Number(diffMatch[1]) : null;
      const conditionHi = diff === null ? `अंकों का योग ${sum} है।` : `अंकों का योग ${sum} है और दहाई अंक इकाई अंक से ${diff} अधिक है।`;
      const conditionPa = diff === null ? `ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ।` : `ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ ਅਤੇ ਦਹਾਈ ਦਾ ਅੰਕ ਇਕਾਈ ਦੇ ਅੰਕ ਤੋਂ ${diff} ਵੱਧ ਹੈ।`;
      const localizedAnswer = localizedMultiplicity(answer, language);
      return {
        stem: L(`एक दो-अंकीय संख्या के लिए ${conditionHi} इन शर्तों को कितनी संख्याएँ पूरा करती हैं?`, `ਇੱਕ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਲਈ ${conditionPa} ਇਹ ਸ਼ਰਤਾਂ ਕਿੰਨੀਆਂ ਸੰਖਿਆਵਾਂ ਪੂਰੀਆਂ ਕਰਦੀਆਂ ਹਨ?`),
        coreConcept: L("अंक संबंधों से कोई समाधान, ठीक एक समाधान या एक से अधिक समाधान मिल सकते हैं।", "ਅੰਕ ਸੰਬੰਧਾਂ ਤੋਂ ਕੋਈ ਹੱਲ, ਠੀਕ ਇੱਕ ਹੱਲ ਜਾਂ ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ ਮਿਲ ਸਕਦੇ ਹਨ।"),
        strategy: L("दहाई अंक 1–9 और इकाई अंक 0–9 की सीमा में दी गई शर्तें जाँचें।", "ਦਹਾਈ ਅੰਕ 1–9 ਅਤੇ ਇਕਾਈ ਅੰਕ 0–9 ਦੀ ਸੀਮਾ ਵਿੱਚ ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਜਾਂਚੋ।"),
        steps: valid.length ? [L(`शर्तें पूरी करने वाली संख्याएँ: ${valid.join(", ")}.`, `ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ: ${valid.join(", ")}.`), L(`इनकी संख्या ${valid.length} है।`, `ਇਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${valid.length} ਹੈ।`), L(`अतः ${localizedAnswer}।`, `ਇਸ ਲਈ ${localizedAnswer}।`)] : [L("कोई दो-अंकीय संख्या दोनों शर्तें पूरी नहीं करती।", "ਕੋਈ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਨਹੀਂ ਕਰਦੀ।"), L(`अतः ${localizedAnswer}।`, `ਇਸ ਲਈ ${localizedAnswer}।`)],
        finalAnswer: `${localizedAnswer}।`,
      };
    }
    case "NUM-CP010-PROT-019": {
      const sum = n(s, "sum"); const valid = ns(s, "valid");
      return {
        stem: L(`कौन-सा समुच्चय उन सभी दो-अंकीय संख्याओं को दिखाता है जिनके अंकों का योग ${sum} है?`, `ਕਿਹੜਾ ਸਮੂਹ ਉਹ ਸਾਰੀਆਂ ਦੋ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਦਿਖਾਉਂਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ?`),
        coreConcept: L("पूर्ण समुच्चय वाले प्रश्न में हर संभव दहाई-इकाई जोड़ी शामिल होनी चाहिए।", "ਪੂਰੇ ਸਮੂਹ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹਰ ਸੰਭਵ ਦਹਾਈ-ਇਕਾਈ ਜੋੜੀ ਸ਼ਾਮਲ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।"),
        strategy: L("दहाई अंक 1 से बढ़ाते जाएँ और इकाई अंक को योग पूरा करने के लिए चुनें।", "ਦਹਾਈ ਅੰਕ 1 ਤੋਂ ਵਧਾਉਂਦੇ ਜਾਓ ਅਤੇ ਇਕਾਈ ਅੰਕ ਨੂੰ ਜੋੜ ਪੂਰਾ ਕਰਨ ਲਈ ਚੁਣੋ।"),
        steps: [L(`मान्य संख्याएँ ${valid.join(", ")} हैं।`, `ਮੰਨਣਯੋਗ ਸੰਖਿਆਵਾਂ ${valid.join(", ")} ਹਨ।`), L(`पूरा समुच्चय ${setText(valid)} है।`, `ਪੂਰਾ ਸਮੂਹ ${setText(valid)} ਹੈ।`)],
        finalAnswer: answer,
      };
    }
    case "NUM-CP010-PROT-020": {
      const firstTens = n(s, "firstTens"); const x = n(s, "x"); const y = n(s, "y"); const fixedUnits = n(s, "fixedUnits"); const first = n(s, "first"); const second = n(s, "second"); const result = n(s, "result");
      return {
        stem: L(`नीचे दिए जोड़ में x और y अंक हैं। क्रमित युग्म (x, y) ज्ञात कीजिए।\n\n  ${firstTens}x\n+ y${fixedUnits}\n----\n  ${result}`, `ਹੇਠਾਂ ਦਿੱਤੇ ਜੋੜ ਵਿੱਚ x ਅਤੇ y ਅੰਕ ਹਨ। ਕ੍ਰਮਿਤ ਜੋੜਾ (x, y) ਕੱਢੋ।\n\n  ${firstTens}x\n+ y${fixedUnits}\n----\n  ${result}`),
        coreConcept: L("इकाई स्तंभ x और कैरी तय करता है; वही कैरी दहाई स्तंभ में y तय करती है।", "ਇਕਾਈ ਕਾਲਮ x ਅਤੇ ਕੈਰੀ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ; ਉਹੀ ਕੈਰੀ ਦਹਾਈ ਕਾਲਮ ਵਿੱਚ y ਨਿਰਧਾਰਤ ਕਰਦੀ ਹੈ।"),
        strategy: L("दाएँ से बाएँ हल करें और कैरी को अगले स्तंभ में अवश्य जोड़ें।", "ਸੱਜੇ ਤੋਂ ਖੱਬੇ ਹੱਲ ਕਰੋ ਅਤੇ ਕੈਰੀ ਨੂੰ ਅਗਲੇ ਕਾਲਮ ਵਿੱਚ ਜ਼ਰੂਰ ਜੋੜੋ।"),
        steps: [L(`इकाई स्तंभ से x = ${x} और कैरी 1 मिलती है।`, `ਇਕਾਈ ਕਾਲਮ ਤੋਂ x = ${x} ਅਤੇ ਕੈਰੀ 1 ਮਿਲਦੀ ਹੈ।`), L(`दहाई स्तंभ से y = ${y}.`, `ਦਹਾਈ ਕਾਲਮ ਤੋਂ y = ${y}.`), L(`जाँच: ${first} + ${second} = ${result}; इसलिए (x, y) = ${answer}.`, `ਜਾਂਚ: ${first} + ${second} = ${result}; ਇਸ ਲਈ (x, y) = ${answer}.`)],
        finalAnswer: `(x, y) = ${answer}.`,
      };
    }
    case "NUM-CP010-PROT-021": {
      const tens = n(s, "tens"); const x = n(s, "x"); const multiplier = n(s, "multiplier"); const number = n(s, "number"); const result = n(s, "result"); const unitsProduct = n(s, "unitsProduct"); const carry = n(s, "carry");
      return {
        stem: L(`गुणा ${tens}x × ${multiplier} = ${result} में x एक अंक है। x ज्ञात कीजिए।`, `ਗੁਣਾ ${tens}x × ${multiplier} = ${result} ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। x ਕੱਢੋ।`),
        coreConcept: L("गुणा में गुणनफल का इकाई अंक इकाई वाले गुणा से तय होता है और अतिरिक्त दहाई बाईं ओर कैरी होती है।", "ਗੁਣਾ ਵਿੱਚ ਗੁਣਨਫਲ ਦਾ ਇਕਾਈ ਅੰਕ ਇਕਾਈ ਵਾਲੇ ਗੁਣਾ ਨਾਲ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ ਅਤੇ ਵਾਧੂ ਦਹਾਈ ਖੱਬੇ ਕੈਰੀ ਹੁੰਦੀ ਹੈ।"),
        strategy: L("गुणनफल के इकाई अंक से x पहचानें और फिर पूरा गुणा जाँचें।", "ਗੁਣਨਫਲ ਦੇ ਇਕਾਈ ਅੰਕ ਤੋਂ x ਪਛਾਣੋ ਅਤੇ ਫਿਰ ਪੂਰਾ ਗੁਣਾ ਜਾਂਚੋ।"),
        steps: [L(`${x} × ${multiplier} = ${unitsProduct}; इकाई अंक ${unitsProduct % 10} और कैरी ${carry}.`, `${x} × ${multiplier} = ${unitsProduct}; ਇਕਾਈ ਅੰਕ ${unitsProduct % 10} ਅਤੇ ਕੈਰੀ ${carry}.`), L(`इसलिए x = ${x}. जाँच: ${number} × ${multiplier} = ${result}.`, `ਇਸ ਲਈ x = ${x}. ਜਾਂਚ: ${number} × ${multiplier} = ${result}.`)],
        finalAnswer: `x = ${answer}.`,
      };
    }
    case "NUM-CP010-PROT-022": {
      const block = n(s, "block"); const repeated = n(s, "repeated"); const difference = n(s, "difference");
      return {
        stem: L(`एक ही दो-अंकीय संख्या को दो बार साथ लिखकर चार-अंकीय संख्या बनाई गई। चार-अंकीय संख्या मूल दो-अंकीय संख्या से ${difference} अधिक है। दो-अंकीय संख्या ज्ञात कीजिए।`, `ਇੱਕੋ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਨੂੰ ਦੋ ਵਾਰ ਨਾਲ-ਨਾਲ ਲਿਖ ਕੇ ਚਾਰ-ਅੰਕੀ ਸੰਖਿਆ ਬਣਾਈ ਗਈ। ਚਾਰ-ਅੰਕੀ ਸੰਖਿਆ ਮੂਲ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਤੋਂ ${difference} ਵੱਧ ਹੈ। ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਕੱਢੋ।`),
        coreConcept: L("दो-अंकीय n को दो बार लिखने पर 100n + n = 101n बनता है।", "ਦੋ-ਅੰਕੀ n ਨੂੰ ਦੋ ਵਾਰ ਲਿਖਣ ਤੇ 100n + n = 101n ਬਣਦਾ ਹੈ।"),
        strategy: L("दोहराई गई संख्या और मूल संख्या के अंतर को n के रूप में लिखें।", "ਦੁਹਰਾਈ ਗਈ ਸੰਖਿਆ ਅਤੇ ਮੂਲ ਸੰਖਿਆ ਦੇ ਅੰਤਰ ਨੂੰ n ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।"),
        steps: [L("दोहराई संख्या − मूल संख्या = 101n − n = 100n.", "ਦੁਹਰਾਈ ਸੰਖਿਆ − ਮੂਲ ਸੰਖਿਆ = 101n − n = 100n."), L(`100n = ${difference}, इसलिए n = ${block}.`, `100n = ${difference}, ਇਸ ਲਈ n = ${block}.`), L(`जाँच: ${repeated} − ${block} = ${difference}.`, `ਜਾਂਚ: ${repeated} − ${block} = ${difference}.`)],
        finalAnswer: L(`दो-अंकीय संख्या ${answer} है।`, `ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-023": {
      const tens = n(s, "tens"); const number = n(s, "number"); const reversed = n(s, "reversed"); const difference = n(s, "difference");
      return {
        stem: L(`एक दो-अंकीय संख्या 0 पर समाप्त होती है। अंक उलटने पर शुरू का 0 हटा दिया जाता है। मूल संख्या उलटी संख्या से ${difference} अधिक है। मूल संख्या ज्ञात कीजिए।`, `ਇੱਕ ਦੋ-ਅੰਕੀ ਸੰਖਿਆ 0 ਤੇ ਖਤਮ ਹੁੰਦੀ ਹੈ। ਅੰਕ ਉਲਟਣ ਤੇ ਸ਼ੁਰੂ ਵਾਲਾ 0 ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਮੂਲ ਸੰਖਿਆ ਉਲਟੀ ਸੰਖਿਆ ਤੋਂ ${difference} ਵੱਧ ਹੈ। ਮੂਲ ਸੰਖਿਆ ਕੱਢੋ।`),
        coreConcept: L("0 पर समाप्त संख्या को उलटने पर आगे आया 0 संख्या का मान नहीं बदलता।", "0 ਤੇ ਖਤਮ ਸੰਖਿਆ ਨੂੰ ਉਲਟਣ ਤੇ ਅੱਗੇ ਆਇਆ 0 ਸੰਖਿਆ ਦਾ ਮੁੱਲ ਨਹੀਂ ਬਦਲਦਾ।"),
        strategy: L("मूल संख्या को 10a और उलटी संख्या को a लिखकर अंतर का उपयोग करें।", "ਮੂਲ ਸੰਖਿਆ ਨੂੰ 10a ਅਤੇ ਉਲਟੀ ਸੰਖਿਆ ਨੂੰ a ਲਿਖ ਕੇ ਅੰਤਰ ਵਰਤੋ।"),
        steps: [L(`10a − a = 9a = ${difference}.`, `10a − a = 9a = ${difference}.`), L(`a = ${difference} ÷ 9 = ${tens}.`, `a = ${difference} ÷ 9 = ${tens}.`), L(`मूल संख्या = 10 × ${tens} = ${number}; उलटी संख्या ${reversed}.`, `ਮੂਲ ਸੰਖਿਆ = 10 × ${tens} = ${number}; ਉਲਟੀ ਸੰਖਿਆ ${reversed}.`)],
        finalAnswer: L(`मूल संख्या ${answer} है।`, `ਮੂਲ ਸੰਖਿਆ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-025": {
      const number = n(s, "number"); const stages = ns(s, "stages"); const root = n(s, "root");
      const steps = stages.map((value, index) => index === 0 ? L(`पहला अंक-योग = ${value}.`, `ਪਹਿਲਾ ਅੰਕ-ਜੋੜ = ${value}.`) : L(`अगला अंक-योग = ${value}.`, `ਅਗਲਾ ਅੰਕ-ਜੋੜ = ${value}.`));
      return {
        stem: L(`${fmt(number)} का डिजिटल रूट ज्ञात कीजिए।`, `${fmt(number)} ਦਾ ਡਿਜਿਟਲ ਰੂਟ ਕੱਢੋ।`),
        coreConcept: L("डिजिटल रूट के लिए अंकों को बार-बार जोड़ा जाता है, जब तक एक अंक न रह जाए।", "ਡਿਜਿਟਲ ਰੂਟ ਲਈ ਅੰਕਾਂ ਨੂੰ ਵਾਰ-ਵਾਰ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ, ਜਦ ਤੱਕ ਇੱਕ ਅੰਕ ਨਾ ਰਹਿ ਜਾਵੇ।"),
        strategy: L("सभी अंक जोड़ें; यदि परिणाम दो-अंकीय हो तो उसके अंक फिर जोड़ें।", "ਸਾਰੇ ਅੰਕ ਜੋੜੋ; ਜੇ ਨਤੀਜਾ ਦੋ-ਅੰਕੀ ਹੋਵੇ ਤਾਂ ਉਸਦੇ ਅੰਕ ਫਿਰ ਜੋੜੋ।"),
        steps: [...steps, L(`अंतिम एक-अंकीय परिणाम ${root} है।`, `ਅੰਤਿਮ ਇੱਕ-ਅੰਕੀ ਨਤੀਜਾ ${root} ਹੈ।`)],
        finalAnswer: L(`डिजिटल रूट ${answer} है।`, `ਡਿਜਿਟਲ ਰੂਟ ${answer} ਹੈ।`),
      };
    }
    case "NUM-CP010-PROT-026": {
      const completed = n(s, "completedHundreds"); const upper = n(s, "upper");
      return {
        stem: L(`1 से ${upper} तक सभी पूर्णांक लिखने पर अंक 0 कुल कितनी बार आता है?`, `1 ਤੋਂ ${upper} ਤੱਕ ਸਾਰੇ ਪੂਰਨ ਅੰਕ ਲਿਖਣ ਤੇ ਅੰਕ 0 ਕੁੱਲ ਕਿੰਨੀ ਵਾਰ ਆਉਂਦਾ ਹੈ?`),
        coreConcept: L("0 गिनते समय संख्या के शुरू में न लिखे जाने वाले शून्य नहीं गिने जाते।", "0 ਗਿਣਦੇ ਸਮੇਂ ਸੰਖਿਆ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ ਨਾ ਲਿਖੇ ਜਾਣ ਵਾਲੇ ਸਿਫ਼ਰ ਨਹੀਂ ਗਿਣੇ ਜਾਂਦੇ।"),
        strategy: L("इकाई और दहाई स्थान के लिखे हुए शून्य अलग गिनें; 1 को 01 मानकर अतिरिक्त शून्य न जोड़ें।", "ਇਕਾਈ ਅਤੇ ਦਹਾਈ ਸਥਾਨ ਦੇ ਲਿਖੇ ਹੋਏ ਸਿਫ਼ਰ ਵੱਖ ਗਿਣੋ; 1 ਨੂੰ 01 ਮੰਨ ਕੇ ਵਾਧੂ ਸਿਫ਼ਰ ਨਾ ਜੋੜੋ।"),
        steps: [L("1 से 99 तक 0 केवल 10, 20, ..., 90 के इकाई स्थान पर आता है: 9 बार।", "1 ਤੋਂ 99 ਤੱਕ 0 ਕੇਵਲ 10, 20, ..., 90 ਦੇ ਇਕਾਈ ਸਥਾਨ ਤੇ ਆਉਂਦਾ ਹੈ: 9 ਵਾਰ।"), completed === 0 ? L("सीमा 99 पर समाप्त होती है, इसलिए आगे कोई पूरा सैकड़ा खंड नहीं है।", "ਸੀਮਾ 99 ਤੇ ਖਤਮ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਅੱਗੇ ਕੋਈ ਪੂਰਾ ਸੈਂਕੜਾ ਖੰਡ ਨਹੀਂ ਹੈ।") : L(`100 से आगे हर पूरे 100-संख्या खंड में 20 लिखे हुए शून्य जुड़ते हैं। ऐसे ${completed} खंड हैं।`, `100 ਤੋਂ ਅੱਗੇ ਹਰ ਪੂਰੇ 100-ਸੰਖਿਆ ਖੰਡ ਵਿੱਚ 20 ਲਿਖੇ ਹੋਏ ਸਿਫ਼ਰ ਜੁੜਦੇ ਹਨ। ਅਜੇਹੇ ${completed} ਖੰਡ ਹਨ।`), L(`कुल = 9 + 20 × ${completed} = ${answer}.`, `ਕੁੱਲ = 9 + 20 × ${completed} = ${answer}.`)],
        finalAnswer: L(`0 कुल ${answer} बार आता है।`, `0 ਕੁੱਲ ${answer} ਵਾਰ ਆਉਂਦਾ ਹੈ।`),
      };
    }
  }

  throw new Error(`Missing CP010 localization for ${q.temporaryPrototypeId}`);
}

export function generateNumCp010Localized(
  qlId: NumCp010PermanentQlId,
  seed: number,
  language: NumCp010LocalizedLanguage,
): NumCp010LocalizedPackage {
  const source = generateNumCp010Permanent(qlId, seed);
  const localized = content(source, language);
  const localizedOptions = Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    value: source.temporaryPrototypeId === "NUM-CP010-PROT-018"
      ? localizedMultiplicity(option.value, language)
      : option.value,
  })));
  const canonicalAnswer = source.temporaryPrototypeId === "NUM-CP010-PROT-018"
    ? localizedMultiplicity(source.canonicalAnswer, language)
    : source.canonicalAnswer;
  const verifierAnswer = source.temporaryPrototypeId === "NUM-CP010-PROT-018"
    ? localizedMultiplicity(source.verifierAnswer, language)
    : source.verifierAnswer;

  return Object.freeze({
    ...source,
    locale: localeFor(language),
    language,
    stem: localized.stem,
    options: localizedOptions,
    canonicalAnswer,
    verifierAnswer,
    explanation: Object.freeze({
      coreConcept: localized.coreConcept,
      strategy: localized.strategy,
      steps: Object.freeze([...localized.steps]),
      finalAnswer: localized.finalAnswer,
    }),
    localization: Object.freeze({
      version: "num-cp010-hi-pa-review-v1" as const,
      canonicalLocale: "en-IN" as const,
      canonicalQuestionId: qlId,
      mathematicalStatePreserved: true as const,
      optionOrderPreserved: true as const,
      correctIndexPreserved: true as const,
      misconceptionMappingPreserved: true as const,
      answerMeaningPreserved: true as const,
      englishAuthorityFrozen: true as const,
      lifecycleLocked: true as const,
    }),
    lifecycle: Object.freeze({
      permanentQlId: qlId,
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
      englishAuthorityStatus: "ENGLISH_FROZEN" as const,
      localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  }) as NumCp010LocalizedPackage;
}
