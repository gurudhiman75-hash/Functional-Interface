import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  allocateDiDifficultyBands,
  allocateDiNoveltyTiers,
  diDeliveryNoveltySourceContracts,
  diNoveltyLearnerItemKey,
  generateDiDeliveryNoveltyMix,
  normalizeDiDeliveryExamProfile,
  type DiDeliveryExamProfile,
} from "./di-delivery-novelty-mix-v1";

const profiles: readonly DiDeliveryExamProfile[] = [
  "SSC_CGL_TIER_I",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
];
const boundaries = [
  1, 2, 3, 5, 9, 10, 11, 19, 20, 21, 39, 40, 99, 100, 101, 250, 500, 1000,
];
const tiers = ["STANDARD", "FRESH_FAMILIAR", "HIGHER_NOVELTY"];
const bands = ["Easy", "Medium", "Hard"];
const higherModes = [
  "DI011_MIXED_MULTI_CHART",
  "DI003_STACKED_BAR",
  "DI004_THREE_SERIES_LINE",
  "DI013_RADAR",
  "DI014_RADAR_PIE",
];
const mainsHardIneligible = new Set([
  "DI001_BASIC_TABLE",
  "DI003_GROUPED_BAR",
  "DI004_TWO_SERIES_LINE",
  "DI005_HIDDEN_PIE",
  "DI005_VISIBLE_PIE",
  "DI006_BASE_CASELET",
  "DI003_SINGLE_BAR",
  "DI004_SINGLE_LINE",
  "DI005_DONUT",
  "DI003_STACKED_BAR",
  "DI004_THREE_SERIES_LINE",
  "DI013_RADAR",
]);
const shallow = new Map([
  [
    "DI002_ADVANCED_TABLE",
    new Set(["RELATIVE_SELECTED_PERCENT_EXCESS", "COMBINED_SELECTED_RATIO"]),
  ],
  ["DI006_ADVANCED_CASELET", new Set(["REMAINDER_AFTER_GROUP"])],
  ["DI014_RADAR_PIE", new Set(["TWO_CATEGORY_APPLICATION_TOTAL"])],
]);
// Integer percentages provide an independent largest-remainder oracle,
// avoiding the production allocator's floating weights and ordering.
function quota(count: number, weights: number[], names: string[]) {
  const out = weights.map((w) => Math.floor((count * w) / 100));
  const order = weights
    .map((w, i) => ({ i, remainder: (count * w) % 100 }))
    .sort((a, b) => b.remainder - a.remainder || a.i - b.i);
  for (
    let remaining = count - out.reduce((a, b) => a + b, 0), i = 0;
    remaining > 0;
    remaining--, i++
  )
    out[order[i]!.i]!++;
  return Object.fromEntries(names.map((name, i) => [name, out[i]]));
}
function expectedDifficulty(
  count: number,
  profile: DiDeliveryExamProfile,
  difficulty?: string,
) {
  if (difficulty)
    return Object.fromEntries(
      bands.map((b) => [b, b.toLowerCase() === difficulty ? count : 0]),
    );
  return quota(
    count,
    profile === "BANKING_MAINS"
      ? [15, 45, 40]
      : profile === "BANKING_PRELIMS"
        ? [30, 50, 20]
        : [35, 40, 25],
    bands,
  );
}
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const learnerSurface = (q: any) => ({
  id: q.questionId,
  source: q.noveltySourceMode,
  tier: q.noveltyTier,
  stem: q.stem,
  stimulus: q.stimulus,
  stimulusSvgs: q.stimulusSvgs,
  options: q.options,
  optionMetadata: q.optionMetadata,
  correctIndex: q.correctIndex,
  answer: q.answer,
  explanation: q.explanation,
  richExplanation: q.richExplanation,
  difficulty: q.difficultyLabel ?? q.difficulty,
  packageId: q.packageId,
  canonicalProblemId: q.canonicalProblemId,
});

let allocationCases = 0,
  batches = 0,
  questions = 0,
  replays = 0,
  replayedQuestions = 0,
  negativeCases = 0;
