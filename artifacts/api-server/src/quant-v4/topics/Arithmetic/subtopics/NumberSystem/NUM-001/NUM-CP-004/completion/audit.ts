
import {
  NUM_CP004_RETAINED_TEMPLATE_IDS,
} from "./types";
import {
  NUM_CP004_RETAINED_TEMPLATE_REGISTRY,
} from "./template-registry";
import {
  generateNumCp004RetainedSweep,
} from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

import { NUM_CP004_SOURCE_DISPOSITIONS } from "./source-dispositions";



const questions = generateNumCp004RetainedSweep(40);
const normalizedStems = new Map<string, string[]>();
const normalizedExplanationClosings = new Map<string, string[]>();

for (const question of questions) {
  const stemKey = question.stem
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .trim();
  const closingKey = question.explanation.finalAnswer
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .trim();
  normalizedStems.set(stemKey, [...(normalizedStems.get(stemKey) ?? []), question.temporaryTemplateId]);
  normalizedExplanationClosings.set(
    closingKey,
    [...(normalizedExplanationClosings.get(closingKey) ?? []), question.temporaryTemplateId],
  );

  assert(question.canonicalAnswer === question.verifierAnswer, `${question.temporaryTemplateId}: verifier mismatch`);
  assert(question.options.length === 4, `${question.temporaryTemplateId}: option count`);
  assert(new Set(question.options.map((option) => option.value)).size === 4, `${question.temporaryTemplateId}: option collision`);
  assert(question.options.filter((option) => option.isCorrect).length === 1, `${question.temporaryTemplateId}: correct-option count`);
  assert(question.explanation.commonTraps.length === 3, `${question.temporaryTemplateId}: trap coverage`);
  assert(question.sourceAncestry.length >= 5, `${question.temporaryTemplateId}: source ancestry`);
  assert(question.prototypeAncestry.length >= 1, `${question.temporaryTemplateId}: prototype ancestry`);
  assert(question.lifecycle.active === false, `${question.temporaryTemplateId}: active leak`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `${question.temporaryTemplateId}: Question Studio leak`);
  assert(question.lifecycle.questionBankWritable === false, `${question.temporaryTemplateId}: Question Bank leak`);
  assert(question.lifecycle.testEligible === false, `${question.temporaryTemplateId}: test leak`);
  assert(question.lifecycle.publiclyPublishable === false, `${question.temporaryTemplateId}: public leak`);
}

const crossTemplateStemCollisions = [...normalizedStems.entries()]
  .filter(([, templateIds]) => new Set(templateIds).size > 1)
  .map(([key, templateIds]) => ({ key, templateIds: [...new Set(templateIds)] }));

const sourceRowsWithNoDisposition = NUM_CP004_SOURCE_DISPOSITIONS.filter((row) => !row.disposition);
assert(sourceRowsWithNoDisposition.length === 0, "source row without disposition");
assert(NUM_CP004_RETAINED_TEMPLATE_REGISTRY.length === 28, "retained registry count");
assert(new Set(NUM_CP004_RETAINED_TEMPLATE_REGISTRY.map((entry) => entry.solveModeId)).size === 28, "solve-mode uniqueness");
assert(new Set(NUM_CP004_RETAINED_TEMPLATE_REGISTRY.map((entry) => entry.temporaryTemplateId)).size === 28, "template uniqueness");
assert(crossTemplateStemCollisions.length === 0, `cross-template normalized stem collisions: ${JSON.stringify(crossTemplateStemCollisions)}`);

const advancedHoldCount = NUM_CP004_SOURCE_DISPOSITIONS.filter((row) => row.disposition === "ADVANCED_ENRICHMENT_HOLD").length;
const reassignedCount = NUM_CP004_SOURCE_DISPOSITIONS.filter((row) => row.disposition.startsWith("REASSIGN_")).length;
const retainedOrMergedCount = NUM_CP004_SOURCE_DISPOSITIONS.length - advancedHoldCount - reassignedCount;

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_COMPLETION_SOURCE_GAP_AND_OWNERSHIP_AUDIT",
  generatedAuditQuestions: questions.length,
  retainedTemplateCount: NUM_CP004_RETAINED_TEMPLATE_IDS.length,
  retainedSolveModeCount: NUM_CP004_RETAINED_TEMPLATE_REGISTRY.length,
  sourceDispositionRows: NUM_CP004_SOURCE_DISPOSITIONS.length,
  retainedOrMergedCount,
  advancedHoldCount,
  reassignedCount,
  sourceRowsWithNoDisposition: sourceRowsWithNoDisposition.length,
  crossTemplateStemCollisions: crossTemplateStemCollisions.length,
  permanentQlCount: 0,
  lifecycleViolations: questions.filter((question) =>
    question.lifecycle.active
    || question.lifecycle.questionStudioDiscoverable
    || question.lifecycle.questionBankWritable
    || question.lifecycle.testEligible
    || question.lifecycle.publiclyPublishable
  ).length,
}, null, 2));
