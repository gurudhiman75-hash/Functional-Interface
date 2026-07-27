import assert from "node:assert/strict";

import { normalizeGeneratedQuestionPayload } from "../../../../../lib/admin-question-conversion";
import { isGeneratedQuestionPublicationBlocked } from "../../../../../lib/generated-question-publication";
import { generateQuestion } from "../../../../../reasoning-v1/generation-engine";

const generated = await generateQuestion({
  packageId: "OPS-001",
  questionLanguageId: "OPS-QL-001",
  language: "en",
  seed: "ops-001-publication-lock",
  count: 1,
});
const preview = generated.questions[0]!;
const converted = normalizeGeneratedQuestionPayload(preview, {
  itemId: "ops-001-publication-lock-item",
  generationRunCode: "GEN-OPS-PUBLICATION-LOCK",
});

assert.equal(isGeneratedQuestionPublicationBlocked(converted.answerModel), true);
assert.equal(
  isGeneratedQuestionPublicationBlocked({
    kind: "single_choice",
    generation: { publiclyPublishable: true, publicationEnabled: true },
  }),
  false,
);
assert.equal(isGeneratedQuestionPublicationBlocked({ kind: "single_choice" }), false);

console.log("OPS-001 publication lock proof passed.", {
  qlId: preview.questionLanguageId,
  publiclyPublishable: preview.publiclyPublishable,
  publicationEnabled: preview.metadata.publicationEnabled,
});
