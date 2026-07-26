import type { CardinalDirection, DirectionOption } from "../foundation/types";
export const SUN_TIME_PERIODS=["MORNING","EVENING"] as const; export type SunTimePeriod=(typeof SUN_TIME_PERIODS)[number];
export const RELATIVE_SHADOW_SIDES=["LEFT","RIGHT","FRONT","BEHIND"] as const; export type RelativeShadowSide=(typeof RELATIVE_SHADOW_SIDES)[number];
export type EnvironmentalTarget="SUN"|"SHADOW"; export type PersonOrientationRelation="SAME_DIRECTION"|"OPPOSITE_DIRECTION"; export type TurnInstruction="LEFT"|"RIGHT"|"ABOUT";
export type TimeAnswerPeriod=SunTimePeriod|"NOON"|"CANNOT_BE_DETERMINED";
export type SunShadowAnswer={readonly kind:"DIRECTION";readonly direction:CardinalDirection}|{readonly kind:"RELATIVE_SIDE";readonly side:RelativeShadowSide}|{readonly kind:"TIME_PERIOD";readonly period:TimeAnswerPeriod};
export interface SunShadowOption extends DirectionOption<SunShadowAnswer>{readonly label:string;}
export interface SunShadowDiagramSpec{readonly kind:"SUN_SHADOW_DIAGRAM"|"SUN_SHADOW_TURN_DIAGRAM"|"MUTUAL_ORIENTATION_DIAGRAM";readonly title:string;readonly svg:string;}
export interface SunShadowExplanation{readonly given:string;readonly inferenceLines:readonly string[];readonly turnLines:readonly string[];readonly resultLine:string;readonly conclusion:string;readonly diagram:SunShadowDiagramSpec;}
export interface GeneratedSunShadowQuestion{readonly qlId:string;readonly checkpointId:"DIR-CP-007";readonly ruleId:string;readonly seed:number;readonly difficulty:"EASY"|"MEDIUM"|"HARD";readonly stem:string;readonly structuredPrompt:Readonly<Record<string,unknown>>;readonly options:readonly SunShadowOption[];readonly correctIndex:number;readonly correctAnswer:SunShadowAnswer;readonly explanation:SunShadowExplanation;readonly metadata:{readonly answerDemand:string;readonly timePeriod:SunTimePeriod|null;readonly shadowSide:RelativeShadowSide|null;readonly turnCount:number;readonly solverVerified:true;readonly solveMode:null;};}
