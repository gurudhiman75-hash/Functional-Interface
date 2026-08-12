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
          ? "देर और पहले पहुँचने का कुल अंतर दोनों परीक्षण यात्राओं के समय-अंतर के बराबर है। पहले उसी से दूरी निकालें, फिर निर्धारित यात्रा-समय और सामान्य गति निकालें।"
          : "ਦੇਰ ਅਤੇ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਦਾ ਕੁੱਲ ਅੰਤਰ ਦੋਵੇਂ ਪਰਖ-ਸਫ਼ਰਾਂ ਦੇ ਸਮੇਂ ਦੇ ਅੰਤਰ ਦੇ ਬਰਾਬਰ ਹੈ। ਪਹਿਲਾਂ ਇਸ ਤੋਂ ਦੂਰੀ ਕੱਢੋ, ਫਿਰ ਨਿਰਧਾਰਤ ਸਫ਼ਰ-ਸਮਾਂ ਅਤੇ ਆਮ ਰਫ਼ਤਾਰ ਕੱਢੋ।",
        steps: Object.freeze([
          `${C}: ${hi ? "दोनों यात्रा-समयों का अंतर" : "ਦੋਵੇਂ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ"} = ${dur(input.lateBy, language)} + ${dur(input.earlyBy, language)} = ${dur(totalGap, language)}।`,
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
          ? "तुलना के लिए पहले मानें कि पूरा मार्ग दूसरी गति से तय हुआ। वास्तविक समय में जो अतिरिक्त समय है, वही पहले धीमे भाग के कारण आया है।"
          : "ਤੁਲਨਾ ਲਈ ਪਹਿਲਾਂ ਮੰਨੋ ਕਿ ਪੂਰਾ ਰਸਤਾ ਦੂਜੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਹੋਇਆ। ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਜੋ ਵਾਧੂ ਸਮਾਂ ਹੈ, ਉਹ ਪਹਿਲੇ ਹੌਲੇ ਭਾਗ ਕਰਕੇ ਆਇਆ ਹੈ।",
        steps: Object.freeze([
          `${C}: ${hi ? "यदि पूरा मार्ग दूसरी गति से तय होता, समय" : "ਜੇ ਪੂਰਾ ਰਸਤਾ ਦੂਜੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਹੁੰਦਾ, ਸਮਾਂ"} = ${n(input.totalDistance)} ÷ ${n(input.secondSpeed)} = ${dur(baseline, language)}।`,
          `${C}: ${hi ? "पहली गति के कारण अतिरिक्त समय" : "ਪਹਿਲੀ ਰਫ਼ਤਾਰ ਕਰਕੇ ਵਾਧੂ ਸਮਾਂ"} = ${dur(input.totalTravelTime, language)} − ${dur(baseline, language)} = ${dur(extra, language)}।`,
          `${C}: ${hi ? "हर 1 km को पहली गति पर करने से अतिरिक्त समय" : "ਹਰ 1 km ਪਹਿਲੀ ਰਫ਼ਤਾਰ ਨਾਲ ਕਰਨ ਉੱਤੇ ਵਾਧੂ ਸਮਾਂ"} = ${dur(perKmExtra, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"}।`,
          `${T} ${hi ? "पहली गति से तय दूरी" : "ਪਹਿਲੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਦੂਰੀ"} = ${dur(extra, language)} ÷ ${dur(perKmExtra, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"} = ${final}।`,
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
            ? "पहले पूरे मार्ग को पुरानी गति से मानकर समय निकालें। वास्तविक यात्रा में जितना समय बचा है, उसी से बदली हुई तेज गति पर तय दूरी निकलती है।"
            : "ਪਹਿਲਾਂ ਪੂਰੇ ਰਸਤੇ ਨੂੰ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਮੰਨ ਕੇ ਸਮਾਂ ਕੱਢੋ। ਅਸਲ ਸਫ਼ਰ ਵਿੱਚ ਜਿੰਨਾ ਸਮਾਂ ਬਚਿਆ ਹੈ, ਉਸੇ ਤੋਂ ਬਦਲੀ ਹੋਈ ਤੇਜ਼ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਦੂਰੀ ਨਿਕਲਦੀ ਹੈ।")
          : (hi
            ? "पहले पूरे मार्ग को पुरानी गति से मानकर समय निकालें। वास्तविक यात्रा में जितना अतिरिक्त समय लगा है, उसी से बदली हुई धीमी गति पर तय दूरी निकलती है।"
            : "ਪਹਿਲਾਂ ਪੂਰੇ ਰਸਤੇ ਨੂੰ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਮੰਨ ਕੇ ਸਮਾਂ ਕੱਢੋ। ਅਸਲ ਸਫ਼ਰ ਵਿੱਚ ਜਿੰਨਾ ਵਾਧੂ ਸਮਾਂ ਲੱਗਿਆ ਹੈ, ਉਸੇ ਤੋਂ ਬਦਲੀ ਹੋਈ ਹੌਲੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਦੂਰੀ ਨਿਕਲਦੀ ਹੈ।"),
        steps: Object.freeze([
          `${C}: ${hi ? "यदि पूरा मार्ग पुरानी गति से तय होता, समय" : "ਜੇ ਪੂਰਾ ਰਸਤਾ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਹੁੰਦਾ, ਸਮਾਂ"} = ${n(input.totalDistance)} ÷ ${n(input.originalSpeed)} = ${dur(baseline, language)}।`,
          `${C}: ${effectWord} = |${dur(baseline, language)} − ${dur(input.totalTravelTime, language)}| = ${dur(timeEffect, language)}।`,
          `${C}: ${hi ? "बदली गति से हर 1 km पर समय का अंतर" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਨਾਲ ਹਰ 1 km ਉੱਤੇ ਸਮੇਂ ਦਾ ਅੰਤਰ"} = ${dur(perKmEffect, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"}।`,
          `${C}: ${hi ? "बदली गति वाला मार्ग" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਰਸਤਾ"} = ${dur(timeEffect, language)} ÷ ${dur(perKmEffect, language)} ${hi ? "प्रति km" : "ਪ੍ਰਤੀ km"} = ${km(changed)}।`,
          `${T} ${hi ? "बदली गति पर तय प्रतिशत" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਉੱਤੇ ਤੈਅ ਪ੍ਰਤੀਸ਼ਤ"} = ${n(changed)} ÷ ${n(input.totalDistance)} × 100 = ${final}।`,
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
          ? "पैदल चलने का समय x मानें। तब सवारी का समय = कुल समय − x होगा। दोनों दूरियों का योग कुल दूरी के बराबर रखकर x निकालें।"
          : "ਪੈਦਲ ਚੱਲਣ ਦਾ ਸਮਾਂ x ਮੰਨੋ। ਫਿਰ ਸਵਾਰੀ ਦਾ ਸਮਾਂ = ਕੁੱਲ ਸਮਾਂ − x ਹੋਵੇਗਾ। ਦੋਵੇਂ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਕੁੱਲ ਦੂਰੀ ਦੇ ਬਰਾਬਰ ਰੱਖ ਕੇ x ਕੱਢੋ।",
        steps: Object.freeze([
          `${C}: ${n(input.walkingSpeed)}x + ${n(input.ridingSpeed)}(${n(input.totalTime)} − x) = ${n(input.totalDistance)}।`,
          `${C}: x = ${dur(walkT, language)}, ${hi ? "सवारी का समय" : "ਸਵਾਰੀ ਦਾ ਸਮਾਂ"} = ${dur(rideT, language)}।`,
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
