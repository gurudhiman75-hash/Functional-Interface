import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { Eng001CpId, GrammarMutationId, GrammarRuleId } from "../core/types";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../../question-studio/engine-registry";

const CPS = [
  ["ENG-001-CP001", "Subject–Verb Agreement", "GR-SVA-", 10],
  ["ENG-001-CP002", "Tenses and Sequence of Tenses", "GR-TNS-", 10],
  ["ENG-001-CP003", "Articles and Determiners", "GR-ART-", 10],
  ["ENG-001-CP004", "Pronouns", "GR-PRN-", 10],
  ["ENG-001-CP005", "Prepositions", "GR-PRP-", 10],
  ["ENG-001-CP006", "Adjectives, Adverbs and Comparison", "GR-CMP-", 10],
  ["ENG-001-CP007", "Conjunctions & Parallelism", "GR-CON-", 10],
  ["ENG-001-CP008", "Nouns & Quantifiers", "GR-NQN-", 10],
  ["ENG-001-CP009", "Gerunds, Infinitives & Participles", "GR-GIP-", 10],
  ["ENG-001-CP010", "Modifiers", "GR-MOD-", 10],
  ["ENG-001-CP011", "Conditionals", "GR-CND-", 10],
  ["ENG-001-CP012", "Voice & Narration", "GR-VNR-", 12],
  ["ENG-001-CP013", "Common Usage / Idiomatic Grammar", "GR-USG-", 9],
] as const satisfies readonly (readonly [Eng001CpId, string, string, number])[];

const QLS = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const MAX_DISTINCT_RULE_ATTEMPTS = 32;

const LATE_RULE_TYPE_PROOF = ["GR-MOD-001", "GR-CND-001", "GR-VNR-001", "GR-USG-001"] as const satisfies readonly GrammarRuleId[];
const LATE_MUTATION_TYPE_PROOF = [
  "MUT-MOD-DANGLING-PRESENT-001",
  "MUT-CND-ZERO-TENSE-001",
  "MUT-VNR-PASSIVE-PARTICIPLE-001",
  "MUT-USG-PREFER-TO-001",
] as const satisfies readonly GrammarMutationId[];
assert.equal(LATE_RULE_TYPE_PROOF.length, 4);
assert.equal(LATE_MUTATION_TYPE_PROOF.length, 4);

const text = (value: unknown): string => typeof value === "string" ? value.trim() : "";
const strings = (value: unknown): string[] => Array.isArray(value) ? value.map((entry) => String(entry ?? "").trim()) : [];
const integer = (value: unknown): number => Number.isInteger(value) ? Number(value) : -1;

const packageDef = listQuestionStudioPackages().find((entry) => entry.engineId === "language-v1" && entry.packageId === "ENG-001");
assert.ok(packageDef, "ENG-001 package is missing from Question Studio");
assert.deepEqual(packageDef.cpIds, CPS.map(([cpId]) => cpId));
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

const registeredRuleIds = strings(packageDef.metadata?.grammarRuleIds);
assert.equal(registeredRuleIds.length, 131, "ENG-001 must register exactly 131 approved grammar rules");
assert.equal(new Set(registeredRuleIds).size, 131, "ENG-001 grammar rule ids must be unique");
for (const [, , prefix, expected] of CPS) {
  assert.equal(registeredRuleIds.filter((ruleId) => ruleId.startsWith(prefix)).length, expected, `${prefix} rule-count mismatch`);
}

const expectedStemByQl = {
  "ENG-001-QL001": "Identify the part of the sentence that contains an error.",
  "ENG-001-QL002": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
  "ENG-001-QL007": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
} as const;

const reviewRows: Array<{
  cpId: Eng001CpId;
  cpLabel: string;
  qlId: (typeof QLS)[number];
  difficulty: (typeof DIFFICULTIES)[number];
  ruleId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  correctedSentence: string;
  explanation: string;
  candidateId: string;
}> = [];

