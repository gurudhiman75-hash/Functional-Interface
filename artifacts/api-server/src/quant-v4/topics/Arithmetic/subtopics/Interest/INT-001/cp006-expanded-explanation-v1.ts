import { add, div, mul, pow, rat, sub, type Rational } from "./cp003-exam-model";
import { siCiDifference, type IntCp006QlId, type IntCp006State } from "./cp006-si-ci-relations-runtime-v4-final";

export const INT_CP006_EXPANDED_EXPLANATION_VERSION = "INT-CP-006-EXPL-v1-review" as const;
export type IntCp006ExplanationLocale = "en-IN" | "hi-IN" | "pa-IN";

function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return `${sign}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function exactDecimal(value: Rational): string {
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator !== 0n) return flexibleDecimal(value);
  const hundredths = scaled / value.denominator;
  const sign = hundredths < 0n ? "-" : "";
  const magnitude = hundredths < 0n ? -hundredths : hundredths;
  const whole = magnitude / 100n;
  const fraction = magnitude % 100n;
  const wholeText = indianInteger(whole);
  if (fraction === 0n) return `${sign}${wholeText}`;
  if (fraction % 10n === 0n) return `${sign}${wholeText}.${fraction / 10n}`;
  return `${sign}${wholeText}.${fraction.toString().padStart(2, "0")}`;
}
function flexibleDecimal(value: Rational): string {
  const number = Number(value.numerator) / Number(value.denominator);
  if (!Number.isFinite(number)) throw new Error(`CP006 explanation non-finite value ${value.numerator}/${value.denominator}`);
  return number.toFixed(6).replace(/\.0+$/u, "").replace(/(\.\d*?[1-9])0+$/u, "$1");
}
const money = (value: Rational): string => `₹${exactDecimal(value)}`;
const percent = (value: Rational): string => `${exactDecimal(value)}%`;
const numberText = (value: Rational): string => flexibleDecimal(value);
const rateDecimal = (value: Rational): Rational => div(value, rat(100));
const factor = (value: Rational): Rational => add(rat(1), rateDecimal(value));

function t(locale: IntCp006ExplanationLocale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}
function yearText(year: number, locale: IntCp006ExplanationLocale): string {
  if (locale === "en-IN") return year === 1 ? "1 year" : `${year} years`;
  return locale === "hi-IN" ? `${year} वर्ष` : `${year} ਸਾਲ`;
}
function rateFromSiCi(simple2: Rational, compound2: Rational): Rational {
  return div(mul(sub(compound2, simple2), rat(200)), simple2);
}
function rateFromD2D3(d2: Rational, d3: Rational): Rational {
  return mul(sub(div(d3, d2), rat(3)), rat(100));
}
function rateFromConsecutive(earlier: Rational, later: Rational): Rational {
  return mul(div(sub(later, earlier), earlier), rat(100));
}
function simpleInterest(principal: Rational, ratePercent: Rational, years: number): Rational {
  return div(mul(mul(principal, ratePercent), rat(years)), rat(100));
}
function compoundInterest(principal: Rational, ratePercent: Rational, years: number): Rational {
  return sub(mul(principal, pow(factor(ratePercent), years)), principal);
}

export function buildIntCp006ExpandedExplanation(
  qlId: IntCp006QlId,
  state: IntCp006State,
  answer: Rational,
  locale: IntCp006ExplanationLocale,
): Readonly<{ keyIdea: string; steps: readonly string[] }> {
  const rd = "ratePercent" in state ? rateDecimal(state.ratePercent) : null;
  switch (qlId) {
    case "INT-QL-096": {
      if (state.qlId !== qlId || !rd) throw new Error(`${qlId}: state mismatch`);
      const square = mul(rd, rd);
      return Object.freeze({
        keyIdea: t(locale,
          "We need the extra interest created by compounding during the second year, not the total interest.",
          "हमें कुल ब्याज नहीं, बल्कि दूसरे वर्ष में ब्याज पर मिलने वाले अतिरिक्त ब्याज के कारण CI और SI का अंतर निकालना है।",
          "ਸਾਨੂੰ ਕੁੱਲ ਵਿਆਜ ਨਹੀਂ, ਸਗੋਂ ਦੂਜੇ ਸਾਲ ਵਿਆਜ ਉੱਤੇ ਮਿਲਣ ਵਾਲੇ ਵਾਧੂ ਵਿਆਜ ਕਾਰਨ CI ਅਤੇ SI ਦਾ ਅੰਤਰ ਕੱਢਣਾ ਹੈ।"),
        steps: Object.freeze([
          t(locale,
            `Given principal = ${money(state.principal)}, annual rate = ${percent(state.ratePercent)}, time = 2 years. We have to find CI−SI.`,
            `दिया है: मूलधन ${money(state.principal)}, वार्षिक दर ${percent(state.ratePercent)} और समय 2 वर्ष। हमें CI−SI निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: ਮੂਲਧਨ ${money(state.principal)}, ਸਾਲਾਨਾ ਦਰ ${percent(state.ratePercent)} ਅਤੇ ਸਮਾਂ 2 ਸਾਲ। ਸਾਨੂੰ CI−SI ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            "For 2 years, the direct relation is CI−SI = P × (r/100)².",
            "2 वर्षों के लिए सीधा संबंध है: CI−SI = P × (r/100)²।",
            "2 ਸਾਲਾਂ ਲਈ ਸਿੱਧਾ ਸੰਬੰਧ ਹੈ: CI−SI = P × (r/100)²।"),
          t(locale,
            `Here r/100 = ${percent(state.ratePercent)}/100 = ${numberText(rd)}, so (r/100)² = ${numberText(square)}.`,
            `यहाँ r/100 = ${percent(state.ratePercent)}/100 = ${numberText(rd)}, इसलिए (r/100)² = ${numberText(square)}।`,
            `ਇੱਥੇ r/100 = ${percent(state.ratePercent)}/100 = ${numberText(rd)}, ਇਸ ਲਈ (r/100)² = ${numberText(square)}।`),
          t(locale,
            `Substitute the values: CI−SI = ${money(state.principal)} × ${numberText(square)} = ${money(answer)}.`,
            `अब मान रखें: CI−SI = ${money(state.principal)} × ${numberText(square)} = ${money(answer)}।`,
            `ਹੁਣ ਮੁੱਲ ਰੱਖੋ: CI−SI = ${money(state.principal)} × ${numberText(square)} = ${money(answer)}।`),
          t(locale,
            `Therefore compound interest exceeds simple interest by ${money(answer)}.`,
            `अतः चक्रवृद्धि ब्याज, साधारण ब्याज से ${money(answer)} अधिक है।`,
            `ਇਸ ਲਈ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ${money(answer)} ਵੱਧ ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-097": {
      if (state.qlId !== qlId || !rd) throw new Error(`${qlId}: state mismatch`);
      const d2 = siCiDifference(state.principal, state.ratePercent, 2);
      const square = mul(rd, rd);
      const relation = add(rat(3), rd);
      return Object.freeze({
        keyIdea: t(locale,
          "For 3 years, first find the 2-year CI−SI excess and then include the extra third-year compounding effect.",
          "3 वर्षों के लिए पहले 2 वर्षों का CI−SI अंतर निकालते हैं, फिर तीसरे वर्ष का अतिरिक्त चक्रवृद्धि प्रभाव जोड़ते हैं।",
          "3 ਸਾਲਾਂ ਲਈ ਪਹਿਲਾਂ 2 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ਕੱਢਦੇ ਹਾਂ, ਫਿਰ ਤੀਜੇ ਸਾਲ ਦਾ ਵਾਧੂ ਚੱਕਰਵੱਧੀ ਪ੍ਰਭਾਵ ਜੋੜਦੇ ਹਾਂ।"),
        steps: Object.freeze([
          t(locale,
            `Given principal = ${money(state.principal)} and rate = ${percent(state.ratePercent)} per annum. We need CI−SI after 3 years.`,
            `दिया है: मूलधन ${money(state.principal)} और वार्षिक दर ${percent(state.ratePercent)}। हमें 3 वर्षों बाद CI−SI निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: ਮੂਲਧਨ ${money(state.principal)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${percent(state.ratePercent)}। ਸਾਨੂੰ 3 ਸਾਲਾਂ ਬਾਅਦ CI−SI ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            `First find the 2-year excess: D₂ = P × (r/100)² = ${money(state.principal)} × ${numberText(square)} = ${money(d2)}.`,
            `पहले 2 वर्षों का अंतर निकालें: D₂ = P × (r/100)² = ${money(state.principal)} × ${numberText(square)} = ${money(d2)}।`,
            `ਪਹਿਲਾਂ 2 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ: D₂ = P × (r/100)² = ${money(state.principal)} × ${numberText(square)} = ${money(d2)}।`),
          t(locale,
            `For 3 years, D₃ = D₂ × (3 + r/100). Here 3 + r/100 = 3 + ${numberText(rd)} = ${numberText(relation)}.`,
            `3 वर्षों के लिए D₃ = D₂ × (3 + r/100)। यहाँ 3 + r/100 = 3 + ${numberText(rd)} = ${numberText(relation)}।`,
            `3 ਸਾਲਾਂ ਲਈ D₃ = D₂ × (3 + r/100)। ਇੱਥੇ 3 + r/100 = 3 + ${numberText(rd)} = ${numberText(relation)}।`),
          t(locale,
            `Now D₃ = ${money(d2)} × ${numberText(relation)} = ${money(answer)}.`,
            `अब D₃ = ${money(d2)} × ${numberText(relation)} = ${money(answer)}।`,
            `ਹੁਣ D₃ = ${money(d2)} × ${numberText(relation)} = ${money(answer)}।`),
          t(locale,
            `So the required 3-year CI−SI difference is ${money(answer)}.`,
            `इसलिए 3 वर्षों का आवश्यक CI−SI अंतर ${money(answer)} है।`,
            `ਇਸ ਲਈ 3 ਸਾਲਾਂ ਦਾ ਲੋੜੀਂਦਾ CI−SI ਅੰਤਰ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-098": {
      if (state.qlId !== qlId || !rd) throw new Error(`${qlId}: state mismatch`);
      const square = mul(rd, rd);
      return Object.freeze({
        keyIdea: t(locale,
          "The 2-year CI−SI difference and the annual rate are known, so we can reverse the 2-year relation to find the principal.",
          "2 वर्षों का CI−SI अंतर और वार्षिक दर दी हुई है, इसलिए 2-वर्षीय संबंध को उलटकर मूलधन निकालेंगे।",
          "2 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦਿੱਤੀ ਹੋਈ ਹੈ, ਇਸ ਲਈ 2-ਸਾਲਾਂ ਵਾਲਾ ਸੰਬੰਧ ਉਲਟ ਕੇ ਮੂਲਧਨ ਕੱਢਾਂਗੇ।"),
        steps: Object.freeze([
          t(locale,
            `Given D₂ = ${money(state.difference2)} and annual rate = ${percent(state.ratePercent)}. We have to find P.`,
            `दिया है: D₂ = ${money(state.difference2)} और वार्षिक दर = ${percent(state.ratePercent)}। हमें P अर्थात मूलधन निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: D₂ = ${money(state.difference2)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ = ${percent(state.ratePercent)}। ਸਾਨੂੰ P ਅਰਥਾਤ ਮੂਲਧਨ ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            "For 2 years, D₂ = P × (r/100)², so P = D₂ ÷ (r/100)².",
            "2 वर्षों के लिए D₂ = P × (r/100)², इसलिए P = D₂ ÷ (r/100)²।",
            "2 ਸਾਲਾਂ ਲਈ D₂ = P × (r/100)², ਇਸ ਲਈ P = D₂ ÷ (r/100)²।"),
          t(locale,
            `Convert the rate: r/100 = ${numberText(rd)} and (r/100)² = ${numberText(square)}.`,
            `दर को दशमलव में बदलें: r/100 = ${numberText(rd)} और (r/100)² = ${numberText(square)}।`,
            `ਦਰ ਨੂੰ ਦਸ਼ਮਲਵ ਵਿੱਚ ਬਦਲੋ: r/100 = ${numberText(rd)} ਅਤੇ (r/100)² = ${numberText(square)}।`),
          t(locale,
            `Now P = ${money(state.difference2)} ÷ ${numberText(square)} = ${money(answer)}.`,
            `अब P = ${money(state.difference2)} ÷ ${numberText(square)} = ${money(answer)}।`,
            `ਹੁਣ P = ${money(state.difference2)} ÷ ${numberText(square)} = ${money(answer)}।`),
          t(locale,
            `Therefore the original principal is ${money(answer)}.`,
            `अतः मूलधन ${money(answer)} है।`,
            `ਇਸ ਲਈ ਮੂਲਧਨ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-099": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const ratio = div(state.difference2, state.principal);
      const answerDecimal = div(answer, rat(100));
      return Object.freeze({
        keyIdea: t(locale,
          "The ratio D₂/P equals the square of the decimal annual rate, so take its square root and convert back to percent.",
          "D₂/P, वार्षिक दर के दशमलव रूप के वर्ग के बराबर होता है; इसलिए वर्गमूल लेकर प्रतिशत में बदलेंगे।",
          "D₂/P ਸਾਲਾਨਾ ਦਰ ਦੇ ਦਸ਼ਮਲਵ ਰੂਪ ਦੇ ਵਰਗ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ; ਇਸ ਲਈ ਵਰਗਮੂਲ ਲੈ ਕੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਾਂਗੇ।"),
        steps: Object.freeze([
          t(locale,
            `Given principal = ${money(state.principal)} and 2-year CI−SI difference D₂ = ${money(state.difference2)}. We need the annual rate.`,
            `दिया है: मूलधन ${money(state.principal)} और 2 वर्षों का CI−SI अंतर D₂ = ${money(state.difference2)}। हमें वार्षिक दर निकालनी है।`,
            `ਦਿੱਤਾ ਹੈ: ਮੂਲਧਨ ${money(state.principal)} ਅਤੇ 2 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ D₂ = ${money(state.difference2)}। ਸਾਨੂੰ ਸਾਲਾਨਾ ਦਰ ਕੱਢਣੀ ਹੈ।`),
          t(locale,
            "Use D₂ = P × (r/100)², hence (r/100)² = D₂/P.",
            "संबंध D₂ = P × (r/100)² से (r/100)² = D₂/P होगा।",
            "ਸੰਬੰਧ D₂ = P × (r/100)² ਤੋਂ (r/100)² = D₂/P ਹੋਵੇਗਾ।"),
          t(locale,
            `D₂/P = ${money(state.difference2)} ÷ ${money(state.principal)} = ${numberText(ratio)}.`,
            `D₂/P = ${money(state.difference2)} ÷ ${money(state.principal)} = ${numberText(ratio)}।`,
            `D₂/P = ${money(state.difference2)} ÷ ${money(state.principal)} = ${numberText(ratio)}।`),
          t(locale,
            `Therefore r/100 = √${numberText(ratio)} = ${numberText(answerDecimal)}. Multiplying by 100 gives r = ${percent(answer)}.`,
            `अतः r/100 = √${numberText(ratio)} = ${numberText(answerDecimal)}। 100 से गुणा करने पर r = ${percent(answer)}।`,
            `ਇਸ ਲਈ r/100 = √${numberText(ratio)} = ${numberText(answerDecimal)}। 100 ਨਾਲ ਗੁਣਾ ਕਰਨ 'ਤੇ r = ${percent(answer)}।`),
          t(locale,
            `So the annual interest rate is ${percent(answer)}.`,
            `इसलिए वार्षिक ब्याज दर ${percent(answer)} है।`,
            `ਇਸ ਲਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${percent(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-100": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      return Object.freeze({
        keyIdea: t(locale,
          "First obtain the 2-year CI−SI excess; compared with 2-year SI, that excess reveals the annual rate.",
          "पहले 2 वर्षों का CI−SI अंतर निकालते हैं; फिर उसी अंतर और 2-वर्षीय SI से वार्षिक दर मिल जाती है।",
          "ਪਹਿਲਾਂ 2 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ਕੱਢਦੇ ਹਾਂ; ਫਿਰ ਉਸ ਅੰਤਰ ਅਤੇ 2-ਸਾਲਾਂ ਦੇ SI ਤੋਂ ਸਾਲਾਨਾ ਦਰ ਮਿਲ ਜਾਂਦੀ ਹੈ।"),
        steps: Object.freeze([
          t(locale,
            `Given SI for 2 years = ${money(state.simpleInterest2)} and CI for 2 years = ${money(state.compoundInterest2)}. We need the annual rate.`,
            `दिया है: 2 वर्षों का SI = ${money(state.simpleInterest2)} और CI = ${money(state.compoundInterest2)}। हमें वार्षिक दर निकालनी है।`,
            `ਦਿੱਤਾ ਹੈ: 2 ਸਾਲਾਂ ਦਾ SI = ${money(state.simpleInterest2)} ਅਤੇ CI = ${money(state.compoundInterest2)}। ਸਾਨੂੰ ਸਾਲਾਨਾ ਦਰ ਕੱਢਣੀ ਹੈ।`),
          t(locale,
            `First find the excess: D₂ = CI₂ − SI₂ = ${money(state.compoundInterest2)} − ${money(state.simpleInterest2)} = ${money(difference)}.`,
            `पहले अंतर निकालें: D₂ = CI₂ − SI₂ = ${money(state.compoundInterest2)} − ${money(state.simpleInterest2)} = ${money(difference)}।`,
            `ਪਹਿਲਾਂ ਅੰਤਰ ਕੱਢੋ: D₂ = CI₂ − SI₂ = ${money(state.compoundInterest2)} − ${money(state.simpleInterest2)} = ${money(difference)}।`),
          t(locale,
            "For the same principal and rate over 2 years, rate% = (200 × D₂) ÷ SI₂.",
            "एक ही मूलधन और दर के लिए 2 वर्षों में: दर% = (200 × D₂) ÷ SI₂।",
            "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਲਈ 2 ਸਾਲਾਂ ਵਿੱਚ: ਦਰ% = (200 × D₂) ÷ SI₂।"),
          t(locale,
            `Rate = (200 × ${money(difference)}) ÷ ${money(state.simpleInterest2)} = ${percent(answer)}.`,
            `दर = (200 × ${money(difference)}) ÷ ${money(state.simpleInterest2)} = ${percent(answer)}।`,
            `ਦਰ = (200 × ${money(difference)}) ÷ ${money(state.simpleInterest2)} = ${percent(answer)}।`),
          t(locale,
            `Therefore the annual rate is ${percent(answer)}.`,
            `अतः वार्षिक दर ${percent(answer)} है।`,
            `ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${percent(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-101": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      const recoveredRate = rateFromSiCi(state.simpleInterest2, state.compoundInterest2);
      return Object.freeze({
        keyIdea: t(locale,
          "Recover the annual rate from the SI–CI excess first, then use the ordinary 2-year simple-interest formula to recover the principal.",
          "पहले SI और CI के अंतर से वार्षिक दर निकालें, फिर 2-वर्षीय साधारण ब्याज के सूत्र से मूलधन निकालें।",
          "ਪਹਿਲਾਂ SI ਅਤੇ CI ਦੇ ਅੰਤਰ ਤੋਂ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ, ਫਿਰ 2-ਸਾਲਾਂ ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਸੂਤਰ ਤੋਂ ਮੂਲਧਨ ਕੱਢੋ।"),
        steps: Object.freeze([
          t(locale,
            `Given SI₂ = ${money(state.simpleInterest2)} and CI₂ = ${money(state.compoundInterest2)}. We have to find the principal.`,
            `दिया है: SI₂ = ${money(state.simpleInterest2)} और CI₂ = ${money(state.compoundInterest2)}। हमें मूलधन निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: SI₂ = ${money(state.simpleInterest2)} ਅਤੇ CI₂ = ${money(state.compoundInterest2)}। ਸਾਨੂੰ ਮੂਲਧਨ ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            `First D₂ = CI₂ − SI₂ = ${money(state.compoundInterest2)} − ${money(state.simpleInterest2)} = ${money(difference)}.`,
            `पहले D₂ = CI₂ − SI₂ = ${money(state.compoundInterest2)} − ${money(state.simpleInterest2)} = ${money(difference)}।`,
            `ਪਹਿਲਾਂ D₂ = CI₂ − SI₂ = ${money(state.compoundInterest2)} − ${money(state.simpleInterest2)} = ${money(difference)}।`),
          t(locale,
            `Annual rate = (200 × D₂) ÷ SI₂ = (200 × ${money(difference)}) ÷ ${money(state.simpleInterest2)} = ${percent(recoveredRate)}.`,
            `वार्षिक दर = (200 × D₂) ÷ SI₂ = (200 × ${money(difference)}) ÷ ${money(state.simpleInterest2)} = ${percent(recoveredRate)}।`,
            `ਸਾਲਾਨਾ ਦਰ = (200 × D₂) ÷ SI₂ = (200 × ${money(difference)}) ÷ ${money(state.simpleInterest2)} = ${percent(recoveredRate)}।`),
          t(locale,
            `Now SI₂ = P × r × 2 / 100, so P = SI₂ × 100 ÷ (2r).`,
            `अब SI₂ = P × r × 2 / 100, इसलिए P = SI₂ × 100 ÷ (2r)।`,
            `ਹੁਣ SI₂ = P × r × 2 / 100, ਇਸ ਲਈ P = SI₂ × 100 ÷ (2r)।`),
          t(locale,
            `P = ${money(state.simpleInterest2)} × 100 ÷ (2 × ${exactDecimal(recoveredRate)}) = ${money(answer)}.`,
            `P = ${money(state.simpleInterest2)} × 100 ÷ (2 × ${exactDecimal(recoveredRate)}) = ${money(answer)}।`,
            `P = ${money(state.simpleInterest2)} × 100 ÷ (2 × ${exactDecimal(recoveredRate)}) = ${money(answer)}।`),
          t(locale,
            `Therefore the principal is ${money(answer)}.`,
            `अतः मूलधन ${money(answer)} है।`,
            `ਇਸ ਲਈ ਮੂਲਧਨ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-102": {
      if (state.qlId !== qlId || !rd) throw new Error(`${qlId}: state mismatch`);
      const other = state.knownYears === 2 ? 3 : 2;
      const relation = add(rat(3), rd);
      return Object.freeze({
        keyIdea: t(locale,
          "For the same principal and rate, the 2-year and 3-year CI−SI differences are linked by one fixed factor.",
          "एक ही मूलधन और दर पर 2-वर्षीय और 3-वर्षीय CI−SI अंतर एक निश्चित गुणक से जुड़े होते हैं।",
          "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਉੱਤੇ 2-ਸਾਲਾਂ ਅਤੇ 3-ਸਾਲਾਂ ਦੇ CI−SI ਅੰਤਰ ਇੱਕ ਨਿਸ਼ਚਿਤ ਗੁਣਕ ਨਾਲ ਜੁੜੇ ਹੁੰਦੇ ਹਨ।"),
        steps: Object.freeze([
          t(locale,
            `Given ${state.knownYears}-year CI−SI difference = ${money(state.knownDifference)} and annual rate = ${percent(state.ratePercent)}. We need the ${other}-year difference.`,
            `दिया है: ${state.knownYears} वर्षों का CI−SI अंतर ${money(state.knownDifference)} और वार्षिक दर ${percent(state.ratePercent)}। हमें ${other} वर्षों का अंतर निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: ${state.knownYears} ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ${money(state.knownDifference)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${percent(state.ratePercent)}। ਸਾਨੂੰ ${other} ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            `Use D₃ = D₂ × (3 + r/100). The factor is 3 + ${numberText(rd)} = ${numberText(relation)}.`,
            `संबंध D₃ = D₂ × (3 + r/100) उपयोग करें। गुणक = 3 + ${numberText(rd)} = ${numberText(relation)}।`,
            `ਸੰਬੰਧ D₃ = D₂ × (3 + r/100) ਵਰਤੋ। ਗੁਣਕ = 3 + ${numberText(rd)} = ${numberText(relation)}।`),
          state.knownYears === 2
            ? t(locale,
                `So D₃ = ${money(state.knownDifference)} × ${numberText(relation)} = ${money(answer)}.`,
                `इसलिए D₃ = ${money(state.knownDifference)} × ${numberText(relation)} = ${money(answer)}।`,
                `ਇਸ ਲਈ D₃ = ${money(state.knownDifference)} × ${numberText(relation)} = ${money(answer)}।`)
            : t(locale,
                `So D₂ = ${money(state.knownDifference)} ÷ ${numberText(relation)} = ${money(answer)}.`,
                `इसलिए D₂ = ${money(state.knownDifference)} ÷ ${numberText(relation)} = ${money(answer)}।`,
                `ਇਸ ਲਈ D₂ = ${money(state.knownDifference)} ÷ ${numberText(relation)} = ${money(answer)}।`),
          t(locale,
            `Therefore the required ${other}-year CI−SI difference is ${money(answer)}.`,
            `अतः ${other} वर्षों का आवश्यक CI−SI अंतर ${money(answer)} है।`,
            `ਇਸ ਲਈ ${other} ਸਾਲਾਂ ਦਾ ਲੋੜੀਂਦਾ CI−SI ਅੰਤਰ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-103": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const ratio = div(state.difference3, state.difference2);
      const excess = sub(ratio, rat(3));
      return Object.freeze({
        keyIdea: t(locale,
          "Taking D₃/D₂ removes the principal, leaving a direct route to the annual rate.",
          "D₃/D₂ का अनुपात लेने पर मूलधन कट जाता है और वार्षिक दर सीधे मिल जाती है।",
          "D₃/D₂ ਦਾ ਅਨੁਪਾਤ ਲੈਣ ਨਾਲ ਮੂਲਧਨ ਕੱਟ ਜਾਂਦਾ ਹੈ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਸਿੱਧੀ ਮਿਲ ਜਾਂਦੀ ਹੈ।"),
        steps: Object.freeze([
          t(locale,
            `Given D₂ = ${money(state.difference2)} and D₃ = ${money(state.difference3)}. We need the annual rate.`,
            `दिया है: D₂ = ${money(state.difference2)} और D₃ = ${money(state.difference3)}। हमें वार्षिक दर निकालनी है।`,
            `ਦਿੱਤਾ ਹੈ: D₂ = ${money(state.difference2)} ਅਤੇ D₃ = ${money(state.difference3)}। ਸਾਨੂੰ ਸਾਲਾਨਾ ਦਰ ਕੱਢਣੀ ਹੈ।`),
          t(locale,
            "For the same principal and rate, D₃/D₂ = 3 + r/100.",
            "एक ही मूलधन और दर के लिए D₃/D₂ = 3 + r/100।",
            "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਲਈ D₃/D₂ = 3 + r/100।"),
          t(locale,
            `D₃/D₂ = ${money(state.difference3)} ÷ ${money(state.difference2)} = ${numberText(ratio)}.`,
            `D₃/D₂ = ${money(state.difference3)} ÷ ${money(state.difference2)} = ${numberText(ratio)}।`,
            `D₃/D₂ = ${money(state.difference3)} ÷ ${money(state.difference2)} = ${numberText(ratio)}।`),
          t(locale,
            `Thus r/100 = ${numberText(ratio)} − 3 = ${numberText(excess)}, so r = ${percent(answer)}.`,
            `अतः r/100 = ${numberText(ratio)} − 3 = ${numberText(excess)}, इसलिए r = ${percent(answer)}।`,
            `ਇਸ ਲਈ r/100 = ${numberText(ratio)} − 3 = ${numberText(excess)}, ਇਸ ਕਰਕੇ r = ${percent(answer)}।`),
          t(locale,
            `Therefore the annual rate is ${percent(answer)}.`,
            `अतः वार्षिक दर ${percent(answer)} है।`,
            `ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${percent(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-104": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const recoveredRate = rateFromD2D3(state.difference2, state.difference3);
      const recoveredRateDecimal = rateDecimal(recoveredRate);
      const square = mul(recoveredRateDecimal, recoveredRateDecimal);
      const ratio = div(state.difference3, state.difference2);
      return Object.freeze({
        keyIdea: t(locale,
          "First recover the rate from D₃/D₂; then use the 2-year difference to reconstruct the principal.",
          "पहले D₃/D₂ से दर निकालें, फिर 2-वर्षीय अंतर से मूलधन निकालें।",
          "ਪਹਿਲਾਂ D₃/D₂ ਤੋਂ ਦਰ ਕੱਢੋ, ਫਿਰ 2-ਸਾਲਾਂ ਦੇ ਅੰਤਰ ਤੋਂ ਮੂਲਧਨ ਕੱਢੋ।"),
        steps: Object.freeze([
          t(locale,
            `Given D₂ = ${money(state.difference2)} and D₃ = ${money(state.difference3)}. We have to find the principal.`,
            `दिया है: D₂ = ${money(state.difference2)} और D₃ = ${money(state.difference3)}। हमें मूलधन निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: D₂ = ${money(state.difference2)} ਅਤੇ D₃ = ${money(state.difference3)}। ਸਾਨੂੰ ਮੂਲਧਨ ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            `First D₃/D₂ = ${money(state.difference3)} ÷ ${money(state.difference2)} = ${numberText(ratio)}.`,
            `पहले D₃/D₂ = ${money(state.difference3)} ÷ ${money(state.difference2)} = ${numberText(ratio)}।`,
            `ਪਹਿਲਾਂ D₃/D₂ = ${money(state.difference3)} ÷ ${money(state.difference2)} = ${numberText(ratio)}।`),
          t(locale,
            `So r = 100 × (${numberText(ratio)} − 3) = ${percent(recoveredRate)}.`,
            `इसलिए r = 100 × (${numberText(ratio)} − 3) = ${percent(recoveredRate)}।`,
            `ਇਸ ਲਈ r = 100 × (${numberText(ratio)} − 3) = ${percent(recoveredRate)}।`),
          t(locale,
            `Now (r/100)² = (${numberText(recoveredRateDecimal)})² = ${numberText(square)} and D₂ = P × (r/100)².`,
            `अब (r/100)² = (${numberText(recoveredRateDecimal)})² = ${numberText(square)} और D₂ = P × (r/100)²।`,
            `ਹੁਣ (r/100)² = (${numberText(recoveredRateDecimal)})² = ${numberText(square)} ਅਤੇ D₂ = P × (r/100)²।`),
          t(locale,
            `Therefore P = ${money(state.difference2)} ÷ ${numberText(square)} = ${money(answer)}.`,
            `अतः P = ${money(state.difference2)} ÷ ${numberText(square)} = ${money(answer)}।`,
            `ਇਸ ਲਈ P = ${money(state.difference2)} ÷ ${numberText(square)} = ${money(answer)}।`),
          t(locale,
            `So the principal is ${money(answer)}.`,
            `इसलिए मूलधन ${money(answer)} है।`,
            `ਇਸ ਲਈ ਮੂਲਧਨ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-105": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const increase = sub(state.laterInterest, state.earlierInterest);
      return Object.freeze({
        keyIdea: t(locale,
          "With annual compounding, the increase from one year's interest to the next is r% of the earlier year's interest.",
          "वार्षिक चक्रवृद्धि में अगले वर्ष के ब्याज की वृद्धि, पिछले वर्ष के ब्याज का r% होती है।",
          "ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿੱਚ ਅਗਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦੀ ਵਾਧਾ, ਪਿਛਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ r% ਹੁੰਦਾ ਹੈ।"),
        steps: Object.freeze([
          t(locale,
            `Interest in year ${state.yearNumber} = ${money(state.earlierInterest)} and in year ${state.yearNumber + 1} = ${money(state.laterInterest)}. We need the annual rate.`,
            `वर्ष ${state.yearNumber} का ब्याज ${money(state.earlierInterest)} और वर्ष ${state.yearNumber + 1} का ब्याज ${money(state.laterInterest)} है। हमें वार्षिक दर निकालनी है।`,
            `ਸਾਲ ${state.yearNumber} ਦਾ ਵਿਆਜ ${money(state.earlierInterest)} ਅਤੇ ਸਾਲ ${state.yearNumber + 1} ਦਾ ਵਿਆਜ ${money(state.laterInterest)} ਹੈ। ਸਾਨੂੰ ਸਾਲਾਨਾ ਦਰ ਕੱਢਣੀ ਹੈ।`),
          t(locale,
            `Increase in yearly interest = ${money(state.laterInterest)} − ${money(state.earlierInterest)} = ${money(increase)}.`,
            `वार्षिक ब्याज में वृद्धि = ${money(state.laterInterest)} − ${money(state.earlierInterest)} = ${money(increase)}।`,
            `ਸਾਲਾਨਾ ਵਿਆਜ ਵਿੱਚ ਵਾਧਾ = ${money(state.laterInterest)} − ${money(state.earlierInterest)} = ${money(increase)}।`),
          t(locale,
            "This increase is r% of the earlier year's interest, so rate% = increase × 100 ÷ earlier interest.",
            "यह वृद्धि पिछले वर्ष के ब्याज का r% है, इसलिए दर% = वृद्धि × 100 ÷ पिछले वर्ष का ब्याज।",
            "ਇਹ ਵਾਧਾ ਪਿਛਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ r% ਹੈ, ਇਸ ਲਈ ਦਰ% = ਵਾਧਾ × 100 ÷ ਪਿਛਲੇ ਸਾਲ ਦਾ ਵਿਆਜ।"),
          t(locale,
            `Rate = ${money(increase)} × 100 ÷ ${money(state.earlierInterest)} = ${percent(answer)}.`,
            `दर = ${money(increase)} × 100 ÷ ${money(state.earlierInterest)} = ${percent(answer)}।`,
            `ਦਰ = ${money(increase)} × 100 ÷ ${money(state.earlierInterest)} = ${percent(answer)}।`),
          t(locale,
            `Therefore the annual compound-interest rate is ${percent(answer)}.`,
            `अतः वार्षिक चक्रवृद्धि ब्याज दर ${percent(answer)} है।`,
            `ਇਸ ਲਈ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਰ ${percent(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-106": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const increase = sub(state.laterInterest, state.earlierInterest);
      const recoveredRate = rateFromConsecutive(state.earlierInterest, state.laterInterest);
      const rd2 = rateDecimal(recoveredRate);
      const growth = pow(factor(recoveredRate), state.yearNumber - 1);
      const interestFactor = mul(rd2, growth);
      return Object.freeze({
        keyIdea: t(locale,
          "First use the change between consecutive yearly interests to find the rate; then work backward from the observed year's interest to the original principal.",
          "पहले लगातार दो वर्षों के ब्याज की वृद्धि से दर निकालें, फिर दिए गए वर्ष के ब्याज से पीछे जाकर मूलधन निकालें।",
          "ਪਹਿਲਾਂ ਲਗਾਤਾਰ ਦੋ ਸਾਲਾਂ ਦੇ ਵਿਆਜ ਦੇ ਵਾਧੇ ਤੋਂ ਦਰ ਕੱਢੋ, ਫਿਰ ਦਿੱਤੇ ਸਾਲ ਦੇ ਵਿਆਜ ਤੋਂ ਪਿੱਛੇ ਜਾ ਕੇ ਮੂਲਧਨ ਕੱਢੋ।"),
        steps: Object.freeze([
          t(locale,
            `Year ${state.yearNumber} interest = ${money(state.earlierInterest)} and year ${state.yearNumber + 1} interest = ${money(state.laterInterest)}. We have to find the original principal.`,
            `वर्ष ${state.yearNumber} का ब्याज ${money(state.earlierInterest)} और वर्ष ${state.yearNumber + 1} का ब्याज ${money(state.laterInterest)} है। हमें मूलधन निकालना है।`,
            `ਸਾਲ ${state.yearNumber} ਦਾ ਵਿਆਜ ${money(state.earlierInterest)} ਅਤੇ ਸਾਲ ${state.yearNumber + 1} ਦਾ ਵਿਆਜ ${money(state.laterInterest)} ਹੈ। ਸਾਨੂੰ ਮੂਲਧਨ ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            `First find the increase: ${money(state.laterInterest)} − ${money(state.earlierInterest)} = ${money(increase)}.`,
            `पहले वृद्धि निकालें: ${money(state.laterInterest)} − ${money(state.earlierInterest)} = ${money(increase)}।`,
            `ਪਹਿਲਾਂ ਵਾਧਾ ਕੱਢੋ: ${money(state.laterInterest)} − ${money(state.earlierInterest)} = ${money(increase)}।`),
          t(locale,
            `Annual rate = ${money(increase)} × 100 ÷ ${money(state.earlierInterest)} = ${percent(recoveredRate)}.`,
            `वार्षिक दर = ${money(increase)} × 100 ÷ ${money(state.earlierInterest)} = ${percent(recoveredRate)}।`,
            `ਸਾਲਾਨਾ ਦਰ = ${money(increase)} × 100 ÷ ${money(state.earlierInterest)} = ${percent(recoveredRate)}।`),
          t(locale,
            `Interest in year k follows Jₖ = P × (r/100) × (1+r/100)^(k−1). For k = ${state.yearNumber}, the multiplier is ${numberText(rd2)} × ${numberText(growth)} = ${numberText(interestFactor)}.`,
            `वर्ष k का ब्याज Jₖ = P × (r/100) × (1+r/100)^(k−1) होता है। k = ${state.yearNumber} के लिए गुणक ${numberText(rd2)} × ${numberText(growth)} = ${numberText(interestFactor)} है।`,
            `ਸਾਲ k ਦਾ ਵਿਆਜ Jₖ = P × (r/100) × (1+r/100)^(k−1) ਹੁੰਦਾ ਹੈ। k = ${state.yearNumber} ਲਈ ਗੁਣਕ ${numberText(rd2)} × ${numberText(growth)} = ${numberText(interestFactor)} ਹੈ।`),
          t(locale,
            `Therefore P = ${money(state.earlierInterest)} ÷ ${numberText(interestFactor)} = ${money(answer)}.`,
            `अतः P = ${money(state.earlierInterest)} ÷ ${numberText(interestFactor)} = ${money(answer)}।`,
            `ਇਸ ਲਈ P = ${money(state.earlierInterest)} ÷ ${numberText(interestFactor)} = ${money(answer)}।`),
          t(locale,
            `So the original principal is ${money(answer)}.`,
            `इसलिए मूलधन ${money(answer)} है।`,
            `ਇਸ ਲਈ ਮੂਲਧਨ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-107": {
      if (state.qlId !== qlId) throw new Error(`${qlId}: state mismatch`);
      const year = Number(answer.numerator / answer.denominator);
      const previousYear = year - 1;
      const previousSi = simpleInterest(state.principal, state.ratePercent, previousYear);
      const previousCi = compoundInterest(state.principal, state.ratePercent, previousYear);
      const previousDifference = sub(previousCi, previousSi);
      const currentSi = simpleInterest(state.principal, state.ratePercent, year);
      const currentCi = compoundInterest(state.principal, state.ratePercent, year);
      const currentDifference = sub(currentCi, currentSi);
      return Object.freeze({
        keyIdea: t(locale,
          "Because the question asks for the first complete year, we must check the year just before the answer as well as the answer year.",
          "प्रश्न पहले पूर्ण वर्ष के बारे में है, इसलिए उत्तर वाले वर्ष के साथ उससे ठीक पहले वाले वर्ष की भी जाँच करनी होगी।",
          "ਸਵਾਲ ਪਹਿਲੇ ਪੂਰੇ ਸਾਲ ਬਾਰੇ ਹੈ, ਇਸ ਲਈ ਜਵਾਬ ਵਾਲੇ ਸਾਲ ਦੇ ਨਾਲ ਉਸ ਤੋਂ ਠੀਕ ਪਹਿਲੇ ਸਾਲ ਦੀ ਵੀ ਜਾਂਚ ਕਰਨੀ ਪਵੇਗੀ।"),
        steps: Object.freeze([
          t(locale,
            `Given principal = ${money(state.principal)}, rate = ${percent(state.ratePercent)} and target CI−SI difference = ${money(state.targetDifference)}.`,
            `दिया है: मूलधन ${money(state.principal)}, दर ${percent(state.ratePercent)} और लक्ष्य CI−SI अंतर ${money(state.targetDifference)}।`,
            `ਦਿੱਤਾ ਹੈ: ਮੂਲਧਨ ${money(state.principal)}, ਦਰ ${percent(state.ratePercent)} ਅਤੇ ਟੀਚਾ CI−SI ਅੰਤਰ ${money(state.targetDifference)}।`),
          t(locale,
            `Check ${previousYear} years first: SI = ${money(previousSi)} and CI = ${money(previousCi)}, so CI−SI = ${money(previousDifference)}.`,
            `पहले ${previousYear} वर्ष जाँचें: SI = ${money(previousSi)} और CI = ${money(previousCi)}, इसलिए CI−SI = ${money(previousDifference)}।`,
            `ਪਹਿਲਾਂ ${previousYear} ਸਾਲ ਜਾਂਚੋ: SI = ${money(previousSi)} ਅਤੇ CI = ${money(previousCi)}, ਇਸ ਲਈ CI−SI = ${money(previousDifference)}।`),
          t(locale,
            `${money(previousDifference)} is below the target ${money(state.targetDifference)}, so the target has not been reached by ${previousYear} years.`,
            `${money(previousDifference)}, लक्ष्य ${money(state.targetDifference)} से कम है, इसलिए ${previousYear} वर्षों तक लक्ष्य पूरा नहीं हुआ।`,
            `${money(previousDifference)}, ਟੀਚੇ ${money(state.targetDifference)} ਤੋਂ ਘੱਟ ਹੈ, ਇਸ ਲਈ ${previousYear} ਸਾਲਾਂ ਤੱਕ ਟੀਚਾ ਪੂਰਾ ਨਹੀਂ ਹੋਇਆ।`),
          t(locale,
            `Now check ${year} years: SI = ${money(currentSi)} and CI = ${money(currentCi)}, so CI−SI = ${money(currentDifference)}.`,
            `अब ${year} वर्ष जाँचें: SI = ${money(currentSi)} और CI = ${money(currentCi)}, इसलिए CI−SI = ${money(currentDifference)}।`,
            `ਹੁਣ ${year} ਸਾਲ ਜਾਂਚੋ: SI = ${money(currentSi)} ਅਤੇ CI = ${money(currentCi)}, ਇਸ ਲਈ CI−SI = ${money(currentDifference)}।`),
          t(locale,
            `${money(currentDifference)} is at least ${money(state.targetDifference)}, so the target is reached in ${yearText(year, locale)}.`,
            `${money(currentDifference)}, ${money(state.targetDifference)} के बराबर या अधिक है, इसलिए लक्ष्य ${yearText(year, locale)} में पूरा होता है।`,
            `${money(currentDifference)}, ${money(state.targetDifference)} ਦੇ ਬਰਾਬਰ ਜਾਂ ਵੱਧ ਹੈ, ਇਸ ਲਈ ਟੀਚਾ ${yearText(year, locale)} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`),
          t(locale,
            `Since the previous year was below the target, the first complete year is ${yearText(year, locale)}.`,
            `क्योंकि पिछला वर्ष लक्ष्य से नीचे था, इसलिए पहला पूर्ण वर्ष ${yearText(year, locale)} है।`,
            `ਕਿਉਂਕਿ ਪਿਛਲਾ ਸਾਲ ਟੀਚੇ ਤੋਂ ਹੇਠਾਂ ਸੀ, ਇਸ ਲਈ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ${yearText(year, locale)} ਹੈ।`),
        ]),
      });
    }
    case "INT-QL-108": {
      if (state.qlId !== qlId || !rd) throw new Error(`${qlId}: state mismatch`);
      return Object.freeze({
        keyIdea: t(locale,
          "The extra interest in year 2 is exactly the annual rate applied to the interest earned in year 1.",
          "दूसरे वर्ष का अतिरिक्त ब्याज, पहले वर्ष के ब्याज पर लगने वाली वार्षिक दर के बराबर होता है।",
          "ਦੂਜੇ ਸਾਲ ਦਾ ਵਾਧੂ ਵਿਆਜ, ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਉੱਤੇ ਲੱਗਣ ਵਾਲੀ ਸਾਲਾਨਾ ਦਰ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।"),
        steps: Object.freeze([
          t(locale,
            `Given second-year excess = ${money(state.secondYearExcess)} and annual rate = ${percent(state.ratePercent)}. We have to find the first-year interest J₁.`,
            `दिया है: दूसरे वर्ष का अतिरिक्त ब्याज ${money(state.secondYearExcess)} और वार्षिक दर ${percent(state.ratePercent)}। हमें पहले वर्ष का ब्याज J₁ निकालना है।`,
            `ਦਿੱਤਾ ਹੈ: ਦੂਜੇ ਸਾਲ ਦਾ ਵਾਧੂ ਵਿਆਜ ${money(state.secondYearExcess)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${percent(state.ratePercent)}। ਸਾਨੂੰ ਪਹਿਲੇ ਸਾਲ ਦਾ ਵਿਆਜ J₁ ਕੱਢਣਾ ਹੈ।`),
          t(locale,
            "Under annual compounding, J₂ − J₁ = J₁ × (r/100).",
            "वार्षिक चक्रवृद्धि में J₂ − J₁ = J₁ × (r/100)।",
            "ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿੱਚ J₂ − J₁ = J₁ × (r/100)।"),
          t(locale,
            `Here r/100 = ${numberText(rd)}, so ${money(state.secondYearExcess)} = J₁ × ${numberText(rd)}.`,
            `यहाँ r/100 = ${numberText(rd)}, इसलिए ${money(state.secondYearExcess)} = J₁ × ${numberText(rd)}।`,
            `ਇੱਥੇ r/100 = ${numberText(rd)}, ਇਸ ਲਈ ${money(state.secondYearExcess)} = J₁ × ${numberText(rd)}।`),
          t(locale,
            `Therefore J₁ = ${money(state.secondYearExcess)} ÷ ${numberText(rd)} = ${money(answer)}.`,
            `अतः J₁ = ${money(state.secondYearExcess)} ÷ ${numberText(rd)} = ${money(answer)}।`,
            `ਇਸ ਲਈ J₁ = ${money(state.secondYearExcess)} ÷ ${numberText(rd)} = ${money(answer)}।`),
          t(locale,
            `So the first-year interest is ${money(answer)}.`,
            `इसलिए पहले वर्ष का ब्याज ${money(answer)} है।`,
            `ਇਸ ਲਈ ਪਹਿਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ${money(answer)} ਹੈ।`),
        ]),
      });
    }
  }
}
