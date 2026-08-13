import { writeFileSync } from "node:fs";

import {
  generateRnkCp007CategoryCompositionQuestion,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
} from "./cp007-category-composition-discovery-v1";
import {
  generateRnkCp007DerivedQuantityQuestion,
  RNK_CP007_SCALED_MODES,
  RNK_CP007_TRANSFER_MODES,
} from "./cp007-derived-quantity-discovery-v1";

const OUTPUT = process.argv[2] ?? "RNK-CP-007-DISCOVERY-V1.1-REVIEW-28Q.md";
const letters = ["A", "B", "C", "D"] as const;

type ReviewQuestion = {
  family: string;
  sourceForm: string;
  mode: string;
  stem: string;
  options: readonly (string | number)[];
  answerIndex: number;
  answer: string | number;
  explanation: string;
  fingerprint: string;
  metadata: Record<string, unknown>;
};

const category: ReviewQuestion[] = RNK_CP007_CATEGORY_COMPOSITION_MODES.flatMap((mode, modeIndex) =>
  Array.from({ length: 3 }, (_, sampleIndex) => {
    const reviewOrdinal = modeIndex * 3 + sampleIndex;
    const seed = modeIndex * 17 + sampleIndex * 5 + 3;
    const answerIndex = (reviewOrdinal % 4) as 0 | 1 | 2 | 3;
    const question = generateRnkCp007CategoryCompositionQuestion(mode, seed, answerIndex);
    return {
      family: question.prototypeId,
      sourceForm: "CATEGORY_COMPOSITION",
      mode: question.mode,
      stem: question.stem,
      options: question.options,
      answerIndex: question.answerIndex,
      answer: question.answer,
      explanation: question.explanation,
      fingerprint: question.mathematicalFingerprint,
      metadata: {
        partitionId: question.reviewMetadata.partitionId,
        evidenceCategory: question.evidence.category,
        evidenceSide: question.evidence.side,
        requestedSide: question.reviewMetadata.requestedSide,
        requestedCategory: question.reviewMetadata.requestedCategory,
        allDisplayedEvidenceEssential: question.reviewMetadata.allDisplayedEvidenceEssential,
      },
    };
  }),
);

const derivedModes = [...RNK_CP007_TRANSFER_MODES, ...RNK_CP007_SCALED_MODES] as const;
const derived: ReviewQuestion[] = derivedModes.flatMap((mode, modeIndex) =>
  Array.from({ length: 2 }, (_, sampleIndex) => {
    const seed = modeIndex * 19 + sampleIndex * 7 + 11;
    const answerIndex = ((modeIndex + sampleIndex) % 4) as 0 | 1 | 2 | 3;
    const question = generateRnkCp007DerivedQuantityQuestion(mode, seed, answerIndex);
    return {
      family: question.prototypeId,
      sourceForm: question.sourceForm,
      mode: question.mode,
      stem: question.stem,
      options: question.options,
      answerIndex: question.answerIndex,
      answer: question.answer,
      explanation: question.explanation,
      fingerprint: question.mathematicalFingerprint,
      metadata: {
        arithmeticOperationCount: question.reviewMetadata.arithmeticOperationCount,
        arithmeticBurden: question.reviewMetadata.arithmeticBurden,
        stateUniqueness: question.reviewMetadata.stateUniqueness,
      },
    };
  }),
);

const questions = [...category, ...derived];
if (questions.length !== 28) throw new Error(`Expected 28 review questions, found ${questions.length}`);
const answerPositions = [0, 0, 0, 0];
for (const question of questions) answerPositions[question.answerIndex] += 1;
if (answerPositions.some((count) => count !== 7)) {
  throw new Error(`Review answer positions are not 7/7/7/7: ${answerPositions.join("/")}`);
}

const lines: string[] = [];
lines.push("# RNK-CP-007 — Discovery V1.1 Manual Review Pack (28 Questions)");
lines.push("");
lines.push("Status: **discovery only — no permanent QL allocated**.");
lines.push("");
lines.push("This V1.1 pack remediates the first manual-review defects: decorative subgroup clues, impossible numeric distractors, ordinal grammar, synthetic scaled-object labels, weak rank distractors, and incomplete transfer conclusions.");
lines.push("");
lines.push("It tests two source-backed discovery families before any QL decision:");
lines.push("");
lines.push("- `CATEGORY_COMPOSITION_AROUND_RANK` — 12 questions, 3 per V1.1 mode;");
lines.push("- `DERIVED_QUANTITY_ORDER` — 16 questions across transfer and scaled-object source forms.");
lines.push("");
lines.push("`NUMERIC_VALUE_CONSTRAINED_ORDER` remains a merge candidate; `RELATIONAL_SIDE_COUNT_EQUATION` remains redirected toward CP001 extension audit.");
lines.push("");
lines.push(`Review answer positions: ${answerPositions.join(" / ")}.`);
lines.push("");
lines.push("## Part A — Questions");
lines.push("");

questions.forEach((question, index) => {
  lines.push(`### Q${index + 1}. ${question.family} / ${question.sourceForm} / ${question.mode}`);
  lines.push("");
  lines.push(question.stem);
  lines.push("");
  question.options.forEach((option, optionIndex) => lines.push(`${letters[optionIndex]}. ${option}`));
  lines.push("");
});

lines.push("---");
lines.push("");
lines.push("## Part B — Answers and Explanations");
lines.push("");

questions.forEach((question, index) => {
  lines.push(`### Q${index + 1}`);
  lines.push("");
  lines.push(`**Answer:** ${letters[question.answerIndex]} — ${question.answer}`);
  lines.push("");
  lines.push(`**Explanation:** ${question.explanation}`);
  lines.push("");
  lines.push(`**Discovery metadata:** ${Object.entries(question.metadata).map(([key, value]) => `${key}=${String(value)}`).join("; ")}`);
  lines.push("");
  lines.push(`**Fingerprint:** \`${question.fingerprint}\``);
  lines.push("");
});

lines.push("---");
lines.push("");
lines.push("## Lifecycle");
lines.push("");
lines.push("```text");
lines.push("permanent QLs:         0");
lines.push("next available QL:     RNK-QL-042");
lines.push("English freeze:        false");
lines.push("Question Studio:       DISABLED");
lines.push("persistence:           DISABLED");
lines.push("public publication:    false");
lines.push("Hindi/Punjabi:         NOT_STARTED");
lines.push("```");

writeFileSync(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "PASS",
  version: "RNK_CP007_DISCOVERY_REVIEW_V1_1",
  output: OUTPUT,
  questions: questions.length,
  categoryComposition: category.length,
  derivedQuantity: derived.length,
  answerPositions,
  permanentQlAllocated: false,
}, null, 2));
