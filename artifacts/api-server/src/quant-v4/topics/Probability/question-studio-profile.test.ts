import { generateQuestion, listQuantV4Packages } from "../../generation-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const packages = listQuantV4Packages();
  for (const packageId of ["PRB-001", "PRB-002"] as const) {
    const definition = packages.find((item: any) => item.packageId === packageId) as any;
    assert(definition, `${packageId} is missing from Question Studio.`);
    assert(definition.supportedExamProfiles?.includes("SSC_CGL_CHSL"), `${packageId} is missing SSC profile metadata.`);
    assert(definition.supportedExamProfiles?.includes("BANKING_MAINS"), `${packageId} is missing banking profile metadata.`);
    assert(definition.optionCountByExamProfile?.SSC_CGL_CHSL === 4, `${packageId} SSC option count is incorrect.`);
    assert(definition.optionCountByExamProfile?.BANKING_MAINS === 5, `${packageId} banking option count is incorrect.`);
    assert(definition.runtimeMode === "ENGLISH_MOCK_READY", `${packageId} runtime mode is not English mock-ready.`);
    assert(definition.reviewStatus === "APPROVED_EDITORIAL_ENGLISH", `${packageId} review status is not approved.`);
    assert(definition.questionBankStatus === "WRITABLE", `${packageId} Question Bank status is not writable.`);
    assert(definition.testEligibility === "ELIGIBLE_WITH_FAMILY_LIMIT", `${packageId} test eligibility is incorrect.`);
    assert(definition.publiclyPublishable === false, `${packageId} must remain blocked from public publication.`);
    assert(definition.freezeStatus === "ENGLISH_MOCK_READY", `${packageId} freeze status is incorrect.`);
    assert(definition.maxPerMockPerFamily === 1, `${packageId} family limit is not enforced.`);
  }

  const ssc = await generateQuestion({
    packageId: "PRB-001",
    cpId: "PRB-CP-003",
    examProfile: "SSC_CGL_CHSL",
    count: 3,
    seed: "question-studio:ssc",
  } as any);
  const bank = await generateQuestion({
    packageId: "PRB-002",
    cpId: "PRB-CP-008",
    examProfile: "BANKING_MAINS",
    count: 3,
    seed: "question-studio:bank",
  } as any);
  const bankHard = await generateQuestion({
    packageId: "PRB-002",
    examProfile: "BANKING_MAINS",
    difficulty: "Hard",
    count: 10,
    seed: "question-studio:bank-hard",
  } as any);

  assert(ssc.questionPackages.length === 3, "SSC Question Studio batch size is incorrect.");
  assert(bank.questionPackages.length === 3, "Banking Question Studio batch size is incorrect.");
  assert(bankHard.questionPackages.length === 10, "Banking Mains hard-pool batch size is incorrect.");
  for (const [label, batch] of [["SSC", ssc], ["Banking", bank]] as const) {
    const context = batch.generationContext as any;
    assert(context.runtimeMode === "ENGLISH_MOCK_READY", `${label} generation context is not English mock-ready.`);
    assert(context.reviewStatus === "APPROVED_EDITORIAL_ENGLISH", `${label} generation context is not approved.`);
    assert(context.questionBankStatus === "WRITABLE", `${label} generation context is not writable.`);
    assert(context.testEligibility === "ELIGIBLE_WITH_FAMILY_LIMIT", `${label} generation context eligibility is incorrect.`);
    assert(context.publiclyPublishable === false, `${label} generation context must remain non-public.`);
    assert(context.freezeStatus === "ENGLISH_MOCK_READY", `${label} generation context freeze status is incorrect.`);
    assert(context.maxPerMockPerFamily === 1, `${label} generation context family limit is incorrect.`);
  }
  assert(
    ssc.questionPackages.every(
      (item: any) =>
        item.examProfile === "SSC_CGL_CHSL" &&
        item.options.length === 4 &&
        item.validation.valid &&
        item.traceability.testEligibility !== "INELIGIBLE",
    ),
    "SSC Question Studio profile routing failed.",
  );
  assert(
    bank.questionPackages.every(
      (item: any) =>
        item.examProfile === "BANKING_MAINS" &&
        item.options.length === 5 &&
        item.validation.valid &&
        item.traceability.testEligibility !== "INELIGIBLE",
    ),
    "Banking Question Studio profile routing failed.",
  );
  assert(
    bankHard.questionPackages.every(
      (item: any) =>
        item.examProfile === "BANKING_MAINS" &&
        item.difficultyBand === "Hard" &&
        item.taskKind === "BANKING_MAINS_PROBABILITY_CHALLENGE" &&
        item.options.length === 5 &&
        item.validation.valid &&
        item.traceability.testEligibility === "ELIGIBLE_WITH_FAMILY_LIMIT",
    ),
    "Banking Mains genuine-hard routing failed.",
  );
  assert(
    new Set(bankHard.questionPackages.map((item: any) => item.questionLanguageId)).size === 10,
    "Banking Mains hard batch must use ten distinct challenge families before repeating.",
  );

  console.log(JSON.stringify({
    packages: packages
      .filter((item: any) => item.packageId === "PRB-001" || item.packageId === "PRB-002")
      .map((item: any) => ({ packageId: item.packageId, profiles: item.supportedExamProfiles })),
    sscQuestions: ssc.questionPackages.length,
    bankingQuestions: bank.questionPackages.length,
    bankingMainsHardQuestions: bankHard.questionPackages.length,
    bankingMainsHardFamilies: new Set(bankHard.questionPackages.map((item: any) => item.questionLanguageId)).size,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
