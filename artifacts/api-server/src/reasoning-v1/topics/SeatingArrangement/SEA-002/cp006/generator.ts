import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../../SEA-001/canonical.ts";
import {
  areDiagonal,
  areOpposite,
  facingForRow,
  oppositePerson,
  personAt,
  sameRow,
  sameRowMove,
  seatOf,
} from "./topology.ts";
import type {
  Sea002Cp006BlueprintId,
  Sea002Cp006Caselet,
  Sea002Cp006ChildQuestion,
  Sea002Cp006Clue,
  Sea002Cp006Option,
  Sea002Cp006State,
  Sea002ParallelRow,
  Sea002ParallelSide,
  Sea002PersonId,
} from "./types.ts";

const PERSON_POOL = [
  "Aarav", "Aditi", "Akash", "Ananya", "Bhavna", "Charan", "Deepak", "Diya", "Farah", "Gauri",
  "Harjit", "Hema", "Isha", "Jasleen", "Kabir", "Kavita", "Kiran", "Komal", "Lakshya", "Mandeep",
  "Manvi", "Mehak", "Mohit", "Naveen", "Neha", "Nikhil", "Palak", "Raman", "Ravinder", "Riya",
  "Rohan", "Sahil", "Sakshi", "Simran", "Sonam", "Taran", "Uday", "Varun", "Vikas", "Zoya",
] as const;

const BLUEPRINT_CONTRACT: Readonly<Record<Sea002Cp006BlueprintId, string>> = Object.freeze({
  "SEA-PBA-021": "fixed row membership with opposites",
  "SEA-PBA-022": "row membership partly inferred",
  "SEA-PBA-023": "same-row chains linked by opposite seats",
  "SEA-PBA-024": "opposite/not-opposite/diagonal/endpoint mix",
});

function permutations<T>(values: readonly T[]): T[][] {
  const output: T[][] = [];
  const current = [...values];
  function visit(index: number): void {
    if (index === current.length) { output.push([...current]); return; }
    for (let swap = index; swap < current.length; swap += 1) {
      [current[index], current[swap]] = [current[swap] as T, current[index] as T];
      visit(index + 1);
      [current[index], current[swap]] = [current[swap] as T, current[index] as T];
    }
  }
  visit(0);
  return output;
}

function stateFromPermutation(permutation: readonly string[], seatCountPerRow: number): Sea002Cp006State {
  return {
    seatCountPerRow,
    top: permutation.slice(0, seatCountPerRow),
    bottom: permutation.slice(seatCountPerRow, seatCountPerRow * 2),
  };
}

export function cp006ClueTrue(state: Sea002Cp006State, clue: Sea002Cp006Clue): boolean {
  switch (clue.kind) {
    case "ROW_MEMBERSHIP": return seatOf(state, clue.person).row === clue.row;
    case "OPPOSITE": return areOpposite(state, clue.first, clue.second);
    case "NOT_OPPOSITE": return !areOpposite(state, clue.first, clue.second);
    case "SAME_ROW_RELATIVE": return sameRowMove(state, clue.reference, clue.side, clue.steps) === clue.target;
    case "END_POSITION": {
      const seat = seatOf(state, clue.person);
      return seat.row === clue.row && seat.column === (clue.end === "LEFT" ? 0 : state.seatCountPerRow - 1);
    }
    case "DIAGONAL": return areDiagonal(state, clue.first, clue.second);
  }
}

export function solveCp006(people: readonly string[], seatCountPerRow: number, clues: readonly Sea002Cp006Clue[]): Sea002Cp006State[] {
  return permutations(people)
    .map((permutation) => stateFromPermutation(permutation, seatCountPerRow))
    .filter((state) => clues.every((clue) => cp006ClueTrue(state, clue)));
}

