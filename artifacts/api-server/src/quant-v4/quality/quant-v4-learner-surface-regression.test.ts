// Current-base refresh sentinel: keeps this learner-surface proof attached to the latest New-main merge state.
import { FORBIDDEN_PHRASES } from "../common/explanation-engine";
import { generateQuestion } from "../generation-engine";
import { PRB_001_LIBRARIES, listPrb001QuestionEntries, runPrb001Pipeline } from "../topics/Probability/PRB-001";
import { PRB_002_LIBRARIES, listPrb002QuestionEntries, runPrb002Pipeline } from "../topics/Probability/PRB-002";
import { probabilityStemEditorialViolations } from "../topics/Probability/shared/editorial-surface-guard";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const SOURCE_META_PREFIX = /^\s*In this\s+(?:standard|classical|finite|structured|objective|exam-style|practice|mock-test|textbook|classroom|selection-based|counting-based|event-based|competitive-exam|review|direct|conditional|multi-stage|outcome-based)\s+(?:problem|question|exercise|scenario|task|item|drill|case|example|experiment|setup|model)\b/i;

function batchItems(batch: any): any[] {
  if (Array.isArray(batch?.questions) && batch.questions.length) return batch.questions;
  if (Array.isArray(batch?.questionPackages) && batch.questionPackages.length) return batch.questionPackages;
  return [];
}

function itemStem(item: any): string {
  return String(item?.text ?? item?.stem ?? "").trim();
}

function itemExplanation(item: any): string {
  if (typeof item?.explanation === "string") return item.explanation;
  if (Array.isArray(item?.explanation?.lines)) return item.explanation.lines.join("\n");
  if (Array.isArray(item?.packageExplanation?.lines)) return item.packageExplanation.lines.join("\n");
  return "";
}

function assertNoGenericExplanation(packageId: string, index: number, explanation: string) {
  const normalized = explanation.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    assert(
      !normalized.includes(phrase.toLowerCase()),
      `${packageId} item ${index + 1} contains forbidden explanation boilerplate: ${phrase}\n${explanation}`,
    );
  }
}

async function auditProbabilityRuntime() {
  let runtimeQuestions = 0;

  for (const entry of listPrb001QuestionEntries()) {
    const question = runPrb001Pipeline(entry.cpId as any, {
      questionLanguageId: entry.qlId,
      seed: `quality-p0:prb001:${entry.qlId}`,
    });
    const violations = probabilityStemEditorialViolations(question.stem);
    assert(!violations.length, `${entry.qlId} learner stem failed editorial guard: ${violations.join(", ")}\n${question.stem}`);
    assert(question.validation.valid, `${entry.qlId} failed its package validator after editorial sanitation.`);
    runtimeQuestions += 1;
  }

  for (const entry of listPrb002QuestionEntries()) {
    const question = runPrb002Pipeline(entry.cpId as any, {
      questionLanguageId: entry.qlId,
      seed: `quality-p0:prb002:${entry.qlId}`,
    });
    const violations = probabilityStemEditorialViolations(question.stem);
    assert(!violations.length, `${entry.qlId} learner stem failed editorial guard: ${violations.join(", ")}\n${question.stem}`);
    assert(question.validation.valid, `${entry.qlId} failed its package validator after editorial sanitation.`);
    runtimeQuestions += 1;
  }

  const sourceMetaTemplateCount = [...PRB_001_LIBRARIES.language, ...PRB_002_LIBRARIES.language]
    .filter((entry) => SOURCE_META_PREFIX.test(entry.stemTemplate))
    .length;

  return { runtimeQuestions, sourceMetaTemplateCount };
}

async function auditLegacyArithmeticRuntime() {
  const packages = ["PCT-001", "PCT-002", "RAP-001"] as const;
  let auditedQuestions = 0;

  for (const packageId of packages) {
    const batch = await generateQuestion({
      packageId,
      count: 60,
      language: "en",
      seed: `quality-p0:${packageId}`,
    } as any);
    const items = batchItems(batch);
    assert(items.length === 60, `${packageId} returned ${items.length} learner items; expected 60.`);

    items.forEach((item, index) => {
      const stem = itemStem(item);
      const explanation = itemExplanation(item);
      assert(stem.length > 0, `${packageId} item ${index + 1} has no learner stem.`);
      assert(explanation.length > 0, `${packageId} item ${index + 1} has no learner explanation.`);
      assert(!SOURCE_META_PREFIX.test(stem), `${packageId} item ${index + 1} leaks editorial metadata in the stem: ${stem}`);
      assertNoGenericExplanation(packageId, index, explanation);
      auditedQuestions += 1;
    });
  }

  return { auditedQuestions };
}

async function main() {
  const probability = await auditProbabilityRuntime();
  const arithmetic = await auditLegacyArithmeticRuntime();
  console.log(JSON.stringify({
    status: "PASS_QUANT_V4_LEARNER_SURFACE_P0",
    probabilityRuntimeQuestions: probability.runtimeQuestions,
    probabilitySourceMetaTemplateDebt: probability.sourceMetaTemplateCount,
    arithmeticRuntimeQuestions: arithmetic.auditedQuestions,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
