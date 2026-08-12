import type { AngleMeasure, ExactTrigNumber } from "../foundation/types";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactKey,
  exactRational,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import {
  buildLadderState,
  buildObserverHeightElevationState,
  buildOppositeSideState,
  buildSameSideMovingState,
  buildSingleElevationState,
  buildTrg002DiagramSpec,
  findCleanStandardAngleFromRiseRun,
  horizontalFromVerticalDelta,
  shadowLengthFromHeight,
  shadowObjectHeight,
  singleDepressionTargetHeight,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  type Trg002SpatialPoint,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";

export const TRG_002_RUNTIME_PROOF_IDS = [
  "TRG-002-QL-001", "TRG-002-QL-007", "TRG-002-QL-012", "TRG-002-QL-015", "TRG-002-QL-023",
  "TRG-002-QL-025", "TRG-002-QL-030", "TRG-002-QL-033", "TRG-002-QL-036", "TRG-002-QL-045",
  "TRG-002-QL-049", "TRG-002-QL-056", "TRG-002-QL-061", "TRG-002-QL-065", "TRG-002-QL-068",
  "TRG-002-QL-073", "TRG-002-QL-078", "TRG-002-QL-083", "TRG-002-QL-088", "TRG-002-QL-092",
] as const;

export type Trg002ProofQlId = (typeof TRG_002_RUNTIME_PROOF_IDS)[number];
export type Trg002ProofCpId = "TRG-CP-007" | "TRG-CP-008" | "TRG-CP-009" | "TRG-CP-010";
type Difficulty = "Easy" | "Medium" | "Hard";
type NumberAnswer = { kind: "NUMBER"; value: ExactTrigNumber; unit: "m" };
type AngleAnswer = { kind: "ANGLE"; value: AngleMeasure; preferredDisplay: "DEGREE" };
type Answer = NumberAnswer | AngleAnswer;

type RegistryEntry = {
  qlId: Trg002ProofQlId;
  cpId: Trg002ProofCpId;
  lockedFamily: string;
  solveMode: string;
  difficulty: Difficulty;
  target: "LENGTH" | "ANGLE";
  diagramStrategy: string;
};

export const TRG_002_RUNTIME_PROOF_REGISTRY: RegistryEntry[] = [
  { qlId:"TRG-002-QL-001", cpId:"TRG-CP-007", lockedFamily:"HEIGHT_FROM_ELEVATION", solveMode:"findHeightFromElevation", difficulty:"Easy", target:"LENGTH", diagramStrategy:"SINGLE_ELEVATION" },
  { qlId:"TRG-002-QL-007", cpId:"TRG-CP-007", lockedFamily:"DISTANCE_FROM_ELEVATION", solveMode:"findDistanceFromElevation", difficulty:"Easy", target:"LENGTH", diagramStrategy:"SINGLE_ELEVATION" },
  { qlId:"TRG-002-QL-012", cpId:"TRG-CP-007", lockedFamily:"ANGLE_FROM_HEIGHT_DISTANCE", solveMode:"findAngleFromHeightDistance", difficulty:"Medium", target:"ANGLE", diagramStrategy:"SINGLE_ELEVATION" },
  { qlId:"TRG-002-QL-015", cpId:"TRG-CP-007", lockedFamily:"HEIGHT_FROM_DEPRESSION", solveMode:"findTargetHeightFromDepression", difficulty:"Medium", target:"LENGTH", diagramStrategy:"SINGLE_DEPRESSION" },
  { qlId:"TRG-002-QL-023", cpId:"TRG-CP-007", lockedFamily:"REVERSE_SINGLE_OBSERVATION", solveMode:"findHeightFromSightLineAndElevation", difficulty:"Medium", target:"LENGTH", diagramStrategy:"SINGLE_ELEVATION" },

  { qlId:"TRG-002-QL-025", cpId:"TRG-CP-008", lockedFamily:"SHADOW_TO_HEIGHT", solveMode:"findHeightFromShadow", difficulty:"Easy", target:"LENGTH", diagramStrategy:"SHADOW" },
  { qlId:"TRG-002-QL-030", cpId:"TRG-CP-008", lockedFamily:"HEIGHT_TO_SHADOW", solveMode:"findShadowFromHeight", difficulty:"Easy", target:"LENGTH", diagramStrategy:"SHADOW" },
  { qlId:"TRG-002-QL-033", cpId:"TRG-CP-008", lockedFamily:"CHANGED_SHADOW", solveMode:"findChangedShadowLength", difficulty:"Medium", target:"LENGTH", diagramStrategy:"SHADOW" },
  { qlId:"TRG-002-QL-036", cpId:"TRG-CP-008", lockedFamily:"LADDER_AGAINST_WALL", solveMode:"findWallHeightFromLadder", difficulty:"Medium", target:"LENGTH", diagramStrategy:"LADDER" },
  { qlId:"TRG-002-QL-045", cpId:"TRG-CP-008", lockedFamily:"GUY_WIRE_ANCHOR", solveMode:"findGuyWireLength", difficulty:"Medium", target:"LENGTH", diagramStrategy:"GUY_WIRE" },

  { qlId:"TRG-002-QL-049", cpId:"TRG-CP-009", lockedFamily:"SAME_SIDE_TWO_OBSERVATIONS", solveMode:"findHeightFromTwoSameSidePoints", difficulty:"Hard", target:"LENGTH", diagramStrategy:"TWO_OBSERVATIONS_SAME_SIDE" },
  { qlId:"TRG-002-QL-056", cpId:"TRG-CP-009", lockedFamily:"OBSERVER_MOVES_CLOSER", solveMode:"findNearDistanceAfterMovingCloser", difficulty:"Hard", target:"LENGTH", diagramStrategy:"OBSERVER_MOVES_CLOSER" },
  { qlId:"TRG-002-QL-061", cpId:"TRG-CP-009", lockedFamily:"OBSERVER_MOVES_FARTHER", solveMode:"findHeightAfterMovingFarther", difficulty:"Hard", target:"LENGTH", diagramStrategy:"OBSERVER_MOVES_FARTHER" },
  { qlId:"TRG-002-QL-065", cpId:"TRG-CP-009", lockedFamily:"FIND_ORIGINAL_DISTANCE", solveMode:"findOriginalDistanceFromTwoObservations", difficulty:"Hard", target:"LENGTH", diagramStrategy:"OBSERVER_MOVES_CLOSER" },
  { qlId:"TRG-002-QL-068", cpId:"TRG-CP-009", lockedFamily:"FIND_MOVEMENT_SEPARATION", solveMode:"findSeparationFromHeightAndAngles", difficulty:"Hard", target:"LENGTH", diagramStrategy:"TWO_OBSERVATIONS_SAME_SIDE" },

  { qlId:"TRG-002-QL-073", cpId:"TRG-CP-010", lockedFamily:"OBSERVER_HEIGHT_CORRECTION", solveMode:"findTotalHeightWithEyeLevel", difficulty:"Medium", target:"LENGTH", diagramStrategy:"OBSERVER_HEIGHT" },
  { qlId:"TRG-002-QL-078", cpId:"TRG-CP-010", lockedFamily:"OPPOSITE_SIDE_OBSERVATIONS", solveMode:"findHeightFromOppositeSides", difficulty:"Hard", target:"LENGTH", diagramStrategy:"OPPOSITE_SIDE_OBSERVATIONS" },
  { qlId:"TRG-002-QL-083", cpId:"TRG-CP-010", lockedFamily:"BUILDING_TO_BUILDING", solveMode:"findSecondBuildingHeight", difficulty:"Hard", target:"LENGTH", diagramStrategy:"BUILDING_TO_BUILDING" },
  { qlId:"TRG-002-QL-088", cpId:"TRG-CP-010", lockedFamily:"ELEVATION_AND_DEPRESSION", solveMode:"findObjectHeightFromElevationAndDepression", difficulty:"Hard", target:"LENGTH", diagramStrategy:"ELEVATION_AND_DEPRESSION" },
  { qlId:"TRG-002-QL-092", cpId:"TRG-CP-010", lockedFamily:"RIVER_WIDTH", solveMode:"findRiverWidthFromDepression", difficulty:"Hard", target:"LENGTH", diagramStrategy:"RIVER_WIDTH" },
];

const BY_ID = new Map(TRG_002_RUNTIME_PROOF_REGISTRY.map((entry) => [entry.qlId, entry]));
const ZERO = exactInteger(0);

function hash(text: string) { let value = 2166136261; for (const character of text) { value ^= character.charCodeAt(0); value = Math.imul(value, 16777619); } return value >>> 0; }
function pick<T>(seed: string, salt: string, values: readonly T[]): T { return values[hash(`${seed}|${salt}`) % values.length]; }
function shuffle<T>(seed: string, values: T[]) { let state = hash(seed) || 1; for (let i = values.length - 1; i > 0; i -= 1) { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; const j = state % (i + 1); [values[i], values[j]] = [values[j], values[i]]; } return values; }
const N = (value: ExactTrigNumber): NumberAnswer => ({ kind:"NUMBER", value, unit:"m" });
const A = (value: AngleMeasure): AngleAnswer => ({ kind:"ANGLE", value, preferredDisplay:"DEGREE" });
const Q = (n: number, d: number = 1) => exactRational(n, d);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
const tan = (angle: number) => requireTrigExact("TAN", degree(angle));
const sin = (angle: number) => requireTrigExact("SIN", degree(angle));
const cos = (angle: number) => requireTrigExact("COS", degree(angle));

function answerKey(answer: Answer) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const d = toDegrees(answer.value); return `A:${d.numerator}/${d.denominator}`;
}
function show(answer: Answer) {
  if (answer.kind === "NUMBER") return `${formatExactPlain(answer.value)} m`;
  const d = toDegrees(answer.value); return `${d.denominator === 1n ? d.numerator : `${d.numerator}/${d.denominator}`}°`;
}
function numeric(answer: NumberAnswer) { return exactToNumber(answer.value); }
function point(state: Trg002SpatialState, id: string) { const found = state.points.find((item) => item.id === id); if (!found) throw new Error(`Missing point ${id}`); return found; }
function object(state: Trg002SpatialState, id: string) { const found = state.verticalObjects.find((item) => item.id === id); if (!found) throw new Error(`Missing object ${id}`); return found; }
function horizontal(state: Trg002SpatialState, first: string, second: string) { return Math.abs(exactToNumber(point(state, first).x) - exactToNumber(point(state, second).x)); }
function heightOf(state: Trg002SpatialState, objectId: string) { return exactToNumber(object(state, objectId).height); }
function distanceBetween(state: Trg002SpatialState, first: string, second: string) { const a=point(state,first), b=point(state,second); const dx=exactToNumber(a.x)-exactToNumber(b.x), dy=exactToNumber(a.y)-exactToNumber(b.y); return Math.hypot(dx,dy); }

