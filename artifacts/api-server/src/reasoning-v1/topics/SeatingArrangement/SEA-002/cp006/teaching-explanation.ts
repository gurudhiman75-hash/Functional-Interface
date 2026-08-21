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
function directionOnPage(row:"TOP"|"BOTTOM",side:Sea002ParallelSide):"left"|"right" {
  if(row==="BOTTOM") return sideWord(side) as "left"|"right";
  return side==="LEFT"?"right":"left";
}

export function cp006TeachingArrangement(state:Sea002Cp006State):string {
  const columns=Array.from({length:state.seatCountPerRow},(_,index)=>String(index+1)).join("     ");
  const links=Array.from({length:state.seatCountPerRow},()=>"↕").join("     ");
  return [
    `Seat columns:                 ${columns}`,
    `Upper row (faces south ↓):    ${state.top.join("   ")}`,
    `                              ${links}`,
    `Lower row (faces north ↑):    ${state.bottom.join("   ")}`,
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
  if(clue.kind==="ROW_MEMBERSHIP") return `Put ${clue.person} in the ${rowName(clue.row)} row. Keep the exact seat open until another condition fixes it.`;
  if(clue.kind==="OPPOSITE") return `Keep ${clue.first} and ${clue.second} in the same vertical column, one in each row.`;
  if(clue.kind==="NOT_OPPOSITE") return `${clue.first} and ${clue.second} cannot be in the same vertical column.`;
  if(clue.kind==="SAME_ROW_RELATIVE") return `First see which row ${clue.reference} is in. Then count ${clue.steps} seat${clue.steps===1?"":"s"} to ${clue.reference}'s ${sideWord(clue.side)} and place ${clue.target}.`;
  if(clue.kind==="SAME_ROW_GAP") {
    if(clue.between===0) return `Keep ${clue.first} and ${clue.second} next to each other in the same row.`;
    return `Keep ${clue.first} and ${clue.second} in the same row with exactly ${clue.between} ${clue.between===1?"person":"persons"} between them. If both sides are possible, keep both cases for now.`;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") return `Keep ${clue.first} and ${clue.second} in the same row with at least ${clue.minBetween} ${clue.minBetween===1?"person":"persons"} between them.`;
  if(clue.kind==="SAME_ROW_EQUAL_GAP") return `Make the gap between ${clue.first} and ${clue.second} equal to the gap between ${clue.third} and ${clue.fourth}.`;
  if(clue.kind==="NOT_ADJACENT") return `${clue.first} and ${clue.second} cannot occupy neighbouring seats in the same row.`;
  if(clue.kind==="FACING_REFERENT_RELATIVE") return `First find the persons facing ${clue.targetFacee} and ${clue.referenceFacee}. Then place the first one ${clue.steps} seat${clue.steps===1?"":"s"} to the ${sideWord(clue.side)} of the second one.`;
  if(clue.kind==="END_POSITION") return `Put ${clue.person} at the ${clue.end.toLowerCase()} end of the ${rowName(clue.row)} row.`;
  if(clue.kind==="ROW_END_DISTANCE") {
    const position=ordinal(clue.positionFromEnd);
    return clue.mode==="AT_EITHER_END_DISTANCE"
      ? `Count the ${position} seat from both ends of the row for ${clue.person}. Keep both positions possible until another condition decides.`
      : `Remove both ${position}-from-end positions from the possible seats for ${clue.person}.`;
  }
  return `Place ${clue.first} and ${clue.second} in different rows and one column apart. They must be diagonal, not directly opposite.`;
}

function clueResolved(state:Sea002Cp006State,clue:Sea002Cp006Clue):string {
  if(clue.kind==="ROW_MEMBERSHIP") {
    const seat=seatOf(state,clue.person);
    return `${clue.person} belongs to the ${rowName(seat.row)} row.`;
  }
  if(clue.kind==="OPPOSITE") {
    const seat=seatOf(state,clue.first);
    return `${clue.first} and ${clue.second} occupy column ${seat.column+1}, so they face each other.`;
  }
  if(clue.kind==="NOT_OPPOSITE") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return `${clue.first} is in column ${first.column+1} and ${clue.second} is in column ${second.column+1}; hence they do not face each other.`;
  }
  if(clue.kind==="SAME_ROW_RELATIVE") {
    const reference=seatOf(state,clue.reference),target=seatOf(state,clue.target),facing=facingForRow(reference.row),pageSide=directionOnPage(reference.row,clue.side);
    return `${clue.reference} is in the ${rowName(reference.row)} row and faces ${facing.toLowerCase()}. So ${clue.reference}'s ${sideWord(clue.side)} is towards the page ${pageSide}; moving ${clue.steps} seat${clue.steps===1?"":"s"} reaches column ${target.column+1}, where ${clue.target} sits.`;
  }
  if(clue.kind==="SAME_ROW_GAP") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return `${clue.first} and ${clue.second} are in columns ${first.column+1} and ${second.column+1} of the same row, leaving exactly ${clue.between} ${clue.between===1?"person":"persons"} between them.`;
  }
  if(clue.kind==="SAME_ROW_MIN_BETWEEN") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second),between=Math.abs(first.column-second.column)-1;
    return `${clue.first} and ${clue.second} have ${between} ${between===1?"person":"persons"} between them, which satisfies the required minimum.`;
  }
  if(clue.kind==="SAME_ROW_EQUAL_GAP") {
    const a=seatOf(state,clue.first),b=seatOf(state,clue.second),c=seatOf(state,clue.third),d=seatOf(state,clue.fourth);
    const firstGap=Math.abs(a.column-b.column)-1,secondGap=Math.abs(c.column-d.column)-1;
    return `There are ${firstGap} ${firstGap===1?"person":"persons"} between ${clue.first} and ${clue.second}, and ${secondGap} between ${clue.third} and ${clue.fourth}; the two gaps are equal.`;
  }
  if(clue.kind==="NOT_ADJACENT") {
    const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
    return first.row!==second.row
      ? `${clue.first} and ${clue.second} are in different rows, so they are not immediate neighbours in one row.`
      : `${clue.first} and ${clue.second} are in columns ${first.column+1} and ${second.column+1}; they are not next to each other.`;
  }
  if(clue.kind==="FACING_REFERENT_RELATIVE") {
    const target=oppositePerson(state,clue.targetFacee),reference=oppositePerson(state,clue.referenceFacee),refSeat=seatOf(state,reference),facing=facingForRow(refSeat.row);
    return `${target} faces ${clue.targetFacee} and ${reference} faces ${clue.referenceFacee}. ${reference} faces ${facing.toLowerCase()}, and moving ${clue.steps} seat${clue.steps===1?"":"s"} to ${reference}'s ${sideWord(clue.side)} reaches ${target}.`;
  }
  if(clue.kind==="END_POSITION") return `${clue.person} is fixed at the ${clue.end.toLowerCase()} end of the ${rowName(clue.row)} row.`;
  if(clue.kind==="ROW_END_DISTANCE") {
    const seat=seatOf(state,clue.person),fromLeft=seat.column+1,fromRight=state.seatCountPerRow-seat.column;
    return `${clue.person} is ${ordinal(fromLeft)} from the left end and ${ordinal(fromRight)} from the right end, so the condition is satisfied.`;
  }
  const first=seatOf(state,clue.first),second=seatOf(state,clue.second);
  return `${clue.first} and ${clue.second} are in different rows and their columns differ by one (${first.column+1} and ${second.column+1}), so they are diagonally opposite.`;
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

