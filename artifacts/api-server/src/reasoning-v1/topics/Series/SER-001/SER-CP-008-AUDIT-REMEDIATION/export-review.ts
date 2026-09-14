import {
  SER_CP008_PROVISIONAL_QL_IDS,
  serCp008AuthorityByQlId,
} from "./question-language";
import { generateSerCp008Final } from "./runtime-final";

const reviewSeeds = [2, 17] as const;
const lines: string[] = [
  "# SER-CP-008 — Final Audit Remediation Review Pack",
  "",
  "> Review-only pack. SER-QL-014..028 are not promoted by this file.",
  "",
];

let questionNumber = 0;
for (const qlId of SER_CP008_PROVISIONAL_QL_IDS) {
  const authority = serCp008AuthorityByQlId(qlId);
  lines.push(`## ${qlId} — ${authority.title}`, "", `**Solve contract:** ${authority.solveContract}`, "", `**Source evidence:** ${authority.sourceEvidence.join("; ")}`, "");

  for (const seed of reviewSeeds) {
    questionNumber += 1;
    const question = generateSerCp008Final(qlId, seed, "en-IN");
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