function spatialPoint(id:string,x:ExactTrigNumber,y:ExactTrigNumber,role:Trg002SpatialPoint["role"],label?:string):Trg002SpatialPoint { return {id,x,y,role,...(label?{label}:{})}; }
function verticalObject(id:string,kind:Trg002VerticalObject["kind"],basePointId:string,topPointId:string,height:ExactTrigNumber):Trg002VerticalObject { return {id,kind,basePointId,topPointId,height}; }

function withGroundObservation(state: Trg002SpatialState, input: { observerId:string; groundPointId:string; targetPointId:string; angle:AngleMeasure; classification?:"ELEVATION"|"DEPRESSION" }) {
  const classification = input.classification ?? "ELEVATION";
  return {
    ...state,
    observers: [...state.observers, { id:input.observerId, groundPointId:input.groundPointId, eyePointId:input.groundPointId, eyeHeight:ZERO }],
    observations: [...state.observations, { id:`obs-${input.observerId}`, observerId:input.observerId, eyePointId:input.groundPointId, targetPointId:input.targetPointId, classification, angle:input.angle, horizontalReference:"EYE_LEVEL" as const }],
  };
}

function buildShadowState(shadowLength: ExactTrigNumber, angle: number, objectKind: "POLE"|"TREE" = "POLE") {
  const height = shadowObjectHeight(shadowLength, degree(angle));
  const base = spatialPoint("object-base",ZERO,ZERO,"OBJECT_BASE","B");
  const top = spatialPoint("object-top",ZERO,height,"OBJECT_TOP","T");
  const tip = spatialPoint("shadow-tip",shadowLength,ZERO,"SHADOW_TIP","S");
  const state: Trg002SpatialState = {
    packageId:"TRG-002", scenario:"SHADOW", groundY:ZERO,
    points:[base,top,tip],
    verticalObjects:[verticalObject("object-1",objectKind,"object-base","object-top",height)],
    observers:[], observations:[], movements:[],
    requested:{kind:"OBJECT_HEIGHT",objectId:"object-1"}, diagramStrategy:"SHADOW",
    metadata:{units:"m",sameSide:true},
  };
  return withGroundObservation(state,{observerId:"sun-reference",groundPointId:"shadow-tip",targetPointId:"object-top",angle:degree(angle)});
}

function buildChangedShadowState(scale: number, oldAngle: 30|60, newAngle: 30|60) {
  const height = exactInteger(scale * 3); // temporary authority value replaced below
  const oldShadow = oldAngle === 30 ? exactInteger(scale * 3) : exactInteger(scale);
  const canonicalHeight = shadowObjectHeight(oldShadow, degree(oldAngle));
  const newShadow = shadowLengthFromHeight(canonicalHeight, degree(newAngle));
  const base = spatialPoint("object-base",ZERO,ZERO,"OBJECT_BASE","B");
  const top = spatialPoint("object-top",ZERO,canonicalHeight,"OBJECT_TOP","T");
  const newTip = spatialPoint("shadow-tip-new",newShadow,ZERO,"SHADOW_TIP","N");
  const oldTip = spatialPoint("shadow-tip-old",oldShadow,ZERO,"SHADOW_TIP","O");
  let state: Trg002SpatialState = {
    packageId:"TRG-002",scenario:"SHADOW",groundY:ZERO,
    points:[base,top,newTip,oldTip],
    verticalObjects:[verticalObject("object-1","POLE","object-base","object-top",canonicalHeight)],
    observers:[],observations:[],movements:[],
    requested:{kind:"SHADOW_LENGTH",objectId:"object-1",shadowTipPointId:"shadow-tip-new"},diagramStrategy:"SHADOW",
    metadata:{units:"m",notes:[`oldAngle=${oldAngle}`,`newAngle=${newAngle}`,`authorityHeight=${exactKey(height)}`]},
  };
  state = withGroundObservation(state,{observerId:"old-sun",groundPointId:"shadow-tip-old",targetPointId:"object-top",angle:degree(oldAngle)});
  state = withGroundObservation(state,{observerId:"new-sun",groundPointId:"shadow-tip-new",targetPointId:"object-top",angle:degree(newAngle)});
  return { state, oldShadow, newShadow, height:canonicalHeight };
}

