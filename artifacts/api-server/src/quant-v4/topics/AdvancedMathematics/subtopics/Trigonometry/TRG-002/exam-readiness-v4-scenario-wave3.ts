import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildLadderState, type Trg002SpatialPoint, type Trg002SpatialState, type Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import type { Trg002SpatialTopology } from "./exam-readiness-v4-scenario-engine";

export const TRG_002_V4_SCENARIO_WAVE3_IDS = [
  "TRG-002-QL-037",
  "TRG-002-QL-046",
  "TRG-002-QL-050",
  "TRG-002-QL-060",
] as const;

export type Trg002V4ScenarioWave3Id = (typeof TRG_002_V4_SCENARIO_WAVE3_IDS)[number];
type Wave3Locale = "en" | Trg002ExamRealnessLocale;
type Surface = Record<string, string>;
type Built = { question: Trg002MvpQuestion; surface: Surface };

const WAVE3_ID_SET = new Set<string>(TRG_002_V4_SCENARIO_WAVE3_IDS);
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

function wrongLengths(value: ExactTrigNumber) {
  return [
    { value: mvpNumberAnswer(exactInteger(Math.max(1, Math.round(Number(f(value).replace(/[^0-9.-]/g, "")) || 1)))), misconceptionId: "USED_VISIBLE_NUMBER_ONLY" },
    { value: mvpNumberAnswer(exactInteger(2)), misconceptionId: "USED_ANGLE_RATIO_AS_LENGTH" },
    { value: mvpNumberAnswer(exactInteger(1)), misconceptionId: "USED_UNIT_RATIO_AS_LENGTH" },
  ];
}

