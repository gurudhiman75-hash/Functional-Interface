import { runPct003Pipeline } from "./PCT-003/foundation/pipeline";
import { PCT_003_CP_IDS, type Pct003CanonicalProblemId } from "./PCT-003/foundation/types";
import { runPct004Pipeline } from "./PCT-004/foundation/pipeline";
import { PCT_004_CP_IDS, type Pct004CanonicalProblemId } from "./PCT-004/foundation/types";
import { runPct005Pipeline } from "./PCT-005/foundation/pipeline";
import { PCT_005_CP_IDS, type Pct005CanonicalProblemId } from "./PCT-005/foundation/types";
import { runPct006Pipeline } from "./PCT-006/foundation/pipeline";
import { PCT_006_CP_IDS, type Pct006CanonicalProblemId } from "./PCT-006/foundation/types";
import { runPct007Pipeline } from "./PCT-007/foundation/pipeline";
import { PCT_007_CP_IDS, type Pct007CanonicalProblemId } from "./PCT-007/foundation/types";

type Language = "hi" | "pa";

type ModuleCase =
  | {
      packageId: "PCT-003";
      cpIds: readonly Pct003CanonicalProblemId[];
      run: typeof runPct003Pipeline;
    }
  | {
      packageId: "PCT-004";
      cpIds: readonly Pct004CanonicalProblemId[];
      run: typeof runPct004Pipeline;
    }
  | {
      packageId: "PCT-005";
      cpIds: readonly Pct005CanonicalProblemId[];
      run: typeof runPct005Pipeline;
    }
  | {
      packageId: "PCT-006";
      cpIds: readonly Pct006CanonicalProblemId[];
      run: typeof runPct006Pipeline;
    }
  | {
      packageId: "PCT-007";
      cpIds: readonly Pct007CanonicalProblemId[];
      run: typeof runPct007Pipeline;
    };

const MODULES: readonly ModuleCase[] = [
  { packageId: "PCT-003", cpIds: PCT_003_CP_IDS, run: runPct003Pipeline },
  { packageId: "PCT-004", cpIds: PCT_004_CP_IDS, run: runPct004Pipeline },
  { packageId: "PCT-005", cpIds: PCT_005_CP_IDS, run: runPct005Pipeline },
  { packageId: "PCT-006", cpIds: PCT_006_CP_IDS, run: runPct006Pipeline },
  { packageId: "PCT-007", cpIds: PCT_007_CP_IDS, run: runPct007Pipeline },
];

const LANGUAGES: readonly Language[] = ["hi", "pa"];
const SEEDS_PER_COMBINATION = 30;

const failures: string[] = [];
let generated = 0;

for (const moduleCase of MODULES) {
  for (const cpId of moduleCase.cpIds as readonly string[]) {
    for (const language of LANGUAGES) {
      for (let seedIndex = 0; seedIndex < SEEDS_PER_COMBINATION; seedIndex += 1) {
        const seed = `${moduleCase.packageId}:${cpId}:${language}:crash-audit:${seedIndex}`;
        try {
          const pkg = moduleCase.run(cpId as never, { language, seed });
          generated += 1;
          if (pkg.language !== language) {
            failures.push(`${moduleCase.packageId}:${cpId}:${language}:${seedIndex} returned ${pkg.language}`);
          }
          if (!pkg.stem || !pkg.explanation) {
            failures.push(`${moduleCase.packageId}:${cpId}:${language}:${seedIndex} rendered empty visible text`);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`${moduleCase.packageId}:${cpId}:${language}:${seedIndex} ${message}`);
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`PCT-003-007 multilingual crash audit: FAILED`);
  console.error(`Generated before/around failures: ${generated}`);
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`PCT-003-007 multilingual crash audit: PASSED`);
  console.log(`Modules: ${MODULES.map((moduleCase) => moduleCase.packageId).join(", ")}`);
  console.log(`Languages: ${LANGUAGES.join(", ")}`);
  console.log(`Seeds per CP/language: ${SEEDS_PER_COMBINATION}`);
  console.log(`Generated packages: ${generated}`);
}
