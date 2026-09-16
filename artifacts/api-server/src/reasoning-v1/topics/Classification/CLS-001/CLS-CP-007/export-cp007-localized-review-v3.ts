import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { type ClsCp007LocalizedLocale } from "./cp007-localized-runtime";
import {
  generateClsCp007LocalizedClusterQuestionV3,
  generateClsCp007LocalizedPairQuestionV3,
} from "./cp007-localized-runtime-v3";
import type { ClsCp007PrototypeId } from "./types";

const OUTPUT_DIR = join(process.cwd(), "dist/reasoning-v1/cls-001/cp007-localized-review-v3");
const LOCALES: readonly ClsCp007LocalizedLocale[] = ["hi-IN", "pa-IN"];
const PROTOTYPES: readonly ClsCp007PrototypeId[] = [
  "CLS-CP007-PROT-001", "CLS-CP007-PROT-002", "CLS-CP007-PROT-003",
  "CLS-CP007-PROT-004", "CLS-CP007-PROT-005", "CLS-CP007-PROT-006",
  "CLS-CP007-PROT-007", "CLS-CP007-PROT-008", "CLS-CP007-PROT-009",
  "CLS-CP007-PROT-010", "CLS-CP007-PROT-011", "CLS-CP007-PROT-012",
  "CLS-CP007-PROT-013",
];
const SINGLE_SAMPLES_PER_PROTOTYPE = 3;
const PAIR_SAMPLES_PER_LOCALE = 12;

const questions: Array<ReturnType<typeof generateClsCp007LocalizedClusterQuestionV3> | ReturnType<typeof generateClsCp007LocalizedPairQuestionV3>> = [];

for (const locale of LOCALES) {
  for (const prototypeId of PROTOTYPES) {
    for (let sample = 0; sample < SINGLE_SAMPLES_PER_PROTOTYPE; sample += 1) {
      const seed = sample * 7 + PROTOTYPES.indexOf(prototypeId);
      questions.push(generateClsCp007LocalizedClusterQuestionV3(locale, prototypeId, seed, sample === 2 ? 5 : 4));
    }
  }
  for (let sample = 0; sample < PAIR_SAMPLES_PER_LOCALE; sample += 1) {
    questions.push(generateClsCp007LocalizedPairQuestionV3(locale, sample * 5, sample % 4 === 3 ? 5 : 4));
  }
}

if (questions.length !== 102) throw new Error(`Expected 102 CP007 V3 review questions, received ${questions.length}`);

const lines: string[] = [
  "# CLS-CP-007 Hindi and Punjabi Localisation Review V3",
  "",
  "Status: `LOCALIZED_REVIEW_REQUIRED`",
  "",
  "Runtime: `cls-cp007-multilingual-review-v3`",
  "",
  `Questions: ${questions.length}`,
  "",
  "Coverage: three samples for each of the 13 CLS-QL-012 single-cluster prototype families in each native locale, plus 12 CLS-QL-013 cluster-pair samples per locale.",
  "",
  "V3 preserves the V2/English question state. Full option evidence remains available in structured QA data, while the learner explanation uses one representative matching example plus the outlier and conclusion instead of routine option-by-option analysis.",
  "",
];

questions.forEach((question, index) => {
  lines.push(`## ${index + 1}. ${question.metadata.locale} · ${question.permanentQlId} · ${question.prototypeId}`);
  lines.push("");
  lines.push(`- Seed: ${question.seed}`);
  lines.push(`- Difficulty: ${question.difficulty}`);
  lines.push(`- Rule: ${question.intendedRuleId}`);
  lines.push(`- Stem: ${question.stem}`);
  lines.push("");
  question.options.forEach((option, optionIndex) => {
    const marker = optionIndex === question.correctIndex ? " **← Correct**" : "";
    lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}${marker}`);
  });
  lines.push("", `**Answer:** ${question.answer}`, "", "**Explanation**", "");
  question.explanation.coreConcept.forEach((text) => lines.push(`- ${text}`));
  question.explanation.stepByStep.forEach((text, stepIndex) => lines.push(`${stepIndex + 1}. ${text}`));
  lines.push("", "---", "");
});

const manifest = {
  chapterId: "CLS-001",
  checkpointId: "CLS-CP-007",
  status: "LOCALIZED_REVIEW_REQUIRED",
  runtimeVersion: "cls-cp007-multilingual-review-v3",
  editorialVersion: "compact-learner-explanation-v3",
  locales: LOCALES,
  qlIds: ["CLS-QL-012", "CLS-QL-013"],
  questionCount: questions.length,
  singlePrototypeCount: PROTOTYPES.length,
  singleSamplesPerPrototypePerLocale: SINGLE_SAMPLES_PER_PROTOTYPE,
  pairSamplesPerLocale: PAIR_SAMPLES_PER_LOCALE,
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  questions,
};

await mkdir(OUTPUT_DIR, { recursive: true });
await writeFile(join(OUTPUT_DIR, "cls-cp007-hi-pa-review-v3.md"), `${lines.join("\n")}\n`, "utf8");
await writeFile(join(OUTPUT_DIR, "cls-cp007-hi-pa-review-v3.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log("CLS-CP-007 Hindi/Punjabi V3 review exported.", {
  outputDir: OUTPUT_DIR,
  questions: questions.length,
  locales: LOCALES,
  qls: manifest.qlIds,
});
