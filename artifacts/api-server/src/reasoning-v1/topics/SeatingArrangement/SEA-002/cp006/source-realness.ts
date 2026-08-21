import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { generateSea002Cp006DiscoveryCaselet } from "./discovery.ts";
import { auditOracleCp006, solveCp006 } from "./generator.ts";
import { areOpposite, facingForRow, oppositePerson, sameRowMove, seatOf } from "./topology.ts";
import type {
  Sea002Cp006BlueprintId,
  Sea002Cp006Caselet,
  Sea002Cp006ChildQuestion,
  Sea002Cp006Clue,
  Sea002Cp006Option,
  Sea002Cp006State,
  Sea002ParallelSide,
} from "./types.ts";

function stableNumber(value:string):number {
  let hash=0x811c9dc5;
  for(const character of value) hash=Math.imul(hash^character.charCodeAt(0),0x01000193);
  return hash>>>0;
}

function ordinal(steps:number):string {
  if(steps===1) return "immediately";
  return ({2:"second",3:"third",4:"fourth",5:"fifth"} as Record<number,string>)[steps] ?? `${steps}th`;
}

function relationDisplay(steps:number,side:Sea002ParallelSide):string {
  const position=steps===1?"Immediate":({2:"Second",3:"Third",4:"Fourth",5:"Fifth"} as Record<number,string>)[steps]??`${steps}th`;
  return `${position} to the ${side.toLowerCase()}`;
}

function atEitherEndDistance(column:number,n:number,positionFromEnd:number):boolean {
  return column===positionFromEnd-1||column===n-positionFromEnd;
}

export function cp006SourceClueTrue(state:Sea002Cp006State,clue:Sea002Cp006Clue):boolean {
  if(clue.kind==="SAME_ROW_GAP") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return first.row===second.row && Math.abs(first.column-second.column)===clue.between+1;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return first.row===second.row && Math.abs(first.column-second.column)>=clue.minBetween+1;
  }
  if(clue.kind==="SAME_ROW_EQUAL_GAP") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second),third=seatOf(state,clue.third),fourth=seatOf(state,clue.fourth);
    return first.row===second.row && third.row===fourth.row && Math.abs(first.column-second.column)===Math.abs(third.column-fourth.column);
  }
  if(clue.kind==="NOT_ADJACENT") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return !(first.row===second.row&&Math.abs(first.column-second.column)===1);
  }
  if(clue.kind==="ROW_END_DISTANCE") {
    const seat=seatOf(state,clue.person);
    const at=atEitherEndDistance(seat.column,state.seatCountPerRow,clue.positionFromEnd);
    return clue.mode==="AT_EITHER_END_DISTANCE"?at:!at;
  }
  if(clue.kind==="FACING_REFERENT_RELATIVE") {
    const targetFacing=oppositePerson(state,clue.targetFacee);
    const referenceFacing=oppositePerson(state,clue.referenceFacee);
    return sameRowMove(state,referenceFacing,clue.side,clue.steps)===targetFacing;
  }
  return true;
}

export function renderCp006SourceClue(clue:Sea002Cp006Clue):string {
  if(clue.kind==="SAME_ROW_GAP") {
    if(clue.between===0) return `${clue.first} and ${clue.second} are immediate neighbours in the same row.`;
    return `Exactly ${clue.between} ${clue.between===1?"person sits":"persons sit"} between ${clue.first} and ${clue.second} in the same row.`;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") {
    if(clue.minBetween===1) return `At least one person sits between ${clue.first} and ${clue.second} in the same row.`;
    return `At least ${clue.minBetween} persons sit between ${clue.first} and ${clue.second} in the same row.`;
  }
  if(clue.kind==="SAME_ROW_EQUAL_GAP") {
    return `The number of persons sitting between ${clue.first} and ${clue.second} is the same as that between ${clue.third} and ${clue.fourth}.`;
  }
  if(clue.kind==="NOT_ADJACENT") return `${clue.first} and ${clue.second} are not immediate neighbours.`;
  if(clue.kind==="ROW_END_DISTANCE") {
    const phrase=`${ordinal(clue.positionFromEnd)} from either end of the row`;
    return clue.mode==="AT_EITHER_END_DISTANCE"?`${clue.person} sits ${phrase}.`:`${clue.person} does not sit ${phrase}.`;
  }
  if(clue.kind==="FACING_REFERENT_RELATIVE") {
    return `The person facing ${clue.targetFacee} sits ${ordinal(clue.steps)} to the ${clue.side.toLowerCase()} of the person facing ${clue.referenceFacee}.`;
  }
  throw new Error(`Not a CP006 source-realness clue: ${clue.kind}`);
}

