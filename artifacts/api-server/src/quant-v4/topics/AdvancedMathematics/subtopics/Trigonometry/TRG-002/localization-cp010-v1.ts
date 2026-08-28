import { createHash } from "node:crypto";

import { toDegrees } from "../foundation/angle";
import { exactToNumber, formatExactPlain, subtractExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";

export const TRG_002_CP010_LOCALIZATION_VERSION = "TRG002_CP010_HI_PA_LOCALIZATION_V1" as const;
export const TRG_002_CP010_LOCALIZATION_AUTHORITY = "FROZEN_ENGLISH_CANONICAL_SPATIAL_TRANSFORMATION_V1" as const;
export const TRG_002_CP010_LOCALIZATION_QL_IDS = Array.from(
  { length: 24 },
  (_, index) => `TRG-002-QL-${String(index + 73).padStart(3, "0")}`,
) as readonly string[];

export type Trg002Cp010LocalizedLocale = "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;
type State = AnyQuestion["canonicalSpatialState"];

function native(locale: Trg002Cp010LocalizedLocale, hi: string, pa: string) {
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
function point(state: State, id: string) {
  const found = state.points.find((item: AnyQuestion) => item.id === id);
  if (!found) throw new Error(`TRG-002 CP010 localization: missing point ${id}.`);
  return found;
}
function object(state: State, id: string) {
  const found = state.verticalObjects.find((item: AnyQuestion) => item.id === id);
  if (!found) throw new Error(`TRG-002 CP010 localization: missing object ${id}.`);
  return found;
}
function angleText(angle: any) {
  const degrees = toDegrees(angle);
  return `${degrees.denominator === 1n ? degrees.numerator : `${degrees.numerator}/${degrees.denominator}`}°`;
}
function makeExplanation(locale: Trg002Cp010LocalizedLocale, rule: string, bodies: string[], shortcut: string, trap: string) {
  return {
    keyRule: rule,
    steps: bodies.map((body, index) => ({
      title: index === bodies.length - 1
        ? native(locale, "उत्तर", "ਉੱਤਰ")
        : index === 0
          ? native(locale, "दिया है", "ਦਿੱਤਾ ਹੈ")
          : native(locale, `गणना ${index}`, `ਗਣਨਾ ${index}`),
      body,
    })),
    shortcut,
    traps: [trap],
  };
}
function observationGeometry(state: State, observation: AnyQuestion) {
  const eye = point(state, observation.eyePointId);
  const target = point(state, observation.targetPointId);
  return {
    observation,
    eye,
    target,
    distance: absoluteExactDifference(eye.x, target.x),
    angle: angleText(observation.angle),
  };
}
function objectByTopPoint(state: State, topPointId: string) {
  return state.verticalObjects.find((item: AnyQuestion) => item.topPointId === topPointId);
}
function localizedStem(question: AnyQuestion, locale: Trg002Cp010LocalizedLocale) {
  const state = question.canonicalSpatialState as State;
  const requested = state.requested as AnyQuestion;

  if (question.lockedFamily === "OBSERVER_HEIGHT_CORRECTION") {
    const obs = observationGeometry(state, state.observations[0]);
    const vertical = state.verticalObjects[0];
    const total = exactText(vertical.height);
    const eye = exactText(state.observers[0].eyeHeight);
    const run = exactText(obs.distance);
    if (requested.kind === "EYE_HEIGHT") return native(locale,
      `एक इमारत ${total} m ऊँची है। उसका शीर्ष इमारत से ${run} m दूर खड़े पर्यवेक्षक को ${obs.angle} के उन्नयन कोण पर दिखाई देता है। पर्यवेक्षक की आँख जमीन से कितनी ऊँचाई पर है?`,
      `ਇੱਕ ਇਮਾਰਤ ${total} m ਉੱਚੀ ਹੈ। ਇਸ ਦੀ ਚੋਟੀ ਇਮਾਰਤ ਤੋਂ ${run} m ਦੂਰ ਖੜ੍ਹੇ ਨਿਰੀਖਕ ਨੂੰ ${obs.angle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਨਿਰੀਖਕ ਦੀ ਅੱਖ ਜ਼ਮੀਨ ਤੋਂ ਕਿੰਨੀ ਉਚਾਈ 'ਤੇ ਹੈ?`);
    if (requested.kind === "HORIZONTAL_DISTANCE") return native(locale,
      `एक पर्यवेक्षक की आँख जमीन से ${eye} m ऊपर है। ${total} m ऊँची इमारत का शीर्ष ${obs.angle} के उन्नयन कोण पर दिखाई देता है। पर्यवेक्षक की इमारत से क्षैतिज दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਦੀ ਅੱਖ ਜ਼ਮੀਨ ਤੋਂ ${eye} m ਉੱਪਰ ਹੈ। ${total} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ${obs.angle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਨਿਰੀਖਕ ਦੀ ਇਮਾਰਤ ਤੋਂ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    return native(locale,
      `एक पर्यवेक्षक की आँख जमीन से ${eye} m ऊपर है और वह इमारत से ${run} m दूर है। इमारत के शीर्ष का उन्नयन कोण ${obs.angle} है। इमारत की कुल ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਦੀ ਅੱਖ ਜ਼ਮੀਨ ਤੋਂ ${eye} m ਉੱਪਰ ਹੈ ਅਤੇ ਉਹ ਇਮਾਰਤ ਤੋਂ ${run} m ਦੂਰ ਹੈ। ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${obs.angle} ਹੈ। ਇਮਾਰਤ ਦੀ ਕੁੱਲ ਉਚਾਈ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "OPPOSITE_SIDE_OBSERVATIONS") {
    const observations = state.observations.map((item: AnyQuestion) => observationGeometry(state, item));
    if (observations.length !== 2) throw new Error(`${question.qlId}: opposite-side localization requires two observations.`);
    const separation = exactText(absoluteExactDifference(observations[0].eye.x, observations[1].eye.x));
    const angles = observations.map((item: AnyQuestion) => item.angle);
    if (requested.kind === "OBJECT_HEIGHT") return native(locale,
      `एक मीनार के विपरीत ओर दो अवलोकन बिंदु ${separation} m की दूरी पर हैं। शीर्ष के उन्नयन कोण क्रमशः ${angles[0]} और ${angles[1]} हैं। मीनार की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ਮੀਨਾਰ ਦੇ ਵਿਰੋਧੀ ਪਾਸਿਆਂ 'ਤੇ ਦੋ ਨਿਰੀਖਣ ਬਿੰਦੂ ${separation} m ਦੀ ਦੂਰੀ 'ਤੇ ਹਨ। ਚੋਟੀ ਦੇ ਉਚਾਈ ਕੋਣ ਕ੍ਰਮਵਾਰ ${angles[0]} ਅਤੇ ${angles[1]} ਹਨ। ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    let requestedObs = observations.find((item: AnyQuestion) => [requested.fromPointId, requested.toPointId].includes(item.eye.id));
    if (!requestedObs) {
      const sorted = [...observations].sort((a: AnyQuestion, b: AnyQuestion) => exactToNumber(a.distance) - exactToNumber(b.distance));
      requestedObs = String(question.solveMode).toLowerCase().includes("far") ? sorted[1] : sorted[0];
    }
    return native(locale,
      `एक मीनार के विपरीत ओर दो अवलोकन बिंदु ${separation} m दूर हैं। शीर्ष के उन्नयन कोण ${angles[0]} और ${angles[1]} हैं। जिस बिंदु पर उन्नयन कोण ${requestedObs.angle} है, उसकी मीनार से दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਮੀਨਾਰ ਦੇ ਵਿਰੋਧੀ ਪਾਸਿਆਂ 'ਤੇ ਦੋ ਨਿਰੀਖਣ ਬਿੰਦੂ ${separation} m ਦੂਰ ਹਨ। ਚੋਟੀ ਦੇ ਉਚਾਈ ਕੋਣ ${angles[0]} ਅਤੇ ${angles[1]} ਹਨ। ਜਿਸ ਬਿੰਦੂ 'ਤੇ ਉਚਾਈ ਕੋਣ ${requestedObs.angle} ਹੈ, ਉਸ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "BUILDING_TO_BUILDING") {
    const first = state.verticalObjects[0];
    const second = state.verticalObjects[1];
    const firstBase = point(state, first.basePointId);
    const secondBase = point(state, second.basePointId);
    const run = exactText(absoluteExactDifference(firstBase.x, secondBase.x));
    const obs = observationGeometry(state, state.observations[0]);
    const relation = obs.observation.classification === "DEPRESSION"
      ? native(locale, "अवनमन", "ਡਿਪ੍ਰੈਸ਼ਨ")
      : native(locale, "उन्नयन", "ਉਚਾਈ");
    if (requested.kind === "OBJECT_HEIGHT") return native(locale,
      `पहली इमारत ${exactText(first.height)} m ऊँची है। उसके शीर्ष से ${run} m दूर दूसरी इमारत का शीर्ष ${obs.angle} के ${relation} कोण पर दिखाई देता है। दूसरी इमारत की ऊँचाई ज्ञात कीजिए।`,
      `ਪਹਿਲੀ ਇਮਾਰਤ ${exactText(first.height)} m ਉੱਚੀ ਹੈ। ਇਸ ਦੀ ਛੱਤ ਤੋਂ ${run} m ਦੂਰ ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ${obs.angle} ਦੇ ${relation} ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    return native(locale,
      `दो इमारतों की ऊँचाइयाँ ${exactText(first.height)} m और ${exactText(second.height)} m हैं। छोटी/पहली इमारत के शीर्ष से दूसरी के शीर्ष का ${relation} कोण ${obs.angle} है। दोनों इमारतों के बीच क्षैतिज दूरी ज्ञात कीजिए।`,
      `ਦੋ ਇਮਾਰਤਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ${exactText(first.height)} m ਅਤੇ ${exactText(second.height)} m ਹਨ। ਛੋਟੀ/ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਦੂਜੀ ਦੀ ਚੋਟੀ ਦਾ ${relation} ਕੋਣ ${obs.angle} ਹੈ। ਦੋਵੇਂ ਇਮਾਰਤਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "ELEVATION_AND_DEPRESSION") {
    const up = state.observations.find((item: AnyQuestion) => item.classification === "ELEVATION");
    const down = state.observations.find((item: AnyQuestion) => item.classification === "DEPRESSION");
    if (!up || !down) throw new Error(`${question.qlId}: elevation/depression localization requires both sight lines.`);
    const eyeHeight = state.observers[0].eyeHeight as ExactTrigNumber;
    const targetObject = objectByTopPoint(state, up.targetPointId);
    if (!targetObject) throw new Error(`${question.qlId}: target object missing for elevation/depression state.`);
    const upAngle = angleText(up.angle), downAngle = angleText(down.angle);
    if (requested.kind === "EYE_HEIGHT") return native(locale,
      `एक ${exactText(targetObject.height)} m ऊँची मीनार को एक इमारत की छत से देखा जाता है। मीनार के आधार का अवनमन कोण ${downAngle} और शीर्ष का उन्नयन कोण ${upAngle} है। पर्यवेक्षक की इमारत की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ${exactText(targetObject.height)} m ਉੱਚੀ ਮੀਨਾਰ ਨੂੰ ਇੱਕ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਵੇਖਿਆ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੇ ਅਧਾਰ ਦਾ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ${downAngle} ਅਤੇ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${upAngle} ਹੈ। ਨਿਰੀਖਕ ਵਾਲੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    if (requested.kind === "HORIZONTAL_DISTANCE") return native(locale,
      `एक ${exactText(eyeHeight)} m ऊँची इमारत की छत से सामने की मीनार के आधार का अवनमन कोण ${downAngle} और शीर्ष का उन्नयन कोण ${upAngle} है। इमारत और मीनार के बीच क्षैतिज दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ${exactText(eyeHeight)} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸਾਹਮਣੇ ਵਾਲੀ ਮੀਨਾਰ ਦੇ ਅਧਾਰ ਦਾ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ${downAngle} ਅਤੇ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${upAngle} ਹੈ। ਇਮਾਰਤ ਅਤੇ ਮੀਨਾਰ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    return native(locale,
      `एक ${exactText(eyeHeight)} m ऊँची इमारत की छत से सामने की मीनार के आधार का अवनमन कोण ${downAngle} और शीर्ष का उन्नयन कोण ${upAngle} है। मीनार की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ${exactText(eyeHeight)} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸਾਹਮਣੇ ਵਾਲੀ ਮੀਨਾਰ ਦੇ ਅਧਾਰ ਦਾ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ${downAngle} ਅਤੇ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${upAngle} ਹੈ। ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "RIVER_WIDTH" || question.lockedFamily === "RIVER_WIDTH_HORIZONTAL_SEPARATION") {
    const obs = observationGeometry(state, state.observations[0]);
    const drop = exactText(absoluteExactDifference(obs.eye.y, obs.target.y));
    return native(locale,
      `नदी के एक किनारे पर जमीन से ${drop} m ऊँचे बिंदु से दूसरे किनारे के ठीक सामने वाले बिंदु का अवनमन कोण ${obs.angle} है। नदी की चौड़ाई ज्ञात कीजिए।`,
      `ਨਦੀ ਦੇ ਇੱਕ ਕਿਨਾਰੇ 'ਤੇ ਜ਼ਮੀਨ ਤੋਂ ${drop} m ਉੱਚੇ ਬਿੰਦੂ ਤੋਂ ਦੂਜੇ ਕਿਨਾਰੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਵਾਲੇ ਬਿੰਦੂ ਦਾ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ${obs.angle} ਹੈ। ਨਦੀ ਦੀ ਚੌੜਾਈ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "COMPOSITE_VERTICAL_OBJECT_RELATIONS") {
    const building = state.verticalObjects.find((item: AnyQuestion) => item.kind === "BUILDING") ?? state.verticalObjects[0];
    const upper = state.verticalObjects.find((item: AnyQuestion) => item.id !== building.id) ?? state.verticalObjects[1];
    const observations = state.observations.map((item: AnyQuestion) => observationGeometry(state, item))
      .sort((a: AnyQuestion, b: AnyQuestion) => Number(toDegrees(a.observation.angle).numerator) - Number(toDegrees(b.observation.angle).numerator));
    const observer = state.observers[0];
    const run = exactText(absoluteExactDifference(point(state, observer.groundPointId).x, point(state, building.basePointId).x));
    const lowerAngle = observations[0].angle, upperAngle = observations[observations.length - 1].angle;
    if (requested.kind === "OBJECT_HEIGHT") return native(locale,
      `एक इमारत से ${run} m दूर बिंदु से उसकी छत का उन्नयन कोण ${lowerAngle} और छत पर लगे ऊर्ध्वाधर मस्तूल के शीर्ष का उन्नयन कोण ${upperAngle} है। मस्तूल की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ਇਮਾਰਤ ਤੋਂ ${run} m ਦੂਰ ਬਿੰਦੂ ਤੋਂ ਇਸ ਦੀ ਛੱਤ ਦਾ ਉਚਾਈ ਕੋਣ ${lowerAngle} ਅਤੇ ਛੱਤ 'ਤੇ ਲੱਗੇ ਖੜ੍ਹੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${upperAngle} ਹੈ। ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    return native(locale,
      `एक इमारत की छत पर ${exactText(upper.height)} m ऊँचा मस्तूल लगा है। जमीन पर एक बिंदु से छत और मस्तूल के शीर्ष के उन्नयन कोण क्रमशः ${lowerAngle} और ${upperAngle} हैं। इमारत के पाद से उस बिंदु की क्षैतिज दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਇਮਾਰਤ ਦੀ ਛੱਤ 'ਤੇ ${exactText(upper.height)} m ਉੱਚਾ ਮਸਤੂਲ ਲੱਗਿਆ ਹੈ। ਜ਼ਮੀਨ ਦੇ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਛੱਤ ਅਤੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਦੇ ਉਚਾਈ ਕੋਣ ਕ੍ਰਮਵਾਰ ${lowerAngle} ਅਤੇ ${upperAngle} ਹਨ। ਇਮਾਰਤ ਦੇ ਪੈਰ ਤੋਂ ਉਸ ਬਿੰਦੂ ਦੀ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
  }

  throw new Error(`${question.qlId}: unsupported CP010 stem family ${question.lockedFamily}.`);
}

function localizedExplanation(question: AnyQuestion, locale: Trg002Cp010LocalizedLocale) {
  const state = question.canonicalSpatialState as State;
  const requested = state.requested as AnyQuestion;

  if (question.lockedFamily === "OBSERVER_HEIGHT_CORRECTION") {
    const obs = observationGeometry(state, state.observations[0]);
    const total = state.verticalObjects[0].height as ExactTrigNumber;
    const eye = state.observers[0].eyeHeight as ExactTrigNumber;
    const rise = absoluteExactDifference(total, eye);
    if (requested.kind === "EYE_HEIGHT") return makeExplanation(locale,
      native(locale, "टैन θ में लंबवत भुजा आँख के स्तर से इमारत के शीर्ष तक की ऊँचाई होती है।", "tan θ ਵਿੱਚ ਲੰਬ ਭੁਜਾ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਤੱਕ ਦੀ ਉਚਾਈ ਹੁੰਦੀ ਹੈ।"),
      [native(locale, `इमारत की कुल ऊँचाई ${exactText(total)} m, क्षैतिज दूरी ${exactText(obs.distance)} m और कोण ${obs.angle} है।`, `ਇਮਾਰਤ ਦੀ ਕੁੱਲ ਉਚਾਈ ${exactText(total)} m, ਖਿਤਿਜੀ ਦੂਰੀ ${exactText(obs.distance)} m ਅਤੇ ਕੋਣ ${obs.angle} ਹੈ।`), native(locale, `आँख के ऊपर की ऊँचाई=${exactText(obs.distance)}·tan${obs.angle}=${exactText(rise)} m।`, `ਅੱਖ ਤੋਂ ਉੱਪਰ ਦੀ ਉਚਾਈ=${exactText(obs.distance)}·tan${obs.angle}=${exactText(rise)} m।`), native(locale, `आँख की ऊँचाई=${exactText(total)}−${exactText(rise)}=${question.answer}।`, `ਅੱਖ ਦੀ ਉਚਾਈ=${exactText(total)}−${exactText(rise)}=${question.answer}।`)],
      native(locale, "पहले आँख के ऊपर वाली ऊँचाई निकालें, फिर कुल ऊँचाई में से घटाएँ।", "ਪਹਿਲਾਂ ਅੱਖ ਤੋਂ ਉੱਪਰ ਵਾਲੀ ਉਚਾਈ ਕੱਢੋ, ਫਿਰ ਕੁੱਲ ਉਚਾਈ ਵਿੱਚੋਂ ਘਟਾਓ।"),
      native(locale, "पूरी इमारत की ऊँचाई को सीधे tan में न रखें।", "ਪੂਰੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਨੂੰ ਸਿੱਧਾ tan ਵਿੱਚ ਨਾ ਰੱਖੋ।"));
    if (requested.kind === "HORIZONTAL_DISTANCE") return makeExplanation(locale,
      native(locale, "पहले कुल ऊँचाई में से आँख की ऊँचाई घटाकर वास्तविक लंबवत rise लें।", "ਪਹਿਲਾਂ ਕੁੱਲ ਉਚਾਈ ਵਿੱਚੋਂ ਅੱਖ ਦੀ ਉਚਾਈ ਘਟਾ ਕੇ ਅਸਲ ਲੰਬ rise ਲਓ।"),
      [native(locale, `कुल ऊँचाई ${exactText(total)} m और आँख की ऊँचाई ${exactText(eye)} m है।`, `ਕੁੱਲ ਉਚਾਈ ${exactText(total)} m ਅਤੇ ਅੱਖ ਦੀ ਉਚਾਈ ${exactText(eye)} m ਹੈ।`), native(locale, `rise=${exactText(total)}−${exactText(eye)}=${exactText(rise)} m और d=rise/tan${obs.angle}।`, `rise=${exactText(total)}−${exactText(eye)}=${exactText(rise)} m ਅਤੇ d=rise/tan${obs.angle}।`), native(locale, `अतः क्षैतिज दूरी ${question.answer} है।`, `ਇਸ ਲਈ ਖਿਤਿਜੀ ਦੂਰੀ ${question.answer} ਹੈ।`)],
      native(locale, "45° पर rise और दूरी बराबर होते हैं; अन्य कोणों पर d=rise/tanθ लगाएँ।", "45° 'ਤੇ rise ਅਤੇ ਦੂਰੀ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ; ਹੋਰ ਕੋਣਾਂ 'ਤੇ d=rise/tanθ ਲਗਾਓ।"),
      native(locale, "आँख की ऊँचाई दो बार न घटाएँ।", "ਅੱਖ ਦੀ ਉਚਾਈ ਦੋ ਵਾਰ ਨਾ ਘਟਾਓ।"));
    return makeExplanation(locale,
      native(locale, "टैन से आँख के स्तर के ऊपर की ऊँचाई मिलती है; कुल ऊँचाई के लिए आँख की ऊँचाई एक बार जोड़ें।", "tan ਤੋਂ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦੀ ਉਚਾਈ ਮਿਲਦੀ ਹੈ; ਕੁੱਲ ਉਚਾਈ ਲਈ ਅੱਖ ਦੀ ਉਚਾਈ ਇੱਕ ਵਾਰ ਜੋੜੋ।"),
      [native(locale, `आँख की ऊँचाई ${exactText(eye)} m, दूरी ${exactText(obs.distance)} m और कोण ${obs.angle} है।`, `ਅੱਖ ਦੀ ਉਚਾਈ ${exactText(eye)} m, ਦੂਰੀ ${exactText(obs.distance)} m ਅਤੇ ਕੋਣ ${obs.angle} ਹੈ।`), native(locale, `आँख के ऊपर rise=${exactText(obs.distance)}·tan${obs.angle}=${exactText(rise)} m।`, `ਅੱਖ ਤੋਂ ਉੱਪਰ rise=${exactText(obs.distance)}·tan${obs.angle}=${exactText(rise)} m।`), native(locale, `कुल ऊँचाई=${exactText(rise)}+${exactText(eye)}=${question.answer}।`, `ਕੁੱਲ ਉਚਾਈ=${exactText(rise)}+${exactText(eye)}=${question.answer}।`)],
      native(locale, "पहले rise, फिर eye-height जोड़ें।", "ਪਹਿਲਾਂ rise, ਫਿਰ eye-height ਜੋੜੋ।"),
      native(locale, "आँख के स्तर से ऊपर की ऊँचाई को ही पूरी इमारत न मानें।", "ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦੀ ਉਚਾਈ ਨੂੰ ਹੀ ਪੂਰੀ ਇਮਾਰਤ ਨਾ ਮੰਨੋ।"));
  }

  if (question.lockedFamily === "OPPOSITE_SIDE_OBSERVATIONS") {
    const observations = state.observations.map((item: AnyQuestion) => observationGeometry(state, item));
    const separation = absoluteExactDifference(observations[0].eye.x, observations[1].eye.x);
    const height = state.verticalObjects[0].height as ExactTrigNumber;
    return makeExplanation(locale,
      native(locale, "विपरीत ओर होने पर दोनों जमीन-दूरियों का योग कुल separation होता है और दोनों त्रिभुजों की ऊँचाई समान रहती है।", "ਵਿਰੋਧੀ ਪਾਸਿਆਂ 'ਤੇ ਹੋਣ ਕਰਕੇ ਦੋਵੇਂ ਜ਼ਮੀਨੀ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਕੁੱਲ separation ਹੁੰਦਾ ਹੈ ਅਤੇ ਦੋਵੇਂ ਤਿਕੋਣਾਂ ਦੀ ਉਚਾਈ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ।"),
      [native(locale, `कुल separation ${exactText(separation)} m और कोण ${observations[0].angle}, ${observations[1].angle} हैं।`, `ਕੁੱਲ separation ${exactText(separation)} m ਅਤੇ ਕੋਣ ${observations[0].angle}, ${observations[1].angle} ਹਨ।`), native(locale, `यदि दूरियाँ d₁,d₂ हैं, तो d₁+d₂=${exactText(separation)} और h=d₁tan${observations[0].angle}=d₂tan${observations[1].angle}।`, `ਜੇ ਦੂਰੀਆਂ d₁,d₂ ਹਨ, ਤਾਂ d₁+d₂=${exactText(separation)} ਅਤੇ h=d₁tan${observations[0].angle}=d₂tan${observations[1].angle}।`), native(locale, `${requested.kind === "OBJECT_HEIGHT" ? `हल करने पर h=${exactText(height)} m, इसलिए उत्तर ${question.answer} है।` : `हल करने पर प्रश्न में माँगी दूरी ${question.answer} मिलती है।`}`, `${requested.kind === "OBJECT_HEIGHT" ? `ਹੱਲ ਕਰਨ 'ਤੇ h=${exactText(height)} m, ਇਸ ਲਈ ਉੱਤਰ ${question.answer} ਹੈ।` : `ਹੱਲ ਕਰਨ 'ਤੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਦੂਰੀ ${question.answer} ਮਿਲਦੀ ਹੈ।`}`)],
      native(locale, "बड़ा उन्नयन कोण नजदीकी बिंदु को दर्शाता है।", "ਵੱਡਾ ਉਚਾਈ ਕੋਣ ਨੇੜਲੇ ਬਿੰਦੂ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"),
      native(locale, "विपरीत ओर की दूरियों को घटाएँ नहीं; उनका योग लें।", "ਵਿਰੋਧੀ ਪਾਸਿਆਂ ਦੀਆਂ ਦੂਰੀਆਂ ਨਾ ਘਟਾਓ; ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਲਓ।"));
  }

  if (question.lockedFamily === "BUILDING_TO_BUILDING") {
    const first = state.verticalObjects[0], second = state.verticalObjects[1];
    const obs = observationGeometry(state, state.observations[0]);
    const delta = absoluteExactDifference(first.height, second.height);
    const isDepression = obs.observation.classification === "DEPRESSION";
    if (requested.kind === "OBJECT_HEIGHT") return makeExplanation(locale,
      native(locale, "छत-से-छत त्रिभुज में लंबवत भुजा दोनों इमारतों की ऊँचाइयों का अंतर है, पूरी ऊँचाई नहीं।", "ਛੱਤ-ਤੋਂ-ਛੱਤ ਤਿਕੋਣ ਵਿੱਚ ਲੰਬ ਭੁਜਾ ਦੋਵੇਂ ਇਮਾਰਤਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ ਹੈ, ਪੂਰੀ ਉਚਾਈ ਨਹੀਂ।"),
      [native(locale, `पहली ऊँचाई ${exactText(first.height)} m, दूरी ${exactText(obs.distance)} m और कोण ${obs.angle} है।`, `ਪਹਿਲੀ ਉਚਾਈ ${exactText(first.height)} m, ਦੂਰੀ ${exactText(obs.distance)} m ਅਤੇ ਕੋਣ ${obs.angle} ਹੈ।`), native(locale, `${isDepression ? "ऊँचाइयों का drop" : "ऊँचाइयों का rise"}=${exactText(obs.distance)}·tan${obs.angle}=${exactText(delta)} m।`, `${isDepression ? "ਉਚਾਈਆਂ ਦਾ drop" : "ਉਚਾਈਆਂ ਦਾ rise"}=${exactText(obs.distance)}·tan${obs.angle}=${exactText(delta)} m।`), native(locale, `${isDepression ? `दूसरी ऊँचाई=${exactText(first.height)}−${exactText(delta)}` : `दूसरी ऊँचाई=${exactText(first.height)}+${exactText(delta)}`}=${question.answer}।`, `${isDepression ? `ਦੂਜੀ ਉਚਾਈ=${exactText(first.height)}−${exactText(delta)}` : `ਦੂਜੀ ਉਚਾਈ=${exactText(first.height)}+${exactText(delta)}`}=${question.answer}।`)],
      native(locale, "पहले roof-level rise/drop निकालें, फिर पहली इमारत की ऊँचाई से जोड़ें या घटाएँ।", "ਪਹਿਲਾਂ roof-level rise/drop ਕੱਢੋ, ਫਿਰ ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਨਾਲ ਜੋੜੋ ਜਾਂ ਘਟਾਓ।"),
      native(locale, "पूरी पहली या दूसरी इमारत की ऊँचाई को tan की opposite side न मानें।", "ਪੂਰੀ ਪਹਿਲੀ ਜਾਂ ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਨੂੰ tan ਦੀ opposite side ਨਾ ਮੰਨੋ।"));
    return makeExplanation(locale,
      native(locale, "दो छतों के बीच का ऊँचाई-अंतर tanθ में opposite side बनता है।", "ਦੋ ਛੱਤਾਂ ਵਿਚਕਾਰ ਉਚਾਈ-ਅੰਤਰ tanθ ਵਿੱਚ opposite side ਬਣਦਾ ਹੈ।"),
      [native(locale, `ऊँचाइयाँ ${exactText(first.height)} m और ${exactText(second.height)} m हैं।`, `ਉਚਾਈਆਂ ${exactText(first.height)} m ਅਤੇ ${exactText(second.height)} m ਹਨ।`), native(locale, `ऊँचाई-अंतर=${exactText(delta)} m, इसलिए d=${exactText(delta)}/tan${obs.angle}।`, `ਉਚਾਈ-ਅੰਤਰ=${exactText(delta)} m, ਇਸ ਲਈ d=${exactText(delta)}/tan${obs.angle}।`), native(locale, `अतः दोनों इमारतों की क्षैतिज दूरी ${question.answer} है।`, `ਇਸ ਲਈ ਦੋਵੇਂ ਇਮਾਰਤਾਂ ਦੀ ਖਿਤਿਜੀ ਦੂਰੀ ${question.answer} ਹੈ।`)],
      native(locale, "केवल height difference का उपयोग करें।", "ਸਿਰਫ਼ height difference ਵਰਤੋ।"),
      native(locale, "दोनों ऊँचाइयों को जोड़कर tan में न रखें।", "ਦੋਵੇਂ ਉਚਾਈਆਂ ਜੋੜ ਕੇ tan ਵਿੱਚ ਨਾ ਰੱਖੋ।"));
  }

  if (question.lockedFamily === "ELEVATION_AND_DEPRESSION") {
    const up = state.observations.find((item: AnyQuestion) => item.classification === "ELEVATION");
    const down = state.observations.find((item: AnyQuestion) => item.classification === "DEPRESSION");
    if (!up || !down) throw new Error(`${question.qlId}: missing elevation/depression pair.`);
    const upG = observationGeometry(state, up), downG = observationGeometry(state, down);
    const eyeHeight = state.observers[0].eyeHeight as ExactTrigNumber;
    const targetObject = objectByTopPoint(state, up.targetPointId)!;
    const rise = absoluteExactDifference(targetObject.height, eyeHeight);
    if (requested.kind === "EYE_HEIGHT") return makeExplanation(locale,
      native(locale, "एक ही horizontal distance d के लिए नीचे base और ऊपर top की दोनों sight lines को साथ हल करें।", "ਇੱਕੋ horizontal distance d ਲਈ ਹੇਠਾਂ base ਅਤੇ ਉੱਪਰ top ਦੀਆਂ ਦੋਵੇਂ sight lines ਇਕੱਠੇ ਹੱਲ ਕਰੋ।"),
      [native(locale, `मीनार की ऊँचाई ${exactText(targetObject.height)} m, अवनमन ${downG.angle}, उन्नयन ${upG.angle} है।`, `ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${exactText(targetObject.height)} m, ਡਿਪ੍ਰੈਸ਼ਨ ${downG.angle}, ਉਚਾਈ ${upG.angle} ਹੈ।`), native(locale, `यदि पर्यवेक्षक की ऊँचाई h है, तो tan${downG.angle}=h/d और tan${upG.angle}=(${exactText(targetObject.height)}−h)/d।`, `ਜੇ ਨਿਰੀਖਕ ਦੀ ਉਚਾਈ h ਹੈ, ਤਾਂ tan${downG.angle}=h/d ਅਤੇ tan${upG.angle}=(${exactText(targetObject.height)}−h)/d।`), native(locale, `दोनों समीकरण हल करने पर h=${question.answer}।`, `ਦੋਵੇਂ ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ 'ਤੇ h=${question.answer}।`)],
      native(locale, "दोनों कोणों में वही d आता है; d हटाकर h निकालें।", "ਦੋਵੇਂ ਕੋਣਾਂ ਵਿੱਚ ਉਹੀ d ਆਉਂਦਾ ਹੈ; d ਹਟਾ ਕੇ h ਕੱਢੋ।"),
      native(locale, "मीनार की पूरी ऊँचाई को केवल ऊपर वाले rise के बराबर न मानें।", "ਮੀਨਾਰ ਦੀ ਪੂਰੀ ਉਚਾਈ ਨੂੰ ਸਿਰਫ਼ ਉੱਪਰ ਵਾਲੇ rise ਦੇ ਬਰਾਬਰ ਨਾ ਮੰਨੋ।"));
    if (requested.kind === "HORIZONTAL_DISTANCE") return makeExplanation(locale,
      native(locale, "आधार के अवनमन कोण से क्षैतिज दूरी सीधे मिलती है क्योंकि नीचे का vertical drop पर्यवेक्षक की ऊँचाई है।", "ਅਧਾਰ ਦੇ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ਤੋਂ ਖਿਤਿਜੀ ਦੂਰੀ ਸਿੱਧੀ ਮਿਲਦੀ ਹੈ ਕਿਉਂਕਿ ਹੇਠਾਂ ਵਾਲਾ vertical drop ਨਿਰੀਖਕ ਦੀ ਉਚਾਈ ਹੈ।"),
      [native(locale, `पर्यवेक्षक की ऊँचाई ${exactText(eyeHeight)} m और अवनमन कोण ${downG.angle} है।`, `ਨਿਰੀਖਕ ਦੀ ਉਚਾਈ ${exactText(eyeHeight)} m ਅਤੇ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ${downG.angle} ਹੈ।`), native(locale, `tan${downG.angle}=${exactText(eyeHeight)}/d, इसलिए d=${exactText(eyeHeight)}/tan${downG.angle}।`, `tan${downG.angle}=${exactText(eyeHeight)}/d, ਇਸ ਲਈ d=${exactText(eyeHeight)}/tan${downG.angle}।`), native(locale, `अतः क्षैतिज दूरी ${question.answer} है; ऊपर की sight line उसी दूरी की पुष्टि करती है।`, `ਇਸ ਲਈ ਖਿਤਿਜੀ ਦੂਰੀ ${question.answer} ਹੈ; ਉੱਪਰ ਵਾਲੀ sight line ਉਸੇ ਦੂਰੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੀ ਹੈ।`)],
      native(locale, "दूरी के लिए पहले depression-to-base triangle देखें।", "ਦੂਰੀ ਲਈ ਪਹਿਲਾਂ depression-to-base triangle ਵੇਖੋ।"),
      native(locale, "ऊपर और नीचे की दूरियों को जोड़ें नहीं; दोनों में वही horizontal distance है।", "ਉੱਪਰ ਅਤੇ ਹੇਠਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਨਾ ਜੋੜੋ; ਦੋਵੇਂ ਵਿੱਚ ਉਹੀ horizontal distance ਹੈ।"));
    return makeExplanation(locale,
      native(locale, "अवनमन से horizontal distance और उन्नयन से आँख के स्तर के ऊपर का rise निकालें; दोनों को जोड़कर मीनार की कुल ऊँचाई मिलती है।", "ਡਿਪ੍ਰੈਸ਼ਨ ਤੋਂ horizontal distance ਅਤੇ ਉਚਾਈ ਕੋਣ ਤੋਂ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦਾ rise ਕੱਢੋ; ਦੋਵੇਂ ਨੂੰ ਜੋੜ ਕੇ ਮੀਨਾਰ ਦੀ ਕੁੱਲ ਉਚਾਈ ਮਿਲਦੀ ਹੈ।"),
      [native(locale, `पर्यवेक्षक की ऊँचाई ${exactText(eyeHeight)} m, अवनमन ${downG.angle}, उन्नयन ${upG.angle} है।`, `ਨਿਰੀਖਕ ਦੀ ਉਚਾਈ ${exactText(eyeHeight)} m, ਡਿਪ੍ਰੈਸ਼ਨ ${downG.angle}, ਉਚਾਈ ${upG.angle} ਹੈ।`), native(locale, `d=${exactText(eyeHeight)}/tan${downG.angle}; फिर ऊपर का rise=d·tan${upG.angle}=${exactText(rise)} m।`, `d=${exactText(eyeHeight)}/tan${downG.angle}; ਫਿਰ ਉੱਪਰ ਵਾਲਾ rise=d·tan${upG.angle}=${exactText(rise)} m।`), native(locale, `मीनार की ऊँचाई=${exactText(eyeHeight)}+${exactText(rise)}=${question.answer}।`, `ਮੀਨਾਰ ਦੀ ਉਚਾਈ=${exactText(eyeHeight)}+${exactText(rise)}=${question.answer}।`)],
      native(locale, "पहले नीचे वाले triangle से d निकालना सबसे साफ तरीका है।", "ਪਹਿਲਾਂ ਹੇਠਾਂ ਵਾਲੇ triangle ਤੋਂ d ਕੱਢਣਾ ਸਭ ਤੋਂ ਸਾਫ਼ ਤਰੀਕਾ ਹੈ।"),
      native(locale, "केवल ऊपर का rise ही कुल मीनार ऊँचाई नहीं है।", "ਸਿਰਫ਼ ਉੱਪਰ ਵਾਲਾ rise ਹੀ ਕੁੱਲ ਮੀਨਾਰ ਉਚਾਈ ਨਹੀਂ ਹੈ।"));
  }

  if (question.lockedFamily === "RIVER_WIDTH" || question.lockedFamily === "RIVER_WIDTH_HORIZONTAL_SEPARATION") {
    const obs = observationGeometry(state, state.observations[0]);
    const drop = absoluteExactDifference(obs.eye.y, obs.target.y);
    return makeExplanation(locale,
      native(locale, "अवनमन कोण के समकोण त्रिभुज में नदी की चौड़ाई horizontal adjacent side होती है।", "ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ਦੇ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਨਦੀ ਦੀ ਚੌੜਾਈ horizontal adjacent side ਹੁੰਦੀ ਹੈ।"),
      [native(locale, `ऊँचाई ${exactText(drop)} m और अवनमन कोण ${obs.angle} है।`, `ਉਚਾਈ ${exactText(drop)} m ਅਤੇ ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ ${obs.angle} ਹੈ।`), native(locale, `tan${obs.angle}=${exactText(drop)}/w, इसलिए w=${exactText(drop)}/tan${obs.angle}।`, `tan${obs.angle}=${exactText(drop)}/w, ਇਸ ਲਈ w=${exactText(drop)}/tan${obs.angle}।`), native(locale, `अतः नदी की चौड़ाई ${question.answer} है।`, `ਇਸ ਲਈ ਨਦੀ ਦੀ ਚੌੜਾਈ ${question.answer} ਹੈ।`)],
      native(locale, "width हमेशा horizontal दूरी है, line of sight नहीं।", "width ਹਮੇਸ਼ਾਂ horizontal ਦੂਰੀ ਹੈ, line of sight ਨਹੀਂ।"),
      native(locale, "ऊँचाई या तिरछी sight line को नदी की चौड़ाई न मानें।", "ਉਚਾਈ ਜਾਂ ਤਿਰਛੀ sight line ਨੂੰ ਨਦੀ ਦੀ ਚੌੜਾਈ ਨਾ ਮੰਨੋ।"));
  }

  if (question.lockedFamily === "COMPOSITE_VERTICAL_OBJECT_RELATIONS") {
    const building = state.verticalObjects.find((item: AnyQuestion) => item.kind === "BUILDING") ?? state.verticalObjects[0];
    const upper = state.verticalObjects.find((item: AnyQuestion) => item.id !== building.id) ?? state.verticalObjects[1];
    const observations = state.observations.map((item: AnyQuestion) => observationGeometry(state, item))
      .sort((a: AnyQuestion, b: AnyQuestion) => Number(toDegrees(a.observation.angle).numerator) - Number(toDegrees(b.observation.angle).numerator));
    const run = observations[0].distance;
    const lowerAngle = observations[0].angle, upperAngle = observations[observations.length - 1].angle;
    if (requested.kind === "OBJECT_HEIGHT") return makeExplanation(locale,
      native(locale, "एक ही horizontal distance पर दो sight-line ऊँचाइयों का अंतर ऊपर लगे मस्तूल की ऊँचाई देता है।", "ਇੱਕੋ horizontal distance 'ਤੇ ਦੋ sight-line ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ ਉੱਪਰ ਲੱਗੇ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਦਿੰਦਾ ਹੈ।"),
      [native(locale, `दूरी ${exactText(run)} m; छत का कोण ${lowerAngle}, मस्तूल-शीर्ष का कोण ${upperAngle} है।`, `ਦੂਰੀ ${exactText(run)} m; ਛੱਤ ਦਾ ਕੋਣ ${lowerAngle}, ਮਸਤੂਲ-ਚੋਟੀ ਦਾ ਕੋਣ ${upperAngle} ਹੈ।`), native(locale, `छत की ऊँचाई=${exactText(run)}·tan${lowerAngle}; कुल ऊँचाई=${exactText(run)}·tan${upperAngle}।`, `ਛੱਤ ਦੀ ਉਚਾਈ=${exactText(run)}·tan${lowerAngle}; ਕੁੱਲ ਉਚਾਈ=${exactText(run)}·tan${upperAngle}।`), native(locale, `मस्तूल की ऊँचाई=कुल−छत=${question.answer}।`, `ਮਸਤੂਲ ਦੀ ਉਚਾਈ=ਕੁੱਲ−ਛੱਤ=${question.answer}।`)],
      native(locale, "ऊपरी वस्तु की ऊँचाई पाने के लिए दो total levels घटाएँ।", "ਉੱਪਰੀ ਵਸਤੂ ਦੀ ਉਚਾਈ ਲਈ ਦੋ total levels ਘਟਾਓ।"),
      native(locale, "60° वाली total height को अकेले mast height न मानें।", "60° ਵਾਲੀ total height ਨੂੰ ਇਕੱਲੇ mast height ਨਾ ਮੰਨੋ।"));
    return makeExplanation(locale,
      native(locale, "मस्तूल की ऊँचाई = d(tan upper angle − tan roof angle); इसी से d निकालें।", "ਮਸਤੂਲ ਦੀ ਉਚਾਈ = d(tan upper angle − tan roof angle); ਇਸੇ ਤੋਂ d ਕੱਢੋ।"),
      [native(locale, `मस्तूल ${exactText(upper.height)} m ऊँचा है; कोण ${lowerAngle} और ${upperAngle} हैं।`, `ਮਸਤੂਲ ${exactText(upper.height)} m ਉੱਚਾ ਹੈ; ਕੋਣ ${lowerAngle} ਅਤੇ ${upperAngle} ਹਨ।`), native(locale, `${exactText(upper.height)}=d(tan${upperAngle}−tan${lowerAngle})।`, `${exactText(upper.height)}=d(tan${upperAngle}−tan${lowerAngle})।`), native(locale, `समीकरण हल और exact रूप सरल करने पर d=${question.answer}।`, `ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ ਅਤੇ exact ਰੂਪ ਸਧਾਰਨ ਕਰਨ 'ਤੇ d=${question.answer}।`)],
      native(locale, "दोनों tan values का अंतर लें; यही mast का vertical हिस्सा है।", "ਦੋਵੇਂ tan values ਦਾ ਅੰਤਰ ਲਓ; ਇਹੀ mast ਦਾ vertical ਹਿੱਸਾ ਹੈ।"),
      native(locale, "मस्तूल की ऊँचाई को किसी एक sight-line की पूरी ऊँचाई न मानें।", "ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਨੂੰ ਕਿਸੇ ਇੱਕ sight-line ਦੀ ਪੂਰੀ ਉਚਾਈ ਨਾ ਮੰਨੋ।"));
  }

  throw new Error(`${question.qlId}: unsupported CP010 explanation family ${question.lockedFamily}.`);
}

export function trg002Cp010CanonicalSemanticFingerprint(question: AnyQuestion) {
  return sha256({
    packageId: question.packageId, cpId: question.cpId, qlId: question.qlId, seed: question.seed,
    lockedFamily: question.lockedFamily, solveMode: question.solveMode, difficulty: question.difficulty,
    target: question.target, exactAnswer: question.exactAnswer, answer: question.answer,
    options: question.options.map((option: AnyQuestion) => ({ value: option.value, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
    correctIndex: question.correctIndex, canonicalSpatialState: question.canonicalSpatialState,
    solutionDiagram: question.solutionDiagram, diagramEvidence: question.diagramEvidence,
  });
}

export function localizeFrozenTrg002Cp010Question(canonicalQuestion: AnyQuestion, locale: Trg002Cp010LocalizedLocale) {
  if (!TRG_002_CP010_LOCALIZATION_QL_IDS.includes(canonicalQuestion.qlId)) throw new Error(`${canonicalQuestion.qlId}: outside TRG-CP-010 localization scope.`);
  if (canonicalQuestion.cpId !== "TRG-CP-010") throw new Error(`${canonicalQuestion.qlId}: CP010 localizer received ${canonicalQuestion.cpId}.`);
  const canonicalSemanticFingerprint = trg002Cp010CanonicalSemanticFingerprint(canonicalQuestion);
  const stem = localizedStem(canonicalQuestion, locale);
  const explanation = localizedExplanation(canonicalQuestion, locale);
  const localizationFingerprint = sha256({ version: TRG_002_CP010_LOCALIZATION_VERSION, locale, qlId: canonicalQuestion.qlId, seed: canonicalQuestion.seed, canonicalSemanticFingerprint, stem, explanation });
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
      version: TRG_002_CP010_LOCALIZATION_VERSION,
      authority: TRG_002_CP010_LOCALIZATION_AUTHORITY,
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

export function generateLocalizedTrg002Cp010Question(qlId: string, seed: string, locale: Trg002Cp010LocalizedLocale) {
  if (!TRG_002_CP010_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-CP-010 localization scope.`);
  return localizeFrozenTrg002Cp010Question(generateFrozenTrg002Production96Question(qlId, seed) as AnyQuestion, locale);
}

export function buildTrg002Cp010LocalizedReviewBank(locale: Trg002Cp010LocalizedLocale, seedsPerQl = 12) {
  return TRG_002_CP010_LOCALIZATION_QL_IDS.flatMap((qlId) => Array.from({ length: seedsPerQl }, (_, index) =>
    generateLocalizedTrg002Cp010Question(qlId, `trg002-cp010-localization-v1-${String(index + 1).padStart(2, "0")}`, locale),
  ));
}
