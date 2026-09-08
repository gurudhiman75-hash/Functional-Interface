import {
  generateStat001Question,
  independentlyVerifyStat001Question,
  STAT001_CONTRACTS,
  type Stat001ContractId,
  type Stat001ExamProfile,
} from "./index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles: readonly Stat001ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const contract: Stat001ContractId = "STAT-TEMP-001-SIMPLE-MEAN";
assert(STAT001_CONTRACTS.includes(contract), "Canonical STAT001 contract registry lost the simple-mean contract.");

for (const profile of profiles) {
  const question = generateStat001Question({
    seed: `STAT-001-API-${profile}`,
    examProfile: profile,
    contractId: contract,
  });
  assert(question.packageId === "STAT-001", `${profile} lost STAT-001 package identity.`);
  assert(question.examProfile === profile, `${profile} changed exam profile through canonical API.`);
  assert(question.options.length === 4, `${profile} canonical API changed SSC option count.`);
  assert(independentlyVerifyStat001Question(question), `${profile} failed independent verification through canonical API.`);
}

console.log(JSON.stringify({
  status: "PASS_STAT_001_CANONICAL_API",
  packageId: "STAT-001",
  profiles,
  contractCount: STAT001_CONTRACTS.length,
}));
