import { canonicalDigest } from "../../SEA-001/canonical.ts";
import {
  auditOracleCp006,
  cp006ClueTrue,
  generateSea002Cp006Caselet,
  renderCp006Clue,
  solveCp006,
} from "./generator.ts";
import { sameRowMove } from "./topology.ts";
import type { Sea002Cp006BlueprintId, Sea002Cp006Caselet, Sea002Cp006Clue } from "./types.ts";

function key(clue: Sea002Cp006Clue): string { return canonicalDigest(clue); }

function supportiveClues(caselet: Sea002Cp006Caselet): readonly Sea002Cp006Clue[] {
  const { state, blueprintAuthorityId: blueprint } = caselet;
  const top0=state.top[0]!, top1=state.top[1]!, bottom0=state.bottom[0]!, bottom1=state.bottom[1]!;
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

function finalExplanation(caselet:Sea002Cp006Caselet,clues:readonly Sea002Cp006Clue[]):string {
  return [
    "Draw two equal rows first. The upper row faces south and the lower row faces north.",
    "Keep the vertical columns fixed: same column means opposite, while a diagonal seat is in the other row and one column away.",
    "For left/right, always use the reference person's facing. In the upper row, a south-facing person's left appears on the observer's right; in the lower row, a north-facing person's left appears on the observer's left.",
    ...clues.map((clue,index)=>`Clue ${index+1}: ${renderCp006Clue(clue)}`),
    "After applying all the conditions, only one arrangement remains.",
    caselet.diagramText,
  ].join("\n");
}

function renderedClues(caselet:Sea002Cp006Caselet,clues:readonly Sea002Cp006Clue[]):readonly string[] {
  if(caselet.blueprintAuthorityId!=="SEA-PBA-021") return clues.map(renderCp006Clue);
  return [
    `${caselet.state.top.join(", ")} sit in the upper row, while ${caselet.state.bottom.join(", ")} sit in the lower row.`,
    ...clues.filter((clue)=>clue.kind!=="ROW_MEMBERSHIP").map(renderCp006Clue),
  ];
}

export function generateSea002Cp006DiscoveryCaselet(blueprint:Sea002Cp006BlueprintId,seed:string):Sea002Cp006Caselet {
  const base=generateSea002Cp006Caselet(blueprint,seed);
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
  return {
    ...base,
    clues,
    clueTexts:renderedClues(base,clues),
    sharedExplanation:finalExplanation(base,clues),
    structuralFingerprint:canonicalDigest({
      blueprint,
      seatCountPerRow:base.state.seatCountPerRow,
      clueKinds:clues.map((clue)=>clue.kind),
      clueShape:clues.map((clue)=>clue.kind==="SAME_ROW_RELATIVE"?`${clue.kind}:${clue.side}:${clue.steps}`:clue.kind),
      queryContracts:base.children.map((child)=>child.queryContractId),
    }),
  };
}
