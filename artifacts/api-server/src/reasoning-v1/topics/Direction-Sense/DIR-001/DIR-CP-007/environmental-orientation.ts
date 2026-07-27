import {aboutTurn,turnLeft,turnRight} from "../foundation/directions"; import type{CardinalDirection}from"../foundation/types"; import type{EnvironmentalTarget,PersonOrientationRelation,RelativeShadowSide,SunTimePeriod,TurnInstruction}from"./types";
export const CARDINAL_DIRECTIONS=["NORTH","EAST","SOUTH","WEST"] as const;
export const SUN_SHADOW_DIRECTION_LABELS:Readonly<Record<CardinalDirection,string>>={NORTH:"North",EAST:"East",SOUTH:"South",WEST:"West"};
export const SIDE_LABELS:Readonly<Record<RelativeShadowSide,string>>={LEFT:"to the left of",RIGHT:"to the right of",FRONT:"in front of",BEHIND:"behind"};
export const PERIOD_LABELS:Readonly<Record<SunTimePeriod,string>>={MORNING:"Morning",EVENING:"Evening"};
export function sunDirection(period:SunTimePeriod):CardinalDirection{return period==="MORNING"?"EAST":"WEST";} export function shadowDirection(period:SunTimePeriod):CardinalDirection{return period==="MORNING"?"WEST":"EAST";} export function environmentalDirection(period:SunTimePeriod,target:EnvironmentalTarget):CardinalDirection{return target==="SUN"?sunDirection(period):shadowDirection(period);}
function idx(d:CardinalDirection):number{return CARDINAL_DIRECTIONS.indexOf(d);} function norm(i:number):number{return((i%4)+4)%4;}
export function relativeSideOfDirection(facing:CardinalDirection,absolute:CardinalDirection):RelativeShadowSide{const d=norm(idx(absolute)-idx(facing));return d===0?"FRONT":d===1?"RIGHT":d===2?"BEHIND":"LEFT";}
export function inferFacingFromShadowSide(period:SunTimePeriod,side:RelativeShadowSide):CardinalDirection{const shadow=shadowDirection(period);const matches=CARDINAL_DIRECTIONS.filter(f=>relativeSideOfDirection(f,shadow)===side);if(matches.length!==1)throw new Error(`Expected one facing for ${period}/${side}`);return matches[0];}
export function inferPeriodFromFacingAndShadowSide(facing:CardinalDirection,side:RelativeShadowSide):SunTimePeriod{const matches=SUN.filter(p=>relativeSideOfDirection(facing,shadowDirection(p))===side);if(matches.length!==1)throw new Error(`Expected one period for ${facing}/${side}`);return matches[0];}
const SUN=["MORNING","EVENING"] as const;
export function applyTurnInstruction(facing:CardinalDirection,turn:TurnInstruction):CardinalDirection{if(turn==="LEFT")return turnLeft(facing) as CardinalDirection;if(turn==="RIGHT")return turnRight(facing) as CardinalDirection;return aboutTurn(facing) as CardinalDirection;}
export function applyTurnSequence(facing:CardinalDirection,turns:readonly TurnInstruction[]):CardinalDirection{return turns.reduce((f,t)=>applyTurnInstruction(f,t),facing);}
export function secondPersonFacing(first:CardinalDirection,relation:PersonOrientationRelation):CardinalDirection{return relation==="SAME_DIRECTION"?first:aboutTurn(first) as CardinalDirection;}
