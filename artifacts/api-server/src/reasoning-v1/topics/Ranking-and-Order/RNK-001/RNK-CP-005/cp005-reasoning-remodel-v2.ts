import {
  generateRnkCp005Question,
  rnkCp005HashText,
  solveRnkCp005SharedPassage,
  type RnkCp005AuthorityId,
  type RnkCp005Comparison,
  type RnkCp005ContextFamily,
  type RnkCp005Direction,
  type RnkCp005Question,
  type RnkCp005Query,
  type RnkCp005RankRow,
  type RnkCp005SharedPassage,
} from "./cp005-foundation";

export const RNK_CP005_REASONING_REMODEL_VERSION = "RNK_CP005_REASONING_REMODEL_V2" as const;

export type RnkCp005EvidenceMode =
  | "PARTIAL_RANK_TABLE"
  | "MIXED_CLUE_LEDGER"
  | "COMPARISON_CLUES";

export type RnkCp005ReasoningClue =
  | {
      readonly kind: "FIXED_RANK";
      readonly entity: string;
      readonly direction: RnkCp005Direction;
      readonly rank: number;
    }
  | {
      readonly kind: "BEFORE";
      readonly earlier: string;
      readonly later: string;
    }
  | {
      readonly kind: "IMMEDIATELY_BEFORE";
      readonly earlier: string;
      readonly later: string;
    }
  | {
      readonly kind: "GAP";
      readonly first: string;
      readonly second: string;
      readonly peopleBetween: number;
    };

export interface RnkCp005ReasoningSharedPassage extends RnkCp005SharedPassage {
  readonly reasoningVersion: typeof RNK_CP005_REASONING_REMODEL_VERSION;
  readonly evidenceMode: RnkCp005EvidenceMode;
  readonly reasoningClues: readonly RnkCp005ReasoningClue[];
  readonly directRankExposure: false;
}

export type RnkCp005ReasoningQuestion = Omit<RnkCp005Question, "sharedPassage"> & {
  readonly sharedPassage: RnkCp005ReasoningSharedPassage;
};

