import { strict as assert } from "node:assert";

import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../../question-studio/engine-registry";

const CPS = [
  ["ENG-001-CP001", "GR-SVA-", 10],
  ["ENG-001-CP002", "GR-TNS-", 10],
  ["ENG-001-CP003", "GR-ART-", 10],
  ["ENG-001-CP004", "GR-PRN-", 10],
  ["ENG-001-CP005", "GR-PRP-", 10],
  ["ENG-001-CP006", "GR-CMP-", 10],
  ["ENG-001-CP007", "GR-CON-", 10],
  ["ENG-001-CP008", "GR-NQN-", 10],
  ["ENG-001-CP009", "GR-GIP-", 10],
  ["ENG-001-CP010", "GR-MOD-", 10],
  ["ENG-001-CP011", "GR-CND-", 10],
  ["ENG-001-CP012", "GR-VNR-", 12],
  ["ENG-001-CP013", "GR-USG-", 9],
] as const;

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const QLS = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const;
const ERROR_QLS = ["ENG-001-QL001", "ENG-001-QL002"] as const;
const SAMPLES_PER_CELL = 60;
const INTERNAL_LEAKAGE = /\b(?:candidateId|mutationId|generationSeed|review[- ]only|Question Studio|runtimeMode|packageId)\b/i;

const asText = (value: unknown) => typeof value === "string" ? value.trim() : "";
const asStrings = (value: unknown) => Array.isArray(value) ? value.map((entry) => String(entry ?? "").trim()) : [];
const wordCount = (value: string) => value.split(/\s+/).filter(Boolean).length;

const packageDef = listQuestionStudioPackages().find((entry) => entry.engineId === "language-v1" && entry.packageId === "ENG-001");
assert.ok(packageDef, "ENG-001 package is missing from Question Studio");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);

const registeredRules = asStrings(packageDef.metadata?.grammarRuleIds);
assert.equal(registeredRules.length, 131);
assert.equal(new Set(registeredRules).size, 131);

const overallRules = new Set<string>();
const cells: Record<string, {
  rules: Set<string>;
  candidates: Set<string>;
  surfaces: Set<string>;
  minWords: number;
  maxWords: number;
}> = {};
const cpRuleCoverage = new Map<string, Set<string>>();
const cpQlRuleCoverage = new Map<string, Set<string>>();
const cpDifficultyRuleCoverage = new Map<string, Set<string>>();
let generated = 0;
let deterministicReplays = 0;

