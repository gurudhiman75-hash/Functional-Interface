import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { TSD_CP004_NATIVE_REVIEW_V2 } from "../TSD-001/cp004/localization/native-review-v2";
import { buildCp007ContentReviewCandidateV2 } from "../TSD-002/cp007/content-review-candidate-v2";
import { TSD_CP008_CONTENT_REVIEW_V2 } from "../TSD-002/cp008/content-review-candidate-v2";
import { TSD_CP009_CONTENT_REVIEW_V2 } from "../TSD-002/cp009/content-review-candidate-v2";

const directory = resolve(process.argv[2] ?? "dist/tsd-content-revision-v3");
mkdirSync(directory, {recursive: true});
const cp007 = buildCp007ContentReviewCandidateV2();
const seen = new Set<string>();
const samples = cp007.filter(row => {
  const key = `${row.familyId}:${row.language}`;
  if (seen.has(key)) return false;
  seen.add(key); return true;
});
const lines = ["# TSD correction review V3", "", "Unapproved editorial candidates. TSD remains open; frozen content and release locks remain authoritative.", "", "CP004: 120 native rows. CP007: 198 representative rows; all 1,854 candidate rows are included in JSON. CP008: 162 trilingual rows. CP009: 198 trilingual rows, including the 18 corrected boat-meeting stems.", "", "CP008/CP009 are explanation and wording review candidates; this package does not create or approve a new set of answer options.", ""];
for (const row of [...TSD_CP004_NATIVE_REVIEW_V2, ...samples]) {
  const ql = "qlId" in row ? row.qlId : row.permanentQlId;
  const family = "familyId" in row ? row.familyId : row.representation;
  const answer = "answer" in row ? row.answer : row.answerText;
  lines.push(`## ${ql} · ${family} · ${row.language}`, "", row.stem, "", ...row.options.map((option, i) => `${"ABCD"[i]}. ${option}`), "", `**Answer: ${answer}**`, "", ...row.explanation.steps.map((step, i) => `${i + 1}. ${step}`), "");
}
for (const row of [...TSD_CP008_CONTENT_REVIEW_V2, ...TSD_CP009_CONTENT_REVIEW_V2]) {
  lines.push(`## ${row.qlId} · ${row.familyId} · ${row.locale}`, "", row.stem, "", `**Answer: ${row.answer}**`, "", ...row.explanation.map((step, i) => `${i + 1}. ${step}`), "");
}
writeFileSync(resolve(directory, "TSD-CORRECTION-REVIEW-V3.md"), lines.join("\n"));
writeFileSync(resolve(directory, "TSD-CORRECTION-REVIEW-V3.json"), JSON.stringify({status: "UNAPPROVED_CONTENT_REVIEW_CANDIDATES", cp004: TSD_CP004_NATIVE_REVIEW_V2, cp007, cp008: TSD_CP008_CONTENT_REVIEW_V2, cp009: TSD_CP009_CONTENT_REVIEW_V2}, (_, value) => typeof value === "bigint" ? String(value) : value, 2));
console.log(JSON.stringify({directory, candidateRows: 2334, markdownRows: 678, cp004: 120, cp007: cp007.length, cp008: 162, cp009: 198}));
