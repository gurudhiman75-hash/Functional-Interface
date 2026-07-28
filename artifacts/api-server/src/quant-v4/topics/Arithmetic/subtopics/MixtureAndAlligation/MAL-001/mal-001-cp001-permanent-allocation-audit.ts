import {
  MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS,
  MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS,
  MAL_CP001_FROZEN_QL_TEMPLATES,
  MAL_CP001_FROZEN_SOLVE_MODES,
} from "./foundation/cp001-foundation-freeze-ledger";
import {
  MAL_CP001_PERMANENT_ALLOCATION,
  MAL_CP001_PERMANENT_QL_IDS,
} from "./foundation/cp001-permanent-allocation";
import { runMalCp001PermanentPipeline } from "./foundation/cp001-permanent-runtime";
import { MAL_CP001_APPROVED_PROTOTYPE_IDS } from "./foundation/cp001-product-approval";

function fail(message: string): never {
  throw new Error(message);
}

function sorted(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function assertSameSet(
  label: string,
  actual: readonly string[],
  expected: readonly string[],
): void {
  const actualSorted = sorted(actual);
  const expectedSorted = sorted(expected);
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    fail(`${label} mismatch: ${actualSorted.join(", ")} / ${expectedSorted.join(", ")}.`);
  }
}

if (MAL_CP001_PERMANENT_QL_IDS.length !== 11) {
  fail(`Expected 11 permanent QL IDs, received ${MAL_CP001_PERMANENT_QL_IDS.length}.`);
}
if (MAL_CP001_PERMANENT_ALLOCATION.length !== 11) {
  fail(`Expected 11 permanent allocation rows, received ${MAL_CP001_PERMANENT_ALLOCATION.length}.`);
}
if (new Set(MAL_CP001_PERMANENT_QL_IDS).size !== 11) {
  fail("Permanent QL ID list contains duplicates.");
}

const expectedQlIds = Array.from(
  { length: 11 },
  (_, index) => `MAL-QL-${String(index + 1).padStart(3, "0")}`,
);
if (JSON.stringify(MAL_CP001_PERMANENT_QL_IDS) !== JSON.stringify(expectedQlIds)) {
  fail("Permanent MAL QL range is not consecutive MAL-QL-001 through MAL-QL-011.");
}
if (
  JSON.stringify(MAL_CP001_PERMANENT_ALLOCATION.map((entry) => entry.qlId)) !==
  JSON.stringify(MAL_CP001_PERMANENT_QL_IDS)
) {
  fail("Permanent allocation order does not match the QL range authority.");
}

assertSameSet(
  "Frozen QL-template coverage",
  MAL_CP001_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId),
  MAL_CP001_FROZEN_QL_TEMPLATES.map((entry) => entry.qlTemplateId),
);
assertSameSet(
  "Frozen solve-mode coverage",
  [...new Set(MAL_CP001_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId))],
  MAL_CP001_FROZEN_SOLVE_MODES.map((entry) => entry.solveModeId),
);

const allocatedPrototypeIds = MAL_CP001_PERMANENT_ALLOCATION.flatMap(
  (entry) => entry.prototypeIds,
);
if (new Set(allocatedPrototypeIds).size !== allocatedPrototypeIds.length) {
  fail("An approved prototype is allocated to more than one permanent QL.");
}
assertSameSet(
  "Approved prototype coverage",
  allocatedPrototypeIds,
  MAL_CP001_APPROVED_PROTOTYPE_IDS,
);

const excludedPrototypeIds = new Set(
  MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS.map((entry) => entry.prototypeId),
);
for (const prototypeId of allocatedPrototypeIds) {
  if (excludedPrototypeIds.has(prototypeId as never)) {
    fail(`${prototypeId} escaped its preserved exclusion into permanent allocation.`);
  }
}
if (MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS.length !== 3) {
  fail("The three source-backed defer/internal-only decisions must remain frozen.");
}

const frozenTemplateById = new Map(
  MAL_CP001_FROZEN_QL_TEMPLATES.map((template) => [template.qlTemplateId, template]),
);
const difficultyCounts = new Map<string, number>();
for (const entry of MAL_CP001_PERMANENT_ALLOCATION) {
  const template = frozenTemplateById.get(entry.qlTemplateId);
  if (!template) fail(`${entry.qlId} references an unknown frozen template.`);
  if (entry.solveModeId !== template.solveModeId) {
    fail(`${entry.qlId} solve mode drifted from ${entry.qlTemplateId}.`);
  }
  if (entry.taskDirection !== template.taskDirection) {
    fail(`${entry.qlId} task direction drifted from ${entry.qlTemplateId}.`);
  }
  if (entry.answerSemantic !== template.answerSemantic) {
    fail(`${entry.qlId} answer semantic drifted from ${entry.qlTemplateId}.`);
  }
  assertSameSet(
    `${entry.qlId} prototype coverage`,
    entry.prototypeIds,
    template.prototypeIds,
  );
  if (
    entry.active ||
    entry.publiclyPublishable ||
    entry.questionStudioDiscoverable ||
    entry.questionBankWritable ||
    entry.testEligible ||
    entry.maturity !== "IMPLEMENTATION_PROOF" ||
    entry.allocationStatus !== "ALLOCATED_IMPLEMENTATION_PROOF" ||
    !entry.permanentIdentityFrozen
  ) {
    fail(`${entry.qlId} escaped the inactive implementation-proof boundary.`);
  }
  difficultyCounts.set(
    entry.difficulty,
    (difficultyCounts.get(entry.difficulty) ?? 0) + 1,
  );
}

