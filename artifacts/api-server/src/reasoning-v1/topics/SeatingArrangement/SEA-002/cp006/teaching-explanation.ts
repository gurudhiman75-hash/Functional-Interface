import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { solveCp006Scalable } from "./scalable-solver.ts";
import { areDiagonal, areOpposite, facingForRow, oppositePerson, sameRowMove, seatOf } from "./topology.ts";
import type { Sea002Cp006Clue, Sea002Cp006State, Sea002ParallelSide } from "./types.ts";

function rowName(row:"TOP"|"BOTTOM"):string { return row==="TOP"?"upper":"lower"; }
function sideWord(side:Sea002ParallelSide):string { return side.toLowerCase(); }
function ordinal(value:number):string {
  if(value===1) return "first";
  if(value===2) return "second";
  if(value===3) return "third";
  if(value===4) return "fourth";
  if(value===5) return "fifth";
  return `${value}th`;
}
function positionCount(value:number):string { return `${value} position${value===1?"":"s"}`; }

export function cp006TeachingArrangement(state:Sea002Cp006State):string {
  const positions=Array.from({length:state.seatCountPerRow},(_,index)=>String(index+1)).join("     ");
  const links=Array.from({length:state.seatCountPerRow},()=>"↕").join("     ");
  return [
    `Positions:                    ${positions}`,
    `Upper row — South ↓:          ${state.top.join("   ")}`,
    `                              ${links}`,
    `Lower row — North ↑:          ${state.bottom.join("   ")}`,
  ].join("\n");
}

function clueTrue(state:Sea002Cp006State,clue:Sea002Cp006Clue):boolean {
  if(clue.kind==="ROW_MEMBERSHIP") return seatOf(state,clue.person).row===clue.row;
  if(clue.kind==="OPPOSITE") return areOpposite(state,clue.first,clue.second);
  if(clue.kind==="NOT_OPPOSITE") return !areOpposite(state,clue.first,clue.second);
  if(clue.kind==="SAME_ROW_RELATIVE") return sameRowMove(state,clue.reference,clue.side,clue.steps)===clue.target;
  if(clue.kind==="SAME_ROW_GAP") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return first.row===second.row&&Math.abs(first.column-second.column)===clue.between+1;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return first.row===second.row&&Math.abs(first.column-second.column)>=clue.minBetween+1;
  }
  if(clue.kind==="SAME_ROW_EQUAL_GAP") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second),third=seatOf(state,clue.third),fourth=seatOf(state,clue.fourth);
    return first.row===second.row&&third.row===fourth.row&&Math.abs(first.column-second.column)===Math.abs(third.column-fourth.column);
  }
  if(clue.kind==="NOT_ADJACENT") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return !(first.row===second.row&&Math.abs(first.column-second.column)===1);
  }
  if(clue.kind==="FACING_REFERENT_RELATIVE") {
    const target=oppositePerson(state,clue.targetFacee),reference=oppositePerson(state,clue.referenceFacee);
    return sameRowMove(state,reference,clue.side,clue.steps)===target;
  }
  if(clue.kind==="END_POSITION") {
    const seat=seatOf(state,clue.person);
    return seat.row===clue.row&&seat.column===(clue.end==="LEFT"?0:state.seatCountPerRow-1);
  }
  if(clue.kind==="ROW_END_DISTANCE") {
    const seat=seatOf(state,clue.person),left=clue.positionFromEnd-1,right=state.seatCountPerRow-clue.positionFromEnd;
    const at=seat.column===left||seat.column===right;
    return clue.mode==="AT_EITHER_END_DISTANCE"?at:!at;
  }
  return areDiagonal(state,clue.first,clue.second);
}

