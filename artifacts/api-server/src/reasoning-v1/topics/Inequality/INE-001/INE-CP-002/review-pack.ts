import { INE_CP002_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp002Question } from "./generator";

export interface IneCp002ReviewRow {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-002";
  authorityId: string;
  prototypeId: string;
  seed: number;
  difficulty: string;
  difficultyBasis: string;
  releaseTier: string;
  competency: string;
  topologyId: string;
  graphFingerprint: string;
  explanationMode: string;
  nodeCount: number;
  statementCount: number;
  relevantStatementCount: number;
  irrelevantStatementCount: number;
  equalityStatementCount: number;
  strictStatementCount: number;
  answerRelation?: string;
  contentHash: string;
  reviewStatus: string;
  optionRoles: readonly {
    index: number;
    role: "CORRECT" | "DISTRACTOR";
    errorLabel?: string;
  }[];
  stem: string;
  statements: readonly string[];
  options: readonly string[];
  correctOption: string;
  explanation: string;
  mockExplanation: string;
  learningExplanation: string;
  permanentQlId: null;
  questionStudioVisible: false;
}

function explanationText(
  explanation: import("../INE-CP-001/types").IneCp001Explanation,
  includePairAudit: boolean,
): string {
  return [
    explanation.ruleStatement,
    ...explanation.normalizedStatements,
    ...explanation.proofSteps,
    ...explanation.modelWitnesses,
    explanation.conclusion,
    ...(includePairAudit
      ? explanation.distractorAnalysis.map(
          (entry) => `Pair check: ${entry.studentWarning}`,
        )
      : []),
  ]
    .filter((paragraph) => paragraph.trim().length > 0)
    .join("\n\n");
}

export function buildIneCp002ReviewPack(
  seedsPerPrototype = 5,
): readonly IneCp002ReviewRow[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer.");
  }
  return INE_CP002_PROTOTYPE_CONTRACTS.flatMap((contract) =>
    Array.from({ length: seedsPerPrototype }, (_, seed) => {
      const question = generateIneCp002Question(contract.prototypeId, seed);
      return {
        recordId: question.recordId,
        packageId: question.packageId,
        checkpointId: question.checkpointId,
        authorityId: question.authorityId,
        prototypeId: question.prototypeId,
        seed,
        difficulty: question.difficulty,
        difficultyBasis: question.metadata.difficultyBasis,
        releaseTier: question.metadata.releaseTier,
        competency: question.metadata.competency,
        topologyId: question.metadata.topologyId,
        graphFingerprint: question.metadata.graphFingerprint,
        explanationMode: question.metadata.explanationMode,
        nodeCount: question.metadata.nodeCount,
        statementCount: question.metadata.statementCount,
        relevantStatementCount: question.metadata.relevantStatementCount,
        irrelevantStatementCount: question.metadata.irrelevantStatementCount,
        equalityStatementCount: question.metadata.equalityStatementCount,
        strictStatementCount: question.metadata.strictStatementCount,
        answerRelation: question.metadata.answerRelation,
        contentHash: question.metadata.contentHash,
        reviewStatus: question.metadata.reviewStatus,
        optionRoles: question.metadata.optionRoles,
        stem: question.stem,
        statements: question.displayedStatements,
        options: question.options.map((option) => option.value),
        correctOption: question.options[question.correctIndex]!.value,
        explanation: explanationText(
          question.explanation,
          question.metadata.taskKind !== "RELATION",
        ),
        mockExplanation: question.solutions.mock,
        learningExplanation: explanationText(
          question.solutions.learning,
          question.metadata.taskKind !== "RELATION",
        ),
        permanentQlId: null,
        questionStudioVisible: false,
      } satisfies IneCp002ReviewRow;
    }),
  );
}

export function renderIneCp002ReviewMarkdown(
  rows: readonly IneCp002ReviewRow[],
): string {
  const sections = rows.map((row, index) => {
    const statements = row.statements
      .map((statement) => `- ${statement}`)
      .join("\n");
    const options = row.options
      .map((option, optionIndex) => `${optionIndex + 1}. ${option}`)
      .join("\n");
    return [
      `## ${index + 1}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} (${row.difficultyBasis}) · **Release tier:** ${row.releaseTier} · **Topology:** ${row.topologyId} · **Explanation mode:** ${row.explanationMode}`,
      "",
      row.stem,
      "",
      "### Statements",
      "",
      statements,
      "",
      "### Options",
      "",
      options,
      "",
      `**Correct:** ${row.correctOption}`,
      "",
      "### Explanation",
      "",
      row.mockExplanation,
    ].join("\n");
  });
  return [
    "# INE-CP-002 English Prototype Review Pack",
    "",
    "Prototype-only review material. Permanent QLs remain unallocated and Question Studio visibility remains disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
