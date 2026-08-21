import { canonicalDigest } from "../../SEA-001/canonical.ts";
import type { Sea002Cp006Caselet, Sea002Cp006ChildQuestion, Sea002Cp006Clue, Sea002Cp006State, Sea002Cp006BlueprintId } from "./types.ts";
import {
  auditOracleCp006,
  cp006ClueTrue,
  generateSea002Cp006Caselet,
  renderCp006Clue,
  solveCp006,
} from "./generator.ts";
import { sameRowMove } from "./topology.ts";
import { compileCp006TeachingExplanation, cp006TeachingArrangement } from "./teaching-explanation.ts";

function key(clue: Sea002Cp006Clue): string { return canonicalDigest(clue); }

function supportiveClues(caselet: Sea002Cp006Caselet): readonly Sea002Cp006Clue[] {
  const { state, blueprintAuthorityId: blueprint } = caselet;
  const top0=state.top[0]!, bottom0=state.bottom[0]!, bottom1=state.bottom[1]!;
  const relativeTarget=sameRowMove(state,top0,"LEFT",1);
  if(!relativeTarget) throw new Error(`${caselet.caseletId}: missing CP006 relative fixture`);
  const opposite:Sea002Cp006Clue={kind:"OPPOSITE",first:top0,second:bottom0};
  const relative:Sea002Cp006Clue={kind:"SAME_ROW_RELATIVE",target:relativeTarget,reference:top0,side:"LEFT",steps:1};
  const diagonal:Sea002Cp006Clue={kind:"DIAGONAL",first:top0,second:bottom1};
  const notOpposite:Sea002Cp006Clue={kind:"NOT_OPPOSITE",first:top0,second:bottom1};
  const endpoint:Sea002Cp006Clue={kind:"END_POSITION",person:top0,row:"TOP",end:"LEFT"};
  if(blueprint==="SEA-PBA-021") return [opposite,relative];
  if(blueprint==="SEA-PBA-022") return [opposite,relative,diagonal];
  if(blueprint==="SEA-PBA-023") return [opposite];
  return [opposite,notOpposite,diagonal,endpoint];
}

function renderedClues(caselet:Sea002Cp006Caselet,clues:readonly Sea002Cp006Clue[]):readonly string[] {
  if(caselet.blueprintAuthorityId!=="SEA-PBA-021") return clues.map(renderCp006Clue);
  return [
    `${caselet.state.top.join(", ")} sit in the upper row, while ${caselet.state.bottom.join(", ")} sit in the lower row.`,
    ...clues.filter((clue)=>clue.kind!=="ROW_MEMBERSHIP").map(renderCp006Clue),
  ];
}

function examLikeSetup(people:readonly string[],state:Sea002Cp006State):string {
  const names=people.length===2?people.join(" and "):`${people.slice(0,-1).join(", ")} and ${people.at(-1)}`;
  return `${people.length} persons, ${names}, are seated in two parallel rows containing ${state.seatCountPerRow} persons each. The persons in the upper row face south and the persons in the lower row face north. Each person in one row faces exactly one person in the other row; persons facing each other are in the same vertical column.`;
}

function plainLanguage(text:string):string {
  return text
    .replaceAll("the observer's","our")
    .replaceAll("observer's","our")
    .replaceAll("observer column","vertical column")
    .replaceAll("observer-left","left side of the page")
    .replaceAll("observer-right","right side of the page")
    .replaceAll("towards the our","towards our")
    .replaceAll("seat intervals","seats")
    .replaceAll("strictly between","between");
}
function plainChild(child:Sea002Cp006ChildQuestion):Sea002Cp006ChildQuestion {
  return {
    ...child,
    explanation:plainLanguage(child.explanation),
    options:child.options.map((option)=>({...option,explanation:plainLanguage(option.explanation)})) as Sea002Cp006ChildQuestion["options"],
  };
}

function learnerDiagram(base:Sea002Cp006Caselet):Sea002Cp006Caselet["diagram"] {
  return {
    ...base.diagram,
    text:cp006TeachingArrangement(base.state),
    svg:base.diagram.svg.replace(
      "Columns are observer coordinates; dashed lines join opposite seats.",
      "Dashed lines join persons who face each other.",
    ),
  };
}

export function generateSea002Cp006DiscoveryCaselet(
  blueprint:Sea002Cp006BlueprintId,
  seed:string,
  seatCountPerRow=3,
):Sea002Cp006Caselet {
  const base=generateSea002Cp006Caselet(blueprint,seed,seatCountPerRow);
  const clues=[...base.clues];
  const existing=new Set(clues.map(key));
  for(const clue of supportiveClues(base)) {
    const clueKey=key(clue);
    if(!existing.has(clueKey)){clues.push(clue);existing.add(clueKey);}
  }
  if(!clues.every((clue)=>cp006ClueTrue(base.state,clue))) throw new Error(`${base.caseletId}: discovery contract added an invalid clue.`);
  const production=solveCp006(base.people,base.state.seatCountPerRow,clues);
  const oracle=auditOracleCp006(base.people,base.state.seatCountPerRow,clues);
  if(production.length!==1||oracle.length!==1||canonicalDigest(production[0])!==canonicalDigest(base.state)||canonicalDigest(oracle[0])!==canonicalDigest(base.state)) throw new Error(`${base.caseletId}: discovery contract lost unique solver/oracle agreement.`);
  const clueTexts=renderedClues(base,clues);
  const solutionClueTexts=clues.map(renderCp006Clue);
  const diagram=learnerDiagram(base);
  const children=base.children.map(plainChild) as Sea002Cp006Caselet["children"];
  return {
    ...base,
    setupText:examLikeSetup(base.people,base.state),
    clues,
    clueTexts,
    sharedExplanation:compileCp006TeachingExplanation(base.state,base.people,clues,solutionClueTexts),
    diagramText:diagram.text,
    diagram,
    children,
    structuralFingerprint:canonicalDigest({
      blueprint,
      seatCountPerRow:base.state.seatCountPerRow,
      clueKinds:clues.map((clue)=>clue.kind),
      clueShape:clues.map((clue)=>clue.kind==="SAME_ROW_RELATIVE"?`${clue.kind}:${clue.side}:${clue.steps}`:clue.kind),
      queryContracts:children.map((child)=>child.queryContractId),
    }),
  };
}
