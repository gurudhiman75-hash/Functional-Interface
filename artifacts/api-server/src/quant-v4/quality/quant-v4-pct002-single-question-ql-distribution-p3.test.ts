import assert from "node:assert/strict";

import { generateQuestion } from "../question-studio-review-engine";
import { curateDefaultQuestionLanguageIds } from "../common/default-question-language-pool";
import {
  getAnswerType,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/library";
import {
  getSelectableQuestionLanguageIds,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator";
import {
  PCT_002_CP_IDS,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/types";

const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";
const SECTIONS = 20;
const ARITHMETIC_SLOTS = 11;
const EXPECTED_SAMPLES = SECTIONS * ARITHMETIC_SLOTS;
const EXPECTED_CP_COUNT = PCT_002_CP_IDS.length;
const MIN_CURATED_COVERAGE_RATE = 0.95;
const MAX_QL_REUSE_COUNT = 8;

function curatedIdsForCp(cpId: (typeof PCT_002_CP_IDS)[number]) {
  const availableIds = getSelectableQuestionLanguageIds(cpId, "en");
  return curateDefaultQuestionLanguageIds(availableIds, (questionLanguageId) => {
    const englishEntry = getQuestionEntry(cpId, questionLanguageId, "en");
    return {
      taskKind: getTaskKind(cpId, questionLanguageId),
      answerType: getAnswerType(cpId, questionLanguageId),
      requiredVariables: getRequiredVariables(cpId, questionLanguageId),
      difficulty: englishEntry.difficulty,
      template: englishEntry.template,
    };
  });
}

const curatedByCp = Object.fromEntries(
  PCT_002_CP_IDS.map((cpId) => [cpId, curatedIdsForCp(cpId)]),
) as Record<(typeof PCT_002_CP_IDS)[number], string[]>;
const curatedQlIds = new Set(Object.values(curatedByCp).flat());
const curatedQlCount = curatedQlIds.size;

assert.equal(
  curatedQlCount,
  73,
  "PCT-002 curated default bank size changed; review diversity thresholds before accepting the change.",
);

const selections: Array<{ cpId: string; qlId: string }> = [];

for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  for (let slotIndex = 0; slotIndex < ARITHMETIC_SLOTS; slotIndex += 1) {
    const seed =
      `${SEED_PREFIX}:shadow:${sectionIndex}:ARITHMETIC_CORE:${slotIndex}`;
    const batch = await generateQuestion({
      packageId: "PCT-002" as any,
      language: "en",
      seed,
      count: 1,
    } as any);
    const question = (batch as any)?.questions?.[0];
    const cpId = String(
      question?.canonicalProblemId ??
        question?.metadata?.canonicalProblemId ??
        question?.debugMetadata?.canonicalProblemId ??
        "",
    );
    const qlId = String(
      question?.questionLanguageId ??
        question?.metadata?.questionLanguageId ??
        question?.debugMetadata?.questionLanguageId ??
        "",
    );
    assert.ok(cpId, "PCT-002 structured single-question request lost CP lineage.");
    assert.ok(qlId, "PCT-002 structured single-question request lost QL lineage.");
    assert.equal(question?.options?.length, 4, "PCT-002 must preserve four-option output.");
    assert.ok(
      curatedByCp[cpId as (typeof PCT_002_CP_IDS)[number]]?.includes(qlId),
      `PCT-002 default Question Studio selected non-curated QL ${qlId} for ${cpId}.`,
    );
    selections.push({ cpId, qlId });
  }
}

assert.equal(selections.length, EXPECTED_SAMPLES);

const countBy = (values: readonly string[]) => {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
};

const cpDistribution = countBy(selections.map((entry) => entry.cpId));
const qlDistribution = countBy(selections.map((entry) => entry.qlId));
const uniqueQls = Object.keys(qlDistribution).length;
const curatedCoverageRate = uniqueQls / curatedQlCount;
const maxQlReuse = Math.max(...Object.values(qlDistribution));

assert.equal(
  Object.keys(cpDistribution).length,
  EXPECTED_CP_COUNT,
  "PCT-002 structured single-question seeds must exercise all 10 CPs.",
);
assert.ok(
  curatedCoverageRate >= MIN_CURATED_COVERAGE_RATE,
  `PCT-002 structured seeds cover only ${uniqueQls}/${curatedQlCount} curated QLs (${curatedCoverageRate}).`,
);
assert.ok(
  maxQlReuse <= MAX_QL_REUSE_COUNT,
  `PCT-002 structured single-question selection reuses one curated QL ${maxQlReuse} times across ${EXPECTED_SAMPLES} samples.`,
);

const repeatSeed = `${SEED_PREFIX}:shadow:7:ARITHMETIC_CORE:4`;
const first = await generateQuestion({
  packageId: "PCT-002" as any,
  language: "en",
  seed: repeatSeed,
  count: 1,
} as any);
const second = await generateQuestion({
  packageId: "PCT-002" as any,
  language: "en",
  seed: repeatSeed,
  count: 1,
} as any);

assert.equal(
  (first as any)?.questions?.[0]?.questionLanguageId,
  (second as any)?.questions?.[0]?.questionLanguageId,
  "PCT-002 fixed seed must keep QL selection deterministic.",
);
assert.equal(
  (first as any)?.questions?.[0]?.canonicalProblemId,
  (second as any)?.questions?.[0]?.canonicalProblemId,
  "PCT-002 fixed seed must keep CP selection deterministic.",
);

console.log(
  "QUANT_V4_PCT002_SINGLE_QUESTION_QL_DISTRIBUTION_P3",
  JSON.stringify({
    samples: selections.length,
    curatedQlCount,
    uniqueCps: Object.keys(cpDistribution).length,
    uniqueQls,
    curatedCoverageRate,
    maxQlReuse,
    maxQlShare: maxQlReuse / selections.length,
    cpDistribution,
  }),
);
console.log("PASS_QUANT_V4_PCT002_SINGLE_QUESTION_QL_DISTRIBUTION_P3");
