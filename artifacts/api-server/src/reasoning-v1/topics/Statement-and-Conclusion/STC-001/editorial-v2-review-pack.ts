import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { canonicalReviewSeedForAuthorityIndex } from "./editorial-v2-scheduler.ts";
import { STC_QL_IDS } from "./types.ts";

const outDir = process.env.STC_V2_REVIEW_OUT ?? "stc-001-v2-1-english-review-pack";
await mkdir(outDir, { recursive: true });

const rows: Array<Record<string, unknown>> = [];
const markdown: string[] = [
  "# STC-001 V2.1 English Editorial Human Review Pack",
  "",
  "Status: EDITORIAL_REVIEW_READY_BUT_SATURATION_BLOCKED — not frozen and not learner-release approved.",
  "",
  "This pack contains every curated V2 authority exactly once in canonical conclusion order: 6 permanent QLs × 8 distinct surface archetypes = 48 English learner-facing questions.",
  "",
  "The runtime preview uses a non-periodic 16-slot anti-gaming scheduler. This canonical audit pack deliberately de-schedules the questions so every authority is reviewed once without duplication.",
  "",
  "Review focus: exam-natural stem, plausible conclusions, semantic correctness, answer ownership, concise human explanation, and absence of repetitive/synthetic boilerplate.",
  "",
];

for (const qlId of STC_QL_IDS) {
  markdown.push(`## ${qlId}`, "");
  const authorities = STC_V2_EDITORIAL_AUTHORITIES.filter((entry) => entry.qlId === qlId);
  if (authorities.length !== 8) throw new Error(`${qlId}: expected 8 V2 authorities, found ${authorities.length}.`);

  for (let authorityIndex = 0; authorityIndex < authorities.length; authorityIndex += 1) {
    const seed = canonicalReviewSeedForAuthorityIndex(qlId, authorityIndex);
    const question = generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed });
    if (question.scenarioId !== authorities[authorityIndex]!.id || question.metadata.conclusionsReversed) {
      throw new Error(`${qlId}/${authorityIndex}: canonical review seed failed authority-order contract.`);
    }
    rows.push({ presentationProfile: "FOUR_WAY", canonicalReviewSeed: seed, ...question });
    markdown.push(
      `### ${authorityIndex + 1}. ${question.scenarioId} — ${question.surfaceArchetype} — ${question.difficulty}`,
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

await writeFile(join(outDir, "stc-001-v2-1-english-review.json"), jsonText, "utf8");
await writeFile(join(outDir, "stc-001-v2-1-english-review.md"), markdownText, "utf8");
await writeFile(
  join(outDir, "stc-001-v2-1-english-review-summary.json"),
  `${JSON.stringify({
    chapterId: "STC-001",
    version: "V2.1",
    locale: "en-IN",
    status: "EDITORIAL_REVIEW_READY_BUT_SATURATION_BLOCKED",
    frozen: false,
    questionCount: rows.length,
    permanentQlCount: STC_QL_IDS.length,
    authoritiesPerQl: 8,
    maximumDistinctCuratedPresentationsPerQlBeforeVariableization: 16,
    minimumDistinctQuestionsPerQlForGenerationReady: 1000,
    generationReady: false,
    bankingFiveWayEitherActive: false,
    jsonSha256,
    markdownSha256,
    localizationEnabled: true,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
  }, null, 2)}\n`,
  "utf8",
);

console.log(`PASS_STC_001_V2_1_ENGLISH_REVIEW_EXPORT questions=${rows.length} generationReady=false`);
console.log(`JSON_SHA256=${jsonSha256}`);
console.log(`MARKDOWN_SHA256=${markdownSha256}`);
