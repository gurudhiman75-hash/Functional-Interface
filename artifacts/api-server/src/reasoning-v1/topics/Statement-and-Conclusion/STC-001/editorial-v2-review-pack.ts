import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_QL_IDS } from "./types.ts";

const outDir = process.env.STC_V2_REVIEW_OUT ?? "stc-001-v2-english-review-pack";
await mkdir(outDir, { recursive: true });

const rows: Array<Record<string, unknown>> = [];
const markdown: string[] = [
  "# STC-001 V2 English Editorial Human Review Pack",
  "",
  "Status: ENGLISH_EDITORIAL_REVIEW_CANDIDATE — not frozen and not learner-release approved.",
  "",
  "This pack contains every V2 editorial authority exactly once: 6 permanent QLs × 8 distinct surface archetypes = 48 English learner-facing questions.",
  "",
  "Review focus: exam-natural stem, plausible conclusions, semantic correctness, answer ownership, concise human explanation, and absence of repetitive/synthetic boilerplate.",
  "",
];

for (const qlId of STC_QL_IDS) {
  markdown.push(`## ${qlId}`, "");
  const authorities = STC_V2_EDITORIAL_AUTHORITIES.filter((entry) => entry.qlId === qlId);
  if (authorities.length !== 8) throw new Error(`${qlId}: expected 8 V2 authorities, found ${authorities.length}.`);

  for (let seed = 0; seed < 8; seed += 1) {
    const question = generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed });
    rows.push({ presentationProfile: "FOUR_WAY", ...question });
    markdown.push(
      `### ${seed + 1}. ${question.scenarioId} — ${question.surfaceArchetype} — ${question.difficulty}`,
      "",
      question.stem,
      "",
      `I. ${question.conclusions[0]}`,
      `II. ${question.conclusions[1]}`,
      "",
      ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.answerClass}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
    );
  }
}

const jsonText = `${JSON.stringify(rows, null, 2)}\n`;
const markdownText = `${markdown.join("\n")}\n`;
const jsonSha256 = createHash("sha256").update(jsonText).digest("hex");
const markdownSha256 = createHash("sha256").update(markdownText).digest("hex");

await writeFile(join(outDir, "stc-001-v2-english-review.json"), jsonText, "utf8");
await writeFile(join(outDir, "stc-001-v2-english-review.md"), markdownText, "utf8");
await writeFile(
  join(outDir, "stc-001-v2-english-review-summary.json"),
  `${JSON.stringify({
    chapterId: "STC-001",
    version: "V2",
    locale: "en-IN",
    status: "READY_FOR_EXPLICIT_ENGLISH_EDITORIAL_REVIEW",
    frozen: false,
    questionCount: rows.length,
    permanentQlCount: STC_QL_IDS.length,
    authoritiesPerQl: 8,
    jsonSha256,
    markdownSha256,
    localizationEnabled: false,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
  }, null, 2)}\n`,
  "utf8",
);

console.log(`PASS_STC_001_V2_ENGLISH_REVIEW_EXPORT questions=${rows.length}`);
console.log(`JSON_SHA256=${jsonSha256}`);
console.log(`MARKDOWN_SHA256=${markdownSha256}`);
