import {
  generateLp011Batch,
  solveLp011,
  type Lp011AttributeId,
  type Lp011BoxId,
  type Lp011Caselet,
  type Lp011Child,
  type Lp011Clue,
  type Lp011Position,
  type Lp011State,
} from "./lp-011.ts";

export const LP_011_STABILIZED_V1_2 = Object.freeze({
  authorityId: "LP_011_STABILIZED_V1_2" as const,
  parentAuthority: "LP_011_REVIEW_PACKAGE" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  hardGeneration: "SOLVER_GUIDED_INDIRECT_CLUES_WITH_DETERMINISTIC_FALLBACK" as const,
  hardDirectBoxAttributeCluesForbidden: true as const,
  changesPuzzleSemantics: false as const,
  changesQlSemantics: false as const,
});

const BOXES: readonly Lp011BoxId[] = ["A", "B", "C", "D", "E"];
const ATTRIBUTES: readonly Lp011AttributeId[] = ["U", "V", "W", "X", "Y"];
const POSITIONS: readonly Lp011Position[] = [1, 2, 3, 4, 5];

function ordinal(position: number): string {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}
function boxName(box: Lp011BoxId) { return `Box ${box}`; }
function boxWithAttribute(state: Lp011State, attribute: Lp011AttributeId): Lp011BoxId {
  return BOXES.find((box) => state.attributeByBox[box] === attribute)!;
}
function positionOfAttribute(state: Lp011State, attribute: Lp011AttributeId): Lp011Position {
  return state.positionByBox[boxWithAttribute(state, attribute)];
}
function boxAtPosition(state: Lp011State, position: Lp011Position): Lp011BoxId {
  return BOXES.find((box) => state.positionByBox[box] === position)!;
}
function stateEquals(left: Lp011State, right: Lp011State): boolean {
  return BOXES.every((box) => left.positionByBox[box] === right.positionByBox[box] && left.attributeByBox[box] === right.attributeByBox[box]);
}

function hardCandidates(base: Lp011Caselet): Lp011Clue[] {
  const state = base.assignment;
  const label = (attribute: Lp011AttributeId) => base.attributeLabels[attribute];
  const noun = base.attributeNoun;
  const clues: Lp011Clue[] = [];

  for (let i = 0; i < BOXES.length; i += 1) {
    for (let j = i + 1; j < BOXES.length; j += 1) {
      const first = BOXES[i]!; const second = BOXES[j]!;
      const firstPos = state.positionByBox[first]; const secondPos = state.positionByBox[second];
      const upper = firstPos > secondPos ? first : second;
      const lower = upper === first ? second : first;
      clues.push({ kind: "BOX_ABOVE_BOX", upper, lower, text: `${boxName(upper)} is above ${boxName(lower)}.` });
      const gap = Math.abs(firstPos - secondPos) - 1;
      if (gap === 0) clues.push({ kind: "BOX_IMMEDIATELY_ABOVE_BOX", upper, lower, text: `${boxName(upper)} is immediately above ${boxName(lower)}.` });
      if (gap >= 1 && gap <= 2) clues.push({ kind: "BOXES_BETWEEN_BOX_BOX", left: first, right: second, count: gap, text: `Exactly ${gap === 1 ? "one box is" : `${gap} boxes are`} kept between ${boxName(first)} and ${boxName(second)}.` });
    }
  }

  for (const box of BOXES) {
    const actualPosition = state.positionByBox[box];
    const wrongPosition = POSITIONS.find((position) => position !== actualPosition)!;
    clues.push({ kind: "BOX_NOT_POSITION", box, position: wrongPosition, text: `${boxName(box)} is not in the ${ordinal(wrongPosition)} position from the bottom.` });
    const actualAttribute = state.attributeByBox[box];
    const wrongAttribute = ATTRIBUTES.find((attribute) => attribute !== actualAttribute)!;
    clues.push({ kind: "BOX_NOT_ATTRIBUTE", box, attribute: wrongAttribute, text: `${boxName(box)} does not contain ${label(wrongAttribute)}.` });
  }

  for (const attribute of ATTRIBUTES) {
    const attributePosition = positionOfAttribute(state, attribute);
    for (const box of BOXES) {
      if (state.attributeByBox[box] === attribute) continue;
      const boxPosition = state.positionByBox[box];
      if (attributePosition > boxPosition) {
        clues.push({ kind: "ATTRIBUTE_ABOVE_BOX", attribute, box, text: `The box containing ${label(attribute)} is above ${boxName(box)}.` });
        if (attributePosition === boxPosition + 1) clues.push({ kind: "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX", attribute, box, text: `The box containing ${label(attribute)} is immediately above ${boxName(box)}.` });
      } else {
        clues.push({ kind: "BOX_ABOVE_ATTRIBUTE", box, attribute, text: `${boxName(box)} is above the box containing ${label(attribute)}.` });
        if (boxPosition === attributePosition + 1) clues.push({ kind: "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE", box, attribute, text: `${boxName(box)} is immediately above the box containing ${label(attribute)}.` });
      }
    }
  }

  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    for (let j = i + 1; j < ATTRIBUTES.length; j += 1) {
      const first = ATTRIBUTES[i]!; const second = ATTRIBUTES[j]!;
      const upper = positionOfAttribute(state, first) > positionOfAttribute(state, second) ? first : second;
      const lower = upper === first ? second : first;
      clues.push({ kind: "ATTRIBUTE_ABOVE_ATTRIBUTE", upper, lower, text: `The box containing ${label(upper)} is above the box containing ${label(lower)}.` });
    }
  }

  const seen = new Set<string>();
  return clues.filter((clue) => !seen.has(clue.text) && Boolean(seen.add(clue.text)));
}