function createRng(namespace: string, seed: number): () => number {
  let state = rnkCp005HashText(`${namespace}:${seed}:${RNK_CP005_REASONING_REMODEL_VERSION}`) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function randomInt(rng: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(rng() * (maximum - minimum + 1));
}

function shuffled<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomInt(rng, 0, index);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function evidenceModeFor(passage: RnkCp005SharedPassage): RnkCp005EvidenceMode {
  if (passage.presentationMode === "RANK_TABLE") return "PARTIAL_RANK_TABLE";
  if (passage.presentationMode === "ORDER_LEDGER") return "MIXED_CLUE_LEDGER";
  return "COMPARISON_CLUES";
}

function adjacentClues(
  order: readonly string[],
  evidenceMode: RnkCp005EvidenceMode,
  seed: number,
): RnkCp005ReasoningClue[] {
  return Array.from({ length: order.length - 1 }, (_, index) => {
    const immediate = evidenceMode === "MIXED_CLUE_LEDGER"
      ? (index + seed) % 2 === 0
      : evidenceMode === "PARTIAL_RANK_TABLE"
        ? (index + seed) % 3 === 0
        : (index + seed) % 4 === 0;
    return immediate
      ? {
          kind: "IMMEDIATELY_BEFORE" as const,
          earlier: order[index],
          later: order[index + 1],
        }
      : {
          kind: "BEFORE" as const,
          earlier: order[index],
          later: order[index + 1],
        };
  });
}

function supplementaryClues(
  order: readonly string[],
  evidenceMode: RnkCp005EvidenceMode,
  seed: number,
): RnkCp005ReasoningClue[] {
  const output: RnkCp005ReasoningClue[] = [];
  const interiorIndex = 1 + (seed % (order.length - 2));
  if (evidenceMode !== "COMPARISON_CLUES") {
    const direction: RnkCp005Direction = seed % 2 === 0 ? "START" : "END";
    const rank = direction === "START" ? interiorIndex + 1 : order.length - interiorIndex;
    output.push({
      kind: "FIXED_RANK",
      entity: order[interiorIndex],
      direction,
      rank,
    });
  }

  const firstIndex = seed % Math.max(1, order.length - 3);
  const secondIndex = Math.min(order.length - 1, firstIndex + 2 + (seed % 2));
  output.push({
    kind: "GAP",
    first: order[firstIndex],
    second: order[secondIndex],
    peopleBetween: secondIndex - firstIndex - 1,
  });

  return output;
}

function visibleRankRows(
  rawPassage: RnkCp005SharedPassage,
  clues: readonly RnkCp005ReasoningClue[],
): readonly RnkCp005RankRow[] {
  const fixed = clues.filter(
    (clue): clue is Extract<RnkCp005ReasoningClue, { readonly kind: "FIXED_RANK" }> =>
      clue.kind === "FIXED_RANK",
  );
  return fixed.map((clue) => {
    const rankFromStart = clue.direction === "START"
      ? clue.rank
      : rawPassage.entityCount - clue.rank + 1;
    return {
      entity: clue.entity,
      rankFromStart,
      positionLabel: ordinal(clue.rank),
    };
  });
}

function comparisonProjection(
  clues: readonly RnkCp005ReasoningClue[],
): readonly RnkCp005Comparison[] {
  return clues
    .filter(
      (clue): clue is Extract<RnkCp005ReasoningClue, { readonly kind: "BEFORE" | "IMMEDIATELY_BEFORE" }> =>
        clue.kind === "BEFORE" || clue.kind === "IMMEDIATELY_BEFORE",
    )
    .map((clue) => ({ earlier: clue.earlier, later: clue.later }));
}

function buildReasoningPassage(rawPassage: RnkCp005SharedPassage): RnkCp005ReasoningSharedPassage {
  const order = solveRnkCp005SharedPassage(rawPassage);
  const evidenceMode = evidenceModeFor(rawPassage);
  const rng = createRng("reasoning-clues", rawPassage.setSeed);
  const clues = shuffled(
    [
      ...adjacentClues(order, evidenceMode, rawPassage.setSeed),
      ...supplementaryClues(order, evidenceMode, rawPassage.setSeed),
    ],
    rng,
  );
  const rankRows = visibleRankRows(rawPassage, clues);
  const comparisons = comparisonProjection(clues);
  const fingerprint = [
    rawPassage.sharedPassageFingerprint,
    RNK_CP005_REASONING_REMODEL_VERSION,
    evidenceMode,
    JSON.stringify(clues),
  ].join(":");

  const passage: RnkCp005ReasoningSharedPassage = {
    ...rawPassage,
    rendererClass: "STRUCTURED_TEXT",
    instruction: "Use the incomplete rank evidence to reconstruct one unique order before answering the linked questions.",
    rankRows,
    comparisons,
    sharedPassageFingerprint: fingerprint,
    reasoningVersion: RNK_CP005_REASONING_REMODEL_VERSION,
    evidenceMode,
    reasoningClues: clues,
    directRankExposure: false,
  };

  const solved = solveRnkCp005ReasoningPassage(passage);
  if (solved.solutionCount !== 1) {
    throw new Error(`CP-005 set ${rawPassage.setSeed} has ${solved.solutionCount} visible-evidence solutions`);
  }
  if (solved.order.join("|") !== order.join("|")) {
    throw new Error(`CP-005 set ${rawPassage.setSeed} visible evidence reconstructs the wrong order`);
  }
  if (passage.rankRows.length >= passage.entityCount) {
    throw new Error(`CP-005 set ${rawPassage.setSeed} exposes every rank directly`);
  }
  return passage;
}

const passageCache = new Map<number, RnkCp005ReasoningSharedPassage>();

export function buildRnkCp005ReasoningPassage(seed: number): RnkCp005ReasoningSharedPassage {
  const cached = passageCache.get(seed);
  if (cached) return cached;
  const raw = generateRnkCp005Question("SHARED_ENDPOINT_ENTITY", seed, 0).sharedPassage;
  const passage = buildReasoningPassage(raw);
  passageCache.set(seed, passage);
  return passage;
}

function entitiesFromClues(clues: readonly RnkCp005ReasoningClue[]): readonly string[] {
  const entities = new Set<string>();
  for (const clue of clues) {
    if (clue.kind === "FIXED_RANK") {
      entities.add(clue.entity);
    } else if (clue.kind === "GAP") {
      entities.add(clue.first);
      entities.add(clue.second);
    } else {
      entities.add(clue.earlier);
      entities.add(clue.later);
    }
  }
  return [...entities].sort();
}

function clueMatches(
  clue: RnkCp005ReasoningClue,
  index: ReadonlyMap<string, number>,
  entityCount: number,
): boolean {
  if (clue.kind === "FIXED_RANK") {
    const position = index.get(clue.entity);
    if (position === undefined) return false;
    const rank = clue.direction === "START" ? position + 1 : entityCount - position;
    return rank === clue.rank;
  }
  if (clue.kind === "GAP") {
    const first = index.get(clue.first);
    const second = index.get(clue.second);
    if (first === undefined || second === undefined) return false;
    return Math.abs(first - second) - 1 === clue.peopleBetween;
  }
  const earlier = index.get(clue.earlier);
  const later = index.get(clue.later);
  if (earlier === undefined || later === undefined) return false;
  if (clue.kind === "IMMEDIATELY_BEFORE") return earlier + 1 === later;
  return earlier < later;
}

function permutationsUntilTwo(
  entities: readonly string[],
  clues: readonly RnkCp005ReasoningClue[],
): readonly string[][] {
  const solutions: string[][] = [];
  const used = new Set<string>();
  const current: string[] = [];

  const visit = () => {
    if (solutions.length >= 2) return;
    if (current.length === entities.length) {
      const index = new Map(current.map((entity, position) => [entity, position]));
      if (clues.every((clue) => clueMatches(clue, index, entities.length))) {
        solutions.push([...current]);
      }
      return;
    }
    for (const entity of entities) {
      if (used.has(entity)) continue;
      used.add(entity);
      current.push(entity);
      visit();
      current.pop();
      used.delete(entity);
      if (solutions.length >= 2) return;
    }
  };

  visit();
  return solutions;
}

const solutionCache = new Map<string, { readonly order: readonly string[]; readonly solutionCount: number }>();

export function solveRnkCp005ReasoningPassage(
  passage: RnkCp005ReasoningSharedPassage,
): { readonly order: readonly string[]; readonly solutionCount: number } {
  const cached = solutionCache.get(passage.sharedPassageFingerprint);
  if (cached) return cached;
  const entities = entitiesFromClues(passage.reasoningClues);
  if (entities.length !== passage.entityCount) {
    throw new Error(`CP-005 set ${passage.setSeed} clues mention ${entities.length}/${passage.entityCount} entities`);
  }
  const solutions = permutationsUntilTwo(entities, passage.reasoningClues);
  const result = {
    order: solutions[0] ?? [],
    solutionCount: solutions.length,
  } as const;
  solutionCache.set(passage.sharedPassageFingerprint, result);
  return result;
}

function relationKey(earlier: string, later: string): string {
  return `${earlier}>${later}`;
}

export function solveRnkCp005ReasoningQuestion(
  passage: RnkCp005ReasoningSharedPassage,
  query: RnkCp005Query,
): string {
  const solved = solveRnkCp005ReasoningPassage(passage);
  if (solved.solutionCount !== 1) throw new Error("Shared evidence does not determine one unique order");
  const order = solved.order;
  const index = new Map(order.map((entity, position) => [entity, position]));
  const fromDirection = (position: number, direction: RnkCp005Direction) =>
    direction === "START" ? position + 1 : order.length - position;

  switch (query.kind) {
    case "ENDPOINT_ENTITY":
      return query.direction === "START" ? order[0] : order[order.length - 1];
    case "ENTITY_AT_POSITION": {
      const position = query.direction === "START" ? query.rank - 1 : order.length - query.rank;
      return order[position];
    }
    case "RANK_OF_ENTITY": {
      const position = index.get(query.target);
      if (position === undefined) throw new Error("Unknown rank target");
      return String(fromDirection(position, query.direction));
    }
    case "PAIR_RELATION": {
      const first = index.get(query.first);
      const second = index.get(query.second);
      if (first === undefined || second === undefined) throw new Error("Unknown pair target");
      return first < second
        ? relationKey(query.first, query.second)
        : relationKey(query.second, query.first);
    }
    case "RANK_GAP": {
      const first = index.get(query.first);
      const second = index.get(query.second);
      if (first === undefined || second === undefined) throw new Error("Unknown gap target");
      return String(Math.abs(first - second));
    }
    case "IMMEDIATE_NEIGHBOUR": {
      const target = index.get(query.target);
      if (target === undefined) throw new Error("Unknown neighbour target");
      const answerIndex = query.direction === "BEFORE" ? target - 1 : target + 1;
      return order[answerIndex];
    }
    case "COMPLETE_ORDER":
      return (query.direction === "START" ? order : [...order].reverse()).join("|");
    case "TRUE_STATEMENT": {
      const valid = query.candidates.filter((candidate) =>
        index.get(candidate.earlier)! < index.get(candidate.later)!,
      );
      if (valid.length !== 1) throw new Error(`Expected one true statement, found ${valid.length}`);
      return relationKey(valid[0].earlier, valid[0].later);
    }
  }
}

function difficultyFor(
  passage: RnkCp005ReasoningSharedPassage,
  authorityId: RnkCp005AuthorityId,
): "EASY" | "MEDIUM" | "HARD" {
  if (authorityId === "SHARED_COMPLETE_ORDER" || authorityId === "SHARED_TRUE_STATEMENT") {
    return "HARD";
  }
  if (
    passage.entityCount === 8 &&
    (authorityId === "SHARED_PAIR_RELATION" || authorityId === "SHARED_RANK_GAP")
  ) {
    return "HARD";
  }
  if (
    passage.entityCount === 6 &&
    (authorityId === "SHARED_ENDPOINT_ENTITY" || authorityId === "SHARED_IMMEDIATE_NEIGHBOUR")
  ) {
    return "EASY";
  }
  return "MEDIUM";
}

export function generateRnkCp005ReasoningQuestion(
  authorityId: RnkCp005AuthorityId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp005ReasoningQuestion {
  const raw = generateRnkCp005Question(authorityId, seed, correctIndexOverride);
  const sharedPassage = buildRnkCp005ReasoningPassage(seed);
  const independentlySolved = solveRnkCp005ReasoningQuestion(sharedPassage, raw.query);
  if (independentlySolved !== raw.answerKey) {
    throw new Error(`${authorityId}:${seed}: remodel answer mismatch`);
  }
  return {
    ...raw,
    sharedPassage,
    difficulty: difficultyFor(sharedPassage, authorityId),
    mathematicalFingerprint: [
      raw.mathematicalFingerprint,
      sharedPassage.sharedPassageFingerprint,
      RNK_CP005_REASONING_REMODEL_VERSION,
    ].join(":"),
  };
}

export function rnkCp005ReasoningClueText(
  clue: RnkCp005ReasoningClue,
  context: RnkCp005ContextFamily,
): string {
  if (clue.kind === "FIXED_RANK") {
    const side = (() => {
      if (context === "ROW") return clue.direction === "START" ? "left" : "right";
      if (context === "QUEUE") return clue.direction === "START" ? "front" : "back";
      if (context === "RACE_FINISH") return clue.direction === "START" ? "first finisher" : "last finisher";
      return clue.direction === "START" ? "top" : "bottom";
    })();
    if (context === "RACE_FINISH" && clue.direction === "START") {
      return `${clue.entity} finished in ${ordinal(clue.rank)} place.`;
    }
    return `${clue.entity} is ${ordinal(clue.rank)} from the ${side}.`;
  }

  if (clue.kind === "GAP") {
    if (context === "ROW") {
      return `Exactly ${clue.peopleBetween} ${clue.peopleBetween === 1 ? "person stands" : "people stand"} between ${clue.first} and ${clue.second}.`;
    }
    if (context === "QUEUE") {
      return `Exactly ${clue.peopleBetween} ${clue.peopleBetween === 1 ? "candidate is" : "candidates are"} between ${clue.first} and ${clue.second} in the queue.`;
    }
    const rankDifference = clue.peopleBetween + 1;
    return `The ranks of ${clue.first} and ${clue.second} differ by ${rankDifference} places.`;
  }

  const immediate = clue.kind === "IMMEDIATELY_BEFORE";
  if (context === "ROW") {
    return `${clue.earlier} is ${immediate ? "immediately " : ""}to the left of ${clue.later}.`;
  }
  if (context === "QUEUE") {
    return `${clue.earlier} is ${immediate ? "immediately " : ""}ahead of ${clue.later} in the queue.`;
  }
  if (context === "RACE_FINISH") {
    return `${clue.earlier} finished ${immediate ? "immediately " : ""}before ${clue.later}.`;
  }
  return `${clue.earlier} is ranked ${immediate ? "immediately " : ""}above ${clue.later}.`;
}
