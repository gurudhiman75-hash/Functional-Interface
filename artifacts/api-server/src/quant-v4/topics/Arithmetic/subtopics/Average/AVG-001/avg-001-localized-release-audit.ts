import { strict as assert } from "node:assert";

import {
  AVG_001_LOCALIZED_RELEASE,
  runAvg001LocalizedRelease,
} from "./foundation/localized-release";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.active);
const languages = ["hi", "pa"] as const;
const failures: string[] = [];
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function hasRequiredScript(language: "hi" | "pa", value: string) {
  return language === "hi" ? /[\u0900-\u097F]/.test(value) : /[\u0A00-\u0A7F]/.test(value);
}

assert.equal(entries.length, AVG_001_LOCALIZED_RELEASE.qlCountPerLanguage);

for (const entry of entries) {
  for (const language of languages) {
    for (let seedIndex = 0; seedIndex < 2; seedIndex += 1) {
      const seed = `avg-001-localized-release:${language}:${entry.qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
      const localized = runAvg001LocalizedRelease({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const repeated = runAvg001LocalizedRelease({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      generated += 1;

      const releaseId = AVG_001_LOCALIZED_RELEASE.releases[language].releaseId;
      if (localized.language !== language) fail(`${entry.qlId}:${language}:${seedIndex}: language mismatch`);
      if (localized.maturity !== "FROZEN" || !localized.publiclyPublishable) {
        fail(`${entry.qlId}:${language}:${seedIndex}: package is not frozen and publishable`);
      }
      if (localized.traceability.releaseId !== releaseId) {
        fail(`${entry.qlId}:${language}:${seedIndex}: release ID mismatch`);
      }
      if (localized.traceability.questionStudioRelease !== true) {
        fail(`${entry.qlId}:${language}:${seedIndex}: Question Studio release marker missing`);
      }
      if (localized.traceability.mathematicalAuthorityLanguage !== "en") {
        fail(`${entry.qlId}:${language}:${seedIndex}: English mathematical authority marker missing`);
      }
      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        const failed = localized.validation.checks
          .filter((check) => !check.passed)
          .map((check) => check.name)
          .join(", ");
        fail(`${entry.qlId}:${language}:${seedIndex}: validation failed [${failed}]`);
      }
      if (!localized.validation.checks.some((check) => check.name === "localized-release-approval" && check.passed)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: localized release approval missing`);
      }
      if (!hasRequiredScript(language, localized.stem)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: required script missing from stem`);
      }
      if (!hasRequiredScript(language, localized.explanation.lines.join(" "))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: required script missing from explanation`);
      }
      if (/[{}]|undefined|NaN|Infinity|null/.test(localized.stem)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: unresolved stem token`);
      }
      if (localized.explanation.lines.length !== 4) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation is not exactly four lines`);
      }
      if (localized.answer !== english.answer || localized.correctIndex !== english.correctIndex) {
        fail(`${entry.qlId}:${language}:${seedIndex}: answer or correct index changed`);
      }
      if (JSON.stringify(localized.options) !== JSON.stringify(english.options)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: option values changed`);
      }
      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint) {
        fail(`${entry.qlId}:${language}:${seedIndex}: mathematical fingerprint changed`);
      }
      if (JSON.stringify(localized.parameters.values) !== JSON.stringify(english.parameters.values)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: mathematical parameters changed`);
      }
      if (
        localized.stem !== repeated.stem ||
        localized.answer !== repeated.answer ||
        JSON.stringify(localized.options) !== JSON.stringify(repeated.options) ||
        JSON.stringify(localized.explanation.lines) !== JSON.stringify(repeated.explanation.lines)
      ) {
        fail(`${entry.qlId}:${language}:${seedIndex}: localized release is not deterministic`);
      }
    }
  }
}

assert.throws(
  () => runAvg001LocalizedRelease({ questionLanguageId: "AVG-QL-001", language: "en" as never }),
  /Hindi or Punjabi only/,
);

console.log(JSON.stringify({
  releases: {
    hi: AVG_001_LOCALIZED_RELEASE.releases.hi.releaseId,
    pa: AVG_001_LOCALIZED_RELEASE.releases.pa.releaseId,
  },
  qlCountPerLanguage: entries.length,
  generated,
  deterministicReplayCases: generated,
  mathematicalParityCases: generated,
  scriptCases: generated,
  fingerprintChanges: 0,
  failureCount: failures.length,
  failures: failures.slice(0, 250),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
