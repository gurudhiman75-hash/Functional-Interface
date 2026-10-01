import { strict as assert } from "node:assert";
import {
  DSF_CP017_GENERATABLE_QL_IDS,
  DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";
import { generateDsf001NormalQuestionStudioWorkflow } from "../DSF-CP-017/question-studio-normal-workflow-v1.ts";

const lanes = [
  "DSF-QS-RANKING",
  "DSF-QS-DIRECTION",
  "DSF-QS-BLOOD-RELATIONS",
  "DSF-QS-INEQUALITY",
  "DSF-QS-SEATING",
  "DSF-QS-CODING",
  "DSF-QS-CALENDAR",
] as const;

assert.deepEqual([...DSF_CP017_GENERATABLE_QL_IDS], ["DSF-QL-001","DSF-QL-002"]);
assert.deepEqual([...DSF_CP017_RUNTIME_DEFERRED_QL_IDS], []);

for (const language of ["en","hi","pa"] as const) {
  for (const laneId of lanes) {
    const input = {
      seed:`cp032:${language}:${laneId}`,
      count:2,
      language,
      laneId,
      qlId:"DSF-QL-002",
    };

    const preview=previewDsf001NormalQuestionStudioReview(input);
    assert.equal(preview.questions.length,2);
    assert.equal(preview.generationContext.questionBankWritable,false);
    assert.equal(preview.generationContext.testEligible,false);
    assert.equal(preview.generationContext.mockTestEligible,false);
    assert.equal(preview.generationContext.publiclyPublishable,false);
    assert.equal(preview.generationContext.automaticStudentPublication,false);

    for(const question of preview.questions){
      assert.equal(question.qlId,"DSF-QL-002");
      assert.equal(question.patternId,"DSF-QL-002");
      assert.equal(question.laneId,laneId);
      assert.equal(question.language,language);
      assert.equal(question.statements.length,3);
      assert.deepEqual(question.statements.map((s:any)=>s.id),["I","II","III"]);
      assert.equal(question.optionDetails.length,5);
      assert.equal(question.optionDetails.filter((o:any)=>o.isCorrect).length,1);
      assert.equal(question.questionBankWritable,false);
      assert.equal(question.testEligible,false);
      assert.equal(question.mockTestEligible,false);
      assert.equal(question.publiclyPublishable,false);
      assert.equal(question.automaticStudentPublication,false);
      assert.ok(question.proof?.subsetEvaluations?.length===7);
      assert.ok(String(question.explanation).length>40);
    }

    const workflow=generateDsf001NormalQuestionStudioWorkflow(input);
    assert.equal(workflow.generationContext.questionBankStatus,"NOT_STORED");
    assert.equal(workflow.generationContext.questionBankWritable,false);
    assert.equal(workflow.generationContext.questionBankAcceptanceMode,"REVIEW_ONLY");
    assert.equal(workflow.generationContext.testEligible,false);
    assert.equal(workflow.generationContext.mockTestEligible,false);
    assert.equal(workflow.generationContext.publiclyPublishable,false);
    for(const question of workflow.questions){
      assert.equal(question.questionBankStatus,"NOT_STORED");
      assert.equal(question.questionBankWritable,false);
      assert.equal(question.questionBankAcceptanceMode,"REVIEW_ONLY");
      assert.equal(question.testEligible,false);
      assert.equal(question.mockTestEligible,false);
      assert.equal(question.publiclyPublishable,false);
    }
  }
}

assert.throws(
  ()=>previewDsf001NormalQuestionStudioReview({qlId:"DSF-QL-002",laneId:"DSF-QS-AVERAGE",language:"en",count:1}),
  /restricted to reasoning lanes/,
);

const ql001=previewDsf001NormalQuestionStudioReview({qlId:"DSF-QL-001",laneId:"DSF-QS-RANKING",language:"en",count:1});
assert.equal(ql001.questions[0]?.statements.length,2);
assert.equal(ql001.questions[0]?.qlId,"DSF-QL-001");

console.log("DSF-CP-032 Question Studio QL002 integration: PASS");
