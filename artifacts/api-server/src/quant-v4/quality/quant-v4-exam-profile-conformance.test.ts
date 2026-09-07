import { generateQuestion } from "../generation-engine";
import {
  QUANT_V4_EXAM_PROFILE_CONTRACTS,
  assertQuantV4OptionCount,
  getQuantV4OptionCount,
  type QuantV4ExamProfileId,
} from "../common/exam-profile";
import { generateDi001TableSet } from "../topics/DataInterpretation/DI-001";
import { generateDi002AdvancedTableSet } from "../topics/DataInterpretation/DI-002";
import { generateDi003GroupedBarSet } from "../topics/DataInterpretation/DI-003";
import { generateDi004LineSet } from "../topics/DataInterpretation/DI-004";
import { generateDi005PieSet } from "../topics/DataInterpretation/DI-005";
import { generateDi006CaseletSet } from "../topics/DataInterpretation/DI-006";
import { generateDi007MissingSet } from "../topics/DataInterpretation/DI-007";
import { generateDi008ArithmeticSet } from "../topics/DataInterpretation/DI-008";
import { generateBns001Question } from "../topics/SpeedMathematics/BankingNumberSeries/BNS-001";
import { generateQcp001Question } from "../representations/QuantityComparison/QCP-001";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertQuestionOptions(source: string, profile: QuantV4ExamProfileId, question: any): void {
  const options = Array.isArray(question?.options) ? question.options : [];
  const expected = getQuantV4OptionCount(profile);
  assertQuantV4OptionCount(profile, options.length, source);
  if (typeof question?.optionCount === "number") {
    assertQuantV4OptionCount(profile, question.optionCount, `${source} optionCount field`);
  }
  assert(new Set(options).size === expected, `${source} contains duplicate displayed options for ${profile}.`);
  assert(Number.isInteger(question?.correctIndex), `${source} has no integer correctIndex.`);
  assert(question.correctIndex >= 0 && question.correctIndex < expected, `${source} correctIndex is outside the ${expected}-option range.`);
}

function assertDiSet(source: string, profile: QuantV4ExamProfileId, set: any): number {
  assert(set.examProfile === profile, `${source} returned profile ${String(set.examProfile)} instead of ${profile}.`);
  assertQuantV4OptionCount(profile, set.optionCount, `${source} set`);
  assert(Array.isArray(set.questions) && set.questions.length > 0, `${source} returned no linked questions.`);
  set.questions.forEach((question: any, index: number) =>
    assertQuestionOptions(`${source} child ${index + 1}`, profile, question),
  );
  return set.questions.length;
}

async function auditProbabilityProfiles(): Promise<number> {
  const cases = [
    { packageId: "PRB-001", cpId: "PRB-CP-003", profile: "SSC_CGL_CHSL" },
    { packageId: "PRB-002", cpId: "PRB-CP-008", profile: "SSC_CGL_JSO" },
    { packageId: "PRB-001", cpId: "PRB-CP-003", profile: "BANKING_PRELIMS" },
    { packageId: "PRB-002", cpId: "PRB-CP-008", profile: "BANKING_MAINS" },
  ] as const;

  let checked = 0;
  for (const testCase of cases) {
    const batch = await generateQuestion({
      packageId: testCase.packageId,
      cpId: testCase.cpId,
      examProfile: testCase.profile,
      count: 12,
      seed: `exam-profile-conformance:${testCase.packageId}:${testCase.profile}`,
    } as any);
    const questions = Array.isArray((batch as any).questionPackages)
      ? (batch as any).questionPackages
      : Array.isArray((batch as any).questions)
        ? (batch as any).questions
        : [];
    assert(questions.length === 12, `${testCase.packageId}/${testCase.profile} returned ${questions.length} questions instead of 12.`);
    questions.forEach((question: any, index: number) => {
      assert(question.examProfile === testCase.profile, `${testCase.packageId}/${testCase.profile} item ${index + 1} lost exam-profile identity.`);
      assertQuestionOptions(`${testCase.packageId}/${testCase.profile} item ${index + 1}`, testCase.profile, question);
      checked += 1;
    });
  }
  return checked;
}

