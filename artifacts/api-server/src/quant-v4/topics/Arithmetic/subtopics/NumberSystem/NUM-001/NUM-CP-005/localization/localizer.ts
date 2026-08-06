import type { NumCp005PermanentQuestion } from "../permanent/runtime";
import {
  NUM_CP005_LOCALIZED_AUTHORITY_TEXT,
  translateNumCp005OptionValue,
} from "./language-pack";
import type {
  NumCp005LocalizedExplanation,
  NumCp005LocalizedOption,
  NumCp005LocalizedQuestion,
  NumCp005TranslatedLocale,
} from "./types";

interface PrimePowerState {
  readonly prime: number;
  readonly exponent: number;
}

type HiddenState = Readonly<Record<string, unknown>>;

function state(question: NumCp005PermanentQuestion): HiddenState {
  return question.hiddenState;
}

function stateValue<T>(
  question: NumCp005PermanentQuestion,
  key: string,
): T {
  const value = state(question)[key];
  if (value === undefined) {
    throw new Error(`${question.questionLanguageId}/${question.seed}: missing hidden state ${key}`);
  }
  return value as T;
}

function optionalStateValue<T>(
  question: NumCp005PermanentQuestion,
  key: string,
): T | undefined {
  return state(question)[key] as T | undefined;
}

function primePowerText(item: PrimePowerState): string {
  return item.exponent === 1 ? String(item.prime) : `${item.prime}^${item.exponent}`;
}

function factorStateText(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) return "1";
  return value
    .map((item) => primePowerText(item as PrimePowerState))
    .join(" × ");
}

function factorText(question: NumCp005PermanentQuestion): string {
  const explicit = optionalStateValue<string>(question, "factorisation");
  return explicit ?? factorStateText(state(question).factorState);
}

function listText(value: readonly unknown[]): string {
  return value.length === 0 ? "∅" : `{${value.join(", ")}}`;
}

function pairSetText(value: readonly (readonly number[])[]): string {
  return value.length === 0
    ? "∅"
    : `{${value.map((pair) => `(${pair.join(",")})`).join(", ")}}`;
}

function extractExpression(
  question: NumCp005PermanentQuestion,
  pattern: RegExp,
): string {
  const match = question.stem.match(pattern);
  if (!match?.[1]) {
    throw new Error(`${question.questionLanguageId}/${question.seed}: expression parse failed`);
  }
  return match[1];
}

function propertyLabel(
  kind: string,
  locale: NumCp005TranslatedLocale,
): string {
  const labels = locale === "hi-IN"
    ? {
        TOTAL_DIVISORS: "धनात्मक भाजकों की संख्या",
        ODD_DIVISORS: "विषम धनात्मक भाजकों की संख्या",
        SQUARE_DIVISORS: "पूर्ण-वर्ग धनात्मक भाजकों की संख्या",
      }
    : {
        TOTAL_DIVISORS: "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ",
        ODD_DIVISORS: "ਟਾਂਕ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ",
        SQUARE_DIVISORS: "ਪੂਰਨ-ਵਰਗ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ",
      };
  const label = (labels as Readonly<Record<string, string>>)[kind];
  if (!label) throw new Error(`Unsupported divisor property kind: ${kind}`);
  return label;
}

function metricLabel(
  kind: string,
  locale: NumCp005TranslatedLocale,
): string {
  return propertyLabel(kind, locale);
}

function parityLabel(
  parity: string,
  locale: NumCp005TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    if (parity === "ODD") return "विषम ";
    if (parity === "EVEN") return "सम ";
    return "";
  }
  if (parity === "ODD") return "ਟਾਂਕ ";
  if (parity === "EVEN") return "ਜਿਸਤ ";
  return "";
}