function appendCaseTeaching(lines:string[],branch:TeachingBranch,clues:readonly Sea002Cp006Clue[],clueTexts:readonly string[]):void {
  if(branch.mode==="PREFIX") {
    lines.push(branch.prefixCount===1?"Start with this condition:":"Start with these conditions:");
    for(let index=0;index<branch.prefixCount;index+=1) lines.push(`${index+1}. ${clueAction(clues[index]!)}`);
    lines.push(`At this point, ${branch.cases.length} cases are possible:`);
    for(let index=0;index<branch.cases.length;index+=1) lines.push(`Case ${index+1}:\n${cp006TeachingArrangement(branch.cases[index]!)}`);
    for(const decision of branch.decisions) {
      const clue=clues[decision.clueIndex]!;
      lines.push(`Now use this condition: ${clueTexts[decision.clueIndex]??""}`);
      lines.push(`Meaning: ${clueAction(clue)}`);
      for(const caseIndex of decision.before) {
        lines.push(decision.after.includes(caseIndex)
          ? `Case ${caseIndex+1} ✅ — this condition works here.`
          : `Case ${caseIndex+1} ❌ — this condition does not fit, so reject this case.`);
      }
    }
    lines.push(`Only Case ${branch.survivorIndex+1} remains.`);
    return;
  }

  lines.push("Most positions can be fixed first. Keep one deciding condition for the final check.");
  lines.push(`Before using it, ${branch.cases.length} cases remain:`);
  for(let index=0;index<branch.cases.length;index+=1) lines.push(`Case ${index+1}:\n${cp006TeachingArrangement(branch.cases[index]!)}`);
  const deciding=clues[branch.decidingIndex]!;
  lines.push(`Now use this condition: ${clueTexts[branch.decidingIndex]??""}`);
  lines.push(`Meaning: ${clueAction(deciding)}`);
  for(let index=0;index<branch.cases.length;index+=1) {
    lines.push(index===branch.survivorIndex
      ? `Case ${index+1} ✅ — this condition works here.`
      : `Case ${index+1} ❌ — this condition does not fit, so reject this case.`);
  }
  lines.push(`Only Case ${branch.survivorIndex+1} remains.`);
}

