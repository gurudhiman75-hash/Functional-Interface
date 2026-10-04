import { absRational, add, compare, divide, rational, subtract, type Rational } from "../../foundation/rational";
import type { TsdCp003EnglishFrozenRecord } from "../english-frozen";
import { formatExamNumber } from "../generation-support";
import type { TsdCp003NativePresentation } from "./native-runtime";
import {
  formatNativeDuration,
  formatNativeSolvedValue,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";

type BaseExplanation = TsdCp003NativePresentation["explanation"];

const n = (value: Rational): string => formatExamNumber(value);
const dur = (value: Rational, language: TsdCp003NativeLanguage): string => formatNativeDuration(value, language);
const km = (value: Rational): string => `${n(value)} km`;
const reciprocalGap = (first: Rational, second: Rational): Rational => absRational(
  subtract(divide(rational(1), first), divide(rational(1), second)),
);

export function enhanceCp003NativePedagogy(
  source: TsdCp003EnglishFrozenRecord,
  language: TsdCp003NativeLanguage,
  base: BaseExplanation,
): BaseExplanation {
  const input = source.input;
  const sol = source.solution;
  const hi = language === "hi";
  const C = hi ? "गणना" : "ਗਣਨਾ";
  const T = hi ? "अतः" : "ਇਸ ਲਈ";
  const final = formatNativeSolvedValue(sol.answer, sol.unit, language);

  switch (input.solveMode) {
    case "usualSpeedFromEarlyLatePair": {
      const totalGap = add(input.lateBy, input.earlyBy);
      const distance = sol.intermediate.distance!;
      const scheduled = sol.intermediate.scheduledTravelTime!;
      return Object.freeze({
        method: hi
          ? "देर और पहले पहुँचने का योग दोनों परीक्षण यात्राओं का समय-अंतर है। इससे दूरी, फिर निर्धारित समय और सामान्य गति निकालें।"
          : "ਦੇਰ ਅਤੇ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਦਾ ਜੋੜ ਦੋਵੇਂ ਪਰਖ-ਸਫ਼ਰਾਂ ਦਾ ਸਮਾਂ-ਅੰਤਰ ਹੈ। ਇਸ ਤੋਂ ਦੂਰੀ, ਫਿਰ ਨਿਰਧਾਰਤ ਸਮਾਂ ਅਤੇ ਆਮ ਰਫ਼ਤਾਰ ਕੱਢੋ।",
        steps: Object.freeze([
          `${C}: ${hi ? "समय-अंतर" : "ਸਮਾਂ-ਅੰਤਰ"} = ${dur(input.lateBy, language)} + ${dur(input.earlyBy, language)} = ${dur(totalGap, language)}।`,
          `${C}: ${hi ? "दूरी" : "ਦੂਰੀ"} = ${dur(totalGap, language)} ÷ (1/${n(input.slowerTrialSpeed)} − 1/${n(input.fasterTrialSpeed)}) = ${km(distance)}।`,
          `${C}: ${hi ? "निर्धारित यात्रा-समय" : "ਨਿਰਧਾਰਤ ਸਫ਼ਰ-ਸਮਾਂ"} = ${km(distance)} ÷ ${n(input.slowerTrialSpeed)} km/h − ${dur(input.lateBy, language)} = ${dur(scheduled, language)}।`,
          `${T} ${hi ? "सामान्य गति" : "ਆਮ ਰਫ਼ਤਾਰ"} = ${n(distance)} ÷ ${n(scheduled)} = ${final}।`,
        ]),
        answer: base.answer,
      });
    }

    case "speedChangePointDistance": {
      const baseline = divide(input.totalDistance, input.secondSpeed);
      const extra = subtract(input.totalTravelTime, baseline);
      const perKmExtra = reciprocalGap(input.firstSpeed, input.secondSpeed);
      return Object.freeze({
        method: hi
          ? "पूरा मार्ग दूसरी गति से मानकर समय निकालें। वास्तविक समय का अतिरिक्त भाग पहली गति के कारण है।"
          : "ਪੂਰਾ ਰਸਤਾ ਦੂਜੀ ਰਫ਼ਤਾਰ ਨਾਲ ਮੰਨ ਕੇ ਸਮਾਂ ਕੱਢੋ। ਅਸਲ ਸਮੇਂ ਦਾ ਵਾਧੂ ਭਾਗ ਪਹਿਲੀ ਰਫ਼ਤਾਰ ਕਰਕੇ ਹੈ।",
        steps: Object.freeze([
          `${C}: ${hi ? "पूरा मार्ग दूसरी गति से तय करने का समय" : "ਪੂਰਾ ਰਸਤਾ ਦੂਜੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਕਰਨ ਦਾ ਸਮਾਂ"} = ${n(input.totalDistance)} ÷ ${n(input.secondSpeed)} = ${dur(baseline, language)}।`,
          `${C}: ${hi ? "अतिरिक्त समय" : "ਵਾਧੂ ਸਮਾਂ"} = ${dur(input.totalTravelTime, language)} − ${dur(baseline, language)} = ${dur(extra, language)}।`,
          `${C}: ${hi ? "हर 1 km का अतिरिक्त समय" : "ਹਰ 1 km ਦਾ ਵਾਧੂ ਸਮਾਂ"} = ${dur(perKmExtra, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"}।`,
          `${T} ${hi ? "पहली गति से दूरी" : "ਪਹਿਲੀ ਰਫ਼ਤਾਰ ਨਾਲ ਦੂਰੀ"} = ${dur(extra, language)} ÷ ${dur(perKmExtra, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"} = ${final}।`,
        ]),
        answer: base.answer,
      });
    }

    case "fractionOfRouteAtChangedSpeed": {
      const changed = sol.intermediate.changedDistance!;
      const baseline = divide(input.totalDistance, input.originalSpeed);
      const changedIsFaster = compare(input.changedSpeed, input.originalSpeed) > 0;
      const timeEffect = absRational(subtract(baseline, input.totalTravelTime));
      const perKmEffect = reciprocalGap(input.originalSpeed, input.changedSpeed);
      const effectWord = changedIsFaster
        ? (hi ? "समय की बचत" : "ਸਮੇਂ ਦੀ ਬਚਤ")
        : (hi ? "अतिरिक्त समय" : "ਵਾਧੂ ਸਮਾਂ");
      return Object.freeze({
        method: changedIsFaster
          ? (hi
            ? "पूरा मार्ग पुरानी गति से मानकर समय निकालें। बचा समय बदली हुई तेज गति वाले हिस्से से आया है।"
            : "ਪੂਰਾ ਰਸਤਾ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਮੰਨ ਕੇ ਸਮਾਂ ਕੱਢੋ। ਬਚਿਆ ਸਮਾਂ ਬਦਲੀ ਹੋਈ ਤੇਜ਼ ਰਫ਼ਤਾਰ ਵਾਲੇ ਹਿੱਸੇ ਕਰਕੇ ਹੈ।")
          : (hi
            ? "पूरा मार्ग पुरानी गति से मानकर समय निकालें। अतिरिक्त समय बदली हुई धीमी गति वाले हिस्से से आया है।"
            : "ਪੂਰਾ ਰਸਤਾ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਮੰਨ ਕੇ ਸਮਾਂ ਕੱਢੋ। ਵਾਧੂ ਸਮਾਂ ਬਦਲੀ ਹੋਈ ਹੌਲੀ ਰਫ਼ਤਾਰ ਵਾਲੇ ਹਿੱਸੇ ਕਰਕੇ ਹੈ।"),
        steps: Object.freeze([
          `${C}: ${hi ? "पूरा मार्ग पुरानी गति से तय करने का समय" : "ਪੂਰਾ ਰਸਤਾ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਕਰਨ ਦਾ ਸਮਾਂ"} = ${n(input.totalDistance)} ÷ ${n(input.originalSpeed)} = ${dur(baseline, language)}।`,
          `${C}: ${effectWord} = |${dur(baseline, language)} − ${dur(input.totalTravelTime, language)}| = ${dur(timeEffect, language)}।`,
          `${C}: ${hi ? "हर 1 km का समय-अंतर" : "ਹਰ 1 km ਦਾ ਸਮਾਂ-ਅੰਤਰ"} = ${dur(perKmEffect, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"}।`,
          `${C}: ${hi ? "बदली गति वाला मार्ग" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਰਸਤਾ"} = ${dur(timeEffect, language)} ÷ ${dur(perKmEffect, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"} = ${km(changed)}।`,
          `${T} ${hi ? "प्रतिशत" : "ਪ੍ਰਤੀਸ਼ਤ"} = ${n(changed)} ÷ ${n(input.totalDistance)} × 100 = ${final}।`,
        ]),
        answer: base.answer,
      });
    }

    case "walkingRidingAllocation": {
      const walkT = sol.intermediate.walkingTime!;
      const rideT = sol.intermediate.ridingTime!;
      const walkD = sol.intermediate.walkingDistance!;
      const rideD = sol.intermediate.ridingDistance!;
      return Object.freeze({
        method: hi
          ? "पैदल समय x मानें। सवारी का समय = कुल समय − x होगा। दूरी का समीकरण बनाकर x निकालें।"
          : "ਪੈਦਲ ਸਮਾਂ x ਮੰਨੋ। ਸਵਾਰੀ ਦਾ ਸਮਾਂ = ਕੁੱਲ ਸਮਾਂ − x ਹੋਵੇਗਾ। ਦੂਰੀ ਦਾ ਸਮੀਕਰਨ ਬਣਾ ਕੇ x ਕੱਢੋ।",
        steps: Object.freeze([
          `${C}: ${n(input.walkingSpeed)}x + ${n(input.ridingSpeed)}(${n(input.totalTime)} − x) = ${n(input.totalDistance)}।`,
          `${C}: x = ${dur(walkT, language)}, ${hi ? "सवारी समय" : "ਸਵਾਰੀ ਸਮਾਂ"} = ${dur(rideT, language)}।`,
          `${C}: ${hi ? "पैदल दूरी" : "ਪੈਦਲ ਦੂਰੀ"} = ${n(input.walkingSpeed)} × ${n(walkT)} = ${km(walkD)}, ${hi ? "सवारी दूरी" : "ਸਵਾਰੀ ਦੂਰੀ"} = ${n(input.ridingSpeed)} × ${n(rideT)} = ${km(rideD)}।`,
          `${T} ${hi ? "माँगी गई राशि" : "ਮੰਗੀ ਗਈ ਰਾਸ਼ੀ"} = ${final}।`,
        ]),
        answer: base.answer,
      });
    }

    default:
      return base;
  }
}
