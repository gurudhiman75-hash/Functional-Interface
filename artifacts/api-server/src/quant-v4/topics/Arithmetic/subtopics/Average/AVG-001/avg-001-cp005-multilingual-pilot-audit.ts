import { strict as assert } from "node:assert";

import {
  AVG_001_CP005_MULTILINGUAL_PILOT,
  getAvg001Cp005LocalizedQlIds,
  runAvg001Cp005LocalizationPilot,
} from "./foundation/cp005-localization-quality-runtime";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
const qlIds = getAvg001Cp005LocalizedQlIds();
const expectedQlIds = Array.from({ length: 56 }, (_, index) => `AVG-QL-${String(274 + index).padStart(3, "0")}`);
const stemGroups = new Map<string, string[]>();
const explanationGroups = new Map<string, string[]>();
let generated = 0;

const normalize = (value: string) => value
  .toLowerCase()
  .replace(/₹?[\d,.]+/g, "#")
  .replace(/\s+/g, " ")
  .trim();

function answerToken(answer: string) {
  return answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? answer;
}

const forbiddenGrammar = {
  hi: /(?:स्कोर|अंकों का औसत अंक|वेतन का औसत वेतन|आयु का औसत आयु|उत्पादन का औसत उत्पादन)/,
  pa: /(?:ਸਕੋਰ|ਅੰਕਾਂ ਦੀ ਔਸਤ ਅੰਕ|ਤਨਖਾਹ ਦੀ ਔਸਤ ਤਨਖਾਹ|ਉਮਰ ਦੀ ਔਸਤ ਉਮਰ|ਉਤਪਾਦਨ ਦੀ ਔਸਤ ਉਤਪਾਦਨ)/,
};

for (const qlId of qlIds) {
  for (const language of AVG_001_CP005_MULTILINGUAL_PILOT.languages) {
    for (let seedIndex = 0; seedIndex < 2; seedIndex += 1) {
      const seed = `avg-cp005-localization:${qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({ questionLanguageId: qlId, seed, language: "en" });
      const localized = runAvg001Cp005LocalizationPilot({ questionLanguageId: qlId, seed, language });
      const repeated = runAvg001Cp005LocalizationPilot({ questionLanguageId: qlId, seed, language });
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
      const token = answerToken(localized.answer);
      if (localized.explanation.lines.length !== 4 || !localized.explanation.lines.some((line) => line.replaceAll(",", "").includes(token))) {
        failures.push(`${scope}: explanation contract failed`);
      }
      if (/[A-Za-z{}]|undefined|NaN|Infinity|null/.test(localized.stem)) {
        failures.push(`${scope}: unresolved or Latin fallback in stem :: ${localized.stem}`);
      }
      if (forbiddenGrammar[language].test(localized.stem) || forbiddenGrammar[language].test(localized.explanation.lines.join(" "))) {
        failures.push(`${scope}: known localized terminology or grammar defect`);
      }
      if (localized.maturity !== "MANUAL_REVIEW" || localized.publiclyPublishable) {
        failures.push(`${scope}: localization escaped review-only status`);
      }
      if (localized.traceability.cp005LocalizationAuthorship !== "AVG-CP-005 context-authored localization v1") {
        failures.push(`${scope}: CP-005 authorship marker missing`);
      }
      if (english.parameters.scenarioVariant.startsWith("examMarksCorrection")) {
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
if (qlIds.length !== AVG_001_CP005_MULTILINGUAL_PILOT.qlCount) {
  failures.push(`inventory mismatch: expected ${AVG_001_CP005_MULTILINGUAL_PILOT.qlCount}, found ${qlIds.length}`);
}
if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) {
  failures.push("QL inventory differs from AVG-QL-274..AVG-QL-329");
}

console.log(JSON.stringify({
  releaseId: AVG_001_CP005_MULTILINGUAL_PILOT.releaseId,
  qlCount: qlIds.length,
  qlRange: "AVG-QL-274..AVG-QL-329",
  languages: AVG_001_CP005_MULTILINGUAL_PILOT.languages,
  generated,
  normalizedStemGroups: stemGroups.size,
  normalizedExplanationGroups: explanationGroups.size,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — EXHAUSTIVE CP-005 HINDI/PUNJABI RUNTIME PROOF",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
