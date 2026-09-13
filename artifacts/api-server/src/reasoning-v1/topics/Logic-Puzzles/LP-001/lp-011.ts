export type Lp011Difficulty = "Easy" | "Medium" | "Hard";
export type Lp011BoxId = "A" | "B" | "C" | "D" | "E";
export type Lp011AttributeId = "U" | "V" | "W" | "X" | "Y";
export type Lp011Position = 1 | 2 | 3 | 4 | 5;

const BOXES: readonly Lp011BoxId[] = ["A", "B", "C", "D", "E"];
const ATTRIBUTES: readonly Lp011AttributeId[] = ["U", "V", "W", "X", "Y"];
const POSITIONS: readonly Lp011Position[] = [1, 2, 3, 4, 5];

export type Lp011State = {
  positionByBox: Record<Lp011BoxId, Lp011Position>;
  attributeByBox: Record<Lp011BoxId, Lp011AttributeId>;
};

export type Lp011Clue =
  | { kind: "BOX_ABOVE_BOX"; upper: Lp011BoxId; lower: Lp011BoxId; text: string }
  | { kind: "BOX_IMMEDIATELY_ABOVE_BOX"; upper: Lp011BoxId; lower: Lp011BoxId; text: string }
  | { kind: "BOXES_BETWEEN_BOX_BOX"; left: Lp011BoxId; right: Lp011BoxId; count: number; text: string }
  | { kind: "BOX_NOT_POSITION"; box: Lp011BoxId; position: Lp011Position; text: string }
  | { kind: "BOX_HAS_ATTRIBUTE"; box: Lp011BoxId; attribute: Lp011AttributeId; text: string }
  | { kind: "BOX_NOT_ATTRIBUTE"; box: Lp011BoxId; attribute: Lp011AttributeId; text: string }
  | { kind: "ATTRIBUTE_ABOVE_BOX"; attribute: Lp011AttributeId; box: Lp011BoxId; text: string }
  | { kind: "BOX_ABOVE_ATTRIBUTE"; box: Lp011BoxId; attribute: Lp011AttributeId; text: string }
  | { kind: "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX"; attribute: Lp011AttributeId; box: Lp011BoxId; text: string }
  | { kind: "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE"; box: Lp011BoxId; attribute: Lp011AttributeId; text: string }
  | { kind: "ATTRIBUTE_ABOVE_ATTRIBUTE"; upper: Lp011AttributeId; lower: Lp011AttributeId; text: string };

export type Lp011Child = {
  questionId: string;
  qlId: "LP-QL-041" | "LP-QL-042" | "LP-QL-043" | "LP-QL-044";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: Lp011Difficulty;
  explanation: { summary: string; lines: string[] };
};

export type Lp011Caselet = {
  caseletId: string;
  scenarioProfileId: string;
  scenario: string;
  difficultyBand: Lp011Difficulty;
  boxes: readonly Lp011BoxId[];
  positions: readonly Lp011Position[];
  attributes: readonly Lp011AttributeId[];
  attributeLabels: Record<Lp011AttributeId, string>;
  attributeNoun: string;
  clues: readonly Lp011Clue[];
  assignment: Lp011State;
  children: readonly Lp011Child[];
};

export const LP_011_REVIEW_PACKAGE = Object.freeze({
  packageId: "LP-011" as const,
  checkpointId: "LP-CP-011" as const,
  label: "Box-and-Attribute Stack Puzzle" as const,
  qlIds: ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"] as const,
  qlAllocationStatus: "CANDIDATE_NOT_PERMANENT" as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  supportedLanguages: ["en"] as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
});

type Profile = {
  id: string;
  scenario: string;
  attributeNoun: string;
  labels: Record<Lp011AttributeId, string>;
};

