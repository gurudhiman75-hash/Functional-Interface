import assert from "node:assert/strict";
import {
  CLOCK_TASK_CATALOG,
  buildClockEndToEndReview,
  generateClockQuestion,
  renderClockReviewHtml,
  type ClockMediaAsset,
} from "../topics/Clocks/CLK-001/runtime";

const diagramTasks = new Set([
  "READ_TIME_FROM_DIAGRAM",
  "SELECT_DIAGRAM_FOR_TIME",
  "READ_ANGLE_TYPE_FROM_DIAGRAM",
  "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM",
  "COMPLETE_PARTIAL_DIAL",
  "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT",
  "TEXT_DIAGRAM_SYNTHESIS",
]);

function assertSafeNonRevealingAsset(asset: ClockMediaAsset): void {
  assert.equal(asset.mimeType, "image/svg+xml");
  assert.match(asset.svg, /^<svg /);
  assert.doesNotMatch(asset.svg, /<script|foreignObject|javascript:|on\w+\s*=/i);
  assert(asset.id.length > 0);
  assert(asset.semanticKey.length > 0);
  assert(asset.fingerprint.length > 0);
  assert(asset.ariaLabel.length > 0);
  assert.doesNotMatch(asset.ariaLabel, /correct|answer|target|shows? \d{1,2}:\d{2}/i);
}

let generated = 0;
let promptMediaQuestions = 0;
let optionMediaQuestions = 0;

for (const [taskId] of CLOCK_TASK_CATALOG) {
  if (!diagramTasks.has(taskId)) continue;

  for (let seedIndex = 0; seedIndex < 25; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-MEDIA-CONTRACT-${taskId}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });

    assert.doesNotMatch(question.stem, /<svg|<script|foreignObject|javascript:/i);
    assert.equal(question.solveTrace.proofLevel, "DUAL_ANSWER_ORACLE");
    assert.equal(question.solveTrace.stemScenarioParity, true);
    assert.equal(question.solveTrace.answerContractVerified, true);

    if (taskId === "SELECT_DIAGRAM_FOR_TIME") {
      assert.equal(question.media?.prompt, undefined);
      assert.equal(question.media?.options?.length, 4);
      const optionKeys = question.options.map((option) => option.semanticKey).sort();
      const mediaKeys = question.media!.options!.map((entry) => entry.semanticKey).sort();
      assert.deepEqual(mediaKeys, optionKeys);
      assert.equal(new Set(mediaKeys).size, 4);

      for (const entry of question.media!.options!) {
        assert.equal(entry.asset.role, "OPTION_DIAGRAM");
        assert.equal(entry.asset.semanticKey, entry.semanticKey);
        assertSafeNonRevealingAsset(entry.asset);
      }
      optionMediaQuestions += 1;
    } else {
      assert(question.media?.prompt);
      assert.equal(question.media!.prompt!.role, "PROMPT_DIAGRAM");
      assertSafeNonRevealingAsset(question.media!.prompt!);
      promptMediaQuestions += 1;
    }

    if (![
      "READ_ANGLE_TYPE_FROM_DIAGRAM",
      "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT",
    ].includes(taskId)) {
      assert.equal(
        question.stem.toLowerCase().includes(question.answer.display.toLowerCase()),
        false,
        `${taskId} leaked its answer into the visible stem.`,
      );
    }

    generated += 1;
  }
}

assert.equal(generated, diagramTasks.size * 25);
assert(promptMediaQuestions > 0);
assert(optionMediaQuestions > 0);

const review = buildClockEndToEndReview({
  seedPrefix: "CLK-MEDIA-REVIEW",
  locales: ["en-IN"],
});
const html = renderClockReviewHtml(review);
assert.match(html, /class="prompt-media"/);
assert.match(html, /class="option-media"/);
assert.doesNotMatch(html, /&lt;svg[^>]*&gt;.*class="stem"/i);
assert.doesNotMatch(html, /<script|foreignObject|javascript:/i);

console.log(JSON.stringify({
  status: "PASS_CLK_001_STRUCTURED_MEDIA_CONTRACTS",
  generated,
  promptMediaQuestions,
  optionMediaQuestions,
  rawSvgInStems: 0,
  answerRevealingAriaLabels: 0,
}, null, 2));
