import assert from "node:assert/strict";
import { SIF_CP_IDS, type SifLocale } from "./types.ts";
import { previewSif001QuestionStudioReview } from "./question-studio-review.ts";

const locales: readonly SifLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [1101, 2202, 3303, 4404, 5505, 6606] as const;
let checked = 0;

for (const cpId of SIF_CP_IDS) {
  for (const locale of locales) {
    const statements = new Set<string>();
    const answerPositions = new Set<number>();

    for (const seed of seeds) {
      const preview = previewSif001QuestionStudioReview({ cpId, locale, seed });
      const q = preview.question;

      assert.equal(preview.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(preview.questionBankWritable, false);
      assert.equal(preview.testEligible, false);
      assert.equal(preview.mockTestEligible, false);
      assert.equal(preview.publiclyPublishable, false);

      assert.ok(q.statement.trim().length >= 20, `${cpId}/${locale}/${seed}: statement too thin`);
      assert.ok(q.explanation.trim().length >= 45, `${cpId}/${locale}/${seed}: explanation too thin`);
      assert.equal(q.options.length, 5, `${cpId}/${locale}/${seed}: expected five answer-code options`);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `${cpId}/${locale}/${seed}: invalid correct index`);
      assert.equal(new Set(q.options).size, q.options.length, `${cpId}/${locale}/${seed}: duplicate answer-code options`);

      const learnerText = [q.instruction, q.statement, ...q.inferences, q.explanation].join(" ");
      assert.doesNotMatch(
        learnerText,
        /prototype|authority|fingerprint|solver|generation order|CONTROLLED_NOVEL|NOVELTY_READINESS/i,
        `${cpId}/${locale}/${seed}: internal audit vocabulary leaked to learner text`,
      );
      assert.doesNotMatch(
        learnerText,
        /associated with|most closely linked|broad(?:ly)?/i,
        `${cpId}/${locale}/${seed}: mechanical wording detected`,
      );

      const noveltyGate = q.validation.find((gate) => gate.gate === "NOVELTY_READINESS");
      assert.ok(noveltyGate?.passed, `${cpId}/${locale}/${seed}: novelty-readiness fingerprint gate missing`);
      assert.doesNotMatch(noveltyGate.detail, /novelty(?:\s+)?(?:passed|complete|closed)/i);

      statements.add(q.statement);
      answerPositions.add(q.correctIndex);
      checked++;
    }

    assert.ok(statements.size >= 3, `${cpId}/${locale}: weak scenario variation (${statements.size}/6)`);
    assert.ok(answerPositions.size >= 2, `${cpId}/${locale}: answer position is too fixed`);
  }
}

console.log(JSON.stringify({
  status: "PASS_SIF_001_DEEP_AUDIT_WAVE1",
  cpCount: SIF_CP_IDS.length,
  locales,
  seedsPerCpLocale: seeds.length,
  learnerSurfacesChecked: checked,
  noveltyStatus: "DEFERRED_READINESS_ONLY",
}, null, 2));