function clueAction(clue:Sea002Cp006Clue):string {
  if(clue.kind==="ROW_MEMBERSHIP") return `${clue.person} → ${rowName(clue.row)} row; position not fixed yet.`;
  if(clue.kind==="OPPOSITE") return `${clue.first} and ${clue.second} must occupy the same position in the two rows.`;
  if(clue.kind==="NOT_OPPOSITE") return `${clue.first} and ${clue.second} must occupy different positions.`;
  if(clue.kind==="SAME_ROW_RELATIVE") return `${clue.target} is ${positionCount(clue.steps)} to the ${sideWord(clue.side)} of ${clue.reference} in the same row.`;
  if(clue.kind==="SAME_ROW_GAP") {
    if(clue.between===0) return `${clue.first} and ${clue.second} must occupy adjacent positions in the same row.`;
    return `${clue.first} and ${clue.second} must be in the same row with a position difference of ${clue.between+1}.`;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") return `${clue.first} and ${clue.second} must be in the same row with a position difference of at least ${clue.minBetween+1}.`;
  if(clue.kind==="SAME_ROW_EQUAL_GAP") return `The position gap between ${clue.first} and ${clue.second} must equal the position gap between ${clue.third} and ${clue.fourth}.`;
  if(clue.kind==="NOT_ADJACENT") return `${clue.first} and ${clue.second} cannot occupy adjacent positions in the same row.`;
  if(clue.kind==="FACING_REFERENT_RELATIVE") return `Find the persons facing ${clue.targetFacee} and ${clue.referenceFacee}; the first is ${positionCount(clue.steps)} to the ${sideWord(clue.side)} of the second.`;
  if(clue.kind==="END_POSITION") return `${clue.person} → ${clue.end.toLowerCase()} end of the ${rowName(clue.row)} row.`;
  if(clue.kind==="ROW_END_DISTANCE") {
    const position=ordinal(clue.positionFromEnd);
    return clue.mode==="AT_EITHER_END_DISTANCE"
      ? `${clue.person} can occupy the ${position} position from either end of the row.`
      : `${clue.person} cannot occupy the ${position} position from either end of the row.`;
  }
  return `${clue.first} and ${clue.second} must be in different rows and adjacent positions.`;
}

function clueResolved(state:Sea002Cp006State,clue:Sea002Cp006Clue):string {
  if(clue.kind==="ROW_MEMBERSHIP") {
    const seat=seatOf(state,clue.person);
    return `${clue.person} → ${rowName(seat.row)} row.`;
  }
  if(clue.kind==="OPPOSITE") {
    const seat=seatOf(state,clue.first);
    return `${clue.first} and ${clue.second} → position ${seat.column+1}; therefore they face each other.`;
  }
  if(clue.kind==="NOT_OPPOSITE") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return `${clue.first} → position ${first.column+1}; ${clue.second} → position ${second.column+1}. Their positions are different.`;
  }
  if(clue.kind==="SAME_ROW_RELATIVE") {
    const reference=seatOf(state,clue.reference),target=seatOf(state,clue.target),facing=facingForRow(reference.row);
    return `${clue.reference} → ${rowName(reference.row)} row, position ${reference.column+1}, facing ${facing.toLowerCase()}. ${positionCount(clue.steps)} to ${clue.reference}'s ${sideWord(clue.side)} gives position ${target.column+1}; therefore ${clue.target} → position ${target.column+1}.`;
  }
  if(clue.kind==="SAME_ROW_GAP") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second),difference=Math.abs(first.column-second.column);
    return `${clue.first} → position ${first.column+1}; ${clue.second} → position ${second.column+1}. Position difference = ${difference}, so ${clue.between} ${clue.between===1?"person sits":"persons sit"} between them.`;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second),between=Math.abs(first.column-second.column)-1;
    return `${clue.first} → position ${first.column+1}; ${clue.second} → position ${second.column+1}. There ${between===1?"is":"are"} ${between} ${between===1?"person":"persons"} between them, so the minimum condition is satisfied.`;
  }
  if(clue.kind==="SAME_ROW_EQUAL_GAP") {
    const a=seatOf(state,clue.first),b=seatOf(state,clue.second),c=seatOf(state,clue.third),d=seatOf(state,clue.fourth);
    const firstGap=Math.abs(a.column-b.column)-1,secondGap=Math.abs(c.column-d.column)-1;
    return `${clue.first}/${clue.second} → positions ${a.column+1} and ${b.column+1} (${firstGap} between); ${clue.third}/${clue.fourth} → positions ${c.column+1} and ${d.column+1} (${secondGap} between). The gaps are equal.`;
  }
  if(clue.kind==="NOT_ADJACENT") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return first.row!==second.row
      ? `${clue.first} → ${rowName(first.row)} row, position ${first.column+1}; ${clue.second} → ${rowName(second.row)} row, position ${second.column+1}. They are in different rows, so they are not immediate neighbours.`
      : `${clue.first} → position ${first.column+1}; ${clue.second} → position ${second.column+1}. These positions are not adjacent.`;
  }
  if(clue.kind==="FACING_REFERENT_RELATIVE") {
    const target=oppositePerson(state,clue.targetFacee),reference=oppositePerson(state,clue.referenceFacee);
    const targetSeat=seatOf(state,target),refSeat=seatOf(state,reference),facing=facingForRow(refSeat.row);
    return `${target} faces ${clue.targetFacee} at position ${targetSeat.column+1}; ${reference} faces ${clue.referenceFacee} at position ${refSeat.column+1}. ${reference} faces ${facing.toLowerCase()}; ${positionCount(clue.steps)} to its ${sideWord(clue.side)} gives position ${targetSeat.column+1}.`;
  }
  if(clue.kind==="END_POSITION") {
    const seat=seatOf(state,clue.person);
    return `${clue.person} → ${rowName(seat.row)} row, position ${seat.column+1} (${clue.end.toLowerCase()} end).`;
  }
  if(clue.kind==="ROW_END_DISTANCE") {
    const seat=seatOf(state,clue.person),fromLeft=seat.column+1,fromRight=state.seatCountPerRow-seat.column;
    return `${clue.person} → position ${seat.column+1}; ${ordinal(fromLeft)} from the left end and ${ordinal(fromRight)} from the right end.`;
  }
  const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
  return `${clue.first} → ${rowName(first.row)} row, position ${first.column+1}; ${clue.second} → ${rowName(second.row)} row, position ${second.column+1}. They are in different rows and adjacent positions, so they are diagonal.`;
}

