import {
  runMalCp004EnglishClutterFreeV2Pipeline,
  type MalCp004ClutterFreeQuestion,
} from "./cp004-clutter-free-editorial-v2";
import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";

export function polishMalCp004SolutionFirstStem(value: string): string {
  return value
    .replace(/\bA (8\d*|18\d*|11)-litre/gu, "An $1-litre")
    .replace(/\blitres of solution contains\b/giu, "litres of solution contain")
    .replace(/\blitres of water evaporates\b/giu, "litres of water evaporate")
    .replace(/\blitres of water is lost\b/giu, "litres of water are lost");
}

export function runMalCp004EnglishSolutionFirstV2Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ClutterFreeQuestion {
  const base = runMalCp004EnglishClutterFreeV2Pipeline(input);
  const stem = polishMalCp004SolutionFirstStem(base.stem);
  if (stem === base.stem) return base;

  return {
    ...base,
    stem,
    reasoningGraph: {
      ...base.reasoningGraph,
      nodes: base.reasoningGraph.nodes.map((node) =>
        node.kind === "GIVEN" ? { ...node, text: stem } : node,
      ),
    },
  };
}