function sourceClues(state:Sea002Cp006State,seed:string):readonly Sea002Cp006Clue[] {
  const rng=new DeterministicRandom(`${seed}:cp006:source-clues`);
  const row=rng.pick([state.top,state.bottom] as const);
  const gap:Sea002Cp006Clue={kind:"SAME_ROW_GAP",first:row[0]!,second:row.at(-1)!,between:state.seatCountPerRow-2};
  const adjacencyIndex=rng.integer(0,state.seatCountPerRow-2);
  const adjacent:Sea002Cp006Clue={kind:"SAME_ROW_GAP",first:row[adjacencyIndex]!,second:row[adjacencyIndex+1]!,between:0};
  const nonAdjacent:Sea002Cp006Clue={kind:"NOT_ADJACENT",first:row[0]!,second:row[2]!};
  const minimumGap:Sea002Cp006Clue={kind:"SAME_ROW_MIN_BETWEEN",first:row[0]!,second:row.at(-1)!,minBetween:Math.min(2,state.seatCountPerRow-2)};
  const equalGap:Sea002Cp006Clue={kind:"SAME_ROW_EQUAL_GAP",first:state.top[0]!,second:state.top[2]!,third:state.bottom[0]!,fourth:state.bottom[2]!};
  const secondFromEnd:Sea002Cp006Clue={kind:"ROW_END_DISTANCE",person:row[1]!,positionFromEnd:2,mode:"AT_EITHER_END_DISTANCE"};
  const notSecondFromEnd:Sea002Cp006Clue={kind:"ROW_END_DISTANCE",person:row[0]!,positionFromEnd:2,mode:"NOT_AT_EITHER_END_DISTANCE"};

  const candidates:{targetFacee:string;referenceFacee:string;side:Sea002ParallelSide;steps:number}[]=[];
  for(const referenceFacee of [...state.top,...state.bottom]) {
    const referenceFacing=oppositePerson(state,referenceFacee);
    for(const side of ["LEFT","RIGHT"] as const) {
      for(let steps=1;steps<=Math.min(2,state.seatCountPerRow-1);steps+=1) {
        const targetFacing=sameRowMove(state,referenceFacing,side,steps);
        if(!targetFacing) continue;
        const targetFacee=oppositePerson(state,targetFacing);
        candidates.push({targetFacee,referenceFacee,side,steps});
      }
    }
  }
  const facing=rng.pick(candidates);
  const facingRelative:Sea002Cp006Clue={kind:"FACING_REFERENT_RELATIVE",...facing};
  return [gap,adjacent,nonAdjacent,minimumGap,equalGap,secondFromEnd,notSecondFromEnd,facingRelative];
}

function optionTuple(values:readonly Sea002Cp006Option[]):Sea002Cp006ChildQuestion["options"] {
  if(values.length!==4) throw new Error("CP006 source-realness query requires exactly four options.");
  return values as unknown as Sea002Cp006ChildQuestion["options"];
}

function pairValue(first:string,second:string):string { return [first,second].sort().join(" and "); }

function pairOptions(seed:string,state:Sea002Cp006State,answer:string,correctExplanation:string,eligible:(first:string,second:string)=>boolean):Pick<Sea002Cp006ChildQuestion,"options"|"answerIndex"> {
  const rng=new DeterministicRandom(seed),people=[...state.top,...state.bottom],wrong:string[]=[];
  for(let i=0;i<people.length;i+=1) for(let j=i+1;j<people.length;j+=1) {
    if(!eligible(people[i]!,people[j]!)) continue;
    const value=pairValue(people[i]!,people[j]!);
    if(value!==answer) wrong.push(value);
  }
  const selected=rng.shuffle([...new Set(wrong)]).slice(0,3);
  if(selected.length!==3) throw new Error("CP006 pair query could not build three distractors.");
  const raw:Sea002Cp006Option[]=[
    {value:answer,isCorrect:true,explanation:correctExplanation},
    ...selected.map((value)=>({value,isCorrect:false,misconceptionId:"SEA-MC-ROW-COLUMN_SHIFT" as const,explanation:`${value} does not satisfy the requested pair relation in the solved rows.`})),
  ];
  const options=optionTuple(rng.shuffle(raw));
  return {options,answerIndex:options.findIndex((option)=>option.isCorrect) as 0|1|2|3};
}

