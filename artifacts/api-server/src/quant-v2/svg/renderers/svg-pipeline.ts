import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { LanguageCode } from "../../localization/contracts/language-contracts";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import type { SvgThemeName } from "../contracts/svg-visualization-types";
import { layoutSvgPedagogyGraph } from "../layout/svg-layout-engine";
import { buildSvgPedagogyGraph } from "../nodes/visualization-transformer";
import { createSvgExportBundle } from "./svg-exporter";
import { renderSvgPedagogy } from "./svg-renderer";

export function renderSvgVisualization(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  language?: LanguageCode;
  theme?: SvgThemeName;
}) {
  const semanticGraph = buildSvgPedagogyGraph({
    problem: input.problem,
    graph: input.graph,
    language: input.language ?? "en",
  });
  const layout = layoutSvgPedagogyGraph(semanticGraph);
  const rendered = renderSvgPedagogy(layout, input.theme ?? "coaching_board");

  return {
    semanticGraph,
    layout,
    rendered,
    exports: createSvgExportBundle(rendered),
  };
}