function localizedStem(
  question: NumCp005PermanentQuestion,
  locale: NumCp005TranslatedLocale,
): string {
  const qlId = question.questionLanguageId;
  const hi = locale === "hi-IN";
  const factors = factorText(question);

  switch (qlId) {
    case "NUM-QL-046": {
      const proper = question.temporaryPrototypeId.endsWith("002");
      return hi
        ? `यदि n = ${factors} है, तो n के ${proper ? "उचित " : ""}धनात्मक भाजकों की संख्या ज्ञात कीजिए।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ${proper ? "ਢੰਗ ਦੇ " : ""}ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`;
    }
    case "NUM-QL-047": {
      const odd = question.temporaryPrototypeId.endsWith("003");
      return hi
        ? `यदि n = ${factors} है, तो n के ${odd ? "विषम" : "सम"} धनात्मक भाजकों की संख्या ज्ञात कीजिए।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ${odd ? "ਟਾਂਕ" : "ਜਿਸਤ"} ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`;
    }
    case "NUM-QL-048": {
      const requirement = stateValue<string>(question, "requirementFactorisation");
      const excluded = question.temporaryPrototypeId.endsWith("009");
      return hi
        ? `यदि n = ${factors} है, तो n के ऐसे धनात्मक भाजकों की संख्या ज्ञात कीजिए जो ${requirement} से ${excluded ? "विभाज्य नहीं हैं" : "विभाज्य हैं"}।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ਉਹ ਧਨਾਤਮਕ ਭਾਜਕ ਗਿਣੋ ਜੋ ${requirement} ਨਾਲ ${excluded ? "ਭਾਜਯ ਨਹੀਂ ਹਨ" : "ਭਾਜਯ ਹਨ"}।`;
    }
    case "NUM-QL-049": {
      const first = stateValue<string>(question, "firstRequirement");
      const second = stateValue<string>(question, "secondRequirement");
      return hi
        ? `यदि n = ${factors} है, तो n के ऐसे धनात्मक भाजकों की संख्या ज्ञात कीजिए जो ${first} से विभाज्य हैं, पर ${second} से विभाज्य नहीं हैं।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ਉਹ ਧਨਾਤਮਕ ਭਾਜਕ ਗਿਣੋ ਜੋ ${first} ਨਾਲ ਭਾਜਯ ਹਨ ਪਰ ${second} ਨਾਲ ਭਾਜਯ ਨਹੀਂ ਹਨ।`;
    }
    case "NUM-QL-050": {
      const prototype = question.temporaryPrototypeId;
      const power = optionalStateValue<number>(question, "power")
        ?? (prototype.endsWith("006") ? 2 : prototype.endsWith("010") ? 3 : 4);
      const name = hi
        ? power === 2 ? "पूर्ण-वर्ग" : power === 3 ? "पूर्ण-घन" : `पूर्ण ${power}वीं घात`
        : power === 2 ? "ਪੂਰਨ-ਵਰਗ" : power === 3 ? "ਪੂਰਨ-ਘਣ" : `ਪੂਰਨ ${power}ਵੀਂ ਘਾਤ`;
      return hi
        ? `यदि n = ${factors} है, तो n के ऐसे धनात्मक भाजकों की संख्या ज्ञात कीजिए जो ${name} हैं।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ਉਹ ਧਨਾਤਮਕ ਭਾਜਕ ਗਿਣੋ ਜੋ ${name} ਹਨ।`;
    }
    case "NUM-QL-051": {
      const proper = question.temporaryPrototypeId.endsWith("012");
      return hi
        ? `यदि n = ${factors} है, तो n के ${proper ? "उचित " : "सभी "}धनात्मक भाजकों का योग ज्ञात कीजिए।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ${proper ? "ਢੰਗ ਦੇ " : "ਸਾਰੇ "}ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ ਕੱਢੋ।`;
    }
    case "NUM-QL-052":
      return hi
        ? `यदि n = ${factors} है, तो n के सभी धनात्मक भाजकों का गुणनफल ज्ञात कीजिए।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ ਕੱਢੋ।`;
    case "NUM-QL-053":
      return hi
        ? `यदि n = ${factors} है, तो n के सभी धनात्मक भाजकों का पूरा समुच्चय ज्ञात कीजिए।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦੇ ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕੱਢੋ।`;
    case "NUM-QL-054": {
      const expression = extractExpression(question, /n = (.+?) has exactly/);
      const target = stateValue<string>(question, "targetDivisorCount");
      return hi
        ? `यदि n = ${expression} के ठीक ${target} धनात्मक भाजक हैं, तो x ज्ञात कीजिए।`
        : `ਜੇ n = ${expression} ਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ, ਤਾਂ x ਕੱਢੋ।`;
    }
    case "NUM-QL-055": {
      const prime = stateValue<number>(question, "prime");
      const target = stateValue<number>(question, "targetDivisorCount");
      return hi
        ? `एक धनात्मक पूर्णांक अभाज्य संख्या ${prime} की घात है और उसके ठीक ${target} धनात्मक भाजक हैं। वह पूर्णांक ज्ञात कीजिए।`
        : `ਇੱਕ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਅਭਾਜ ਸੰਖਿਆ ${prime} ਦੀ ਘਾਤ ਹੈ ਅਤੇ ਉਸਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ। ਉਹ ਪੂਰਨ ਅੰਕ ਕੱਢੋ।`;
    }
    case "NUM-QL-056": {
      const target = stateValue<number>(question, "targetDivisorCount");
      const parity = optionalStateValue<string>(question, "parity") ?? "ANY";
      return hi
        ? `ठीक ${target} धनात्मक भाजकों वाला सबसे छोटा ${parityLabel(parity, locale)}धनात्मक पूर्णांक ज्ञात कीजिए।`
        : `ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ${parityLabel(parity, locale)}ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਕੱਢੋ।`;
    }
    case "NUM-QL-057": {
      const bound = stateValue<number>(question, "bound");
      const target = stateValue<number>(question, "targetDivisorCount");
      const parity = stateValue<string>(question, "parity");
      return hi
        ? `${bound} से अधिक न होने वाला सबसे बड़ा ${parityLabel(parity, locale)}पूर्णांक ज्ञात कीजिए जिसके ठीक ${target} धनात्मक भाजक हैं।`
        : `${bound} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਵੱਡਾ ${parityLabel(parity, locale)}ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜਿਸਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ।`;
    }
    case "NUM-QL-058": {
      const bound = stateValue<string>(question, "bound");
      return hi
        ? `यदि n = ${factors} है, तो n का सबसे बड़ा धनात्मक भाजक ज्ञात कीजिए जो ${bound} से अधिक न हो।`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ n ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਧਨਾਤਮਕ ਭਾਜਕ ਕੱਢੋ ਜੋ ${bound} ਤੋਂ ਵੱਧ ਨਾ ਹੋਵੇ।`;
    }
    case "NUM-QL-059": {
      const requestedIndex = stateValue<number>(question, "requestedIndex");
      return hi
        ? `n = ${factors} के धनात्मक भाजकों को बढ़ते क्रम में लिखिए। क्रम संख्या ${requestedIndex} पर कौन-सा भाजक है?`
        : `n = ${factors} ਦੇ ਧਨਾਤਮਕ ਭਾਜਕ ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ। ਕ੍ਰਮ ਨੰਬਰ ${requestedIndex} ਉੱਤੇ ਕਿਹੜਾ ਭਾਜਕ ਹੈ?`;
    }
    case "NUM-QL-060": {
      const lower = stateValue<number>(question, "lower");
      const upper = stateValue<number>(question, "upper");
      const target = stateValue<number>(question, "targetDivisorCount");
      return hi
        ? `${lower} से ${upper} तक, दोनों सिरों सहित, कितने पूर्णांकों के ठीक ${target} धनात्मक भाजक हैं?`
        : `${lower} ਤੋਂ ${upper} ਤੱਕ, ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ, ਕਿੰਨੇ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ?`;
    }
    case "NUM-QL-061": {
      const kind = stateValue<string>(question, "propertyKind");
      const claimed = stateValue<string>(question, "claimedValue");
      const label = propertyLabel(kind, locale);
      return hi
        ? `यदि n = ${factors} है, तो इस दावे पर विचार कीजिए: “${label} ${claimed} है।” क्या दावा सही है?`
        : `ਜੇ n = ${factors} ਹੈ, ਤਾਂ ਇਸ ਦਾਅਵੇ ਨੂੰ ਜਾਂਚੋ: “${label} ${claimed} ਹੈ।” ਕੀ ਦਾਅਵਾ ਸਹੀ ਹੈ?`;
    }
    case "NUM-QL-062": {
      const claims = stateValue<readonly number[]>(question, "claims");
      const tableFactors = factorStateText(state(question).factorState);
      return hi
        ? `मान लीजिए n = ${tableFactors}। कथन I: n के ${claims[0]} धनात्मक भाजक हैं। कथन II: n के ${claims[1]} विषम धनात्मक भाजक हैं। कथन III: n के ${claims[2]} पूर्ण-वर्ग धनात्मक भाजक हैं। कौन-से कथन सही हैं?`
        : `ਮੰਨੋ n = ${tableFactors}। ਕਥਨ I: n ਦੇ ${claims[0]} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ। ਕਥਨ II: n ਦੇ ${claims[1]} ਟਾਂਕ ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ। ਕਥਨ III: n ਦੇ ${claims[2]} ਪੂਰਨ-ਵਰਗ ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ। ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?`;
    }
    case "NUM-QL-063": {
      const integerValue = stateValue<string>(question, "integerValue");
      const rows = stateValue<readonly string[]>(question, "pairTable");
      return hi
        ? `${integerValue} की भाजक जोड़ियाँ पूरी कीजिए: ${rows.join(", ")}। प्रश्नचिह्न के स्थान पर क्या आएगा?`
        : `${integerValue} ਦੇ ਭਾਜਕ ਜੋੜੇ ਪੂਰੇ ਕਰੋ: ${rows.join(", ")}। ਪ੍ਰਸ਼ਨ-ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕੀ ਆਵੇਗਾ?`;
    }
    case "NUM-QL-064": {
      const expression = extractExpression(question, /For n = (.+?), where/);
      const maximum = stateValue<number>(question, "maximumExponent");
      const target = stateValue<number>(question, "targetDivisorCount");
      return hi
        ? `n = ${expression}, जहाँ 0 ≤ x,y ≤ ${maximum}। उन क्रमित जोड़ियों (x,y) की संख्या की श्रेणी बताइए जिनके लिए n के ठीक ${target} धनात्मक भाजक हैं।`
        : `n = ${expression}, ਜਿੱਥੇ 0 ≤ x,y ≤ ${maximum}। ਉਹਨਾਂ ਕ੍ਰਮਬੱਧ ਜੋੜਿਆਂ (x,y) ਦੀ ਗਿਣਤੀ ਦੀ ਕਿਸਮ ਦੱਸੋ ਜਿਨ੍ਹਾਂ ਲਈ n ਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ।`;
    }
    case "NUM-QL-065": {
      const expression = extractExpression(question, /For n = (.+?), where/);
      const maximum = stateValue<number>(question, "maximumExponent");
      const target = stateValue<number>(question, "targetDivisorCount");
      return hi
        ? `n = ${expression}, जहाँ 0 ≤ x,y ≤ ${maximum}। उन सभी क्रमित जोड़ियों (x,y) का पूरा समुच्चय ज्ञात कीजिए जिनके लिए n के ठीक ${target} धनात्मक भाजक हैं।`
        : `n = ${expression}, ਜਿੱਥੇ 0 ≤ x,y ≤ ${maximum}। ਉਹਨਾਂ ਸਾਰੇ ਕ੍ਰਮਬੱਧ ਜੋੜਿਆਂ (x,y) ਦਾ ਪੂਰਾ ਸਮੂਹ ਕੱਢੋ ਜਿਨ੍ਹਾਂ ਲਈ n ਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ।`;
    }
    case "NUM-QL-066": {
      const total = stateValue<number>(question, "totalDivisors");
      const odd = stateValue<number>(question, "oddDivisors");
      const oddPrimes = stateValue<readonly number[]>(question, "oddPrimes");
      return hi
        ? `एक संख्या n = 2^a × p^b के रूप में है, जहाँ 0 ≤ a ≤ 5, 0 ≤ b ≤ 4 और p ∈ {${oddPrimes.join(", ")}}। यदि n के ${total} धनात्मक भाजक और ${odd} विषम धनात्मक भाजक हैं, तो n के सभी संभव मान ज्ञात कीजिए।`
        : `ਇੱਕ ਸੰਖਿਆ n = 2^a × p^b ਦੇ ਰੂਪ ਵਿੱਚ ਹੈ, ਜਿੱਥੇ 0 ≤ a ≤ 5, 0 ≤ b ≤ 4 ਅਤੇ p ∈ {${oddPrimes.join(", ")}}। ਜੇ n ਦੇ ${total} ਧਨਾਤਮਕ ਭਾਜਕ ਅਤੇ ${odd} ਟਾਂਕ ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ, ਤਾਂ n ਦੇ ਸਾਰੇ ਸੰਭਵ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "NUM-QL-067": {
      const total = stateValue<number>(question, "totalDivisors");
      const square = stateValue<number>(question, "squareDivisors");
      return hi
        ? `अभाज्य-घात सारणी में n के चार संभव रूप दिए हैं। वह पंक्ति चुनिए जिसमें n के ठीक ${total} धनात्मक भाजक और ठीक ${square} पूर्ण-वर्ग धनात्मक भाजक हैं।`
        : `ਅਭਾਜ-ਘਾਤ ਸਾਰਣੀ ਵਿੱਚ n ਦੇ ਚਾਰ ਸੰਭਵ ਰੂਪ ਦਿੱਤੇ ਹਨ। ਉਹ ਲਾਈਨ ਚੁਣੋ ਜਿਸ ਵਿੱਚ n ਦੇ ਠੀਕ ${total} ਧਨਾਤਮਕ ਭਾਜਕ ਅਤੇ ਠੀਕ ${square} ਪੂਰਨ-ਵਰਗ ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ।`;
    }
    case "NUM-QL-068": {
      const first = factorStateText(state(question).factorState);
      const second = factorStateText(state(question).secondFactorState);
      const metric = metricLabel(stateValue<string>(question, "metricKind"), locale);
      return hi
        ? `एक लघु विवरण में संख्या A = ${first} और संख्या B = ${second} हैं। किसकी ${metric} अधिक है?`
        : `ਇੱਕ ਛੋਟੇ ਵੇਰਵੇ ਵਿੱਚ ਸੰਖਿਆ A = ${first} ਅਤੇ ਸੰਖਿਆ B = ${second} ਹਨ। ਕਿਸਦੀ ${metric} ਵੱਧ ਹੈ?`;
    }
    case "NUM-QL-069": {
      const x = stateValue<number>(question, "hiddenExponent");
      const b = stateValue<number>(question, "knownExponent");
      const scenario = stateValue<number>(question, "scenario");
      const multiplier = b + 1;
      const parityDivisor = 2 * multiplier;
      const exactTotal = (x + 1) * multiplier;
      const exactEven = x * multiplier;
      const residue = (x + 1) % 3;
      const parityStatement = hi
        ? `सम भाजकों की संख्या ${parityDivisor} से ${x % 2 === 0 ? "विभाज्य है" : "विभाज्य नहीं है"}`
        : `ਜਿਸਤ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ${parityDivisor} ਨਾਲ ${x % 2 === 0 ? "ਭਾਜਯ ਹੈ" : "ਭਾਜਯ ਨਹੀਂ ਹੈ"}`;
      let first: string;
      let second: string;
      if (scenario === 0) {
        first = hi
          ? `कुल धनात्मक भाजकों की संख्या ${exactTotal} है`
          : `ਕੁੱਲ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ${exactTotal} ਹੈ`;
        second = parityStatement;
      } else if (scenario === 1) {
        first = parityStatement;
        second = hi
          ? `सम धनात्मक भाजकों की संख्या ${exactEven} है`
          : `ਜਿਸਤ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ${exactEven} ਹੈ`;
      } else if (scenario === 2) {
        first = parityStatement;
        second = hi
          ? `कुल भाजक संख्या को ${multiplier} से भाग देने के बाद प्राप्त संख्या को 3 से भाग देने पर शेष ${residue} है`
          : `ਕੁੱਲ ਭਾਜਕ ਗਿਣਤੀ ਨੂੰ ${multiplier} ਨਾਲ ਭਾਗ ਦੇਣ ਤੋਂ ਬਾਅਦ ਮਿਲੀ ਸੰਖਿਆ ਨੂੰ 3 ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਬਾਕੀ ${residue} ਹੈ`;
      } else {
        first = parityStatement;
        second = hi
          ? `कुल भाजक संख्या और ${exactTotal} दोनों की सम-विषम प्रकृति समान है`
          : `ਕੁੱਲ ਭਾਜਕ ਗਿਣਤੀ ਅਤੇ ${exactTotal} ਦੋਵਾਂ ਦੀ ਟਾਂਕ-ਜਿਸਤ ਕਿਸਮ ਇੱਕੋ ਹੈ`;
      }
      return hi
        ? `n = 2^x × 3^${b}, जहाँ x का पूर्णांक मान 0 से 5 तक है। क्या x निर्धारित किया जा सकता है? कथन I: ${first}। कथन II: ${second}।`
        : `n = 2^x × 3^${b}, ਜਿੱਥੇ x ਦਾ ਪੂਰਨ ਅੰਕ ਮੁੱਲ 0 ਤੋਂ 5 ਤੱਕ ਹੈ। ਕੀ x ਪਤਾ ਲੱਗ ਸਕਦਾ ਹੈ? ਕਥਨ I: ${first}। ਕਥਨ II: ${second}।`;
    }
    default:
      throw new Error(`Unsupported NUM-CP-005 QL for localisation: ${qlId}`);
  }
}

function localizedSteps(
  question: NumCp005PermanentQuestion,
  locale: NumCp005TranslatedLocale,
  answer: string,
): readonly string[] {
  const hi = locale === "hi-IN";
  const qlId = question.questionLanguageId;
  const factors = factorText(question);
  const result = hi ? `इसलिए सही परिणाम ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ ${answer} ਹੈ।`;

  switch (qlId) {
    case "NUM-QL-046":
      return Object.freeze([
        hi ? `अभाज्य गुणनखंड रूप ${factors} है।` : `ਅਭਾਜ ਗੁਣਨਖੰਡ ਰੂਪ ${factors} ਹੈ।`,
        hi ? `हर घात में 1 जोड़कर विकल्पों को गुणा किया जाता है।` : `ਹਰ ਘਾਤ ਵਿੱਚ 1 ਜੋੜ ਕੇ ਚੋਣਾਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    case "NUM-QL-047":
      return Object.freeze([
        hi ? `संख्या का अभाज्य गुणनखंड रूप ${factors} है।` : `ਸੰਖਿਆ ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਰੂਪ ${factors} ਹੈ।`,
        hi ? `2 के घात को अलग करके विषम और सम भाजक गिने जाते हैं।` : `2 ਦੇ ਘਾਤ ਨੂੰ ਵੱਖ ਕਰਕੇ ਟਾਂਕ ਅਤੇ ਜਿਸਤ ਭਾਜਕ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।`,
        result,
      ]);
    case "NUM-QL-048":
    case "NUM-QL-049":
      return Object.freeze([
        hi ? `अभाज्य गुणनखंड रूप ${factors} से हर भाजक के संभव घात तय होते हैं।` : `ਅਭਾਜ ਗੁਣਨਖੰਡ ਰੂਪ ${factors} ਤੋਂ ਹਰ ਭਾਜਕ ਦੇ ਸੰਭਵ ਘਾਤ ਤੈਅ ਹੁੰਦੇ ਹਨ।`,
        hi ? `दी गई विभाज्यता शर्तों के अनुसार घातों की सीमा लगाई जाती है।` : `ਦਿੱਤੀਆਂ ਭਾਜਯਤਾ ਸ਼ਰਤਾਂ ਮੁਤਾਬਕ ਘਾਤਾਂ ਦੀ ਹੱਦ ਲਗਾਈ ਜਾਂਦੀ ਹੈ।`,
        result,
      ]);
    case "NUM-QL-050": {
      const power = optionalStateValue<number>(question, "power")
        ?? (question.temporaryPrototypeId.endsWith("006") ? 2 : question.temporaryPrototypeId.endsWith("010") ? 3 : 4);
      return Object.freeze([
        hi ? `अभाज्य गुणनखंड रूप ${factors} है।` : `ਅਭਾਜ ਗੁਣਨਖੰਡ ਰੂਪ ${factors} ਹੈ।`,
        hi ? `हर चुना घात ${power} का गुणज होना चाहिए।` : `ਹਰ ਚੁਣਿਆ ਘਾਤ ${power} ਦਾ ਗੁਣਜ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-051":
      return Object.freeze([
        hi ? `अभाज्य गुणनखंड रूप ${factors} है।` : `ਅਭਾਜ ਗੁਣਨਖੰਡ ਰੂਪ ${factors} ਹੈ।`,
        hi ? `हर अभाज्य की ज्यामितीय राशि निकालकर सभी राशियों को गुणा किया जाता है।` : `ਹਰ ਅਭਾਜ ਦੀ ਜਿਆਮਿਤੀ ਲੜੀ ਦਾ ਜੋੜ ਕੱਢ ਕੇ ਸਾਰੇ ਜੋੜਾਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    case "NUM-QL-052": {
      const divisorCount = optionalStateValue<number>(question, "divisorCount");
      return Object.freeze([
        hi ? `संख्या ${factors} के ${divisorCount ?? "सभी"} धनात्मक भाजक हैं।` : `ਸੰਖਿਆ ${factors} ਦੇ ${divisorCount ?? "ਸਾਰੇ"} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ।`,
        hi ? `पूरक भाजक जोड़ियों का प्रत्येक गुणनफल n होता है।` : `ਪੂਰਕ ਭਾਜਕ ਜੋੜਿਆਂ ਦਾ ਹਰ ਗੁਣਨਫਲ n ਹੁੰਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-053":
      return Object.freeze([
        hi ? `अभाज्य घातों के सभी मान्य मेल बनाइए।` : `ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਸਾਰੇ ਮਨਜ਼ੂਰ ਮੇਲ ਬਣਾਓ।`,
        hi ? `मिले हुए अलग गुणनफलों को बढ़ते क्रम में रखिए।` : `ਮਿਲੇ ਵੱਖਰੇ ਗੁਣਨਫਲਾਂ ਨੂੰ ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ।`,
        result,
      ]);
    case "NUM-QL-054": {
      const known = stateValue<string>(question, "knownChoiceProduct");
      const hiddenChoices = stateValue<string>(question, "hiddenChoiceCount");
      return Object.freeze([
        hi ? `ज्ञात घातों से विकल्पों का गुणनफल ${known} मिलता है।` : `ਜਾਣੇ ਘਾਤਾਂ ਤੋਂ ਚੋਣਾਂ ਦਾ ਗੁਣਨਫਲ ${known} ਮਿਲਦਾ ਹੈ।`,
        hi ? `अज्ञात घात के लिए x + 1 = ${hiddenChoices} मिलता है।` : `ਅਣਜਾਣ ਘਾਤ ਲਈ x + 1 = ${hiddenChoices} ਮਿਲਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-055": {
      const prime = stateValue<number>(question, "prime");
      const target = stateValue<number>(question, "targetDivisorCount");
      return Object.freeze([
        hi ? `अभाज्य घात ${prime}^a के भाजकों की संख्या a + 1 होती है।` : `ਅਭਾਜ ਘਾਤ ${prime}^a ਦੇ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ a + 1 ਹੁੰਦੀ ਹੈ।`,
        hi ? `इसलिए a + 1 = ${target} रखकर घात निकाली जाती है।` : `ਇਸ ਲਈ a + 1 = ${target} ਰੱਖ ਕੇ ਘਾਤ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-056": {
      const pattern = optionalStateValue<string>(question, "exponentPattern") ?? "";
      return Object.freeze([
        hi ? `लक्षित भाजक संख्या को घात-विकल्प गुणकों में बाँटने पर घात क्रम ${pattern} मिलता है।` : `ਲੋੜੀਂਦੀ ਭਾਜਕ ਗਿਣਤੀ ਨੂੰ ਘਾਤ-ਚੋਣ ਗੁਣਕਾਂ ਵਿੱਚ ਵੰਡਣ ਉੱਤੇ ਘਾਤ ਕ੍ਰਮ ${pattern} ਮਿਲਦਾ ਹੈ।`,
        hi ? `बड़े घात छोटे अभाज्यों पर रखकर सबसे छोटी संख्या बनाई जाती है।` : `ਵੱਡੇ ਘਾਤ ਛੋਟੇ ਅਭਾਜਾਂ ਉੱਤੇ ਰੱਖ ਕੇ ਸਭ ਤੋਂ ਛੋਟੀ ਸੰਖਿਆ ਬਣਾਈ ਜਾਂਦੀ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-057": {
      const bound = stateValue<number>(question, "bound");
      const target = stateValue<number>(question, "targetDivisorCount");
      return Object.freeze([
        hi ? `${bound} से नीचे की संख्याएँ सम-विषम शर्त के अनुसार छाँटी जाती हैं।` : `${bound} ਤੋਂ ਹੇਠਾਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਟਾਂਕ-ਜਿਸਤ ਸ਼ਰਤ ਮੁਤਾਬਕ ਛਾਂਟੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।`,
        hi ? `हर बची संख्या के भाजक गिनकर ठीक ${target} वाली सबसे बड़ी संख्या ली जाती है।` : `ਹਰ ਬਚੀ ਸੰਖਿਆ ਦੇ ਭਾਜਕ ਗਿਣ ਕੇ ਠੀਕ ${target} ਵਾਲੀ ਸਭ ਤੋਂ ਵੱਡੀ ਸੰਖਿਆ ਲਈ ਜਾਂਦੀ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-058": {
      const bound = stateValue<string>(question, "bound");
      return Object.freeze([
        hi ? `n = ${factors} के धनात्मक भाजक बनाए जाते हैं।` : `n = ${factors} ਦੇ ਧਨਾਤਮਕ ਭਾਜਕ ਬਣਾਏ ਜਾਂਦੇ ਹਨ।`,
        hi ? `${bound} से अधिक मान हटाकर बचा सबसे बड़ा भाजक चुना जाता है।` : `${bound} ਤੋਂ ਵੱਧ ਮੁੱਲ ਹਟਾ ਕੇ ਬਚਿਆ ਸਭ ਤੋਂ ਵੱਡਾ ਭਾਜਕ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-059": {
      const index = stateValue<number>(question, "requestedIndex");
      return Object.freeze([
        hi ? `सभी धनात्मक भाजक बढ़ते क्रम में रखे जाते हैं।` : `ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕ ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੇ ਜਾਂਦੇ ਹਨ।`,
        hi ? `उस क्रम में स्थान ${index} का मान पढ़ा जाता है।` : `ਉਸ ਕ੍ਰਮ ਵਿੱਚ ਸਥਾਨ ${index} ਦਾ ਮੁੱਲ ਪੜ੍ਹਿਆ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-060": {
      const matches = stateValue<readonly number[]>(question, "matches");
      return Object.freeze([
        hi ? `सीमा की हर संख्या के धनात्मक भाजक गिने जाते हैं।` : `ਹੱਦ ਦੀ ਹਰ ਸੰਖਿਆ ਦੇ ਧਨਾਤਮਕ ਭਾਜਕ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।`,
        hi ? `शर्त पूरी करने वाली संख्याएँ ${listText(matches)} हैं।` : `ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ ${listText(matches)} ਹਨ।`,
        result,
      ]);
    }
    case "NUM-QL-061": {
      const actual = stateValue<string>(question, "actualValue");
      const claimed = stateValue<string>(question, "claimedValue");
      return Object.freeze([
        hi ? `सही भाजक-विशेषता का मान ${actual} निकलता है।` : `ਸਹੀ ਭਾਜਕ-ਗੁਣ ਦਾ ਮੁੱਲ ${actual} ਨਿਕਲਦਾ ਹੈ।`,
        hi ? `दावे में दिया मान ${claimed} है, इसलिए दोनों की तुलना की जाती है।` : `ਦਾਅਵੇ ਵਿੱਚ ਦਿੱਤਾ ਮੁੱਲ ${claimed} ਹੈ, ਇਸ ਲਈ ਦੋਵਾਂ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-062": {
      const actuals = stateValue<readonly number[]>(question, "actuals");
      return Object.freeze([
        hi ? `कुल, विषम और पूर्ण-वर्ग भाजकों के सही मान क्रमशः ${actuals.join(", ")} हैं।` : `ਕੁੱਲ, ਟਾਂਕ ਅਤੇ ਪੂਰਨ-ਵਰਗ ਭਾਜਕਾਂ ਦੇ ਸਹੀ ਮੁੱਲ ਕ੍ਰਮਵਾਰ ${actuals.join(", ")} ਹਨ।`,
        hi ? `इन मानों को कथन I, II और III से अलग-अलग मिलाया जाता है।` : `ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਨੂੰ ਕਥਨ I, II ਅਤੇ III ਨਾਲ ਵੱਖ-ਵੱਖ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-063": {
      const integerValue = stateValue<string>(question, "integerValue");
      const visible = stateValue<string>(question, "visiblePartner");
      return Object.freeze([
        hi ? `हर जोड़ी का गुणनफल ${integerValue} होना चाहिए।` : `ਹਰ ਜੋੜੇ ਦਾ ਗੁਣਨਫਲ ${integerValue} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
        hi ? `${integerValue} को दिख रहे जोड़ीदार ${visible} से भाग दिया जाता है।` : `${integerValue} ਨੂੰ ਦਿੱਖ ਰਹੇ ਜੋੜੀਦਾਰ ${visible} ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-064": {
      const pairs = stateValue<readonly (readonly number[])[]>(question, "canonicalPairs");
      return Object.freeze([
        hi ? `घातों की मान्य क्रमित जोड़ियाँ ${pairSetText(pairs)} हैं।` : `ਘਾਤਾਂ ਦੀਆਂ ਠੀਕ ਕ੍ਰਮਬੱਧ ਜੋੜੀਆਂ ${pairSetText(pairs)} ਹਨ।`,
        hi ? `इन जोड़ियों की संख्या से हल की श्रेणी तय होती है।` : `ਇਨ੍ਹਾਂ ਜੋੜਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਹੱਲ ਦੀ ਕਿਸਮ ਤੈਅ ਹੁੰਦੀ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-065": {
      const pairs = stateValue<readonly (readonly number[])[]>(question, "exponentPairs");
      return Object.freeze([
        hi ? `लक्षित भाजक संख्या की सभी मान्य क्रमित गुणक जोड़ियाँ ली जाती हैं।` : `ਲਕਸ਼ ਭਾਜਕ ਗਿਣਤੀ ਦੇ ਸਾਰੇ ਠੀਕ ਕ੍ਰਮਬੱਧ ਗੁਣਕ ਜੋੜੇ ਲਏ ਜਾਂਦੇ ਹਨ।`,
        hi ? `घात सीमाएँ लगाने के बाद जोड़ियाँ ${pairSetText(pairs)} बचती हैं।` : `ਘਾਤ ਹੱਦਾਂ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਜੋੜੀਆਂ ${pairSetText(pairs)} ਬਚਦੀਆਂ ਹਨ।`,
        result,
      ]);
    }
    case "NUM-QL-066": {
      const possible = stateValue<readonly string[]>(question, "possibleIntegers");
      return Object.freeze([
        hi ? `विषम भाजक संख्या से b और कुल भाजक संख्या से a निकाला जाता है।` : `ਟਾਂਕ ਭਾਜਕ ਗਿਣਤੀ ਤੋਂ b ਅਤੇ ਕੁੱਲ ਭਾਜਕ ਗਿਣਤੀ ਤੋਂ a ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।`,
        hi ? `अनुमत अभाज्यों से संभव पूर्णांक ${listText(possible)} मिलते हैं।` : `ਮਨਜ਼ੂਰ ਅਭਾਜਾਂ ਤੋਂ ਸੰਭਵ ਪੂਰਨ ਅੰਕ ${listText(possible)} ਮਿਲਦੇ ਹਨ।`,
        result,
      ]);
    }
    case "NUM-QL-067": {
      const total = stateValue<number>(question, "totalDivisors");
      const square = stateValue<number>(question, "squareDivisors");
      return Object.freeze([
        hi ? `हर पंक्ति के कुल और पूर्ण-वर्ग भाजक अलग-अलग गिने जाते हैं।` : `ਹਰ ਲਾਈਨ ਦੇ ਕੁੱਲ ਅਤੇ ਪੂਰਨ-ਵਰਗ ਭਾਜਕ ਵੱਖ-ਵੱਖ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।`,
        hi ? `सही पंक्ति में दोनों मान क्रमशः ${total} और ${square} होते हैं।` : `ਸਹੀ ਲਾਈਨ ਵਿੱਚ ਦੋਵੇਂ ਮੁੱਲ ਕ੍ਰਮਵਾਰ ${total} ਅਤੇ ${square} ਹੁੰਦੇ ਹਨ।`,
        result,
      ]);
    }
    case "NUM-QL-068": {
      const first = stateValue<string>(question, "firstValue");
      const second = stateValue<string>(question, "secondValue");
      return Object.freeze([
        hi ? `संख्या A के लिए चुनी भाजक-विशेषता का मान ${first} है।` : `ਸੰਖਿਆ A ਲਈ ਚੁਣੇ ਭਾਜਕ-ਗੁਣ ਦਾ ਮੁੱਲ ${first} ਹੈ।`,
        hi ? `संख्या B के लिए वही मान ${second} है; अब दोनों की तुलना की जाती है।` : `ਸੰਖਿਆ B ਲਈ ਉਹੀ ਮੁੱਲ ${second} ਹੈ; ਹੁਣ ਦੋਵਾਂ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
        result,
      ]);
    }
    case "NUM-QL-069": {
      const first = stateValue<readonly number[]>(question, "firstCandidates");
      const second = stateValue<readonly number[]>(question, "secondCandidates");
      const combined = stateValue<readonly number[]>(question, "combinedCandidates");
      return Object.freeze([
        hi ? `कथन I से x के मान ${listText(first)} बचते हैं।` : `ਕਥਨ I ਤੋਂ x ਦੇ ਮੁੱਲ ${listText(first)} ਬਚਦੇ ਹਨ।`,
        hi ? `कथन II से x के मान ${listText(second)} बचते हैं।` : `ਕਥਨ II ਤੋਂ x ਦੇ ਮੁੱਲ ${listText(second)} ਬਚਦੇ ਹਨ।`,
        hi ? `दोनों कथनों के साझा मान ${listText(combined)} हैं; इसलिए सही निष्कर्ष ${answer} है।` : `ਦੋਵੇਂ ਕਥਨਾਂ ਦੇ ਸਾਂਝੇ ਮੁੱਲ ${listText(combined)} ਹਨ; ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ ${answer} ਹੈ।`,
      ]);
    }
    default:
      throw new Error(`Unsupported NUM-CP-005 explanation QL: ${qlId}`);
  }
}

function localizedOptions(
  question: NumCp005PermanentQuestion,
  locale: NumCp005TranslatedLocale,
): readonly NumCp005LocalizedOption[] {
  const correctAnalysis = locale === "hi-IN"
    ? "यह विकल्प सही गणना से मिलता है।"
    : "ਇਹ ਚੋਣ ਸਹੀ ਗਿਣਤੀ ਨਾਲ ਮਿਲਦੀ ਹੈ।";
  const wrongAnalysis = locale === "hi-IN"
    ? "यह विकल्प किसी शर्त या भाजक-सूत्र की सामान्य गलती को दिखाता है।"
    : "ਇਹ ਚੋਣ ਕਿਸੇ ਸ਼ਰਤ ਜਾਂ ਭਾਜਕ ਨਿਯਮ ਦੀ ਆਮ ਗਲਤੀ ਦਿਖਾਉਂਦੀ ਹੈ।";
  return Object.freeze(question.options.map((option) => Object.freeze({
    ...option,
    value: translateNumCp005OptionValue(option.value, locale),
    analysis: option.isCorrect ? correctAnalysis : wrongAnalysis,
  })));
}

function localizedExplanation(
  question: NumCp005PermanentQuestion,
  locale: NumCp005TranslatedLocale,
  localizedAnswer: string,
): NumCp005LocalizedExplanation {
  const authority = NUM_CP005_LOCALIZED_AUTHORITY_TEXT[question.questionLanguageId][locale];
  return Object.freeze({
    coreConcept: authority.coreConcept,
    givenDataAndStrategy: authority.strategy,
    stepByStep: localizedSteps(question, locale, localizedAnswer),
    examSpeedMethod: authority.speedMethod,
    commonTraps: authority.traps,
    finalAnswer: locale === "hi-IN"
      ? `अंतिम उत्तर: ${localizedAnswer}`
      : `ਅੰਤਿਮ ਉੱਤਰ: ${localizedAnswer}`,
  });
}

export function localizeNumCp005Question(
  english: NumCp005PermanentQuestion,
  locale: NumCp005TranslatedLocale,
): NumCp005LocalizedQuestion {
  const language = locale === "hi-IN" ? "hi" : "pa";
  const canonicalAnswer = translateNumCp005OptionValue(english.canonicalAnswer, locale);
  const options = localizedOptions(english, locale);
  if (options[english.correctIndex]?.value !== canonicalAnswer) {
    throw new Error(`${english.questionLanguageId}/${english.seed}/${locale}: localized answer/index mismatch`);
  }

  return Object.freeze({
    ...english,
    locale,
    language,
    stem: localizedStem(english, locale),
    options,
    canonicalAnswer,
    verifierAnswer: translateNumCp005OptionValue(english.verifierAnswer, locale),
    explanation: localizedExplanation(english, locale, canonicalAnswer),
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    lifecycle: Object.freeze({
      permanentQlId: english.permanentQlId,
      maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
    localization: Object.freeze({
      localizationVersion: "num-cp005-hi-pa-localisation-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: english.questionId,
      canonicalAnswer: english.canonicalAnswer,
      canonicalVerifierAnswer: english.verifierAnswer,
      locale,
      language,
      status: "EXECUTABLE_REVIEW_REQUIRED",
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      lifecycleLocked: true,
    }),
  });
}