// Independent finite-model audit oracle. It intentionally does not call the production
// topology helpers or production clue evaluator.
export function auditOracleCp006(people: readonly string[], seatCountPerRow: number, clues: readonly Sea002Cp006Clue[]): Sea002Cp006State[] {
  const states: Sea002Cp006State[] = [];
  for (const permutation of permutations(people)) {
    const index = new Map<string, number>();
    permutation.forEach((person, position) => index.set(person, position));
    const rowOf = (person: string): Sea002ParallelRow => (index.get(person)! < seatCountPerRow ? "TOP" : "BOTTOM");
    const colOf = (person: string): number => index.get(person)! % seatCountPerRow;
    const clueTrue = (clue: Sea002Cp006Clue): boolean => {
      switch (clue.kind) {
        case "ROW_MEMBERSHIP": return rowOf(clue.person) === clue.row;
        case "OPPOSITE": return rowOf(clue.first) !== rowOf(clue.second) && colOf(clue.first) === colOf(clue.second);
        case "NOT_OPPOSITE": return !(rowOf(clue.first) !== rowOf(clue.second) && colOf(clue.first) === colOf(clue.second));
        case "SAME_ROW_RELATIVE": {
          if (rowOf(clue.target) !== rowOf(clue.reference)) return false;
          const refRow = rowOf(clue.reference);
          const delta = refRow === "BOTTOM"
            ? (clue.side === "LEFT" ? -clue.steps : clue.steps)
            : (clue.side === "LEFT" ? clue.steps : -clue.steps);
          return colOf(clue.target) === colOf(clue.reference) + delta;
        }
        case "END_POSITION": return rowOf(clue.person) === clue.row && colOf(clue.person) === (clue.end === "LEFT" ? 0 : seatCountPerRow - 1);
        case "DIAGONAL": return rowOf(clue.first) !== rowOf(clue.second) && Math.abs(colOf(clue.first) - colOf(clue.second)) === 1;
      }
    };
    if (clues.every(clueTrue)) states.push(stateFromPermutation(permutation, seatCountPerRow));
  }
  return states;
}

function clueKey(clue: Sea002Cp006Clue): string { return canonicalDigest(clue); }

function trueCluePool(state: Sea002Cp006State): Sea002Cp006Clue[] {
  const people = [...state.top, ...state.bottom];
  const clues: Sea002Cp006Clue[] = [];
  for (const person of people) clues.push({ kind: "ROW_MEMBERSHIP", person, row: seatOf(state, person).row });
  for (let column = 0; column < state.seatCountPerRow; column += 1) {
    clues.push({ kind: "OPPOSITE", first: state.top[column]!, second: state.bottom[column]! });
  }
  for (const row of [state.top, state.bottom]) {
    for (const reference of row) {
      for (const side of ["LEFT", "RIGHT"] as const) {
        for (const steps of [1, 2]) {
          const target = sameRowMove(state, reference, side, steps);
          if (target) clues.push({ kind: "SAME_ROW_RELATIVE", target, reference, side, steps });
        }
      }
    }
  }
  for (const row of ["TOP", "BOTTOM"] as const) {
    const members = row === "TOP" ? state.top : state.bottom;
    clues.push({ kind: "END_POSITION", person: members[0]!, row, end: "LEFT" });
    clues.push({ kind: "END_POSITION", person: members.at(-1)!, row, end: "RIGHT" });
  }
  for (const top of state.top) {
    for (const bottom of state.bottom) {
      if (!areOpposite(state, top, bottom)) clues.push({ kind: "NOT_OPPOSITE", first: top, second: bottom });
      if (areDiagonal(state, top, bottom)) clues.push({ kind: "DIAGONAL", first: top, second: bottom });
    }
  }
  const unique = new Map<string, Sea002Cp006Clue>();
  for (const clue of clues) unique.set(clueKey(clue), clue);
  return [...unique.values()];
}

function firstOfKind(pool: readonly Sea002Cp006Clue[], kind: Sea002Cp006Clue["kind"], used: Set<string>): Sea002Cp006Clue {
  const clue = pool.find((candidate) => candidate.kind === kind && !used.has(clueKey(candidate)));
  if (!clue) throw new Error(`SEA-002 CP006 missing true clue family ${kind}`);
  used.add(clueKey(clue));
  return clue;
}

