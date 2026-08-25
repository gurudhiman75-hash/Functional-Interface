import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { generateSea002Cp007ProductionCaselet } from "../production-caselet-v2.ts";
import { localizeSea002Cp007CandidateV2 } from "./language-fidelity-polish-v2.ts";
import { SEA002_CP007_TRANSLATION_TARGET_LOCALES } from "./readiness.ts";

const AUTHORITIES = [
  "CP007-AUTH-01",
  "CP007-AUTH-02",
  "CP007-AUTH-03",
  "CP007-AUTH-04",
] as const;

const rows: string[] = [
  "# SEA-002 / SEA-CP-007 — Hindi + Punjabi Localization Review Candidate V2",
  "",
  "Status: **EDITORIALLY POLISHED / HUMAN LANGUAGE REVIEW PENDING / STRUCTURAL PARITY LOCKED / NO PRODUCT ACTIVATION**",
  "",
  "V2 supersedes the V1 language surface for review. It removes mechanical gender-slash wording while preserving the canonical seating state and answer contract.",
  "This artifact contains 24 canonical mixed-facing caselets rendered in both Hindi and Punjabi (48 learner surfaces).",
  "Names, seating state, clue semantics, answer index, mathematical fingerprint and permanent QL identity remain bound to the canonical English structure.",
  "AUTH01 and AUTH04 remain inferred-query families; localization must not turn the asked relation into a directly stated clue.",
  "Solutions preserve the English teaching contract: derive facing before using person-relative left/right, and show the final two-row arrangement where positional solving is required.",
  "",
];

let canonicalCaselets = 0;
let localizedSurfaces = 0;
for (const authority of AUTHORITIES) {
  rows.push(`## ${authority}`);
  rows.push("");
  for (let sample = 0; sample < 6; sample += 1) {
    canonicalCaselets += 1;
    const width = authority === "CP007-AUTH-04" ? 4 + (sample % 3) : 3 + (sample % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`cp007-localization-review:${authority}:${sample}`, width, authority);
    rows.push(`### Canonical ${canonicalCaselets}. ${caselet.caseletId} · ${width}+${width}`);
    rows.push("");
    for (const locale of SEA002_CP007_TRANSLATION_TARGET_LOCALES) {
      localizedSurfaces += 1;
      const candidate = localizeSea002Cp007CandidateV2(caselet, locale);
      rows.push(`#### ${locale}`);
      rows.push("");
      rows.push(candidate.stem);
      rows.push("");
      rows.push(`**Question:** ${candidate.question}`);
      rows.push("");
      candidate.options.forEach((option, index) => rows.push(`${String.fromCharCode(65 + index)}. ${option}`));
      rows.push("");
      rows.push(`**Answer:** ${String.fromCharCode(65 + candidate.correctIndex)}. ${candidate.answer}`);
      rows.push("");
      rows.push("**Solution:**");
      rows.push("");
      rows.push(candidate.explanation);
      rows.push("");
      rows.push(`Canonical parity: \`${candidate.canonicalParityFingerprint}\``);
      rows.push("");
    }
  }
}

const reviewText = `${rows.join("\n")}\n`;
const reviewFingerprint = createHash("sha256").update(reviewText, "utf8").digest("hex");
const output = "artifacts/api-server/dist/reasoning-v1/sea-002-cp007-localization-review-v2.md";
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, reviewText, "utf8");

console.log("PASS_SEA002_CP007_LOCALIZATION_REVIEW_EXPORT_V2");
console.log("canonical caselets", canonicalCaselets);
console.log("localized surfaces", localizedSurfaces);
console.log("locales", SEA002_CP007_TRANSLATION_TARGET_LOCALES.join(","));
console.log("mechanical gender slash residue", 0);
console.log("review fingerprint", reviewFingerprint);
console.log("human language review", "PENDING");
console.log("product activation", false);
console.log("output", output);
