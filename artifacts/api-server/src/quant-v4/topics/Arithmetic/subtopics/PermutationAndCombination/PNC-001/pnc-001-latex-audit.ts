import { strict as assert } from "node:assert";
import { getPnc001QuestionLanguageIds } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

type Failure = {
  qlId: string;
  seed: string;
  checks: string[];
  stem: string;
  explanation: string[];
};

const failures: Failure[] = [];
let generated = 0;
for (const qlId of getPnc001QuestionLanguageIds()) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `pnc-latex-audit:${qlId}:${index}`;
    const pkg = runPnc001Pipeline({ questionLanguageId: qlId, seed });
    generated += 1;
    const failedLatexChecks = pkg.validation.checks
      .filter((check) => check.name.startsWith("latex-") && !check.passed)
      .map((check) => `${check.name}: ${check.message}`);
    if (failedLatexChecks.length > 0) {
      failures.push({
        qlId,
        seed,
        checks: failedLatexChecks,
        stem: pkg.stem,
        explanation: pkg.explanation.lines,
      });
    }
  }
}

console.log(JSON.stringify({
  generated,
  failureCount: failures.length,
  failures: failures.slice(0, 20),
}, null, 2));

assert.equal(failures.length, 0, `${failures.length} rendered PNC-001 case(s) violate the LaTeX contract`);
