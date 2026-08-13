import { INE_CP001_CONCLUSION_CONTRACTS } from "./conclusion-contracts";
import { generateIneCp001ConclusionQuestion } from "./conclusion-generator";
import { generateIneCp001PrototypeQuestion } from "./prototype-generator";
import { INE_CP001_PROTOTYPE_CONTRACTS } from "./prototype-contracts";

export interface IneCp001ReviewRow {
  packageId: "INE-001";
  checkpointId: "INE-CP-001";
  authorityId: string;
  prototypeId: string;
  seed: number;
  difficulty: string;
  stem: string;
  statements: readonly string[];
  conclusion?: string;
  options: readonly string[];
  correctOption: string;
  explanation: string;
  permanentQlId: null;
  questionStudioVisible: false;
}

function explanationText(
  explanation: import("./types").IneCp001Explanation,
): string {
  return [
    explanation.ruleStatement,
    ...explanation.proofSteps,
    ...explanation.modelWitnesses,
    explanation.conclusion,
  ]
    .filter((paragraph) => paragraph.trim().length > 0)
    .join("\n\n");
}

export function buildIneCp001ReviewPack(
  seedsPerPrototype = 5,
): readonly IneCp001ReviewRow[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer.");
  }
  const rows: IneCp001ReviewRow[] = [];
  for (const contract of INE_CP001_PROTOTYPE_CONTRACTS) {
    for (let seed = 0; seed < seedsPerPrototype; seed += 1) {
      const question = generateIneCp001PrototypeQuestion(
        contract.prototypeId,
        seed,
      );
      rows.push({
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
      });
    }
  }
  for (const contract of INE_CP001_CONCLUSION_CONTRACTS) {
    for (let seed = 0; seed < seedsPerPrototype; seed += 1) {
      const question = generateIneCp001ConclusionQuestion(
        contract.prototypeId,
        seed,
      );
      rows.push({
        packageId: question.packageId,
        checkpointId: question.checkpointId,
        authorityId: question.authorityId,
        prototypeId: question.prototypeId,
        seed,
        difficulty: question.difficulty,
        stem: question.stem,
        statements: question.displayedStatements,
        conclusion: question.displayedConclusion,
        options: question.options.map((option) => option.value),
        correctOption: question.options[question.correctIndex]!.value,
        explanation: explanationText(question.explanation),
        permanentQlId: null,
        questionStudioVisible: false,
      });
    }
  }
  return rows;
}

export function renderIneCp001ReviewMarkdown(
  rows: readonly IneCp001ReviewRow[],
): string {
  const sections = rows.map((row, index) => {
    const statements = row.statements
      .map((statement) => `- ${statement}`)
      .join("\n");
    const options = row.options
      .map((option, optionIndex) => `${optionIndex + 1}. ${option}`)
      .join("\n");
    const conclusion = row.conclusion
      ? ["", "### Conclusion", "", row.conclusion]
      : [];
    return [
      `## ${index + 1}. ${row.authorityId} — seed ${row.seed}`,
      "",
      row.stem,
      "",
      "### Statements",
      "",
      statements,
      ...conclusion,
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
    "# INE-CP-001 English Prototype Review Pack",
    "",
    "Prototype-only review material. Permanent QLs remain unallocated and Question Studio visibility remains disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
