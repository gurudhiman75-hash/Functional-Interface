import { getIneCp008PrototypeContract } from "./contracts";
import { generateIneCp008Question } from "./generator";
import type { IneCp008PrototypeId } from "./types";

const ALLOCATION: readonly {
  prototypeId: IneCp008PrototypeId;
  count: number;
}[] = [
  { prototypeId: "INE-CP008-PROT-RECONSTRUCT-RELATION", count: 12 },
  { prototypeId: "INE-CP008-PROT-POSSIBLE-CONCLUSION", count: 12 },
  { prototypeId: "INE-CP008-PROT-SELECT-STATEMENT-SET", count: 4 },
  { prototypeId: "INE-CP008-PROT-CONTRADICTORY-ADDITION", count: 4 },
];

export function buildIneCp008ReviewPack() {
  let index = 0;
  return ALLOCATION.flatMap(({ prototypeId, count }) =>
    Array.from({ length: count }, (_, seed) => {
      const question = generateIneCp008Question(prototypeId, seed);
      index += 1;
      return {
        index,
        recordId: question.recordId,
        authorityId: question.authorityId,
        seed,
        difficulty: question.difficulty,
        deliveryProfile: question.metadata.deliveryProfile,
        examApplicability: question.metadata.examApplicability,
        topologyId: question.metadata.topologyId,
        stem: question.stem,
        statements: question.displayedStatements,
        options: question.options.map((entry) => entry.value),
        correctIndex: question.correctIndex,
        correctOption: question.options[question.correctIndex]!.value,
        explanation: question.explanation,
        sourceLedgerIds:
          getIneCp008PrototypeContract(prototypeId).sourceLedgerIds,
      };
    }),
  );
}

function renderOption(value: string): string {
  return value.length === 1 ? `\`${value}\`` : value;
}

export function renderIneCp008ReviewMarkdown(
  rows: ReturnType<typeof buildIneCp008ReviewPack>,
): string {
  const questions = rows.map((row) =>
    [
      `## ${row.index}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Delivery:** ${row.deliveryProfile} · **Applicability:** ${row.examApplicability} · **Topology:** ${row.topologyId}`,
      "",
      row.stem,
      "",
      `**Given:** ${row.statements.join("; ")}`,
      "",
      "### Options",
      "",
      ...row.options.map(
        (entry, optionIndex) =>
          `${optionIndex + 1}. ${renderOption(entry)}`,
      ),
      "",
      `**Correct:** ${row.correctIndex + 1}. ${renderOption(row.correctOption)}`,
      "",
      "### Explanation",
      "",
      row.explanation,
    ].join("\n"),
  );
  return [
    "# INE-CP-008 English Prototype Review Pack",
    "",
    "This 32-question advanced-synthesis pack places 24 source-aligned exam-practice prototypes first and 8 guided advanced prototypes last. It covers missing-relation reconstruction, possible-but-not-definite conclusions, competing statement sets, and contradiction detection. It is not labelled as Data Sufficiency or as a previous-year question set. Every record uses five-relation formal semantics, exactly four visible options, a unique solver-verified answer, varied letter objects, and one plain-language explanation. Permanent QLs, Question Studio visibility, localization, and public release remain disabled.",
    "",
    questions.join("\n\n"),
    "",
  ].join("\n");
}
