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
  symbolProfile: string;
  examApplicability: string;
  symbolSetId: string;
  topologyId: string;
  statementCount: number;
  conclusionCount: number;
  stem: string;
  codeKey: readonly string[];
  statements: readonly string[];
  conclusions?: readonly string[];
  options: readonly string[];
  correctIndex: number;
  correctOption: string;
  explanation: string;
  sourceLedgerIds: readonly string[];
  permanentQlId: null;
  questionStudioVisible: false;
}

export const INE_CP006_REVIEW_ALLOCATION: Readonly<
  Record<IneCp006AuthorityId, number>
> = {
  DECODE_FIXED_MAP_RELATION: 4,
  SOLVE_FIXED_MAP_CODED_CHAIN: 20,
  EVALUATE_FIXED_MAP_CODED_CONCLUSIONS: 20,
  ENCODE_FIXED_MAP_RELATION: 4,
};

export function buildIneCp006ReviewPack(): IneCp006ReviewRow[] {
  const contract = (authorityId: IneCp006AuthorityId) =>
    INE_CP006_PROTOTYPE_CONTRACTS.find(
      (entry) => entry.authorityId === authorityId,
    )!;
  const schedule = [
    ...Array.from({ length: 20 }, (_, seed) => [
      { contract: contract("SOLVE_FIXED_MAP_CODED_CHAIN"), seed },
      {
        contract: contract("EVALUATE_FIXED_MAP_CODED_CONCLUSIONS"),
        seed,
      },
    ]).flat(),
    ...Array.from({ length: 4 }, (_, seed) => [
      { contract: contract("DECODE_FIXED_MAP_RELATION"), seed },
      { contract: contract("ENCODE_FIXED_MAP_RELATION"), seed },
    ]).flat(),
  ];

  return schedule.map(({ contract: entry, seed }, index) => {
    const question = generateIneCp006Question(entry.prototypeId, seed);
    return {
      index: index + 1,
      recordId: question.recordId,
      authorityId: question.authorityId,
      seed,
      difficulty: question.difficulty,
      deliveryProfile: question.metadata.deliveryProfile,
      symbolProfile: question.metadata.symbolProfile,
      examApplicability: question.metadata.examApplicability,
      symbolSetId: question.metadata.symbolSetId,
      topologyId: question.metadata.topologyId,
      statementCount: question.structuredScenario.statements.length,
      conclusionCount: question.structuredScenario.conclusions.length,
      stem: question.stem,
      codeKey: question.displayedCodeKey,
      statements: question.displayedStatements,
      conclusions: question.displayedConclusions,
      options: question.options.map((option) => option.value),
      correctIndex: question.correctIndex,
      correctOption: question.options[question.correctIndex]!.value,
      explanation: question.solutions.mock,
      sourceLedgerIds: question.metadata.sourceLedgerIds,
      permanentQlId: null,
      questionStudioVisible: false,
    };
  });
}

export function renderIneCp006ReviewMarkdown(
  rows: readonly IneCp006ReviewRow[],
): string {
  const sections = rows.map((row) =>
    [
      `## ${row.index}. ${row.authorityId} — seed ${row.seed}`,
      "",
      `**Record:** ${row.recordId} · **Difficulty:** ${row.difficulty} · **Delivery:** ${row.deliveryProfile} · **Symbols:** ${row.symbolProfile}/${row.symbolSetId} · **Applicability:** ${row.examApplicability} · **Statements:** ${row.statementCount} · **Topology:** ${row.topologyId}`,
      "",
      row.stem,
      "",
      "### Code key",
      "",
      ...row.codeKey.map((entry) => `- ${entry}`),
      "",
      `**Statements:** ${row.statements.join("; ")}`,
      ...(row.conclusions
        ? [
            "",
            "### Conclusions",
            "",
            ...row.conclusions.map(
              (entry, index) => `${["I", "II", "III"][index]}. ${entry}`,
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
      row.explanation,
    ].join("\n"),
  );
  return [
    "# INE-CP-006 English Prototype Review Pack",
    "",
    "This 48-question pack gives 40 questions to exam-shaped chain solving and conclusion evaluation, and 8 to guided decoding and encoding. The exam questions come first and use three-to-six-statement scenarios; no one- or two-step exam items are included. Multi-group questions use only necessary cross-links; redundant shortcut statements are rejected. Exam-practice records use ASCII symbols; Unicode symbols are isolated in guided records. Every question supplies a complete five-symbol key and exactly four answer options. These are product prototypes, not previous-year questions. The current exam applicability is Banking/regulatory practice only; SSC, Railways, and Punjab labels remain disabled pending verified post-specific evidence. Permanent QLs and Question Studio visibility remain disabled.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}
