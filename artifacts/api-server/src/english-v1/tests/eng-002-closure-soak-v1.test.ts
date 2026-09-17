import { strict as assert } from "node:assert";

import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../../question-studio/engine-registry";

const PACKAGE_ID = "english-eng002-sentence-improvement-v1" as const;
const CPS = [
  ["ENG-002-CP001", "GR-SVA-", 10],
  ["ENG-002-CP002", "GR-TNS-", 10],
  ["ENG-002-CP003", "GR-ART-", 10],
  ["ENG-002-CP004", "GR-PRN-", 10],
  ["ENG-002-CP005", "GR-PRP-", 10],
  ["ENG-002-CP006", "GR-CMP-", 10],
  ["ENG-002-CP007", "GR-CON-", 10],
  ["ENG-002-CP008", "GR-NQN-", 10],
  ["ENG-002-CP009", "GR-GIP-", 10],
  ["ENG-002-CP010", "GR-MOD-", 10],
  ["ENG-002-CP011", "GR-CND-", 10],
  ["ENG-002-CP012", "GR-VNR-", 12],
  ["ENG-002-CP013", "GR-USG-", 9],
] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const SAMPLES_PER_CELL = 100;
const INTERNAL_LEAKAGE = /\b(?:candidateId|mutationId|generationSeed|review-only|Question Studio|runtimeMode|packageId|registrationAuthorityId)\b/i;

const asText = (value: unknown) => typeof value === "string" ? value.trim() : "";
const asStrings = (value: unknown) => Array.isArray(value) ? value.map((entry) => String(entry ?? "").trim()) : [];
const stripTags = (value: string) => value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const wordCount = (value: string) => value.split(/\s+/).filter(Boolean).length;

const packageDef = listQuestionStudioPackages().find((entry) => entry.engineId === "language-v1" && entry.packageId === PACKAGE_ID);
assert.ok(packageDef, "ENG-002 package is missing from Question Studio");
assert.deepEqual(packageDef.cpIds, CPS.map(([cpId]) => cpId));
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

const registeredRules = asStrings(packageDef.metadata?.grammarRuleIds);
assert.equal(registeredRules.length, 131);
assert.equal(new Set(registeredRules).size, 131);

const overallRules = new Set<string>();
const cpRuleCoverage = new Map<string, Set<string>>();
const cells: Record<string, {
  rules: Set<string>;
  surfaces: Set<string>;
  domains: Set<string>;
  answers: number[];
}> = {};
let generated = 0;
let deterministicReplays = 0;

