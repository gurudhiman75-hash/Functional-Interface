import assert from "node:assert/strict";
import { generateDsfCp021RankingQuestion } from "../DSF-CP-021/ranking-three-statement-batch-v1.ts";
import { generateDsfCp022DirectionQuestion } from "../DSF-CP-022/direction-three-statement-batch-v1.ts";
import { generateDsfCp023BloodQuestion } from "../DSF-CP-023/blood-relations-three-statement-batch-v1.ts";
import { generateDsfCp024InequalityQuestion } from "../DSF-CP-024/inequality-three-statement-batch-v1.ts";
import { generateDsfCp025SeatingQuestion } from "../DSF-CP-025/seating-three-statement-batch-v1.ts";
import { generateDsfCp026CodingQuestion } from "../DSF-CP-026/coding-three-statement-batch-v1.ts";
import { generateDsfCp027CalendarQuestion } from "../DSF-CP-027/calendar-three-statement-batch-v1.ts";

const generators = [
  ["RANKING", generateDsfCp021RankingQuestion],
  ["DIRECTION", generateDsfCp022DirectionQuestion],
  ["BLOOD_RELATIONS", generateDsfCp023BloodQuestion],
  ["INEQUALITY", generateDsfCp024InequalityQuestion],
  ["SEATING", generateDsfCp025SeatingQuestion],
  ["CODING", generateDsfCp026CodingQuestion],
  ["CALENDAR", generateDsfCp027CalendarQuestion],
] as const;

const bannedStemFragments = [
  "only the remainder modulo 7 affects",
  "solve this first",
  "use the following method",
  "first determine",
];

for (const [domain, generate] of generators) {
  for (let i = 0; i < 8; i += 1) {
    const q = generate(`cp029:${domain}:${i}`) as any;
    const explanation = String(q.explanation);
    const stem = String(q.stem).toLowerCase();

    assert.match(explanation, /Statement I alone:/);
    assert.match(explanation, /Statement II alone:/);
    assert.match(explanation, /Statement III alone:/);
    assert.match(explanation, /Statements I and II together:/);
    assert.match(explanation, /Statements I and III together:/);
    assert.match(explanation, /Statements II and III together:/);
    assert.match(explanation, /Statements I, II and III together:/);
    assert.match(explanation, /Hence,/);

    for (const fragment of bannedStemFragments) {
      assert.equal(stem.includes(fragment), false, `${domain}: learner stem leaks guidance: ${fragment}`);
    }

    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
  }
}

console.log(JSON.stringify({
  status: "PASS_DSF_CP029_REASONING_EDITORIAL_SURFACE_V1",
  domains: generators.map(([domain]) => domain),
  explanationContract: "FULL_SEVEN_SUBSET_BREAKDOWN",
  learnerDelivery: "LOCKED",
}, null, 2));