const PROFILES: readonly Profile[] = [
  {
    id: "COLOURED_BOXES",
    scenario: "Five boxes A, B, C, D and E are kept one above another. Each box is painted a different colour.",
    attributeNoun: "colour",
    labels: { U: "Blue", V: "Green", W: "Red", X: "Yellow", Y: "White" },
  },
  {
    id: "WAREHOUSE_ITEMS",
    scenario: "Five labelled boxes A, B, C, D and E are kept one above another in a warehouse. Each box contains a different item.",
    attributeNoun: "item",
    labels: { U: "Books", V: "Pens", W: "Files", X: "Maps", Y: "Forms" },
  },
  {
    id: "RELIEF_MATERIAL",
    scenario: "Five supply boxes A, B, C, D and E are stacked one above another. Each box contains a different relief material.",
    attributeNoun: "material",
    labels: { U: "Blankets", V: "Rations", W: "Medicines", X: "Torches", Y: "Tarpaulins" },
  },
  {
    id: "OFFICE_STOCK",
    scenario: "Five office-stock boxes A, B, C, D and E are placed one above another. Each box contains a different kind of stock.",
    attributeNoun: "stock item",
    labels: { U: "Registers", V: "Folders", W: "Envelopes", X: "Notepads", Y: "Labels" },
  },
  {
    id: "LAB_SUPPLIES",
    scenario: "Five lab-supply boxes A, B, C, D and E are stacked one above another. Each box contains a different supply.",
    attributeNoun: "supply",
    labels: { U: "Gloves", V: "Slides", W: "Tubes", X: "Masks", Y: "Swabs" },
  },
  {
    id: "BOOK_CATEGORIES",
    scenario: "Five cartons A, B, C, D and E are stacked one above another. Each carton contains books from a different subject.",
    attributeNoun: "subject",
    labels: { U: "History", V: "Science", W: "Mathematics", X: "English", Y: "Geography" },
  },
];

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}
function rng(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0;
    state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0;
    return ((state ^ (state >>> 16)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}
function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [[...items]];
  const result: T[][] = [];
  items.forEach((item, index) => {
    const rest = [...items.slice(0, index), ...items.slice(index + 1)];
    for (const tail of permutations(rest)) result.push([item, ...tail]);
  });
  return result;
}
const POSITION_PERMUTATIONS = permutations(POSITIONS);
const ATTRIBUTE_PERMUTATIONS = permutations(ATTRIBUTES);

function ordinal(position: number): string {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}
function boxName(box: Lp011BoxId): string { return `Box ${box}`; }
function boxAtPosition(state: Lp011State, position: Lp011Position): Lp011BoxId {
  return BOXES.find((box) => state.positionByBox[box] === position)!;
}
function boxWithAttribute(state: Lp011State, attribute: Lp011AttributeId): Lp011BoxId {
  return BOXES.find((box) => state.attributeByBox[box] === attribute)!;
}
function positionOfAttribute(state: Lp011State, attribute: Lp011AttributeId): Lp011Position {
  return state.positionByBox[boxWithAttribute(state, attribute)];
}

export function lp011ClueSatisfied(state: Lp011State, clue: Lp011Clue): boolean {
  switch (clue.kind) {
    case "BOX_ABOVE_BOX": return state.positionByBox[clue.upper] > state.positionByBox[clue.lower];
    case "BOX_IMMEDIATELY_ABOVE_BOX": return state.positionByBox[clue.upper] === state.positionByBox[clue.lower] + 1;
    case "BOXES_BETWEEN_BOX_BOX": return Math.abs(state.positionByBox[clue.left] - state.positionByBox[clue.right]) - 1 === clue.count;
    case "BOX_NOT_POSITION": return state.positionByBox[clue.box] !== clue.position;
    case "BOX_HAS_ATTRIBUTE": return state.attributeByBox[clue.box] === clue.attribute;
    case "BOX_NOT_ATTRIBUTE": return state.attributeByBox[clue.box] !== clue.attribute;
    case "ATTRIBUTE_ABOVE_BOX": return positionOfAttribute(state, clue.attribute) > state.positionByBox[clue.box];
    case "BOX_ABOVE_ATTRIBUTE": return state.positionByBox[clue.box] > positionOfAttribute(state, clue.attribute);
    case "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX": return positionOfAttribute(state, clue.attribute) === state.positionByBox[clue.box] + 1;
    case "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE": return state.positionByBox[clue.box] === positionOfAttribute(state, clue.attribute) + 1;
    case "ATTRIBUTE_ABOVE_ATTRIBUTE": return positionOfAttribute(state, clue.upper) > positionOfAttribute(state, clue.lower);
  }
}

export function solveLp011(clues: readonly Lp011Clue[], limit = Number.POSITIVE_INFINITY): Lp011State[] {
  const result: Lp011State[] = [];
  for (const positions of POSITION_PERMUTATIONS) {
    const positionByBox = Object.fromEntries(BOXES.map((box, index) => [box, positions[index]!])) as Record<Lp011BoxId, Lp011Position>;
    const positionOnly = clues.filter((clue) => clue.kind === "BOX_ABOVE_BOX" || clue.kind === "BOX_IMMEDIATELY_ABOVE_BOX" || clue.kind === "BOXES_BETWEEN_BOX_BOX" || clue.kind === "BOX_NOT_POSITION");
    const placeholder = { positionByBox, attributeByBox: { A: "U", B: "V", C: "W", D: "X", E: "Y" } as Record<Lp011BoxId, Lp011AttributeId> };
    if (!positionOnly.every((clue) => lp011ClueSatisfied(placeholder, clue))) continue;
    for (const attributes of ATTRIBUTE_PERMUTATIONS) {
      const attributeByBox = Object.fromEntries(BOXES.map((box, index) => [box, attributes[index]!])) as Record<Lp011BoxId, Lp011AttributeId>;
      const state = { positionByBox, attributeByBox };
      if (!clues.every((clue) => lp011ClueSatisfied(state, clue))) continue;
      result.push(state);
      if (result.length >= limit) return result;
    }
  }
  return result;
}

function stateEquals(left: Lp011State, right: Lp011State): boolean {
  return BOXES.every((box) => left.positionByBox[box] === right.positionByBox[box] && left.attributeByBox[box] === right.attributeByBox[box]);
}
function hiddenState(random: () => number): Lp011State {
  const positions = shuffle(POSITIONS, random);
  const attributes = shuffle(ATTRIBUTES, random);
  return {
    positionByBox: Object.fromEntries(BOXES.map((box, index) => [box, positions[index]!])) as Record<Lp011BoxId, Lp011Position>,
    attributeByBox: Object.fromEntries(BOXES.map((box, index) => [box, attributes[index]!])) as Record<Lp011BoxId, Lp011AttributeId>,
  };
}

function buildCandidateClues(state: Lp011State, profile: Profile, random: () => number): Lp011Clue[] {
  const result: Lp011Clue[] = [];
  const label = (attribute: Lp011AttributeId) => profile.labels[attribute];
  for (const box of BOXES) {
    const actualPosition = state.positionByBox[box];
    const actualAttribute = state.attributeByBox[box];
    result.push({ kind: "BOX_HAS_ATTRIBUTE", box, attribute: actualAttribute, text: `${boxName(box)} has ${label(actualAttribute)} as its ${profile.attributeNoun}.` });
    const wrongAttribute = shuffle(ATTRIBUTES.filter((value) => value !== actualAttribute), random)[0]!;
    result.push({ kind: "BOX_NOT_ATTRIBUTE", box, attribute: wrongAttribute, text: `${boxName(box)} does not have ${label(wrongAttribute)} as its ${profile.attributeNoun}.` });
    const wrongPosition = shuffle(POSITIONS.filter((value) => value !== actualPosition), random)[0]!;
    result.push({ kind: "BOX_NOT_POSITION", box, position: wrongPosition, text: `${boxName(box)} is not in the ${ordinal(wrongPosition)} position from the bottom.` });
  }
  for (let i = 0; i < BOXES.length; i += 1) {
    for (let j = i + 1; j < BOXES.length; j += 1) {
      const first = BOXES[i]!; const second = BOXES[j]!;
      const firstPos = state.positionByBox[first]; const secondPos = state.positionByBox[second];
      const upper = firstPos > secondPos ? first : second; const lower = upper === first ? second : first;
      result.push({ kind: "BOX_ABOVE_BOX", upper, lower, text: `${boxName(upper)} is above ${boxName(lower)}.` });
      const gap = Math.abs(firstPos - secondPos) - 1;
      if (gap >= 1 && gap <= 2) result.push({ kind: "BOXES_BETWEEN_BOX_BOX", left: first, right: second, count: gap, text: `Exactly ${gap === 1 ? "one box is" : `${gap} boxes are`} kept between ${boxName(first)} and ${boxName(second)}.` });
      if (gap === 0) result.push({ kind: "BOX_IMMEDIATELY_ABOVE_BOX", upper, lower, text: `${boxName(upper)} is immediately above ${boxName(lower)}.` });
    }
  }
  for (const attribute of ATTRIBUTES) {
    const attributePosition = positionOfAttribute(state, attribute);
    for (const box of BOXES) {
      const boxPosition = state.positionByBox[box];
      if (state.attributeByBox[box] === attribute) continue;
      if (attributePosition > boxPosition) result.push({ kind: "ATTRIBUTE_ABOVE_BOX", attribute, box, text: `The box with ${label(attribute)} ${profile.attributeNoun} is above ${boxName(box)}.` });
      else result.push({ kind: "BOX_ABOVE_ATTRIBUTE", box, attribute, text: `${boxName(box)} is above the box with ${label(attribute)} ${profile.attributeNoun}.` });
      if (attributePosition === boxPosition + 1) result.push({ kind: "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX", attribute, box, text: `The box with ${label(attribute)} ${profile.attributeNoun} is immediately above ${boxName(box)}.` });
      if (boxPosition === attributePosition + 1) result.push({ kind: "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE", box, attribute, text: `${boxName(box)} is immediately above the box with ${label(attribute)} ${profile.attributeNoun}.` });
    }
  }
  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    for (let j = i + 1; j < ATTRIBUTES.length; j += 1) {
      const first = ATTRIBUTES[i]!; const second = ATTRIBUTES[j]!;
      const upper = positionOfAttribute(state, first) > positionOfAttribute(state, second) ? first : second;
      const lower = upper === first ? second : first;
      result.push({ kind: "ATTRIBUTE_ABOVE_ATTRIBUTE", upper, lower, text: `The box with ${label(upper)} ${profile.attributeNoun} is above the box with ${label(lower)} ${profile.attributeNoun}.` });
    }
  }
  const seen = new Set<string>();
  return result.filter((clue) => !seen.has(clue.text) && Boolean(seen.add(clue.text)));
}

