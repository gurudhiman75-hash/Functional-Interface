import { absRational, add, divide, floorRational, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { generateCp007ExecutableCase } from "./executable-generator";
import type { TsdCp007ExecutableGeneratedCase } from "./executable-types";
import { TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES, previewTsdCp007QuestionStudioReview, type TsdCp007QuestionStudioLanguage } from "./question-studio-review-adapter";

const ONE = rational(1), TWO = rational(2), KMH = rational(18, 5);
const text = (v: Rational) => v.denominator === 1n ? `${v.numerator}` : `${v.numerator}/${v.denominator}`;
const clock = (v: Rational) => {
  const s = ((floorRational(v) % 86400n) + 86400n) % 86400n;
  return [s / 3600n, s / 60n % 60n, s % 60n].map(n => String(n).padStart(2, "0")).join(":");
};
const requireValue = (v: Rational | undefined) => { if (!v) throw new Error("CP007 V2 missing input"); return v; };
const eq = (a: Rational, b: Rational) => a.numerator * b.denominator === b.numerator * a.denominator;
const LABELS = {
  distance: ["Distance", "दूरी", "ਦੂਰੀ"], speed: ["Speed", "गति", "ਰਫ਼ਤਾਰ"], time: ["Time", "समय", "ਸਮਾਂ"],
  train: ["Train length", "ट्रेन की लंबाई", "ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ"], object: ["Fixed-object length", "स्थिर खंड की लंबाई", "ਅਚੱਲ ਹਿੱਸੇ ਦੀ ਲੰਬਾਈ"],
  extraTime: ["Extra crossing time", "पार करने का अतिरिक्त समय", "ਪਾਰ ਕਰਨ ਦਾ ਵਾਧੂ ਸਮਾਂ"],
  difference: ["Length difference", "लंबाइयों का अंतर", "ਲੰਬਾਈਆਂ ਦਾ ਅੰਤਰ"],
  interval: ["Event interval", "दो घटनाओं के बीच का समय", "ਦੋ ਘਟਨਾਵਾਂ ਵਿਚਕਾਰ ਸਮਾਂ"],
  gaps: ["Number of gaps", "अंतरालों की संख्या", "ਫ਼ਾਸਲਿਆਂ ਦੀ ਗਿਣਤੀ"], count: ["Number of posts", "खंभों की संख्या", "ਖੰਭਿਆਂ ਦੀ ਗਿਣਤੀ"],
  spacing: ["Spacing", "दो खंभों के बीच की दूरी", "ਦੋ ਖੰਭਿਆਂ ਵਿਚਕਾਰ ਦੂਰੀ"],
  clock: ["Required clock time", "पूछा गया घड़ी का समय", "ਪੁੱਛਿਆ ਗਿਆ ਘੜੀ ਦਾ ਸਮਾਂ"],
} as const;
const UNIT = { SECOND: ["s", "सेकंड", "ਸਕਿੰਟ"], METRE: ["m", "मीटर", "ਮੀਟਰ"], METRE_PER_SECOND: ["m/s", "मीटर/सेकंड", "ਮੀਟਰ/ਸਕਿੰਟ"], KMH: ["km/h", "km/h", "km/h"], COUNT: ["", "", ""], CLOCK_SECOND: ["", "", ""] } as const;
interface ErrorCalculation { id: string; value: Rational; calculation: string }
interface WorkedLine { label: keyof typeof LABELS; calculation: string; value: Rational; unit: keyof typeof UNIT }

/** New authoring candidate only. No frozen approval, registration or persistence authority. */
function calculations(g: TsdCp007ExecutableGeneratedCase) {
  const i = g.input, lines: WorkedLine[] = [], errors: ErrorCalculation[] = [];
  const p = requireValue;
  const line = (label: WorkedLine["label"], calculation: string, value: Rational, unit: WorkedLine["unit"]) => lines.push({label, calculation, value, unit});
  const error = (id: string, value: Rational, calculation: string) => errors.push({id, value, calculation});
  const t = text;
  const actual = g.solution.answerKind === "COUNT" ? rational(g.solution.count!) : p(g.solution.value);
  switch (g.authorityKey) {
    case "fixedPointCrossingTime": {
      const L = p(i.trainLength), v = p(i.speed);
      line("time", `${t(L)} ÷ ${t(v)}`, actual, "SECOND");
      error("HALF_TRAIN_LENGTH", divide(divide(L, TWO), v), `(${t(L)} ÷ 2) ÷ ${t(v)}`);
      error("DOUBLE_TRAIN_LENGTH", divide(multiply(L, TWO), v), `(2 × ${t(L)}) ÷ ${t(v)}`);
      error("REVERSE_KMH_CONVERSION", divide(L, multiply(v, KMH)), `${t(L)} ÷ (${t(v)} × 18/5)`);
      error("MPS_TREATED_AS_KMH", divide(L, divide(v, KMH)), `${t(L)} ÷ (${t(v)} × 5/18)`);
      break;
    }
    case "finiteFixedObjectCrossingTime": {
      const L = p(i.trainLength), O = p(i.fixedObjectLength), v = p(i.speed), D = add(L, O);
      line("distance", `${t(L)} + ${t(O)}`, D, "METRE"); line("time", `${t(D)} ÷ ${t(v)}`, actual, "SECOND");
      error("IGNORE_FIXED_OBJECT", divide(L, v), `${t(L)} ÷ ${t(v)}`);
      error("IGNORE_TRAIN_LENGTH", divide(O, v), `${t(O)} ÷ ${t(v)}`);
      error("USE_OCCUPANCY_DISTANCE", divide(absRational(subtract(O, L)), v), `|${t(O)} − ${t(L)}| ÷ ${t(v)}`);
      error("COUNT_TRAIN_TWICE", divide(add(multiply(L, TWO), O), v), `(2 × ${t(L)} + ${t(O)}) ÷ ${t(v)}`);
      break;
    }
    case "trainLengthFromPointCrossing": {
      const v = p(i.speed), T = p(i.pointCrossingTime);
      line("train", `${t(v)} × ${t(T)}`, actual, "METRE");
      error("DIVIDE_BY_TIME", divide(v, T), `${t(v)} ÷ ${t(T)}`);
      error("REVERSE_KMH_CONVERSION", multiply(multiply(v, KMH), T), `(${t(v)} × 18/5) × ${t(T)}`);
      error("MPS_TREATED_AS_KMH", multiply(divide(v, KMH), T), `(${t(v)} × 5/18) × ${t(T)}`);
      error("COUNT_LENGTH_TWICE", multiply(actual, TWO), `2 × (${t(v)} × ${t(T)})`);
      break;
    }
    case "trainSpeedFromPointCrossing": {
      const L = p(i.trainLength), T = p(i.pointCrossingTime);
      line("speed", `${t(L)} ÷ ${t(T)}`, actual, "METRE_PER_SECOND");
      error("MULTIPLY_BY_TIME", multiply(L, T), `${t(L)} × ${t(T)}`);
      error("COUNT_LENGTH_TWICE", divide(multiply(L, TWO), T), `(2 × ${t(L)}) ÷ ${t(T)}`);
      error("REVERSE_KMH_CONVERSION", divide(actual, KMH), `(${t(L)} ÷ ${t(T)}) × 5/18`);
      error("HALF_TRAIN_LENGTH", divide(divide(L, TWO), T), `(${t(L)} ÷ 2) ÷ ${t(T)}`);
      break;
    }
    case "fixedObjectLengthFromCrossingEvidence": {
      const L = p(i.trainLength), T = p(i.fixedObjectCrossingTime);
      const v = i.speed ?? divide(L, p(i.pointCrossingTime));
      if (i.pointCrossingTime) line("speed", `${t(L)} ÷ ${t(i.pointCrossingTime)}`, v, "METRE_PER_SECOND");
      const D = multiply(v, T);
      line("distance", `${t(v)} × ${t(T)}`, D, "METRE"); line("object", `${t(D)} − ${t(L)}`, actual, "METRE");
      error("REPORT_COMBINED_LENGTH", D, `${t(v)} × ${t(T)}`);
      error("ADD_TRAIN_INSTEAD_OF_SUBTRACT", add(D, L), `${t(D)} + ${t(L)}`);
      error("REPORT_TRAIN_LENGTH", L, `${t(L)}`);
      error("SUBTRACT_TRAIN_TWICE", subtract(D, multiply(L, TWO)), `${t(D)} − 2 × ${t(L)}`);
      break;
    }
    case "trainLengthFromPointAndObjectTimes":
    case "trainSpeedFromPointAndObjectTimes": {
      const O = p(i.fixedObjectLength), P = p(i.pointCrossingTime), T = p(i.fixedObjectCrossingTime), delta = subtract(T, P), v = divide(O, delta);
      line("extraTime", `${t(T)} − ${t(P)}`, delta, "SECOND"); line("speed", `${t(O)} ÷ ${t(delta)}`, v, "METRE_PER_SECOND");
      const lengthTarget = g.authorityKey === "trainLengthFromPointAndObjectTimes";
      if (lengthTarget) line("train", `${t(v)} × ${t(P)}`, actual, "METRE");
      const finish = (rate: Rational) => lengthTarget ? multiply(rate, P) : rate;
      const suffix = lengthTarget ? ` × ${t(P)}` : "";
      error("USE_FULL_CROSSING_TIME", finish(divide(O, T)), `(${t(O)} ÷ ${t(T)})${suffix}`);
      error("ADD_CROSSING_TIMES", finish(divide(O, add(T, P))), `(${t(O)} ÷ (${t(T)} + ${t(P)}))${suffix}`);
      error("USE_POLE_TIME", finish(divide(O, P)), `(${t(O)} ÷ ${t(P)})${suffix}`);
      error("COUNT_FIXED_LENGTH_TWICE", finish(divide(multiply(O, TWO), delta)), `((2 × ${t(O)}) ÷ ${t(delta)})${suffix}`);
      break;
    }
    case "fixedObjectLengthDifferenceFromCrossingTimes": {
      const v = p(i.speed), A = p(i.fixedObjectCrossingTime), B = p(i.secondFixedObjectCrossingTime), delta = absRational(subtract(B, A));
      line("extraTime", `|${t(B)} − ${t(A)}|`, delta, "SECOND"); line("difference", `${t(v)} × ${t(delta)}`, actual, "METRE");
      error("ADD_CROSSING_TIMES", multiply(v, add(A, B)), `${t(v)} × (${t(A)} + ${t(B)})`);
      error("USE_FIRST_FULL_DISTANCE", multiply(v, A), `${t(v)} × ${t(A)}`);
      error("USE_SECOND_FULL_DISTANCE", multiply(v, B), `${t(v)} × ${t(B)}`);
      error("DIVIDE_BY_TIME_DIFFERENCE", divide(v, delta), `${t(v)} ÷ ${t(delta)}`);
      break;
    }
    case "fullOccupancyDuration": {
      const L = p(i.trainLength), v = p(i.speed);
      if (i.occupancyTarget === "DURATION") {
        const O = p(i.fixedObjectLength), D = subtract(O, L);
        line("distance", `${t(O)} − ${t(L)}`, D, "METRE"); line("time", `${t(D)} ÷ ${t(v)}`, actual, "SECOND");
        error("USE_FULL_CROSSING_DISTANCE", divide(add(O, L), v), `(${t(O)} + ${t(L)}) ÷ ${t(v)}`);
        error("IGNORE_TRAIN_LENGTH", divide(O, v), `${t(O)} ÷ ${t(v)}`);
        error("USE_POLE_CROSSING", divide(L, v), `${t(L)} ÷ ${t(v)}`);
        error("COUNT_TRAIN_TWICE", divide(absRational(subtract(O, multiply(L, TWO))), v), `|${t(O)} − 2 × ${t(L)}| ÷ ${t(v)}`);
      } else {
        const T = p(i.occupancyDuration), D = multiply(v, T);
        line("distance", `${t(v)} × ${t(T)}`, D, "METRE"); line("object", `${t(D)} + ${t(L)}`, actual, "METRE");
        error("IGNORE_TRAIN_LENGTH", D, `${t(v)} × ${t(T)}`);
        error("SUBTRACT_TRAIN_LENGTH", subtract(D, L), `${t(D)} − ${t(L)}`);
        error("COUNT_TRAIN_TWICE", add(D, multiply(L, TWO)), `${t(D)} + 2 × ${t(L)}`);
        error("REPORT_TRAIN_LENGTH", L, `${t(L)}`);
        error("USE_TIME_AS_DIVISOR", add(divide(v, T), L), `(${t(v)} ÷ ${t(T)}) + ${t(L)}`);
        error("COUNT_OCCUPANCY_DISTANCE_TWICE", add(multiply(D, TWO), L), `2 × ${t(D)} + ${t(L)}`);
      }
      break;
    }
    case "trainCrossingEventTimeline": {
      const L = p(i.trainLength), O = p(i.fixedObjectLength), v = p(i.speed), C = p(i.knownClockSecond);
      const D = i.timelineIntervalKind === "POINT_CROSSING" ? L : i.timelineIntervalKind === "FULL_CROSSING" ? add(L, O) : subtract(O, L);
      const interval = divide(D, v), forward = i.timelineTarget === "FORWARD_CLOCK", apply = (dt: Rational) => forward ? add(C, dt) : subtract(C, dt);
      const formula = i.timelineIntervalKind === "POINT_CROSSING" ? t(L) : `${t(O)} ${i.timelineIntervalKind === "FULL_CROSSING" ? "+" : "−"} ${t(L)}`;
      line("distance", formula, D, "METRE"); line("interval", `${t(D)} ÷ ${t(v)}`, interval, "SECOND");
      line("clock", `${clock(C)} ${forward ? "+" : "−"} ${t(interval)} s`, actual, "CLOCK_SECOND");
      error("REVERSE_EVENT_ORDER", forward ? subtract(C, interval) : add(C, interval), `${clock(C)} ${forward ? "−" : "+"} ${t(interval)} s`);
      for (const [id, distance] of [["USE_POINT_INTERVAL", L], ["USE_FULL_CROSSING_INTERVAL", add(L, O)], ["USE_OCCUPANCY_INTERVAL", subtract(O, L)], ["IGNORE_TRAIN_LENGTH", O]] as const) {
        error(id, apply(divide(distance, v)), `${clock(C)} ${forward ? "+" : "−"} (${t(distance)} ÷ ${t(v)}) s`);
      }
      break;
    }
    case "fixedSpacingPointCount": {
      const included = i.includeStartingPoint ? ONE : rational(0);
      if (i.spacingTarget === "POINT_COUNT") {
        const D = p(i.distanceWindow), S = p(i.spacing), gaps = rational(floorRational(divide(D, S)));
        line("gaps", `${t(D)} ÷ ${t(S)}`, gaps, "COUNT"); line("count", `${t(gaps)} + ${t(included)}`, actual, "COUNT");
        error("REVERSE_START_CONVENTION", add(gaps, i.includeStartingPoint ? rational(0) : ONE), `${t(gaps)} + ${i.includeStartingPoint ? "0" : "1"}`);
        error("EXCLUDE_FINISH_POST", subtract(actual, ONE), `${t(gaps)} + ${t(included)} − 1`);
        error("ADD_BOTH_BOUNDARIES", add(gaps, TWO), `${t(gaps)} + 2`);
        error("COUNT_GAPS_AS_TWO_ENDS", multiply(gaps, TWO), `2 × ${t(gaps)}`);
        error("COUNT_DOUBLE_SPACING", add(rational(floorRational(divide(D, multiply(S, TWO)))), included), `floor(${t(D)} ÷ (2 × ${t(S)})) + ${t(included)}`);
      } else {
        const N = rational(i.observedPointCount!), gaps = subtract(N, included);
        line("gaps", `${t(N)} − ${t(included)}`, gaps, "COUNT");
        if (i.spacingTarget === "SPACING") {
          const D = p(i.distanceWindow);
          line("spacing", `${t(D)} ÷ ${t(gaps)}`, actual, "METRE");
          for (const [id, wrongGaps] of [["REVERSE_START_CONVENTION", subtract(N, i.includeStartingPoint ? rational(0) : ONE)], ["ADD_START_POST", add(N, ONE)], ["COUNT_TWO_ENDS_AS_GAPS", add(N, TWO)], ["EXCLUDE_BOTH_ENDS", subtract(N, TWO)]] as const) {
            if (wrongGaps.numerator > 0n) error(id, divide(D, wrongGaps), `${t(D)} ÷ ${t(wrongGaps)}`);
          }
        } else {
          const S = p(i.spacing), T = p(i.timeWindow), D = multiply(S, gaps);
          line("distance", `${t(S)} × ${t(gaps)}`, D, "METRE"); line("speed", `${t(D)} ÷ ${t(T)}`, actual, "METRE_PER_SECOND");
          for (const [id, wrongGaps] of [["REVERSE_START_CONVENTION", subtract(N, i.includeStartingPoint ? rational(0) : ONE)], ["ADD_START_POST", add(N, ONE)], ["COUNT_TWO_ENDS_AS_GAPS", add(N, TWO)], ["EXCLUDE_BOTH_ENDS", subtract(N, TWO)]] as const) {
            if (wrongGaps.numerator > 0n) error(id, divide(multiply(S, wrongGaps), T), `(${t(S)} × ${t(wrongGaps)}) ÷ ${t(T)}`);
          }
        }
      }
      break;
    }
  }
  return {lines, errors, actual};
}

export function buildCp007ContentReviewCandidateV2() {
  const out = [];
  for (const language of ["en", "hi", "pa"] as const) {
    const localeIndex = language === "en" ? 0 : language === "hi" ? 1 : 2;
    for (const ql of TSD_CP007_FROZEN_ENGLISH_REGISTRY) {
      for (const family of ql.stemFamilies) {
        const sources = previewTsdCp007QuestionStudioReview({language, familyId: family.familyId, count: TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES[family.familyId]!.length, seed: "CP007-CONTENT-REVIEW-V2"}).questions;
        for (const source of sources) {
          const g = generateCp007ExecutableCase(ql.authorityKey, `cp007:${ql.authorityKey}:${source.parameters.caseIndex}`);
          const {lines, errors, actual} = calculations(g);
          const outputKmh = source.answer.endsWith("km/h"), unit = outputKmh ? "KMH" : g.solution.unit;
          const convert = (v: Rational) => outputKmh ? multiply(v, KMH) : v;
          const display = (v: Rational) => unit === "CLOCK_SECOND" ? clock(v) : `${text(convert(v))}${UNIT[unit][localeIndex] ? ` ${UNIT[unit][localeIndex]}` : ""}`;
          const answer = display(actual), seen = new Set([answer]);
          const wrong = errors.filter(error => {
            if (unit !== "CLOCK_SECOND" && error.value.numerator <= 0n) return false;
            const s = display(error.value); if (seen.has(s)) return false; seen.add(s); return true;
          }).slice(0, 3);
          if (wrong.length !== 3) throw new Error(`${source.familyId}/${source.parameters.caseIndex}: insufficient distinct misconception calculations`);
          const selected = [{id: "CORRECT", value: actual, calculation: lines.at(-1)!.calculation}, ...wrong];
          const shift = (source.parameters.caseIndex + source.familyId.charCodeAt(source.familyId.length - 1)) % 4;
          const arranged = selected.map((_, i) => selected[(i + shift) % 4]!);
          const steps = lines.map(line => `${LABELS[line.label][localeIndex]} = ${line.calculation} = ${line.unit === "CLOCK_SECOND" ? clock(line.value) : text(line.value)}${UNIT[line.unit][localeIndex] ? ` ${UNIT[line.unit][localeIndex]}` : ""}.`);
          if (source.stem.includes("km/h") && g.input.speed) steps.unshift(`${LABELS.speed[localeIndex]} = ${text(multiply(g.input.speed, KMH))} × 5/18 = ${text(g.input.speed)} ${UNIT.METRE_PER_SECOND[localeIndex]}.`);
          if (outputKmh) steps.push(`${LABELS.speed[localeIndex]} = ${text(actual)} × 18/5 = ${answer}.`);
          out.push(Object.freeze({
            ...source, options: Object.freeze(arranged.map(option => display(option.value))), correctIndex: arranged.findIndex(option => option.id === "CORRECT"), answer,
            explanation: Object.freeze({steps: Object.freeze(steps), conclusion: answer}),
            optionProvenance: Object.freeze(arranged.map(option => Object.freeze({misconceptionId: option.id, calculation: option.calculation, exactValue: option.value}))),
            input: g.input, solution: g.solution,
            runtimeMode: "TSD-CP007-CONTENT-REVIEW-CANDIDATE-V2", reviewStatus: "UNAPPROVED_CONTENT_REVIEW_CANDIDATE",
            validation: Object.freeze({...source.validation, frozenAuthority: false, sourceFrozenAuthorityPreserved: true}),
            candidateLifecycle: Object.freeze({contentApproved: false, frozen: false, questionStudioRegistered: false, persistenceAllowed: false, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false}),
          }));
        }
      }
    }
  }
  return Object.freeze(out);
}
