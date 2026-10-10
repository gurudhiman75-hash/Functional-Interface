import { add, compare, divide, multiply, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { EDITORIAL_REVIEW_LOCK } from "../../quality-audit/worked-calculation";
import { solveTsdCp012 } from "./executable-solver";

export type SlowdownObservations = Readonly<{
  firstPoint: Rational; secondPoint: Rational; speedFraction: Rational;
  firstDelay: Rational; secondDelay: Rational;
}>;
const zero = rational(0);
const one = rational(1);
const q = toMixedString;

export function solveSlowdownObservations(input: SlowdownObservations) {
  const { firstPoint: a, secondPoint: b, speedFraction: k, firstDelay: t1, secondDelay: t2 } = input;
  if (compare(a, zero) < 0 || compare(b, a) <= 0 || compare(k, zero) <= 0 || compare(k, one) >= 0
    || compare(t2, zero) <= 0 || compare(t1, t2) <= 0) throw new Error("Infeasible slowdown observations");
  const lossFactor = subtract(divide(one, k), one);
  // x = D/v and y = 1/v: lossFactor * (x - a*y) = delay.
  const coefficients = { authorityKey: "twoEngineInverseState" as const,
    a1: lossFactor, b1: multiply(rational(-1), multiply(lossFactor, a)), c1: t1,
    a2: lossFactor, b2: multiply(rational(-1), multiply(lossFactor, b)), c2: t2 };
  const x = solveTsdCp012({ ...coefficients, target: "X" });
  const y = solveTsdCp012({ ...coefficients, target: "Y" });
  if (x.kind !== "SCALAR" || y.kind !== "SCALAR" || compare(y.answer, zero) <= 0) throw new Error("Invalid inverse motion state");
  const speed = divide(one, y.answer), distance = divide(x.answer, y.answer);
  if (compare(distance, b) <= 0) throw new Error("Slowdown points must lie inside the route");
  return Object.freeze({ speed, distance, lossFactor, scheduledTime: x.answer });
}

// First fixture follows the scoped book observation; the rest are authored states.
const states = [[20,78,18,30,4,5],[40,180,20,60,4,5],[30,126,18,36,3,4],
  [50,170,20,50,3,5],[60,240,40,80,4,5],[40,160,40,80,2,3]] as const;
const scenes = [["A car", "एक कार", "ਇੱਕ ਕਾਰ"], ["A bus", "एक बस", "ਇੱਕ ਬੱਸ"], ["A van", "एक वैन", "ਇੱਕ ਵੈਨ"]] as const;
export const TSD_CP012_SLOWDOWN_OBSERVATIONS_REVIEW_V1 = Object.freeze(states.flatMap(([v,d,a,b,kn,kd], index) => {
  const speed = rational(v), distance = rational(d), speedFraction = rational(kn,kd);
  const lossFactor = subtract(divide(one,speedFraction),one);
  const input = Object.freeze({firstPoint:rational(a),secondPoint:rational(b),speedFraction,
    firstDelay:multiply(divide(subtract(distance,rational(a)),speed),lossFactor),
    secondDelay:multiply(divide(subtract(distance,rational(b)),speed),lossFactor)});
  const solution = solveSlowdownObservations(input);
  const firstMinutes = q(multiply(input.firstDelay,rational(60))), secondMinutes = q(multiply(input.secondDelay,rational(60)));
  const fraction = `${kn}/${kd}`, scene = scenes[index % scenes.length];
  const stems = [
    `${scene[0]} travels from A to B at a constant speed. If its speed falls to ${fraction} of the normal speed after ${a} km, it arrives ${firstMinutes} minutes late. If the same reduction occurs after ${b} km instead, it arrives ${secondMinutes} minutes late. What are the normal speed and the distance AB, respectively?`,
    `${scene[1]} A से B तक स्थिर गति से चलती है। यदि ${a} किमी के बाद गति सामान्य गति की ${fraction} हो जाए, तो वह ${firstMinutes} मिनट देर से पहुँचती है। यदि यही कमी ${b} किमी के बाद हो, तो वह ${secondMinutes} मिनट देर से पहुँचती है। सामान्य गति और AB की दूरी क्रमशः कितनी हैं?`,
    `${scene[2]} A ਤੋਂ B ਤੱਕ ਇੱਕਸਾਰ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੀ ਹੈ। ਜੇ ${a} ਕਿਮੀ ਤੋਂ ਬਾਅਦ ਰਫ਼ਤਾਰ ਆਮ ਰਫ਼ਤਾਰ ਦੀ ${fraction} ਰਹਿ ਜਾਵੇ, ਤਾਂ ਉਹ ${firstMinutes} ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਦੀ ਹੈ। ਜੇ ਇਹੋ ਕਮੀ ${b} ਕਿਮੀ ਤੋਂ ਬਾਅਦ ਆਵੇ, ਤਾਂ ਉਹ ${secondMinutes} ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਦੀ ਹੈ। ਆਮ ਰਫ਼ਤਾਰ ਅਤੇ AB ਦੀ ਦੂਰੀ ਕ੍ਰਮਵਾਰ ਕਿੰਨੀ ਹੈ?`,
  ];
  const wrongSpeed = divide(multiply(lossFactor,subtract(input.secondPoint,input.firstPoint)),input.firstDelay);
  const pairs = [[solution.speed,solution.distance], [multiply(solution.speed,speedFraction),solution.distance],
    [solution.speed,subtract(solution.distance,input.firstPoint)], [wrongSpeed,input.secondPoint]] as const;
  const misconceptionIds = [null,"REDUCED_SPEED_AS_NORMAL","REMAINING_DISTANCE_AS_ROUTE","FIRST_DELAY_AS_DELAY_DIFFERENCE"] as const;
  return (["en","hi","pa"] as const).map((locale,l) => {
    const unit = l===0 ? "km/h" : l===1 ? "किमी/घंटा" : "ਕਿਮੀ/ਘੰਟਾ";
    const distanceUnit = l===0 ? "km" : l===1 ? "किमी" : "ਕਿਮੀ";
    const values = pairs.map(([s,r])=>`${q(s)} ${unit}, ${q(r)} ${distanceUnit}`);
    const offset=(index+l)%4, options=Object.freeze([...values.slice(offset),...values.slice(0,offset)]), correctIndex=(4-offset)%4;
    const gap = subtract(input.firstDelay,input.secondDelay);
    const labels = l===0 ? ["Extra-time factor","Delay difference (hours)","Normal speed","Route distance"] : l===1
      ? ["अतिरिक्त समय का गुणक","देरी का अंतर (घंटे)","सामान्य गति","कुल दूरी"]
      : ["ਵਾਧੂ ਸਮੇਂ ਦਾ ਗੁਣਕ","ਦੇਰੀ ਦਾ ਫ਼ਰਕ (ਘੰਟੇ)","ਆਮ ਰਫ਼ਤਾਰ","ਕੁੱਲ ਦੂਰੀ"];
    const steps = [
      `${labels[0]} = ${kd}/${kn} − 1 = ${q(lossFactor)}.`,
      `${labels[1]} = (${firstMinutes} − ${secondMinutes})/60 = ${q(gap)}.`,
      `${labels[2]} = (${b} − ${a}) × ${q(lossFactor)} ÷ ${q(gap)} = ${q(solution.speed)} ${unit}.`,
      `${labels[3]} = ${a} + (${firstMinutes}/60) × ${q(solution.speed)} ÷ ${q(lossFactor)} = ${q(solution.distance)} ${distanceUnit}.`,
    ];
    return Object.freeze({...EDITORIAL_REVIEW_LOCK,version:"TSD-CP012-SLOWDOWN-OBSERVATIONS-SOURCE-REVIEW-V1",
      authorityKey:"twoEngineInverseState",familyId:`TSD-CP012-SLOWDOWN-OBSERVATIONS-${index+1}`,locale,
      sourceObservation:index===0 ? "ARUN-SHARMA-2018-PDF423-PRINTED-III179-Q1" : "AUTHORED_PARAMETER_VARIANT",
      input,solution,stem:stems[l],answerText:values[0],options,correctIndex,
      optionMisconceptionIds:Object.freeze([...misconceptionIds.slice(offset),...misconceptionIds.slice(0,offset)]),
      explanation:Object.freeze({steps:Object.freeze(steps)})});
  });
}));
