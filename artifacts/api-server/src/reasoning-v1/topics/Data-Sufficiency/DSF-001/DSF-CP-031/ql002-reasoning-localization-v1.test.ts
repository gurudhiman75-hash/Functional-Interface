import { strict as assert } from "node:assert";
import { generateDsfCp021RankingQuestion } from "../DSF-CP-021/ranking-three-statement-batch-v1.ts";
import { generateDsfCp022DirectionQuestion } from "../DSF-CP-022/direction-three-statement-batch-v1.ts";
import { generateDsfCp023BloodQuestion } from "../DSF-CP-023/blood-relations-three-statement-batch-v1.ts";
import { generateDsfCp024InequalityQuestion } from "../DSF-CP-024/inequality-three-statement-batch-v1.ts";
import { generateDsfCp025SeatingQuestion } from "../DSF-CP-025/seating-three-statement-batch-v1.ts";
import { generateDsfCp026CodingQuestion } from "../DSF-CP-026/coding-three-statement-batch-v1.ts";
import { generateDsfCp027CalendarQuestion } from "../DSF-CP-027/calendar-three-statement-batch-v1.ts";
import { localizeDsfQl002ReasoningQuestion } from "./ql002-reasoning-localization-v1.ts";

const lanes = [
  ["RANKING", generateDsfCp021RankingQuestion],
  ["DIRECTION", generateDsfCp022DirectionQuestion],
  ["BLOOD", generateDsfCp023BloodQuestion],
  ["INEQUALITY", generateDsfCp024InequalityQuestion],
  ["SEATING", generateDsfCp025SeatingQuestion],
  ["CODING", generateDsfCp026CodingQuestion],
  ["CALENDAR", generateDsfCp027CalendarQuestion],
] as const;

for (const language of ["hi","pa"] as const) {
  for (const [laneId,generate] of lanes) {
    for (let i=0;i<5;i++) {
      const english=generate(`cp031:${laneId}:${i}`) as any;
      const localized=localizeDsfQl002ReasoningQuestion(laneId,english,language) as any;
      assert.equal(localized.language,language);
      assert.equal(localized.locale,language==="hi" ? "hi-IN" : "pa-IN");
      assert.equal(localized.semanticKey,english.semanticKey);
      assert.equal(localized.canonicalAnswer,english.canonicalAnswer);
      assert.equal(localized.correctIndex,english.correctIndex);
      assert.equal(localized.statements.length,3);
      assert.equal(localized.options.length,5);
      assert.deepEqual(localized.proof,english.proof);
      assert.equal(localized.lifecycle.questionStudioDiscoverable,true);
      assert.equal(localized.lifecycle.questionBankWritable,false);
      assert.equal(localized.lifecycle.testEligible,false);
      assert.equal(localized.lifecycle.mockTestEligible,false);
      assert.equal(localized.lifecycle.publiclyPublishable,false);
      assert.equal(localized.lifecycle.automaticStudentPublication,false);
      assert.ok(localized.explanation.includes(language==="hi" ? "कथन I" : "ਕਥਨ I"));
      assert.ok(localized.explanation.includes(language==="hi" ? "कथन II" : "ਕਥਨ II"));
      assert.ok(localized.explanation.includes(language==="hi" ? "कथन III" : "ਕਥਨ III"));
      const learnerText=[localized.stem,...localized.statements.map((s:any)=>s.text),...localized.options.map((o:any)=>o.text),localized.explanation].join(" ");
      for(const banned of ["minimal sufficient statement set","target person","parent-type relation","BROTHER_IN_LAW","GRANDDAUGHTER"]) {
        assert.equal(learnerText.includes(banned),false,`${language}/${laneId} leaked ${banned}`);
      }
    }
  }
}
console.log("DSF-CP-031 QL002 Hindi/Punjabi localization parity: PASS (70 localized samples + English controls)");
