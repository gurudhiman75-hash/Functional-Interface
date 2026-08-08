import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { parseNumericLiteral, sameDisplayedValue, subtract, type Rat } from "./exact";
import { generateSapCp003Package } from "./editorial-runtime";
import {
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
} from "./permanent-runtime/runtime";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "./types";

const TARGETS: Readonly<Record<SapCp003PrototypeId, number>> = Object.freeze(
  Object.fromEntries(SAP_CP003_PROTOTYPE_IDS.map((prototypeId, index) => [prototypeId, index < 15 ? 16 : 15])) as Record<SapCp003PrototypeId, number>,
);

const FAMILY_LABELS: Readonly<Record<SapCp003PrototypeId, string>> = Object.freeze({
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": "terminating-decimal BODMAS",
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": "mixed decimal–fraction evaluation",
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": "decimal multiplication and place value",
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": "power-of-ten decimal shift",
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": "compatible decimal division",
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": "percentage-factor conversion",
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": "percentage-of scope control",
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": "three-representation exact arithmetic",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": "fraction-target representation switching",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": "decimal-target representation switching",
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": "benchmark fraction–decimal equivalence",
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": "recurring-decimal exact conversion",
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": "complementary-percentage reasoning",
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": "successive percentage factors",
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": "missing decimal inverse operation",
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": "missing percentage reverse calculation",
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": "cross-representation comparison",
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": "decimal-placement diagnosis",
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": "first-error diagnosis",
});

function selectReviewPackages(): readonly SapCp003Package[] {
  const packages: SapCp003Package[] = [];
  const payloads = new Set<string>();
  const identities = new Set<string>();
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    const target = TARGETS[prototypeId];
    let accepted = 0;
    let seed = 1;
    while (accepted < target && seed <= 20_000) {
      const pkg = generateSapCp003Package(prototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok || payloads.has(pkg.canonicalPayloadKey)) continue;
      if (identities.has(pkg.generationIdentity)) throw new Error(`Duplicate generation identity ${pkg.generationIdentity}.`);
      payloads.add(pkg.canonicalPayloadKey);
      identities.add(pkg.generationIdentity);
      packages.push(pkg);
      accepted += 1;
    }
    if (accepted !== target) throw new Error(`${prototypeId} produced ${accepted} review packages; ${target} required.`);
  }
  if (packages.length !== 300) throw new Error(`Expected 300 packages, received ${packages.length}.`);
  return Object.freeze(packages);
}

function representationCount(stem: string): number {
  return [/%/, /\d+\/\d+/, /\d+\.\d+/, /recurring/i].filter((pattern) => pattern.test(stem)).length;
}

function difficultyRationale(pkg: SapCp003Package): string {
  const family = FAMILY_LABELS[pkg.prototypeId];
  const stepCount = pkg.explanation.steps.length;
  const representations = representationCount(pkg.stem);
  const bracketDemand = pkg.stem.includes("(") ? "one visible bracket/scope decision" : "no nested bracket";
  const inverseOrDiagnosis = pkg.taskDirection === "INVERSE"
    ? " The student must reverse the displayed operation and verify the recovered value."
    : pkg.taskDirection === "DIAGNOSIS"
      ? " The student must inspect equalities in order and stop at the first value-changing step."
      : pkg.taskDirection === "COMPARISON"
        ? " The student must decide whether the displayed bases permit a valid comparison."
        : "";
  if (pkg.difficulty === "EASY") {
    return `This ${family} item has ${stepCount} short solution step${stepCount === 1 ? "" : "s"}, ${bracketDemand}, and ${representations || 1} visible numeric representation type${representations === 1 ? "" : "s"}. The main risk is one familiar conversion, sign or place-value mistake.${inverseOrDiagnosis}`;
  }
  if (pkg.difficulty === "HARD") {
    return `This ${family} item requires ${stepCount} linked solution steps, ${bracketDemand}, and ${representations || 1} representation type${representations === 1 ? "" : "s"}. Multiple scope/conversion decisions must remain exact under timed conditions.${inverseOrDiagnosis}`;
  }
  return `This ${family} item requires ${stepCount} linked solution steps, ${bracketDemand}, and ${representations || 1} representation type${representations === 1 ? "" : "s"}. The numbers remain compatible, but at least two deliberate operations or conversions are required.${inverseOrDiagnosis}`;
}

