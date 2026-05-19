import { writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../../canonical/percentage-motif-factories";
import type { CanonicalPercentageProblem, PercentageSubtype } from "../../canonical/percentage-types";
import { buildReasoningGraph } from "../../reasoning/reasoning-registry";
import { renderSvgVisualization } from "../renderers/svg-pipeline";

const TARGETS: readonly PercentageSubtype[] = [
  "election_margin",
  "mixture_percentage",
  "pass_fail",
  "reverse_percentage",
];
const OUTPUT_DIR = join(
  process.cwd(),
  "src",
  "quant-v2",
  "svg",
  "reference-exports",
);

function sampleForSubtype(subtype: PercentageSubtype) {
  for (let seed = 1; seed <= 60; seed += 1) {
    for (const factory of PERCENTAGE_MOTIF_FACTORY_LIST) {
      const problem = factory(seed);
      if (problem.subtype === subtype) {
        return problem;
      }
    }
  }
  throw new Error(`No reference sample found for ${subtype}`);
}

function exportOne(problem: CanonicalPercentageProblem, fileStem = problem.subtype) {
  const graph = buildReasoningGraph(problem);
  for (const language of ["en", "hi", "pa"] as const) {
    const result = renderSvgVisualization({
      problem,
      graph,
      language,
      theme: "coaching_board",
    });
    writeFileSync(
      join(OUTPUT_DIR, `${fileStem}.${language}.svg`),
      result.rendered.svg,
      "utf8",
    );
  }
}

function hiddenBaseElectionSample() {
  for (let seed = 1; seed <= 120; seed += 1) {
    for (const factory of PERCENTAGE_MOTIF_FACTORY_LIST) {
      const problem = factory(seed);
      if (
        problem.subtype === "election_margin" &&
        problem.topology?.hiddenBase
      ) {
        return problem;
      }
    }
  }
  return sampleForSubtype("election_margin");
}

await mkdir(OUTPUT_DIR, { recursive: true });

for (const subtype of TARGETS) {
  exportOne(sampleForSubtype(subtype));
}
exportOne({
  ...hiddenBaseElectionSample(),
  id: "svg_reference_hidden_base",
}, "hidden_base_election");
