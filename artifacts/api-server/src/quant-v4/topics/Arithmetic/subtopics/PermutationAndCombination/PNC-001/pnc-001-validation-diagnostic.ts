import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPnc001QuestionLanguageIds } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

const failures = getPnc001QuestionLanguageIds().flatMap((qlId) => {
  const seed = `audit:${qlId}`;
  const pkg = runPnc001Pipeline({ questionLanguageId: qlId, seed });
  const failedChecks = pkg.validation.checks.filter((check) => !check.passed);
  return failedChecks.length === 0 ? [] : [{
    qlId,
    seed,
    failedChecks,
    stem: pkg.stem,
    answer: pkg.answer,
    solverEquation: pkg.solver.equation,
    solverMathJax: pkg.solver.mathJax,
    explanation: pkg.explanation.lines,
  }];
});

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-001-validation-diagnostic");
mkdirSync(outputDirectory, { recursive: true });
const payload = {
  activeQlCount: getPnc001QuestionLanguageIds().length,
  invalidCount: failures.length,
  failures,
};
writeFileSync(resolve(outputDirectory, "validation-diagnostic.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ activeQlCount: payload.activeQlCount, invalidCount: payload.invalidCount }, null, 2));