interface PrefixDecision {
  readonly clueIndex:number;
  readonly before:readonly number[];
  readonly after:readonly number[];
}
interface PrefixTeachingBranch {
  readonly mode:"PREFIX";
  readonly prefixCount:number;
  readonly cases:readonly Sea002Cp006State[];
  readonly decisions:readonly PrefixDecision[];
  readonly survivorIndex:number;
}
interface DecidingTeachingBranch {
  readonly mode:"DECIDING";
  readonly decidingIndex:number;
  readonly cases:readonly Sea002Cp006State[];
  readonly survivorIndex:number;
}
type TeachingBranch=PrefixTeachingBranch|DecidingTeachingBranch;

function findPrefixTeachingBranch(people:readonly string[],state:Sea002Cp006State,clues:readonly Sea002Cp006Clue[]):PrefixTeachingBranch|null {
  const finalKey=canonicalDigest(state);
  for(let prefixCount=1;prefixCount<clues.length;prefixCount+=1) {
    const cases=solveCp006Scalable(people,state.seatCountPerRow,clues.slice(0,prefixCount),4);
    if(cases.length<2||cases.length>3) continue;
    const finalIndex=cases.findIndex((candidate)=>canonicalDigest(candidate)===finalKey);
    if(finalIndex<0) continue;
    let live=cases.map((_,index)=>index);
    const decisions:PrefixDecision[]=[];
    for(let clueIndex=prefixCount;clueIndex<clues.length&&live.length>1;clueIndex+=1) {
      const after=live.filter((caseIndex)=>clueTrue(cases[caseIndex]!,clues[clueIndex]!));
      if(after.length===0||after.length===live.length) continue;
      decisions.push({clueIndex,before:[...live],after:[...after]});
      live=after;
    }
    if(live.length===1&&live[0]===finalIndex&&decisions.length>0) return {mode:"PREFIX",prefixCount,cases,decisions,survivorIndex:finalIndex};
  }
  return null;
}

function findDecidingTeachingBranch(people:readonly string[],state:Sea002Cp006State,clues:readonly Sea002Cp006Clue[]):DecidingTeachingBranch|null {
  const priority:readonly Sea002Cp006Clue["kind"][]=["ROW_END_DISTANCE","SAME_ROW_GAP","SAME_ROW_RELATIVE","FACING_REFERENT_RELATIVE","DIAGONAL","OPPOSITE","SAME_ROW_EQUAL_GAP","END_POSITION","NOT_ADJACENT","SAME_ROW_MIN_BETWEEN","NOT_OPPOSITE","ROW_MEMBERSHIP"];
  const finalKey=canonicalDigest(state);
  for(const kind of priority) {
    for(let decidingIndex=0;decidingIndex<clues.length;decidingIndex+=1) {
      if(clues[decidingIndex]?.kind!==kind) continue;
      const before=clues.filter((_,index)=>index!==decidingIndex);
      const cases=solveCp006Scalable(people,state.seatCountPerRow,before,4);
      if(cases.length<2||cases.length>3) continue;
      const survivorIndexes=cases.map((candidate,index)=>clueTrue(candidate,clues[decidingIndex]!)?index:-1).filter((index)=>index>=0);
      if(survivorIndexes.length!==1) continue;
      const survivorIndex=survivorIndexes[0]!;
      if(canonicalDigest(cases[survivorIndex])!==finalKey) continue;
      return {mode:"DECIDING",decidingIndex,cases,survivorIndex};
    }
  }
  return null;
}

function findTeachingBranch(people:readonly string[],state:Sea002Cp006State,clues:readonly Sea002Cp006Clue[]):TeachingBranch|null {
  return findPrefixTeachingBranch(people,state,clues)??findDecidingTeachingBranch(people,state,clues);
}

