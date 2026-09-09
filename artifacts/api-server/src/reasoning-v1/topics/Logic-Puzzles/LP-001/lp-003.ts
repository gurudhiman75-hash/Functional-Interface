import type { DifficultyBand } from "./index.ts";

export type BoxId = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export const STACK_POSITIONS = [1, 2, 3, 4, 5, 6, 7] as const;
export type StackPosition = typeof STACK_POSITIONS[number];
export type StackAssignment = Record<BoxId, StackPosition>;

export type StackClue =
  | { kind: "ABOVE"; upper: BoxId; lower: BoxId; text: string }
  | { kind: "IMMEDIATELY_ABOVE"; upper: BoxId; lower: BoxId; text: string }
  | { kind: "BOXES_BETWEEN"; left: BoxId; right: BoxId; count: number; text: string }
  | { kind: "NOT_ADJACENT"; left: BoxId; right: BoxId; text: string }
  | { kind: "NOT_POSITION"; box: BoxId; position: StackPosition; text: string };

export type Lp003Profile = {
  id: string;
  scenario: string;
  boxNoun: string;
  boxLabels: Record<BoxId, string>;
  aboveTemplates: readonly string[];
  immediatelyAboveTemplates: readonly string[];
  betweenTemplates: readonly string[];
  notAdjacentTemplates: readonly string[];
  notPositionTemplates: readonly string[];
  positionQuestionTemplates: readonly string[];
  positionOfBoxQuestionTemplates: readonly string[];
  betweenQuestionTemplates: readonly string[];
  immediateQuestionTemplates: readonly string[];
};

