import assert from "node:assert/strict";

import {
  COD_001_QUESTION_STUDIO_LOCALES,
  COD_001_QUESTION_STUDIO_QL_IDS,
  previewCod001QuestionStudioReview,
} from "./question-studio-review";

function optionValue(option: unknown): string {
  if (typeof option === "string" || typeof option === "number") return String(option);
  if (!option || typeof option !== "object") return String(option ?? "");
  const record = option as Record<string, unknown>;
  const direct = record.value ?? record.answer ?? record.text ?? record.label;
  if (typeof direct === "string" || typeof direct === "number") return String(direct);
  const members = record.members ?? record.tokens ?? record.words;
  return Array.isArray(members) ? members.map(String).join(", ") : String(direct ?? "");
}

const seedsPerQlLocale = 6;
let checked = 0;

for (const qlId of COD_001_QUESTION_STUDIO_QL_IDS) {
  for (const locale of COD_001_QUESTION_STUDIO_LOCALES) {
    const stems = new Set<string>();
    const answerPositions = new Set<number>();

    for (let seed = 0; seed < seedsPerQlLocale; seed++) {
      const preview = previewCod001QuestionStudioReview({
        qlId,
        locale,
        seed: 23000 + seed,
      });
      const question = preview.question as Record<string, unknown>;
      const stem = String(question.stem ?? "").trim();
      const options = Array.isArray(question.options) ? question.options : [];
      const correctIndex = Number(question.correctIndex);

      assert.ok(stem.length >= 12, `${qlId}/${locale}/${seed}: stem is too thin.`);
      assert.doesNotMatch(
        stem,
        /associated with|most closely linked|broad(?:ly)?|prototype|authority|fingerprint|generator|COD-QL|COD-PQL/i,
        `${qlId}/${locale}/${seed}: mechanical/internal wording leaked into the stem.`,
      );

      assert.equal(options.length, 4, `${qlId}/${locale}/${seed}: expected four options.`);
      assert.equal(
        new Set(options.map(optionValue)).size,
        4,
        `${qlId}/${locale}/${seed}: duplicate displayed options.`,
      );
      assert.ok(
        Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4,
        `${qlId}/${locale}/${seed}: invalid correct index.`,
      );

      const learnerText = JSON.stringify({
        stem,
        explanation: question.explanation,
      });
      assert.doesNotMatch(
        learnerText,
        /prototypeOnly|hiddenFingerprint|sourcePrototypeId|solveContractId|generationAttempt/i,
        `${qlId}/${locale}/${seed}: internal QA vocabulary leaked to learner surface.`,
      );

      stems.add(stem);
      answerPositions.add(correctIndex);
      checked++;
    }

    assert.ok(
      stems.size >= 2,
      `${qlId}/${locale}: visible stem surface is fixed across ${seedsPerQlLocale} seeds.`,
    );
    assert.ok(
      answerPositions.size >= 2,
      `${qlId}/${locale}: correct answer position is fixed across ${seedsPerQlLocale} seeds.`,
    );
  }
}

console.log(JSON.stringify({
  status: "PASS_COD_001_GENERATED_PROFILE",
  qlCount: COD_001_QUESTION_STUDIO_QL_IDS.length,
  locales: COD_001_QUESTION_STUDIO_LOCALES,
  seedsPerQlLocale,
  learnerSurfacesChecked: checked,
  minimumVisibleStemVariants: 2,
  minimumAnswerPositions: 2,
}, null, 2));