function mandatoryClues(blueprint: Sea002Cp006BlueprintId, state: Sea002Cp006State, pool: readonly Sea002Cp006Clue[]): Sea002Cp006Clue[] {
  const used = new Set<string>();
  const output: Sea002Cp006Clue[] = [];
  const add = (clue: Sea002Cp006Clue) => { const key=clueKey(clue); if(!used.has(key)){used.add(key);output.push(clue);} };
  if (blueprint === "SEA-PBA-021") {
    for (const person of [...state.top, ...state.bottom]) add({ kind: "ROW_MEMBERSHIP", person, row: seatOf(state, person).row });
    add(firstOfKind(pool, "OPPOSITE", used));
    add(firstOfKind(pool, "SAME_ROW_RELATIVE", used));
  } else if (blueprint === "SEA-PBA-022") {
    add({ kind: "ROW_MEMBERSHIP", person: state.top[1]!, row: "TOP" });
    add({ kind: "ROW_MEMBERSHIP", person: state.bottom[1]!, row: "BOTTOM" });
    add(firstOfKind(pool, "OPPOSITE", used));
    add(firstOfKind(pool, "SAME_ROW_RELATIVE", used));
    add(firstOfKind(pool, "DIAGONAL", used));
  } else if (blueprint === "SEA-PBA-023") {
    add({ kind: "ROW_MEMBERSHIP", person: state.top[1]!, row: "TOP" });
    add(firstOfKind(pool, "OPPOSITE", used));
    const relative = pool.filter((clue) => clue.kind === "SAME_ROW_RELATIVE");
    for (const clue of relative.slice(0, 3)) add(clue);
  } else {
    add(firstOfKind(pool, "OPPOSITE", used));
    add(firstOfKind(pool, "NOT_OPPOSITE", used));
    add(firstOfKind(pool, "DIAGONAL", used));
    add(firstOfKind(pool, "END_POSITION", used));
  }
  return output;
}

function allowedFiller(blueprint: Sea002Cp006BlueprintId, clue: Sea002Cp006Clue): boolean {
  if (blueprint === "SEA-PBA-022") return clue.kind !== "ROW_MEMBERSHIP";
  if (blueprint === "SEA-PBA-023") return clue.kind !== "ROW_MEMBERSHIP" || false;
  if (blueprint === "SEA-PBA-024") return clue.kind !== "ROW_MEMBERSHIP";
  return true;
}

function selectUniqueClues(blueprint: Sea002Cp006BlueprintId, state: Sea002Cp006State, people: readonly string[], rng: DeterministicRandom): Sea002Cp006Clue[] {
  const pool = trueCluePool(state);
  const selected = mandatoryClues(blueprint, state, pool);
  const selectedKeys = new Set(selected.map(clueKey));
  const filler = rng.shuffle(pool.filter((clue) => allowedFiller(blueprint, clue) && !selectedKeys.has(clueKey(clue))));
  let solutions = solveCp006(people, state.seatCountPerRow, selected);
  for (const clue of filler) {
    if (solutions.length === 1) break;
    selected.push(clue);
    selectedKeys.add(clueKey(clue));
    solutions = solutions.filter((candidate) => cp006ClueTrue(candidate, clue));
  }
  if (solutions.length !== 1) throw new Error(`${blueprint}: could not reach a unique CP006 arrangement.`);
  const hiddenFingerprint = canonicalDigest(state);
  if (canonicalDigest(solutions[0]) !== hiddenFingerprint) throw new Error(`${blueprint}: unique solution does not match hidden state.`);

  // Remove redundant filler clues while keeping the blueprint-defining mandatory prefix intact.
  const mandatoryCount = mandatoryClues(blueprint, state, pool).length;
  for (let index = selected.length - 1; index >= mandatoryCount; index -= 1) {
    const candidate = selected.filter((_, clueIndex) => clueIndex !== index);
    if (solveCp006(people, state.seatCountPerRow, candidate).length === 1) selected.splice(index, 1);
  }
  return selected;
}

