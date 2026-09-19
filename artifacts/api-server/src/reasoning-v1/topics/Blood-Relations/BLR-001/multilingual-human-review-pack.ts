import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { BLR_CP001_PERMANENT_CONTRACTS } from "./BLR-CP-001/cp001-permanent-contracts";
import { generateBlrCp001LocalizedQuestion } from "./BLR-CP-001/localization/cp001-localizer";
import { generateBlrCp002LocalizedQuestion } from "./BLR-CP-002/localization/cp002-localizer";
import { generateBlrCp003FinalApprovedBank } from "./BLR-CP-003/cp003-final-approved-bank";
import { generateBlrCp003LocalizedReviewBank } from "./BLR-CP-003/localization/cp003-localized-review-runtime";
import { generateBlrCp004LocalizedReviewBank } from "./BLR-CP-004/localization/cp004-localizer";
import { generateBlrCp005LocalizedReviewBank } from "./BLR-CP-005/localization/cp005-localizer";
import { generateBlrCp006EditorialV3ReviewBundle } from "./BLR-CP-006/cp006-editorial-v3-review";

type ReviewLocale = "en-IN" | "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;

export const BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION =
  "blr-001-multilingual-human-review-pack-v1" as const;

function cp001Corpus(locale: "hi-IN" | "pa-IN"): AnyQuestion[] {
  return BLR_CP001_PERMANENT_CONTRACTS.flatMap((contract, qlIndex) =>
    Array.from({ length: 32 }, (_, seed) =>
      generateBlrCp001LocalizedQuestion(
        contract.qlId,
        qlIndex * 1000 + seed,
        locale,
      ) as unknown as AnyQuestion,
    ),
  );
}

function cp002Corpus(locale: "hi-IN" | "pa-IN"): AnyQuestion[] {
  return Array.from(
    { length: 256 },
    (_, seed) =>
      generateBlrCp002LocalizedQuestion(
        "BLR-QL-008",
        seed,
        locale,
      ) as unknown as AnyQuestion,
  );
}

function cp003Corpus(locale: "hi-IN" | "pa-IN"): AnyQuestion[] {
  return generateBlrCp003LocalizedReviewBank(
    generateBlrCp003FinalApprovedBank(),
    locale,
  ) as unknown as AnyQuestion[];
}

function cp004Corpus(locale: "hi-IN" | "pa-IN"): AnyQuestion[] {
  return generateBlrCp004LocalizedReviewBank(locale) as unknown as AnyQuestion[];
}

function cp005Corpus(locale: "hi-IN" | "pa-IN"): AnyQuestion[] {
  return generateBlrCp005LocalizedReviewBank(locale) as unknown as AnyQuestion[];
}

export function buildBlr001MultilingualReviewCorpora() {
  const cp006 = generateBlrCp006EditorialV3ReviewBundle();
  return {
    cp001: {
      hindi: cp001Corpus("hi-IN"),
      punjabi: cp001Corpus("pa-IN"),
    },
    cp002: {
      hindi: cp002Corpus("hi-IN"),
      punjabi: cp002Corpus("pa-IN"),
    },
    cp003: {
      hindi: cp003Corpus("hi-IN"),
      punjabi: cp003Corpus("pa-IN"),
    },
    cp004: {
      hindi: cp004Corpus("hi-IN"),
      punjabi: cp004Corpus("pa-IN"),
    },
    cp005: {
      hindi: cp005Corpus("hi-IN"),
      punjabi: cp005Corpus("pa-IN"),
    },
    cp006: {
      english: cp006.english as unknown as AnyQuestion[],
      hindi: cp006.hindi as unknown as AnyQuestion[],
      punjabi: cp006.punjabi as unknown as AnyQuestion[],
    },
  } as const;
}

function firstPerQl(records: readonly AnyQuestion[]): AnyQuestion[] {
  const selected = new Map<string, AnyQuestion>();
  for (const record of records) {
    const qlId = String(record.qlId);
    if (!selected.has(qlId)) selected.set(qlId, record);
  }
  return [...selected.values()];
}

function cp002Representative(records: readonly AnyQuestion[]): AnyQuestion[] {
  const selected = new Map<string, AnyQuestion>();
  const add = (key: string, record: AnyQuestion | undefined) => {
    if (record) selected.set(String(record.itemId ?? key), record);
  };

  for (const presentation of ["POINTING", "PHOTOGRAPH", "INTRODUCTION", "STAGE", "CONVERSATION"]) {
    add(
      `presentation:${presentation}`,
      records.find((record) => record.metadata?.presentation === presentation),
    );
  }
  for (const form of ["HOW_RELATED", "WHOSE_PHOTOGRAPH", "WHOSE_PORTRAIT"]) {
    add(
      `form:${form}`,
      records.find((record) => record.metadata?.questionForm === form),
    );
  }
  add("self", records.find((record) => record.metadata?.selfIdentity === true));
  add("only", records.find((record) => Number(record.metadata?.onlyConstraintCount ?? 0) > 0));
  add("negative", records.find((record) => Number(record.metadata?.negativeConstraintCount ?? 0) > 0));
  add(
    "long-chain",
    records.find((record) => Number(record.metadata?.roleChainLength ?? 0) >= 4),
  );

  return [...selected.values()];
}

