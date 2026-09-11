import assert from "node:assert/strict";
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
import {
  LP_001_008_STABILIZED_ENGLISH_V4,
  generateLp001BatchStabilizedV4,
  generateLp002BatchStabilizedV4,
  generateLp003BatchStabilizedV4,
  generateLp004BatchStabilizedV4,
  generateLp005BatchStabilizedV4,
  generateLp006BatchStabilizedV4,
  generateLp007BatchStabilizedV4,
  generateLp008BatchStabilizedV4,
} from "./lp-001-008-stabilized-english-v4.ts";

type AnyChild = {
  stem: string;
  qlId: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: string;
  explanation: { summary: string; lines: string[] };
};

type AnyCaselet = {
  caseletId: string;
  scenario: string;
  clues: readonly { text: string; [key: string]: unknown }[];
  children: readonly AnyChild[];
  [key: string]: unknown;
};

type Generator = (seed: string, count: number) => AnyCaselet[];

const packages: readonly [string, Generator, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV2 as Generator, generateLp001BatchStabilizedV4 as Generator],
  ["LP-002", generateLp002BatchStabilizedV2 as Generator, generateLp002BatchStabilizedV4 as Generator],
  ["LP-003", generateLp003BatchStabilizedV2 as Generator, generateLp003BatchStabilizedV4 as Generator],
  ["LP-004", generateLp004BatchStabilizedV2 as Generator, generateLp004BatchStabilizedV4 as Generator],
  ["LP-005", generateLp005BatchStabilizedV2 as Generator, generateLp005BatchStabilizedV4 as Generator],
  ["LP-006", generateLp006BatchStabilizedV2 as Generator, generateLp006BatchStabilizedV4 as Generator],
  ["LP-007", generateLp007BatchStabilizedV2 as Generator, generateLp007BatchStabilizedV4 as Generator],
  ["LP-008", generateLp008BatchStabilizedV2 as Generator, generateLp008BatchStabilizedV4 as Generator],
];

function withoutEditorial(caselet: AnyCaselet) {
  const { scenario: _scenario, children, ...rest } = caselet;
  return {
    ...rest,
    children: children.map(({ explanation: _explanation, ...child }) => child),
  };
}

function assertVisible(text: string, values: readonly string[], label: string) {
  for (const value of values) assert.ok(text.includes(value), `${label}: setup omits ${value}`);
}

function assertCompleteDomains(packageId: string, caselet: AnyCaselet) {
  const c = caselet as any;
  if (packageId === "LP-001") {
    assertVisible(c.scenario, c.people, packageId);
    assertVisible(c.scenario, c.groups.map((group: string) => c.groupLabels[group]), packageId);
  } else if (packageId === "LP-002") {
    assertVisible(c.scenario, c.people, packageId);
    assertVisible(c.scenario, c.days, packageId);
    assertVisible(c.scenario, c.locations.map((location: string) => c.locationLabels[location]), packageId);
  } else if (packageId === "LP-003") {
    assertVisible(c.scenario, c.boxes.map((box: string) => c.boxLabels[box]), packageId);
    assertVisible(c.scenario, c.positions.map(String), packageId);
  } else if (packageId === "LP-004") {
    assertVisible(c.scenario, c.candidates.map((candidate: string) => c.candidateLabels[candidate]), packageId);
    assert.ok(c.scenario.includes(String(c.committeeSize)), `${packageId}: setup omits selection size`);
  } else if (packageId === "LP-005") {
    assertVisible(c.scenario, c.people.map((person: string) => c.labels.people[person]), packageId);
    assertVisible(c.scenario, c.duties.map((duty: string) => c.labels.duties[duty]), packageId);
    assertVisible(c.scenario, c.places.map((place: string) => c.labels.places[place]), packageId);
  } else if (packageId === "LP-006") {
    assertVisible(c.scenario, c.people.map((person: string) => c.labels.people[person]), packageId);
    assertVisible(c.scenario, c.days, packageId);
    assertVisible(c.scenario, c.subjects.map((subject: string) => c.labels.subjects[subject]), packageId);
    assertVisible(c.scenario, c.cities.map((city: string) => c.labels.cities[city]), packageId);
  } else if (packageId === "LP-007") {
    assertVisible(c.scenario, c.people.map((person: string) => c.labels.people[person]), packageId);
    assertVisible(c.scenario, c.values.map((value: string) => c.labels.values[value]), packageId);
  } else if (packageId === "LP-008") {
    assertVisible(c.scenario, c.people.map((person: string) => c.labels.people[person]), packageId);
    assertVisible(c.scenario, c.months.map((month: number) => c.labels.months[month]), packageId);
    assert.ok(c.scenario.includes("12th") && c.scenario.includes("27th"), `${packageId}: setup omits date domain`);
  }
}