function clueStrength(clue: Lp011Clue): number {
  if (clue.kind === "BOX_HAS_ATTRIBUTE" || clue.kind === "BOX_IMMEDIATELY_ABOVE_BOX" || clue.kind === "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX" || clue.kind === "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE") return 4;
  if (clue.kind === "BOXES_BETWEEN_BOX_BOX") return 3;
  if (clue.kind === "BOX_ABOVE_BOX" || clue.kind === "ATTRIBUTE_ABOVE_BOX" || clue.kind === "BOX_ABOVE_ATTRIBUTE" || clue.kind === "ATTRIBUTE_ABOVE_ATTRIBUTE") return 2;
  return 1;
}
function admissibleForDifficulty(clue: Lp011Clue, difficulty: Lp011Difficulty, directSeen: number): boolean {
  if (difficulty === "Hard" && clue.kind === "BOX_HAS_ATTRIBUTE") return false;
  if (difficulty === "Medium" && clue.kind === "BOX_HAS_ATTRIBUTE" && directSeen >= 1) return false;
  return true;
}
function chooseClues(state: Lp011State, profile: Profile, difficulty: Lp011Difficulty, random: () => number): Lp011Clue[] | null {
  let pool = shuffle(buildCandidateClues(state, profile, random), random);
  pool = pool.sort((left, right) => {
    const delta = clueStrength(right) - clueStrength(left);
    return difficulty === "Easy" ? delta : difficulty === "Hard" ? -delta : 0;
  });
  const chosen: Lp011Clue[] = [];
  let directSeen = 0;
  for (const clue of pool) {
    if (!admissibleForDifficulty(clue, difficulty, directSeen)) continue;
    chosen.push(clue);
    if (clue.kind === "BOX_HAS_ATTRIBUTE") directSeen += 1;
    const states = solveLp011(chosen, 2);
    if (states.length === 1 && stateEquals(states[0]!, state)) break;
    if (chosen.length >= 9) break;
  }
  if (solveLp011(chosen, 2).length !== 1) return null;
  for (let index = chosen.length - 1; index >= 0; index -= 1) {
    const trial = chosen.filter((_, candidate) => candidate !== index);
    const states = solveLp011(trial, 2);
    if (states.length === 1 && stateEquals(states[0]!, state)) chosen.splice(index, 1);
  }
  if (difficulty === "Easy" && !chosen.some((clue) => clueStrength(clue) >= 4)) return null;
  if (difficulty === "Hard" && chosen.some((clue) => clue.kind === "BOX_HAS_ATTRIBUTE")) return null;
  return chosen;
}