function editorialDecision(pkg: SapCp003Package): string {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  if (policy.mockUse === "FOUNDATION_ONLY") return "CONTROLLED_ACCEPT — FOUNDATION/DIAGNOSTIC POOL ONLY";
  if (policy.mockUse === "SSC_ELIGIBLE") return "APPROVED — SSC CHAPTER TEST / LOW MIXED-MOCK WEIGHT";
  if (policy.mockUse === "SSC_AND_BANKING_ELIGIBLE") return "APPROVED — SSC AND BANKING PRELIMS POOLS";
  return "HOLD — REMEDIATION REQUIRED";
}

function examLikeness(pkg: SapCp003Package): string {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  if (policy.mockUse === "FOUNDATION_ONLY") {
    return "Useful as a concept-builder or error-diagnosis item, but intentionally excluded from ordinary mixed mocks.";
  }
  if (policy.mockUse === "SSC_ELIGIBLE") {
    return "Approved for SSC chapter practice and controlled mock use; use the policy weight to avoid over-representing a narrow skill.";
  }
  return "Approved for SSC and banking-prelims simplification practice under the documented mock-weight guidance.";
}

function numeric(value: Rat): number {
  return Number(value.n) / Number(value.d);
}

function isCrediblyClose(correct: Rat, option: Rat): boolean {
  const correctNumber = numeric(correct);
  const difference = Math.abs(numeric(subtract(option, correct)));
  const allowance = Math.max(Math.abs(correctNumber) * 0.5, Math.abs(correctNumber) < 1 ? 0.1 : 0.5);
  return difference <= allowance;
}

function optionQuality(pkg: SapCp003Package): string {
  const wrongs = pkg.options.filter((option) => !option.isCorrect);
  const bound = wrongs.filter((option) => Boolean(option.misconceptionId)).length;
  let equivalentPairs = 0;
  for (let left = 0; left < pkg.options.length; left += 1) {
    for (let right = left + 1; right < pkg.options.length; right += 1) {
      if (sameDisplayedValue(pkg.options[left]!.value, pkg.options[right]!.value)) equivalentPairs += 1;
    }
  }
  const correct = parseNumericLiteral(pkg.canonicalAnswer);
  const closeDistractors = correct
    ? wrongs
      .map((option) => parseNumericLiteral(option.value))
      .filter((value): value is Rat => Boolean(value))
      .filter((value) => isCrediblyClose(correct, value)).length
    : null;
  const proximity = closeDistractors === null
    ? "proximity is not applicable to this relation/diagnosis option set"
    : `${closeDistractors}/3 distractors lie within the defined credible magnitude band`;
  return `${bound}/3 distractors are misconception-bound; ${proximity}; ${equivalentPairs} numerically equivalent option pairs; answer position is deterministically shuffled.`;
}

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-003-300-FULL-EDITORIAL-REVIEW-V3.md");
const packages = selectReviewPackages();
const labels = ["A", "B", "C", "D"] as const;
const lines: string[] = [
  "# SAP-CP-003 — Full 300-Question Editorial Review V3",
  "",
  "**Checkpoint:** Decimals, Percentages and Exact Representation Switching  ",
  "**Permanent QLs:** SAP-QL-034 through SAP-QL-052  ",
  "**Status:** Human editorial review approved on 2026-08-08  ",
  "**Approval authority:** Product owner  ",
  "**Lifecycle:** Inactive; Question Studio, question-bank writes, test eligibility and publication remain disabled pending separate authorisation  ",
  "",
  "This file records the exact V3 question surface approved after full review. It includes the complete student explanation, every distractor route, question-specific difficulty reasoning, option-proximity evidence, exam-likeness guidance and the approved editorial decision.",
  "",
  "## Corpus summary",
  "",
  `- Questions: ${packages.length}`,
  `- Unique payloads: ${new Set(packages.map((pkg) => pkg.canonicalPayloadKey)).size}`,
  `- Easy / Medium / Hard: ${packages.filter((pkg) => pkg.difficulty === "EASY").length} / ${packages.filter((pkg) => pkg.difficulty === "MEDIUM").length} / ${packages.filter((pkg) => pkg.difficulty === "HARD").length}`,
  `- Foundation only: ${packages.filter((pkg) => SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId].mockUse === "FOUNDATION_ONLY").length}`,
  `- SSC eligible: ${packages.filter((pkg) => SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId].mockUse === "SSC_ELIGIBLE").length}`,
  `- SSC and banking eligible: ${packages.filter((pkg) => SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId].mockUse === "SSC_AND_BANKING_ELIGIBLE").length}`,
  "",
  "---",
  "",
];