const contracts = diDeliveryNoveltySourceContracts();
assert.equal(
  contracts.length,
  23,
  "Review scope contains 23 existing source modes",
);
const modeContracts = new Map(contracts.map((c) => [c.id, c]));
const modeStats = new Map<
  string,
  {
    questions: number;
    stems: Set<string>;
    frames: Set<string>;
    stimuli: Set<string>;
    tasks: Set<string>;
    answerPositions: number[];
  }
>();
const highCoverage = new Set<string>();
const measuredBatches = [];
function verify(
  result: any,
  profile: DiDeliveryExamProfile,
  count: number,
  difficulty?: string,
) {
  assert.equal(result.questions.length, count);
  const expectedTiers = quota(
    count,
    profile === "SSC_CGL_TIER_I" ? [75, 25, 0] : [75, 20, 5],
    tiers,
  );
  const expectedBands = expectedDifficulty(count, profile, difficulty);
  assert.deepEqual(
    result.generationContext.noveltyMix.actualCounts,
    expectedTiers,
  );
  assert.deepEqual(
    result.generationContext.difficultyMix.actualCounts,
    expectedBands,
  );
  const items = new Set<string>(),
    ids = new Set<string>();
  const actualTiers: Record<string, number> = {
    STANDARD: 0,
    FRESH_FAMILIAR: 0,
    HIGHER_NOVELTY: 0,
  };
  const actualBands: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const hardSources = new Map<string, number>();
  for (const [i, q] of result.questions.entries()) {
    const contract = modeContracts.get(q.noveltySourceMode);
    assert(contract, "Unknown source");
    assert(contract.profiles.includes(profile), "Incompatible exam source");
    assert.equal(q.noveltyTier, contract.tier);
    assert.equal(q.packageId, contract.packageId);
    assert.equal(q.canonicalProblemId, contract.canonicalProblemId);
    actualTiers[q.noveltyTier]!++;
    const band = q.difficultyLabel ?? q.difficulty;
    actualBands[band]!++;
    assert.equal(q.options.length, profile === "SSC_CGL_TIER_I" ? 4 : 5);
    assert.equal(new Set(q.options).size, q.options.length);
    assert.equal(q.options[q.correctIndex], String(q.answer));
    assert.equal(q.correct, q.correctIndex);
    if (q.optionMetadata)
      q.optionMetadata.forEach((o: any, index: number) => {
        assert.equal(o.text, q.options[index]);
        if (typeof o.isCorrect === "boolean")
          assert.equal(o.isCorrect, index === q.correctIndex);
      });
    assert(
      q.stem.trim() && q.stimulus && q.explanation,
      "Learner content missing",
    );
    assert.equal(q.mixQuestionIndex, i + 1);
    assert.equal(q.mixQuestionCount, count);
    for (const flag of [
      "questionBankWritable",
      "testEligible",
      "mockTestEligible",
      "publiclyPublishable",
      "automaticStudentPublication",
      "productionReleaseAuthorized",
    ])
      assert.equal(
        q[flag],
        false,
        `${q.noveltySourceMode}: release lock ${flag}`,
      );
    assert.equal(q.manualApprovalRequired, true);
    if (q.validation) assert.equal(q.validation.valid, true);
    const item = diNoveltyLearnerItemKey(q);
    assert(!items.has(item), "Repeated learner item");
    items.add(item);
    assert(!ids.has(q.questionId), "Duplicate question identity");
    ids.add(q.questionId);
    if (q.noveltyTier === "HIGHER_NOVELTY") {
      assert.notEqual(profile, "SSC_CGL_TIER_I");
      assert(higherModes.includes(q.noveltySourceMode));
      highCoverage.add(q.noveltySourceMode);
      if (profile === "BANKING_PRELIMS")
        assert(
          ["DI011_MIXED_MULTI_CHART", "DI013_RADAR"].includes(
            q.noveltySourceMode,
          ),
        );
      if (q.noveltySourceMode === "DI014_RADAR_PIE")
        assert.equal(q.stimulusSvgs.length, 2);
    }
    if (band === "Hard") {
      hardSources.set(
        q.noveltySourceMode,
        (hardSources.get(q.noveltySourceMode) ?? 0) + 1,
      );
      if (profile === "BANKING_MAINS") {
        assert(
          !mainsHardIneligible.has(q.noveltySourceMode),
          "Shallow Mains hard source",
        );
        const task = String(q.taskKind ?? q.kind ?? q.metadata?.taskKind ?? "");
        assert(
          !shallow.get(q.noveltySourceMode)?.has(task),
          "Shallow Mains hard task",
        );
      }
    }
    const stat = modeStats.get(q.noveltySourceMode) ?? {
      questions: 0,
      stems: new Set(),
      frames: new Set(),
      stimuli: new Set(),
      tasks: new Set(),
      answerPositions: [0, 0, 0, 0, 0],
    };
    stat.questions++;
    stat.answerPositions[q.correctIndex]!++;
    stat.stems.add(hash(q.stem));
    stat.frames.add(hash(q.stem.replace(/\d+(?:\.\d+)?/g, "#")));
    stat.stimuli.add(
      hash(diNoveltyLearnerItemKey({ ...q, stem: "", text: "" })),
    );
    stat.tasks.add(String(q.taskKind ?? q.kind ?? q.metadata?.taskKind ?? ""));
    modeStats.set(q.noveltySourceMode, stat);
  }
  assert.deepEqual(actualTiers, expectedTiers);
  assert.deepEqual(actualBands, expectedBands);
  if (profile === "BANKING_MAINS" && expectedBands.Hard! > 0) {
    const H = expectedBands.Hard!,
      D = Math.min(4, H);
    assert(hardSources.size >= D, "Mains hard-source breadth");
    assert(
      Math.max(...hardSources.values()) <= Math.ceil(H / D),
      "Mains source concentration",
    );
  }
  for (let i = 1; i < count; i++)
    assert(
      result.questions[i - 1].noveltyTier === "STANDARD" ||
        result.questions[i].noveltyTier === "STANDARD",
      "Fresh/high tiers cluster",
    );
  const diversity = result.generationContext.noveltyMix.diversity;
  assert.equal(diversity.uniqueLearnerItems, count);
  assert.equal(
    diversity.uniqueStems,
    new Set(
      result.questions.map((q: any) =>
        q.stem.toLowerCase().replace(/\s+/g, " ").trim(),
      ),
    ).size,
  );
  assert.equal(
    diversity.repeatedStemDifferentStimulus,
    count - diversity.uniqueStems,
  );
  batches++;
  questions += count;
  measuredBatches.push({
    profile,
    count,
    difficulty: difficulty ?? "mixed",
    diversity,
    hardSources: Object.fromEntries(hardSources),
  });
}

