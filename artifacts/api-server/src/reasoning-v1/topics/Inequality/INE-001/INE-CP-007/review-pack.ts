import { getIneCp007PrototypeContract } from "./contracts";
import { generateIneCp007Question } from "./generator";
import type { IneCp007PrototypeId } from "./types";

const ALLOCATION: readonly { prototypeId: IneCp007PrototypeId; count: number }[] = [
  { prototypeId: "INE-CP007-PROT-MISSING-OPERATOR", count: 12 },
  { prototypeId: "INE-CP007-PROT-SELECT-EXPRESSION", count: 12 },
  { prototypeId: "INE-CP007-PROT-RECOVER-MAP", count: 4 },
  { prototypeId: "INE-CP007-PROT-CONSISTENT-MAP", count: 4 },
];

export function buildIneCp007ReviewPack() {
  let index = 0;
  return ALLOCATION.flatMap(({ prototypeId, count }) =>
    Array.from({ length: count }, (_, seed) => {
      const question = generateIneCp007Question(prototypeId, seed);
      index += 1;
      return {
        index,
        recordId: question.recordId,
        authorityId: question.authorityId,
        seed,
        difficulty: question.difficulty,
        deliveryProfile: question.metadata.deliveryProfile,
        examApplicability: question.metadata.examApplicability,
        stem: question.stem,
        codeKey: question.displayedCodeKey,
        evidence: question.displayedEvidence,
        options: question.options.map((entry) => entry.value),
        correctIndex: question.correctIndex,
        correctOption: question.options[question.correctIndex]!.value,
        explanation: question.explanation,
        sourceLedgerIds: getIneCp007PrototypeContract(prototypeId).sourceLedgerIds,
      };
    }),
  );
}

export function renderIneCp007ReviewMarkdown(
  rows: ReturnType<typeof buildIneCp007ReviewPack>,
): string {
  const questions = rows.map((row) => [
    `## ${row.index}. ${row.authorityId} — seed ${row.seed}`,
    "",
    `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Delivery:** ${row.deliveryProfile} · **Applicability:** ${row.examApplicability}`,
    "",
    row.stem,
    ...(row.codeKey.length ? ["", "### Code key", "", ...row.codeKey.map((entry) => `- ${entry}`)] : []),
    "",
    "### Given",
    "",
    ...row.evidence.map((entry) => `- ${entry}`),
    "",
    "### Options",
    "",
    ...row.options.map((entry, optionIndex) => `${optionIndex + 1}. ${entry}`),
    "",
    `**Correct:** ${row.correctIndex + 1}. ${row.correctOption}`,
    "",
    "### Explanation",
    "",
    row.explanation,
  ].join("\n"));
  return [
    "# INE-CP-007 English Prototype Review Pack",
    "",
    "This 32-question discovery pack contains 24 source-backed missing-operator and expression-selection questions, followed by 8 guided map-recovery questions. Every question has exactly four options and a short explanation. Only the first two authorities carry Banking/regulatory practice applicability; map recovery remains guided because verified mainstream exam evidence is insufficient. Permanent QLs, Question Studio visibility, localization, and public release remain disabled.",
    "",
    questions.join("\n\n"),
    "",
  ].join("\n");
}
