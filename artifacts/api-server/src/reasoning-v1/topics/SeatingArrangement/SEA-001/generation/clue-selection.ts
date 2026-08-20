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
    // PBA-004 needs one negative-adjacency fact, not a wall of negative facts. The required
    // negative clue and anchor are seeded explicitly; subsequent clues should maximise
    // readable placement information before another negative or absolute clue is considered.
    "SEA-PBA-004": ["RELATIVE_POSITION", "EXACT_COUNT_BETWEEN", "ADJACENT", "AT_END", "AT_MIDDLE", "NOT_ADJACENT", "ABSOLUTE_SEAT"],
  };
  return preferred[blueprintId].indexOf(kind);
}

function seedRequiredPba001Clues(
  candidates: readonly CandidateClue[],
  random: DeterministicRandom,
  preferredRelativeSteps: readonly number[],
): CandidateClue[] {
  const end = random.shuffle(candidates.filter((clue) => clue.constraint.kind === "AT_END"))[0];
  if (!end || end.constraint.kind !== "AT_END") throw new Error("PBA-001 has no end-anchor candidate");

  const relations = candidates.filter((clue) => clue.constraint.kind === "RELATIVE_POSITION");
  if (relations.length === 0) throw new Error("PBA-001 has no relative-position candidate");
  const preferredStep = preferredRelativeSteps[0] ?? 1;
  const stepMatched = relations.filter((clue) =>
    clue.constraint.kind === "RELATIVE_POSITION" && clue.constraint.steps === preferredStep);
  const anchorLinked = stepMatched.filter((clue) => clue.entitiesMentioned.includes(end.constraint.personId));
  const detached = stepMatched.filter((clue) => !clue.entitiesMentioned.includes(end.constraint.personId));
  const preferDetached = random.integer(0, 1) === 1;
  const pool = preferDetached
    ? (detached.length ? detached : anchorLinked.length ? anchorLinked : stepMatched)
    : (anchorLinked.length ? anchorLinked : detached.length ? detached : stepMatched);
  const relation = random.shuffle(pool.length ? pool : relations)[0];
  if (!relation || relation.constraint.kind !== "RELATIVE_POSITION") {
    throw new Error("PBA-001 could not seed a relative-position clue");
  }
  return [end, relation];
}

function seedRequiredPba004Clues(
  candidates: readonly CandidateClue[],
  random: DeterministicRandom,
): CandidateClue[] {
  // The deterministic shuffle is intentionally left as the tie-breaker. Stable sorting only by
  // pedagogical score preserves seed-driven variety among equally useful anchors/clues.
  const absolute = random.shuffle(candidates.filter((clue) => clue.constraint.kind === "ABSOLUTE_SEAT"))
    .sort((left, right) => right.informationGain - left.informationGain)[0];
  if (!absolute || absolute.constraint.kind !== "ABSOLUTE_SEAT") throw new Error("PBA-004 has no absolute-seat candidate");
  const absolutePersonId = absolute.constraint.personId;

  const negativeCandidates = candidates.filter((clue) => clue.constraint.kind === "NOT_ADJACENT");
  const touchingAnchor = negativeCandidates.filter((clue) => clue.entitiesMentioned.includes(absolutePersonId));
  const negative = random.shuffle(touchingAnchor.length > 0 ? touchingAnchor : negativeCandidates)
    .sort((left, right) => right.naturalnessScore - left.naturalnessScore)[0];
  if (!negative || negative.constraint.kind !== "NOT_ADJACENT") throw new Error("PBA-004 has no negative-adjacency candidate");
  return [absolute, negative];
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
  const pba001RelativeStepOrder = random.shuffle([1, 2, 3]);
  const seeded = input.blueprintId === "SEA-PBA-004"
    ? seedRequiredPba004Clues(input.candidates, random)
    : input.blueprintId === "SEA-PBA-001"
      ? seedRequiredPba001Clues(input.candidates, random, pba001RelativeStepOrder)
      : [];
  const seededFingerprints = new Set(seeded.map((clue) => clue.semanticFingerprint));
  const ordered = random.shuffle(input.candidates.filter((clue) => !seededFingerprints.has(clue.semanticFingerprint))).sort((left, right) => {
    if (input.blueprintId === "SEA-PBA-001") {
      const pba001KindRank = (clue: CandidateClue): number => {
        const ranks: readonly string[] = [
          "RELATIVE_POSITION",
          "ADJACENT",
          "EXACT_COUNT_BETWEEN",
          "AT_END",
          "NOT_ADJACENT",
          "AT_MIDDLE",
          "ABSOLUTE_SEAT",
        ];
        return ranks.indexOf(clue.constraint.kind);
      };
      const byKind = pba001KindRank(left) - pba001KindRank(right);
      if (byKind !== 0) return byKind;
      if (left.constraint.kind === "RELATIVE_POSITION" && right.constraint.kind === "RELATIVE_POSITION") {
        const leftRank = pba001RelativeStepOrder.indexOf(left.constraint.steps);
        const rightRank = pba001RelativeStepOrder.indexOf(right.constraint.steps);
        if (leftRank !== rightRank) return leftRank - rightRank;
        return 0;
      }
      return right.informationGain - left.informationGain
        || right.naturalnessScore - left.naturalnessScore;
    }

    const byBlueprint = priority(input.blueprintId, left) - priority(input.blueprintId, right);
    if (byBlueprint !== 0) return byBlueprint;
    if (input.blueprintId === "SEA-PBA-004"
      && left.constraint.kind === "RELATIVE_POSITION"
      && right.constraint.kind === "RELATIVE_POSITION") {
      // Distance is deliberately not used as a score here. The deterministic pre-sort shuffle
      // supplies reproducible variety across immediate, second and third left/right relations.
      return 0;
    }
    return right.informationGain - left.informationGain
      || right.naturalnessScore - left.naturalnessScore;
  });

  const selected: CandidateClue[] = [...seeded];
  let productionKeys: string[] = [];
  if (selected.length > 0) {
    const initial = solveLinear({ personIds, facing, constraints: selected.map((item) => item.constraint), maxModels: 2 });
    productionKeys = initial.models.map((model) => model.canonicalKey).sort();
  }

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

  if (input.blueprintId === "SEA-PBA-004") {
    const negativeCount = selected.filter((clue) => clue.constraint.kind === "NOT_ADJACENT").length;
    if (negativeCount !== 1) throw new Error(`PBA-004 must display exactly one negative-adjacency clue, observed ${negativeCount}`);
    if (selected.length > 7) throw new Error(`PBA-004 clue set is editorially too long: ${selected.length}`);
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