function clueRefs(clue: Lp011Clue): Set<string> {
  const refs = new Set<string>();
  for (const [key, value] of Object.entries(clue)) {
    if (key === "text" || key === "kind" || key === "count" || key === "position") continue;
    refs.add(String(value));
  }
  return refs;
}
function intersects(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  for (const value of left) if (right.has(value)) return true;
  return false;
}
function planClues(clues: readonly Lp011Clue[]): Lp011Clue[] {
  const unused = [...clues]; const planned: Lp011Clue[] = []; const usedRefs = new Set<string>();
  let states = solveLp011([]);
  while (unused.length) {
    let bestIndex = 0; let bestScore = -Infinity;
    for (let index = 0; index < unused.length; index += 1) {
      const clue = unused[index]!;
      const after = solveLp011([...planned, clue]);
      if (!after.length) continue;
      const reduction = states.length - after.length;
      const connected = planned.length && intersects(usedRefs, clueRefs(clue)) ? 1 : 0;
      const score = reduction * 1000 + connected * 25 + clueStrength(clue);
      if (score > bestScore) { bestScore = score; bestIndex = index; }
    }
    const [next] = unused.splice(bestIndex, 1); planned.push(next!);
    for (const ref of clueRefs(next!)) usedRefs.add(ref);
    states = solveLp011(planned);
  }
  return planned;
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}
function workingCell(values: readonly string[], fullDomainSize: number): string {
  const unique = [...new Set(values)];
  if (unique.length === 1) return unique[0]!;
  if (unique.length === fullDomainSize) return "?";
  return unique.join(" / ");
}
function workingTable(states: readonly Lp011State[], profile: Profile): string {
  const rows = [...POSITIONS].reverse().map((position) => {
    const boxes = states.map((state) => boxName(boxAtPosition(state, position)));
    const attrs = states.map((state) => profile.labels[state.attributeByBox[boxAtPosition(state, position)]]);
    return [ordinal(position), workingCell(boxes, BOXES.length), workingCell(attrs, ATTRIBUTES.length)];
  });
  return markdownTable(["Position from bottom", "Box", profile.attributeNoun], rows);
}
function fullTable(state: Lp011State, profile: Profile): string {
  return markdownTable(["Position from bottom", "Box", profile.attributeNoun], [...POSITIONS].reverse().map((position) => {
    const box = boxAtPosition(state, position);
    return [ordinal(position), boxName(box), profile.labels[state.attributeByBox[box]]];
  }));
}
function explanationLines(clues: readonly Lp011Clue[], state: Lp011State, profile: Profile): string[] {
  const planned = planClues(clues); const lines: string[] = []; let applied: Lp011Clue[] = []; let states = solveLp011([]); let pending: Lp011Clue[] = []; let step = 1; let casesShown = false;
  for (let index = 0; index < planned.length; index += 1) {
    const clue = planned[index]!; const before = workingTable(states, profile); pending.push(clue);
    const nextApplied = [...applied, clue]; const after = solveLp011(nextApplied); const afterTable = workingTable(after, profile); const changed = before !== afterTable; const isLast = index === planned.length - 1;
    if (!changed && !isLast) { applied = nextApplied; states = after; continue; }
    const lead = pending.length === 1 ? `${step === 1 ? "Start with" : "Now use"} this clue: ${pending[0]!.text}` : `Use these connected clues together: ${pending.map((entry) => entry.text.replace(/[.]$/u, "")).join("; then ")}.`;
    let body = `${lead}\n\nThe working table becomes:\n\n${afterTable}`;
    if (!casesShown && after.length === 2 && !isLast) {
      body += `\n\nOnly two complete arrangements remain.\n\n**Case 1**\n\n${fullTable(after[0]!, profile)}\n\n**Case 2**\n\n${fullTable(after[1]!, profile)}`;
      casesShown = true;
    }
    if (isLast && states.length === 2 && after.length === 1) {
      if (!casesShown) body = `Only two complete arrangements remain.\n\n**Case 1**\n\n${fullTable(states[0]!, profile)}\n\n**Case 2**\n\n${fullTable(states[1]!, profile)}\n\n${lead}`;
      const keepFirst = stateEquals(after[0]!, states[0]!);
      body += `\n\nThis clue removes Case ${keepFirst ? "2" : "1"}. Keep Case ${keepFirst ? "1" : "2"}.`;
    }
    lines.push(`**Step ${step}**\n\n${body}`);
    pending = []; applied = nextApplied; states = after; step += 1;
  }
  lines.push(`**Step ${step}: Complete the arrangement**\n\nThe final table is:\n\n${fullTable(state, profile)}`);
  return lines;
}

