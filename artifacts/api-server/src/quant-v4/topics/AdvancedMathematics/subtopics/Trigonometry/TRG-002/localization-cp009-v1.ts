import { createHash } from "node:crypto";

import { toDegrees } from "../foundation/angle";
import { exactToNumber, formatExactPlain, subtractExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";

export const TRG_002_CP009_LOCALIZATION_VERSION = "TRG002_CP009_HI_PA_LOCALIZATION_V1" as const;
export const TRG_002_CP009_LOCALIZATION_AUTHORITY = "FROZEN_ENGLISH_CANONICAL_SPATIAL_TRANSFORMATION_V1" as const;
export const TRG_002_CP009_LOCALIZATION_QL_IDS = Array.from(
  { length: 24 },
  (_, index) => `TRG-002-QL-${String(index + 49).padStart(3, "0")}`,
) as readonly string[];

export type Trg002Cp009LocalizedLocale = "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;
type State = AnyQuestion["canonicalSpatialState"];

function native(locale: Trg002Cp009LocalizedLocale, hi: string, pa: string) {
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
  if (!found) throw new Error(`TRG-002 CP009 localization: missing canonical point ${id}.`);
  return found;
}

function angleText(angle: any) {
  const degrees = toDegrees(angle);
  return `${degrees.denominator === 1n ? degrees.numerator : `${degrees.numerator}/${degrees.denominator}`}°`;
}

function makeExplanation(
  locale: Trg002Cp009LocalizedLocale,
  rule: string,
  bodies: string[],
  shortcut: string,
  trap: string,
) {
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

type ObservationGeometry = {
  observation: AnyQuestion;
  eye: AnyQuestion;
  target: AnyQuestion;
  distance: ExactTrigNumber;
  angle: string;
};

function observationGeometry(state: State, observation: AnyQuestion): ObservationGeometry {
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

function sameSideGeometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  if (question.cpId !== "TRG-CP-009") throw new Error(`${question.qlId}: CP009 localizer received ${question.cpId}.`);
  if (state.observations.length < 2) throw new Error(`${question.qlId}: CP009 same-side form requires two canonical observations.`);

  const observations = state.observations.map((item: AnyQuestion) => observationGeometry(state, item));
  const targetIds = new Set(observations.map((item: ObservationGeometry) => item.observation.targetPointId));
  if (targetIds.size !== 1) throw new Error(`${question.qlId}: same-side extractor received a multi-object state.`);

  const sorted = [...observations].sort((a, b) => exactToNumber(a.distance) - exactToNumber(b.distance));
  const near = sorted[0];
  const far = sorted[sorted.length - 1];
  const height = absoluteExactDifference(near.target.y, state.groundY);
  const separation = absoluteExactDifference(near.eye.x, far.eye.x);
  const movement = state.movements[0] as AnyQuestion | undefined;
  return { state, near, far, height, separation, movement };
}

function comparativeGeometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  if (state.observations.length !== 2) throw new Error(`${question.qlId}: comparative form requires exactly two observations.`);
  const observations = state.observations.map((item: AnyQuestion) => observationGeometry(state, item));
  const sorted = [...observations].sort((a, b) => exactToNumber(a.distance) - exactToNumber(b.distance));
  const near = sorted[0];
  const far = sorted[1];
  const nearObject = state.verticalObjects.find((item: AnyQuestion) => item.topPointId === near.observation.targetPointId);
  const farObject = state.verticalObjects.find((item: AnyQuestion) => item.topPointId === far.observation.targetPointId);
  const nearHeight = nearObject?.height ?? absoluteExactDifference(near.target.y, state.groundY);
  const farHeight = farObject?.height ?? absoluteExactDifference(far.target.y, state.groundY);
  const separation = absoluteExactDifference(near.target.x, far.target.x);
  return { state, near, far, nearHeight, farHeight, separation };
}

function sameSideStem(question: AnyQuestion, locale: Trg002Cp009LocalizedLocale) {
  const g = sameSideGeometry(question);
  const near = exactText(g.near.distance);
  const far = exactText(g.far.distance);
  const separation = exactText(g.separation);
  const height = exactText(g.height);
  const nearAngle = g.near.angle;
  const farAngle = g.far.angle;
  const movement = g.movement ? exactText(g.movement.distance) : separation;
  const mode = String(question.solveMode);

  if (question.lockedFamily === "SAME_SIDE_TWO_OBSERVATIONS") {
    if (g.state.requested.kind === "OBJECT_HEIGHT") return native(locale,
      `मीनार के एक ही ओर दो बिंदु ${separation} m की दूरी पर हैं। निकट बिंदु से शीर्ष का उन्नयन कोण ${nearAngle} और दूर बिंदु से ${farAngle} है। मीनार की ऊँचाई ज्ञात कीजिए।`,
      `ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਬਿੰਦੂ ${separation} m ਦੀ ਦੂਰੀ 'ਤੇ ਹਨ। ਨੇੜਲੇ ਬਿੰਦੂ ਤੋਂ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${nearAngle} ਅਤੇ ਦੂਰਲੇ ਬਿੰਦੂ ਤੋਂ ${farAngle} ਹੈ। ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    if (g.state.requested.kind === "HORIZONTAL_DISTANCE" && g.state.requested.toPointId === g.near.eye.id) return native(locale,
      `मीनार के एक ही ओर दो अवलोकन बिंदु ${separation} m दूर हैं। निकट बिंदु से उन्नयन कोण ${nearAngle} और दूर बिंदु से ${farAngle} है। निकट बिंदु की मीनार से दूरी ज्ञात कीजिए।`,
      `ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਨਿਰੀਖਣ ਬਿੰਦੂ ${separation} m ਦੂਰ ਹਨ। ਨੇੜਲੇ ਬਿੰਦੂ ਤੋਂ ਉਚਾਈ ਕੋਣ ${nearAngle} ਅਤੇ ਦੂਰਲੇ ਬਿੰਦੂ ਤੋਂ ${farAngle} ਹੈ। ਨੇੜਲੇ ਬਿੰਦੂ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ਕੱਢੋ।`);
    return native(locale,
      `मीनार के एक ही ओर दो अवलोकन बिंदु ${separation} m दूर हैं। निकट बिंदु से उन्नयन कोण ${nearAngle} और दूर बिंदु से ${farAngle} है। दूर बिंदु की मीनार से दूरी ज्ञात कीजिए।`,
      `ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਨਿਰੀਖਣ ਬਿੰਦੂ ${separation} m ਦੂਰ ਹਨ। ਨੇੜਲੇ ਬਿੰਦੂ ਤੋਂ ਉਚਾਈ ਕੋਣ ${nearAngle} ਅਤੇ ਦੂਰਲੇ ਬਿੰਦੂ ਤੋਂ ${farAngle} ਹੈ। ਦੂਰਲੇ ਬਿੰਦੂ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "OBSERVER_MOVES_CLOSER") {
    if (g.state.requested.kind === "MOVEMENT_DISTANCE") return native(locale,
      `एक मीनार की ऊँचाई ${height} m है। एक पर्यवेक्षक पहले उसके शीर्ष को ${farAngle} के उन्नयन कोण पर देखता है और फिर मीनार की ओर चलता है, जहाँ कोण ${nearAngle} हो जाता है। पर्यवेक्षक कितनी दूरी चला?`,
      `ਇੱਕ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਹੈ। ਇੱਕ ਨਿਰੀਖਕ ਪਹਿਲਾਂ ਇਸ ਦੀ ਚੋਟੀ ਨੂੰ ${farAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ ਅਤੇ ਫਿਰ ਮੀਨਾਰ ਵੱਲ ਤੁਰਦਾ ਹੈ, ਜਿੱਥੇ ਕੋਣ ${nearAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਿਰੀਖਕ ਕਿੰਨੀ ਦੂਰੀ ਤੁਰਿਆ?`);
    if (g.state.requested.kind === "HORIZONTAL_DISTANCE" && g.state.requested.toPointId === g.near.eye.id) return native(locale,
      `एक पर्यवेक्षक मीनार के शीर्ष को पहले ${farAngle} के उन्नयन कोण पर देखता है। ${movement} m मीनार की ओर चलने पर कोण ${nearAngle} हो जाता है। अब पर्यवेक्षक मीनार से कितनी दूर है?`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਨੂੰ ਪਹਿਲਾਂ ${farAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ। ${movement} m ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ 'ਤੇ ਕੋਣ ${nearAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਹੁਣ ਨਿਰੀਖਕ ਮੀਨਾਰ ਤੋਂ ਕਿੰਨਾ ਦੂਰ ਹੈ?`);
    if (g.state.requested.kind === "HORIZONTAL_DISTANCE") return native(locale,
      `एक पर्यवेक्षक मीनार के शीर्ष को ${farAngle} के उन्नयन कोण पर देखता है। ${movement} m मीनार की ओर चलने पर कोण ${nearAngle} हो जाता है। पर्यवेक्षक की प्रारंभिक दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਨੂੰ ${farAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ। ${movement} m ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ 'ਤੇ ਕੋਣ ${nearAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਿਰੀਖਕ ਦੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਕੱਢੋ।`);
    return native(locale,
      `एक पर्यवेक्षक मीनार के शीर्ष को पहले ${farAngle} के उन्नयन कोण पर देखता है। ${movement} m मीनार की ओर चलने पर कोण ${nearAngle} हो जाता है। मीनार की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਨੂੰ ਪਹਿਲਾਂ ${farAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ। ${movement} m ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ 'ਤੇ ਕੋਣ ${nearAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "OBSERVER_MOVES_FARTHER") {
    if (mode === "findHeightAfterMovingFarther") return native(locale,
      `एक पर्यवेक्षक मीनार से ${near} m दूर है और शीर्ष का उन्नयन कोण ${nearAngle} है। वह ${movement} m मीनार से दूर चलता है, तब कोण ${farAngle} हो जाता है। मीनार की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਤੋਂ ${near} m ਦੂਰ ਹੈ ਅਤੇ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${nearAngle} ਹੈ। ਉਹ ${movement} m ਮੀਨਾਰ ਤੋਂ ਦੂਰ ਤੁਰਦਾ ਹੈ, ਤਦ ਕੋਣ ${farAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    if (g.state.requested.kind === "MOVEMENT_DISTANCE") return native(locale,
      `एक मीनार की ऊँचाई ${height} m है। पर्यवेक्षक पहले शीर्ष को ${nearAngle} के कोण पर देखता है और मीनार से दूर चलने पर कोण ${farAngle} हो जाता है। वह कितनी दूरी चला?`,
      `ਇੱਕ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਹੈ। ਨਿਰੀਖਕ ਪਹਿਲਾਂ ਚੋਟੀ ਨੂੰ ${nearAngle} ਦੇ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ ਅਤੇ ਮੀਨਾਰ ਤੋਂ ਦੂਰ ਤੁਰਨ 'ਤੇ ਕੋਣ ${farAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਉਹ ਕਿੰਨੀ ਦੂਰੀ ਤੁਰਿਆ?`);
    if (g.state.requested.kind === "HORIZONTAL_DISTANCE") return native(locale,
      `एक मीनार की ऊँचाई ${height} m है। पर्यवेक्षक पहले शीर्ष को ${nearAngle} के उन्नयन कोण पर देखता है और दूर चलने पर कोण ${farAngle} हो जाता है। अंतिम क्षैतिज दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਹੈ। ਨਿਰੀਖਕ ਪਹਿਲਾਂ ਚੋਟੀ ਨੂੰ ${nearAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ ਅਤੇ ਦੂਰ ਤੁਰਨ 'ਤੇ ਕੋਣ ${farAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    return native(locale,
      `एक पर्यवेक्षक मीनार के शीर्ष को ${nearAngle} के उन्नयन कोण पर देखता है। वह ${movement} m मीनार से दूर चलता है और कोण ${farAngle} हो जाता है। मीनार की ऊँचाई ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਨੂੰ ${nearAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ। ਉਹ ${movement} m ਮੀਨਾਰ ਤੋਂ ਦੂਰ ਤੁਰਦਾ ਹੈ ਅਤੇ ਕੋਣ ${farAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "FIND_ORIGINAL_DISTANCE") {
    if (mode === "recoverOriginalDistanceFromKnownNearPoint") return native(locale,
      `मीनार से ${near} m दूर एक बिंदु से शीर्ष का उन्नयन कोण ${nearAngle} है। उसी सीधी रेखा पर एक और दूर बिंदु से कोण ${farAngle} है। दूर बिंदु की मीनार से दूरी ज्ञात कीजिए।`,
      `ਮੀਨਾਰ ਤੋਂ ${near} m ਦੂਰ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${nearAngle} ਹੈ। ਉਸੇ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਇੱਕ ਹੋਰ ਦੂਰਲੇ ਬਿੰਦੂ ਤੋਂ ਕੋਣ ${farAngle} ਹੈ। ਦੂਰਲੇ ਬਿੰਦੂ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ਕੱਢੋ।`);
    return native(locale,
      `एक पर्यवेक्षक मीनार के शीर्ष को पहले ${farAngle} के उन्नयन कोण पर देखता है। ${movement} m मीनार की ओर चलने पर कोण ${nearAngle} हो जाता है। प्रारंभिक दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਨੂੰ ਪਹਿਲਾਂ ${farAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ। ${movement} m ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ 'ਤੇ ਕੋਣ ${nearAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਕੱਢੋ।`);
  }

  if (question.lockedFamily === "FIND_MOVEMENT_SEPARATION") {
    if (mode === "findCloserMovementFromOriginalDistanceAndAngles") return native(locale,
      `एक पर्यवेक्षक मीनार से ${far} m दूर होकर शीर्ष को ${farAngle} के उन्नयन कोण पर देखता है। वह मीनार की ओर चलता है, जहाँ कोण ${nearAngle} हो जाता है। चली गई दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਨਿਰੀਖਕ ਮੀਨਾਰ ਤੋਂ ${far} m ਦੂਰ ਹੋ ਕੇ ਚੋਟੀ ਨੂੰ ${farAngle} ਦੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ। ਉਹ ਮੀਨਾਰ ਵੱਲ ਤੁਰਦਾ ਹੈ, ਜਿੱਥੇ ਕੋਣ ${nearAngle} ਹੋ ਜਾਂਦਾ ਹੈ। ਤੁਰਿਆ ਗਿਆ ਫਾਸਲਾ ਕੱਢੋ।`);
    return native(locale,
      `एक मीनार की ऊँचाई ${height} m है। मीनार के एक ही ओर दो बिंदुओं से शीर्ष के उन्नयन कोण क्रमशः ${nearAngle} और ${farAngle} हैं। दोनों बिंदुओं के बीच की दूरी ज्ञात कीजिए।`,
      `ਇੱਕ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਹੈ। ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਬਿੰਦੂਆਂ ਤੋਂ ਚੋਟੀ ਦੇ ਉਚਾਈ ਕੋਣ ਕ੍ਰਮਵਾਰ ${nearAngle} ਅਤੇ ${farAngle} ਹਨ। ਦੋਵੇਂ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਦੀ ਦੂਰੀ ਕੱਢੋ।`);
  }

  throw new Error(`${question.qlId}: unsupported CP009 family ${question.lockedFamily}.`);
}

function localizedStem(question: AnyQuestion, locale: Trg002Cp009LocalizedLocale) {
  if (question.lockedFamily !== "COMPARATIVE_TWO_OBJECT_CONTROLLED") return sameSideStem(question, locale);
  const g = comparativeGeometry(question);
  return native(locale,
    `एक ही अवलोकन बिंदु के एक ही ओर दो मीनारें हैं। निकट मीनार की ऊँचाई ${exactText(g.nearHeight)} m और उसके शीर्ष का उन्नयन कोण ${g.near.angle} है। दूर मीनार की ऊँचाई ${exactText(g.farHeight)} m और उसका उन्नयन कोण ${g.far.angle} है। दोनों मीनारों के पादों के बीच की दूरी ज्ञात कीजिए।`,
    `ਇੱਕੋ ਨਿਰੀਖਣ ਬਿੰਦੂ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਮੀਨਾਰਾਂ ਹਨ। ਨੇੜਲੀ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${exactText(g.nearHeight)} m ਅਤੇ ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਈ ਕੋਣ ${g.near.angle} ਹੈ। ਦੂਰਲੀ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${exactText(g.farHeight)} m ਅਤੇ ਇਸ ਦਾ ਉਚਾਈ ਕੋਣ ${g.far.angle} ਹੈ। ਦੋਵੇਂ ਮੀਨਾਰਾਂ ਦੇ ਪੈਰਾਂ ਵਿਚਕਾਰ ਦੀ ਦੂਰੀ ਕੱਢੋ।`);
}

function localizedExplanation(question: AnyQuestion, locale: Trg002Cp009LocalizedLocale) {
  if (question.lockedFamily === "COMPARATIVE_TWO_OBJECT_CONTROLLED") {
    const g = comparativeGeometry(question);
    const nearDistance = exactText(g.near.distance), farDistance = exactText(g.far.distance), separation = exactText(g.separation);
    return makeExplanation(
      locale,
      native(locale, "हर मीनार के लिए tanθ=ऊँचाई/क्षैतिज दूरी। दोनों पाद एक ही ओर हैं, इसलिए उनकी दूरी दोनों क्षैतिज दूरियों का अंतर है।", "ਹਰ ਮੀਨਾਰ ਲਈ tanθ=ਉਚਾਈ/ਖਿਤਿਜੀ ਦੂਰੀ। ਦੋਵੇਂ ਪੈਰ ਇੱਕੋ ਪਾਸੇ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀ ਦੂਰੀ ਦੋਵੇਂ ਖਿਤਿਜੀ ਦੂਰੀਆਂ ਦਾ ਅੰਤਰ ਹੈ।"),
      [
        native(locale, `निकट मीनार: ऊँचाई ${exactText(g.nearHeight)} m, कोण ${g.near.angle}; दूर मीनार: ऊँचाई ${exactText(g.farHeight)} m, कोण ${g.far.angle}।`, `ਨੇੜਲੀ ਮੀਨਾਰ: ਉਚਾਈ ${exactText(g.nearHeight)} m, ਕੋਣ ${g.near.angle}; ਦੂਰਲੀ ਮੀਨਾਰ: ਉਚਾਈ ${exactText(g.farHeight)} m, ਕੋਣ ${g.far.angle}।`),
        native(locale, `निकट दूरी=${exactText(g.nearHeight)}/tan${g.near.angle}=${nearDistance} m और दूर दूरी=${exactText(g.farHeight)}/tan${g.far.angle}=${farDistance} m।`, `ਨੇੜਲੀ ਦੂਰੀ=${exactText(g.nearHeight)}/tan${g.near.angle}=${nearDistance} m ਅਤੇ ਦੂਰਲੀ ਦੂਰੀ=${exactText(g.farHeight)}/tan${g.far.angle}=${farDistance} m।`),
        native(locale, `दोनों पादों की दूरी=${farDistance}−${nearDistance}=${separation} m। यही उत्तर है।`, `ਦੋਵੇਂ ਪੈਰਾਂ ਦੀ ਦੂਰੀ=${farDistance}−${nearDistance}=${separation} m। ਇਹੀ ਉੱਤਰ ਹੈ।`),
      ],
      native(locale, "एक ही ओर स्थित वस्तुओं के लिए पहले दोनों की पर्यवेक्षक से दूरी निकालें, फिर बड़ी में से छोटी दूरी घटाएँ।", "ਇੱਕੋ ਪਾਸੇ ਵਾਲੀਆਂ ਵਸਤੂਆਂ ਲਈ ਪਹਿਲਾਂ ਦੋਵੇਂ ਦੀ ਨਿਰੀਖਕ ਤੋਂ ਦੂਰੀ ਕੱਢੋ, ਫਿਰ ਵੱਡੀ ਵਿੱਚੋਂ ਛੋਟੀ ਦੂਰੀ ਘਟਾਓ।"),
      native(locale, "दोनों दूरियों को जोड़ना नहीं है; दोनों मीनारें अवलोकन बिंदु के एक ही ओर हैं।", "ਦੋਵੇਂ ਦੂਰੀਆਂ ਜੋੜਣੀਆਂ ਨਹੀਂ; ਦੋਵੇਂ ਮੀਨਾਰਾਂ ਨਿਰੀਖਣ ਬਿੰਦੂ ਦੇ ਇੱਕੋ ਪਾਸੇ ਹਨ।"),
    );
  }

  const g = sameSideGeometry(question);
  const near = exactText(g.near.distance), far = exactText(g.far.distance), separation = exactText(g.separation), height = exactText(g.height);
  const nearAngle = g.near.angle, farAngle = g.far.angle;
  const movement = g.movement ? exactText(g.movement.distance) : separation;
  const mode = String(question.solveMode);

  if (question.lockedFamily === "SAME_SIDE_TWO_OBSERVATIONS") {
    const requestedText = g.state.requested.kind === "OBJECT_HEIGHT"
      ? native(locale, `ऊँचाई ${height} m`, `ਉਚਾਈ ${height} m`)
      : g.state.requested.toPointId === g.near.eye.id
        ? native(locale, `निकट दूरी ${near} m`, `ਨੇੜਲੀ ਦੂਰੀ ${near} m`)
        : native(locale, `दूर दूरी ${far} m`, `ਦੂਰਲੀ ਦੂਰੀ ${far} m`);
    return makeExplanation(locale,
      native(locale, "दोनों बिंदुओं से एक ही मीनार की ऊँचाई मिलती है, इसलिए दोनों tangent समीकरण बराबर रखे जाते हैं।", "ਦੋਵੇਂ ਬਿੰਦੂਆਂ ਤੋਂ ਇੱਕੋ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ tangent ਸਮੀਕਰਨ ਬਰਾਬਰ ਰੱਖੇ ਜਾਂਦੇ ਹਨ।"),
      [
        native(locale, `दोनों बिंदुओं में ${separation} m का अंतर है; निकट कोण ${nearAngle} और दूर कोण ${farAngle} है।`, `ਦੋਵੇਂ ਬਿੰਦੂਆਂ ਵਿੱਚ ${separation} m ਦਾ ਅੰਤਰ ਹੈ; ਨੇੜਲਾ ਕੋਣ ${nearAngle} ਅਤੇ ਦੂਰਲਾ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `निकट दूरी x मानें। दूर दूरी x+${separation} होगी। इसलिए x·tan${nearAngle}=(x+${separation})·tan${farAngle}।`, `ਨੇੜਲੀ ਦੂਰੀ x ਮੰਨੋ। ਦੂਰਲੀ ਦੂਰੀ x+${separation} ਹੋਵੇਗੀ। ਇਸ ਲਈ x·tan${nearAngle}=(x+${separation})·tan${farAngle}।`),
        native(locale, `समीकरण हल करने पर निकट दूरी ${near} m, दूर दूरी ${far} m और मीनार की ऊँचाई ${height} m मिलती है। प्रश्न के अनुसार ${requestedText} उत्तर है।`, `ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ 'ਤੇ ਨੇੜਲੀ ਦੂਰੀ ${near} m, ਦੂਰਲੀ ਦੂਰੀ ${far} m ਅਤੇ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਮਿਲਦੀ ਹੈ। ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ${requestedText} ਉੱਤਰ ਹੈ।`),
      ],
      native(locale, "निकट और दूर दूरी में दिया हुआ अंतर जोड़कर दोनों tangent संबंधों को एक ही ऊँचाई से जोड़ें।", "ਨੇੜਲੀ ਅਤੇ ਦੂਰਲੀ ਦੂਰੀ ਵਿੱਚ ਦਿੱਤਾ ਅੰਤਰ ਜੋੜ ਕੇ ਦੋਵੇਂ tangent ਸੰਬੰਧਾਂ ਨੂੰ ਇੱਕੋ ਉਚਾਈ ਨਾਲ ਜੋੜੋ।"),
      native(locale, "दिए गए बिंदु-अंतर को सीधे मीनार से दूरी न मानें।", "ਦਿੱਤੇ ਬਿੰਦੂ-ਅੰਤਰ ਨੂੰ ਸਿੱਧਾ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ਨਾ ਮੰਨੋ।"));
  }

  if (question.lockedFamily === "OBSERVER_MOVES_CLOSER") {
    if (g.state.requested.kind === "MOVEMENT_DISTANCE") return makeExplanation(locale,
      native(locale, "ऊँचाई ज्ञात हो तो दोनों कोणों से पुरानी और नई क्षैतिज दूरी निकालकर उनका अंतर लें।", "ਉਚਾਈ ਪਤਾ ਹੋਵੇ ਤਾਂ ਦੋਵੇਂ ਕੋਣਾਂ ਤੋਂ ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਲਓ।"),
      [
        native(locale, `मीनार की ऊँचाई ${height} m है; प्रारंभिक कोण ${farAngle} और अंतिम कोण ${nearAngle} है।`, `ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਹੈ; ਸ਼ੁਰੂਆਤੀ ਕੋਣ ${farAngle} ਅਤੇ ਅੰਤਿਮ ਕੋਣ ${nearAngle} ਹੈ।`),
        native(locale, `प्रारंभिक दूरी=${height}/tan${farAngle}=${far} m और अंतिम दूरी=${height}/tan${nearAngle}=${near} m।`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ=${height}/tan${farAngle}=${far} m ਅਤੇ ਅੰਤਿਮ ਦੂਰੀ=${height}/tan${nearAngle}=${near} m।`),
        native(locale, `चली दूरी=${far}−${near}=${movement} m।`, `ਤੁਰਿਆ ਫਾਸਲਾ=${far}−${near}=${movement} m।`),
      ],
      native(locale, "मीनार की ओर चलने पर दूरी घटती है, इसलिए पुरानी दूरी में से नई दूरी घटाएँ।", "ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ 'ਤੇ ਦੂਰੀ ਘਟਦੀ ਹੈ, ਇਸ ਲਈ ਪੁਰਾਣੀ ਦੂਰੀ ਵਿੱਚੋਂ ਨਵੀਂ ਦੂਰੀ ਘਟਾਓ।"),
      native(locale, "चली दूरी को किसी एक अवलोकन बिंदु की पूरी दूरी न मानें।", "ਤੁਰੇ ਫਾਸਲੇ ਨੂੰ ਕਿਸੇ ਇੱਕ ਨਿਰੀਖਣ ਬਿੰਦੂ ਦੀ ਪੂਰੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।"));

    const requested = g.state.requested.kind === "OBJECT_HEIGHT"
      ? native(locale, `ऊँचाई ${height} m`, `ਉਚਾਈ ${height} m`)
      : g.state.requested.toPointId === g.near.eye.id
        ? native(locale, `अंतिम दूरी ${near} m`, `ਅੰਤਿਮ ਦੂਰੀ ${near} m`)
        : native(locale, `प्रारंभिक दूरी ${far} m`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${far} m`);
    return makeExplanation(locale,
      native(locale, "मीनार की ओर चलने पर नई दूरी पुरानी दूरी से चली गई दूरी जितनी कम होती है; ऊँचाई दोनों अवलोकनों में समान रहती है।", "ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ 'ਤੇ ਨਵੀਂ ਦੂਰੀ ਪੁਰਾਣੀ ਦੂਰੀ ਨਾਲੋਂ ਤੁਰੇ ਫਾਸਲੇ ਜਿੰਨੀ ਘੱਟ ਹੁੰਦੀ ਹੈ; ਉਚਾਈ ਦੋਵੇਂ ਨਿਰੀਖਣਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ।"),
      [
        native(locale, `चली दूरी ${movement} m है; प्रारंभिक कोण ${farAngle} और अंतिम कोण ${nearAngle} है।`, `ਤੁਰਿਆ ਫਾਸਲਾ ${movement} m ਹੈ; ਸ਼ੁਰੂਆਤੀ ਕੋਣ ${farAngle} ਅਤੇ ਅੰਤਿਮ ਕੋਣ ${nearAngle} ਹੈ।`),
        native(locale, `अंतिम दूरी x मानें, तो प्रारंभिक दूरी x+${movement} होगी। इसलिए x·tan${nearAngle}=(x+${movement})·tan${farAngle}।`, `ਅੰਤਿਮ ਦੂਰੀ x ਮੰਨੋ, ਤਾਂ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ x+${movement} ਹੋਵੇਗੀ। ਇਸ ਲਈ x·tan${nearAngle}=(x+${movement})·tan${farAngle}।`),
        native(locale, `हल करने पर अंतिम दूरी ${near} m, प्रारंभिक दूरी ${far} m और ऊँचाई ${height} m मिलती है। प्रश्न के अनुसार ${requested} उत्तर है।`, `ਹੱਲ ਕਰਨ 'ਤੇ ਅੰਤਿਮ ਦੂਰੀ ${near} m, ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${far} m ਅਤੇ ਉਚਾਈ ${height} m ਮਿਲਦੀ ਹੈ। ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ${requested} ਉੱਤਰ ਹੈ।`),
      ],
      native(locale, "अंतिम दूरी x रखें; मीनार की ओर आने से प्रारंभिक दूरी x+movement होगी।", "ਅੰਤਿਮ ਦੂਰੀ x ਰੱਖੋ; ਮੀਨਾਰ ਵੱਲ ਆਉਣ ਕਰਕੇ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ x+movement ਹੋਵੇਗੀ।"),
      native(locale, "प्रारंभिक और अंतिम दूरी को उल्टा न करें।", "ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਦੂਰੀ ਨੂੰ ਉਲਟਾ ਨਾ ਕਰੋ।"));
  }

  if (question.lockedFamily === "OBSERVER_MOVES_FARTHER") {
    if (mode === "findHeightAfterMovingFarther") return makeExplanation(locale,
      native(locale, "प्रारंभिक दूरी और प्रारंभिक कोण से ऊँचाई सीधे मिलती है; दूर जाने के बाद का अवलोकन उसी ऊँचाई की जाँच करता है।", "ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਕੋਣ ਤੋਂ ਉਚਾਈ ਸਿੱਧੀ ਮਿਲਦੀ ਹੈ; ਦੂਰ ਜਾਣ ਤੋਂ ਬਾਅਦ ਦਾ ਨਿਰੀਖਣ ਉਸੇ ਉਚਾਈ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।"),
      [
        native(locale, `प्रारंभिक दूरी ${near} m, प्रारंभिक कोण ${nearAngle} और चली दूरी ${movement} m है।`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${near} m, ਸ਼ੁਰੂਆਤੀ ਕੋਣ ${nearAngle} ਅਤੇ ਤੁਰਿਆ ਫਾਸਲਾ ${movement} m ਹੈ।`),
        native(locale, `ऊँचाई=${near}·tan${nearAngle}=${height} m। दूर जाने के बाद दूरी ${far} m और कोण ${farAngle} है।`, `ਉਚਾਈ=${near}·tan${nearAngle}=${height} m। ਦੂਰ ਜਾਣ ਤੋਂ ਬਾਅਦ ਦੂਰੀ ${far} m ਅਤੇ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `अतः मीनार की ऊँचाई ${height} m है।`, `ਇਸ ਲਈ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਹੈ।`),
      ],
      native(locale, "जब प्रारंभिक दूरी दी हो तो पहले उसी अवलोकन से ऊँचाई निकालें।", "ਜਦੋਂ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਦਿੱਤੀ ਹੋਵੇ ਤਾਂ ਪਹਿਲਾਂ ਉਸੇ ਨਿਰੀਖਣ ਤੋਂ ਉਚਾਈ ਕੱਢੋ।"),
      native(locale, "चली दूरी को मीनार की ऊँचाई न मानें।", "ਤੁਰੇ ਫਾਸਲੇ ਨੂੰ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਨਾ ਮੰਨੋ।"));

    if (g.state.requested.kind === "HORIZONTAL_DISTANCE") return makeExplanation(locale,
      native(locale, "ज्ञात ऊँचाई और अंतिम उन्नयन कोण से अंतिम क्षैतिज दूरी सीधे d=h/tanθ से मिलती है।", "ਪਤਾ ਉਚਾਈ ਅਤੇ ਅੰਤਿਮ ਉਚਾਈ ਕੋਣ ਤੋਂ ਅੰਤਿਮ ਖਿਤਿਜੀ ਦੂਰੀ ਸਿੱਧੀ d=h/tanθ ਨਾਲ ਮਿਲਦੀ ਹੈ।"),
      [
        native(locale, `मीनार की ऊँचाई ${height} m और अंतिम कोण ${farAngle} है।`, `ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਅਤੇ ਅੰਤਿਮ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `अंतिम दूरी=${height}/tan${farAngle}=${far} m।`, `ਅੰਤਿਮ ਦੂਰੀ=${height}/tan${farAngle}=${far} m।`),
        native(locale, `अतः अंतिम क्षैतिज दूरी ${far} m है।`, `ਇਸ ਲਈ ਅੰਤਿਮ ਖਿਤਿਜੀ ਦੂਰੀ ${far} m ਹੈ।`),
      ],
      native(locale, "छोटे उन्नयन कोण पर पर्यवेक्षक अधिक दूर होता है।", "ਛੋਟੇ ਉਚਾਈ ਕੋਣ 'ਤੇ ਨਿਰੀਖਕ ਹੋਰ ਦੂਰ ਹੁੰਦਾ ਹੈ।"),
      native(locale, "अंतिम दूरी की जगह केवल चली गई अतिरिक्त दूरी न दें।", "ਅੰਤਿਮ ਦੂਰੀ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਤੁਰਿਆ ਵਾਧੂ ਫਾਸਲਾ ਨਾ ਦਿਓ।"));

    if (g.state.requested.kind === "MOVEMENT_DISTANCE") return makeExplanation(locale,
      native(locale, "ज्ञात ऊँचाई से दोनों क्षैतिज दूरियाँ निकालें; दूर जाने की दूरी अंतिम दूरी minus प्रारंभिक दूरी है।", "ਪਤਾ ਉਚਾਈ ਤੋਂ ਦੋਵੇਂ ਖਿਤਿਜੀ ਦੂਰੀਆਂ ਕੱਢੋ; ਦੂਰ ਜਾਣ ਦਾ ਫਾਸਲਾ ਅੰਤਿਮ ਦੂਰੀ minus ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਹੈ।"),
      [
        native(locale, `ऊँचाई ${height} m, प्रारंभिक कोण ${nearAngle}, अंतिम कोण ${farAngle} है।`, `ਉਚਾਈ ${height} m, ਸ਼ੁਰੂਆਤੀ ਕੋਣ ${nearAngle}, ਅੰਤਿਮ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `प्रारंभिक दूरी=${height}/tan${nearAngle}=${near} m; अंतिम दूरी=${height}/tan${farAngle}=${far} m।`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ=${height}/tan${nearAngle}=${near} m; ਅੰਤਿਮ ਦੂਰੀ=${height}/tan${farAngle}=${far} m।`),
        native(locale, `चली दूरी=${far}−${near}=${movement} m।`, `ਤੁਰਿਆ ਫਾਸਲਾ=${far}−${near}=${movement} m।`),
      ],
      native(locale, "दूर जाने पर बड़ी दूरी में से छोटी दूरी घटाएँ।", "ਦੂਰ ਜਾਣ 'ਤੇ ਵੱਡੀ ਦੂਰੀ ਵਿੱਚੋਂ ਛੋਟੀ ਦੂਰੀ ਘਟਾਓ।"),
      native(locale, "दोनों दूरियों को जोड़ें नहीं।", "ਦੋਵੇਂ ਦੂਰੀਆਂ ਜੋੜੋ ਨਾ।"));

    return makeExplanation(locale,
      native(locale, "दूर जाने पर अंतिम दूरी प्रारंभिक दूरी में movement जोड़कर बनती है और दोनों अवलोकनों में मीनार की ऊँचाई समान है।", "ਦੂਰ ਜਾਣ 'ਤੇ ਅੰਤਿਮ ਦੂਰੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਵਿੱਚ movement ਜੋੜ ਕੇ ਬਣਦੀ ਹੈ ਅਤੇ ਦੋਵੇਂ ਨਿਰੀਖਣਾਂ ਵਿੱਚ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ਇੱਕੋ ਹੈ।"),
      [
        native(locale, `चली दूरी ${movement} m; प्रारंभिक कोण ${nearAngle} और अंतिम कोण ${farAngle} है।`, `ਤੁਰਿਆ ਫਾਸਲਾ ${movement} m; ਸ਼ੁਰੂਆਤੀ ਕੋਣ ${nearAngle} ਅਤੇ ਅੰਤਿਮ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `प्रारंभिक दूरी x मानें। तब अंतिम दूरी x+${movement}; इसलिए x·tan${nearAngle}=(x+${movement})·tan${farAngle}।`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ x ਮੰਨੋ। ਤਦ ਅੰਤਿਮ ਦੂਰੀ x+${movement}; ਇਸ ਲਈ x·tan${nearAngle}=(x+${movement})·tan${farAngle}।`),
        native(locale, `हल करने पर मीनार की ऊँचाई ${height} m मिलती है।`, `ਹੱਲ ਕਰਨ 'ਤੇ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m ਮਿਲਦੀ ਹੈ।`),
      ],
      native(locale, "दूर जाने पर x+movement का प्रयोग करें।", "ਦੂਰ ਜਾਣ 'ਤੇ x+movement ਵਰਤੋ।"),
      native(locale, "दूर जाने पर movement को घटाएँ नहीं।", "ਦੂਰ ਜਾਣ 'ਤੇ movement ਘਟਾਓ ਨਾ।"));
  }

  if (question.lockedFamily === "FIND_ORIGINAL_DISTANCE") {
    if (mode === "recoverOriginalDistanceFromKnownNearPoint") return makeExplanation(locale,
      native(locale, "पहले निकट बिंदु की ज्ञात दूरी और कोण से ऊँचाई निकालें, फिर दूर वाले कोण से दूर दूरी निकालें।", "ਪਹਿਲਾਂ ਨੇੜਲੇ ਬਿੰਦੂ ਦੀ ਪਤਾ ਦੂਰੀ ਅਤੇ ਕੋਣ ਤੋਂ ਉਚਾਈ ਕੱਢੋ, ਫਿਰ ਦੂਰਲੇ ਕੋਣ ਤੋਂ ਦੂਰਲੀ ਦੂਰੀ ਕੱਢੋ।"),
      [
        native(locale, `निकट दूरी ${near} m और कोण ${nearAngle} है।`, `ਨੇੜਲੀ ਦੂਰੀ ${near} m ਅਤੇ ਕੋਣ ${nearAngle} ਹੈ।`),
        native(locale, `मीनार की ऊँचाई=${near}·tan${nearAngle}=${height} m। फिर दूर दूरी=${height}/tan${farAngle}=${far} m।`, `ਮੀਨਾਰ ਦੀ ਉਚਾਈ=${near}·tan${nearAngle}=${height} m। ਫਿਰ ਦੂਰਲੀ ਦੂਰੀ=${height}/tan${farAngle}=${far} m।`),
        native(locale, `अतः दूर बिंदु की मीनार से दूरी ${far} m है।`, `ਇਸ ਲਈ ਦੂਰਲੇ ਬਿੰਦੂ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ${far} m ਹੈ।`),
      ],
      native(locale, "45° जैसी सरल स्थिति में पहले ऊँचाई तुरंत निकालना उपयोगी है।", "45° ਵਰਗੀ ਸੌਖੀ ਸਥਿਤੀ ਵਿੱਚ ਪਹਿਲਾਂ ਉਚਾਈ ਤੁਰੰਤ ਕੱਢਣਾ ਲਾਭਦਾਇਕ ਹੈ।"),
      native(locale, "दो बिंदुओं के बीच का अंतर उत्तर न दें; प्रश्न मीनार से दूर बिंदु की पूरी दूरी पूछता है।", "ਦੋ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਦਾ ਅੰਤਰ ਉੱਤਰ ਨਾ ਦਿਓ; ਪ੍ਰਸ਼ਨ ਮੀਨਾਰ ਤੋਂ ਦੂਰਲੇ ਬਿੰਦੂ ਦੀ ਪੂਰੀ ਦੂਰੀ ਪੁੱਛਦਾ ਹੈ।"));

    return makeExplanation(locale,
      native(locale, "प्रारंभिक दूरी बड़ी है और मीनार की ओर चलने के बाद की दूरी उससे movement कम है; दोनों tangent संबंधों में ऊँचाई समान है।", "ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਵੱਡੀ ਹੈ ਅਤੇ ਮੀਨਾਰ ਵੱਲ ਤੁਰਨ ਤੋਂ ਬਾਅਦ ਦੀ ਦੂਰੀ ਉਸ ਤੋਂ movement ਘੱਟ ਹੈ; ਦੋਵੇਂ tangent ਸੰਬੰਧਾਂ ਵਿੱਚ ਉਚਾਈ ਇੱਕੋ ਹੈ।"),
      [
        native(locale, `चली दूरी ${movement} m; प्रारंभिक कोण ${farAngle}, अंतिम कोण ${nearAngle} है।`, `ਤੁਰਿਆ ਫਾਸਲਾ ${movement} m; ਸ਼ੁਰੂਆਤੀ ਕੋਣ ${farAngle}, ਅੰਤਿਮ ਕੋਣ ${nearAngle} ਹੈ।`),
        native(locale, `प्रारंभिक दूरी d मानें। नई दूरी d−${movement} होगी। इसलिए d·tan${farAngle}=(d−${movement})·tan${nearAngle}।`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ d ਮੰਨੋ। ਨਵੀਂ ਦੂਰੀ d−${movement} ਹੋਵੇਗੀ। ਇਸ ਲਈ d·tan${farAngle}=(d−${movement})·tan${nearAngle}।`),
        native(locale, `हल करने पर प्रारंभिक दूरी ${far} m मिलती है।`, `ਹੱਲ ਕਰਨ 'ਤੇ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${far} m ਮਿਲਦੀ ਹੈ।`),
      ],
      native(locale, "मीनार की ओर जाने पर नई दूरी = प्रारंभिक दूरी − movement रखें।", "ਮੀਨਾਰ ਵੱਲ ਜਾਣ 'ਤੇ ਨਵੀਂ ਦੂਰੀ = ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ − movement ਰੱਖੋ।"),
      native(locale, "movement को ही प्रारंभिक दूरी न मानें।", "movement ਨੂੰ ਹੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।"));
  }

  if (question.lockedFamily === "FIND_MOVEMENT_SEPARATION") {
    if (mode === "findCloserMovementFromOriginalDistanceAndAngles") return makeExplanation(locale,
      native(locale, "ज्ञात प्रारंभिक दूरी और पहले कोण से ऊँचाई निकालें; दूसरे कोण से नई दूरी निकालकर दोनों दूरियों का अंतर लें।", "ਪਤਾ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਅਤੇ ਪਹਿਲੇ ਕੋਣ ਤੋਂ ਉਚਾਈ ਕੱਢੋ; ਦੂਜੇ ਕੋਣ ਤੋਂ ਨਵੀਂ ਦੂਰੀ ਕੱਢ ਕੇ ਦੋਵੇਂ ਦੂਰੀਆਂ ਦਾ ਅੰਤਰ ਲਓ।"),
      [
        native(locale, `प्रारंभिक दूरी ${far} m और कोण ${farAngle} है।`, `ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${far} m ਅਤੇ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `ऊँचाई=${far}·tan${farAngle}=${height} m; नई दूरी=${height}/tan${nearAngle}=${near} m।`, `ਉਚਾਈ=${far}·tan${farAngle}=${height} m; ਨਵੀਂ ਦੂਰੀ=${height}/tan${nearAngle}=${near} m।`),
        native(locale, `चली दूरी=${far}−${near}=${separation} m।`, `ਤੁਰਿਆ ਫਾਸਲਾ=${far}−${near}=${separation} m।`),
      ],
      native(locale, "पहली ज्ञात दूरी से पहले ऊँचाई निकालना इस रूप में सबसे सीधा रास्ता है।", "ਪਹਿਲੀ ਪਤਾ ਦੂਰੀ ਤੋਂ ਪਹਿਲਾਂ ਉਚਾਈ ਕੱਢਣਾ ਇਸ ਰੂਪ ਵਿੱਚ ਸਭ ਤੋਂ ਸਿੱਧਾ ਰਸਤਾ ਹੈ।"),
      native(locale, "पुरानी और नई दूरी को जोड़ें नहीं।", "ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਦੂਰੀ ਨਾ ਜੋੜੋ।"));

    return makeExplanation(locale,
      native(locale, "ज्ञात ऊँचाई से दोनों अवलोकन बिंदुओं की मीनार से दूरी निकालें और एक ही ओर होने के कारण उनका अंतर लें।", "ਪਤਾ ਉਚਾਈ ਤੋਂ ਦੋਵੇਂ ਨਿਰੀਖਣ ਬਿੰਦੂਆਂ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ ਕੱਢੋ ਅਤੇ ਇੱਕੋ ਪਾਸੇ ਹੋਣ ਕਰਕੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਲਓ।"),
      [
        native(locale, `मीनार की ऊँचाई ${height} m; निकट कोण ${nearAngle}, दूर कोण ${farAngle} है।`, `ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${height} m; ਨੇੜਲਾ ਕੋਣ ${nearAngle}, ਦੂਰਲਾ ਕੋਣ ${farAngle} ਹੈ।`),
        native(locale, `निकट दूरी=${height}/tan${nearAngle}=${near} m; दूर दूरी=${height}/tan${farAngle}=${far} m।`, `ਨੇੜਲੀ ਦੂਰੀ=${height}/tan${nearAngle}=${near} m; ਦੂਰਲੀ ਦੂਰੀ=${height}/tan${farAngle}=${far} m।`),
        native(locale, `दोनों बिंदुओं का अंतर=${far}−${near}=${separation} m।`, `ਦੋਵੇਂ ਬਿੰਦੂਆਂ ਦਾ ਅੰਤਰ=${far}−${near}=${separation} m।`),
      ],
      native(locale, "एक ही ओर दो बिंदुओं की दूरी = बड़ी tower-distance − छोटी tower-distance।", "ਇੱਕੋ ਪਾਸੇ ਦੋ ਬਿੰਦੂਆਂ ਦੀ ਦੂਰੀ = ਵੱਡੀ tower-distance − ਛੋਟੀ tower-distance।"),
      native(locale, "दूरियों को जोड़ने से विपरीत-ओर वाली स्थिति बन जाएगी, जो यहाँ नहीं है।", "ਦੂਰੀਆਂ ਜੋੜਣ ਨਾਲ ਵਿਰੋਧੀ-ਪਾਸੇ ਵਾਲੀ ਸਥਿਤੀ ਬਣ ਜਾਵੇਗੀ, ਜੋ ਇੱਥੇ ਨਹੀਂ ਹੈ।"));
  }

  throw new Error(`${question.qlId}: unsupported CP009 explanation family ${question.lockedFamily}.`);
}

export function trg002Cp009CanonicalSemanticFingerprint(question: AnyQuestion) {
  return sha256({
    packageId: question.packageId, cpId: question.cpId, qlId: question.qlId, seed: question.seed,
    lockedFamily: question.lockedFamily, solveMode: question.solveMode, difficulty: question.difficulty,
    target: question.target, exactAnswer: question.exactAnswer, answer: question.answer,
    options: question.options.map((option: AnyQuestion) => ({ value: option.value, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
    correctIndex: question.correctIndex, canonicalSpatialState: question.canonicalSpatialState,
    solutionDiagram: question.solutionDiagram, diagramEvidence: question.diagramEvidence,
  });
}

export function localizeFrozenTrg002Cp009Question(canonicalQuestion: AnyQuestion, locale: Trg002Cp009LocalizedLocale) {
  if (!TRG_002_CP009_LOCALIZATION_QL_IDS.includes(canonicalQuestion.qlId)) throw new Error(`${canonicalQuestion.qlId}: outside TRG-CP-009 localization scope.`);
  const canonicalSemanticFingerprint = trg002Cp009CanonicalSemanticFingerprint(canonicalQuestion);
  const stem = localizedStem(canonicalQuestion, locale);
  const explanation = localizedExplanation(canonicalQuestion, locale);
  const localizationFingerprint = sha256({ version: TRG_002_CP009_LOCALIZATION_VERSION, locale, qlId: canonicalQuestion.qlId, seed: canonicalQuestion.seed, canonicalSemanticFingerprint, stem, explanation });

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
      version: TRG_002_CP009_LOCALIZATION_VERSION,
      authority: TRG_002_CP009_LOCALIZATION_AUTHORITY,
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

export function generateLocalizedTrg002Cp009Question(qlId: string, seed: string, locale: Trg002Cp009LocalizedLocale) {
  if (!TRG_002_CP009_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-CP-009 localization scope.`);
  return localizeFrozenTrg002Cp009Question(generateFrozenTrg002Production96Question(qlId, seed) as AnyQuestion, locale);
}

export function buildTrg002Cp009LocalizedReviewBank(locale: Trg002Cp009LocalizedLocale, seedsPerQl = 12) {
  return TRG_002_CP009_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateLocalizedTrg002Cp009Question(
      qlId,
      `trg002-cp009-localization-v1-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
