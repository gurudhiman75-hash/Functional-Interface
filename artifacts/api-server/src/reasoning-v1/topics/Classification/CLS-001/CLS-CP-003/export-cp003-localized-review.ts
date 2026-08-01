import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  CLS_CP003_LOCALIZED_LOCALES,
  CLS_CP003_LOCALIZED_QL_IDS,
} from "./cp003-localized-contracts";
import { generateClsCp003LocalizedQuestionV3 } from "./cp003-localized-runtime-v3";

const OUTPUT_DIR = join(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp003-localized-review",
);
const SAMPLES_PER_PROTOTYPE_PER_LOCALE = 6;

const questions = [];
for (const locale of CLS_CP003_LOCALIZED_LOCALES) {
  const selectedByPrototype = new Map<string, number>();
  for (const qlId of CLS_CP003_LOCALIZED_QL_IDS) {
    for (let seed = 0; seed < 5000; seed += 1) {
      const question = generateClsCp003LocalizedQuestionV3(qlId, locale, seed);
      const count = selectedByPrototype.get(question.prototypeId) ?? 0;
      if (count >= SAMPLES_PER_PROTOTYPE_PER_LOCALE) continue;
      questions.push(question);
      selectedByPrototype.set(question.prototypeId, count + 1);
      const relevantPrototypeCount = qlId === "CLS-QL-005" ? 6 : 1;
      const qlSelected = [...selectedByPrototype.entries()]
        .filter(([prototypeId]) => qlId === "CLS-QL-005"
          ? prototypeId !== "CLS-CP003-PROT-007"
          : prototypeId === "CLS-CP003-PROT-007")
        .reduce((total, [, value]) => total + value, 0);
      if (qlSelected === relevantPrototypeCount * SAMPLES_PER_PROTOTYPE_PER_LOCALE) break;
    }
  }
  for (const prototypeId of [
    "CLS-CP003-PROT-001",
    "CLS-CP003-PROT-002",
    "CLS-CP003-PROT-003",
    "CLS-CP003-PROT-004",
    "CLS-CP003-PROT-005",
    "CLS-CP003-PROT-006",
    "CLS-CP003-PROT-007",
  ]) {
    if (selectedByPrototype.get(prototypeId) !== SAMPLES_PER_PROTOTYPE_PER_LOCALE) {
      throw new Error(`${locale} review selection incomplete for ${prototypeId}`);
    }
  }
}

if (questions.length !== 84) {
  throw new Error(`Expected 84 localized review questions, received ${questions.length}`);
}

const lines: string[] = [
  "# CLS-CP-003 Hindi and Punjabi Localisation Review",
  "",
  "Status: `LOCALIZED_REVIEW_REQUIRED`",
  "",
  "Runtime: `cls-cp003-localized-runtime-v3`",
  "",
  `Questions: ${questions.length}`,
  "",
  "The review corpus contains six deterministic samples for each of the seven prototype ancestries in each native locale. QL identities and solve contracts are preserved, while English-specific spelling features are replaced by governed native-script equivalents. V3 retains the balanced V2 mathematical state and adds natural native-language stems, gender-safe jumble explanations and simpler teacher wording.",
  "",
];

questions.forEach((question, index) => {
  lines.push(`## ${index + 1}. ${question.metadata.locale} · ${question.qlId} · ${question.prototypeId}`);
  lines.push("");
  lines.push(`- Seed: ${question.seed}`);
  lines.push(`- Difficulty: ${question.difficulty}`);
  lines.push(`- Adapted rule: ${question.metadata.adaptedRuleId}`);
  lines.push(`- Stem: ${question.stem}`);
  lines.push("");
  question.options.forEach((option, optionIndex) => {
    const marker = optionIndex === question.correctIndex ? " **← Correct**" : "";
    lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}${marker}`);
  });
  lines.push("");
  lines.push(`**Answer:** ${question.answer}`);
  lines.push("");
  lines.push("**Explanation**");
  lines.push("");
  lines.push(...question.explanation.coreConcept.map((text) => `- Rule: ${text}`));
  lines.push(...question.explanation.stepByStep.map((text) => `- ${text}`));
  lines.push(...question.explanation.examSpeedShortcut.map((text) => `- Shortcut: ${text}`));
  lines.push(...question.explanation.commonTrapWarning.map((text) => `- Trap: ${text}`));
  lines.push("");
  lines.push("---");
  lines.push("");
});

const manifest = {
  chapterId: "CLS-001",
  checkpointId: "CLS-CP-003",
  status: "LOCALIZED_REVIEW_REQUIRED",
  runtimeVersion: "cls-cp003-localized-runtime-v3",
  locales: CLS_CP003_LOCALIZED_LOCALES,
  qlIds: CLS_CP003_LOCALIZED_QL_IDS,
  questionCount: questions.length,
  questionsPerLocale: 42,
  samplesPerPrototypePerLocale: SAMPLES_PER_PROTOTYPE_PER_LOCALE,
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  questions,
};

await mkdir(OUTPUT_DIR, { recursive: true });
await writeFile(
  join(OUTPUT_DIR, "cls-cp003-hi-pa-review.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
await writeFile(
  join(OUTPUT_DIR, "cls-cp003-hi-pa-review.md"),
  `${lines.join("\n")}\n`,
  "utf8",
);

console.log("CLS-CP-003 localized V3 review exported.", {
  outputDir: OUTPUT_DIR,
  questions: questions.length,
  locales: CLS_CP003_LOCALIZED_LOCALES,
  qls: CLS_CP003_LOCALIZED_QL_IDS,
});
