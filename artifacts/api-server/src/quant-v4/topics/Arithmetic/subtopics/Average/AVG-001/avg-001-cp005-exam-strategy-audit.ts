import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import {
  runAvg001Cp005LocalizationPilot,
  type Avg001Cp005PilotLanguage,
} from "./foundation/cp005-localization-quality-runtime";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-005",
);
const localizedLanguages: Avg001Cp005PilotLanguage[] = ["hi", "pa"];
const failures: string[] = [];
let cases = 0;

function answerToken(answer: string) {
  return answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? answer;
}

function fail(label: string, condition: boolean) {
  if (!condition) failures.push(label);
}

for (const entry of entries) {
  for (let index = 0; index < 2; index += 1) {
    const seed = `avg-cp005-exam-strategy:${entry.qlId}:${index}`;
    const english = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed,
      language: "en",
    });
    cases += 1;

    const englishLast = english.explanation.lines.at(-1) ?? "";
    fail(`${entry.qlId}:${index}:en:line-count`, english.explanation.lines.length === 4);
    fail(`${entry.qlId}:${index}:en:contextual-conclusion`, /^(therefore|hence|so|thus)\b/i.test(englishLast));
    fail(`${entry.qlId}:${index}:en:shortcut-label`, englishLast.includes("Exam shortcut:"));
    fail(`${entry.qlId}:${index}:en:trap-label`, englishLast.includes("Trap:"));
    fail(
      `${entry.qlId}:${index}:en:answer-evidence`,
      englishLast.replaceAll(",", "").includes(answerToken(english.answer)),
    );
    fail(
      `${entry.qlId}:${index}:en:traceability`,
      english.traceability.cp005ExamStrategyFinalizer ===
        "AVG-CP-005 compact exam shortcut and trap guidance v1",
    );

    for (const language of localizedLanguages) {
      const localized = runAvg001Cp005LocalizationPilot({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      cases += 1;
      const last = localized.explanation.lines.at(-1) ?? "";
      const shortcutLabel = language === "hi"
        ? "परीक्षा शॉर्टकट:"
        : "ਇਮਤਿਹਾਨੀ ਛੋਟਾ ਤਰੀਕਾ:";
      const trapLabel = language === "hi" ? "सामान्य भूल:" : "ਆਮ ਗਲਤੀ:";

      fail(`${entry.qlId}:${index}:${language}:line-count`, localized.explanation.lines.length === 4);
      fail(`${entry.qlId}:${index}:${language}:shortcut-label`, last.includes(shortcutLabel));
      fail(`${entry.qlId}:${index}:${language}:trap-label`, last.includes(trapLabel));
      fail(
        `${entry.qlId}:${index}:${language}:answer-evidence`,
        last.replaceAll(",", "").includes(answerToken(localized.answer)),
      );
      fail(`${entry.qlId}:${index}:${language}:latin-fallback`, !/[A-Za-z]/.test(last));
      fail(
        `${entry.qlId}:${index}:${language}:answer-parity`,
        localized.answer === english.answer,
      );
      fail(
        `${entry.qlId}:${index}:${language}:option-parity`,
        JSON.stringify(localized.options) === JSON.stringify(english.options) &&
          localized.correctIndex === english.correctIndex,
      );
      fail(
        `${entry.qlId}:${index}:${language}:fingerprint-parity`,
        JSON.stringify(localized.mathematicalFingerprint) ===
          JSON.stringify(english.mathematicalFingerprint),
      );
      fail(
        `${entry.qlId}:${index}:${language}:release-safety`,
        localized.maturity === "MANUAL_REVIEW" && !localized.publiclyPublishable,
      );
      fail(`${entry.qlId}:${index}:${language}:validation`, localized.validation.valid);
    }
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      cases,
      failureCount: failures.length,
      failures,
    },
    null,
    2,
  ),
);

assert.equal(entries.length, 56);
assert.equal(cases, entries.length * 2 * 3);
assert.equal(failures.length, 0, failures.join("\n"));