for (const [cpId, prefix, expectedRuleCount] of CPS) {
  const expectedRules = registeredRules.filter((ruleId) => ruleId.startsWith(prefix));
  assert.equal(expectedRules.length, expectedRuleCount, `${cpId} registered rule count mismatch`);
  cpRuleCoverage.set(cpId, new Set());

  for (const difficulty of DIFFICULTIES) {
    const cellKey = `${cpId}/${difficulty}`;
    const stats = {
      rules: new Set<string>(),
      surfaces: new Set<string>(),
      domains: new Set<string>(),
      answers: [0, 0, 0, 0],
    };
    cells[cellKey] = stats;

    for (let index = 0; index < SAMPLES_PER_CELL; index += 1) {
      const request = {
        engineId: "language-v1" as const,
        packageId: PACKAGE_ID,
        canonicalProblemId: cpId,
        patternId: cpId,
        language: "en" as const,
        difficulty,
        count: 1,
        runtimeMode: "review-only" as const,
        seed: `eng002-closure-soak-v1:${cpId}:${difficulty}:${index}`,
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
      const sentence = asText(question.sentence);
      const targetText = asText(question.targetText);
      const options = asStrings(question.options);
      const explanation = asText(question.explanation);
      const correctedSentence = asText(question.correctedSentence);
      const ruleId = asText(question.ruleId);
      const semanticDomain = asText(question.semanticDomain);
      const correctIndex = Number(question.correctIndex ?? question.correct);

      assert.equal(asText(question.packageId), PACKAGE_ID, `${cellKey}/${index} package drift`);
      assert.equal(asText(question.cpId), cpId, `${cellKey}/${index} cp drift`);
      assert.equal(asText(question.difficulty), difficulty, `${cellKey}/${index} difficulty drift`);
      assert.ok(ruleId.startsWith(prefix), `${cellKey}/${index} emitted foreign rule ${ruleId}`);
      assert.ok(registeredRules.includes(ruleId), `${cellKey}/${index} emitted unregistered rule ${ruleId}`);
      assert.match(stem, /underlined part/i, `${cellKey}/${index} lost the Sentence Improvement instruction`);
      assert.equal((sentence.match(/<u>/g) ?? []).length, 1, `${cellKey}/${index} must expose exactly one underlined target`);
      assert.equal((sentence.match(/<\/u>/g) ?? []).length, 1, `${cellKey}/${index} must close exactly one underlined target`);
      assert.doesNotMatch(sentence, /\s\/\s/, `${cellKey}/${index} leaked Error Spotting slash segmentation`);
      assert.ok(targetText.length > 0, `${cellKey}/${index} target text missing`);
      assert.ok(stripTags(sentence).toLowerCase().includes(targetText.replace(/[,.;:!?]+$/, "").toLowerCase()), `${cellKey}/${index} target text is absent from learner sentence`);
      assert.equal(options.length, 4, `${cellKey}/${index} option count drifted`);
      assert.equal(options[3], "No improvement", `${cellKey}/${index} must keep No improvement as D`);
      assert.equal(new Set(options.map((option) => option.toLowerCase())).size, 4, `${cellKey}/${index} duplicate options`);
      assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${cellKey}/${index} invalid answer index`);
      assert.ok(correctedSentence.length >= 12, `${cellKey}/${index} corrected sentence too short`);
      assert.ok(explanation.length >= 80, `${cellKey}/${index} explanation too short to be helpful`);
      assert.ok(wordCount(explanation) >= 14, `${cellKey}/${index} explanation is too terse`);
      assert.ok(explanation.includes(correctedSentence), `${cellKey}/${index} explanation omits corrected sentence`);
      assert.match(explanation, /Correct sentence:/i, `${cellKey}/${index} explanation does not identify the corrected sentence`);
      assert.doesNotMatch(`${stem}\n${sentence}\n${explanation}`, INTERNAL_LEAKAGE, `${cellKey}/${index} leaks internal metadata`);
      assert.doesNotMatch(explanation, /\bOption\s+[A-D]\b/i, `${cellKey}/${index} contains option-by-option analysis`);
      assert.equal(asText(question.registrationStatus), "REGISTERED_REVIEW_ONLY", `${cellKey}/${index} lost review-only registration`);
      assert.equal(question.reviewOnly, true, `${cellKey}/${index} lost reviewOnly=true`);
      assert.equal(question.productionReleased, false, `${cellKey}/${index} unexpectedly claims production release`);

      stats.rules.add(ruleId);
      stats.surfaces.add(`${sentence}\n${options.join("\n")}`);
      if (semanticDomain) stats.domains.add(semanticDomain);
      stats.answers[correctIndex] += 1;
      cpRuleCoverage.get(cpId)!.add(ruleId);
      overallRules.add(ruleId);
      generated += 1;
    }

    assert.ok(stats.rules.size >= 3, `${cellKey} exposes only ${stats.rules.size} rule families`);
    assert.ok(stats.surfaces.size >= 15, `${cellKey} exposes only ${stats.surfaces.size} learner surfaces`);
    if (stats.domains.size > 0) assert.ok(stats.domains.size >= 8, `${cellKey} exposes only ${stats.domains.size} semantic domains`);
    for (let option = 0; option < 4; option += 1) {
      assert.ok(stats.answers[option]! >= 10, `${cellKey} answer ${String.fromCharCode(65 + option)} appears only ${stats.answers[option]} times`);
      assert.ok(stats.answers[option]! <= 45, `${cellKey} answer ${String.fromCharCode(65 + option)} dominates at ${stats.answers[option]}%`);
    }
  }

  assert.deepEqual([...cpRuleCoverage.get(cpId)!].sort(), expectedRules.sort(), `${cpId} did not exercise its complete registered rule inventory`);
}

assert.equal(generated, CPS.length * DIFFICULTIES.length * SAMPLES_PER_CELL);
assert.equal(generated, 3900);
assert.equal(deterministicReplays, CPS.length * DIFFICULTIES.length * 3);
assert.deepEqual([...overallRules].sort(), [...registeredRules].sort(), "The ENG-002 closure soak did not exercise every registered rule");

console.log(JSON.stringify({
  status: "PASS_ENG_002_CLOSURE_SOAK_V1",
  generated,
  deterministicReplays,
  registeredRules: registeredRules.length,
  exercisedRules: overallRules.size,
  samplesPerCell: SAMPLES_PER_CELL,
  cells: Object.fromEntries(Object.entries(cells).map(([key, value]) => [key, {
    rules: value.rules.size,
    surfaces: value.surfaces.size,
    domains: value.domains.size,
    answers: value.answers,
  }])),
}, null, 2));