const expectedDifficultyCounts: Record<string, number> = {
  Easy: 3,
  Medium: 7,
  Hard: 1,
};
for (const [difficulty, expected] of Object.entries(expectedDifficultyCounts)) {
  const actual = difficultyCounts.get(difficulty) ?? 0;
  if (actual !== expected) {
    fail(`${difficulty} allocation count mismatch: ${actual}/${expected}.`);
  }
}

let generatedQuestionCount = 0;
let deterministicRegenerationCount = 0;
const distinctStems = new Set<string>();
const observedPrototypeIdsByQl = new Map<string, Set<string>>();

for (const qlId of MAL_CP001_PERMANENT_QL_IDS) {
  const allocation = MAL_CP001_PERMANENT_ALLOCATION.find((entry) => entry.qlId === qlId);
  if (!allocation) fail(`Missing allocation row for ${qlId}.`);
  const observed = new Set<string>();
  observedPrototypeIdsByQl.set(qlId, observed);

  for (let index = 0; index < 100; index += 1) {
    const seed = `permanent-allocation-${qlId}-${index}`;
    const first = runMalCp001PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });
    const second = runMalCp001PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });

    generatedQuestionCount += 1;
    deterministicRegenerationCount += 1;
    distinctStems.add(first.stem);
    observed.add(first.prototypeId);

    if (JSON.stringify(first) !== JSON.stringify(second)) {
      fail(`${qlId}/${seed} is not deterministic.`);
    }
    if (
      first.permanentQlId !== qlId ||
      first.questionLanguageId !== qlId ||
      first.traceability.questionLanguageId !== qlId ||
      first.traceability.qlTemplateId !== allocation.qlTemplateId ||
      first.traceability.solveModeId !== allocation.solveModeId ||
      first.foundationQlTemplateId !== allocation.qlTemplateId ||
      first.foundationSolveModeId !== allocation.solveModeId
    ) {
      fail(`${qlId}/${seed} emitted inconsistent permanent traceability.`);
    }
    if (
      first.taskDirection !== allocation.taskDirection ||
      first.answerSemantic !== allocation.answerSemantic ||
      first.difficulty !== allocation.difficulty ||
      first.language !== "en"
    ) {
      fail(`${qlId}/${seed} emitted metadata outside its permanent contract.`);
    }
    if (!allocation.prototypeIds.includes(first.prototypeId)) {
      fail(`${qlId}/${seed} selected prototype ${first.prototypeId} outside its allocation.`);
    }
    if (
      first.active ||
      first.publiclyPublishable ||
      first.questionStudioDiscoverable ||
      first.questionBankWritable ||
      first.testEligible ||
      first.maturity !== "IMPLEMENTATION_PROOF" ||
      first.allocationStatus !== "ALLOCATED_IMPLEMENTATION_PROOF"
    ) {
      fail(`${qlId}/${seed} escaped the inactive implementation-proof runtime boundary.`);
    }
    if (!first.validation.ok) {
      fail(`${qlId}/${seed} failed validation: ${first.validation.errors.join("; ")}.`);
    }
    if (first.options.length !== 4 || new Set(first.options).size !== 4) {
      fail(`${qlId}/${seed} does not contain four unique options.`);
    }
    if (first.correctIndex < 0 || first.correctIndex >= first.options.length) {
      fail(`${qlId}/${seed} has an invalid correct option index.`);
    }
    if (!first.stem.trim() || !first.explanation.conclusion.trim()) {
      fail(`${qlId}/${seed} contains an empty learner-facing surface.`);
    }
  }
}

for (const entry of MAL_CP001_PERMANENT_ALLOCATION) {
  assertSameSet(
    `${entry.qlId} observed runtime prototype coverage`,
    [...(observedPrototypeIdsByQl.get(entry.qlId) ?? [])],
    entry.prototypeIds,
  );
}
if (distinctStems.size < 900) {
  fail(`Permanent runtime diversity is too low: ${distinctStems.size}/1100 distinct stems.`);
}

let rejectedUnsupportedLanguage = false;
try {
  runMalCp001PermanentPipeline({ language: "hi" as never });
} catch {
  rejectedUnsupportedLanguage = true;
}
if (!rejectedUnsupportedLanguage) {
  fail("Permanent runtime accepted an unsupported language.");
}

let rejectedUnknownQl = false;
try {
  runMalCp001PermanentPipeline({ questionLanguageId: "MAL-QL-999" as never });
} catch {
  rejectedUnknownQl = true;
}
if (!rejectedUnknownQl) {
  fail("Permanent runtime accepted an unknown QL ID.");
}

console.log(JSON.stringify({
  status: "PASS_CP001_PERMANENT_ALLOCATION_IMPLEMENTATION_PROOF",
  permanentQlRange: `${MAL_CP001_PERMANENT_QL_IDS[0]}..${MAL_CP001_PERMANENT_QL_IDS.at(-1)}`,
  permanentQlCount: MAL_CP001_PERMANENT_QL_IDS.length,
  frozenQlTemplateCount: MAL_CP001_FROZEN_QL_TEMPLATES.length,
  frozenSolveModeCount: MAL_CP001_FROZEN_SOLVE_MODES.length,
  approvedPrototypeCount: allocatedPrototypeIds.length,
  generatedQuestionCount,
  deterministicRegenerationCount,
  distinctStemCount: distinctStems.size,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  sourceDirectionsStillDeferredOrInternalOnly: MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS.length,
  preservedProductExclusionCount: MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS.length,
  activeQlCount: 0,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
}, null, 2));
