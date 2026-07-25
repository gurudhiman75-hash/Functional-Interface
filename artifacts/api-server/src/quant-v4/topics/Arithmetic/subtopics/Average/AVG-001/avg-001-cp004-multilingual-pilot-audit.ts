import { strict as assert } from "node:assert";

import {
  AVG_001_CP004_MULTILINGUAL_PILOT,
  getAvg001Cp004LocalizedQlIds,
  runAvg001Cp004LocalizationPilot,
} from "./foundation/cp004-localization-quality-runtime";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
const qlIds = getAvg001Cp004LocalizedQlIds();
const expectedQlIds = [
  ...Array.from({ length: 65 }, (_, index) => `AVG-QL-${String(209 + index).padStart(3, "0")}`),
  ...Array.from({ length: 20 }, (_, index) => `AVG-QL-${String(406 + index).padStart(3, "0")}`),
];
const stemGroups = new Map<string, string[]>();
const explanationGroups = new Map<string, string[]>();
let generated = 0;

const normalize = (value: string) => value
  .toLowerCase()
  .replace(/[\d,.]+/g, "#")
  .replace(/\s+/g, " ")
  .trim();

const forbiddenGrammar = {
  hi: /(?:(?:के अंक|का वेतन|की बिक्री|की आयु|का उत्पादन|का राजस्व|का दैनिक खर्च|की उपज|का वजन) का औसत|समान समय तक .* कार्य करती है)/,
  pa: /(?:(?:ਦੇ ਅੰਕ|ਦੀ ਤਨਖਾਹ|ਦੀ ਵਿਕਰੀ|ਦੀ ਉਮਰ|ਦਾ ਉਤਪਾਦਨ|ਦਾ ਮਾਲੀਆ|ਦਾ ਰੋਜ਼ਾਨਾ ਖਰਚ|ਦੀ ਪੈਦਾਵਾਰ|ਦਾ ਵਜ਼ਨ) ਦੀ ਔਸਤ|ਬਰਾਬਰ ਸਮੇਂ ਲਈ .* ਕੰਮ ਕਰਦੀ ਹੈ)/,
};

for (const qlId of qlIds) {
  for (const language of AVG_001_CP004_MULTILINGUAL_PILOT.languages) {
    for (let seedIndex = 0; seedIndex < 2; seedIndex += 1) {
      const seed = `avg-cp004-localization:${qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({ questionLanguageId: qlId, seed, language: "en" });
      const localized = runAvg001Cp004LocalizationPilot({ questionLanguageId: qlId, seed, language });
      const repeated = runAvg001Cp004LocalizationPilot({ questionLanguageId: qlId, seed, language });
      const scope = `${qlId}:${language}:${seedIndex}`;
      generated += 1;

      if (!localized.validation.valid) {
        const failed = localized.validation.checks.filter((check) => !check.passed).map((check) => check.name);
        failures.push(`${scope}: validation failed [${failed.join(",")}]`);
      }
      if (localized.stem !== repeated.stem || localized.explanation.lines.join("\n") !== repeated.explanation.lines.join("\n")) {
        failures.push(`${scope}: localization is not deterministic`);
      }
      if (localized.answer !== english.answer || localized.correctIndex !== english.correctIndex || JSON.stringify(localized.options) !== JSON.stringify(english.options)) {
        failures.push(`${scope}: answer or option parity changed`);
      }
      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint || JSON.stringify(localized.parameters.values) !== JSON.stringify(english.parameters.values)) {
        failures.push(`${scope}: mathematical state changed`);
      }
      if (localized.explanation.lines.length !== 4 || !localized.explanation.lines.some((line) => line.includes(localized.answer))) {
        failures.push(`${scope}: explanation contract failed`);
      }
      if (/[A-Za-z{}]|undefined|NaN|Infinity|null/.test(localized.stem)) {
        failures.push(`${scope}: unresolved or Latin fallback in stem :: ${localized.stem}`);
      }
      if (forbiddenGrammar[language].test(localized.stem)) {
        failures.push(`${scope}: known localized grammar defect :: ${localized.stem}`);
      }
      if (localized.maturity !== "MANUAL_REVIEW" || localized.publiclyPublishable) {
        failures.push(`${scope}: localization escaped review-only status`);
      }
      const academicMarks =
        /boysGirlsMarks|twoSectionsScores|threeClassesMarks|fourBatchesMarks/i.test(english.parameters.scenarioVariant) ||
        ["AVG-QL-406", "AVG-QL-412"].includes(qlId);
      if (academicMarks) {
        if (language === "hi" && (!/अंक/.test(localized.stem) || /स्कोर/.test(localized.stem))) failures.push(`${scope}: Hindi marks terminology failed`);
        if (language === "pa" && (!/ਅੰਕ/.test(localized.stem) || /ਸਕੋਰ/.test(localized.stem))) failures.push(`${scope}: Punjabi marks terminology failed`);
      }

      if (seedIndex === 0) {
        const stemKey = `${language}:${normalize(localized.stem)}`;
        stemGroups.set(stemKey, [...(stemGroups.get(stemKey) ?? []), qlId]);
        const explanationKey = `${language}:${normalize(localized.explanation.lines.join(" "))}`;
        explanationGroups.set(explanationKey, [...(explanationGroups.get(explanationKey) ?? []), qlId]);
      }
    }
  }
}

for (const [key, ids] of stemGroups) {
  if (ids.length > 1) failures.push(`normalized duplicate stem ${ids.join(",")} :: ${key}`);
}
for (const [key, ids] of explanationGroups) {
  if (ids.length > 1) failures.push(`normalized duplicate explanation ${ids.join(",")} :: ${key}`);
}

if (qlIds.length !== AVG_001_CP004_MULTILINGUAL_PILOT.qlCount) {
  failures.push(`inventory mismatch: expected ${AVG_001_CP004_MULTILINGUAL_PILOT.qlCount}, found ${qlIds.length}`);
}
if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) {
  failures.push(`QL inventory differs from the expected original and gap-expansion ranges`);
}

console.log(JSON.stringify({
  releaseId: AVG_001_CP004_MULTILINGUAL_PILOT.releaseId,
  qlCount: qlIds.length,
  originalRange: "AVG-QL-209..AVG-QL-273",
  gapExpansionRange: "AVG-QL-406..AVG-QL-425",
  languages: AVG_001_CP004_MULTILINGUAL_PILOT.languages,
  generated,
  normalizedStemGroups: stemGroups.size,
  normalizedExplanationGroups: explanationGroups.size,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — EXHAUSTIVE CP-004 HINDI/PUNJABI RUNTIME PROOF",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
