import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import { TRG_001_AUTHORITY_ALIGNED_IDS, authorityFamilyForTrg001Ql } from "./production-authority-runtime";
import {
  TRG_001_AUDIT_REMEDIATED_IDS,
  generateAllAuditRemediatedTrg001Questions,
  generateAuditRemediatedTrg001Question,
} from "./production-audit-remediated-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const d = toDegrees(answer.value);
  return `A:${d.numerator}/${d.denominator}`;
}

const expected = [
  "TRG-001-QL-048","TRG-001-QL-112","TRG-001-QL-122","TRG-001-QL-123","TRG-001-QL-125",
  "TRG-001-QL-126","TRG-001-QL-136","TRG-001-QL-137","TRG-001-QL-142",
];
assert(JSON.stringify(TRG_001_AUDIT_REMEDIATED_IDS) === JSON.stringify(expected), "Unexpected remediation ID set.");

const canonicalSeeds = Array.from({ length: 12 }, (_, i) => `trg-audit-remediation-${String(i + 1).padStart(2, "0")}`);
let canonicalCases = 0;
for (const qlId of TRG_001_AUTHORITY_ALIGNED_IDS) {
  for (const seed of canonicalSeeds) {
    const q = generateAuditRemediatedTrg001Question(qlId, seed);
    assert(q.qlId === qlId, `${qlId} lost permanent ID.`);
    assert(q.authorityAlignment?.family === authorityFamilyForTrg001Ql(qlId), `${qlId} lost authority family.`);
    assert(q.validation?.valid === true && q.verification?.valid === true, `${qlId} failed validation/verification for ${seed}.`);
    assert(q.options.length === 4 && q.options.filter((o: any) => o.isCorrect).length === 1, `${qlId} option cardinality failed.`);
    assert(new Set(q.options.map((o: any) => answerKey(o.value))).size === 4, `${qlId} has equivalent options.`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${qlId} correctIndex failed.`);
    const floor = q.difficulty === "Hard" ? 3 : q.difficulty === "Medium" ? 2 : 1;
    assert(q.explanation.steps.length >= floor, `${qlId} explanation depth is below ${q.difficulty} floor.`);
    assert(q.reviewStatus === "UNREVIEWED" && q.aiEditorialStatus === "PENDING" && q.humanReviewStatus === "PENDING", `${qlId} review lock changed prematurely.`);
    assert(q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable && !q.questionStudioDiscoverable, `${qlId} activation lock failed.`);
    canonicalCases += 1;
  }
}

for (const seed of canonicalSeeds) {
  const q112 = generateAuditRemediatedTrg001Question("TRG-001-QL-112", seed);
  assert(q112.difficulty === "Hard" && q112.explanation.steps.length >= 3, "QL-112 blocker regressed.");
  const q137 = generateAuditRemediatedTrg001Question("TRG-001-QL-137", seed);
  assert(q137.difficulty === "Medium" && q137.explanation.steps.length >= 2, "QL-137 blocker/difficulty remediation regressed.");
  const q48 = generateAuditRemediatedTrg001Question("TRG-001-QL-048", seed);
  assert(q48.solveMode === "identifyDefinedStandardDomainValue" && q48.answer === "cosec 90°", "QL-048 domain-comparison remediation regressed.");
  const q142 = generateAuditRemediatedTrg001Question("TRG-001-QL-142", seed);
  assert(q142.difficulty === "Hard" && q142.explanation.steps.length >= 3, "QL-142 composite role weakened.");
  assert(q142.verification.method === "COMPOSITE_EQUIVALENCE_VERIFICATION", "QL-142 verification role changed unexpectedly.");
}

for (const qlId of ["TRG-001-QL-122","TRG-001-QL-123","TRG-001-QL-125","TRG-001-QL-126"]) {
  const modes = canonicalSeeds.map((seed) => generateAuditRemediatedTrg001Question(qlId, seed).solveMode);
  assert(modes.every((mode) => !/AngleSum|AngleDifference|DoubleAngle|SeventyFive|Fifteen/i.test(mode)), `${qlId} leaked into angle-sum/double-angle semantics.`);
  assert(new Set(modes).size >= 2, `${qlId} lacks meaningful mathematical variants.`);
}

for (const qlId of ["TRG-001-QL-136","TRG-001-QL-137"]) {
  const variants = canonicalSeeds.map((seed) => generateAuditRemediatedTrg001Question(qlId, seed));
  assert(variants.every((q) => q.difficulty === "Medium"), `${qlId} difficulty calibration regressed.`);
  assert(new Set(variants.map((q) => q.solveMode)).size >= 2, `${qlId} lacks mathematical-state diversity.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, i) => `trg-audit-remediation-sweep-${String(i + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllAuditRemediatedTrg001Questions(seed);
  assert(questions.length === 144, `${seed} did not generate 144 QLs.`);
  for (const q of questions) {
    assert(q.validation?.valid === true && q.verification?.valid === true, `${q.qlId} failed sweep for ${seed}.`);
    assert(q.options.length === 4 && new Set(q.options.map((o: any) => answerKey(o.value))).size === 4, `${q.qlId} option integrity failed for ${seed}.`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${q.qlId} correctIndex failed for ${seed}.`);
    assert(q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable && !q.questionStudioDiscoverable, `${q.qlId} activation lock failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 audit remediation target: 144 QLs, ${canonicalCases} canonical cases, ${sweepCases} sweep cases, ${TRG_001_AUDIT_REMEDIATED_IDS.length} remediated IDs.`);
