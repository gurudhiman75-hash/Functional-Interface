import { strict as assert } from "node:assert";
import {
  runAvg001Cp004LocalizationPilot,
  type Avg001Cp004PilotLanguage,
} from "./foundation/cp004-localization-quality-runtime";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-004",
);
const localizedLanguages: Avg001Cp004PilotLanguage[] = ["hi", "pa"];
const failures: string[] = [];
const modes = new Set<string>();
let cases = 0;

function answerToken(answer: string) {
  return answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?(?::-?\d+(?:\.\d+)?)?/)?.[0] ?? answer;
}

function fail(label: string, condition: boolean) {
  if (!condition) failures.push(label);
}

for (const entry of entries) {
  modes.add(entry.solveMode);
  for (let index = 0; index < 2; index += 1) {
    const seed = `avg-cp004-exam-strategy:${entry.qlId}:${index}`;
    const english = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed,
      language: "en",
    });
    cases += 1;

    const englishLast = english.explanation.lines.at(-1) ?? "";
    fail(`${entry.qlId}:${index}:en:line-count`, english.explanation.lines.length === 4);
    fail(`${entry.qlId}:${index}:en:conclusion`, /^(therefore|hence|so|thus)\b/i.test(englishLast));
    fail(`${entry.qlId}:${index}:en:shortcut`, englishLast.includes("Exam shortcut:"));
    fail(`${entry.qlId}:${index}:en:trap`, englishLast.includes("Trap:"));
    fail(`${entry.qlId}:${index}:en:answer`, englishLast.replaceAll(",", "").includes(answerToken(english.answer)));
    fail(
      `${entry.qlId}:${index}:en:traceability`,
      english.traceability.cp004ExamStrategyFinalizer ===
        "AVG-CP-004 compact exam shortcut and trap guidance v1",
    );

    for (const language of localizedLanguages) {
      const localized = runAvg001Cp004LocalizationPilot({
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
      fail(`${entry.qlId}:${index}:${language}:shortcut`, last.includes(shortcutLabel));
      fail(`${entry.qlId}:${index}:${language}:trap`, last.includes(trapLabel));
      fail(`${entry.qlId}:${index}:${language}:answer`, last.replaceAll(",", "").includes(answerToken(localized.answer)));
      fail(`${entry.qlId}:${index}:${language}:latin`, !/[A-Za-z]/.test(last));
      fail(`${entry.qlId}:${index}:${language}:answer-parity`, localized.answer === english.answer);
      fail(
        `${entry.qlId}:${index}:${language}:options`,
        JSON.stringify(localized.options) === JSON.stringify(english.options) &&
          localized.correctIndex === english.correctIndex,
      );
      fail(
        `${entry.qlId}:${index}:${language}:parameters`,
        JSON.stringify(localized.parameters.values) === JSON.stringify(english.parameters.values),
      );
      fail(
        `${entry.qlId}:${index}:${language}:fingerprint`,
        localized.mathematicalFingerprint === english.mathematicalFingerprint,
      );
      fail(
        `${entry.qlId}:${index}:${language}:release-safety`,
        localized.maturity === "MANUAL_REVIEW" && !localized.publiclyPublishable,
      );
      fail(`${entry.qlId}:${index}:${language}:validation`, localized.validation.valid);
    }
  }
}

console.log(JSON.stringify({
  qlCount: entries.length,
  solveModes: [...modes].sort(),
  cases,
  failureCount: failures.length,
  failures,
}, null, 2));

assert.equal(entries.length, 85);
assert.equal(modes.size, 9);
assert.equal(cases, entries.length * 2 * 3);
assert.equal(failures.length, 0, failures.join("\n"));
