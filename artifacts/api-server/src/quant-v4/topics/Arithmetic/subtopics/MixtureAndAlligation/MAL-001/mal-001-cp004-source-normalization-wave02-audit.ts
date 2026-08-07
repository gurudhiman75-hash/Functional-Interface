import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { equalsRational, formatRational } from "./foundation/rational";
import { generateMalCp004DiscoveryQuestion } from "./foundation/cp004-discovery-runtime";
import { MAL_CP004_DISCOVERY_REGISTRY } from "./foundation/cp004-discovery-registry";
import { solveMalCp004 } from "./foundation/cp004-solver";
import {
  MAL_CP004_WAVE02_SOURCE_GAPS,
  MAL_CP004_WAVE02_SOURCE_REFERENCES,
} from "./foundation/cp004-source-authority-wave02";
import {
  MAL_CP004_WAVE02_NORMALIZED_CASES,
  MAL_CP004_WAVE02_NORMALIZED_GAP_CASES,
  solveMalCp004Wave02GapRequest,
} from "./foundation/cp004-source-normalization-wave02";
import { MAL_CP004_DISCOVERY_PROTOTYPE_IDS } from "./foundation/cp004-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP004_WAVE02_SOURCE_REFERENCES.length === 13,
  "Expected thirteen Wave 02 source references.",
);
assert(
  MAL_CP004_WAVE02_NORMALIZED_CASES.length === 10,
  "Expected ten current-prototype normalized cases.",
);
assert(
  MAL_CP004_WAVE02_SOURCE_GAPS.length === 3 &&
    MAL_CP004_WAVE02_NORMALIZED_GAP_CASES.length === 3,
  "Expected three source-backed gap contracts.",
);

const sourceById = new Map(
  MAL_CP004_WAVE02_SOURCE_REFERENCES.map((source) => [source.sourceId, source]),
);
assert(
  sourceById.size === MAL_CP004_WAVE02_SOURCE_REFERENCES.length,
  "Source IDs are not unique.",
);

const directSources = MAL_CP004_WAVE02_SOURCE_REFERENCES.filter(
  (source) => source.evidenceKind === "UPLOADED_TEXTBOOK_DIRECT_TASK",
);
const formulaEquivalentSources = MAL_CP004_WAVE02_SOURCE_REFERENCES.filter(
  (source) =>
    source.evidenceKind ===
    "UPLOADED_TEXTBOOK_FORMULA_EQUIVALENT_DIRECTION",
);
const collisionSources = MAL_CP004_WAVE02_SOURCE_REFERENCES.filter(
  (source) => source.evidenceKind === "INTERNAL_RUNTIME_COLLISION",
);
const boundarySources = MAL_CP004_WAVE02_SOURCE_REFERENCES.filter(
  (source) => source.evidenceKind === "UPLOADED_TEXTBOOK_BOUNDARY",
);

assert(directSources.length >= 7, "Direct task source coverage is too low.");
assert(
  formulaEquivalentSources.length === 3,
  "Formula-equivalent source count changed.",
);
assert(collisionSources.length === 1, "Expected one Percentage collision source.");
assert(boundarySources.length === 2, "Expected two textbook boundary sources.");
assert(
  collisionSources[0]!.ownerVerdict ===
    "PCT-CP-006_MAL-CP-004_COLLISION",
  "Percentage collision verdict changed.",
);
assert(
  boundarySources.some(
    (source) => source.ownerVerdict === "MAL-CP-001_CP004_BOUNDARY",
  ),
  "CP-001/CP-004 boundary source is missing.",
);
assert(
  boundarySources.some(
    (source) => source.ownerVerdict === "MAL-CP-003_CP004_BOUNDARY",
  ),
  "CP-003/CP-004 boundary source is missing.",
);

const coverageByPrototype = new Map<string, Set<string>>();
const directCoverageByPrototype = new Map<string, Set<string>>();
for (const prototypeId of MAL_CP004_DISCOVERY_PROTOTYPE_IDS) {
  coverageByPrototype.set(prototypeId, new Set());
  directCoverageByPrototype.set(prototypeId, new Set());
}

