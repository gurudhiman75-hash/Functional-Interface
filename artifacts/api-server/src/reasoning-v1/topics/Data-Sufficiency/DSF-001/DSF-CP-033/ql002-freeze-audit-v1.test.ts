import { strict as assert } from "node:assert";
import {
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";
import { DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS } from "../DSF-CP-015/three-statement-answer-profile.ts";
import { DSF_QL_002_PERMANENT_ENTRY, DSF_CURRENT_NEXT_AVAILABLE_QL_ID } from "../foundation/current-permanent-ql-registry.ts";

const lanes = [
  "DSF-QS-RANKING","DSF-QS-DIRECTION","DSF-QS-BLOOD-RELATIONS","DSF-QS-INEQUALITY",
  "DSF-QS-SEATING","DSF-QS-CODING","DSF-QS-CALENDAR",
] as const;
const languages = ["en","hi","pa"] as const;

const seenSemantic = new Set<string>();
const sampleRows:any[]=[];

for(const laneId of lanes){
  for(const language of languages){
    const preview=previewDsf001NormalQuestionStudioReview({
      seed:`cp033:${laneId}:${language}`,
      count:12,
      qlId:"DSF-QL-002",
      laneId,
      language,
    });
    assert.equal(preview.questions.length,12);
    for(const q of preview.questions as any[]){
      seenSemantic.add(String(q.canonicalAnswer));
      assert.equal(q.qlId,"DSF-QL-002");
      assert.equal(q.statements.length,3);
      assert.deepEqual(q.statements.map((s:any)=>s.id),["I","II","III"]);
      assert.equal(q.optionDetails.length,5);
      assert.equal(q.optionDetails.filter((o:any)=>o.isCorrect).length,1);
      assert.equal(q.questionBankWritable,false);
      assert.equal(q.testEligible,false);
      assert.equal(q.mockTestEligible,false);
      assert.equal(q.publiclyPublishable,false);
      assert.equal(q.automaticStudentPublication,false);
      assert.equal(q.proof?.subsetEvaluations?.length,7);
      assert.ok(String(q.stem).trim().length>10);
      assert.ok(String(q.explanation).trim().length>60);

      const learnerText=[q.stem,...q.statements.map((s:any)=>s.text),...q.optionDetails.map((o:any)=>o.text),q.explanation].join(" ");
      for(const banned of [
        "minimal sufficient statement set",
        "parent-type relation",
        "target person",
        "Only the remainder modulo 7 affects",
        "solve this first",
        "use the following method",
        "first determine",
      ]) assert.equal(learnerText.includes(banned),false,`${laneId}/${language} leaked '${banned}'`);

      if(language!=="en"){
        for(const re of [/\bThe\b/,/\bstarting end\b/i,/\bopposite end\b/i,/\bis coded as\b/i,/\bresulting day\b/i,/\bcomplete order\b/i]){
          assert.equal(re.test(learnerText),false,`${laneId}/${language} English leak ${re}`);
        }
      }
    }
    sampleRows.push({laneId,language,semanticKeys:[...new Set((preview.questions as any[]).map(q=>q.canonicalAnswer))]});
  }
}

for(const semantic of DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS){
  assert.ok(seenSemantic.has(semantic),`CP033 aggregate sample missed semantic class ${semantic}`);
}

assert.deepEqual([...DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.generatableQlIds],["DSF-QL-001","DSF-QL-002"]);
assert.deepEqual([...DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeDeferredQlIds],[]);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable,true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioGenerationEnabled,true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication,false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.questionStudioDiscoverable,true);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.questionBankWritable,false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.testEligible,false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.mockTestEligible,false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.publiclyPublishable,false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.automaticStudentPublication,false);
assert.equal(DSF_CURRENT_NEXT_AVAILABLE_QL_ID,"DSF-QL-003");

console.log("DSF_CP033_SAMPLE_SUMMARY",JSON.stringify(sampleRows));
console.log("DSF-CP-033 QL002 freeze audit: PASS",JSON.stringify({semanticCoverage:[...seenSemantic].sort(),count:seenSemantic.size}));
