import { strict as assert } from "node:assert";
import { runPnc002Cp011DistributionWave1Pipeline } from "./foundation/cp011-distribution-wave1-runtime";
import { runPnc002Cp011DistributionWave2Pipeline } from "./foundation/cp011-distribution-wave2-runtime";
import { runPnc002Cp011GroupingPipeline } from "./foundation/cp011-grouping-runtime";
import { runPnc002Cp011InversePipeline } from "./foundation/cp011-inverse-wave-runtime";
import { runPnc002Cp012Pipeline } from "./foundation/cp012-mixed-runtime-reviewed";
import {
  buildPnc002ApprovedLocalizedPresentation,
  PNC_002_COMPLETE_LOCALIZATION_APPROVED,
} from "./foundation/localization-pnc002-approved";
import type { PncStudentSourcePackage } from "./foundation/student-presentation";
import { buildPnc002ProductionTeacherStudentPresentation } from "./foundation/student-presentation-teacher-production";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";

const locales: readonly PncStudentLocale[] = ["hi-IN", "pa-IN"];
const seeds = ["complete-localisation-a", "complete-localisation-b"] as const;
const expectedIds = Array.from(
  { length: 163 },
  (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`,
);

function sourceFor(qlNumber: number, seed: string): PncStudentSourcePackage & {
  validation: { valid: boolean };
  publiclyPublishable: false;
} {
  const questionLanguageId = `PNC-QL-${String(qlNumber).padStart(3, "0")}`;
  if (qlNumber <= 208) {
    return runPnc002Pipeline({ questionLanguageId, seed });
  }
  if (qlNumber <= 218) {
    return runPnc002Cp011GroupingPipeline({ questionLanguageId, seed });
  }
  if (qlNumber <= 228) {
    return runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId, seed });
  }
  if (qlNumber <= 238) {
    return runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId, seed });
  }
  if (qlNumber <= 241) {
    return runPnc002Cp011InversePipeline({ questionLanguageId, seed });
  }
  return runPnc002Cp012Pipeline({ questionLanguageId, seed });
}

function numberTokens(value: string): string[] {
  return [...value.matchAll(/-?\d[\d,]*/g)].map((match) => match[0]!).sort();
}

function mathTokens(value: string): string[] {
  return [
    ...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g),
  ].map((match) => match[0]!).sort();
}

function stripMath(value: string): string {
  return value.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, " ");
}

assert.equal(PNC_002_COMPLETE_LOCALIZATION_APPROVED.releaseId, "PNC-002-HI-PA-v1-APPROVED-COMPLETE");
assert.equal(PNC_002_COMPLETE_LOCALIZATION_APPROVED.qlCount, 163);
assert.equal(PNC_002_COMPLETE_LOCALIZATION_APPROVED.checkpointCount, 6);
assert.equal(PNC_002_COMPLETE_LOCALIZATION_APPROVED.editorialStatus, "APPROVED");
assert.equal(PNC_002_COMPLETE_LOCALIZATION_APPROVED.publiclyPublishable, false);
assert.equal(PNC_002_COMPLETE_LOCALIZATION_APPROVED.approvedAt, "2026-07-29");
assert.deepEqual(
  PNC_002_COMPLETE_LOCALIZATION_APPROVED.checkpointReleases.map((release) => release.qlCount),
  [18, 23, 29, 32, 33, 28],
);
assert.equal(
  PNC_002_COMPLETE_LOCALIZATION_APPROVED.checkpointReleases.reduce((sum, release) => sum + release.qlCount, 0),
  163,
);

const auditedIds = new Set<string>();
let auditedPackages = 0;
for (let qlNumber = 107; qlNumber <= 269; qlNumber += 1) {
  const questionLanguageId = `PNC-QL-${String(qlNumber).padStart(3, "0")}`;
  auditedIds.add(questionLanguageId);
  for (const locale of locales) {
    for (const seedName of seeds) {
      const source = sourceFor(qlNumber, `${seedName}:${locale}:${questionLanguageId}`);
      assert.equal(source.validation.valid, true, `${questionLanguageId}: source runtime must be valid`);
      assert.equal(source.publiclyPublishable, false);
      const english = buildPnc002ProductionTeacherStudentPresentation(source);

      const localized = buildPnc002ApprovedLocalizedPresentation(source, locale);
      assert.equal(localized.questionLanguageId, questionLanguageId);
      assert.equal(localized.locale, locale);
      assert.equal(localized.sourceLocale, "en-GB");
      assert.equal(localized.editorialStatus, "APPROVED");
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.displayOptions.length, 4);
      assert.equal(new Set(localized.displayOptions).size, 4);
      assert.equal(localized.displayOptions[localized.correctIndex], localized.answerLabel);
      assert.deepEqual(numberTokens(localized.stem), numberTokens(english.stem), `${questionLanguageId}: numeric stem parity`);
      assert.deepEqual(mathTokens(localized.stem), mathTokens(english.stem), `${questionLanguageId}: MathJax stem parity`);
      assert.equal(/\{(?:m)?\d+\}/.test(localized.stem), false, `${questionLanguageId}: no unresolved localisation placeholders`);
      assert.equal(localized.explanationSections.length, 4);
      assert.deepEqual(
        localized.explanationSections.map((section) => section.kind),
        ["coreConcept", "stepByStep", "examSpeedShortcut", "commonTrapWarning"],
      );
      assert.equal(
        localized.explanationSections.find((section) => section.kind === "commonTrapWarning")?.lines.length,
        3,
      );

      const learnerText = [
        localized.stem,
        ...localized.displayOptions,
        localized.answerLabel,
        ...localized.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
      ].join("\n");
      const plainLearnerText = stripMath(learnerText);
      assert.equal(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(learnerText), false);
      assert.equal(/\b(?:how|many|ways|among|from|must|where|when|people|objects|boxes|groups|committee|selected|arranged|option)\b/i.test(plainLearnerText), false, `${questionLanguageId}: English learner-text leakage`);
      if (locale === "hi-IN") {
        assert.equal(/[\u0900-\u097F]/u.test(plainLearnerText), true);
        assert.equal(/[\u0A00-\u0A7F]/u.test(plainLearnerText), false);
      } else {
        assert.equal(/[\u0A00-\u0A7F]/u.test(plainLearnerText), true);
        assert.equal(/[\u0900-\u097F]/u.test(plainLearnerText), false);
      }
      auditedPackages += 1;
    }
  }
}

assert.deepEqual([...auditedIds], expectedIds);
assert.equal(auditedPackages, 163 * 2 * 2);

console.log(JSON.stringify({
  releaseId: PNC_002_COMPLETE_LOCALIZATION_APPROVED.releaseId,
  qlRange: PNC_002_COMPLETE_LOCALIZATION_APPROVED.qlRange,
  qlCount: PNC_002_COMPLETE_LOCALIZATION_APPROVED.qlCount,
  checkpointCount: PNC_002_COMPLETE_LOCALIZATION_APPROVED.checkpointCount,
  locales,
  auditedPackages,
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  status: "PASS_PNC_002_COMPLETE_HINDI_PUNJABI_LOCALISATION",
}, null, 2));
