import fs from "node:fs";
import path from "node:path";
import { auditGeoSoi001ChapterClosureV1 } from "./geo-soi-001-chapter-closure-v1";

const audit = auditGeoSoi001ChapterClosureV1();
if (!audit.valid) throw new Error(audit.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-SOI-001-CLOSURE-V1");
fs.mkdirSync(outDir, { recursive: true });
const lines = [
  "# GEO-SOI-001 — Soils of India — Chapter Closure Audit V1",
  "",
  "- Permanent QLs: " + audit.permanentQlCount,
  "- Owning questions: " + audit.owningQuestionCount,
  "- Owning difficulty: Easy " + audit.difficultyCounts.Easy + " / Medium " + audit.difficultyCounts.Medium + " / Hard " + audit.difficultyCounts.Hard,
  "- Owning answer positions: A " + audit.answerPositions[0] + " / B " + audit.answerPositions[1] + " / C " + audit.answerPositions[2] + " / D " + audit.answerPositions[3],
  "- CP013 mastery questions: " + audit.masteryQuestionCount,
  "- CP013 difficulty: Easy " + audit.masteryDifficultyCounts.Easy + " / Medium " + audit.masteryDifficultyCounts.Medium + " / Hard " + audit.masteryDifficultyCounts.Hard,
  "- CP013 answer positions: A " + audit.masteryAnswerPositions[0] + " / B " + audit.masteryAnswerPositions[1] + " / C " + audit.masteryAnswerPositions[2] + " / D " + audit.masteryAnswerPositions[3],
  "- CP013 unique stems: " + audit.masteryStemCount,
  "- CP013 unique explanations: " + audit.masteryExplanationCount,
  "- Runtime publication authorized by content closure: NO",
  "",
  "Result: PASS",
  "",
  "Content closure validates the Static GK chapter authority only. Question Studio registration, Question Bank persistence, test/mock eligibility and public runtime publication remain separately governed."
];
fs.writeFileSync(path.join(outDir, "GEO-SOI-001-CHAPTER-CLOSURE-AUDIT-V1.md"), lines.join("\n"));
fs.writeFileSync(path.join(outDir, "GEO-SOI-001-CHAPTER-CLOSURE-AUDIT-V1.json"), JSON.stringify(audit, null, 2));
