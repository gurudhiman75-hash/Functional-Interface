import assert from "node:assert/strict";

import "../DSF-CP-012/direction-runtime-v1.test.ts";
import "../DSF-CP-012/inequality-runtime-v1.test.ts";
import "../DSF-CP-013/coding-runtime-v1.test.ts";
import "../DSF-CP-013/calendar-runtime-v1.test.ts";
import "../DSF-CP-017/cp017-deep-audit-wave-01.test.ts";
import "../DSF-CP-022/direction-three-statement-batch-v1.test.ts";
import "../DSF-CP-024/inequality-three-statement-batch-v1.test.ts";
import "../DSF-CP-026/coding-three-statement-batch-v1.test.ts";
import "../DSF-CP-027/calendar-three-statement-batch-v1.test.ts";
import "../DSF-CP-031/ql002-reasoning-localization-v1.test.ts";
import "../DSF-CP-032/question-studio-ql002-integration-v1.test.ts";
import "../DSF-CP-033/ql002-freeze-audit-v1.test.ts";

import {
  DSF_CP017_LANES,
  DSF_CP017_GENERATABLE_QL_IDS,
  DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";
import {
  DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  DSF_CURRENT_PERMANENT_QL_REGISTRY,
  DSF_QL_002_PERMANENT_ENTRY,
} from "../foundation/current-permanent-ql-registry.ts";
import { DSF_CP013_CALENDAR_SOLVE_MODES } from "../DSF-CP-013/calendar-runtime-v1.ts";
import { DSF_CP027_CALENDAR_SOLVE_MODES } from "../DSF-CP-027/calendar-three-statement-batch-v1.ts";
import { generateDsfCp012DirectionQuestion } from "../DSF-CP-012/direction-runtime-v1.ts";
import { generateDsfCp022DirectionQuestion } from "../DSF-CP-022/direction-three-statement-batch-v1.ts";

const reasoningLanes = DSF_CP017_LANES.filter((lane) => lane.domainFamily === "REASONING");
assert.equal(reasoningLanes.length, 7);
assert.deepEqual([...DSF_CP017_GENERATABLE_QL_IDS], ["DSF-QL-001", "DSF-QL-002"]);
assert.deepEqual([...DSF_CP017_RUNTIME_DEFERRED_QL_IDS], []);

assert.deepEqual(
  DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  ["DSF-QL-001", "DSF-QL-002"],
);
assert.equal(DSF_CURRENT_NEXT_AVAILABLE_QL_ID, "DSF-QL-003");
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.englishContentStatus, "CP034_CONVENTIONAL_DEEP_AUDIT_CLOSED");

assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.persistenceAllowed, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.deepEqual([...DSF_CP013_CALENDAR_SOLVE_MODES], [
  "DSF-SM-CAL-RESULT-WEEKDAY",
  "DSF-SM-CAL-START-WEEKDAY",
]);
assert.deepEqual([...DSF_CP027_CALENDAR_SOLVE_MODES], [
  "DSF-SM-CAL-RESULT-WEEKDAY",
  "DSF-SM-CAL-START-WEEKDAY",
]);

const banned = [
  /Only the remainder/iu,
  /remainder.{0,40}(?:divided by|division by|modulo)\s*7/iu,
  /Equal values are allowed/iu,
  /source symbol/iu,
  /net displacement components/iu,
  /final east-west coordinate/iu,
  /final north-south coordinate/iu,
  /minimal sufficient statement set/iu,
  /\b(?:undefined|null|NaN)\b|\[object Object\]/u,
];

function learnerText(question:any): string {
  return [
    question.stem,
    ...(question.statements ?? []).map((statement:any) => statement.text),
    ...(question.options ?? []).map((option:any) => typeof option === "string" ? option : option.text ?? option.value ?? ""),
    question.explanation,
  ].filter(Boolean).join(" ");
}

let ql001ReasoningSamples=0;
for(const lane of reasoningLanes){
  for(const language of ["en","hi","pa"] as const){
    const preview=previewDsf001NormalQuestionStudioReview({
      qlId:"DSF-QL-001",
      laneId:lane.laneId,
      language,
      count:2,
      seed:`cp034:ql001:${lane.laneId}:${language}`,
    });
    assert.equal(preview.questions.length,2);
    for(const q of preview.questions){
      assert.equal(q.qlId,"DSF-QL-001");
      assert.equal(q.statements.length,2);
      assert.equal(q.optionDetails.length,5);
      assert.equal(q.optionDetails.filter((option:any)=>option.isCorrect).length,1);
      assert.equal(q.questionBankWritable,false);
      assert.equal(q.testEligible,false);
      assert.equal(q.mockTestEligible,false);
      assert.equal(q.publiclyPublishable,false);
      assert.equal(q.automaticStudentPublication,false);
      const text=learnerText(q);
      for(const re of banned) assert.doesNotMatch(text,re,`${lane.laneId}/${language} leaked ${re}`);
      ql001ReasoningSamples++;
    }
  }
}

let ql002Samples=0;
for(const lane of reasoningLanes){
  for(const language of ["en","hi","pa"] as const){
    const preview=previewDsf001NormalQuestionStudioReview({
      qlId:"DSF-QL-002",
      laneId:lane.laneId,
      language,
      count:4,
      seed:`cp034:ql002:${lane.laneId}:${language}`,
    });
    assert.equal(preview.questions.length,4);
    for(const q of preview.questions){
      assert.equal(q.qlId,"DSF-QL-002");
      assert.equal(q.statements.length,3);
      assert.equal(q.optionDetails.length,5);
      assert.equal(q.optionDetails.filter((option:any)=>option.isCorrect).length,1);
      assert.equal(q.proof?.subsetEvaluations?.length,7);
      assert.equal(q.questionBankWritable,false);
      assert.equal(q.testEligible,false);
      assert.equal(q.mockTestEligible,false);
      assert.equal(q.publiclyPublishable,false);
      assert.equal(q.automaticStudentPublication,false);
      const text=learnerText(q);
      for(const re of banned) assert.doesNotMatch(text,re,`${lane.laneId}/${language} leaked ${re}`);
      ql002Samples++;
    }
  }
}

// Direction shortest-distance target values must remain whole metres on the learner-authoring universe.
for(let seed=0;seed<180;seed++){
  const q=generateDsfCp012DirectionQuestion(seed);
  if(q.solveModeId==="DSF-SM-DIR-SHORTEST-DISTANCE"){
    for(const value of [...q.proof.statementITargetAnswers,...q.proof.statementIITargetAnswers,...q.proof.togetherTargetAnswers]){
      assert.match(String(value),/^\d+ m$/u);
    }
  }
}
for(let seed=0;seed<100;seed++){
  const q=generateDsfCp022DirectionQuestion(`cp034-direction:${seed}`);
  if(q.solveModeId==="DSF-SM-DIR-SHORTEST-DISTANCE"){
    for(const entry of q.proof.subsetEvaluations){
      for(const value of entry.normalizedTargetAnswers) assert.match(String(value),/^\d+ m$/u);
    }
  }
}

console.log(JSON.stringify({
  status:"PASS_DSF_CP034_CONVENTIONAL_DEEP_AUDIT_CLOSURE",
  permanentQlIds:DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry)=>entry.qlId),
  nextQlId:DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  ql001ReasoningSamples,
  ql002Samples,
  ql002ReasoningLanes:reasoningLanes.map((lane)=>lane.laneId),
  novelty:"DEFERRED_TO_CROSS_CHAPTER_REASONING_PASS",
  lifecycle:"QUESTION_STUDIO_REVIEW_ONLY",
},null,2));