function ordinal(steps: number): string { return steps === 1 ? "immediately" : steps === 2 ? "second" : `${steps}th`; }
function rowText(row: Sea002ParallelRow): string { return row === "TOP" ? "upper" : "lower"; }
function sideText(side: Sea002ParallelSide): string { return side.toLowerCase(); }

export function renderCp006Clue(clue: Sea002Cp006Clue): string {
  switch (clue.kind) {
    case "ROW_MEMBERSHIP": return `${clue.person} sits in the ${rowText(clue.row)} row.`;
    case "OPPOSITE": return `${clue.first} sits exactly opposite ${clue.second}.`;
    case "NOT_OPPOSITE": return `${clue.first} does not sit opposite ${clue.second}.`;
    case "SAME_ROW_RELATIVE": return `${clue.target} sits ${ordinal(clue.steps)} to the ${sideText(clue.side)} of ${clue.reference}.`;
    case "END_POSITION": return `${clue.person} sits at the ${clue.end.toLowerCase()} end of the ${rowText(clue.row)} row.`;
    case "DIAGONAL": return `${clue.first} sits diagonally opposite ${clue.second}.`;
  }
}

function setupText(blueprint: Sea002Cp006BlueprintId, people: readonly string[], state: Sea002Cp006State): string {
  const base = `${people.length} persons—${people.slice(0,-1).join(", ")} and ${people.at(-1)}—are seated in two parallel rows of ${state.seatCountPerRow} seats each. The persons in the upper row face south and those in the lower row face north. Seats in the same vertical column are exactly opposite each other.`;
  if (blueprint === "SEA-PBA-021") return `${base} The row membership of every person is given in the conditions below; their order within each row is not known.`;
  if (blueprint === "SEA-PBA-022") return `${base} Only part of the row membership is stated directly; the remaining row identities must be deduced.`;
  if (blueprint === "SEA-PBA-023") return `${base} Use the same-row chains together with the opposite-seat links to determine the arrangement.`;
  return `${base} The conditions mix opposite, not-opposite, diagonal and endpoint information.`;
}

function renderedClueTexts(blueprint: Sea002Cp006BlueprintId, clues: readonly Sea002Cp006Clue[], state: Sea002Cp006State): string[] {
  if (blueprint !== "SEA-PBA-021") return clues.map(renderCp006Clue);
  const nonMembership = clues.filter((clue) => clue.kind !== "ROW_MEMBERSHIP").map(renderCp006Clue);
  return [
    `${state.top.join(", ")} sit in the upper row, while ${state.bottom.join(", ")} sit in the lower row.`,
    ...nonMembership,
  ];
}

function diagramText(state: Sea002Cp006State): string {
  const columns = Array.from({length:state.seatCountPerRow},(_,i)=>`C${i+1}`).join("     ");
  return [
    `Observer columns: ${columns}`,
    `Upper row (faces south ↓): ${state.top.join("   ")}`,
    `                           ${state.top.map(()=>"↕").join("     ")}`,
    `Lower row (faces north ↑): ${state.bottom.join("   ")}`,
  ].join("\n");
}

function diagramSvg(state: Sea002Cp006State): string {
  const width=820, height=300, startX=140, gap=220;
  const seats=(row:"TOP"|"BOTTOM", y:number, people:readonly string[], arrow:string)=>people.map((person,index)=>{
    const x=startX+index*gap;
    return `<g><rect x="${x-62}" y="${y-28}" width="124" height="56" rx="9" fill="white" stroke="black"/><text x="${x}" y="${y-2}" text-anchor="middle" font-size="16">${person}</text><text x="${x}" y="${y+18}" text-anchor="middle" font-size="15">${arrow}</text><text x="${x}" y="${y-42}" text-anchor="middle" font-size="12">C${index+1}</text></g>`;
  }).join("");
  const links=Array.from({length:state.seatCountPerRow},(_,index)=>{const x=startX+index*gap;return `<line x1="${x}" y1="112" x2="${x}" y2="188" stroke="#555" stroke-dasharray="5 5"/>`;}).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Solved parallel-row seating"><rect width="100%" height="100%" fill="white"/><text x="25" y="30" font-size="18" font-weight="700">Solved parallel rows</text><text x="25" y="58" font-size="13">Columns are observer coordinates; dashed lines join opposite seats.</text>${seats("TOP",90,state.top,"↓")}${links}${seats("BOTTOM",210,state.bottom,"↑")}</svg>`;
}