export type Lp003Child = {
  questionId: string;
  qlId: "LP-QL-009" | "LP-QL-010" | "LP-QL-011" | "LP-QL-012";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp003Caselet = {
  caseletId: string;
  scenario: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  boxes: readonly BoxId[];
  positions: readonly StackPosition[];
  boxLabels: Record<BoxId, string>;
  clues: readonly StackClue[];
  assignment: StackAssignment;
  children: readonly Lp003Child[];
};

const BOXES: readonly BoxId[] = ["A", "B", "C", "D", "E", "F", "G"];

const PROFILES: readonly Lp003Profile[] = [
  {
    id: "RELIEF_SUPPLIES",
    scenario: "A relief centre is stacking seven labelled cartons one above another in a storage room. Each carton contains a different kind of supply.",
    boxNoun: "carton",
    boxLabels: { A: "first-aid kits", B: "blankets", C: "water bottles", D: "solar lamps", E: "ration packets", F: "sanitation kits", G: "tarpaulins" },
    aboveTemplates: ["The carton containing {upper} is kept above the carton containing {lower}.", "The carton containing {upper} is higher in the stack than the carton containing {lower}."],
    immediatelyAboveTemplates: ["The carton containing {upper} is immediately above the carton containing {lower}.", "The carton containing {upper} is kept directly above the carton containing {lower}."],
    betweenTemplates: ["Exactly {count} cartons are kept between the {left} carton and the {right} carton.", "There are {count} cartons between the cartons containing {left} and {right}."],
    notAdjacentTemplates: ["The {left} carton and the {right} carton are not next to each other.", "The cartons containing {left} and {right} are not adjacent in the stack."],
    notPositionTemplates: ["The carton containing {box} is not in the {position} position from the bottom.", "The carton containing {box} is not kept in the {position} position, counting upward from the bottom."],
    positionQuestionTemplates: ["Which carton is kept at the {position} position from the bottom?", "What is stored in the {position} position of the stack, counting from the bottom?"],
    positionOfBoxQuestionTemplates: ["At which position from the bottom is the carton containing {box} kept?", "How high in the stack is the {box} carton, counting from the bottom?"],
    betweenQuestionTemplates: ["How many cartons are kept between the {left} carton and the {right} carton?", "How many cartons lie between the cartons containing {left} and {right}?"],
    immediateQuestionTemplates: ["Which carton is immediately above the {box} carton?", "Which carton is kept directly above the carton containing {box}?"],
  },
  {
    id: "SCHOOL_ARCHIVE",
    scenario: "A school librarian is stacking seven labelled archive boxes one above another before moving them to a storeroom. Each box contains a different set of records.",
    boxNoun: "archive box",
    boxLabels: { A: "mathematics papers", B: "science projects", C: "history files", D: "attendance registers", E: "maps", F: "exam answer sheets", G: "sports records" },
    aboveTemplates: ["The archive box containing {upper} is above the archive box containing {lower}.", "The archive box containing {upper} is higher than the one containing {lower}."],
    immediatelyAboveTemplates: ["The archive box containing {upper} is immediately above the archive box containing {lower}.", "The archive box containing {upper} is directly above the one containing {lower}."],
    betweenTemplates: ["There are exactly {count} archive boxes between {left} and {right}.", "Exactly {count} archive boxes separate the boxes containing {left} and {right}."],
    notAdjacentTemplates: ["The archive boxes containing {left} and {right} are not adjacent.", "The {left} box is not kept next to the {right} box."],
    notPositionTemplates: ["The archive box containing {box} is not in the {position} position from the bottom.", "The archive box containing {box} is not in the {position} position, counting upward from the bottom."],
    positionQuestionTemplates: ["Which archive box is in the {position} position from the bottom?", "Which records are kept at the {position} position, counting from the bottom?"],
    positionOfBoxQuestionTemplates: ["At which position from the bottom is the {box} archive box kept?", "Where is the archive box containing {box}, counting upward from the bottom?"],
    betweenQuestionTemplates: ["How many archive boxes are between the {left} box and the {right} box?", "How many boxes separate the records containing {left} and {right}?"],
    immediateQuestionTemplates: ["Which archive box is immediately above the {box} box?", "Which records are kept directly above the {box} archive box?"],
  },
  {
    id: "BANK_RECORDS",
    scenario: "A bank branch is arranging seven sealed record boxes in a vertical storage rack. Each box contains a different type of branch record.",
    boxNoun: "record box",
    boxLabels: { A: "loan files", B: "cash vouchers", C: "KYC forms", D: "audit registers", E: "cheque books", F: "locker records", G: "complaint files" },
    aboveTemplates: ["The record box containing {upper} is above the record box containing {lower}.", "The record box containing {upper} is higher in the rack than the one containing {lower}."],
    immediatelyAboveTemplates: ["The record box containing {upper} is immediately above the record box containing {lower}.", "The record box containing {upper} is directly above the one containing {lower}."],
    betweenTemplates: ["Exactly {count} record boxes are kept between {left} and {right}.", "There are {count} record boxes between the boxes containing {left} and {right}."],
    notAdjacentTemplates: ["The record boxes containing {left} and {right} are not next to each other.", "The {left} record box is not adjacent to the {right} record box."],
    notPositionTemplates: ["The record box containing {box} is not in the {position} position from the bottom.", "The record box containing {box} is not kept in the {position} position, counting from the bottom."],
    positionQuestionTemplates: ["Which record box is kept at the {position} position from the bottom?", "Which records occupy the {position} position in the rack, counting from the bottom?"],
    positionOfBoxQuestionTemplates: ["At which position from the bottom is the {box} record box kept?", "Where is the record box containing {box} in the rack?"],
    betweenQuestionTemplates: ["How many record boxes are between the {left} box and the {right} box?", "How many boxes lie between the boxes containing {left} and {right}?"],
    immediateQuestionTemplates: ["Which record box is immediately above the {box} box?", "Which record box is directly above the box containing {box}?"],
  },
  {
    id: "RAILWAY_SPARES",
    scenario: "A railway depot is stacking seven labelled crates one above another in its parts room. Each crate contains a different maintenance item.",
    boxNoun: "crate",
    boxLabels: { A: "brake shoes", B: "signal lamps", C: "coupling pins", D: "track tools", E: "first-aid stock", F: "cable reels", G: "warning flags" },
    aboveTemplates: ["The crate containing {upper} is above the crate containing {lower}.", "The {upper} crate is higher in the stack than the {lower} crate."],
    immediatelyAboveTemplates: ["The crate containing {upper} is immediately above the crate containing {lower}.", "The crate of {upper} is directly above the crate of {lower}."],
    betweenTemplates: ["Exactly {count} crates are kept between the {left} crate and the {right} crate.", "There are {count} crates between the crates of {left} and {right}."],
    notAdjacentTemplates: ["The {left} crate and the {right} crate are not adjacent.", "The crates of {left} and {right} are not kept next to each other."],
    notPositionTemplates: ["The crate containing {box} is not in the {position} position from the bottom.", "The crate containing {box} is not in the {position} position, counting upward from the bottom."],
    positionQuestionTemplates: ["Which crate is kept at the {position} position from the bottom?", "Which maintenance item is at the {position} position, counting from the bottom?"],
    positionOfBoxQuestionTemplates: ["At which position from the bottom is the {box} crate kept?", "Where is the crate of {box} in the stack?"],
    betweenQuestionTemplates: ["How many crates are kept between the {left} crate and the {right} crate?", "How many crates lie between the crates of {left} and {right}?"],
    immediateQuestionTemplates: ["Which crate is immediately above the {box} crate?", "Which maintenance item is directly above the {box} crate?"],
  },
  {
    id: "ELECTION_MATERIAL",
    scenario: "A district election office is stacking seven sealed boxes one above another for dispatch. Each box contains a different kind of election material.",
    boxNoun: "sealed box",
    boxLabels: { A: "ballot-unit seals", B: "ink bottles", C: "training manuals", D: "voter slips", E: "stationery kits", F: "control-unit forms", G: "route maps" },
    aboveTemplates: ["The sealed box containing {upper} is above the sealed box containing {lower}.", "The box containing {upper} is higher than the box containing {lower}."],
    immediatelyAboveTemplates: ["The sealed box containing {upper} is immediately above the sealed box containing {lower}.", "The box containing {upper} is directly above the box containing {lower}."],
    betweenTemplates: ["There are exactly {count} sealed boxes between {left} and {right}.", "Exactly {count} sealed boxes separate the boxes containing {left} and {right}."],
    notAdjacentTemplates: ["The boxes containing {left} and {right} are not adjacent.", "The {left} box is not kept next to the {right} box."],
    notPositionTemplates: ["The box containing {box} is not in the {position} position from the bottom.", "The sealed box containing {box} is not kept in the {position} position, counting upward from the bottom."],
    positionQuestionTemplates: ["Which sealed box is in the {position} position from the bottom?", "Which election material is kept at the {position} position, counting from the bottom?"],
    positionOfBoxQuestionTemplates: ["At which position from the bottom is the box containing {box} kept?", "Where is the {box} box in the stack?"],
    betweenQuestionTemplates: ["How many sealed boxes are between the {left} box and the {right} box?", "How many boxes separate the boxes containing {left} and {right}?"],
    immediateQuestionTemplates: ["Which sealed box is immediately above the {box} box?", "Which material is kept directly above the box containing {box}?"],
  },
  {
    id: "HEALTH_CAMP_STOCK",
    scenario: "A health camp store is stacking seven supply boxes one above another before the camp opens. Each box contains a different medical item.",
    boxNoun: "supply box",
    boxLabels: { A: "ORS packets", B: "vaccines", C: "gloves", D: "masks", E: "test strips", F: "syringes", G: "registers" },
    aboveTemplates: ["The supply box containing {upper} is above the supply box containing {lower}.", "The box containing {upper} is higher in the stack than the box containing {lower}."],
    immediatelyAboveTemplates: ["The supply box containing {upper} is immediately above the supply box containing {lower}.", "The box containing {upper} is directly above the box containing {lower}."],
    betweenTemplates: ["Exactly {count} supply boxes are kept between {left} and {right}.", "There are {count} supply boxes between the boxes containing {left} and {right}."],
    notAdjacentTemplates: ["The supply boxes containing {left} and {right} are not adjacent.", "The {left} box is not kept next to the {right} box."],
    notPositionTemplates: ["The box containing {box} is not in the {position} position from the bottom.", "The supply box containing {box} is not in the {position} position, counting upward from the bottom."],
    positionQuestionTemplates: ["Which supply box is kept at the {position} position from the bottom?", "Which medical item is at the {position} position, counting from the bottom?"],
    positionOfBoxQuestionTemplates: ["At which position from the bottom is the {box} box kept?", "Where is the supply box containing {box} in the stack?"],
    betweenQuestionTemplates: ["How many supply boxes are kept between the {left} box and the {right} box?", "How many boxes lie between the boxes containing {left} and {right}?"],
    immediateQuestionTemplates: ["Which supply box is immediately above the {box} box?", "Which medical item is directly above the {box} box?"],
  },
];

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let index = result.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [result[index], result[swap]] = [result[swap], result[index]]; } return result; }
function permutations<T>(items: readonly T[]): T[][] { if (items.length <= 1) return [Array.from(items)]; const result: T[][] = []; items.forEach((item, index) => { const rest = [...items.slice(0, index), ...items.slice(index + 1)]; for (const tail of permutations(rest)) result.push([item, ...tail]); }); return result; }
function fill(template: string, values: Record<string, string>): string { return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key); }
function ordinal(position: StackPosition): string { if (position === 1) return "1st"; if (position === 2) return "2nd"; if (position === 3) return "3rd"; return `${position}th`; }
function stackIndex(assignment: StackAssignment, box: BoxId): StackPosition { return assignment[box]!; }
function pluralBoxNoun(profile: Lp003Profile): string { return profile.boxNoun.endsWith("box") ? `${profile.boxNoun}es` : `${profile.boxNoun}s`; }
function countedText(text: string, profile: Lp003Profile, count: number): string {
  if (count !== 1) return text;
  const plural = pluralBoxNoun(profile);
  return text
    .replaceAll(`There are exactly 1 ${plural}`, `There is exactly 1 ${profile.boxNoun}`)
    .replaceAll(`There are 1 ${plural}`, `There is 1 ${profile.boxNoun}`)
    .replaceAll(`Exactly 1 ${plural} are kept`, `Exactly 1 ${profile.boxNoun} is kept`)
    .replaceAll(`Exactly 1 ${plural} separate`, `Exactly 1 ${profile.boxNoun} separates`);
}

