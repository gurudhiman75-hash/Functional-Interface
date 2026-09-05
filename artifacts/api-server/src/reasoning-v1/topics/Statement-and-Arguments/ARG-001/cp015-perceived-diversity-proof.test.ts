import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  ARG_CP015_AUTHORITY,
  ARG_CP015_CHECKPOINT_ID,
  ARG_CP015_LEARNER_RELEASE,
  ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  generateArgCp015QuestionStudioBatch,
} from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const REAL_PAPER_CELLS = [
  ["SSC_RECENT_2X4", "Easy"],
  ["SSC_RECENT_2X4", "Medium"],
  ["BANKING_CLASSIC_2X5", "Medium"],
  ["BANKING_CLASSIC_2X5", "Hard"],
  ["BANKING_COMBO_3X5", "Medium"],
  ["BANKING_COMBO_3X5", "Hard"],
  ["BANKING_COMBO_4X5", "Hard"],
] as const;

type Q = Readonly<Record<string, any>>;

function signature(question: Q): string {
  return createHash("sha256").update(JSON.stringify([
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ])).digest("hex");
}

function words(value: unknown): number {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

const questions: Q[] = [];
const profiles = new Map<string, Q[]>();
const coreTemplates = new Set<string>();

function record(batch: ReturnType<typeof generateArgCp015QuestionStudioBatch>, profile: string) {
  for (const question of batch.questions as readonly Q[]) {
    questions.push(question);
    const list = profiles.get(profile) ?? [];
    list.push(question);
    profiles.set(profile, list);
    if (profile === "CORE") coreTemplates.add(String(question.templateId));

    assert.equal(question.checkpointId, ARG_CP015_CHECKPOINT_ID);
    assert.equal(question.currentQuestionStudioAuthority, ARG_CP015_QUESTION_STUDIO_AUTHORITY);
    assert.equal(question.manualApprovalRequired, false);
    assert.equal(question.persistenceAllowed, true);
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligible, true);
    assert.equal(question.mockTestEligible, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.publicReleaseAuthorized, false);
    assert.equal(question.studentDeliveryAuthorized, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.learnerRelease, ARG_CP015_LEARNER_RELEASE);
  }
}

for (const qlId of ARG_QL_IDS) {
  for (let index = 0; index < DIFFICULTIES.length; index += 1) {
    const difficulty = DIFFICULTIES[index]!;
    const count = index === 0 ? 34 : 33;
    const input = {
      profileMode: "core",
      qlId,
      language: "en",
      difficulty,
      seed: `ARG-CP015-DIVERSITY-CORE:${qlId}:${difficulty}`,
      count,
    } as const;
    const a = generateArgCp015QuestionStudioBatch(input);
    const b = generateArgCp015QuestionStudioBatch(input);
    assert.deepEqual(a, b, `${qlId}/${difficulty}: CP015 core replay drift`);
    assert.equal(new Set(a.questions.map((question) => signature(question as Q))).size, count, `${qlId}/${difficulty}: duplicate inside core batch`);
    record(a, "CORE");
  }
}

