import { compare, equals, rational, toLatex } from './rational';
import { timeText, tmwCp009NetRate, ZERO, ONE } from './cp009-core';
import type { Rational } from './types';
import type { TmwCp009Pipe } from './cp009-types';
import type { TmwCp010CycleSegment, TmwCp010Stage } from './cp010-types';
export function inline(value:string){return `\\(${value}\\)`;}
export function levelText(value:Rational):string{if(equals(value,ZERO))return 'empty';if(equals(value,ONE))return 'full';return inline(`${toLatex(value)}\\;\\text{ full}`);}
export function pipeAction(pipe:TmwCp009Pipe,tank:string):string{if(pipe.kind==='INLET')return `${pipe.label} can fill the ${tank} alone in ${timeText(pipe.soloTime)}`;if(pipe.kind==='LEAK')return `${pipe.label} would empty the full ${tank} in ${timeText(pipe.soloTime)}`;return `${pipe.label} can empty the full ${tank} alone in ${timeText(pipe.soloTime)}`;}
export function join(items:string[]):string{return items.length===1?items[0]:items.length===2?`${items[0]} and ${items[1]}`:`${items.slice(0,-1).join(', ')}, and ${items.at(-1)}`;}
export function uniquePipes(groups:readonly TmwCp009Pipe[][]):TmwCp009Pipe[]{const seen=new Set<string>(),result:TmwCp009Pipe[]=[];for(const group of groups)for(const pipe of group){const key=`${pipe.label}:${pipe.kind}:${pipe.soloTime.numerator}/${pipe.soloTime.denominator}`;if(seen.has(key))continue;seen.add(key);result.push(pipe);}return result;}
export function pipeFacts(pipes:TmwCp009Pipe[],tank:string):string{return join(pipes.map(pipe=>pipeAction(pipe,tank)));}
export function capabilitySentences(pipes:TmwCp009Pipe[],tank:string):string{return pipes.map(pipe=>`${pipeAction(pipe,tank)}.`).join(' ');}
export function arrangementText(pipes:TmwCp009Pipe[]):string{if(pipes.length===0)return 'all flow remains stopped';const labels=join(pipes.map(pipe=>pipe.label));return pipes.length===1?`${labels} operates`:`${labels} operate together`;}
export function stageText(stage:TmwCp010Stage):string{const duration=stage.duration?` for ${timeText(stage.duration)}`:'';if(stage.idle||stage.pipes.length===0)return `${stage.label}: all flow remains stopped${duration}`;return `${stage.label}: ${arrangementText(stage.pipes)}${duration}`;}
export function segmentText(segment:TmwCp010CycleSegment):string{return `${segment.label}: ${arrangementText(segment.pipes)} for ${timeText(segment.duration)}`;}
export function numberedSegments(cycle:TmwCp010CycleSegment[]):string{return cycle.map((segment,index)=>`${index+1}. ${segmentText(segment)}.`).join(' ');}
export function targetWord(rate:Rational){return compare(rate,ZERO)>0?'fill':'empty';}
export function netRateText(pipes:TmwCp009Pipe[]){return inline(`${toLatex(tmwCp009NetRate(pipes))}\\;\\text{ tank/hour}`);}