function enumerateAssignments(boxes: readonly BoxId[]): StackAssignment[] {
  return permutations(STACK_POSITIONS).map((positionOrder) => {
    const assignment: StackAssignment = {} as StackAssignment;
    boxes.forEach((box, index) => { assignment[box] = positionOrder[index]!; });
    return assignment;
  });
}

function satisfies(assignment: StackAssignment, clue: StackClue): boolean {
  if (clue.kind === "ABOVE") return stackIndex(assignment, clue.upper) > stackIndex(assignment, clue.lower);
  if (clue.kind === "IMMEDIATELY_ABOVE") return stackIndex(assignment, clue.upper) === stackIndex(assignment, clue.lower) + 1;
  if (clue.kind === "BOXES_BETWEEN") return Math.abs(stackIndex(assignment, clue.left) - stackIndex(assignment, clue.right)) - 1 === clue.count;
  if (clue.kind === "NOT_ADJACENT") return Math.abs(stackIndex(assignment, clue.left) - stackIndex(assignment, clue.right)) !== 1;
  return stackIndex(assignment, clue.box) !== clue.position;
}

function clueKey(clue: StackClue): string {
  if (clue.kind === "ABOVE" || clue.kind === "IMMEDIATELY_ABOVE") return `${clue.kind}:${clue.upper}:${clue.lower}`;
  if (clue.kind === "NOT_POSITION") return `${clue.kind}:${clue.box}:${clue.position}`;
  const [left, right] = [clue.left, clue.right].sort();
  return `${clue.kind}:${left}:${right}${clue.kind === "BOXES_BETWEEN" ? `:${clue.count}` : ""}`;
}

