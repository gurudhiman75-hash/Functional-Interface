import { BTD_CP003_QL_IDS, buildBtdPermanentQuestionV1 } from "../BTD-CP-003/btd-cp003-permanent-generator-v1";
import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";

export const BTD_CP004_ENGLISH_REVIEW_VERSION = "BTD-001-CP004-ENGLISH-REVIEW-v1" as const;
export const BTD_CP004_REVIEW_BOUNDARY = Object.freeze({
  chapterId: "BTD-001" as const,
  checkpointId: "BTD-CP-004" as const,
  language: "en" as const,
  samplesPerQl: 3 as const,
  expectedReviewQuestionCount: 60 as const,
  reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
  contentFrozen: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

export type BtdCp004ReviewQuestion = ReturnType<typeof buildBtdPermanentQuestionV1>;

function selectThreeStemFamilies(qlId: BtdPermanentQlId): readonly BtdCp004ReviewQuestion[] {
  const byFamily = new Map<string, BtdCp004ReviewQuestion>();
  for (let index = 0; index < 500 && byFamily.size < 3; index += 1) {
    const seed = `BTD-CP004-REVIEW:${qlId}:${index}`;
    const question = buildBtdPermanentQuestionV1(qlId, seed);
    if (!byFamily.has(question.presentation.stemFamilyId)) byFamily.set(question.presentation.stemFamilyId, question);
  }
  if (byFamily.size !== 3) throw new Error(`${qlId}: unable to select all three production stem families for review`);
  return Object.freeze([...byFamily.values()].sort((left, right) => left.presentation.stemFamilyId.localeCompare(right.presentation.stemFamilyId)));
}

export function buildBtdCp004EnglishReviewCorpusV1() {
  const questions = BTD_CP003_QL_IDS.flatMap((qlId) => selectThreeStemFamilies(qlId));
  if (questions.length !== BTD_CP004_REVIEW_BOUNDARY.expectedReviewQuestionCount) throw new Error(`BTD CP004 review corpus count drift: ${questions.length}`);
  return Object.freeze(questions);
}

function escapeMd(text: string) { return text.replace(/\|/gu, "\\|"); }

export function renderBtdCp004EnglishReviewMarkdownV1() {
  const corpus = buildBtdCp004EnglishReviewCorpusV1();
  const lines: string[] = [
    "# BTD-001 CP004 — English Learner Review Corpus v1",
    "",
    `Status: **${BTD_CP004_REVIEW_BOUNDARY.reviewStatus}**`,
    "",
    "This artifact contains one deterministic sample from each of the three production stem families for every permanent BTD QL. It is review evidence only; it does not open Question Studio or learner delivery.",
    "",
  ];
  for (const qlId of BTD_CP003_QL_IDS) {
    const group = corpus.filter((question) => question.qlId === qlId);
    lines.push(`## ${qlId}`, "");
    for (const [index, question] of group.entries()) {
      lines.push(`### Sample ${index + 1} — ${question.presentation.stemFamilyId}`, "");
      lines.push(`**Question:** ${question.presentation.stem}`, "");
      question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}${option.isCorrect ? " ✓" : ""}`));
      lines.push("", `**Given:** ${question.explanation.whatGiven}`, `**Asked:** ${question.explanation.whatAsked}`, `**Idea:** ${question.explanation.keyIdea}`, "", "**Solution:**");
      question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
      lines.push(`**Final:** ${question.explanation.finalAnswer}`, "", `Trace: \`${question.sourceStateFingerprint}\``, "");
    }
  }
  lines.push("## Review index", "", "| QL | Samples |", "| --- | ---: |");
  for (const qlId of BTD_CP003_QL_IDS) lines.push(`| ${escapeMd(qlId)} | 3 |`);
  lines.push("");
  return lines.join("\n");
}
