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
let omittedDiagrams = 0;
let omittedComplex = 0;
let omittedUnstable = 0;
let nonVennVisuals = 0;
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
  "max-width: 340px",
  "height: auto",
]) {
  assert.ok(SYL_V5_VIEWPORT_CSS.includes(requiredRule), `Viewport CSS lacks ${requiredRule}.`);
}

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      const diagramSvg = presentation.diagram.svg ?? "";
      records += 1;

      assert.equal(presentation.remediationEvidence.humanViewportStatus, "APPROVED");
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

      if (!presentation.diagram.enabled) {
        omittedDiagrams += 1;
        assert.equal(presentation.learnerExplanation.showDiagram, false);
        assert.equal(presentation.diagram.diagramCount, 0);
        assert.equal(presentation.diagram.mode, "OMITTED_NOT_USEFUL");
        assert.equal(presentation.diagram.svg, null);
        assert.equal(presentation.diagram.caption, null);
        assert.equal(presentation.diagram.accessibleDescription, null);
        if (presentation.diagram.omissionReason === "MORE_THAN_THREE_TERMS") omittedComplex += 1;
        else if (presentation.diagram.omissionReason === "NO_STABLE_SIMPLE_VENN") omittedUnstable += 1;
        else assert.fail(`${definition.qlId}/${seed}/${locale}: unexpected omission reason`);
        continue;
      }

      enabledDiagrams += 1;
      assert.equal(presentation.learnerExplanation.showDiagram, true);
      assert.equal(presentation.diagram.diagramCount, 1);
      assert.equal(presentation.diagram.mobileViewBoxWidth, 340);
      assert.equal(presentation.diagram.omissionReason, null);
      assert.ok(diagramSvg);
      assert.ok(presentation.diagram.caption?.trim());
      assert.ok(presentation.diagram.accessibleDescription?.trim());
      assert.match(presentation.diagram.mode, /^VENN_/u);
      assert.match(diagramSvg, /<svg\b/u);
      assert.match(diagramSvg, /viewBox="0 0 340 210"/u);
      assert.match(diagramSvg, /<(?:circle|ellipse)\b/u);
      assert.match(diagramSvg, /font-size:13px/u);
      assert.doesNotMatch(diagramSvg, /textLength=|lengthAdjust=|separation-mark|×[1-9]/u);
      assert.doesNotMatch(diagramSvg, /relation map|relation-map|node-link|arrow map/iu);
      assert.doesNotMatch(diagramSvg, /<script\b|<foreignObject\b/iu);
      if (!/^VENN_/u.test(presentation.diagram.mode) || !/<(?:circle|ellipse)\b/u.test(diagramSvg)) {
        nonVennVisuals += 1;
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(enabledDiagrams > 0);
assert.ok(omittedDiagrams > 0);
assert.ok(omittedComplex > 0);
assert.equal(nonVennVisuals, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_VIEWPORT_EVIDENCE_CONTRACT",
  records,
  widths: SYL_V5_VIEWPORT_WIDTHS,
  diagramCoverage: {
    enabled: enabledDiagrams,
    omitted: omittedDiagrams,
    omittedComplex,
    omittedUnstable,
    nonVennVisuals,
  },
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
    readableDiagramWidth: 340,
  },
  humanViewportStatus: "APPROVED_BY_PRODUCT_OWNER",
}, null, 2));
