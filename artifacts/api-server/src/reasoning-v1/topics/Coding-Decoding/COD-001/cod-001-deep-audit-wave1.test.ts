import assert from "node:assert/strict";

import {
  COD_001_QUESTION_STUDIO_LOCALES,
  COD_001_QUESTION_STUDIO_QL_IDS,
  previewCod001QuestionStudioReview,
} from "./question-studio-review";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

let checked = 0;

for (const qlId of COD_001_QUESTION_STUDIO_QL_IDS) {
  for (const locale of COD_001_QUESTION_STUDIO_LOCALES) {
    const preview = previewCod001QuestionStudioReview({
      qlId,
      locale,
      seed: 17031,
    });

    const question = preview.question as Record<string, unknown>;
    const explanation = asRecord(question.explanation);
    const pedagogy = asRecord(explanation.pedagogicalPresentation);

    assert.equal(preview.reviewOnly, true);
    assert.equal(preview.questionStudioVisible, true);
    assert.equal(explanation.quickMethod, undefined, `${qlId}/${locale}: quickMethod leaked to Question Studio.`);
    assert.equal(explanation.commonTrapAlert, undefined, `${qlId}/${locale}: commonTrapAlert leaked to Question Studio.`);
    assert.equal(explanation.closestTrapRejection, undefined, `${qlId}/${locale}: closestTrapRejection leaked to Question Studio.`);
    assert.equal(pedagogy.examShortcut, undefined, `${qlId}/${locale}: examShortcut leaked to Question Studio.`);
    assert.equal(pedagogy.commonTrap, undefined, `${qlId}/${locale}: commonTrap leaked to Question Studio.`);

    if (Object.keys(pedagogy).length > 0) {
      assert.ok(String(pedagogy.coreRule ?? "").trim().length > 0, `${qlId}/${locale}: core rule missing.`);
      assert.ok(Array.isArray(pedagogy.stepByStep), `${qlId}/${locale}: worked steps missing.`);
    }

    checked++;
  }
}

assert.equal(checked, 203 * 3);

console.log(JSON.stringify({
  status: "PASS_COD_001_DEEP_AUDIT_WAVE1",
  qlCount: COD_001_QUESTION_STUDIO_QL_IDS.length,
  locales: COD_001_QUESTION_STUDIO_LOCALES,
  questionStudioLearnerSurfacesChecked: checked,
  forcedShortcutProjected: false,
  forcedTrapAnalysisProjected: false,
}, null, 2));
