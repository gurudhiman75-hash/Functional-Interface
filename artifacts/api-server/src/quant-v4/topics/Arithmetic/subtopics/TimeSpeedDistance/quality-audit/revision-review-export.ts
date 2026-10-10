import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { TSD_CP004_NATIVE_REVIEW_V2 } from "../TSD-001/cp004/localization/native-review-v2";
import { buildCp007ContentReviewCandidateV2 } from "../TSD-002/cp007/content-review-candidate-v2";
const directory = resolve(process.argv[2] ?? "dist/tsd-content-revision-v2");
mkdirSync(directory, {recursive: true});
const cp007 = buildCp007ContentReviewCandidateV2();
const seen = new Set<string>();
const samples = cp007.filter(row => {
  const key = `${row.familyId}:${row.language}`;
  if (seen.has(key)) return false; seen.add(key); return true;
});
const lines = ["# TSD correction review V2", "", "Unapproved authoring candidates. Frozen content and all release locks remain intact.", "", "CP004: all 120 native rows. CP007: one of the 618 numeric cases per locale for each of 66 frozen families (198 sample rows); all 1,854 candidate rows are in the accompanying JSON.", ""];
for (const row of [...TSD_CP004_NATIVE_REVIEW_V2, ...samples]) {
  const ql = "qlId" in row ? row.qlId : row.permanentQlId;
  const family = "familyId" in row ? row.familyId : row.representation;
  const answer = "answer" in row ? row.answer : row.answerText;
  lines.push(`## ${ql} · ${family} · ${row.language}`, "", row.stem, "", ...row.options.map((option, i) => `${"ABCD"[i]}. ${option}`), "", `**Answer: ${answer}**`, "", ...row.explanation.steps.map((step, i) => `${i + 1}. ${step}`), "");
}
writeFileSync(resolve(directory, "TSD-CORRECTION-REVIEW-V2.md"), lines.join("\n"));
writeFileSync(resolve(directory, "TSD-CORRECTION-REVIEW-V2.json"), JSON.stringify({status: "UNAPPROVED_CONTENT_REVIEW_CANDIDATES", cp004: TSD_CP004_NATIVE_REVIEW_V2, cp007}, (_, v) => typeof v === "bigint" ? String(v) : v, 2));
console.log(JSON.stringify({directory, cp004: 120, cp007: cp007.length, markdownSamples: 318}));
