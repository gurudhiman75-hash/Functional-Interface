import { writeFile } from "node:fs/promises";

import { generateQuestion } from "../../../../../generation-engine";
import {
  listPnl001CanonicalReviewEntries,
  type Pnl001Language,
} from "./question-studio-review-runtime";

const RELEASE_ID = "PNL-001-CANONICAL-PRODUCTION-V1";
const OUTPUT_PATH =
  process.env.PNL_PRODUCTION_PAYLOAD_PATH ??
  "/tmp/pnl-001-canonical-production-payload.json";
const LANGUAGES: readonly Pnl001Language[] = ["en", "hi", "pa"];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

const entries = listPnl001CanonicalReviewEntries().sort((left, right) =>
  left.qlId.localeCompare(right.qlId),
);

if (entries.length !== 186) {
  throw new Error(`Expected 186 canonical QLs, received ${entries.length}.`);
}

const items: Array<{
  ordinal: number;
  releaseId: string;
  importKey: string;
  qlId: string;
  cpId: string;
  language: Pnl001Language;
  providerQuestionId: string;
  payload: Record<string, unknown>;
}> = [];
const providerQuestionIds = new Set<string>();

for (const entry of entries) {
  for (const language of LANGUAGES) {
    const seed = `${RELEASE_ID}:${entry.qlId}:${language}`;
    const result = await generateQuestion({
      packageId: "PNL-001",
      runtimeMode: "CANONICAL_REVIEW",
      language,
      canonicalProblemId: entry.cpId,
      questionLanguageId: entry.qlId,
      seed,
      count: 1,
    });

    const question = record(result.questions?.[0]);
    const questionPackage = record(result.questionPackages?.[0]);
    const generationContext = record(result.generationContext);
    const options = Array.isArray(question.options)
      ? question.options.map((option) => String(option ?? "").trim())
      : [];
    const correctIndex = Number(question.correctIndex);
    const providerQuestionId =
      text(question.questionId) || text(questionPackage.questionId);

    if (!text(question.text) && !text(question.stem)) {
      throw new Error(`${entry.qlId} ${language}: missing stem.`);
    }
    if (!text(question.explanation)) {
      throw new Error(`${entry.qlId} ${language}: missing explanation.`);
    }
    if (
      options.length !== 4 ||
      new Set(options).size !== 4 ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= options.length
    ) {
      throw new Error(`${entry.qlId} ${language}: invalid option model.`);
    }
    if (!providerQuestionId) {
      throw new Error(`${entry.qlId} ${language}: missing provider question ID.`);
    }
    if (providerQuestionIds.has(providerQuestionId)) {
      throw new Error(`Duplicate provider question ID ${providerQuestionId}.`);
    }
    providerQuestionIds.add(providerQuestionId);

    if (
      text(generationContext.runtimeMode).toUpperCase() !==
        "CANONICAL_REVIEW" ||
      text(generationContext.reviewStatus).toUpperCase() !==
        "APPROVED_EDITORIAL_CANONICAL" ||
      text(generationContext.questionBankStatus).toUpperCase() !== "WRITABLE" ||
      text(generationContext.testEligibility).toUpperCase() !== "ELIGIBLE" ||
      generationContext.publiclyPublishable !== true
    ) {
      throw new Error(`${entry.qlId} ${language}: lifecycle gate is not released.`);
    }

    const payload = {
      ...question,
      generationContext,
      validationResult: "approved",
      productionImport: {
        releaseId: RELEASE_ID,
        importKey: `${entry.qlId}:${language}`,
        qlId: entry.qlId,
        cpId: entry.cpId,
        language,
        sourceCommit: process.env.GITHUB_SHA ?? null,
      },
    };

    items.push({
      ordinal: items.length + 1,
      releaseId: RELEASE_ID,
      importKey: `${entry.qlId}:${language}`,
      qlId: entry.qlId,
      cpId: entry.cpId,
      language,
      providerQuestionId,
      payload,
    });
  }
}

if (items.length !== 558 || providerQuestionIds.size !== 558) {
  throw new Error(
    `Expected 558 unique canonical payloads, received ${items.length}/${providerQuestionIds.size}.`,
  );
}

const languageCounts = Object.fromEntries(
  LANGUAGES.map((language) => [
    language,
    items.filter((item) => item.language === language).length,
  ]),
);
const cpCounts = Object.fromEntries(
  [...new Set(entries.map((entry) => entry.cpId))].sort().map((cpId) => [
    cpId,
    items.filter((item) => item.cpId === cpId).length,
  ]),
);

const artifact = {
  schemaVersion: 1,
  releaseId: RELEASE_ID,
  packageId: "PNL-001",
  runtimeMode: "CANONICAL_REVIEW",
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
  questionBankStatus: "WRITABLE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
  sourceBranch: process.env.GITHUB_REF_NAME ?? null,
  sourceCommit: process.env.GITHUB_SHA ?? null,
  generatedAt: new Date().toISOString(),
  qlCount: entries.length,
  itemCount: items.length,
  languageCounts,
  cpCounts,
  items,
};

await writeFile(OUTPUT_PATH, JSON.stringify(artifact, null, 2));
console.log(
  JSON.stringify(
    {
      status: "PASS",
      outputPath: OUTPUT_PATH,
      releaseId: RELEASE_ID,
      qlCount: entries.length,
      itemCount: items.length,
      languageCounts,
      cpCounts,
    },
    null,
    2,
  ),
);