function buildCandidates(boxes: readonly BoxId[], hidden: StackAssignment, profile: Lp003Profile, random: () => number): StackClue[] {
  const result: StackClue[] = [];
  const template = <T extends readonly string[]>(templates: T) => templates[Math.floor(random() * templates.length)]!;
  for (let left = 0; left < boxes.length; left += 1) for (let right = left + 1; right < boxes.length; right += 1) {
    const first = boxes[left]!; const second = boxes[right]!;
    const upper = stackIndex(hidden, first) > stackIndex(hidden, second) ? first : second;
    const lower = upper === first ? second : first;
    result.push({ kind: "ABOVE", upper, lower, text: fill(template(profile.aboveTemplates), { upper: profile.boxLabels[upper], lower: profile.boxLabels[lower] }) });
    if (stackIndex(hidden, upper) === stackIndex(hidden, lower) + 1) result.push({ kind: "IMMEDIATELY_ABOVE", upper, lower, text: fill(template(profile.immediatelyAboveTemplates), { upper: profile.boxLabels[upper], lower: profile.boxLabels[lower] }) });
    const count = Math.abs(stackIndex(hidden, first) - stackIndex(hidden, second)) - 1;
    if (count >= 1) result.push({ kind: "BOXES_BETWEEN", left: first, right: second, count, text: countedText(fill(template(profile.betweenTemplates), { left: profile.boxLabels[first], right: profile.boxLabels[second], count: String(count) }), profile, count) });
    if (count >= 1) result.push({ kind: "NOT_ADJACENT", left: first, right: second, text: fill(template(profile.notAdjacentTemplates), { left: profile.boxLabels[first], right: profile.boxLabels[second] }) });
  }
  for (const box of boxes) for (const position of STACK_POSITIONS) if (stackIndex(hidden, box) !== position) {
    result.push({ kind: "NOT_POSITION", box, position, text: fill(template(profile.notPositionTemplates), { box: profile.boxLabels[box], position: ordinal(position) }) });
  }
  return result;
}