function auditDiProfiles(): number {
  const fourFiveGenerators = [
    ["DI-001", generateDi001TableSet],
    ["DI-002", generateDi002AdvancedTableSet],
    ["DI-003", generateDi003GroupedBarSet],
    ["DI-004", generateDi004LineSet],
    ["DI-005", generateDi005PieSet],
    ["DI-006", generateDi006CaseletSet],
  ] as const;
  const sscBankProfiles = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;
  let checked = 0;

  for (const [packageId, generate] of fourFiveGenerators) {
    for (const profile of sscBankProfiles) {
      for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
        const set = generate({ seed: `exam-profile:${packageId}:${profile}:${seedIndex}`, examProfile: profile } as any);
        checked += assertDiSet(`${packageId}/${profile}/seed-${seedIndex}`, profile, set);
      }
    }
  }

  const bankingOnlyGenerators = [
    ["DI-007", generateDi007MissingSet],
    ["DI-008", generateDi008ArithmeticSet],
  ] as const;
  const bankingProfiles = ["BANKING_PRELIMS", "BANKING_MAINS"] as const;
  for (const [packageId, generate] of bankingOnlyGenerators) {
    for (const profile of bankingProfiles) {
      for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
        const set = generate({ seed: `exam-profile:${packageId}:${profile}:${seedIndex}`, examProfile: profile } as any);
        checked += assertDiSet(`${packageId}/${profile}/seed-${seedIndex}`, profile, set);
      }
    }
  }

  return checked;
}

function auditBankingNumberSeries(): number {
  let checked = 0;
  for (let seedIndex = 1; seedIndex <= 50; seedIndex += 1) {
    const question = generateBns001Question({ seed: `exam-profile:BNS-001:${seedIndex}` });
    assert(question.examProfile === "BANKING_PRELIMS", `BNS-001 seed ${seedIndex} lost BANKING_PRELIMS ownership.`);
    assertQuestionOptions(`BNS-001 seed ${seedIndex}`, "BANKING_PRELIMS", question);
    checked += 1;
  }
  return checked;
}

function auditQuantityComparison(): number {
  let checked = 0;
  for (const profile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const) {
    for (let seedIndex = 1; seedIndex <= 50; seedIndex += 1) {
      const question = generateQcp001Question({ seed: `exam-profile:QCP-001:${seedIndex}`, examProfile: profile });
      assert(question.examProfile === profile, `QCP-001 ${profile} seed ${seedIndex} lost exam-profile ownership.`);
      assertQuestionOptions(`QCP-001 ${profile} seed ${seedIndex}`, profile, question);
      checked += 1;
    }
  }
  return checked;
}

async function main() {
  assert(QUANT_V4_EXAM_PROFILE_CONTRACTS.SSC_CGL_TIER_I.optionCount === 4, "SSC Tier I central option count drifted.");
  assert(QUANT_V4_EXAM_PROFILE_CONTRACTS.SSC_CGL_CHSL.optionCount === 4, "SSC CGL/CHSL central option count drifted.");
  assert(QUANT_V4_EXAM_PROFILE_CONTRACTS.SSC_CGL_JSO.optionCount === 4, "SSC JSO central option count drifted.");
  assert(QUANT_V4_EXAM_PROFILE_CONTRACTS.BANKING_PRELIMS.optionCount === 5, "Banking Prelims central option count drifted.");
  assert(QUANT_V4_EXAM_PROFILE_CONTRACTS.BANKING_MAINS.optionCount === 5, "Banking Mains central option count drifted.");
  assert(QUANT_V4_EXAM_PROFILE_CONTRACTS.GENERIC_PRACTICE.optionCount === 4, "Generic practice central option count drifted.");

  const probabilityQuestions = await auditProbabilityProfiles();
  const diQuestions = auditDiProfiles();
  const bnsQuestions = auditBankingNumberSeries();
  const quantityComparisonQuestions = auditQuantityComparison();

  console.log(JSON.stringify({
    status: "PASS_QUANT_V4_EXAM_PROFILE_CONFORMANCE_P0",
    centralProfiles: Object.keys(QUANT_V4_EXAM_PROFILE_CONTRACTS).length,
    probabilityQuestions,
    diQuestions,
    bnsQuestions,
    quantityComparisonQuestions,
    totalRuntimeQuestions: probabilityQuestions + diQuestions + bnsQuestions + quantityComparisonQuestions,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
