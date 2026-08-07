import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";
import {
  SYL_V5_VIEWPORT_CSS,
  SYL_V5_VIEWPORT_WIDTHS,
} from "./learner-v5-viewport-contract";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let enabledDiagrams = 0;
let longestStem = 0;
let longestOption = 0;
let longestExplanation = 0;

assert.deepEqual(SYL_V5_VIEWPORT_WIDTHS, [360, 412, 768]);
for (const requiredRule of [
  "max-width: 100%",
  "min-width: 0",
  "overflow-wrap: anywhere",
  "grid-template-columns: 28px minmax(0, 1fr)",
  ".diagram svg",
  "width: 100%",
  "height: auto",
]) {
  assert.ok(SYL_V5_VIEWPORT_CSS.includes(requiredRule), `Viewport CSS lacks ${requiredRule}.`);
}

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      records += 1;

      assert.equal(presentation.remediationEvidence.humanViewportStatus, "EVIDENCE_READY_PENDING_APPROVAL");
      assert.ok(question.stem.trim().length > 0);
      assert.ok(question.options.length >= 3 && question.options.length <= 5);
      assert.equal(new Set(question.options.map((option) => option.text)).size, question.options.length);
      assert.ok(question.options.every((option) => option.text.trim().length > 0));
      assert.ok(presentation.learnerExplanation.shortReasoning.every((line) => line.trim().length > 0));
      assert.ok(presentation.learnerExplanation.conclusion.trim().length > 0);

      longestStem = Math.max(longestStem, question.stem.length);
      longestOption = Math.max(longestOption, ...question.options.map((option) => option.text.length));
      longestExplanation = Math.max(
        longestExplanation,
        presentation.learnerExplanation.shortReasoning.join(" ").length
          + presentation.learnerExplanation.conclusion.length,
      );

      if (presentation.diagram.enabled) {
        enabledDiagrams += 1;
        assert.equal(presentation.diagram.diagramCount, 1);
        assert.equal(presentation.diagram.mobileViewBoxWidth, 360);
        assert.ok(presentation.diagram.svg);
        assert.match(presentation.diagram.svg ?? "", /<svg\b/u);
        assert.match(presentation.diagram.svg ?? "", /viewBox=/u);
        assert.doesNotMatch(presentation.diagram.svg ?? "", /<script\b/iu);
        assert.doesNotMatch(presentation.diagram.svg ?? "", /<foreignObject\b/iu);
      } else {
        assert.equal(presentation.diagram.diagramCount, 0);
        assert.equal(presentation.diagram.svg, null);
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(enabledDiagrams > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_VIEWPORT_EVIDENCE_CONTRACT",
  records,
  widths: SYL_V5_VIEWPORT_WIDTHS,
  enabledDiagrams,
  longestContent: {
    stemCharacters: longestStem,
    optionCharacters: longestOption,
    explanationCharacters: longestExplanation,
  },
  layoutProtections: {
    maxWidth: true,
    minWidthZero: true,
    overflowWrapAnywhere: true,
    flexibleOptionColumn: true,
    responsiveSvg: true,
  },
  humanViewportStatus: "EVIDENCE_READY_PENDING_APPROVAL",
}, null, 2));