for (const [cpId, prefix, expectedRuleCount] of CPS) {
  const expectedRules = registeredRules.filter((ruleId) => ruleId.startsWith(prefix));
  assert.equal(expectedRules.length, expectedRuleCount, `${cpId} registered rule count mismatch`);
  cpRuleCoverage.set(cpId, new Set());
  for (const qlId of QLS) cpQlRuleCoverage.set(`${cpId}/${qlId}`, new Set());
  for (const difficulty of DIFFICULTIES) cpDifficultyRuleCoverage.set(`${cpId}/${difficulty}`, new Set());

  for (const difficulty of DIFFICULTIES) {
    for (const qlId of QLS) {
      const cellKey = `${cpId}/${difficulty}/${qlId}`;
      const stats = {
        rules: new Set<string>(),
        candidates: new Set<string>(),
        surfaces: new Set<string>(),
        minWords: Number.POSITIVE_INFINITY,
        maxWords: 0,
      };
      cells[cellKey] = stats;

      for (let index = 0; index < SAMPLES_PER_CELL; index += 1) {
        const seed = `eng001-closure-soak-v1:${cpId}:${difficulty}:${qlId}:${index}`;
        const request = {
          engineId: "language-v1" as const,
          packageId: "ENG-001",
          canonicalProblemId: cpId,
          patternId: qlId,
          language: "en" as const,
          difficulty,
          count: 1,
          runtimeMode: "review-only" as const,
          seed,
        };
        const result = await generateQuestionStudioQuestions(request);
        assert.equal(result.questions.length, 1, `${cellKey}/${index} returned ${result.questions.length} questions`);

        if (index === 0 || index === Math.floor(SAMPLES_PER_CELL / 2) || index === SAMPLES_PER_CELL - 1) {
          const replay = await generateQuestionStudioQuestions(request);
          assert.deepEqual(result, replay, `${cellKey}/${index} is not deterministic`);
          deterministicReplays += 1;
        }

        const question = result.questions[0]!;
        const stem = asText(question.stem);
        const options = asStrings(question.options);
        const segments = asStrings(question.segments);
        const explanation = asText(question.explanation);
        const correctedSentence = asText(question.correctedSentence);
        const ruleId = asText(question.ruleId);
        const candidateId = asText(question.candidateId);
        const correctIndex = Number(question.correctIndex ?? question.correct);
        const wasNormalized = asText(question.answerPositionNormalizationId).length > 0;

        assert.equal(asText(question.cpId), cpId, `${cellKey}/${index} cp drift`);
        assert.equal(asText(question.qlId), qlId, `${cellKey}/${index} ql drift`);
        assert.equal(asText(question.difficulty), difficulty, `${cellKey}/${index} difficulty drift`);
        assert.ok(ruleId.startsWith(prefix), `${cellKey}/${index} emitted foreign rule ${ruleId}`);
        assert.ok(registeredRules.includes(ruleId), `${cellKey}/${index} emitted unregistered rule ${ruleId}`);
        assert.ok(candidateId.length > 0, `${cellKey}/${index} candidate id missing`);
        assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < options.length, `${cellKey}/${index} invalid answer index`);
        assert.equal(new Set(options).size, options.length, `${cellKey}/${index} duplicate options`);
        assert.ok(correctedSentence.length >= 12, `${cellKey}/${index} corrected sentence too short`);
        assert.ok(explanation.length >= 45, `${cellKey}/${index} explanation too short`);
        assert.ok(explanation.includes(correctedSentence), `${cellKey}/${index} explanation omits full corrected sentence`);
        assert.doesNotMatch(`${stem}\n${explanation}`, INTERNAL_LEAKAGE, `${cellKey}/${index} leaks internal metadata`);
        assert.doesNotMatch(explanation, /\bOption\s+[A-E]\b/i, `${cellKey}/${index} contains option-by-option analysis`);

        if (qlId === "ENG-001-QL001") {
          assert.equal(options.includes("No error"), false, `${cellKey}/${index} exposes No error`);
        } else {
          assert.equal(options.at(-1), "No error", `${cellKey}/${index} does not keep No error last`);
        }
        if (qlId === "ENG-001-QL007") {
          assert.equal(correctIndex, options.length - 1, `${cellKey}/${index} is not a genuine no-error item`);
        } else {
          assert.notEqual(options[correctIndex], "No error", `${cellKey}/${index} incorrectly keys No error`);
        }

        for (const segment of segments) {
          const words = wordCount(segment);
          stats.minWords = Math.min(stats.minWords, words);
          stats.maxWords = Math.max(stats.maxWords, words);
          assert.ok(words >= 1, `${cellKey}/${index} contains an empty sentence part`);
          const maxPartWords = wasNormalized ? 12 : 18;
          assert.ok(words <= maxPartWords, `${cellKey}/${index} contains an overlong ${words}-word ${wasNormalized ? "normalized" : "authored"} sentence part: ${segment}`);
        }

        if (qlId !== "ENG-001-QL007") {
          const answerLabel = String.fromCharCode(65 + correctIndex);
          const partRefs = [...explanation.matchAll(/\bPart ([A-D])\b/g)].map((match) => match[1]);
          if (partRefs.length > 0) {
            assert.ok(partRefs.every((label) => label === answerLabel), `${cellKey}/${index} explanation points to ${partRefs.join(",")} but answer is ${answerLabel}`);
          }
        }

        stats.rules.add(ruleId);
        stats.candidates.add(candidateId);
        stats.surfaces.add(`${stem}\n${options.join("\n")}`);
        overallRules.add(ruleId);
        cpRuleCoverage.get(cpId)!.add(ruleId);
        cpQlRuleCoverage.get(`${cpId}/${qlId}`)!.add(ruleId);
        cpDifficultyRuleCoverage.get(`${cpId}/${difficulty}`)!.add(ruleId);
        generated += 1;
      }

      const minimumRuleBreadth = qlId === "ENG-001-QL007" ? 2 : 3;
      assert.ok(stats.rules.size >= minimumRuleBreadth, `${cellKey} exposes too few rule families (${stats.rules.size})`);
      assert.ok(stats.candidates.size >= stats.rules.size, `${cellKey} has shallower candidate depth than rule breadth`);
      if (qlId === "ENG-001-QL007") {
        // Calibrated no-error generators may use multiple internal candidate IDs
        // for the same accepted correct surface. Require learner-visible breadth
        // at least as large as rule breadth, rather than artificial 1:1 ID parity.
        assert.ok(stats.surfaces.size >= stats.rules.size, `${cellKey} exposes too few calibrated learner surfaces (${stats.surfaces.size})`);
      } else {
        assert.ok(stats.surfaces.size >= stats.candidates.size, `${cellKey} collapses distinct error candidates onto too few learner surfaces`);
      }
    }
  }

  assert.deepEqual([...cpRuleCoverage.get(cpId)!].sort(), expectedRules.sort(), `${cpId} did not exercise its complete registered rule inventory`);
  for (const qlId of ERROR_QLS) {
    assert.deepEqual([...cpQlRuleCoverage.get(`${cpId}/${qlId}`)!].sort(), expectedRules.sort(), `${cpId}/${qlId} did not exercise every checkpoint rule across the approved difficulties`);
  }
  assert.ok(cpQlRuleCoverage.get(`${cpId}/ENG-001-QL007`)!.size >= 2, `${cpId}/ENG-001-QL007 has insufficient calibrated rule breadth`);
  for (const difficulty of DIFFICULTIES) {
    assert.ok(cpDifficultyRuleCoverage.get(`${cpId}/${difficulty}`)!.size >= 3, `${cpId}/${difficulty} exposes too little total rule breadth`);
  }
}

assert.equal(generated, CPS.length * DIFFICULTIES.length * QLS.length * SAMPLES_PER_CELL);
assert.equal(deterministicReplays, CPS.length * DIFFICULTIES.length * QLS.length * 3);
assert.deepEqual([...registeredRules].sort(), [...overallRules].sort(), "The closure soak did not exercise every registered rule");

console.log(JSON.stringify({
  status: "PASS_ENG_001_CLOSURE_SOAK_V1",
  generated,
  deterministicReplays,
  registeredRules: registeredRules.length,
  exercisedRules: overallRules.size,
  samplesPerCell: SAMPLES_PER_CELL,
  cells: Object.fromEntries(Object.entries(cells).map(([key, value]) => [key, {
    rules: value.rules.size,
    candidates: value.candidates.size,
    surfaces: value.surfaces.size,
    minWords: value.minWords,
    maxWords: value.maxWords,
  }])),
}, null, 2));
