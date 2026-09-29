import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";

function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }

async function main() {
  const pkg = quantV4QuestionStudioAdapter.listPackages().find((item) => item.packageId === "STAT-004");
  assert(pkg, "Quant V4 Question Studio package discovery is missing STAT-004.");
  assert(pkg.enabled && pkg.engineId === "quant-v4", "STAT-004 must be enabled on the Quant V4 engine.");
  assert(pkg.questionBankWritable === false && pkg.testEligible === false && pkg.mockTestEligible === false
    && pkg.publiclyPublishable === false && pkg.automaticStudentPublication === false && pkg.productionReleaseAuthorized === false,
  "STAT-004 discovery metadata weakened a lifecycle lock.");

  const result = await quantV4QuestionStudioAdapter.generate({ packageId: "STAT-004", language: "en", count: 15, seed: "STAT-004-QS-REGISTRY" });
  assert(result.engineId === "quant-v4" && result.questions.length === 15, "STAT-004 did not generate through the Quant V4 adapter.");
  assert(new Set(result.questions.map((item) => String(item.questionLanguageId ?? ""))).size === 15,
    "Question Studio did not exercise all fifteen STAT-004 permanent QLs.");
  assert(result.questions.every((item) => item.packageId === "STAT-004" && item.questionBankWritable === false
    && item.testEligible === false && item.mockTestEligible === false && item.publiclyPublishable === false
    && item.automaticStudentPublication === false && item.productionReleaseAuthorized === false),
  "Generated Question Studio questions weakened a lifecycle lock.");
  console.log(JSON.stringify({ status: "PASS_STAT_004_QUESTION_STUDIO_INTEGRATION", packageId: "STAT-004", generated: result.questions.length }));
}

void main();
