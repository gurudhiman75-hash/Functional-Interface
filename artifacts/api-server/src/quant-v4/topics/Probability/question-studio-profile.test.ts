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
  }

  const ssc = await generateQuestion({ packageId: "PRB-001", cpId: "PRB-CP-003", examProfile: "SSC_CGL_CHSL", count: 3, seed: "question-studio:ssc" } as any);
  const bank = await generateQuestion({ packageId: "PRB-002", cpId: "PRB-CP-008", examProfile: "BANKING_MAINS", count: 3, seed: "question-studio:bank" } as any);

  assert(ssc.questionPackages.length === 3, "SSC Question Studio batch size is incorrect.");
  assert(bank.questionPackages.length === 3, "Banking Question Studio batch size is incorrect.");
  assert(ssc.questionPackages.every((item: any) => item.examProfile === "SSC_CGL_CHSL" && item.options.length === 4 && item.validation.valid), "SSC Question Studio profile routing failed.");
  assert(bank.questionPackages.every((item: any) => item.examProfile === "BANKING_MAINS" && item.options.length === 5 && item.validation.valid), "Banking Question Studio profile routing failed.");

  console.log(JSON.stringify({
    packages: packages.filter((item: any) => item.packageId === "PRB-001" || item.packageId === "PRB-002").map((item: any) => ({ packageId: item.packageId, profiles: item.supportedExamProfiles })),
    sscQuestions: ssc.questionPackages.length,
    bankingQuestions: bank.questionPackages.length,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
