import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityReviewQuestionV1 } from "./banking-possibility-review-question-v1";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let diagramSlots = 0;
let enabled = 0;
let omitted = 0;
const modes: Record<string, number> = {};

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const question = generateBankingPossibilityReviewQuestionV1(seed, locale);
    records += 1;
    assert.equal(question.diagrams.length, 2, `${seed}/${locale}: expected two conclusion diagrams`);

    question.diagrams.forEach((diagram, index) => {
      diagramSlots += 1;
      assert.equal(diagram.conclusionIndex, index);
      assert.equal(diagram.conclusionLabel, index === 0 ? "I" : "II");
      assert.equal(diagram.conclusionMode, question.conclusions[index].mode);
      assert.ok(diagram.semanticSignature.length > 0);
      assert.equal(diagram.mobileViewBoxWidth, 340);
      modes[diagram.explanationMode] = (modes[diagram.explanationMode] ?? 0) + 1;

      if (diagram.enabled) {
        enabled += 1;
        assert.ok(diagram.svg, `${seed}/${locale}/${index}: enabled diagram missing SVG`);
        assert.ok(diagram.caption, `${seed}/${locale}/${index}: enabled diagram missing caption`);
        assert.ok(diagram.accessibleDescription, `${seed}/${locale}/${index}: enabled diagram missing accessibility text`);
        assert.match(diagram.svg ?? "", /<svg\b/u);
        assert.doesNotMatch(diagram.svg ?? "", /<script\b|<foreignObject\b/iu);
      } else {
        omitted += 1;
        assert.equal(diagram.svg, null);
        assert.ok(diagram.omissionReason, `${seed}/${locale}/${index}: omitted diagram missing reason`);
      }
    });
  }
}

assert.equal(records, 240);
assert.equal(diagramSlots, 480);
assert.ok(enabled > 0, "restored renderer produced no enabled diagrams");
assert.ok(modes.POSSIBILITY_MODEL > 0);
assert.ok(modes.DIRECT_CONTRADICTION > 0);
assert.ok(modes.DIRECT_CHAIN > 0);
assert.ok(modes.COUNTEREXAMPLE > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_DIAGRAM_RESTORATION",
  records,
  diagramSlots,
  enabled,
  omitted,
  explanationModes: modes,
  renderer: "existing approved learner-v5 exact Venn pipeline",
  regression: "V1 prototype/exporter bypassed the diagram stage; V2 restores one focused diagram per conclusion",
}, null, 2));