for (const profile of profiles)
  for (let n = 1; n <= 1000; n++) {
    assert.deepEqual(
      allocateDiNoveltyTiers(n, profile).counts,
      quota(n, profile === "SSC_CGL_TIER_I" ? [75, 25, 0] : [75, 20, 5], tiers),
    );
    assert.deepEqual(
      allocateDiDifficultyBands(n, profile).counts,
      expectedDifficulty(n, profile),
    );
    allocationCases += 2;
  }
for (const profile of profiles)
  for (const difficulty of [undefined, "easy", "medium", "hard"])
    for (const count of boundaries) {
      const request = {
        examProfile: profile,
        difficulty,
        count,
        seed: `EDGE:${profile}:${difficulty}:${count}`,
      };
      const result = await generateDiDeliveryNoveltyMix(request);
      verify(result, profile, count, difficulty);
      if ([1, 20, 1000].includes(count)) {
        const replay = await generateDiDeliveryNoveltyMix(request);
        assert.deepEqual(
          result.questions.map(learnerSurface),
          replay.questions.map(learnerSurface),
          "Complete learner replay",
        );
        assert.deepEqual(
          result.generationContext.noveltyMix,
          replay.generationContext.noveltyMix,
        );
        assert.deepEqual(
          result.generationContext.difficultyMix,
          replay.generationContext.difficultyMix,
        );
        replays++;
        replayedQuestions += count;
      }
    }
