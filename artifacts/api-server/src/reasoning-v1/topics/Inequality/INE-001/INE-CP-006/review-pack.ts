import { INE_CP006_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp006Question } from "./generator";
import type { IneCp006AuthorityId } from "./types";

export interface IneCp006ReviewRow {
  index: number;
  recordId: string;
  authorityId: IneCp006AuthorityId;
  seed: number;
  difficulty: string;
  deliveryProfile: string;
  symbolSetId: string;
  topologyId: string;
  stem: string;
  codeKey: readonly string[];
  statements: readonly string[];
  conclusions?: readonly string[];
  options: readonly string[];
  correctIndex: number;
  correctOption: string;
  mockSolution: string;
  learningSolution: string;
  sourceLedgerIds: readonly string[];
  permanentQlId: null;
  questionStudioVisible: false;
}

function learningText(
  question: ReturnType<typeof generateIneCp006Question>,
): string {
  const explanation = question.explanation;
  return [
    explanation.ruleStatement,
    ...explanation.normalizedStatements,
    ...explanation.proofSteps,
    explanation.conclusion,
    ...explanation.distractorAnalysis.map(
      (entry) => `${entry.optionValue}: ${entry.studentWarning}`,
    ),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildIneCp006ReviewPack(
  seedsPerAuthority = 12,
): IneCp006ReviewRow[] {
  let index = 0;
  return INE_CP006_PROTOTYPE_CONTRACTS.flatMap((contract) =>
    Array.from({ length: seedsPerAuthority }, (_, seed) => {
      const question = generateIneCp006Question(contract.prototypeId, seed);
      index += 1;
      return {
        index,
        recordId: question.recordId,
        authorityId: question.authorityId,
        seed,
        difficulty: question.difficulty,
        deliveryProfile: question.metadata.deliveryProfile,
        symbolSetId: question.metadata.symbolSetId,
        topologyId: question.metadata.topologyId,
        stem: question.stem,
        codeKey: question.displayedCodeKey,
        statements: question.displayedStatements,
        conclusions: question.displayedConclusions,
        options: question.options.map((entry) => entry.value),
        correctIndex: question.correctIndex,
        correctOption: question.options[question.correctIndex]!.value,
        mockSolution: question.solutions.mock,
        learningSolution: learningText(question),
        sourceLedgerIds: question.metadata.sourceLedgerIds,
        permanentQlId: null,
        questionStudioVisible: false,
      };
    }),
  );
}

export function renderIneCp006ReviewMarkdown(
  rows: readonly IneCp006ReviewRow[],
): string {
  const sections = rows.map((row) =>
    [
      `## ${row.index}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Profile:** ${row.deliveryProfile} · **Symbol set:** ${row.symbolSetId} · **Topology:** ${row.topologyId}`,
      "",
      row.stem,
      "",
      "### Code key",
      "",
      ...row.codeKey.map((entry) => `- ${entry}`),
      "",
      "### Statements",
      "",
      ...row.statements.map((entry) => `- ${entry}`),
      ...(row.conclusions
        ? [
            "",
            "### Conclusions",
            "",
            ...row.conclusions.map(
              (entry, index) => `${["I", "II"][index]}. ${entry}`,
            ),
          ]
        : []),
      "",
      "### Options",
      "",
      ...row.options.map((entry, index) => `${index + 1}. ${entry}`),
      "",
      `**Correct:** ${row.correctIndex + 1}. ${row.correctOption}`,
      "",
      "### Mock solution",
      "",
      row.mockSolution,
      "",
      "### Learning solution",
      "",
      row.learningSolution,
    ].join("\n"),
  );
  return [
    "# INE-CP-006 English Prototype Review Pack",
    "",
    "This pack contains 12 questions for each provisional fixed-map coded-inequality authority. Every question supplies a complete five-symbol key and exactly four answer options. These are product prototypes, not previous-year questions. Permanent QLs and Question Studio visibility remain disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
