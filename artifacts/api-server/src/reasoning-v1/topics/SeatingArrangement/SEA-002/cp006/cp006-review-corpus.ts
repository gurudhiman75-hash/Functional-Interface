import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { generateSea002Cp006DiscoveryCaselet } from "./discovery.ts";
import { generateSea002Cp006ExamRealCaselet } from "./exam-real.ts";
import { SEA002_CP006_BLUEPRINT_IDS, type Sea002Cp006Caselet } from "./types.ts";

export function cp006ReviewContentFingerprint(caselet:Sea002Cp006Caselet):string {
  return canonicalDigest({
    caseletId:caselet.caseletId,
    blueprintAuthorityId:caselet.blueprintAuthorityId,
    setupText:caselet.setupText,
    clueTexts:caselet.clueTexts,
    sharedExplanation:caselet.sharedExplanation,
    diagramText:caselet.diagramText,
    children:caselet.children.map((child)=>({
      queryContractId:child.queryContractId,
      text:child.text,
      options:child.options.map((option)=>({value:option.value,explanation:option.explanation})),
      answer:child.answer,
      explanation:child.explanation,
    })),
  });
}

export function buildCp006EnglishReviewCorpus():readonly Sea002Cp006Caselet[] {
  const caselets:Sea002Cp006Caselet[]=[];
  for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
    for(let index=0;index<20;index+=1){
      const width=4+(index%3);
      caselets.push(generateSea002Cp006ExamRealCaselet(blueprint,`english-review-source-${blueprint}-${index}`,width));
    }
    for(let index=0;index<5;index+=1){
      const width=3+(index%4);
      caselets.push(generateSea002Cp006DiscoveryCaselet(blueprint,`english-review-base-${blueprint}-${index}`,width));
    }
  }
  return Object.freeze(caselets);
}

export function cp006EnglishReviewFingerprint(corpus:readonly Sea002Cp006Caselet[]):string {
  return canonicalDigest(corpus.map((caselet)=>({caseletId:caselet.caseletId,contentFingerprint:cp006ReviewContentFingerprint(caselet)})));
}