let exactNormalizedCaseCount = 0;
for (const sourceCase of MAL_CP004_WAVE02_NORMALIZED_CASES) {
  const source = sourceById.get(sourceCase.sourceId);
  assert(source, `${sourceCase.caseId}: source reference is missing.`);
  assert(
    source.normalizedCaseIds.includes(sourceCase.caseId),
    `${sourceCase.caseId}: source reference does not declare the case.`,
  );
  assert(
    source.prototypeIds.includes(sourceCase.prototypeId),
    `${sourceCase.caseId}: prototype is not declared by the source.`,
  );
  const solved = solveMalCp004(sourceCase.request);
  assert(
    solved.kind === sourceCase.expectedResult.kind,
    `${sourceCase.caseId}: result kind mismatch.`,
  );
  assert(
    equalsRational(solved.value, sourceCase.expectedResult.value),
    `${sourceCase.caseId}: expected ${formatRational(
      sourceCase.expectedResult.value,
    )}, received ${formatRational(solved.value)}.`,
  );
  coverageByPrototype.get(sourceCase.prototypeId)!.add(sourceCase.sourceId);
  if (sourceCase.matchKind === "DIRECT_TASK_MATCH") {
    directCoverageByPrototype
      .get(sourceCase.prototypeId)!
      .add(sourceCase.sourceId);
  }
  exactNormalizedCaseCount += 1;
}

assert(
  [...coverageByPrototype.values()].every((sourceIds) => sourceIds.size >= 1),
  `A Wave 01 prototype lacks source-normalized coverage: ${JSON.stringify(
    Object.fromEntries(
      [...coverageByPrototype].map(([prototypeId, sourceIds]) => [
        prototypeId,
        [...sourceIds],
      ]),
    ),
  )}`,
);
const directPrototypeCount = [...directCoverageByPrototype.values()].filter(
  (sourceIds) => sourceIds.size > 0,
).length;
const formulaEquivalentOnlyPrototypeCount =
  MAL_CP004_DISCOVERY_PROTOTYPE_IDS.length - directPrototypeCount;
assert(
  directPrototypeCount === 4,
  `Expected four directly matched prototypes, received ${directPrototypeCount}.`,
);
assert(
  formulaEquivalentOnlyPrototypeCount === 3,
  `Expected three formula-equivalent-only prototypes, received ${formulaEquivalentOnlyPrototypeCount}.`,
);

let exactGapCaseCount = 0;
for (const gapCase of MAL_CP004_WAVE02_NORMALIZED_GAP_CASES) {
  const source = sourceById.get(gapCase.sourceId);
  assert(source, `${gapCase.caseId}: source reference is missing.`);
  assert(
    source.normalizedCaseIds.includes(gapCase.caseId),
    `${gapCase.caseId}: source reference does not declare the gap case.`,
  );
  assert(
    MAL_CP004_WAVE02_SOURCE_GAPS.some(
      (gap) =>
        gap.gapId === gapCase.gapId &&
        gap.sourceIds.includes(gapCase.sourceId),
    ),
    `${gapCase.caseId}: source-gap authority is missing.`,
  );
  const solved = solveMalCp004Wave02GapRequest(gapCase.request);
  assert(
    equalsRational(solved, gapCase.expectedValue),
    `${gapCase.caseId}: expected ${formatRational(
      gapCase.expectedValue,
    )}, received ${formatRational(solved)}.`,
  );
  exactGapCaseCount += 1;
}

const ex43Forward = MAL_CP004_WAVE02_NORMALIZED_CASES.find(
  (item) => item.caseId === "MAL-CP004-SRC-CASE-EVAPORATION-EX43-FORWARD",
)!;
const ex43Inverse = MAL_CP004_WAVE02_NORMALIZED_GAP_CASES.find(
  (item) =>
    item.caseId ===
    "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATION-EX43",
)!;
assert(
  equalsRational(
    solveMalCp004(ex43Forward.request).value,
    ex43Inverse.request.mode === "INITIAL_TOTAL_FROM_EVAPORATED_QUANTITY"
      ? ex43Inverse.request.evaporatedQuantity
      : fail("Wrong Ex43 gap mode."),
  ),
  "Ex43 forward/inverse source round trip failed.",
);

const q330Current = MAL_CP004_WAVE02_NORMALIZED_CASES.find(
  (item) => item.caseId === "MAL-CP004-SRC-CASE-CONCENTRATION-Q330",
)!;
const q330Gap = MAL_CP004_WAVE02_NORMALIZED_GAP_CASES.find(
  (item) =>
    item.caseId ===
    "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-EVAPORATION-Q330",
)!;
assert(
  equalsRational(
    solveMalCp004(q330Current.request).value,
    solveMalCp004Wave02GapRequest(q330Gap.request),
  ),
  "Q330 concentration projection does not match the source-gap equation.",
);

