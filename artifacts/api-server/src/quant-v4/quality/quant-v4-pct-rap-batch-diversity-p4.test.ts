import assert from "node:assert/strict";

import { generateQuestion } from "../generation-engine-core";
import { listPct001CuratedDefaultQlIds } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/pipeline";
import { listRap001CuratedDefaultQlIds } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/pipeline";

function qlIds(batch: any): string[] {
  const rows = Array.isArray(batch?.questionPackages)
    ? batch.questionPackages
    : Array.isArray(batch?.questions)
      ? batch.questions
      : [];
  return rows.map((row: any) => String(
    row?.questionLanguageId
    ?? row?.metadata?.questionLanguageId
    ?? row?.generationMetadata?.questionLanguageId
    ?? "",
  ));
}

async function proveDefaultBatch(input: {
  packageId: "PCT-001" | "RAP-001";
  cpId: string;
  seed: string;
  count: number;
}) {
  const first = await generateQuestion({
    packageId: input.packageId,
    canonicalProblemId: input.cpId,
    language: "en",
    seed: input.seed,
    count: input.count,
  } as any);
  const second = await generateQuestion({
    packageId: input.packageId,
    canonicalProblemId: input.cpId,
    language: "en",
    seed: input.seed,
    count: input.count,
  } as any);

  const firstIds = qlIds(first);
  const secondIds = qlIds(second);

  assert.equal(firstIds.length, input.count);
  assert.deepEqual(firstIds, secondIds, `${input.packageId}/${input.cpId} batch QL selection must remain deterministic.`);
  assert.equal(
    new Set(firstIds).size,
    input.count,
    `${input.packageId}/${input.cpId} default batch reused a curated QL before the requested sample exhausted local capacity: ${firstIds.join(", ")}`,
  );
  assert.ok(firstIds.every(Boolean));

  return firstIds;
}

const pctCapacity = listPct001CuratedDefaultQlIds("PCT-CP-002", { language: "en" }).length;
const rapCapacity = listRap001CuratedDefaultQlIds("RAP-CP-002", { language: "en" }).length;
assert.ok(pctCapacity >= 2, "PCT-CP-002 curated default pool is unexpectedly narrow.");
assert.ok(rapCapacity >= 2, "RAP-CP-002 curated default pool is unexpectedly narrow.");

const pctCount = Math.min(6, pctCapacity);
const rapCount = Math.min(6, rapCapacity);

const pctIds = await proveDefaultBatch({
  packageId: "PCT-001",
  cpId: "PCT-CP-002",
  seed: "QUANT-V4-PCT-BATCH-DIVERSITY-P4",
  count: pctCount,
});

const rapIds = await proveDefaultBatch({
  packageId: "RAP-001",
  cpId: "RAP-CP-002",
  seed: "QUANT-V4-RAP-BATCH-DIVERSITY-P4",
  count: rapCount,
});

const explicit = await generateQuestion({
  packageId: "PCT-001",
  canonicalProblemId: "PCT-CP-002",
  questionLanguageId: "PCT-QL-017",
  language: "en",
  seed: "QUANT-V4-PCT-EXPLICIT-QL-P4",
  count: 4,
} as any);
assert.deepEqual(
  qlIds(explicit),
  ["PCT-QL-017", "PCT-QL-017", "PCT-QL-017", "PCT-QL-017"],
  "Explicit QL requests must not be diversified.",
);

console.log("QUANT_V4_PCT_RAP_BATCH_DIVERSITY_P4", JSON.stringify({
  pct: { cpId: "PCT-CP-002", curatedCapacity: pctCapacity, qlIds: pctIds, unique: new Set(pctIds).size },
  rap: { cpId: "RAP-CP-002", curatedCapacity: rapCapacity, qlIds: rapIds, unique: new Set(rapIds).size },
  explicitQlPreserved: true,
}));