function neighbourQuestion(seed:string,state:Sea002Cp006State):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:source-q3-neighbours`);
  const row=rng.pick([state.top,state.bottom] as const);
  const index=rng.integer(1,state.seatCountPerRow-2);
  const reference=row[index]!;
  const answerPair=[row[index-1]!,row[index+1]!].sort();
  const answer=answerPair.join(" and ");
  const combinations:string[]=[];
  const candidates=[...state.top,...state.bottom].filter((person)=>person!==reference);
  for(let i=0;i<candidates.length;i+=1) for(let j=i+1;j<candidates.length;j+=1) {
    const pair=[candidates[i]!,candidates[j]!].sort().join(" and ");
    if(pair!==answer) combinations.push(pair);
  }
  const wrong=rng.shuffle([...new Set(combinations)]).slice(0,3);
  const explanation=`${answerPair[0]} and ${answerPair[1]} occupy the two seats immediately beside ${reference} in the same row.`;
  const raw:Sea002Cp006Option[]=[
    {value:answer,isCorrect:true,explanation},
    ...wrong.map((value)=>({value,isCorrect:false,misconceptionId:"SEA-MC-ROW-COLUMN_SHIFT" as const,explanation:`${value} does not place both persons in the two seats directly beside ${reference}.`})),
  ];
  const options=optionTuple(rng.shuffle(raw));
  const answerIndex=options.findIndex((option)=>option.isCorrect) as 0|1|2|3;
  return {questionOrder:3,queryContractId:"SEA-QC-006",answerType:"PAIR",answerDeterminingFactFingerprint:`NEIGHBOURS:${reference}`,text:`Who are the immediate neighbours of ${reference}?`,options,answerIndex,answer,explanation};
}

function facingPairQuestion(seed:string,state:Sea002Cp006State):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:source-q3-facing-pair`),column=rng.integer(0,state.seatCountPerRow-1);
  const first=state.top[column]!,second=state.bottom[column]!,answer=pairValue(first,second);
  const explanation=`${first} and ${second} occupy the same vertical column in different rows, so they face each other.`;
  const built=pairOptions(`${seed}:source-q3-facing-pair-options`,state,answer,explanation,(a,b)=>!areOpposite(state,a,b));
  return {questionOrder:3,queryContractId:"SEA-QC-014",answerType:"PAIR",answerDeterminingFactFingerprint:`FACING_PAIR:${column}:${answer}`,text:"Which of the following pairs faces each other?",...built,answer,explanation};
}

function endPairQuestion(seed:string,state:Sea002Cp006State):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:source-q3-end-pair`),rowName=rng.pick(["upper","lower"] as const),row=rowName==="upper"?state.top:state.bottom;
  const answer=pairValue(row[0]!,row.at(-1)!);
  const explanation=`${row[0]} and ${row.at(-1)} occupy the two extreme seats of the ${rowName} row.`;
  const built=pairOptions(`${seed}:source-q3-end-pair-options`,state,answer,explanation,()=>true);
  return {questionOrder:3,queryContractId:"SEA-QC-014",answerType:"PAIR",answerDeterminingFactFingerprint:`ROW_END_PAIR:${rowName}:${answer}`,text:`Which pair occupies the two ends of the ${rowName} row?`,...built,answer,explanation};
}

function countBetweenQuestion(seed:string,state:Sea002Cp006State):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:source-q4-count`);
  const row=rng.pick([state.top,state.bottom] as const);
  const first=row[0]!,second=row.at(-1)!;
  const count=state.seatCountPerRow-2;
  const answer=String(count);
  const wrongCounts=rng.shuffle(Array.from({length:state.seatCountPerRow+1},(_,value)=>value).filter((value)=>value!==count)).slice(0,3);
  const explanation=`${first} and ${second} are ${state.seatCountPerRow-1} seat intervals apart in the same row, so ${count} ${count===1?"person sits":"persons sit"} strictly between them.`;
  const raw:Sea002Cp006Option[]=[
    {value:answer,isCorrect:true,explanation},
    ...wrongCounts.map((value)=>({value:String(value),isCorrect:false,misconceptionId:"SEA-MC-ROW-GAP_ENDPOINT_INCLUDED" as const,explanation:`${value} is not the number of occupied seats strictly between ${first} and ${second}; endpoints are not counted.`})),
  ];
  const options=optionTuple(rng.shuffle(raw));
  const answerIndex=options.findIndex((option)=>option.isCorrect) as 0|1|2|3;
  return {questionOrder:4,queryContractId:"SEA-QC-008",answerType:"COUNT",answerDeterminingFactFingerprint:`COUNT_BETWEEN:${first}:${second}`,text:`How many persons sit between ${first} and ${second} in their row?`,options,answerIndex,answer,explanation};
}