function localeLabel(locale: ReviewLocale): string {
  if (locale === "hi-IN") return "Hindi";
  if (locale === "pa-IN") return "Punjabi";
  return "English";
}

function optionText(option: AnyQuestion): string {
  return String(option?.text ?? option?.value ?? option?.answerKey ?? option?.semanticKey ?? "");
}

function correctAnswer(record: AnyQuestion): string {
  const options = Array.isArray(record.options) ? record.options : [];
  return optionText(options[Number(record.correctIndex)] ?? {});
}

function explanationSteps(record: AnyQuestion): string[] {
  const explanation = record.explanation ?? {};
  const editorial = record.editorial ?? {};
  const candidates = [
    editorial.stepByStepSolution,
    explanation.queryPath,
    explanation.working,
    explanation.modelAudit,
    explanation.graphAudit,
    explanation.decodingAudit,
  ];
  for (const value of candidates) {
    if (Array.isArray(value) && value.length) return value.map(String);
  }
  const concepts = Array.isArray(editorial.coreConcept)
    ? editorial.coreConcept
    : Array.isArray(explanation.coreConcept)
      ? explanation.coreConcept
      : [];
  return concepts.map(String);
}

function conclusion(record: AnyQuestion): string {
  return String(
    record.editorial?.conclusion
      ?? record.explanation?.conclusion
      ?? correctAnswer(record),
  );
}

function authority(record: AnyQuestion): string {
  return String(
    record.metadata?.editorialAuthority
      ?? record.metadata?.localizationAuthority
      ?? record.finalAuthority
      ?? record.solveAuthority
      ?? record.metadata?.solveAuthority
      ?? "",
  );
}

function reviewStatus(record: AnyQuestion): string {
  return String(
    record.metadata?.editorialStatus
      ?? record.metadata?.reviewStatus
      ?? record.metadata?.localizationStatus
      ?? "REVIEW_REQUIRED",
  );
}

