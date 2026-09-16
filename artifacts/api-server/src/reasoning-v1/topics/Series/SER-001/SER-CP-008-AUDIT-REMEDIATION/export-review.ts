import {
  SER_CP008_AUDITED_QL_IDS,
  SER_CP008_REJECTED_SOURCE_GAPS,
  generateSerCp008Audited,
} from "./audited-candidate";
import { serCp008AuthorityByQlId } from "./question-language";

const reviewSeeds = [2, 17] as const;
const lines: string[] = [
  "# SER-CP-008 — Audited Series candidate review pack",
  "",
  "> Review-only provisional content. No QL in this pack is permanently allocated or promoted by this file.",
  "",
  "## Final ownership decision",
  "",
  "- Audited Series candidates: `SER-QL-014..018` and `SER-QL-021..028` (13 QLs).",
  ...SER_CP008_REJECTED_SOURCE_GAPS.map(
    (entry) => `- \`${entry.qlId}\` is rejected and not reserved: ${entry.reason}`,
  ),
  "- Rejected source prototypes remain only as provenance experiments and cannot be promoted from this checkpoint.",
  "",
];

let questionNumber = 0;
for (const qlId of SER_CP008_AUDITED_QL_IDS) {
  const authority = serCp008AuthorityByQlId(qlId);
  lines.push(
    `## ${qlId} — ${authority.title}`,
    "",
    `**Solve contract:** ${authority.solveContract}`,
    "",
    `**Source evidence:** ${authority.sourceEvidence.join("; ")}`,
    "",
  );

  for (const seed of reviewSeeds) {
    questionNumber += 1;
    const question = generateSerCp008Audited(qlId, seed, "en-IN");
    lines.push(
      `### Question ${questionNumber} — seed ${seed}`,
      "",
      `**Difficulty:** ${question.difficulty}`,
      "",
      question.stem,
      "",
    );
    question.options.forEach((option, index) => {
      lines.push(`${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option.value}`);
    });
    lines.push(
      "",
      `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
      "",
      "**Explanation**",
      "",
      ...question.explanation.map((step, index) => `${index + 1}. ${step}`),
      "",
      "**Reviewer checks**",
      "",
      "- [ ] Stem looks like a real competitive-exam question",
      "- [ ] Exactly one answer is logically valid",
      "- [ ] Distractors represent plausible mistakes",
      "- [ ] Difficulty reflects reasoning burden rather than size",
      "- [ ] Explanation is simple enough for a beginner",
      "- [ ] Approved without revision",
      "",
      "---",
      "",
    );
  }
}

process.stdout.write(`${lines.join("\n")}\n`);
