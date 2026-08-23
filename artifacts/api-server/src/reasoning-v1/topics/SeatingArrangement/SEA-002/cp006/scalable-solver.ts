import type { Sea002Cp006Clue, Sea002Cp006State, Sea002ParallelRow, Sea002ParallelSide } from "./types.ts";

type SeatIndex = number;
type DomainMap = Map<string, readonly SeatIndex[]>;
const DEFAULT_SOLUTION_CAP = 2;

function assertInput(people:readonly string[], seatCountPerRow:number):void {
  if(!Number.isInteger(seatCountPerRow)||seatCountPerRow<1) throw new Error(`Invalid CP006 seat count ${seatCountPerRow}.`);
  if(people.length!==seatCountPerRow*2) throw new Error(`CP006 expected ${seatCountPerRow*2} people, got ${people.length}.`);
  if(new Set(people).size!==people.length) throw new Error("CP006 people must be unique.");
}
function rowOfSeat(seat:SeatIndex,n:number):Sea002ParallelRow { return seat<n?"TOP":"BOTTOM"; }
function oppositeRow(row:Sea002ParallelRow):Sea002ParallelRow { return row==="TOP"?"BOTTOM":"TOP"; }
function colOfSeat(seat:SeatIndex,n:number):number { return seat%n; }
function seatFor(row:Sea002ParallelRow,column:number,n:number):number { return row==="TOP"?column:n+column; }
function relativeDelta(row:Sea002ParallelRow,side:Sea002ParallelSide,steps:number):number {
  return row==="BOTTOM"?(side==="LEFT"?-steps:steps):(side==="LEFT"?steps:-steps);
}
function endDistanceAllowed(column:number,n:number,positionFromEnd:number,mode:"AT_EITHER_END_DISTANCE"|"NOT_AT_EITHER_END_DISTANCE"):boolean {
  const leftColumn=positionFromEnd-1,rightColumn=n-positionFromEnd;
  const at=column===leftColumn||column===rightColumn;
  return mode==="AT_EITHER_END_DISTANCE"?at:!at;
}
function stateFromAssignment(people:readonly string[],n:number,assignment:ReadonlyMap<string,SeatIndex>):Sea002Cp006State {
  const top=Array<string>(n),bottom=Array<string>(n);
  for(const person of people){const seat=assignment.get(person);if(seat===undefined) throw new Error(`Missing CP006 assignment for ${person}.`); const col=colOfSeat(seat,n); if(rowOfSeat(seat,n)==="TOP") top[col]=person; else bottom[col]=person;}
  return {seatCountPerRow:n,top,bottom};
}
function relatedPeople(clue:Sea002Cp006Clue):readonly string[] {
  switch(clue.kind){
    case "ROW_MEMBERSHIP": case "END_POSITION": case "ROW_END_DISTANCE": return [clue.person];
    case "SAME_ROW_RELATIVE": return [clue.target,clue.reference];
    case "FACING_REFERENT_RELATIVE": return [clue.targetFacee,clue.referenceFacee];
    case "SAME_ROW_EQUAL_GAP": return [clue.first,clue.second,clue.third,clue.fourth];
    default:return [clue.first,clue.second];
  }
}
function equalGapSatisfied(clue:Extract<Sea002Cp006Clue,{kind:"SAME_ROW_EQUAL_GAP"}>,seatOfPerson:(person:string)=>SeatIndex|undefined,n:number):boolean {
  const first=seatOfPerson(clue.first),second=seatOfPerson(clue.second),third=seatOfPerson(clue.third),fourth=seatOfPerson(clue.fourth);
  if(first===undefined||second===undefined||third===undefined||fourth===undefined) return true;
  if(rowOfSeat(first,n)!==rowOfSeat(second,n)||rowOfSeat(third,n)!==rowOfSeat(fourth,n)) return false;
  return Math.abs(colOfSeat(first,n)-colOfSeat(second,n))===Math.abs(colOfSeat(third,n)-colOfSeat(fourth,n));
}
function pairSatisfied(clue:Exclude<Sea002Cp006Clue,{kind:"SAME_ROW_EQUAL_GAP"}>,a:string,aSeat:SeatIndex,b:string,bSeat:SeatIndex,n:number):boolean {
  if(clue.kind==="ROW_MEMBERSHIP"||clue.kind==="END_POSITION"||clue.kind==="ROW_END_DISTANCE") return true;
  if(clue.kind==="OPPOSITE"||clue.kind==="NOT_OPPOSITE"||clue.kind==="DIAGONAL"||clue.kind==="SAME_ROW_GAP"||clue.kind==="SAME_ROW_MIN_BETWEEN"||clue.kind==="NOT_ADJACENT"){
    const firstSeat=clue.first===a?aSeat:bSeat,secondSeat=clue.second===a?aSeat:bSeat;
    const same=rowOfSeat(firstSeat,n)===rowOfSeat(secondSeat,n); const columnDelta=Math.abs(colOfSeat(firstSeat,n)-colOfSeat(secondSeat,n));
    if(clue.kind==="OPPOSITE") return !same&&columnDelta===0;
    if(clue.kind==="NOT_OPPOSITE") return !(!same&&columnDelta===0);
    if(clue.kind==="DIAGONAL") return !same&&columnDelta===1;
    if(clue.kind==="SAME_ROW_GAP") return same&&columnDelta===clue.between+1;
    if(clue.kind==="SAME_ROW_MIN_BETWEEN") return same&&columnDelta>=clue.minBetween+1;
    return !(same&&columnDelta===1);
  }
  if(clue.kind==="FACING_REFERENT_RELATIVE"){
    const targetSeat=clue.targetFacee===a?aSeat:bSeat,refSeat=clue.referenceFacee===a?aSeat:bSeat;
    const faceeRow=rowOfSeat(refSeat,n);
    if(rowOfSeat(targetSeat,n)!==faceeRow)return false;
    return colOfSeat(targetSeat,n)===colOfSeat(refSeat,n)+relativeDelta(oppositeRow(faceeRow),clue.side,clue.steps);
  }
  const targetSeat=clue.target===a?aSeat:bSeat,refSeat=clue.reference===a?aSeat:bSeat;
  const refRow=rowOfSeat(refSeat,n);
  if(rowOfSeat(targetSeat,n)!==refRow) return false;
  return colOfSeat(targetSeat,n)===colOfSeat(refSeat,n)+relativeDelta(refRow,clue.side,clue.steps);
}
function buildDomains(people:readonly string[],n:number,clues:readonly Sea002Cp006Clue[]):DomainMap {
  const all=Array.from({length:n*2},(_,i)=>i); const domains=new Map<string,number[]>();
  for(const person of people) domains.set(person,[...all]);
  for(const clue of clues){
    if(clue.kind==="ROW_MEMBERSHIP") domains.set(clue.person,domains.get(clue.person)!.filter(s=>rowOfSeat(s,n)===clue.row));
    if(clue.kind==="END_POSITION") {const col=clue.end==="LEFT"?0:n-1; domains.set(clue.person,domains.get(clue.person)!.filter(s=>s===seatFor(clue.row,col,n)));}
    if(clue.kind==="ROW_END_DISTANCE") domains.set(clue.person,domains.get(clue.person)!.filter(s=>endDistanceAllowed(colOfSeat(s,n),n,clue.positionFromEnd,clue.mode)));
  }
  return domains;
}
function supportsCandidate(person:string,seat:SeatIndex,assignment:ReadonlyMap<string,SeatIndex>,used:ReadonlySet<SeatIndex>,domains:DomainMap,clues:readonly Sea002Cp006Clue[],n:number):boolean {
  for(const clue of clues){const people=relatedPeople(clue); if(!people.includes(person)) continue;
    if(clue.kind==="ROW_MEMBERSHIP"){if(rowOfSeat(seat,n)!==clue.row)return false;continue;}
    if(clue.kind==="END_POSITION"){if(seat!==seatFor(clue.row,clue.end==="LEFT"?0:n-1,n))return false;continue;}
    if(clue.kind==="ROW_END_DISTANCE"){if(!endDistanceAllowed(colOfSeat(seat,n),n,clue.positionFromEnd,clue.mode))return false;continue;}
    if(clue.kind==="SAME_ROW_EQUAL_GAP"){
      const lookup=(name:string):SeatIndex|undefined=>name===person?seat:assignment.get(name);
      if(!equalGapSatisfied(clue,lookup,n)) return false;
      continue;
    }
    const other=people[0]===person?people[1]!:people[0]!; const otherSeat=assignment.get(other);
    if(otherSeat!==undefined){if(!pairSatisfied(clue,person,seat,other,otherSeat,n))return false;continue;}
    const support=domains.get(other)?.some(candidate=>candidate!==seat&&!used.has(candidate)&&pairSatisfied(clue,person,seat,other,candidate,n));
    if(!support)return false;
  }
  return true;
}
export function solveCp006Scalable(people:readonly string[],n:number,clues:readonly Sea002Cp006Clue[],maxSolutions:number=DEFAULT_SOLUTION_CAP):Sea002Cp006State[] {
  assertInput(people,n); if(maxSolutions<1) return [];
  const domains=buildDomains(people,n,clues); for(const person of people) if((domains.get(person)?.length??0)===0) return [];
  const assignment=new Map<string,SeatIndex>(),used=new Set<SeatIndex>(),solutions:Sea002Cp006State[]=[];
  const candidates=(person:string)=>domains.get(person)!.filter(seat=>!used.has(seat)&&supportsCandidate(person,seat,assignment,used,domains,clues,n));
  function visit():void {
    if(solutions.length>=maxSolutions)return;
    if(assignment.size===people.length){solutions.push(stateFromAssignment(people,n,assignment));return;}
    let chosen:string|undefined; let options:number[]|undefined;
    for(const person of people){if(assignment.has(person))continue;const possible=candidates(person);if(possible.length===0)return;if(!options||possible.length<options.length){chosen=person;options=possible;if(options.length===1)break;}}
    for(const seat of options!){assignment.set(chosen!,seat);used.add(seat);visit();used.delete(seat);assignment.delete(chosen!);if(solutions.length>=maxSolutions)return;}
  }
  visit(); return solutions;
}