function placeCorrect(correct: string, distractors: readonly string[], index: number): { options: string[]; correctIndex: number } {
  const wrong = [...new Set(distractors.filter((value) => value !== correct))].slice(0, 3);
  if (wrong.length !== 3) throw new Error("LP-011 could not build three distinct distractors");
  const correctIndex = index % 4; const options = [...wrong]; options.splice(correctIndex, 0, correct);
  return { options, correctIndex };
}
function buildChildren(caseletId: string, state: Lp011State, profile: Profile, difficulty: Lp011Difficulty, shared: string[], caseletIndex: number): Lp011Child[] {
  const targetBox = BOXES[caseletIndex % BOXES.length]!;
  const targetAttribute = state.attributeByBox[targetBox];
  const targetAttrLabel = profile.labels[targetAttribute];
  const targetPosition = state.positionByBox[targetBox];
  const inverseAttribute = ATTRIBUTES[(caseletIndex + 2) % ATTRIBUTES.length]!;
  const inverseBox = boxWithAttribute(state, inverseAttribute);
  const inverseLabel = profile.labels[inverseAttribute];
  const positionAttribute = ATTRIBUTES[(caseletIndex + 3) % ATTRIBUTES.length]!;
  const positionLabel = profile.labels[positionAttribute];
  const positionAnswer = `${ordinal(positionOfAttribute(state, positionAttribute))} from bottom`;
  const tripleAnswer = `${targetAttrLabel}, ${ordinal(targetPosition)} from bottom`;
  const childSpecs = [
    {
      qlId: "LP-QL-041" as const,
      stem: `Which ${profile.attributeNoun} belongs to ${boxName(targetBox)}?`,
      answer: targetAttrLabel,
      distractors: ATTRIBUTES.filter((attribute) => attribute !== targetAttribute).map((attribute) => profile.labels[attribute]),
    },
    {
      qlId: "LP-QL-042" as const,
      stem: `Which box has ${inverseLabel} as its ${profile.attributeNoun}?`,
      answer: boxName(inverseBox),
      distractors: BOXES.filter((box) => box !== inverseBox).map(boxName),
    },
    {
      qlId: "LP-QL-043" as const,
      stem: `At which position from the bottom is the box with ${positionLabel} ${profile.attributeNoun} kept?`,
      answer: positionAnswer,
      distractors: POSITIONS.filter((position) => position !== positionOfAttribute(state, positionAttribute)).map((position) => `${ordinal(position)} from bottom`),
    },
    {
      qlId: "LP-QL-044" as const,
      stem: `Which option gives the correct ${profile.attributeNoun} and position of ${boxName(targetBox)}?`,
      answer: tripleAnswer,
      distractors: [
        `${profile.labels[ATTRIBUTES.find((attribute) => attribute !== targetAttribute)!]}, ${ordinal(targetPosition)} from bottom`,
        `${targetAttrLabel}, ${ordinal(POSITIONS.find((position) => position !== targetPosition)!)} from bottom`,
        `${profile.labels[ATTRIBUTES.filter((attribute) => attribute !== targetAttribute)[1]!]}, ${ordinal(POSITIONS.filter((position) => position !== targetPosition)[1]!)} from bottom`,
      ],
    },
  ];
  return childSpecs.map((spec, childIndex) => {
    const placed = placeCorrect(spec.answer, spec.distractors, caseletIndex + childIndex);
    return {
      questionId: `${caseletId}:${spec.qlId}`,
      qlId: spec.qlId,
      stem: spec.stem,
      options: placed.options,
      correctIndex: placed.correctIndex,
      answer: spec.answer,
      difficultyBand: difficulty,
      explanation: {
        summary: `Fill the stack step by step. The required answer is ${spec.answer}.`,
        lines: [...shared, `**Answer the question**\n\nFrom the completed table, the answer is **${spec.answer}**.`],
      },
    };
  });
}

