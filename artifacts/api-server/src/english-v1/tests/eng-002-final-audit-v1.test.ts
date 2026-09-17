import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../../question-studio/engine-registry";

const PACKAGE_ID = "english-eng002-sentence-improvement-v1" as const;
const CPS = [
  ["ENG-002-CP001", "Subject–Verb Agreement", "GR-SVA-", 10],
  ["ENG-002-CP002", "Tenses and Sequence of Tenses", "GR-TNS-", 10],
  ["ENG-002-CP003", "Articles and Determiners", "GR-ART-", 10],
  ["ENG-002-CP004", "Pronouns", "GR-PRN-", 10],
  ["ENG-002-CP005", "Prepositions", "GR-PRP-", 10],
  ["ENG-002-CP006", "Adjectives, Adverbs and Comparison", "GR-CMP-", 10],
  ["ENG-002-CP007", "Conjunctions & Parallelism", "GR-CON-", 10],
  ["ENG-002-CP008", "Nouns & Quantifiers", "GR-NQN-", 10],
  ["ENG-002-CP009", "Gerunds, Infinitives & Participles", "GR-GIP-", 10],
  ["ENG-002-CP010", "Modifiers", "GR-MOD-", 10],
  ["ENG-002-CP011", "Conditionals", "GR-CND-", 10],
  ["ENG-002-CP012", "Voice & Narration", "GR-VNR-", 12],
  ["ENG-002-CP013", "Common Usage / Idiomatic Grammar", "GR-USG-", 9],
] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const SAMPLES_PER_DIFFICULTY = 3;
const MAX_DISTINCT_RULE_ATTEMPTS = 40;
const INTERNAL_LEAKAGE = /\b(?:candidateId|mutationId|generationSeed|review-only|Question Studio|runtimeMode|packageId|registrationAuthorityId)\b/i;

const text = (value: unknown): string => typeof value === "string" ? value.trim() : "";
const strings = (value: unknown): string[] => Array.isArray(value) ? value.map((entry) => String(entry ?? "").trim()) : [];
const stripTags = (value: string) => value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

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
assert.equal(packageDef.metadata?.deterministicGeneration, true);

const registeredRuleIds = strings(packageDef.metadata?.grammarRuleIds);
assert.equal(registeredRuleIds.length, 131, "ENG-002 must register exactly 131 approved grammar rules");
assert.equal(new Set(registeredRuleIds).size, 131, "ENG-002 grammar rule ids must be unique");
for (const [, , prefix, expected] of CPS) {
  assert.equal(registeredRuleIds.filter((ruleId) => ruleId.startsWith(prefix)).length, expected, `${prefix} rule-count mismatch`);
}

type ReviewRow = {
  cpId: string;
  cpLabel: string;
  difficulty: (typeof DIFFICULTIES)[number];
  ruleId: string;
  stem: string;
  sentence: string;
  options: string[];
  correctIndex: number;
  correctedSentence: string;
  explanation: string;
  questionId: string;
};
const reviewRows: ReviewRow[] = [];

