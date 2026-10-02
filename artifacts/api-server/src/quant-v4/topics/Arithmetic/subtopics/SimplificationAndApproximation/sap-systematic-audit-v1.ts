import assert from "node:assert/strict";

import {
  SAP_QUESTION_STUDIO_CP_IDS,
  SAP_QUESTION_STUDIO_QLS,
  runSapQuestionStudioPipeline,
} from "./question-studio-adapter";

const SEEDS_PER_QL = 8;

function compact(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/gu, " ");
}

function normalizedStructure(stem: string) {
  return compact(stem)
    .toLowerCase()
    .replace(/\\(?:frac|sqrt|times|div|cdot|left|right|text)\b/gu, "\\MATH")
    .replace(/-?\d+(?:\.\d+)?%?/gu, "#")
    .replace(/[a-d]\)/gu, "OPT")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(stem: string) {
  return [...compact(stem).matchAll(/-?\d+(?:\.\d+)?%?/gu)].map((m) => m[0]).join("|");
}

function explanationText(question: any) {
  return Array.isArray(question.explanation?.lines)
    ? question.explanation.lines.map(compact).filter(Boolean).join(" ")
    : "";
}

const rows: any[] = [];
const globalQuestionFingerprints = new Map<string, string[]>();
const machineStemQls = new Set<string>();

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  const stems = new Set<string>();
  const structures = new Set<string>();
  const answers = new Set<string>();
  const numericSignatures = new Set<string>();
  const explanations = new Set<string>();
  const optionSurfaces = new Set<string>();
  const difficulties = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationWords = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const question: any = runSapQuestionStudioPipeline(descriptor.checkpointId, {
      language: "en",
      questionLanguageId: descriptor.qlId,
      seed: `sap-systematic-v1:${descriptor.qlId}:${seed}`,
    });

    assert.equal(question.packageId, "SAP", `${descriptor.qlId}: wrong package`);
    assert.equal(question.canonicalProblemId, descriptor.checkpointId, `${descriptor.qlId}: CP ownership drift`);
    assert.equal(question.questionLanguageId, descriptor.qlId, `${descriptor.qlId}: QL ownership drift`);
    assert.equal(question.options.length, 4, `${descriptor.qlId}: option count drift`);
    assert.equal(new Set(question.options.map(String)).size, 4, `${descriptor.qlId}: duplicate options`);
    assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${descriptor.qlId}: invalid correct index`);
    assert.equal(String(question.options[question.correctIndex]), String(question.answer), `${descriptor.qlId}: answer/index drift`);
    assert.equal(question.validation?.ok, true, `${descriptor.qlId}: source validation failed`);
    assert.equal(question.questionBankWritable, true, `${descriptor.qlId}: Question Bank lifecycle drift`);
    assert.equal(question.testEligible, true, `${descriptor.qlId}: test eligibility drift`);
    assert.equal(question.publiclyPublishable, true, `${descriptor.qlId}: publishability drift`);

    const stem = compact(question.stem);
    const explanation = explanationText(question);
    assert.ok(stem.length >= 8, `${descriptor.qlId}: empty/thin stem`);
    assert.ok(explanation.length >= 8, `${descriptor.qlId}: explanation missing`);
    assert.ok(!/\b(?:undefined|TODO|TBD|PLACEHOLDER)\b/iu.test([stem, ...question.options, explanation].join(" ")), `${descriptor.qlId}: placeholder leaked`);
    assert.ok(!/\[object Object\]/u.test([stem, ...question.options, explanation].join(" ")), `${descriptor.qlId}: object serialization leaked`);

    if (/\b(?:first calculate|calculate first|first find|find first|do this first|start by calculating|start by finding)\b/iu.test(stem)) {
      machineStemQls.add(descriptor.qlId);
    }

    stems.add(stem);
    structures.add(normalizedStructure(stem));
    answers.add(String(question.answer));
    numericSignatures.add(numericSignature(stem));
    explanations.add(explanation);
    optionSurfaces.add(question.options.map((x: unknown) => compact(x)).join(" | "));
    difficulties.add(String(question.difficultyBand));
    answerPositions.add(Number(question.correctIndex));
    minExplanationWords = Math.min(minExplanationWords, explanation.split(/\s+/u).filter(Boolean).length);

    const fullFingerprint = JSON.stringify({ stem, options: question.options.map(compact) });
    const labels = globalQuestionFingerprints.get(fullFingerprint) ?? [];
    labels.push(`${descriptor.qlId}/${seed}`);
    globalQuestionFingerprints.set(fullFingerprint, labels);
  }

  rows.push({
    qlId: descriptor.qlId,
    checkpointId: descriptor.checkpointId,
    title: descriptor.title,
    specialist: descriptor.specialist,
    defaultWeight: descriptor.defaultWeight,
    rawStemCount: stems.size,
    normalizedStructureCount: structures.size,
    answerCount: answers.size,
    numericSignatureCount: numericSignatures.size,
    explanationCount: explanations.size,
    optionSurfaceCount: optionSurfaces.size,
    difficultyCount: difficulties.size,
    difficulties: [...difficulties].sort(),
    answerPositionCount: answerPositions.size,
    minExplanationWords,
  });
}

const duplicateFullQuestions = [...globalQuestionFingerprints.entries()]
  .filter(([, labels]) => labels.length > 1)
  .map(([fingerprint, labels]) => ({ fingerprint: JSON.parse(fingerprint), labels }));

assert.equal(SAP_QUESTION_STUDIO_CP_IDS.length, 12, "SAP checkpoint count drift");
assert.equal(SAP_QUESTION_STUDIO_QLS.length, 211, "SAP permanent QL count drift");
assert.deepEqual(
  SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId),
  Array.from({ length: 211 }, (_, index) => `SAP-QL-${String(index + 1).padStart(3, "0")}`),
  "SAP permanent QL range is not contiguous",
);
const cpSummary = Object.fromEntries(SAP_QUESTION_STUDIO_CP_IDS.map((cpId) => {
  const cpRows = rows.filter((row) => row.checkpointId === cpId);
  return [cpId, {
    qlCount: cpRows.length,
    lowRawStemBreadth: cpRows.filter((row) => row.rawStemCount < 4).length,
    lowNormalizedStructureBreadth: cpRows.filter((row) => row.normalizedStructureCount < 3).length,
    lowAnswerDiversity: cpRows.filter((row) => row.answerCount < 4).length,
    lowNumericSignatureBreadth: cpRows.filter((row) => row.numericSignatureCount < 3).length,
    thinExplanation: cpRows.filter((row) => row.minExplanationWords < 18).length,
    lowAnswerPositionBreadth: cpRows.filter((row) => row.answerPositionCount < 3).length,
  }];
}));

const diagnostics = {
  lowRawStemBreadth: rows.filter((row) => row.rawStemCount < 4).map((row) => row.qlId),
  lowNormalizedStructureBreadth: rows.filter((row) => row.normalizedStructureCount < 3).map((row) => row.qlId),
  lowAnswerDiversity: rows.filter((row) => row.answerCount < 4).map((row) => row.qlId),
  lowNumericSignatureBreadth: rows.filter((row) => row.numericSignatureCount < 3).map((row) => row.qlId),
  thinExplanation: rows.filter((row) => row.minExplanationWords < 18).map((row) => row.qlId),
  lowAnswerPositionBreadth: rows.filter((row) => row.answerPositionCount < 3).map((row) => row.qlId),
  machineStemQls: [...machineStemQls].sort(),
};

console.log(JSON.stringify({
  version: "SAP-SYSTEMATIC-AUDIT-V1",
  checkpointCount: SAP_QUESTION_STUDIO_CP_IDS.length,
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  seedsPerQl: SEEDS_PER_QL,
  generatedQuestionCount: SAP_QUESTION_STUDIO_QLS.length * SEEDS_PER_QL,
  duplicateFullQuestionCount: duplicateFullQuestions.length,
  cpSummary,
  diagnostics,
  duplicateFullQuestions,
  rows,
}, null, 2));

assert.equal(duplicateFullQuestions.length, 0, "Duplicate full learner questions found in systematic seed sweep");

console.log("PASS_SAP_SYSTEMATIC_AUDIT_V1_CORE_INTEGRITY");