function appendDetailedSteps(lines:string[],state:Sea002Cp006State,clues:readonly Sea002Cp006Clue[]):void {
  lines.push("Now complete and check the arrangement step by step:");
  const memberships=clues.filter((clue):clue is Extract<Sea002Cp006Clue,{kind:"ROW_MEMBERSHIP"}>=>clue.kind==="ROW_MEMBERSHIP");
  let step=1;
  const groupedMembership=memberships.length>=4;
  if(groupedMembership) {
    const upper=memberships.filter((clue)=>clue.row==="TOP").map((clue)=>clue.person);
    const lower=memberships.filter((clue)=>clue.row==="BOTTOM").map((clue)=>clue.person);
    lines.push(`Step ${step}: Mark the given row groups first. Keep their exact order open.`);
    lines.push(`Result: Upper row group — ${upper.join(", ")}. Lower row group — ${lower.join(", ")}.`);
    step+=1;
  }
  for(const clue of clues) {
    if(groupedMembership&&clue.kind==="ROW_MEMBERSHIP") continue;
    lines.push(`Step ${step}: ${clueAction(clue)}`);
    lines.push(`Result: ${clueResolved(state,clue)}`);
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
    "Draw two equal rows first. The upper row faces south and the lower row faces north.",
    "For a person in the upper row, left and right appear reversed on the page because that person faces south. For a person in the lower row, left and right are the same as on the page because that person faces north.",
    "Persons directly facing each other must be in the same vertical column.",
  ];
  const branch=findTeachingBranch(people,state,clues);
  if(branch) appendCaseTeaching(lines,branch,clues,clueTexts);
  else lines.push("Here the conditions fix the arrangement directly, so no separate trial cases are needed. Place the conditions one by one.");

  appendDetailedSteps(lines,state,clues);
  lines.push("Final arrangement:");
  lines.push(cp006TeachingArrangement(state));
  lines.push("Use this final arrangement to answer all the questions that follow.");
  return lines.join("\n\n");
}
