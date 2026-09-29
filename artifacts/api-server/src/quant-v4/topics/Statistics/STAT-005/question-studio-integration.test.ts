import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";

function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }

async function main() {
  const pkg = quantV4QuestionStudioAdapter.listPackages().find((item) => item.packageId === "STAT-005");
  assert(pkg, "Quant V4 Question Studio package discovery is missing STAT-005.");
  assert(pkg.enabled && pkg.engineId === "quant-v4", "STAT-005 must be enabled on Quant V4.");
  assert(pkg.questionBankWritable === false && pkg.testEligible === false && pkg.mockTestEligible === false
    && pkg.publiclyPublishable === false && pkg.automaticStudentPublication === false && pkg.productionReleaseAuthorized === false,
  "STAT-005 discovery metadata weakened a lifecycle lock.");
  const result = await quantV4QuestionStudioAdapter.generate({ packageId: "STAT-005", language: "en", count: 16,
    seed: "STAT-005-QS-REGISTRY", exam: "SSC_CGL_JSO" });
  assert(result.questions.length === 16, "STAT-005 did not generate sixteen questions through Quant V4.");
  assert(new Set(result.questions.map((item) => String(item.questionLanguageId ?? ""))).size === 16,
    "Question Studio did not exercise all STAT-005 permanent QLs.");
  assert(result.questions.every((item) => item.packageId === "STAT-005" && item.examProfile === "SSC_CGL_JSO"
    && item.questionBankWritable === false && item.testEligible === false && item.mockTestEligible === false
    && item.publiclyPublishable === false && item.automaticStudentPublication === false && item.productionReleaseAuthorized === false),
  "Generated Question Studio questions weakened a lifecycle lock or missed the JSO profile.");
  console.log(JSON.stringify({ status: "PASS_STAT_005_QUESTION_STUDIO_INTEGRATION", packageId: "STAT-005", generated: result.questions.length }));
}

void main();
