import assert from "node:assert/strict";
import { generateCaseletBatch, type Caselet } from "./index.ts";
import { generateLp002Batch, type Lp002Caselet } from "./lp-002.ts";
import { generateLp003Batch, type Lp003Caselet } from "./lp-003.ts";
import { generateLp004Batch, type Lp004Caselet } from "./lp-004.ts";
import { generateLp005Batch, type Lp005Caselet } from "./lp-005.ts";
import { generateLp006Batch, type Lp006Caselet } from "./lp-006.ts";
import { generateLp007Batch, type Lp007Caselet } from "./lp-007.ts";
import { generateLp008Batch, type Lp008Caselet, type SlotId } from "./lp-008.ts";
import {
  generateLp001BatchStabilizedV2,
  generateLp002BatchStabilizedV2,
  generateLp003BatchStabilizedV2,
  generateLp004BatchStabilizedV2,
  generateLp005BatchStabilizedV2,
  generateLp006BatchStabilizedV2,
  generateLp007BatchStabilizedV2,
  generateLp008BatchStabilizedV2,
} from "./lp-001-008-stabilized-english-v2.ts";

type Child = {
  qlId: string;
  questionId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: string;
  explanation: unknown;
};

type GenericCaselet = {
  caseletId: string;
  children: readonly Child[];
  [key: string]: unknown;
};

type Generator = (seed: string, count: number) => GenericCaselet[];

const generators: readonly [string, Generator, Generator][] = [
  ["LP-001", generateCaseletBatch as Generator, generateLp001BatchStabilizedV2 as Generator],
  ["LP-002", generateLp002Batch as Generator, generateLp002BatchStabilizedV2 as Generator],
  ["LP-003", generateLp003Batch as Generator, generateLp003BatchStabilizedV2 as Generator],
  ["LP-004", generateLp004Batch as Generator, generateLp004BatchStabilizedV2 as Generator],
  ["LP-005", generateLp005Batch as Generator, generateLp005BatchStabilizedV2 as Generator],
  ["LP-006", generateLp006Batch as Generator, generateLp006BatchStabilizedV2 as Generator],
  ["LP-007", generateLp007Batch as Generator, generateLp007BatchStabilizedV2 as Generator],
  ["LP-008", generateLp008Batch as Generator, generateLp008BatchStabilizedV2 as Generator],
];

function pairs<T>(items: readonly T[]): Array<[T, T]> {
  const result: Array<[T, T]> = [];
  for (let left = 0; left < items.length; left += 1) {
    for (let right = left + 1; right < items.length; right += 1) result.push([items[left]!, items[right]!]);
  }
  return result;
}

function pairLabel(pair: readonly [string, string]): string {
  return `${pair[0]} and ${pair[1]}`;
}

function stripReviewOnly(caselet: GenericCaselet) {
  const { children, ...rest } = caselet;
  return {
    ...rest,
    children: children.map(({ options: _options, explanation: _explanation, ...child }) => child),
  };
}

function lp001CorrectOptions(caselet: Caselet, child: Child): Set<string> | undefined {
  const allPairs = pairs(caselet.people);
  if (child.qlId === "LP-QL-002") {
    return new Set(allPairs.filter(([left, right]) => caselet.assignment[left] === caselet.assignment[right]).map(pairLabel));
  }
  if (child.qlId === "LP-QL-004") {
    return new Set(allPairs.filter(([left, right]) => caselet.assignment[left] !== caselet.assignment[right]).map(pairLabel));
  }
  return undefined;
}

function lp002CorrectOptions(caselet: Lp002Caselet, child: Child): Set<string> | undefined {
  if (child.qlId !== "LP-QL-008") return undefined;
  return new Set(caselet.people.map((person) => `${person} — ${caselet.assignment.dayByPerson[person]} — ${caselet.locationLabels[caselet.assignment.locationByPerson[person]!]}`));
}

function lp004CorrectOptions(caselet: Lp004Caselet, child: Child): Set<string> | undefined {
  const selected = caselet.candidates.filter((candidate) => caselet.assignment[candidate]);
  const unselected = caselet.candidates.filter((candidate) => !caselet.assignment[candidate]);
  const namePair = (pair: readonly [typeof caselet.candidates[number], typeof caselet.candidates[number]]) => `${caselet.candidateLabels[pair[0]]}, ${caselet.candidateLabels[pair[1]]}`;
  if (child.qlId === "LP-QL-013") return new Set(pairs(selected).map(namePair));
  if (child.qlId === "LP-QL-014") return new Set(selected.flatMap((first) => unselected.map((second) => `${caselet.candidateLabels[first]}, ${caselet.candidateLabels[second]}`)));
  return undefined;
}

