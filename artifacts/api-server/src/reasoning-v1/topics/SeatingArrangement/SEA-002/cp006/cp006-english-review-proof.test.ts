import assert from "node:assert/strict";

import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import { SEA002_CP006_BLUEPRINT_IDS } from "./types.ts";

const corpus=buildCp006EnglishReviewCorpus();
const blueprintCounts=new Map<string,number>();
const widthCounts=new Map<number,number>();
const queryContracts=new Set<string>();
const normalizedQuestionSurfaces=new Set<string>();
const normalizedClueSurfaces=new Set<string>();
const structuralFingerprints=new Set<string>();
const answerPositions=Array.from({length:4},()=>[0,0,0,0]);
let sourceCount=0;
let baseCount=0;
let detailedSolutionCount=0;
let caseTeachingCount=0;

function escapeRegex(value:string):string { return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }
function normalizePeople(text:string,people:readonly string[]):string {
  let normalized=text;
  for(const person of [...people].sort((a,b)=>b.length-a.length)) normalized=normalized.replace(new RegExp(`\\b${escapeRegex(person)}\\b`,"g"),"<PERSON>");
  return normalized.replace(/\s+/g," ").trim();
}

assert.equal(corpus.length,100,"CP006 English review must contain exactly 100 caselets");
assert.equal(new Set(corpus.map((caselet)=>caselet.caseletId)).size,100,"CP006 English review caselet IDs must be unique");

for(const caselet of corpus){
  blueprintCounts.set(caselet.blueprintAuthorityId,(blueprintCounts.get(caselet.blueprintAuthorityId)??0)+1);
  widthCounts.set(caselet.state.seatCountPerRow,(widthCounts.get(caselet.state.seatCountPerRow)??0)+1);
  structuralFingerprints.add(caselet.structuralFingerprint);
  if(caselet.seed.startsWith("english-review-source-")) sourceCount+=1;
  if(caselet.seed.startsWith("english-review-base-")) baseCount+=1;

  const proseAtoms=[caselet.setupText,...caselet.clueTexts,...caselet.children.flatMap((child)=>[child.text,child.explanation,...child.options.map((option)=>option.explanation)])];
  const learnerSurface=[...proseAtoms,caselet.sharedExplanation].join("\n");
  assert.ok(!/SEA-PBA|SEA-QC|oracle|fingerprint|hidden state|implementation|observer\b/i.test(learnerSurface),`${caselet.caseletId}: internal or technical language leaked`);
  assert.ok(!/\bthe our\b/i.test(learnerSurface),`${caselet.caseletId}: awkward direction grammar leaked`);
  assert.ok(!/\bThis matches\b/i.test(learnerSurface),`${caselet.caseletId}: generic explanation wording returned`);
  assert.ok(proseAtoms.every((text)=>!/[ \t]{2,}/.test(text)),`${caselet.caseletId}: doubled whitespace in prose`);
  assert.equal(new Set(caselet.clueTexts).size,caselet.clueTexts.length,`${caselet.caseletId}: duplicate clue line`);
  assert.ok(caselet.clueTexts.every((clue)=>/[.!?]$/.test(clue.trim())),`${caselet.caseletId}: clue punctuation`);
  assert.ok(/two parallel rows/i.test(caselet.setupText),`${caselet.caseletId}: setup not exam-like parallel-row language`);
  assert.ok(/upper row face south/i.test(caselet.setupText));
  assert.ok(/lower row face north/i.test(caselet.setupText));

  assert.ok(caselet.sharedExplanation.length>=400,`${caselet.caseletId}: detailed solution too thin`);
  assert.match(caselet.sharedExplanation,new RegExp(`^Use columns 1 to ${caselet.state.seatCountPerRow} from left to right\\.`),`${caselet.caseletId}: shared solution does not start directly with column positions`);
  assert.ok(!/Draw two equal rows first|For a person in the upper row|Persons directly facing each other must|Here the conditions fix|Use this final arrangement to answer/i.test(caselet.sharedExplanation),`${caselet.caseletId}: unnecessary shared-solution boilerplate returned`);
  assert.ok(caselet.sharedExplanation.includes("Final arrangement:"),`${caselet.caseletId}: final arrangement missing from solution`);
  assert.ok(caselet.sharedExplanation.includes("Step 1:"),`${caselet.caseletId}: clue-by-clue working missing`);
  assert.ok(caselet.sharedExplanation.includes("Position:"),`${caselet.caseletId}: concrete position result missing`);
  assert.ok(/\bcolumn\b/i.test(caselet.sharedExplanation),`${caselet.caseletId}: column-based working missing`);
  assert.ok(!caselet.sharedExplanation.includes("Result:"),`${caselet.caseletId}: abstract Result label returned instead of position wording`);
  const stepCount=caselet.sharedExplanation.match(/Step \d+:/g)?.length??0;
  assert.ok(stepCount>=2,`${caselet.caseletId}: solution has too few deduction steps (${stepCount})`);
  const repeatedMembershipNarrations=caselet.sharedExplanation.match(/column not fixed yet\./g)?.length??0;
  assert.ok(repeatedMembershipNarrations<=1,`${caselet.caseletId}: row-membership narration is repetitive (${repeatedMembershipNarrations})`);
  detailedSolutionCount+=1;
  if(caselet.sharedExplanation.includes("Case 1:")) caseTeachingCount+=1;

  for(const clue of caselet.clueTexts) normalizedClueSurfaces.add(normalizePeople(clue,caselet.people));
  assert.equal(caselet.children.length,4);
  for(let q=0;q<4;q+=1){
    const child=caselet.children[q]!;
    queryContracts.add(child.queryContractId);
    normalizedQuestionSurfaces.add(normalizePeople(child.text,caselet.people));
    assert.match(child.text.trim(),/\?$/,`${caselet.caseletId}/Q${q+1}: question punctuation`);
    assert.ok(child.explanation.length>=40,`${caselet.caseletId}/Q${q+1}: explanation too thin`);
    assert.ok(!/observer\b/i.test(child.explanation),`${caselet.caseletId}/Q${q+1}: technical direction wording leaked`);
    assert.ok(!/\bthe our\b/i.test(child.explanation),`${caselet.caseletId}/Q${q+1}: awkward direction grammar`);
    assert.equal(child.options.length,4);
    assert.equal(new Set(child.options.map((option)=>option.value)).size,4,`${caselet.caseletId}/Q${q+1}: duplicate displayed option`);
    assert.equal(child.options.filter((option)=>option.isCorrect).length,1);
    assert.equal(child.options[child.answerIndex]?.value,child.answer);
    assert.ok(child.options.every((option)=>option.explanation.length>=21),`${caselet.caseletId}/Q${q+1}: option explanation too thin`);
    assert.ok(child.options.every((option)=>!/\bthe our\b|observer\b/i.test(option.explanation)),`${caselet.caseletId}/Q${q+1}: awkward/technical option explanation`);
    answerPositions[q]![child.answerIndex]+=1;
  }

  assert.equal(caselet.permanentQlAllocated,false);
  assert.equal(caselet.englishFrozen,false);
  assert.equal(caselet.localizationFrozen,false);
  assert.equal(caselet.questionStudioRegistered,false);
  assert.equal(caselet.questionBankWritable,false);
  assert.equal(caselet.mockTestEligible,false);
  assert.equal(caselet.publiclyPublishable,false);
}