function optionTuple(values: readonly Sea002Cp006Option[]): readonly [Sea002Cp006Option,Sea002Cp006Option,Sea002Cp006Option,Sea002Cp006Option] {
  if(values.length!==4) throw new Error("CP006 requires exactly four options");
  return values as unknown as readonly [Sea002Cp006Option,Sea002Cp006Option,Sea002Cp006Option,Sea002Cp006Option];
}

function personOptions(seed:string, answer:string, people:readonly string[], correctExplanation:string, trapExplanation:(value:string,index:number)=>Sea002Cp006Option): Pick<Sea002Cp006ChildQuestion,"options"|"answerIndex"> {
  const rng=new DeterministicRandom(seed);
  const wrong=rng.shuffle(people.filter((person)=>person!==answer)).slice(0,3);
  const raw:Sea002Cp006Option[]=[{value:answer,isCorrect:true,explanation:correctExplanation},...wrong.map((value,index)=>trapExplanation(value,index))];
  const options=optionTuple(rng.shuffle(raw));
  const answerIndex=options.findIndex((option)=>option.isCorrect) as 0|1|2|3;
  return {options,answerIndex};
}

function oppositeQuestion(seed:string,state:Sea002Cp006State,people:readonly string[]):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:q1`); const reference=rng.pick(people); const answer=oppositePerson(state,reference);
  const explanation=`${reference} and ${answer} occupy the same observer column in different rows, so ${answer} sits exactly opposite ${reference}.`;
  return {questionOrder:1,queryContractId:"SEA-QC-010",answerType:"PERSON",answerDeterminingFactFingerprint:`OPPOSITE:${reference}`,text:`Who sits exactly opposite ${reference}?`,answer,explanation,...personOptions(`${seed}:q1:options`,answer,people,explanation,(value,index)=>({value,isCorrect:false,misconceptionId:index===0?"SEA-MC-ROW-DIAGONAL_FOR_OPPOSITE":"SEA-MC-ROW-COLUMN_SHIFT",explanation:index===0?`${value} is in the other row but not in ${reference}'s exact column; that is not an opposite seat.`:`${value} does not share ${reference}'s observer column.`}))};
}

function relativeQuestion(seed:string,state:Sea002Cp006State,people:readonly string[]):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:q2`); const candidates: {reference:string;side:Sea002ParallelSide;steps:number;answer:string}[]=[];
  for(const reference of people) for(const side of ["LEFT","RIGHT"] as const) for(const steps of [1,2]) { const answer=sameRowMove(state,reference,side,steps); if(answer)candidates.push({reference,side,steps,answer}); }
  const picked=rng.pick(candidates); const refSeat=seatOf(state,picked.reference); const facing=facingForRow(refSeat.row); const observerDirection=facing==="NORTH"?(picked.side==="LEFT"?"left":"right"):(picked.side==="LEFT"?"right":"left");
  const explanation=`${picked.reference} is in the ${rowText(refSeat.row)} row and faces ${facing.toLowerCase()}. Therefore ${picked.reference}'s ${picked.side.toLowerCase()} is towards the observer's ${observerDirection}; moving ${picked.steps} seat${picked.steps===1?"":"s"} reaches ${picked.answer}.`;
  return {questionOrder:2,queryContractId:"SEA-QC-003",answerType:"PERSON",answerDeterminingFactFingerprint:`REL:${picked.reference}:${picked.side}:${picked.steps}`,text:`Who sits ${ordinal(picked.steps)} to the ${picked.side.toLowerCase()} of ${picked.reference}?`,answer:picked.answer,explanation,...personOptions(`${seed}:q2:options`,picked.answer,people,explanation,(value,index)=>({value,isCorrect:false,misconceptionId:index===0?"SEA-MC-ROW-OBSERVER_LEFT_USED":index===1?"SEA-MC-ROW-FACING_IGNORED":"SEA-MC-ROW-COLUMN_SHIFT",explanation:index===0?`${value} is obtained by reading page-left/page-right instead of ${picked.reference}'s own facing.`:index===1?`${value} does not follow the ${facing.toLowerCase()}-facing direction rule for ${picked.reference}.`:`${value} is in a different column from the required ${picked.steps}-seat move.`}))};
}