function best(survivors: StackAssignment[], candidates: StackClue[], chosen: StackClue[], kind?: StackClue["kind"]): StackClue | undefined {
  return candidates.filter((candidate) => (!kind || candidate.kind === kind) && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
    .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
    .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
    .sort((left, right) => left.remaining - right.remaining)[0]?.candidate;
}

function cluesAreEssential(all: readonly StackAssignment[], clues: readonly StackClue[]): boolean {
  return clues.every((_, removed) => all.filter((state) => clues.every((clue, index) => index === removed || satisfies(state, clue))).length > 1);
}

function chooseClues(boxes: readonly BoxId[], hidden: StackAssignment, profile: Lp003Profile, difficultyBand: DifficultyBand, random: () => number): StackClue[] {
  const all = enumerateAssignments(boxes); const candidates = buildCandidates(boxes, hidden, profile, random);
  const quotas: Array<readonly StackClue["kind"][]> = difficultyBand === "Hard"
    ? [["ABOVE", "IMMEDIATELY_ABOVE", "BOXES_BETWEEN", "NOT_ADJACENT", "NOT_POSITION"], ["BOXES_BETWEEN", "ABOVE", "NOT_POSITION", "IMMEDIATELY_ABOVE"], ["NOT_POSITION", "ABOVE", "NOT_ADJACENT", "BOXES_BETWEEN"]]
    : [["ABOVE", "BOXES_BETWEEN", "NOT_POSITION"], ["BOXES_BETWEEN", "NOT_POSITION", "ABOVE"], ["NOT_POSITION", "ABOVE", "NOT_ADJACENT"]];
  for (const quota of shuffle(quotas, random)) {
    let survivors = all; const chosen: StackClue[] = [];
    for (const kind of quota) { const selected = best(survivors, candidates, chosen, kind); if (!selected) { chosen.length = 0; break; } chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected)); }
    while (chosen.length < (difficultyBand === "Hard" ? 7 : 5) && survivors.length > 1) { const selected = best(survivors, candidates, chosen); if (!selected) break; chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected)); }
    if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(hidden) && cluesAreEssential(all, chosen)) return chosen;
  }
  throw new Error("Unable to build essential unique LP-003 stack clue set.");
}

function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] {
  const remaining = shuffle(options.filter((option) => option !== answer), random); const result: string[] = [];
  for (let index = 0; index < 4; index += 1) result[index] = index === desired ? answer : remaining.shift()!;
  return result;
}

