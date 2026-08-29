import { generateNumCp011Permanent, type NumCp011PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp011PermanentQlId } from "../permanent-allocation.ts";
import type {
  NumCp011LocalizedLanguage,
  NumCp011LocalizedLocale,
  NumCp011LocalizedPackage,
} from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type Row = Readonly<Record<string, unknown>>;
type LocalizedContent = Readonly<{
  stem: string;
  coreConcept: string;
  strategy: string;
  steps: readonly string[];
}>;

function localeFor(language: NumCp011LocalizedLanguage): NumCp011LocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function choose(language: NumCp011LocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function num(state: State | Row, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Expected numeric state field ${key}`);
  return value;
}

function bool(state: State, key: string): boolean {
  const value = state[key];
  if (typeof value !== "boolean") throw new Error(`Expected boolean state field ${key}`);
  return value;
}

function nums(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number")) throw new Error(`Expected numeric array ${key}`);
  return [...value];
}

function rows(state: State, key: string): Row[] {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "object" || item === null)) throw new Error(`Expected row array ${key}`);
  return value as Row[];
}

function pairs(state: State, key: string): Array<readonly [number, number]> {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Expected pair array ${key}`);
  return value.map((item) => {
    if (!Array.isArray(item) || item.length !== 2 || typeof item[0] !== "number" || typeof item[1] !== "number") {
      throw new Error(`Malformed pair in ${key}`);
    }
    return [item[0], item[1]] as const;
  });
}

function factorText(values: readonly (readonly [number, number])[]): string {
  return values.map(([p, e]) => e === 1 ? `${p}` : `${p}^${e}`).join(" × ");
}

function localizedOption(value: string, language: NumCp011LocalizedLanguage): string {
  if (value !== "No positive integer n") return value;
  return choose(language, "कोई धनात्मक पूर्णांक n नहीं", "ਕੋਈ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ");
}

