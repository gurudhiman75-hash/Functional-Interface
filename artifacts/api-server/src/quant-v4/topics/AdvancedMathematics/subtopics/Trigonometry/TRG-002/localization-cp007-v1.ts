import { createHash } from "node:crypto";

import { toDegrees } from "../foundation/angle";
import {
  assertDefined,
  divideExact,
  exactToNumber,
  formatExactPlain,
  subtractExact,
} from "../foundation/exact";
import { requireTrigExact } from "../foundation/standard-values";
import type { ExactTrigNumber } from "../foundation/types";
import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";

export const TRG_002_CP007_LOCALIZATION_VERSION = "TRG002_CP007_HI_PA_LOCALIZATION_V1" as const;
export const TRG_002_CP007_LOCALIZATION_AUTHORITY = "FROZEN_ENGLISH_CANONICAL_SPATIAL_TRANSFORMATION_V1" as const;
export const TRG_002_CP007_LOCALIZATION_QL_IDS = Array.from(
  { length: 24 },
  (_, index) => `TRG-002-QL-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];

export type Trg002LocalizedLocale = "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;
type State = AnyQuestion["canonicalSpatialState"];
type NativeObjectKind = "TOWER" | "BUILDING" | "POLE" | "FLAGPOLE" | "TREE" | "CHIMNEY" | "MAST" | "WALL";

const OBJECT_NAMES: Readonly<Record<Trg002LocalizedLocale, Readonly<Record<NativeObjectKind, string>>>> = {
  "hi-IN": {
    TOWER: "मीनार", BUILDING: "भवन", POLE: "खंभा", FLAGPOLE: "ध्वजदंड",
    TREE: "पेड़", CHIMNEY: "चिमनी", MAST: "मस्तूल", WALL: "दीवार",
  },
  "pa-IN": {
    TOWER: "ਮੀਨਾਰ", BUILDING: "ਇਮਾਰਤ", POLE: "ਖੰਭਾ", FLAGPOLE: "ਝੰਡੇ ਦਾ ਡੰਡਾ",
    TREE: "ਦਰੱਖਤ", CHIMNEY: "ਚਿਮਨੀ", MAST: "ਮਸਤੂਲ", WALL: "ਕੰਧ",
  },
};

function native(locale: Trg002LocalizedLocale, hi: string, pa: string) {
  return locale === "hi-IN" ? hi : pa;
}

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}

function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

function absoluteExactDifference(left: ExactTrigNumber, right: ExactTrigNumber) {
  return exactToNumber(left) >= exactToNumber(right) ? subtractExact(left, right) : subtractExact(right, left);
}

const exactText = (value: ExactTrigNumber) => formatExactPlain(value);

function degreesText(angle: any) {
  const degrees = toDegrees(angle);
  return `${degrees.denominator === 1n ? degrees.numerator : `${degrees.numerator}/${degrees.denominator}`}°`;
}

function point(state: State, id: string) {
  const found = state.points.find((item: AnyQuestion) => item.id === id);
  if (!found) throw new Error(`TRG-002 localization: missing canonical point ${id}.`);
  return found;
}

function observerFor(state: State, observation: AnyQuestion) {
  const found = state.observers.find((item: AnyQuestion) => item.id === observation.observerId);
  if (!found) throw new Error(`TRG-002 localization: missing observer ${observation.observerId}.`);
  return found;
}

function sameCoordinate(first: AnyQuestion, second: AnyQuestion) {
  return Math.abs(exactToNumber(first.x) - exactToNumber(second.x)) <= 1e-9
    && Math.abs(exactToNumber(first.y) - exactToNumber(second.y)) <= 1e-9;
}

function targetObjectFor(state: State, observation: AnyQuestion) {
  const direct = state.verticalObjects.find((item: AnyQuestion) => item.topPointId === observation.targetPointId);
  if (direct) return direct;

  if (state.requested?.kind === "OBJECT_HEIGHT") {
    const requested = state.verticalObjects.find((item: AnyQuestion) => item.id === state.requested.objectId);
    if (requested) return requested;
  }

  const target = point(state, observation.targetPointId);
  const coordinateMatch = state.verticalObjects.find((item: AnyQuestion) => {
    const top = state.points.find((candidate: AnyQuestion) => candidate.id === item.topPointId);
    return top ? sameCoordinate(top, target) : false;
  });
  if (coordinateMatch) return coordinateMatch;

  const nonObserverObjects = state.verticalObjects.filter((item: AnyQuestion) => item.topPointId !== observation.eyePointId);
  if (nonObserverObjects.length === 1) return nonObserverObjects[0];
  if (state.verticalObjects.length === 1) return state.verticalObjects[0];

  throw new Error(`TRG-002 localization: cannot resolve target object for ${observation.targetPointId}.`);
}

function objectName(kind: string, locale: Trg002LocalizedLocale) {
  return OBJECT_NAMES[locale][kind as NativeObjectKind] ?? native(locale, "वस्तु", "ਵਸਤੂ");
}

function cp007Geometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  if (question.cpId !== "TRG-CP-007") throw new Error(`${question.qlId}: CP007 localizer received ${question.cpId}.`);
  if (state.observations.length !== 1) throw new Error(`${question.qlId}: CP007 V1 expects exactly one observation.`);
  const observation = state.observations[0];
  const observer = observerFor(state, observation);
  const eye = point(state, observation.eyePointId);
  const target = point(state, observation.targetPointId);
  const targetObject = targetObjectFor(state, observation);
  const horizontal = absoluteExactDifference(eye.x, target.x);
  const verticalDelta = absoluteExactDifference(eye.y, target.y);
  const sightLine = assertDefined(divideExact(verticalDelta, requireTrigExact("SIN", observation.angle)));
  return { state, observation, observer, eye, target, targetObject, horizontal, verticalDelta, sightLine, angleText: degreesText(observation.angle) };
}

function localizedStem(question: AnyQuestion, locale: Trg002LocalizedLocale) {
  const g = cp007Geometry(question);
  const object = objectName(g.targetObject.kind, locale);
  const horizontal = exactText(g.horizontal);
  const height = exactText(g.targetObject.height);
  const observerHeight = exactText(g.observer.eyeHeight);
  const sight = exactText(g.sightLine);
  const angle = g.angleText;

  if (question.qlId === "TRG-002-QL-023") {
    return native(locale,
      `एक ${object} के शीर्ष तक दृष्टि-रेखा की लंबाई ${sight} m है और उन्नयन कोण ${angle} है। ${object} की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ${object} ਦੀ ਚੋਟੀ ਤੱਕ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਦੀ ਲੰਬਾਈ ${sight} m ਹੈ ਅਤੇ ਉਚਾਈ ਕੋਣ ${angle} ਹੈ। ${object} ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
  }
  if (question.qlId === "TRG-002-QL-024") {
    return native(locale,
      `एक ${object} की ऊँचाई ${height} m है और उसके शीर्ष का उन्नयन कोण ${angle} है। अवलोकन बिंदु से शीर्ष तक दृष्टि-रेखा की लंबाई ज्ञात कीजिए।`,
      `ਇੱਕ ${object} ਦੀ ਉਚਾਈ ${height} m ਹੈ ਅਤੇ ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${angle} ਹੈ। ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ਚੋਟੀ ਤੱਕ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`);
  }

  if (g.observation.classification === "ELEVATION") {
    if (g.state.requested.kind === "OBJECT_HEIGHT") {
      return native(locale,
        `समतल जमीन पर एक अवलोकन बिंदु ${object} के पाद से ${horizontal} m दूर है। उसके शीर्ष का उन्नयन कोण ${angle} है। ${object} की ऊँचाई ज्ञात कीजिए।`,
        `ਸਮਤਲ ਜ਼ਮੀਨ ਉੱਤੇ ਇੱਕ ਨਿਰੀਖਣ ਬਿੰਦੂ ${object} ਦੇ ਪੈਰ ਤੋਂ ${horizontal} m ਦੂਰ ਹੈ। ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${angle} ਹੈ। ${object} ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    }
    if (g.state.requested.kind === "HORIZONTAL_DISTANCE") {
      return native(locale,
        `${object} की ऊँचाई ${height} m है। समतल जमीन के एक बिंदु से उसके शीर्ष का उन्नयन कोण ${angle} है। बिंदु से ${object} के पाद तक क्षैतिज दूरी ज्ञात कीजिए।`,
        `${object} ਦੀ ਉਚਾਈ ${height} m ਹੈ। ਸਮਤਲ ਜ਼ਮੀਨ ਦੇ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${angle} ਹੈ। ਬਿੰਦੂ ਤੋਂ ${object} ਦੇ ਪੈਰ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    }
    if (g.state.requested.kind === "ANGLE") {
      return native(locale,
        `${object} की ऊँचाई ${height} m है और अवलोकन बिंदु उसके पाद से ${horizontal} m दूर है। शीर्ष का उन्नयन कोण ज्ञात कीजिए।`,
        `${object} ਦੀ ਉਚਾਈ ${height} m ਹੈ ਅਤੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਇਸ ਦੇ ਪੈਰ ਤੋਂ ${horizontal} m ਦੂਰ ਹੈ। ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ਕੱਢੋ।`);
    }
  }

  if (g.observation.classification === "DEPRESSION") {
    if (g.state.requested.kind === "OBJECT_HEIGHT") {
      return native(locale,
        `जमीन से ${observerHeight} m ऊँचे अवलोकन बिंदु से ${horizontal} m दूर स्थित ${object} के शीर्ष का अवनमन कोण ${angle} है। ${object} की ऊँचाई ज्ञात कीजिए।`,
        `ਜ਼ਮੀਨ ਤੋਂ ${observerHeight} m ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ${horizontal} m ਦੂਰ ਸਥਿਤ ${object} ਦੀ ਚੋਟੀ ਦਾ ਅਵਨਮਨ ਕੋਣ ${angle} ਹੈ। ${object} ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    }
    if (g.state.requested.kind === "HORIZONTAL_DISTANCE") {
      if (Math.abs(exactToNumber(g.targetObject.height)) <= 1e-12) {
        return native(locale,
          `${observerHeight} m ऊँचे अवलोकन बिंदु से समतल जमीन पर एक बिंदु ${angle} के अवनमन कोण पर दिखाई देता है। उस बिंदु तक क्षैतिज दूरी ज्ञात कीजिए।`,
          `${observerHeight} m ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ਸਮਤਲ ਜ਼ਮੀਨ ਉੱਤੇ ਇੱਕ ਬਿੰਦੂ ${angle} ਦੇ ਅਵਨਮਨ ਕੋਣ 'ਤੇ ਦਿਸਦਾ ਹੈ। ਉਸ ਬਿੰਦੂ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
      }
      return native(locale,
        `जमीन से ${observerHeight} m ऊँचे अवलोकन बिंदु से ${height} m ऊँचे ${object} का शीर्ष ${angle} के अवनमन कोण पर दिखाई देता है। ${object} तक क्षैतिज दूरी ज्ञात कीजिए।`,
        `ਜ਼ਮੀਨ ਤੋਂ ${observerHeight} m ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ${height} m ਉੱਚੇ ${object} ਦੀ ਚੋਟੀ ${angle} ਦੇ ਅਵਨਮਨ ਕੋਣ 'ਤੇ ਦਿਸਦੀ ਹੈ। ${object} ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    }
  }
  throw new Error(`${question.qlId}: unsupported CP007 localization form ${g.observation.classification}/${g.state.requested.kind}.`);
}

function localizedExplanation(question: AnyQuestion, locale: Trg002LocalizedLocale) {
  const g = cp007Geometry(question);
  const horizontal = exactText(g.horizontal);
  const height = exactText(g.targetObject.height);
  const observerHeight = exactText(g.observer.eyeHeight);
  const drop = exactText(g.verticalDelta);
  const sight = exactText(g.sightLine);
  const angle = g.angleText;
  const answer = question.answer;
  let rule = "", shortcut = "", trap = "";
  let bodies: string[] = [];

  if (question.qlId === "TRG-002-QL-023") {
    rule = native(locale, "ऊँचाई दृष्टि-रेखा के सामने वाली भुजा है, इसलिए sinθ=ऊँचाई/दृष्टि-रेखा।", "ਉਚਾਈ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹੈ, ਇਸ ਲਈ sinθ=ਉਚਾਈ/ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ।");
    shortcut = native(locale, "दृष्टि-रेखा दी हो और ऊँचाई चाहिए तो L×sinθ करें।", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਦਿੱਤੀ ਹੋਵੇ ਅਤੇ ਉਚਾਈ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ L×sinθ ਕਰੋ।");
    trap = native(locale, "दृष्टि-रेखा को क्षैतिज दूरी न मानें।", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਨੂੰ ਖਿਤਿਜੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।");
    bodies = [native(locale, `दृष्टि-रेखा L=${sight} m और कोण ${angle} है।`, `ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ L=${sight} m ਅਤੇ ਕੋਣ ${angle} ਹੈ।`), `h=${sight}×sin${angle}।`, native(locale, `अतः h=${answer}।`, `ਇਸ ਲਈ h=${answer}।`)];
  } else if (question.qlId === "TRG-002-QL-024") {
    rule = native(locale, "ज्ञात ऊँचाई सामने वाली भुजा है और दृष्टि-रेखा कर्ण है, इसलिए sinθ=ऊँचाई/L।", "ਦਿੱਤੀ ਉਚਾਈ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹੈ ਅਤੇ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਕਰਣ ਹੈ, ਇਸ ਲਈ sinθ=ਉਚਾਈ/L।");
    shortcut = native(locale, "कर्ण चाहिए तो ऊँचाई को sinθ से भाग दें।", "ਕਰਣ ਚਾਹੀਦਾ ਹੋਵੇ ਤਾਂ ਉਚਾਈ ਨੂੰ sinθ ਨਾਲ ਭਾਗ ਦਿਓ।");
    trap = native(locale, "क्षैतिज दूरी को उत्तर न मानें।", "ਖਿਤਿਜੀ ਦੂਰੀ ਨੂੰ ਉੱਤਰ ਨਾ ਮੰਨੋ।");
    bodies = [native(locale, `ऊँचाई=${height} m और कोण ${angle} है।`, `ਉਚਾਈ=${height} m ਅਤੇ ਕੋਣ ${angle} ਹੈ।`), `L=${height}/sin${angle}।`, native(locale, `अतः L=${answer}।`, `ਇਸ ਲਈ L=${answer}।`)];
  } else if (g.observation.classification === "ELEVATION" && g.state.requested.kind === "OBJECT_HEIGHT") {
    rule = native(locale, "उन्नयन कोण के लिए tanθ=ऊँचाई/क्षैतिज दूरी।", "ਉਚਾਈ ਕੋਣ ਲਈ tanθ=ਉਚਾਈ/ਖਿਤਿਜੀ ਦੂਰੀ।");
    shortcut = native(locale, "ऊँचाई चाहिए तो क्षैतिज दूरी × tanθ करें।", "ਉਚਾਈ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਖਿਤਿਜੀ ਦੂਰੀ × tanθ ਕਰੋ।");
    trap = native(locale, "क्षैतिज दूरी दी होने पर sine का प्रयोग न करें।", "ਖਿਤਿਜੀ ਦੂਰੀ ਦਿੱਤੀ ਹੋਣ 'ਤੇ sine ਨਾ ਵਰਤੋ।");
    bodies = [native(locale, `क्षैतिज दूरी=${horizontal} m और कोण ${angle} है।`, `ਖਿਤਿਜੀ ਦੂਰੀ=${horizontal} m ਅਤੇ ਕੋਣ ${angle} ਹੈ।`), `h=${horizontal}×tan${angle}।`, native(locale, `अतः h=${answer}।`, `ਇਸ ਲਈ h=${answer}।`)];
  } else if (g.observation.classification === "ELEVATION" && g.state.requested.kind === "HORIZONTAL_DISTANCE") {
    rule = native(locale, "tanθ=ऊँचाई/क्षैतिज दूरी।", "tanθ=ਉਚਾਈ/ਖਿਤਿਜੀ ਦੂਰੀ।");
    shortcut = native(locale, "क्षैतिज दूरी चाहिए तो ऊँचाई ÷ tanθ करें।", "ਖਿਤਿਜੀ ਦੂਰੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਉਚਾਈ ÷ tanθ ਕਰੋ।");
    trap = native(locale, "माँगी गई दूरी क्षैतिज है, दृष्टि-रेखा नहीं।", "ਮੰਗੀ ਦੂਰੀ ਖਿਤਿਜੀ ਹੈ, ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਨਹੀਂ।");
    bodies = [native(locale, `ऊँचाई=${height} m और कोण ${angle} है।`, `ਉਚਾਈ=${height} m ਅਤੇ ਕੋਣ ${angle} ਹੈ।`), `d=${height}/tan${angle}।`, native(locale, `अतः d=${answer}।`, `ਇਸ ਲਈ d=${answer}।`)];
  } else if (g.observation.classification === "ELEVATION" && g.state.requested.kind === "ANGLE") {
    rule = native(locale, "ऊँचाई और क्षैतिज दूरी का अनुपात tanθ देता है।", "ਉਚਾਈ ਅਤੇ ਖਿਤਿਜੀ ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ tanθ ਦਿੰਦਾ ਹੈ।");
    shortcut = native(locale, "h/d को मानक tan मानों 30°, 45°, 60° से मिलाएँ।", "h/d ਨੂੰ ਮਿਆਰੀ tan ਮੁੱਲਾਂ 30°, 45°, 60° ਨਾਲ ਮਿਲਾਓ।");
    trap = native(locale, "अनुपात को उल्टा न करें।", "ਅਨੁਪਾਤ ਨੂੰ ਉਲਟਾ ਨਾ ਕਰੋ।");
    bodies = [`tanθ=${height}/${horizontal}।`, native(locale, "इस अनुपात को मानक त्रिकोणमितीय मान से मिलाएँ।", "ਇਸ ਅਨੁਪਾਤ ਨੂੰ ਮਿਆਰੀ ਤ੍ਰਿਕੋਣਮਿਤੀ ਮੁੱਲ ਨਾਲ ਮਿਲਾਓ।"), native(locale, `अतः θ=${answer}।`, `ਇਸ ਲਈ θ=${answer}।`)];
  } else if (g.observation.classification === "DEPRESSION" && g.state.requested.kind === "OBJECT_HEIGHT") {
    rule = native(locale, "अवनमन कोण पहले अवलोकन स्तर और लक्ष्य शीर्ष के बीच ऊर्ध्वाधर अंतर देता है।", "ਅਵਨਮਨ ਕੋਣ ਪਹਿਲਾਂ ਨਿਰੀਖਣ ਪੱਧਰ ਅਤੇ ਟੀਚੇ ਦੀ ਚੋਟੀ ਵਿਚਲਾ ਲੰਬਕਾਰੀ ਫਰਕ ਦਿੰਦਾ ਹੈ।");
    shortcut = native(locale, "पहले drop=d×tanθ निकालें, फिर उसे अवलोकन ऊँचाई से घटाएँ।", "ਪਹਿਲਾਂ drop=d×tanθ ਕੱਢੋ, ਫਿਰ ਇਸ ਨੂੰ ਨਿਰੀਖਣ ਉਚਾਈ ਤੋਂ ਘਟਾਓ।");
    trap = native(locale, "tan से मिला मान पूरी वस्तु की ऊँचाई नहीं, स्तरों का अंतर है।", "tan ਨਾਲ ਮਿਲਿਆ ਮੁੱਲ ਪੂਰੀ ਵਸਤੂ ਦੀ ਉਚਾਈ ਨਹੀਂ, ਪੱਧਰਾਂ ਦਾ ਫਰਕ ਹੈ।");
    bodies = [native(locale, `ऊर्ध्वाधर अंतर=${horizontal}×tan${angle}=${drop} m।`, `ਲੰਬਕਾਰੀ ਫਰਕ=${horizontal}×tan${angle}=${drop} m।`), native(locale, `लक्ष्य की ऊँचाई=${observerHeight}−${drop} m।`, `ਟੀਚੇ ਦੀ ਉਚਾਈ=${observerHeight}−${drop} m।`), native(locale, `अतः ऊँचाई=${answer}।`, `ਇਸ ਲਈ ਉਚਾਈ=${answer}।`)];
  } else if (g.observation.classification === "DEPRESSION" && g.state.requested.kind === "HORIZONTAL_DISTANCE") {
    rule = native(locale, "अवनमन कोण में tanθ=ऊर्ध्वाधर स्तर-अंतर/क्षैतिज दूरी।", "ਅਵਨਮਨ ਕੋਣ ਵਿੱਚ tanθ=ਲੰਬਕਾਰੀ ਪੱਧਰ-ਫਰਕ/ਖਿਤਿਜੀ ਦੂਰੀ।");
    shortcut = native(locale, "पहले दोनों स्तरों का अंतर लें, फिर उसे tanθ से भाग दें।", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਪੱਧਰਾਂ ਦਾ ਫਰਕ ਲਵੋ, ਫਿਰ ਇਸ ਨੂੰ tanθ ਨਾਲ ਭਾਗ ਦਿਓ।");
    trap = native(locale, "पूरी अवलोकन ऊँचाई को सीधे opposite side न लें जब लक्ष्य भी जमीन से ऊपर हो।", "ਜੇ ਟੀਚਾ ਵੀ ਜ਼ਮੀਨ ਤੋਂ ਉੱਪਰ ਹੋਵੇ ਤਾਂ ਪੂਰੀ ਨਿਰੀਖਣ ਉਚਾਈ ਨੂੰ ਸਿੱਧਾ opposite side ਨਾ ਲਵੋ।");
    bodies = [native(locale, `ऊर्ध्वाधर स्तर-अंतर=${drop} m।`, `ਲੰਬਕਾਰੀ ਪੱਧਰ-ਫਰਕ=${drop} m।`), `d=${drop}/tan${angle}।`, native(locale, `अतः d=${answer}।`, `ਇਸ ਲਈ d=${answer}।`)];
  } else {
    throw new Error(`${question.qlId}: unsupported CP007 explanation form.`);
  }

  return {
    keyRule: rule,
    steps: bodies.map((body, index) => ({
      title: index === bodies.length - 1 ? native(locale, "उत्तर", "ਉੱਤਰ") : native(locale, `चरण ${index + 1}`, `ਕਦਮ ${index + 1}`),
      body,
    })),
    shortcut,
    traps: [trap],
  };
}

export function trg002Cp007CanonicalSemanticFingerprint(question: AnyQuestion) {
  return sha256({
    packageId: question.packageId, cpId: question.cpId, qlId: question.qlId, seed: question.seed,
    lockedFamily: question.lockedFamily, solveMode: question.solveMode, difficulty: question.difficulty,
    target: question.target, exactAnswer: question.exactAnswer, answer: question.answer,
    options: question.options.map((option: AnyQuestion) => ({ value: option.value, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
    correctIndex: question.correctIndex, canonicalSpatialState: question.canonicalSpatialState,
    solutionDiagram: question.solutionDiagram, diagramEvidence: question.diagramEvidence,
  });
}

export function localizeFrozenTrg002Cp007Question(canonicalQuestion: AnyQuestion, locale: Trg002LocalizedLocale) {
  if (!TRG_002_CP007_LOCALIZATION_QL_IDS.includes(canonicalQuestion.qlId)) throw new Error(`${canonicalQuestion.qlId}: outside TRG-CP-007 localization scope.`);
  const canonicalSemanticFingerprint = trg002Cp007CanonicalSemanticFingerprint(canonicalQuestion);
  const stem = localizedStem(canonicalQuestion, locale);
  const explanation = localizedExplanation(canonicalQuestion, locale);
  const localizationFingerprint = sha256({ version: TRG_002_CP007_LOCALIZATION_VERSION, locale, qlId: canonicalQuestion.qlId, seed: canonicalQuestion.seed, canonicalSemanticFingerprint, stem, explanation });

  return {
    ...canonicalQuestion,
    language: locale === "hi-IN" ? "hi" : "pa",
    locale,
    canonicalLocale: "en-IN" as const,
    stem,
    explanation,
    reviewStatus: "LOCALIZATION_REVIEW_PENDING" as const,
    aiEditorialStatus: "PENDING" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false,
    freezeEligible: false,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    localizationMetadata: {
      version: TRG_002_CP007_LOCALIZATION_VERSION,
      authority: TRG_002_CP007_LOCALIZATION_AUTHORITY,
      locale,
      canonicalLocale: "en-IN" as const,
      englishSourceFrozen: true,
      learnerTextLocalized: true,
      canonicalOutcomePreserved: true,
      canonicalSpatialStatePreserved: true,
      solutionDiagramPreserved: true,
      humanLanguageReviewRequired: true,
    },
    localizationLifecycle: {
      englishSource: "HUMAN_APPROVED_FROZEN_96" as const,
      hindiPunjabi: "REVIEW_CANDIDATE_V1" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      canonicalSemanticFingerprint,
      localizationFingerprint,
      semanticParity: "CANONICAL_SEMANTICS_PRESERVED" as const,
      learnerSurfaceSource: "CANONICAL_SPATIAL_STATE" as const,
      canonicalOutcomeSource: "FROZEN_PRODUCTION_96_RUNTIME" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  };
}

export function generateLocalizedTrg002Cp007Question(qlId: string, seed: string, locale: Trg002LocalizedLocale) {
  if (!TRG_002_CP007_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-CP-007 localization scope.`);
  return localizeFrozenTrg002Cp007Question(generateFrozenTrg002Production96Question(qlId, seed) as AnyQuestion, locale);
}

export function buildTrg002Cp007LocalizedReviewBank(locale: Trg002LocalizedLocale, seedsPerQl = 12) {
  return TRG_002_CP007_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateLocalizedTrg002Cp007Question(
      qlId,
      `trg002-cp007-localization-v1-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