function guyWireState(wireLengthN: number): { state: Trg002SpatialState; height: ExactTrigNumber; anchorDistance: ExactTrigNumber } {
  const anchorDistance = exactInteger(wireLengthN / 2);
  const height = exactSurd(wireLengthN / 2, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "GUY_WIRE",
    groundY: ZERO,
    points: [
      p("mast-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("mast-top", ZERO, height, "OBJECT_TOP", "T"),
      p("anchor", anchorDistance, ZERO, "ANCHOR", "A"),
    ],
    verticalObjects: [obj("mast-1", "MAST", "mast-base", "mast-top", height)],
    observers: [{ id: "anchor-observer", groundPointId: "anchor", eyePointId: "anchor", eyeHeight: ZERO }],
    observations: [{ id: "wire-angle", observerId: "anchor-observer", eyePointId: "anchor", targetPointId: "mast-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "mast-base", toPointId: "anchor" },
    diagramStrategy: "GUY_WIRE",
    metadata: { units: "m", sameSide: true, measurements: { "wire-length": exactInteger(wireLengthN) }, notes: ["V4 Wave3: wire length is the hypotenuse; the requested quantity is the horizontal ground-anchor distance."] },
  };
  return { state, height, anchorDistance };
}

function approachingCarState(k: number): { state: Trg002SpatialState; height: ExactTrigNumber; near: ExactTrigNumber; far: ExactTrigNumber; movement: ExactTrigNumber } {
  const near = exactInteger(k);
  const far = exactInteger(3 * k);
  const movement = exactInteger(2 * k);
  const height = exactSurd(k, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "TOWER",
    groundY: ZERO,
    points: [
      p("tower-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("tower-top", ZERO, height, "OBJECT_TOP", "T"),
      p("near-ground", near, ZERO, "OBSERVER_GROUND", "N"),
      p("near-eye", near, ZERO, "OBSERVER_EYE", "N"),
      p("far-ground", far, ZERO, "OBSERVER_GROUND", "F"),
      p("far-eye", far, ZERO, "OBSERVER_EYE", "F"),
    ],
    verticalObjects: [obj("tower-1", "TOWER", "tower-base", "tower-top", height)],
    observers: [
      { id: "car-near", groundPointId: "near-ground", eyePointId: "near-eye", eyeHeight: ZERO },
      { id: "car-far", groundPointId: "far-ground", eyePointId: "far-eye", eyeHeight: ZERO },
    ],
    observations: [
      { id: "obs-near", observerId: "car-near", eyePointId: "near-eye", targetPointId: "tower-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
      { id: "obs-far", observerId: "car-far", eyePointId: "far-eye", targetPointId: "tower-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [{ id: "car-movement", observerId: "car-far", fromGroundPointId: "far-ground", toGroundPointId: "near-ground", referenceObjectId: "tower-1", direction: "CLOSER", distance: movement }],
    requested: { kind: "OBJECT_HEIGHT", objectId: "tower-1" },
    diagramStrategy: "OBSERVER_MOVES_CLOSER",
    metadata: { units: "m", sameSide: true, observerOrder: ["tower-base", "near-ground", "far-ground"], notes: ["V4 Wave3: moving-car scenario; both positions are on the same straight road through the tower base."] },
  };
  return { state, height, near, far, movement };
}

function oppositeBoatsState(k: number): { state: Trg002SpatialState; height: ExactTrigNumber; near: ExactTrigNumber; far: ExactTrigNumber; separation: ExactTrigNumber } {
  const near = exactInteger(k);
  const far = exactInteger(3 * k);
  const separation = exactInteger(4 * k);
  const height = exactSurd(k, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "TOWER",
    groundY: ZERO,
    points: [
      p("light-base", ZERO, ZERO, "OBJECT_BASE", "L"),
      p("light-top", ZERO, height, "OBSERVER_EYE", "T"),
      p("boat-near", exactInteger(-k), ZERO, "AUXILIARY", "A"),
      p("boat-far", far, ZERO, "AUXILIARY", "B"),
    ],
    verticalObjects: [obj("lighthouse-1", "TOWER", "light-base", "light-top", height)],
    observers: [{ id: "lighthouse-observer", groundPointId: "light-base", eyePointId: "light-top", eyeHeight: height }],
    observations: [
      { id: "obs-boat-near", observerId: "lighthouse-observer", eyePointId: "light-top", targetPointId: "boat-near", classification: "DEPRESSION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
      { id: "obs-boat-far", observerId: "lighthouse-observer", eyePointId: "light-top", targetPointId: "boat-far", classification: "DEPRESSION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "lighthouse-1" },
    diagramStrategy: "OPPOSITE_SIDE_OBSERVATIONS",
    metadata: { units: "m", oppositeSide: true, observerOrder: ["boat-near", "light-base", "boat-far"], measurements: { "boat-separation": separation }, notes: ["V4 Wave3: two boats are on opposite sides of the lighthouse along one straight line through its base."] },
  };
  return { state, height, near, far, separation };
}

function buildWave3Canonical(qlId: Trg002V4ScenarioWave3Id, seed: string): Built {
  switch (qlId) {
    case "TRG-002-QL-037": {
      const lengthN = mvpPick(seed, "v4-wave3-037-length", [10, 12, 14] as const);
      const length = exactInteger(lengthN);
      const height = exactSurd(lengthN / 2, 3);
      const state = buildLadderState({ ladderLength: length, angleAtGround: degree(60), units: "m" });
      state.requested = { kind: "OBJECT_HEIGHT", objectId: "wall-1" };
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-008",
        lockedFamily: "LADDER_AGAINST_WALL",
        solveMode: "findWallReachWhenLadderAngleIsGivenWithWall",
        seed,
        difficulty: "Medium",
        target: "LENGTH",
        stem: `A ${lengthN} m ladder leans against a vertical wall. The angle between the ladder and the wall is 30°. Find the exact height reached by the ladder on the wall.`,
        state,
        correct: mvpNumberAnswer(height),
        wrong: [
          { value: mvpNumberAnswer(exactInteger(lengthN / 2)), misconceptionId: "USED_30_DEGREES_AS_GROUND_ANGLE" },
          { value: mvpNumberAnswer(length), misconceptionId: "RETURNED_LADDER_LENGTH" },
          { value: mvpNumberAnswer(exactSurd(lengthN / 2, 2)), misconceptionId: "USED_45_DEGREE_RATIO" },
        ],
        explanation: mvpExplanation(
          "The stated 30° is with the vertical wall, so the ladder makes 60° with the horizontal ground.",
          [`Ground angle = 90°−30° = 60°.`, `If the wall height reached is h, then sin60°=h/${lengthN}.`, `So h=${lengthN}×√3/2=${f(height)} m.`],
          "Do not use 30° as the ground angle; it is measured from the wall.",
        ),
      });
      return { question, surface: { length: String(lengthN), height: f(height) } };
    }
    case "TRG-002-QL-046": {
      const wireN = mvpPick(seed, "v4-wave3-046-wire", [20, 24, 28] as const);
      const built = guyWireState(wireN);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-008",
        lockedFamily: "GUY_WIRE_MAST_ANCHOR",
        solveMode: "findGroundAnchorDistanceFromWireLengthAndGroundAngle",
        seed,
        difficulty: "Medium",
        target: "LENGTH",
        stem: `A ${wireN} m guy wire is fixed from the top of a vertical mast to an anchor on level ground. The wire makes a 60° angle with the ground. Find the horizontal distance from the foot of the mast to the anchor.`,
        state: built.state,
        correct: mvpNumberAnswer(built.anchorDistance),
        wrong: [
          { value: mvpNumberAnswer(exactInteger(wireN)), misconceptionId: "RETURNED_WIRE_LENGTH" },
          { value: mvpNumberAnswer(built.height), misconceptionId: "RETURNED_MAST_HEIGHT" },
          { value: mvpNumberAnswer(exactInteger(wireN / 4)), misconceptionId: "HALVED_COSINE_FACTOR" },
        ],
        explanation: mvpExplanation(
          "The wire is the hypotenuse and the anchor distance is adjacent to the 60° ground angle.",
          [`Let the anchor distance be d. Then cos60°=d/${wireN}.`, `Since cos60°=1/2, d=${wireN}/2=${f(built.anchorDistance)} m.`],
          "The required distance is along the ground; do not return the sloping wire length.",
        ),
      });
      return { question, surface: { wire: String(wireN), anchor: f(built.anchorDistance), height: f(built.height) } };
    }
    case "TRG-002-QL-050": {
      const k = mvpPick(seed, "v4-wave3-050-k", [8, 10, 12] as const);
      const built = approachingCarState(k);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-009",
        lockedFamily: "OBSERVER_MOVES_CLOSER",
        solveMode: "findTowerHeightFromCarMovementAnd30To60Angles",
        seed,
        difficulty: "Hard",
        target: "LENGTH",
        stem: `A car moving on a straight level road toward a tower sees its top at an angle of elevation of 30°. After moving ${f(built.movement)} m closer, the angle becomes 60°. Find the exact height of the tower.`,
        state: built.state,
        correct: mvpNumberAnswer(built.height),
        wrong: [
          { value: mvpNumberAnswer(built.near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
          { value: mvpNumberAnswer(built.movement), misconceptionId: "RETURNED_DISTANCE_TRAVELLED" },
          { value: mvpNumberAnswer(built.far), misconceptionId: "RETURNED_FAR_DISTANCE" },
        ],
        explanation: mvpExplanation(
          "Use one unknown for the nearer distance. The farther distance is that distance plus the distance travelled.",
          [`Let the nearer distance from the tower be x m. Then the earlier distance is x+${f(built.movement)}.`, `At 60°: h=x√3. At 30°: h=(x+${f(built.movement)})/√3.`, `Equating: x√3=(x+${f(built.movement)})/√3 ⇒ 3x=x+${f(built.movement)} ⇒ 2x=${f(built.movement)} ⇒ x=${f(built.near)}.`, `Therefore h=${f(built.near)}√3=${f(built.height)} m.`],
          "The difficult step is relating the two positions; do not treat the distance travelled as the distance from the tower.",
        ),
      });
      return { question, surface: { movement: f(built.movement), near: f(built.near), far: f(built.far), height: f(built.height) } };
    }
    case "TRG-002-QL-060": {
      const k = mvpPick(seed, "v4-wave3-060-k", [8, 10, 12] as const);
      const built = oppositeBoatsState(k);
      const question = buildTrg002MvpQuestion({
        qlId,
        cpId: "TRG-CP-009",
        lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS",
        solveMode: "findLighthouseHeightFromOppositeBoats30And60AndSeparation",
        seed,
        difficulty: "Hard",
        target: "LENGTH",
        stem: `From the top of a lighthouse, the angles of depression of two boats on opposite sides of it are 60° and 30°. The boats and the foot of the lighthouse lie on one straight line, and the boats are ${f(built.separation)} m apart. Find the exact height of the lighthouse.`,
        state: built.state,
        correct: mvpNumberAnswer(built.height),
        wrong: [
          { value: mvpNumberAnswer(built.near), misconceptionId: "RETURNED_NEAR_BOAT_DISTANCE" },
          { value: mvpNumberAnswer(built.far), misconceptionId: "RETURNED_FAR_BOAT_DISTANCE" },
          { value: mvpNumberAnswer(built.separation), misconceptionId: "RETURNED_BOAT_SEPARATION" },
        ],
        explanation: mvpExplanation(
          "Because the boats are on opposite sides, their horizontal distances from the lighthouse add to the given boat-to-boat separation.",
          [`Let the distance to the 60° boat be x m. Then h=x√3.`, `For the 30° boat, h=y/√3, so y=3x.`, `Since the boats are on opposite sides, x+y=${f(built.separation)} ⇒ 4x=${f(built.separation)} ⇒ x=${f(built.near)}.`, `Hence h=${f(built.near)}√3=${f(built.height)} m.`],
          "Do not subtract the two boat distances; they lie on opposite sides of the lighthouse.",
        ),
      });
      return { question, surface: { separation: f(built.separation), near: f(built.near), far: f(built.far), height: f(built.height) } };
    }
  }
}

function localizedSurface(qlId: Trg002V4ScenarioWave3Id, locale: Trg002ExamRealnessLocale, s: Surface) {
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "TRG-002-QL-037":
      return hi
        ? {
            stem: `${s.length} m लंबी सीढ़ी एक ऊर्ध्वाधर दीवार से लगी है। सीढ़ी और दीवार के बीच का कोण 30° है। सीढ़ी दीवार पर कितनी सटीक ऊँचाई तक पहुँचती है?`,
            rule: "दिया गया 30° कोण दीवार के साथ है, इसलिए जमीन के साथ सीढ़ी का कोण 60° होगा।",
            steps: [`जमीन के साथ कोण = 90°−30° = 60°।`, `दीवार पर पहुँची ऊँचाई h मानें। sin60°=h/${s.length}।`, `अतः h=${s.length}×√3/2=${s.height} m।`],
            trap: "30° को जमीन के साथ बना कोण मानने पर गलत भुजा चुनी जाएगी।",
          }
        : {
            stem: `${s.length} m ਲੰਬੀ ਸੀੜ੍ਹੀ ਇੱਕ ਖੜ੍ਹੀ ਕੰਧ ਨਾਲ ਟਿਕੀ ਹੈ। ਸੀੜ੍ਹੀ ਅਤੇ ਕੰਧ ਵਿਚਕਾਰ ਕੋਣ 30° ਹੈ। ਸੀੜ੍ਹੀ ਕੰਧ ਉੱਤੇ ਕਿੰਨੀ ਸਟੀਕ ਉਚਾਈ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ?`,
            rule: "ਦਿੱਤਾ 30° ਕੋਣ ਕੰਧ ਨਾਲ ਹੈ, ਇਸ ਲਈ ਜ਼ਮੀਨ ਨਾਲ ਸੀੜ੍ਹੀ ਦਾ ਕੋਣ 60° ਹੋਵੇਗਾ।",
            steps: [`ਜ਼ਮੀਨ ਨਾਲ ਕੋਣ = 90°−30° = 60°।`, `ਕੰਧ ਉੱਤੇ ਪਹੁੰਚੀ ਉਚਾਈ h ਮੰਨੋ। sin60°=h/${s.length}।`, `ਇਸ ਲਈ h=${s.length}×√3/2=${s.height} m।`],
            trap: "30° ਨੂੰ ਜ਼ਮੀਨ ਨਾਲ ਬਣਿਆ ਕੋਣ ਮੰਨਣ ਨਾਲ ਗਲਤ ਭੁਜਾ ਚੁਣੀ ਜਾਵੇਗੀ।",
          };
    case "TRG-002-QL-046":
      return hi
        ? {
            stem: `${s.wire} m लंबा एक सहारा-तार ऊर्ध्वाधर मस्तूल के शीर्ष से समतल जमीन पर एक लंगर-बिंदु तक लगा है। तार जमीन के साथ 60° का कोण बनाता है। मस्तूल के आधार से लंगर-बिंदु तक क्षैतिज दूरी ज्ञात कीजिए।`,
            rule: "सहारा-तार कर्ण है और लंगर की दूरी 60° के पास वाली क्षैतिज भुजा है।",
            steps: [`लंगर की दूरी d मानें। cos60°=d/${s.wire}।`, `1/2=d/${s.wire}, इसलिए d=${s.anchor} m।`],
            trap: "तार की लंबाई को जमीन की दूरी न मानें।",
          }
        : {
            stem: `${s.wire} m ਲੰਬਾ ਇੱਕ ਸਹਾਰਾ-ਤਾਰ ਖੜ੍ਹੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਤੋਂ ਸਮਤਲ ਜ਼ਮੀਨ ਦੇ ਇੱਕ ਲੰਗਰ-ਬਿੰਦੂ ਤੱਕ ਲੱਗਿਆ ਹੈ। ਤਾਰ ਜ਼ਮੀਨ ਨਾਲ 60° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਮਸਤੂਲ ਦੇ ਅਧਾਰ ਤੋਂ ਲੰਗਰ-ਬਿੰਦੂ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`,
            rule: "ਸਹਾਰਾ-ਤਾਰ ਕਰਣ ਹੈ ਅਤੇ ਲੰਗਰ ਦੀ ਦੂਰੀ 60° ਨਾਲ ਲੱਗਦੀ ਖਿਤਿਜੀ ਭੁਜਾ ਹੈ।",
            steps: [`ਲੰਗਰ ਦੀ ਦੂਰੀ d ਮੰਨੋ। cos60°=d/${s.wire}।`, `1/2=d/${s.wire}, ਇਸ ਲਈ d=${s.anchor} m।`],
            trap: "ਤਾਰ ਦੀ ਲੰਬਾਈ ਨੂੰ ਜ਼ਮੀਨੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।",
          };
    case "TRG-002-QL-050":
      return hi
        ? {
            stem: `एक कार सीधी समतल सड़क पर एक मीनार की ओर बढ़ रही है। पहले मीनार के शीर्ष का उन्नयन कोण 30° है। ${s.movement} m आगे बढ़ने पर यह कोण 60° हो जाता है। मीनार की सटीक ऊँचाई ज्ञात कीजिए।`,
            rule: "निकट वाली दूरी x मानें; पहली दूरी x और चली दूरी के योग के बराबर होगी।",
            steps: [`मीनार से निकट दूरी x m मानें। पहली दूरी x+${s.movement} m होगी।`, `60° पर h=x√3 और 30° पर h=(x+${s.movement})/√3।`, `दोनों बराबर करने पर 3x=x+${s.movement} ⇒ 2x=${s.movement} ⇒ x=${s.near}।`, `अतः h=${s.near}√3=${s.height} m।`],
            trap: "${s.movement} m चली हुई दूरी है; यह मीनार से किसी एक स्थिति की दूरी नहीं है।".replace("${s.movement}", s.movement),
          }
        : {
            stem: `ਇੱਕ ਕਾਰ ਸਿੱਧੀ ਸਮਤਲ ਸੜਕ ਉੱਤੇ ਇੱਕ ਮੀਨਾਰ ਵੱਲ ਵਧ ਰਹੀ ਹੈ। ਪਹਿਲਾਂ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ${s.movement} m ਅੱਗੇ ਜਾਣ 'ਤੇ ਇਹ ਕੋਣ 60° ਹੋ ਜਾਂਦਾ ਹੈ। ਮੀਨਾਰ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
            rule: "ਨੇੜਲੀ ਦੂਰੀ x ਮੰਨੋ; ਪਹਿਲੀ ਦੂਰੀ x ਅਤੇ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਦੇ ਜੋੜ ਦੇ ਬਰਾਬਰ ਹੋਵੇਗੀ।",
            steps: [`ਮੀਨਾਰ ਤੋਂ ਨੇੜਲੀ ਦੂਰੀ x m ਮੰਨੋ। ਪਹਿਲੀ ਦੂਰੀ x+${s.movement} m ਹੋਵੇਗੀ।`, `60° 'ਤੇ h=x√3 ਅਤੇ 30° 'ਤੇ h=(x+${s.movement})/√3।`, `ਦੋਵੇਂ ਬਰਾਬਰ ਕਰਨ 'ਤੇ 3x=x+${s.movement} ⇒ 2x=${s.movement} ⇒ x=${s.near}।`, `ਇਸ ਲਈ h=${s.near}√3=${s.height} m।`],
            trap: `${s.movement} m ਕਾਰ ਦੁਆਰਾ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਹੈ; ਇਹ ਮੀਨਾਰ ਤੋਂ ਕਿਸੇ ਇੱਕ ਸਥਿਤੀ ਦੀ ਦੂਰੀ ਨਹੀਂ ਹੈ।`,
          };
    case "TRG-002-QL-060":
      return hi
        ? {
            stem: `एक प्रकाश स्तंभ के शीर्ष से उसके विपरीत ओर स्थित दो नावों के अवनमन कोण 60° और 30° हैं। दोनों नावें और प्रकाश स्तंभ का आधार एक ही सीधी रेखा पर हैं तथा नावों के बीच की दूरी ${s.separation} m है। प्रकाश स्तंभ की सटीक ऊँचाई ज्ञात कीजिए।`,
            rule: "नावें विपरीत ओर हैं, इसलिए प्रकाश स्तंभ से उनकी क्षैतिज दूरियों का योग नावों के बीच की दूरी के बराबर है।",
            steps: [`60° वाली नाव तक दूरी x m मानें। तब h=x√3।`, `30° वाली नाव तक दूरी y हो तो h=y/√3, इसलिए y=3x।`, `विपरीत ओर होने से x+y=${s.separation} ⇒ 4x=${s.separation} ⇒ x=${s.near}।`, `अतः h=${s.near}√3=${s.height} m।`],
            trap: "दोनों नावों की दूरियाँ घटाएँ नहीं; प्रकाश स्तंभ उनके बीच स्थित है।",
          }
        : {
            stem: `ਇੱਕ ਲਾਈਟਹਾਊਸ ਦੀ ਚੋਟੀ ਤੋਂ ਇਸ ਦੇ ਉਲਟ ਪਾਸਿਆਂ 'ਤੇ ਮੌਜੂਦ ਦੋ ਕਿਸ਼ਤੀਆਂ ਦੇ ਨਿਵਾਣ ਕੋਣ 60° ਅਤੇ 30° ਹਨ। ਦੋਵੇਂ ਕਿਸ਼ਤੀਆਂ ਅਤੇ ਲਾਈਟਹਾਊਸ ਦਾ ਅਧਾਰ ਇੱਕੋ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਹਨ ਅਤੇ ਕਿਸ਼ਤੀਆਂ ਵਿਚਕਾਰ ਦੂਰੀ ${s.separation} m ਹੈ। ਲਾਈਟਹਾਊਸ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
            rule: "ਕਿਸ਼ਤੀਆਂ ਉਲਟ ਪਾਸਿਆਂ 'ਤੇ ਹਨ, ਇਸ ਲਈ ਲਾਈਟਹਾਊਸ ਤੋਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਖਿਤਿਜੀ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਕਿਸ਼ਤੀਆਂ ਵਿਚਕਾਰ ਦੀ ਦੂਰੀ ਦੇ ਬਰਾਬਰ ਹੈ।",
            steps: [`60° ਵਾਲੀ ਕਿਸ਼ਤੀ ਤੱਕ ਦੂਰੀ x m ਮੰਨੋ। ਤਦ h=x√3।`, `30° ਵਾਲੀ ਕਿਸ਼ਤੀ ਤੱਕ ਦੂਰੀ y ਹੋਵੇ ਤਾਂ h=y/√3, ਇਸ ਲਈ y=3x।`, `ਉਲਟ ਪਾਸਿਆਂ 'ਤੇ ਹੋਣ ਕਰਕੇ x+y=${s.separation} ⇒ 4x=${s.separation} ⇒ x=${s.near}।`, `ਇਸ ਲਈ h=${s.near}√3=${s.height} m।`],
            trap: "ਦੋਵੇਂ ਕਿਸ਼ਤੀਆਂ ਦੀਆਂ ਦੂਰੀਆਂ ਨਾ ਘਟਾਓ; ਲਾਈਟਹਾਊਸ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ।",
          };
  }
}

function localize(question: Trg002MvpQuestion, qlId: Trg002V4ScenarioWave3Id, locale: Wave3Locale, surface: Surface) {
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

export function isTrg002V4ScenarioWave3(qlId: string): qlId is Trg002V4ScenarioWave3Id {
  return WAVE3_ID_SET.has(qlId);
}

export function trg002V4ScenarioWave3ScenarioId(qlId: Trg002V4ScenarioWave3Id) {
  const ids: Record<Trg002V4ScenarioWave3Id, string> = {
    "TRG-002-QL-037": "SUPPORT_LADDER_WALL",
    "TRG-002-QL-046": "SUPPORT_GUY_WIRE_POLE",
    "TRG-002-QL-050": "ROAD_CAR_APPROACHES_TOWER",
    "TRG-002-QL-060": "WATER_TWO_BOATS_OPPOSITE",
  };
  return ids[qlId];
}

export function trg002V4ScenarioWave3Topology(qlId: Trg002V4ScenarioWave3Id): Trg002SpatialTopology {
  const topologies: Record<Trg002V4ScenarioWave3Id, Trg002SpatialTopology> = {
    "TRG-002-QL-037": "SUPPORT_TRIANGLE",
    "TRG-002-QL-046": "SUPPORT_TRIANGLE",
    "TRG-002-QL-050": "SAME_SIDE_TWO_POSITIONS",
    "TRG-002-QL-060": "OPPOSITE_SIDES",
  };
  return topologies[qlId];
}

export function generateTrg002V4ScenarioWave3Question(qlId: Trg002V4ScenarioWave3Id, seed: string, locale: Wave3Locale) {
  const built = buildWave3Canonical(qlId, seed);
  return localize(built.question, qlId, locale, built.surface);
}