for (const profile of profiles)
  for (let seed = 0; seed < 20; seed++) {
    const r = await generateDiDeliveryNoveltyMix({
      examProfile: profile,
      count: 20,
      seed: `DI-EDGE-MOCK:${seed}`,
    });
    verify(r, profile, 20);
  }
for (const source of contracts)
  assert(modeStats.has(source.id), `Unexercised source ${source.id}`);
assert.deepEqual([...highCoverage].sort(), [...higherModes].sort());

const badRequests: any[] = [
  null,
  [],
  { count: 0 },
  { count: -1 },
  { count: 1.5 },
  { count: 1001 },
  { count: NaN },
  { count: Infinity },
  { count: "20" },
  { count: null },
  { examProfile: "SSC CGL Mains" },
  { examProfile: "RRB NTPC" },
  { examProfile: "Punjab State" },
  { examProfile: "unknown" },
  { examProfile: null },
  { examProfile: {} },
  { difficulty: "insane" },
  { difficulty: 5 },
  { difficulty: [] },
  { difficulty: {} },
  { language: "fr" },
  { language: "de" },
  { language: ["en"] },
  { packageId: "DI-001" },
  { patternId: "DI-014" },
  { canonicalProblemId: "DI-CP-001" },
  { packageId: "DI-MIX-001", patternId: "DI-001" },
];
for (const request of badRequests) {
  await assert.rejects(() => generateDiDeliveryNoveltyMix(request));
  negativeCases++;
}
for (const n of [0, -1, 1.5, 1001, NaN, Infinity])
  for (const allocate of [allocateDiNoveltyTiers, allocateDiDifficultyBands]) {
    assert.throws(() => allocate(n, "BANKING_MAINS"));
    negativeCases++;
  }
for (const alias of [
  "BANKING_MAINS",
  "IBPS PO Mains",
  "SBI Clerk Mains",
  "RRB officer scale I mains",
])
  assert.equal(normalizeDiDeliveryExamProfile(alias), "BANKING_MAINS");
assert.equal(normalizeDiDeliveryExamProfile("SSC CGL"), "SSC_CGL_TIER_I");
assert.equal(
  normalizeDiDeliveryExamProfile("SBI PO Prelims"),
  "BANKING_PRELIMS",
);
const item = {
  stem: "How many accepted?",
  stimulus: {
    rows: [{ category: "A", value: 10 }],
    seed: "one",
    metadata: { tag: 1 },
  },
};
assert.equal(
  diNoveltyLearnerItemKey(item),
  diNoveltyLearnerItemKey({
    ...item,
    questionId: "different",
    stimulus: {
      metadata: { tag: 2 },
      seed: "two",
      rows: [{ value: 10, category: "A" }],
    },
  }),
);
assert.notEqual(
  diNoveltyLearnerItemKey(item),
  diNoveltyLearnerItemKey({
    ...item,
    stimulus: { rows: [{ category: "A", value: 20 }] },
  }),
);

console.log(
  JSON.stringify({
    status: "PASS_DI_NOVELTY_EDGE_AUDIT_V2",
    allocationCases,
    batches,
    questions,
    replays,
    replayedQuestions,
    negativeCases,
    sourceModes: modeStats.size,
    higherNoveltySources: [...highCoverage].sort(),
    measuredModes: Object.fromEntries(
      [...modeStats].map(([mode, s]) => [
        mode,
        {
          questions: s.questions,
          uniqueStems: s.stems.size,
          normalizedFrames: s.frames.size,
          uniqueStimuli: s.stimuli.size,
          taskForms: s.tasks.size,
          answerPositions: s.answerPositions,
        },
      ]),
    ),
    measuredBatches,
    scope: "EXISTING_ENGLISH_CONTROLLED_REVIEW_MIX",
    humanLiveApproval: "DEFERRED",
    allPublisherSaturationCertified: false,
  }),
);