// Independent audit oracle: seat-first search with its own clue feasibility evaluator.
export function auditOracleCp006Scalable(people:readonly string[],n:number,clues:readonly Sea002Cp006Clue[],maxSolutions:number=DEFAULT_SOLUTION_CAP):Sea002Cp006State[] {
  assertInput(people,n); if(maxSolutions<1)return[];
  const personSeat=new Map<string,number>(),seatPerson=Array<string|undefined>(n*2),solutions:Sea002Cp006State[]=[];
  const unaryAllowed=(person:string,seat:number):boolean=>clues.every(clue=>{
    if(clue.kind==="ROW_MEMBERSHIP"&&clue.person===person)return (seat<n?"TOP":"BOTTOM")===clue.row;
    if(clue.kind==="END_POSITION"&&clue.person===person){const expected=(clue.row==="TOP"?0:n)+(clue.end==="LEFT"?0:n-1);return seat===expected;}
    if(clue.kind==="ROW_END_DISTANCE"&&clue.person===person)return endDistanceAllowed(seat%n,n,clue.positionFromEnd,clue.mode);
    return true;
  });
  const relationOkay=(clue:Sea002Cp006Clue):boolean=>{
    if(clue.kind==="ROW_MEMBERSHIP"||clue.kind==="END_POSITION"||clue.kind==="ROW_END_DISTANCE")return true;
    if(clue.kind==="SAME_ROW_EQUAL_GAP"){
      const a=personSeat.get(clue.first),b=personSeat.get(clue.second),c=personSeat.get(clue.third),d=personSeat.get(clue.fourth);
      if(a===undefined||b===undefined||c===undefined||d===undefined)return true;
      const ar=a<n?0:1,br=b<n?0:1,cr=c<n?0:1,dr=d<n?0:1;
      return ar===br&&cr===dr&&Math.abs((a%n)-(b%n))===Math.abs((c%n)-(d%n));
    }
    const firstName=clue.kind==="SAME_ROW_RELATIVE"?clue.target:clue.kind==="FACING_REFERENT_RELATIVE"?clue.targetFacee:clue.first;
    const secondName=clue.kind==="SAME_ROW_RELATIVE"?clue.reference:clue.kind==="FACING_REFERENT_RELATIVE"?clue.referenceFacee:clue.second;
    const a=personSeat.get(firstName),b=personSeat.get(secondName); if(a===undefined||b===undefined)return true;
    const ar=a<n?0:1,br=b<n?0:1,ac=a%n,bc=b%n;
    if(clue.kind==="OPPOSITE")return ar!==br&&ac===bc;
    if(clue.kind==="NOT_OPPOSITE")return !(ar!==br&&ac===bc);
    if(clue.kind==="DIAGONAL")return ar!==br&&Math.abs(ac-bc)===1;
    if(clue.kind==="SAME_ROW_GAP")return ar===br&&Math.abs(ac-bc)===clue.between+1;
    if(clue.kind==="SAME_ROW_MIN_BETWEEN")return ar===br&&Math.abs(ac-bc)>=clue.minBetween+1;
    if(clue.kind==="NOT_ADJACENT")return !(ar===br&&Math.abs(ac-bc)===1);
    if(clue.kind==="FACING_REFERENT_RELATIVE"){
      if(ar!==br)return false;
      const oppositeReferenceRow:Sea002ParallelRow=br===0?"BOTTOM":"TOP";
      return ac===bc+relativeDelta(oppositeReferenceRow,clue.side,clue.steps);
    }
    if(ar!==br)return false;
    return ac===bc+relativeDelta(br===0?"TOP":"BOTTOM",clue.side,clue.steps);
  };
  const partialOkay=():boolean=>clues.every(relationOkay);
  const personHasSupport=(person:string):boolean=>{
    if(personSeat.has(person))return true;
    for(let seat=0;seat<seatPerson.length;seat+=1){if(seatPerson[seat]!==undefined||!unaryAllowed(person,seat))continue; personSeat.set(person,seat);seatPerson[seat]=person;const okay=partialOkay();seatPerson[seat]=undefined;personSeat.delete(person);if(okay)return true;}
    return false;
  };
  function visit(seat:number):void {
    if(solutions.length>=maxSolutions)return;
    while(seat<seatPerson.length&&seatPerson[seat]!==undefined)seat+=1;
    if(seat===seatPerson.length){if(partialOkay())solutions.push({seatCountPerRow:n,top:seatPerson.slice(0,n) as string[],bottom:seatPerson.slice(n) as string[]});return;}
    const remaining=people.filter(p=>!personSeat.has(p)&&unaryAllowed(p,seat));
    for(const person of remaining){personSeat.set(person,seat);seatPerson[seat]=person;if(partialOkay()&&people.every(personHasSupport))visit(seat+1);seatPerson[seat]=undefined;personSeat.delete(person);if(solutions.length>=maxSolutions)return;}
  }
  visit(0);return solutions;
}