for (const [cpId, cpLabel] of CPS) {
  for (const difficulty of DIFFICULTIES) {
    const usedRules = new Set<string>();
    for (const qlId of QLS) {
      const baseSeed = `eng001-final-audit-v1:${cpId}:${difficulty}:${qlId}`;
      let selectedRequest: Parameters<typeof generateQuestionStudioQuestions>[0] | undefined;
      let selectedResult: Awaited<ReturnType<typeof generateQuestionStudioQuestions>> | undefined;

      for (let attempt = 0; attempt < MAX_DISTINCT_RULE_ATTEMPTS; attempt += 1) {
        const seed = `${baseSeed}:rule-diversity:${attempt}`;
        const request = {
          engineId: "language-v1" as const,
          packageId: "ENG-001",
          canonicalProblemId: cpId,
          patternId: qlId,
          language: "en" as const,
          difficulty,
          count: 1,
          runtimeMode: "review-only",
          seed,
        };
        const result = await generateQuestionStudioQuestions(request);
        assert.equal(result.questions.length, 1, `${cpId}/${difficulty}/${qlId} did not return one question`);
        const candidateRule = text(result.questions[0]?.ruleId);
        if (!usedRules.has(candidateRule) || attempt === MAX_DISTINCT_RULE_ATTEMPTS - 1) {
          selectedRequest = request;
          selectedResult = result;
          break;
        }
      }

      assert.ok(selectedRequest && selectedResult, `${cpId}/${difficulty}/${qlId} did not produce a review sample`);
      const result = selectedResult;
      const replay = await generateQuestionStudioQuestions(selectedRequest);
      assert.deepEqual(result, replay, `${cpId}/${difficulty}/${qlId} is not deterministic`);

      const question = result.questions[0]!;
      const stem = text(question.stem);
      const options = strings(question.options);
      const correctIndex = integer(question.correctIndex ?? question.correct);
      const explanation = text(question.explanation);
      const correctedSentence = text(question.correctedSentence);
      const ruleId = text(question.ruleId);
      const candidateId = text(question.candidateId);
      usedRules.add(ruleId);

      assert.equal(text(question.cpId), cpId);
      assert.equal(text(question.qlId), qlId);
      assert.equal(text(question.packageId), "ENG-001");
      assert.equal(text(question.difficulty), difficulty);
      assert.equal(stem, expectedStemByQl[qlId]);
      assert.ok(ruleId.startsWith(CPS.find(([id]) => id === cpId)![2]), `${cpId} emitted foreign rule ${ruleId}`);
      assert.ok(candidateId.length > 0, `${cpId} candidate id missing`);
      assert.ok(options.length >= 4 && options.length <= 5, `${cpId}/${qlId} option count is invalid`);
      assert.equal(new Set(options).size, options.length, `${cpId}/${qlId} contains duplicate options`);
      assert.ok(correctIndex >= 0 && correctIndex < options.length, `${cpId}/${qlId} answer index is invalid`);
      assert.ok(correctedSentence.length >= 12, `${cpId}/${qlId} corrected sentence is too short`);
      assert.ok(explanation.length >= 45, `${cpId}/${qlId} explanation is too short`);
      assert.ok(explanation.includes(correctedSentence), `${cpId}/${qlId} explanation does not show the full corrected sentence`);
      assert.doesNotMatch(`${stem}\n${explanation}`, /\b(?:candidateId|mutationId|generationSeed|review-only|Question Studio)\b/i);
      assert.doesNotMatch(explanation, /\bOption\s+[A-E]\b/i, `${cpId}/${qlId} contains option-by-option analysis`);

      if (qlId === "ENG-001-QL001") {
        assert.equal(options.includes("No error"), false, `${cpId} QL001 unexpectedly exposes No error`);
      } else {
        assert.equal(options.at(-1), "No error", `${cpId} ${qlId} must expose No error last`);
      }
      if (qlId === "ENG-001-QL007") {
        assert.equal(correctIndex, options.length - 1, `${cpId} QL007 must be the calibrated no-error form`);
      } else {
        assert.notEqual(correctIndex, options.indexOf("No error"), `${cpId} ${qlId} incorrectly keys No error`);
      }

      reviewRows.push({ cpId, cpLabel, qlId, difficulty, ruleId, stem, options, correctIndex, correctedSentence, explanation, candidateId });
    }
  }
}

