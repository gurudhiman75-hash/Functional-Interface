import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { MEN_CP_008_FROZEN_QLS } from "../final-freeze/registry";
import { generateMenCp008PermanentQuestion } from "../permanent/runtime";

const SOURCE_AUTHORITY = "New-main@dea83939713e551dce5286287fdf0f1f4049416e";
const SAMPLE_SEEDS = [
  { label: "A", seed: "owner-review-a" },
  { label: "B", seed: "owner-review-b" },
  { label: "C", seed: "owner-review-c" },
] as const;

const records = MEN_CP_008_FROZEN_QLS.flatMap((definition) =>
  SAMPLE_SEEDS.map((sample) => {
    const question = generateMenCp008PermanentQuestion(definition.qlId, sample.seed);
    return {
      reviewId: `${definition.qlId}::${sample.label}`,
      sampleLabel: sample.label,
      ql: {
        qlId: definition.qlId,
        title: definition.title,
        canonicalKey: definition.canonicalKey,
        templateId: definition.templateId,
        candidateId: definition.candidateId,
        prototypeIds: [...definition.prototypeIds],
      },
      question: {
        permanentQlId: question.permanentQlId,
        prototypeId: question.prototypeId,
        prototypeAncestries: [...question.prototypeAncestries],
        solveMode: question.solveMode,
        language: question.language,
        seed: question.seed,
        sourceSeed: question.sourceSeed,
        difficulty: question.difficulty,
        target: question.target,
        piPolicy: question.piPolicy,
        stem: question.stem,
        options: question.options.map((option) => ({
          label: option.label,
          display: option.display,
          isCorrect: option.isCorrect,
          misconceptionId: option.misconceptionId,
        })),
        correctIndex: question.correctIndex,
        answer: question.answer,
        unit: question.unit,
        explanation: {
          keyRule: question.explanation.keyRule,
          steps: question.explanation.steps.map((step) => ({ ...step })),
          shortcut: question.explanation.shortcut,
          traps: [...question.explanation.traps],
        },
        verification: { ...question.verification },
        sourceValidation: {
          valid: question.sourceValidation.valid,
          checks: question.sourceValidation.checks.map((check) => ({ ...check })),
        },
        validation: {
          valid: question.validation.valid,
          checks: question.validation.checks.map((check) => ({ ...check })),
        },
        maturity: question.maturity,
        allocationStatus: question.allocationStatus,
        permanentIdentityFrozen: question.permanentIdentityFrozen,
        reviewStatus: question.reviewStatus,
        questionBankStatus: question.questionBankStatus,
        testEligibility: question.testEligibility,
        publiclyPublishable: question.publiclyPublishable,
        questionStudioDiscoverable: question.questionStudioDiscoverable,
      },
    };
  }),
);

const payload = {
  meta: {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    chapter: "Cylinders & Cones",
    sourceAuthority: SOURCE_AUTHORITY,
    qlCount: MEN_CP_008_FROZEN_QLS.length,
    sampleCountPerQl: SAMPLE_SEEDS.length,
    recordCount: records.length,
    firstQlId: MEN_CP_008_FROZEN_QLS[0]?.qlId,
    lastQlId: MEN_CP_008_FROZEN_QLS.at(-1)?.qlId,
    lifecycle: {
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  },
  records,
};

if (payload.meta.qlCount !== 52) throw new Error(`Expected 52 frozen QLs, received ${payload.meta.qlCount}.`);
if (payload.meta.recordCount !== 156) throw new Error(`Expected 156 review records, received ${payload.meta.recordCount}.`);
if (payload.meta.firstQlId !== "MEN-002-QL-044" || payload.meta.lastQlId !== "MEN-002-QL-095") {
  throw new Error(`Unexpected frozen range: ${payload.meta.firstQlId} through ${payload.meta.lastQlId}.`);
}
if (!records.every((record) => record.question.validation.valid && record.question.verification.valid)) {
  throw new Error("Every exported review record must retain valid permanent and independent proof.");
}
if (!records.every((record) => /^(Think|Picture)\b/.test(record.question.explanation.keyRule))) {
  throw new Error("Every exported explanation must start with the visual-shape mental picture.");
}
if (!records.every((record) => record.question.explanation.shortcut.startsWith("⚡ Exam speed:"))) {
  throw new Error("Every exported shortcut must retain the exam-speed editorial prefix.");
}

const outputPath = resolve("dist/review/MEN-CP-008-English-Review-Source.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${outputPath}`);
console.log(`Exported ${payload.meta.recordCount} source-backed review records from ${payload.meta.sourceAuthority}.`);