function pairList(boxes: readonly BoxId[]): Array<[BoxId, BoxId]> { const pairs: Array<[BoxId, BoxId]> = []; for (let left = 0; left < boxes.length; left += 1) for (let right = left + 1; right < boxes.length; right += 1) pairs.push([boxes[left]!, boxes[right]!]); return pairs; }
function boxAtPosition(assignment: StackAssignment, boxes: readonly BoxId[], position: StackPosition): BoxId { return boxes.find((box) => assignment[box] === position)!; }

function makeChildren(caseletId: string, index: number, boxes: readonly BoxId[], assignment: StackAssignment, profile: Lp003Profile, difficultyBand: DifficultyBand, clues: readonly StackClue[], random: () => number): Lp003Child[] {
  const stack = [...boxes].sort((left, right) => assignment[left]! - assignment[right]!);
  const targetPosition = STACK_POSITIONS[(index + 2) % STACK_POSITIONS.length]!;
  const targetBox = boxAtPosition(assignment, boxes, targetPosition);
  const targetLabel = profile.boxLabels[targetBox];
  const positionAnswer = ordinal(targetPosition);
  const boxOptions = balance([targetLabel, ...shuffle(boxes.filter((box) => box !== targetBox), random).slice(0, 3).map((box) => profile.boxLabels[box])], targetLabel, index % 4, random);
  const stackPositionOptions = balance([ordinal(assignment[targetBox]!), ...shuffle(STACK_POSITIONS.filter((position) => position !== assignment[targetBox]!), random).slice(0, 3).map(ordinal)], positionAnswer, (index + 1) % 4, random);
  const betweenPair = shuffle(pairList(boxes).filter(([left, right]) => Math.abs(assignment[left]! - assignment[right]!) >= 2), random)[0]!;
  const betweenAnswer = String(Math.abs(assignment[betweenPair[0]!] - assignment[betweenPair[1]!]) - 1);
  const betweenOptions = balance([betweenAnswer, ...shuffle(["0", "1", "2", "3", "4", "5"].filter((value) => value !== betweenAnswer), random).slice(0, 3)], betweenAnswer, (index + 2) % 4, random);
  const immediateTarget = shuffle(boxes.filter((box) => assignment[box]! < 7), random)[0]!;
  const immediateAnswerBox = boxAtPosition(assignment, boxes, (assignment[immediateTarget]! + 1) as StackPosition);
  const immediateAnswer = profile.boxLabels[immediateAnswerBox];
  const immediateOptions = balance([immediateAnswer, ...shuffle(boxes.filter((box) => box !== immediateAnswerBox), random).slice(0, 3).map((box) => profile.boxLabels[box])], immediateAnswer, (index + 3) % 4, random);
  const table = `| Position from bottom | ${profile.boxNoun} |\n|---:|---|\n${stack.map((box, stackIndexValue) => `| ${stackIndexValue + 1} | ${profile.boxLabels[box]} |`).join("\n")}`;
  const clueLead = clues.slice(0, Math.min(3, clues.length)).map((clue, clueIndex) => { const text = clue.text.replace(/[.]$/u, ""); return clueIndex === 0 ? text : text.replace(/^The\b/u, "the"); }).join("; then ");
  const leads = [`Begin with these deductions: ${clueLead}.`, `The key clues are ${clueLead}.`, `Apply the clues in sequence: ${clueLead}.`, `Once these clues are combined—${clueLead}—the remaining stack is forced.`];
  const evidence = difficultyBand === "Hard" ? `${leads[index % 4]} Every position is occupied by exactly one box.\n\n${table}` : `The clues leave one complete stack. The table records every position from the bottom.\n\n${table}`;
  const explain = (summary: string, finalStep: string) => ({ summary, lines: [evidence, finalStep] });
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-009", stem: fill(profile.positionQuestionTemplates[index % profile.positionQuestionTemplates.length]!, { position: ordinal(targetPosition) }), options: boxOptions, correctIndex: boxOptions.indexOf(targetLabel), answer: targetLabel, difficultyBand, misconceptionFamily: "STACK_POSITION_REVERSED", explanation: explain(`${targetLabel} is kept at the ${positionAnswer} position from the bottom.`, `Reading the ${positionAnswer} row of the completed stack gives ${targetLabel}.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-010", stem: fill(profile.positionOfBoxQuestionTemplates[(index + 1) % profile.positionOfBoxQuestionTemplates.length]!, { box: targetLabel }), options: stackPositionOptions, correctIndex: stackPositionOptions.indexOf(positionAnswer), answer: positionAnswer, difficultyBand, misconceptionFamily: "BOTTOM_TOP_COUNTING_ERROR", explanation: explain(`The ${targetLabel} box is in position ${positionAnswer} from the bottom.`, `The row for ${targetLabel} is numbered ${positionAnswer} when the stack is counted upward from the bottom.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-011", stem: fill(profile.betweenQuestionTemplates[index % profile.betweenQuestionTemplates.length]!, { left: profile.boxLabels[betweenPair[0]!], right: profile.boxLabels[betweenPair[1]!] }), options: betweenOptions, correctIndex: betweenOptions.indexOf(betweenAnswer), answer: betweenAnswer, difficultyBand, misconceptionFamily: "BETWEEN_COUNT_OFF_BY_ONE", explanation: explain(`${betweenAnswer} boxes are kept between the two named boxes.`, `Their positions are ${assignment[betweenPair[0]!] } and ${assignment[betweenPair[1]!]}; subtracting the endpoints leaves ${betweenAnswer} box${betweenAnswer === "1" ? "" : "es"} between them.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-012", stem: fill(profile.immediateQuestionTemplates[index % profile.immediateQuestionTemplates.length]!, { box: profile.boxLabels[immediateTarget] }), options: immediateOptions, correctIndex: immediateOptions.indexOf(immediateAnswer), answer: immediateAnswer, difficultyBand, misconceptionFamily: "IMMEDIATE_ABOVE_CONFUSION", explanation: explain(`${immediateAnswer} is immediately above the ${profile.boxLabels[immediateTarget]} box.`, `The next row above the ${profile.boxLabels[immediateTarget]} row contains ${immediateAnswer}.`) },
  ];
}

