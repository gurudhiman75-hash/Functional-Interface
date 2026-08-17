import { createHash } from "node:crypto";

import { degree, toDegrees } from "../foundation/angle";
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

export const TRG_002_CP008_LOCALIZATION_VERSION = "TRG002_CP008_HI_PA_LOCALIZATION_V1" as const;
export const TRG_002_CP008_LOCALIZATION_AUTHORITY = "FROZEN_ENGLISH_CANONICAL_SPATIAL_TRANSFORMATION_V1" as const;
export const TRG_002_CP008_LOCALIZATION_QL_IDS = Array.from(
  { length: 24 },
  (_, index) => `TRG-002-QL-${String(index + 25).padStart(3, "0")}`,
) as readonly string[];

export type Trg002Cp008LocalizedLocale = "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;
type State = AnyQuestion["canonicalSpatialState"];
type NativeObjectKind = "TOWER" | "BUILDING" | "POLE" | "FLAGPOLE" | "TREE" | "CHIMNEY" | "MAST" | "WALL";

const OBJECT_NAMES: Readonly<Record<Trg002Cp008LocalizedLocale, Readonly<Record<NativeObjectKind, string>>>> = {
  "hi-IN": {
    TOWER: "मीनार", BUILDING: "भवन", POLE: "खंभा", FLAGPOLE: "ध्वजदंड",
    TREE: "पेड़", CHIMNEY: "चिमनी", MAST: "मस्तूल", WALL: "दीवार",
  },
  "pa-IN": {
    TOWER: "ਮੀਨਾਰ", BUILDING: "ਇਮਾਰਤ", POLE: "ਖੰਭਾ", FLAGPOLE: "ਝੰਡੇ ਦਾ ਡੰਡਾ",
    TREE: "ਦਰੱਖਤ", CHIMNEY: "ਚਿਮਨੀ", MAST: "ਮਸਤੂਲ", WALL: "ਕੰਧ",
  },
};

function native(locale: Trg002Cp008LocalizedLocale, hi: string, pa: string) {
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

function pointById(state: State, id: string) {
  const found = state.points.find((item: AnyQuestion) => item.id === id);
  if (!found) throw new Error(`TRG-002 CP008 localization: missing canonical point ${id}.`);
  return found;
}

function pointByRole(state: State, role: string) {
  const found = state.points.find((item: AnyQuestion) => item.role === role);
  if (!found) throw new Error(`TRG-002 CP008 localization: missing canonical point role ${role}.`);
  return found;
}

function angleNumber(angle: any) {
  const value = toDegrees(angle);
  return Number(value.numerator) / Number(value.denominator);
}

function angleText(angle: any) {
  const value = toDegrees(angle);
  return `${value.denominator === 1n ? value.numerator : `${value.numerator}/${value.denominator}`}°`;
}

function snapStandardAngle(rise: ExactTrigNumber, run: ExactTrigNumber): 30 | 45 | 60 {
  const numeric = Math.atan2(exactToNumber(rise), exactToNumber(run)) * 180 / Math.PI;
  const candidates = [30, 45, 60] as const;
  const closest = candidates.reduce((best, candidate) =>
    Math.abs(candidate - numeric) < Math.abs(best - numeric) ? candidate : best,
  );
  if (Math.abs(closest - numeric) > 1e-7) {
    throw new Error(`TRG-002 CP008 localization: non-standard canonical angle ${numeric}.`);
  }
  return closest;
}

function objectName(state: State, locale: Trg002Cp008LocalizedLocale, fallback: NativeObjectKind = "POLE") {
  const kind = (state.verticalObjects[0]?.kind ?? fallback) as NativeObjectKind;
  return OBJECT_NAMES[locale][kind] ?? OBJECT_NAMES[locale][fallback];
}

function makeExplanation(
  locale: Trg002Cp008LocalizedLocale,
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

function observationForTip(state: State, tipId: string) {
  return state.observations.find((observation: AnyQuestion) => {
    if (observation.eyePointId === tipId) return true;
    const observer = state.observers.find((item: AnyQuestion) => item.id === observation.observerId);
    return observer?.groundPointId === tipId || observer?.eyePointId === tipId;
  });
}

function shadowGeometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  const base = state.points.find((item: AnyQuestion) => item.role === "OBJECT_BASE") ?? pointById(state, "object-base");
  const top = state.points.find((item: AnyQuestion) => item.role === "OBJECT_TOP") ?? pointById(state, "object-top");
  const height = absoluteExactDifference(top.y, base.y);
  const tips = state.points.filter((item: AnyQuestion) => item.role === "SHADOW_TIP");
  if (tips.length < 1) throw new Error(`${question.qlId}: shadow state has no SHADOW_TIP.`);

  const requestedTipId = state.requested?.kind === "SHADOW_LENGTH" ? state.requested.shadowTipPointId : undefined;
  const currentTip = (requestedTipId ? tips.find((item: AnyQuestion) => item.id === requestedTipId) : undefined) ?? tips[0];
  const currentObservation = observationForTip(state, currentTip.id) ?? state.observations[state.observations.length - 1];
  if (!currentObservation) throw new Error(`${question.qlId}: shadow state has no solar-angle observation.`);
  const currentAngle = angleNumber(currentObservation.angle) as 30 | 45 | 60;
  const currentShadow = absoluteExactDifference(currentTip.x, base.x);

  const oldTip = tips.find((item: AnyQuestion) => item.id !== currentTip.id);
  let oldAngle: 30 | 45 | 60 | undefined;
  let oldShadow: ExactTrigNumber | undefined;
  if (oldTip) {
    const oldObservation = observationForTip(state, oldTip.id);
    if (oldObservation) oldAngle = angleNumber(oldObservation.angle) as 30 | 45 | 60;
    oldShadow = absoluteExactDifference(oldTip.x, base.x);
  }
  if (question.lockedFamily === "CHANGED_SHADOW" && (!oldAngle || !oldShadow)) {
    if (question.qlId === "TRG-002-QL-034") oldAngle = 60;
    else if (question.qlId === "TRG-002-QL-035") oldAngle = 45;
    else oldAngle = currentAngle === 30 ? 60 : 30;
    oldShadow = assertDefined(divideExact(height, requireTrigExact("TAN", degree(oldAngle))));
  }

  return { state, height, currentShadow, currentAngle, currentObservation, oldShadow, oldAngle };
}

function ladderGeometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  const wallBase = pointById(state, "wall-base");
  const wallContact = pointById(state, "wall-contact");
  const ladderBase = pointById(state, "ladder-base");
  const height = absoluteExactDifference(wallContact.y, wallBase.y);
  const run = absoluteExactDifference(ladderBase.x, wallBase.x);
  const angle = state.observations[0]
    ? (angleNumber(state.observations[0].angle) as 30 | 45 | 60)
    : snapStandardAngle(height, run);
  const ladder = assertDefined(divideExact(height, requireTrigExact("SIN", degree(angle))));
  const mode = String(question.solveMode);
  const requested = mode.includes("FootDistance") ? "RUN" : mode.includes("LadderLengthFrom") ? "LADDER" : "HEIGHT";
  return { state, height, run, ladder, angle, requested } as const;
}

function brokenGeometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  const base = state.points.find((item: AnyQuestion) => item.role === "OBJECT_BASE") ?? pointById(state, "tree-base");
  const breakPoint = pointByRole(state, "BREAK_POINT");
  const touchPoint = pointByRole(state, "TOUCH_POINT");
  const stump = absoluteExactDifference(breakPoint.y, base.y);
  const run = absoluteExactDifference(touchPoint.x, base.x);
  const observation = state.observations[0];
  const angle = observation ? (angleNumber(observation.angle) as 30 | 45) : snapStandardAngle(stump, run);
  const fallen = assertDefined(divideExact(stump, requireTrigExact("SIN", degree(angle))));
  const requested = String(question.solveMode).includes("FallenPart") ? "PART" : "RUN";
  return { state, stump, run, fallen, angle, requested } as const;
}

function wireGeometry(question: AnyQuestion) {
  const state = question.canonicalSpatialState as State;
  const base = pointByRole(state, "OBJECT_BASE");
  const top = pointByRole(state, "OBJECT_TOP");
  const anchor = pointByRole(state, "ANCHOR");
  const height = absoluteExactDifference(top.y, base.y);
  const run = absoluteExactDifference(anchor.x, base.x);
  const observation = state.observations[0];
  const angle = observation ? (angleNumber(observation.angle) as 30 | 45 | 60) : snapStandardAngle(height, run);
  const wire = assertDefined(divideExact(height, requireTrigExact("SIN", degree(angle))));
  const mode = String(question.solveMode);
  const requested = mode.includes("GuyWireLength") ? "WIRE" : mode.includes("MastHeight") ? "HEIGHT" : "RUN";
  return { state, height, run, wire, angle, requested } as const;
}