for (const [cpId, cpLabel, prefix] of CPS) {
  for (const difficulty of DIFFICULTIES) {
    const usedRules = new Set<string>();
    for (let sample = 0; sample < SAMPLES_PER_DIFFICULTY; sample += 1) {
      let selectedRequest: Parameters<typeof generateQuestionStudioQuestions>[0] | undefined;
      let selectedResult: Awaited<ReturnType<typeof generateQuestionStudioQuestions>> | undefined;

      for (let attempt = 0; attempt < MAX_DISTINCT_RULE_ATTEMPTS; attempt += 1) {
        const request = {
          engineId: "language-v1" as const,
          packageId: PACKAGE_ID,
          canonicalProblemId: cpId,
          patternId: cpId,
          language: "en" as const,
          difficulty,
          count: 1,
          runtimeMode: "review-only" as const,
          seed: `eng002-final-audit-v1:${cpId}:${difficulty}:${sample}:rule-diversity:${attempt}`,
        };
        const result = await generateQuestionStudioQuestions(request);
        assert.equal(result.questions.length, 1, `${cpId}/${difficulty}/${sample} did not return one question`);
        const candidateRule = text(result.questions[0]?.ruleId);
        if (!usedRules.has(candidateRule) || attempt === MAX_DISTINCT_RULE_ATTEMPTS - 1) {
          selectedRequest = request;
          selectedResult = result;
          break;
        }
      }

      assert.ok(selectedRequest && selectedResult, `${cpId}/${difficulty}/${sample} did not produce a review sample`);
      const replay = await generateQuestionStudioQuestions(selectedRequest);
      assert.deepEqual(selectedResult, replay, `${cpId}/${difficulty}/${sample} is not deterministic`);

      const question = selectedResult.questions[0]!;
      const stem = text(question.stem);
      const sentence = text(question.sentence);
      const targetText = text(question.targetText);
      const options = strings(question.options);
      const correctIndex = Number(question.correctIndex ?? question.correct);
      const correctedSentence = text(question.correctedSentence);
      const explanation = text(question.explanation);
      const ruleId = text(question.ruleId);
      const questionId = text(question.questionId ?? question.id);
      usedRules.add(ruleId);

      assert.equal(text(question.packageId), PACKAGE_ID);
      assert.equal(text(question.cpId), cpId);
      assert.equal(text(question.difficulty), difficulty);
      assert.ok(ruleId.startsWith(prefix), `${cpId} emitted foreign rule ${ruleId}`);
      assert.ok(registeredRuleIds.includes(ruleId), `${cpId} emitted unregistered rule ${ruleId}`);
      assert.ok(questionId.length > 0, `${cpId}/${difficulty}/${sample} question id missing`);
      assert.ok(stem.length >= 25 && stem.length <= 220, `${cpId}/${difficulty}/${sample} instruction stem length is abnormal`);
      assert.match(stem, /underlined part/i, `${cpId}/${difficulty}/${sample} is not rendered as a Sentence Improvement instruction`);
      assert.ok(sentence.length >= 15, `${cpId}/${difficulty}/${sample} sentence is too short`);
      assert.equal((sentence.match(/<u>/g) ?? []).length, 1, `${cpId}/${difficulty}/${sample} must expose exactly one underlined target`);
      assert.equal((sentence.match(/<\/u>/g) ?? []).length, 1, `${cpId}/${difficulty}/${sample} must close exactly one underlined target`);
      assert.doesNotMatch(sentence, /\s\/\s/, `${cpId}/${difficulty}/${sample} leaked Error Spotting slash segmentation`);
      assert.ok(targetText.length > 0, `${cpId}/${difficulty}/${sample} target text missing`);
      assert.ok(stripTags(sentence).toLowerCase().includes(targetText.replace(/[,.;:!?]+$/, "").toLowerCase()), `${cpId}/${difficulty}/${sample} target text is not present in the learner sentence`);
      assert.equal(options.length, 4, `${cpId}/${difficulty}/${sample} must expose exactly four options`);
      assert.equal(options[3], "No improvement", `${cpId}/${difficulty}/${sample} must keep No improvement as option D`);
      assert.equal(new Set(options.map((option) => option.toLowerCase())).size, 4, `${cpId}/${difficulty}/${sample} contains duplicate options`);
      assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${cpId}/${difficulty}/${sample} answer index is invalid`);
      assert.ok(correctedSentence.length >= 12, `${cpId}/${difficulty}/${sample} corrected sentence is too short`);
      assert.ok(explanation.length >= 45, `${cpId}/${difficulty}/${sample} explanation is too short`);
      assert.ok(explanation.includes(correctedSentence), `${cpId}/${difficulty}/${sample} explanation does not show the full corrected sentence`);
      assert.match(explanation, /Concept:/, `${cpId}/${difficulty}/${sample} explanation does not teach the concept`);
      assert.match(explanation, /Here[:,]/, `${cpId}/${difficulty}/${sample} explanation does not apply the concept to the sentence`);
      assert.doesNotMatch(`${stem}\n${sentence}\n${explanation}`, INTERNAL_LEAKAGE, `${cpId}/${difficulty}/${sample} leaks internal metadata`);
      assert.doesNotMatch(explanation, /\bOption\s+[A-D]\b/i, `${cpId}/${difficulty}/${sample} contains option-by-option analysis`);

      reviewRows.push({ cpId, cpLabel, difficulty, ruleId, stem, sentence, options, correctIndex, correctedSentence, explanation, questionId });
    }
  }
}

assert.equal(reviewRows.length, 117, "Whole-chapter review pack must contain 117 questions");
assert.equal(new Set(reviewRows.map((row) => `${row.sentence}\n${row.options.join("\n")}`)).size, 117, "Whole-chapter review pack contains duplicate learner surfaces");
assert.equal(new Set(reviewRows.map((row) => row.questionId)).size, 117, "Whole-chapter review pack reuses a question id");

const distinctReviewRules = new Set(reviewRows.map((row) => row.ruleId));
const answerCounts = [0, 0, 0, 0];
for (const row of reviewRows) answerCounts[row.correctIndex] += 1;
assert.ok(distinctReviewRules.size >= 70, `Master review reaches only ${distinctReviewRules.size}/131 rules`);
assert.ok(answerCounts.every((count) => count >= 15), `Master review has weak answer-position spread: ${answerCounts.join("/")}`);

const out: string[] = [
  "# ENG-002 — Whole-Chapter Final Audit Master Review V1",
  "",
  "Status: `FINAL_AUDIT_MASTER_REVIEW_V1__HUMAN_REVIEW_PENDING__NO_PRODUCTION_PROMOTION`",
  "",
  "This deterministic pack samples every implemented Sentence Improvement checkpoint across every approved difficulty.",
  "",
  `- Checkpoints: ${CPS.length} (CP001–CP013)`,
  `- Registered grammar rules: ${registeredRuleIds.length}`,
  `- Distinct grammar rules represented in this 117-question sample: ${distinctReviewRules.size}`,
  `- Review questions: ${reviewRows.length} (13 CPs × 3 difficulties × 3 samples)`,
  `- Answer positions: A ${answerCounts[0]} / B ${answerCounts[1]} / C ${answerCounts[2]} / D ${answerCounts[3]}`,
  "- Option D is the permanent `No improvement` position",
  "- Lifecycle: review-only; Question Bank/test/mock/public/automatic learner release remains locked",
  "",
  "## Human review focus",
  "",
  "Review exam-natural sentence wording, exact underlined replacement span, one defensible improvement, plausible distractors, useful simple explanations, difficulty separation, and repeated semantic patterns. The Sentence Improvement instruction itself is intentionally standardized and its repetition is not a defect.",
  "",
];

for (const [cpId, cpLabel] of CPS) {
  out.push(`## ${cpId} — ${cpLabel}`, "");
  for (const difficulty of DIFFICULTIES) {
    out.push(`### ${difficulty}`, "");
    for (const row of reviewRows.filter((entry) => entry.cpId === cpId && entry.difficulty === difficulty)) {
      const answerLabel = String.fromCharCode(65 + row.correctIndex);
      out.push(
        `#### ${row.ruleId}`,
        "",
        row.stem,
        "",
        row.sentence,
        "",
        ...row.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
        "",
        `**Answer:** ${answerLabel}${row.correctIndex === 3 ? " — No improvement" : ""}`,
        "",
        `**Explanation:** ${row.explanation}`,
        "",
      );
    }
  }
}

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-002-FINAL-AUDIT-MASTER-REVIEW-V1.md");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${out.join("\n").trim()}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_ENG_002_FINAL_AUDIT_V1",
  checkpoints: CPS.length,
  registeredRules: registeredRuleIds.length,
  distinctReviewRules: distinctReviewRules.size,
  reviewQuestions: reviewRows.length,
  answerCounts,
  outputPath,
}, null, 2));
