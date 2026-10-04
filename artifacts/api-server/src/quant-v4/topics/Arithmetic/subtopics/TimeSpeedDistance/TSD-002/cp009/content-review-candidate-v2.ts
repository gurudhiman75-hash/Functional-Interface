import { add, divide, equals, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { calculationWriter, display, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP009_ENGLISH_REVIEW_CASES } from "./english-review-cases";
import { TSD_CP009_LOCALIZED_REVIEW_CASES } from "./localized-review-cases";
import { TSD_CP009_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";
import { TSD_CP009_RENDERED_LOCALIZED_QUESTIONS } from "./localized-rendered-review";
import { TSD_CP009_MEETING_CONTENT_REVIEW_V2 } from "./meeting-content-review-v2";
import type { TsdCp009ExecutableInput } from "./executable-types";

const K = (v: Rational) => multiply(v, rational(18, 5));
const D = (v: Rational) => divide(v, rational(1000));
const H = (v: Rational) => divide(v, rational(3600));
const labels = {
  assisted: ["Speed with the flow", "प्रवाह की दिशा में चाल", "ਵਹਾਅ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚਾਲ"],
  opposed: ["Speed against the flow", "प्रवाह के विरुद्ध चाल", "ਵਹਾਅ ਦੇ ਵਿਰੁੱਧ ਚਾਲ"],
  body: ["Speed in still water", "शांत जल में चाल", "ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਚਾਲ"],
  medium: ["Current speed", "धारा की चाल", "ਧਾਰਾ ਦੀ ਚਾਲ"],
  time: ["Travel time", "यात्रा का समय", "ਸਫ਼ਰ ਦਾ ਸਮਾਂ"],
  distance: ["Distance travelled", "तय दूरी", "ਤੈਅ ਦੂਰੀ"],
  sum: ["Sum of the speeds", "चालों का योग", "ਚਾਲਾਂ ਦਾ ਜੋੜ"],
  difference: ["Difference between the speeds", "चालों का अंतर", "ਚਾਲਾਂ ਦਾ ਫ਼ਰਕ"],
  inverseGap: ["Difference between time per kilometre", "प्रति किमी लगने वाले समय का अंतर", "ਪ੍ਰਤੀ ਕਿਮੀ ਲੱਗਣ ਵਾਲੇ ਸਮੇਂ ਦਾ ਫ਼ਰਕ"],
  ratioSum: ["Time ratio plus one", "समय के अनुपात में एक जोड़ने पर", "ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਇੱਕ ਜੋੜਨ 'ਤੇ"],
  ratioDifference: ["Time ratio minus one", "समय के अनुपात में से एक घटाने पर", "ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚੋਂ ਇੱਕ ਘਟਾਉਣ 'ਤੇ"],
  assistedTime: ["Time with the flow", "प्रवाह की दिशा में समय", "ਵਹਾਅ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਸਮਾਂ"],
  opposedTime: ["Time against the flow", "प्रवाह के विरुद्ध समय", "ਵਹਾਅ ਦੇ ਵਿਰੁੱਧ ਸਮਾਂ"],
  totalTime: ["Total travel time", "यात्रा का कुल समय", "ਸਫ਼ਰ ਦਾ ਕੁੱਲ ਸਮਾਂ"],
  totalDistance: ["Total distance", "कुल दूरी", "ਕੁੱਲ ਦੂਰੀ"],
  average: ["Average speed", "औसत चाल", "ਔਸਤ ਚਾਲ"],
  remainingTime: ["Time for the remaining leg", "शेष यात्रा का समय", "ਬਾਕੀ ਸਫ਼ਰ ਦਾ ਸਮਾਂ"],
  assistedDistance: ["Distance with the flow", "प्रवाह की दिशा में दूरी", "ਵਹਾਅ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੂਰੀ"],
  opposedDistance: ["Distance against the flow", "प्रवाह के विरुद्ध दूरी", "ਵਹਾਅ ਦੇ ਵਿਰੁੱਧ ਦੂਰੀ"],
  distanceGap: ["Difference between distances", "दूरियों का अंतर", "ਦੂਰੀਆਂ ਦਾ ਫ਼ਰਕ"],
  closing: ["Closing speed", "सापेक्ष चाल", "ਸਾਪੇਖ ਚਾਲ"],
  meeting: ["Distance from upstream end", "ऊपरी सिरे से दूरी", "ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਦੂਰੀ"],
  drift: ["Floating object's speed", "तैरती वस्तु की चाल", "ਤੈਰਦੀ ਵਸਤੂ ਦੀ ਚਾਲ"],
  separation: ["Separation at the turn", "मुड़ते समय दूरी", "ਮੁੜਨ ਵੇਲੇ ਦੂਰੀ"],
  recovery: ["Recovery time after turning", "मुड़ने के बाद मिलने का समय", "ਮੁੜਨ ਤੋਂ ਬਾਅਦ ਮਿਲਣ ਦਾ ਸਮਾਂ"],
  driftDistance: ["Drift distance from the drop point", "गिरने के स्थान से बहने की दूरी", "ਡਿੱਗਣ ਵਾਲੀ ਥਾਂ ਤੋਂ ਵਹਿਣ ਦੀ ਦੂਰੀ"],
  firstGround: ["Initial ground speed", "प्रारंभिक वास्तविक चाल", "ਸ਼ੁਰੂਆਤੀ ਅਸਲ ਚਾਲ"],
  secondGround: ["New ground speed", "नई वास्तविक चाल", "ਨਵੀਂ ਅਸਲ ਚਾਲ"],
  firstCurrent: ["Initial current speed", "प्रारंभिक धारा की चाल", "ਸ਼ੁਰੂਆਤੀ ਧਾਰਾ ਦੀ ਚਾਲ"],
  newCurrent: ["New current speed", "नई धारा की चाल", "ਨਵੀਂ ਧਾਰਾ ਦੀ ਚਾਲ"],
  currentChange: ["Increase in current speed", "धारा की चाल में वृद्धि", "ਧਾਰਾ ਦੀ ਚਾਲ ਵਿੱਚ ਵਾਧਾ"],
  polynomial: ["Equation for still-water speed u", "शांत जल की चाल u का समीकरण", "ਸ਼ਾਂਤ ਪਾਣੀ ਦੀ ਚਾਲ u ਦਾ ਸਮੀਕਰਨ"],
  discriminant: ["Discriminant", "विविक्तकर", "ਵਿਵੇਚਕ"],
} as const;

function exactSqrt(v: Rational): Rational {
  const root = (n: bigint) => {
    if (n < 0n) throw new Error("Negative discriminant");
    if (n < 2n) return n;
    let x = n, next = (x + 1n) / 2n;
    while (next < x) { x = next; next = (x + n / x) / 2n; }
    if (x * x !== n) throw new Error("Review discriminant is not an exact square");
    return x;
  };
  return rational(root(v.numerator), root(v.denominator));
}

export function cp009WorkedCalculations(input: TsdCp009ExecutableInput, locale: ReviewLocale, familyId: string) {
  const w = calculationWriter(locale), b = w.binary, f = display;
  const wind = ["104-E", "105-E", "105-F", "108-F", "110-E"].includes(familyId);
  const bodyLabel = wind ? ["Still-air speed", "शांत हवा में चाल", "ਸ਼ਾਂਤ ਹਵਾ ਵਿੱਚ ਚਾਲ"] as const : labels.body;
  const mediumLabel = wind ? ["Wind speed", "हवा की चाल", "ਹਵਾ ਦੀ ਚਾਲ"] as const : labels.medium;
  const notes: string[] = [];
  const note = (values: readonly [string, string, string]) => notes.push(values[locale === "en-IN" ? 0 : locale === "hi-IN" ? 1 : 2]);
  let result: Rational;
  const adjusted = (u: Rational, c: Rational, direction: "ASSISTED" | "OPPOSED") => b(direction === "ASSISTED" ? labels.assisted : labels.opposed, K(u), direction === "ASSISTED" ? "+" : "−", K(c), "km/h");
  switch (input.authorityKey) {
    case "mediumAdjustedGroundSpeed":
      result = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, input.direction); break;
    case "mediumComponentsFromAssistedOpposedSpeeds": {
      const combined = b(input.target === "BODY_SPEED" ? labels.sum : labels.difference, K(input.assistedGroundSpeed), input.target === "BODY_SPEED" ? "+" : "−", K(input.opposedGroundSpeed), "km/h");
      result = b(input.target === "BODY_SPEED" ? bodyLabel : mediumLabel, combined, "÷", rational(2), "km/h"); break;
    }
    case "mediumLegTravelState": {
      const speed = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, input.direction);
      result = input.target === "TIME" ? b(labels.time, D(input.distance), "÷", speed, "h") : b(labels.distance, speed, "×", H(input.time), "km"); break;
    }
    case "pairedEqualDistanceMediumState": {
      if (input.mode === "COMPONENT_FROM_DISTANCE_AND_TIMES") {
        const assisted = b(labels.assisted, D(input.equalDistance), "÷", H(input.assistedTime), "km/h");
        const opposed = b(labels.opposed, D(input.equalDistance), "÷", H(input.opposedTime), "km/h");
        const combined = b(input.target === "BODY_SPEED" ? labels.sum : labels.difference, assisted, input.target === "BODY_SPEED" ? "+" : "−", opposed, "km/h");
        result = b(input.target === "BODY_SPEED" ? bodyLabel : mediumLabel, combined, "÷", rational(2), "km/h");
      } else if (input.mode === "DISTANCE_FROM_TIME_DIFFERENCE") {
        const assisted = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
        const opposed = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
        const gap = subtract(divide(rational(1), opposed), divide(rational(1), assisted));
        w.put(labels.inverseGap, `1/(${f(opposed)}) − 1/(${f(assisted)})`, gap, "h/km");
        result = b(labels.distance, H(input.opposedMinusAssistedTime), "÷", gap, "km");
      } else {
        // For equal distances, the upstream/downstream time ratio is (u+c)/(u−c).
        const r = input.opposedToAssistedTimeRatio;
        const c = input.mode === "BODY_SPEED_FROM_TIME_RATIO" ? f(K(input.mediumSpeed)) : "c";
        const u = input.mode === "MEDIUM_SPEED_FROM_TIME_RATIO" ? f(K(input.bodyRelativeSpeed)) : "u";
        note([
          `For equal distances, time is inversely proportional to speed: (${u} + ${c})/(${u} − ${c}) = ${f(r)}. Rearrange this equation to find the unknown speed.`,
          `बराबर दूरियों के लिए समय चाल के व्युत्क्रमानुपाती है: (${u} + ${c})/(${u} − ${c}) = ${f(r)}। इस समीकरण से अज्ञात चाल निकालते हैं।`,
          `ਬਰਾਬਰ ਦੂਰੀਆਂ ਲਈ ਸਮਾਂ ਚਾਲ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ: (${u} + ${c})/(${u} − ${c}) = ${f(r)}। ਇਸ ਸਮੀਕਰਨ ਤੋਂ ਅਣਜਾਣ ਚਾਲ ਕੱਢਦੇ ਹਾਂ।`,
        ]);
        const sum = b(labels.ratioSum, r, "+", rational(1), "");
        const difference = b(labels.ratioDifference, r, "−", rational(1), "");
        if (input.mode === "BODY_SPEED_FROM_TIME_RATIO") {
          result = w.put(bodyLabel, `(${f(K(input.mediumSpeed))}) × (${f(sum)}) ÷ (${f(difference)})`, divide(multiply(K(input.mediumSpeed), sum), difference), "km/h");
        } else {
          result = w.put(mediumLabel, `(${f(K(input.bodyRelativeSpeed))}) × (${f(difference)}) ÷ (${f(sum)})`, divide(multiply(K(input.bodyRelativeSpeed), difference), sum), "km/h");
        }
      } break;
    }
    case "roundTripMediumState": {
      const assisted = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
      const opposed = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
      const ta = b(labels.assistedTime, D(input.oneWayDistance), "÷", assisted, "h");
      const to = b(labels.opposedTime, D(input.oneWayDistance), "÷", opposed, "h");
      const time = b(labels.totalTime, ta, "+", to, "h");
      if (input.target === "TOTAL_TIME") result = time;
      else { const d = b(labels.totalDistance, rational(2), "×", D(input.oneWayDistance), "km"); result = b(labels.average, d, "÷", time, "km/h"); }
      break;
    }
    case "mixedUnequalLegMediumState": {
      const c = K(input.mediumSpeed), time = H(input.totalTime);
      if (input.target !== "BODY_SPEED") {
        const assisted = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
        const opposed = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
        const knownTime = input.target === "ASSISTED_DISTANCE" ? b(labels.opposedTime, D(input.opposedDistance), "÷", opposed, "h") : b(labels.assistedTime, D(input.assistedDistance), "÷", assisted, "h");
        const remaining = b(labels.remainingTime, time, "−", knownTime, "h");
        result = b(input.target === "ASSISTED_DISTANCE" ? labels.assistedDistance : labels.opposedDistance, remaining, "×", input.target === "ASSISTED_DISTANCE" ? assisted : opposed, "km");
      } else {
        const da = D(input.assistedDistance), dO = D(input.opposedDistance);
        const sum = add(da, dO), constant = add(multiply(time, multiply(c, c)), multiply(subtract(dO, da), c));
        w.put(labels.totalTime, `${f(da)}/(u + ${f(c)}) + ${f(dO)}/(u − ${f(c)})`, time, "h");
        w.put(labels.polynomial, `(${f(time)})u² − (${f(sum)})u − (${f(constant)})`, rational(0), "");
        const discriminant = add(multiply(sum, sum), multiply(rational(4), multiply(time, constant)));
        w.put(labels.discriminant, `(${f(sum)})² + 4 × (${f(time)}) × (${f(constant)})`, discriminant, "");
        const root = exactSqrt(discriminant);
        result = w.put(bodyLabel, `((${f(sum)}) + √(${f(discriminant)})) ÷ (2 × (${f(time)}))`, divide(add(sum, root), multiply(rational(2), time)), "km/h");
        const otherRoot = divide(subtract(sum, root), multiply(rational(2), time));
        note([
          `Let u be the still-water speed in km/h. Multiply the time equation by (u + ${f(c)})(u − ${f(c)}) to obtain the quadratic equation. The other root is ${f(otherRoot)} km/h; reject it because u must exceed the current speed of ${f(c)} km/h.`,
          `शांत जल में चाल u किमी/घंटा मानते हैं। समय के समीकरण को (u + ${f(c)})(u − ${f(c)}) से गुणा करने पर द्विघात समीकरण मिलता है। दूसरा मूल ${f(otherRoot)} किमी/घंटा है; इसे नहीं लेते, क्योंकि u धारा की चाल ${f(c)} किमी/घंटा से अधिक होना चाहिए।`,
          `ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਚਾਲ u ਕਿਮੀ/ਘੰਟਾ ਮੰਨਦੇ ਹਾਂ। ਸਮੇਂ ਦੇ ਸਮੀਕਰਨ ਨੂੰ (u + ${f(c)})(u − ${f(c)}) ਨਾਲ ਗੁਣਾ ਕਰਨ 'ਤੇ ਦੋਘਾਤੀ ਸਮੀਕਰਨ ਮਿਲਦਾ ਹੈ। ਦੂਜਾ ਮੂਲ ${f(otherRoot)} ਕਿਮੀ/ਘੰਟਾ ਹੈ; ਇਸ ਨੂੰ ਨਹੀਂ ਲੈਂਦੇ, ਕਿਉਂਕਿ u ਧਾਰਾ ਦੀ ਚਾਲ ${f(c)} ਕਿਮੀ/ਘੰਟਾ ਤੋਂ ਵੱਧ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`,
        ]);
      } break;
    }
    case "equalTimeMediumDistanceSpread": {
      const difference = b(labels.difference, rational(2), "×", K(input.mediumSpeed), "km/h");
      result = b(labels.distanceGap, difference, "×", H(input.equalTime), "km"); break;
    }
    case "mediumShiftedMeetingPoint": {
      const a = adjusted(input.fromUpstreamBodySpeed, input.mediumSpeed, "ASSISTED");
      const o = adjusted(input.fromDownstreamBodySpeed, input.mediumSpeed, "OPPOSED");
      const closing = b(labels.closing, a, "+", o, "km/h");
      const t = b(labels.time, D(input.routeDistance), "÷", closing, "h");
      result = b(labels.meeting, a, "×", t, "km"); break;
    }
    case "passiveFloatingObjectState": {
      const speed = w.put(labels.drift, f(K(input.mediumSpeed)), K(input.mediumSpeed), "km/h");
      result = input.target === "FLOAT_SPEED" ? speed : b(labels.time, D(input.distance), "÷", speed, "h"); break;
    }
    case "floatingObjectRecoveryState": {
      // In the water frame the object is stationary and the boat's speed is u on both legs.
      note([
        `The object drifts with the current. Relative to the object, the boat moves at its still-water speed of ${f(K(input.bodyRelativeSpeed))} km/h both before and after turning.`,
        `वस्तु धारा के साथ बहती है। वस्तु के सापेक्ष नाव की चाल मुड़ने से पहले और बाद में शांत जल वाली चाल ${f(K(input.bodyRelativeSpeed))} किमी/घंटा रहती है।`,
        `ਵਸਤੂ ਧਾਰਾ ਨਾਲ ਵਗਦੀ ਹੈ। ਵਸਤੂ ਦੇ ਮੁਕਾਬਲੇ ਕਿਸ਼ਤੀ ਦੀ ਚਾਲ ਮੁੜਨ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਸ਼ਾਂਤ ਪਾਣੀ ਵਾਲੀ ਚਾਲ ${f(K(input.bodyRelativeSpeed))} ਕਿਮੀ/ਘੰਟਾ ਰਹਿੰਦੀ ਹੈ।`,
      ]);
      const separation = b(labels.separation, K(input.bodyRelativeSpeed), "×", H(input.separationTimeBeforeTurn), "km");
      const time = b(labels.recovery, separation, "÷", K(input.bodyRelativeSpeed), "h");
      if (input.target === "RECOVERY_TIME_AFTER_TURN") result = time;
      else { const total = b(labels.totalTime, H(input.separationTimeBeforeTurn), "+", time, "h"); result = b(labels.driftDistance, K(input.mediumSpeed), "×", total, "km"); }
      break;
    }
    case "changingMediumState": {
      const first = b(labels.firstGround, D(input.distance), "÷", H(input.firstTripTime), "km/h");
      const second = b(labels.secondGround, D(input.distance), "÷", H(input.secondTripTime), "km/h");
      const u = K(input.bodyRelativeSpeed);
      const initial = input.direction === "ASSISTED" ? b(labels.firstCurrent, first, "−", u, "km/h") : b(labels.firstCurrent, u, "−", first, "km/h");
      const next = input.direction === "ASSISTED" ? b(labels.newCurrent, second, "−", u, "km/h") : b(labels.newCurrent, u, "−", second, "km/h");
      result = input.target === "NEW_MEDIUM_SPEED" ? next : b(labels.currentChange, next, "−", initial, "km/h"); break;
    }
  }
  return Object.freeze({ result, notes: Object.freeze(notes), steps: Object.freeze(w.steps) });
}