function relativePositionQuestion(seed:string,state:Sea002Cp006State):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:source-q4-relation`);
  const row=rng.pick([state.top,state.bottom] as const);
  const referenceIndex=rng.integer(0,state.seatCountPerRow-1);
  let subjectIndex=rng.integer(0,state.seatCountPerRow-2);
  if(subjectIndex>=referenceIndex) subjectIndex+=1;
  const reference=row[referenceIndex]!,subject=row[subjectIndex]!;
  const facing=facingForRow(seatOf(state,reference).row);
  const physical=subjectIndex<referenceIndex?"LEFT":"RIGHT";
  const side:Sea002ParallelSide=facing==="NORTH"?physical:(physical==="LEFT"?"RIGHT":"LEFT");
  const steps=Math.abs(subjectIndex-referenceIndex);
  const answer=relationDisplay(steps,side);
  const alternatives:string[]=[];
  for(const direction of ["LEFT","RIGHT"] as const) for(let distance=1;distance<state.seatCountPerRow;distance+=1) {
    const value=relationDisplay(distance,direction);
    if(value!==answer) alternatives.push(value);
  }
  const wrong=rng.shuffle([...new Set(alternatives)]).slice(0,3);
  const explanation=`${reference} faces ${facing.toLowerCase()}. From ${reference}'s own facing, ${subject} is ${relationDisplay(steps,side).toLowerCase()}.`;
  const raw:Sea002Cp006Option[]=[
    {value:answer,isCorrect:true,explanation},
    ...wrong.map((value,index)=>({value,isCorrect:false,misconceptionId:index===0?"SEA-MC-ROW-FACING_IGNORED" as const:"SEA-MC-ROW-COLUMN_SHIFT" as const,explanation:index===0?`${value} does not use ${reference}'s ${facing.toLowerCase()} facing correctly.`:`${value} has the wrong direction or seat distance from ${reference}.`})),
  ];
  const options=optionTuple(rng.shuffle(raw));
  const answerIndex=options.findIndex((option)=>option.isCorrect) as 0|1|2|3;
  return {questionOrder:4,queryContractId:"SEA-QC-015",answerType:"RELATION",answerDeterminingFactFingerprint:`RELATION:${subject}:${reference}:${facing}`,text:`What is the position of ${subject} with respect to ${reference}?`,options,answerIndex,answer,explanation};
}

function thirdQuestion(seed:string,state:Sea002Cp006State):Sea002Cp006ChildQuestion {
  const selector=stableNumber(`${seed}:source-q3-family`)%3;
  return selector===0?neighbourQuestion(seed,state):selector===1?facingPairQuestion(seed,state):endPairQuestion(seed,state);
}

export function generateSea002Cp006SourceRealCaselet(
  blueprint:Sea002Cp006BlueprintId,
  seed:string,
  seatCountPerRow:number,
):Sea002Cp006Caselet {
  const base=generateSea002Cp006DiscoveryCaselet(blueprint,seed,seatCountPerRow);
  const additions=sourceClues(base.state,seed);
  if(!additions.every((clue)=>cp006SourceClueTrue(base.state,clue))) throw new Error(`${base.caseletId}: invalid source-realness clue.`);
  const clues=[...base.clues,...additions];
  const production=solveCp006(base.people,seatCountPerRow,clues);
  const oracle=auditOracleCp006(base.people,seatCountPerRow,clues);
  if(production.length!==1||oracle.length!==1||canonicalDigest(production[0])!==canonicalDigest(base.state)||canonicalDigest(oracle[0])!==canonicalDigest(base.state)) {
    throw new Error(`${base.caseletId}: source-realness composition lost unique solver/oracle agreement.`);
  }
  const q3=thirdQuestion(seed,base.state);
  const q4=stableNumber(seed)%2===0?countBetweenQuestion(seed,base.state):relativePositionQuestion(seed,base.state);
  const children=[base.children[0],base.children[1],q3,q4] as const;
  if(new Set(children.map((child)=>child.queryContractId)).size!==4) throw new Error(`${base.caseletId}: source-realness query mix is not diverse.`);
  if(new Set(children.map((child)=>child.answerDeterminingFactFingerprint)).size!==4) throw new Error(`${base.caseletId}: duplicate source-realness answer fact.`);
  return {
    ...base,
    clues,
    clueTexts:[...base.clueTexts,...additions.map(renderCp006SourceClue)],
    sharedExplanation:[base.sharedExplanation,"Additional deductions used in this source-backed variant:",...additions.map(renderCp006SourceClue)].join("\n"),
    children,
    structuralFingerprint:canonicalDigest({
      base:base.structuralFingerprint,
      sourceFamilies:additions.map((clue)=>clue.kind==="SAME_ROW_GAP"?`${clue.kind}:${clue.between}`:clue.kind==="SAME_ROW_MIN_BETWEEN"?`${clue.kind}:${clue.minBetween}`:clue.kind==="ROW_END_DISTANCE"?`${clue.kind}:${clue.mode}:${clue.positionFromEnd}`:clue.kind==="FACING_REFERENT_RELATIVE"?`${clue.kind}:${clue.steps}`:clue.kind),
      queryContracts:children.map((child)=>child.queryContractId),
      sourceQuestionFacts:children.slice(2).map((child)=>child.answerDeterminingFactFingerprint.split(":")[0]),
    }),
  };
}
