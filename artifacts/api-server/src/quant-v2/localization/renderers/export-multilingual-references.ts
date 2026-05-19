import fs from "node:fs";
import path from "node:path";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../../canonical/percentage-motif-factories";
import { semanticAnswerText } from "../../editorial/contextual-humanization";
import { realizeEditorialProblem } from "../../editorial/stem-realizer";
import { buildReasoningGraph } from "../../reasoning/reasoning-registry";
import { createProblemSignature } from "../../utils/problem-signature";
import { renderLocalizedRealization } from "./language-renderer";
import { validateLocalization } from "../validators/localization-validator";

const SAMPLE_COUNT = 60;

export function buildMultilingualReferenceSamples() {
  return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const factory =
      PERCENTAGE_MOTIF_FACTORY_LIST[
        index % PERCENTAGE_MOTIF_FACTORY_LIST.length
      ]!;
    const seed =
      Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const signature = createProblemSignature(problem);
    const editorial = realizeEditorialProblem({
      problem,
      graph,
      seed: `multilingual:${index}:${signature}`,
    });
    const hi = renderLocalizedRealization({
      language: "hi",
      problem,
      graph,
      editorial,
    });
    const pa = renderLocalizedRealization({
      language: "pa",
      problem,
      graph,
      editorial,
    });
    const hiValidation = validateLocalization({
      source: editorial,
      localized: hi,
    });
    const paValidation = validateLocalization({
      source: editorial,
      localized: pa,
    });

    return {
      id: `ml-${String(index + 1).padStart(3, "0")}`,
      seed,
      subtype: problem.subtype,
      category: problem.category,
      difficulty: problem.difficulty,
      signature,
      answer: semanticAnswerText(problem),
      topology: {
        family: problem.topology?.family ?? null,
        variant: problem.topology?.variant ?? null,
      },
      english: {
        stem: editorial.stem,
        explanation: editorial.explanation,
      },
      hindi: {
        stem: hi.stem,
        explanation: hi.explanation,
        metrics: hiValidation.metrics,
      },
      punjabi: {
        stem: pa.stem,
        explanation: pa.explanation,
        metrics: paValidation.metrics,
      },
    };
  });
}

function main() {
  const apiServerDir = fs.existsSync(
    path.join(process.cwd(), "artifacts/api-server/src/quant-v2"),
  )
    ? path.join(process.cwd(), "artifacts/api-server")
    : process.cwd();
  const outputDir = path.join(
    apiServerDir,
    "src/quant-v2/stability/multilingual-reference-samples",
  );
  fs.mkdirSync(outputDir, { recursive: true });
  const samples = buildMultilingualReferenceSamples();
  fs.writeFileSync(
    path.join(outputDir, "paired-realizations.json"),
    `${JSON.stringify(samples, null, 2)}\n`,
    "utf8",
  );
  console.log(`Exported ${samples.length} multilingual reference samples.`);
}

if (process.argv[1]?.endsWith("export-multilingual-references.mjs")) {
  main();
}
