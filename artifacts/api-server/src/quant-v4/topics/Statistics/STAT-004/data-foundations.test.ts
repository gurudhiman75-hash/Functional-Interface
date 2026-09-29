import { generateStat004Question, stat004ContractIds } from "./data-foundations";
import { generateStat004QuestionStudioBatch, isStat004QuestionStudioRequest, stat004QuestionStudioPackageCard } from "./question-studio-adapter";
import { STAT004_PERMANENT_QLS } from "./permanent-ql-registry";
import type { Stat004ExamProfile } from "./types";

function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }

const profiles: readonly Stat004ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const contractIds = stat004ContractIds();
assert(contractIds.length === 15, "STAT-004 must own all fifteen approved data-foundation contracts.");
assert(STAT004_PERMANENT_QLS.length === contractIds.length, "Each STAT-004 contract must have one permanent QL owner.");
assert(new Set(STAT004_PERMANENT_QLS.map((item) => item.qlId)).size === STAT004_PERMANENT_QLS.length, "STAT-004 permanent QL IDs must be unique.");

let replayChecks = 0;
let generated = 0;
let optionsChecked = 0;
for (const profile of profiles) {
  for (const contractId of contractIds) {
    for (let index = 0; index < 50; index += 1) {
      const seed = `STAT-004-DATA-FOUNDATIONS:${profile}:${contractId}:${index}`;
      const q = generateStat004Question({ seed, contractId, examProfile: profile });
      const replay = generateStat004Question({ seed, contractId, examProfile: profile });
      assert(JSON.stringify(q) === JSON.stringify(replay), `Non-deterministic replay for ${contractId}, ${profile}, seed ${index}.`);
      assert(q.options.length === 4 && new Set(q.options).size === 4, `Invalid option set for ${q.questionId}.`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4 && q.options[q.correctIndex] === q.answer, `Incorrect answer position for ${q.questionId}.`);
      assert(!q.questionBankWritable && !q.testEligible && !q.mockTestEligible && !q.publiclyPublishable && !q.automaticStudentPublication && !q.productionReleaseAuthorized,
        `Review-only lifecycle lock changed for ${q.questionId}.`);
      if (q.contractId === "FREQUENCY_TABLE_CHECK") {
        const freq = q.stem.match(/frequencies ([0-9, ]+)/u)?.[1];
        if (freq) {
          const sum = freq.split(/,\s*/u).map(Number).reduce((a, b) => a + b, 0);
          const stated = Number(q.stem.match(/contains ([0-9]+) observations/u)?.[1]);
          assert(Number(q.answer) === sum, `Frequency total mismatch for ${q.questionId}.`);
          assert(stated > 0, `Could not read stated observation count for ${q.questionId}.`);
          assert((sum === stated) === q.explanation.includes("does match"), `Reconciliation explanation mismatch for ${q.questionId}.`);
        }
      }
      if (q.contractId === "BUILD_A_BASIC_FREQUENCY_TABLE") {
        const raw = q.stem.match(/observations are ([0-9, ]+)|observations is ([0-9, ]+)/u);
        const values = (raw?.[1] ?? raw?.[2] ?? "").split(/,\s*/u).map(Number);
        const answer = q.answer.split(/,\s*/u).map(Number);
        assert(values.length >= 8 && answer.length === 3 && answer.reduce((a, b) => a + b, 0) === values.length,
          `Frequency construction total mismatch for ${q.questionId}.`);
        const independentlyTallied = [0, 0, 0];
        for (const value of values) {
          const classIndex = value < 4 ? 0 : value < 8 ? 1 : 2;
          independentlyTallied[classIndex] = (independentlyTallied[classIndex] ?? 0) + 1;
        }
        assert(answer.every((count, i) => count === independentlyTallied[i]), `Independent class tally mismatch for ${q.questionId}.`);
      }
      assert(q.explanation.trim().length >= 40, `Explanation too short for ${q.questionId}.`);
      generated += 1;
      replayChecks += 1;
      optionsChecked += q.options.length;
    }
  }
}

async function verifyQuestionStudioIntegration() {
  const card = stat004QuestionStudioPackageCard();
  assert(card.enabled === true && card.packageId === "STAT-004", "STAT-004 package card is not discoverable.");
  assert(card.questionBankWritable === false && card.testEligible === false && card.mockTestEligible === false
    && card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false,
  "STAT-004 package card weakened a lifecycle lock.");
  assert(isStat004QuestionStudioRequest({ packageId: "STAT-004", topic: "Statistics" }), "STAT-004 request was not recognized.");
  const batch = await generateStat004QuestionStudioBatch({ packageId: "STAT-004", language: "en", count: 15, seed: "STAT-004-QS-INTEGRATION" });
  assert(batch.questions.length === 15 && new Set(batch.questions.map((q) => q.permanentQlId)).size === 15,
    "Question Studio batch did not exercise all fifteen permanent QLs.");
  assert(batch.questions.every((q) => q.questionBankWritable === false && q.testEligible === false && q.mockTestEligible === false
    && q.publiclyPublishable === false && q.automaticStudentPublication === false && q.productionReleaseAuthorized === false),
  "Question Studio generation weakened a lifecycle lock.");
  const hard = await generateStat004QuestionStudioBatch({ packageId: "STAT-004", questionLanguageId: "STAT-QL-035", language: "en", count: 2, seed: "STAT-004-QS-HARD" });
  assert(hard.questions.every((q) => q.questionLanguageId === "STAT-QL-035" && q.difficulty === "Hard"),
    "Explicit STAT-QL-035 generation drifted from its permanent Hard contract.");
  console.log(JSON.stringify({ status: "PASS_STAT_004_DATA_FOUNDATIONS", contractCount: contractIds.length,
    profiles: profiles.length, generated, replayChecks, optionsChecked, questionStudioBatch: batch.questions.length,
    lifecycle: "CONTROLLED_REVIEW_ONLY" }));
}
void verifyQuestionStudioIntegration();