assert.equal(reviewRows.length, 117, "Whole-chapter review pack must contain 117 questions");
assert.equal(new Set(reviewRows.map((row) => `${row.stem}\n${row.options.join("\n")}`)).size, 117, "Whole-chapter review pack contains duplicate learner surfaces");
assert.equal(new Set(reviewRows.map((row) => row.candidateId)).size, 117, "Whole-chapter review pack reuses a semantic candidate");

const answerCounts = [0, 0, 0, 0, 0];
for (const row of reviewRows) answerCounts[row.correctIndex] = (answerCounts[row.correctIndex] ?? 0) + 1;

const distinctReviewRules = new Set(reviewRows.map((row) => row.ruleId));
const out: string[] = [
  "# ENG-001 — Whole-Chapter Final Audit Master Review V1",
  "",
  "Status: `FINAL_AUDIT_MASTER_REVIEW_V1__HUMAN_REVIEW_PENDING__NO_PRODUCTION_PROMOTION`",
  "",
  "This deterministic pack samples every implemented Error Spotting checkpoint across every approved difficulty and every permanent QL surface.",
  "",
  `- Checkpoints: ${CPS.length} (CP001–CP013)`,
  `- Registered grammar rules: ${registeredRuleIds.length}`,
  `- Distinct grammar rules represented in this 117-question sample: ${distinctReviewRules.size}`,
  `- Review questions: ${reviewRows.length} (13 CPs × 3 difficulties × 3 QLs)`,
  "- QLs: ENG-001-QL001, ENG-001-QL002, ENG-001-QL007",
  "- Sampling: deterministically prefers distinct rules across the three QLs inside each CP × difficulty block when eligible pools allow it",
  "- Lifecycle: review-only; Question Bank/test/mock/public/automatic learner release remains locked",
  `- Answer positions in this review sample: A ${answerCounts[0]} / B ${answerCounts[1]} / C ${answerCounts[2]} / D ${answerCounts[3]} / E ${answerCounts[4]}`,
  "",
  "## Human review focus",
  "",
  "Review natural exam-style wording, one defensible error, explanation usefulness, corrected-sentence accuracy, difficulty separation, and any repeated semantic pattern that feels mechanical. The instruction stem is intentionally standardized and its repetition is not a defect.",
  "",
];

for (const [cpId, cpLabel] of CPS) {
  out.push(`## ${cpId} — ${cpLabel}`, "");
  for (const difficulty of DIFFICULTIES) {
    out.push(`### ${difficulty}`, "");
    for (const row of reviewRows.filter((entry) => entry.cpId === cpId && entry.difficulty === difficulty)) {
      const answerLabel = String.fromCharCode(65 + row.correctIndex);
      out.push(
        `#### ${row.qlId} · ${row.ruleId}`,
        "",
        row.stem,
        "",
        ...row.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
        "",
        `**Answer:** ${answerLabel}${row.options[row.correctIndex] === "No error" ? " — No error" : ""}`,
        "",
        `**Explanation:** ${row.explanation}`,
        "",
      );
    }
  }
}

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-FINAL-AUDIT-MASTER-REVIEW-V1.md");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${out.join("\n").trim()}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_ENG_001_FINAL_AUDIT_V1",
  checkpoints: CPS.length,
  registeredRules: registeredRuleIds.length,
  distinctReviewRules: distinctReviewRules.size,
  reviewQuestions: reviewRows.length,
  answerCounts,
  outputPath,
}, null, 2));