let compatibilityQuestionCount = 0;
for (const prototypeId of MAL_CP004_DISCOVERY_PROTOTYPE_IDS) {
  for (let index = 0; index < 50; index += 1) {
    const question = generateMalCp004DiscoveryQuestion(
      prototypeId,
      `cp004-wave02-compatibility:${prototypeId}:${index}`,
    );
    assert(
      question.validation.ok,
      `${prototypeId}/${index}: ${question.validation.errors.join("; ")}`,
    );
    assert(question.permanentQlId === null, "Permanent QL leaked during Wave 02.");
    assert(
      question.sourceEvidenceStatus ===
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      "Wave 01 runtime source status was silently promoted.",
    );
    assert(
      !question.active &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable &&
        !question.questionBankWritable &&
        !question.testEligible,
      "A Wave 02 compatibility question became deliverable.",
    );
    compatibilityQuestionCount += 1;
  }
}
assert(
  compatibilityQuestionCount === 350,
  "Expected 350 Wave 01 compatibility questions.",
);
assert(
  MAL_CP004_DISCOVERY_REGISTRY.every(
    (entry) => entry.permanentQlId === null && !entry.active,
  ),
  "Registry release state changed during source normalisation.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(
  outputDirectory,
  "mal-cp004-wave02-source-normalization.json",
);
const markdownPath = resolve(
  outputDirectory,
  "mal-cp004-wave02-source-normalization.md",
);

const coverageSummary = Object.fromEntries(
  [...coverageByPrototype].map(([prototypeId, sourceIds]) => [
    prototypeId,
    {
      sourceIds: [...sourceIds],
      directSourceIds: [...directCoverageByPrototype.get(prototypeId)!],
    },
  ]),
);

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE02_SOURCE_NORMALIZATION",
      sourceReferenceCount: MAL_CP004_WAVE02_SOURCE_REFERENCES.length,
      directSourceCount: directSources.length,
      formulaEquivalentSourceCount: formulaEquivalentSources.length,
      directPrototypeCount,
      formulaEquivalentOnlyPrototypeCount,
      collisionSourceCount: collisionSources.length,
      boundarySourceCount: boundarySources.length,
      exactNormalizedCaseCount,
      sourceGapCount: MAL_CP004_WAVE02_SOURCE_GAPS.length,
      exactGapCaseCount,
      coveredPrototypeCount: coverageByPrototype.size,
      compatibilityQuestionCount,
      permanentQlCount: 0,
      productFlagsEnabled: false,
      coverageSummary,
      sourceGaps: MAL_CP004_WAVE02_SOURCE_GAPS,
      sourceReferences: MAL_CP004_WAVE02_SOURCE_REFERENCES,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const markdown = [
  "# MAL-CP-004 Wave 02 — Source Normalisation Evidence",
  "",
  `Source references: **${MAL_CP004_WAVE02_SOURCE_REFERENCES.length}**`,
  `Direct task sources: **${directSources.length}**`,
  `Formula-equivalent source directions: **${formulaEquivalentSources.length}**`,
  `Directly matched prototypes: **${directPrototypeCount}**`,
  `Formula-equivalent-only prototypes: **${formulaEquivalentOnlyPrototypeCount}**`,
  `Exact current-prototype cases: **${exactNormalizedCaseCount}**`,
  `Exact source-gap cases: **${exactGapCaseCount}**`,
  `Wave 01 compatibility questions: **${compatibilityQuestionCount}**`,
  "Permanent QLs: **0**",
  "",
  "## Prototype coverage",
  "",
  ...Object.entries(coverageSummary).flatMap(([prototypeId, coverage]) => [
    `### ${prototypeId}`,
    "",
    `Sources: ${(coverage as { sourceIds: string[] }).sourceIds.join(", ")}`,
    "",
    `Direct task matches: ${(coverage as { directSourceIds: string[] }).directSourceIds.join(", ") || "none; formula-equivalent only"}`,
    "",
  ]),
  "## Source-backed gaps",
  "",
  ...MAL_CP004_WAVE02_SOURCE_GAPS.flatMap((gap) => [
    `### ${gap.gapId}`,
    "",
    gap.reason,
    "",
    `Disposition: **${gap.recommendedDisposition}**`,
    "",
  ]),
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE02_SOURCE_NORMALIZATION",
      sourceReferenceCount: MAL_CP004_WAVE02_SOURCE_REFERENCES.length,
      directSourceCount: directSources.length,
      formulaEquivalentSourceCount: formulaEquivalentSources.length,
      directPrototypeCount,
      formulaEquivalentOnlyPrototypeCount,
      exactNormalizedCaseCount,
      sourceGapCount: MAL_CP004_WAVE02_SOURCE_GAPS.length,
      exactGapCaseCount,
      coveredPrototypeCount: coverageByPrototype.size,
      compatibilityQuestionCount,
      permanentQlCount: 0,
      productFlagsEnabled: false,
    },
    null,
    2,
  ),
);