function strength(clue: Lp011Clue): number {
  if (["BOX_IMMEDIATELY_ABOVE_BOX", "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX", "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE"].includes(clue.kind)) return 5;
  if (clue.kind === "BOXES_BETWEEN_BOX_BOX") return 4;
  if (["ATTRIBUTE_ABOVE_BOX", "BOX_ABOVE_ATTRIBUTE", "ATTRIBUTE_ABOVE_ATTRIBUTE"].includes(clue.kind)) return 3;
  if (clue.kind === "BOX_ABOVE_BOX") return 2;
  return 1;
}

function signature(clue: Lp011Clue): string {
  if (clue.kind.includes("ATTRIBUTE") && clue.kind.includes("BOX")) return "MIXED";
  if (clue.kind.includes("ATTRIBUTE")) return "ATTRIBUTE";
  return "BOX";
}

function chooseHardClues(base: Lp011Caselet): Lp011Clue[] | null {
  const target = base.assignment;
  const pool = hardCandidates(base);
  const chosen: Lp011Clue[] = [];
  const used = new Set<number>();
  const familyCounts = new Map<string, number>();
  let currentCount = solveLp011([], Number.POSITIVE_INFINITY).length;

  while (chosen.length < 9) {
    let bestIndex = -1;
    let bestCount = currentCount;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let index = 0; index < pool.length; index += 1) {
      if (used.has(index)) continue;
      const clue = pool[index]!;
      const solutions = solveLp011([...chosen, clue], 500);
      if (!solutions.length) continue;
      const nextCount = solutions.length;
      const reduction = Math.max(0, currentCount - nextCount);
      const family = signature(clue);
      const diversity = (familyCounts.get(family) ?? 0) === 0 ? 40 : 0;
      const score = reduction * 100 + strength(clue) * 10 + diversity - (familyCounts.get(family) ?? 0) * 3;
      if (score > bestScore) { bestScore = score; bestIndex = index; bestCount = nextCount; }
    }
    if (bestIndex < 0) break;
    const clue = pool[bestIndex]!;
    used.add(bestIndex);
    chosen.push(clue);
    familyCounts.set(signature(clue), (familyCounts.get(signature(clue)) ?? 0) + 1);
    currentCount = bestCount;
    const exact = solveLp011(chosen, 2);
    if (exact.length === 1 && stateEquals(exact[0]!, target)) break;
  }

  if (solveLp011(chosen, 2).length !== 1) return null;
  for (let index = chosen.length - 1; index >= 0; index -= 1) {
    const trial = chosen.filter((_, candidate) => candidate !== index);
    const solutions = solveLp011(trial, 2);
    if (solutions.length === 1 && stateEquals(solutions[0]!, target)) chosen.splice(index, 1);
  }
  return chosen;
}