function firstTable(line: string): string | undefined {
  const match = line.match(/\|[^\n]+\|\n\|[-|]+\|(?:\n\|[^\n]+\|)+/u);
  return match?.[0];
}

assert.equal(LP_001_008_STABILIZED_ENGLISH_V4.setupContract, "EXPLICIT_ALL_DOMAINS");
assert.equal(LP_001_008_STABILIZED_ENGLISH_V4.clueOrder, "BEST_ANCHOR_THEN_CONNECTED_HIGH_INFORMATION_CLUES");

let reorderedCaselets = 0;
let caseTableCaselets = 0;

for (const [packageId, baseGenerator, revisedGenerator] of packages) {
  const seed = `lp-v4-proof:${packageId}`;
  const base = baseGenerator(seed, 24);
  const revised = revisedGenerator(seed, 24);
  assert.equal(revised.length, base.length);

  for (let index = 0; index < revised.length; index += 1) {
    const source = base[index]!;
    const current = revised[index]!;
    assert.deepEqual(withoutEditorial(current), withoutEditorial(source), `${packageId}: puzzle semantics/options changed at ${current.caseletId}`);
    assert.ok(current.scenario.startsWith(source.scenario), `${packageId}: original scenario meaning was not preserved`);
    assertCompleteDomains(packageId, current);

    const explanation = current.children[0]!.explanation.lines.join("\n\n");
    for (const clue of current.clues) assert.ok(explanation.includes(clue.text), `${current.caseletId}: explanation omits clue: ${clue.text}`);

    const displayedOrder = current.clues.map((clue) => clue.text);
    const explainedOrder = [...displayedOrder].sort((a, b) => explanation.indexOf(a) - explanation.indexOf(b));
    if (explainedOrder.some((text, clueIndex) => text !== displayedOrder[clueIndex])) reorderedCaselets += 1;
    if (explanation.includes("**Case 1**") && explanation.includes("**Case 2**")) caseTableCaselets += 1;

    const sharedLines = current.children[0]!.explanation.lines.slice(0, -1);
    let previousTable: string | undefined;
    for (const line of sharedLines) {
      if (line.includes("Complete the arrangement")) continue;
      const table = firstTable(line);
      assert.ok(table, `${current.caseletId}: emitted reasoning step has no working table`);
      if (previousTable) assert.notEqual(table, previousTable, `${current.caseletId}: emitted a step whose working table did not change`);
      previousTable = table;
    }
  }

  console.log(`${packageId}: V4 complete-domain and dependency-order proof passed for ${revised.length} caselets.`);
}

assert.ok(reorderedCaselets >= 120, `Expected explanation planner to reorder most caselets; only ${reorderedCaselets} were reordered.`);
assert.ok(caseTableCaselets > 0, "Expected genuine Case 1 / Case 2 tables in the V4 proof sample.");

const reference = generateLp001BatchStabilizedV4("lp-001-008-review-v3-3:LP-001", 12)[0]! as any;
assertVisible(reference.scenario, reference.people, "LP-001 reference");
assertVisible(reference.scenario, reference.groups.map((group: string) => reference.groupLabels[group]), "LP-001 reference");
const referenceExplanation = reference.children[0].explanation.lines.join("\n\n");
const referenceDisplayed = reference.clues.map((clue: any) => clue.text);
const referenceExplained = [...referenceDisplayed].sort((a, b) => referenceExplanation.indexOf(a) - referenceExplanation.indexOf(b));
assert.notDeepEqual(referenceExplained, referenceDisplayed, "First LP-001 review case still follows displayed clue order mechanically.");
console.log("LP-001 reference case: all people/groups explicit and explanation order is independently planned.");