function localizedStem(question: AnyQuestion, locale: Trg002Cp008LocalizedLocale) {
  switch (question.lockedFamily) {
    case "SHADOW_TO_HEIGHT": {
      const g = shadowGeometry(question);
      const object = objectName(g.state, locale);
      return native(locale,
        `एक ${object} की छाया ${exactText(g.currentShadow)} m लंबी है। उस समय सूर्य का उन्नयन कोण ${g.currentAngle}° है। ${object} की ऊँचाई ज्ञात कीजिए।`,
        `ਇੱਕ ${object} ਦੀ ਛਾਂ ${exactText(g.currentShadow)} m ਲੰਬੀ ਹੈ। ਉਸ ਵੇਲੇ ਸੂਰਜ ਦਾ ਉਚਾਈ ਕੋਣ ${g.currentAngle}° ਹੈ। ${object} ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
    }
    case "HEIGHT_TO_SHADOW": {
      const g = shadowGeometry(question);
      const object = objectName(g.state, locale, "TREE");
      return native(locale,
        `एक ${object} की ऊँचाई ${exactText(g.height)} m है। सूर्य का उन्नयन कोण ${g.currentAngle}° होने पर उसकी छाया की लंबाई ज्ञात कीजिए।`,
        `ਇੱਕ ${object} ਦੀ ਉਚਾਈ ${exactText(g.height)} m ਹੈ। ਸੂਰਜ ਦਾ ਉਚਾਈ ਕੋਣ ${g.currentAngle}° ਹੋਣ 'ਤੇ ਇਸ ਦੀ ਛਾਂ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`);
    }
    case "CHANGED_SHADOW": {
      const g = shadowGeometry(question);
      if (!g.oldShadow || !g.oldAngle) throw new Error(`${question.qlId}: changed-shadow prior state unresolved.`);
      const object = objectName(g.state, locale);
      return native(locale,
        `एक ${object} की छाया ${exactText(g.oldShadow)} m है जब सूर्य का उन्नयन कोण ${g.oldAngle}° है। बाद में कोण ${g.currentAngle}° हो जाता है। नई छाया की लंबाई ज्ञात कीजिए।`,
        `ਇੱਕ ${object} ਦੀ ਛਾਂ ${exactText(g.oldShadow)} m ਹੈ ਜਦੋਂ ਸੂਰਜ ਦਾ ਉਚਾਈ ਕੋਣ ${g.oldAngle}° ਹੈ। ਬਾਅਦ ਵਿੱਚ ਕੋਣ ${g.currentAngle}° ਹੋ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਛਾਂ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`);
    }
    case "LADDER_AGAINST_WALL": {
      const g = ladderGeometry(question);
      if (g.requested === "HEIGHT") return native(locale,
        `${exactText(g.ladder)} m लंबी सीढ़ी एक ऊर्ध्वाधर दीवार से लगी है और जमीन के साथ ${g.angle}° का कोण बनाती है। सीढ़ी दीवार पर कितनी ऊँचाई तक पहुँचती है?`,
        `${exactText(g.ladder)} m ਲੰਬੀ ਸੀੜ੍ਹੀ ਇੱਕ ਖੜ੍ਹੀ ਕੰਧ ਨਾਲ ਟਿਕੀ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦੀ ਹੈ। ਸੀੜ੍ਹੀ ਕੰਧ ਉੱਤੇ ਕਿੰਨੀ ਉਚਾਈ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ?`);
      if (g.requested === "RUN") return native(locale,
        `${exactText(g.ladder)} m लंबी सीढ़ी एक ऊर्ध्वाधर दीवार से लगी है और जमीन के साथ ${g.angle}° का कोण बनाती है। सीढ़ी के पाद की दीवार से क्षैतिज दूरी ज्ञात कीजिए।`,
        `${exactText(g.ladder)} m ਲੰਬੀ ਸੀੜ੍ਹੀ ਇੱਕ ਖੜ੍ਹੀ ਕੰਧ ਨਾਲ ਟਿਕੀ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦੀ ਹੈ। ਸੀੜ੍ਹੀ ਦੇ ਪੈਰ ਦੀ ਕੰਧ ਤੋਂ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
      return native(locale,
        `एक सीढ़ी दीवार पर ${exactText(g.height)} m की ऊँचाई तक पहुँचती है और जमीन के साथ ${g.angle}° का कोण बनाती है। सीढ़ी की लंबाई ज्ञात कीजिए।`,
        `ਇੱਕ ਸੀੜ੍ਹੀ ਕੰਧ ਉੱਤੇ ${exactText(g.height)} m ਦੀ ਉਚਾਈ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦੀ ਹੈ। ਸੀੜ੍ਹੀ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`);
    }
    case "BROKEN_TREE_TOUCHING_GROUND": {
      const g = brokenGeometry(question);
      if (g.requested === "PART") return native(locale,
        `एक पेड़/खंभा जमीन से ${exactText(g.stump)} m ऊपर टूट जाता है। टूटा हुआ ऊपरी भाग जमीन को छूते हुए जमीन के साथ ${g.angle}° का कोण बनाता है। टूटे हुए ऊपरी भाग की लंबाई ज्ञात कीजिए।`,
        `ਇੱਕ ਦਰੱਖਤ/ਖੰਭਾ ਜ਼ਮੀਨ ਤੋਂ ${exactText(g.stump)} m ਉੱਪਰ ਟੁੱਟ ਜਾਂਦਾ ਹੈ। ਟੁੱਟਿਆ ਉੱਪਰਲਾ ਹਿੱਸਾ ਜ਼ਮੀਨ ਨੂੰ ਛੂਹਦਿਆਂ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਟੁੱਟੇ ਉੱਪਰਲੇ ਹਿੱਸੇ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`);
      return native(locale,
        `एक पेड़/खंभा जमीन से ${exactText(g.stump)} m ऊपर टूट जाता है। उसका ऊपरी भाग जमीन के साथ ${g.angle}° का कोण बनाते हुए जमीन को छूता है। पाद से स्पर्श-बिंदु तक की क्षैतिज दूरी ज्ञात कीजिए।`,
        `ਇੱਕ ਦਰੱਖਤ/ਖੰਭਾ ਜ਼ਮੀਨ ਤੋਂ ${exactText(g.stump)} m ਉੱਪਰ ਟੁੱਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਦਾ ਉੱਪਰਲਾ ਹਿੱਸਾ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦਿਆਂ ਜ਼ਮੀਨ ਨੂੰ ਛੂਹਦਾ ਹੈ। ਪੈਰ ਤੋਂ ਛੂਹਣ ਵਾਲੇ ਬਿੰਦੂ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    }
    case "GUY_WIRE_MAST_ANCHOR": {
      const g = wireGeometry(question);
      if (g.requested === "WIRE") return native(locale,
        `एक ${exactText(g.height)} m ऊँचे मस्तूल के शीर्ष से जमीन पर लगे एंकर तक सहारा-तार खिंचा है। तार जमीन के साथ ${g.angle}° का कोण बनाता है। तार की लंबाई ज्ञात कीजिए।`,
        `ਇੱਕ ${exactText(g.height)} m ਉੱਚੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਤੋਂ ਜ਼ਮੀਨ ਉੱਤੇ ਲੱਗੇ ਐਂਕਰ ਤੱਕ ਸਹਾਰਾ-ਤਾਰ ਤਾਣਿਆ ਹੈ। ਤਾਰ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਤਾਰ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`);
      if (g.requested === "HEIGHT") return native(locale,
        `${exactText(g.wire)} m लंबा सहारा-तार मस्तूल के शीर्ष से जमीन तक लगा है और जमीन के साथ ${g.angle}° का कोण बनाता है। मस्तूल की ऊँचाई ज्ञात कीजिए।`,
        `${exactText(g.wire)} m ਲੰਬਾ ਸਹਾਰਾ-ਤਾਰ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਤੋਂ ਜ਼ਮੀਨ ਤੱਕ ਲੱਗਿਆ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਕੱਢੋ।`);
      return native(locale,
        `एक ${exactText(g.height)} m ऊँचे मस्तूल के शीर्ष से जमीन पर लगे एंकर तक सहारा-तार खिंचा है और तार जमीन के साथ ${g.angle}° का कोण बनाता है। मस्तूल के पाद से एंकर की क्षैतिज दूरी ज्ञात कीजिए।`,
        `ਇੱਕ ${exactText(g.height)} m ਉੱਚੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਤੋਂ ਜ਼ਮੀਨ ਉੱਤੇ ਲੱਗੇ ਐਂਕਰ ਤੱਕ ਸਹਾਰਾ-ਤਾਰ ਤਾਣਿਆ ਹੈ ਅਤੇ ਤਾਰ ਜ਼ਮੀਨ ਨਾਲ ${g.angle}° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਮਸਤੂਲ ਦੇ ਪੈਰ ਤੋਂ ਐਂਕਰ ਦੀ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`);
    }
    default:
      throw new Error(`${question.qlId}: unsupported CP008 localization family ${question.lockedFamily}.`);
  }
}

function localizedExplanation(question: AnyQuestion, locale: Trg002Cp008LocalizedLocale) {
  const answer = question.answer;
  switch (question.lockedFamily) {
    case "SHADOW_TO_HEIGHT": {
      const g = shadowGeometry(question);
      const s = exactText(g.currentShadow), a = `${g.currentAngle}°`;
      return makeExplanation(locale,
        native(locale, "खंभे/पेड़ की ऊँचाई और उसकी छाया समकोण त्रिभुज बनाते हैं; इसलिए tanθ=ऊँचाई/छाया।", "ਖੰਭੇ/ਦਰੱਖਤ ਦੀ ਉਚਾਈ ਅਤੇ ਇਸ ਦੀ ਛਾਂ ਸਮਕੋਣ ਤਿਕੋਣ ਬਣਾਉਂਦੇ ਹਨ; ਇਸ ਲਈ tanθ=ਉਚਾਈ/ਛਾਂ।"),
        [native(locale, `छाया=${s} m और सूर्य का उन्नयन कोण=${a}।`, `ਛਾਂ=${s} m ਅਤੇ ਸੂਰਜ ਦਾ ਉਚਾਈ ਕੋਣ=${a}।`), `h=${s}×tan${a}।`, native(locale, `अतः ऊँचाई=${answer}।`, `ਇਸ ਲਈ ਉਚਾਈ=${answer}।`)],
        native(locale, "ऊँचाई चाहिए तो छाया को tanθ से गुणा करें।", "ਉਚਾਈ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਛਾਂ ਨੂੰ tanθ ਨਾਲ ਗੁਣਾ ਕਰੋ।"),
        native(locale, "छाया को कर्ण न मानें; वह क्षैतिज भुजा है।", "ਛਾਂ ਨੂੰ ਕਰਣ ਨਾ ਮੰਨੋ; ਇਹ ਖਿਤਿਜੀ ਭੁਜਾ ਹੈ।"));
    }
    case "HEIGHT_TO_SHADOW": {
      const g = shadowGeometry(question);
      const h = exactText(g.height), a = `${g.currentAngle}°`;
      return makeExplanation(locale,
        native(locale, "tanθ=ऊँचाई/छाया, इसलिए छाया=ऊँचाई/tanθ।", "tanθ=ਉਚਾਈ/ਛਾਂ, ਇਸ ਲਈ ਛਾਂ=ਉਚਾਈ/tanθ।"),
        [native(locale, `ऊँचाई=${h} m और सूर्य का उन्नयन कोण=${a}।`, `ਉਚਾਈ=${h} m ਅਤੇ ਸੂਰਜ ਦਾ ਉਚਾਈ ਕੋਣ=${a}।`), `s=${h}/tan${a}।`, native(locale, `अतः छाया=${answer}।`, `ਇਸ ਲਈ ਛਾਂ=${answer}।`)],
        native(locale, "छाया चाहिए तो ऊँचाई को tanθ से भाग दें।", "ਛਾਂ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਉਚਾਈ ਨੂੰ tanθ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        native(locale, "ऊँचाई को ही छाया न लिखें, जब तक कोण 45° न हो।", "ਉਚਾਈ ਨੂੰ ਹੀ ਛਾਂ ਨਾ ਲਿਖੋ, ਜਦ ਤੱਕ ਕੋਣ 45° ਨਾ ਹੋਵੇ।"));
    }
    case "CHANGED_SHADOW": {
      const g = shadowGeometry(question);
      if (!g.oldShadow || !g.oldAngle) throw new Error(`${question.qlId}: changed-shadow prior state unresolved.`);
      const oldS = exactText(g.oldShadow), oldA = `${g.oldAngle}°`, newA = `${g.currentAngle}°`, h = exactText(g.height);
      return makeExplanation(locale,
        native(locale, "सूर्य का कोण बदलने पर वस्तु की ऊँचाई नहीं बदलती; दोनों अवस्थाओं में छाया×tan(कोण)=एक ही ऊँचाई होती है।", "ਸੂਰਜ ਦਾ ਕੋਣ ਬਦਲਣ ਨਾਲ ਵਸਤੂ ਦੀ ਉਚਾਈ ਨਹੀਂ ਬਦਲਦੀ; ਦੋਵੇਂ ਹਾਲਤਾਂ ਵਿੱਚ ਛਾਂ×tan(ਕੋਣ)=ਇੱਕੋ ਉਚਾਈ ਹੁੰਦੀ ਹੈ।"),
        [native(locale, `पहली अवस्था: छाया=${oldS} m, कोण=${oldA}; इसलिए h=${oldS}×tan${oldA}=${h} m।`, `ਪਹਿਲੀ ਹਾਲਤ: ਛਾਂ=${oldS} m, ਕੋਣ=${oldA}; ਇਸ ਲਈ h=${oldS}×tan${oldA}=${h} m।`), native(locale, `नई अवस्था में s=${h}/tan${newA}।`, `ਨਵੀਂ ਹਾਲਤ ਵਿੱਚ s=${h}/tan${newA}।`), native(locale, `अतः नई छाया=${answer}।`, `ਇਸ ਲਈ ਨਵੀਂ ਛਾਂ=${answer}।`)],
        native(locale, "पहले स्थिर ऊँचाई निकालें, फिर नए कोण से नई छाया निकालें।", "ਪਹਿਲਾਂ ਅਟੱਲ ਉਚਾਈ ਕੱਢੋ, ਫਿਰ ਨਵੇਂ ਕੋਣ ਨਾਲ ਨਵੀਂ ਛਾਂ ਕੱਢੋ।"),
        native(locale, "छाया में बदलाव को सीधे कोणों के अंतर के बराबर न मानें।", "ਛਾਂ ਦੇ ਬਦਲਾਅ ਨੂੰ ਸਿੱਧੇ ਕੋਣਾਂ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਨਾ ਮੰਨੋ।"));
    }
    case "LADDER_AGAINST_WALL": {
      const g = ladderGeometry(question);
      const L = exactText(g.ladder), h = exactText(g.height), a = `${g.angle}°`;
      if (g.requested === "HEIGHT") return makeExplanation(locale,
        native(locale, "सीढ़ी कर्ण है और दीवार पर पहुँची ऊँचाई जमीन के कोण के सामने वाली भुजा है; इसलिए sinθ=ऊँचाई/सीढ़ी।", "ਸੀੜ੍ਹੀ ਕਰਣ ਹੈ ਅਤੇ ਕੰਧ ਉੱਤੇ ਪਹੁੰਚੀ ਉਚਾਈ ਜ਼ਮੀਨ ਵਾਲੇ ਕੋਣ ਦੇ ਸਾਹਮਣੇ ਭੁਜਾ ਹੈ; ਇਸ ਲਈ sinθ=ਉਚਾਈ/ਸੀੜ੍ਹੀ।"),
        [native(locale, `सीढ़ी=${L} m और कोण=${a}।`, `ਸੀੜ੍ਹੀ=${L} m ਅਤੇ ਕੋਣ=${a}।`), `h=${L}×sin${a}।`, native(locale, `अतः दीवार पर ऊँचाई=${answer}।`, `ਇਸ ਲਈ ਕੰਧ ਉੱਤੇ ਉਚਾਈ=${answer}।`)],
        native(locale, "दीवार की ऊँचाई चाहिए तो सीढ़ी×sinθ करें।", "ਕੰਧ ਦੀ ਉਚਾਈ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਸੀੜ੍ਹੀ×sinθ ਕਰੋ।"),
        native(locale, "cosθ लगाने पर क्षैतिज दूरी मिलेगी, ऊँचाई नहीं।", "cosθ ਲਗਾਉਣ ਨਾਲ ਖਿਤਿਜੀ ਦੂਰੀ ਮਿਲੇਗੀ, ਉਚਾਈ ਨਹੀਂ।"));
      if (g.requested === "RUN") return makeExplanation(locale,
        native(locale, "सीढ़ी कर्ण है और दीवार से पाद की दूरी कोण की समीपवर्ती भुजा है; इसलिए cosθ=दूरी/सीढ़ी।", "ਸੀੜ੍ਹੀ ਕਰਣ ਹੈ ਅਤੇ ਕੰਧ ਤੋਂ ਪੈਰ ਦੀ ਦੂਰੀ ਕੋਣ ਦੀ ਨਾਲ ਵਾਲੀ ਭੁਜਾ ਹੈ; ਇਸ ਲਈ cosθ=ਦੂਰੀ/ਸੀੜ੍ਹੀ।"),
        [native(locale, `सीढ़ी=${L} m और कोण=${a}।`, `ਸੀੜ੍ਹੀ=${L} m ਅਤੇ ਕੋਣ=${a}।`), `d=${L}×cos${a}।`, native(locale, `अतः क्षैतिज दूरी=${answer}।`, `ਇਸ ਲਈ ਖਿਤਿਜੀ ਦੂਰੀ=${answer}।`)],
        native(locale, "पाद की दूरी चाहिए तो सीढ़ी×cosθ करें।", "ਪੈਰ ਦੀ ਦੂਰੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਸੀੜ੍ਹੀ×cosθ ਕਰੋ।"),
        native(locale, "sinθ दीवार पर ऊँचाई देगा, पाद की दूरी नहीं।", "sinθ ਕੰਧ ਉੱਤੇ ਉਚਾਈ ਦੇਵੇਗਾ, ਪੈਰ ਦੀ ਦੂਰੀ ਨਹੀਂ।"));
      return makeExplanation(locale,
        native(locale, "दीवार की ऊँचाई सामने वाली भुजा है और सीढ़ी कर्ण है; इसलिए sinθ=ऊँचाई/सीढ़ी।", "ਕੰਧ ਦੀ ਉਚਾਈ ਸਾਹਮਣੇ ਭੁਜਾ ਹੈ ਅਤੇ ਸੀੜ੍ਹੀ ਕਰਣ ਹੈ; ਇਸ ਲਈ sinθ=ਉਚਾਈ/ਸੀੜ੍ਹੀ।"),
        [native(locale, `दीवार पर ऊँचाई=${h} m और कोण=${a}।`, `ਕੰਧ ਉੱਤੇ ਉਚਾਈ=${h} m ਅਤੇ ਕੋਣ=${a}।`), `L=${h}/sin${a}।`, native(locale, `अतः सीढ़ी की लंबाई=${answer}।`, `ਇਸ ਲਈ ਸੀੜ੍ਹੀ ਦੀ ਲੰਬਾਈ=${answer}।`)],
        native(locale, "सीढ़ी चाहिए तो दीवार की ऊँचाई को sinθ से भाग दें।", "ਸੀੜ੍ਹੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਕੰਧ ਦੀ ਉਚਾਈ ਨੂੰ sinθ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        native(locale, "दीवार की ऊँचाई को ही सीढ़ी की लंबाई न मानें।", "ਕੰਧ ਦੀ ਉਚਾਈ ਨੂੰ ਹੀ ਸੀੜ੍ਹੀ ਦੀ ਲੰਬਾਈ ਨਾ ਮੰਨੋ।"));
    }
    case "BROKEN_TREE_TOUCHING_GROUND": {
      const g = brokenGeometry(question);
      const h = exactText(g.stump), a = `${g.angle}°`;
      if (g.requested === "PART") return makeExplanation(locale,
        native(locale, "टूटा हुआ ऊपरी भाग कर्ण है और बचा हुआ सीधा भाग दिए कोण के सामने है; इसलिए sinθ=बचा भाग/टूटा भाग।", "ਟੁੱਟਿਆ ਉੱਪਰਲਾ ਹਿੱਸਾ ਕਰਣ ਹੈ ਅਤੇ ਬਚਿਆ ਖੜ੍ਹਾ ਹਿੱਸਾ ਦਿੱਤੇ ਕੋਣ ਦੇ ਸਾਹਮਣੇ ਹੈ; ਇਸ ਲਈ sinθ=ਬਚਿਆ ਹਿੱਸਾ/ਟੁੱਟਿਆ ਹਿੱਸਾ।"),
        [native(locale, `बचा हुआ सीधा भाग=${h} m और कोण=${a}।`, `ਬਚਿਆ ਖੜ੍ਹਾ ਹਿੱਸਾ=${h} m ਅਤੇ ਕੋਣ=${a}।`), `L=${h}/sin${a}।`, native(locale, `अतः टूटे ऊपरी भाग की लंबाई=${answer}।`, `ਇਸ ਲਈ ਟੁੱਟੇ ਉੱਪਰਲੇ ਹਿੱਸੇ ਦੀ ਲੰਬਾਈ=${answer}।`)],
        native(locale, "टूटे भाग की लंबाई चाहिए तो बचे भाग को sinθ से भाग दें।", "ਟੁੱਟੇ ਹਿੱਸੇ ਦੀ ਲੰਬਾਈ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਬਚੇ ਹਿੱਸੇ ਨੂੰ sinθ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        native(locale, "बचे हुए सीधे भाग को ही टूटे भाग की लंबाई न मानें।", "ਬਚੇ ਖੜ੍ਹੇ ਹਿੱਸੇ ਨੂੰ ਹੀ ਟੁੱਟੇ ਹਿੱਸੇ ਦੀ ਲੰਬਾਈ ਨਾ ਮੰਨੋ।"));
      return makeExplanation(locale,
        native(locale, "बचा हुआ सीधा भाग सामने वाली भुजा है और स्पर्श-बिंदु तक दूरी समीपवर्ती भुजा है; इसलिए tanθ=ऊँचाई/दूरी।", "ਬਚਿਆ ਖੜ੍ਹਾ ਹਿੱਸਾ ਸਾਹਮਣੇ ਭੁਜਾ ਹੈ ਅਤੇ ਛੂਹਣ ਵਾਲੇ ਬਿੰਦੂ ਤੱਕ ਦੂਰੀ ਨਾਲ ਵਾਲੀ ਭੁਜਾ ਹੈ; ਇਸ ਲਈ tanθ=ਉਚਾਈ/ਦੂਰੀ।"),
        [native(locale, `बचा हुआ सीधा भाग=${h} m और कोण=${a}।`, `ਬਚਿਆ ਖੜ੍ਹਾ ਹਿੱਸਾ=${h} m ਅਤੇ ਕੋਣ=${a}।`), `d=${h}/tan${a}।`, native(locale, `अतः पाद से स्पर्श-बिंदु की दूरी=${answer}।`, `ਇਸ ਲਈ ਪੈਰ ਤੋਂ ਛੂਹਣ ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ=${answer}।`)],
        native(locale, "क्षैतिज दूरी चाहिए तो बचे भाग को tanθ से भाग दें।", "ਖਿਤਿਜੀ ਦੂਰੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਬਚੇ ਹਿੱਸੇ ਨੂੰ tanθ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        native(locale, "तिरछे टूटे भाग को क्षैतिज दूरी न समझें।", "ਤਿਰਛੇ ਟੁੱਟੇ ਹਿੱਸੇ ਨੂੰ ਖਿਤਿਜੀ ਦੂਰੀ ਨਾ ਸਮਝੋ।"));
    }
    case "GUY_WIRE_MAST_ANCHOR": {
      const g = wireGeometry(question);
      const h = exactText(g.height), L = exactText(g.wire), a = `${g.angle}°`;
      if (g.requested === "WIRE") return makeExplanation(locale,
        native(locale, "सहारा-तार कर्ण है और मस्तूल की ऊँचाई जमीन के कोण के सामने है; इसलिए sinθ=ऊँचाई/तार।", "ਸਹਾਰਾ-ਤਾਰ ਕਰਣ ਹੈ ਅਤੇ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਜ਼ਮੀਨ ਵਾਲੇ ਕੋਣ ਦੇ ਸਾਹਮਣੇ ਹੈ; ਇਸ ਲਈ sinθ=ਉਚਾਈ/ਤਾਰ।"),
        [native(locale, `मस्तूल की ऊँचाई=${h} m और कोण=${a}।`, `ਮਸਤੂਲ ਦੀ ਉਚਾਈ=${h} m ਅਤੇ ਕੋਣ=${a}।`), `L=${h}/sin${a}।`, native(locale, `अतः तार की लंबाई=${answer}।`, `ਇਸ ਲਈ ਤਾਰ ਦੀ ਲੰਬਾਈ=${answer}।`)],
        native(locale, "तार चाहिए तो ऊँचाई को sinθ से भाग दें।", "ਤਾਰ ਚਾਹੀਦਾ ਹੋਵੇ ਤਾਂ ਉਚਾਈ ਨੂੰ sinθ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        native(locale, "एंकर की क्षैतिज दूरी को तार की लंबाई न मानें।", "ਐਂਕਰ ਦੀ ਖਿਤਿਜੀ ਦੂਰੀ ਨੂੰ ਤਾਰ ਦੀ ਲੰਬਾਈ ਨਾ ਮੰਨੋ।"));
      if (g.requested === "HEIGHT") return makeExplanation(locale,
        native(locale, "तार कर्ण है और मस्तूल की ऊँचाई सामने वाली भुजा है; इसलिए ऊँचाई=तार×sinθ।", "ਤਾਰ ਕਰਣ ਹੈ ਅਤੇ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਸਾਹਮਣੇ ਭੁਜਾ ਹੈ; ਇਸ ਲਈ ਉਚਾਈ=ਤਾਰ×sinθ।"),
        [native(locale, `तार की लंबाई=${L} m और कोण=${a}।`, `ਤਾਰ ਦੀ ਲੰਬਾਈ=${L} m ਅਤੇ ਕੋਣ=${a}।`), `h=${L}×sin${a}।`, native(locale, `अतः मस्तूल की ऊँचाई=${answer}।`, `ਇਸ ਲਈ ਮਸਤੂਲ ਦੀ ਉਚਾਈ=${answer}।`)],
        native(locale, "ऊँचाई चाहिए तो तार×sinθ करें।", "ਉਚਾਈ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਤਾਰ×sinθ ਕਰੋ।"),
        native(locale, "cosθ लगाने पर एंकर की दूरी मिलेगी।", "cosθ ਲਗਾਉਣ ਨਾਲ ਐਂਕਰ ਦੀ ਦੂਰੀ ਮਿਲੇਗੀ।"));
      return makeExplanation(locale,
        native(locale, "मस्तूल की ऊँचाई सामने वाली भुजा और एंकर की दूरी समीपवर्ती भुजा है; इसलिए tanθ=ऊँचाई/दूरी।", "ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਸਾਹਮਣੇ ਭੁਜਾ ਅਤੇ ਐਂਕਰ ਦੀ ਦੂਰੀ ਨਾਲ ਵਾਲੀ ਭੁਜਾ ਹੈ; ਇਸ ਲਈ tanθ=ਉਚਾਈ/ਦੂਰੀ।"),
        [native(locale, `मस्तूल की ऊँचाई=${h} m और कोण=${a}।`, `ਮਸਤੂਲ ਦੀ ਉਚਾਈ=${h} m ਅਤੇ ਕੋਣ=${a}।`), `d=${h}/tan${a}।`, native(locale, `अतः एंकर की दूरी=${answer}।`, `ਇਸ ਲਈ ਐਂਕਰ ਦੀ ਦੂਰੀ=${answer}।`)],
        native(locale, "एंकर दूरी चाहिए तो ऊँचाई को tanθ से भाग दें।", "ਐਂਕਰ ਦੂਰੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਉਚਾਈ ਨੂੰ tanθ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        native(locale, "तार की तिरछी लंबाई को क्षैतिज दूरी न मानें।", "ਤਾਰ ਦੀ ਤਿਰਛੀ ਲੰਬਾਈ ਨੂੰ ਖਿਤਿਜੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।"));
    }
    default:
      throw new Error(`${question.qlId}: unsupported CP008 localization family ${question.lockedFamily}.`);
  }
}

export function trg002Cp008CanonicalSemanticFingerprint(question: AnyQuestion) {
  return sha256({
    packageId: question.packageId, cpId: question.cpId, qlId: question.qlId, seed: question.seed,
    lockedFamily: question.lockedFamily, solveMode: question.solveMode, difficulty: question.difficulty,
    target: question.target, exactAnswer: question.exactAnswer, answer: question.answer,
    options: question.options.map((option: AnyQuestion) => ({ value: option.value, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
    correctIndex: question.correctIndex, canonicalSpatialState: question.canonicalSpatialState,
    solutionDiagram: question.solutionDiagram, diagramEvidence: question.diagramEvidence,
  });
}

export function localizeFrozenTrg002Cp008Question(canonicalQuestion: AnyQuestion, locale: Trg002Cp008LocalizedLocale) {
  if (!TRG_002_CP008_LOCALIZATION_QL_IDS.includes(canonicalQuestion.qlId)) throw new Error(`${canonicalQuestion.qlId}: outside TRG-CP-008 localization scope.`);
  if (canonicalQuestion.cpId !== "TRG-CP-008") throw new Error(`${canonicalQuestion.qlId}: CP008 localizer received ${canonicalQuestion.cpId}.`);
  const canonicalSemanticFingerprint = trg002Cp008CanonicalSemanticFingerprint(canonicalQuestion);
  const stem = localizedStem(canonicalQuestion, locale);
  const explanation = localizedExplanation(canonicalQuestion, locale);
  const localizationFingerprint = sha256({ version: TRG_002_CP008_LOCALIZATION_VERSION, locale, qlId: canonicalQuestion.qlId, seed: canonicalQuestion.seed, canonicalSemanticFingerprint, stem, explanation });

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
      version: TRG_002_CP008_LOCALIZATION_VERSION,
      authority: TRG_002_CP008_LOCALIZATION_AUTHORITY,
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

export function generateLocalizedTrg002Cp008Question(qlId: string, seed: string, locale: Trg002Cp008LocalizedLocale) {
  if (!TRG_002_CP008_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-CP-008 localization scope.`);
  return localizeFrozenTrg002Cp008Question(generateFrozenTrg002Production96Question(qlId, seed) as AnyQuestion, locale);
}

export function buildTrg002Cp008LocalizedReviewBank(locale: Trg002Cp008LocalizedLocale, seedsPerQl = 12) {
  return TRG_002_CP008_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateLocalizedTrg002Cp008Question(
      qlId,
      `trg002-cp008-localization-v1-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