function parseAssignments(option: string): Array<[string, string]> {
  return option.split("; ").map((piece) => {
    const parts = piece.split(" — ");
    return [parts[0] ?? "", parts.slice(1).join(" — ")] as [string, string];
  });
}

function lp007OptionIsTrue(caselet: Lp007Caselet, option: string): boolean {
  const personByLabel = new Map(caselet.people.map((person) => [caselet.labels.people[person], person] as const));
  for (const [personLabel, valueLabel] of parseAssignments(option)) {
    const person = personByLabel.get(personLabel);
    if (!person || caselet.labels.values[caselet.assignment[person]] !== valueLabel) return false;
  }
  return true;
}

function lp008Slot(caselet: Lp008Caselet, slot: SlotId): string {
  const month = caselet.labels.months[Math.floor(slot / 2) as 0 | 1 | 2 | 3];
  return `${slot % 2 === 0 ? "12th" : "27th"} ${month}`;
}

function lp008OptionIsTrue(caselet: Lp008Caselet, option: string): boolean {
  const personByLabel = new Map(caselet.people.map((person) => [caselet.labels.people[person], person] as const));
  for (const [personLabel, slotLabel] of parseAssignments(option)) {
    const person = personByLabel.get(personLabel);
    if (!person || lp008Slot(caselet, caselet.assignment[person]) !== slotLabel) return false;
  }
  return true;
}

function semanticCorrectCount(packageId: string, caselet: GenericCaselet, child: Child): number {
  let correctSet: Set<string> | undefined;
  if (packageId === "LP-001") correctSet = lp001CorrectOptions(caselet as Caselet, child);
  if (packageId === "LP-002") correctSet = lp002CorrectOptions(caselet as Lp002Caselet, child);
  if (packageId === "LP-004") correctSet = lp004CorrectOptions(caselet as Lp004Caselet, child);
  if (correctSet) return child.options.filter((option) => correctSet!.has(option)).length;

  if (packageId === "LP-007" && (child.qlId === "LP-QL-027" || child.qlId === "LP-QL-028")) {
    return child.options.filter((option) => lp007OptionIsTrue(caselet as Lp007Caselet, option)).length;
  }
  if (packageId === "LP-008" && (child.qlId === "LP-QL-031" || child.qlId === "LP-QL-032")) {
    return child.options.filter((option) => lp008OptionIsTrue(caselet as Lp008Caselet, option)).length;
  }

  return child.options.filter((option) => option === child.answer).length;
}

const balance = new Map<string, number[]>(Array.from({ length: 32 }, (_, index) => [`LP-QL-${String(index + 1).padStart(3, "0")}`, [0, 0, 0, 0]]));
let totalQuestions = 0;

for (const [packageId, baseGenerator, stabilizedGenerator] of generators) {
  const seed = `option-integrity-v2:${packageId}`;
  const base = baseGenerator(seed, 100);
  const stabilized = stabilizedGenerator(seed, 100);
  assert.equal(stabilized.length, base.length, `${packageId} caselet count changed`);

  for (let index = 0; index < stabilized.length; index += 1) {
    const source = base[index]!;
    const revised = stabilized[index]!;
    assert.deepEqual(stripReviewOnly(revised), stripReviewOnly(source), `${packageId} changed puzzle semantics, stems, answers or correctIndex in ${revised.caseletId}`);

    for (const child of revised.children) {
      totalQuestions += 1;
      assert.equal(child.options.length, 4, `${child.questionId} does not have four options`);
      assert.equal(new Set(child.options).size, 4, `${child.questionId} contains duplicate options`);
      assert.equal(child.options[child.correctIndex], child.answer, `${child.questionId} correctIndex does not point to answer`);
      assert.equal(semanticCorrectCount(packageId, revised, child), 1, `${child.questionId} has more or fewer than one semantically correct option`);
      const slots = balance.get(child.qlId);
      assert.ok(slots, `Unexpected QL ${child.qlId}`);
      slots![child.correctIndex] += 1;

      if (child.qlId === "LP-QL-020" || child.qlId === "LP-QL-024") {
        const target = child.answer.split(" — ")[0]!;
        assert.ok(child.options.every((option) => option.startsWith(`${target} — `)), `${child.questionId} has giveaway distractors that change the named target`);
      }
    }
  }

  console.log(`${packageId}: 100 caselets passed option-integrity V2.`);
}

for (const [qlId, counts] of balance) {
  assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-position balance regressed: ${counts.join("/")}`);
}

assert.equal(totalQuestions, 3200);
console.log("LP-001–LP-008 option-integrity V2 passed: 800 caselets / 3,200 questions, exactly one semantic answer per MCQ, unique options, no target-name giveaways in QL-020/024, and exact 25/25/25/25 answer balance per QL.");
