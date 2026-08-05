import { INE_CP002_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp002Question } from "./generator";

export interface IneCp002ReviewRow {
  packageId: "INE-001";
  checkpointId: "INE-CP-002";
  authorityId: string;
  prototypeId: string;
  seed: number;
  difficulty: string;
  stem: string;
  statements: readonly string[];
  options: readonly string[];
  correctOption: string;
  explanation: string;
  permanentQlId: null;
  questionStudioVisible: false;
}

function explanationText(
  explanation: import("../INE-CP-001/types").IneCp001Explanation,
): string {
  return [
    explanation.ruleStatement,
    ...explanation.normalizedStatements,
    ...explanation.proofSteps,
    ...explanation.modelWitnesses,
    explanation.conclusion,
    ...explanation.distractorAnalysis.map(
      (entry) => `Why not “${entry.optionValue}”? ${entry.studentWarning}`,
    ),
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
        packageId: question.packageId,
        checkpointId: question.checkpointId,
        authorityId: question.authorityId,
        prototypeId: question.prototypeId,
        seed,
        difficulty: question.difficulty,
        stem: question.stem,
        statements: question.displayedStatements,
        options: question.options.map((option) => option.value),
        correctOption: question.options[question.correctIndex]!.value,
        explanation: explanationText(question.explanation),
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
      row.explanation,
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
