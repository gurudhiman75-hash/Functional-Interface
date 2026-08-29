import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { STA_V4_QL_IDS, generateStaV4Question, type StaV4ProfileId } from "./exam-realness-v4-1-learner-runtime.ts";

const profiles: readonly StaV4ProfileId[] = ["SSC_2X4", "BANK_5X5", "PUNJAB_2X4", "BANK_3X5_NEGATIVE"];
const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const outputDir = resolve(process.env.STA_V41_REVIEW_OUT ?? "./sta-v4-1-review-pack");
mkdirSync(outputDir, { recursive: true });

const items = STA_V4_QL_IDS.flatMap((qlId, qlIndex) => profiles.map((profileId, profileIndex) => {
  const seed = `sta-v4-1-human-review:${qlId}:${profileId}:${qlIndex}:${profileIndex}`;
  const variants = locales.map((locale) => generateStaV4Question({ seed, locale, profileId, qlId }));
  const [en, hi, pa] = variants;
  if (!en || !hi || !pa) throw new Error(`${seed}: missing trilingual variant`);
  if (en.canonicalItemId !== hi.canonicalItemId || en.canonicalItemId !== pa.canonicalItemId) throw new Error(`${seed}: canonical identity drift`);
  if (en.contentFingerprint !== hi.contentFingerprint || en.contentFingerprint !== pa.contentFingerprint) throw new Error(`${seed}: content fingerprint drift`);
  return { qlId, profileId, seed, canonicalItemId: en.canonicalItemId, contentFingerprint: en.contentFingerprint, variants };
}));

writeFileSync(resolve(outputDir, "sta-v4-1-trilingual-review.json"), JSON.stringify({
  runtime: "EXAM_REALNESS_V4_1",
  reviewStatus: "HUMAN_REVIEW_REQUIRED",
  itemCount: items.length,
  languageSurfaceCount: items.length * 3,
  items,
}, null, 2));

const lines: string[] = [
  "# STA-001 V4.1 Trilingual Human Review Pack",
  "",
  "Status: HUMAN REVIEW REQUIRED — this pack is not a freeze or release approval.",
  "",
  `Canonical items: ${items.length}`,
  `Language surfaces: ${items.length * 3}`,
  "",
];
for (const item of items) {
  lines.push(`## ${item.qlId} · ${item.profileId}`, "", `Canonical item: \`${item.canonicalItemId}\``, `Fingerprint: \`${item.contentFingerprint}\``, "");
  for (const question of item.variants) {
    lines.push(`### ${question.locale}`, "", question.instruction, "", `**Statement:** ${question.statement}`, "");
    for (const candidate of question.candidates) lines.push(`${candidate.label}. ${candidate.text}`);
    lines.push("", "**Options**", "");
    question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.display}${option.isCorrect ? "  ← correct" : ""}`));
    lines.push("", `**Answer:** ${question.options[question.answerIndex]!.display}`, "", "**Explanation**", "", question.explanation, "");
  }
}
writeFileSync(resolve(outputDir, "sta-v4-1-trilingual-review.md"), lines.join("\n"));

console.log(`STA V4.1 review pack exported: ${items.length} canonical items / ${items.length * 3} language surfaces`);
