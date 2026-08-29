import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildOppositeSideState,
  buildSameSideMovingState,
  type Trg002SpatialPoint,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import type { Trg002SpatialTopology } from "./exam-readiness-v4-scenario-engine";

export const TRG_002_V4_SCENARIO_WAVE4_IDS = [
  "TRG-002-QL-044",
  "TRG-002-QL-053",
  "TRG-002-QL-066",
  "TRG-002-QL-081",
] as const;

export type Trg002V4ScenarioWave4Id = (typeof TRG_002_V4_SCENARIO_WAVE4_IDS)[number];
type Wave4Locale = "en" | Trg002ExamRealnessLocale;
type Surface = Record<string, string>;
type Built = { question: Trg002MvpQuestion; surface: Surface };

const WAVE4_ID_SET = new Set<string>(TRG_002_V4_SCENARIO_WAVE4_IDS);
const ZERO = exactInteger(0);

function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint {
  return { id, x, y, role, label };
}

function obj(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}

function f(value: ExactTrigNumber) {
  return formatExactPlain(value);
}

function brokenTreeState(breakHeightN: number) {
  const breakHeight = exactInteger(breakHeightN);
  const fallenLength = exactInteger(2 * breakHeightN);
  const originalHeight = exactInteger(3 * breakHeightN);
  const touchDistance = exactSurd(breakHeightN, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "BROKEN_OBJECT",
    groundY: ZERO,
    points: [
      p("tree-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("break-point", ZERO, breakHeight, "BREAK_POINT", "B"),
      p("original-top", ZERO, originalHeight, "OBJECT_TOP", "O"),
      p("touch-point", touchDistance, ZERO, "TOUCH_POINT", "C"),
    ],
    verticalObjects: [obj("tree-original", "TREE", "tree-base", "original-top", originalHeight)],
    observers: [{ id: "fallen-part-angle-reference", groundPointId: "touch-point", eyePointId: "touch-point", eyeHeight: ZERO }],
    observations: [{
      id: "fallen-part-angle",
      observerId: "fallen-part-angle-reference",
      eyePointId: "touch-point",
      targetPointId: "break-point",
      classification: "ELEVATION",
      angle: degree(30),
      horizontalReference: "EYE_LEVEL",
    }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "tree-original" },
    diagramStrategy: "BROKEN_TREE",
    metadata: {
      units: "m",
      sameSide: true,
      measurements: { "standing-part": breakHeight, "fallen-part": fallenLength },
      notes: ["V4 Wave4 reconstruction: original tree height equals standing part plus fallen upper part."],
    },
  };
  return { state, breakHeight, fallenLength, originalHeight, touchDistance };
}

function unfinishedTowerState(extensionN: number) {
  const extension = exactInteger(extensionN);
  const originalHeight = exactInteger(extensionN / 2);
  const completedHeight = exactInteger((3 * extensionN) / 2);
  const horizontalDistance = exactSurd(extensionN / 2, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "TOWER",
    groundY: ZERO,
    points: [
      p("tower-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("initial-top", ZERO, originalHeight, "OBJECT_TOP", "I"),
      p("completed-top", ZERO, completedHeight, "OBJECT_TOP", "F"),
      p("observer-ground", horizontalDistance, ZERO, "OBSERVER_GROUND", "P"),
      p("observer-eye", horizontalDistance, ZERO, "OBSERVER_EYE", "P"),
    ],
    verticalObjects: [
      obj("tower-initial", "TOWER", "tower-base", "initial-top", originalHeight),
      obj("tower-completed", "TOWER", "tower-base", "completed-top", completedHeight),
    ],
    observers: [{ id: "fixed-observer", groundPointId: "observer-ground", eyePointId: "observer-eye", eyeHeight: ZERO }],
    observations: [
      { id: "before-extension", observerId: "fixed-observer", eyePointId: "observer-eye", targetPointId: "initial-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
      { id: "after-extension", observerId: "fixed-observer", eyePointId: "observer-eye", targetPointId: "completed-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "tower-initial" },
    diagramStrategy: "TOWER_EXTENSION",
    metadata: {
      units: "m",
      sameSide: true,
      measurements: { "height-added": extension },
      notes: ["V4 Wave4: the observation point is fixed; only the tower height changes between the two observations."],
    },
  };
  return { state, extension, originalHeight, completedHeight, horizontalDistance };
}

function vehicleTimeSpeedState(timeSeconds: number) {
  const speedKmh = 36;
  const speedMps = 10;
  const movementN = speedMps * timeSeconds;
  const nearN = movementN / 2;
  const farN = 3 * nearN;
  const height = exactSurd(nearN, 3);
  const state = buildSameSideMovingState({
    farAngle: degree(30),
    nearAngle: degree(60),
    movementTowardObject: exactInteger(movementN),
    units: "m",
  });
  state.metadata.measurements = {
    ...(state.metadata.measurements ?? {}),
    "speed-kmh": exactInteger(speedKmh),
    "time-seconds": exactInteger(timeSeconds),
  };
  state.metadata.notes = [...(state.metadata.notes ?? []), "V4 Wave4: speed and time are converted to horizontal movement before applying the two-position trigonometric system."];
  return {
    state,
    speedKmh,
    speedMps,
    timeSeconds,
    movement: exactInteger(movementN),
    near: exactInteger(nearN),
    far: exactInteger(farN),
    height,
  };
}

function oppositeCarsState(separationN: number) {
  const separation = exactInteger(separationN);
  const near = exactInteger(separationN / 4);
  const far = exactInteger((3 * separationN) / 4);
  const height = exactSurd(separationN / 4, 3);
  const state = buildOppositeSideState({
    leftAngle: degree(30),
    rightAngle: degree(60),
    observerSeparation: separation,
    units: "m",
  });
  state.metadata.notes = [...(state.metadata.notes ?? []), "V4 Wave4: the two cars are on opposite sides of the tower on one straight road through its base."];
  return { state, separation, near, far, height };
}

function buildWave4Canonical(qlId: Trg002V4ScenarioWave4Id, seed: string): Built {
  switch (qlId) {
    case "TRG-002-QL-044": {
      const breakHeightN = mvpPick(seed, "v4-wave4-044-break", [6, 8, 10] as const);
      const built = brokenTreeState(breakHeightN);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-008",
        lockedFamily: "BROKEN_TREE_TOUCHING_GROUND",
        solveMode: "findOriginalTreeHeightFromBreakHeightAnd30Degrees",
        seed,
        difficulty: "Medium",
        target: "LENGTH",
        stem: `A tree breaks ${breakHeightN} m above the ground. Its upper part touches the ground and makes a 30° angle with the ground. Find the original height of the tree before it broke.`,
        state: built.state,
        correct: mvpNumberAnswer(built.originalHeight),
        wrong: [
          { value: mvpNumberAnswer(built.fallenLength), misconceptionId: "RETURNED_FALLEN_PART_ONLY" },
          { value: mvpNumberAnswer(built.breakHeight), misconceptionId: "RETURNED_STANDING_PART_ONLY" },
          { value: mvpNumberAnswer(built.touchDistance), misconceptionId: "RETURNED_GROUND_TOUCH_DISTANCE" },
        ],
        explanation: mvpExplanation(
          "The original tree height is the standing part plus the broken upper part.",
          [`The standing part is ${breakHeightN} m. Let the fallen upper part be L.`, `At the ground-touch point, sin30°=${breakHeightN}/L, so 1/2=${breakHeightN}/L and L=${f(built.fallenLength)} m.`, `Original height=${breakHeightN}+${f(built.fallenLength)}=${f(built.originalHeight)} m.`],
          "Do not stop after finding the fallen part; the question asks the tree's height before it broke.",
        ),
      });
      return { question, surface: { breakHeight: String(breakHeightN), fallen: f(built.fallenLength), original: f(built.originalHeight), touch: f(built.touchDistance) } };
    }
    case "TRG-002-QL-053": {
      const extensionN = mvpPick(seed, "v4-wave4-053-extension", [16, 20, 24] as const);
      const built = unfinishedTowerState(extensionN);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-009",
        lockedFamily: "TOWER_HEIGHT_EXTENSION",
        solveMode: "findOriginalHeightFromFixedPoint30To60AfterExtension",
        seed,
        difficulty: "Hard",
        target: "LENGTH",
        stem: `From a fixed point on level ground, the top of an unfinished tower is seen at an angle of elevation of 30°. After the tower is raised by ${extensionN} m, the angle of elevation from the same point becomes 60°. Find the original height of the tower.`,
        state: built.state,
        correct: mvpNumberAnswer(built.originalHeight),
        wrong: [
          { value: mvpNumberAnswer(built.extension), misconceptionId: "RETURNED_ADDED_HEIGHT" },
          { value: mvpNumberAnswer(built.completedHeight), misconceptionId: "RETURNED_COMPLETED_HEIGHT" },
          { value: mvpNumberAnswer(built.horizontalDistance), misconceptionId: "RETURNED_HORIZONTAL_DISTANCE" },
        ],
        explanation: mvpExplanation(
          "The observation point does not move, so both angle equations use the same horizontal distance.",
          [`Let the original height be h m and the fixed horizontal distance be d m.`, `Before construction: tan30°=h/d, so d=h√3.`, `After ${extensionN} m is added: tan60°=(h+${extensionN})/d, so d=(h+${extensionN})/√3.`, `Equating the same d: h√3=(h+${extensionN})/√3 ⇒ 3h=h+${extensionN} ⇒ 2h=${extensionN} ⇒ h=${f(built.originalHeight)} m.`],
          "The added height is not the answer; it links the two observations from the same fixed point.",
        ),
      });
      return { question, surface: { extension: String(extensionN), original: f(built.originalHeight), completed: f(built.completedHeight), distance: f(built.horizontalDistance) } };
    }
    case "TRG-002-QL-066": {
      const timeSeconds = mvpPick(seed, "v4-wave4-066-time", [2, 3, 4] as const);
      const built = vehicleTimeSpeedState(timeSeconds);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-009",
        lockedFamily: "MOVING_VEHICLE_TIME_SPEED",
        solveMode: "findTowerHeightFromVehicleSpeedTimeAnd30To60Angles",
        seed,
        difficulty: "Hard",
        target: "LENGTH",
        stem: `A car travels on a straight level road toward a tower at 36 km/h. The angle of elevation of the tower top is initially 30°. After ${timeSeconds} seconds, it becomes 60°. Find the exact height of the tower.`,
        state: built.state,
        correct: mvpNumberAnswer(built.height),
        wrong: [
          { value: mvpNumberAnswer(built.movement), misconceptionId: "RETURNED_DISTANCE_TRAVELLED" },
          { value: mvpNumberAnswer(built.near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
          { value: mvpNumberAnswer(built.far), misconceptionId: "RETURNED_INITIAL_DISTANCE" },
        ],
        explanation: mvpExplanation(
          "First convert speed and time into the distance travelled; then use the two observation positions.",
          [`36 km/h=10 m/s, so in ${timeSeconds} s the car travels 10×${timeSeconds}=${f(built.movement)} m.`, `Let the nearer distance be x m. Then the initial distance is x+${f(built.movement)} m.`, `At 60°: h=x√3. At 30°: h=(x+${f(built.movement)})/√3.`, `Thus 3x=x+${f(built.movement)} ⇒ 2x=${f(built.movement)} ⇒ x=${f(built.near)}. Hence h=${f(built.near)}√3=${f(built.height)} m.`],
          "Do not substitute 36 directly as a distance; km/h must first be converted using the given time.",
        ),
      });
      return { question, surface: { time: String(timeSeconds), movement: f(built.movement), near: f(built.near), far: f(built.far), height: f(built.height) } };
    }
    case "TRG-002-QL-081": {
      const separationN = mvpPick(seed, "v4-wave4-081-separation", [40, 48, 60] as const);
      const built = oppositeCarsState(separationN);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-010",
        lockedFamily: "OPPOSITE_SIDE_VEHICLES",
        solveMode: "findTowerHeightFromTwoCarsOppositeSides30And60",
        seed,
        difficulty: "Hard",
        target: "LENGTH",
        stem: `Two cars are on opposite sides of a tower on the same straight level road, with the foot of the tower between them. The cars are ${separationN} m apart. The angles of elevation of the tower top from the cars are 30° and 60°. Find the exact height of the tower.`,
        state: built.state,
        correct: mvpNumberAnswer(built.height),
        wrong: [
          { value: mvpNumberAnswer(built.near), misconceptionId: "RETURNED_60_DEGREE_CAR_DISTANCE" },
          { value: mvpNumberAnswer(built.far), misconceptionId: "RETURNED_30_DEGREE_CAR_DISTANCE" },
          { value: mvpNumberAnswer(built.separation), misconceptionId: "RETURNED_CAR_SEPARATION" },
        ],
        explanation: mvpExplanation(
          "Because the cars are on opposite sides, their distances from the tower add to the given car-to-car separation.",
          [`Let the distance of the 60° car from the tower be x m. Then h=x√3.`, `For the 30° car, if its distance is y, then h=y/√3. Hence y=3x.`, `Since x+y=${separationN}, x+3x=${separationN} ⇒ 4x=${separationN} ⇒ x=${f(built.near)}.`, `Therefore h=${f(built.near)}√3=${f(built.height)} m.`],
          "Do not subtract the two distances; the tower lies between the cars.",
        ),
      });
      return { question, surface: { separation: String(separationN), near: f(built.near), far: f(built.far), height: f(built.height) } };
    }
  }
}