function fallbackHardClues(base: Lp011Caselet): Lp011Clue[] {
  const state = base.assignment;
  const boxesBottomUp = [...BOXES].sort((left, right) => state.positionByBox[left] - state.positionByBox[right]);
  const attrsBottomUp = [...ATTRIBUTES].sort((left, right) => positionOfAttribute(state, left) - positionOfAttribute(state, right));
  const clues: Lp011Clue[] = [];
  for (let index = 1; index < boxesBottomUp.length; index += 1) {
    const lower = boxesBottomUp[index - 1]!; const upper = boxesBottomUp[index]!;
    clues.push({ kind: "BOX_IMMEDIATELY_ABOVE_BOX", upper, lower, text: `${boxName(upper)} is immediately above ${boxName(lower)}.` });
  }
  for (let index = 1; index < attrsBottomUp.length; index += 1) {
    const lower = attrsBottomUp[index - 1]!; const upper = attrsBottomUp[index]!;
    clues.push({ kind: "ATTRIBUTE_ABOVE_ATTRIBUTE", upper, lower, text: `The box containing ${base.attributeLabels[upper]} is above the box containing ${base.attributeLabels[lower]}.` });
  }
  return clues;
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}
function cell(values: readonly string[], domainSize: number): string {
  const unique = [...new Set(values)];
  if (unique.length === 1) return unique[0]!;
  if (unique.length === domainSize) return "?";
  return unique.join(" / ");
}
function workingTable(states: readonly Lp011State[], base: Lp011Caselet): string {
  return markdownTable(["Position from bottom", "Box", base.attributeNoun], [...POSITIONS].reverse().map((position) => {
    const boxes = states.map((state) => boxName(boxAtPosition(state, position)));
    const attrs = states.map((state) => base.attributeLabels[state.attributeByBox[boxAtPosition(state, position)]]);
    return [ordinal(position), cell(boxes, 5), cell(attrs, 5)];
  }));
}
function fullTable(state: Lp011State, base: Lp011Caselet): string {
  return markdownTable(["Position from bottom", "Box", base.attributeNoun], [...POSITIONS].reverse().map((position) => {
    const box = boxAtPosition(state, position);
    return [ordinal(position), boxName(box), base.attributeLabels[state.attributeByBox[box]]];
  }));
}
function clueRefs(clue: Lp011Clue): Set<string> {
  const refs = new Set<string>();
  for (const [key, value] of Object.entries(clue)) {
    if (["kind", "text", "count", "position"].includes(key)) continue;
    refs.add(String(value));
  }
  return refs;
}
function intersects(left: ReadonlySet<string>, right: ReadonlySet<string>) { for (const value of left) if (right.has(value)) return true; return false; }
function plan(clues: readonly Lp011Clue[]): Lp011Clue[] {
  const unused = [...clues]; const result: Lp011Clue[] = []; const refs = new Set<string>();
  let states = solveLp011([]);
  while (unused.length) {
    let best = 0; let bestScore = Number.NEGATIVE_INFINITY;
    for (let index = 0; index < unused.length; index += 1) {
      const clue = unused[index]!; const after = solveLp011([...result, clue]);
      const reduction = states.length - after.length;
      const connected = result.length && intersects(refs, clueRefs(clue)) ? 1 : 0;
      const score = reduction * 100 + connected * 30 + strength(clue);
      if (score > bestScore) { bestScore = score; best = index; }
    }
    const [next] = unused.splice(best, 1); result.push(next!);
    for (const ref of clueRefs(next!)) refs.add(ref);
    states = solveLp011(result);
  }
  return result;
}
function hardExplanation(clues: readonly Lp011Clue[], base: Lp011Caselet): string[] {
  const ordered = plan(clues); const lines: string[] = []; let applied: Lp011Clue[] = []; let states = solveLp011([]); let pending: Lp011Clue[] = []; let step = 1; let casesShown = false;
  for (let index = 0; index < ordered.length; index += 1) {
    const clue = ordered[index]!; const before = workingTable(states, base); pending.push(clue);
    const nextApplied = [...applied, clue]; const after = solveLp011(nextApplied); const afterTable = workingTable(after, base); const isLast = index === ordered.length - 1;
    if (before === afterTable && !isLast) { applied = nextApplied; states = after; continue; }
    const lead = pending.length === 1 ? `${step === 1 ? "Start with" : "Now use"} this clue: ${pending[0]!.text}` : `Use these connected clues together: ${pending.map((entry) => entry.text.replace(/[.]$/u, "")).join("; then ")}.`;
    let body = `${lead}\n\nThe working table becomes:\n\n${afterTable}`;
    if (!casesShown && after.length === 2 && !isLast) {
      body += `\n\nOnly two complete arrangements remain.\n\n**Case 1**\n\n${fullTable(after[0]!, base)}\n\n**Case 2**\n\n${fullTable(after[1]!, base)}`;
      casesShown = true;
    }
    lines.push(`**Step ${step}**\n\n${body}`);
    pending = []; applied = nextApplied; states = after; step += 1;
  }
  lines.push(`**Step ${step}: Complete the arrangement**\n\nThe final table is:\n\n${fullTable(base.assignment, base)}`);
  return lines;
}