function buildGuyWireState(height: ExactTrigNumber, angle: 30|60) {
  const horizontalRun = horizontalFromVerticalDelta(height, degree(angle));
  const wireLength = div(height, sin(angle));
  let state: Trg002SpatialState = {
    packageId:"TRG-002",scenario:"GUY_WIRE",groundY:ZERO,
    points:[
      spatialPoint("mast-base",ZERO,ZERO,"OBJECT_BASE","B"),
      spatialPoint("mast-top",ZERO,height,"OBJECT_TOP","T"),
      spatialPoint("anchor",horizontalRun,ZERO,"ANCHOR","A"),
    ],
    verticalObjects:[verticalObject("mast-1","MAST","mast-base","mast-top",height)],
    observers:[],observations:[],movements:[],
    requested:{kind:"SIGHT_LINE_LENGTH",fromPointId:"anchor",toPointId:"mast-top"},diagramStrategy:"GUY_WIRE",
    metadata:{units:"m"},
  };
  state = withGroundObservation(state,{observerId:"anchor-reference",groundPointId:"anchor",targetPointId:"mast-top",angle:degree(angle)});
  return { state, horizontalRun, wireLength };
}

function buildDepressionHeightState(observerHeight: ExactTrigNumber, horizontalDistance: ExactTrigNumber, angle: 30|60) {
  const targetHeight = singleDepressionTargetHeight(observerHeight,horizontalDistance,degree(angle));
  const state: Trg002SpatialState = {
    packageId:"TRG-002",scenario:"TWO_BUILDINGS",groundY:ZERO,
    points:[
      spatialPoint("observer-base",ZERO,ZERO,"OBJECT_BASE","A"),
      spatialPoint("observer-top",ZERO,observerHeight,"OBSERVER_EYE","E"),
      spatialPoint("target-base",horizontalDistance,ZERO,"OBJECT_BASE","B"),
      spatialPoint("target-top",horizontalDistance,targetHeight,"OBJECT_TOP","T"),
    ],
    verticalObjects:[
      verticalObject("observer-building","BUILDING","observer-base","observer-top",observerHeight),
      verticalObject("target-object","POLE","target-base","target-top",targetHeight),
    ],
    observers:[{id:"observer-1",groundPointId:"observer-base",eyePointId:"observer-top",eyeHeight:observerHeight}],
    observations:[{id:"obs-1",observerId:"observer-1",eyePointId:"observer-top",targetPointId:"target-top",classification:"DEPRESSION",angle:degree(angle),horizontalReference:"EYE_LEVEL"}],
    movements:[],requested:{kind:"OBJECT_HEIGHT",objectId:"target-object"},diagramStrategy:"SINGLE_DEPRESSION",
    metadata:{units:"m",sameSide:true},
  };
  return {state,targetHeight};
}

function buildBuildingToBuildingState(scale: number) {
  const firstHeight = exactInteger(scale);
  const horizontalDistance = exactInteger(scale);
  const secondHeight = exactInteger(scale*2);
  const state: Trg002SpatialState = {
    packageId:"TRG-002",scenario:"TWO_BUILDINGS",groundY:ZERO,
    points:[
      spatialPoint("first-base",ZERO,ZERO,"OBJECT_BASE","A"),
      spatialPoint("first-top",ZERO,firstHeight,"OBSERVER_EYE","E"),
      spatialPoint("second-base",horizontalDistance,ZERO,"OBJECT_BASE","B"),
      spatialPoint("second-top",horizontalDistance,secondHeight,"OBJECT_TOP","T"),
    ],
    verticalObjects:[
      verticalObject("building-1","BUILDING","first-base","first-top",firstHeight),
      verticalObject("building-2","BUILDING","second-base","second-top",secondHeight),
    ],
    observers:[{id:"observer-1",groundPointId:"first-base",eyePointId:"first-top",eyeHeight:firstHeight}],
    observations:[{id:"obs-1",observerId:"observer-1",eyePointId:"first-top",targetPointId:"second-top",classification:"ELEVATION",angle:degree(45),horizontalReference:"EYE_LEVEL"}],
    movements:[],requested:{kind:"OBJECT_HEIGHT",objectId:"building-2"},diagramStrategy:"BUILDING_TO_BUILDING",
    metadata:{units:"m"},
  };
  return {state,firstHeight,horizontalDistance,secondHeight};
}

function buildElevationDepressionState(scale: number) {
  const observerHeight=exactInteger(scale), horizontalDistance=exactInteger(scale), targetHeight=exactInteger(scale*2);
  const state: Trg002SpatialState = {
    packageId:"TRG-002",scenario:"TWO_BUILDINGS",groundY:ZERO,
    points:[
      spatialPoint("observer-base",ZERO,ZERO,"OBJECT_BASE","A"),
      spatialPoint("observer-top",ZERO,observerHeight,"OBSERVER_EYE","E"),
      spatialPoint("target-base",horizontalDistance,ZERO,"OBJECT_BASE","B"),
      spatialPoint("target-top",horizontalDistance,targetHeight,"OBJECT_TOP","T"),
    ],
    verticalObjects:[
      verticalObject("observer-building","BUILDING","observer-base","observer-top",observerHeight),
      verticalObject("target-tower","TOWER","target-base","target-top",targetHeight),
    ],
    observers:[{id:"observer-1",groundPointId:"observer-base",eyePointId:"observer-top",eyeHeight:observerHeight}],
    observations:[
      {id:"obs-elevation",observerId:"observer-1",eyePointId:"observer-top",targetPointId:"target-top",classification:"ELEVATION",angle:degree(45),horizontalReference:"EYE_LEVEL"},
      {id:"obs-depression",observerId:"observer-1",eyePointId:"observer-top",targetPointId:"target-base",classification:"DEPRESSION",angle:degree(45),horizontalReference:"EYE_LEVEL"},
    ],
    movements:[],requested:{kind:"OBJECT_HEIGHT",objectId:"target-tower"},diagramStrategy:"ELEVATION_AND_DEPRESSION",
    metadata:{units:"m"},
  };
  return {state,observerHeight,horizontalDistance,targetHeight};
}

