import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getMenCp007PrototypeIds, getMenCp007Prototype } from "../foundation/prototype-registry";
import { generateMenCp007Prototype } from "../foundation/runtime";
import { getMenCp007Wave01PrototypeIds, getMenCp007Wave01Prototype } from "../gap-wave-01/registry";
import { generateMenCp007Wave01Prototype } from "../gap-wave-01/runtime";
import { getMenCp007Wave02PrototypeIds, getMenCp007Wave02Prototype } from "../gap-wave-02/registry";
import { generateMenCp007Wave02Prototype } from "../gap-wave-02/runtime";
import { getMenCp007Wave03PrototypeIds, getMenCp007Wave03Prototype } from "../gap-wave-03/registry";
import { generateMenCp007Wave03Prototype } from "../gap-wave-03/runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/men-002-cp007-production-review");
mkdirSync(outputDirectory, { recursive: true });

const tracks = [
  {
    id: "foundation",
    title: "Prototype Foundation",
    ids: getMenCp007PrototypeIds(),
    disposition: (id: string) => getMenCp007Prototype(id as never).provisionalDisposition,
    generate: (id: string, seed: string) => generateMenCp007Prototype(id as never, seed),
  },
  {
    id: "gap-wave-01",
    title: "Gap Wave 01",
    ids: getMenCp007Wave01PrototypeIds(),
    disposition: (id: string) => getMenCp007Wave01Prototype(id as never).disposition,
    generate: (id: string, seed: string) => generateMenCp007Wave01Prototype(id as never, seed),
  },
  {
    id: "gap-wave-02",
    title: "Gap Wave 02",
    ids: getMenCp007Wave02PrototypeIds(),
    disposition: (id: string) => getMenCp007Wave02Prototype(id as never).disposition,
    generate: (id: string, seed: string) => generateMenCp007Wave02Prototype(id as never, seed),
  },
  {
    id: "gap-wave-03",
    title: "Gap Wave 03",
    ids: getMenCp007Wave03PrototypeIds(),
    disposition: (id: string) => getMenCp007Wave03Prototype(id as never).disposition,
    generate: (id: string, seed: string) => generateMenCp007Wave03Prototype(id as never, seed),
  },
] as const;

const records = tracks.flatMap((track) =>
  track.ids.flatMap((prototypeId) =>
    [0, 1, 2].map((sampleIndex) => ({
      trackId: track.id,
      trackTitle: track.title,
      disposition: track.disposition(prototypeId),
      question: track.generate(
        prototypeId,
        `men-cp007-production-review:${track.id}:${prototypeId}:${sampleIndex}`,
      ),
    })),
  ),
);

writeFileSync(
  resolve(outputDirectory, "men-cp-007-production-review.json"),
  JSON.stringify(records, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const summary = tracks.map((track) => ({
  track: track.title,
  contracts: track.ids.length,
  reviewRows: track.ids.length * 3,
}));

writeFileSync(
  resolve(outputDirectory, "men-cp-007-production-review-summary.json"),
  JSON.stringify({
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-007",
    authority: "EXAMTREE-MOCK-TEST-CONTENT-QUALITY-AUTHORITY",
    language: "English",
    currency: "Indian rupee",
    permanentQlCount: 0,
    totalContracts: tracks.reduce((total, track) => total + track.ids.length, 0),
    totalReviewRows: records.length,
    tracks: summary,
  }, null, 2),
  "utf8",
);

const markdown = [
  "# MEN-CP-007 Complete Production Review",
  "",
  "> Hardened under the approved ExamTree Mock Test Content Quality & Editorial Operations Authority.",
  "",
  "```text",
  "Package:              MEN-002",
  "Canonical problem:    MEN-CP-007 — Cubes, Cuboids & Prisms",
  "Language:             English",
  "Currency:             Indian rupee with Indian grouping",
  "Temporary contracts:  64",
  "Review questions:     192",
  "Permanent QLs:        0",
  "Publication:          disabled",
  "```",
  "",
  ...records.flatMap(({ trackTitle, disposition, question }, index) => [
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    `- Track: \`${trackTitle}\``,
    `- Seed: \`${question.seed}\``,
    `- Solve mode: \`${question.solveMode}\``,
    `- Target: \`${question.target}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Provisional disposition: \`${disposition}\``,
    `- Independent verification: ${question.verification.valid ? "PASS" : "FAIL"} — ${question.verification.method}`,
    `- Lifecycle: ${question.reviewStatus} / ${question.questionBankStatus} / ${question.testEligibility}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...question.options.map((option) => `- ${option.label}. ${option.display}`),
    "",
    `**Reviewer answer:** ${question.answer}`,
    "",
    "### 📌 Core Concept & Formula",
    "",
    question.explanation.keyRule,
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...question.explanation.steps.flatMap((step, stepIndex) => [
      `${stepIndex + 1}. **${step.title}**`,
      `   ${step.body}`,
      ...(step.equation ? [`   ${step.equation}`] : []),
      "",
    ]),
    "### ⚡ Exam Speed Shortcut",
    "",
    question.explanation.shortcut,
    "",
    "### ⚠️ Common Traps & Distractor Analysis",
    "",
    ...question.explanation.traps.map((trap) => `- ${trap}`),
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(
  resolve(outputDirectory, "men-cp-007-production-review.md"),
  markdown,
  "utf8",
);

console.log(`Generated ${records.length} hardened MEN-CP-007 review questions in ${outputDirectory}.`);