const english = new Map(TSD_CP009_ENGLISH_REVIEW_CASES.map(row => [row.familyId, row]));
const native = new Map(TSD_CP009_LOCALIZED_REVIEW_CASES.map(row => [row.familyId, row]));
const meeting = new Map(TSD_CP009_MEETING_CONTENT_REVIEW_V2.map(row => [`${row.locale}:${row.familyId}`, row]));
export const TSD_CP009_CONTENT_REVIEW_V2 = Object.freeze([
  ...TSD_CP009_RENDERED_ENGLISH_QUESTIONS.map(row => ({ ...row, locale: "en-IN" as const })),
  ...TSD_CP009_RENDERED_LOCALIZED_QUESTIONS,
].map(row => {
  const source = (row.locale === "en-IN" ? english : native).get(row.familyId);
  if (!source) throw new Error(`${row.familyId}: CP009 source missing`);
  const worked = cp009WorkedCalculations(source.input, row.locale, row.familyId);
  const expected = source.solution.unit === "METRE" ? D(source.solution.value) : source.solution.unit === "SECOND" ? H(source.solution.value) : K(source.solution.value);
  if (!equals(worked.result, expected)) throw new Error(`${row.locale}/${row.familyId}: CP009 worked answer mismatch`);
  const correction = meeting.get(`${row.locale}:${row.familyId}`);
  return Object.freeze({ ...row, version: "tsd-cp009-content-review-v2", ...EDITORIAL_REVIEW_LOCK,
    stem: correction?.stem ?? row.stem, sourceStem: row.stem, sourceExplanation: row.explanation,
    input: source.input, sourceSolution: source.solution,
    explanation: Object.freeze([...worked.notes, ...worked.steps.map(step => step.text)]), calculations: worked.steps,
  });
}));
