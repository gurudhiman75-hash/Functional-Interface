import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  NUMBER_SYSTEM_FAMILY_IDS,
  createNumberSystemProblem,
} from "../canonical/number-system-motif-factories";
import {
  auditNumberSystemExplanationStyle,
  shortcutDistinctnessAudit,
} from "../canonical/number-system-explanation-builder";

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseCount() {
  const raw = Number(argValue("count") ?? "300");
  return Number.isFinite(raw) ? Math.max(1, Math.min(3000, Math.floor(raw))) : 300;
}

async function main() {
  const count = parseCount();
  const runId = `ns-explanation-style-${Date.now()}`;
  const failures: Array<{ index: number; family: string; issues: string[]; en: string }> = [];
  let generated = 0;

  for (let index = 0; index < count; index += 1) {
    const family = NUMBER_SYSTEM_FAMILY_IDS[index % NUMBER_SYSTEM_FAMILY_IDS.length]!;
    try {
      const problem = createNumberSystemProblem({
        seed: `${runId}:${index}:${family}`,
        runId,
        difficulty: index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard",
        family,
      });
      generated += 1;
      const audit = auditNumberSystemExplanationStyle({
        explanation: problem.localizationData.explanation,
        shortcut: problem.shortcutExplanation,
      });
      if (!audit.valid) {
        failures.push({
          index: index + 1,
          family,
          issues: audit.issues,
          en: problem.localizationData.explanation.en.slice(0, 500),
        });
      }
    } catch (error) {
      failures.push({
        index: index + 1,
        family,
        issues: [error instanceof Error ? error.message : "generation failed"],
        en: "",
      });
    }
  }

  const summary = {
    requested: count,
    generated,
    failureCount: failures.length,
    passRate: generated ? ((generated - failures.length) / generated) : 0,
    failures: failures.slice(0, 40),
  };

  const outPath = path.join(process.cwd(), "exports", "number-system-explanation-style-audit.json");
  await writeFile(outPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

void main();

export { shortcutDistinctnessAudit };
