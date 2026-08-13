import type { IneCp001Explanation } from "../INE-CP-001/types";
import { INE_CP003_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp003Question } from "./generator";

export interface IneCp003ReviewRow {
  recordId: string;
  authorityId: string;
  prototypeId: string;
  seed: number;
  difficulty: string;
  releaseTier: string;
  topologyId: string;
  taskKind: string;
  statementCount: number;
  conclusionCount: number;
  stem: string;
  statements: readonly string[];
  conclusion?: string;
  conclusions?: readonly string[];
  options: readonly string[];
  correctIndex: number;
  correctOption: string;
  conclusionTruths: readonly string[];
  possibleAtomicRelations?: readonly string[];
  mockSolution: string;
  learningSolution: string;
  contentHash: string;
  structuralFingerprint: string;
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

export function buildIneCp003ReviewPack(
  seedsPerAuthority = 12,
): readonly IneCp003ReviewRow[] {
  if (!Number.isInteger(seedsPerAuthority) || seedsPerAuthority <= 0) {
    throw new Error("seedsPerAuthority must be a positive integer.");
  }
  return INE_CP003_PROTOTYPE_CONTRACTS.flatMap((contract) =>
    Array.from({ length: seedsPerAuthority }, (_, seed) => {
      const question = generateIneCp003Question(contract.prototypeId, seed);
      return {
        recordId: question.recordId,
        authorityId: question.authorityId,
        prototypeId: question.prototypeId,
        seed,
        difficulty: question.difficulty,
        releaseTier: question.metadata.releaseTier,
        topologyId: question.metadata.topologyId,
        taskKind: question.metadata.taskKind,
        statementCount: question.metadata.statementCount,
        conclusionCount: question.metadata.conclusionCount,
        stem: question.stem,
        statements: question.displayedStatements,
        conclusion: question.displayedConclusion,
        conclusions: question.displayedConclusions,
        options: question.options.map((option) => option.value),
        correctIndex: question.correctIndex,
        correctOption: question.options[question.correctIndex]!.value,
        conclusionTruths: question.metadata.conclusionTruths,
        possibleAtomicRelations: question.metadata.possibleAtomicRelations,
        mockSolution: question.solutions.mock,
        learningSolution: explanationText(question.solutions.learning),
        contentHash: question.metadata.contentHash,
        structuralFingerprint: question.metadata.structuralFingerprint,
        sourceLedgerIds: question.metadata.sourceLedgerIds,
        reviewStatus: question.metadata.reviewStatus,
        permanentQlId: null,
        questionStudioVisible: false,
      } satisfies IneCp003ReviewRow;
    }),
  );
}

export function renderIneCp003ReviewMarkdown(
  rows: readonly IneCp003ReviewRow[],
): string {
  const sections = rows.map((row, index) => {
    const statements = row.statements.map((entry) => `- ${entry}`).join("\n");
    const options = row.options
      .map((entry, optionIndex) => `${optionIndex + 1}. ${entry}`)
      .join("\n");
    const displayedConclusions = row.conclusions?.map(
      (conclusion, conclusionIndex) =>
        `${conclusionIndex === 0 ? "I" : "II"}. ${conclusion}`,
    );
    return [
      `## ${index + 1}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Profile:** ${row.releaseTier} · **Topology:** ${row.topologyId}`,
      "",
      row.stem,
      "",
      "### Statements",
      "",
      statements,
      ...(row.conclusion ? ["", "### Conclusion", "", row.conclusion] : []),
      ...(displayedConclusions
        ? ["", "### Conclusions", "", ...displayedConclusions]
        : []),
      "",
      "### Options",
      "",
      options,
      "",
      `**Correct:** ${row.correctIndex + 1}. ${row.correctOption}`,
      "",
      "### Explanation",
      "",
      row.mockSolution,
    ].join("\n");
  });
  return [
    "# INE-CP-003 Revised English Prototype Review Pack",
    "",
    "This pack contains 12 questions for each provisional authority. It separates guided, diagnostic, and mock-format prototypes. Permanent QLs remain unallocated, and Question Studio visibility remains disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