function rebalanceChild(child: Lp011Child, targetIndex: number, difficulty: "Easy" | "Medium" | "Hard", shared?: string[]): Lp011Child {
  const wrong = child.options.filter((option) => option !== child.answer);
  const options = [...wrong]; options.splice(targetIndex, 0, child.answer);
  return {
    ...child,
    options,
    correctIndex: targetIndex,
    difficultyBand: difficulty,
    explanation: shared ? { summary: `Fill the stack step by step. The required answer is ${child.answer}.`, lines: [...shared, `**Answer the question**\n\nFrom the completed table, the answer is **${child.answer}**.`] } : child.explanation,
  };
}

function makeHard(base: Lp011Caselet, globalIndex: number, seed: string): Lp011Caselet {
  const clues = chooseHardClues(base) ?? fallbackHardClues(base);
  const solutions = solveLp011(clues, 2);
  if (solutions.length !== 1 || !stateEquals(solutions[0]!, base.assignment)) throw new Error(`LP-011 Hard fallback failed for ${seed}:${globalIndex}`);
  const shared = hardExplanation(clues, base);
  const caseletId = `LP-011:${seed}:${globalIndex + 1}`;
  return {
    ...base,
    caseletId,
    difficultyBand: "Hard",
    clues,
    children: base.children.map((child, childIndex) => rebalanceChild({ ...child, questionId: `${caseletId}:${child.qlId}` }, (globalIndex + childIndex) % 4, "Hard", shared)),
  };
}
function normalizeBase(base: Lp011Caselet, globalIndex: number, seed: string): Lp011Caselet {
  const caseletId = `LP-011:${seed}:${globalIndex + 1}`;
  return { ...base, caseletId, children: base.children.map((child, childIndex) => rebalanceChild({ ...child, questionId: `${caseletId}:${child.qlId}` }, (globalIndex + childIndex) % 4, base.difficultyBand)) };
}

function generateEasyMedium(seed: string, cycle: number): [Lp011Caselet, Lp011Caselet] {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const batch = generateLp011Batch(`${seed}:cycle:${cycle}:attempt:${attempt}`, 2);
      if (batch[0]?.difficultyBand === "Easy" && batch[1]?.difficultyBand === "Medium") return [batch[0], batch[1]];
    } catch { /* try a deterministic alternate hidden state */ }
  }
  throw new Error(`LP-011 V1.2 could not build Easy/Medium cycle ${cycle}`);
}

export function generateLp011BatchStabilizedV1_2(seed = "lp-011-stabilized-v1-2", count = 8): Lp011Caselet[] {
  const result: Lp011Caselet[] = [];
  let cycle = 0;
  while (result.length < count) {
    const [easy, medium] = generateEasyMedium(seed, cycle);
    if (result.length < count) result.push(normalizeBase(easy, result.length, seed));
    if (result.length < count) result.push(normalizeBase(medium, result.length, seed));
    if (result.length < count) {
      const hardSource = generateEasyMedium(`${seed}:hard-source`, cycle)[0];
      result.push(makeHard(hardSource, result.length, seed));
    }
    cycle += 1;
  }
  return result;
}
