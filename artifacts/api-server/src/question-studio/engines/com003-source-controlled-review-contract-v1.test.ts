import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { knowledgeV1Com003QuestionStudioAdapterV1 } from "./knowledge-v1-com003-adapter-v1";

const result = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "en",
  count: 1,
  seed: "com003-source-controlled-review-contract-v1",
  runtimeMode: "review-only",
});
const question = result.questions[0]!;
assert.equal(question.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(question.readOnly, true);
assert.equal(result.generationContext?.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(result.generationContext?.frozenCorpusOnly, true);
assert.equal(result.generationContext?.immutableCorpus, true);

const qualityRouteSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-quality.ts"),
  "utf8",
);
assert(qualityRouteSource.includes('asString(previousPayload.revisionPolicy) === "SOURCE_GENERATOR_ONLY"'));
assert(qualityRouteSource.includes('return { kind: "source_controlled" as const };'));
assert(qualityRouteSource.includes('code: "SOURCE_GENERATOR_ONLY"'));
assert(qualityRouteSource.includes("correct its generator/localization source"));

console.log("[COM003-SOURCE-CONTROLLED-REVIEW-CONTRACT-V1]", {
  valid: true,
  revisionPolicy: question.revisionPolicy,
  readOnly: question.readOnly,
  inlineRevision: false,
  correctionPath: "SOURCE_CORPUS_REFREEZE",
});
