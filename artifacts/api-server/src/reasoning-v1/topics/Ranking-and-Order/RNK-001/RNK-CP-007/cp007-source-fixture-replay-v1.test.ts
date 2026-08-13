import assert from "node:assert/strict";

function subgroupAfterTarget(input: Readonly<{
  total: number;
  categoryATotal: number;
  targetRankFromTop: number;
  categoryBAhead: number;
  targetCategory: "A" | "B";
}>): number {
  const totalAhead = input.targetRankFromTop - 1;
  const categoryAAhead = totalAhead - input.categoryBAhead;
  const targetConsumesA = input.targetCategory === "A" ? 1 : 0;
  return input.categoryATotal - categoryAAhead - targetConsumesA;
}

// Aggarwal Ranking Q65.
const q65Girls = 150 / 3;
const q65Boys = 150 - q65Girls;
const q65BoysAfter = subgroupAfterTarget({
  total: 150,
  categoryATotal: q65Boys,
  targetRankFromTop: 25,
  categoryBAhead: 10,
  targetCategory: "A",
});
assert.equal(q65Girls, 50);
assert.equal(q65Boys, 100);
assert.equal(q65BoysAfter, 85);
assert.equal([90, 75, 105].includes(q65BoysAfter), false); // source answer: None of these

// Aggarwal Ranking Q67.
const q67Boys = 90 / 3;
const q67BoysAfter = subgroupAfterTarget({
  total: 90,
  categoryATotal: q67Boys,
  targetRankFromTop: 14,
  categoryBAhead: 10,
  targetCategory: "A",
});
assert.equal(q67Boys, 30);
assert.equal(q67BoysAfter, 26);

// Aggarwal Ranking Q66: relational side-count equation.
const totalQ66 = 10;
const anilBehind = (totalQ66 - 1) / 3;
const anilFront = 2 * anilBehind;
const ganeshFront = anilBehind;
const ganeshBehind = totalQ66 - ganeshFront - 1;
assert.equal(anilBehind, 3);
assert.equal(anilFront, 6);
assert.equal(ganeshBehind, 6);

// Aggarwal Ranking Q35 [CSAT 2015]: derive holdings after transfers, then rank.
const q35 = { A: 100, B: 100, C: 100, D: 100 };
q35.A -= 20; q35.B += 20;
q35.B -= 10; q35.C += 10;
q35.D -= 30; q35.C += 30;
assert.deepEqual(q35, { A: 80, B: 110, C: 140, D: 70 });
const q35Order = Object.entries(q35).sort((a, b) => b[1] - a[1]).map(([id]) => id);
assert.deepEqual(q35Order, ["C", "B", "A", "D"]);
assert.equal(q35.C > q35.A + q35.D, false); // source's incorrect statement

// Aggarwal Ranking Q68 [SSC MTS 2021]: F=x; J=1.5x; G=0.5J; J+L=2F;
// H=2K and F+J<H. The relative order of J and K can vary, but G remains
// second from the bottom. Two witnesses demonstrate the uncertainty.
function q68Order(f: number, k: number): string[] {
  const values = {
    F: f,
    J: 1.5 * f,
    G: 0.75 * f,
    L: 0.5 * f,
    K: k,
    H: 2 * k,
  };
  assert.ok(values.F + values.J < values.H);
  return Object.entries(values).sort((a, b) => b[1] - a[1]).map(([id]) => id);
}
const q68WitnessKBelowJ = q68Order(4, 5.5);
const q68WitnessKAboveJ = q68Order(4, 7);
assert.deepEqual(q68WitnessKBelowJ, ["H", "J", "K", "F", "G", "L"]);
assert.deepEqual(q68WitnessKAboveJ, ["H", "K", "J", "F", "G", "L"]);
assert.equal(q68WitnessKBelowJ.at(-2), "G");
assert.equal(q68WitnessKAboveJ.at(-2), "G");

// Aggarwal Ranking Q27-Q28 [CSAT 2015]: bounded consecutive age domain.
const people = ["A", "B", "C", "D", "E", "F"] as const;
const ages = [17, 18, 19, 20, 21, 22] as const;
const validAgeAssignments: Record<string, number>[] = [];

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [[...values]];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const rest = values.filter((_, restIndex) => restIndex !== index);
    for (const tail of permutations(rest)) result.push([value, ...tail]);
  });
  return result;
}

for (const assignment of permutations(ages)) {
  const value = Object.fromEntries(people.map((person, index) => [person, assignment[index]!])) as Record<string, number>;
  const fBetweenBAndD =
    (value.F! > value.B! && value.F! < value.D!) ||
    (value.F! > value.D! && value.F! < value.B!);
  if (!fBetweenBAndD) continue;
  if (!(value.A! > value.B!)) continue;
  if (!(value.C! > value.D!)) continue;
  if (value.A !== value.C! + 1) continue;
  if (value.D === 17 || value.B === 17) continue;
  if (value.B === 18) continue;
  validAgeAssignments.push(value);
}
assert.equal(validAgeAssignments.length, 1);
assert.deepEqual(validAgeAssignments[0], { A: 22, B: 20, C: 21, D: 18, E: 17, F: 19 });
assert.equal(validAgeAssignments[0]!.F, 19); // Q27 possible value
const q28Orders = new Set(validAgeAssignments.map((assignment) =>
  [...people].sort((a, b) => assignment[a]! - assignment[b]!).join("<"),
));
assert.equal(q28Orders.size, 1);

console.log(JSON.stringify({
  status: "PASS",
  fixtureVersion: "RNK_CP007_SOURCE_FIXTURE_REPLAY_V1",
  fixturesReplayed: ["Q27", "Q28", "Q35", "Q65", "Q66", "Q67", "Q68"],
  categoryComposition: { q65BoysAfter, q67BoysAfter },
  relationalSideCount: { ganeshBehind },
  derivedMoneyOrder: q35Order,
  derivedWeightWitnesses: [q68WitnessKBelowJ, q68WitnessKAboveJ],
  ageAssignments: validAgeAssignments.length,
  permanentQlAllocated: false,
}, null, 2));