for(const blueprint of SEA002_CP006_BLUEPRINT_IDS) assert.equal(blueprintCounts.get(blueprint),25,`${blueprint}: review balance`);
assert.equal(sourceCount,80);
assert.equal(baseCount,20);
assert.equal(detailedSolutionCount,100);
assert.ok(caseTeachingCount>=20,`case-formation teaching too sparse in review corpus: ${caseTeachingCount}/100`);
assert.deepEqual([...widthCounts.keys()].sort(),[3,4,5,6]);
assert.deepEqual([...queryContracts].sort(),["SEA-QC-003","SEA-QC-006","SEA-QC-008","SEA-QC-010","SEA-QC-011","SEA-QC-012","SEA-QC-014","SEA-QC-015"]);
assert.ok(normalizedQuestionSurfaces.size>=8,`question-stem surface pool too thin: ${normalizedQuestionSurfaces.size}`);
assert.ok(normalizedClueSurfaces.size>=14,`clue-language surface pool too thin: ${normalizedClueSurfaces.size}`);
assert.ok(structuralFingerprints.size>=80,`review structural diversity too thin: ${structuralFingerprints.size}`);
for(let q=0;q<4;q+=1) for(let answer=0;answer<4;answer+=1) assert.ok(answerPositions[q]![answer]>=10,`review Q${q+1} answer position ${answer} too thin`);

const fingerprint=cp006EnglishReviewFingerprint(corpus);
assert.match(fingerprint,/^[a-f0-9]{64}$/);

console.log("PASS_SEA002_CP006_ENGLISH_REVIEW_READY");
console.log("caselets",corpus.length);
console.log("source/base",sourceCount,baseCount);
console.log("blueprint counts",Object.fromEntries(blueprintCounts));
console.log("width counts",Object.fromEntries(widthCounts));
console.log("query contracts",[...queryContracts].sort().join(","));
console.log("normalized question surfaces",normalizedQuestionSurfaces.size);
console.log("normalized clue surfaces",normalizedClueSurfaces.size);
console.log("structural fingerprints",structuralFingerprints.size);
console.log("detailed solutions",detailedSolutionCount);
console.log("case-teaching solutions",caseTeachingCount);
console.log("answer positions",answerPositions);
console.log("review fingerprint",fingerprint);
