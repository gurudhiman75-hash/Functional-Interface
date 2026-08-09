import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { enumerateLinearOracle } from "../solver/independent-oracle.ts";
import { solveLinear } from "../solver/production-solver.ts";
import type { CandidateClue, LinearSeatingState, SeatingBlueprintId } from "../types.ts";

function requirementsMet(blueprintId: SeatingBlueprintId, clues: readonly CandidateClue[]): boolean {
  const kinds = clues.map((clue) => clue.constraint.kind);
  switch (blueprintId) {
    case "SEA-PBA-001":
      return kinds.includes("AT_END") && kinds.includes("RELATIVE_POSITION");
    case "SEA-PBA-002":
      return kinds.includes("AT_MIDDLE") && kinds.includes("EXACT_COUNT_BETWEEN");
    case "SEA-PBA-003":
      return kinds.filter((kind) => kind === "AT_END").length >= 2 && kinds.includes("ADJACENT");
    case "SEA-PBA-004":
      return kinds.includes("NOT_ADJACENT") && kinds.includes("ABSOLUTE_SEAT");
  }
}

function priority(blueprintId: SeatingBlueprintId, clue: CandidateClue): number {
  const kind = clue.constraint.kind;
  const preferred: Record<SeatingBlueprintId, readonly string[]> = {
    "SEA-PBA-001": ["AT_END", "RELATIVE_POSITION", "ADJACENT", "EXACT_COUNT_BETWEEN", "ABSOLUTE_SEAT", "NOT_ADJACENT", "AT_MIDDLE"],
    "SEA-PBA-002": ["AT_MIDDLE", "EXACT_COUNT_BETWEEN", "RELATIVE_POSITION", "ADJACENT", "ABSOLUTE_SEAT", "AT_END", "NOT_ADJACENT"],
    "SEA-PBA-003": ["AT_END", "ADJACENT", "RELATIVE_POSITION", "EXACT_COUNT_BETWEEN", "ABSOLUTE_SEAT", "NOT_ADJACENT", "AT_MIDDLE"],
    "SEA-PBA-004": ["NOT_ADJACENT", "ABSOLUTE_SEAT", "RELATIVE_POSITION", "EXACT_COUNT_BETWEEN", "ADJACENT", "AT_END", "AT_MIDDLE"],
  };
  return preferred[blueprintId].indexOf(kind);
}

export function selectUniqueClueSet(input: {
  readonly state: LinearSeatingState;
  readonly blueprintId: SeatingBlueprintId;
  readonly candidates: readonly CandidateClue[];
  readonly seed: string;
}): {
  readonly selected: readonly CandidateClue[];
  readonly productionKeys: readonly string[];
  readonly oracleKeys: readonly string[];
} {
  const personIds = input.state.persons.map((person) => person.id);
  const facing = input.state.assignments[0]?.facing;
  if (!facing) throw new Error("Cannot select clues for an empty state");
  const random = new DeterministicRandom(`${input.seed}:${input.blueprintId}:clues`);
  const ordered = random.shuffle(input.candidates).sort((left, right) => {
    const byBlueprint = priority(input.blueprintId, left) - priority(input.blueprintId, right);
    if (byBlueprint !== 0) return byBlueprint;
    return right.informationGain - left.informationGain || left.semanticFingerprint.localeCompare(right.semanticFingerprint);
  });

  const selected: CandidateClue[] = [];
  let productionKeys: string[] = [];
  for (const clue of ordered) {
    if (selected.some((existing) => existing.semanticFingerprint === clue.semanticFingerprint)) continue;
    selected.push(clue);
    const result = solveLinear({ personIds, facing, constraints: selected.map((item) => item.constraint), maxModels: 2 });
    productionKeys = result.models.map((model) => model.canonicalKey).sort();
    if (!result.truncated && productionKeys.length === 1 && requirementsMet(input.blueprintId, selected)) break;
    if (result.truncated && result.models.length >= 2) continue;
  }

  if (productionKeys.length !== 1 || !requirementsMet(input.blueprintId, selected)) {
    throw new Error(`Unable to derive a unique ${input.blueprintId} clue set for seed ${input.seed}`);
  }

  for (let index = selected.length - 1; index >= 0; index -= 1) {
    const trial = selected.filter((_, candidateIndex) => candidateIndex !== index);
    if (!requirementsMet(input.blueprintId, trial)) continue;
    const result = solveLinear({ personIds, facing, constraints: trial.map((item) => item.constraint), maxModels: 2 });
    if (!result.truncated && result.models.length === 1) selected.splice(index, 1);
  }

  const finalProduction = solveLinear({ personIds, facing, constraints: selected.map((item) => item.constraint) });
  const oracle = enumerateLinearOracle({ personIds, facing, constraints: selected.map((item) => item.constraint) });
  productionKeys = finalProduction.models.map((model) => model.canonicalKey).sort();
  const oracleKeys = oracle.map((model) => model.canonicalKey).sort();
  if (productionKeys.length !== 1 || JSON.stringify(productionKeys) !== JSON.stringify(oracleKeys)) {
    throw new Error(`Solver/oracle disagreement for ${input.blueprintId} seed ${input.seed}`);
  }
  return { selected, productionKeys, oracleKeys };
}