function buildRiverWidthState(scale: number) {
  const towerHeight=exactInteger(scale), width=exactInteger(scale);
  const state: Trg002SpatialState = {
    packageId:"TRG-002",scenario:"RIVER_BANK",groundY:ZERO,
    points:[
      spatialPoint("tower-base",ZERO,ZERO,"OBJECT_BASE","B"),
      spatialPoint("tower-top",ZERO,towerHeight,"OBSERVER_EYE","E"),
      spatialPoint("opposite-bank",width,ZERO,"GROUND","P"),
    ],
    verticalObjects:[verticalObject("bank-tower","TOWER","tower-base","tower-top",towerHeight)],
    observers:[{id:"observer-1",groundPointId:"tower-base",eyePointId:"tower-top",eyeHeight:towerHeight}],
    observations:[{id:"obs-1",observerId:"observer-1",eyePointId:"tower-top",targetPointId:"opposite-bank",classification:"DEPRESSION",angle:degree(45),horizontalReference:"EYE_LEVEL"}],
    movements:[],requested:{kind:"HORIZONTAL_DISTANCE",fromPointId:"tower-base",toPointId:"opposite-bank"},diagramStrategy:"RIVER_WIDTH",
    metadata:{units:"m"},
  };
  return {state,towerHeight,width};
}

type Spec = {
  state: Trg002SpatialState;
  stem: string;
  correct: Answer;
  wrong: Array<{value:Answer;misconceptionId:string}>;
  explanation: { keyRule:string; steps:Array<{title:string;body:string}>; shortcut:string; traps:string[] };
  answerCheck: { valid:boolean; method:string; reconstructed:number; expected:number; delta:number };
};

function explanation(rule:string, steps:string[], trap:string, shortcut=rule) {
  return {keyRule:rule,steps:steps.map((body,index)=>({title:index===steps.length-1?"Answer":`Step ${index+1}`,body})),shortcut,traps:[trap]};
}
function checkNumber(answer:NumberAnswer,reconstructed:number,method:string) { const expected=numeric(answer), delta=Math.abs(expected-reconstructed); return {valid:Number.isFinite(reconstructed)&&delta<=1e-9,method,reconstructed,expected,delta}; }
function checkAngle(answer:AngleAnswer,reconstructed:number,method:string) { const d=toDegrees(answer.value), expected=Number(d.numerator)/Number(d.denominator), delta=Math.abs(expected-reconstructed); return {valid:delta<=1e-9,method,reconstructed,expected,delta}; }

function systemScale(seed:string,id:string) { return pick(seed,`${id}|scale`,[10,20] as const); }