packages.forEach((pkg, index) => {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  const qlId = SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[pkg.prototypeId];
  const questionId = `SAP-CP003-V3-REV-${String(index + 1).padStart(3, "0")}`;
  lines.push(
    `## ${questionId} — ${qlId}`,
    "",
    `**Prototype:** ${pkg.prototypeId}  `,
    `**Difficulty:** ${pkg.difficulty} (${pkg.difficultyScore}/10)  `,
    `**Release tier:** ${policy.releaseTier}  `,
    `**Mock use:** ${policy.mockUse}  `,
    `**Editorial decision:** ${editorialDecision(pkg)}  `,
    "",
    "### Question",
    "",
    pkg.stem,
    "",
  );
  pkg.options.forEach((option, optionIndex) => lines.push(`${labels[optionIndex]}. ${option.value}`));
  lines.push(
    "",
    `**Correct answer:** ${labels[pkg.correctIndex]}. ${pkg.canonicalAnswer}`,
    "",
    "### Student explanation",
    "",
    `**Core concept and strategy:** ${pkg.explanation.coreConcept}`,
    "",
  );
  pkg.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
  lines.push("", `**Final answer:** ${pkg.explanation.finalAnswer}`, "", "### Distractor review", "");
  pkg.options.forEach((option, optionIndex) => {
    lines.push(
      `- **${labels[optionIndex]}. ${option.value}${option.isCorrect ? " — correct" : ""}:** ${option.analysis}`,
    );
  });
  lines.push(
    "",
    "### Editorial checks",
    "",
    `- **Difficulty rationale:** ${difficultyRationale(pkg)}`,
    `- **Option quality:** ${optionQuality(pkg)}`,
    `- **Exam likeness:** ${examLikeness(pkg)}`,
    `- **Pool guidance:** ${policy.mockWeightGuidance}`,
    `- **Human approval:** APPROVED — 2026-08-08`,
    "",
    "---",
    "",
  );
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_SAP_CP003_FULL_EDITORIAL_REVIEW_V3_APPROVED",
  outputPath,
  questionCount: packages.length,
  uniquePayloads: new Set(packages.map((pkg) => pkg.canonicalPayloadKey)).size,
  prototypeCount: new Set(packages.map((pkg) => pkg.prototypeId)).size,
  explanations: packages.filter((pkg) => pkg.explanation.steps.length > 0).length,
  distractorAnalyses: packages.reduce((count, pkg) => count + pkg.options.filter((option) => !option.isCorrect && option.analysis.length > 0).length, 0),
  questionSpecificDifficultyRationales: packages.length,
  approvalAuthority: "PRODUCT_OWNER_APPROVED_2026_08_08",
  lifecycle: "INACTIVE_HUMAN_REVIEW_APPROVED_AWAITING_MERGE_AUTHORIZATION",
}, null, 2));