function localizedSurface(qlId: Trg002V4ScenarioWave4Id, locale: Trg002ExamRealnessLocale, s: Surface) {
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "TRG-002-QL-044":
      return hi
        ? {
            stem: `एक पेड़ जमीन से ${s.breakHeight} m ऊपर टूट जाता है। उसका ऊपरी भाग जमीन को छूता है और जमीन के साथ 30° का कोण बनाता है। टूटने से पहले पेड़ की कुल ऊँचाई ज्ञात कीजिए।`,
            rule: "पेड़ की मूल ऊँचाई = बचा हुआ सीधा भाग + टूटा हुआ ऊपरी भाग।",
            steps: [`बचा हुआ सीधा भाग ${s.breakHeight} m है। टूटे ऊपरी भाग की लंबाई L मानें।`, `स्पर्श-बिंदु पर sin30°=${s.breakHeight}/L ⇒ 1/2=${s.breakHeight}/L ⇒ L=${s.fallen} m।`, `अतः मूल ऊँचाई=${s.breakHeight}+${s.fallen}=${s.original} m।`],
            trap: "सिर्फ टूटे हुए भाग की लंबाई निकालकर न रुकें; पूछा पेड़ की टूटने से पहले की कुल ऊँचाई है।",
          }
        : {
            stem: `ਇੱਕ ਦਰੱਖਤ ਜ਼ਮੀਨ ਤੋਂ ${s.breakHeight} m ਉੱਪਰੋਂ ਟੁੱਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਦਾ ਉੱਪਰਲਾ ਭਾਗ ਜ਼ਮੀਨ ਨੂੰ ਛੂਹਦਾ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ 30° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਟੁੱਟਣ ਤੋਂ ਪਹਿਲਾਂ ਦਰੱਖਤ ਦੀ ਕੁੱਲ ਉਚਾਈ ਕੱਢੋ।`,
            rule: "ਦਰੱਖਤ ਦੀ ਮੂਲ ਉਚਾਈ = ਖੜ੍ਹਾ ਬਚਿਆ ਭਾਗ + ਟੁੱਟਿਆ ਉੱਪਰਲਾ ਭਾਗ।",
            steps: [`ਖੜ੍ਹਾ ਬਚਿਆ ਭਾਗ ${s.breakHeight} m ਹੈ। ਟੁੱਟੇ ਉੱਪਰਲੇ ਭਾਗ ਦੀ ਲੰਬਾਈ L ਮੰਨੋ।`, `ਛੂਹਣ ਵਾਲੇ ਬਿੰਦੂ 'ਤੇ sin30°=${s.breakHeight}/L ⇒ 1/2=${s.breakHeight}/L ⇒ L=${s.fallen} m।`, `ਇਸ ਲਈ ਮੂਲ ਉਚਾਈ=${s.breakHeight}+${s.fallen}=${s.original} m।`],
            trap: "ਸਿਰਫ਼ ਟੁੱਟੇ ਭਾਗ ਦੀ ਲੰਬਾਈ ਕੱਢ ਕੇ ਨਾ ਰੁਕੋ; ਪੁੱਛਿਆ ਟੁੱਟਣ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਕੁੱਲ ਉਚਾਈ ਹੈ।",
          };
    case "TRG-002-QL-053":
      return hi
        ? {
            stem: `समतल जमीन पर एक निश्चित बिंदु से एक अधूरी मीनार के शीर्ष का उन्नयन कोण 30° है। निर्माण के दौरान मीनार की ऊँचाई में ${s.extension} m की वृद्धि की जाती है। उसी बिंदु से नया उन्नयन कोण 60° हो जाता है। मीनार की प्रारंभिक ऊँचाई ज्ञात कीजिए।`,
            rule: "अवलोकन बिंदु वही है, इसलिए निर्माण से पहले और बाद में क्षैतिज दूरी समान रहती है।",
            steps: [`प्रारंभिक ऊँचाई h m और निश्चित क्षैतिज दूरी d m मानें।`, `पहले tan30°=h/d, इसलिए d=h√3।`, `${s.extension} m बढ़ाने के बाद tan60°=(h+${s.extension})/d, इसलिए d=(h+${s.extension})/√3।`, `अतः h√3=(h+${s.extension})/√3 ⇒ 3h=h+${s.extension} ⇒ 2h=${s.extension} ⇒ h=${s.original} m।`],
            trap: `${s.extension} m बढ़ाई गई ऊँचाई है; प्रश्न मीनार की प्रारंभिक ऊँचाई पूछता है।`,
          }
        : {
            stem: `ਸਮਤਲ ਜ਼ਮੀਨ ਦੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਬਿੰਦੂ ਤੋਂ ਇੱਕ ਅਧੂਰੀ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ਨਿਰਮਾਣ ਦੌਰਾਨ ਮੀਨਾਰ ਦੀ ਉਚਾਈ ${s.extension} m ਵਧਾਈ ਜਾਂਦੀ ਹੈ। ਉਸੇ ਬਿੰਦੂ ਤੋਂ ਨਵਾਂ ਉਚਾਣ ਕੋਣ 60° ਹੋ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੀ ਸ਼ੁਰੂਆਤੀ ਉਚਾਈ ਕੱਢੋ।`,
            rule: "ਨਿਰੀਖਣ ਬਿੰਦੂ ਉਹੀ ਹੈ, ਇਸ ਲਈ ਨਿਰਮਾਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਖਿਤਿਜੀ ਦੂਰੀ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ।",
            steps: [`ਸ਼ੁਰੂਆਤੀ ਉਚਾਈ h m ਅਤੇ ਨਿਸ਼ਚਿਤ ਖਿਤਿਜੀ ਦੂਰੀ d m ਮੰਨੋ।`, `ਪਹਿਲਾਂ tan30°=h/d, ਇਸ ਲਈ d=h√3।`, `${s.extension} m ਵਧਾਉਣ ਤੋਂ ਬਾਅਦ tan60°=(h+${s.extension})/d, ਇਸ ਲਈ d=(h+${s.extension})/√3।`, `ਇਸ ਲਈ h√3=(h+${s.extension})/√3 ⇒ 3h=h+${s.extension} ⇒ 2h=${s.extension} ⇒ h=${s.original} m।`],
            trap: `${s.extension} m ਵਧਾਈ ਗਈ ਉਚਾਈ ਹੈ; ਪ੍ਰਸ਼ਨ ਮੀਨਾਰ ਦੀ ਸ਼ੁਰੂਆਤੀ ਉਚਾਈ ਪੁੱਛਦਾ ਹੈ।`,
          };
    case "TRG-002-QL-066":
      return hi
        ? {
            stem: `एक कार सीधी समतल सड़क पर 36 km/h की चाल से एक मीनार की ओर बढ़ रही है। शुरू में मीनार के शीर्ष का उन्नयन कोण 30° है। ${s.time} सेकंड बाद यह कोण 60° हो जाता है। मीनार की सटीक ऊँचाई ज्ञात कीजिए।`,
            rule: "पहले चाल और समय से चली दूरी निकालें, फिर दोनों स्थितियों पर त्रिकोणमिति लगाएँ।",
            steps: [`36 km/h=10 m/s, इसलिए ${s.time} सेकंड में कार 10×${s.time}=${s.movement} m चलती है।`, `निकट दूरी x m मानें। प्रारंभिक दूरी x+${s.movement} m होगी।`, `60° पर h=x√3 और 30° पर h=(x+${s.movement})/√3।`, `इसलिए 3x=x+${s.movement} ⇒ 2x=${s.movement} ⇒ x=${s.near}; अतः h=${s.near}√3=${s.height} m।`],
            trap: "36 को सीधे दूरी न मानें; km/h को समय के साथ उपयोग करके पहले चली दूरी निकालनी है।",
          }
        : {
            stem: `ਇੱਕ ਕਾਰ ਸਿੱਧੀ ਸਮਤਲ ਸੜਕ ਉੱਤੇ 36 km/h ਦੀ ਚਾਲ ਨਾਲ ਇੱਕ ਮੀਨਾਰ ਵੱਲ ਵਧ ਰਹੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ${s.time} ਸਕਿੰਟ ਬਾਅਦ ਇਹ ਕੋਣ 60° ਹੋ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
            rule: "ਪਹਿਲਾਂ ਚਾਲ ਅਤੇ ਸਮੇਂ ਤੋਂ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਕੱਢੋ, ਫਿਰ ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਲਈ ਤ੍ਰਿਕੋਣਮਿਤੀ ਲਗਾਓ।",
            steps: [`36 km/h=10 m/s, ਇਸ ਲਈ ${s.time} ਸਕਿੰਟ ਵਿੱਚ ਕਾਰ 10×${s.time}=${s.movement} m ਤੈਅ ਕਰਦੀ ਹੈ।`, `ਨੇੜਲੀ ਦੂਰੀ x m ਮੰਨੋ। ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ x+${s.movement} m ਹੋਵੇਗੀ।`, `60° 'ਤੇ h=x√3 ਅਤੇ 30° 'ਤੇ h=(x+${s.movement})/√3।`, `ਇਸ ਲਈ 3x=x+${s.movement} ⇒ 2x=${s.movement} ⇒ x=${s.near}; ਇਸ ਲਈ h=${s.near}√3=${s.height} m।`],
            trap: "36 ਨੂੰ ਸਿੱਧਾ ਦੂਰੀ ਨਾ ਮੰਨੋ; km/h ਦੀ ਚਾਲ ਅਤੇ ਦਿੱਤੇ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਕੱਢੋ।",
          };
    case "TRG-002-QL-081":
      return hi
        ? {
            stem: `एक मीनार के दोनों ओर एक ही सीधी समतल सड़क पर दो कारें खड़ी हैं और मीनार का आधार उनके बीच है। दोनों कारों के बीच दूरी ${s.separation} m है। कारों से मीनार के शीर्ष के उन्नयन कोण 30° और 60° हैं। मीनार की सटीक ऊँचाई ज्ञात कीजिए।`,
            rule: "मीनार दोनों कारों के बीच है, इसलिए मीनार से कारों की दूरियों का योग पूरी कार-से-कार दूरी के बराबर है।",
            steps: [`60° वाली कार की मीनार से दूरी x m मानें। तब h=x√3।`, `30° वाली कार की दूरी y हो तो h=y/√3, इसलिए y=3x।`, `x+y=${s.separation} ⇒ x+3x=${s.separation} ⇒ x=${s.near}।`, `अतः h=${s.near}√3=${s.height} m।`],
            trap: "दोनों दूरियाँ घटाएँ नहीं; मीनार दोनों कारों के बीच स्थित है।",
          }
        : {
            stem: `ਇੱਕ ਮੀਨਾਰ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਇੱਕੋ ਸਿੱਧੀ ਸਮਤਲ ਸੜਕ ਉੱਤੇ ਦੋ ਕਾਰਾਂ ਖੜ੍ਹੀਆਂ ਹਨ ਅਤੇ ਮੀਨਾਰ ਦਾ ਅਧਾਰ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ। ਦੋਵੇਂ ਕਾਰਾਂ ਵਿਚਕਾਰ ਦੂਰੀ ${s.separation} m ਹੈ। ਕਾਰਾਂ ਤੋਂ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਦੇ ਉਚਾਣ ਕੋਣ 30° ਅਤੇ 60° ਹਨ। ਮੀਨਾਰ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
            rule: "ਮੀਨਾਰ ਦੋਵੇਂ ਕਾਰਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ, ਇਸ ਲਈ ਮੀਨਾਰ ਤੋਂ ਕਾਰਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਪੂਰੀ ਕਾਰ-ਤੋਂ-ਕਾਰ ਦੂਰੀ ਦੇ ਬਰਾਬਰ ਹੈ।",
            steps: [`60° ਵਾਲੀ ਕਾਰ ਦੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ x m ਮੰਨੋ। ਤਦ h=x√3।`, `30° ਵਾਲੀ ਕਾਰ ਦੀ ਦੂਰੀ y ਹੋਵੇ ਤਾਂ h=y/√3, ਇਸ ਲਈ y=3x।`, `x+y=${s.separation} ⇒ x+3x=${s.separation} ⇒ x=${s.near}।`, `ਇਸ ਲਈ h=${s.near}√3=${s.height} m।`],
            trap: "ਦੋਵੇਂ ਦੂਰੀਆਂ ਨਾ ਘਟਾਓ; ਮੀਨਾਰ ਦੋਵੇਂ ਕਾਰਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ।",
          };
  }
}