function content(q: NumCp011PermanentPackage, language: NumCp011LocalizedLanguage): LocalizedContent {
  const s = q.hiddenState as State;
  const L = (hi: string, pa: string) => choose(language, hi, pa);

  switch (q.temporaryPrototypeId) {
    case "NUM-CP011-PROT-001": {
      const prime = num(s, "prime");
      const terms = nums(s, "terms");
      const exponents = nums(s, "exponents");
      return {
        stem: L(`${terms.join(" × ")} के अभाज्य गुणनखंडन में ${prime} की घात क्या है?`, `${terms.join(" × ")} ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਵਿੱਚ ${prime} ਦੀ ਘਾਤ ਕੀ ਹੈ?`),
        coreConcept: L("किसी गुणनफल में एक अभाज्य की कुल घात, सभी गुणकों में उस अभाज्य की घातों का योग होती है।", "ਕਿਸੇ ਗੁਣਨਫਲ ਵਿੱਚ ਇੱਕ ਅਭਾਜ ਦੀ ਕੁੱਲ ਘਾਤ, ਸਾਰੇ ਗੁਣਕਾਂ ਵਿੱਚ ਉਸ ਅਭਾਜ ਦੀਆਂ ਘਾਤਾਂ ਦਾ ਜੋੜ ਹੁੰਦੀ ਹੈ।"),
        strategy: L(`हर पद में ${prime} के गुणकों की संख्या गिनकर उन्हें जोड़ें।`, `ਹਰ ਪਦ ਵਿੱਚ ${prime} ਦੇ ਗੁਣਕਾਂ ਦੀ ਗਿਣਤੀ ਕਰਕੇ ਉਹਨਾਂ ਨੂੰ ਜੋੜੋ।`),
        steps: [
          L(`तीनों पद क्रमशः ${exponents.join(", ")} गुणक ${prime} देते हैं।`, `ਤਿੰਨੇ ਪਦ ਕ੍ਰਮਵਾਰ ${exponents.join(", ")} ਗੁਣਕ ${prime} ਦਿੰਦੇ ਹਨ।`),
          L(`कुल घात = ${exponents.join(" + ")} = ${q.canonicalAnswer}.`, `ਕੁੱਲ ਘਾਤ = ${exponents.join(" + ")} = ${q.canonicalAnswer}.`),
        ],
      };
    }
    case "NUM-CP011-PROT-002": {
      const prime = num(s, "prime"); const n = num(s, "n"); const terms = nums(s, "terms");
      return {
        stem: L(`सबसे बड़ा पूर्णांक k ज्ञात कीजिए जिसके लिए ${prime}^k, ${n}! को विभाजित करता है।`, `ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ k ਕੱਢੋ ਜਿਸ ਲਈ ${prime}^k, ${n}! ਨੂੰ ਭਾਗ ਦਿੰਦਾ ਹੈ।`),
        coreConcept: L(`फैक्टोरियल में ${prime} की घात गिनने के लिए ${prime}, ${prime}^2, ${prime}^3 ... के गुणजों से मिलने वाले सभी योगदान जोड़े जाते हैं।`, `ਫੈਕਟੋਰੀਅਲ ਵਿੱਚ ${prime} ਦੀ ਘਾਤ ਗਿਣਣ ਲਈ ${prime}, ${prime}^2, ${prime}^3 ... ਦੇ ਗੁਣਜਾਂ ਤੋਂ ਮਿਲਦੇ ਸਾਰੇ ਯੋਗਦਾਨ ਜੋੜੇ ਜਾਂਦੇ ਹਨ।`),
        strategy: L("Legendre योग के सभी गैर-शून्य पद जोड़ें।", "Legendre ਜੋੜ ਦੇ ਸਾਰੇ ਗੈਰ-ਸਿਫ਼ਰ ਪਦ ਜੋੜੋ।"),
        steps: [L(`योग के पद हैं ${terms.join(" + ")}.`, `ਜੋੜ ਦੇ ਪਦ ਹਨ ${terms.join(" + ")}.`), L(`इनका योग ${q.canonicalAnswer} है, इसलिए k = ${q.canonicalAnswer}.`, `ਇਹਨਾਂ ਦਾ ਜੋੜ ${q.canonicalAnswer} ਹੈ, ਇਸ ਲਈ k = ${q.canonicalAnswer}.`)],
      };
    }
    case "NUM-CP011-PROT-003": {
      const prime = num(s, "prime"); const n = num(s, "n"); const m = num(s, "m"); const nv = num(s, "nValuation"); const mv = num(s, "mValuation");
      return {
        stem: L(`पूर्णांक ${n}!/${m}! में ${prime} की घात क्या है?`, `ਪੂਰਨ ਅੰਕ ${n}!/${m}! ਵਿੱਚ ${prime} ਦੀ ਘਾਤ ਕੀ ਹੈ?`),
        coreConcept: L("सटीक भाग में अभाज्य घातें घटती हैं: अंश की घात में से हर की घात घटाएँ।", "ਸਹੀ ਭਾਗ ਵਿੱਚ ਅਭਾਜ ਘਾਤਾਂ ਘਟਦੀਆਂ ਹਨ: ਅੰਸ਼ ਦੀ ਘਾਤ ਵਿੱਚੋਂ ਹਰ ਦੀ ਘਾਤ ਘਟਾਓ।"),
        strategy: L(`${n}! और ${m}! में ${prime} की घात अलग-अलग निकालकर अंतर लें।`, `${n}! ਅਤੇ ${m}! ਵਿੱਚ ${prime} ਦੀ ਘਾਤ ਵੱਖ-ਵੱਖ ਕੱਢ ਕੇ ਅੰਤਰ ਲਵੋ।`),
        steps: [L(`v_${prime}(${n}!) = ${nv} और v_${prime}(${m}!) = ${mv}.`, `v_${prime}(${n}!) = ${nv} ਅਤੇ v_${prime}(${m}!) = ${mv}.`), L(`अतः ${nv} − ${mv} = ${q.canonicalAnswer}.`, `ਇਸ ਲਈ ${nv} − ${mv} = ${q.canonicalAnswer}.`)],
      };
    }
    case "NUM-CP011-PROT-004": {
      const base = num(s, "base"); const n = num(s, "n"); const fs = pairs(s, "factors"); const rs = rows(s, "canonicalRows");
      return {
        stem: L(`सबसे बड़ा पूर्णांक k ज्ञात कीजिए जिसके लिए ${base}^k, ${n}! को विभाजित करता है।`, `ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ k ਕੱਢੋ ਜਿਸ ਲਈ ${base}^k, ${n}! ਨੂੰ ਭਾਗ ਦਿੰਦਾ ਹੈ।`),
        coreConcept: L("संयुक्त आधार की हर अभाज्य आवश्यकता एक साथ पूरी होनी चाहिए; सबसे सीमित अनुपात उत्तर तय करता है।", "ਸੰਯੁਕਤ ਆਧਾਰ ਦੀ ਹਰ ਅਭਾਜ ਲੋੜ ਇਕੱਠੇ ਪੂਰੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ; ਸਭ ਤੋਂ ਸੀਮਿਤ ਅਨੁਪਾਤ ਉੱਤਰ ਤੈਅ ਕਰਦਾ ਹੈ।"),
        strategy: L(`${base} = ${factorText(fs)} का उपयोग करके हर आवश्यक अभाज्य की उपलब्ध घात को उसकी प्रति-प्रतिलिपि आवश्यकता से भाग दें और न्यूनतम लें।`, `${base} = ${factorText(fs)} ਵਰਤ ਕੇ ਹਰ ਲੋੜੀਂਦੇ ਅਭਾਜ ਦੀ ਉਪਲਬਧ ਘਾਤ ਨੂੰ ਪ੍ਰਤੀ ਨਕਲ ਲੋੜ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਘੱਟੋ-ਘੱਟ ਲਵੋ।`),
        steps: [...rs.map((r) => L(`अभाज्य ${num(r,"prime")}: floor(${num(r,"available")}/${num(r,"required")}) = ${num(r,"quotient")}.`, `ਅਭਾਜ ${num(r,"prime")}: floor(${num(r,"available")}/${num(r,"required")}) = ${num(r,"quotient")}.`)), L(`सबसे छोटा मान ${q.canonicalAnswer} है, इसलिए k = ${q.canonicalAnswer}.`, `ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ${q.canonicalAnswer} ਹੈ, ਇਸ ਲਈ k = ${q.canonicalAnswer}.`)],
      };
    }
    case "NUM-CP011-PROT-005": {
      const n = num(s, "n"); const fiveTerms = nums(s, "fiveTerms");
      return {
        stem: L(`${n}! में अंत के कितने शून्य हैं?`, `${n}! ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹਨ?`),
        coreConcept: L("दशमलव में हर अंतिम शून्य के लिए 2 × 5 की एक जोड़ी चाहिए। फैक्टोरियल में 2 अधिक होते हैं, इसलिए 5 की संख्या निर्णायक है।", "ਦਸ਼ਮਲਵ ਵਿੱਚ ਹਰ ਅੰਤਲੇ ਸਿਫ਼ਰ ਲਈ 2 × 5 ਦੀ ਇੱਕ ਜੋੜੀ ਚਾਹੀਦੀ ਹੈ। ਫੈਕਟੋਰੀਅਲ ਵਿੱਚ 2 ਵੱਧ ਹੁੰਦੇ ਹਨ, ਇਸ ਲਈ 5 ਦੀ ਗਿਣਤੀ ਨਿਰਣਾਇਕ ਹੈ।"),
        strategy: L("5, 25, 125 ... के गुणजों से मिलने वाले 5 के सभी गुणक गिनें।", "5, 25, 125 ... ਦੇ ਗੁਣਜਾਂ ਤੋਂ ਮਿਲਦੇ 5 ਦੇ ਸਾਰੇ ਗੁਣਕ ਗਿਣੋ।"),
        steps: [L(`योग के पद ${fiveTerms.join(" + ")} हैं।`, `ਜੋੜ ਦੇ ਪਦ ${fiveTerms.join(" + ")} ਹਨ।`), L(`योग ${q.canonicalAnswer} है, इसलिए अंतिम शून्यों की संख्या ${q.canonicalAnswer} है।`, `ਜੋੜ ${q.canonicalAnswer} ਹੈ, ਇਸ ਲਈ ਅੰਤਲੇ ਸਿਫ਼ਰਾਂ ਦੀ ਗਿਣਤੀ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP011-PROT-006": {
      const base = num(s, "base"); const n = num(s, "n"); const fs = pairs(s, "factors"); const rs = rows(s, "canonicalRows");
      return {
        stem: L(`${n}! को आधार ${base} में लिखने पर अंत में कितने शून्य होंगे?`, `${n}! ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਲਿਖਣ ਤੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹੋਣਗੇ?`),
        coreConcept: L(`आधार ${base} में एक अंतिम शून्य के लिए ${base} = ${factorText(fs)} का एक पूरा गुणक चाहिए।`, `ਆਧਾਰ ${base} ਵਿੱਚ ਇੱਕ ਅੰਤਲੇ ਸਿਫ਼ਰ ਲਈ ${base} = ${factorText(fs)} ਦਾ ਇੱਕ ਪੂਰਾ ਗੁਣਕ ਚਾਹੀਦਾ ਹੈ।`),
        strategy: L("हर आधार-अभाज्य की फैक्टोरियल घात को आवश्यक घात से भाग दें और सबसे छोटी क्षमता लें।", "ਹਰ ਆਧਾਰ-ਅਭਾਜ ਦੀ ਫੈਕਟੋਰੀਅਲ ਘਾਤ ਨੂੰ ਲੋੜੀਂਦੀ ਘਾਤ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟੀ ਸਮਰੱਥਾ ਲਵੋ।"),
        steps: [...rs.map((r) => L(`अभाज्य ${num(r,"prime")}: ${num(r,"available")} उपलब्ध, प्रति शून्य ${num(r,"required")} चाहिए, क्षमता ${num(r,"groups")}.`, `ਅਭਾਜ ${num(r,"prime")}: ${num(r,"available")} ਉਪਲਬਧ, ਪ੍ਰਤੀ ਸਿਫ਼ਰ ${num(r,"required")} ਚਾਹੀਦੇ, ਸਮਰੱਥਾ ${num(r,"groups")}.`)), L(`सीमित क्षमता ${q.canonicalAnswer} है।`, `ਸੀਮਿਤ ਸਮਰੱਥਾ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP011-PROT-007": {
      const prime = num(s,"prime"); const target = num(s,"target"); const correct = num(s,"correct"); const before = num(s,"before"); const at = num(s,"at");
      return {
        stem: L(`सबसे छोटा धनात्मक पूर्णांक n ज्ञात कीजिए जिसके लिए ${prime}^${target}, n! को विभाजित करता है।`, `ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਕੱਢੋ ਜਿਸ ਲਈ ${prime}^${target}, n! ਨੂੰ ਭਾਗ ਦਿੰਦਾ ਹੈ।`),
        coreConcept: L("v_p(n!) n के साथ घटता नहीं है, इसलिए न्यूनतम n सीमा-पार करने का पहला बिंदु है।", "v_p(n!) n ਦੇ ਨਾਲ ਘਟਦਾ ਨਹੀਂ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ n ਸੀਮਾ ਪਾਰ ਕਰਨ ਦਾ ਪਹਿਲਾ ਬਿੰਦੂ ਹੈ।"),
        strategy: L(`पहला n खोजें जहाँ ${prime} की घात कम से कम ${target} हो।`, `ਪਹਿਲਾ n ਲੱਭੋ ਜਿੱਥੇ ${prime} ਦੀ ਘਾਤ ਘੱਟੋ-ਘੱਟ ${target} ਹੋਵੇ।`),
        steps: [L(`n = ${correct-1} पर घात ${before} है, जो ${target} से कम है।`, `n = ${correct-1} ਤੇ ਘਾਤ ${before} ਹੈ, ਜੋ ${target} ਤੋਂ ਘੱਟ ਹੈ।`), L(`n = ${correct} पर घात ${at} हो जाती है, इसलिए उत्तर ${correct} है।`, `n = ${correct} ਤੇ ਘਾਤ ${at} ਹੋ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`)],
      };
    }
    case "NUM-CP011-PROT-008": {
      const prime = num(s,"prime"); const target = num(s,"target"); const decimal = bool(s,"decimalRepresentation"); const values = nums(s,"canonicalValues"); const crossing = num(s,"crossing");
      const answerText = localizedOption(q.canonicalAnswer, language);
      return {
        stem: decimal
          ? L(`कौन-सा विकल्प उन सभी धनात्मक पूर्णांकों n को देता है जिनके लिए n! में ठीक ${target} अंतिम शून्य हैं?`, `ਕਿਹੜਾ ਵਿਕਲਪ ਉਹ ਸਾਰੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਦਿੰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਲਈ n! ਦੇ ਅੰਤ ਵਿੱਚ ਠੀਕ ${target} ਸਿਫ਼ਰ ਹਨ?`)
          : L(`कौन-सा विकल्प उन सभी धनात्मक पूर्णांकों n को देता है जिनके लिए n! में ${prime} की घात ठीक ${target} है?`, `ਕਿਹੜਾ ਵਿਕਲਪ ਉਹ ਸਾਰੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਦਿੰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਲਈ n! ਵਿੱਚ ${prime} ਦੀ ਘਾਤ ਠੀਕ ${target} ਹੈ?`),
        coreConcept: decimal
          ? L("फैक्टोरियल के दशमलव अंतिम शून्य v_5(n!) के बराबर होते हैं; इसलिए यह सटीक valuation-preimage प्रश्न है।", "ਫੈਕਟੋਰੀਅਲ ਦੇ ਦਸ਼ਮਲਵ ਅੰਤਲੇ ਸਿਫ਼ਰ v_5(n!) ਦੇ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ ਇਹ ਸਹੀ valuation-preimage ਪ੍ਰਸ਼ਨ ਹੈ।")
          : L("फैक्टोरियल valuation कई लगातार n पर समान रह सकती है या किसी मान को छलांग में छोड़ सकती है।", "ਫੈਕਟੋਰੀਅਲ valuation ਕਈ ਲਗਾਤਾਰ n ਤੇ ਇਕੋ ਰਹਿ ਸਕਦੀ ਹੈ ਜਾਂ ਕਿਸੇ ਮੁੱਲ ਨੂੰ ਛਾਲ ਵਿੱਚ ਛੱਡ ਸਕਦੀ ਹੈ।"),
        strategy: L(`पहले n को खोजें जहाँ valuation ${target} तक पहुँचती है, फिर जहाँ ${target+1} तक पहुँचती है।`, `ਪਹਿਲਾਂ n ਲੱਭੋ ਜਿੱਥੇ valuation ${target} ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ, ਫਿਰ ਜਿੱਥੇ ${target+1} ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ।`),
        steps: values.length === 0
          ? [L(`पहली सीमा n = ${crossing} पर valuation ${target} से आगे निकल चुकी है।`, `ਪਹਿਲੀ ਸੀਮਾ n = ${crossing} ਤੇ valuation ${target} ਤੋਂ ਅੱਗੇ ਨਿਕਲ ਚੁੱਕੀ ਹੈ।`), L(`इसलिए कोई सटीक हल नहीं है: ${answerText}.`, `ਇਸ ਲਈ ਕੋਈ ਸਹੀ ਹੱਲ ਨਹੀਂ ਹੈ: ${answerText}.`)]
          : [L(`पहला हल n = ${values[0]} है।`, `ਪਹਿਲਾ ਹੱਲ n = ${values[0]} ਹੈ।`), L(`valuation n = ${values.at(-1)} तक ${target} रहती है, इसलिए पूरा हल-समुच्चय ${q.canonicalAnswer} है।`, `valuation n = ${values.at(-1)} ਤੱਕ ${target} ਰਹਿੰਦੀ ਹੈ, ਇਸ ਲਈ ਪੂਰਾ ਹੱਲ-ਸਮੂਹ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP011-PROT-009": {
      const base = num(s,"base"); const target = num(s,"target"); const correct = num(s,"correct"); const before = num(s,"before"); const at = num(s,"at"); const fs = pairs(s,"factors");
      return {
        stem: L(`सबसे छोटा धनात्मक पूर्णांक n ज्ञात कीजिए ताकि n! को आधार ${base} में लिखने पर अंत में कम से कम ${target} शून्य हों।`, `ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਕੱਢੋ ਤਾਂ ਜੋ n! ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਲਿਖਣ ਤੇ ਅੰਤ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ${target} ਸਿਫ਼ਰ ਹੋਣ।`),
        coreConcept: L(`आधार ${base} = ${factorText(fs)} का हर आवश्यक अभाज्य भाग एक साथ उपलब्ध होना चाहिए।`, `ਆਧਾਰ ${base} = ${factorText(fs)} ਦਾ ਹਰ ਲੋੜੀਂਦਾ ਅਭਾਜ ਭਾਗ ਇਕੱਠੇ ਉਪਲਬਧ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`),
        strategy: L("आधार-गुणकों की सीमित क्षमता का वह पहला n खोजें जहाँ शून्य-गिनती लक्ष्य तक पहुँचे।", "ਆਧਾਰ-ਗੁਣਕਾਂ ਦੀ ਸੀਮਿਤ ਸਮਰੱਥਾ ਦਾ ਉਹ ਪਹਿਲਾ n ਲੱਭੋ ਜਿੱਥੇ ਸਿਫ਼ਰ-ਗਿਣਤੀ ਟੀਚੇ ਤੱਕ ਪਹੁੰਚੇ।"),
        steps: [L(`n = ${correct-1} पर शून्य-गिनती ${before} है।`, `n = ${correct-1} ਤੇ ਸਿਫ਼ਰ-ਗਿਣਤੀ ${before} ਹੈ।`), L(`n = ${correct} पर यह ${at} हो जाती है, इसलिए न्यूनतम n = ${correct}.`, `n = ${correct} ਤੇ ਇਹ ${at} ਹੋ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ n = ${correct}.`)],
      };
    }
    case "NUM-CP011-PROT-010": {
      const integer = num(s,"integer"); const fs = pairs(s,"factors"); const ts = rows(s,"thresholds");
      return {
        stem: L(`सबसे छोटा धनात्मक पूर्णांक n ज्ञात कीजिए जिसके लिए ${integer}, n! को विभाजित करता है।`, `ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਕੱਢੋ ਜਿਸ ਲਈ ${integer}, n! ਨੂੰ ਭਾਗ ਦਿੰਦਾ ਹੈ।`),
        coreConcept: L("संयुक्त संख्या के हर अभाज्य-घात गुणक को n! में पर्याप्त मात्रा में उपस्थित होना चाहिए।", "ਸੰਯੁਕਤ ਸੰਖਿਆ ਦੇ ਹਰ ਅਭਾਜ-ਘਾਤ ਗੁਣਕ ਨੂੰ n! ਵਿੱਚ ਕਾਫ਼ੀ ਮਾਤਰਾ ਵਿੱਚ ਮੌਜੂਦ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
        strategy: L(`${integer} = ${factorText(fs)} के हर अभाज्य-घात के लिए न्यूनतम n निकालें और उन सीमाओं का अधिकतम लें।`, `${integer} = ${factorText(fs)} ਦੇ ਹਰ ਅਭਾਜ-ਘਾਤ ਲਈ ਘੱਟੋ-ਘੱਟ n ਕੱਢੋ ਅਤੇ ਉਹਨਾਂ ਸੀਮਾਵਾਂ ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਲਵੋ।`),
        steps: [...ts.map((r) => L(`${num(r,"prime")}^${num(r,"exponent")} की जरूरत पहली बार n = ${num(r,"leastN")} पर पूरी होती है।`, `${num(r,"prime")}^${num(r,"exponent")} ਦੀ ਲੋੜ ਪਹਿਲੀ ਵਾਰ n = ${num(r,"leastN")} ਤੇ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`)), L(`सभी शर्तें पहली बार n = ${q.canonicalAnswer} पर साथ पूरी होती हैं।`, `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪਹਿਲੀ ਵਾਰ n = ${q.canonicalAnswer} ਤੇ ਇਕੱਠੀਆਂ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।`)],
      };
    }
    case "NUM-CP011-PROT-011": {
      const prime = num(s,"prime"); const base = num(s,"base"); const bv = num(s,"baseValuation"); const multiplier = num(s,"multiplier"); const mv = num(s,"multiplierValuation"); const target = num(s,"target");
      return {
        stem: L(`${base} × ${multiplier}^x के अभाज्य गुणनखंडन में ${prime} की घात ${target} है। x ज्ञात कीजिए।`, `${base} × ${multiplier}^x ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਵਿੱਚ ${prime} ਦੀ ਘਾਤ ${target} ਹੈ। x ਕੱਢੋ।`),
        coreConcept: L("Prime valuation गुणन को जोड़ में बदल देती है; इसलिए अज्ञात साधारण घात x एक रैखिक योगदान बनती है।", "Prime valuation ਗੁਣਾ ਨੂੰ ਜੋੜ ਵਿੱਚ ਬਦਲ ਦਿੰਦੀ ਹੈ; ਇਸ ਲਈ ਅਣਜਾਣ ਆਮ ਘਾਤ x ਇੱਕ ਰੇਖੀ ਯੋਗਦਾਨ ਬਣਦੀ ਹੈ।"),
        strategy: L(`${base} में मौजूद ${prime}-गुणक गिनें, फिर ${multiplier} की हर प्रति का योगदान लेकर समीकरण हल करें।`, `${base} ਵਿੱਚ ਮੌਜੂਦ ${prime}-ਗੁਣਕ ਗਿਣੋ, ਫਿਰ ${multiplier} ਦੀ ਹਰ ਨਕਲ ਦਾ ਯੋਗਦਾਨ ਲੈ ਕੇ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।`),
        steps: [L(`${base} का योगदान ${bv} और ${multiplier} की हर प्रति का योगदान ${mv} है।`, `${base} ਦਾ ਯੋਗਦਾਨ ${bv} ਅਤੇ ${multiplier} ਦੀ ਹਰ ਨਕਲ ਦਾ ਯੋਗਦਾਨ ${mv} ਹੈ।`), L(`${bv} + ${mv}x = ${target}, इसलिए x = ${q.canonicalAnswer}.`, `${bv} + ${mv}x = ${target}, ਇਸ ਲਈ x = ${q.canonicalAnswer}.`)],
      };
    }
    case "NUM-CP011-PROT-012": {
      const base = num(s,"base"); const n = num(s,"n"); const m = num(s,"m"); const fs = pairs(s,"factors"); const rs = rows(s,"rows");
      return {
        stem: base === 10
          ? L(`पूर्णांक ${n}!/${m}! में अंत के कितने शून्य हैं?`, `ਪੂਰਨ ਅੰਕ ${n}!/${m}! ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹਨ?`)
          : L(`${n}!/${m}! को आधार ${base} में लिखने पर अंत में कितने शून्य होंगे?`, `${n}!/${m}! ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਲਿਖਣ ਤੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹੋਣਗੇ?`),
        coreConcept: L(`पहले हर में मौजूद अभाज्य गुणक रद्द करें; फिर आधार ${base} = ${factorText(fs)} के पूरे समूह गिनें।`, `ਪਹਿਲਾਂ ਹਰ ਵਿੱਚ ਮੌਜੂਦ ਅਭਾਜ ਗੁਣਕ ਰੱਦ ਕਰੋ; ਫਿਰ ਆਧਾਰ ${base} = ${factorText(fs)} ਦੇ ਪੂਰੇ ਸਮੂਹ ਗਿਣੋ।`),
        strategy: L("हर आवश्यक अभाज्य के लिए numerator factorial valuation में से denominator valuation घटाएँ, फिर प्रति-शून्य आवश्यकता से भाग दें।", "ਹਰ ਲੋੜੀਂਦੇ ਅਭਾਜ ਲਈ numerator factorial valuation ਵਿੱਚੋਂ denominator valuation ਘਟਾਓ, ਫਿਰ ਪ੍ਰਤੀ-ਸਿਫ਼ਰ ਲੋੜ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        steps: [...rs.map((r) => L(`अभाज्य ${num(r,"prime")}: ${num(r,"numerator")} − ${num(r,"denominator")} = ${num(r,"surviving")}; इससे ${num(r,"groups")} पूरे समूह बनते हैं।`, `ਅਭਾਜ ${num(r,"prime")}: ${num(r,"numerator")} − ${num(r,"denominator")} = ${num(r,"surviving")}; ਇਸ ਨਾਲ ${num(r,"groups")} ਪੂਰੇ ਸਮੂਹ ਬਣਦੇ ਹਨ।`)), L(`सीमित समूह-गिनती ${q.canonicalAnswer} है।`, `ਸੀਮਿਤ ਸਮੂਹ-ਗਿਣਤੀ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP011-PROT-013": {
      const base = num(s,"base"); const fs = pairs(s,"baseFactors"); const ts = rows(s,"terms"); const cs = rows(s,"capacities");
      const expression = ts.map((r) => num(r,"exponent") === 1 ? `${num(r,"coefficient")}` : `${num(r,"coefficient")}^${num(r,"exponent")}`).join(" × ");
      return {
        stem: base === 10
          ? L(`गुणनफल ${expression} में अंत के कितने शून्य हैं?`, `ਗੁਣਨਫਲ ${expression} ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹਨ?`)
          : L(`गुणनफल ${expression} को आधार ${base} में लिखने पर अंत में कितने शून्य होंगे?`, `ਗੁਣਨਫਲ ${expression} ਨੂੰ ਆਧਾਰ ${base} ਵਿੱਚ ਲਿਖਣ ਤੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹੋਣਗੇ?`),
        coreConcept: L(`आधार ${base} = ${factorText(fs)} का एक पूरा गुणक बनाने के लिए सभी पदों से मिलने वाले आवश्यक अभाज्य गुणक जोड़ने पड़ते हैं।`, `ਆਧਾਰ ${base} = ${factorText(fs)} ਦਾ ਇੱਕ ਪੂਰਾ ਗੁਣਕ ਬਣਾਉਣ ਲਈ ਸਾਰੇ ਪਦਾਂ ਤੋਂ ਮਿਲਦੇ ਲੋੜੀਂਦੇ ਅਭਾਜ ਗੁਣਕ ਜੋੜਣੇ ਪੈਂਦੇ ਹਨ।`),
        strategy: L("पूरे गुणनफल में हर आधार-अभाज्य की कुल valuation जोड़ें, प्रति आधार आवश्यक मात्रा से भाग दें और न्यूनतम लें।", "ਪੂਰੇ ਗੁਣਨਫਲ ਵਿੱਚ ਹਰ ਆਧਾਰ-ਅਭਾਜ ਦੀ ਕੁੱਲ valuation ਜੋੜੋ, ਪ੍ਰਤੀ ਆਧਾਰ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਘੱਟੋ-ਘੱਟ ਲਵੋ।"),
        steps: [...cs.map((r) => L(`अभाज्य ${num(r,"prime")}: कुल ${num(r,"total")}, प्रति शून्य ${num(r,"required")}, क्षमता ${num(r,"groups")}.`, `ਅਭਾਜ ${num(r,"prime")}: ਕੁੱਲ ${num(r,"total")}, ਪ੍ਰਤੀ ਸਿਫ਼ਰ ${num(r,"required")}, ਸਮਰੱਥਾ ${num(r,"groups")}.`)), L(`सीमित क्षमता ${q.canonicalAnswer} है।`, `ਸੀਮਿਤ ਸਮਰੱਥਾ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    default:
      throw new Error(`Unsupported CP011 localization prototype: ${q.temporaryPrototypeId}`);
  }
}

export function generateNumCp011Localized(
  qlId: NumCp011PermanentQlId,
  seed: number,
  language: NumCp011LocalizedLanguage,
): NumCp011LocalizedPackage {
  const source = generateNumCp011Permanent(qlId, seed);
  const localized = content(source, language);
  const options = Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    value: localizedOption(option.value, language),
  })));

  return Object.freeze({
    ...source,
    language,
    locale: localeFor(language),
    stem: localized.stem,
    options,
    explanation: Object.freeze({
      coreConcept: localized.coreConcept,
      strategy: localized.strategy,
      steps: Object.freeze([...localized.steps]),
      finalAnswer: localizedOption(source.explanation.finalAnswer, language),
    }),
    lifecycle: Object.freeze({
      permanentQlId: source.permanentQlId,
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  }) as NumCp011LocalizedPackage;
}
