export const RNK_CP005_AUTHORITY_IDS = [
  "SHARED_ENDPOINT_ENTITY",
  "SHARED_ENTITY_AT_POSITION",
  "SHARED_RANK_OF_ENTITY",
  "SHARED_PAIR_RELATION",
  "SHARED_RANK_GAP",
  "SHARED_IMMEDIATE_NEIGHBOUR",
  "SHARED_COMPLETE_ORDER",
  "SHARED_TRUE_STATEMENT",
] as const;

export type RnkCp005AuthorityId = (typeof RNK_CP005_AUTHORITY_IDS)[number];
export type RnkCp005AnswerSemantic = "ENTITY" | "RANK" | "COUNT" | "RELATION" | "ORDER";
export type RnkCp005Difficulty = "EASY" | "MEDIUM" | "HARD";
export type RnkCp005ContextFamily =
  | "ROW"
  | "QUEUE"
  | "MERIT_LIST"
  | "RACE_FINISH"
  | "INTERVIEW_SHORTLIST"
  | "PERFORMANCE_ORDER";
export type RnkCp005PresentationMode = "RANK_TABLE" | "ORDER_LEDGER" | "COMPARISON_CLUES";
export type RnkCp005RendererClass = "STRUCTURED_TABLE" | "ORDERED_LEDGER" | "STRUCTURED_TEXT";
export type RnkCp005Direction = "START" | "END";

export const RNK_CP005_CONTEXT_FAMILIES: readonly RnkCp005ContextFamily[] = [
  "ROW",
  "QUEUE",
  "MERIT_LIST",
  "RACE_FINISH",
  "INTERVIEW_SHORTLIST",
  "PERFORMANCE_ORDER",
];

export const RNK_CP005_PRESENTATION_MODES: readonly RnkCp005PresentationMode[] = [
  "RANK_TABLE",
  "ORDER_LEDGER",
  "COMPARISON_CLUES",
];

export const RNK_CP005_NAMES = [
  "Aman",
  "Ananya",
  "Arjun",
  "Gurleen",
  "Harleen",
  "Ishaan",
  "Jaspreet",
  "Karan",
  "Mehak",
  "Navdeep",
  "Pooja",
  "Riya",
  "Simran",
  "Tanvi",
] as const;

export interface RnkCp005RankRow {
  readonly entity: string;
  readonly rankFromStart: number;
  readonly positionLabel: string;
}

export interface RnkCp005Comparison {
  readonly earlier: string;
  readonly later: string;
}

export interface RnkCp005SharedPassage {
  readonly sharedSetId: string;
  readonly setSeed: number;
  readonly contextFamily: RnkCp005ContextFamily;
  readonly presentationMode: RnkCp005PresentationMode;
  readonly rendererClass: RnkCp005RendererClass;
  readonly title: string;
  readonly instruction: string;
  readonly startLabel: string;
  readonly endLabel: string;
  readonly entityCount: number;
  readonly rankRows: readonly RnkCp005RankRow[];
  readonly comparisons: readonly RnkCp005Comparison[];
  readonly sharedPassageFingerprint: string;
}

export type RnkCp005Query =
  | { readonly kind: "ENDPOINT_ENTITY"; readonly direction: RnkCp005Direction }
  | { readonly kind: "ENTITY_AT_POSITION"; readonly direction: RnkCp005Direction; readonly rank: number }
  | { readonly kind: "RANK_OF_ENTITY"; readonly direction: RnkCp005Direction; readonly target: string }
  | { readonly kind: "PAIR_RELATION"; readonly first: string; readonly second: string }
  | { readonly kind: "RANK_GAP"; readonly first: string; readonly second: string }
  | { readonly kind: "IMMEDIATE_NEIGHBOUR"; readonly target: string; readonly direction: "BEFORE" | "AFTER" }
  | { readonly kind: "COMPLETE_ORDER"; readonly direction: RnkCp005Direction }
  | { readonly kind: "TRUE_STATEMENT"; readonly candidates: readonly RnkCp005Comparison[] };