function renderQuestion(record: AnyQuestion, index: number): string {
  const locale = String(record.locale ?? "en-IN") as ReviewLocale;
  const options = (Array.isArray(record.options) ? record.options : [])
    .map((option: AnyQuestion, optionIndex: number) =>
      `${String.fromCharCode(65 + optionIndex)}. ${optionText(option)}`,
    )
    .join("\n");
  const steps = explanationSteps(record);
  const prompt = String(record.sharedPrompt ?? "").trim();
  const stem = String(record.stem ?? "").trim();

  return [
    `### ${index + 1}. ${record.checkpointId} · ${record.qlId} · ${localeLabel(locale)}`,
    "",
    `- Item: \`${String(record.itemId ?? record.questionLanguageId ?? "")}\``,
    `- Authority: \`${authority(record)}\``,
    `- Review status: \`${reviewStatus(record)}\``,
    `- Difficulty: \`${String(record.metadata?.difficulty ?? record.metadata?.difficultyTier ?? record.difficulty ?? "")}\``,
    "",
    ...(prompt ? ["**Information**", "", prompt, ""] : []),
    "**Question**",
    "",
    stem,
    "",
    "**Options**",
    "",
    options,
    "",
    `**Answer:** ${correctAnswer(record)}`,
    "",
    "**Explanation**",
    "",
    ...(steps.length ? steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`) : ["1. —"]),
    "",
    `**Conclusion:** ${conclusion(record)}`,
    "",
  ].join("\n");
}

function allFullRecords(corpora: ReturnType<typeof buildBlr001MultilingualReviewCorpora>) {
  return [
    ...corpora.cp001.hindi,
    ...corpora.cp001.punjabi,
    ...corpora.cp002.hindi,
    ...corpora.cp002.punjabi,
    ...corpora.cp003.hindi,
    ...corpora.cp003.punjabi,
    ...corpora.cp004.hindi,
    ...corpora.cp004.punjabi,
    ...corpora.cp005.hindi,
    ...corpora.cp005.punjabi,
    ...corpora.cp006.english,
    ...corpora.cp006.hindi,
    ...corpora.cp006.punjabi,
  ];
}

export function buildBlr001RepresentativeHumanReviewRecords() {
  const corpora = buildBlr001MultilingualReviewCorpora();
  return [
    ...firstPerQl(corpora.cp001.hindi),
    ...firstPerQl(corpora.cp001.punjabi),
    ...cp002Representative(corpora.cp002.hindi),
    ...cp002Representative(corpora.cp002.punjabi),
    ...firstPerQl(corpora.cp003.hindi),
    ...firstPerQl(corpora.cp003.punjabi),
    ...firstPerQl(corpora.cp004.hindi),
    ...firstPerQl(corpora.cp004.punjabi),
    ...firstPerQl(corpora.cp005.hindi),
    ...firstPerQl(corpora.cp005.punjabi),
    ...firstPerQl(corpora.cp006.english),
    ...firstPerQl(corpora.cp006.hindi),
    ...firstPerQl(corpora.cp006.punjabi),
  ];
}

export function buildBlr001MultilingualReviewSummary() {
  const corpora = buildBlr001MultilingualReviewCorpora();
  const full = allFullRecords(corpora);
  const representative = buildBlr001RepresentativeHumanReviewRecords();
  const qls = [...new Set(full.map((record) => String(record.qlId)))].sort();
  const languages = [...new Set(full.map((record) => String(record.locale)))].sort();
  return {
    packVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
    fullRecordCount: full.length,
    representativeRecordCount: representative.length,
    permanentQlCoverage: qls,
    qlRange: `${qls[0]}..${qls.at(-1)}`,
    languages,
    currentReleaseLock: {
      reviewOnly: true,
      questionBankEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      productDeliveryUnlocked: false,
    },
    approvalBoundary: {
      cp001ThroughCp005: "PRODUCT_OWNER_HINDI_PUNJABI_WORDING_APPROVAL_REQUIRED",
      cp006: "PRODUCT_OWNER_TRILINGUAL_EDITORIAL_V3_APPROVAL_REQUIRED",
      automaticFreeze: false,
    },
  } as const;
}

export function renderBlr001MultilingualHumanReviewMarkdown(): string {
  const records = buildBlr001RepresentativeHumanReviewRecords();
  const summary = buildBlr001MultilingualReviewSummary();
  const sections = records.map(renderQuestion).join("\n---\n\n");

  return `# BLR-001 Multilingual Human Review Pack

Status: **review candidate only — no multilingual freeze or release authority is granted by this file**.

## Review scope

- CP-001: Hindi/Punjabi named, identity, pair, claim, generation, gender and exact-lineage questions.
- CP-002: Hindi/Punjabi pointing, photograph, portrait, introduction, stage and conversation questions, including SELF, ONLY and negative constraints.
- CP-003: Hindi/Punjabi family-set/status/lineage questions after deterministic wording cleanup.
- CP-004: Hindi/Punjabi family counting/composition questions after deterministic wording cleanup.
- CP-005: Hindi/Punjabi determinacy/possibility/uncertainty questions after deterministic wording cleanup.
- CP-006: Editorial V3 English/Hindi/Punjabi wording that removes the learner-facing arithmetic-precedence tutorial hint while preserving the internal solver invariant.

## Machine-audit summary

- Pack: \`${summary.packVersion}\`
- Full machine-reviewed records represented by JSONL: **${summary.fullRecordCount}**
- Human-review Markdown samples: **${summary.representativeRecordCount}**
- Permanent QL coverage: **${summary.qlRange}**
- Languages: **${summary.languages.join(", ")}**

## Approval checklist

Approve only after checking that:

1. stems sound like real SSC/banking reasoning questions rather than translated software text;
2. Hindi and Punjabi are simple, natural and grammatically correct;
3. relation direction is unambiguous;
4. SELF, ONLY and negative-constraint wording is clear;
5. answer wording matches the question form;
6. explanations are simple, question-specific and beginner-friendly;
7. CP-006 V3 no longer teaches arithmetic precedence to the learner;
8. no English learner-text leakage remains inside Hindi/Punjabi items.

Current Question Bank, test, mock-test and public-release gates remain locked regardless of review outcome.

---

${sections}
`;
}

export function writeBlr001MultilingualHumanReviewPack(
  outputDir = "blr-001-multilingual-human-review-output",
) {
  const out = resolve(outputDir);
  mkdirSync(out, { recursive: true });
  const corpora = buildBlr001MultilingualReviewCorpora();
  const full = allFullRecords(corpora);
  const summary = buildBlr001MultilingualReviewSummary();
  const markdown = renderBlr001MultilingualHumanReviewMarkdown();

  writeFileSync(
    resolve(out, "BLR-001-MULTILINGUAL-HUMAN-REVIEW.md"),
    markdown,
    "utf8",
  );
  writeFileSync(
    resolve(out, "blr-001-multilingual-human-review-summary.json"),
    JSON.stringify(summary, null, 2) + "\n",
    "utf8",
  );
  writeFileSync(
    resolve(out, "blr-001-multilingual-human-review-full.jsonl"),
    full.map((record) => JSON.stringify(record)).join("\n") + "\n",
    "utf8",
  );

  return {
    outputDir: out,
    files: [
      "BLR-001-MULTILINGUAL-HUMAN-REVIEW.md",
      "blr-001-multilingual-human-review-summary.json",
      "blr-001-multilingual-human-review-full.jsonl",
    ],
    ...summary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(
    JSON.stringify(
      writeBlr001MultilingualHumanReviewPack(process.argv[2]),
      null,
      2,
    ),
  );
}
