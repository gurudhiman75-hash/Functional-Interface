import assert from "node:assert/strict";
import {
  CALENDAR_PERMANENT_QL_IDS,
} from "./permanent-contracts.ts";
import {
  runCal001QuestionStudioPipeline,
} from "./question-studio-runtime.ts";

const forbiddenLearnerDiagnostics = [
  /option is incorrect/i,
  /verified calculation/i,
  /closest trap/i,
  /विकल्प गलत/u,
  /सत्यापित गणना/u,
  /सबसे नज़दीकी जाल/u,
  /ਵਿਕਲਪ ਗਲਤ/u,
  /ਪ੍ਰਮਾਣਿਤ ਗਣਨਾ/u,
];

let checked = 0;

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    for (let seedIndex = 0; seedIndex < 6; seedIndex++) {
      const pkg = runCal001QuestionStudioPipeline(qlId, {
        language,
        seed: `cal-deep-audit-wave1:${qlId}:${language}:${seedIndex}`,
      });

      assert(pkg.explanation.lines.length >= 2, `${qlId} ${language}: explanation is too thin.`);
      const learnerText = pkg.explanation.lines.join(" ");

      for (const forbidden of forbiddenLearnerDiagnostics) {
        assert(
          !forbidden.test(learnerText),
          `${qlId} ${language}: QA/trap diagnostics leaked into learner explanation: ${forbidden}`,
        );
      }

      assert(
        pkg.options.length === 4 && new Set(pkg.options).size === 4,
        `${qlId} ${language}: option integrity failed.`,
      );
      assert(
        pkg.options[pkg.correctIndex] === pkg.answer,
        `${qlId} ${language}: answer index mismatch.`,
      );

      checked++;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_DEEP_AUDIT_WAVE1",
  qlCount: CALENDAR_PERMANENT_QL_IDS.length,
  languages: ["en", "hi", "pa"],
  seedsPerQlPerLanguage: 6,
  learnerSurfacesChecked: checked,
  learnerTrapDiagnosticsProjected: false,
}, null, 2));
