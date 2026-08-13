import { INE_CP005_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp005Question } from "./generator";
import type { IneCp005AuthorityId, IneCp005Context } from "./types";

export interface IneCp005ReviewRow {
  index: number;
  recordId: string;
  authorityId: IneCp005AuthorityId;
  seed: number;
  difficulty: string;
  deliveryProfile: string;
  context: IneCp005Context;
  topologyId: string;
  stem: string;
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
  question: ReturnType<typeof generateIneCp005Question>,
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

export function buildIneCp005ReviewPack(
  seedsPerAuthority = 12,
): IneCp005ReviewRow[] {
  let index = 0;
  return INE_CP005_PROTOTYPE_CONTRACTS.flatMap((contract) =>
    Array.from({ length: seedsPerAuthority }, (_, seed) => {
      const question = generateIneCp005Question(contract.prototypeId, seed);
      index += 1;
      return {
        index,
        recordId: question.recordId,
        authorityId: question.authorityId,
        seed,
        difficulty: question.difficulty,
        deliveryProfile: question.metadata.deliveryProfile,
        context: question.metadata.context,
        topologyId: question.metadata.topologyId,
        stem: question.stem,
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

export function renderIneCp005ReviewMarkdown(
  rows: readonly IneCp005ReviewRow[],
): string {
  const sections = rows.map((row) =>
    [
      `## ${row.index}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Profile:** ${row.deliveryProfile} · **Context:** ${row.context} · **Topology:** ${row.topologyId}`,
      "",
      row.stem,
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
      "### Explanation",
      "",
      row.mockSolution,
    ].join("\n"),
  );
  return [
    "# INE-CP-005 English Prototype Review Pack",
    "",
    "This pack contains 12 questions for each provisional linguistic-inequality authority. Every question has exactly four answer options. These are product prototypes, not previous-year questions. Permanent QLs and Question Studio visibility remain disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
