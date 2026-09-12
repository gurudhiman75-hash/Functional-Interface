import assert from "node:assert/strict";
import { generateIntCp007LocalizedReviewQuestion as generateV4 } from "./cp007-scheme-equivalence-localized-v4";
import {
  INT_CP007_LOCALIZED_VERSION,
  INT_CP007_LOCALIZED_V5_SUPERSEDES,
  containsDeprecatedPunjabiCompoundInterestTerm,
  generateIntCp007LocalizedReviewQuestion as generateV5,
} from "./cp007-scheme-equivalence-localized-v5";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
const HI_BLOCKED = "ब्याज हर वर्ष मूलधन में जुड़ता है";
const PA_BLOCKED = "ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ";

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function learnerText(q: any): string {
  return [
    q.presentation.markdown,
    q.presentation.prompt,
    ...q.options.map((o: any) => o.text),
    q.explanation.keyIdea,
    ...q.explanation.steps,
    q.explanation.finalAnswer,
    q.explanation.commonMistake,
  ].join("\n");
}
const mathSegments = (text: string): string[] => text.match(/\$[^$]+\$/gu) ?? [];
function protectedPayload(q: any): unknown {
  return {
    id:q.id,runtimeVersion:q.runtimeVersion,checkpointId:q.checkpointId,qlId:q.qlId,locale:q.locale,seed:q.seed,
    mathematicalState:q.mathematicalState,answerSemantic:q.answerSemantic,options:q.options,correctIndex:q.correctIndex,
    correctAnswer:q.correctAnswer,sourceEnglishFreezeId:q.sourceEnglishFreezeId,sourceEnglishFreezeApproval:q.sourceEnglishFreezeApproval,
    permanentIdentityFrozen:q.permanentIdentityFrozen,learnerContentFrozen:q.learnerContentFrozen,enabled:q.enabled,
    stagingStatus:q.stagingStatus,registrationStatus:q.registrationStatus,questionStudioDiscoverable:q.questionStudioDiscoverable,
    questionBankStatus:q.questionBankStatus,testEligibility:q.testEligibility,publiclyPublishable:q.publiclyPublishable,
  };
}

let questions=0, deterministicChecks=0, preservationChecks=0, mathPreservationChecks=0, removalChecks=0,
  terminologyChecks=0, lifecycleChecks=0, deepFreezeChecks=0, changedQuestions=0, removedOccurrences=0;
const changedByQl = new Map<string,number>();
assert.equal(INT_CP007_LOCALIZED_V5_SUPERSEDES,"INT-CP-007-HI-PA-v4-final-language-review");

for (const qlId of INT_CP007_QL_IDS) {
  for (let i=0;i<200;i+=1) {
    const seed=`int-cp007-localized-v5-${qlId}-${i}`;
    for (const locale of LOCALES) {
      const before=generateV4(qlId,seed,locale) as any;
      const after=generateV5(qlId,seed,locale) as any;
      const replay=generateV5(qlId,seed,locale) as any;
      const beforeText=learnerText(before), afterText=learnerText(after);
      const blocked = locale === "hi-IN" ? HI_BLOCKED : PA_BLOCKED;
      const beforeCount = beforeText.split(blocked).length - 1;
      const afterCount = afterText.split(blocked).length - 1;

      assert.equal(stableJson(after),stableJson(replay),`${qlId}/${seed}/${locale}: nondeterministic V5`); deterministicChecks++;
      assert.equal(stableJson(protectedPayload(after)),stableJson(protectedPayload(before)),`${qlId}/${seed}/${locale}: protected payload drift`); preservationChecks++;
      assert.deepEqual(mathSegments(afterText),mathSegments(beforeText),`${qlId}/${seed}/${locale}: math/LaTeX changed`); mathPreservationChecks++;
      assert.equal(afterCount,0,`${qlId}/${seed}/${locale}: removed CI-definition clause remains`); removalChecks++;
      assert.ok(!afterText.includes("()"),`${qlId}/${seed}/${locale}: empty parentheses after clause removal`); removalChecks++;
      assert.ok(!afterText.includes("  "),`${qlId}/${seed}/${locale}: doubled whitespace after clause removal`); removalChecks++;
      removedOccurrences += beforeCount - afterCount;

      if (locale === "pa-IN") {
        assert.ok(!containsDeprecatedPunjabiCompoundInterestTerm(afterText),`${qlId}/${seed}: deprecated Punjabi CI term`); terminologyChecks++;
      }
      if (beforeText!==afterText) { changedQuestions++; changedByQl.set(qlId,(changedByQl.get(qlId)??0)+1); }

      assert.equal(after.localizedVersion,INT_CP007_LOCALIZED_VERSION);
      assert.equal(after.permanentIdentityFrozen,true); assert.equal(after.learnerContentFrozen,false); assert.equal(after.enabled,false);
      assert.equal(after.stagingStatus,"NOT_STAGED"); assert.equal(after.registrationStatus,"NOT_REGISTERED"); assert.equal(after.questionStudioDiscoverable,false);
      assert.equal(after.questionBankStatus,"NOT_STORED"); assert.equal(after.testEligibility,"INELIGIBLE"); assert.equal(after.publiclyPublishable,false); lifecycleChecks+=9;
      assert.ok(Object.isFrozen(after)); assert.ok(Object.isFrozen(after.presentation)); assert.ok(Object.isFrozen(after.options)); assert.ok(Object.isFrozen(after.explanation)); assert.ok(Object.isFrozen(after.explanation.steps)); deepFreezeChecks+=5;
      questions++;
    }
  }
}

assert.ok(removedOccurrences>0,"V5 removed no CI-definition clauses");
for (const ql of INT_CP007_QL_IDS) assert.ok((changedByQl.get(ql)??0)>0,`${ql}: expected CI-definition removal not exercised`);
console.log(JSON.stringify({
  localizedVersion:INT_CP007_LOCALIZED_VERSION,
  supersedes:INT_CP007_LOCALIZED_V5_SUPERSEDES,
  qls:INT_CP007_QL_IDS.length,
  questions,deterministicChecks,preservationChecks,mathPreservationChecks,removalChecks,removedOccurrences,
  terminologyChecks,lifecycleChecks,deepFreezeChecks,changedQuestions,changedByQl:Object.fromEntries(changedByQl),
  permanentIdentityFrozen:true,learnerContentFrozen:false,learnerDeliveryAuthorized:false,
},null,2));
console.log("PASS_INT_CP007_LOCALIZED_V5_AUDIT");
