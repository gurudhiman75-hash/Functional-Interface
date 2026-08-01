import assert from "node:assert/strict";

import {
  generateBlrCp003V9TopologyGapWave02Candidates,
  type BlrCp003V9Wave02CandidateRecord,
} from "./cp003-v9-topology-gap-wave-02";

function semanticIds(key: string): string[] {
  return key.split(":").slice(1);
}

function spouseIds(record: BlrCp003V9Wave02CandidateRecord): Set<string> {
  return new Set(
    record.proceduralLogic.edges
      .filter((edge) => edge.type === "marriage")
      .flatMap((edge) => [edge.sourceId, edge.targetId]),
  );
}

function parentIds(record: BlrCp003V9Wave02CandidateRecord): Set<string> {
  return new Set(
    record.proceduralLogic.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => edge.sourceId),
  );
}

const records = generateBlrCp003V9TopologyGapWave02Candidates();
const groups = new Map<string, BlrCp003V9Wave02CandidateRecord>();
let unknownAuthorityRecords = 0;
let explicitStatusRecords = 0;
let unknownBoundaryPersonChecks = 0;
let explicitUnmarriedPersonChecks = 0;

for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  if (!groups.has(key)) groups.set(key, record);

  const spouses = spouseIds(record);
  const parents = parentIds(record);
  const unknownIds = new Set(record.metadata.unknownSpouseBoundaryIds);
  const unmarriedIds = new Set(record.metadata.explicitUnmarriedIds);

  for (const id of unknownIds) {
    assert.ok(!spouses.has(id), `${record.itemId}: unknown boundary ${id} has a spouse edge`);
    assert.ok(parents.has(id), `${record.itemId}: unknown boundary ${id} should remain a meaningful parent branch`);
    assert.ok(!unmarriedIds.has(id), `${record.itemId}: ${id} cannot be both unknown and unmarried`);
    unknownBoundaryPersonChecks += 1;
  }

  for (const id of unmarriedIds) {
    assert.ok(!spouses.has(id), `${record.itemId}: explicitly unmarried ${id} has a spouse edge`);
    assert.ok(!unknownIds.has(id), `${record.itemId}: ${id} cannot be both unmarried and unknown`);
    explicitUnmarriedPersonChecks += 1;
  }

  if (
    record.provisionalAuthority ===
    "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS"
  ) {
    unknownAuthorityRecords += 1;
    const [answerId] = semanticIds(record.answerSemanticKey);
    assert.ok(answerId);
    assert.ok(unknownIds.has(answerId));
    assert.ok(!unmarriedIds.has(answerId));
    assert.ok(!spouses.has(answerId));
  }

  if (record.provisionalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS") {
    explicitStatusRecords += 1;
    const [answerId] = semanticIds(record.answerSemanticKey);
    assert.ok(answerId);
    assert.ok(unmarriedIds.has(answerId));
    assert.ok(!unknownIds.has(answerId));
    assert.ok(!spouses.has(answerId));
  }
}

assert.equal(groups.size, 18);
assert.equal(unknownAuthorityRecords, 12);
assert.equal(explicitStatusRecords, 12);
assert.equal(unknownBoundaryPersonChecks, 48);
assert.equal(explicitUnmarriedPersonChecks, 48);

for (const record of groups.values()) {
  const prompt = record.sharedPrompt;
  assert.match(prompt, /\b(?:not|neither|no spouse|unmarried|unknown|unstated|not identified|does not state)\b/i);
  assert.ok(record.metadata.negativeClueCount >= 4);
  if (record.metadata.unknownSpouseBoundaryIds.length) {
    assert.match(
      prompt,
      /(?:no spouse is named|spouse is not identified|marital status is not stated|does not state whether|spouse is not named)/i,
    );
  }
  if (record.metadata.explicitUnmarriedIds.length) {
    assert.match(prompt, /\bunmarried\b/i);
  }
}

console.log(
  JSON.stringify(
    {
      candidateRecords: records.length,
      passageGroups: groups.size,
      unknownAuthorityRecords,
      explicitStatusRecords,
      unknownBoundaryPersonChecks,
      explicitUnmarriedPersonChecks,
      verdict:
        "BLR-CP-003 V9 WAVE 02 PRESERVES UNKNOWN SPOUSE BOUNDARIES WITHOUT COLLAPSING THEM INTO EXPLICIT UNMARRIED STATUS",
    },
    null,
    2,
  ),
);