function sameRowQuestion(seed:string,state:Sea002Cp006State,people:readonly string[]):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:q3`); const reference=rng.pick(people); const refSeat=seatOf(state,reference); const rowMembers=(refSeat.row==="TOP"?state.top:state.bottom).filter((person)=>person!==reference); const answer=rng.pick(rowMembers); const otherRow=refSeat.row==="TOP"?state.bottom:state.top;
  const explanation=`${reference} and ${answer} are both seated in the ${rowText(refSeat.row)} row. Therefore ${answer} is in the same row as ${reference}.`;
  const raw:Sea002Cp006Option[]=[{value:answer,isCorrect:true,explanation},...otherRow.map((value)=>({value,isCorrect:false,misconceptionId:"SEA-MC-ROW-SAME_ROW_FOR_OTHER_ROW" as const,explanation:`${value} sits in the other row, so ${value} cannot be in the same row as ${reference}.`}))];
  const options=optionTuple(rng.shuffle(raw.slice(0,4))); const answerIndex=options.findIndex((option)=>option.isCorrect) as 0|1|2|3;
  return {questionOrder:3,queryContractId:"SEA-QC-011",answerType:"PERSON",answerDeterminingFactFingerprint:`SAME_ROW:${reference}:${answer}`,text:`Which of the following sits in the same row as ${reference}?`,options,answerIndex,answer,explanation};
}

function diagonalQuestion(seed:string,state:Sea002Cp006State,people:readonly string[]):Sea002Cp006ChildQuestion {
  const rng=new DeterministicRandom(`${seed}:q4`); const endpointPeople=[state.top[0]!,state.top.at(-1)!,state.bottom[0]!,state.bottom.at(-1)!]; const reference=rng.pick(endpointPeople); const seat=seatOf(state,reference); const otherRow=seat.row==="TOP"?"BOTTOM":"TOP"; const diagonalColumn=seat.column===0?1:state.seatCountPerRow-2; const answer=personAt(state,{row:otherRow,column:diagonalColumn})!;
  const explanation=`${reference} is at an end column. ${answer} is in the other row one column away, so ${answer} is diagonally opposite ${reference}; the person in the same column would be directly opposite.`;
  return {questionOrder:4,queryContractId:"SEA-QC-012",answerType:"PERSON",answerDeterminingFactFingerprint:`DIAGONAL:${reference}:${answer}`,text:`Who sits diagonally opposite ${reference}?`,answer,explanation,...personOptions(`${seed}:q4:options`,answer,people,explanation,(value,index)=>({value,isCorrect:false,misconceptionId:index===0?"SEA-MC-ROW-DIAGONAL_FOR_OPPOSITE":index===1?"SEA-MC-ROW-SAME_ROW_FOR_OTHER_ROW":"SEA-MC-ROW-COLUMN_SHIFT",explanation:index===0?`${value} is not one column away in the other row; do not confuse direct opposite with diagonal.`:index===1?`${value} is not in the required cross-row diagonal seat.`:`${value} is in the wrong column for the diagonal relation.`}))};
}

function sharedExplanation(state:Sea002Cp006State,clues:readonly Sea002Cp006Clue[]):string {
  const steps=[
    "First mark the two rows and their fixed facings. The upper row faces south, so that person's left is towards the observer's right. The lower row faces north, so left stays towards the observer's left.",
    "Next keep vertical columns fixed. Persons in the same column are opposite; diagonal seats are in the other row and one column away.",
    ...clues.map((clue,index)=>`Clue ${index+1}: ${renderCp006Clue(clue)}`),
    "Combining these conditions leaves one arrangement only.",
    diagramText(state),
  ];
  return steps.join("\n");
}

export function generateSea002Cp006Caselet(blueprint:Sea002Cp006BlueprintId,seed:string):Sea002Cp006Caselet {
  const rng=new DeterministicRandom(`sea002:cp006:${blueprint}:${seed}`);
  const seatCountPerRow=3;
  const people=rng.shuffle(PERSON_POOL).slice(0,seatCountPerRow*2);
  const hiddenOrder=rng.shuffle(people);
  const state=stateFromPermutation(hiddenOrder,seatCountPerRow);
  const clues=selectUniqueClues(blueprint,state,people,rng);
  if(!clues.every((clue)=>cp006ClueTrue(state,clue))) throw new Error(`${blueprint}: displayed clue failed hidden-state verification.`);
  const production=solveCp006(people,seatCountPerRow,clues);
  const oracle=auditOracleCp006(people,seatCountPerRow,clues);
  if(production.length!==1 || oracle.length!==1 || canonicalDigest(production[0])!==canonicalDigest(oracle[0]) || canonicalDigest(production[0])!==canonicalDigest(state)) throw new Error(`${blueprint}: production/oracle unique-solution disagreement.`);
  const children=[oppositeQuestion(seed,state,people),relativeQuestion(seed,state,people),sameRowQuestion(seed,state,people),diagonalQuestion(seed,state,people)] as const;
  if(new Set(children.map((child)=>child.queryContractId)).size<3) throw new Error(`${blueprint}: insufficient query-contract diversity.`);
  if(new Set(children.map((child)=>child.answerDeterminingFactFingerprint)).size!==children.length) throw new Error(`${blueprint}: duplicate child answer-determining fact.`);
  for(const child of children){ if(child.options.length!==4 || child.options.filter((option)=>option.isCorrect).length!==1 || !child.options[child.answerIndex]?.isCorrect) throw new Error(`${blueprint}/Q${child.questionOrder}: invalid options.`); }
  const text=diagramText(state);
  const structuralFingerprint=canonicalDigest({blueprint,seatCountPerRow,clueKinds:clues.map((clue)=>clue.kind),queryContracts:children.map((child)=>child.queryContractId),top:[...state.top].map((_,index)=>index),bottom:[...state.bottom].map((_,index)=>index)});
  return {
    packageId:"SEA-002",checkpointId:"SEA-CP-006",blueprintAuthorityId:blueprint,seed,
    caseletId:`SEA-CP006-${blueprint}-${canonicalDigest({seed,people,state}).slice(0,12)}`,
    setupText:setupText(blueprint,people,state),people,state,clues,clueTexts:renderedClueTexts(blueprint,clues,state),
    sharedExplanation:sharedExplanation(state,clues),diagramText:text,diagram:{kind:"PARALLEL_ROWS_SVG",svg:diagramSvg(state),text},children,
    solutionCount:1,solverOracleAgreement:{passed:true,productionSolutions:1,oracleSolutions:1},
    checkpointSkillCoverage:["ROW_IDENTITY","OPPOSITE_ALIGNMENT","PERSON_RELATIVE_DIRECTION"],
    structuralFingerprint,permanentQlAllocated:false,englishFrozen:false,localizationFrozen:false,questionStudioRegistered:false,questionBankWritable:false,mockTestEligible:false,publiclyPublishable:false,
  };
}

export function cp006BlueprintContract(blueprint:Sea002Cp006BlueprintId):string { return BLUEPRINT_CONTRACT[blueprint]; }
