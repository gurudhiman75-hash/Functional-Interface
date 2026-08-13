import type { IneCp001Explanation } from "../INE-CP-001/types";
import { INE_CP004_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp004Question } from "./generator";

export interface IneCp004ReviewRow {
  recordId: string;
  authorityId: string;
  prototypeId: string;
  seed: number;
  difficulty: string;
  deliveryProfile: string;
  topologyId: string;
  taskKind: string;
  stem: string;
  statements: readonly string[];
  conclusions?: readonly string[];
  options: readonly string[];
  correctIndex: number;
  correctOption: string;
  conclusionTruths: readonly string[];
  complementaryEvidence: unknown;
  mockSolution: string;
  learningSolution: string;
  structuralFingerprint: string;
  contentHash: string;
  sourceLedgerIds: readonly string[];
  reviewStatus: string;
  permanentQlId: null;
  questionStudioVisible: false;
}

function explanationText(explanation: IneCp001Explanation): string {
  return [
    explanation.ruleStatement,
    ...explanation.proofSteps,
    ...explanation.modelWitnesses,
    explanation.conclusion,
    ...explanation.distractorAnalysis.map(
      (entry) => `${entry.optionValue}: ${entry.studentWarning}`,
    ),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildIneCp004ReviewPack(
  seedsPerAuthority = 12,
): readonly IneCp004ReviewRow[] {
  if (!Number.isInteger(seedsPerAuthority) || seedsPerAuthority <= 0) {
    throw new Error("seedsPerAuthority must be a positive integer.");
  }
  return INE_CP004_PROTOTYPE_CONTRACTS.flatMap((contract) =>
    Array.from({ length: seedsPerAuthority }, (_, seed) => {
      const question = generateIneCp004Question(contract.prototypeId, seed);
      return {
        recordId: question.recordId,
        authorityId: question.authorityId,
        prototypeId: question.prototypeId,
        seed,
        difficulty: question.difficulty,
        deliveryProfile: question.metadata.deliveryProfile,
        topologyId: question.metadata.topologyId,
        taskKind: question.metadata.taskKind,
        stem: question.stem,
        statements: question.displayedStatements,
        conclusions: question.displayedConclusions,
        options: question.options.map((option) => option.value),
        correctIndex: question.correctIndex,
        correctOption: question.options[question.correctIndex]!.value,
        conclusionTruths: question.metadata.conclusionTruths,
        complementaryEvidence: question.metadata.complementaryEvidence,
        mockSolution: question.solutions.mock,
        learningSolution: explanationText(question.solutions.learning),
        structuralFingerprint: question.metadata.structuralFingerprint,
        contentHash: question.metadata.contentHash,
        sourceLedgerIds: question.metadata.sourceLedgerIds,
        reviewStatus: question.metadata.reviewStatus,
        permanentQlId: null,
        questionStudioVisible: false,
      } satisfies IneCp004ReviewRow;
    }),
  );
}

export function renderIneCp004ReviewMarkdown(
  rows: readonly IneCp004ReviewRow[],
): string {
  const sections = rows.map((row, index) => {
    const conclusions = row.conclusions?.map(
      (conclusion, conclusionIndex) =>
        `${["I", "II", "III"][conclusionIndex]}. ${conclusion}`,
    );
    return [
      `## ${index + 1}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Profile:** ${row.deliveryProfile} · **Topology:** ${row.topologyId}`,
      "",
      row.stem,
      "",
      "### Statements",
      "",
      ...row.statements.map((statement) => `- ${statement}`),
      ...(conclusions ? ["", "### Conclusions", "", ...conclusions] : []),
      "",
      "### Options",
      "",
      ...row.options.map(
        (option, optionIndex) => `${optionIndex + 1}. ${option}`,
      ),
      "",
      `**Correct:** ${row.correctIndex + 1}. ${row.correctOption}`,
      "",
      "### Explanation",
      "",
      row.mockSolution,
    ].join("\n");
  });
  return [
    "# INE-CP-004 English Prototype Review Pack",
    "",
    "This pack contains 12 questions for each provisional complementary/either-or authority. Every question has exactly four answer options. Permanent QLs remain unallocated, and Question Studio visibility remains disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