function localize(question: Trg002MvpQuestion, qlId: Trg002V4ScenarioWave4Id, locale: Wave4Locale, surface: Surface) {
  if (locale === "en") return question;
  const localized = localizedSurface(qlId, locale, surface);
  const answerTitle = locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ";
  const stepTitle = locale === "hi-IN" ? "चरण" : "ਕਦਮ";
  return {
    ...question,
    stem: localized.stem,
    explanation: {
      keyRule: localized.rule,
      steps: localized.steps.map((body, index) => ({ title: index === localized.steps.length - 1 ? answerTitle : `${stepTitle} ${index + 1}`, body })),
      shortcut: localized.rule,
      traps: [localized.trap],
    },
  };
}

export function isTrg002V4ScenarioWave4(qlId: string): qlId is Trg002V4ScenarioWave4Id {
  return WAVE4_ID_SET.has(qlId);
}

export function trg002V4ScenarioWave4ScenarioId(qlId: Trg002V4ScenarioWave4Id) {
  const ids: Record<Trg002V4ScenarioWave4Id, string> = {
    "TRG-002-QL-044": "NATURAL_BROKEN_TREE",
    "TRG-002-QL-053": "URBAN_UNFINISHED_TOWER_EXTENSION",
    "TRG-002-QL-066": "MOVE_VEHICLE_TIME_SPEED",
    "TRG-002-QL-081": "ROAD_TWO_SIDES_TOWER_CARS",
  };
  return ids[qlId];
}

export function trg002V4ScenarioWave4Topology(qlId: Trg002V4ScenarioWave4Id): Trg002SpatialTopology {
  const topologies: Record<Trg002V4ScenarioWave4Id, Trg002SpatialTopology> = {
    "TRG-002-QL-044": "SUPPORT_TRIANGLE",
    "TRG-002-QL-053": "COMPOSITE_VERTICAL",
    "TRG-002-QL-066": "SAME_SIDE_TWO_POSITIONS",
    "TRG-002-QL-081": "OPPOSITE_SIDES",
  };
  return topologies[qlId];
}

export function generateTrg002V4ScenarioWave4Question(qlId: Trg002V4ScenarioWave4Id, seed: string, locale: Wave4Locale) {
  const built = buildWave4Canonical(qlId, seed);
  return localize(built.question, qlId, locale, built.surface);
}
