import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave04EnglishCandidate } from "./int-001-wave04-english-authority-v1";

const outputDir = resolve(process.cwd(), "int-001-wave04-english-review");
mkdirSync(outputDir, { recursive: true });

const rows: any[] = [];
for (const qlId of INT_001_WAVE03_QL_IDS) {
  const byFamily = new Map<string, any>();
  for (let index = 0; index < 500 && byFamily.size < 6; index += 1) {
    const seed = `INT-001-WAVE04-REVIEW:${qlId}:${index}`;
    const question = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
    if (!byFamily.has(question.stemFamilyId)) byFamily.set(question.stemFamilyId, question);
  }
  if (byFamily.size < 6) throw new Error(`${qlId}: unable to collect all six English review surfaces`);
  for (const question of [...byFamily.values()].sort((a, b) => a.stemFamilyId.localeCompare(b.stemFamilyId))) {
    rows.push({
      qlId: question.qlId,
      checkpointId: question.checkpointId,
      questionType: question.questionType,
      title: question.title,
      sourcePrototypeId: question.sourcePrototypeId,
      stemFamilyId: question.stemFamilyId,
      requestedSeed: question.requestedSeed,
      effectiveSeed: question.effectiveSeed,
      stem: question.stem,
      options: question.options.map((option: any, index: number) => ({
        label: String.fromCharCode(65 + index),
        text: option.text,
        misconceptionId: option.misconceptionId,
        isCorrect: option.isCorrect,
      })),
      correctIndex: question.correctIndex,
      correctOption: question.options[question.correctIndex].text,
      explanation: question.explanation,
      solveContract: question.solveContract,
      answerSemantic: question.answerSemantic,
      mathematicalFingerprint: question.mathematicalFingerprint,
      provenance: question.provenance,
      lifecycle: question.lifecycle,
    });
  }
}

const jsonPath = resolve(outputDir, "INT-001-WAVE04-ENGLISH-REVIEW.json");
writeFileSync(jsonPath, JSON.stringify({
  release: "INT-001-WAVE04-EN-v1-review-candidate",
  generatedAt: new Date().toISOString(),
  reviewQuestionCount: rows.length,
  rows,
}, null, 2));

const markdown: string[] = [
  "# INT-001 Wave04 English Review",
  "",
  "Release: `INT-001-WAVE04-EN-v1-review-candidate`",
  "",
  `Review rows: **${rows.length}** (six learner-facing stem surfaces per permanent QL).`,
  "",
  "These are review candidates only. Question Studio, Question Bank, tests, mocks and public delivery remain closed.",
  "",
];
for (const row of rows) {
  markdown.push(`## ${row.qlId} — ${row.stemFamilyId}`);
  markdown.push("");
  markdown.push(`**Contract:** ${row.solveContract}`);
  markdown.push("");
  markdown.push(row.stem);
  markdown.push("");
  for (const option of row.options) markdown.push(`${option.label}. ${option.text}${option.isCorrect ? " ✓" : ""}`);
  markdown.push("");
  markdown.push(`**Correct answer:** ${row.correctOption}`);
  markdown.push("");
  markdown.push(`**Key idea:** ${row.explanation.keyIdea}`);
  markdown.push("");
  for (const step of row.explanation.steps) markdown.push(`- ${step}`);
  markdown.push("");
  markdown.push(`**Shortcut:** ${row.explanation.shortcut}`);
  markdown.push("");
  markdown.push(`**Common trap:** ${row.explanation.commonTrap}`);
  markdown.push("");
}
const mdPath = resolve(outputDir, "INT-001-WAVE04-ENGLISH-REVIEW.md");
writeFileSync(mdPath, markdown.join("\n"));

console.log(JSON.stringify({ outputDir, jsonPath, mdPath, reviewQuestionCount: rows.length }, null, 2));
console.log("PASS_INT_001_WAVE04_ENGLISH_REVIEW_EXPORT");
