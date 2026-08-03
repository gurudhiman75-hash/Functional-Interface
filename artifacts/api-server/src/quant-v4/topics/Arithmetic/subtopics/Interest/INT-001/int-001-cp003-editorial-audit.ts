import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP003_QL_IDS,
  generateIntCp003Question,
} from "./int-001-cp003-final-runtime";
import { buildIntCp003EditorialReview } from "./cp003-editorial-review";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

let editorialQuestions = 0;
let deterministicChecks = 0;
let schemaChecks = 0;
let mathJaxChecks = 0;
let derivationChecks = 0;
let optionAlignmentChecks = 0;
let trapTagChecks = 0;
let lifecycleChecks = 0;
const stems = new Set<string>();

for (const qlId of INT_CP003_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp003-editorial-audit:${qlId}:${index}`;
    const first = buildIntCp003EditorialReview(generateIntCp003Question(qlId, seed));
    const second = buildIntCp003EditorialReview(generateIntCp003Question(qlId, seed));
    if (stable(first) !== stable(second)) throw new Error(`${qlId}/${index}: editorial replay is not deterministic.`);
    deterministicChecks += 1;
    editorialQuestions += 1;

    if (first.editorialStatus !== "REMEDIATED_REVIEW_CANDIDATE") throw new Error(`${qlId}/${index}: editorial status mismatch.`);
    if (first.explanation.stepByStepSolution.length < 3) throw new Error(`${qlId}/${index}: derivation has fewer than three explicit steps.`);
    if (first.explanation.optionAnalysis.length !== 4 || first.options.length !== 4) throw new Error(`${qlId}/${index}: four-option editorial schema failed.`);
    schemaChecks += 4;

    const learnerText = [
      first.stem,
      ...first.options,
      first.explanation.coreConcept,
      ...first.explanation.stepByStepSolution,
      first.explanation.examSpeedShortcut,
      ...first.explanation.optionAnalysis,
    ].join("\n");
    if (!first.stem.includes("$") || !first.options.every((option) => option.includes("$"))) {
      throw new Error(`${qlId}/${index}: question or options are not MathJax-ready.`);
    }
    if (!first.explanation.coreConcept.includes("$$")) throw new Error(`${qlId}/${index}: core formula is not display-MathJax-ready.`);
    if (!first.explanation.stepByStepSolution.some((step) => /\\times|\\div|\\frac|=₹/u.test(step))) {
      throw new Error(`${qlId}/${index}: worked solution contains a black-box arithmetic jump.`);
    }
    if (/\bRule\b|Worked solution|Wrong-option analysis|Verification:/u.test(learnerText)) {
      throw new Error(`${qlId}/${index}: legacy schema or redundant verification boilerplate leaked.`);
    }
    if (/INT-QL-|INT-CP003|prototype|effectiveSeed|generationAttempts/iu.test(learnerText)) {
      throw new Error(`${qlId}/${index}: learner-facing internal identity leak.`);
    }
    if (/₹\d+\/\d+|\b\d+\/\d+ years?\b/u.test(learnerText)) {
      throw new Error(`${qlId}/${index}: raw fractional money/time leaked instead of an exam-style decimal display.`);
    }
    mathJaxChecks += 6;
    derivationChecks += first.explanation.stepByStepSolution.length;

    first.options.forEach((option, optionIndex) => {
      const analysis = first.explanation.optionAnalysis[optionIndex]!;
      if (!analysis.includes(option)) throw new Error(`${qlId}/${index}: analysis ${optionIndex + 1} does not name its own option.`);
      optionAlignmentChecks += 1;
      if (optionIndex !== first.correctIndex) {
        if (!/\[[A-Z0-9_]+_TRAP\]/u.test(analysis)) throw new Error(`${qlId}/${index}: option ${optionIndex + 1} lacks a diagnostic trap tag.`);
        trapTagChecks += 1;
      }
    });

    if (
      first.questionStudioDiscoverable
      || first.questionBankStatus !== "NOT_STORED"
      || first.testEligibility !== "INELIGIBLE"
      || first.publiclyPublishable
    ) throw new Error(`${qlId}/${index}: staging lock failed.`);
    lifecycleChecks += 4;
    stems.add(first.stem);
  }
}

if (stems.size < 300) throw new Error(`Editorial stem diversity is insufficient: ${stems.size}/300.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-annual-compound-completion");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "EDITORIAL_REMEDIATION_VALIDATED_STAGING_LOCKED",
  qlRange: "INT-QL-053..INT-QL-066",
  qlCount: INT_CP003_QL_IDS.length,
  editorialQuestions,
  deterministicChecks,
  schemaChecks,
  mathJaxChecks,
  derivationChecks,
  optionAlignmentChecks,
  trapTagChecks,
  lifecycleChecks,
  distinctEditorialStems: stems.size,
  requiredSchema: [
    "CORE_CONCEPT",
    "STEP_BY_STEP_SOLUTION",
    "EXAM_SPEED_SHORTCUT",
    "COMMON_STUDENT_TRAPS_AND_OPTION_ANALYSIS",
  ],
  lifecycle: {
    stagingStatus: "NOT_STAGED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(join(outputDirectory, "int-cp003-editorial-remediation-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_EDITORIAL_REMEDIATION");
