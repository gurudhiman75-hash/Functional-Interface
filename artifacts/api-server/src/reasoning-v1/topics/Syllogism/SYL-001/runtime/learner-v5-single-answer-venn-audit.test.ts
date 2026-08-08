import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let diagrams = 0;
let relevantSets = 0;
let renderedSets = 0;
let comparisonPanels = 0;
let missingMarkedAnswerCaptions = 0;

function occurrences(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length;
}

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      const svg = presentation.diagram.svg ?? "";
      const answerText = question.options[question.correctIndex]?.text ?? presentation.answer.text;
      const terms = new Set([
        ...question.structuredPrompt.premises.flatMap((premise) => [premise.subject, premise.predicate]),
        ...question.structuredPrompt.conclusions.flatMap((conclusion) => [conclusion.subject, conclusion.predicate]),
      ]);
      const svgCount = occurrences(svg, /<svg\b/gu);
      const setCount = occurrences(svg, /<g data-set="/gu);
      const panelCount = occurrences(svg, /data-model-panel=|data-either-or-panel=|class="[^"]*panel/gu);
      records += 1;
      diagrams += svgCount;
      relevantSets += terms.size;
      renderedSets += setCount;
      comparisonPanels += panelCount;

      assert.equal(presentation.diagram.enabled, true);
      assert.equal(presentation.diagram.diagramCount, 1);
      assert.equal(svgCount, 1, `${definition.qlId}/${seed}/${locale}: expected one SVG only`);
      assert.match(svg, /data-single-answer-venn="true"/u);
      assert.match(svg, /data-correct-option-only="true"/u);
      assert.match(svg, /data-comparison-panels="0"/u);
      assert.match(svg, /class="examtree-venn-svg examtree-single-answer-venn"/u);
      assert.equal(setCount, terms.size, `${definition.qlId}/${seed}/${locale}: not every relevant set is in the single diagram`);
      assert.equal(panelCount, 0, `${definition.qlId}/${seed}/${locale}: comparison panel remains`);
      assert.doesNotMatch(svg, /CAN BE TRUE|CAN BE FALSE|सत्य हो सकता है|असत्य हो सकता है|ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ|ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ/iu);
      assert.doesNotMatch(svg, /premise-card|conclusion-card|section-title|data-relation-map|node-link|arrow map/iu);
      assert.doesNotMatch(svg, /<rect\b/iu, `${definition.qlId}/${seed}/${locale}: card or panel rectangle remains`);
      assert.match(svg, /<(?:circle|ellipse)\b/u);
      assert.ok(presentation.diagram.caption?.includes(answerText));
      if (!presentation.diagram.caption?.includes(answerText)) missingMarkedAnswerCaptions += 1;
      assert.equal(presentation.diagram.omissionReason, null);
      assert.ok(presentation.diagram.semanticSignature.startsWith("syl-v5:focused-venn:single-answer:"));
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.equal(diagrams, records);
assert.equal(renderedSets, relevantSets);
assert.equal(comparisonPanels, 0);
assert.equal(missingMarkedAnswerCaptions, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_SINGLE_ANSWER_VENN",
  records,
  diagrams,
  relevantSets,
  renderedSets,
  comparisonPanels,
  missingMarkedAnswerCaptions,
  contract: {
    svgPerRecord: 1,
    combinedArrangementPerRecord: 1,
    correctOptionOnly: true,
    trueFalseComparisonPanels: 0,
    premiseCards: 0,
    conclusionCards: 0,
  },
}, null, 2));