function buildSpec(id:Trg002ProofQlId,seed:string):Spec {
  switch(id) {
    case "TRG-002-QL-001": {
      const angle=pick(seed,`${id}|angle`,[30,60] as const), run=exactInteger(pick(seed,`${id}|run`,[10,20] as const));
      const state=buildSingleElevationState({horizontal:run,angle:degree(angle),scenario:"TOWER",objectKind:"TOWER",units:"m"});
      const c=N(object(state,"object-1").height);
      const wrong=[
        {value:N(multiplyExact(run,sin(angle))),misconceptionId:"USED_SINE_INSTEAD_OF_TANGENT"},
        {value:N(multiplyExact(run,cos(angle))),misconceptionId:"USED_COSINE_INSTEAD_OF_TANGENT"},
        {value:N(div(run,tan(angle))),misconceptionId:"INVERTED_HEIGHT_DISTANCE_RATIO"},
      ];
      return {state,stem:`From a point ${formatExactPlain(run)} m from the foot of a tower, the angle of elevation of its top is ${angle}°. Find the height of the tower.`,correct:c,wrong,
        explanation:explanation("Use tan θ = height/horizontal distance.",[ `tan${angle}° = h/${formatExactPlain(run)}.`, `So h=${formatExactPlain(run)}×tan${angle}°=${show(c)}.`],"Do not use the sloping line of sight as the horizontal distance."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"COORDINATE_OBJECT_HEIGHT")};
    }
    case "TRG-002-QL-007": {
      const angle=pick(seed,`${id}|angle`,[30,60] as const), run=exactInteger(pick(seed,`${id}|run`,[10,20] as const));
      const state0=buildSingleElevationState({horizontal:run,angle:degree(angle),units:"m"});
      const state={...state0,requested:{kind:"HORIZONTAL_DISTANCE" as const,fromPointId:"object-base",toPointId:"observer-ground"}};
      const h=object(state,"object-1").height,c=N(run);
      const wrong=[
        {value:N(multiplyExact(h,tan(angle))),misconceptionId:"MULTIPLIED_BY_TANGENT"},
        {value:N(div(h,sin(angle))),misconceptionId:"TREATED_HEIGHT_AS_OPPOSITE_TO_HYPOTENUSE"},
        {value:N(h),misconceptionId:"RETURNED_HEIGHT"},
      ];
      return {state,stem:`A vertical pole is ${formatExactPlain(h)} m high. From a point on level ground, its top is seen at an elevation of ${angle}°. Find the horizontal distance from the point to the pole.`,correct:c,wrong,
        explanation:explanation("Use tan θ = height/distance and solve for distance.",[ `tan${angle}°=${formatExactPlain(h)}/d.`, `Therefore d=${formatExactPlain(h)}/tan${angle}°=${show(c)}.`],"The required distance is along the ground, not the line of sight."),
        answerCheck:checkNumber(c,horizontal(state,"object-base","observer-ground"),"COORDINATE_HORIZONTAL_DISTANCE")};
    }
    case "TRG-002-QL-012": {
      const angle=pick(seed,`${id}|angle`,[30,45,60] as const), run=exactInteger(pick(seed,`${id}|run`,[10,20] as const));
      const state0=buildSingleElevationState({horizontal:run,angle:degree(angle),units:"m"});
      const state={...state0,requested:{kind:"ANGLE" as const,observationId:"obs-1"}};
      const h=object(state,"object-1").height,c=A(degree(angle));
      const angleOptions=[30,45,60,90].filter((value)=>value!==angle).slice(0,3).map((value)=>({value:A(degree(value)),misconceptionId:`USED_${value}_DEGREE_STANDARD_RATIO`}));
      const recovered=findCleanStandardAngleFromRiseRun(h,run);
      if(!recovered) throw new Error(`${id}: clean angle recovery failed.`);
      const dx=horizontal(state,"observer-eye","object-top"),dy=Math.abs(exactToNumber(point(state,"object-top").y)-exactToNumber(point(state,"observer-eye").y));
      return {state,stem:`The height of a tower is ${formatExactPlain(h)} m and a point on level ground is ${formatExactPlain(run)} m from its foot. Find the angle of elevation of the top.`,correct:c,wrong:angleOptions,
        explanation:explanation("Form tan θ = height/distance and match the exact standard value.",[ `tanθ=${formatExactPlain(h)}/${formatExactPlain(run)}=${formatExactPlain(tan(angle))}.`, `Hence θ=${angle}°.`],"Use the exact ratio before choosing the standard angle."),
        answerCheck:checkAngle(c,Math.atan2(dy,dx)*180/Math.PI,"ATAN2_ANGLE_RECOVERY")};
    }
    case "TRG-002-QL-015": {
      const observerHeight=exactInteger(pick(seed,`${id}|eye`,[20,30] as const)), run=exactInteger(10), angle=pick(seed,`${id}|angle`,[30,60] as const);
      const built=buildDepressionHeightState(observerHeight,run,angle), state=built.state,c=N(built.targetHeight), drop=subtractExact(observerHeight,built.targetHeight);
      const wrong=[
        {value:N(addExact(observerHeight,drop)),misconceptionId:"ADDED_VERTICAL_DROP"},
        {value:N(drop),misconceptionId:"RETURNED_VERTICAL_DROP"},
        {value:N(observerHeight),misconceptionId:"IGNORED_DEPRESSION"},
      ];
      return {state,stem:`From the top of a ${formatExactPlain(observerHeight)} m building, the top of a vertical pole ${formatExactPlain(run)} m away is seen at an angle of depression of ${angle}°. Find the height of the pole.`,correct:c,wrong,
        explanation:explanation("The depression angle gives the vertical drop from the observer's eye level.",[ `Vertical drop=${formatExactPlain(run)}×tan${angle}°=${formatExactPlain(drop)} m.`, `Pole height=${formatExactPlain(observerHeight)}−${formatExactPlain(drop)}=${show(c)}.`],"Subtract the drop from the observer height; do not add it."),
        answerCheck:checkNumber(c,heightOf(state,"target-object"),"TARGET_OBJECT_HEIGHT")};
    }
    case "TRG-002-QL-023": {
      const angle=pick(seed,`${id}|angle`,[30,60] as const), sight=exactInteger(pick(seed,`${id}|sight`,[20,40] as const));
      const run=multiplyExact(sight,cos(angle)), expectedHeight=multiplyExact(sight,sin(angle));
      const state=buildSingleElevationState({horizontal:run,angle:degree(angle),units:"m"});
      const c=N(object(state,"object-1").height);
      const wrong=[
        {value:N(run),misconceptionId:"USED_ADJACENT_SIDE"},
        {value:N(multiplyExact(sight,tan(angle))),misconceptionId:"USED_TANGENT_WITH_HYPOTENUSE"},
        {value:N(sight),misconceptionId:"RETURNED_LINE_OF_SIGHT"},
      ];
      if(exactKey(c.value)!==exactKey(expectedHeight)) throw new Error(`${id}: sight-line reconstruction mismatch.`);
      return {state,stem:`The line of sight from a point on level ground to the top of a tower is ${formatExactPlain(sight)} m and makes an angle of ${angle}° with the horizontal. Find the tower's height.`,correct:c,wrong,
        explanation:explanation("Here the line of sight is the hypotenuse, so use sine.",[ `sin${angle}°=h/${formatExactPlain(sight)}.`, `Thus h=${formatExactPlain(sight)}×sin${angle}°=${show(c)}.`],"Do not use tangent when the given sloping length is the hypotenuse."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"SIGHT_LINE_HEIGHT_COORDINATE")};
    }
    case "TRG-002-QL-025": {
      const angle=pick(seed,`${id}|angle`,[30,60] as const), shadow=exactInteger(pick(seed,`${id}|shadow`,[10,20] as const)), state=buildShadowState(shadow,angle),c=N(object(state,"object-1").height);
      const wrong=[
        {value:N(multiplyExact(shadow,sin(angle))),misconceptionId:"USED_SINE_FOR_SHADOW"},
        {value:N(multiplyExact(shadow,cos(angle))),misconceptionId:"USED_COSINE_FOR_SHADOW"},
        {value:N(div(shadow,tan(angle))),misconceptionId:"INVERTED_SHADOW_RATIO"},
      ];
      return {state,stem:`A vertical pole casts a shadow ${formatExactPlain(shadow)} m long when the angle of elevation of the sun is ${angle}°. Find the height of the pole.`,correct:c,wrong,
        explanation:explanation("Use tan(solar elevation) = object height/shadow length.",[ `tan${angle}°=h/${formatExactPlain(shadow)}.`, `Hence h=${formatExactPlain(shadow)}×tan${angle}°=${show(c)}.`],"The shadow is the horizontal leg, not the hypotenuse."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"SHADOW_OBJECT_HEIGHT")};
    }
    case "TRG-002-QL-030": {
      const angle=pick(seed,`${id}|angle`,[30,60] as const), shadow=exactInteger(pick(seed,`${id}|shadow`,[10,20] as const)), state0=buildShadowState(shadow,angle),h=object(state0,"object-1").height;
      const state={...state0,requested:{kind:"SHADOW_LENGTH" as const,objectId:"object-1",shadowTipPointId:"shadow-tip"}},c=N(shadow);
      const wrong=[
        {value:N(multiplyExact(h,tan(angle))),misconceptionId:"MULTIPLIED_HEIGHT_BY_TANGENT"},
        {value:N(div(h,sin(angle))),misconceptionId:"USED_SINE_HYPOTENUSE_RELATION"},
        {value:N(h),misconceptionId:"RETURNED_OBJECT_HEIGHT"},
      ];
      return {state,stem:`A tree is ${formatExactPlain(h)} m high. When the sun's elevation is ${angle}°, find the length of its shadow on level ground.`,correct:c,wrong,
        explanation:explanation("Use tan θ = height/shadow and solve for the shadow.",[ `tan${angle}°=${formatExactPlain(h)}/s.`, `So s=${formatExactPlain(h)}/tan${angle}°=${show(c)}.`],"The shadow decreases as the solar elevation increases."),
        answerCheck:checkNumber(c,horizontal(state,"object-base","shadow-tip"),"SHADOW_LENGTH_COORDINATE")};
    }
    case "TRG-002-QL-033": {
      const scale=pick(seed,`${id}|scale`,[10,20] as const), direction=pick(seed,`${id}|direction`,[0,1] as const), oldAngle=(direction===0?30:60) as 30|60, newAngle=(direction===0?60:30) as 30|60;
      const built=buildChangedShadowState(scale,oldAngle,newAngle),state=built.state,c=N(built.newShadow);
      const average=div(addExact(built.oldShadow,built.newShadow),exactInteger(2));
      const wrong=[
        {value:N(built.oldShadow),misconceptionId:"KEPT_OLD_SHADOW"},
        {value:N(average),misconceptionId:"AVERAGED_SHADOW_LENGTHS"},
        {value:N(addExact(built.oldShadow,built.newShadow)),misconceptionId:"ADDED_OLD_AND_NEW_SHADOWS"},
      ];
      return {state,stem:`A pole casts a ${formatExactPlain(built.oldShadow)} m shadow when the sun's elevation is ${oldAngle}°. Without changing the pole, what will its shadow length be when the elevation becomes ${newAngle}°?`,correct:c,wrong,
        explanation:explanation("The pole height is unchanged, so equate height = shadow × tan(angle).",[ `First height=${formatExactPlain(built.oldShadow)}×tan${oldAngle}°=${formatExactPlain(built.height)} m.`, `New shadow=${formatExactPlain(built.height)}/tan${newAngle}°=${show(c)}.`],"Do not keep the same shadow when the solar elevation changes."),
        answerCheck:checkNumber(c,horizontal(state,"object-base","shadow-tip-new"),"CHANGED_SHADOW_COORDINATE")};
    }
    case "TRG-002-QL-036": {
      const length=exactInteger(pick(seed,`${id}|length`,[10,20] as const)),angle=pick(seed,`${id}|angle`,[30,60] as const),base0=buildLadderState({ladderLength:length,angleAtGround:degree(angle),units:"m"});
      const state=withGroundObservation(base0,{observerId:"ladder-reference",groundPointId:"ladder-base",targetPointId:"wall-contact",angle:degree(angle)}),c=N(object(state,"wall-1").height);
      const wrong=[
        {value:N(multiplyExact(length,cos(angle))),misconceptionId:"USED_COSINE_FOR_VERTICAL_HEIGHT"},
        {value:N(multiplyExact(length,tan(angle))),misconceptionId:"USED_TANGENT_WITH_LADDER_LENGTH"},
        {value:N(length),misconceptionId:"RETURNED_LADDER_LENGTH"},
      ];
      return {state,stem:`A ${formatExactPlain(length)} m ladder rests against a vertical wall and makes an angle of ${angle}° with the ground. How high up the wall does it reach?`,correct:c,wrong,
        explanation:explanation("The ladder is the hypotenuse, so vertical height = ladder × sin(angle).",[ `h=${formatExactPlain(length)}×sin${angle}°.`, `Therefore h=${show(c)}.`],"Do not treat the ladder length as the horizontal distance."),
        answerCheck:checkNumber(c,heightOf(state,"wall-1"),"LADDER_VERTICAL_HEIGHT")};
    }
    case "TRG-002-QL-045": {
      const height=exactInteger(pick(seed,`${id}|height`,[10,20] as const)),angle=pick(seed,`${id}|angle`,[30,60] as const),built=buildGuyWireState(height,angle),state=built.state,c=N(built.wireLength);
      const wrong=[
        {value:N(div(height,cos(angle))),misconceptionId:"USED_COSINE_FOR_OPPOSITE_SIDE"},
        {value:N(built.horizontalRun),misconceptionId:"RETURNED_ANCHOR_DISTANCE"},
        {value:N(height),misconceptionId:"RETURNED_MAST_HEIGHT"},
      ];
      return {state,stem:`A guy wire runs from the top of a ${formatExactPlain(height)} m mast to an anchor on level ground and makes an angle of ${angle}° with the ground. Find the length of the wire.`,correct:c,wrong,
        explanation:explanation("The wire is the hypotenuse and the mast height is opposite the ground angle.",[ `sin${angle}°=${formatExactPlain(height)}/L.`, `Thus L=${formatExactPlain(height)}/sin${angle}°=${show(c)}.`],"Do not return the horizontal anchor distance."),
        answerCheck:checkNumber(c,distanceBetween(state,"anchor","mast-top"),"GUY_WIRE_EUCLIDEAN_LENGTH")};
    }
    case "TRG-002-QL-049": {
      const k=systemScale(seed,id),move=exactInteger(2*k),base=buildSameSideMovingState({farAngle:degree(30),nearAngle:degree(60),movementTowardObject:move,units:"m"});
      const state={...base,movements:[],diagramStrategy:"TWO_OBSERVATIONS_SAME_SIDE" as const,requested:{kind:"OBJECT_HEIGHT" as const,objectId:"object-1"}},c=N(object(state,"object-1").height);
      const wrong=[
        {value:N(exactInteger(3*k)),misconceptionId:"RETURNED_FAR_DISTANCE"},
        {value:N(exactInteger(k)),misconceptionId:"RETURNED_NEAR_DISTANCE"},
        {value:N(move),misconceptionId:"RETURNED_POINT_SEPARATION"},
      ];
      return {state,stem:`Two points A and B lie on the same straight line with the foot of a tower, B being nearer the tower. A and B are ${2*k} m apart, and the angles of elevation of the top are 30° and 60° respectively. Find the tower's height.`,correct:c,wrong,
        explanation:explanation("Use the same tower height with the two tangent equations.",[ `If the nearer distance is x, the farther distance is x+${2*k}.`, `x tan60°=(x+${2*k})tan30° gives x=${k} m.`, `Height=x tan60°=${show(c)}.`],"For same-side points, the farther distance is the nearer distance plus the separation."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"TWO_POINT_OBJECT_HEIGHT")};
    }
    case "TRG-002-QL-056": {
      const k=systemScale(seed,id),move=exactInteger(2*k),state=buildSameSideMovingState({farAngle:degree(30),nearAngle:degree(60),movementTowardObject:move,units:"m"}),c=N(exactInteger(k));
      const wrong=[
        {value:N(exactInteger(3*k)),misconceptionId:"RETURNED_ORIGINAL_DISTANCE"},
        {value:N(move),misconceptionId:"RETURNED_MOVEMENT"},
        {value:N(object(state,"object-1").height),misconceptionId:"RETURNED_HEIGHT"},
      ];
      return {state,stem:`An observer sees the top of a tower at 30°. After moving ${2*k} m straight toward the tower, the angle becomes 60°. How far is the observer from the tower after moving?`,correct:c,wrong,
        explanation:explanation("Let the new distance be x; the old distance is x plus the movement.",[ `x tan60°=(x+${2*k})tan30°.`, `Solving gives x=${show(c)}.`],"Because the observer moves closer, subtract the movement from the original distance only after establishing the point order."),
        answerCheck:checkNumber(c,horizontal(state,"object-base","near-ground"),"NEAR_OBSERVER_DISTANCE")};
    }
    case "TRG-002-QL-061": {
      const k=systemScale(seed,id),move=exactInteger(2*k),base=buildSameSideMovingState({farAngle:degree(30),nearAngle:degree(60),movementTowardObject:move,units:"m"});
      const state={...base,movements:[{...base.movements[0],observerId:"observer-near",fromGroundPointId:"near-ground",toGroundPointId:"far-ground",direction:"FARTHER" as const}],diagramStrategy:"OBSERVER_MOVES_FARTHER" as const},c=N(object(base,"object-1").height);
      const wrong=[
        {value:N(exactInteger(k)),misconceptionId:"RETURNED_START_DISTANCE"},
        {value:N(exactInteger(3*k)),misconceptionId:"RETURNED_FINAL_DISTANCE"},
        {value:N(move),misconceptionId:"RETURNED_MOVEMENT"},
      ];
      return {state,stem:`From a point ${k} m from a tower, the angle of elevation of its top is 60°. An observer then moves ${2*k} m straight away from the tower and the angle becomes 30°. Find the tower's height.`,correct:c,wrong,
        explanation:explanation("The same height must satisfy both the near and far tangent equations.",[ `At the first point, h=${k}tan60°.\`, `This equals ${formatExactPlain(c.value)} m and also matches the 30° observation from ${3*k} m.`],"Moving farther increases horizontal distance while the angle decreases."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"FARTHER_MOVEMENT_HEIGHT")};
    }
    case "TRG-002-QL-065": {
      const k=systemScale(seed,id),move=exactInteger(2*k),state=buildSameSideMovingState({farAngle:degree(30),nearAngle:degree(60),movementTowardObject:move,units:"m"}),c=N(exactInteger(3*k));
      const wrong=[
        {value:N(exactInteger(k)),misconceptionId:"RETURNED_NEW_DISTANCE"},
        {value:N(move),misconceptionId:"RETURNED_MOVEMENT"},
        {value:N(object(state,"object-1").height),misconceptionId:"RETURNED_HEIGHT"},
      ];
      return {state,stem:`An observer sees the top of a tower at 30°. After walking ${2*k} m toward it, the angle of elevation becomes 60°. Find the observer's original distance from the tower.`,correct:c,wrong,
        explanation:explanation("Use x for the original distance and x−movement for the new distance.",[ `x tan30°=(x−${2*k})tan60°.`, `Solving gives x=${show(c)}.`],"The original distance is the larger same-side distance."),
        answerCheck:checkNumber(c,horizontal(state,"object-base","far-ground"),"ORIGINAL_FAR_DISTANCE")};
    }
    case "TRG-002-QL-068": {
      const k=systemScale(seed,id),move=exactInteger(2*k),state0=buildSameSideMovingState({farAngle:degree(30),nearAngle:degree(60),movementTowardObject:move,units:"m"});
      const state={...state0,movements:[],diagramStrategy:"TWO_OBSERVATIONS_SAME_SIDE" as const,requested:{kind:"HORIZONTAL_DISTANCE" as const,fromPointId:"near-ground",toPointId:"far-ground"}},h=object(state,"object-1").height,c=N(move);
      const wrong=[
        {value:N(exactInteger(k)),misconceptionId:"RETURNED_NEAR_DISTANCE"},
        {value:N(exactInteger(3*k)),misconceptionId:"RETURNED_FAR_DISTANCE"},
        {value:N(h),misconceptionId:"RETURNED_HEIGHT"},
      ];
      return {state,stem:`A tower is ${formatExactPlain(h)} m high. Two points on the same side of its foot give angles of elevation 60° and 30°. Find the distance between the two observation points.`,correct:c,wrong,
        explanation:explanation("Find each horizontal distance from height/tan(angle), then subtract because both points are on the same side.",[ `Near distance=${formatExactPlain(h)}/tan60°=${k} m; far distance=${formatExactPlain(h)}/tan30°=${3*k} m.`, `Separation=${3*k}−${k}=${show(c)}.`],"Same-side separation is the difference of the two distances."),
        answerCheck:checkNumber(c,horizontal(state,"near-ground","far-ground"),"SAME_SIDE_POINT_SEPARATION")};
    }
    case "TRG-002-QL-073": {
      const run=exactInteger(pick(seed,`${id}|run`,[10,20] as const)),eye=exactRational(pick(seed,`${id}|eyeN`,[3,5] as const),2),state=buildObserverHeightElevationState({horizontal:run,angle:degree(45),eyeHeight:eye,units:"m"}),c=N(object(state,"object-1").height);
      const rise=subtractExact(c.value,eye);
      const wrong=[
        {value:N(rise),misconceptionId:"OMITTED_EYE_HEIGHT"},
        {value:N(subtractExact(rise,eye)),misconceptionId:"SUBTRACTED_EYE_HEIGHT"},
        {value:N(eye),misconceptionId:"RETURNED_EYE_HEIGHT"},
      ];
      return {state,stem:`An observer's eye is ${formatExactPlain(eye)} m above level ground. Standing ${formatExactPlain(run)} m from a building, the observer sees its top at an elevation of 45°. Find the building's height.`,correct:c,wrong,
        explanation:explanation("First find the vertical rise above eye level, then add the eye height once.",[ `Rise above eye level=${formatExactPlain(run)}×tan45°=${formatExactPlain(rise)} m.`, `Building height=${formatExactPlain(rise)}+${formatExactPlain(eye)}=${show(c)}.`],"Do not omit the eye height or add it twice."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"OBSERVER_HEIGHT_TOTAL")};
    }
    case "TRG-002-QL-078": {
      const separation=exactInteger(pick(seed,`${id}|sep`,[20,40] as const)),state=buildOppositeSideState({leftAngle:degree(45),rightAngle:degree(45),observerSeparation:separation,units:"m"}),c=N(object(state,"object-1").height),half=div(separation,exactInteger(2));
      const wrong=[
        {value:N(separation),misconceptionId:"USED_FULL_SEPARATION_AS_HEIGHT"},
        {value:N(div(separation,exactInteger(4))),misconceptionId:"HALVED_TWICE"},
        {value:N(multiplyExact(half,exactInteger(3))),misconceptionId:"USED_THREE_QUARTERS"},
      ];
      return {state,stem:`Two observers stand ${formatExactPlain(separation)} m apart on opposite sides of a tower. Each sees the top at an angle of elevation of 45°. Find the height of the tower.`,correct:c,wrong,
        explanation:explanation("At 45°, each horizontal distance equals the tower height.",[ `If the height is h, the two ground distances are h and h.`, `Because the observers are on opposite sides, h+h=${formatExactPlain(separation)}, so h=${show(c)}.`],"Opposite-side distances add to the observer separation."),
        answerCheck:checkNumber(c,heightOf(state,"object-1"),"OPPOSITE_SIDE_OBJECT_HEIGHT")};
    }
    case "TRG-002-QL-083": {
      const scale=pick(seed,`${id}|scale`,[10,20] as const),built=buildBuildingToBuildingState(scale),state=built.state,c=N(built.secondHeight);
      const wrong=[
        {value:N(built.firstHeight),misconceptionId:"RETURNED_FIRST_BUILDING_HEIGHT"},
        {value:N(exactInteger(scale*3)),misconceptionId:"ADDED_DISTANCE_TWICE"},
        {value:N(exactInteger(scale*4)),misconceptionId:"DOUBLED_TOTAL_HEIGHT"},
      ];
      return {state,stem:`From the top of a ${scale} m building, the top of another building ${scale} m away is seen at an elevation of 45°. Find the height of the second building.`,correct:c,wrong,
        explanation:explanation("Find the rise above the first roof, then add the first building's height.",[ `At 45°, the rise over ${scale} m horizontal distance is ${scale} m.`, `Second building height=${scale}+${scale}=${show(c)}.`],"The tangent relation gives only the height difference between the two roofs."),
        answerCheck:checkNumber(c,heightOf(state,"building-2"),"SECOND_BUILDING_HEIGHT")};
    }
    case "TRG-002-QL-088": {
      const scale=pick(seed,`${id}|scale`,[10,20] as const),built=buildElevationDepressionState(scale),state=built.state,c=N(built.targetHeight);
      const wrong=[
        {value:N(built.observerHeight),misconceptionId:"USED_ONLY_DEPRESSION_HEIGHT"},
        {value:N(exactInteger(scale*3)),misconceptionId:"ADDED_BOTH_VERTICAL_PARTS_TO_TARGET"},
        {value:N(exactInteger(scale*4)),misconceptionId:"DOUBLED_COMBINED_HEIGHT"},
      ];
      return {state,stem:`From the top of a ${scale} m building, the base of a tower is seen at a depression of 45° and its top at an elevation of 45°. Find the height of the tower.`,correct:c,wrong,
        explanation:explanation("Use the depression to get the horizontal distance, then the elevation to get the rise above eye level.",[ `The 45° depression gives horizontal distance ${scale} m.`, `The 45° elevation gives another ${scale} m rise above the observer's level.`, `Tower height=${scale}+${scale}=${show(c)}.`],"The tower extends both below and above the observer's horizontal eye level."),
        answerCheck:checkNumber(c,heightOf(state,"target-tower"),"ELEVATION_DEPRESSION_TARGET_HEIGHT")};
    }
    case "TRG-002-QL-092": {
      const scale=pick(seed,`${id}|scale`,[10,20] as const),built=buildRiverWidthState(scale),state=built.state,c=N(built.width);
      const wrong=[
        {value:N(exactInteger(scale*2)),misconceptionId:"DOUBLED_WIDTH"},
        {value:N(exactRational(scale,2)),misconceptionId:"HALVED_WIDTH"},
        {value:N(exactInteger(scale*3)),misconceptionId:"TRIPLED_WIDTH"},
      ];
      return {state,stem:`A ${scale} m tower stands on one bank of a river. From its top, the point directly opposite on the other bank is seen at an angle of depression of 45°. Find the width of the river.`,correct:c,wrong,
        explanation:explanation("The angle of depression equals the corresponding angle of elevation from the opposite bank.",[ `At 45°, tan45°=${scale}/w=1.`, `Therefore w=${show(c)}.`],"The river width is the horizontal separation between the two banks."),
        answerCheck:checkNumber(c,horizontal(state,"tower-base","opposite-bank"),"RIVER_WIDTH_COORDINATE")};
    }
  }
}

export type Trg002ProofQuestion = {
  packageId:"TRG-002";
  cpId:Trg002ProofCpId;
  qlId:Trg002ProofQlId;
  lockedFamily:string;
  solveMode:string;
  language:"en";
  seed:string;
  difficulty:Difficulty;
  target:"LENGTH"|"ANGLE";
  stem:string;
  options:Array<{label:"A"|"B"|"C"|"D";value:Answer;display:string;isCorrect:boolean;misconceptionId:string|null}>;
  correctIndex:number;
  answer:string;
  exactAnswer:Answer;
  explanation:Spec["explanation"];
  canonicalSpatialState:Trg002SpatialState;
  diagram:ReturnType<typeof buildTrg002DiagramSpec>;
  verification:{spatial:ReturnType<typeof verifyTrg002SpatialState>;diagram:ReturnType<typeof validateTrg002DiagramSpec>;answer:Spec["answerCheck"]};
  validation:{valid:boolean;checks:Array<{name:string;passed:boolean;message:string}>};
  reviewStatus:"UNREVIEWED";
  aiEditorialStatus:"PENDING";
  humanReviewStatus:"PENDING";
  questionBankStatus:"NOT_STORED";
  testEligibility:"INELIGIBLE";
  publiclyPublishable:false;
  questionStudioDiscoverable:false;
  proofOnly:true;
};

function make(entry:RegistryEntry,seed:string,spec:Spec):Trg002ProofQuestion {
  const raw=[{value:spec.correct,isCorrect:true,misconceptionId:null as string|null},...spec.wrong.map((item)=>({...item,isCorrect:false}))];
  if(raw.length!==4) throw new Error(`${entry.qlId}: expected four options.`);
  if(new Set(raw.map((item)=>answerKey(item.value))).size!==4) throw new Error(`${entry.qlId}: mathematically equivalent option collision.`);
  const options=shuffle(`${seed}|${entry.qlId}|options`,raw).map((item,index)=>({label:(["A","B","C","D"] as const)[index],value:item.value,display:show(item.value),isCorrect:item.isCorrect,misconceptionId:item.misconceptionId}));
  const correctIndex=options.findIndex((item)=>item.isCorrect);
  const spatial=verifyTrg002SpatialState(spec.state);
  const diagram=buildTrg002DiagramSpec(spec.state);
  const diagramVerification=validateTrg002DiagramSpec(diagram);
  const minimumSteps=entry.difficulty==="Hard"?3:entry.difficulty==="Medium"?2:1;
  const checks=[
    {name:"SPATIAL_VERIFIED",passed:spatial.valid,message:"Canonical coordinate state passes independent spatial verification."},
    {name:"DIAGRAM_VERIFIED",passed:diagramVerification.valid,message:"Diagram projection passes viewport/reference validation."},
    {name:"ANSWER_VERIFIED",passed:spec.answerCheck.valid,message:"Answer independently reconstructs from canonical coordinates."},
    {name:"FOUR_OPTIONS",passed:options.length===4,message:"Exactly four options."},
    {name:"ONE_CORRECT",passed:options.filter((item)=>item.isCorrect).length===1,message:"Exactly one correct option."},
    {name:"UNIQUE_OPTIONS",passed:new Set(options.map((item)=>answerKey(item.value))).size===4,message:"Options are mathematically unique."},
    {name:"CORRECT_INDEX",passed:correctIndex>=0&&options[correctIndex]?.isCorrect===true,message:"Correct index points to the correct option."},
    {name:"DIAGRAM_STRATEGY",passed:spec.state.diagramStrategy===entry.diagramStrategy,message:"Canonical state uses the locked proof diagram strategy."},
    {name:"EXPLANATION_DEPTH",passed:spec.explanation.steps.length>=minimumSteps,message:`Explanation meets ${entry.difficulty} depth floor.`},
    {name:"NO_PLACEHOLDERS",passed:!/[{}]\\w+|\\{\\{/.test(spec.stem),message:"No unresolved placeholders."},
    {name:"ACTIVATION_LOCK",passed:true,message:"TRG-002 proof remains inactive."},
  ];
  const question:Trg002ProofQuestion={packageId:"TRG-002",cpId:entry.cpId,qlId:entry.qlId,lockedFamily:entry.lockedFamily,solveMode:entry.solveMode,language:"en",seed,difficulty:entry.difficulty,target:entry.target,stem:spec.stem,options,correctIndex,answer:show(spec.correct),exactAnswer:spec.correct,explanation:spec.explanation,canonicalSpatialState:spec.state,diagram,verification:{spatial,diagram:diagramVerification,answer:spec.answerCheck},validation:{valid:checks.every((item)=>item.passed),checks},reviewStatus:"UNREVIEWED",aiEditorialStatus:"PENDING",humanReviewStatus:"PENDING",questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false,questionStudioDiscoverable:false,proofOnly:true};
  if(!question.validation.valid) throw new Error(`${entry.qlId}: runtime proof validation failed.`);
  return question;
}

export function generateTrg002RuntimeProofQuestion(qlId:Trg002ProofQlId,seed:string) {
  const entry=BY_ID.get(qlId);
  if(!entry) throw new Error(`Unknown TRG-002 proof QL ${qlId}`);
  return make(entry,seed,buildSpec(qlId,seed));
}

export function generateAllTrg002RuntimeProofQuestions(seed:string) {
  return TRG_002_RUNTIME_PROOF_REGISTRY.map((entry)=>generateTrg002RuntimeProofQuestion(entry.qlId,seed));
}

export function trg002ProofFingerprint(question:Trg002ProofQuestion) {
  return [question.qlId,question.seed,question.lockedFamily,question.stem,question.options.map((option)=>`${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),question.correctIndex,answerKey(question.exactAnswer),question.canonicalSpatialState.diagramStrategy,question.diagram.points.map((point)=>`${point.id}:${point.x.toFixed(4)}:${point.y.toFixed(4)}`).join("|")].join("::");
}
