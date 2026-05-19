import type { Difficulty, PercentageSubtype } from "../canonical/percentage-types";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { renderSvgVisualization } from "../svg/renderers/svg-pipeline";
import { validateSvgPedagogyGraph } from "../svg/validators/svg-pedagogy-validator";
import type { LanguageCode } from "../localization/contracts/language-contracts";

type Options = {
  count: number;
  seed: number;
  subtype?: PercentageSubtype;
  difficulty?: Difficulty;
  language: LanguageCode;
  detailLimit: number;
};

const DEFAULT_COUNT = 5;
const MAX_COUNT = 1000;
const LINE = "========================================";

function parseArgs(): Options {
  const options: Options = {
    count: DEFAULT_COUNT,
    seed: 1,
    language: "en",
    detailLimit: 5,
  };

  for (const arg of process.argv.slice(2)) {
    const [key, rawValue] = arg.replace(/^--/u, "").split("=");
    const value = rawValue ?? "";
    if (key === "count") {
      options.count = Math.min(MAX_COUNT, Math.max(1, Number(value) || DEFAULT_COUNT));
    }
    if (key === "seed") {
      options.seed = Math.max(1, Number(value) || 1);
    }
    if (key === "subtype") {
      options.subtype = value as PercentageSubtype;
    }
    if (key === "difficulty") {
      options.difficulty = value as Difficulty;
    }
    if (key === "language" && ["en", "hi", "pa"].includes(value)) {
      options.language = value as LanguageCode;
    }
    if (key === "detail-limit") {
      options.detailLimit = Math.max(0, Number(value) || 0);
    }
  }

  return options;
}

function formatAverage(total: number, count: number) {
  return count === 0 ? 0 : Math.round(total / count);
}

const options = parseArgs();
let generated = 0;
let attempts = 0;
let valid = 0;
let layoutQuality = 0;
let clarity = 0;
let continuity = 0;
let derivation = 0;
let multilingualSafety = 0;
let preview = 0;
const nodeTypes = new Map<string, number>();
const failures: string[] = [];

console.log(LINE);
console.log("SVG Pedagogy Inspector");
console.log(LINE);
console.log(`count = ${options.count}`);
console.log(`seed = ${options.seed}`);
console.log(`language = ${options.language}`);
console.log(`subtype = ${options.subtype ?? "all"}`);
console.log(`difficulty = ${options.difficulty ?? "all"}`);
console.log(`detailLimit = ${options.detailLimit}`);

while (generated < options.count && attempts < options.count * 20) {
  const factory =
    PERCENTAGE_MOTIF_FACTORY_LIST[
      attempts % PERCENTAGE_MOTIF_FACTORY_LIST.length
    ]!;
  const seed =
    Math.floor(attempts / PERCENTAGE_MOTIF_FACTORY_LIST.length) +
    options.seed;
  attempts += 1;
  const problem = factory(seed);
  if (options.subtype && problem.subtype !== options.subtype) {
    continue;
  }
  if (options.difficulty && problem.difficulty !== options.difficulty) {
    continue;
  }

  const graph = buildReasoningGraph(problem);
  const rendered = renderSvgVisualization({
    problem,
    graph,
    language: options.language,
  });
  const validation = validateSvgPedagogyGraph(
    rendered.layout,
    rendered.rendered.svg,
  );
  generated += 1;
  if (validation.valid) {
    valid += 1;
  } else if (failures.length < 20) {
    failures.push(
      `${createProblemSignature(problem)}: ${validation.issues.join("; ")}`,
    );
  }
  layoutQuality += validation.metrics.layoutQualityScore;
  clarity += validation.metrics.pedagogicalClarityScore;
  continuity += validation.metrics.nodeContinuityScore;
  derivation += validation.metrics.derivationVisibilityScore;
  multilingualSafety += validation.metrics.multilingualSvgSafety;
  for (const node of rendered.semanticGraph.nodes) {
    nodeTypes.set(node.type, (nodeTypes.get(node.type) ?? 0) + 1);
  }

  if (preview < options.detailLimit) {
    preview += 1;
    console.log(LINE);
    console.log(`Sample: ${generated}`);
    console.log(`Subtype: ${problem.subtype}`);
    console.log(`Signature: ${createProblemSignature(problem)}`);
    console.log(`SVG size: ${rendered.rendered.width}x${rendered.rendered.height}`);
    console.log(`Nodes: ${rendered.semanticGraph.nodes.map((node) => node.type).join(", ")}`);
    console.log(`Valid: ${validation.valid ? "yes" : "no"}`);
    console.log(`Layout quality: ${validation.metrics.layoutQualityScore}`);
    console.log(`Pedagogical clarity: ${validation.metrics.pedagogicalClarityScore}`);
    console.log(`Derivation visibility: ${validation.metrics.derivationVisibilityScore}`);
    console.log(`SVG preview: ${rendered.rendered.svg.slice(0, 180).replace(/\s+/gu, " ")}...`);
  }
}

console.log(LINE);
console.log("Summary:");
console.log(`  generated = ${generated}`);
console.log(`  valid = ${valid}/${generated}`);
console.log(`  visualizationCoverage = ${generated > 0 ? 100 : 0}`);
console.log(`  layoutQualityScore = ${formatAverage(layoutQuality, generated)}`);
console.log(`  pedagogicalClarityScore = ${formatAverage(clarity, generated)}`);
console.log(`  multilingualSvgSafety = ${formatAverage(multilingualSafety, generated)}`);
console.log(`  nodeContinuityScore = ${formatAverage(continuity, generated)}`);
console.log(`  derivationVisibilityScore = ${formatAverage(derivation, generated)}`);
console.log("  nodeTypes:");
for (const [type, count] of [...nodeTypes.entries()].sort()) {
  console.log(`    ${type} = ${count}`);
}
if (failures.length > 0) {
  console.log("  failures:");
  for (const failure of failures) {
    console.log(`    - ${failure}`);
  }
} else {
  console.log("  failures = none");
}

