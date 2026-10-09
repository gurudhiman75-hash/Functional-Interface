import { add, compare, divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { EDITORIAL_REVIEW_LOCK } from "../../quality-audit/worked-calculation";

export type TwoWalkerInput = Readonly<{ firstSteps: Rational; secondSteps: Rational; firstRatePart: Rational; secondRatePart: Rational }>;
const positive = (r: Rational) => compare(r, rational(0)) > 0;
const text = (r: Rational) => r.denominator === 1n ? String(r.numerator) : `${r.numerator}/${r.denominator}`;

/** Same upward escalator, no skipped steps, constant walking and surface rates. */
export function solveTwoWalkerStepEvidence(i: TwoWalkerInput) {
  if (![i.firstSteps, i.secondSteps, i.firstRatePart, i.secondRatePart].every(positive)) throw new Error("Positive observations required");
  const firstTime = divide(i.firstSteps, i.firstRatePart);
  const secondTime = divide(i.secondSteps, i.secondRatePart);
  const timeDifference = subtract(secondTime, firstTime);
  if (!positive(timeDifference)) throw new Error("Second observation must take longer");
  const surfaceRatePart = divide(subtract(i.firstSteps, i.secondSteps), timeDifference);
  if (!positive(surfaceRatePart)) throw new Error("Observations require a positive upward escalator rate");
  const steps = add(i.firstSteps, multiply(surfaceRatePart, firstTime));
  if (steps.denominator !== 1n) throw new Error("Stationary escalator step count must be integral");
  return Object.freeze({ steps, surfaceRatePart, firstTime, secondTime, timeDifference });
}

const examples = [[25,20,3,2],[50,40,3,2],[75,60,3,2],[20,18,4,3],[40,36,4,3],[60,54,4,3]] as const;
export const TSD_CP011_TWO_WALKER_REVIEW_V1 = Object.freeze(examples.flatMap(([a,b,p,q], index) => {
  const input = Object.freeze({ firstSteps:rational(a), secondSteps:rational(b), firstRatePart:rational(p), secondRatePart:rational(q) });
  const s = solveTwoWalkerStepEvidence(input);
  const stems = [
    `Two people walk up the same upward-moving escalator at constant walking rates in the ratio ${p}:${q}. They take ${a} and ${b} steps, respectively, to reach the top. Neither skips a step. The escalator moves at a constant speed. How many steps are visible when it is stopped?`,
    `दो व्यक्ति एक ही ऊपर जाते एस्केलेटर पर ${p}:${q} के अनुपात में स्थिर दर से सीढ़ियाँ चढ़ते हैं। ऊपर पहुँचने तक वे क्रमशः ${a} और ${b} सीढ़ियाँ चढ़ते हैं। दोनों हर सीढ़ी पर कदम रखते हैं और एस्केलेटर की चाल स्थिर है। एस्केलेटर रुकने पर उसकी कुल कितनी सीढ़ियाँ दिखाई देंगी?`,
    `ਦੋ ਵਿਅਕਤੀ ਉੱਪਰ ਵੱਲ ਚੱਲਦੇ ਇੱਕੋ ਐਸਕੇਲੇਟਰ ਉੱਤੇ ${p}:${q} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਇੱਕਸਾਰ ਦਰ ਨਾਲ ਪੌੜੀਆਂ ਚੜ੍ਹਦੇ ਹਨ। ਉੱਪਰ ਪਹੁੰਚਣ ਤੱਕ ਉਹ ਕ੍ਰਮਵਾਰ ${a} ਅਤੇ ${b} ਪੌੜੀਆਂ ਚੜ੍ਹਦੇ ਹਨ। ਦੋਵੇਂ ਹਰ ਪੌੜੀ ਉੱਤੇ ਪੈਰ ਰੱਖਦੇ ਹਨ ਅਤੇ ਐਸਕੇਲੇਟਰ ਦੀ ਚਾਲ ਇੱਕਸਾਰ ਹੈ। ਐਸਕੇਲੇਟਰ ਰੁਕਣ ਉੱਤੇ ਕੁੱਲ ਕਿੰਨੀਆਂ ਪੌੜੀਆਂ ਦਿਸਣਗੀਆਂ?`,
  ];
  const values = [s.steps, rational(a), rational(b), rational(a+b)].map(text);
  if (new Set(values).size !== 4) throw new Error("Duplicate options");
  return (["en","hi","pa"] as const).map((locale,l) => {
    const correctIndex = (index+l)%4;
    const options = [...values.slice(1)]; options.splice(correctIndex,0,values[0]);
    const lines = [
      [`Let walking rates be ${p}k and ${q}k steps per second and the escalator rate be ek steps per second.`, `Travel times are ${a}/(${p}k) and ${b}/(${q}k) seconds.`, `The fixed step count gives ${a} + e × ${a}/${p} = ${b} + e × ${b}/${q}.`, `e = (${a} − ${b}) ÷ (${b}/${q} − ${a}/${p}) = ${text(s.surfaceRatePart)}.`, `Total steps = ${a} + ${text(s.surfaceRatePart)} × ${a}/${p} = ${text(s.steps)}.`],
      [`चलने की दरें ${p}k और ${q}k सीढ़ियाँ प्रति सेकंड तथा एस्केलेटर की दर ek सीढ़ियाँ प्रति सेकंड मानें।`, `यात्रा के समय ${a}/(${p}k) और ${b}/(${q}k) सेकंड हैं।`, `कुल सीढ़ियाँ बराबर हैं: ${a} + e × ${a}/${p} = ${b} + e × ${b}/${q}।`, `e = (${a} − ${b}) ÷ (${b}/${q} − ${a}/${p}) = ${text(s.surfaceRatePart)}।`, `कुल सीढ़ियाँ = ${a} + ${text(s.surfaceRatePart)} × ${a}/${p} = ${text(s.steps)}।`],
      [`ਤੁਰਨ ਦੀਆਂ ਦਰਾਂ ${p}k ਅਤੇ ${q}k ਪੌੜੀਆਂ ਪ੍ਰਤੀ ਸਕਿੰਟ ਅਤੇ ਐਸਕੇਲੇਟਰ ਦੀ ਦਰ ek ਪੌੜੀਆਂ ਪ੍ਰਤੀ ਸਕਿੰਟ ਮੰਨੋ।`, `ਸਫ਼ਰ ਦੇ ਸਮੇਂ ${a}/(${p}k) ਅਤੇ ${b}/(${q}k) ਸਕਿੰਟ ਹਨ।`, `ਕੁੱਲ ਪੌੜੀਆਂ ਬਰਾਬਰ ਹਨ: ${a} + e × ${a}/${p} = ${b} + e × ${b}/${q}।`, `e = (${a} − ${b}) ÷ (${b}/${q} − ${a}/${p}) = ${text(s.surfaceRatePart)}।`, `ਕੁੱਲ ਪੌੜੀਆਂ = ${a} + ${text(s.surfaceRatePart)} × ${a}/${p} = ${text(s.steps)}।`],
    ];
    return Object.freeze({...EDITORIAL_REVIEW_LOCK, version:"TSD-CP011-TWO-WALKER-SOURCE-REVIEW-V1", familyId:`TSD-CP011-TWO-WALKER-${index+1}`, authorityKey:"dualEscalatorObservationState", sourceCandidate:"findTwoPeopleStepRateRelation", locale, input, solution:s, stem:stems[l], answerText:values[0], options:Object.freeze(options), correctIndex, explanation:Object.freeze({steps:Object.freeze(lines[l])})});
  });
}));