function appendActionList(lines:string[],actionClues:readonly Sea002Cp006Clue[]):void {
  const memberships=actionClues.filter((clue):clue is Extract<Sea002Cp006Clue,{kind:"ROW_MEMBERSHIP"}>=>clue.kind==="ROW_MEMBERSHIP");
  let number=1;
  if(memberships.length>=2) {
    const upper=memberships.filter((clue)=>clue.row==="TOP").map((clue)=>clue.person);
    const lower=memberships.filter((clue)=>clue.row==="BOTTOM").map((clue)=>clue.person);
    const groups=[upper.length?`upper — ${upper.join(", ")}`:"",lower.length?`lower — ${lower.join(", ")}`:""].filter(Boolean).join("; ");
    lines.push(`${number}. Row groups: ${groups}. Keep exact positions open.`);
    number+=1;
  }
  for(const clue of actionClues) {
    if(memberships.length>=2&&clue.kind==="ROW_MEMBERSHIP") continue;
    lines.push(`${number}. ${clueAction(clue)}`);
    number+=1;
  }
}

function appendCaseTeaching(lines:string[],branch:TeachingBranch,clues:readonly Sea002Cp006Clue[],clueTexts:readonly string[]):void {
  if(branch.mode==="PREFIX") {
    lines.push(branch.prefixCount===1?"Use this condition first:":"Use these conditions first:");
    appendActionList(lines,clues.slice(0,branch.prefixCount));
    lines.push(`${branch.cases.length} arrangements are possible:`);
    for(let index=0;index<branch.cases.length;index+=1) lines.push(`Case ${index+1}:\n${cp006TeachingArrangement(branch.cases[index]!)}`);
    for(const decision of branch.decisions) {
      lines.push(`Next condition: ${clueTexts[decision.clueIndex]??""}`);
      for(const caseIndex of decision.before) {
        lines.push(decision.after.includes(caseIndex)
          ? `Case ${caseIndex+1} ✅ — fits.`
          : `Case ${caseIndex+1} ❌ — does not fit; reject it.`);
      }
    }
    lines.push(`Only Case ${branch.survivorIndex+1} remains.`);
    return;
  }

  lines.push(`${branch.cases.length} arrangements remain before the deciding condition:`);
  for(let index=0;index<branch.cases.length;index+=1) lines.push(`Case ${index+1}:\n${cp006TeachingArrangement(branch.cases[index]!)}`);
  lines.push(`Next condition: ${clueTexts[branch.decidingIndex]??""}`);
  for(let index=0;index<branch.cases.length;index+=1) {
    lines.push(index===branch.survivorIndex
      ? `Case ${index+1} ✅ — fits.`
      : `Case ${index+1} ❌ — does not fit; reject it.`);
  }
  lines.push(`Only Case ${branch.survivorIndex+1} remains.`);
}

function appendDetailedSteps(lines:string[],state:Sea002Cp006State,clues:readonly Sea002Cp006Clue[]):void {
  lines.push("Working:");
  const memberships=clues.filter((clue):clue is Extract<Sea002Cp006Clue,{kind:"ROW_MEMBERSHIP"}>=>clue.kind==="ROW_MEMBERSHIP");
  let step=1;
  if(memberships.length>=2) {
    const upper=memberships.filter((clue)=>clue.row==="TOP").map((clue)=>clue.person);
    const lower=memberships.filter((clue)=>clue.row==="BOTTOM").map((clue)=>clue.person);
    const groups=[upper.length?`upper — ${upper.join(", ")}`:"",lower.length?`lower — ${lower.join(", ")}`:""].filter(Boolean).join("; ");
    lines.push(`Step ${step}: Mark row groups: ${groups}.`);
    lines.push("Position: Exact positions are still open.");
    step+=1;
  }
  for(const clue of clues) {
    if(memberships.length>=2&&clue.kind==="ROW_MEMBERSHIP") continue;
    lines.push(`Step ${step}: ${clueAction(clue)}`);
    lines.push(`Position: ${clueResolved(state,clue)}`);
    step+=1;
  }
}

export function compileCp006TeachingExplanation(
  state:Sea002Cp006State,
  people:readonly string[],
  clues:readonly Sea002Cp006Clue[],
  clueTexts:readonly string[],
):string {
  const lines:string[]=[
    `Use positions 1 to ${state.seatCountPerRow} from left to right. Upper row faces south and lower row faces north; persons at the same position in the two rows face each other.`,
  ];
  const branch=findTeachingBranch(people,state,clues);
  if(branch) appendCaseTeaching(lines,branch,clues,clueTexts);
  appendDetailedSteps(lines,state,clues);
  lines.push("Final arrangement:");
  lines.push(cp006TeachingArrangement(state));
  return lines.join("\n\n");
}