import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildWorBankingReviewPack, renderWorBankingReviewMarkdown } from "./banking-review-pack";
import { WOR_001_ALL_PROTOTYPES } from "./prototype-registry";
import { buildWorReviewPack, renderWorReviewMarkdown } from "./review-pack";

const classic = buildWorReviewPack("en-IN");
const banking = buildWorBankingReviewPack("en-IN");
const questions = [...classic, ...banking];
const prototypeIds = new Set(questions.map((question) => question.prototypeId));
const taskKinds = new Set(questions.map((question) => question.taskKind));
const exactLearnerSurfaces = new Set<string>();

assert.equal(classic.length, 136, "Classic English editorial pack changed unexpectedly.");
assert.equal(banking.length, 33, "Banking English editorial pack changed unexpectedly.");
assert.equal(questions.length, 169, "All-prototype English editorial pack must contain 169 review questions.");
assert.equal(WOR_001_ALL_PROTOTYPES.length, 24, "WOR-001 must expose all 24 active prototypes to editorial review.");
assert.equal(prototypeIds.size, 24, "English editorial review does not cover every active prototype.");
assert.equal(taskKinds.size, 20, "English editorial review does not cover all 20 task kinds.");
for (const prototype of WOR_001_ALL_PROTOTYPES) {
  assert.ok(prototypeIds.has(prototype.prototypeId), `${prototype.prototypeId} is missing from the English editorial pack.`);
}

for (const question of questions) {
  const learnerSurface = `${question.stem}\n${JSON.stringify(question.structuredPrompt)}\n${question.options.map((option) => option.value).join(" | ")}\n${question.explanation}`;
  const exactSignature = `${question.stem}\n${JSON.stringify(question.structuredPrompt)}\n${question.options.map((option) => option.value).join(" | ")}`;

  assert.equal(question.locale, "en-IN");
  assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
  assert.equal(question.permanentQlId, null);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.options.length, question.metadata.optionCount, `${question.prototypeId} option count drifted from metadata.`);
  assert.equal(new Set(question.options.map((option) => option.value)).size, question.options.length, `${question.prototypeId} contains duplicate options.`);
  assert.equal(question.options[question.correctIndex]?.value, question.answer, `${question.prototypeId} answer does not match the keyed option.`);
  assert.ok(question.stem.trim().length >= 35, `${question.prototypeId} English stem is editorially too thin.`);
  assert.ok(question.explanation.trim().length >= 120, `${question.prototypeId} English explanation is editorially too thin.`);
  assert.ok(question.explanation.includes(question.answer), `${question.prototypeId} English explanation does not state the resolved answer.`);
  assert.ok(question.stem.endsWith(".") || question.stem.endsWith("?"), `${question.prototypeId} English stem is missing terminal punctuation.`);
  assert.doesNotMatch(learnerSurface, /undefined|null|\{\{|\}\}|WOR-PROT|WOR-CP|REVIEW_ONLY|prototypeId|checkpointId|allocationDecision|sourceEvidenceStatus/, `${question.prototypeId} leaks internal review/runtime language into the learner surface.`);
  assert.doesNotMatch(learnerSurface, /\b(?:TODO|TBD|FIXME|PLACEHOLDER)\b/i, `${question.prototypeId} contains an editorial placeholder.`);
  assert.doesNotMatch(question.stem, /\s{2,}/, `${question.prototypeId} stem contains repeated whitespace.`);
  if (question.checkpointId === "WOR-CP-005") {
    assert.doesNotMatch(question.stem, /Which is character|move 1 places|From group \d+ from the/i, `${question.prototypeId} regressed to awkward Banking English.`);
    assert.doesNotMatch(question.explanation, /Applying the alphabet offset|alphabet offset 0/i, `${question.prototypeId} exposes implementation-style alphabet-offset wording.`);
  }
  assert.ok(!exactLearnerSurfaces.has(exactSignature), `${question.prototypeId} duplicates another exact learner question surface.`);
  exactLearnerSurfaces.add(exactSignature);
}

const byPrototype = WOR_001_ALL_PROTOTYPES.map((prototype) => {
  const samples = questions.filter((question) => question.prototypeId === prototype.prototypeId);
  const explanationLengths = samples.map((question) => question.explanation.length);
  return {
    prototypeId: prototype.prototypeId,
    checkpointId: prototype.checkpointId,
    taskKind: prototype.taskKind,
    samples: samples.length,
    difficulties: [...new Set(samples.map((question) => question.difficulty))].sort(),
    optionCounts: [...new Set(samples.map((question) => question.options.length))].sort(),
    uniqueExactSurfaces: new Set(samples.map((question) => `${question.stem}|${JSON.stringify(question.structuredPrompt)}|${question.options.map((option) => option.value).join("|")}`)).size,
    explanationLengthMin: Math.min(...explanationLengths),
    explanationLengthMax: Math.max(...explanationLengths),
  };
});

for (const entry of byPrototype) {
  assert.ok(entry.samples > 0, `${entry.prototypeId} has no editorial samples.`);
  assert.equal(entry.uniqueExactSurfaces, entry.samples, `${entry.prototypeId} repeats an exact learner surface within its editorial sample.`);
}

const evidence = {
  status: "AUTOMATED_EDITORIAL_GATE_PASS_HUMAN_REVIEW_PENDING",
  chapterId: "WOR-001",
  locale: "en-IN",
  generatedAtPolicy: "DETERMINISTIC_NO_WALL_CLOCK_IN_EVIDENCE",
  questionCount: questions.length,
  classicQuestionCount: classic.length,
  bankingQuestionCount: banking.length,
  prototypeCount: prototypeIds.size,
  taskKindCount: taskKinds.size,
  exactLearnerSurfaceCount: exactLearnerSurfaces.size,
  permanentQlCount: 0,
  questionStudioVisible: false,
  publicActivation: "DISABLED_PENDING_HUMAN_EDITORIAL_APPROVAL",
  byPrototype,
};

const outputDirectory = path.resolve("dist/reasoning-v1/wor-001-editorial-review-v2");
await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, "wor-001-english-classic-review.md"), renderWorReviewMarkdown("en-IN", classic), "utf8");
await writeFile(path.join(outputDirectory, "wor-001-english-banking-review.md"), renderWorBankingReviewMarkdown("en-IN", banking), "utf8");
await writeFile(path.join(outputDirectory, "wor-001-english-editorial-evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

console.log("WOR-001 all-prototype English editorial quality gate passed.", evidence);
