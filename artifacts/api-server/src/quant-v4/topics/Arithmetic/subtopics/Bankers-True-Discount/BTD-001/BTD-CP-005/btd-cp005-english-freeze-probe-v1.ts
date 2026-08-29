import { createHash } from "node:crypto";
import { BTD_CP003_QL_IDS, buildBtdPermanentQuestionV1 } from "../BTD-CP-003/btd-cp003-permanent-generator-v1";
import { buildBtdCp004EnglishReviewCorpusV1 } from "../BTD-CP-004/btd-cp004-english-review-v1";

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function learnerPayload(question: any) {
  return {
    qlId: question.qlId,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    sourceAuthorityId: question.sourceAuthorityId,
    presentation: question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
}

const seedsPerQl = 200;
const perQl: Record<string, { questionCount: number; fingerprint: string }> = {};
const chapterPayload: unknown[] = [];

for (const qlId of BTD_CP003_QL_IDS) {
  const payloads = Array.from({ length: seedsPerQl }, (_, index) => learnerPayload(buildBtdPermanentQuestionV1(qlId, `btd-cp005-freeze-${String(index + 1).padStart(3, "0")}`)));
  perQl[qlId] = { questionCount: payloads.length, fingerprint: sha256(payloads) };
  chapterPayload.push(...payloads);
}

const reviewCorpus = buildBtdCp004EnglishReviewCorpusV1().map(learnerPayload);

console.log(JSON.stringify({
  probeVersion: "BTD-001-CP005-ENGLISH-FREEZE-PROBE-v1",
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-005",
  qlCount: BTD_CP003_QL_IDS.length,
  seedsPerQl,
  canonicalQuestionCount: chapterPayload.length,
  chapterFingerprint: sha256(chapterPayload),
  reviewQuestionCount: reviewCorpus.length,
  reviewFingerprint: sha256(reviewCorpus),
  perQl,
}, null, 2));
console.log("PASS_BTD_001_CP005_ENGLISH_FREEZE_PROBE_V1");