function makeSetup(profile: Profile): string {
  return `${profile.scenario} The five ${profile.attributeNoun} values are ${ATTRIBUTES.map((attribute) => profile.labels[attribute]).join(", ")}. Positions are counted from bottom to top as 1st to 5th. Each box occupies one position and each ${profile.attributeNoun} is used exactly once.`;
}

export function generateLp011Batch(seed = "lp-011-review-v1", count = 8): Lp011Caselet[] {
  const result: Lp011Caselet[] = [];
  for (let index = 0; index < count; index += 1) {
    const difficulty: Lp011Difficulty = ["Easy", "Medium", "Hard"][index % 3] as Lp011Difficulty;
    let built: Lp011Caselet | null = null;
    for (let attempt = 0; attempt < 120 && !built; attempt += 1) {
      const random = rng(`${seed}:${index}:${attempt}`);
      const profile = PROFILES[Math.floor(random() * PROFILES.length)]!;
      const assignment = hiddenState(random);
      const clues = chooseClues(assignment, profile, difficulty, random);
      if (!clues || clues.length < 3 || clues.length > 9) continue;
      const solved = solveLp011(clues, 3);
      if (solved.length !== 1 || !stateEquals(solved[0]!, assignment)) continue;
      const caseletId = `LP-011:${seed}:${index + 1}`;
      const shared = explanationLines(clues, assignment, profile);
      built = {
        caseletId,
        scenarioProfileId: profile.id,
        scenario: makeSetup(profile),
        difficultyBand: difficulty,
        boxes: BOXES,
        positions: POSITIONS,
        attributes: ATTRIBUTES,
        attributeLabels: profile.labels,
        attributeNoun: profile.attributeNoun,
        clues,
        assignment,
        children: buildChildren(caseletId, assignment, profile, difficulty, shared, index),
      };
    }
    if (!built) throw new Error(`LP-011 failed to build caselet ${index + 1} for seed ${seed}`);
    result.push(built);
  }
  return result;
}