export interface RnkCp005Option {
  readonly answerKey: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp005VisibleExplanation {
  readonly mentalPicture: string;
  readonly keyRule: string;
  readonly stepByStepSolution: readonly string[];
  readonly examSpeedShortcut: string;
  readonly optionAnalysis: readonly string[];
  readonly conclusion: string;
}

export interface RnkCp005Question {
  readonly packageId: "RNK-001";
  readonly checkpointId: "RNK-CP-005";
  readonly authorityId: RnkCp005AuthorityId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly sharedPassage: RnkCp005SharedPassage;
  readonly stem: string;
  readonly query: RnkCp005Query;
  readonly answerSemantic: RnkCp005AnswerSemantic;
  readonly answerKey: string;
  readonly answer: string;
  readonly options: readonly RnkCp005Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp005Difficulty;
  readonly visibleExplanation: RnkCp005VisibleExplanation;
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: {
    readonly sourceOwnership: "PRESENTATION_LED_SHARED_SET";
    readonly independentSolverStatus: "PASS";
    readonly ambiguityStatus: "UNIQUE";
    readonly recommendedQuestionsPerSet: 4;
    readonly maximumQuestionsPerSet: 8;
    readonly lifecycle: {
      readonly reviewStatus: "ENGLISH_DISCOVERY_FROZEN";
      readonly questionStudio: "DISABLED";
      readonly questionBank: "NOT_STORED";
      readonly testEligibility: "INELIGIBLE";
      readonly publicPublication: false;
      readonly hindiPunjabi: "NOT_STARTED";
    };
  };
}

interface ContextLanguage {
  readonly title: string;
  readonly startLabel: string;
  readonly endLabel: string;
  readonly subject: string;
  readonly positionNoun: string;
}

const CONTEXT_LANGUAGE: Record<RnkCp005ContextFamily, ContextLanguage> = {
  ROW: {
    title: "People standing in a row",
    startLabel: "left",
    endLabel: "right",
    subject: "people",
    positionNoun: "position",
  },
  QUEUE: {
    title: "Candidates waiting in a queue",
    startLabel: "front",
    endLabel: "back",
    subject: "candidates",
    positionNoun: "place",
  },
  MERIT_LIST: {
    title: "Candidates in a merit list",
    startLabel: "top",
    endLabel: "bottom",
    subject: "candidates",
    positionNoun: "rank",
  },
  RACE_FINISH: {
    title: "Participants in a race result",
    startLabel: "first",
    endLabel: "last",
    subject: "participants",
    positionNoun: "finishing position",
  },
  INTERVIEW_SHORTLIST: {
    title: "Applicants in an interview shortlist",
    startLabel: "top",
    endLabel: "bottom",
    subject: "applicants",
    positionNoun: "rank",
  },
  PERFORMANCE_ORDER: {
    title: "Employees in a performance order",
    startLabel: "highest",
    endLabel: "lowest",
    subject: "employees",
    positionNoun: "position",
  },
};

export function rnkCp005HashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(namespace: string, seed: number): () => number {
  let state = rnkCp005HashText(`${namespace}:${seed}:rnk-cp005`) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function randomInt(rng: () => number, minimum: number, maximum: number): number {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || maximum < minimum) {
    throw new Error(`Invalid integer range ${minimum}..${maximum}`);
  }
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

function orderKey(order: readonly string[]): string {
  return order.join("|");
}

function parseOrderKey(key: string): string[] {
  return key.split("|");
}

function relationKey(earlier: string, later: string): string {
  return `${earlier}>${later}`;
}

function relationLabel(key: string, passage: RnkCp005SharedPassage): string {
  const [earlier, later] = key.split(">");
  return `${earlier} is ahead of ${later} when read from the ${passage.startLabel}`;
}

function rendererClassFor(mode: RnkCp005PresentationMode): RnkCp005RendererClass {
  if (mode === "RANK_TABLE") return "STRUCTURED_TABLE";
  if (mode === "ORDER_LEDGER") return "ORDERED_LEDGER";
  return "STRUCTURED_TEXT";
}

function positionLabel(
  context: RnkCp005ContextFamily,
  rankFromStart: number,
): string {
  if (context === "RACE_FINISH") return ordinal(rankFromStart);
  return String(rankFromStart);
}

function buildAdjacentComparisons(order: readonly string[]): RnkCp005Comparison[] {
  return Array.from({ length: order.length - 1 }, (_, index) => ({
    earlier: order[index],
    later: order[index + 1],
  }));
}

function reconstructFromRows(
  rows: readonly RnkCp005RankRow[],
  entityCount: number,
): readonly string[] {
  if (rows.length !== entityCount) throw new Error("Rank rows do not cover every entity");
  const entities = rows.map((row) => row.entity);
  if (new Set(entities).size !== entityCount) throw new Error("Duplicate entity in rank rows");
  const ranks = rows.map((row) => row.rankFromStart);
  if (new Set(ranks).size !== entityCount) throw new Error("Duplicate rank in rank rows");
  if (ranks.some((rank) => rank < 1 || rank > entityCount)) throw new Error("Rank outside valid range");
  return [...rows]
    .sort((left, right) => left.rankFromStart - right.rankFromStart)
    .map((row) => row.entity);
}

function reconstructFromComparisons(
  comparisons: readonly RnkCp005Comparison[],
  entities: readonly string[],
): readonly string[] {
  const uniqueEntities = [...new Set(entities)];
  if (uniqueEntities.length !== entities.length) throw new Error("Duplicate entity in comparison passage");
  const entitySet = new Set(uniqueEntities);
  const outgoing = new Map<string, Set<string>>();
  const indegree = new Map<string, number>();
  uniqueEntities.forEach((entity) => {
    outgoing.set(entity, new Set());
    indegree.set(entity, 0);
  });
  comparisons.forEach((comparison) => {
    if (!entitySet.has(comparison.earlier) || !entitySet.has(comparison.later)) {
      throw new Error("Unknown entity in comparison");
    }
    if (comparison.earlier === comparison.later) throw new Error("Self comparison is invalid");
    const targets = outgoing.get(comparison.earlier)!;
    if (!targets.has(comparison.later)) {
      targets.add(comparison.later);
      indegree.set(comparison.later, indegree.get(comparison.later)! + 1);
    }
  });

  const result: string[] = [];
  const remaining = new Map(indegree);
  const available = uniqueEntities.filter((entity) => remaining.get(entity) === 0).sort();
  while (available.length > 0) {
    if (available.length !== 1) throw new Error("Comparison passage does not determine one unique order");
    const current = available.shift()!;
    result.push(current);
    for (const later of outgoing.get(current)!) {
      const next = remaining.get(later)! - 1;
      remaining.set(later, next);
      if (next === 0) {
        available.push(later);
        available.sort();
      }
    }
  }
  if (result.length !== uniqueEntities.length) throw new Error("Comparison cycle detected");
  return result;
}

export function solveRnkCp005SharedPassage(
  passage: RnkCp005SharedPassage,
): readonly string[] {
  if (passage.presentationMode === "COMPARISON_CLUES") {
    const entities = passage.rankRows.map((row) => row.entity);
    return reconstructFromComparisons(passage.comparisons, entities);
  }
  return reconstructFromRows(passage.rankRows, passage.entityCount);
}

function sharedPassageFingerprint(
  contextFamily: RnkCp005ContextFamily,
  presentationMode: RnkCp005PresentationMode,
  hiddenOrder: readonly string[],
  rows: readonly RnkCp005RankRow[],
  comparisons: readonly RnkCp005Comparison[],
): string {
  const canonicalRows = [...rows]
    .sort((left, right) => left.rankFromStart - right.rankFromStart)
    .map((row) => `${row.rankFromStart}:${row.entity}`)
    .join(",");
  const canonicalComparisons = comparisons
    .map((comparison) => relationKey(comparison.earlier, comparison.later))
    .sort()
    .join(",");
  return `${contextFamily}:${presentationMode}:${orderKey(hiddenOrder)}:${canonicalRows}:${canonicalComparisons}`;
}

export function buildRnkCp005SharedPassage(setSeed: number): RnkCp005SharedPassage {
  if (!Number.isInteger(setSeed) || setSeed < 0) throw new Error("setSeed must be a non-negative integer");
  const rng = createRng("shared-passage", setSeed);
  const contextFamily = RNK_CP005_CONTEXT_FAMILIES[setSeed % RNK_CP005_CONTEXT_FAMILIES.length];
  const presentationMode = RNK_CP005_PRESENTATION_MODES[
    Math.floor(setSeed / RNK_CP005_CONTEXT_FAMILIES.length) % RNK_CP005_PRESENTATION_MODES.length
  ];
  const language = CONTEXT_LANGUAGE[contextFamily];
  const entityCount = 6 + (setSeed % 3);
  const hiddenOrder = shuffled(RNK_CP005_NAMES, rng).slice(0, entityCount);
  const canonicalRows = hiddenOrder.map((entity, index) => ({
    entity,
    rankFromStart: index + 1,
    positionLabel: positionLabel(contextFamily, index + 1),
  }));
  const rankRows = presentationMode === "ORDER_LEDGER"
    ? canonicalRows
    : shuffled(canonicalRows, rng);
  const comparisons = presentationMode === "COMPARISON_CLUES"
    ? shuffled(buildAdjacentComparisons(hiddenOrder), rng)
    : [];
  const instruction = presentationMode === "RANK_TABLE"
    ? `The table gives each person's ${language.positionNoun} from the ${language.startLabel}. Use the same table for the linked questions.`
    : presentationMode === "ORDER_LEDGER"
      ? `The ledger lists the ${language.subject} from the ${language.startLabel} towards the ${language.endLabel}. Use it for the linked questions.`
      : `The statements compare the ${language.subject}. Reconstruct one order from the ${language.startLabel} towards the ${language.endLabel}, then answer the linked questions.`;

  const fingerprint = sharedPassageFingerprint(
    contextFamily,
    presentationMode,
    hiddenOrder,
    rankRows,
    comparisons,
  );

  const passage: RnkCp005SharedPassage = {
    sharedSetId: `RNK-CP005-SET-${String(setSeed + 1).padStart(4, "0")}`,
    setSeed,
    contextFamily,
    presentationMode,
    rendererClass: rendererClassFor(presentationMode),
    title: language.title,
    instruction,
    startLabel: language.startLabel,
    endLabel: language.endLabel,
    entityCount,
    rankRows,
    comparisons,
    sharedPassageFingerprint: fingerprint,
  };

  const solved = solveRnkCp005SharedPassage(passage);
  if (orderKey(solved) !== orderKey(hiddenOrder)) {
    throw new Error(`Shared passage reconstruction mismatch for set ${setSeed}`);
  }
  return passage;
}

function queryFor(
  authorityId: RnkCp005AuthorityId,
  passage: RnkCp005SharedPassage,
  order: readonly string[],
  seed: number,
): RnkCp005Query {
  const rng = createRng(authorityId, seed);
  switch (authorityId) {
    case "SHARED_ENDPOINT_ENTITY":
      return { kind: "ENDPOINT_ENTITY", direction: seed % 2 === 0 ? "START" : "END" };
    case "SHARED_ENTITY_AT_POSITION": {
      const rank = randomInt(rng, 2, order.length - 1);
      return { kind: "ENTITY_AT_POSITION", direction: seed % 2 === 0 ? "START" : "END", rank };
    }
    case "SHARED_RANK_OF_ENTITY": {
      const target = order[randomInt(rng, 0, order.length - 1)];
      return { kind: "RANK_OF_ENTITY", direction: seed % 2 === 0 ? "START" : "END", target };
    }
    case "SHARED_PAIR_RELATION": {
      const firstIndex = randomInt(rng, 0, order.length - 2);
      const secondIndex = randomInt(rng, firstIndex + 1, order.length - 1);
      return seed % 2 === 0
        ? { kind: "PAIR_RELATION", first: order[firstIndex], second: order[secondIndex] }
        : { kind: "PAIR_RELATION", first: order[secondIndex], second: order[firstIndex] };
    }
    case "SHARED_RANK_GAP": {
      const firstIndex = randomInt(rng, 0, order.length - 3);
      const secondIndex = randomInt(rng, firstIndex + 2, order.length - 1);
      return { kind: "RANK_GAP", first: order[firstIndex], second: order[secondIndex] };
    }
    case "SHARED_IMMEDIATE_NEIGHBOUR": {
      const targetIndex = randomInt(rng, 1, order.length - 2);
      return {
        kind: "IMMEDIATE_NEIGHBOUR",
        target: order[targetIndex],
        direction: seed % 2 === 0 ? "BEFORE" : "AFTER",
      };
    }
    case "SHARED_COMPLETE_ORDER":
      return { kind: "COMPLETE_ORDER", direction: seed % 2 === 0 ? "START" : "END" };
    case "SHARED_TRUE_STATEMENT": {
      const correctEarlierIndex = randomInt(rng, 0, order.length - 2);
      const correctLaterIndex = randomInt(rng, correctEarlierIndex + 1, order.length - 1);
      const correct = { earlier: order[correctEarlierIndex], later: order[correctLaterIndex] };
      const falsePool: RnkCp005Comparison[] = [];
      for (let earlier = 0; earlier < order.length - 1; earlier += 1) {
        for (let later = earlier + 1; later < order.length; later += 1) {
          falsePool.push({ earlier: order[later], later: order[earlier] });
        }
      }
      const candidates = [correct, ...shuffled(falsePool, rng).slice(0, 3)];
      return { kind: "TRUE_STATEMENT", candidates: shuffled(candidates, rng) };
    }
  }
}

function semanticFor(query: RnkCp005Query): RnkCp005AnswerSemantic {
  if (query.kind === "RANK_OF_ENTITY") return "RANK";
  if (query.kind === "RANK_GAP") return "COUNT";
  if (query.kind === "PAIR_RELATION" || query.kind === "TRUE_STATEMENT") return "RELATION";
  if (query.kind === "COMPLETE_ORDER") return "ORDER";
  return "ENTITY";
}

export function solveRnkCp005Question(
  passage: RnkCp005SharedPassage,
  query: RnkCp005Query,
): string {
  const order = solveRnkCp005SharedPassage(passage);
  const index = new Map(order.map((entity, position) => [entity, position]));
  const fromDirection = (position: number, direction: RnkCp005Direction) =>
    direction === "START" ? position + 1 : order.length - position;
  switch (query.kind) {
    case "ENDPOINT_ENTITY":
      return query.direction === "START" ? order[0] : order[order.length - 1];
    case "ENTITY_AT_POSITION": {
      if (query.rank < 1 || query.rank > order.length) throw new Error("Requested position outside shared order");
      const position = query.direction === "START" ? query.rank - 1 : order.length - query.rank;
      return order[position];
    }
    case "RANK_OF_ENTITY": {
      const position = index.get(query.target);
      if (position === undefined) throw new Error("Unknown target in rank query");
      return String(fromDirection(position, query.direction));
    }
    case "PAIR_RELATION": {
      const first = index.get(query.first);
      const second = index.get(query.second);
      if (first === undefined || second === undefined || first === second) throw new Error("Invalid pair query");
      return first < second ? relationKey(query.first, query.second) : relationKey(query.second, query.first);
    }
    case "RANK_GAP": {
      const first = index.get(query.first);
      const second = index.get(query.second);
      if (first === undefined || second === undefined || first === second) throw new Error("Invalid rank-gap query");
      return String(Math.abs(first - second));
    }
    case "IMMEDIATE_NEIGHBOUR": {
      const target = index.get(query.target);
      if (target === undefined) throw new Error("Unknown neighbour target");
      const answerIndex = query.direction === "BEFORE" ? target - 1 : target + 1;
      if (answerIndex < 0 || answerIndex >= order.length) throw new Error("Immediate neighbour does not exist");
      return order[answerIndex];
    }
    case "COMPLETE_ORDER":
      return orderKey(query.direction === "START" ? order : [...order].reverse());
    case "TRUE_STATEMENT": {
      const trueCandidates = query.candidates.filter((candidate) =>
        index.get(candidate.earlier)! < index.get(candidate.later)!,
      );
      if (trueCandidates.length !== 1) {
        throw new Error(`Expected one true statement, found ${trueCandidates.length}`);
      }
      return relationKey(trueCandidates[0].earlier, trueCandidates[0].later);
    }
  }
}

function formatAnswer(
  answerKey: string,
  semantic: RnkCp005AnswerSemantic,
  passage: RnkCp005SharedPassage,
): string {
  if (semantic === "ORDER") {
    return parseOrderKey(answerKey).join(` → `);
  }
  if (semantic === "RELATION") return relationLabel(answerKey, passage);
  return answerKey;
}

interface DistractorCandidate {
  readonly answerKey: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

function entityDistractors(
  order: readonly string[],
  answerKey: string,
): DistractorCandidate[] {
  const position = order.indexOf(answerKey);
  const output: DistractorCandidate[] = [];
  const add = (candidate: string, misconceptionId: string, explanation: string) => {
    if (candidate !== answerKey && !output.some((item) => item.answerKey === candidate)) {
      output.push({ answerKey: candidate, misconceptionId, explanation });
    }
  };
  if (position > 0) add(order[position - 1], "OFF_BY_ONE_TOWARDS_START", `${order[position - 1]} is one place nearer the start`);
  if (position < order.length - 1) add(order[position + 1], "OFF_BY_ONE_TOWARDS_END", `${order[position + 1]} is one place nearer the end`);
  add(order[0], "CHOSE_START_ENDPOINT", `${order[0]} is the start-side endpoint`);
  add(order[order.length - 1], "CHOSE_END_ENDPOINT", `${order[order.length - 1]} is the end-side endpoint`);
  order.forEach((entity) => add(entity, "READ_WRONG_SHARED_ROW", `${entity} occupies another position in the shared information`));
  return output.slice(0, 3);
}

function numericDistractors(
  orderLength: number,
  answerKey: string,
  semantic: "RANK" | "COUNT",
): DistractorCandidate[] {
  const answer = Number(answerKey);
  const output: DistractorCandidate[] = [];
  const add = (candidate: number, misconceptionId: string, explanation: string) => {
    const maximum = semantic === "RANK" ? orderLength : orderLength - 1;
    if (candidate >= 1 && candidate <= maximum && candidate !== answer && !output.some((item) => item.answerKey === String(candidate))) {
      output.push({ answerKey: String(candidate), misconceptionId, explanation });
    }
  };
  if (semantic === "RANK") {
    add(orderLength - answer + 1, "COUNTED_FROM_OPPOSITE_END", "This is the opposite-end rank");
    add(answer - 1, "OFF_BY_ONE_TOWARDS_START", "This stops one position early");
    add(answer + 1, "OFF_BY_ONE_TOWARDS_END", "This counts one position too far");
  } else {
    add(answer - 1, "COUNTED_PEOPLE_BETWEEN", "This counts only the people strictly between the two positions");
    add(answer + 1, "COUNTED_ONE_EXTRA_POSITION", "This includes one extra boundary position");
    add(orderLength - answer, "USED_COMPLEMENTARY_GAP", "This uses the remaining positions instead of the stated pair's rank gap");
  }
  for (let value = 1; output.length < 3 && value <= orderLength; value += 1) {
    add(value, "USED_UNRELATED_SHARED_POSITION", "This number belongs to another position in the shared set");
  }
  return output.slice(0, 3);
}

function relationDistractors(
  passage: RnkCp005SharedPassage,
  query: RnkCp005Query,
  answerKey: string,
): DistractorCandidate[] {
  const [earlier, later] = answerKey.split(">");
  const output: DistractorCandidate[] = [
    {
      answerKey: relationKey(later, earlier),
      misconceptionId: "REVERSED_SHARED_DIRECTION",
      explanation: `This reverses the order of ${earlier} and ${later}`,
    },
  ];
  const add = (candidate: RnkCp005Comparison, misconceptionId: string, explanation: string) => {
    const key = relationKey(candidate.earlier, candidate.later);
    if (key !== answerKey && !output.some((item) => item.answerKey === key)) {
      output.push({ answerKey: key, misconceptionId, explanation });
    }
  };
  if (query.kind === "TRUE_STATEMENT") {
    query.candidates.forEach((candidate) =>
      add(candidate, "USED_FALSE_OPTION_STATEMENT", "This statement conflicts with the reconstructed shared order"),
    );
  }
  passage.comparisons.forEach((candidate) =>
    add({ earlier: candidate.later, later: candidate.earlier }, "REVERSED_DISPLAYED_COMPARISON", "This reverses a displayed comparison"),
  );
  const rows = [...passage.rankRows].sort((left, right) => left.rankFromStart - right.rankFromStart);
  for (let index = 0; output.length < 3 && index < rows.length - 1; index += 1) {
    add(
      { earlier: rows[index + 1].entity, later: rows[index].entity },
      "ASSUMED_WRONG_SHARED_RELATION",
      "This relation is opposite to the shared order",
    );
  }
  return output.slice(0, 3);
}

function orderDistractors(orderKeyValue: string): DistractorCandidate[] {
  const order = parseOrderKey(orderKeyValue);
  const output: DistractorCandidate[] = [];
  const add = (candidate: readonly string[], misconceptionId: string, explanation: string) => {
    const key = orderKey(candidate);
    if (key !== orderKeyValue && !output.some((item) => item.answerKey === key)) {
      output.push({ answerKey: key, misconceptionId, explanation });
    }
  };
  add([...order].reverse(), "REVERSED_REQUESTED_DIRECTION", "This reads the shared order from the opposite end");
  const swapped = [...order];
  const index = Math.max(0, Math.floor(order.length / 2) - 1);
  [swapped[index], swapped[index + 1]] = [swapped[index + 1], swapped[index]];
  add(swapped, "SWAPPED_ADJACENT_SHARED_ROWS", "This swaps two neighbouring positions");
  add([...order.slice(1), order[0]], "TREATED_LINEAR_ORDER_AS_CIRCULAR", "This rotates a linear ranking as if it were circular");
  return output.slice(0, 3);
}

function buildOptions(
  passage: RnkCp005SharedPassage,
  query: RnkCp005Query,
  semantic: RnkCp005AnswerSemantic,
  answerKey: string,
  correctIndex: number,
): readonly RnkCp005Option[] {
  const order = solveRnkCp005SharedPassage(passage);
  const distractors = semantic === "ENTITY"
    ? entityDistractors(order, answerKey)
    : semantic === "RANK" || semantic === "COUNT"
      ? numericDistractors(order.length, answerKey, semantic)
      : semantic === "RELATION"
        ? relationDistractors(passage, query, answerKey)
        : orderDistractors(answerKey);
  if (distractors.length !== 3) throw new Error(`Expected three distractors, found ${distractors.length}`);
  const wrong = distractors.map((candidate) => ({
    answerKey: candidate.answerKey,
    label: formatAnswer(candidate.answerKey, semantic, passage),
    misconceptionId: candidate.misconceptionId,
    explanation: candidate.explanation,
  }));
  const correct: RnkCp005Option = {
    answerKey,
    label: formatAnswer(answerKey, semantic, passage),
    misconceptionId: "CORRECT",
    explanation: "This matches the independently reconstructed shared order and the requested direction",
  };
  const options: RnkCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return options;
}

function questionText(
  query: RnkCp005Query,
  passage: RnkCp005SharedPassage,
): string {
  const start = passage.startLabel;
  const end = passage.endLabel;
  switch (query.kind) {
    case "ENDPOINT_ENTITY":
      return `Who is at the ${query.direction === "START" ? start : end} end?`;
    case "ENTITY_AT_POSITION":
      return `Who is ${ordinal(query.rank)} from the ${query.direction === "START" ? start : end}?`;
    case "RANK_OF_ENTITY":
      return `What is ${query.target}'s rank from the ${query.direction === "START" ? start : end}?`;
    case "PAIR_RELATION":
      return `Which statement correctly compares ${query.first} and ${query.second}?`;
    case "RANK_GAP":
      return `What is the difference between the ranks of ${query.first} and ${query.second}?`;
    case "IMMEDIATE_NEIGHBOUR":
      return `Who is immediately ${query.direction === "BEFORE" ? `towards the ${start} of` : `towards the ${end} of`} ${query.target}?`;
    case "COMPLETE_ORDER":
      return `Which option gives the complete order from the ${query.direction === "START" ? start : end} side?`;
    case "TRUE_STATEMENT":
      return "Which of the following statements is definitely correct according to the shared information?";
  }
}

function difficultyFor(
  passage: RnkCp005SharedPassage,
  authorityId: RnkCp005AuthorityId,
): RnkCp005Difficulty {
  if (
    passage.presentationMode === "COMPARISON_CLUES" &&
    (authorityId === "SHARED_COMPLETE_ORDER" || authorityId === "SHARED_TRUE_STATEMENT")
  ) {
    return "HARD";
  }
  if (
    passage.presentationMode === "RANK_TABLE" &&
    (authorityId === "SHARED_ENDPOINT_ENTITY" || authorityId === "SHARED_ENTITY_AT_POSITION")
  ) {
    return "EASY";
  }
  return "MEDIUM";
}

function explanationFor(
  passage: RnkCp005SharedPassage,
  query: RnkCp005Query,
  answer: string,
  options: readonly RnkCp005Option[],
): RnkCp005VisibleExplanation {
  const order = solveRnkCp005SharedPassage(passage);
  const chain = order.join(" → ");
  const querySpecific = (() => {
    switch (query.kind) {
      case "ENDPOINT_ENTITY":
        return `The required endpoint is ${answer}.`;
      case "ENTITY_AT_POSITION":
        return `Counting ${query.rank} places from the requested side reaches ${answer}.`;
      case "RANK_OF_ENTITY":
        return `${query.target} occupies rank ${answer} from the requested side.`;
      case "PAIR_RELATION":
        return `${answer} because the first-mentioned name in that statement appears earlier in the order.`;
      case "RANK_GAP":
        return `The two positions differ by ${answer} rank places.`;
      case "IMMEDIATE_NEIGHBOUR":
        return `${answer} is directly next to ${query.target} on the requested side.`;
      case "COMPLETE_ORDER":
        return `Reading the line in the requested direction gives ${answer}.`;
      case "TRUE_STATEMENT":
        return `Testing every proposed statement against the line leaves only ${answer}.`;
    }
  })();
  return {
    mentalPicture: `Treat the shared information as one reusable rank line running from ${passage.startLabel} to ${passage.endLabel}.`,
    keyRule: "Reconstruct the shared order once, keep the direction fixed, and answer every linked question from that same order.",
    stepByStepSolution: [
      `Read the ${passage.presentationMode === "COMPARISON_CLUES" ? "comparisons" : "displayed positions"} and place all names on one line.`,
      `The shared order from the ${passage.startLabel} side is: ${chain}.`,
      querySpecific,
      `Therefore, the required answer is ${answer}.`,
    ],
    examSpeedShortcut: "Build the common order only once on rough paper. For the remaining linked questions, mark positions above the same line instead of rebuilding it.",
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Therefore, the correct answer is ${answer}.`,
  };
}

function mathematicalFingerprint(
  authorityId: RnkCp005AuthorityId,
  passage: RnkCp005SharedPassage,
  query: RnkCp005Query,
): string {
  const canonicalQuery = query.kind === "TRUE_STATEMENT"
    ? {
        ...query,
        candidates: query.candidates
          .map((candidate) => relationKey(candidate.earlier, candidate.later))
          .sort(),
      }
    : query;
  return `${authorityId}:${passage.sharedPassageFingerprint}:${JSON.stringify(canonicalQuery)}`;
}

export function generateRnkCp005Question(
  authorityId: RnkCp005AuthorityId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp005Question {
  if (!RNK_CP005_AUTHORITY_IDS.includes(authorityId)) throw new Error(`Unknown CP-005 authority ${authorityId}`);
  if (!Number.isInteger(seed) || seed < 0) throw new Error("seed must be a non-negative integer");
  const passage = buildRnkCp005SharedPassage(seed);
  const order = solveRnkCp005SharedPassage(passage);
  const query = queryFor(authorityId, passage, order, seed);
  const answerSemantic = semanticFor(query);
  const answerKey = solveRnkCp005Question(passage, query);
  const answer = formatAnswer(answerKey, answerSemantic, passage);
  const correctIndex = correctIndexOverride === undefined
    ? rnkCp005HashText(`${authorityId}:${seed}:correct`) % 4
    : correctIndexOverride;
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
    throw new Error("correctIndex must be 0..3");
  }
  const options = buildOptions(passage, query, answerSemantic, answerKey, correctIndex);
  const independentlySolved = solveRnkCp005Question(passage, query);
  if (independentlySolved !== answerKey) throw new Error("Independent CP-005 answer mismatch");
  const stem = `Study the shared information titled “${passage.title}”. ${questionText(query, passage)}`;
  return {
    packageId: "RNK-001",
    checkpointId: "RNK-CP-005",
    authorityId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    sharedPassage: passage,
    stem,
    query,
    answerSemantic,
    answerKey,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(passage, authorityId),
    visibleExplanation: explanationFor(passage, query, answer, options),
    mathematicalFingerprint: mathematicalFingerprint(authorityId, passage, query),
    reviewMetadata: {
      sourceOwnership: "PRESENTATION_LED_SHARED_SET",
      independentSolverStatus: "PASS",
      ambiguityStatus: "UNIQUE",
      recommendedQuestionsPerSet: 4,
      maximumQuestionsPerSet: 8,
      lifecycle: {
        reviewStatus: "ENGLISH_DISCOVERY_FROZEN",
        questionStudio: "DISABLED",
        questionBank: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publicPublication: false,
        hindiPunjabi: "NOT_STARTED",
      },
    },
  };
}
