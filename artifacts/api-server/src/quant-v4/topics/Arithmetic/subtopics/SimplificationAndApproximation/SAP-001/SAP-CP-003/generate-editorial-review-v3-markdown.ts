import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { sameDisplayedValue } from "./exact";
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

function difficultyRationale(pkg: SapCp003Package): string {
  if (pkg.difficulty === "EASY") {
    return "One familiar conversion or inverse operation is sufficient; the arithmetic is short and the main risk is a basic sign or place-value error.";
  }
  if (pkg.difficulty === "HARD") {
    return "The item combines nested scope, several representations, a diagnostic decision or a multi-stage reverse calculation; at least three deliberate decisions are required.";
  }
  return "The item requires a representation switch or two linked operations, but the numbers remain compatible enough for an SSC-level timed solution.";
}

function editorialDecision(pkg: SapCp003Package): string {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  if (policy.mockUse === "FOUNDATION_ONLY") return "CONTROLLED_ACCEPT — FOUNDATION/DIAGNOSTIC POOL ONLY";
  if (policy.mockUse === "SSC_ELIGIBLE") return "EDITORIAL CANDIDATE — SSC CHAPTER TEST / LOW MIXED-MOCK WEIGHT";
  if (policy.mockUse === "SSC_AND_BANKING_ELIGIBLE") return "EDITORIAL CANDIDATE — SSC AND BANKING PRELIMS POOLS";
  return "HOLD — REMEDIATION REQUIRED";
}

function examLikeness(pkg: SapCp003Package): string {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  if (policy.mockUse === "FOUNDATION_ONLY") {
    return "Useful as a concept-builder or error-diagnosis item, but intentionally excluded from ordinary mixed mocks.";
  }
  if (policy.mockUse === "SSC_ELIGIBLE") {
    return "Suitable for SSC chapter practice and controlled mock use; use the policy weight to avoid over-representing a narrow skill.";
  }
  return "Suitable as a candidate for SSC and banking-prelims simplification practice, subject to final human review of wording and local option realism.";
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
  return `${bound}/3 distractors are misconception-bound; ${equivalentPairs} numerically equivalent option pairs; answer position is deterministically shuffled.`;
}

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-003-300-FULL-EDITORIAL-REVIEW-V3.md");
const packages = selectReviewPackages();
const labels = ["A", "B", "C", "D"] as const;
const lines: string[] = [
  "# SAP-CP-003 — Full 300-Question Editorial Review V3",
  "",
  "**Checkpoint:** Decimals, Percentages and Exact Representation Switching  ",
  "**Permanent QLs:** SAP-QL-034 through SAP-QL-052  ",
  "**Status:** Automated editorial-remediation candidate; human review pending  ",
  "**Lifecycle:** Inactive; Question Studio, question-bank writes, test eligibility and publication remain disabled  ",
  "",
  "This file reviews the exact current V3 question surface. It includes the complete student explanation, every distractor route, difficulty reasoning, exam-likeness guidance and a provisional editorial decision. The decisions are evidence for human review, not a declaration of approval.",
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
    `- **Human approval:** PENDING`,
    "",
    "---",
    "",
  );
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_SAP_CP003_FULL_EDITORIAL_REVIEW_V3",
  outputPath,
  questionCount: packages.length,
  uniquePayloads: new Set(packages.map((pkg) => pkg.canonicalPayloadKey)).size,
  prototypeCount: new Set(packages.map((pkg) => pkg.prototypeId)).size,
  explanations: packages.filter((pkg) => pkg.explanation.steps.length > 0).length,
  distractorAnalyses: packages.reduce((count, pkg) => count + pkg.options.filter((option) => !option.isCorrect && option.analysis.length > 0).length, 0),
  lifecycle: "INACTIVE_HUMAN_REVIEW_PENDING",
}, null, 2));