for (let qlIndex = 0; qlIndex < ARG_QL_IDS.length; qlIndex += 1) {
  const qlId = ARG_QL_IDS[qlIndex]!;
  const target = qlIndex < 4 ? 67 : 66;
  const base = Math.floor(target / REAL_PAPER_CELLS.length);
  const extra = target - base * REAL_PAPER_CELLS.length;
  for (let cellIndex = 0; cellIndex < REAL_PAPER_CELLS.length; cellIndex += 1) {
    const [examProfile, difficulty] = REAL_PAPER_CELLS[cellIndex]!;
    const count = base + (cellIndex < extra ? 1 : 0);
    const input = {
      profileMode: "real-paper",
      examProfile,
      qlId,
      language: "en",
      difficulty,
      seed: `ARG-CP015-DIVERSITY-RP:${qlId}:${examProfile}:${difficulty}`,
      count,
    } as const;
    const a = generateArgCp015QuestionStudioBatch(input);
    const b = generateArgCp015QuestionStudioBatch(input);
    assert.deepEqual(a, b, `${qlId}/${examProfile}/${difficulty}: CP015 replay drift`);
    assert.equal(new Set(a.questions.map((question) => signature(question as Q))).size, count, `${qlId}/${examProfile}/${difficulty}: duplicate inside real-paper batch`);

    for (const question of a.questions as readonly Q[]) {
      assert.equal(question.profileMode, "real-paper");
      assert.equal(question.examProfile, examProfile);
      if (examProfile === "SSC_RECENT_2X4") {
        assert.equal(question.arguments.length, 2);
        assert.equal(question.options.length, 4);
        assert.ok(words(question.statement) <= 24, `${question.questionId}: SSC CP015 statement is too long`);
        assert.ok(question.arguments.every((argument: string) => words(argument) <= 34), `${question.questionId}: SSC CP015 argument is too long`);
      } else if (examProfile === "BANKING_CLASSIC_2X5") {
        assert.equal(question.arguments.length, 2);
        assert.equal(question.options.length, 5);
        assert.match(String(question.options[2]), /Either|या तो|ਜਾਂ/);
        assert.notEqual(question.correctIndex, 2, "Either-I-or-II remains a distractor, not a semantic truth class.");
      } else if (examProfile === "BANKING_COMBO_3X5") {
        assert.equal(question.arguments.length, 3);
        assert.equal(question.options.length, 5);
      } else {
        assert.equal(question.arguments.length, 4);
        assert.equal(question.options.length, 5);
      }
    }
    record(a, examProfile);
  }
}

assert.equal(questions.length, 1000);
assert.equal(coreTemplates.size, 48, "CP015 must retain all 48 approved core templates in the 600-question audit corpus.");

const allSignatures = questions.map(signature);
const unique = new Set(allSignatures).size;
const signatureGroups = new Map<string, Q[]>();
for (const question of questions) {
  const key = signature(question);
  const group = signatureGroups.get(key) ?? [];
  group.push(question);
  signatureGroups.set(key, group);
}
const duplicateGroups = [...signatureGroups.entries()]
  .filter(([, items]) => items.length > 1)
  .map(([key, items]) => ({
    signature: key.slice(0, 16),
    occurrences: items.map((question) => ({
      questionId: String(question.questionId ?? ""),
      qlId: String(question.qlId ?? ""),
      difficulty: String(question.difficulty ?? ""),
      examProfile: String(question.examProfile ?? "CORE"),
      templateId: String(question.templateId ?? ""),
      scenarioId: String(question.scenarioId ?? ""),
      statement: String(question.statement ?? ""),
    })),
  }));
assert.equal(
  unique,
  1000,
  `CP015 1000-question corpus contains ${1000 - unique} exact duplicates.\n${JSON.stringify(duplicateGroups, null, 2)}`,
);

for (const [profile, items] of profiles) {
  const uniqueProfile = new Set(items.map(signature)).size;
  assert.equal(uniqueProfile, items.length, `${profile}: ${items.length - uniqueProfile} duplicates remain.`);
}

const realPaper = questions.filter((question) => question.profileMode === "real-paper");
const realPaperStatements = new Set(realPaper.map((question) => String(question.statement))).size;
assert.ok(realPaperStatements >= 200, `CP015 real-paper statement variety too low: ${realPaperStatements}/400 unique statements`);

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_PERCEIVED_DIVERSITY",
  authority: ARG_CP015_AUTHORITY,
  checkpointId: ARG_CP015_CHECKPOINT_ID,
  questionStudioAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  totalQuestions: questions.length,
  exactUniqueQuestions: unique,
  exactDuplicateQuestions: questions.length - unique,
  coreTemplateCoverage: coreTemplates.size,
  realPaperUniqueStatements: realPaperStatements,
  profileUniqueness: Object.fromEntries([...profiles].map(([profile, items]) => [profile, `${new Set(items.map(signature)).size}/${items.length}`])),
  learnerRelease: ARG_CP015_LEARNER_RELEASE,
  publicReleaseAuthorized: false,
}, null, 2));