export function solveLp003(caselet: Pick<Lp003Caselet, "boxes" | "clues">): StackAssignment[] { return enumerateAssignments(caselet.boxes).filter((assignment) => caselet.clues.every((clue) => satisfies(assignment, clue))); }

export function generateLp003Caselet(seed = "lp-003-review", index = 0): Lp003Caselet {
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const random = rng(`${seed}:${index}:${attempt}`); const profile = PROFILES[Math.floor(random() * PROFILES.length)]!; const boxes = shuffle(BOXES, random); const stack = shuffle(boxes, random); const assignment: StackAssignment = {} as StackAssignment;
    boxes.forEach((box) => { assignment[box] = (stack.indexOf(box) + 1) as StackPosition; });
    const difficultyBand: DifficultyBand = index % 2 === 0 ? "Hard" : "Medium";
    try { const clues = chooseClues(boxes, assignment, profile, difficultyBand, random); const caseletId = `LP-003-${String(index + 1).padStart(3, "0")}`; return { caseletId, scenario: profile.scenario, scenarioProfileId: profile.id, difficultyBand, boxes, positions: STACK_POSITIONS, boxLabels: profile.boxLabels, clues, assignment, children: makeChildren(caseletId, index, boxes, assignment, profile, difficultyBand, clues, random) }; } catch { /* deterministic retry */ }
  }
  throw new Error(`Unable to generate LP-003 caselet for seed ${seed}.`);
}

export function generateLp003Batch(seed = "lp-003-review", count = 8): Lp003Caselet[] { return Array.from({ length: count }, (_, index) => generateLp003Caselet(seed, index)); }

export const LP_003_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-003", label: "Logic Puzzles — Box and Stack Arrangement", checkpointId: "LP-CP-003", qlIds: ["LP-QL-009", "LP-QL-010", "LP-QL-011", "LP-QL-012"], supportedDifficulties: ["Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
