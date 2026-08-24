import fs from "node:fs";
import path from "node:path";
import { NUM_CP010_PERMANENT_ALLOCATION } from "../permanent-allocation.ts";
import { generateNumCp010Localized } from "./runtime.ts";

const outDir = path.resolve("dist/quant-v4/num-cp010-hi-pa-review");
fs.mkdirSync(outDir, { recursive: true });
const seeds = [7, 41, 113] as const;
const languages = ["hi", "pa"] as const;
const rows = NUM_CP010_PERMANENT_ALLOCATION.flatMap((allocation) =>
  languages.flatMap((language) => seeds.map((seed) => generateNumCp010Localized(allocation.qlId, seed, language))),
);

const englishToken = /\b(?:the|find|number|digit|place|value|original|reverse|sum|column|palindrome|valid|solution|total|check|therefore|hence|because|least|greatest|times|appear|repeated)\b/giu;
const leakage = rows.map((q) => ({
  qlId: q.permanentQlId,
  language: q.language,
  seed: q.seed,
  matches: [...`${q.stem} ${q.explanation.coreConcept} ${q.explanation.strategy} ${q.explanation.steps.join(" ")}`.matchAll(englishToken)].map((m) => m[0]),
})).filter((row) => row.matches.length > 0);

const md = ["# NUM-CP-010 Hindi/Punjabi Review Candidate", "", ...rows.flatMap((q) => [
  `## ${q.permanentQlId} — ${q.language.toUpperCase()} — seed ${q.seed}`,
  "",
  q.stem,
  "",
  ...q.options.map((o, i) => `${String.fromCharCode(65+i)}. ${o.value}${o.isCorrect ? "  ← correct" : ""}`),
  "",
  `**Concept:** ${q.explanation.coreConcept}`,
  "",
  `**Approach:** ${q.explanation.strategy}`,
  "",
  ...q.explanation.steps.map((s, i) => `${i+1}. ${s}`),
  "",
  `**Answer:** ${q.explanation.finalAnswer}`,
  "",
])].join("\n");

const audit = {
  status: "PASS_NUM_CP010_HI_PA_REVIEW_EXPORT",
  authorities: NUM_CP010_PERMANENT_ALLOCATION.length,
  languages,
  samplesPerAuthorityPerLanguage: seeds.length,
  questionCount: rows.length,
  englishLeakageRows: leakage.length,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};
fs.writeFileSync(path.join(outDir, "review.md"), md);
fs.writeFileSync(path.join(outDir, "review.json"), JSON.stringify(rows, null, 2));
fs.writeFileSync(path.join(outDir, "leakage.json"), JSON.stringify(leakage, null, 2));
fs.writeFileSync(path.join(outDir, "audit.json"), JSON.stringify(audit, null, 2));
console.log(JSON.stringify(audit, null, 2));
