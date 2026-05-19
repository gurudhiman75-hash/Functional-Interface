import assert from "node:assert/strict";
import test from "node:test";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { renderSvgVisualization } from "../svg/renderers/svg-pipeline";
import { validateSvgPedagogyGraph } from "../svg/validators/svg-pedagogy-validator";
import { createProblemSignature } from "../utils/problem-signature";
import type { LanguageCode } from "../localization/contracts/language-contracts";

const SAMPLE_COUNT = 3000;
const LANGUAGES: readonly LanguageCode[] = ["en", "hi", "pa"];

test("SVG visualization renders stable multilingual pedagogical graphs", () => {
  let shortcutNodes = 0;
  let hiddenBaseNodes = 0;
  let totalNodes = 0;
  const nodeTypes = new Set<string>();

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const factory =
      PERCENTAGE_MOTIF_FACTORY_LIST[
        index % PERCENTAGE_MOTIF_FACTORY_LIST.length
      ]!;
    const seed =
      Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const signature = createProblemSignature(problem);

    for (const language of LANGUAGES) {
      const result = renderSvgVisualization({
        problem,
        graph,
        language,
        theme: index % 3 === 0
          ? "coaching_board"
          : index % 3 === 1
            ? "exam_sheet"
            : "classroom_whiteboard",
      });
      const validation = validateSvgPedagogyGraph(
        result.layout,
        result.rendered.svg,
      );

      assert.equal(
        validation.valid,
        true,
        `${signature} ${language}: ${validation.issues.join(" | ")}`,
      );
      assert.ok(result.rendered.svg.startsWith("<svg"), signature);
      assert.ok(result.rendered.svg.includes("</svg>"), signature);
      assert.ok(result.exports.html.includes("<figure"), signature);
      assert.ok(result.exports.svgDataUri.startsWith("data:image/svg+xml;base64,"), signature);
      assert.equal(result.exports.png.mimeType, "image/png");
      assert.ok(validation.metrics.layoutQualityScore >= 90, signature);
      assert.ok(validation.metrics.nodeContinuityScore >= 90, signature);
      assert.ok(validation.metrics.derivationVisibilityScore >= 90, signature);
      assert.ok(validation.metrics.multilingualSvgSafety >= 90, signature);

      totalNodes += result.semanticGraph.nodes.length;
      for (const node of result.semanticGraph.nodes) {
        nodeTypes.add(node.type);
        if (node.type === "shortcut_node") {
          shortcutNodes += 1;
        }
        if (node.type === "hidden_base_node") {
          hiddenBaseNodes += 1;
        }
      }
    }
  }

  assert.ok(totalNodes > SAMPLE_COUNT * 2);
  assert.ok(shortcutNodes > 0);
  assert.ok(hiddenBaseNodes > 0);
  assert.ok(nodeTypes.size >= 7);
});

export {};

