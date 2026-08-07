import {
  runMalCp004EnglishClutterFreeV2Pipeline,
  type MalCp004ClutterFreeQuestion,
} from "./cp004-clutter-free-editorial-v2";
import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";

export function polishMalCp004SolutionFirstStem(value: string): string {
  return value
    .replace(/\bA (8\d*|18\d*|11)(?=[\s%-])/gu, "An $1")
    .replace(/\ba (8\d*|18\d*|11)(?=[\s%-])/gu, "an $1")
    .replace(/\ba alcohol\b/giu, "an alcohol")
    .replace(/\blitres of solution contains\b/giu, "litres of solution contain")
    .replace(/\blitres of water evaporates\b/giu, "litres of water evaporate")
    .replace(/\blitres evaporates\b/giu, "litres evaporate")
    .replace(/\blitres of water is lost\b/giu, "litres of water are lost")
    .replace(/\bthe (raisins|dried grapes) contains\b/giu, "the $1 contain")
    .replace(
      /After drying, ([0-9][^,]*? kg) of ([^.]+?) contains/giu,
      "After drying, a $1 batch of $2 contains",
    )
    .replace(/For a processing vessel,/giu, "In a processing vessel,")
    .replace(
      /In a processing vessel, the solution initially contains a ([^.]+) solution\./giu,
      "In a processing vessel, the initial solution is $1.",
    )
    .replace(
      /holds ([0-9][0-9 /]*) litres of concentrate solution of concentration ([^.]+)\./giu,
      "holds $1 litres of a $2 concentrate solution.",
    );
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
